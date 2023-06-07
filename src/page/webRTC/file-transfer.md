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

```typescript
import io from 'socket.io-client'
const socket = io('https://localhost:3000')
```

然后我们需要监听一些服务端的事件，这个我们根据具体需求来定义。

socket.io 最主要的就是 `on` 和 `emit` 两个方法，在客户端 `on` 用来监听服务端的事件，`emit` 用来触发服务端的事件。在服务端 `on` 用来监听客户端的事件，`emit` 用来触发客户端的事件。还有一些其他的 api 我们直接对着文档来就行，所以说它使用起来非常的简单。

#### 定义客户端需要监听的事件

ok，我们先来看一下我们需要监听的事件。

```typescript
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
  // 如果已经创建过，直接发送
  if (offerSdp) {
    socket.emit('offer', {
      userId,
      roomId: roomId.value,
      sdp: offerSdp,
    })
    return
  }
  createOffer() // 创建 offer
})
// 收到offer,创建answer
socket.on('offer', (data) => {
  createAnswer(data.sdp)
})
// 收到answer,设置远端sdp
socket.on('answer', (data) => {
  addAnswer(data.sdp)
})
```

当然你也可以根据自己的习惯直接把所有事件都包在 `socket.on('message',(data)=>{})` 里，data 里加好 type 就行，这样只需要保留几个关键事件，其余的都走 message 事件的逻辑。

#### 定义信令服务端需要监听的事件

```javascript
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
  // 用户发送 offer
  socket.on('offer', (data) => {
    socket.to(data.roomId).emit('offer', data)
  })
  // 用户发送 answer
  socket.on('answer', (data) => {
    socket.to(data.roomId).emit('answer', data)
  })
  // 用户发送消息
  socket.on('message', (data) => {
    console.log('message', data)
  })
})
```

#### 客户端加入房间

接下来我们需要实现客户端加入房间的逻辑，这个逻辑其实就是告诉服务端，我要加入某个房间，然后服务端会把我这个房间的其他客户端的信息告诉我。

```typescript
// 随机一个用户名，后面你可以自己改成输入框让用户输入
const userId = Math.random().toString(36).substring(2)
// 房间号，这里随便写一个，后面你可以自己改成输入框让用户输入
const roomId = 123

// 加入房间
function joinRoom() {
  socket.emit('join', { userId, roomId })
}
```

#### 服务端接手客户端加入房间的逻辑

服务端接手客户端加入房间的逻辑，其实就是把客户端的信息保存到服务端的内存中，然后把这个房间的其他客户端的信息告诉客户端。

```js
// 服务端，当用户加入房间
socket.on('join', (data) => {
  handleUserJoin(socket, data)
})

// 房间信息
const ROOM_LIST = []
// 每个房间最多容纳的人数
const MAX_USER_COUNT = 2
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
  }

  // 判断用户是否已经在房间里
  if (room.userList.some((item) => item.userId === data.userId)) {
    socket.emit('error', '用户已在房间里')
    return
  }
  // 把用户信息保存到房间里
  room.userList.push(data)
  console.log(data.userId, '加入房间')

  socket.userId = data.userId
  socket.roomId = data.roomId

  // 将用户加入房间
  socket.join(data.roomId)
  // 通知房间内的其他用户
  socket.to(data.roomId).emit('welcome', data)
  // 通知自己加入房间成功，
  socket.emit('joined', data)
}
```

#### 客户端创建提案

这里，我们主要对上一篇创建提案的代码中添加 socket 发送的逻辑，我们需要在当有 ICE 候选改变时，将这些 本地的 SDP 描述发送到服务端，服务端再将这些信息转发给远程的客户端。这里我们先写发送逻辑，后面再去服务端写好接收逻辑就行。

```typescript
// 成功加入房间
socket.on('joined', (room, id) => {
  ElMessage.success('🦄🦄🦄成功加入房间')
  createOffer()
})

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
```

其中的 `onicecandidate` 事件，是用来监听 ICE 服务器返回的候选地址，当 ICE 服务器返回一个新的候选地址时，就会触发该事件，这里我们通过 `socket.emit` 将这个候选地址发送给信令服务。

当你在后期连接成功的时候，其实可以把 候选人信息(candidate) 打印出来可以看看，当两个设备在同一个内网中连接的时候， candidate 的地址为一个 ipv6 长格式的内网地址和一个 ipv4 的内网地址。

![](https://assets.fedtop.com/picbed/202211272320557.png)

当两个设备不在同一个内网中连接的时候，可以看到 candidate 的地址最后为一个 ipv4 的外网地址,说明它尝试了两次连接，第一次是内网连接，第二次是外网连接。证明了前面说的三种类型的先后连接方式。

![](https://assets.fedtop.com/picbed/202211272328473.png)

#### 信令服务端接收提案

接下来我们需要在服务端接收到客户端发送的提案后，将这个提案转发给远端的客户端。

```typescript
// 接收 offer
socket.on('offer', (data) => {
  // console.log('offer', data)
  socket.to(data.roomId).emit('offer', data)
})
```

#### 客户端接收远程的提案

接下来我们需要在客户端接收到远程的提案后，将这个提案设置成 RemoteDescription。然后创建应答，将应答设置成本地描述，在候选人信息改变时，将应答发送给服务端。

```typescript
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
```

#### 客户端创建 answer 的逻辑

作为接收方，在拿到 offer 后，我们就可以创建 answer 并设置到本地描述中，然后通过信令服务器发送 answer 给对端。

```typescript
const createAnswer = async () => {
  // 解析字符串
  const offer = JSON.parse(offerSdp)
  pc.onicecandidate = async (event) => {
    // Event that fires off when a new answer ICE candidate is created
    if (event.candidate) {
      answerSdp = JSON.stringify(pc.localDescription)
    }
  }
  await pc.setRemoteDescription(offer)
  const answer = await pc.createAnswer()
  await pc.setLocalDescription(answer)
}
```

#### 客户端最后再添加 answer 的逻辑

作为发起方，接下来我们需要在客户端接收到 接收方的应答后，将这个应答设置成 RemoteDescription。这样，一个最简单的 WebRTC 通信流程就完成了。

```typescript
// 添加 answer(应答)
const addAnswer = async () => {
  const answer = JSON.parse(answerSdp)
  if (!pc.currentRemoteDescription) {
    pc.setRemoteDescription(answer)
  }
}
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
