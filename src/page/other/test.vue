<script setup lang="ts">
import { fabric } from 'fabric'
import qrCode from '@/assets/qr.jpg'

function generate() {
  const canvas = new fabric.Canvas('canvas')
  // 创建一个矩形对象
  const rect = new fabric.Rect({
    left: 400, // 距离左边的距离
    top: 180, // 距离上边的距离
    fill: 'green', // 填充的颜色
    width: 200, // 宽度
    height: 200, // 高度
  })
  // 创建一个圆形对象
  const circle = new fabric.Circle({
    left: 700, // 距离左边的距离
    top: 200, // 距离上边的距离
    fill: 'red', // 填充的颜色
    radius: 50, // 圆的半径
  })
  // 创建一个三角形对象
  const triangle = new fabric.Triangle({
    left: 700, // 距离左边的距离
    top: 50, // 距离上边的距离
    fill: 'blue', // 填充的颜色
    width: 100, // 宽度
    height: 100, // 高度
  })
  // 将图形形添加到canvas画布上
  canvas.add(rect)
  canvas.add(circle, triangle)
  fabric.Image.fromURL(qrCode, (img: any) => {
    img.scale(0.5)
    img.set({
      left: 50,
      top: 10,
    })
    canvas.add(img)
  })
}

// 绘画模式
let canvas: any = null
let ctx: any = null
function drawMode() {
  //   初始化画布
  canvas = new fabric.Canvas('canvas2', {
    isDrawingMode: true, // 自由绘画模式
    selectable: true,
    selection: true,
    hoverCursor: 'pointer',
    devicePixelRatio: true, // Retina 高清屏 屏幕支持
    stroke: 'lightgreen',
    strokeWidth: 4,
  })
  canvas.freeDrawingBrush.color = 'blue'
  canvas.freeDrawingBrush.width = 5
  ctx = canvas.getContext('2d')
}
// 导出画布
function exportCanvas() {
  const dataURL = canvas.toDataURL({
    width: canvas.width,
    height: canvas.height,
    left: 0,
    top: 0,
    format: 'png',
  })
  const link = document.createElement('a')
  link.download = 'canvas.png'
  link.href = dataURL
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

onMounted(() => {
  generate()
  drawMode()
})
</script>

<template>
  <div class="test-container">
    <canvas id="canvas" class="canvas" width="900" height="400"></canvas>
    <canvas id="canvas2" class="canvas" width="900" height="400"></canvas>
  </div>
</template>
<style scoped lang="scss">
.test-container {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 100%;

  .canvas {
    margin: 0 auto;
    border: 1px solid black;
  }
}
</style>
