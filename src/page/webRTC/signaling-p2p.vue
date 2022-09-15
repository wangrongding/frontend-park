<script setup lang="ts">
import { ElMessage } from 'element-plus'
import io from 'socket.io-client'

const peerConnection = new RTCPeerConnection()
let localStream: MediaStream
let remoteStream: MediaStream

const offerSdp = ref('')
const answerSdp = ref('')

// 连接socket
function initConnect() {
  const socket = io('https://192.168.1.126:3000')
  const userId = Math.random().toString(36).substring(2)
  const roomId = '001'
  socket.on('connect', () => {
    ElMessage.success('连接成功')
    // console.log('🦄🦄🦄', '连接成功')
    socket.emit('join', { userId, roomId })
  })

  // ========================================
  socket.on('disconnect', () => {
    // console.log('disconnect')
  })
  socket.on('joined', (data) => {
    // console.log('joined', data)
  })
  socket.on('message', (data) => {
    // console.log(data)
  })
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

const createOffer = async () => {
  peerConnection.onicecandidate = async (event) => {
    // Event that fires off when a new offer ICE candidate is created
    if (event.candidate) {
      offerSdp.value = JSON.stringify(peerConnection.localDescription)
    }
  }
  const offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)
}

const createAnswer = async () => {
  const offer = JSON.parse(offerSdp.value)
  peerConnection.onicecandidate = async (event) => {
    // Event that fires off when a new answer ICE candidate is created
    if (event.candidate) {
      answerSdp.value = JSON.stringify(peerConnection.localDescription)
    }
  }
  await peerConnection.setRemoteDescription(offer)
  const answer = await peerConnection.createAnswer()
  await peerConnection.setLocalDescription(answer)
}

const addAnswer = async () => {
  // console.log('Add answer triggerd')
  const answer = JSON.parse(answerSdp.value)
  // console.log('answer:', answer)
  if (!peerConnection.currentRemoteDescription) {
    peerConnection.setRemoteDescription(answer)
  }
}

onMounted(() => {
  // eslint-disable-next-line
  console.clear()
  initConnect()
  init()
  setInterval(() => {
    // 刷新网页
  }, 10 * 1000)
})
</script>
<template>
  <FilepathBox :file-path="'__filePath__'" />
  <div class="page-container">
    <div class="video-container">
      <video
        id="remote-video"
        class="remote-video"
        autoplay
        playsinline
      ></video>
      <div class="video-list">
        <video id="local" autoplay playsinline></video>
      </div>
    </div>
    <div class="operation"></div>
  </div>
</template>
<style lang="scss" scoped>
.page-container {
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
      background-color: #516fa3;
      border-radius: 30px;
    }

    .remote-video {
      max-width: 100%;
      max-height: 100%;
      background-color: #516fa3;
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
    background-color: #405982;
  }
}
</style>
