<template>
    <div class="home">
        <div class="content" :style="`background:${background}`">
            <canvas id="canvas" ref="canvas" width="800" height="800"></canvas>
        </div>
        <div class="operations">
            <EasyForm :formParams="formParams">
                <!-- <template #targetImage="{}">
                    <el-button type="primary" size="default" @click="chooseImage">
                        选择文件
                    </el-button>
                </template> -->
            </EasyForm>
            <el-button type="primary" size="default" @click="reload">重置</el-button>
            <el-button type="primary" size="default" @click="initCanvas">生成图片</el-button>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import { colorCount } from "@utils/colorCount.js";
import { getAverageColor } from "@utils/getAverageColor.js";
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
                    filasde: {
                        type: "upload",
                        name: "work",
                        label: "目标图片",
                        limit: 1,
                        action: "#",
                        listType: "file-list",
                        fileList: [],
                        autoUpload: false,
                        onChange: this.fileChange,
                    },
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
            background: "white",
        };
    },
    mounted() {},
    methods: {
        reload() {
            window.location.reload();
        },
        initCanvas() {},
        getColorCount(canvas, img) {
            let colorList = colorCount(canvas, img);
            // this.background = colorList[0].color;
        },
        getAverageColor(canvas, img) {
            let averageColor = getAverageColor(canvas, img);
            this.background = averageColor;
        },
        fileChange(file, fileList) {
            let tempUrl = window.URL.createObjectURL(file.raw);
            this.drawImage(tempUrl);
        },
        createImage(cb, url) {
            const canvas = this.$refs.canvas;
            const img = new Image(); // 创建img元素
            img.src = url; // 设置图片源地址
            img.onload = () => {
                cb(canvas, img);
            };
        },
        drawImage(url) {
            const canvas = this.$refs.canvas;
            const img = new Image(); // 创建img元素
            img.src = url;
            img.style.cssText = "object-fit: cover";
            // img.height = "100%";
            img.onload = () => {
                const context = canvas.getContext("2d");
                context.drawImage(
                    img,
                    canvas.width / 2 - img.width / 2,
                    canvas.height / 2 - img.height / 2,
                    img.width,
                    img.height
                );
                this.createImage(this.getColorCount, url);
                // this.createImage(this.getAverageColor, url);
            };
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
    border: 2px dashed green;
    // object-fit: fill;
}
</style>
