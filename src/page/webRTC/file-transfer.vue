<script setup lang="ts">
import { ElMessage } from 'element-plus'
import io, { Socket } from 'socket.io-client'

const peerConnection = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.voipbuster.com' }] })
const userId = $ref(Math.random().toString(36).substring(2))
const roomId = ref('123')
let socket: Socket
let offerSdp: string

// 连接并加入房间
function initConnect() {
  if (!roomId.value) {
    ElMessage.error('请输入房间号')
    return
  }
  socket = io('https://signaling.fedtop.com')

  // 连接成功时触发
  socket.on('connect', () => {
    handleConnect()
  })

  // 断开连接时触发
  socket.on('disconnect', (reason) => {
    if (reason === 'io server disconnect') {
      // 断线是由服务器发起的，重新连接。
      socket.connect()
    }
    ElMessage.warning('您已断开连接')
  })
  // 服务端发送报错信息
  socket.on('error', (data) => {
    ElMessage.error(data)
  })
  // 当有用户加入房间时触发
  socket.on('welcome', (data) => {
    ElMessage.success(data.userId === userId ? '🦄成功加入房间' : `🦄${data.userId}加入房间`)
  })
  // 当有用户离开房间时触发
  socket.on('leave', (data) => {
    ElMessage.warning(data.userId === userId ? '🦄成功离开房间' : `🦄${data.userId}离开房间`)
  })
  // 当有用户发送消息时触发
  socket.on('message', (data) => {})
  // 创建offer,发送给远端
  socket.on('createOffer', (data) => {
    // 发送 offer
    if (offerSdp) {
      socket.emit('offer', {
        userId,
        roomId: roomId.value,
        sdp: offerSdp,
      })
      return
    }
    createOffer()
  })
  // 收到offer,创建answer
  socket.on('offer', (data) => {
    createAnswer(data.sdp)
  })
  // 收到answer,设置远端sdp
  socket.on('answer', (data) => {
    addAnswer(data.sdp)
  })
}

// 连接成功
function handleConnect() {
  socket.emit('join', { userId, roomId: roomId.value })
}

// 创建 offer
async function createOffer() {
  // 当一个新的offer ICE候选人被创建时触发事件
  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      offerSdp = JSON.stringify(peerConnection.localDescription)
      // 发送 offer
      if (offerSdp) {
        socket.emit('offer', {
          userId,
          roomId: roomId.value,
          sdp: offerSdp,
        })
      }
    }
  }
  const offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)
}

// 创建 answer
async function createAnswer(val: string) {
  const offer = JSON.parse(val)
  peerConnection.onicecandidate = async (event) => {
    // 当一个新的 answer ICE candidate 被创建时
    if (event.candidate) {
      socket.emit('answer', {
        userId,
        roomId: roomId.value,
        sdp: JSON.stringify(peerConnection.localDescription),
      })
    }
  }
  await peerConnection.setRemoteDescription(offer)
  const answer = await peerConnection.createAnswer()
  await peerConnection.setLocalDescription(answer)
}

// 添加 answer
async function addAnswer(answerSdp: string) {
  const answer = JSON.parse(answerSdp)
  if (!peerConnection.currentRemoteDescription) {
    peerConnection.setRemoteDescription(answer)
  }
}

// 离开房间
function handleLeave() {
  // 关闭对等连接
  peerConnection.close()
  // 发送离开的消息
  socket.emit('leave', { userId, roomId: roomId.value })
  // 关闭socket连接
  socket.disconnect()
}

