<script setup lang="ts">
import { reactive, Ref } from 'vue'
import { fabric } from 'fabric'
import { getFiles } from '@/utils/inputFile'
import qrCode from '@/assets/qr.jpg'
import ContextMenu from '@/components/ContextMenu.vue'
import type { Menu } from '@/components/index.d'

let canvas: fabric.Canvas
let ctx: CanvasRenderingContext2D
const initHeight = 800
const initWidth = 800
const state = reactive({
  img: [] as string[],
  loading: false,
})
const menuShow = ref(false)
const contextMenu = ref<any>()
const contextMenuPosition = ref({
  x: 0,
  y: 0,
})

// 绘制目标图片
function drawImage(url: string) {
  canvas.clear()
  state.loading = true
  fabric.Image.fromURL(url, (img: any) => {
    const longSide: number = Math.max(img.width, img.height)
    let scale = 1

    // 处理图片大小,计算缩放比
    if (longSide > initHeight || longSide > initWidth) {
      if (img.height > img.width) {
        scale = initHeight / img.height
        img.scaleToHeight(initHeight)
      } else {
        scale = initWidth / img.width
        img.scaleToHeight(initWidth)
      }
    }

    // 设置Canvas大小
    // canvas.setHeight(scale * img.height + 50)
    // canvas.setWidth(scale * img.width + 50)

    img.set({
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      originX: 'center', // 图片在原点的对齐方式
      originY: 'center',
      scaleX: scale, // 横向缩放
      scaleY: scale, // 纵向缩放
      // selectable: false, // 可交互
    })

    img.on('added', () => {
      state.loading = false
      ElMessage({
        message: '添加成功!',
        type: 'success',
      })
    })

    // 将图片添加到画布
    canvas.add(img)
  })
}

// 素材图片选择回调
function getFile() {
  getFiles(false)
    .then((files: string[]) => {
      state.img = files
      drawImage(state.img[0])
    })
    .catch((err) => {
      ElMessage({
        message: '取消添加文件!',
        type: 'warning',
      })
    })
}

function getCanvasInfo() {
  const activeObject = canvas.getActiveObject() || canvas.getObjects()[0]
}
const test = () => {
  fabric.Image.fromURL(qrCode, (img: any) => {
    img.scale(0.5)
    img.set({
      left: 50,
      top: 10,
      originX: 'center',
      originY: 'center',
    })
    canvas.add(img)
    canvas.viewportCenterObjectH(img)
    canvas.viewportCenterObjectV(img)
  })
}

function initContextMenu(e: fabric.IEvent<MouseEvent>) {
  if (!e.target) {
    return
  }

  canvas.discardActiveObject()
  const select = new fabric.ActiveSelection(canvas.getObjects(), {
    canvas,
  })
  canvas.setActiveObject(select)
  menuShow.value = !menuShow.value
  const contextMenuWidth = contextMenu.value!.contextMenu.offsetWidth
  const contextMenuHeight = contextMenu.value!.contextMenu.offsetHeight

  if (canvas.width! - e.pointer!.x <= contextMenuWidth) {
    contextMenuPosition.value.x = canvas.width! - contextMenuWidth
  } else {
    contextMenuPosition.value.x = e.pointer!.x
  }
  if (canvas.height! - e.pointer!.y <= contextMenuHeight) {
    contextMenuPosition.value.y = canvas.height! - contextMenuHeight
  } else {
    contextMenuPosition.value.y = e.pointer!.y
  }
  // console.log('🚀 / canvasOnMouseDown', e.pointer!.x, e.pointer!.y)
  // console.log(
  //   '🚀',
  //   canvas.width! - e.pointer!.x <= contextMenuWidth,
  //   canvas.height! - e.pointer!.y <= contextMenuHeight,
  // )
  // console.log('🚀', contextMenu.value.contextMenu.offsetWidth)
}

function canvasOnMouseDown(e: fabric.IEvent<MouseEvent>) {
  switch (e.button) {
    case 1:
      menuShow.value = false
      break
    case 3:
      initContextMenu(e)
      break

    default:
      break
  }
}

function initCanvas() {
  canvas = new fabric.Canvas('canvas', {
    // isDrawingMode: true, // 自由绘画模式
    selection: true,
    hoverCursor: 'pointer',
    fireRightClick: true, // 启用右键,button:3
    stopContextMenu: true, // 取消默认右键菜单
  })
  canvas.on('mouse:down', canvasOnMouseDown)
  ctx = canvas.getContext()
  test()
}

function operations(type: string) {
  const activeObject = canvas?.getActiveObject()
  if (activeObject) {
    switch (type) {
      case 'flipX':
        activeObject.set({
          flipY: !activeObject.get('flipX'),
        })
        break
      case 'flipY':
        activeObject.set({
          flipY: !activeObject.get('flipY'),
        })
        break
      // case 'copy':
      //   canvas.copy(activeObject)
      //   break
      // case 'paste':
      //   canvas.paste(activeObject)
      //   break
      // case 'cut':
      //   canvas.copy(activeObject)
      //   canvas.remove(activeObject)
      //   break
      default:
        break
    }
  }
  canvas?.renderAll()
}

function flipX() {
  let activeObject = canvas?.getActiveObject()
  activeObject = canvas?.getActiveObject()
  activeObject.set({
    flipX: !activeObject.get('flipX'),
  })
  canvas?.renderAll()
}
function flipY() {
  let activeObject = canvas?.getActiveObject()
  activeObject = canvas?.getActiveObject()
  activeObject.set({
    flipY: !activeObject.get('flipY'),
  })
  canvas?.renderAll()
}

const menuList: Menu[] = [
  { type: 'primary', text: '左右翻转', callback: flipX },
  { type: 'primary', text: '垂直翻转', callback: flipY },
  // { type: 'primary', text: '垂直翻转', callback: operations('flipY') },
  // { type: 'primary', text: '测试', callback: operations('flipX') },
]

onMounted((): void => {
  initCanvas()
})
</script>
<template>
  <div class="edit-image-container">
    <div v-loading="state.loading" class="canvas-container">
      <ContextMenu
        v-show="menuShow"
        ref="contextMenu"
        :menu-list="menuList"
        :style="{
          top: contextMenuPosition.y + 'px',
          left: contextMenuPosition.x + 'px',
        }"
        class="context-menu"
      />
      <canvas
        id="canvas"
        ref="canvas"
        :width="initWidth"
        :height="initHeight"
      ></canvas>
    </div>
    <div class="operations">
      <el-row>
        <el-button
          type="primary"
          icon="UploadFilled"
          color="#626aef"
          @click="getFile"
        >
          选择要编辑的图片
        </el-button>
      </el-row>
      <el-row>
        <el-button type="primary" size="default" @click="getCanvasInfo">
          获取画布数据
        </el-button>
      </el-row>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.edit-image-container {
  height: 100%;
  display: flex;
  justify-content: space-between;

  // align-items: center;

  #canvas {
    border: 2px dashed #516fa3;
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');
    background-color: #0008;
  }

  .canvas-container {
    margin: auto;
    text-align: center;
    position: relative;

    .context-menu {
      position: absolute;
      z-index: 9999;
      padding: 15px;
      box-sizing: content-box;
      border-radius: 10px;
      background-color: #e1ecff;
    }
  }

  .operations {
    background: #516fa3;
    padding: 20px;
    width: 300px;
    color: white;

    .el-button {
      margin-bottom: 20px;
    }
  }
}
</style>
