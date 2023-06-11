<script setup lang="ts">
import * as tf from '@tensorflow/tfjs-core'
import * as posenet from '@tensorflow-models/posenet'

import * as poseDetection from '@tensorflow-models/pose-detection'
import '@tensorflow/tfjs-backend-webgl'

const model = poseDetection.SupportedModels.BlazePose
// const model = poseDetection.SupportedModels.MoveNet

const detectorConfig = {
  runtime: 'tfjs',
  modelType: 'full',
}
let loading = $ref(false)
let detector: any
let posenetInput: any

// 打开摄像头
const init = async () => {
  loading = true
  detector = await poseDetection.createDetector(model, detectorConfig)

  posenetInput = document.getElementById('local-video') as HTMLVideoElement
  // posenetInput = document.getElementById('img') as HTMLImageElement
  posenetInput.width = 360
  posenetInput.height = 270
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    // video: true,
    video: {
      facingMode: 'user',
      width: 360,
      height: 270,
    },
  })
  posenetInput.srcObject = stream
  loading = false
}

const identify = async () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')!
  // detector = await posenet.load()

  // 识别图像中的姿势(单姿态)
  const poses = await detector.estimatePoses(posenetInput, { flipHorizontal: false })
  // console.log('🚀🚀🚀 / detector', detector)
  // console.log('🚀🚀🚀 / pose', poses)
  // const pose = await detector.estimateSinglePose(posenetInput, { flipHorizontal })

  // // 将 pose 上的 17 个关键点的坐标信息存入 pointList
  // const pointList = pose.keypoints
  // // eslint-disable-next-line no-console
  // // console.log('🚀🚀🚀 /  pointList ', pointList)
  // // 将这 17 个关键点的坐标信息 画到 canvas 上
  // ctx.clearRect(0, 0, canvas.width, canvas.height)
  // ctx.drawImage(posenetInput, 0, 0, canvas.width, canvas.height)

  // // 画出 17 个关键点
  // pointList.forEach(({ position }) => {
  //   ctx.beginPath()
  //   ctx.arc(position.x, position.y, 4, 0, 2 * Math.PI)
  //   ctx.fillStyle = '#f00000'
  //   ctx.fill()
  // })
  // // 画出 17 个关键点之间的连线
  // const adjacentKeyPoints = posenet.getAdjacentKeyPoints(pose.keypoints, 0.3)
  // // console.log('🚀🚀🚀 / adjacentKeyPoints', adjacentKeyPoints)
  // adjacentKeyPoints.forEach((keypoints) => {
  //   drawSegment(toTuple(keypoints[0].position), toTuple(keypoints[1].position), 'aqua', 1, ctx)
  // })

  // // requestAnimationFrame(identify)
  // setTimeout(() => {
  //   identify()
  // }, 500)
}

// 转成元组
function toTuple({ y, x }: { y: number; x: number }) {
  return [y, x]
}
// 画线段
function drawSegment([ay, ax]: number[], [by, bx]: number[], color: string, scale: number, ctx: CanvasRenderingContext2D) {
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
  <div v-loading="loading" class="page-container">
    <el-button type="primary" size="default" @click="identify">识别</el-button>
    <div>
      <video id="local-video" width="360" height="270" autoplay muted></video>
      <canvas id="local-canvas" width="360" height="270"></canvas>
      <canvas id="canvas" width="360" height="270"></canvas>
      <img id="img" src="./test5.png" alt="" />
      <video id="video" playsinline style="transform: scaleX(-1); visibility: hidden; width: auto; height: auto"></video>
      <canvas id="output"></canvas>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#img,
#local-video,
#canvas {
  width: 360px;
  height: 270px;
  object-fit: fill;
}
</style>
