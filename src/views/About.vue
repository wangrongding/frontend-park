<template>
    <div class="home">
        <!-- <img alt="Vue logo" id="img" ref="img" src="../assets/logo.png" /> -->
        <canvas id="canvas" ref="canvas"></canvas>
        <button @click="initCanvas">生成</button>
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
    data() {
        return { src: require("../assets/rd.png") };
    },
    mounted() {
        this.initCanvas();
    },
    methods: {
        initCanvas() {
            const canvas = this.$refs.canvas;
            const context = canvas.getContext("2d");
            const img = new Image(); // 创建img元素
            img.src = this.src; // 设置图片源地址
            img.onload = () => {
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                this.getImageColor(canvas);
            };
        },
        getImageColor(canvas, img) {
            const context = canvas.getContext("2d");
            // 获取像素数据
            let pixelData = context.getImageData(0, 0, canvas.width, canvas.height).data;
            // console.log("pixelData", pixelData);
            this.getCountsArr(pixelData);
        },
        getCountsArr(pixelData) {
            let colorList = [];
            let rgba = [];
            let rgbaStr = "";
            // 分组循环
            for (let i = 0; i < pixelData.length; i += 4) {
                rgba[0] = pixelData[i];
                rgba[1] = pixelData[i + 1];
                rgba[2] = pixelData[i + 2];
                rgba[3] = pixelData[i + 3];
                if (rgba.indexOf(undefined) !== -1 || pixelData[i + 3] === 0) {
                    continue;
                }
                // console.log("rgba", rgba);
                rgbaStr = rgba.join(",");
                if (rgbaStr in colorList) {
                    ++colorList[rgbaStr];
                } else {
                    colorList[rgbaStr] = 1;
                }
            }
            console.log("colorList", colorList);
            let arr = [];
            for (let prop in colorList) {
                arr.push({
                    // 如果只获取rgb,则为`rgb(${prop})`
                    color: `rgba(${prop})`,
                    count: colorList[prop],
                });
            }
            // 数组排序
            arr.sort((a, b) => {
                return b.count - a.count;
            });
            console.log("arr", arr[0].color);
            document.body.style.background = arr[0].color;
        },
    },
};
</script>
<style lang="scss">
#canvas {
    width: 500px;
    height: 500px;
}
</style>
