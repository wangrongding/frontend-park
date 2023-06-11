<script setup lang="ts">
import vision from '@mediapipe/tasks-vision'
import { ElMessage } from 'element-plus'

const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision
let outPutCanvas: HTMLCanvasElement
let outPutCanvasCtx: CanvasRenderingContext2D
let faceLandmarker: vision.FaceLandmarker
let runningMode: 'IMAGE' | 'VIDEO' = 'IMAGE'
let video: HTMLVideoElement
let drawingUtils: vision.DrawingUtils
const loading = ref(false)

onMounted(() => {
  video = document.getElementById('webcam') as HTMLVideoElement
  outPutCanvas = document.querySelector('#output-canvas') as HTMLCanvasElement
  outPutCanvasCtx = outPutCanvas.getContext('2d')!
  drawingUtils = new DrawingUtils(outPutCanvasCtx)
})

async function createFaceLandmarker() {
  loading.value = true
  // const FileSetResolver = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm')
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

const faceLandmarks = ref<any[]>([])
const videoWidth = 480
let lastVideoTime = -1
let faceLandmarkerResult: vision.FaceLandmarkerResult
async function predictWebcam() {
  if (!faceLandmarker) {
    ElMessage.error('Wait for faceLandmarker to load before clicking!')
    return
  }
  const radio = video.videoHeight / video.videoWidth
  video.style.width = `${videoWidth}px`
  video.style.height = `${videoWidth * radio}px`
  outPutCanvas.style.width = `${videoWidth}px`
  outPutCanvas.style.height = `${videoWidth * radio}px`
  outPutCanvas.width = video.videoWidth
  outPutCanvas.height = video.videoHeight

  runningMode = 'VIDEO'
  await faceLandmarker.setOptions({ runningMode })

  const nowInMs = Date.now()
  if (lastVideoTime !== video.currentTime) {
    lastVideoTime = video.currentTime
    faceLandmarkerResult = faceLandmarker.detectForVideo(video, nowInMs)
  }
  faceLandmarkerResult.faceLandmarks.forEach((landmarks) => {
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
  if (faceLandmarkerResult && faceLandmarkerResult.faceLandmarks) faceLandmarks.value = faceLandmarkerResult.faceBlendshapes[0].categories
  window.requestAnimationFrame(predictWebcam)
}

function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}

async function getUserMedia() {
  if (!hasGetUserMedia()) {
    ElMessage.error('getUserMedia() is not supported by your browser')
    return
  }
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
  })
  video.srcObject = stream
  video.addEventListener('loadeddata', predictWebcam)
}

onMounted(async () => {
  await createFaceLandmarker()
  await getUserMedia()
})
</script>
<template>
  <p class="h-[100px] leading-[100px] text-center text-4xl text-yellow-500"></p>
  <div v-loading="loading" class="flex justify-between gap-10">
    <div class="border-2 border-dashed border-blue-400 text-center p-4">
      <div class="relative">
        <video id="webcam" width="480px" autoplay playsinline></video>
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
  </div>
</template>
<style lang="scss" scoped>
.output-canvas {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
