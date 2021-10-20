<script>
/* eslint-disable */
import { fabric } from "fabric";
import { inputFile } from "@utils/inputFile.js";

export default {
    components: {},
    data() {
        return {
            loading: false,
            ctx: null,
            canvas: null,
            targetData: null,
            hiddenData: null,
            canvasJson: {},
        };
    },
    inject: ["contentReload"],
    watch: {
        $route: {
            handler() {
                this.contentReload();
            },
            immediate: false,
        },
    },
    mounted() {
        this.initCanvas();
    },
    methods: {
        //初始化画布
        initCanvas() {
            this.canvas = new fabric.Canvas("canvas", {
                isDrawingMode: true, //自由绘画模式
                selectable: false,
                selection: false,
                hoverCursor: "pointer",
                devicePixelRatio: true, //Retina 高清屏 屏幕支持
                stroke: "lightgreen",
                strokeWidth: 4,
            });
            this.ctx = this.canvas.getContext("2d");
            // this.canvas.isDrawingMode = true;
            this.canvas.freeDrawingBrush.color = "blue";
            this.canvas.freeDrawingBrush.width = 20;
            // this.addCanvasEvent(); //给画布添加事件
        },
        //素材图片选择回调
        async inputFile() {
            let files = await inputFile();
            this.drawImage(files[0]);
        },
        //绘制目标图片
        drawImage(url) {
            this.loading = true;
            fabric.Image.fromURL(url, (img) => {
                //设置缩放比例,长图的缩放比为this.canvas.width / img.width,宽图的缩放比为this.canvas.height / img.height
                let scale =
                    img.height > img.width
                        ? this.canvas.width / img.width
                        : this.canvas.height / img.height;
                img.set({
                    left: this.canvas.width / 2, //距离左边的距离
                    originX: "center", //图片在原点的对齐方式
                    originY: "center",
                    top: this.canvas.height / 2,
                    scaleX: scale, //横向缩放
                    scaleY: scale, //纵向缩放
                    selectable: false, //可交互
                });
                img.on("added", (e) => {
                    //这里有个问题,added后获取的是之前的画布像素数据,其他手动触发的事件,不会有这种问题
                    //故用一个异步解决
                    setTimeout(() => {
                        this.getCanvasData();
                    }, 500);
                });
                this.canvas.add(img); //将图片添加到画布
                // this.drawLine(); //绘制网格线条
            });
        },
        //将画布上的信息绘制到小画布上保存起来
        saveHiddenImageData() {
            const tempCanvas = document.createElement("canvas");
            const tempCtx = tempCanvas.getContext("2d");
            //小画布的长宽=大画布的像素/8后再开平方
            //因为需要八个像素的最低位才可以表示一个小画布的像素的RGBA值
            tempCanvas.width = Math.floor(Math.sqrt((this.canvas.width * this.canvas.height) / 8));
            tempCanvas.height = Math.floor(Math.sqrt((this.canvas.width * this.canvas.height) / 8));
            var image = new Image();
            image.src = this.canvas.toDataURL("image/png");
            image.onload = () => {
                //绘制图像到临时的小画布
                tempCtx.drawImage(image, 0, 0, tempCanvas.width, tempCanvas.height);
                this.hiddenData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
                this.hiddenData.binaryList = Array.from(this.hiddenData.data, (color) => {
                    color = color.toString(2).padStart(8, "0").split("");
                    return color;
                });
                console.log(this.hiddenData, "hiddenData");
                this.$message({
                    type: "success",
                    message: "保存成功!请选择目标图片~",
                });
                this.canvas.clear();
            };
        },

        //获取画布像素数据
        getCanvasData() {
            this.targetData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            //将数字化为非奇数
            function evenNum(num) {
                num = num > 254 ? num - 1 : num;
                num = num % 2 == 1 ? num - 1 : num;
                return num;
            }
            //存一个二进制的数值表示
            this.targetData.binaryList = Array.from(this.targetData.data, (color, index) => {
                this.targetData.data[index] = evenNum(this.targetData.data[index]);
                color = evenNum(color).toString(2).padStart(8, "0").split("");
                return color;
            });
            console.log(this.targetData);
            this.loading = false;
        },
        //将隐写的资源图片数据存到目标图片的二进制最低位中
        drawHiddenData() {
            //将隐藏的数据的二进制全部放到一个数组里面
            let bigHiddenList = [];
            for (let i = 0; i < this.hiddenData.binaryList.length; i++) {
                bigHiddenList.push(...this.hiddenData.binaryList[i]);
            }
            console.log(bigHiddenList, "bigHiddenList");
            this.targetData.binaryList.forEach((item, index) => {
                bigHiddenList[index] && (item[7] = bigHiddenList[index]);
            });
            this.canvas.clear();
            this.targetData.data.forEach((item, index) => {
                this.targetData.data[index] = parseInt(
                    this.targetData.binaryList[index].join(""),
                    2
                );
            });

            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = 800;
            tempCanvas.height = 800;
            let ctx = tempCanvas.getContext("2d");
            ctx.putImageData(this.targetData, 0, 0);
            fabric.Image.fromURL(tempCanvas.toDataURL(), (i) => {
                this.canvas.clear();
                this.canvas.add(i);
                this.canvas.renderAll();
            });
            /* setTimeout(() => {
                this.ctx.putImageData(this.targetData, 0, 0);
            }, 2000); */
            this.$message({
                type: "success",
                message: "加密成功!",
            });
            console.log(this.hiddenData.binaryList, "binaryList");
            console.log(this.targetData.binaryList, "targetData");
            console.log(this.hiddenData, "hiddenData");
            console.log(this.targetData, "targetData");
        },
        //加载隐藏的画布数据到画布
        loadhiddenData() {
            console.log(this.hiddenData, "this.hiddenData");
            this.ctx.putImageData(this.hiddenData, 0, 0);
        },
        //canvas转json
        canvasToJson() {
            let obj = this.canvas.toObject();
            console.log(obj, "obj ");
        },
        //canvas转对象
        canvasToObj() {
            this.canvasJson = this.canvas.toJSON();
            console.log(this.canvasJson, "this.canvasJson ");
        },
        //加载json数据到canvas
        loadJsonToCanvas() {
            // this.canvas.loadFromJSON(this.canvasJson);
            // this.canvas.loadFromJSON(this.hiddenData);
            console.log(this.canvasJson, "this.canvasJson ");
        },
        //重置
        reload() {
            // window.location.reload();
            // console.log(this.canvas.viewportTransform);
            // this.canvas.deactivateAll().renderAll();
            // clear canvas
            //http://fabricjs.com/fabric-intro-part-5#pan_zoom
            this.canvas.clear(); // 清空画布
        },
        //导出图片
        exportCanvas() {
            const dataURL = this.canvas.toDataURL({
                width: this.canvas.width,
                height: this.canvas.height,
                left: 0,
                top: 0,
                format: "png",
            });
            const link = document.createElement("a");
            link.download = "canvas.png";
            link.href = dataURL;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
    },
};
</script>
<template>
    <div class="home">
        <div class="content" :style="`background:white`" v-loading="loading">
            <canvas id="canvas" ref="canvas" width="800" height="800"></canvas>
        </div>
        <div class="operations">
            <div style="height: 800px; margin: 0 auto">
                1.选择需要加密的文件,或手绘后再执行第二步
                <el-button
                    type="success"
                    style="width: 100%; margin: 10px auto"
                    size="default"
                    @click="inputFile"
                >
                    选择加密内容(图片)
                </el-button>
                2.保存加密画布信息
                <el-button
                    type="primary"
                    style="width: 100%; margin: 10px auto"
                    size="default"
                    @click="saveHiddenImageData"
                >
                    <!-- @click="getCanvasData('hiddenData')" -->
                    保存隐写的信息
                </el-button>
                3.选择需要隐写到的目标图片
                <el-button
                    type="success"
                    style="width: 100%; margin: 10px auto"
                    size="default"
                    @click="inputFile"
                >
                    选择文件
                </el-button>
                4.开始加密
                <el-button
                    type="primary"
                    style="width: 100%; margin: 10px auto"
                    size="default"
                    @click="drawHiddenData"
                >
                    开始加密
                </el-button>
                5.加密完成,点击生成图片下载加密后的图片
                <el-button
                    type="success"
                    style="width: 100%; margin: 10px auto"
                    size="default"
                    @click="exportCanvas"
                >
                    导出加密后的图片
                </el-button>
                <!-- <el-button
                    type="success"
                    style="width: 100%; margin: 10px auto"
                    size="default"
                    @click="canvasToObj"
                >
                    canvasToObj
                </el-button>
                <el-button
                    type="success"
                    style="width: 100%; margin: 10px auto"
                    size="default"
                    @click="canvasToJson"
                >
                    canvasToJson
                </el-button> -->
                <!-- <el-button
                    type="success"
                    style="width: 100%; margin: 10px auto"
                    size="default"
                    @click="loadJsonToCanvas"
                >
                    loadJsonToCanvas
                </el-button> -->

                <!-- <el-button
                    type="success"
                    style="width: 100%; margin: 10px auto"
                    size="default"
                    @click="loadhiddenData"
                >
                    loadhiddenData
                </el-button> -->
                <el-button
                    type="warning"
                    style="width: 100%; margin: 10px auto"
                    size="default"
                    @click="reload"
                >
                    重置
                </el-button>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.home {
    transition: width 0.28s;
    width: 100vw;
    min-width: 1200px;
    height: 100vh;
    display: flex;
    .operations {
        background: #516fa3;
        padding: 20px;
        width: 300px;
        color: white;
        border: 1px solid #516fa3;
        display: flex;
        align-items: center;
    }
    .content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-width: 820px;
        overflow: hidden;
        flex: 1;
        position: relative;

        .watermarkContainer {
            // background-color: #91a8d0;
            width: calc(100vw - 342px);
            height: 100%;
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            z-index: 999999;
            pointer-events: none; /* 上层加上这句样式可以实现点击穿透 */
        }
    }
}
#canvas {
    border: 1px dashed #516fa3;
    // object-fit: fill;
    box-sizing: border-box;
    background-color: white;
}
</style>
