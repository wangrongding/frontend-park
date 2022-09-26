<script setup lang="ts">
// import background from '@/assets/background.png'
import background from '@/assets/background2.png'

const WIDTH = 480
const HEIGHT = 300
const constraints: MediaStreamConstraints = {
  audio: false,
  video: {
    width: WIDTH,
    height: HEIGHT,
  },
}
let realVideo: HTMLVideoElement
let virtualVideo: HTMLVideoElement

let backgroundImageData: ImageData
let frameImageData: ImageData

let backgroundCanvas: HTMLCanvasElement
let backgroundCtx: CanvasRenderingContext2D

let realVideoCanvas: HTMLCanvasElement
let realVideoCtx: CanvasRenderingContext2D
let virtualVideoCanvas: HTMLCanvasElement
let virtualVideoCtx: CanvasRenderingContext2D

function init() {
  realVideo = document.querySelector('#real-video') as HTMLVideoElement
  virtualVideo = document.querySelector(
    '#virtual-background',
  ) as HTMLVideoElement
  // 统一设置宽度
  realVideo.width = virtualVideo.width = WIDTH
  // 统一设置高度
  realVideo.height = virtualVideo.height = HEIGHT
  getBackgroundImageData()
}

// 获取本地音视频流
async function getLocalStream(options: MediaStreamConstraints = constraints) {
  const stream = await navigator.mediaDevices.getUserMedia(options)
  playLocalStream(stream)
}

// 获取背景图像数据
function getBackgroundImageData() {
  backgroundCanvas = document.querySelector('#background') as HTMLCanvasElement
  backgroundCtx = backgroundCanvas.getContext('2d')!

  backgroundCanvas.height = HEIGHT
  backgroundCanvas.width = WIDTH
  const img = new Image()
  img.src = background
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
  }
}

// 播放视频流
function playLocalStream(stream: MediaStream) {
  realVideo.srcObject = stream
  realVideo.onloadedmetadata = () => {
    realVideo.play()
  }
  drawVideoToCanvas(realVideo)
}

// 将视频写到 canvas 中
function drawVideoToCanvas(video: HTMLVideoElement) {
  realVideoCanvas = document.createElement('canvas') as HTMLCanvasElement
  realVideoCtx = realVideoCanvas.getContext('2d')!
  virtualVideoCanvas = document.createElement('canvas') as HTMLCanvasElement
  virtualVideoCtx = virtualVideoCanvas.getContext('2d')!
  realVideoCanvas.width = virtualVideoCanvas.width = WIDTH
  realVideoCanvas.height = virtualVideoCanvas.height = HEIGHT
  // 每隔 100ms 将视频写到 canvas 中
  setInterval(() => {
    realVideoCtx.drawImage(
      video,
      0,
      0,
      realVideoCanvas.width,
      realVideoCanvas.height,
    )
    // 获取 realVideoCanvas 中的图像数据
    frameImageData = realVideoCtx.getImageData(
      0,
      0,
      realVideoCanvas.width,
      realVideoCanvas.height,
    )
    processFrame()
  }, 50)

  getStreamFromCanvas(virtualVideoCanvas)
  // requestAnimationFrame(() => {
  //   ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  // })
}

// 从 canvas 中获取流并在 video 中播放
function getStreamFromCanvas(canvas: HTMLCanvasElement) {
  const stream = canvas.captureStream(30)
  virtualVideo.srcObject = stream
}

// 逐像素计算与要处理的目标颜色的差值，如果差值小于阈值，则将该像素设置为背景图片中的对应像素
function processFrame() {
  for (let i = 0; i < frameImageData.data.length; i += 4) {
    const r = frameImageData.data[i]
    const g = frameImageData.data[i + 1]
    const b = frameImageData.data[i + 2]
    const a = frameImageData.data[i + 3]
    const bgR = backgroundImageData.data[i]
    const bgG = backgroundImageData.data[i + 1]
    const bgB = backgroundImageData.data[i + 2]
    const bgA = backgroundImageData.data[i + 3]

    const diff = colorDiff([r, g, b, a], backgroundColor)
    if (diff < allowance.value) {
      frameImageData.data[i] = bgR
      frameImageData.data[i + 1] = bgG
      frameImageData.data[i + 2] = bgB
      frameImageData.data[i + 3] = bgA
    }

    // const diff =
    //   Math.abs(r - bgR) +
    //   Math.abs(g - bgG) +
    //   Math.abs(b - bgB) +
    //   Math.abs(a - bgA)
    // if (r > 150 && g > 150 && b > 150) {
    //   frameImageData.data[i] = bgR
    //   frameImageData.data[i + 1] = bgG
    //   frameImageData.data[i + 2] = bgB
    //   frameImageData.data[i + 3] = bgA
    // }
  }
  virtualVideoCtx.putImageData(frameImageData, 0, 0)
}

// 计算颜色差异
function colorDiff(rgba1: number[], rgba2: number[]) {
  let d = 0
  for (let i = 0; i < rgba1.length; i++) {
    d += (rgba1[i] - rgba2[i]) ** 2
  }
  return Math.sqrt(d)
}

const color = ref('rgba(255, 255, 255, 255)')
const allowance = ref(200)
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
let backgroundColor: any = [255, 255, 255, 255]
function colorChange(val: string) {
  backgroundColor = color.value.match(/\d+/g)
  backgroundColor = backgroundColor?.map((item: string) => Number(item))
  // console.log('🚀🚀🚀 / backgroundColor.value', backgroundColor)
}

onMounted(() => {
  init()
  // getLocalStream()
  // getBackgroundImageData()
})
</script>
<template>
  <div class="background-processing-container">
    <el-color-picker
      v-model="color"
      show-alpha
      :predefine="predefineColors"
      color-format="rgb"
      @change="colorChange"
    />
    <el-input-number v-model="allowance" :step="2" step-strictly />
    <el-button
      type="primary"
      size="default"
      @click="
        () => {
          getLocalStream()
        }
      "
    >
      打开视频
    </el-button>

    <div class="source">
      <canvas id="background"></canvas>
      +
      <video id="real-video" autoplay playsinline muted></video>
    </div>
    <video id="virtual-background" autoplay playsinline muted></video>
    <!-- <canvas id="virtual-background"></canvas> -->
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

  video {
    border: 4px dashed #374685;
  }
}
</style>
