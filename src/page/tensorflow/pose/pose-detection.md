## WebRTC + Tensorflow.js 在运动健康类 app 中的前端应用

## 前言

你可能会想，作为一个`前端开发员`,既没有人工智能和机器学习的基础，又没有深厚的学术理论功底能做`深度学习`吗？

答案是肯定的。 为什么呢？

首先，我们要知道的是，目前社区中已经有很多非常成熟并且已经训练好的模型，比如：`人脸识别`、`人体姿态识别`、`图像分类`、`图像分割`、`目标检测`等等等等，非常多，这些模型都是经过大量的数据训练得到的，我们只需要学会如何使用这些模型，并不需要自己去写算法，去训练模型。它就像 `npm` 的包一样，安装它，看文档，使用它，就可以了。

![](https://assets.fedtop.com/picbed/202211301130179.gif)

如果我们只是从`应用深度学习`的角度出发，去使用现成的模型，来解决我们现实中存在的问题。那么就像前后端分离一样，让专业的人去做专业的事，深度学习也是如此，我们并不需要去花很多时间，深入了解深度学习的原理，也不需要自己去训练复杂的算法模型。

![](https://assets.fedtop.com/picbed/202211301131970.gif)

而 `Tensorflow.js` 就是一扇前端开发人员进入深度学习领域最好的大门，它提供了一套完整的 API，让我们可以很方便的使用深度学习模型。它可以在浏览器中运行，也可以在 node.js 中运行。它的 API 设计非常简单，而且它的文档也非常详细，我们可以很快的上手。

一些常见的深度学习模型可以看 [👉🏻 开箱即用的 TensorFlow.js 预训练模型](https://www.tensorflow.org/js/models),它们都是开源的[👉🏻 Github 地址](https://github.com/tensorflow/tfjs-models)。

社区中所有的模型可以在这里找到 [👉🏻 TensorFlow Hub](https://tfhub.dev/)

![](https://assets.fedtop.com/picbed/202211301125299.png)

## 人体姿态识别

在这篇文章中，我们将会介绍如何使用 WebRTC 相关 API 结合 `Tensorflow.js` 来实现一个运动直播的应用。

TensorFlow.js 与 WebRTC 结合，可以实现实时的人体姿态检测，从而可以在运动健康的直播中实现人体姿态的跟踪和识别。这样“老师”，或者“学员”能够更加直观的感受到自己和他人的身体姿态是否一致，能更清晰的观察动作的准确性，一致性。当然，这个应用还可以用于其他的场景，比如：`健身房`、`瑜伽教室`、`舞蹈教室`等等。

![](https://assets.fedtop.com/picbed/202211301124743.png)

人体姿态估计的方法有很多，如：基于深度学习的方法、基于传统机器学习的方法、基于几何的方法、基于动态规划的方法、基于粒子滤波的方法、基于模板匹配的方法、基于图像分割的方法、基于人体姿态模型的方法等。

基于深度学习的方法是目前最流行的人体姿态估计方法。基于深度学习的方法可以分为两类：一类是基于 CNN 的方法，如：OpenPose、PoseNet 等；另一类是基于 RNN 的方法，如：PoseFlow 等。

本文将介绍基于深度学习的方法，使用 `Tensorflow.js` 的 `posenet` 模型来实现人体姿态估计。

![](https://assets.fedtop.com/picbed/202211301132796.png)

ok，相关铺垫就到这里，下面我们开始正式的实现。

## 开搞

### 安装相关依赖

首先，我们需要安装 `Tensorflow.js` 相关的依赖。

```sh
npm i @tensorflow-models/pose-detection @tensorflow/tfjs-backend-webgl
```

其中 `@tensorflow-models/pose-detection` 这个包提供了多个最先进的模型来运行实时姿势检测。`@tensorflow/tfjs-backend-webgl` 这个包为 TensorFlow.js 实现了一个 GPU 加速的 WebGL 后端。可以让我们在浏览器中运行 `Tensorflow.js`。

安装好后，引入它们

```typescript
import * as poseDetection from '@tensorflow-models/pose-detection'
import '@tensorflow/tfjs-backend-webgl'
```

一开始我不知道使用`@tensorflow/tfjs-backend-webgl`,后来发现不引入会有以下错误

![](https://assets.fedtop.com/picbed/202211282323136.png)

准备工作都做好了，下面我们开始正式的实现。

### 加载模型，创建检测器

目前`@tensorflow-models/pose-detection` 已有 3 种可选模型，分别是：

`BlazePose`、`MoveNet`、`PoseNet`。其中 `BlazePose` 是基于 CNN 的方法，`MoveNet` 和 `PoseNet` 是基于 RNN 的方法。

然后它们大概的特点为：

- MoveNet：是一种速度快、准确率高的姿态检测模型，可检测人体的 17 个关键点，能够以 50+ fps 的速度在笔记本电脑和手机上运行。
- BlazePose：MediaPipe BlazePose 可以检测人体 33 个关键点，除了 17 个 COCO 关键点之外，它还为脸部、手和脚提供了额外的关键点检测。
- PoseNet：可以检测多个姿态，每个姿态包含 17 个关键点。

#### 人体关键点

到这里，我们需要了解下人体关键点的定义：

> 人体姿态估计的原理是通过检测人体的关键点来估计人体的姿态。人体的关键点包括：头部、颈部、肩部、手臂、腰部、腿部等。人体的姿态包括：站立、坐着、躺着、跑步、跳跃等。

#### MoveNet, PoseNet（COCO 关键点）

COCO 关键点包括：鼻子、左眼、右眼、左耳、右耳、左肩、右肩、左肘、右肘、左手腕、右手腕、左臀、右臀、左膝、右膝、左脚踝、右脚踝。

![](https://assets.fedtop.com/picbed/202211301135501.png)

#### BlazePose

BlazePose 返回的关键点更多， 有 33 个关键点，除了 17 个 COCO 关键点之外，它还为脸部、手和脚提供了额外的关键点检测。

![](https://assets.fedtop.com/picbed/202211301135063.png)

#### 相关逻辑

`PoseNet`最简单了，这里作为演示，直接使用 `PoseNet`让大家更容易理解。 另外两个，我也会在 demo 中更新。 完整源码在这里：[frontend-park](https://github.com/wangrongding/frontend-park)

好，我们继续，`PoseNet`模型后，创建检测器。

其中 createDetector，接收两个参数，第一个是模型，第二个是模型的相关配置。  
可配置项有很多，大家可以直接 ctrl + 鼠标左键 点击 createDetector 查看。

![](https://assets.fedtop.com/picbed/202211301354059.png)

这里我就不一一列举了，我这里主要用到的是`modelType`,它有三种模型的类型可供选择，分别为：”lite”、”full “和 “heavy”。这些改变了检测模型的大小。Lite 的检测精度最低，但性能最好，而 “heavy “的检测精度最好，但更消耗性能，而 “full “则处于中间位置。我们选择了它 。

然后我们可以定义一个初始化的函数，在这里面，把一些初始化操作都完成，比如：打开摄像头，获取媒体流，并且将媒体流赋值给 video 标签...

```html
<video id="video" autoplay playsinline class="w-[360px] h-[270px] object-fill"></video>
<canvas id="output" width="360" height="270"></canvas>
```

```typescript
// 其他地方要用到的公共变量
let posenetInput: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement
let posenetOutput: HTMLCanvasElement
let posenetOutputCtx: CanvasRenderingContext2D
let detector: PoseDetector
let model: poseDetection.SupportedModels.PoseNet

// 初始化
const init = async () => {
  // 获取 canvas 元素
  posenetOutput = document.getElementById('output') as HTMLCanvasElement
  posenetOutputCtx = posenetOutput.getContext('2d')!
  // 获取视频流
  posenetInput = document.getElementById('video') as HTMLVideoElement
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  })
  posenetInput.srcObject = stream
  // 定义模型
  model = poseDetection.SupportedModels.PoseNet
  // 加载模型
  detector = await poseDetection.createDetector(model, {
    modelType: 'full',
  })
  // 开始检测
  detectPose()
}
```

然后我们可以定义一个检测的函数，这里我们需要传入一个检测器，然后在这个函数里面，我们可以获取到检测到的结果，然后我们可以根据结果，来绘制我们的画布。

```typescript
// 开始检测
const detectPose = async () => {
  // 获取检测结果
  const poses = await detector.estimatePoses(posenetInput, {
    flipHorizontal: false, // 是否水平翻转
    maxPoses: 1, // 最大检测人数
    scoreThreshold: 0.5, // 置信度
    nmsRadius: 20, // 非极大值抑制
  })
  // 将 pose 上的 17 个关键点的坐标信息存入 pointList
  const pointList = poses[0]?.keypoints || []
  console.log('🚀🚀🚀 / pointList', pointList)
  // 。。。绘制画布
}
```

这里我们可以通过 `detector.estimatePoses` 获取到检测到的结果，这里我们需要传入两个参数，第一个是我们的输入，第二个是我们的配置项，例如其中的 `maxPoses`，它表示最大检测人数，我们这里设置为 1，因为我们只需要检测到一个人。

检测的结果信息打印出来，如下图所示：

![](https://assets.fedtop.com/picbed/202211301427919.png)

#### 绘制画布

从上面的返回信息可以看到，因为我们设置最多只检测一个人，所以检测到的结果是一个长度为 1 的数组，里面 `keypoints` 中有 17 个关键点的坐标信息，我们可以通过这些坐标信息，来绘制我们的画布。

```typescript
// 开始检测
const detectPose = async () => {
  // 。。。接上面的代码
  // 将 pose 上的 17 个关键点的坐标信息存入一个数组中
  const pointList = poses[0]?.keypoints || []

  // 绘制视频
  posenetOutputCtx.drawImage(posenetInput, 0, 0, canvas.width, canvas.height)
  // 将这 17 个关键点的坐标信息 画到 canvas 上

  // 画出所有关键点
  pointList.forEach(({ x, y, score, name }: any) => {
    if (score > 0.5) {
      // 画点
      drawPoint(x, y, 5, '#f00000', posenetOutputCtx)
    }
  })

  // 获取相邻的关键点信息
  const adjacentPairs = poseDetection.util.getAdjacentPairs(model)
  // 画出所有连线
  adjacentPairs.forEach(([i, j]: any) => {
    const kp1 = pointList[i]
    const kp2 = pointList[j]
    // score 不为空就画线
    const score1 = kp1.score != null ? kp1.score : 1
    const score2 = kp2.score != null ? kp2.score : 1
    if (score1 >= 0.5 && score2 >= 0.5) {
      // 画出所有连线
      drawSegment([kp1.x, kp1.y], [kp2.x, kp2.y], 'aqua', 1, posenetOutputCtx)
    }
  })

  // requestAnimationFrame(() => detectPose(detector))
  setTimeout(() => {
    detectPose()
  }, 50)
}
```

封装好一个画点和画线段的函数，方便上面使用。↑

```typescript
// 画点
function drawPoint(x: number, y: number, r: number, color: string, ctx: CanvasRenderingContext2D) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.fillStyle = color
  ctx.fill()
}
// 画线段
function drawSegment([ax, ay]: number[], [bx, by]: number[], color: string, scale: number, ctx: CanvasRenderingContext2D) {
  ctx.beginPath()
  ctx.moveTo(ax * scale, ay * scale)
  ctx.lineTo(bx * scale, by * scale)
  ctx.lineWidth = 4
  ctx.strokeStyle = color
  ctx.stroke()
}
```

拿到 17 个点的信息后，我们先将视频绘制到画布上，然后再将这 17 个关键点的坐标信息画到画布上，其中只有在 `score` 大于 0.5 的时候，才会绘制到画布上。 然后我们通过 `poseDetection.util.getAdjacentPairs` 获取到相邻的关键点信息，然后再将这些关键点进行连线，绘制到画布上。

然后再尾部递归调用 `detectPose` 函数，这样就可以实现实时的检测了。你可以用 `requestAnimationFrame` 来实现，也可以用 `setTimeout` 来实现，`requestAnimationFrame` 通常是每秒 60 次 , 也就是常说的 60 帧（60FPS），如果计算量特别大导致你电脑卡的话，你也可以用 `setTimeout` 自己定义间隔时长，这样就可以控制帧数了。 通常来说人眼能够感知的帧数是 24 帧，电影院的帧数也是 24 帧，所以 24 帧左右够够了。

然后我们可以看到效果图：[👉🏻 体验地址在这里](https://frontend-park.vercel.app/tensorflow/pose-detection)

![](https://assets.fedtop.com/picbed/202211301455997.gif)

## 将视频流传输给对端

媒体流处理，创建连接和信令服务相关的逻辑，我在这个专栏前三篇文章中都有写，这里就不再赘述了。

然后我们就可以通过`captureStream` API 从 canvas 中拿到视频流，然后通过 `RTCPeerConnection` 提供的 API 将视频流轨道 加到 peerConnection 中传输给对端。

```typescript
const peerConnection = new RTCPeerConnection({
  iceServers: [
    {
      urls: 'stun:stun.voipbuster.com ',
    },
  ],
})
// 获取output 中的视频流
const getVideo = () => {
  const output = document.getElementById('output') as HTMLCanvasElement
  const stream = output.captureStream()
  return stream
}

// 传输视频流
const transfer = () => {
  const stream = getVideo()
  stream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, stream)
  })
}
```

## 最后

这篇文章主要是介绍了如何使用 WebRTC 与 TensorFlow.js 的结合，实现实时的人体姿态检测。这里只是简单的做了一个 demo，实际上这方面的可玩性非常高。体感游戏，换装，语音识别，人脸识别，都可以结合这个思路来实现。

好了，这篇文章就到这里了，如果你觉得这篇文章对你有帮助或者有任何疑问，欢迎点赞或者在下方评论区留言，我会及时回复的。感谢支持。
