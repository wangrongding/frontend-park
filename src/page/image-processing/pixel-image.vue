<template>
  <div class="home">
    <div
      v-loading="loading"
      class="content"
      :style="`background:${background}`"
    >
      <div style="text-align: left; width: 800px">
        <p>使用方法:</p>
        <p style="font-size: 12px">
          选取目标文件后,再选取需要用来合成目标文件的素材图片,通过自定义的一些配置,生成像素图,点击导出图片即可
        </p>
      </div>
      <canvas id="canvas" ref="canvas" width="800" height="800"></canvas>
    </div>
    <div class="operations">
      <div style="height: 800px">
        <EasyForm :form-params="formParams">
          <template #inputFile="{}">
            <el-button type="primary" size="small" @click="inputFile">
              选择文件
            </el-button>
            <div>共选择{{ imgList.length }}个文件</div>
          </template>
        </EasyForm>
        <el-button type="primary" size="default" @click="reload">
          重置
        </el-button>
        <el-button type="primary" size="default" @click="generateImg">
          生成图片
        </el-button>
        <el-button type="success" size="default" @click="exportCanvas">
          导出图片
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
// @ is an alias to /src
import { getAverageColor } from '@/utils/averageColor.ts'
import { inputFile } from '@/utils/inputFile.ts'
import { mostBlockColor } from '@/utils/mostBlockColor.ts'
import { fabric } from 'fabric'
export default {
  components: {},
  data() {
    return {
      imgList: [], //素材图
      blockList: [], //画布数据
      blockMainColors: [], //每个格子的主色调
      loading: false,
      formParams: {
        data: {}, // 表单数据对象
        formList: {
          targetFile: {
            type: 'upload',
            label: '目标图片',
            limit: 1,
            action: '#',
            listType: 'file-list',
            fileList: [],
            autoUpload: false,
            onChange: this.slectFile,
          },
          inputFile: {
            type: 'customItem',
            label: '素材图片',
            name: 'inputFile',
          },
          /* userN2ww2ame: {
                type: "slider",
                label: "贴片大小",
            }, */
          //TODO
          aaa: {
            type: 'select',
            label: '分布方式',
            placeholder: '请选择',
            selectOptions: [],
            disabled: true,
          },
          bbb: {
            type: 'select',
            label: '高清程度',
            placeholder: '请选择',
            selectOptions: [],
            disabled: true,
          },
          ccc: {
            type: 'switch',
            label: '连续重复:',
            placeholder: '请选择',
            disabled: true,
          },
          ddd: {
            type: 'switch',
            label: '按比例调整',
            disabled: true,
          },
          eee: {
            type: 'select',
            label: '方向／比例',
            selectOptions: [],
            disabled: true,
          },
          fff: {
            type: 'slider',
            label: '贴片高度',
            disabled: true,
          },
          ggg: {
            type: 'slider',
            label: '贴片宽度',
            disabled: true,
          },
        },

        labelWidth: '90px',
        rules: {},
      },
      background: '#91A8D0',
      ctx: null,
      canvas: null,
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
      this.ctx = canvas.getContext('2d')
      this.canvas.freeDrawingBrush.color = 'blue'
      this.canvas.freeDrawingBrush.width = 5
      this.addCanvasEvent() //给画布添加事件
    },
    //重置
    reload() {
      // window.location.reload();
      console.log(this.canvas.viewportTransform)
      this.canvas.deactivateAll().renderAll()
      //http://fabricjs.com/fabric-intro-part-5#pan_zoom
      // this.canvas.clear(); // 清空画布
    },
    //生成图片
    generateImg() {
      this.loading = true
      let diffColorList = []
      //遍历所有方块
      for (let i = 0; i < this.blockMainColors.length; i++) {
        diffColorList[i] = { diffs: [] }
        //遍历所有图片
        for (let j = 0; j < this.imgList.length; j++) {
          diffColorList[i].diffs.push({
            url: this.imgList[j].url,
            diff: this.colorDiff(
              this.blockMainColors[i].color,
              this.imgList[j].color,
            ),
            color: this.imgList[j].color,
          })
        }
        //对比较过的图片进行排序,差异最小的放最前面
        diffColorList[i].diffs.sort((a, b) => {
          return a.diff - b.diff
        })
        //取第0个图片信息
        diffColorList[i].url = diffColorList[i].diffs[0].url
        diffColorList[i].position = this.blockMainColors[i].position
        diffColorList[i].Acolor = this.blockMainColors[i].color
        diffColorList[i].Bcolor = diffColorList[i].diffs[0].color
      }
      this.loading = false
      console.log(diffColorList)
      //便利每一个方块,对其渲染
      diffColorList.forEach((item) => {
        fabric.Image.fromURL(item.url, (img) => {
          let scale = img.height > img.width ? 8 / img.width : 8 / img.height
          // img.scale(8 / img.height);
          img.set({
            left: item.position[0] * 8,
            top: item.position[1] * 8,
            originX: 'center',
            scaleX: scale,
            scaleY: scale,
          })
          this.canvas.add(img)
        })
      })
    },
    //目标图片选择回调
    slectFile(file, fileList) {
      let tempUrl = window.URL.createObjectURL(file.raw)
      this.drawImage(tempUrl)
    },
    //素材图片选择回调
    async inputFile() {
      let files = await inputFile()
      this.loading = true
      for (let i = 0; i < files.length; i++) {
        let image = await getAverageColor(files[i])
        this.imgList.push(image)
      }
      console.log(this.imgList)
      this.loading = false
    },
    //栅格线
    drawLine() {
      const blockPixel = 8
      for (let i = 0; i <= this.canvas.width / blockPixel; i++) {
        this.canvas.add(
          new fabric.Line(
            [i * blockPixel, 0, i * blockPixel, this.canvas.height],
            {
              left: i * blockPixel,
              stroke: 'gray',
              selectable: false, //是否可被选中
            },
          ),
        )
        this.canvas.add(
          new fabric.Line(
            [0, i * blockPixel, this.canvas.height, i * blockPixel],
            {
              top: i * blockPixel,
              stroke: 'gray',
              selectable: false, //是否可被选中
            },
          ),
        )
      }
    },
    //获取画布像素数据
    getCanvasData() {
      // let blockList = [];
      for (let Y = 0; Y < this.canvas.height / 8; Y++) {
        for (let X = 0; X < this.canvas.width / 8; X++) {
          //每8*8像素的一块区域一组
          let tempColorData = this.ctx.getImageData(X * 8, Y * 8, 8, 8).data
          // console.log(X, Y, tempColorData);
          //将获取到数据每4个一组,每组都是一个像素
          this.blockList[Y * 100 + X] = { position: [X, Y], color: [] }
          for (let i = 0; i < tempColorData.length; i += 4) {
            this.blockList[Y * 100 + X].color.push([
              tempColorData[i],
              tempColorData[i + 1],
              tempColorData[i + 2],
              tempColorData[i + 3],
            ])
          }
        }
      }
      console.log(mostBlockColor(this.blockList))
      this.mostBlockColor(this.blockList)
      this.loading = false
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
    //获取每个格子的主色调
    mostBlockColor(blockList) {
      //所有颜色的平均值为主色调
      for (let i = 0; i < blockList.length; i++) {
        let r = 0,
          g = 0,
          b = 0,
          a = 0
        for (let j = 0; j < blockList[i].color[j].length; j++) {
          r += blockList[i].color[j][0]
          g += blockList[i].color[j][1]
          b += blockList[i].color[j][2]
          a += blockList[i].color[j][3]
        }

        // 求取平均值
        r /= blockList[i].color[0].length
        g /= blockList[i].color[0].length
        b /= blockList[i].color[0].length
        a /= blockList[i].color[0].length
        // 将最终的值取整
        r = Math.round(r)
        g = Math.round(g)
        b = Math.round(b)
        a = Math.round(a)
        this.blockMainColors.push({
          position: blockList[i].position,
          color: [r, g, b, a],
        })
      }
      console.log(this.blockMainColors)
      //最多颜色为主色调
      /* for (let i = 0; i < blockList.length; i++) {
                let colorList = [];
                let rgbaStr = "";
                for (let k = 0; k < blockList[k].color.length; k++) {
                    rgbaStr = blockList[i].color[k];
                    if (rgbaStr in colorList) {
                        ++colorList[rgbaStr];
                    } else {
                        colorList[rgbaStr] = 1;
                    }
                }
                let arr = [];
                for (let prop in colorList) {
                    arr.push({
                        // 如果只获取rgb,则为`rgb(${prop})`
                        color: prop.split(","),
                        // color: `rgba(${prop})`,
                        count: colorList[prop],
                    });
                }
                // 数组排序
                arr.sort((a, b) => {
                    return b.count - a.count;
                });
                arr[0].position = blockList[i].position;
                this.blockMainColors.push(arr[0]);
            } */
      // console.log(this.blockMainColors);
    },
    //计算颜色差异
    colorDiff(color1, color2) {
      let d = 0
      for (let i = 0; i < color1.length; i++) {
        d += (color1[i] - color2[i]) ** 2
      }
      return Math.sqrt(d)
    },
    //添加画布事件
    addCanvasEvent() {
      //画布重绘
      this.canvas.on('after:render', (e) => {})
      //有对象添加进来
      this.canvas.on('object:added', (e) => {})
      //鼠标单击
      this.canvas.on('mouse:down', (e) => {
        //ALT键盘+单击,获取当前光标处像素的值
        if (e.e.ctrlKey) {
          let mouse = this.canvas.getPointer(e.e)
          let x = parseInt(mouse.x)
          let y = parseInt(mouse.y)
          let px = this.ctx.getImageData(x, y, 1, 1).data
          console.log(
            `%c x,y:(${x},${y})/rgba(${px[0]},${px[1]},${px[2]},${px[3]})`,
            `background: rgba(${px[0]},${px[1]},${px[2]},${px[3]});`,
          )
        }
      })
      // 滚轮事件
      this.canvas.on('mouse:wheel', (e) => {
        e.e.preventDefault()
        e.e.stopPropagation()
        let ZOOM = 0.05
        let point = new fabric.Point(
          this.canvas.width / 2 - 1,
          this.canvas.height / 2 - 1,
        )
        //(alt + whell 缩放)
        if (!e.e.ctrlKey) {
          return
        } else if (e.e.altKey && e.e.ctrlKey) {
          //(ctrl + alt + whell 加速缩放)
          // ZOOM = 0.1;
          point = new fabric.Point(e.pointer.x, e.pointer.y)
        }
        this.zoom = (e.e.deltaY > 0 ? -ZOOM : ZOOM) + this.canvas.getZoom()
        this.zoom = Math.max(0.1, this.zoom) //最小为原来的0.1倍
        this.zoom = Math.min(10, this.zoom) //最大是原来的10倍
        this.canvas.zoomToPoint(point, this.zoom)
      })
      //画布随着鼠标移动。
      this.canvas.on({
        'mouse:down': (e) => {
          if (e.e.altKey) {
            this.panning = true
            this.canvas.selection = false
          }
        },
        'mouse:up': (e) => {
          this.panning = false
          this.canvas.selection = true
        },
        'mouse:move': (e) => {
          if (this.panning && e && e.e) {
            let delta = new fabric.Point(e.e.movementX, e.e.movementY)
            this.canvas.relativePan(delta)
          }
        },
      })
      this.canvas.on({
        //对象被移动时,添加透明效果
        'object:moving': function (e) {
          console.log(e)
          e.target.opacity = 0.5
        },
        //对象被改变后
        'object:modified': function (e) {
          e.target.opacity = 1
        },
      })
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
  },
}
</script>
<style lang="scss" scoped>
/* stylelint-disable-next-line */
::v-deep .el-form-item__label {
  color: white !important;
}

::v-deep .el-upload-list {
  max-width: 200px;
  overflow: hidden;
  /* stylelint-disable-next-line */
  .el-upload-list__item-name {
    color: white;
  }
}

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
  }
}

#canvas {
  border: 2px dashed #516fa3;
  object-fit: fill;
  background-color: white;
}
</style>
