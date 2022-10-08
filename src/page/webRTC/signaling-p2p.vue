<script setup lang="ts">
import { ElMessage } from 'element-plus'
import io, { Socket } from 'socket.io-client'
// import VConsole from 'vconsole'

// const vConsole = new VConsole()
const state = reactive({
  peerConnection: new RTCPeerConnection(),
  // 创建一个空的本地媒体流
  localStream: new MediaStream(),
  // 创建一个空的远程媒体流
  remoteStream: new MediaStream(),
  offerSdp: '',
  answerSdp: '',
})

const peerConnection = new RTCPeerConnection()
let localStream: MediaStream
let remoteStream: MediaStream
const offerSdp = ref('')
const answerSdp = ref('')

let socket: Socket

const userId = getUuid()
// const roomId = '003'
const roomId = ref('')
function initConnect() {
  if (!roomId.value) {
    ElMessage.error('请输入房间号')
    return
  }
  // TODO 替换为公网地址
  // socket = io('http://192.168.1.126:3000')
  // socket = io('https://192.168.1.126:3000')
  socket = io('https://signaling.fedtop.com')
  // socket = io('https://signaling.fedtop.com/proxy')
  // socket = io('https://47.95.239.198:3000')
  // socket = io('node-park.vercel.app')
  // socket = io('https://node-park-wangrongding.vercel.app')
  socket.on('connect', () => {
    ElMessage.success('🦄🦄🦄连接成功')
    handleConnect()
  })
  // ========================================
  socket.on('disconnect', () => {})
  socket.on('welcome', (data) => {
    ElMessage.success(`${data.userId}加入房间`)
    // // 发送 offer
    // if (offerSdp.value) {
    //   socket.emit('offer', { userId, roomId:roomId.value, sdp: offerSdp.value })
    // }
  })
  socket.on('message', (data) => {})
  // 创建offer
  socket.on('createOffer', (data) => {
    // 发送 offer
    if (offerSdp.value) {
      socket.emit('offer', {
        userId,
        roomId: roomId.value,
        sdp: offerSdp.value,
      })
      return
    }
    createOffer()
  })
  // 收到offer
  socket.on('offer', (data) => {
    createAnswer(data.sdp)
  })
  // 收到answer
  socket.on('answer', (data) => {
    addAnswer(data.sdp)
  })
}

// 设置唯一标识
function getUuid() {
  // const uuid = sessionStorage.getItem('uuid')
  // if (uuid) {
  //   return uuid
  // }
  const newUuid = Math.random().toString(36).substring(2)
  // sessionStorage.setItem('uuid', newUuid)
  return newUuid
}
// 连接成功
function handleConnect() {
  socket.emit('join', { userId, roomId: roomId.value })
}
// 离开房间
function handleLeave() {
  socket.emit('leave', { userId, roomId: roomId.value })
}

const init = async () => {
  const localVideo = document.getElementById('local') as HTMLVideoElement
  const remoteVideo = document.getElementById(
    'remote-video',
  ) as HTMLVideoElement
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  })
  remoteStream = new MediaStream()
  localVideo.srcObject = localStream
  remoteVideo.srcObject = remoteStream

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream)
  })

  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track)
    })
  }
}

// 创建 offer
const createOffer = async () => {
  // 当一个新的offer ICE候选人被创建时触发事件
  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      offerSdp.value = JSON.stringify(peerConnection.localDescription)
      // 发送 offer
      if (offerSdp.value) {
        socket.emit('offer', {
          userId,
          roomId: roomId.value,
          sdp: offerSdp.value,
        })
      }
      // console.log('🚀🚀🚀createOffer', offer)
    }
  }
  const offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)
  // TODO
}
// 创建 answer
const createAnswer = async (offerSdp: string) => {
  const offer = JSON.parse(offerSdp)
  peerConnection.onicecandidate = async (event) => {
    // Event that fires off when a new answer ICE candidate is created
    if (event.candidate) {
      answerSdp.value = JSON.stringify(peerConnection.localDescription)
      // TODO
      socket.emit('answer', {
        userId,
        roomId: roomId.value,
        sdp: JSON.stringify(peerConnection.localDescription),
      })
    }
  }
  await peerConnection.setRemoteDescription(offer)
  const answer = await peerConnection.createAnswer()
  await peerConnection.setLocalDescription(answer)
}
// 添加 answer
const addAnswer = async (answerSdp: string) => {
  // console.log('Add answer triggerd')
  const answer = JSON.parse(answerSdp)
  if (!peerConnection.currentRemoteDescription) {
    peerConnection.setRemoteDescription(answer)
  }
}

onMounted(async () => {
  await init()
  // await initConnect()
  nextTick(async () => {})
})
</script>
<template>
  <FilepathBox :file-path="'__filePath__'" />
  <div class="signaling-p2p-container">
    <div class="video-container">
      <div class="main-video">
        <video
          id="remote-video"
          class="remote-video"
          autoplay
          playsinline
        ></video>
      </div>
      <div class="video-list">
        <video id="local" autoplay playsinline></video>
      </div>
    </div>
    <div class="operation">
      房间号：
      <el-input
        v-model="roomId"
        style="width: 150px; margin-right: 20px"
        placeholder="要加入的房间号"
        clearable
      ></el-input>

      <el-button type="primary" @click="initConnect">加入</el-button>
      <el-button type="danger" @click="handleLeave">离开</el-button>
      <el-button type="primary" @click="createOffer">关闭视频</el-button>
      <el-button type="primary" @click="createOffer">关闭音频</el-button>
      <!--   <el-button type="primary" @click="createAnswer(offerSdp)">
        创建answer
      </el-button>
      <el-button type="primary" @click="addAnswer">添加answer</el-button> -->
    </div>
  </div>
</template>
<style lang="scss" scoped>
.signaling-p2p-container {
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;

  .video-container {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 100%;

    video {
      margin: 0 auto;
      border: 4px solid #048ff2;
      background-color: #363739;
      border-radius: 30px;
      widows: 100%;
      height: 100%;
    }

    .main-video {
      flex: 1;
      height: 100%;
      border-radius: 30px;
      background-color: #3f4044;
    }

    .video-list {
      width: 300px;
      padding: 20px;
      height: 100%;
      background-color: #405982;

      video {
        width: 100%;
        height: 200px;
      }
    }
  }

  .operation {
    width: 100%;
    height: 100px;
    text-align: center;
    background-color: #405982;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
