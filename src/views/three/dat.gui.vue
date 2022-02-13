<template>
    <div class="page-container">
        <div id="webgl-output"></div>
    </div>
</template>

<script>
import * as THREE from "three";
import * as dat from "dat.gui";
import * as Stats from "stats.js";

import createGeometry from "./utils/createGeometry";
export default {
    components: {},
    props: {},
    data() {
        return {
            scene: null,
            camera: null,
            renderer: null,
            plane: null,
            cube: null,
            sphere: null,
            sphere2: null,
            guiConfiguration: {
                message: "哈喽啊~我是荣顶",
                cubeSpeed: 0.03,
                sphereInitVelocity: 0.03,
                sphereAcceleration: 0.04,
                checkBox: false,
                button() {
                    alert("关注公众号：前端超人");
                },
            },
        };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
        this.init();
        this.animate();
        this.configGUI();
    },
    methods: {
        init() {
            //定义场景
            this.scene = new THREE.Scene();
            //给场景添加雾化效果
            // this.scene.fog = new THREE.Fog(0x123, 5, 10);
            this.scene.fog = new THREE.FogExp2(0xffffff, 0.004);
            //定义摄像机
            this.camera = new THREE.PerspectiveCamera(
                45,
                window.innerWidth / (window.innerHeight - 60),
                0.1,
                1000,
            );

            //创建坐标系
            this.createAxes();
            //创建平面
            this.createPlane();
            //创建光源
            this.createLight();
            //创建渲染器,放最后
            this.createRenderer();
            this.getStats();
            //创建立方体
            this.cube = createGeometry(
                this.scene,
                {
                    type: "BoxGeometry",
                    attribute: [5, 5, 5],
                },
                { type: "MeshLambertMaterial", options: { color: 0xff0000 } },
                {
                    position: [0, 4, 0],
                    castShadow: true,
                },
            );
            //创建球体
            this.sphere = createGeometry(
                this.scene,
                {
                    type: "SphereGeometry",
                    attribute: [3, 20, 20],
                },
                { type: "MeshLambertMaterial", options: { color: 0x7777ff } },
                {
                    position: [-15, 3, 10],
                    castShadow: true,
                },
            );
            this.sphere2 = createGeometry(
                this.scene,
                {
                    type: "SphereGeometry",
                    attribute: [1, 20, 20],
                },
                { type: "MeshLambertMaterial", options: { color: "lightgreen" } },
                {
                    position: [20, 1, 0],
                    castShadow: true,
                },
            );
            this.sphere3 = createGeometry(
                this.scene,
                {
                    type: "SphereGeometry",
                    attribute: [8, 20, 20],
                },
                { type: "MeshLambertMaterial", options: { color: "yellow" } },
                {
                    position: [40, 8, 0],
                    castShadow: true,
                },
            );
        },
        // 创建渲染器
        createRenderer() {
            this.renderer = new THREE.WebGLRenderer();
            //设置场景的背景颜色
            this.renderer.setClearColor(new THREE.Color(0x000000));
            //设置场景大小
            this.renderer.setSize(window.innerWidth, window.innerHeight - 60);
            //设置相机位置(x,y,z)
            this.camera.position.set(-100, 40, 100);
            // 通过lookAt将摄像机指向场景中心,(默认指向0,0,0)
            this.camera.lookAt(this.scene.position);
            //开启阴影
            this.renderer.shadowMap.enabled = true;
            // 将渲染结果添加到dom元素中
            document.getElementById("webgl-output").appendChild(this.renderer.domElement);
            //使用指定的摄像机来渲染场景
            this.renderer.render(this.scene, this.camera);
        },
        //创建光源
        createLight() {
            /* 需要注意的是：MeshBasicMaterial材质不会对光源有任何反应，基本材质只会使用指定的颜色来渲染物体 */
            //定义光源
            this.spotLight = new THREE.SpotLight(0xffffff);
            //设置光源位置
            this.spotLight.position.set(70, 130, 70);
            // 启用阴影功能
            this.spotLight.castShadow = true;
            //将光源添加进场景
            this.scene.add(this.spotLight);
        },
        // 创建坐标系
        createAxes() {
            //创建坐标系,设置轴线粗细值为20
            this.axes = new THREE.AxesHelper(20);
            //将轴线添加到场景中
            this.scene.add(this.axes);
        },
        //创建平面
        createPlane() {
            //定义平面的大小
            let planeGeometry = new THREE.PlaneGeometry(200, 200);
            // 通过创建材质对象来设置平面的外观,这里使用的是基本材质
            let planeMaterial = new THREE.MeshLambertMaterial({
                color: 0xaaaaaa,
            });
            //将大小和外观组合进Mesh对象,赋值给平面对象
            this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
            //平面绕x轴旋转九十度
            this.plane.rotation.x = -0.5 * Math.PI;
            // 定义其在场景中的位置
            this.plane.position.set(0, 0, 0);
            //接收光源
            this.plane.receiveShadow = true;
            //添加平面到场景中
            this.scene.add(this.plane);
        },

        //执行动画
        animate() {
            // stats.update();
            this.cube.rotation.x += this.guiConfiguration.cubeSpeed;
            this.cube.rotation.y += this.guiConfiguration.cubeSpeed;
            this.cube.rotation.z += this.guiConfiguration.cubeSpeed;
            // this.sphere.position.x += this.guiConfiguration.speed;
            // if (this.sphere.position.x > 20) {
            //     this.sphere.position.x = -20;
            // }
            this.guiConfiguration.sphereInitVelocity += this.guiConfiguration.sphereAcceleration;
            this.sphere.position.x = 20 * Math.cos(this.guiConfiguration.sphereInitVelocity);
            this.sphere.position.z = 20 * Math.sin(this.guiConfiguration.sphereInitVelocity);

            this.sphere2.position.x = 10 * Math.cos(this.guiConfiguration.sphereInitVelocity + 0.9);
            this.sphere2.position.z = 10 * Math.sin(this.guiConfiguration.sphereInitVelocity + 0.9);

            this.sphere3.position.x = 40 * Math.cos(this.guiConfiguration.sphereInitVelocity - 0.9);
            this.sphere3.position.z = 40 * Math.sin(this.guiConfiguration.sphereInitVelocity - 0.9);
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(this.animate);
        },
        //配置dat.gui
        configGUI() {
            // let options = {
            //     message: "哈喽啊~我是荣顶",
            //     speed: 0.8,
            //     checkBox: false,
            //     button: function () {
            //         alert(123);
            //     },
            // };

            const gui = new dat.GUI();

            gui.add(this.guiConfiguration, "message");
            gui.add(this.guiConfiguration, "cubeSpeed", 0, 0.5);
            gui.add(this.guiConfiguration, "sphereInitVelocity", -1, 1);
            gui.add(this.guiConfiguration, "sphereAcceleration", 0, 1);
            gui.add(this.guiConfiguration, "checkBox");
            gui.add(this.guiConfiguration, "button").name("点我");

            var testObj = {
                color0: "#ffae23", // CSS string
                color1: [0, 128, 255], // RGB array
                color2: [0, 128, 255, 0.3], // RGB with alpha
                color3: { h: 350, s: 0.9, v: 0.3 }, // Hue, saturation, value
            };
            var f1 = gui.addFolder("球的颜色");
            f1.addColor(testObj, "color0").name("CSS颜色值");
            f1.addColor(testObj, "color1").name("RGB颜色值");
            f1.addColor(testObj, "color2").name("RGBA颜色值");
            f1.addColor(testObj, "color3").name("HUB颜色值");
            gui.domElement.style = "position:absolute;top:70px;right:0px";
        },
        //获取pfs状态
        getStats() {
            var stats = new Stats();
            stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
            document.body.appendChild(stats.dom);
            stats.domElement.style = "position:absolute;top:70px;left:0px";
            function animate() {
                stats.begin();
                // monitored code goes here
                stats.end();
                requestAnimationFrame(animate);
            }
            requestAnimationFrame(animate);
        },
    },
};
</script>

<style scoped lang="scss">
.page-container {
    // position: relative;
}
</style>
