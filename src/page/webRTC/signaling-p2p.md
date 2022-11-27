## WebRTC 通过信令服务器自动建立连接，实现点对点音视频通话

在上一篇文章中为了更直观的演示 WebRTC 建立点对点通信的过程，示例中我们是通过手动交换 sdp 来建 p2p 连接的，但在实际的应用场景中，我们几乎不可能会通过手动交换 sdp ，因为这样会增加很多的工作量，也不方便，所以我们需要一个信令服务器来帮助我们实现自动建立连接的过程。

### 什么是信令服务器？

我们知道 `WebRTC` 想要直接通过 `P2P` 连接进行通信，需要一个中继的过程(在两个终端之间传递控制信息的过程)。这个中继的过程就称之为`信令`。 执行此操作的服务器称为信令服务器。信令服务器按照与聊天室相同的方式对连接的节点进行逻辑分组，并相互交换 `SDP` 和`候选者`。

在 WebRTC 中，我们需要通过信令来交换 sdp 信息，这样才能建立 p2p 连接，而信令服务器就是用来实现这个过程的。

信令服务器可以根据要开发的服务的性质使用现有的信令协议如 SIP 或 XMPP，也可以通过 Ajax 长轮询或 websocket 等适当的双向通信通道来实现。

信令的核心是交换异步发生的对等信息（SDP，Candidate）。因此，将其实现为支持全双工通信的 websocket 最为合适。

## 信令的作用

信令的作用是：

- 会话控制消息（Session control messages）：通信初始化、终止和错误消息
- 通知对等方，对等方已连接
- 通知对等方，对等方已断开连接

## 信令

上述所有过程都称为信令。即两个设备交换控制信息的过程，交换 RTCPeerConnection 通信所使用的协议、通道、媒体编解码和格式、数据传输方式、路由信息、NAT 穿越方式等通信标准。

### 信令服务建立连接时必须知道的几个概念

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

公共 IP 不分配给典型的计算机。原因是防火墙、多台计算机共享一个公共 IP 的 NAT，以及临时租用空闲 IP 的 DHCP。因此，仅查找公共 IP 并不能指向特定用户。因此，为了指定特定的用户，不仅要找出公共 IP，还要找出连接到网络的私有 IP 地址。

通常，路由器充当 NAT。它检查从外部访问的“公共 IP 和端口号”，并适当地映射当前网络中的私有 IP。因此，为了让两个浏览器直接相互通信，每个浏览器都必须先找出它当前连接的路由器的“公共 IP 地址和端口”。

但是，某些路由器可能具有阻止与特定地址或端口的连接的防火墙设置。寻找通过路由器连接的方法的过程称为 NAT 穿越。

<!-- TODO 图 -->

### TURN（Traversal Using Relays around NAT）

一些路由器使用一种“对称型 NAT”的 NAT 模型。这意味着路由器只接受和对端先前建立的连接（就是下一次请求建立新的连接映射）。

NAT 的中继穿越方式 Traversal Using Relays around NAT (TURN) 通过 TURN 服务器中继所有数据的方式来绕过“对称型 NAT”。你需要在 TURN 服务器上创建一个连接，然后告诉所有对端设备发包到服务器上，TURN 服务器再把包转发给你。很显然这种方式是开销很大的，所以只有在没得选择的情况下采用。

