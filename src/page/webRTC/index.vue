<script setup lang="ts">
import { ElMessage } from 'element-plus'

const formParams = reactive({
  data: {
    audioInput: '',
    audioOutput: '',
    videoInput: '',
  },
  // 表单数据对象
  formList: {
    videoInput: {
      type: 'select',
      label: '视频输入设备切换',
      options: [] as MediaDeviceInfo[],
      optionValueKey: 'deviceId',
      optionLabelKey: 'label',
      onChange: (deviceId: string) => {
        handleVideoInputChange(deviceId)
      },
    },
    audioInput: {
      type: 'select',
      label: '音频输入设备切换',
      disabled: true,
      options: [] as MediaDeviceInfo[],
      optionValueKey: 'deviceId',
      optionLabelKey: 'label',
      onChange: (deviceId: string) => {
        handleDeviceChange(deviceId)
      },
    },
    audioOutput: {
      type: 'select',
      label: '音频输出设备切换',
      disabled: true,
      options: [] as MediaDeviceInfo[],
      optionValueKey: 'deviceId',
      optionLabelKey: 'label',
      onChange: (deviceId: string) => {
        handleDeviceChange(deviceId)
      },
    },
  },
  labelColor: '#000',
  inline: true,
  rules: [{ required: true, message: '请输入最大宽度', trigger: 'blur' }],
})

let localStream: MediaStream
let mediaRecorder: MediaRecorder

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
      formParams.formList.audioInput.options = devices.filter(
        (device) => device.kind === 'audioinput',
      )
      formParams.formList.audioOutput.options = devices.filter(
        (device) => device.kind === 'audiooutput',
      )
    })
    .catch(handleError)
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

function handleError(error: Error) {
  Error('error: ', error)
}

// 切换视频输入设备
async function handleVideoInputChange(deviceId: string) {
  localStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: { deviceId },
  })
  // 播放本地视频流
  playStream()
}

// 切换音视频输入输出设备
async function handleDeviceChange(deviceId: string) {
  localStream = await navigator.mediaDevices.getUserMedia({
    audio: { deviceId },
    video: true,
  })
  // 播放本地视频流
  playStream()
}

// 在视频标签中播放视频流
function playStream(stream: MediaStream = localStream) {
  const video = document.querySelector('#localVideo') as HTMLVideoElement
  video.srcObject = stream
  // 或者在 video 标签中添加 autoplay 属性
  video.onloadedmetadata = () => {
    video.play()
  }
}

// 分享屏幕
async function shareScreen() {
  localStream = await navigator.mediaDevices.getDisplayMedia({
    audio: true,
    video: true,
  })
  // 播放本地视频流
  playStream()
}

// 获取本地音视频流
async function getLocalStream() {
  localStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  })
  // 播放本地视频流
  playStream()
}
// 获取支持的媒体类型
function getSupportedMimeTypes() {
  const possibleTypes = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm;codecs=h264,opus',
    'video/mp4;codecs=h264,aac',
  ]
  return possibleTypes.filter((mimeType) => {
    return MediaRecorder.isTypeSupported(mimeType)
  })
}

const timer = ref(0)
function startRecord() {
  if (!localStream) {
    ElMessage.warning('请先获取本地音视频流')
    return
  }
  if (mediaRecorder) {
    mediaRecorder.stop()
    return
  }

  // 录制视频
  // MediaStreamRecorder 可以在 Chrome 上将音频录制为 WAV，将视频录制为 WebM 或动画 gif
  const options = {
    audioBitsPerSecond: 128000,
    videoBitsPerSecond: 2500000,
    // mimeType: 'video/mp4',
    // mimeType: 'image/gif',
  }
  mediaRecorder = new MediaRecorder(localStream, options)
  mediaRecorder.start()

  // 计时
  const timerId = setInterval(() => {
    timer.value++
  }, 1000)

  mediaRecorder.ondataavailable = (e) => {
    const blob = new Blob([e.data], { type: e.data.type })
    downloadBlob(blob)
  }
  mediaRecorder.onstop = (e: Event) => {
    timer.value = 0
    clearInterval(timerId)
  }
}

// 下载 Blob
function downloadBlob(blob: Blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${new Date().getTime()}.webm`
  a.click()
}

function stop() {}

onMounted(() => {
  getSupportedMimeTypes()
  getDevices()
  // getLocalStream()
  // shareScreen()
  // getDevices()
  // initConnect()
})
</script>
<template>
  <div class="webrtc-container">
    <div class="local-video">
      <video id="localVideo" autoplay playsinline muted></video>
    </div>
    <div class="control">
      <SuperForm :form-params="formParams" />
      <div>
        <el-button type="primary" size="default" @click="getLocalStream">
          打开摄像头
        </el-button>
        <el-button type="primary" size="default" @click="shareScreen">
          分享屏幕
        </el-button>
        <el-button
          :type="timer === 0 ? 'success' : 'warning'"
          @click="startRecord"
        >
          {{ timer === 0 ? ' 开始录制' : '暂停录制 | ' + timer }}
        </el-button>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.webrtc-container {
  height: 100%;
  display: flex;
  flex-direction: column;

  .control {
    height: 200px;
    box-sizing: border-box;
    background-color: #516fa3;
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .local-video {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    video {
      border: 4px dashed #374685;
      max-width: 100%;
      max-height: 600px;

      // 为了防止视频画幅巨大，超出屏幕，建议设置最大宽高
    }
  }
}
</style>
