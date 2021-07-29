<template>
    <div class="home">
        <img alt="Vue logo" id="img" src="../assets/logo.png" />
        <canvas id="canvas"></canvas>
    </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
/* eslint-disable */
export default {
    name: "Home",
    components: {
        HelloWorld,
    },
    mounted() {
        let img = document.getElementById("img");
        let canvas = document.getElementById("canvas");
        canvas.setAttribute("width", img.width);
        canvas.setAttribute("height", img.height);
        let context = canvas.getContext("2d");
        // 将图片画在画布上
        context.drawImage(img, 0, 0);
        // 获取像素数据
        let imgData = context.getImageData(0, 0, img.width, img.height);
        let pixelData = imgData.data;
    },
    methods: {},
};
</script>
