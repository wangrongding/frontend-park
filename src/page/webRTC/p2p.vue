<script setup lang="ts">
// import adapter from 'webrtc-adapter'
import 'webrtc-adapter'

// 创建
const peerConnection = new RTCPeerConnection({
  iceServers: [{ urls: 'stun:stun.voipbuster.com ' }],
})
let localStream: MediaStream
let remoteStream: MediaStream

const offerSdp = ref('')
const answerSdp = ref('')

// 初始化
const init = async () => {
  // 获取本地端视频标签
  const localVideo = document.getElementById('local') as HTMLVideoElement
  // 获取远程端视频标签
  const remoteVideo = document.getElementById('remote') as HTMLVideoElement
  // 获取本地媒体流
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  })
  // 创建远程空媒体流
  remoteStream = new MediaStream()
  // 设置本地视频流
  localVideo.srcObject = localStream
  // 设置远程视频流
  remoteVideo.srcObject = remoteStream
  // 添加本地流到 peerConnection
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream)
  })
  // 已经过时的方法 [addStream API](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addStream)
  // peerConnection.addStream(localStream);
  // 监听远程流
  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track)
    })
  }
}

function test() {
  // console.log('test', peerConnection)
}

// 创建 offer（提案）
const createOffer = async () => {
  peerConnection.onicecandidate = async (event) => {
    // Event that fires off when a new offer ICE candidate is created
    if (event.candidate) {
      offerSdp.value = JSON.stringify(peerConnection.localDescription)
    }
  }
  const offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)
  // await peerConnection.setLocalDescription()
}

// 创建 answer
const createAnswer = async () => {
  // 解析字符串
  const offer = JSON.parse(offerSdp.value)
  peerConnection.onicecandidate = async (event) => {
    // Event that fires off when a new answer ICE candidate is created
    if (event.candidate) {
      answerSdp.value = JSON.stringify(peerConnection.localDescription)
    }
  }
  await peerConnection.setRemoteDescription(offer)
  const answer = await peerConnection.createAnswer()
  await peerConnection.setLocalDescription(answer)
}

// 添加 answer(应答)
const addAnswer = async () => {
  // console.log('answer:', answer)
  const answer = JSON.parse(answerSdp.value)
  if (!peerConnection.currentRemoteDescription) {
    peerConnection.setRemoteDescription(answer)
  }
}

function copyToClipboard(val: string) {
  navigator.clipboard.writeText(val)
}

// // 获取本地流
// navigator.mediaDevices
//   .getUserMedia({
//     video: true,
//     audio: true,
//   })
//   .then((stream) => {
//     const localVideo = document.getElementById('local') as HTMLVideoElement
//     localVideo.srcObject = stream
//   })

// 设置本地视频流
onMounted(async () => {
  init()
})
</script>
<template>
  <FilepathBox :file-path="'__filePath__'" />
  <div class="page-container">
    <div class="video-container">
      <video id="local" autoplay playsinline muted></video>
      <video id="remote" autoplay playsinline></video>
    </div>
    <div class="operation">
      <div class="step">
        <p>
          用户 1，点击 Create Offer，生成 SDP offer，把下面生成的offer
          复制给用户 2
        </p>
        <el-button
          id="create-offer"
          type="primary"
          size="default"
          @click="createOffer"
        >
          创建 Offer
        </el-button>
        <el-button
          id="create-offer"
          type="primary"
          size="default"
          @click="test"
        >
          测试按钮
        </el-button>
        <p>SDP offer:</p>
        <el-input
          v-model="offerSdp"
          placeholder="User 2, paste SDP offer here..."
        >
          <template #append>
            <el-button
              type="success"
              size="default"
              @click="copyToClipboard(offerSdp)"
            >
              点击复制
            </el-button>
          </template>
        </el-input>
      </div>

      <div class="step">
        <p>
          用户 2将用户1 刚才生成的SDP offer 粘贴到下方，点击 "创建答案
          "来生成SDP答案，然后将 SDP Answer 复制给用户 1。
        </p>

        <el-input
          v-model="offerSdp"
          placeholder="User 2, paste SDP offer here..."
        >
          <template #append>
            <el-button type="success" size="default" @click="createAnswer">
              创建 Answer
            </el-button>
          </template>
        </el-input>

        <p>SDP Answer:</p>
        <el-input v-model="answerSdp" placeholder="生成的SDP answer">
          <template #append>
            <el-button
              type="success"
              size="default"
              @click="copyToClipboard(answerSdp)"
            >
              点击复制
            </el-button>
          </template>
        </el-input>
      </div>

      <p>SDP Answer:</p>
      <el-input
        v-model="answerSdp"
        placeholder="User 1, paste SDP answer here..."
      >
        <template #prepend>
          <el-button
            type="success"
            size="default"
            @click="copyToClipboard(answerSdp)"
          >
            点击复制
          </el-button>
        </template>
        <template #append>
          <el-button type="success" size="default" @click="addAnswer">
            Add Answer
          </el-button>
        </template>
      </el-input>

      <div class="step">
        <b>3.</b>
        创建者，将 加入者 产生的SDP offer 粘贴到上面的文本区域，然后点击 Add
        Answer。
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.page-container {
  height: 100%;
  user-select: text;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  .video-container {
    max-width: 500px;
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr;
    gap: 1em;
    width: 100%;
    padding: 10px;

    video {
      width: 100%;
      height: 100%;
      border: 4px solid #048ff2;
      background-color: #516fa3;
      border-radius: 30px;
    }
  }

  .operation {
    width: 520px;

    .step {
      padding: 30px;
      background-color: #516fa3;
      margin: 10px 0;
      color: white;
      border-radius: 20px;
    }
  }
}
</style>
