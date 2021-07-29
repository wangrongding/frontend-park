<template>
    <div class="home">
        <div class="content">
            <canvas id="canvas" ref="canvas"></canvas>
        </div>
        <div class="operations">
            <EasyForm :formParams="formParams" />
            <el-button type="primary" size="default" @click="initCanvas">重置</el-button>
            <el-button type="primary" size="default" @click="initCanvas">生成图片</el-button>
        </div>
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
        return {
            src: require("../assets/rd.png"),
            formParams: {
                data: {}, // 表单数据对象
                formList: {
                    paperId: {
                        type: "select",
                        label: "分布方式",
                        placeholder: "请选择",
                        selectOptions: [],
                    },
                    paperId2: {
                        type: "select",
                        label: "高清程度",
                        placeholder: "请选择",
                        selectOptions: [],
                    },
                    userName: {
                        type: "switch",
                        label: "连续重复:",
                        placeholder: "请选择",
                    },
                    userN22ame: {
                        type: "switch",
                        label: "按比例调整",
                    },
                    paperId222: {
                        type: "select",
                        label: "方向／比例",
                        selectOptions: [],
                    },
                    userN2ww2ame: {
                        type: "slider",
                        label: "贴片宽度",
                    },
                    userN2waaw2ame: {
                        type: "slider",
                        label: "贴片高度",
                    },
                },

                labelWidth: "90px",
                rules: {},
            },
        };
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
.home {
    width: 100vw;
    height: 100vh;
    display: flex;
    .operations {
        background: white;
        padding: 20px;
        width: 300px;
        border: 1px solid black;
    }
    .content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-width: 600px;
        flex: 1;
    }
}
#canvas {
    width: 500px;
    height: 500px;
}
</style>
