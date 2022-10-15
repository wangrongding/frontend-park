<script setup lang="ts">
import * as THREE from 'three'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

type Planet = {
  name: string
  radius: number
  distance: number
  speed: number
  mapImg: string
  // mesh: THREE.Mesh
}

// 行星配置
const planetsConfiguration: Planet[] = [
  {
    name: '太阳',
    radius: 16,
    distance: 0,
    speed: 0,
    mapImg: 'https://assets.fedtop.com/picbed/sun_color.jpg',
  },
  {
    name: '水星',
    radius: 0.5,
    distance: 24,
    speed: 0.02,
    mapImg: 'https://assets.fedtop.com/picbed/mercury_color.jpg',
  },
  {
    name: '金星',
    radius: 0.8,
    distance: 26,
    speed: 0.015,
    mapImg: 'https://assets.fedtop.com/picbed/venus_color.jpg',
  },
  {
    name: '地球',
    radius: 1,
    distance: 28,
    speed: 0.03,
    mapImg: 'https://assets.fedtop.com/picbed/earth_color.jpg',
  },
  {
    name: '火星',
    radius: 0.8,
    distance: 30,
    speed: 0.025,
    mapImg: 'https://assets.fedtop.com/picbed/mars_color.jpg',
  },
  {
    name: '木星',
    radius: 3,
    distance: 40,
    speed: 0.02,
    mapImg: 'https://assets.fedtop.com/picbed/jupiter_color.jpg',
  },
  {
    name: '土星',
    radius: 3,
    distance: 50,
    speed: 0.015,
    mapImg: 'https://assets.fedtop.com/picbed/saturn_color.jpg',
  },
  {
    name: '天王星',
    radius: 1.5,
    distance: 60,
    speed: 0.01,
    mapImg: 'https://assets.fedtop.com/picbed/uranus_color.jpg',
  },
  {
    name: '海王星',
    radius: 1.1,
    distance: 70,
    speed: 0.008,
    mapImg: 'https://assets.fedtop.com/picbed/neptune_color.jpg',
  },
]

// 资源预加载
function preLoadSource() {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader()
    const textureArr: THREE.Texture[] = []
    planetsConfiguration.forEach((item) => {
      const texture = loader.load(item.mapImg)
      textureArr.push(texture)
    })
    resolve(textureArr)
  })
}

// 预加载所有图片

// 创建场景
const scene = new THREE.Scene()
// 定义摄像机
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / (window.innerHeight - 60),
  0.1,
  1000,
)

// 创建坐标系
function createAxesHelper() {
  // 设置轴线的长度为10
  const axesHelper = new THREE.AxesHelper(10)
  scene.add(axesHelper)
}

// 环境光
// const ambient = new THREE.AmbientLight(new THREE.Color(0xffffff))
// scene.add(ambient)
// 点光源
const pointLight = new THREE.PointLight(new THREE.Color(0xffffff), 2, 1, 0)
pointLight.visible = true
pointLight.position.set(0, 0, 0) // 点光源在原点充当太阳
scene.add(pointLight) // 点光源添加到场景中

