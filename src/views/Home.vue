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
            <el-button type="primary" size="default" @click="generateImg">生成图片</el-button>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
// @ is an alias to /src
import { getMostColor } from "@utils/mostColor.js";
import { getAverageColor } from "@utils/averageColor.js";
import { fabric } from "fabric";
export default {
    name: "Home",
    components: {},
    data() {
        return {
            imgList: [],
            src: require("../assets/rd.png"),
            formParams: {
                data: {}, // 表单数据对象
                formList: {
                    filasde: {
                        type: "upload",
                        label: "目标图片",
                        limit: 1,
                        action: "#",
                        listType: "file-list",
                        fileList: [],
                        autoUpload: false,
                        onChange: this.fileChange,
                    },
                    filasde2: {
                        type: "upload",
                        label: "素材图片",
                        limit: 1000,
                        action: "#",
                        listType: "file-list",
                        fileList: [],
                        autoUpload: false,
                        onChange: this.imgListChange,
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
            ctx: null,
            canvas: null,
        };
    },
    mounted() {
        this.canvas = new fabric.Canvas("canvas");
        this.canvas.isDrawingMode = true;
        this.canvas.freeDrawingBrush.color = "blue";
        this.canvas.freeDrawingBrush.width = 5;
    },
    methods: {
        reload() {
            // window.location.reload();
            this.ctx.clearRect(0, 0, 100, 100);
            this.ctx.clearRect(199, 0, 2, this.canvas.height);
        },
        generateImg() {
            let canvas = new fabric.Canvas("canvas");
            this.imgList.forEach((item, index) => {
                // const img = new Image();
                // img.src = item.url;
                // img.onload = () => {
                //     console.log(img.width, img.height);
                //     /* let scaleH = canvas.height / img.height;
                //     img.height = canvas.height;
                //     img.width = img.width * scaleH; */
                //     ctx.drawImage(img, 0, 0, 20, 20);
                // };
                fabric.Image.fromURL(item.url, function (img) {
                    img.scale(0.5);
                    canvas.add(img);
                });
            });
        },
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
        async imgListChange(file, fileList) {
            let tempUrl = window.URL.createObjectURL(file.raw);
            // getAverageColor(tempUrl);
            let mostColor = await getMostColor(tempUrl);
            this.imgList.push({ url: tempUrl, color: mostColor });
            console.log(this.imgList);
        },
        drawLine() {
            const blockPixel = 8;
            for (let i = 0; i <= this.canvas.width / blockPixel; i++) {
                this.canvas.add(
                    new fabric.Line([i * blockPixel, 0, i * blockPixel, this.canvas.height], {
                        left: i * blockPixel,
                        stroke: "black",
                        selectable: false, //是否可被选中
                    })
                );
                this.canvas.add(
                    new fabric.Line([0, i * blockPixel, this.canvas.height, i * blockPixel], {
                        top: i * blockPixel,
                        stroke: "black",
                        selectable: false, //是否可被选中
                    })
                );
            }
        },
        drawImage(url) {
            fabric.Image.fromURL(url, (img) => {
                img.set({
                    left: this.canvas.height / 2,
                    originX: "center",
                    top: 0,
                    scaleX: this.canvas.height / img.height,
                    scaleY: this.canvas.height / img.height,
                    selectable: false, //是否可被选中
                });
                console.log(img.width, img.width, "img.width");
                this.canvas.add(img);
                this.drawLine();
            });
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
    object-fit: fill;
}
</style>
