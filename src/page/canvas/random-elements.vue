<script setup lang="ts">
import { ElMessage } from 'element-plus'

let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D

function submit() {}

// 随机颜色
const randomColor = {
  // rgb
  rgb() {
    const color = () => Math.floor(Math.random() * 255)
    return `rgb(${color()},${color()},${color()})`
  },
  // rgba
  rgba() {
    const color = () => Math.floor(Math.random() * 255)
    return `rgba(${color()},${color()},${color()},${Math.random().toFixed(2)})`
  },
  // hex
  hex() {
    return `#${Math.floor(Math.random() * 0xffffffff).toString(16)}`
  },
}

// 判断画布上是否有东西
function isCanvasBlank() {
  // 通过枚举一个像素而不是每个像素中的每个颜色通道来获得更好的性能。
  const pixelBuffer = new Uint32Array(
    ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer,
  )
  const isBlank = !pixelBuffer.some((color) => color !== 0)
  ElMessage({
    message: isBlank ? '空白' : '非空白',
    type: isBlank ? 'success' : 'error',
  })
  return isBlank
}

// 设置随机填充颜色
function setRandomFillStyle() {
  ctx.fillStyle = randomColor.hex()
}

// 生成圆形
function generateCircle() {
  const radius = Math.floor(Math.random() * 50) // 圆弧半径
  const x = radius + Math.floor(Math.random() * (canvas.width - radius * 2)) // x 坐标值
  const y = radius + Math.floor(Math.random() * (canvas.height - radius * 2)) // y 坐标值
  const startAngle = 0 // 开始点
  const endAngle = 2 * Math.PI // 结束点
  const anticlockwise = false // 顺时针或逆时针
  setRandomFillStyle()
  ctx.beginPath()
  ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise)
  ctx.closePath()
  ctx.fill()
}
// 生成矩形
function generateRect() {
  // 随机16进制颜色(含透明度)
  setRandomFillStyle()
  ctx.fillRect(
    Math.floor(Math.random() * canvas.width),
    Math.floor(Math.random() * canvas.height),
    Math.floor(Math.random() * 200),
    Math.floor(Math.random() * 200),
  )
}
// 生成文字
function generateText() {
  // 随机16进制颜色(含透明度)
  ctx.fillStyle = `#${Math.floor(Math.random() * 0xffffffff).toString(16)}`
  ctx.font = `${10 + Math.floor(Math.random() * 100)}px Arial`
  ctx.fillText(
    `${Math.floor(Math.random() * 10)}`,
    Math.floor(Math.random() * canvas.width),
    Math.floor(Math.random() * canvas.height),
  )
}
// 生成线条
function generateLine() {
  ctx.strokeStyle = randomColor.hex()
  ctx.beginPath()
  ctx.moveTo(
    Math.floor(Math.random() * canvas.width),
    Math.floor(Math.random() * canvas.height),
  )
  ctx.lineTo(
    Math.floor(Math.random() * canvas.width),
    Math.floor(Math.random() * canvas.height),
  )
  ctx.closePath()
  ctx.stroke()
}

// 一键生成
function generateAll() {
  const count = 50
  for (let i = 0; i < count; i += 1) {
    const type = Math.floor(Math.random() * 4)
    switch (type) {
      case 0:
        generateCircle()
        break
      case 1:
        generateRect()
        break
      case 2:
        generateText()
        break
      case 3:
        generateLine()
        break
      default:
        break
    }
  }
}

// 清空画布
function clearContext() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}
onMounted(() => {
  canvas = document.getElementById('canvas-instance') as HTMLCanvasElement
  ctx = canvas.getContext('2d')!
})
</script>
<template>
  <FilepathBox :file-path="'__filePath__'" />
  <div class="cognitive-ability-container">
    <div class="title">随机</div>
    <canvas
      id="canvas-instance"
      width="800"
      height="530"
      style="border: 1px solid #000"
    ></canvas>
    <div class="operations">
      <el-button type="primary" @click="generateCircle">随机生成圆形</el-button>
      <el-button type="primary" @click="generateRect">随机生成矩形</el-button>
      <el-button type="primary" @click="generateText">随机生成文字</el-button>
      <el-button type="primary" @click="generateLine">随机生成线条</el-button>
      <el-button type="success" @click="generateAll">一键随机</el-button>
      <el-button type="warning" @click="clearContext">清空画布</el-button>
      <el-button @click="isCanvasBlank">画布上有东西吗?</el-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.cognitive-ability-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .title {
    height: 95px;
    text-align: center;
    font-size: 30px;
    line-height: 95px;
  }

  .operations {
    margin-top: 50px;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}
</style>
