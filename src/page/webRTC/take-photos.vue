<script setup lang="ts">
import multiavatar from '@multiavatar/multiavatar/esm'
import { ElMessage } from 'element-plus'

const formParams = reactive({
  data: {
    videoInput: '',
  }, // 表单数据对象
  formList: {
    videoInput: {
      type: 'select',
      label: '切换设备',
      placeholder: '请选择',
      options: [] as MediaDeviceInfo[],
      optionValueKey: 'deviceId',
      optionLabelKey: 'label',
      onChange: (deviceId: string) => {
        handleDeviceChange(deviceId)
      },
    },
    directionType: {
      type: 'select',
      label: '切换方向',
      placeholder: '请选择',
      options: [
        { label: '前置摄像头', value: 1 },
        { label: '后置摄像头', value: 2 },
      ],
      optionValueKey: 'value',
      optionLabelKey: 'label',
      onChange: switchCamera,
    },
  },
  labelColor: '#fff',
  inline: false,
})

const state = reactive({
  devicesId: '',
  constraints: {
    audio: false,
    video: true,
  } as MediaStreamConstraints,
})

const imgData = ref('')
const imgList = ref<string[]>([])
// 切换前后摄像头
function switchCamera(val: number) {
  state.constraints.video = {
    // 强制切换前后摄像头
    facingMode: { exact: val === 1 ? 'user' : 'environment' },
    // 也可以这样当前后摄像头不支持切换时，会继续使用当前摄像头，好处是不会报错
    // facingMode: val === 1 ? 'user' : 'environment',
  }

  navigator.mediaDevices
    .getUserMedia(state.constraints)
    .then((stream) => {
      ElMessage.success('切换成功')
      playLocalStream(stream)
    })
    .catch((err) => {
      ElMessage.error('你的设备不支持切换前后摄像头')
    })
}

// 切换设备
function handleDeviceChange(deviceId: string) {
  state.constraints.video = {
    deviceId: { exact: deviceId },
  }
  getLocalStream()
}

// 获取当前的设备ID
function getDevicesId() {
  const videoEl = document.getElementById('localVideo') as any
  const currentDeviceId = videoEl!.srcObject
    .getVideoTracks()[0]
    .getSettings().deviceId
  // console.log('🚀🚀🚀 / currentDeviceId', currentDeviceId)
}

// 获取所有音视频设备
async function getDevices() {
  const devices = await navigator.mediaDevices.enumerateDevices()
  formParams.formList.videoInput.options = devices.filter(
    (device) => device.kind === 'videoinput',
  )
}

// 获取本地音视频流
async function getLocalStream(
  options: MediaStreamConstraints = state.constraints,
) {
  const stream = await navigator.mediaDevices.getUserMedia(options)
  playLocalStream(stream)
}

// 播放本地视频流
function playLocalStream(stream: MediaStream) {
  const videoEl = document.getElementById('localVideo') as HTMLVideoElement
  videoEl.srcObject = stream
  videoEl.addEventListener('loadedmetadata', () => {})
}

// 拍照
function takePhoto() {
  const videoEl = document.getElementById('localVideo') as HTMLVideoElement
  const canvas = document.createElement('canvas')
  canvas.width = videoEl.videoWidth
  canvas.height = videoEl.videoHeight
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height)
  imgList.value.push(canvas.toDataURL('image/png'))
  // add filter
  const filterList = [
    'blur(5px)', // 模糊
    'brightness(0.5)', // 亮度
    'contrast(200%)', // 对比度
    'grayscale(100%)', // 灰度
    'hue-rotate(90deg)', // 色相旋转
    'invert(100%)', // 反色
    'opacity(90%)', // 透明度
    'saturate(200%)', // 饱和度
    'saturate(20%)', // 饱和度
    'sepia(100%)', // 褐色
    'drop-shadow(4px 4px 8px blue)', // 阴影
  ]

  for (let i = 0; i < filterList.length; i++) {
    ctx.filter = filterList[i]
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height)
    imgList.value.push(canvas.toDataURL('image/png'))
  }
}

function handleError(error: Error) {
  Error('error: ', error)
}

function createAvatar(val: any) {
  const blob = new Blob([multiavatar(val + new Date().getTime())], {
    type: 'image/svg+xml;charset=utf-8',
  })
  const link = URL.createObjectURL(blob)
  return link
}
onMounted(() => {
  getDevices()
  getLocalStream({
    audio: false,
    video: true,
    // video: { facingMode: { exact: 'environment' } },
    // video: { facingMode: { exact: 'user' } },
  })
})
</script>
<template>
  <FilepathBox :file-path="'__filePath__'" />
  <div class="webrtc-container">
    <div class="photo-list">
      <div
        v-for="item in imgList.length !== 0 ? imgList : 100"
        :key="item"
        class="item"
      >
        <img
          :src="imgList.length !== 0 ? item as any : createAvatar(item)"
          alt=""
        />
      </div>
    </div>
    <div class="control">
      <video id="localVideo" autoplay playsinline muted></video>
      <SuperForm :form-params="formParams" />
      <el-button type="primary" size="default" @click="takePhoto">
        拍照
      </el-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.webrtc-container {
  display: flex;
  justify-content: space-between;

  // align-items: center;

  .photo-list {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fit, 300px);
    gap: 20px;

    // grid-template-columns: repeat(auto-fit, minmax(100px, 100px));

    .item-image {
      width: 300px;
      height: 300px;
      object-fit: contain;
      overflow: hidden;

      // border: 2px dashed #333;
      // border-radius: 50%;
      // object-fit: cover;
    }
  }

  .control {
    position: sticky;
    top: 100px;
    right: 20px;

    // position: fixed;
    // top: 80px;
    // right: 20px;
    background-color: #516fa3;
    border: 5px solid #99beff;
    border-radius: 50px;

    // width: 300px;
    min-height: 400px;
    max-height: 500px;
    min-width: 300px;
    max-width: 300px;
    padding: 20px;
    box-sizing: border-box;
    text-align: center;
  }
}
</style>