[协议地址](https://www.rfc-editor.org/rfc/rfc7065)

![](https://assets.fedtop.com/picbed/202211141044113.png)

NAT 遍历操作由 Session Traversal Utilities for NAT (STUN) 服务器执行。 STUN 方法是一种用于终端检查其“公共 IP 地址和端口”的过程的协议。当客户端向 STUN 服务器发送请求时，它会发送通信所需的信息以及客户端用来与其他设备通信的公共 IP 地址。但是，即使在这种情况下，如果无法进行通信，也会将其传输到 TURN 服务器。

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

SDP（Session Description Protocol）是 WebRTC 中采用的一种协议，用于描述流媒体的分辨率、格式、编解码等多媒体内容的初始获取。诸如可以用作媒体元数据的编解码器是什么、使用什么协议、比特率是多少、带宽是多少等数据以文本格式指定。

如果您创建一个 PeerConnection 对象，您可以从 PeerConnection 对象获取 offer SDP 和 answer sdp。因此，描述与媒体相关的初始设置信息的 SDP 具有类似于发布订阅模型（Pub/Sub）的提议响应模型（Offer/Answer）。

## ICE , Candidate

由使用 STUN 和 TURN 服务器获得的 IP 地址、协议和端口组合而成的可连接网络地址称为候选网络地址。您可以通过创建 PeerConnection 对象来获得候选人。

像这样收集候选人通常会产生三个地址。

- 您的私有 IP 和端口号
- 您的公共 IP 和端口号（可从 STUN 和 TURN 服务器获得）
- TURN 服务器的 IP 和端口号（可以从 TURN 服务器获取）

另一方面，所有这些过程都是在 ICE（交互式连接建立）的框架上进行的。 ICE 是一个为两个终端找到最佳路径以实现 P2P 连接的框架。 ICE 使用 STUN 和 TURN 检测多个候选者，并选择其中一个来建立对等连接。

## 自签证书

我们可以通过 openssl 生成自签证书，并将其保存在本地。但是好麻烦，这里我使用 mkcert 工具生成自签证书，并将其保存在本地。

```sh
brew install mkcert
mkcert -install
```

```sh
mkcert localhost 127.0.0.1 ::1
```

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

# WebRTC

## 学习 WebRTC 必须知道的五个协议

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

## WebRTC 各种协议是如何相互交互的？

https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API/Connectivity

## 信令服务器

https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API/Signaling_and_video_calling

https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API/Session_lifetime#%E4%BF%A1%E4%BB%A4

### 什么叫信令？

信令是在两个设备之间发送控制信息以确定通信协议、信道、媒体编解码器和格式以及数据传输方法以及任何所需的路由信息的过程。 关于 WebRTC 的信令流程最重要的一点是：**信令在规范中并没有定义。**所以开发者需要自己决定如何实现这个过程。开发者可以为应用程序引擎选择任意的信息协议（如 SIP 或 XMPP），任意双向通信信道（如 WebSocket 或 XMLHttpRequest) 与持久连接服务器的 API（如 Google Channel API）一起工作。

你可能会想，为什么这么一个对于建立 WebRTC 连接至关重要的基本过程居然没有定义在规范里？ 答案很简单：由于两个设备无法直接相互联系，规范无法预测 WebRTC 的所有可能用例，因此更明智的做法就是让开发人员们自己选择合适的网络技术和消息传递协议。

加微信？谈恋爱，没有微信，借助第三方闺蜜

## 拨打微信

微信接收，轮询 socket，第三方？p2p？

https://www.jianshu.com/p/7cb5c2cffaaa

## 引用

### 网络协议

https://zhuanlan.zhihu.com/p/73914640

https://juejin.cn/post/6844904125692379143#heading-6

### 兼容性等测试

- [关于 WebRTC 浏览器兼容性测试那些事](https://zhuanlan.zhihu.com/p/50866330)
- [Agora WebRTC 预呼测试](https://webdemo.agora.io/agora_webrtc_troubleshooting/)
- [WebRTC 库的现状](https://stackoverflow.com/questions/24857637/current-state-of-javascript-webrtc-libraries/24879451#24879451)

https://baijiahao.baidu.com/s?id=1714740880954778889&wfr=spider&for=pc

https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API/Protocols

https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API/Session_lifetime

### webRTC 的安全隐患

https://www.expressvpn.com/webrtc-leak-test

https://www.expressvpn.com/webrtc-leak-test#chrome

https://www.expressvpn.com/internet-privacy/webrtc-leaks/

### IP 查询

- 如何获取内网 IP

- 如何获取外网 IP

https://www.ip138.com/

https://nordvpn.com/zh/ip-lookup/

获取 IP 地址 https://iq.opengenus.org/get-ip-addresses-using-javascript/

检测 ice 穿透的在线工具

https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/
