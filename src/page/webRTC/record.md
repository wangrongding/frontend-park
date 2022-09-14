# webrtc 代码记录

## 记录

### 获取摄像头

```typescript
navigator.mediaDevices.getUserMedia(constraints)

navigator.mediaDevices
  .getUserMedia(constraints)
  .then(function (stream) {
    /* 使用这个 stream stream */
  })
  .catch(function (err) {
    /* 处理 error */
  })
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

### 分享屏幕

```typescript
navigator.mediaDevices.getDisplayMedia(constraints)
```

第一次 mac 需要同意，或者自己到设置中打开  
![](https://assets.fedtop.com/picbed/202209142011041.png)

![](https://assets.fedtop.com/picbed/202209142019128.png)

### 连接

![](https://assets.fedtop.com/picbed/202209150123502.png)

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

https://www.jianshu.com/p/7cb5c2cffaaa

## 一些边角问题

- cmake 问题： http://jotmynotes.blogspot.com/2016/10/updating-cmake-from-2811-to-362-or.html
