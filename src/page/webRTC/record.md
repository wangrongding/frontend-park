# WebRTC 从实战到未来

![](https://assets.fedtop.com/picbed/202210071605656.png)

## 这篇文章可以学到什么

- 学会如何使用 WebRTC 的一些 API
- 学会如何`分享屏幕`，`录制屏幕`
- 学会如何通过 WebRTC 实现`拍照`
- 学会如何`实现视频虚拟背景`
- 搭建一个 `1v1` 的 WebRTC `实时音视频通话`

## 前言

很开心在九月签约了掘金，首先感谢平台的肯定，后面几个月我会认真的给大家带来一些有价值的文章。 所以我开了一个专栏 《WebRTC 从实战到未来》，我将通过这个专栏，分享一下自己在 WebRTC 相关技术栈上的一些经验和思考，希望能够帮助到大家。🌸

虽然这篇文章作为专栏的第一篇，但我也不会从 WebRTC 的基础知识和相关概念开始讲起，因为那样会非常的枯燥乏味，我会从实际项目中的一些能快速上手的应用出发，讲一下我在实际项目中遇到的一些问题，以及我是如何解决和实现的。这样的好处是，你可以快速的上手，更加专注于实际项目中的应用，而不是上来就是大量的概念和协议相关知识直接给整劝退了。🥲🥲🥲

## 什么是 WebRTC

`WebRTC` (Web Real-Time Communications) 是一项`实时通讯技术`，它允许网络应用或者站点，在不借助中间媒介的情况下，建立浏览器之间`点对点（Peer-to-Peer）的连接`，实现视频流和（或）音频流或者其他`任意数据`的传输。WebRTC 包含的这些标准使用户在无需安装任何插件或者第三方的软件的情况下，创建点对点（Peer-to-Peer）的数据分享和电话会议成为可能。

## WebRTC 的应用场景

- 直播
- 游戏
- 视频会议/在线教育
- 屏幕共享/远程控制
- 等等等

可玩性很强，可以做很多有趣的事情。

## 媒体流

要想了解 WebRTC，首先要了解媒体流，媒体流可以是来自本地设备的，也可以是来自远程设备的。媒体流可以是实时的，也可以是非实时的。上述的应用场景中，我们都需要使用到`媒体流`，我们可以通过摄像头，麦克风，屏幕共享等方式获取到媒体流，然后通过 WebRTC 技术将媒体流传输到远端实现实时通讯。

![](https://assets.fedtop.com/picbed/202210071601566.gif)

### 摄像头获取媒体流及一些其他操作

首先我们通过一个简单的拍照小应用来看一下如何通过摄像头获取媒体流。

![](https://assets.fedtop.com/picbed/202209142147208.png)

先设置好用于播放媒体流的 video 标签，添加一个 autoplay 属性，这样就可以在摄像头获取到媒体流后自动播放了。

```html
<video id="localVideo" autoplay playsinline muted></video>
```

**需要注意的是，WebRTC 只能在 HTTPS 协议或者 localhost 下使用，如果是 HTTP 协议，会报错。**

![](https://assets.fedtop.com/picbed/202210072035433.png)

这里我们暂时使用 localhost 做简单的演示，后面通过`信令服务器`实现实时音视频的章节我会讲到如何在本地用 `mkcert` 做自签名证书。

ok, continue ~

我们主要通过`navigator.mediaDevices.getUserMedia(constraints)`这个 api 来获取媒体流，这个方法接收一个配置对象作为参数，配置对象中包含了媒体流的类型，以及媒体流的分辨率等信息。

```typescript
// 获取本地音视频流
async function getLocalStream(constraints: MediaStreamConstraints) {
  // 获取媒体流
  const stream = await navigator.mediaDevices.getUserMedia(constraints)
}
```

其中`constraints`指定了请求的媒体类型和相对应的参数，用于配置视频流和音频流的信息。

我可以看下`constraints`参数中具体支持哪些配置项，可以通过`navigator.mediaDevices.getSupportedConstraints()`这个方法来获取。

```typescript
console.log(
  '🚀🚀🚀 / SupportedConstraints',
  navigator.mediaDevices.getSupportedConstraints(),
)
```

我们把它打印出来，可以看到它支持的配置项有：  
![](https://assets.fedtop.com/picbed/202210071816101.png)

通常我们不设置`constraints`参数，那么默认就是获取摄像头和麦克风的媒体流，如果我们只想要获取摄像头的媒体流，那么我们可以这样设置：

```typescript
navigator.mediaDevices.getUserMedia({
  audio: false,
  video: true,
})
```

如果我们想要获取视频的高度宽度，那么我们可以这样设置：

```typescript
navigator.mediaDevices.getUserMedia({
  audio: false,
  video: {
    width: 1280,
    height: 720,
  },
})
```

诸如此类，video 中也可以设置设备 id 或者前后置摄像头...， 大家可以在支持的情况下根据自己的需求来设置即可。具体可以查看[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getUserMedia)。这里我不做过多的介绍了，我们继续。

获取通过摄像头获取媒体流后，将媒体流赋值给 video 标签的 srcObject 属性，让其播放。

```typescript
// 获取本地音视频流
async function getLocalStream(constraints: MediaStreamConstraints) {
  // 获取媒体流
  const stream = await navigator.mediaDevices.getUserMedia(constraints)
  // 将媒体流设置到 video 标签上播放
  playLocalStream(stream)
}

// 播放本地视频流
function playLocalStream(stream: MediaStream) {
  const videoEl = document.getElementById('localVideo') as HTMLVideoElement
  videoEl.srcObject = stream
}

getLocalStream({
  audio: false,
  video: true,
})
```

实现拍照功能，canvas 标签可以将媒体流绘制到 canvas 上，也可以通过 toDataURL 方法将 canvas 转换为 base64 图片后做一些其他操作。

附上一个 👉 [体验地址](https://frontend-park.vercel.app/audio-and-video/webRTC/take-photos)

![](https://assets.fedtop.com/picbed/202210071514394.png)

```html
<video id="localVideo" autoplay playsinline muted></video>
<div v-for="(item,index) in imgList.length" :key="index" class="item">
  <img :src="item" alt="" />
</div>
```

我们通过获取已经在播放媒体流的 video 标签，然后将其绘制到 canvas 上，再通过 toDataURL 方法将 canvas 转换为 base64 图片。

这里你可以加一些滤镜或者加一些美颜功能或是其他的操作，最终生成的 imgUrl 给到 img 标签让其展示就行了。

```typescript
// 拍照
function takePhoto() {
  const videoEl = document.getElementById('localVideo') as HTMLVideoElement
  const canvas = document.createElement('canvas')
  canvas.width = videoEl.videoWidth
  canvas.height = videoEl.videoHeight
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height)
  imgList.value.push(canvas.toDataURL('image/png'))
  console.log('🚀🚀🚀 / imgList', imgList)

  // 添加滤镜
  const filterList = [
    'blur(5px)', // 模糊
    'brightness(0.5)', // 亮度
    'contrast(200%)', // 对比度
    'grayscale(100%)', // 灰度
    'hue-rotate(90deg)', // 色相旋转
    'invert(100%)', // 反色
    'opacity(90%)', // 透明度
    'saturate(200%)', // 饱和度
    'saturate(20%)', // 饱和度
    'sepia(100%)', // 褐色
    'drop-shadow(4px 4px 8px blue)', // 阴影
  ]

  for (let i = 0; i < filterList.length; i++) {
    ctx.filter = filterList[i]
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height)
    imgList.value.push(canvas.toDataURL('image/png'))
  }
}
```

拍摄的时候我们也可以切换摄像头，这里我们通过调用 `navigator.mediaDevices.enumerateDevices` 方法，获取到所有的设备，然后筛选出 videoinput 类型的设备，最后通过不同的设备 id 来实现切换摄像头。

```typescript
// 获取所有视频输入设备
async function getDevices() {
  const devices = await navigator.mediaDevices.enumerateDevices()
  console.log('🚀🚀🚀 / devices', devices)
  let videoDevices = devices.filter((device) => device.kind === 'videoinput')
}
```

```typescript
// 切换设备
function handleDeviceChange(deviceId: string) {
  getLocalStream()
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      deviceId: { exact: deviceId },
    },
  })
}
```

这里我们把获取到的设备列表信息打印看看，我们可以看到每个设备都有一个 deviceId，我们就是通过这个 id 来切换设备的。

![](https://assets.fedtop.com/picbed/202210071725076.png)

可以看到，获得了多个摄像头设备，我这里是一个笔记本自带的摄像头和一个 OBS 虚拟摄像头，包括最近 MacOs 更新到 Ventura 13 ,IOS 更新到 16 后的`连续互通摄像头`，都可以获取到。这样我们就可以在视频的时候，就可以通过拍摄更清晰的手机后置来拍摄了。

虚拟摄像头更有意思，在 OBS 中开启虚拟摄像头后，可以播放一个视频，然后进行视频会议，这样你甚至可以提前录制好一个端坐的视频（简直是上网课必备！😅），我之前试过播放特朗普的视频，然后微信视频，对面看到的确实是特朗普在演讲，所以说这方面很有安全隐患，所以大家在网上和别人视频的时候，还是需要注意下，对方可能不是真的。跑题了，我们继续。🦄🦄🦄

![](https://assets.fedtop.com/picbed/202210071650410.png)

说完了切换摄像头，我们再来看看如何在支持切换前后置摄像头的设备上如何切换前后摄像头。我们可以通过指定 `facingMode` 来实现，facingMode 有 4 个值，分别是 user、environment 和 left、right，分别对应前后摄像头和左右摄像头。

当需要强制使用前置摄像头时，可以使用 exact 关键字，例如 facingMode: { exact: 'user' }，

```typescript
// 切换前后摄像头
function switchCamera(val: number) {
  let constraints = {
    video: true, // 开启默认摄像头
    audio: true,
  }
  constraints.video = {
    // 强制切换前后摄像头时，当摄像头不支持时，会报一个OverconstrainedError［无法满足要求的错误］
    facingMode: { exact: val === 1 ? 'user' : 'environment' },
    // 也可以这样当前后摄像头不支持切换时，会继续使用当前摄像头，好处是不会报错
    // facingMode: val === 1 ? 'user' : 'environment',
  }

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      ElMessage.success('切换成功')
      playLocalStream(stream)
    })
    .catch((err) => {
      ElMessage.error('你的设备不支持切换前后摄像头')
    })
}
switchCamera(1) // 切换前置摄像头
```

![](https://assets.fedtop.com/picbed/202210071650707.png)

通过这个简单的拍照小应用，相信我们已经知道了通过摄像头获取媒体流的大概流程以及一些常用的 API 了。

ok, continue ~

### 通过屏幕共享获取获取媒体流，实现录制等操作

在 WebRTC 中，我们可以通过 `getDisplayMedia` 来获取屏幕共享的媒体流，这个 API 与 `getUserMedia` 类似，但是它只能获取屏幕共享的媒体流。

```typescript
// 获取屏幕共享的媒体流
async function shareScreen() {
  let localStream = await navigator.mediaDevices.getDisplayMedia({
    audio: true,
    video: true,
  })
  // 播放本地视频流
  playStream(localStream)
}

// 在视频标签中播放视频流
function playStream(stream: MediaStream) {
  const video = document.querySelector('#localVideo') as HTMLVideoElement
  video.srcObject = stream
}
```

执行 `shareScreen` 函数后，会弹出一个权限询问框，询问是否允许获取屏幕共享的媒体流。

然后你就可以分享你的整个屏幕，如果你又多个屏幕的话，你可以选择其中一个进行分享  
![](https://assets.fedtop.com/picbed/202210072051572.png)

然后你也可以选择只分享你屏幕上的某个应用的窗口，不用担心你一边干嘛干嘛一边录制屏幕，它只会捕捉你选择的应用窗口的内容。非常 nice。

![](https://assets.fedtop.com/picbed/202210072052315.png)

你甚至可以在你浏览器打开的各种页面中，选择一个你想要分享的网页，当你页面各种切换时候，你的屏幕共享也只会显示你选择的网页的内容。

共享前你可以随便选一个进行预览，然后可以选择是否分享的时候包含页面中的音频，这样你获取的媒体流就会包含音频轨道了。

![](https://assets.fedtop.com/picbed/202210072055425.png)

这里我打开自己 github 的网页，然后点击屏幕共享，可以看到共享的只有自己的 github 页面了。不用担心会有什么奇怪的东西乱入进来，非常适合视频会议或者在线教育等场景。

![](https://assets.fedtop.com/picbed/202210072053639.png)

说完获取屏幕媒体流，接下来我们来看看如何通过媒体流进行录制。

[完整的 MIME 类型列表](https://www.iana.org/assignments/media-types/media-types.xhtml)

这里我们使用 `MediaRecorder` 来进行录制，它是一个用于录制媒体流的 API，它可以将媒体流中的数据进行录制，然后将录制的数据保存成一个文件。

由于 `MediaRecorder` api 的对 mimeType 参数的支持是有限的。所以我们需要通过 `MediaRecorder.isTypeSupported` 来判断当前浏览器是否支持我们需要的 mimeType。

chrome 中 `MediaRecorder` 支持的 `mimeType` 如下：

```sh
"video/webm"
"video/webm;codecs=vp8"
"video/webm;codecs=vp9"
"video/webm;codecs=h264"
"video/x-matroska;codecs=avc1"
```

![](https://assets.fedtop.com/picbed/202210080215606.png)

为了验证上述的内容，这里我把一些常用的 mimeType 列出来，拼装后通过 `MediaRecorder.isTypeSupported` 来判断是否支持，最后放到下拉框中供用户根据自己的需求选择合适的 mimeType。

```typescript
// 获取支持的媒体类型
function getSupportedMimeTypes() {
  const media = 'video'
  // 常用的视频格式
  const types = [
    'webm',
    'mp4',
    'ogg',
    'mov',
    'avi',
    'wmv',
    'flv',
    'mkv',
    'ts',
    'x-matroska',
  ]
  // 常用的视频编码
  const codecs = ['vp9', 'vp9.0', 'vp8', 'vp8.0', 'avc1', 'av1', 'h265', 'h264']
  // 支持的媒体类型
  const supported: string[] = []
  const isSupported = MediaRecorder.isTypeSupported
  // 遍历判断所有的媒体类型
  types.forEach((type: string) => {
    const mimeType = `${media}/${type}`
    codecs.forEach((codec: string) =>
      [
        `${mimeType};codecs=${codec}`,
        `${mimeType};codecs=${codec.toUpperCase()}`,
      ].forEach((variation) => {
        if (isSupported(variation)) supported.push(variation)
      }),
    )
    if (isSupported(mimeType)) supported.push(mimeType)
  })
  return supported
}

console.log(getSupportedMimeTypes())
```

可以看到这么多排列组合后，筛选出的支持的 mimeType 也就只有`"video/webm"`和 ` "video/x-matroska"` 两种。

![](https://assets.fedtop.com/picbed/202210080136400.png)

目前最常用的一般都是 `video/mp4`。 截止到目前为止，最佳的 8 种视频格式为：`mp4` ,`webm` ,`mov` ,`avi` ,`mkv` ,`wmv` ,`avchd` ,`flv`。而 webm 是 Google 专门为 web 端推出的一种视频格式。100% 开源，且 100%兼容 Google Chrome 浏览器和 Android 设备。如果你没有强烈的需求，也可以使用 webm 格式。

说了这么多，不支持就不能录制成 mp4 了？🥲  
肯定不是啊 😂

都拿到 blob 了，可以通过 `ffmpeg.js` 来将 webm 格式转换成 mp4 格式，但是 `ffmpeg.js` 的体积比较大，太重了。这里也可以通过一种 hack 的方式来实现。

```typescript
// 录制媒体流
function startRecord() {
  const kbps = 1024
  const Mbps = kbps * kbps
  const options = {
    audioBitsPerSecond: 128000,
    videoBitsPerSecond: 2500000,
    mimeType: 'video/webm; codecs="vp8,opus"',
  }
  const mediaRecorder = new MediaRecorder(localStream, options)
  mediaRecorder.start()

  mediaRecorder.ondataavailable = (e) => {
    // 将录制的数据合并成一个 Blob 对象
    // const blob = new Blob([e.data], { type: e.data.type })

    // 🌸重点是这个地方，我们不要把获取到的 e.data.type设置成 blob 的 type，而是直接改成 mp4
    const blob = new Blob([e.data], { type: 'video/mp4' })
    downloadBlob(blob)
  }
  mediaRecorder.onstop = (e: Event) => {
    // 停止录制
  }
}

// 下载 Blob
function downloadBlob(blob: Blob) {
  // 将 Blob 对象转换成一个 URL 地址
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  // 设置 a 标签的 href 属性为刚刚生成的 URL 地址
  a.href = url
  // 设置 a 标签的 download 属性为文件名
  a.download = `${new Date().getTime()}.${blob.type.split('/')[1]}`
  // 模拟点击 a 标签
  a.click()
  // 释放 URL 地址
  URL.revokeObjectURL(url)
}
```

然后我们就可以愉快的录制视频了。当然这里只是用分享屏幕的方式来录制视频，如果你想要录制摄像头的视频，也是一样，拿到媒体流后，就可以直接录制了。

[👉 线上体验地址：](https://frontend-park.vercel.app/audio-and-video/webRTC/audio-and-video/webRTC/record)

![](https://assets.fedtop.com/picbed/202210080230355.gif)

当然，既然都拿到了媒体流，那么我们也可以将媒体流中的视频轨道录制成 gif 图片，这样在一些场景下分享起来也会更加方便。

![](https://assets.fedtop.com/picbed/202210072359705.png)

由于 `MediaRecorder` api 不支持将 mimeType 设置成 image/gif ，所以我们需要借助一个第三方库`MediaStreamRecorder`来实现。它的用法和 `MediaRecorder` 基本一致。我就不再赘述了。

### 通过

## 常用的 API

[拍照](https://developer.mozilla.org/zh-CN/docs/Web/API/Media_Capture_and_Streams_API/Taking_still_photos)

## 信令服务器

https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API/Signaling_and_video_calling

https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API/Session_lifetime#%E4%BF%A1%E4%BB%A4

### 什么叫信令？

信令是在两个设备之间发送控制信息以确定通信协议、信道、媒体编解码器和格式以及数据传输方法以及任何所需的路由信息的过程。 关于 WebRTC 的信令流程最重要的一点是：**信令在规范中并没有定义。**所以开发者需要自己决定如何实现这个过程。开发者可以为应用程序引擎选择任意的信息协议（如 SIP 或 XMPP），任意双向通信信道（如 WebSocket 或 XMLHttpRequest) 与持久连接服务器的 API（如 Google Channel API）一起工作。

你可能会想，为什么这么一个对于建立 WebRTC 连接至关重要的基本过程居然没有定义在规范里？ 答案很简单：由于两个设备无法直接相互联系，规范无法预测 WebRTC 的所有可能用例，因此更明智的做法就是让开发人员们自己选择合适的网络技术和消息传递协议。

加微信？谈恋爱，没有微信，借助第三方闺蜜

## 拨打微信

微信接收，轮询 socket，第三方？p2p？

## 引用

https://baijiahao.baidu.com/s?id=1714740880954778889&wfr=spider&for=pc

https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API/Protocols

https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API/Session_lifetime

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
