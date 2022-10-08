<script setup lang="ts">
import backgroundImg from '@/assets/background2.png'

const WIDTH = 480
const HEIGHT = 300

// 原本的视频
let realVideo: HTMLVideoElement
let realVideoCanvas: HTMLCanvasElement
let realVideoCtx: CanvasRenderingContext2D
let realVideoImageData: ImageData

// 虚拟的视频
let virtualVideo: HTMLVideoElement
let virtualVideoCanvas: HTMLCanvasElement
let virtualVideoCtx: CanvasRenderingContext2D

// 虚拟背景的 canvas中的图片数据
let backgroundImageData: ImageData
// 获取背景图像数据
function getBackgroundImageData() {
  return new Promise((resolve) => {
    const backgroundCanvas = document.querySelector(
      '#backgroundImg',
    ) as HTMLCanvasElement
    const backgroundCtx = backgroundCanvas.getContext('2d')!
    const img = new Image()
    img.src = backgroundImg
    img.onload = () => {
      backgroundCtx.drawImage(
        img,
        0,
        0,
        backgroundCanvas.width,
        backgroundCanvas.height,
      )

      backgroundImageData = backgroundCtx.getImageData(
        0,
        0,
        backgroundCanvas.width,
        backgroundCanvas.height,
      )
      resolve(0)
    }
  })
}

// 获取本地音视频流
async function getLocalStream(options: MediaStreamConstraints) {
  const stream = await navigator.mediaDevices.getUserMedia(options)
  return stream
}

// 播放原始视频流
function playRealVideo(stream: MediaStream) {
  realVideo = document.querySelector('#real-video') as HTMLVideoElement
  realVideo.srcObject = stream
}

// 将视频写到 canvas 中
function drawVideoToCanvas(realVideo: HTMLVideoElement) {
  realVideoCanvas = document.createElement('canvas') as HTMLCanvasElement
  realVideoCtx = realVideoCanvas.getContext('2d')!
  virtualVideoCanvas = document.createElement('canvas') as HTMLCanvasElement
  virtualVideoCtx = virtualVideoCanvas.getContext('2d')!
  realVideoCanvas.width = virtualVideoCanvas.width = WIDTH
  realVideoCanvas.height = virtualVideoCanvas.height = HEIGHT

  // 每隔 100ms 将真实的视频写到 canvas 中，并获取视频的图像数据
  setInterval(() => {
    realVideoCtx.drawImage(
      realVideo,
      0,
      0,
      realVideoCanvas.width,
      realVideoCanvas.height,
    )
    // 获取 realVideoCanvas 中的图像数据
    realVideoImageData = realVideoCtx.getImageData(
      0,
      0,
      realVideoCanvas.width,
      realVideoCanvas.height,
    )
    // 处理真实视频的图像数据，将其写到虚拟视频的 canvas 中
    processFrameDrawToVirtualVideo()
  }, 50)
  // 从 VirtualVideoCanvas 中获取视频流并在 virtualVideo 中播放
  getStreamFromVirtualVideoCanvas()
}

// 从 VirtualVideoCanvas 中获取视频流并在 virtualVideo 中播放
function getStreamFromVirtualVideoCanvas() {
  virtualVideo = document.querySelector('#virtual-video') as HTMLVideoElement
  const stream = virtualVideoCanvas.captureStream(30)
  virtualVideo.srcObject = stream
}

// 处理真实视频的图像数据，将其写到虚拟视频的 canvas 中
function processFrameDrawToVirtualVideo() {
  // 逐像素计算与要处理的目标颜色的差值，如果差值小于阈值，则将该像素设置为背景图片中的对应像素
  for (let i = 0; i < realVideoImageData.data.length; i += 4) {
    const r = realVideoImageData.data[i]
    const g = realVideoImageData.data[i + 1]
    const b = realVideoImageData.data[i + 2]
    const a = realVideoImageData.data[i + 3]
    const bgR = backgroundImageData.data[i]
    const bgG = backgroundImageData.data[i + 1]
    const bgB = backgroundImageData.data[i + 2]
    const bgA = backgroundImageData.data[i + 3]

    // 计算与背景色的差值
    const diff = colorDiff([r, g, b], backgroundColor)
    // 当差值小于设定的阈值，则将该像素设置为背景图片中的对应像素
    if (diff < allowance.value) {
      realVideoImageData.data[i] = bgR
      realVideoImageData.data[i + 1] = bgG
      realVideoImageData.data[i + 2] = bgB
      realVideoImageData.data[i + 3] = bgA
    }
  }
  // 将处理后的图像数据写到虚拟视频的 canvas 中
  virtualVideoCtx.putImageData(realVideoImageData, 0, 0)
}

// 计算颜色差异
function colorDiff(rgba1: number[], rgba2: number[]) {
  let d = 0
  for (let i = 0; i < rgba1.length; i++) {
    d += (rgba1[i] - rgba2[i]) ** 2
  }
  return Math.sqrt(d)
}

// 十六进制转 rgb
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)!
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null
}
// 初始的背景色
const color = ref('#01f62d')
// 设置 diff 阈值
const allowance = ref(50)
let backgroundColor: any

watch(
  () => color.value,
  (newVal) => {
    // 十六进制转 rgb
    backgroundColor = hexToRgb(newVal)
  },
  {
    immediate: true,
  },
)
// 开始
async function start() {
  await getBackgroundImageData()
  const stream = await getLocalStream({
    video: {
      width: WIDTH,
      height: HEIGHT,
    },
    audio: false,
  })
  playRealVideo(stream)
  drawVideoToCanvas(realVideo)
}

onMounted(start)
</script>
<template>
  <div class="background-processing-container">
    <div class="source">
      <canvas
        id="backgroundImg"
        width="480"
        height="300"
        class="background-img"
      ></canvas>
      +
      <video id="real-video" width="480" height="300" autoplay muted></video>
    </div>
    <video id="virtual-video" width="480" height="300" autoplay muted></video>

    <div class="control">
      你的背景色：
      <input v-model="color" type="color" />
      容差值：
      <el-input-number v-model="allowance" :step="1" step-strictly />
      <el-slider v-model="allowance" :max="300" :step="1" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.background-processing-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;

  .source {
    display: flex;
    justify-content: space-around;
    gap: 50px;
    align-items: center;
    text-align: center;
  }

  video,
  canvas {
    width: 480px;
    height: 300px;
    border: 4px dashed #374685;
  }
}
</style>
