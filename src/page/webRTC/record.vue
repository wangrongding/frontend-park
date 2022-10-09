<script setup lang="ts">
import { ElMessage } from 'element-plus'

const formParams = reactive({
  data: {
    audioInput: '',
    audioOutput: '',
    videoInput: '',
    videoMimeType: 'video/webm;codecs=vp9',
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
    videoMimeType: {
      type: 'select',
      label: '录制的视频格式',
      clearable: true,
      options: [] as any,
      onChange: (val: string) => {
        handleVideoMimeTypeChange(val)
      },
    },
  },
  labelColor: '#000',
  inline: true,
  rules: [{ required: true, message: '请输入最大宽度', trigger: 'blur' }],
})

let localStream: MediaStream
let mediaRecorder: MediaRecorder

// 当录制的视频 mimeType改变时
function handleVideoMimeTypeChange(val: string) {
  formParams.data.videoMimeType = val
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
async function getScreenStream() {
  localStream = await navigator.mediaDevices.getDisplayMedia({
    audio: {
      echoCancellation: true, // 回音消除
      noiseSuppression: true, // 噪音抑制
      autoGainControl: true, // 自动增益
    },
    video: {
      width: 1920, // 视频宽度
      height: 1080, // 视频高度
      frameRate: 60, // 帧率
      aspectRatio: 16 / 9, // 宽高比
    },
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
  const media = 'video'
  const types = [
    'webm',
    'mp4',
    'ogg',
    'mov',
    'avi',
    'wmv',
    'flv',
    'mkv',
    'ts',
    'x-matroska',
  ]
  const codecs = ['vp9', 'vp9.0', 'vp8', 'vp8.0', 'avc1', 'av1', 'h265', 'h264']
  // codecs: "should-not-be-supported","vp9", "vp9.0", "vp8", "vp8.0", "avc1", "av1", "h265", "h.265", "h264", "h.264", "opus", "pcm", "aac", "mpeg", "mp4a"
  const isSupported = MediaRecorder.isTypeSupported
  const supported: string[] = []
  types.forEach((type: string) => {
    const mimeType = `${media}/${type}`
    if (isSupported(mimeType)) supported.push(mimeType)
    codecs.forEach((codec: string) =>
      [
        `${mimeType};codecs=${codec}`,
        `${mimeType};codecs=${codec.toUpperCase()}`,
      ].forEach((variation) => {
        if (isSupported(variation)) supported.push(variation)
      }),
    )
  })
  // console.log('🚀🚀🚀 / supported', supported)
  formParams.formList.videoMimeType.options = supported.map((item) => ({
    label: item,
    value: item,
  }))
  return supported
}

const timer = ref(0)
const kbps = 1024
const Mbps = kbps * kbps

// 开始录制
function startRecord() {
  if (!localStream) {
    ElMessage.warning('请先获取本地音视频流')
    return
  }
  if (mediaRecorder?.state === 'recording') {
    mediaRecorder.stop()
    return
  }
  // console.log('🚀🚀🚀 / mediaRecorder', mediaRecorder)
  const options = {
    audioBitsPerSecond: 128000,
    videoBitsPerSecond: 2500000,
    mimeType: formParams.data.videoMimeType,
    // mimeType: 'video/webm; codecs="vp8,opus"',
    // bitsPerSecond: 2000 * Mbps,
  }
  const chunks: Blob[] = []
  let timerId: any
  mediaRecorder = new MediaRecorder(localStream, options)
  mediaRecorder.start()

  mediaRecorder.ondataavailable = (e) => {
    chunks.push(e.data)
  }

  mediaRecorder.onstart = () => {
    // 计时
    timerId = setInterval(() => {
      timer.value++
    }, 1000)
  }
  mediaRecorder.onstop = (e: Event) => {
    timer.value = 0
    clearInterval(timerId)
    // 将录制的数据合并成一个 Blob 对象
    // const blob = new Blob(chunks, { type: chunks[0].type })
    const blob = new Blob(chunks, { type: mediaRecorder?.mimeType })
    downloadBlob(blob)
    chunks.length = 0
  }
}

// 下载 Blob
function downloadBlob(blob: Blob) {
  // 将 Blob 对象转换成一个 URL 地址
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  // 设置 a 标签的 href 属性为刚刚生成的 URL 地址
  a.href = url
  // 设置 a 标签的 download 属性为文件名
  a.download = `${new Date().getTime()}.${
    blob.type.split('/')[1].split(';')[0]
  }`
  // 模拟点击 a 标签
  a.click()
  // 释放 URL 地址
  URL.revokeObjectURL(url)
}

onMounted(() => {
  getSupportedMimeTypes()
  getDevices()
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
        <el-button type="primary" size="default" @click="getScreenStream">
          分享屏幕
        </el-button>
        <el-button
          :type="timer === 0 ? 'success' : 'warning'"
          @click="startRecord"
        >
          {{ timer === 0 ? ' 开始录制' : '终止录制 | ' + timer }}
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
