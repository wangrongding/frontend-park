<template>
  <div class="">
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
      // 定义渲染器
      const renderer = new THREE.WebGLRenderer()
      // 设置场景的背景颜色
      renderer.setClearColor(new THREE.Color(0x000000))
      // 设置场景大小
      renderer.setSize(window.innerWidth, window.innerHeight - 60)
      // 创建坐标系(x,y,z; x红色,y绿色,z蓝色),设置轴线粗细值为20
      const axes = new THREE.AxesHelper(20)
      // 将轴线添加到场景中
      scene.add(axes)

      // 设置相机位置(x,y,z)
      camera.position.set(50, 50, 50)
      // 通过lookAt将摄像机指向场景中心,(默认指向0,0,0)
      camera.lookAt(scene.position)
      // 将渲染结果添加到dom元素中
      document.getElementById('webgl-output').appendChild(renderer.domElement)
      // 使用指定的摄像机来渲染场景
      renderer.render(scene, camera)
    },
  },
}
</script>

<style scoped lang="scss"></style>
