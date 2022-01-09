<template>
    <div class="page-container">
        <div id="webgl-output"></div>
    </div>
</template>

<script>
import * as THREE from "three";
export default {
    components: {},
    props: {},
    data() {
        return {
            scene: null,
            camera: null,
            renderer: null,
            sphere: null,
            cube: null,
            plane: null,
        };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
        this.init();
        this.animate();
    },
    methods: {
        init() {
            //定义场景
            this.scene = new THREE.Scene();
            //定义摄像机
            this.camera = new THREE.PerspectiveCamera(
                45,
                window.innerWidth / (window.innerHeight - 60),
                0.1,
                1000
            );

            //创建坐标系
            this.createAxes();
            //创建平面
            this.createPlane();
            //创建立方体
            this.createCube();
            //创建球体
            this.createSphere();
            //创建圆形几何体
            this.createCircle();
            //创建圆锥几何体
            this.createCone();
            this.createWireframe();
            //创建光源
            this.createLight();
            //创建渲染器,放最后
            this.createRenderer();
        },
        // 创建渲染器
        createRenderer() {
            this.renderer = new THREE.WebGLRenderer();
            //设置场景的背景颜色
            this.renderer.setClearColor(new THREE.Color(0x000000));
            //设置场景大小
            this.renderer.setSize(window.innerWidth, window.innerHeight - 60);
            //设置相机位置(x,y,z)
            this.camera.position.set(-50, 50, 50);
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
            this.spotLight.position.set(10, 40, 40);
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
            let planeGeometry = new THREE.PlaneGeometry(100, 100);
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
        //创建球体
        createCube() {
            // 定义方块大小
            let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
            //定义方块外观
            let cubeMaterial = new THREE.MeshLambertMaterial({
                color: 0xff0000,
            });
            this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            //设置方块位置
            this.cube.position.set(5, 5, 5);

            this.cube.castShadow = true;
            // 添加到场景中
            this.scene.add(this.cube);
        },
        //创建球体
        createSphere() {
            //定义球体大小
            let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
            //定义球体外观
            let sphereMaterial = new THREE.MeshLambertMaterial({
                color: 0x7777ff,
            });
            this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            this.sphere.position.set(-15, 5, 10);
            this.sphere.castShadow = true;
            this.scene.add(this.sphere);
        },
        //创建圆形几何体
        createCircle() {
            var geometry = new THREE.CircleGeometry(5, 32);
            var material = new THREE.MeshLambertMaterial({ color: 0xffff00, wireframe: true });
            var circle = new THREE.Mesh(geometry, material);
            circle.position.set(10, 5, 10);
            circle.castShadow = true;
            this.scene.add(circle);
        },
        // 创建圆锥几何体
        createCone() {
            var geometry = new THREE.ConeGeometry(5, 10, 32);
            var material = new THREE.MeshBasicMaterial({ color: 0xfaaf00, wireframe: true });
            var cone = new THREE.Mesh(geometry, material);
            cone.position.set(-10, 5, -10);
            cone.castShadow = true;
            this.scene.add(cone);
        },
        // 创建圆柱几何体
        createCone1() {
            var geometry = new THREE.ConeGeometry(5, 10, 32);
            var material = new THREE.MeshBasicMaterial({ color: 0xfaaf00, wireframe: true });
            var cone = new THREE.Mesh(geometry, material);
            cone.position.set(-10, 5, -10);
            cone.castShadow = true;
            this.scene.add(cone);
        },
        //创建网格几何体
        createWireframe() {
            var geometry = new THREE.SphereGeometry(5, 15, 50);
            var wireframe = new THREE.WireframeGeometry(geometry);
            var line = new THREE.LineSegments(wireframe);
            line.material.depthTest = false;
            line.material.opacity = 0.25;
            line.material.transparent = true;
            line.position.set(-30, 5, -10);
            line.castShadow = true;
            this.scene.add(line);
        },
        //执行动画
        animate() {
            // stats.update();
            this.cube.rotation.x += 0.01;
            this.cube.rotation.y += 0.01;
            this.sphere.position.x += 0.03;
            if (this.sphere.position.x > 20) {
                this.sphere.position.x = -20;
            }
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(this.animate);
        },
    },
};
</script>

<style scoped lang="scss"></style>
