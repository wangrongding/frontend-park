<script setup lang="ts">
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import { getFiles } from '@/utils/inputFile'
import SuperForm from '@/components/SuperForm/index.vue'
// const state = reactive({
//   formParams: {
//     data: {}, // 表单数据对象
//     formList: {
//       maxWidth: {
//         type: 'text',
//         label: '最大宽度',
//         placeholder: '请输入最大宽度',
//       },
//       maxHeight: {
//         type: 'text',
//         label: '最大高度',
//         placeholder: '请输入最大高度',
//       },
//     },
//     labelWidth: '90px',
//     labelColor: '#fff',
//     inline: false,
//     rules: [{ required: true, message: '请输入最大宽度', trigger: 'blur' }],
//   },
// })

const loading = $ref(false)
const MIME_TYPE = 'image/jpeg'
const maxWidth = 320
const maxHeight = 180
const quality = 0.7
const imageProps = ref({
  src: '',
  width: 0,
  height: 0,
  scale: 1,
})
const formParams = reactive({
  data: {}, // 表单数据对象
  formList: {
    file: {
      type: 'upload',
      label: '压缩文件',
      text: '选择文件',
      action: '#',
      autoUpload: false,
      showFileList: false,
      limit: 1,
      accept: 'image/jpeg,image/png',
      httpRequest: ({ file }: any) => {
        const url = URL.createObjectURL(file)
        imageProps.value.src = url
      },
    },
    maxWidth: {
      type: 'text',
      label: '最大宽度',
      placeholder: '请输入最大宽度',
    },
    maxHeight: {
      type: 'text',
      label: '最大高度',
      placeholder: '请输入最大高度',
    },
    scale: {
      type: 'text',
      label: '缩放比例',
      placeholder: '请输入缩放比例',
    },
  },
  labelWidth: '90px',
  labelColor: '#fff',
  inline: false,
  rules: [{ required: true, message: '请输入最大宽度', trigger: 'blur' }],
})

// 获取图片Blob
async function getImage() {
  const blobUrlList = await getFiles()
  const blobURL = blobUrlList[0]
  drawImage(blobURL)
}

// 绘制图片
function drawImage(blobURL: any) {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')!
  const img = new Image()
  img.src = blobURL
  img.onload = () => {
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0, img.width, img.height)
  }
}

function compressImage() {
  // const file = ev.target.files[0] // get the file
  // const blobURL = URL.createObjectURL(file)
  // const img = new Image()
  // img.src = blobURL
  // img.onerror = function () {
  //   URL.revokeObjectURL(this.src)
  //   // Handle the failure properly
  //   console.log('Cannot load image')
  // }
  // img.onload = function () {
  //   URL.revokeObjectURL(this.src)
  //   const [newWidth, newHeight] = calculateSize(img, MAX_WIDTH, MAX_HEIGHT)
  //   const canvas = document.createElement('canvas')
  //   canvas.width = newWidth
  //   canvas.height = newHeight
  //   const ctx = canvas.getContext('2d')
  //   ctx.drawImage(img, 0, 0, newWidth, newHeight)
  //   canvas.toBlob(
  //     (blob) => {
  //       // Handle the compressed image. es. upload or save in local state
  // const innerText = `${label} - ${readableBytes(file.size)}`
  //     },
  //     MIME_TYPE,
  //     QUALITY,
  //   )
  //   document.getElementById('root').append(canvas)
  // }
}

// 计算压缩后的图片尺寸
function calculateSize(img: ImageData, maxWidth: number, maxHeight: number) {
  let width = img.width!
  let height = img.height!

  // calculate the width and height, constraining the proportions
  if (width > height) {
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width)
      width = maxWidth
    }
  } else if (height > maxHeight) {
    width = Math.round((width * maxHeight) / height)
    height = maxHeight
  }
  return [width, height]
}

function readableBytes(bytes: number) {
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`
}
</script>
<template>
  <div class="image-compress-container">
    <FilepathBox :file-path="'__filePath__'" />
    <div v-loading="loading" class="content">
      <img :src="imageProps.src" alt="" />
      <canvas id="canvas" ref="canvas"></canvas>
    </div>
    <div class="operations">
      <div style="height: 800px; margin: 0 auto">
        1.选择需要压缩的图片
        <el-button
          type="success"
          style="width: 100%; margin: 10px auto"
          size="default"
          @click="getImage"
        >
          选择图片
        </el-button>
        <SuperForm :form-params="formParams" />
        2.压缩图片
        <el-button
          type="primary"
          style="width: 100%; margin: 10px auto"
          size="default"
          @click="compressImage"
        >
          压缩图片
        </el-button>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.image-compress-container {
  height: 100%;
  display: flex;

  .content {
    flex: 1;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;

    #canvas {
      margin: auto;
      border: 1px dashed #516fa3;
      box-sizing: border-box;
      background-color: white;
    }
  }

  .operations {
    background: #516fa3;
    padding: 20px;
    width: 300px;
    overflow: hidden;
    color: white;
    border: 1px solid #516fa3;
    display: flex;
    align-items: center;
  }
}
</style>
