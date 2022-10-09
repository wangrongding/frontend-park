<script setup lang="ts">
import * as THREE from 'three'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// 创建场景
const scene = new THREE.Scene()
// 给场景添加雾化效果
scene.fog = new THREE.Fog(0x123, 5, 10)
scene.fog = new THREE.FogExp2(0xffffff, 0.004)
// 定义摄像机
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / (window.innerHeight - 60),
  0.1,
  1000,
)

// 创建坐标系,设置轴线的长度为20
const axes = new THREE.AxesHelper(10)
scene.add(axes)

// // 创建平面
// const planeGeometry = new THREE.PlaneGeometry(200, 200)
// // 通过创建材质对象来设置平面的外观,这里使用的是基本材质
// const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
// // 将大小和外观组合进Mesh对象,赋值给平面对象
// const plane = new THREE.Mesh(planeGeometry, planeMaterial)
// // 平面绕x轴旋转九十度
// plane.rotation.x = -0.5 * Math.PI
// // 定义其在场景中的位置
// plane.position.set(15, -20, 0)
// // 添加平面到场景中
// scene.add(plane)

// 创建光源
const spotLight = new THREE.SpotLight(0xffffff)
// 设置光源位置
spotLight.position.set(-40, 60, -10)
// 启用阴影功能
spotLight.castShadow = true
// 将光源添加进场景
scene.add(spotLight)

// 创建太阳，并添加贴图
const sunGeometry = new THREE.SphereGeometry(10, 32, 32)
const sunMaterial = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load(
    'https://assets.fedtop.com/picbed/sun_color.jpg',
  ),
})
const sun = new THREE.Mesh(sunGeometry, sunMaterial)
sun.position.set(0, 0, 0)
scene.add(sun)

// 创建水星
const mercuryGeometry = new THREE.SphereGeometry(0.5, 32, 32)
const mercuryMaterial = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load(
    'https://assets.fedtop.com/picbed/mercury_color.jpg',
  ),
})
const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial)
mercury.position.set(15, 0, 0)
scene.add(mercury)

// 创建金星
const venusGeometry = new THREE.SphereGeometry(0.8, 32, 32)
const venusMaterial = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load(
    'https://assets.fedtop.com/picbed/venus_color.jpg',
  ),
})
const venus = new THREE.Mesh(venusGeometry, venusMaterial)
venus.position.set(18, 0, 0)
scene.add(venus)

// 创建地球
const earthGeometry = new THREE.SphereGeometry(1, 32, 32)
const earthMaterial = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load(
    'https://assets.fedtop.com/picbed/earth_color.jpg',
  ),
})
const earth = new THREE.Mesh(earthGeometry, earthMaterial)
earth.position.set(22, 0, 0)
scene.add(earth)

// 创建火星
const marsGeometry = new THREE.SphereGeometry(0.6, 32, 32)
const marsMaterial = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load(
    'https://assets.fedtop.com/picbed/mars_color.jpg',
  ),
})
const mars = new THREE.Mesh(marsGeometry, marsMaterial)
mars.position.set(25, 0, 0)
scene.add(mars)

// 创建木星
const jupiterGeometry = new THREE.SphereGeometry(2, 32, 32)
const jupiterMaterial = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load(
    'https://assets.fedtop.com/picbed/jupiter_color.jpg',
  ),
})
const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial)
jupiter.position.set(30, 0, 0)
scene.add(jupiter)

// 创建土星
const saturnGeometry = new THREE.SphereGeometry(1.8, 32, 32)
const saturnMaterial = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load(
    'https://assets.fedtop.com/picbed/saturn_color.jpg',
  ),
})
const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial)
saturn.position.set(35, 0, 0)
scene.add(saturn)

// 创建天王星
const uranusGeometry = new THREE.SphereGeometry(1.5, 32, 32)
const uranusMaterial = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load(
    'https://assets.fedtop.com/picbed/uranus_color.jpg',
  ),
})
const uranus = new THREE.Mesh(uranusGeometry, uranusMaterial)
uranus.position.set(40, 0, 0)
scene.add(uranus)