// 格式化文件尺寸
function readableBytes(bytes: number) {
  if (bytes === 0) return '0 B'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`
}

let downloadStart = true // 下载开始状态
let bytesReceived = 0 // 已接收的字节数
let incomingFileInfo: { name: string; size: number } = { name: '', size: 0 } // 文件信息
const incomingFileData: BlobPart[] = [] // 文件数据
const fileRef = ref() // 文件选择器
// const BYTE_PER_CHUNK = 1200 // 每次发送的字节数
const reader = new FileReader() // 文件读取器
let currentChunk = 0 // 当前发送的chunk

// 接收对方发送的文件
function handleReceiveFile(data: any) {
  if (downloadStart) {
    // 先接收文件信息
    incomingFileInfo = JSON.parse(data)
    downloadStart = false
    return
  }
  incomingFileData.push(data)
  bytesReceived += data.byteLength
  // 接收完成
  if (bytesReceived === incomingFileInfo.size) {
    downloadStart = false
    bytesReceived = 0
    ElMessage.success('文件接收完成，请点击下载')
  }
}

// 发送文件
function handleSendFile() {
  const file = fileRef.value?.files?.[0]
  if (!file) {
    ElMessage.warning('请选择文件')
    return
  }
  currentChunk = 0
  // 发送文件名
  dataChannel.send(JSON.stringify({ name: file.name, size: file.size }))
  // 发送文件内容
  readFileData()
}

// 读取文件内容
async function readFileData() {
  let offset = 0
  let buffer = null
  const file = fileRef.value?.files?.[0]
  const chunkSize = peerConnection.sctp?.maxMessageSize
  if (!chunkSize) return
  while (offset < file.size) {
    const slice = file.slice(offset, offset + chunkSize)
    buffer = await slice.arrayBuffer()
    // 为了避免数据通道的缓存队列过大，导致数据发送延迟或者阻塞。
    // 当数据通道的缓存队列大小超过了 65535 字节时，就会暂停发送数据，等待缓存队列降到阈值之下再继续发送数据。这样可以保证数据通道的稳定性和可靠性。
    if (dataChannel.bufferedAmount > 65535) {
      // 等待缓存队列降到阈值之下
      await new Promise((resolve) => {
        dataChannel.onbufferedamountlow = (ev) => {
          console.warn(`bufferedamountlow event! bufferedAmount: ${dataChannel.bufferedAmount}`)
          resolve(0)
        }
      })
    }
    // 可以发送数据了
    dataChannel.send(buffer)
    offset += buffer.byteLength
  }
}

// 下载文件
function downloadFile(data: BlobPart[], fileName: string) {
  const blob = new Blob(data, { type: 'application/octet-stream' })
  // const blob = new Blob(incomingFileData, { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)
}

// 创建文件通道
const dataChannel = peerConnection.createDataChannel('my-channel', {
  // ordered: true, // 保证到达顺序
  maxRetransmits: 50, // 最大重传次数
  negotiated: true, // 双向通信
  id: 0, // 通道id
})
dataChannel.binaryType = 'arraybuffer'
// dataChannel.bufferedAmountLowThreshold = 64 * 1024 // 64kb

// 监听文件通道状态
// 当文件通道状态发生变化时触发
dataChannel.onopen = (event) => {
  const chunkSize = peerConnection.sctp?.maxMessageSize
  ElMessage.success('文件通道已打开')
}

// 当文件通道关闭时触发
dataChannel.onclose = (event) => {
  ElMessage.warning('文件通道已关闭')
  console.warn('🚀🚀🚀 onclose', event)
}

// 当文件通道发生错误时触发
dataChannel.onerror = (event) => {
  ElMessage.error('文件通道发生错误')
  console.error('🚀🚀🚀 onerror', event)
}

// 当文件通道收到消息时触发
dataChannel.onmessage = (event) => {
  handleReceiveFile(event.data)
}

// 当发送缓冲区的大小低于其缓冲区阈值时触发此事件。这是一个提示，告诉您可以安全地发送更多数据。
dataChannel.onbufferedamountlow = (event) => {
  console.warn('🤖🤖🤖 onbufferedamountlow', event)
}

// answer 端可根据 offer 端的 ondatachannel 事件拿到 RTCDataChannel
// 最简单直接的就是，直接开启双向通信，不需要等待 offer 端的 ondatachannel 事件
// peerConnection.ondatachannel = (event) => {
//   // 成功拿到 RTCDataChannel
//   const localDataChannel = event.channel
//   // 监听文件通道状态
//   localDataChannel.onmessage = (event) => {
//     console.log('🚀🚀🚀 / localDataChannel', event)
//   }
// }
</script>
<template>
  <FilepathBox :file-path="'__filePath__'" />
  <div class="flex justify-center flex-col items-center w-[600px] mx-auto mt-[200px] bg-slate-600 p-4">
    <div class="h-[300px] w-full text-center grid grid-cols-2 gap-[50px] items-center justify-around mb-4">
      <!-- 发送的文件 -->
      <div class="bg-slate-400 h-full overflow-y-auto text-left p-2 rounded-lg relative">
        <div class="flex justify-between items-center">
          <!-- <span>发送的文件</span> -->
          <input ref="fileRef" type="file" name="" />
          <el-button type="primary" size="small" @click="handleSendFile">发送</el-button>
        </div>
        <div>已发送的文件：</div>
        <div v-for="item in 10" :key="item" class="bg-teal-600 m-1 p-2 text-left flex justify-between rounded-md items-center">
          <div class="text-white">
            <span>文件 {{ item }}</span>
            <span>{{ (item * Math.random()).toFixed(2) }}MB</span>
          </div>
          <el-progress :width="30" type="circle" :percentage="100" status="success" />
        </div>
      </div>
      <!-- 接收的文件 -->
      <div class="bg-green-300 h-full overflow-y-auto text-center p-2 rounded-lg">
        <span>接收的文件</span>
        <div v-if="downloadStart" class="bg-teal-600 m-1 p-2 text-left flex justify-between rounded-md items-center">
          <span class="text-white">{{ incomingFileInfo.name }} {{ readableBytes(incomingFileInfo.size || 0) }}</span>
          <el-button type="primary" size="small" @click="downloadFile(incomingFileData, incomingFileInfo.name)">下载</el-button>
        </div>
        <!-- <div v-for="item in 10" :key="item" class="bg-teal-600 m-1 p-2 text-left flex justify-between rounded-md items-center">
          <span class="text-white">文件 {{ item }} --- {{ (item * Math.random()).toFixed(2) }}MB</span>
          <el-button type="primary" size="small" @click="downloadFile">下载</el-button>
        </div> -->
      </div>
    </div>
    <div class="flex gap-[10px] items-center justify-between w-full text-white">
      <span>用户名：</span>
      <el-input v-model="userId" style="width: 100px; margin-right: 20px" placeholder="用户名" clearable @keyup.enter="initConnect"></el-input>
      <span>房间号：</span>
      <el-input v-model="roomId" style="width: 100px; margin-right: 20px" placeholder="房间号" clearable @keyup.enter="initConnect"></el-input>
      <el-button type="primary" @click="initConnect">加入</el-button>
      <el-button type="danger" @click="handleLeave">离开</el-button>
    </div>
  </div>
</template>
<style lang="scss">
// .el-progress {
//   width: 40px !important;
//   height: 40px !important;
// }

// .el-progress--line {
//   margin-bottom: 15px !important;
//   width: 40px !important;
// }

// .el-progress__text {
//   font-size: 12px !important;
//   width: 40px !important;
//   height: 40px !important;
// }

// .el-progress-circle {
//   margin-right: 15px !important;
//   width: 40px !important;
//   height: 40px !important;
// }
</style>
