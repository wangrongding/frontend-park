# frontent-park

一个有趣的前端趣味知识公园~  
该项目是我平时捣鼓的一些好玩的前端知识案例集合,喜欢的小伙伴也可以自己 fork 到仓库后随意玩耍

<img
    src="https://assets.fedtop.com/picbed/20220531142022.png"
    alt=""
    style="width:400px"
/>

## 开发

### 安装依赖

```sh
yarn
```

## 需要注意的是

由于该仓库有一些依赖包,依赖了二进制文件

如果遇到 `node-pre-gyp ERR! ` `gyp ERR!`等问题,按照下面的方法解决

```sh

# 在node-gyp之前安装 (windows用户在powershell(管理员身份)中安装)
npm install -g --production windows-build-tools

# 全局安装node-gyp
npm install -g node-gyp
```

如果仍然不行,检查本地是否安装了 Python,没有则安装 👉 [官方地址](https://www.python.org/downloads/)

## 本地运行

```sh
yarn dev
```

## 打包

```sh
yarn build
```

## 格式化代码并执行 eslint 校验

```sh
yarn fal
```

## 我的博客

所有示例的具体实现和技术说明，在我的博客中都有对应的文章

<img
    src="https://assets.fedtop.com/picbed/20220531142049.png"
    alt=""
    style="width:400px"
/>

[博客地址](https://www.fedtop.com/)

## 包含项目

### ThreeJs

<img
    src="https://assets.fedtop.com/picbed/202202141040652.gif"
    alt=""
    style="width:400px"
/>

### 隐写术

#### 文本隐写

<img
    src="https://assets.fedtop.com/picbed/20220531142208.png"
    alt=""
    style="width:400px"
/>

#### 图片隐写

<img
    src="https://assets.fedtop.com/picbed/20220531142226.png"
    alt=""
    style="width:400px"
/>

未完待续!

- [x] 文本隐写
- [x] 图片隐写
- [ ] 音频隐写
- [ ] 视频隐写

### 千图成像

<img
    src="https://files.mdnice.com/user/17056/d6c67ad8-64c5-46b9-a966-e259550e18a9.gif"
    alt=""
    style="width:400px"
/>

<img
    src="https://files.mdnice.com/user/17056/9617bf11-1dd9-47b0-b4e9-41db87866f77.gif"
    alt=""
    style="width:400px"
/>

(未完成的功能不影响现在项目的使用,只是一些优化的部分)

- [x] 目标图生成(基本功能) -- 完成
- [ ] 自定义分布方式 -- 待完成
- [ ] 自定义按比例调整 -- 待完成
- [ ] 自定义方向／比例 -- 待完成
- [ ] 自定义贴片高度 -- 待完成
- [ ] 自定义贴片宽度 -- 待完成
- [ ] 资源图片的连续重复控制 -- 待完成

### 机器学习(基于 tensorFlow.js 的前端实现)

    该示例正在捣鼓中...

### WebRTC 音视频协同

    该示例正在捣鼓中...
