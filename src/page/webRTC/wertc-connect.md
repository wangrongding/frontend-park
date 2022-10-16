## WebRTC 从实战到未来！第二篇，音视频通话实战与原理 🔥

看到上一篇文章很受大家的欢迎 👏🏻，短短的几天就有好几百的点赞，🥳 非常开心，你们的点赞支持就是我继续好好写下去的动力，谢谢大家。🌸

![](https://assets.fedtop.com/picbed/202210120022670.png)

上一篇文章主要讲解了如何通过 `WebRTC` 的一些 api 对 摄像头，话筒，屏幕的媒体流进行采集并加以`处理`，实现了几个小 demo，秉持着实战为王的原则，这一篇文章我们仍然是以这种方式为主,有些概念的内容可能会非常的多且杂，为了让大家学起来不会感觉枯燥，我并不会为它大书特书，所以当有一些概念性的东西，你觉得自己不是特别理解的时候，，聪明的你，一定要记得多借助搜索引擎来帮助自己 ~ ），我主要会讲一些在示例中必须要了解概念来讲解，以便让大家学起来会更加轻松，容易上手。

![](https://assets.fedtop.com/picbed/202210122032556.png)

第一篇文章中，我并没有很好的介绍`WebRTC`，因为上一篇我们只是用它的一点获取媒体流等 api 来做了一些小 demo，但那都不是它的重点，`WebRTC` (Web Real-Time Communications),从名字上看，它是一项`实时通讯技术`，所以它的重点一定是`基于Web的`，`实时通信技术`,😅 好像说了跟没说一样，它允许网络应用或者站点，在不借助中间媒介的情况下，建立浏览器之间`点对点（Peer-to-Peer）的连接`，实现视频流和（或）音频流或者其他`任意数据`的传输。WebRTC 包含的这些标准使用户在无需安装任何插件或者第三方的软件的情况下，创建点对点（Peer-to-Peer）的数据分享和电话会议成为可能。

所以它的重点在于通信~ 上一篇主要是讲的采集和处理媒体流相关的内容，这次我们主要讲解如何使用 `WebRTC`一些 api 配合 `信令服务` 来 `建立连接`，以及如何将获取到的媒体流进行`传输`。

![](https://assets.fedtop.com/picbed/0_A2RHFnvTecnh8g7v.gif)

## 一对一实时音视频通话（不通过信令服务）

我们会从最简单的 `1v1` 的`点对点连接`开始，这样可以更好帮助我们理解 `WebRTC`是怎么建立连接的，第二节中再来讲解如何通过`信令服务`来来帮助我们`建立连接`实现 `1v1` 或者`多人`的音视频通话。

这样，我们就只使用了两篇文章就能让大家简单的了解到 如何从媒体流的`采集`，到建立 p2p 对等`连接`，再到数据`传输`这一个整个过程的实现方法。🥳🥳🥳

### 开始之前，一起来思考一个问题

两个设备，在互相不知道对方的情况下，如何建立连接？

我把这个问题换成更接地气一点：有一天，你在一个地方旅行，在旅行的途中，遇到了一个很喜欢的女孩子，一起拍了照片，假期结束后，你回家朝思暮想，想要再次见到她，但是你们忘记了互相留联系方式，我擦~好后悔，怎么办？后来你发的朋友圈被你同事评论了，说她认识这个女生，哇塞，你欣喜若狂，这个时候，你们是不是就可以通过你的同事来联系到对方呢？（🥲 好土，好烂的故事，😅 相信大家应该已经能理解了~）

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

`NAT`：`Network Address Translation`，网络地址转换，它是一种用于在公共网络上实现私有网络的技术，它可以将私有 IP 地址转换为公共 IP 地址，从而实现私有网络与公共网络之间的通信。

因为 IPv4 的地址空间比较有限，所以我们大多数设备都部署在 `NAT` 网络内部

![](https://assets.fedtop.com/picbed/202210162241868.png)

（比较贴切的例子就是当你连接 wifi 的时候，我们就处于 `NAT` 网络内，或者网吧，公司的电脑大多都处在 `NAT` 网络内，它们共用一个路由器，然后在这些机子的上层，或上 n 层才会有一个有效的全球 IP 公网地址）

<!-- [为什么局域网 IP 通常以 192.168 开头而不是 1.2 或者 193.169？](https://www.zhihu.com/question/442794368/answer/1724041004) -->

![](https://assets.fedtop.com/picbed/202210162132965.png)

IPv6 正在逐步普及，等我们彻底用上了 IPv6，一般来说，`NAT` 就没有什么存在的意义了。

总而言之，NAT 的存在就是因为 IPv4 的地址数量有限，我太多的设备因此只能部署在 NAT 网络内部，所以就引出了我们的内网 IP 地址是不可被外网访问的问题，

关于 NAT 的详细说明和原理可以看 [这篇](https://sspai.com/post/68037?ivk_sa=1024320u)，时间为王，我们暂时就不深入了解了，只需要把它理解为一个可以帮助我们实现内网与外网通信的工具就行。

#### 3. ICE

`ICE`：`Interactive Connectivity Establishment`，交互式连接建立协议，用于在两个主机之间建立连接，它可以在两个主机之间建立连接，即使它们之间的防火墙阻止了直接连接。

### 建立连接的几个关键步骤

我把 WebRTC 建立连接的几个关键步骤总结了一下，方便大家理解。主要为：

1. 采集媒体流，并创建本地的 `RTCPeerConnection` 对象
2. 建立连接
3. 传输媒体流

```typescript
// 1.创建 RTCPeerConnection 实例对象
const peerConnection = new RTCPeerConnection({
  iceServers: [
    {
      // stun 服务器，用于获取本地公网 ip
      // urls: 'stun:stun.l.google.com:19302',
      urls: 'stun:stun.voipbuster.com ',
    },
  ],
})

//  2.获取本地音视频流
const localStream：MediaStream = await navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true,
})
async function getLocalStream(constraints: MediaStreamConstraints) {
  // 获取媒体流
  const stream = await navigator.mediaDevices.getUserMedia(constraints)
}

// 3.将本地音视频流添加到 RTCPeerConnection
peerConnection.addStream(localStream)

// 4.监听 RTCPeerConnection 的 onicecandidate 事件
peerConnection.onicecandidate = (event) => {
  if (event.candidate) {
    // 通过信令服务发送 iceCandidate
    sendIceCandidate(event.candidate)
  }
}

// 5.监听 RTCPeerConnection 的 onaddstream 事件
peerConnection.onaddstream = (event) => {
  // 将远端音视频流添加到 video 标签中
  remoteVideo.srcObject = event.stream
}

// 6.创建 offer
const offer = await peerConnection.createOffer()

// 7.设置本地描述
await peerConnection.setLocalDescription(offer)

// 8.通过信令服务发送 offer
sendOffer(offer)
// socket.emit('offer', offer)

// 9.监听信令服务的 answer 事件
onAnswer = (answer) => {
  // 10.设置远端描述
  peerConnection.setRemoteDescription(answer)
}

// 11.监听信令服务的 iceCandidate 事件
onIceCandidate = (iceCandidate) => {
  // 12.添加远端 iceCandidate
  peerConnection.addIceCandidate(iceCandidate)
}

// 13.监听信令服务的 offer 事件
socket.on('offer', async (offer) => {
  // 14.设置远端描述
  await peerConnection.setRemoteDescription(offer)

  // 15.创建 answer
  const answer = await peerConnection.createAnswer()

  // 16.设置本地描述
  await peerConnection.setLocalDescription(answer)

  // 17.通过信令服务发送 answer
  sendAnswer(answer)
  // socket.emit('answer', answer)
})

// 18.监听信令服务的 answer 事件
socket.on('answer', (answer) => {
  // 19.设置远端描述
  peerConnection.setRemoteDescription(answer)
})

// 20.监听信令服务的 iceCandidate 事件
socket.on('iceCandidate', (iceCandidate) => {
  // 21.添加远端 iceCandidate
  peerConnection.addIceCandidate(iceCandidate)
})

peerConnection.onaddstream = (event) => {
  // 添加媒体流到 video 标签
}
```

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

## 信令服务器

### 信令服务简历连接时必须知道的几个概念

3. `STUN`：`Session Traversal Utilities for NAT`，用于在 NAT 网络中穿越防火墙的会话遍历实用程序，它可以帮助我们在 NAT 网络中穿越防火墙，从而建立连接。
4. `TURN`：`Traversal Using Relays around NAT`，使用 NAT 围绕中继进行遍历，它可以帮助我们在 NAT 网络中穿越防火墙，从而建立连接。

#### 用户唯一标识

- [@fingerprintjs/fingerprintjs-pro]https://segmentfault.com/q/1010000041271387

### 连接

https，对应的我们信令服务的地址也需要是 https，不然就会报错

![](https://assets.fedtop.com/picbed/202209152158537.png)

![](https://assets.fedtop.com/picbed/202209150123502.png)

描述，告诉我支持什么，自我介绍

## 最后

**然而这个世界上没有绝对完美的东西， WebRTC 自身仍存在一些缺憾：**

- 兼容性问题。在 Web 端存在浏览器之间的兼容性问题，虽然 WebRTC 组织在 GitHub 上提供了 WebRTC 适配器，但除此之外仍要面临浏览器行为不一致的问题
- 传输质量不稳定。由于 WebRTC 使用的是对点对传输，跨运营商、跨地区、低带宽、高丢包等场景下的传输质量基本听天由命。
- 移动端适配差。针对不同机型需要做适配，很难有统一的用户体验。

讲到这里就结束了，WebRTC 着实让我体会了一次它在音视频领域的强大。在浏览器支持上，除了 IE 之外， Chrome、Firefox、Safari、Microsoft Edge 等主流浏览器都已支持 WebRTC，多种音视频开发场景如在线课堂、远程屏幕等也得到广泛应用。在未来，希望它能给我们带来更多惊喜！

## WebRTC 各种协议是如何相互交互的？

https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API/Connectivity

## 学习 WebRTC 必须知道的五个协议

https://zhuanlan.zhihu.com/p/73914640

https://juejin.cn/post/6844904125692379143#heading-6

WebRTC API 就是建立于他们之上

### NAT（Network Address Translation）

NAT (网络地址翻译) 是一个能够让多台主机共享一个 IP 地址的技术。NAT 会给局域网内每台主机分配一个唯一的地址同时调整输入和输出的网络流量，使之能够发送到正确的位置。

网络地址转换协议 Network Address Translation (NAT) 用来给你的（私网）设备映射一个公网的 IP 地址的协议。一般情况下，路由器的 WAN 口有一个公网 IP，所有连接这个路由器 LAN 口的设备会分配一个私有网段的 IP 地址（例如 192.168.1.3）。私网设备的 IP 被映射成路由器的公网 IP 和唯一的端口，通过这种方式不需要为每一个私网设备分配不同的公网 IP，但是依然能被外网设备发现。

<!-- TODO 图 -->

### TURN（Traversal Using Relays around NAT）

一些路由器使用一种“对称型 NAT”的 NAT 模型。这意味着路由器只接受和对端先前建立的连接（就是下一次请求建立新的连接映射）。

NAT 的中继穿越方式 Traversal Using Relays around NAT (TURN) 通过 TURN 服务器中继所有数据的方式来绕过“对称型 NAT”。你需要在 TURN 服务器上创建一个连接，然后告诉所有对端设备发包到服务器上，TURN 服务器再把包转发给你。很显然这种方式是开销很大的，所以只有在没得选择的情况下采用。

[协议地址](https://www.rfc-editor.org/rfc/rfc7065)

<!-- TODO 图 -->

### TURN (Session Traversal Utilities for NAT)

NAT 的会话穿越功能 Session Traversal Utilities for NAT (STUN) (缩略语的最后一个字母是 NAT 的首字母) 是一个允许位于 NAT 后的客户端找出自己的公网地址，判断出路由器阻止直连的限制方法的协议。

客户端通过给公网的 STUN 服务器发送请求获得自己的公网地址信息，以及是否能够被（穿过路由器）访问。

[协议地址](https://www.rfc-editor.org/rfc/rfc5389)

### ICE (Interactive Connectivity Establishment)

https://developer.mozilla.org/zh-CN/docs/Glossary/ICE

交互式连接设施 Interactive Connectivity Establishment (ICE) 是一个允许你的浏览器和对端浏览器建立连接的协议框架。在实际的网络当中，有很多原因能导致简单的从 A 端到 B 端直连不能如愿完成。这需要绕过阻止建立连接的防火墙，给你的设备分配一个唯一可见的地址（通常情况下我们的大部分设备没有一个固定的公网地址），如果路由器不允许主机直连，还得通过一台服务器转发数据。ICE 通过使用以下几种技术完成上述工作。

[协议地址](https://www.rfc-editor.org/rfc/rfc5245)

### SDP (Session Description Protocol)

会话描述协议 Session Description Protocol (SDP) 是一个描述多媒体连接内容的协议，例如分辨率，格式，编码，加密算法等。所以在数据传输时两端都能够理解彼此的数据。本质上，这些描述内容的元数据并不是媒体流本身。

从技术上讲，SDP 并不是一个真正的协议，而是一种数据格式，用于描述在设备之间共享媒体的连接。

记录 SDP 远远超出了本文档的范围。但是，这里有几件事值得注意。

[协议地址](https://www.rfc-editor.org/rfc/rfc3264)

## 自签证书

线上环境，需要使用 HTTPS 协议。你可以通过 mkcert 工具来生成本地的 自签 HTTPS 证书。或者在本地搭建一个 HTTPS 服务器，比如使用 nginx。

- https://www.jianshu.com/p/7cb5c2cffaaa
- https://juejin.cn/post/7104650674880643108
- https://penueling.com/%E7%B7%9A%E4%B8%8A%E5%AD%B8%E7%BF%92/%E8%A6%81%E6%80%8E%E9%BA%BC%E8%AE%93localhost%E4%B9%9F%E5%8F%AF%E4%BB%A5%E6%9C%89https%E6%86%91%E8%AD%89%EF%BC%9F/

## 一些边角问题

- cmake 问题： http://jotmynotes.blogspot.com/2016/10/updating-cmake-from-2811-to-362-or.html
- [](https://juejin.cn/post/7071910670056292389)

## Peer.js

- https://juejin.cn/post/7065913779761971214

## WebRTC 的安全隐患

https://www.expressvpn.com/webrtc-leak-test

https://www.expressvpn.com/webrtc-leak-test#chrome

https://www.expressvpn.com/internet-privacy/webrtc-leaks/

## IP 查询

https://www.ip138.com/

https://nordvpn.com/zh/ip-lookup/

获取 IP 地址 https://iq.opengenus.org/get-ip-addresses-using-javascript/

检测 ice 穿透的在线工具

https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/

## WebRTC 的安全隐患

https://www.expressvpn.com/webrtc-leak-test

https://www.expressvpn.com/webrtc-leak-test#chrome

https://www.expressvpn.com/internet-privacy/webrtc-leaks/

## 相关链接

### 相关文章

- [WebRTC 是如何工作的？](https://www.agora.io/cn/community/blog-121-category-24640)
- https://webrtc.org.cn/webrtc-tutorial-2-signaling-stun-turn/
- https://juejin.cn/post/6844903844904697864#heading-5

- https://juejin.cn/post/6844903798750576647
- https://juejin.cn/post/7129763930779418654
- https://juejin.cn/post/7000205126719766565
- https://juejin.cn/post/6881551269514149896
- https://juejin.cn/post/6884851075887661070
- https://juejin.cn/post/6952849597148430344

- https://zhuanlan.zhihu.com/p/75492311
- https://zhuanlan.zhihu.com/p/76615314
- https://zhuanlan.zhihu.com/p/75387873
- https://zhuanlan.zhihu.com/p/73914640

- 配置 coturn https://juejin.cn/post/6999962039930060837
- https://webrtc.github.io/samples/
- [turn、turn 服务测试地址](https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/)
- [WebRTC，无信号传递 SDP。示例](https://divanov11.github.io/WebRTC-Simple-SDP-Handshake-Demo/)

### 相关 git 仓库

- https://github.com/feixiao/learning_webrtc/blob/master/learning-webrtc/README.md
- https://github.com/AgoraIO/API-Examples-Web

<!--
highlight: color-brewer
highlight: atom-one-dark
theme: healer-readable
theme: scrolls-light
theme: smartblue

-------
theme: smartblue
highlight: atom-one-dark
-->

## 信令服务器

https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API/Signaling_and_video_calling

https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API/Session_lifetime#%E4%BF%A1%E4%BB%A4

### 什么叫信令？

信令是在两个设备之间发送控制信息以确定通信协议、信道、媒体编解码器和格式以及数据传输方法以及任何所需的路由信息的过程。 关于 WebRTC 的信令流程最重要的一点是：**信令在规范中并没有定义。**所以开发者需要自己决定如何实现这个过程。开发者可以为应用程序引擎选择任意的信息协议（如 SIP 或 XMPP），任意双向通信信道（如 WebSocket 或 XMLHttpRequest) 与持久连接服务器的 API（如 Google Channel API）一起工作。

你可能会想，为什么这么一个对于建立 WebRTC 连接至关重要的基本过程居然没有定义在规范里？ 答案很简单：由于两个设备无法直接相互联系，规范无法预测 WebRTC 的所有可能用例，因此更明智的做法就是让开发人员们自己选择合适的网络技术和消息传递协议。

加微信？谈恋爱，没有微信，借助第三方闺蜜

## 拨打微信

微信接收，轮询 socket，第三方？p2p？

```

```
