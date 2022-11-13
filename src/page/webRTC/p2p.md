## WebRTC 从实战到未来！第二篇，音视频通话实战与原理 🔥

[👉🏻 本文示例源代码地址](https://github.com/wangrongding/frontend-park)  
[👉🏻 本文示例在线体验地址](https://frontend-park.vercel.app/audio-and-video/webRTC/p2p)

你可以开两个浏览器 tab 或者用不同的设备，根据说明即可体验音视频通话的实现，本文将会从实战出发，讲解 WebRTC 的音视频通话原理。

![](https://assets.fedtop.com/picbed/202211132340780.png)

看到上一篇文章很受大家的欢迎 👏🏻，短短的几天就有好几百的点赞，🥳 非常开心，你们的点赞支持就是我继续好好写下去的动力，谢谢大家。🌸

![](https://assets.fedtop.com/picbed/202210120022670.png)

上一篇文章主要讲解了如何通过 `WebRTC` 的一些 api 对 摄像头，话筒，屏幕的媒体流进行采集并加以`处理`，实现了几个小 demo，秉持着实战为王的原则，这一篇文章我们仍然是以这种方式为主,不过这一篇需要了解的概念会比上一篇多一些，但是我并不会为它大书特书，所以当有一些概念性的东西，你在看的时候觉得自己不是特别理解的话，聪明的你，一定要记得多借助搜索引擎来帮助自己 ~ ），我主要会讲一些在示例中必须要了解概念，以便让大家不会看到大量的协议或者名词概念直接劝退，目的是快速上手。

![](https://assets.fedtop.com/picbed/202210122032556.png)

第一篇文章中，我并没有很好的介绍`WebRTC`，因为上一篇我们只是用它的一点获取媒体流等 api 来做了一些小 demo，但那都不是它的重点，`WebRTC` (Web Real-Time Communications)，是一个由 Google 发起的实时通讯解决方案，其中包含视频音频采集，编解码，数据传输，音视频展示等功能，通过它，我们可以非常方便且快速地构建出一个音视频通讯应用。

它允许网络应用或者站点，在不借助中间媒介的情况下，建立浏览器之间`点对点（Peer-to-Peer）的连接`，实现视频流和（或）音频流或者其他`任意数据`的传输。

所以它的重点在于通信~ 上一篇主要是讲的采集和处理媒体流相关的内容，这次我们主要讲解如何使用 `WebRTC`一些 api 配合 `信令服务` 来 `建立连接`，以及如何将获取到的媒体流进行`传输`。

![](https://assets.fedtop.com/picbed/0_A2RHFnvTecnh8g7v.gif)

## 一对一实时音视频通话实战（不通过信令服务）

首先，我们从最简单的 `1v1` 的`"手动"` `点对点连接`开始，这样可以更好帮助我们理解 `WebRTC`是怎么建立连接的，第二节中再来讲解如何通过`信令服务`来来帮助我们`"自动"` 建立 `点对点连接`实现 `1v1` 或者`多人`的音视频通话。

这样，我们就只使用了两篇文章就能让大家简单的了解到 如何从媒体流的`采集`，`处理`，建立 p2p（Peer-to-Peer） 对等`连接`，再到数据`传输`这一个整个过程的实现方法。🥳🥳🥳

[👉🏻 在线体验地址](https://frontend-park.vercel.app/audio-and-video/webRTC/p2p)

![](https://assets.fedtop.com/picbed/202211132340780.png)

### 开始之前，一起来思考一个问题

两个设备，在互相不知道对方的情况下，如何建立连接？

我把这个问题换成更接地气一点：有一天，你在一个地方旅行，在旅行的途中，遇到了一个很喜欢的女孩子，一起拍了照片，假期结束后，你回家朝思暮想，想要再次见到她，但是你们忘记了互相留联系方式，我擦~好后悔，怎么办？后来你发的朋友圈被你同事评论了，说她认识这个女生，哇塞，你欣喜若狂，这个时候，你们是不是就可以通过你的同事来联系到对方呢？（有点土味的例子 😅， 相信大家应该已经能理解了~）

![](https://assets.fedtop.com/picbed/202210122208954.png)

这样你们就可以相互建立连接了。你开心的起飞了，然后开始学起了 WebRTC。😅

### 实现简单模型，必须要知道的几个概念

#### 1. SDP

`SDP`：`Session Description Protocol`，它是一种用于描述多媒体会话的协议，它可以帮助我们描述媒体流的信息，比如媒体流的类型，编码格式，分辨率等等。WebRTC 通过`SDP`来交换端与端之间的`网络`和`媒体`信息。

下图中就是一个`SDP`信息的示例：从中你能大概的看到一些你的内网 IP 信息，外网 IP 信息，以及一些媒体流的信息。

```sh
v=0 # SDP版本号
o=- 0 0 IN IP4 120.24.99.xx # 会话标识信息
s=- # 会话名称
t=0 0 # 会话的有效时间
a=group:BUNDLE audio video # 媒体流类型
a=msid-semantic: WMS * # 媒体流标识符
m=audio 9 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 126 # 音频媒体流
c=IN IP4 120.24.99.xx # 连接信息
a=rtcp:9 IN IP4 0.0.0.0 # RTCP 的 IP 地址
a=candidate:0 1 UDP 2122252543 120.24.99.xx 9 typ host # 候选 IP 地址
# ...等等等
```

![](https://assets.fedtop.com/picbed/202210161609002.png)

一开始我们只需要知道，`SDP`是用来干什么的就行了，不需要过多的关注这些信息，后面用到了再深入了解。（我认为学习大多数技能的时候，如果上来就把各种概念性的东西先全部搞透再开始去动手，是效率很低的一种学习方式，应当了解一个大概后，在实战中去边做边学习，不懂什么概念再去获取，遇到问题再去解决，这样才能更快的上手一门技术，然后深入或者进阶的时候，在系统的去学习概念。）

#### 2. NAT

`NAT`：`Network Address Translation`，网络地址转换，它可以将私有 IP 地址转换为公共 IP 地址，从而实现私有网络与公共网络之间的通信。

因为 IPv4 的地址空间比较有限，所以我们大多数设备都部署在 `NAT` 网络内部。

![](https://assets.fedtop.com/picbed/202210162241868.png)

（比较贴切的例子就是当你连接 wifi 的时候，我们就处于 `NAT` 网络内，或者网吧，公司的电脑大多都处在 `NAT` 网络内，它们共用一个路由器，然后在这些机子的上层，或上 n 层才会有一个有效的全球 IP 公网地址）

<!-- [为什么局域网 IP 通常以 192.168 开头而不是 1.2 或者 193.169？](https://www.zhihu.com/question/442794368/answer/1724041004) -->

![](https://assets.fedtop.com/picbed/202210162132965.png)

IPv6 正在逐步普及，等我们彻底用上了 IPv6，`NAT` 存在的意义就不大了。

总而言之，NAT 的存在就是因为 IPv4 的地址数量有限，我太多的设备因此只能部署在 NAT 网络内部，所以就引出了我们的内网 IP 地址是不可被外网访问的问题，

关于 NAT 的详细说明和原理可以看 [这篇](https://sspai.com/post/68037?ivk_sa=1024320u)，时间为王，我们暂时就不深入了解了，只需要把它理解为一个可以帮助我们实现内网与外网通信的工具就行。我常说的 `NAT 打洞`，`内网穿透`，就是利用 `NAT` 的这些特性和一些相关技术来实现的。

#### 3. ICE

`ICE`：`Interactive Connectivity Establishment`，交互式连接建立协议，用于在两个主机之间建立连接，它可以在两个主机之间建立连接，即使它们之间的防火墙阻止了直接连接。

### 建立连接的几个关键步骤

一般来说，一个 WebRTC 应用架构是这样的：

![](https://assets.fedtop.com/picbed/202209150123502.png)

而这篇文章，我们主要为了入门`P2P`的连接，传输过程，所以我把上面的架构简化了一下，只保留了一些必要的部分：

其中`蓝色`部分是`用户和信令服务器`的交互，`红色`部分是`用户和用户`之间的交互。

而蓝色的部分我也进行了简化，我们将通过人工拷贝黏贴的形式，来模拟信令服务器的帮助用户传递关键信息的过程。

<img src="https://assets.fedtop.com/picbed/202211132222279.png"/>

这样，我们通过一个`最简单的模型`就能实现并理解 `WebRTC` 从建立连接到传输数据的整个过程了。🥳🥳🥳

下面我把 WebRTC 建立连接的几个关键步骤总结了一下，方便大家理解。主要为：

- 创建一个用于连接控制的 `RTCPeerConnection` 对象
- 采集媒体流并添加到`RTCPeerConnection` 实例中
- 建立连接，传输媒体流。

ok，我们来逐一分解：

#### 1. 创建本地的 `RTCPeerConnection` 对象

在 WebRTC 中 ，由`RTCPeerConnection` api 负责创建，保持，监控，关闭连接。我认为它是 WebRTC 的核心 api。

为了让 WebRTC 的相关 api 在各个浏览器中都能够正常的运行，强烈推荐使用 [adapter.js](https://www.npmjs.com/package/webrtc-adapter),adapter.js 是一个垫片，用于将应用程序与 WebRTC 中的规范更改和前缀差异隔离开来。如今，前缀差异大多消失了，但浏览器之间的行为差异仍然存在。 而且，WebRTC 仍在快速发展，因此 adapter.js 是非常有用的。

```sh
# 安装它
npm install webrtc-adapter
```

```typescript
// 你只需要引入它即可，不需要做任何配置和多余的操作。
import 'webrtc-adapter'
```

1. 完事之后，首先我们需要创建一个 `RTCPeerConnection`对象，用于后面实现本地计算机到远端的 WebRTC 连接。

如果你的应用需要在公网中使用，那么你需要在创建 `RTCPeerConnection` 对象的时候，传入一个配置对象，配置对象中包含了 STUN 和 TURN 服务器的地址。

这两个服务器的作用是什么呢？我们先来看看 STUN 服务器。  
`STUN`：`Session Traversal Utilities for NAT`，用来帮助我们获取本地计算机的公网 IP 地址，以及端口号。  
`TURN`：`Traversal Using Relays around NAT`，用来帮助我们穿越 NAT 网关，实现公网中的 WebRTC 连接。一般来说它用来做兜底的，当所有方法都无法穿越 NAT 网关或者无法直接简历 P2P 连接的时候，我们才会使用到它。这时，TURN 服务器会作为一个中继服务器，然后用户的媒体流会通过它来中转传输。

```typescript
// 公网中使用
const pc = new RTCPeerConnection({
  iceServers: [
    // 目前我在用的，免费STUN 服务器
    {
      urls: 'stun:stun.voipbuster.com ',
    },
    // 谷歌的好像都失效了，不过你们可以试试
    {
      urls: 'stun:stun.l.google.com:19301',
      // urls: 'stun:stun.l.google.com:19302',
      // urls: 'stun:stun.l.google.com:19303',
      // ...
    },
    // TURN 服务器,这个对服务器压力太大了，目前没找到免费的，后续我在自己的服务器上弄一个
    {
      urls: 'turn:turn.xxxx.org',
      username: 'webrtc',
      credential: 'turnserver',
    },
    {
      urls: 'turn:turn.ap-southeast-1.aliyuncs.com:443?transport=tcp',
      username: 'test',
      credential: 'test',
    },
  ],
})
```

搭建 STUN 服务器和 TURN 服务器的教程，我会在下一篇文章中和信令服务一起分享。

这篇文章中，我们暂时只实现一个能在内网使用的音视频通话，所以我们暂时不需要配置 STUN，TURN 服务器。如果你想在公网中使用，那么你完全可以暂时使用上面的免费 STUN 服务器，但是 TURN 服务器就需要你自己搭建了。

我的这个 👉🏻[DEMO](https://frontend-park.vercel.app/audio-and-video/webRTC/signaling-p2p)

![](https://assets.fedtop.com/picbed/202211132304636.png)

就是用的上面的 免费 STUN 服务器 + 信令服务来实现 内外网的 P2P 连接。可以提前体验一下，这会在第三篇文章中详细介绍。

ok,不扯远了，我们继续，先创建一个 `RTCPeerConnection` 对象。

```typescript
// 内网中使用
const pc = new RTCPeerConnection()
```

然后我们创建好 `RTCPeerConnection` 对象之后，通过 `RTCPeerConnection` 对象的 `addTrack` 方法来媒体流添加到 `RTCPeerConnection` 对象中。

#### 2. 采集媒体流

采集和处理的方法在第一篇文章中已经做了很详细的介绍，下面我们直接使用。

设置好媒体流需要挂载的音视频元素。

```html
<!-- 给自己本地的视频播放设置静音，防止产生回音 -->
<video id="local" autoplay playsinline muted></video>
<video id="remote" autoplay playsinline></video>
```

然后通过 `navigator.mediaDevices.getUserMedia` 方法来获取媒体流。

一般这里的逻辑都是在我们项目加载完成的时候，或者让用户自己手动点击按钮来采集媒体流。

采集完后，我们就可以通过 `RTCPeerConnection` 对象的 `addTrack` 方法来添加媒体流。

将媒体流添加到 `RTCPeerConnection` 对象的方法还有一个，就是 `addStream` 方法，但是这个方法已经被废弃了，虽然现在很多教程仍然是使用的它，这里我们不推荐使用。

添加完后我们也需要监听远程的媒体流是否也添加进来，当远程的媒体流也在这样我们才能够将远程的媒体流播放出来。 这里 WebRTC 为我们提供了一个 `ontrack` 事件，当远程的媒体流添加进来的时候，就会触发这个事件。

第二部的初始化完整代码如下：

```typescript
// 初始化
async function init(params: type) {
  // 获取本地端视频标签
  const localVideo = document.getElementById('local') as HTMLVideoElement
  // 获取远程端视频标签
  const remoteVideo = document.getElementById('remote') as HTMLVideoElement

  // 采集本地媒体流
  const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  })
  // 设置本地视频流
  localVideo.srcObject = localStream

  // 不推荐使用：已经过时的方法 [addStream API](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addStream)
  // pc.addStream(localStream);

  // 添加本地媒体流的轨道都添加到 RTCPeerConnection 中
  localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream)
  })

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
```

ok，下一步就到了我们的第 3 步，也就是建立连接

#### 3. 建立连接

建立连接的主要过程，就是通过 `RTCPeerConnection` 对象的 `createOffer` 方法来创建本地的 `SDP` 描述，然后通过 `RTCPeerConnection` 对象的 `setLocalDescription` 方法来设置本地的 `SDP` 描述，最后通过 `RTCPeerConnection` 对象的 `setRemoteDescription` 方法来设置远程的 `SDP` 描述。

- 创建 offer（提案）

```typescript
// 创建本地/远程 SDP 描述, 用于描述本地/远程的媒体流
let offerSdp = ''
let answerSdp = ''

const createOffer = async () => {
  // 创建 offer
  const offer = await pc.createOffer()
  // 设置本地描述
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
```

其中的 `onicecandidate` 事件，是用来监听 ICE 服务器返回的候选地址，当 ICE 服务器返回一个新的候选地址时，就会触发该事件，这里我们需要将这个候选地址发送给远端，这样远端才能够和我们建立连接。

当然，你也可以在`peerConnection.setLocalDescription()`时，不传参数，这样 WebRTC 会默认调用`peerConnection.createOffer()`来创建 offer。

```typescript
const offer = await peerConnection.createOffer()
await peerConnection.setLocalDescription(offer)
console.log(peerConnection)
```

```typescript
// 不传参数，默认调用 peerConnection.createOffer()
await peerConnection.setLocalDescription()
console.log(peerConnection)
```

我们可以把它打印一下，可以看到一样是能够创建出 offer 并设置到本地描述中的。

![](https://assets.fedtop.com/picbed/202210161609174.png)

![](https://assets.fedtop.com/picbed/202210161609174.png)

![](https://assets.fedtop.com/picbed/202210161609002.png)

但是不推荐这么做，WebRTC 还在不断的更新中，本身就存在很多实验性的 API，所以我们还是要遵循规范来。该传就传。😅

ok，下一步就到了我们的第 3 步，也就是创建 offer 并发送给远程端。并监听远程端的 answer。拿到 answer 后，我们就可以设置到远程端的描述中。

- 创建 answer

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

- 添加 answer

接收方拿到 answer 后，就可以设置到远程端的描述中。

```typescript
// 添加 answer(应答)
const addAnswer = async () => {
  const answer = JSON.parse(answerSdp)
  if (!pc.currentRemoteDescription) {
    pc.setRemoteDescription(answer)
  }
}
```

这样，我们就完成了从采集媒体流，建立连接，传输的全过程。

一个最简单的 WebRTC 通信流程就完成了。

这篇文章的概念比较多，有很多地方我并没有花大量的篇幅去讲解它是什么以及原理是什么样的，比如 SDP，ICE 等等，为什么呢？我认为作为一个入门篇讲这些概念，上来就灌输大量的这类概念，会让初学者很难理解，所以我就没有讲，聪明的你肯定也会在看这篇文章遇到障碍，或者看完对很感兴趣的地方进行查阅。不过大家如果有遇到哪一块非常不理解又没找到什么好的方案的时候，可以在评论区留言，我也会尽快回复。🫶

[👉🏻 本文示例在线体验地址](https://frontend-park.vercel.app/audio-and-video/webRTC/p2p)

你可以开两个浏览器 tab 或者用不同的设备，根据说明即可体验音视频通话的实现，本文将会从实战出发，讲解 WebRTC 的音视频通话原理。

![](https://assets.fedtop.com/picbed/202211132340780.png)

下一篇文章，我们将会从实战出发，讲解 WebRTC 的音视频通话中如何通过信令服务器进行通信，以及如何搭建一个 STUN，TURN 服务器。

## 最后

[👉🏻 本文示例源代码地址](https://github.com/wangrongding/frontend-park)  
[👉🏻 本文示例在线体验地址](https://frontend-park.vercel.app/audio-and-video/webRTC/p2p)

你也可以提前体验一下[👉🏻 下一篇文章的示例](https://frontend-park.vercel.app/audio-and-video/webRTC/signaling-p2p) ,支持内外网的 1v1 音视频通话。

![](https://assets.fedtop.com/picbed/202211132359202.png)

本文是 WebRTC 系列的第二篇，后续还会有很多篇，如果你觉得本文对你有帮助，你的点赞支持就是我的动力 🌸 ~ 如果有什么疑问，可以在评论区留言，我会尽快回复。🥳