// 创建海王星
const neptuneGeometry = new THREE.SphereGeometry(1.4, 32, 32)
const neptuneMaterial = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load(
    'https://assets.fedtop.com/picbed/neptune_color.jpg',
  ),
})
const neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial)
neptune.position.set(45, 0, 0)
scene.add(neptune)

// 给行星添加动画
const animate = () => {
  // 旋转太阳
  sun.rotation.y += 0.005
  // 旋转水星
  mercury.rotation.y += 0.028
  mercury.position.x = 10 * Math.cos(mercury.rotation.y)
  mercury.position.z = 10 * Math.sin(mercury.rotation.y)
  // 旋转金星
  venus.rotation.y += 0.027
  venus.position.x = 20 * Math.cos(venus.rotation.y)
  venus.position.z = 20 * Math.sin(venus.rotation.y)
  // 旋转地球
  earth.rotation.y += 0.026
  earth.position.x = 30 * Math.cos(earth.rotation.y)
  earth.position.z = 30 * Math.sin(earth.rotation.y)
  // 旋转火星
  mars.rotation.y += 0.025
  mars.position.x = 40 * Math.cos(mars.rotation.y)
  mars.position.z = 40 * Math.sin(mars.rotation.y)
  // 旋转木星
  jupiter.rotation.y += 0.024
  jupiter.position.x = 50 * Math.cos(jupiter.rotation.y)
  jupiter.position.z = 50 * Math.sin(jupiter.rotation.y)
  // 旋转土星
  saturn.rotation.y += 0.023
  saturn.position.x = 60 * Math.cos(saturn.rotation.y)
  saturn.position.z = 60 * Math.sin(saturn.rotation.y)
  // 旋转天王星
  uranus.rotation.y += 0.022
  uranus.position.x = 70 * Math.cos(uranus.rotation.y)
  uranus.position.z = 70 * Math.sin(uranus.rotation.y)
  // 旋转海王星
  neptune.rotation.y += 0.021
  neptune.position.x = 80 * Math.cos(neptune.rotation.y)
  neptune.position.z = 80 * Math.sin(neptune.rotation.y)
  // 渲染场景
  renderer.render(scene, camera)
  // 递归调用
  requestAnimationFrame(animate)
}

// 创建渲染器
const renderer = new THREE.WebGLRenderer()
// 设置场景的背景颜色
renderer.setClearColor(new THREE.Color(0x000))
// 设置场景大小
renderer.setSize(window.innerWidth, window.innerHeight - 60)
// 设置相机位置(x,y,z)
camera.position.set(-100, 40, 100)
// 通过lookAt将摄像机指向场景中心,(默认指向0,0,0)
camera.lookAt(scene.position)
// 开启阴影
renderer.shadowMap.enabled = true
// 使用指定的摄像机来渲染场景
renderer.render(scene, camera)

// 创建飞行控制器
const flyControls = new FlyControls(camera, renderer.domElement)
flyControls.movementSpeed = 10
flyControls.domElement = renderer.domElement
flyControls.rollSpeed = Math.PI / 24
flyControls.autoForward = false
flyControls.dragToLook = true
// 创建轨道控制器
const orbitControls = new OrbitControls(camera, renderer.domElement)
orbitControls.autoRotate = true
orbitControls.autoRotateSpeed = 0.5
orbitControls.enableDamping = true
orbitControls.dampingFactor = 0.25
orbitControls.enableZoom = true
// 渲染场景
renderScene()

// 渲染场景
function renderScene() {
  // 更新控制器
  // flyControls.update(clock.getDelta())
  // orbitControls.update()

  // 更新场景
  renderer.render(scene, camera)
  // 更新动画
  requestAnimationFrame(renderScene)
}

// 将渲染结果添加到dom元素中
function init() {
  document.getElementById('webgl-output')!.appendChild(renderer.domElement)
  animate()
}

// 监听窗口变化
window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight - 60)
}

onMounted(() => {
  init()
})
</script>
<template>
  <div class="planet-container">
    <FilepathBox file-path="__filePath__" />
    <div id="webgl-output"></div>
  </div>
</template>
<style lang="scss" scoped>
.planet-container {
  color: black;
}
</style>
