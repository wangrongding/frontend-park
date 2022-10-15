<script setup lang="ts">
import * as THREE from 'three'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// 创建场景
const scene = new THREE.Scene()
// 给场景添加雾化效果
// scene.fog = new THREE.Fog(0x123, 5, 10)
// scene.fog = new THREE.FogExp2(0xffffff, 0.004)
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

// 创建平面
// const planeGeometry = new THREE.PlaneGeometry(100, 100)
// // 通过创建材质对象来设置平面的外观,这里使用的是基本材质
// const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x000 })
// // 将大小和外观组合进Mesh对象,赋值给平面对象
// const plane = new THREE.Mesh(planeGeometry, planeMaterial)
// // 平面绕x轴旋转九十度
// plane.rotation.x = -0.5 * Math.PI
// // 定义其在场景中的位置
// plane.position.set(0, -20, 0)
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

// 行星配置
const planetsConfiguration = [
  {
    name: '太阳',
    radius: 16,
    distance: 0,
    speed: 0,
    map: 'https://assets.fedtop.com/picbed/sun_color.jpg',
  },
  {
    name: '水星',
    radius: 0.5,
    distance: 24,
    speed: 0.02,
    map: 'https://assets.fedtop.com/picbed/mercury_color.jpg',
  },
  {
    name: '金星',
    radius: 0.8,
    distance: 26,
    speed: 0.015,
    map: 'https://assets.fedtop.com/picbed/venus_color.jpg',
  },
  {
    name: '地球',
    radius: 1,
    distance: 28,
    speed: 0.03,
    map: 'https://assets.fedtop.com/picbed/earth_color.jpg',
  },
  {
    name: '火星',
    radius: 0.8,
    distance: 30,
    speed: 0.025,
    map: 'https://assets.fedtop.com/picbed/mars_color.jpg',
  },
  {
    name: '木星',
    radius: 3,
    distance: 40,
    speed: 0.02,
    map: 'https://assets.fedtop.com/picbed/jupiter_color.jpg',
  },
  {
    name: '土星',
    radius: 3,
    distance: 50,
    speed: 0.015,
    map: 'https://assets.fedtop.com/picbed/saturn_color.jpg',
  },
  {
    name: '天王星',
    radius: 1.5,
    distance: 60,
    speed: 0.01,
    map: 'https://assets.fedtop.com/picbed/uranus_color.jpg',
  },
  {
    name: '海王星',
    radius: 1.1,
    distance: 70,
    speed: 0.008,
    map: 'https://assets.fedtop.com/picbed/neptune_color.jpg',
  },
]

// 生成太阳系
const planets: any = planetsConfiguration.map((planet, index) => {
  // 创建行星
  const geometry = new THREE.SphereGeometry(planet.radius, 20, 20)
  const material = new THREE[
    index === 0 ? 'MeshBasicMaterial' : 'MeshLambertMaterial'
  ]({
    map: new THREE.TextureLoader().load(planet.map),
  })
  const mesh = new THREE.Mesh(geometry, material)
  // 设置行星的位置
  mesh.position.x = planet.distance
  // 将行星添加到场景中
  scene.add(mesh)
  // 将行星添加到行星列表中
  return {
    mesh,
    speed: planet.speed,
    distance: planet.distance,
  }
})

// 创建宇宙背景
const spaceTexture = new THREE.TextureLoader().load(
  // 'https://assets.fedtop.com/picbed/202210152003603.png',
  'https://assets.fedtop.com/picbed/wallhaven-dp2y7g_1280x720.png',
  // 'https://assets.fedtop.com/picbed/wallhaven-13ggqw_1280x720.png',
  // 'https://assets.fedtop.com/picbed/wallhaven-g7r3vd.jpg',
)
scene.background = spaceTexture

// 行星运动动画
function animate() {
  // 循环遍历行星列表
  planets.forEach((planet: any, index: number) => {
    // 自旋
    planet.mesh.rotation.y += planet.speed + 0.001
    // 公转
    planet.mesh.position.x = planet.distance * Math.cos(planet.mesh.rotation.y)
    planet.mesh.position.z = planet.distance * Math.sin(planet.mesh.rotation.y)
  })
  // 渲染场景
  renderer.render(scene, camera)
  // 递归调用animate函数
  requestAnimationFrame(animate)
}

// 创建渲染器
const renderer = new THREE.WebGLRenderer()
// 设置场景的背景颜色
renderer.setClearColor(new THREE.Color(0x000))
// 设置场景大小
renderer.setSize(window.innerWidth, window.innerHeight - 60)
// 设置相机位置(x,y,z)
camera.position.set(-200, 80, 200)
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
