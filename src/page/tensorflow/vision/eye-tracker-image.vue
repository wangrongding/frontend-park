<script setup lang="ts">
import vision from '@mediapipe/tasks-vision'
import { ElMessage, genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import Pic7 from './eye.jpg'

const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision
let demosSection: HTMLElement
let imageBlendShapes: HTMLElement
let outPutCanvas: HTMLCanvasElement
let outPutCanvasCtx: CanvasRenderingContext2D
let faceLandmarker: vision.FaceLandmarker
let runningMode: 'IMAGE' | 'VIDEO' = 'IMAGE'
let imageContainers: HTMLElement[]
const loading = ref(false)

onMounted(() => {
  outPutCanvas = document.querySelector('#output-canvas') as HTMLCanvasElement
  outPutCanvasCtx = outPutCanvas.getContext('2d')!
  demosSection = document.getElementById('demos')!
  imageBlendShapes = document.getElementById('image-blend-shapes')!
  imageContainers = document.getElementsByClassName('detectOnClick') as unknown as HTMLElement[]
})

async function createFaceLandmarker() {
  loading.value = true
  // Read more `CopyWebpackPlugin`, copy wasm set from "https://cdn.skypack.dev/node_modules" to `/wasm`
  // const FileSetResolver = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm')
  // console.log('🚀🚀🚀 / FileSetResolver:', FileSetResolver)

  const wasmBinaryPath = new URL('./vision_wasm_internal.wasm', import.meta.url).href
  const wasmLoaderPath = new URL('./vision_wasm_internal.js', import.meta.url).href
  const modelAssetPath = new URL('./vision_face_landmarker.task', import.meta.url).href

  faceLandmarker = await FaceLandmarker.createFromOptions(
    {
      wasmBinaryPath,
      // wasmBinaryPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm/vision_wasm_internal.wasm',
      wasmLoaderPath,
      // wasmLoaderPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm/vision_wasm_internal.js',
    },
    {
      baseOptions: {
        modelAssetPath,
        // modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
        delegate: 'GPU',
      },
      outputFaceBlendshapes: true,
      runningMode,
      numFaces: 1,
    },
  )
  loading.value = false
}
onMounted(createFaceLandmarker)

/** ******************************************************************
演示1：从页面上抓取一堆图片，并在点击时检测它们。
******************************************************************* */
const faceLandmarks = ref<any[]>([])
const img = ref<any>(null)

// 当一个图像被点击时，让我们检测它并显示结果
async function handleClick() {
  loading.value = true
  if (!faceLandmarker) {
    ElMessage.error('Wait for faceLandmarker to load before clicking!')
    loading.value = false
    return
  }

  // 获取图像宽高
  const imgWidth = img.value.width
  const imgHeight = img.value.height

  runningMode = 'IMAGE'
  await faceLandmarker.setOptions({ runningMode })
  outPutCanvas.setAttribute('width', `${imgWidth}px`)
  outPutCanvas.setAttribute('height', `${imgHeight}px`)
  outPutCanvas.style.width = `${imgWidth}px`
  outPutCanvas.style.height = `${imgHeight}px`

  img.value.parentNode.appendChild(outPutCanvas)
  const outPutCanvasCtx = outPutCanvas.getContext('2d')!
  const drawingUtils = new DrawingUtils(outPutCanvasCtx)
  // 我们可以多次调用 faceLandmarker.detect，每次使用不同的图像数据。这将返回一个promise
  const faceLandmarkerResult = faceLandmarker.detect(img.value)
  // console.log('🚀🚀🚀 landmarks:', faceLandmarkerResult, faceLandmarkerResult.faceLandmarks)
  faceLandmarkerResult.faceLandmarks.forEach((landmarks) => {
    // console.log('🚀🚀🚀 / landmarks:', landmarks)
    drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_TESSELATION, { color: '#C0C0C070', lineWidth: 1 })
    drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, { color: '#FF3030' })
    drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW, { color: '#FF3030' })
    drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, { color: '#30FF30' })
    drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW, { color: '#30FF30' })
    drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, { color: '#E0E0E0' })
    drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LIPS, { color: '#E0E0E0' })
    drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS, { color: '#FF3030' })
    drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS, { color: '#30FF30' })
  })
  faceLandmarks.value = faceLandmarkerResult.faceBlendshapes[0].categories
  loading.value = false
  // console.log('🚀🚀🚀 / faceLandmarks.value:', faceLandmarkerResult.faceBlendshapes[0].categories)
}

function drawBlendShapes(el: HTMLElement, blendShapes: any[]) {
  if (!blendShapes.length) return
  let htmlMaker = ''
  blendShapes[0].categories.forEach((shape: any) => {
    htmlMaker += `
      <li class="blend-shapes-item">
        <span class="blend-shapes-label">${shape.displayName || shape.categoryName}</span>
        <span class="blend-shapes-value" style="width: calc(${+shape.score * 100}% - 120px)">${(+shape.score).toFixed(4)}</span>
      </li>`
  })
  el.innerHTML = htmlMaker
}

const upload = ref<UploadInstance>()
const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

const imgSrc = ref(Pic7)
const handleImageChange: UploadProps['onChange'] = (uploadFile) => {
  imgSrc.value = URL.createObjectURL(uploadFile.raw!)
  // 删除之前绘制的所有标记
  outPutCanvasCtx.clearRect(0, 0, outPutCanvas.width, outPutCanvas.height)
}
</script>
<template>
  <p class="h-[100px] leading-[100px] text-center text-4xl text-yellow-500"></p>
  <!-- <p class="h-[100px] leading-[100px] text-center text-4xl text-yellow-500">使用的：MediaPipe FaceLandmarker task</p> -->
  <div v-loading="loading" class="flex justify-between gap-10">
    <div class="border-2 border-dashed border-blue-400 text-center p-4">
      <el-upload
        ref="upload"
        class="upload-demo"
        :show-file-list="false"
        action="#"
        :limit="1"
        :on-exceed="handleExceed"
        :auto-upload="false"
        :on-change="handleImageChange"
      >
        <template #trigger>
          <el-button type="primary">选择人像图片</el-button>
        </template>
        <el-button class="ml-3" type="success" @click="handleClick">分析图片</el-button>
        <template #tip>
          <div class="el-upload__tip text-red">图片不会上传，只会在本地用作分析。</div>
        </template>
      </el-upload>
      <div class="relative">
        <img v-if="imgSrc" ref="img" :src="imgSrc" width="600" crossorigin="anonymous" title="Click to get detection!" />
        <canvas id="output-canvas" class="output-canvas absolute left-0 top-0"></canvas>
      </div>
    </div>
    <div class="flex-1 border-2 border-dashed border-red-400 p-4">
      <div v-for="(item, index) in faceLandmarks" :key="index" class="flex flex-col gap-4">
        <p v-if="item.categoryName.includes('eye')" :class="`my-1 py-2 ${item.score > 0.2 ? 'bg-emerald-400' : ''}`">
          <span class="inline-block w-[150px]">{{ item.categoryName }}</span>
          :
          <span>{{ item.score.toFixed(4) }}</span>
        </p>
      </div>
    </div>

    <!-- <img src="https://storage.googleapis.com/mediapipe-assets/portrait.jpg" width="100%" crossorigin="anonymous" title="Click to get detection!" /> -->
    <!-- <section id="demos">
      <div class="detectOnClick">
      </div>
      <div class="blend-shapes">
        <ul id="image-blend-shapes" class="blend-shapes-list"></ul>
      </div>
    </section> -->
  </div>
</template>
<style lang="scss" scoped>
.output-canvas {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
