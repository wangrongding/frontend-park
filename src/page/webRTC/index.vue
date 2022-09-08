<script setup lang="ts">
const state = reactive({
  devices: [] as MediaDeviceInfo[],
})

function start() {}
function stop() {}

// 获取所有音视频设备
function getDevices() {
  return navigator.mediaDevices.enumerateDevices()
}

onMounted(() => {
  getDevices().then((devices) => {
    state.devices = devices
  })
  // console.log('🦄🦄🦄', getDevices())
})
</script>
<template>
  <div class="webrtc-container">
    <div class="webrtc-video">
      <video ref="localVideo" autoplay playsinline></video>
    </div>
    <div class="webrtc-video">
      <video ref="remoteVideo" autoplay playsinline></video>
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
