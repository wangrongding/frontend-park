<template>
  <div class="page-container">
    <div id="webgl-output"></div>
  </div>
</template>

<script>
import * as THREE from 'three'

export default {
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // 定义场景
      const scene = new THREE.Scene()
      // 定义摄像机
      const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / (window.innerHeight - 60),
        0.1,
        1000,
      )

      // 创建坐标系
      this.createAxes(scene)
      // 创建平面
      this.createPlane(scene)
      // 创建立方体
      this.createCube(scene)
      // 创建球体
      this.createSphere(scene)
      // 创建光源
      this.createLight(scene)
      // 创建渲染器,放最后
      this.createRenderer(scene, camera)
    },
    // 创建渲染器
    createRenderer(scene, camera) {
      const renderer = new THREE.WebGLRenderer()
      // 设置场景的背景颜色
      renderer.setClearColor(new THREE.Color(0x000000))
      // 设置场景大小
      renderer.setSize(window.innerWidth, window.innerHeight - 60)
      // 设置相机位置(x,y,z)
      camera.position.set(-50, 50, 50)
      // 通过lookAt将摄像机指向场景中心,(默认指向0,0,0)
      camera.lookAt(scene.position)
      // 开启阴影
      renderer.shadowMapEnabled = true
      // 将渲染结果添加到dom元素中
      document.getElementById('webgl-output').appendChild(renderer.domElement)
      // 使用指定的摄像机来渲染场景
      renderer.render(scene, camera)
    },
    // 创建光源
    createLight(scene) {
      /* 需要注意的是：MeshBasicMaterial材质不会对光源有任何反应，基本材质只会使用指定的颜色来渲染物体 */
      // 定义光源
      const spotLight = new THREE.SpotLight(0xffffff)
      // 设置光源位置
      spotLight.position.set(10, 40, 40)
      // 启用阴影功能
      spotLight.castShadow = true
      // 将光源添加进场景
      scene.add(spotLight)
    },
    // 创建坐标系
    createAxes(scene) {
      // 创建坐标系,设置轴线粗细值为20
      const axes = new THREE.AxesHelper(20)
      // 将轴线添加到场景中
      scene.add(axes)
    },
    // 创建平面
    createPlane(scene) {
      // 定义平面的大小
      const planeGeometry = new THREE.PlaneGeometry(100, 100)
      // 通过创建材质对象来设置平面的外观,这里使用的是基本材质
      const planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xaaaaaa,
      })
      // 将大小和外观组合进Mesh对象,赋值给平面对象
      const plane = new THREE.Mesh(planeGeometry, planeMaterial)
      // 平面绕x轴旋转九十度
      plane.rotation.x = -0.5 * Math.PI
      // 定义其在场景中的位置
      plane.position.set(0, 0, 0)
      // 接收光源
      plane.receiveShadow = true
      // 添加平面到场景中
      scene.add(plane)
    },
    // 创建球体
    createCube(scene) {
      // 定义方块大小
      const cubeGeometry = new THREE.BoxGeometry(4, 4, 4)
      // 定义方块外观
      const cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0xff0000,
      })
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
      // 设置方块位置
      cube.position.set(5, 5, 5)

      cube.castShadow = true
      // 添加到场景中
      scene.add(cube)
    },
    // 创建球体
    createSphere(scene) {
      // 定义球体大小
      const sphereGeometry = new THREE.SphereGeometry(4, 20, 20)
      // 定义球体外观
      const sphereMaterial = new THREE.MeshLambertMaterial({
        color: 0x7777ff,
      })
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
      sphere.position.set(-15, 5, 10)
      sphere.castShadow = true
      scene.add(sphere)
    },
  },
}
</script>

<style scoped lang="scss"></style>
