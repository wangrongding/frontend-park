<script setup lang="ts">
import { ElMessage } from 'element-plus'
import io from 'socket.io-client'

const state = reactive({
  devices: [] as MediaDeviceInfo[],
})
// 连接socket
function initConnect() {
  // const socket = io('http://localhost:3000')
  const socket = io('http://192.168.1.126:3000')
  const userId = Math.random().toString(36).substring(2)
  const roomId = '001'
  socket.on('connect', () => {
    ElMessage.success('连接成功')
    socket.emit('join', { userId, roomId })
  })

  // ========================================
  socket.on('disconnect', () => {
    // console.log('disconnect')
  })
  socket.on('message', (data) => {
    // console.log(data)
  })
}

// 获取所有音视频设备
async function getDevices() {
  state.devices = await navigator.mediaDevices.enumerateDevices()
  return state.devices
}

// 分享屏幕
async function shareScreen() {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    audio: true,
    video: true,
  })
  playLocalStream(stream)
}

// 获取本地音视频流
async function getLocalStream() {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  })
  playLocalStream(stream)
}

// 播放本地视频流
function playLocalStream(stream: MediaStream) {
  const videoEl = document.getElementById('localVideo') as HTMLVideoElement
  videoEl.srcObject = stream
  videoEl.addEventListener('loadedmetadata', () => {})
}

function start() {}
function stop() {}

onMounted(() => {
  getLocalStream()
  // shareScreen()
  // getDevices()
  // initConnect()
})
</script>
<template>
  <div class="webrtc-container">
    <div class="webrtc-video">
      <video id="localVideo" autoplay playsinline muted></video>
    </div>
    <div class="webrtc-video">
      <video id="remoteVideo" autoplay playsinline></video>
    </div>
    <div class="webrtc-container__control">
      <button @click="start">Start</button>
      <button @click="stop">Stop</button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.webrtc-container {
  --rong: ding;
}
</style>
