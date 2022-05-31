<script setup lang="ts">
import { functions } from 'lodash'
import { reactive } from 'vue'

let canvas: HTMLCanvasElement
let context: CanvasRenderingContext2D

const state = reactive({
  rules: {
    answer: [
      { required: true, message: '请输入依次出现的数字', trigger: 'blur' },
    ],
  },
  answer: '',
})

function submit() {}
// 随机颜色
function getRandomColor() {
  const color = () => Math.floor(Math.random() * 255)
  return `rgb(${color()},${color()},${color()})`
}

function isCanvasBlank() {
  const pixelBuffer = new Uint32Array(
    context.getImageData(0, 0, canvas.width, canvas.height).data.buffer,
  )
  return !pixelBuffer.some((color) => color !== 0)
}

function generateCircle() {
  const radius = Math.floor(Math.random() * 50) // 圆弧半径
  const x = radius + Math.floor(Math.random() * (canvas.width - radius * 2)) // x 坐标值
  const y = radius + Math.floor(Math.random() * (canvas.height - radius * 2)) // y 坐标值
  const startAngle = 0 // 开始点
  const endAngle = 2 * Math.PI // 结束点
  const anticlockwise = false // 顺时针或逆时针
  context.beginPath()
  context.arc(x, y, radius, startAngle, endAngle, anticlockwise)
  context.closePath()
  context.fill()
}
function generateRect() {
  context.fillRect(
    Math.floor(Math.random() * canvas.width),
    Math.floor(Math.random() * canvas.height),
    Math.floor(Math.random() * 200),
    Math.floor(Math.random() * 200),
  )
}

function drawOnCanvas() {
  // 随机16进制颜色(含透明度)
  context.fillStyle = `#${Math.floor(Math.random() * 0xffffffff).toString(16)}`
  generateCircle()
  // generateRect()
}

function clearContext() {
  context.clearRect(0, 0, canvas.width, canvas.height)
}
onMounted(() => {
  canvas = document.getElementById('canvas-instance') as HTMLCanvasElement
  context = canvas.getContext('2d')!
})
</script>
<template>
  <div class="cognitive-ability-container">
    <div class="title">随机</div>
    <canvas
      id="canvas-instance"
      width="800"
      height="530"
      style="border: 1px solid #000"
    ></canvas>
    <div class="operations">
      <el-button type="primary" size="default" @click="drawOnCanvas">
        drawOnCanvas
      </el-button>
      <el-button type="primary" size="default" @click="clearContext">
        clearContext
      </el-button>
      <!-- <el-input v-model="state.answer" placeholder="Please input" />
      <el-form :rules="state.rules">
        <el-form-item prop="answer">
          <el-input v-model="state.answer" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <el-button type="primary" size="default" @click="submit">确认</el-button> -->
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

    // flex-direction: column;
  }
}
</style>
