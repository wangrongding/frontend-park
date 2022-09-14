<script setup lang="ts">
const peerConnection = new RTCPeerConnection()
let localStream: MediaStream
let remoteStream: MediaStream

const offerSdp = ref('')
const answerSdp = ref('')

const init = async () => {
  const localVideo = document.getElementById('local') as HTMLVideoElement
  const remoteVideo = document.getElementById('remote') as HTMLVideoElement
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  })
  remoteStream = new MediaStream()
  localVideo.srcObject = localStream
  remoteVideo.srcObject = remoteStream

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream)
  })

  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track)
    })
  }
}

const createOffer = async () => {
  peerConnection.onicecandidate = async (event) => {
    // Event that fires off when a new offer ICE candidate is created
    if (event.candidate) {
      offerSdp.value = JSON.stringify(peerConnection.localDescription)
    }
  }
  const offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)
}

const createAnswer = async () => {
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

const addAnswer = async () => {
  // console.log('Add answer triggerd')
  const answer = JSON.parse(answerSdp.value)
  // console.log('answer:', answer)
  if (!peerConnection.currentRemoteDescription) {
    peerConnection.setRemoteDescription(answer)
  }
}

function copyToClipboard(val: string) {
  navigator.clipboard.writeText(val)
}

onMounted(() => {
  init()
})
</script>
<template>
  <FilepathBox :file-path="'__filePath__'" />
  <div class="page-container">
    <div class="video-container">
      <video id="local" autoplay playsinline></video>
      <video id="remote" autoplay playsinline></video>
    </div>
    <div class="operation">
      <el-button
        id="create-offer"
        type="primary"
        size="default"
        @click="createOffer"
      >
        Create Offer
      </el-button>
      <div class="step">
        <b>1.</b>
        随便一个人，点击 Create Offer，生成 SDP offer
        ，并从下面的文本区域复制offer。（点完，第二个人就不用再点这个按钮了）
      </div>

      <p>SDP offer:</p>
      <el-input
        v-model="offerSdp"
        placeholder="User 2, paste SDP offer here..."
      >
        <template #prepend>
          <el-button
            type="success"
            size="default"
            @click="copyToClipboard(offerSdp)"
          >
            点击复制
          </el-button>
        </template>
        <template #append>
          <el-button type="success" size="default" @click="createAnswer">
            Create Answer
          </el-button>
        </template>
      </el-input>
      <div class="step">
        <b>2.</b>
        第二个人将刚才第一个人生成的SDP报价粘贴到上面的文本区域，然后 点击
        "创建答案 "来生成SDP答案，并从下面的文本区域复制答案。给第一个人。
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
    width: 500px;

    .step {
      background-color: beige;
      padding: 10px;
      margin: 10px 0;
    }
  }
}
</style>
