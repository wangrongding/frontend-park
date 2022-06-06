<script>
/* eslint-disable */
import { fabric } from 'fabric'
import { getFiles } from '@/utils/inputFile.ts'
export default {
  components: {},
  data() {
    return {
      loading: false,
      ctx: null,
      canvas: null,
      targetData: null,
      hiddenData: null,
    }
  },
  mounted() {
    this.initCanvas()
  },
  methods: {
    //初始化画布
    initCanvas() {
      this.canvas = new fabric.Canvas('canvas', {
        isDrawingMode: false, //自由绘画模式
        selectable: false,
        selection: false,
        hoverCursor: 'pointer',
        devicePixelRatio: true, //Retina 高清屏 屏幕支持
        stroke: 'lightgreen',
        strokeWidth: 4,
      })
      this.ctx = this.canvas.getContext('2d')
    },
    //素材图片选择回调
    async inputFile() {
      let files = await getFiles()
      this.drawImage(files[0])
    },
    //绘制目标图片
    drawImage(url) {
      this.loading = true
      fabric.Image.fromURL(url, (img) => {
        //设置缩放比例,长图的缩放比为this.canvas.width / img.width,宽图的缩放比为this.canvas.height / img.height
        let scale =
          img.height > img.width
            ? this.canvas.width / img.width
            : this.canvas.height / img.height
        img.set({
          left: this.canvas.width / 2, //距离左边的距离
          originX: 'center', //图片在原点的对齐方式
          originY: 'center',
          top: this.canvas.height / 2,
          scaleX: scale, //横向缩放
          scaleY: scale, //纵向缩放
          selectable: false, //可交互
        })
        img.on('added', (e) => {
          //这里有个问题,added后获取的是之前的画布像素数据,其他手动触发的事件,不会有这种问题
          //故用一个异步解决
          setTimeout(() => {
            this.getCanvasData()
          }, 500)
        })
        this.canvas.add(img) //将图片添加到画布
        // this.drawLine(); //绘制网格线条
      })
    },
    //获取画布像素数据
    getCanvasData() {
      this.targetData = this.ctx.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height,
      )
      //存一个二进制的数值表示
      this.targetData.binaryList = Array.from(
        this.targetData.data,
        (color, index) => {
          color = color.toString(2).padStart(8, '0').split('')
          return color
        },
      )
      console.log(this.targetData)
      this.loading = false
    },
    //解析图片
    decryptImage() {
      const c = document.getElementById('decryptCanvas')
      const ctx = c.getContext('2d')

      let decryptImageData = []

      for (let i = 0; i < this.targetData.binaryList.length; i += 8) {
        let tempColorData = []
        for (let j = 0; j < 8; j++) {
          tempColorData.push(this.targetData.binaryList[i + j][7])
        }
        decryptImageData.length <
          Math.pow(Math.floor(Math.sqrt(2560000 / 32)), 2) * 4 &&
          decryptImageData.push([...tempColorData])
      }
      decryptImageData = Uint8ClampedArray.from(decryptImageData, (z) => {
        z = parseInt(z.join(''), 2)
        return z
      })
      console.log(decryptImageData, 'decryptImageData')
      //需要注意的是putImageData的data的长度必须为两个边的乘积的4的倍数
      ctx.putImageData(
        new ImageData(
          decryptImageData,
          Math.floor(Math.sqrt(2560000 / 8 / 4)),
          Math.floor(Math.sqrt(2560000 / 8 / 4)),
        ),
        0,
        0,
      )
    },
    //导出图片
    exportCanvas() {
      const dataURL = this.canvas.toDataURL({
        width: this.canvas.width,
        height: this.canvas.height,
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
    },
    //重置
    reload() {
      // window.location.reload();
      console.log(this.canvas.viewportTransform)
      this.canvas.deactivateAll().renderAll()
      //http://fabricjs.com/fabric-intro-part-5#pan_zoom
      // this.canvas.clear(); // 清空画布
    },
  },
}
</script>
<template>
  <div class="home">
    <FilepathBox :file-path="'__filePath__'" />
    <div v-loading="loading" class="content">
      <canvas id="canvas" ref="canvas" width="800" height="800"></canvas>
    </div>
    <div class="operations">
      <div style="height: 800px; margin: 0 auto">
        1.选择需要解密的文件
        <el-button
          type="success"
          style="width: 100%; margin: 10px auto"
          size="default"
          @click="inputFile"
        >
          选择解密的图片
        </el-button>
        2.解析图片中的隐藏数据
        <el-button
          type="primary"
          style="width: 100%; margin: 10px auto"
          size="default"
          @click="decryptImage"
        >
          解析图片
        </el-button>
        <p style="margin: 10px 0">图片中隐藏的数据:</p>
        <canvas
          id="decryptCanvas"
          width="280"
          height="280"
          style="
            border: 1px dashed #749feb;
            background-color: white;
            box-sizing: border-box;
          "
        ></canvas>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.home {
  transition: width 0.28s;
  width: 100vw;
  min-width: 1200px;
  height: 100%;
  display: flex;

  .operations {
    background: #516fa3;
    padding: 20px;
    width: 300px;
    color: white;
    border: 1px solid #516fa3;
    display: flex;
    align-items: center;
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 820px;
    overflow: hidden;
    flex: 1;
    position: relative;
  }
}

#canvas {
  border: 1px dashed #516fa3;

  // object-fit: fill;
  box-sizing: border-box;
  background-color: white;
}
</style>
