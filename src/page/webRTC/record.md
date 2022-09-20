# webrtc 代码记录

## 记录

### 分享屏幕，录屏截屏

```html
<div class="local-video">
  <video id="localVideo" autoplay playsinline muted></video>
</div>
```

```typescript
// 播放本地视频流
function playLocalStream(stream: MediaStream) {
  const localVideo = document.getElementById('localVideo') as HTMLVideoElement
  localVideo.srcObject = stream
}
// 分享屏幕
async function shareScreen() {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    audio: true,
    video: true,
  })
  // 播放本地视频流
  playLocalStream(stream)
}
```

第一次 mac 需要同意，或者自己到设置中打开  
![](https://assets.fedtop.com/picbed/202209142011041.png)

![](https://assets.fedtop.com/picbed/202209142019128.png)

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

#### 切换设备

#### 切换前后摄像头

![](https://assets.fedtop.com/picbed/202209142144928.png)

我们尝试使用外置的摄像头，我这里使用 ios16 新出的

![](https://assets.fedtop.com/picbed/202209142147208.png)

虚拟摄像头也不会有前后之分,这里我用 OBS 开一个虚拟摄像头（OBS 这个功能挺好玩的，之前试过播放特朗普的视频然后开虚拟摄像头拨打微信视频电话，对方看到的就是特朗普，哈哈 😂😂😂）

![](https://assets.fedtop.com/picbed/202209142154040.png)  
![](https://assets.fedtop.com/picbed/202209142153213.png)

## 录制

- [MediaRecorder](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaRecorder)
- []: # (https://developer.mozilla.org/zh-CN/docs/Web/API/MediaStream_Recording_API/Using_the_MediaStream_Recording_API)
- [查看视频类型支持](https://cconcolato.github.io/media-mime-support/)
- https://www.webrtc-experiment.com/msr/gif-recorder.html

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

## git 仓库

- https://github.com/feixiao/learning_webrtc/blob/master/learning-webrtc/README.md
- https://github.com/AgoraIO/API-Examples-Web

## 相关链接

- https://webrtc.github.io/samples/
- [turn、turn 服务测试地址](https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/)
- [WebRTC，无信号传递 SDP。示例](https://divanov11.github.io/WebRTC-Simple-SDP-Handshake-Demo/)

## 相关文章

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

配置 coturn https://juejin.cn/post/6999962039930060837

## 自签证书

- https://www.jianshu.com/p/7cb5c2cffaaa
- https://juejin.cn/post/7104650674880643108
- https://penueling.com/%E7%B7%9A%E4%B8%8A%E5%AD%B8%E7%BF%92/%E8%A6%81%E6%80%8E%E9%BA%BC%E8%AE%93localhost%E4%B9%9F%E5%8F%AF%E4%BB%A5%E6%9C%89https%E6%86%91%E8%AD%89%EF%BC%9F/

## 一些边角问题

- cmake 问题： http://jotmynotes.blogspot.com/2016/10/updating-cmake-from-2811-to-362-or.html
- [](https://juejin.cn/post/7071910670056292389)
