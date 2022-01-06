# 教练！我想学 three.js 🔥

ok,想要了解 threejs 的 3d 效果，先了解这几个概念

> 1. 场景(Scene)：是物体、光源等元素的容器，可以配合 chrome 插件使用，抛出 window.scene 即可实时调整 obj 的信息和材质信息。
> 2. 相机（Camera）：场景中的相机，代替人眼去观察，场景中只能添加一个，一般常用的是透视相机（PerspectiveCamera）
> 3. 物体对象（Mesh）：包括二维物体（点、线、面）、三维物体，模型等等
> 4. 光源（Light）：场景中的光照，如果不添加光照场景将会是一片漆黑，包括全局光、平行光、点光源等
> 5. 渲染器（Renderer）:场景的渲染方式，如 webGL\canvas2D\Css3D。
> 6. 控制器(Control): 可通过键盘、鼠标控制相机的移动

## 场景(Scene)

场景(Scene)：是物体、光源等元素的容器，可以配合 chrome 插件使用，抛出 window.scene 即可实时调整 obj 的信息和材质信息。

定义场景

```javascript
//定义场景
let scene = new THREE.Scene();
```

## 相机（Camera）

场景中的相机，代替人眼去观察，场景中只能添加一个，一般常用的是透视相机（PerspectiveCamera）  
定义摄像机

```javascript
//定义摄像机
let camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
//设置相机位置(x,y,z)
camera.position.set(-50, 50, 50);
// 通过lookAt将摄像机指向场景中心,(默认指向0,0,0)
camera.lookAt(scene.position);
```

## 渲染器（Renderer）

定义渲染器

```javascript
//定义渲染器
let renderer = new THREE.WebGLRenderer();
//设置场景的背景颜色
renderer.setClearColor(new THREE.Color(0x000000));
//设置场景大小
renderer.setSize(window.innerWidth, window.innerHeight);
```

将渲染结果添加到 dom 元素中

```javascript
// 将渲染结果添加到dom元素中
document.getElementById("webgl-output").appendChild(renderer.domElement);
//使用指定的摄像机来渲染场景
renderer.render(scene, camera);
```

## 物体对象（Mesh）

物体对象（Mesh）：包括二维物体（点、线、面）、三维物体，模型等等

创建平面

```javascript
//定义平面的大小
let planeGeometry = new THREE.PlaneGeometry(40, 40);
// 通过创建材质对象来设置平面的外观,这里使用的是基本材质
let planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xaaaaaa,
});
//将大小和外观组合进Mesh对象,赋值给平面对象
let plane = new THREE.Mesh(planeGeometry, planeMaterial);
//平面绕x轴旋转九十度
plane.rotation.x = -0.5 * Math.PI;
// 定义其在场景中的位置
plane.position.set(0, 0, 0);
//添加平面到场景中
scene.add(plane);
```

创建方块

```javascript
// 定义方块大小
let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
//定义方块外观
let cubeMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
//设置方块位置
cube.position.set(5, 5, 5);
// 添加到场景中
scene.add(cube);
```

创建球体

```javascript
//定义球体大小
let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
//定义球体外观
let sphereMaterial = new THREE.MeshBasicMaterial({
  color: 0x7777ff,
  wireframe: true,
});
let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(-15, 5, 5);
scene.add(sphere);
```

## 动画

...持续更新中

## 光源（Light）

...持续更新中

## 控制器(Control)

...持续更新中
