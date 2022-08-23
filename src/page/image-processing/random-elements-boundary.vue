<script setup lang="ts">
let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D

type Circle = {
  x: number
  y: number
  r: number
}
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
    // return `#${Math.floor(Math.random() * 0xffffffff).toString(16)}`
    return `#${Math.floor(Math.random() * 0xffffff).toString(16)}a0`
  },
}

// 设置随机填充颜色
function setRandomFillStyle() {
  ctx.fillStyle = randomColor.hex()
}

// 清空画布
function clearContext() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

// 绘制多边形
function polygon(
  sides: number,
  size: number,
  XCenter: number,
  YCenter: number,
  offset: number,
) {
  ctx.beginPath()
  ctx.moveTo(
    XCenter + size * Math.cos(offset),
    YCenter + size * Math.sin(offset),
  )
  for (let i = 1; i <= sides; i += 1) {
    const x = XCenter + size * Math.cos((i * 2 * Math.PI) / sides + offset)
    const y = YCenter + size * Math.sin((i * 2 * Math.PI) / sides + offset)
    ctx.lineTo(x, y)
  }
  ctx.stroke()
}

function generatePolygon() {
  const arr = [3, 4, 5, 6, 7, 8]
  arr.sort(() => Math.random() - 0.5)
  for (let i = 1; i <= arr.length; i += 1) {
    const offset = Math.random() * arr.length
    polygon(arr[i - 1], 40, 85 * i, 60, offset)
  }
}

function drawEllipse(circles: Circle[]) {
  let index = 0
  const timer = setInterval(() => {
    // ctx.fillStyle = 'transparent'
    setRandomFillStyle()
    ctx.beginPath()
    ctx.arc(
      circles[index].x,
      circles[index].y,
      circles[index].r,
      0,
      2 * Math.PI,
      false,
    )
    ctx.closePath()
    ctx.fill()

    // ctx.fillStyle = '#000'
    ctx.font = `14px  Arial`
    ctx.fillText(index.toString(), circles[index].x - 7, circles[index].y + 7)
    index += 1
    // eslint-disable-next-line
    index === circles.length && clearInterval(timer)
  }, 1000)
}

function noOverlapCircles() {
  clearContext()
  const canvasWidth = canvas.width
  const canvasHeight = canvas.height
  const randomRadius = () => 10 + Math.floor(Math.random() * 50)
  const randomX = () => Math.floor(Math.random() * canvasWidth)
  const randomY = () => Math.floor(Math.random() * canvasHeight)
  const NumCircles = 100
  const circles: Circle[] = []
  let circle: Circle

  while (circles.length < NumCircles) {
    circle = {
      x: randomX(),
      y: randomY(),
      r: randomRadius(),
    }
    let overlap = false
    for (let j = 0; j < circles.length; j += 1) {
      const other = circles[j]
      const dx = circle.x - other.x
      const dy = circle.y - other.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance < circle.r + other.r) {
        overlap = true
        break
      }
    }
    if (!overlap) {
      circles.push(circle)
    }
  }
  drawEllipse(circles)
}

onMounted(() => {
  canvas = document.getElementById('canvas-instance') as HTMLCanvasElement
  ctx = canvas.getContext('2d')!
  // generatePolygon()
})
</script>
<template>
  <FilepathBox :file-path="'__filePath__'" />
  <div class="cognitive-ability-container">
    <div class="title">边界随机(不重叠)</div>
    <canvas
      id="canvas-instance"
      width="800"
      height="530"
      style="border: 1px solid #000"
    ></canvas>
    <div class="operations">
      <el-button type="primary" @click="noOverlapCircles">
        随机生成不重叠的圆形
      </el-button>
      <el-button type="warning" @click="clearContext">清空画布</el-button>
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
