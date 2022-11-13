<script setup lang="ts">
import { ElMessage } from 'element-plus'
import io, { Socket } from 'socket.io-client'
// import VConsole from 'vconsole'

// const vConsole = new VConsole()
const peerConnection = new RTCPeerConnection({
  iceServers: [
    {
      urls: 'stun:stun.voipbuster.com ',
    },
  ],
})

const userId = Math.random().toString(36).substring(2)
// const roomId = ref('3333')
const roomId = ref('')
let socket: Socket
let localStream: MediaStream
let remoteStream: MediaStream
let offerSdp = ''

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

  // 连接成功时触发
  socket.on('connect', () => {
    ElMessage.success('🦄🦄🦄连接成功')
    handleConnect()
  })
  // ========================================
  // 当有用户离开房间时触发
  socket.on('disconnect', () => {})
  // 当有用户加入房间时触发
  socket.on('welcome', (data) => {
    ElMessage.success(`${data.userId}加入房间`)
  })
  // 当有用户发送消息时触发
  socket.on('message', (data) => {})
  // 创建offer
  socket.on('createOffer', (data) => {
    // 发送 offer
    if (offerSdp) {
      socket.emit('offer', {
        userId,
        roomId: roomId.value,
        sdp: offerSdp,
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

// 连接成功
function handleConnect() {
  socket.emit('join', { userId, roomId: roomId.value })
}
// 离开房间
function handleLeave() {
  peerConnection.close()
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
async function createOffer() {
  // 当一个新的offer ICE候选人被创建时触发事件
  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      offerSdp = JSON.stringify(peerConnection.localDescription)
      // 发送 offer
      if (offerSdp) {
        socket.emit('offer', {
          userId,
          roomId: roomId.value,
          sdp: offerSdp,
        })
      }
    }
  }
  const offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)
}

// 创建 answer
async function createAnswer(val: string) {
  const offer = JSON.parse(val)
  peerConnection.onicecandidate = async (event) => {
    // 当一个新的 answer ICE candidate 被创建时
    if (event.candidate) {
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
async function addAnswer(answerSdp: string) {
  const answer = JSON.parse(answerSdp)
  if (!peerConnection.currentRemoteDescription) {
    peerConnection.setRemoteDescription(answer)
  }
}

// 打开、关闭摄像头
const isVideoOpen = ref(true)
function handleCamera() {
  localStream.getVideoTracks().forEach((track) => {
    track.stop()
  })
  isVideoOpen.value = !isVideoOpen.value
}

// // 关闭、关闭麦克风
// const isAudioOpen = ref(true)
// function handleMic() {
//   localStream.getAudioTracks().forEach((track) => {
//     track.stop()
//   })
//   isAudioOpen.value = !isAudioOpen.value
// }

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
        <div class="video-title">远程视频</div>
      </div>
      <div class="video-list">
        <div class="video-box">
          <video id="local" autoplay playsinline></video>
          <div class="video-title">我</div>
        </div>
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
      <el-button
        :type="isVideoOpen ? 'warning' : 'primary'"
        @click="handleCamera"
      >
        {{ isVideoOpen ? '关闭' : '打开' }}视频
      </el-button>
      <el-button type="danger" @click="handleLeave">离开</el-button>
      <!-- <el-button :type="isVideoOpen ? 'warning' : 'primary'" @click="handleMic">
        {{ isVideoOpen ? '关闭' : '打开' }}麦克风
      </el-button> -->
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
      widows: 100%;
      height: 100%;
    }

    .main-video {
      flex: 1;
      height: 100%;
      border-radius: 30px;
      background-color: #3f4044;
      position: relative;
    }

    .video-title {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: rgb(0 0 0 / 50%);
      color: #fff;
      text-align: center;
      padding: 5px 0;
    }

    .video-list {
      width: 300px;
      padding: 20px;
      height: 100%;
      background-color: #405982;

      .video-box {
        position: relative;
      }

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
