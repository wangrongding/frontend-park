<script setup lang="ts">
const devicesList = reactive({
  audioInput: [] as MediaDeviceInfo[],
  audioOutput: [] as MediaDeviceInfo[],
  videoInput: [] as MediaDeviceInfo[],
})
function handleError(error: Error) {
  Error('navigator.MediaDevices.getUserMedia error: ', error)
}
function getUserMedia() {
  return navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true,
    })
    .then((stream) => {
      const video = document.querySelector('video')
      video!.srcObject = stream
      video!.onloadedmetadata = () => {
        video!.play()
      }
    })
    .catch(handleError)
}

function getDevices() {
  navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      devicesList.videoInput = devices.filter(
        (device) => device.kind === 'videoinput',
      )
      devicesList.audioOutput = devices.filter(
        (device) => device.kind === 'audiooutput',
      )
      devicesList.audioInput = devices.filter(
        (device) => device.kind === 'audioinput',
      )
    })
    .catch(handleError)
}

function handleDeviceChange(
  deviceId: string,
  type: 'audioinput' | 'audiooutput' | 'videoinput',
) {
  const video = document.querySelector('video')
  navigator.mediaDevices
    .getUserMedia({
      video: {
        deviceId,
      },
      audio: {
        deviceId,
      },
    })
    .then((stream) => {
      video!.srcObject = stream
      video!.onloadedmetadata = () => {
        video!.play()
      }
    })
    .catch(handleError)
}
onMounted(() => {
  getDevices()
  getUserMedia()
})
const state = reactive({})
</script>
<template>
  <div class="device-container">
    <div>
      <el-select
        value-key=""
        placeholder="选择视频输入设备"
        clearable
        filterable
        @change="
          (deviceId) => {
            handleDeviceChange(deviceId, 'videoinput')
          }
        "
      >
        <el-option
          v-for="item in devicesList.videoInput"
          :key="item.deviceId"
          :label="item.label"
          :value="item.deviceId"
        ></el-option>
      </el-select>
      <el-select
        value-key=""
        placeholder="选择音频输入设备"
        clearable
        filterable
        @change="
          (deviceId) => {
            handleDeviceChange(deviceId, 'audioinput')
          }
        "
      >
        <el-option
          v-for="item in devicesList.audioInput"
          :key="item.deviceId"
          :label="item.label"
          :value="item.deviceId"
        ></el-option>
      </el-select>
      <el-select
        value-key=""
        placeholder="选择音频输出设备"
        clearable
        filterable
        @change="
          (deviceId) => {
            handleDeviceChange(deviceId, 'audiooutput')
          }
        "
      >
        <el-option
          v-for="item in devicesList.audioOutput"
          :key="item.deviceId"
          :label="item.label"
          :value="item.deviceId"
        ></el-option>
      </el-select>
    </div>
    <div style="margin: 20px 0">可以更换你的视频输入,音频输入输出的设备</div>
    <video id="video" playsinline autoplay></video>
  </div>
</template>
<style lang="scss" scoped>
.device-container {
  margin: 20px;
  text-align: center;

  video {
    background: #222;
    margin: 0 0 20px;
    width: 800px;
  }
}
</style>
