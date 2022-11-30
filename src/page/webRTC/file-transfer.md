# 基于 WebRTC 的 P2P 文件传输

![](https://assets.fedtop.com/picbed/202211302228729.png)

[👉🏻 本文示例源代码地址](https://github.com/wangrongding/frontend-park)  
[👉🏻 本文示例在线体验地址](https://frontend-park.vercel.app/audio-and-video/webRTC/file-transfer)

为了演示数据通道建连效果，需要在至少两个浏览器窗口打开以上地址，或者使用多个设备，推荐使用 Chrome 浏览器。

## 前言

WebRTC 是一个实时通信的技术，它提供了一套 API，可以让浏览器实现 P2P 通信，而且不需要额外的插件，这使得 WebRTC 成为了一种非常有前景的技术。在前面几篇文章中，我们已经介绍了 WebRTC 的基本概念和使用，包括音视频通话、屏幕共享、媒体流的处理，还有 WebRTC 与 Tensorflow.js 的结合。从文章的点赞数可以看出来大家对这门技术非常感兴趣。

而这次，我将介绍 WebRTC 的另一个重要功能：P2P 文件传输。

![](https://assets.fedtop.com/picbed/202211302234791.png)

## P2P 文件传输

WebRTC 是一种实时通信协议，它可以在浏览器之间进行点对点通信。在 WebRTC 中，不仅可以实现音视频通话，我们还能通过数据通道来传输文本、文件等数据。它可以在浏览器之间进行点对点通信，而且不需要额外的插件，这使得 WebRTC 成为了一种非常有前景的技术。 RTCDataChannel 支持的数据类型也非常多，包括：字符串、Blob、ArrayBuffer...

所以我们可以通过 `DataChannel` 提供的 API 非常方便的实现点对点的数据传输。而这个特点可以被我们用来传输文件，文本聊天等。。。

## 实现

- 双向数据通道
- 分段文件传输，支持传输大文件
- 自动生成下载链接

### 创建数据通道

首先，我们需要创建一个数据通道，用来传输数据。在 WebRTC 中，数据通道是通过 `RTCPeerConnection` 来创建的，它是一个基于 `RTCPeerConnection` 的抽象类，它提供了一些 API，可以用来创建数据通道。

```typescript
// 创建 RTCPeerConnection 对象
var pc = new RTCPeerConnection()
// 创建数据通道
const dataChannel = this.peerConnection.createDataChannel('fileTransfer', {
  ordered: true, // 保证到达顺序
})
```

其中 createDataChannel 接收两个参数，第一个是数据通道的名称，第二个是数据通道的配置，这里我们设置了 ordered 为 true，表示保证数据到达顺序。

当然它还有其他的配置，比如：maxPacketLifeTime、maxRetransmits、protocol、negotiated、id。

- ordered：消息的传递是否有序
- maxPacketLifeTime：重传消息失败的最长时间
- maxRetransmits：重传消息失败的最大次数
- protocol：用户自定义的子协议, 默认为空
- negotiated：如果为 true，则会删除另一方数据通道的自动设置
- id：当 negotiated 为 true 时，允许你提供自己的 ID 与 channel 进行绑定

为什么这里我先创建数据通道呢？因为在建立 p2p 连接之后，再建立数据通道，会导致再次触发 negotiationneeded 事件，这样就会导致 ICE 重新协商。 当然，创建数据通道的时机是可以自己根据实际情况控制的，这里我提前建立好，然后它会和媒体流一起进行 ICE 协商。

### 定义数据通道事件

接下来，我们需要定义数据通道的事件，这里我们需要定义的事件有：

```typescript
// 监听文件通道状态
// 当文件通道状态发生变化时触发
dataChannel.onopen = (event) => {
  ElMessage.success('文件通道已打开')
  console.log('🚀🚀🚀 / event', event)
}

// 当文件通道关闭时触发
dataChannel.onclose = (event) => {
  ElMessage.warning('文件通道已关闭')
}

// 当文件通道发生错误时触发
dataChannel.onerror = (event) => {
  ElMessage.error('文件通道发生错误')
}

// 当文件通道收到消息时触发
dataChannel.onmessage = (event) => {
  // eslint-disable-next-line no-console
  console.log('🚀🚀🚀 / event', event)
}
```

### WebRTC 建立 P2P 连接

这一块我们仍然用专栏第三篇文章中建立连接的代码。 我把它重新整理了一下，去除了不必要的代码，只保留了建立连接的代码。 如果这块你不太懂，没有跟着我之前的文章过来的话，可以去看看专栏第三篇文章~~😀 地址：[WebRTC 实现视频通话](https://juejin.cn/post/7170767923005358094)~~

```typescript
import io, { Socket } from 'socket.io-client'

const peerConnection = new RTCPeerConnection({
  iceServers: [
    {
      urls: 'stun:stun.voipbuster.com ',
    },
  ],
})

const userId = $ref(Math.random().toString(36).substring(2))
const roomId = ref('')
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

const init = async () => {}

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
```

### 信令服务

这一块也和 建立连接的逻辑代码一样，使用的是第三篇中的 socket.io 实现的相关逻辑，这里就不再赘述了。

```javascript
import http from 'http'
import { Server } from 'socket.io'
import express from 'express'
// import cors from 'cors'

const port = 3000
const app = express()
const httpServer = http.createServer(app)
// 创建信令服务器
const io = new Server(httpServer, {
  cors: {
    origin: '*', // 允许跨域
    methods: ['GET', 'POST'], // 允许的请求方式
    allowedHeaders: '*', // 允许的请求头
    credentials: true, // 允许携带cookie
  },
  allowEIO3: true, // 是否启用与Socket.IO v2客户端的兼容性
  transport: ['websocket'], // 仅允许websocket,["polling", "websocket"]
})

// 解决了所有请求头和方式设置的繁琐问题,要携带cookie时，这种方式不适合
// app.use(cors());
// =======
//设置跨域访问
app.all('*', (req, res, next) => {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header('Access-Control-Allow-Origin', '*')
  //允许的header类型
  res.header('Access-Control-Allow-Headers', 'content-type')
  //跨域允许的请求方式
  res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS')
  //让options尝试请求快速结束
  if (req.method.toLowerCase() == 'options') res.send(200)
  else next()
})

// 随便写一个接口测试一下
app.get('/', (req, res) => {
  res.type('application/json')
  res.end(JSON.stringify({ status: 0, message: '测试成功~🌸' }, 'utf8'))
})

// 在指定端口启动服务器
httpServer.listen(port, '0.0.0.0', () => {
  console.log('\n Http server up and running at => http://%s:%s', httpServer.address().address, httpServer.address().port)
})

// 房间信息
const ROOM_LIST = []
// 每个房间最多容纳的人数
const MAX_USER_COUNT = 2

// 用户连接
io.on('connection', (socket) => {
  console.log('connection~')
  // 用户加入房间
  socket.on('join', (data) => {
    console.log('join~', data)
    handleUserJoin(socket, data)
  })
  // 用户离开房间
  socket.on('leave', (data) => {
    console.log('leave', data)
    handleUserDisconnect(socket)
  })
  // 监听连接断开
  socket.on('disconnect', () => {
    console.log('disconnect~')
    handleUserDisconnect(socket)
  })
  //=============================
  socket.on('offer', (data) => {
    // console.log('offer', data)
    socket.to(data.roomId).emit('offer', data)
  })
  socket.on('answer', (data) => {
    // console.log('answer', data)
    socket.to(data.roomId).emit('answer', data)
  })
  socket.on('candidate', (data) => {
    console.log('candidate', data)
  })
  socket.on('message', (data) => {
    // console.log('offer', data)
  })
})

// 用户连接触发
function handleUserConnection(socket, data) {}

// 用户加入房间
function handleUserJoin(socket, data) {
  const filterRoom = ROOM_LIST.filter((item) => item.roomId === data.roomId)[0]
  let room = { roomId: data.roomId, userList: [] }

  // 判断房间是否存在
  if (filterRoom) {
    room = filterRoom
  } else {
    ROOM_LIST.push(room)
  }

  // 每个房间人数不超过预设的人数
  if (room.userList.length >= MAX_USER_COUNT) {
    socket.emit('error', '房间人数已满，请稍后再试')
    return
  }

  // 当房间里的人数为0且管理员还没有设置，设置管理员
  if (room.userList.length === 0) {
    room.admin = data.userId
    // 通知自己创建 offer
    // socket.emit('createOffer', data)
  }

  // 判断用户是否已经在房间里
  const filterUser = room.userList.some((item) => item.userId === data.userId)
  if (filterUser) {
    socket.emit('error', '用户已在房间里')
    return
  }

  // 将用户信息保存到 socket 对象中
  socket.userId = data.userId
  socket.roomId = data.roomId

  // 将用户保存到 room 中
  room.userList.push(data)
  console.log(data.userId, '加入房间')
  // 将用户加入房间
  socket.join(data.roomId)
  // 通知房间内的所有人
  io.to(data.roomId).emit('welcome', data)
  // 通知房间内的其他用户创建 offer
  socket.to(data.roomId).emit('createOffer', data)

  console.log(
    '🚀🚀🚀userList',
    room.userList.map((item) => item.userId),
  )
}

// 用户断开连接或离开房间，清除房间内的用户信息，关闭房间，通知房间内的其他用户
function handleUserDisconnect(socket) {
  console.log('🚀🚀🚀 / handleUserDisconnect', socket.userId, socket.roomId)
  const roomId = socket.roomId
  const userId = socket.userId
  const room = ROOM_LIST.filter((item) => item.roomId === roomId)[0]
  if (room) {
    const userList = room.userList
    const filterUser = userList.filter((item) => item.userId === userId)[0]
    if (filterUser) {
      // 通知房间内的其他用户
      socket.to(roomId).emit('leave', filterUser)
      console.log(userId, '离开房间')
      // 清除房间内的用户信息
      room.userList = userList.filter((item) => item.userId !== userId)
      // 关闭房间
      if (room.userList.length === 0) {
        ROOM_LIST.splice(ROOM_LIST.indexOf(room), 1)
      }
    }
  }
}

//socket.io中文文档：  https://socket.io/zh-CN/docs/v4/server-api/
```

### 发送文件

这是后我们就已经建立好连接了，接下来，我们需要实现发送文件的功能，这里我们需要实现的功能有：

- 选择文件
- 分段文件传输
- 发送文件
- 接收文件
- 传输进度
- 生成下载链接

#### 选择文件

为了方便演示，我直接用原生的`input`标签+`type="file"`属性，提供的选择文件了，获取到文件后，点击发送按钮，就可以将文件发送给对方了。

```html
<div class="file">
  <input type="file" id="file" />
  <button id="send">发送</button>
</div>
```

#### 分段文件传输

实现 分段文件传输需要了解一下 `数据缓冲区`这个概念。

在 WebRTC 中，数据通道是基于数据缓冲区的，数据缓冲区是一种二进制数据的缓冲区，它可以存储任意类型的数据，包括字符串、二进制数据、JSON 对象等。数据缓冲区的 API 与 `ArrayBuffer` 类似，但是它提供了更多的方法，可以方便地操作数据缓冲区。

一般来说缓冲区默认最大为 256KB。如果数据通道要发送的数据超过了缓冲区的大小，就需要分段发送，等待上一段数据发送完成后，再发送下一段数据。要不然就会报错。导致浏览器的数据通道关闭，所以我们一般会通过`bufferedAmountLowThreshold`设置一个水位线。

我们使用 File 的 slice 方法来分段文件。然后通过返回的 Blob 对象读取 arrayBuffer，再通过 DataChannel 的 send 方法发送数据。

```js
// 分段文件传输
function sendFile(file) {
  const chunkSize = 16384 // 每次发送的字节数
  const fileReader = new FileReader()
  let offset = 0 // 已发送的字节数
  const fileSize = file.size // 文件总大小
  const chunkCount = Math.ceil(fileSize / chunkSize) // 总共需要发送的次数
  let currentChunk = 0 // 当前发送的次数
  const sendNext = () => {
    const fileReader = new FileReader()
    const start = offset
    const end = Math.min(offset + chunkSize, fileSize)
    fileReader.readAsArrayBuffer(file.slice(start, end))
    fileReader.onload = (e) => {
      dataChannel.send(e.target.result)
      offset += chunkSize
      currentChunk += 1
      if (offset < fileSize) {
        sendNext()
      }
    }
  }
  sendNext()
}
```

#### 接收文件

接收文件的时候，我们需要将接收到的数据存储到一个数组中，等到接收完成后，再将数组中的数据拼接成一个完整的文件。

我们需要接收两类文件数据： 文件元数据 和 文件的内容数据。其中文件元数据包含文件的名称、大小、类型等信息---用字符串的形式发送就可以。

```js
function handleDataMessage(channel, data) {
  log(`Receive data channel message ,type: ${typeof data}`)
  if (typeof data === 'string') {
    // 字符串
    log(`Receive string data from '${channel.protocol}', data: ${data}`)
    const mess = JSON.parse(data)
    if (mess.method === 'file') {
      // 文件元数据
      receiveFile.reset()
      receiveFile.name = mess.name
      receiveFile.size = mess.size
      receiveProgress.max = mess.size
    } else if (mess.method === 'message') {
      // 聊天消息
      handleReceivedMessage(mess)
    }

    return
  }

  // 文件内容数据
  log(`Receive binary data from '${channel.protocol}', size: ${data.byteLength}`)
  receiveFile.buffer.push(data)
  receiveFile.receivedSize += data.byteLength

  // 更新进度条
  receiveProgress.value = receiveFile.receivedSize

  // 更新接收速率
  const interval = new Date().getTime() - receiveFile.time
  bitrateSpan.textContent = ` ${Math.round((data.byteLength * 8) / interval)}kbps`
  receiveFile.time = new Date().getTime()

  if (receiveFile.receivedSize === receiveFile.size) {
    // 文件接收完了，开始下载
    downloadFile(receiveFile)
  }
}
```

<!-- 在我们过去的代码中，如果我们选择了一个巨大的文件（大于 100KB），那么文档很可能不会被发送，这是 WebRTC 通道的某些约束的直接结果。

每个数组缓冲区一次只能有 16KB 的限制。简而言之，这意味着我们必须将文档划分成小数组缓冲区。 -->

<!-- > 小文件可以通过 WebRTC 一次性发处，然而，对于大文档，明智的做法是将文件隔离到较小的数组缓冲区中，并同样发送每个部分。ArrayBuffer 和 Blob 对象都有削减容量，这使得此过程更加简单。为此，如果你仔细查看代码，你会发现我们使用了一个名为 stream saver 的模块，它可以将数组缓冲区转换回 blob。 -->

## 最后

这篇文章主要介绍了 WebRTC 中，如何使用 dataChannel 实现文件传输。这是一个简化的 demo，在实际开发中，我们还需要考虑很多问题。

我后面也会把这个 demo 完善一下。源码地址在 [👉🏻 这里](https://github.com/wangrongding/frontend-park), 欢迎 star。

如果本篇文章对你有所帮助，或者你有什么疑问，欢迎在评论区留言，我一般看到都会回复的。大家点赞支持一下啊~🌸
