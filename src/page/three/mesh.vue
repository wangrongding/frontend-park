<script lang="ts" setup>
import * as THREE from 'three'
// 定义渲染器
function createRenderer(scene: THREE.Scene, camera: THREE.Camera) {
  const renderer = new THREE.WebGLRenderer()
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
function createAxes(scene: THREE.Scene) {
  // 创建坐标系,设置轴线粗细值为20
  const axes = new THREE.AxesHelper(20)
  // 将轴线添加到场景中
  scene.add(axes)
}
// 创建平面
function createPlane(scene: THREE.Scene) {
  // 定义平面的大小
  const planeGeometry = new THREE.PlaneGeometry(80, 80)
  // 通过创建材质对象来设置平面的外观,这里使用的是基本材质
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xaaaaaa,
  })
  // 将大小和外观组合进Mesh对象,赋值给平面对象
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  // 平面绕x轴旋转九十度
  plane.rotation.x = -0.5 * Math.PI
  // 定义其在场景中的位置
  plane.position.set(0, 0, 0)
  // 添加平面到场景中
  scene.add(plane)
}
// 创建球体
function createCube(scene: THREE.Scene) {
  // 定义方块大小
  const cubeGeometry = new THREE.BoxGeometry(4, 4, 4)
  // 定义方块外观
  const cubeMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true,
  })
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
  // 设置方块位置
  cube.position.set(5, 5, 5)
  // 添加到场景中
  scene.add(cube)
}
// 创建球体
function createSphere(scene: THREE.Scene) {
  // 定义球体大小
  const sphereGeometry = new THREE.SphereGeometry(4, 20, 20)
  // 定义球体外观
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x7777ff,
    wireframe: true,
  })
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphere.position.set(-15, 5, 5)
  scene.add(sphere)
}

function init() {
  // 定义场景
  const scene = new THREE.Scene()
  // 定义摄像机
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / (window.innerHeight - 60),
    0.1,
    1000,
  )
  createAxes(scene)
  createPlane(scene)
  createCube(scene)
  createSphere(scene)
  // 放最后
  createRenderer(scene, camera)
}

onMounted(() => {
  init()
})
</script>

<template>
  <div class="page-container">
    <div id="webgl-output"></div>
  </div>
</template>
<style scoped lang="scss"></style>
