<template>
  <div class="page-container">
    <div id="webgl-output"></div>
  </div>
</template>

<script>
/* eslint-disable */
import * as THREE from 'three'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import * as dat from 'dat.gui'
import * as Stats from 'stats.js'
import createGeometry from './utils/createGeometry'
export default {
  components: {},
  props: {},
  data() {
    return {
      scene: null,
      camera: null,
      gui: null,
      renderer: null,
      plane: null,
      cube: null,
      sphere: null,
      flyControls: null,
      orbitControls: null,
      guiConfiguration: {
        message: 'WASD加鼠标滚轮控制!',
        cubeSpeed: 0.03,
        sphereInitVelocity: 0.03,
        sphereAcceleration: 0.04,
        checkBox: false,
        button() {
          alert('关注公众号：前端超人')
        },
        sphere3Color: '#ffae23',
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.init()
    this.animate()
    this.configGUI()
    setTimeout(() => {
      document.querySelector('.dg').style = 'margin-top:calc(100vh - 0px);'
      window.addEventListener('resize', this.onResize, false)
    }, 1000)
  },
  beforeRouteLeave(to, from, next) {
    console.log(123)
    this.gui.domElement.style.display = 'none'
    next()
  },

  methods: {
    onResize() {
      this.camera.aspect = window.innerWidth / (window.innerHeight - 60)
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight - 60)
    },
    init() {
      //定义场景
      this.scene = new THREE.Scene()
      //给场景添加雾化效果
      // this.scene.fog = new THREE.Fog(0x123, 5, 10);
      this.scene.fog = new THREE.FogExp2(0xffffff, 0.004)
      //定义摄像机
      this.camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / (window.innerHeight - 60),
        0.1,
        1000,
      )

      //创建坐标系
      this.createAxes()
      //创建平面
      this.createPlane()
      //创建光源
      this.createLight()
      //创建渲染器,放最后
      this.createRenderer()
      this.getStats()
      this.createController()
      //创建立方体
      this.cube = createGeometry(
        this.scene,
        {
          type: 'BoxGeometry',
          attribute: [5, 5, 5],
        },
        { type: 'MeshLambertMaterial', options: { color: 0xff0000 } },
        {
          position: [0, 4, 0],
          castShadow: true,
        },
      )
      this.cube.name = 'cube'
      //创建球体
      this.sphere = createGeometry(
        this.scene,
        {
          type: 'SphereGeometry',
          attribute: [3, 20, 20],
        },
        { type: 'MeshLambertMaterial', options: { color: 0x7777ff } },
        {
          position: [-15, 3, 10],
          castShadow: true,
        },
      )
    },

    // 创建渲染器
    createRenderer() {
      this.renderer = new THREE.WebGLRenderer()
      //设置场景的背景颜色
      this.renderer.setClearColor(new THREE.Color(0x000000))
      //设置场景大小
      this.renderer.setSize(window.innerWidth, window.innerHeight - 60)
      //设置相机位置(x,y,z)
      this.camera.position.set(-100, 40, 100)
      // 通过lookAt将摄像机指向场景中心,(默认指向0,0,0)
      this.camera.lookAt(this.scene.position)
      //开启阴影
      this.renderer.shadowMap.enabled = true
      // 将渲染结果添加到dom元素中
      document
        .getElementById('webgl-output')
        .appendChild(this.renderer.domElement)
      //使用指定的摄像机来渲染场景
      this.renderer.render(this.scene, this.camera)
    },
    //创建光源
    createLight() {
      /* 需要注意的是：MeshBasicMaterial材质不会对光源有任何反应，基本材质只会使用指定的颜色来渲染物体 */
      //定义光源
      this.spotLight = new THREE.SpotLight(0xffffff)
      //设置光源位置
      this.spotLight.position.set(100, 150, 70)
      // 启用阴影功能
      this.spotLight.castShadow = true
      //将光源添加进场景
      this.scene.add(this.spotLight)
    },
    // 创建坐标系
    createAxes() {
      //创建坐标系,设置轴线粗细值为20
      this.axes = new THREE.AxesHelper(20)
      //将轴线添加到场景中
      this.scene.add(this.axes)
    },
    //创建平面
    createPlane() {
      //定义平面的大小
      let planeGeometry = new THREE.PlaneGeometry(250, 250)
      // 通过创建材质对象来设置平面的外观,这里使用的是基本材质
      let planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xaaaaaa,
      })
      //将大小和外观组合进Mesh对象,赋值给平面对象
      this.plane = new THREE.Mesh(planeGeometry, planeMaterial)
      //平面绕x轴旋转九十度
      this.plane.rotation.x = -0.5 * Math.PI
      // 定义其在场景中的位置
      this.plane.position.set(0, 0, 0)
      //接收光源
      this.plane.receiveShadow = true
      //添加平面到场景中
      this.scene.add(this.plane)
    },

    //配置dat.gui
    configGUI() {
      this.gui = new dat.GUI()
      this.gui.add(this.guiConfiguration, 'message')
      this.gui.add(this.guiConfiguration, 'cubeSpeed', 0, 0.5)
      this.gui.add(this.guiConfiguration, 'sphereInitVelocity', -1, 1)
      this.gui.add(this.guiConfiguration, 'sphereAcceleration', 0, 1)
      this.gui.add(this.guiConfiguration, 'checkBox')
      this.gui.add(this.guiConfiguration, 'button').name('点我')

      var f1 = this.gui.addFolder('球的颜色')
      let controller = f1
        .addColor(this.guiConfiguration, 'sphere3Color')
        .name('CSS颜色值')
      //第二个分组默认打开
      this.gui.domElement.style = 'position:absolute;bottom:20px;right:0px'
      f1.open()
      //对应控制项值修改完毕响应
      controller.onFinishChange((val) => {
        console.log('🚀🚀🚀 / val', val)
        // this.sphere3.color.set(val);
        this.scene.remove(this.sphere3)
      })
    },
    //获取pfs状态
    getStats() {
      var stats = new Stats()
      stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
      document.querySelector('.page-container').appendChild(stats.dom)
      stats.domElement.style = 'position:absolute;bottom:0px;left:0px'
      function animate() {
        stats.begin()
        // monitored code goes here
        stats.end()
        requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
    },
    //执行动画
    animate() {
      this.cube.rotation.x += this.guiConfiguration.cubeSpeed
      this.cube.rotation.y += this.guiConfiguration.cubeSpeed
      this.cube.rotation.z += this.guiConfiguration.cubeSpeed
      this.guiConfiguration.sphereInitVelocity +=
        this.guiConfiguration.sphereAcceleration
      this.sphere.position.x =
        20 * Math.cos(this.guiConfiguration.sphereInitVelocity)
      this.sphere.position.z =
        20 * Math.sin(this.guiConfiguration.sphereInitVelocity)

      this.renderer.render(this.scene, this.camera)
      this.orbitControls.update()
      this.flyControls.update(0.01)
      requestAnimationFrame(this.animate)
    },
    //创建控制器
    createController() {
      // 创建轨道控制器
      this.orbitControls = new OrbitControls(
        this.camera,
        this.renderer.domElement,
      )
      // 移动控制器
      this.flyControls = new FlyControls(this.camera, this.renderer.domElement)
      this.flyControls.movementSpeed = 100
      this.flyControls.rollSpeed = Math.PI / 24
      this.flyControls.autoForward = false
      this.flyControls.dragToLook = true
    },
  },
}
</script>

<style scoped lang="scss">
.page-container {
  // position: relative;
}
</style>
