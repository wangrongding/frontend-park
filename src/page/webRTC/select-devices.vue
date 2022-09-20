<script setup lang="ts">
const formParams = reactive({
  data: {
    audioInput: '',
    audioOutput: '',
    videoInput: '',
  }, // 表单数据对象
  formList: {
    audioInput: {
      type: 'select',
      label: '音频输入设备切换',
      placeholder: '请选择',
      disabled: true,
      options: [] as MediaDeviceInfo[],
      optionValueKey: 'deviceId',
      optionLabelKey: 'label',
      onChange: (deviceId: string) => {
        handleDeviceChange(deviceId, 'audioinput')
      },
    },
    audioOutput: {
      type: 'select',
      label: '音频输出设备切换',
      placeholder: '请选择',
      disabled: true,
      options: [] as MediaDeviceInfo[],
      optionValueKey: 'deviceId',
      optionLabelKey: 'label',
      onChange: (deviceId: string) => {
        handleDeviceChange(deviceId, 'audiooutput')
      },
    },
    videoInput: {
      type: 'select',
      label: '视频输入设备切换',
      placeholder: '请选择',
      options: [] as MediaDeviceInfo[],
      optionValueKey: 'deviceId',
      optionLabelKey: 'label',
      onChange: (deviceId: string) => {
        handleDeviceChange(deviceId, 'videoinput')
      },
    },
  },
  labelColor: '#000',
  inline: true,
  rules: [{ required: true, message: '请输入最大宽度', trigger: 'blur' }],
})

// 获取媒体数据
function getUserMedia(
  options: MediaStreamConstraints,
  cb: (stream: MediaStream) => void,
) {
  navigator.mediaDevices
    .getUserMedia(options)
    .then((stream) => {
      cb(stream)
    })
    .catch(handleError)
}

// 获取所有音视频设备
function getDevices() {
  navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      formParams.formList.videoInput.options = devices.filter(
        (device) => device.kind === 'videoinput',
      )
      formParams.formList.audioOutput.options = devices.filter(
        (device) => device.kind === 'audiooutput',
      )
      formParams.formList.audioInput.options = devices.filter(
        (device) => device.kind === 'audioinput',
      )
    })
    .catch(handleError)
}

function handleDeviceChange(
  deviceId: string,
  type: 'audioinput' | 'audiooutput' | 'videoinput',
) {
  getUserMedia(
    {
      video: {
        deviceId,
      },
      audio: {
        deviceId,
      },
    },
    (stream) => {
      const video = document.querySelector('video')!
      video.srcObject = stream
      video.onloadedmetadata = () => {
        video.play()
      }
    },
  )
}

// 创建新的视频
function createVideo(stream: MediaStream) {
  // 创建一个video标签
  const video = document.createElement('video')
  video.srcObject = stream
  video.onloadedmetadata = () => {
    video.play()
  }
  // 添加到页面
  document.body.appendChild(video)
}

// 在视频标签中播放视频流
function playStream(stream: MediaStream) {
  const video = document.querySelector('video')!
  video.srcObject = stream
  video.onloadedmetadata = () => {
    video.play()
  }
}

function handleError(error: Error) {
  Error('error: ', error)
}
onMounted(() => {
  getDevices()
  getUserMedia({ video: true, audio: true }, playStream)
})
const state = reactive({})
</script>
<template>
  <FilepathBox :file-path="'__filePath__'" />
  <div class="device-container">
    <SuperForm :form-params="formParams" />
    <div style="margin: 20px 0">
      可以更换你的视频输入,音频输入输出的设备(WIP)
    </div>
    <video id="video" playsinline autoplay muted></video>
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
