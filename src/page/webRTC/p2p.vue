<script setup lang="ts">
import 'webrtc-adapter'

// 创建一条由本地计算机到远端的 WebRTC 连接
const pc = new RTCPeerConnection({
  iceServers: [{ urls: 'stun:stun.voipbuster.com ' }],
})

// 创建本地和远端的空媒体流
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
  // 设置本地视频流
  localVideo.srcObject = localStream
  // 添加本地流到 pc
  localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream)
  })

  // 已经过时的方法 [addStream API](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addStream)
  // pc.addStream(localStream);

  // 监听远程流，方法一：
  pc.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0]
  }

  // 方法二：你也可以使用 addStream API，来更加详细的控制流的添加
  // const remoteStream: MediaStream = new MediaStream()
  // pc.ontrack = (event) => {
  //   event.streams[0].getTracks().forEach((track) => {
  //     remoteStream.addTrack(track)
  //   })
  //   // 设置远程视频流
  //   remoteVideo.srcObject = remoteStream
  // }
}

// 创建 offer（提案）
const createOffer = async () => {
  const offer = await pc.createOffer()
  await pc.setLocalDescription(offer)
  // await pc.setLocalDescription()
  // 到这里，我们本地的 offer 就创建好了，一般在这里通过信令服务器发送 offerSdp 给远端

  // 监听 RTCPeerConnection 的 onicecandidate 事件，当 ICE 服务器返回一个新的候选地址时，就会触发该事件
  pc.onicecandidate = async (event) => {
    if (event.candidate) {
      offerSdp.value = JSON.stringify(pc.localDescription)
    }
  }
}

// 创建 answer
const offerSdp2 = ref('')
const createAnswer = async () => {
  // 解析字符串
  const offer = JSON.parse(offerSdp2.value)
  pc.onicecandidate = async (event) => {
    // Event that fires off when a new answer ICE candidate is created
    if (event.candidate) {
      answerSdp.value = JSON.stringify(pc.localDescription)
    }
  }
  await pc.setRemoteDescription(offer)
  const answer = await pc.createAnswer()
  await pc.setLocalDescription(answer)
}

// 添加 answer(应答)
const answerSdp2 = ref('')
const addAnswer = async () => {
  const answer = JSON.parse(answerSdp2.value)
  if (!pc.currentRemoteDescription) {
    pc.setRemoteDescription(answer)
  }
}

// 复制内容到剪贴板
function copyToClipboard(val: string) {
  navigator.clipboard.writeText(val)
}

onMounted(async () => {
  // 初始化
  init()
})
</script>
<template>
  <FilepathBox :file-path="'__filePath__'" />
  <div class="page-container">
    <div class="video-container">
      <div class="video-box">
        <video id="local" autoplay playsinline muted></video>
        <div class="video-title">我</div>
      </div>
      <div class="video-box">
        <video id="remote" autoplay playsinline></video>
        <div class="video-title">远程视频</div>
      </div>
    </div>
    <div class="operation">
      <!-- step1 -->
      <div class="step">
        <div class="user">用户 1 的操作区域</div>
        <p class="desc">
          点击 Create Offer，生成 SDP offer，把下面生成的offer 复制给用户 2
          <el-button id="create-offer" type="primary" @click="createOffer">
            创建 Offer
          </el-button>
        </p>

        <p>SDP offer:</p>
        <el-input v-model="offerSdp">
          <template #append>
            <el-button type="success" @click="copyToClipboard(offerSdp)">
              点击复制
            </el-button>
          </template>
        </el-input>
      </div>
      <!-- step2 -->
      <div class="step">
        <div class="user">用户 2 的操作区域</div>
        <p>
          用户 2将用户1 刚才生成的SDP offer 粘贴到下方，点击 "创建答案
          "来生成SDP答案，然后将 SDP Answer 复制给用户 1。
        </p>

        <el-input v-model="offerSdp2">
          <template #append>
            <el-button type="success" size="default" @click="createAnswer">
              创建 Answer
            </el-button>
          </template>
        </el-input>

        <p>SDP Answer:</p>
        <el-input v-model="answerSdp">
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
      <!-- step3 -->
      <div class="step">
        <div class="user">用户 1 的操作区域</div>

        <p>将用户 2 创建的 Answer 粘贴到下方，然后点击 Add Answer。</p>

        <p>SDP Answer:</p>
        <el-input v-model="answerSdp2">
          <template #append>
            <el-button type="success" size="default" @click="addAnswer">
              Add Answer
            </el-button>
          </template>
        </el-input>
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

    .video-box {
      position: relative;

      .video-title {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: rgb(0 0 0 / 50%);
        color: #fff;
        text-align: center;
        padding: 5px 0;
      }
    }

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

      .user {
        width: 200px;
        text-align: center;

        // font-size: 18px;
        padding: 10px;
        font-weight: bold;
        background: #36495d;
        border-radius: 20px;
      }

      .desc {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 10px 0;
        gap: 20px;
      }
    }
  }
}
</style>