// 生成太阳系
const planets: any = planetsConfiguration.map((planet, index) => {
  // 创建行星
  const geometry = new THREE.SphereGeometry(planet.radius, 20, 20)
  const material = new THREE[
    index === 0 ? 'MeshBasicMaterial' : 'MeshLambertMaterial'
  ]({
    map: new THREE.TextureLoader().load(planet.mapImg),
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
function createUniverse() {
  const universeGeometry = new THREE.SphereGeometry(500, 100, 100)
  const universeMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(
      // 'https://assets.fedtop.com/picbed/202210152003603.png',
      // 'https://assets.fedtop.com/picbed/wallhaven-dp2y7g_1280x720.png',
      // 'https://assets.fedtop.com/picbed/wallhaven-13ggqw_1280x720.png',
      'https://assets.fedtop.com/picbed/wallhaven-g7r3vd.jpg',
    ),
    side: THREE.DoubleSide, // 双面显示
  })
  const universeMesh = new THREE.Mesh(universeGeometry, universeMaterial)
  universeMesh.name = 'universe'
  scene.add(universeMesh)
}

// 创建星辰
function createStar() {
  //   const starGeometry = new THREE.BufferGeometry()
  //   for (let i = 0; i < 10000; i++) {
  //     const star = new THREE.Vector3()
  //     star.x = THREE.MathUtils.randFloatSpread(2000)
  //     star.y = THREE.MathUtils.randFloatSpread(2000)
  //     star.z = THREE.MathUtils.randFloatSpread(2000)
  //     // starGeometry.vertices.push(star)
  //   }
  //   const starMaterial = new THREE.PointsMaterial({
  //     color: 0xffffff,
  //   })
  //   const starMesh = new THREE.Points(starGeometry, starMaterial)
  //   scene.add(starMesh)

  const positions = []
  const colors = []
  // 星辰几何体
  const starsGeometry = new THREE.BufferGeometry()
  // 添加星辰的颜色与位置
  for (let i = 0; i < 10000; i++) {
    const vertex = new THREE.Vector3()
    vertex.x = Math.random() * 2 - 1
    vertex.y = Math.random() * 2 - 1
    vertex.z = Math.random() * 2 - 1
    positions.push(vertex.x, vertex.y, vertex.z)
    const color = new THREE.Color()
    color.setRGB(255, 255, 255)
    colors.push(color.r, color.g, color.b)
  }
  starsGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3),
  )
  starsGeometry.setAttribute(
    'color',
    new THREE.Float32BufferAttribute(colors, 3),
  )
  // 星辰材质
  const starsMaterial = new THREE.PointsMaterial({
    // map: new THREE.TextureLoader().load(starImg),
    size: 1,
    blending: THREE.AdditiveBlending,
    fog: true,
    depthTest: false, // (不能与blending一起使用)
    // depthWrite: false, //(深度写入)防止星辰在球体前面出现黑块
  })
  // 星辰的集合
  const starsMesh = new THREE.Points(starsGeometry, starsMaterial)
  starsMesh.scale.set(1000, 1000, 1000) // 设置集合体范围
  scene.add(starsMesh)
}

// 创建行星轨道
function createOrbit(distance: number) {
  planets.forEach((planet: Planet) => {
    const trackGeometry = new THREE.RingGeometry(
      planet.distance,
      planet.distance + 0.2,
      1000,
    )
    const trackMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      opacity: 0.5,
      transparent: true,
    })
    const trackMesh = new THREE.Mesh(trackGeometry, trackMaterial)
    trackMesh.rotation.x = -0.5 * Math.PI
    trackMesh.position.set(0, 0, 0)
    scene.add(trackMesh)
  })
}

// const orbitGeometry = new THREE.SphereGeometry()
// const orbitMaterial = new THREE.LineBasicMaterial({
//   color: 0x000,
//   transparent: true,
//   opacity: 0.5,
// })
// planets.forEach((planet: any) => {
//   orbitGeometry.vertices.push(new THREE.Vector3(planet.distance, 0, 0))
// })
// const orbit = new THREE.Line(orbitGeometry, orbitMaterial)
// scene.add(orbit)

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
function renderScene() {
  // 更新控制器
  // flyControls.update(clock.getDelta())
  // orbitControls.update()

  // 更新场景
  renderer.render(scene, camera)
  // 更新动画
  requestAnimationFrame(renderScene)
}

function init() {
  // 将渲染结果添加到dom元素中
  document.getElementById('webgl-output')!.appendChild(renderer.domElement)
  animate()
}

// 渲染场景
renderScene()

createStar()

createAxesHelper()

// createUniverse()

createOrbit(10)

onMounted(() => {
  // 初始化
  init()
})
// 监听窗口变化
window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight - 60)
}
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
