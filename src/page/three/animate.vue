<script lang="ts" setup>
import * as THREE from 'three'

let scene: THREE.Scene
let camera: THREE.Camera
let renderer: THREE.WebGLRenderer
let sphere: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>
let cube: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>
let plane
let spotLight

// 定义渲染器
function createRenderer() {
  renderer = new THREE.WebGLRenderer()
  // 设置场景的背景颜色
  renderer.setClearColor(new THREE.Color(0x000000))
  // 设置场景大小
  renderer.setSize(window.innerWidth, window.innerHeight - 60)
  // 设置相机位置(x,y,z)
  camera.position.set(-30, 40, 50)
  // 通过lookAt将摄像机指向场景中心,(默认指向0,0,0)
  camera.lookAt(scene.position)
  // 将渲染结果添加到dom元素中
  document.getElementById('webgl-output')!.appendChild(renderer.domElement)
  // 使用指定的摄像机来渲染场景
  renderer.render(scene, camera)
}
// 创建坐标系
function createAxes() {
  // 创建坐标系,设置轴线粗细值为20
  const axes = new THREE.AxesHelper(20)
  // 将轴线添加到场景中
  scene.add(axes)
}
// 创建平面
function createPlane() {
  // 定义平面的大小
  const planeGeometry = new THREE.PlaneGeometry(80, 80)
  // 通过创建材质对象来设置平面的外观,这里使用的是基本材质
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xaaaaaa,
  })
  // 将大小和外观组合进Mesh对象,赋值给平面对象
  plane = new THREE.Mesh(planeGeometry, planeMaterial)
  // 平面绕x轴旋转九十度
  plane.rotation.x = -0.5 * Math.PI
  // 定义其在场景中的位置
  plane.position.set(0, 0, 0)
  // 添加平面到场景中
  scene.add(plane)
}
// 创建球体
function createCube() {
  // 定义方块大小
  const cubeGeometry = new THREE.BoxGeometry(4, 4, 4)
  // 定义方块外观
  const cubeMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true,
  })
  cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
  // 设置方块位置
  cube.position.set(5, 5, 5)
  // 添加到场景中
  scene.add(cube)
}
// 创建球体
function createSphere() {
  // 定义球体大小
  const sphereGeometry = new THREE.SphereGeometry(4, 20, 20)
  // 定义球体外观
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x7777ff,
    wireframe: true,
  })
  sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphere.position.set(-15, 5, 5)
  scene.add(sphere)
}
// 创建光源
function createLight() {
  /* 需要注意的是：MeshBasicMaterial材质不会对光源有任何反应，基本材质只会使用指定的颜色来渲染物体 */
  // 定义光源
  spotLight = new THREE.SpotLight(0xffffff)
  // 设置光源位置
  spotLight.position.set(10, 40, 40)
  // 启用阴影功能
  spotLight.castShadow = true
  // 将光源添加进场景
  scene.add(spotLight)
}

// 创建圆形几何体
function createCircle() {
  const geometry = new THREE.CircleGeometry(5, 32)
  const material = new THREE.MeshLambertMaterial({
    color: 0xffff00,
    wireframe: true,
  })
  const circle = new THREE.Mesh(geometry, material)
  circle.position.set(10, 5, 10)
  circle.castShadow = true
  scene.add(circle)
}

// 创建圆锥几何体
function createCone() {
  const geometry = new THREE.ConeGeometry(5, 10, 32)
  const material = new THREE.MeshBasicMaterial({
    color: 0xfaaf00,
    wireframe: true,
  })
  const cone = new THREE.Mesh(geometry, material)
  cone.position.set(-10, 5, -10)
  cone.castShadow = true
  scene.add(cone)
}

// 创建网格几何体
function createWireframe() {
  const geometry = new THREE.SphereGeometry(5, 15, 50)
  const wireframe = new THREE.WireframeGeometry(geometry)
  const line = new THREE.LineSegments(wireframe)
  // line.material.depthTest = false
  // line.material.opacity = 0.25
  // line.material.transparent = true
  line.position.set(-30, 5, -10)
  line.castShadow = true
  scene.add(line)
}

// 执行动画
function animate() {
  // stats.update();
  cube.rotation.x += 0.03
  cube.rotation.y += 0.03
  sphere.position.x += 0.1
  if (sphere.position.x > 20) {
    sphere.position.x = -20
  }
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

function init() {
  // 定义场景
  scene = new THREE.Scene()
  // 定义摄像机
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / (window.innerHeight - 60),
    0.1,
    1000,
  )

  // 创建坐标系
  createAxes()
  // 创建平面
  createPlane()
  // 创建立方体
  createCube()
  // 创建球体
  createSphere()
  // 创建圆形几何体
  createCircle()
  // 创建圆锥几何体
  createCone()
  createWireframe()
  // 创建光源
  createLight()
  // 创建渲染器,放最后
  createRenderer()
}

onMounted(() => {
  init()
  animate()
})
</script>
<template>
  <div class="">
    <div id="webgl-output"></div>
  </div>
</template>
<style scoped lang="scss"></style>
