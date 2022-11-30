<script lang="ts" setup>
import * as poseDetection from '@tensorflow-models/pose-detection'
import '@tensorflow/tfjs-backend-webgl'
import { PoseDetector } from '@tensorflow-models/pose-detection'

let detector: PoseDetector
let posenetInput: any
let loading = $ref(false)

// const model = poseDetection.SupportedModels.MoveNet
const model = poseDetection.SupportedModels.PoseNet
// 初始化
const init = async () => {
  // 加载模型
  detector = await poseDetection.createDetector(model, {
    modelType: 'full',
  })
  loading = true
  // 获取视频流
  posenetInput = document.getElementById('video') as HTMLVideoElement
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  })
  posenetInput.srcObject = stream
  loading = false
}

const canvas = document.createElement('canvas')
canvas.width = 360
canvas.height = 270
// 开始检测
const identify = async () => {
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(posenetInput, 0, 0, 360, 270)
  const poses = await detector.estimatePoses(canvas, {
    flipHorizontal: false,
    maxPoses: 1,
    scoreThreshold: 0.5,
    nmsRadius: 20,
  })
  // console.log('🚀🚀🚀 / poses', poses)
  const output = document.getElementById('output') as HTMLCanvasElement
  const outputCtx = output.getContext('2d')!
  // 将 pose 上的 17 个关键点的坐标信息存入 pointList
  const pointList = poses[0]?.keypoints || []
  // console.log('🚀🚀🚀 /  pointList ', pointList)
  // 将这 17 个关键点的坐标信息 画到 canvas 上
  outputCtx.clearRect(0, 0, canvas.width, canvas.height)
  outputCtx.drawImage(posenetInput, 0, 0, canvas.width, canvas.height)

  // 画出所有关键点
  pointList.forEach(({ x, y, score, name }: any) => {
    if (score > 0.5) {
      drawPoint(x, y, 5, '#f00000', outputCtx)
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
      drawSegment([kp1.x, kp1.y], [kp2.x, kp2.y], 'aqua', 1, outputCtx)
    }
  })
  requestAnimationFrame(identify)
  // setTimeout(() => {
  //   identify()
  // }, 3000)
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
  ctx.lineWidth = 4
  ctx.strokeStyle = color
  ctx.stroke()
}

onMounted(async () => {
  await init()
  await identify()
})
</script>
<template>
  <div v-loading="loading" class="">
    <video id="video" autoplay playsinline muted></video>
    <canvas id="output" width="360" height="270"></canvas>

    <div class="text-3xl h-[400px] text-[red] font-bold underline">Hello world!</div>
  </div>
</template>
<style lang="scss" scoped>
#img,
#video,
#output {
  width: 360px;
  height: 270px;
  object-fit: fill;
}
</style>
