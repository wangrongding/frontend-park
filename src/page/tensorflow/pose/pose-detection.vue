<script lang="ts" setup>
import { PoseDetector } from '@tensorflow-models/pose-detection'
import * as poseDetection from '@tensorflow-models/pose-detection'
import '@tensorflow/tfjs-backend-webgl'

let loading = $ref(false)
let posenetInput: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement
let posenetOutput: HTMLCanvasElement
let posenetOutputCtx: CanvasRenderingContext2D
let detector: PoseDetector
let model: poseDetection.SupportedModels.PoseNet

// const model = poseDetection.SupportedModels.MoveNet
// 初始化
const init = async () => {
  loading = true
  // 获取 canvas 元素
  posenetOutput = document.getElementById('output') as HTMLCanvasElement
  posenetOutputCtx = posenetOutput.getContext('2d')!
  // 获取视频流
  posenetInput = document.getElementById('video') as HTMLVideoElement
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  })
  posenetInput.srcObject = stream
  // 定义模型
  model = poseDetection.SupportedModels.PoseNet
  // 加载模型
  detector = await poseDetection.createDetector(model, {
    // 有三种模型的类型可供选择：”lite”、”full “和 “heavy”。这些改变了检测模型的大小。Lite的检测精度最低，但性能最好，而 “heavy “的检测精度最好，但更消耗性能，而 “full “则处于中间位置。我们选择了它 。
    modelType: 'full',
  })
  loading = false
  detectPose()
}

const canvas = document.createElement('canvas')
canvas.width = 360
canvas.height = 270

// 开始检测
const detectPose = async () => {
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(posenetInput, 0, 0, 360, 270)
  const poses = await detector.estimatePoses(canvas, {
    flipHorizontal: false,
    maxPoses: 1,
    scoreThreshold: 0.5,
    nmsRadius: 20,
  })
  // console.log('🚀🚀🚀 / poses', poses)

  // 将 pose 上的 17 个关键点的坐标信息存入 pointList
  const pointList = poses[0]?.keypoints || []
  // console.log('🚀🚀🚀 /  pointList ', pointList)
  // 将这 17 个关键点的坐标信息 画到 canvas 上
  // posenetOutputCtx.clearRect(0, 0, canvas.width, canvas.height)
  posenetOutputCtx.drawImage(posenetInput, 0, 0, canvas.width, canvas.height)

  // 画出所有关键点
  pointList.forEach(({ x, y, score, name }: any) => {
    if (score > 0.5) {
      // 画点
      drawPoint(x, y, 5, '#f00000', posenetOutputCtx)
    }
  })
  // 获取相邻的关键点信息
  const adjacentPairs = poseDetection.util.getAdjacentPairs(model)
  // 画出所有连线
  adjacentPairs.forEach(([i, j]: any) => {
    const kp1 = pointList[i]
    const kp2 = pointList[j]
    // score 不为空就画线
    const score1 = kp1.score != null ? kp1.score : 1
    const score2 = kp2.score != null ? kp2.score : 1
    if (score1 >= 0.5 && score2 >= 0.5) {
      // 画线段
      drawSegment([kp1.x, kp1.y], [kp2.x, kp2.y], 'aqua', 1, posenetOutputCtx)
    }
  })
  // requestAnimationFrame(() => detectPose(detector))
  setTimeout(() => {
    detectPose()
  }, 50)
}

// 画点
function drawPoint(x: number, y: number, r: number, color: string, ctx: CanvasRenderingContext2D) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.fillStyle = color
  ctx.fill()
}
// 画线段
function drawSegment([ax, ay]: number[], [bx, by]: number[], color: string, scale: number, ctx: CanvasRenderingContext2D) {
  ctx.beginPath()
  ctx.moveTo(ax * scale, ay * scale)
  ctx.lineTo(bx * scale, by * scale)
  ctx.lineWidth = 6
  ctx.strokeStyle = color
  ctx.stroke()
}

onMounted(async () => {
  await init()
})
</script>
<template>
  <div v-loading="loading" class="h-[500px] text-center flex justify-center items-center gap-[20px]">
    <div>
      <span>input</span>
      <video id="video" autoplay playsinline muted class="w-[360px] h-[270px] object-fill"></video>
    </div>
    <!-- output -->
    <div>
      <span>output</span>
      <canvas id="output" width="360" height="270"></canvas>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
