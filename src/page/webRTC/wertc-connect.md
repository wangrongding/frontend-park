## 如何使用 WebRTC

### 1. 获取媒体流

```js
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    // 获取到媒体流
  })
  .catch((err) => {
    // 获取媒体流失败
  })
```

### 2. 创建 RTCPeerConnection

```js
const peerConnection = new RTCPeerConnection({
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
  ],
})
```

### 3. 添加媒体流到 RTCPeerConnection

```js
peerConnection.addStream(stream)
```

### 4. 创建 Offer

```js
peerConnection
  .createOffer()
  .then((offer) => {
    // 创建 Offer 成功
  })
  .catch((err) => {
    // 创建 Offer 失败
  })
```

### 5. 设置本地描述

```js
peerConnection
  .setLocalDescription(offer)
  .then(() => {
    // 设置本地描述成功
  })
  .catch((err) => {
    // 设置本地描述失败
  })
```

### 6. 发送 Offer

```js
socket.emit('offer', offer)
```

### 7. 接收 Offer

```js
socket.on('offer', (offer) => {
  // 接收到 Offer
})
```

### 8. 设置远端描述

```js
peerConnection
  .setRemoteDescription(offer)
  .then(() => {
    // 设置远端描述成功
  })
  .catch((err) => {
    // 设置远端描述失败
  })
```

### 9. 创建 Answer

```js
peerConnection
  .createAnswer()
  .then((answer) => {
    // 创建 Answer 成功
  })
  .catch((err) => {
    // 创建 Answer 失败
  })
```

### 10. 设置本地描述

```js
peerConnection
  .setLocalDescription(answer)
  .then(() => {
    // 设置本地描述成功
  })
  .catch((err) => {
    // 设置本地描述失败
  })
```

### 11. 发送 Answer

```js
socket.emit('answer', answer)
```

### 12. 接收 Answer

```js
socket.on('answer', (answer) => {
  // 接收到 Answer
})
```

### 13. 设置远端描述

```js
peerConnection

  .setRemoteDescription(answer)
  .then(() => {
    // 设置远端描述成功
  })
  .catch((err) => {
    // 设置远端描述失败
  })
```

### 14. 添加媒体流到 video 标签

```js
peerConnection.onaddstream = (event) => {
  // 添加媒体流到 video 标签
}
```

## 一对一音视频通话

## 信令服务器

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

### 获取摄像头

```typescript
// 获取本地音视频流
async function getLocalStream() {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  })
  // 播放本地视频流
  playLocalStream(stream)
}
```

`navigator.mediaDevices.getUserMedia(constraints)` 在 Chrome 47 以后，只允许来自“安全可信”的客户端的视频音频请求（https，localhost）。要不然 Chrome 会抛出错误，提示 navigator 对象中则没有 mediaDevices 对象。
