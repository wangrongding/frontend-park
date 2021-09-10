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
                    @click="getCanvasData('hiddenData')"
                >
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
                    @click="inputFile"
                >
                    开始加密
                </el-button>
                5.加密完成,点击生成图片下载加密后的图片
                <el-button
                    type="primary"
                    style="width: 100%; margin: 10px auto"
                    size="default"
                    @click="exportCanvas"
                >
                    生成图片
                </el-button>
            </div>
        </div>
    </div>
</template>
<script>
/* eslint-disable */
import { fabric } from "fabric";
import { inputFile } from "@utils/inputFile.js";

export default {
    components: {},
    data() {
        return { loading: false, ctx: null, canvas: null, blockList: [], hiddenData: null };
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
            this.canvas.freeDrawingBrush.width = 5;
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
        //获取画布像素数据
        getCanvasData() {
            this.blockList = [];
            let tempColorData = this.ctx.getImageData(
                0,
                0,
                this.canvas.width,
                this.canvas.height
            ).data;
            function evenNum(num) {
                num = num > 254 ? num - 1 : num;
                num = num % 2 == 1 ? num - 1 : num;
                return num;
            }
            for (let i = 0; i < tempColorData.length; i += 4) {
                this.blockList.push([
                    /* evenNum(tempColorData[i]).toString(2).padStart(8, "0").split(""),
                    evenNum(tempColorData[i + 1])
                        .toString(2)
                        .padStart(8, "0")
                        .split(""),
                    evenNum(tempColorData[i + 2])
                        .toString(2)
                        .padStart(8, "0")
                        .split(""),
                    evenNum(tempColorData[i + 3])
                        .toString(2)
                        .padStart(8, "0")
                        .split(""), */
                    evenNum(tempColorData[i]),
                    evenNum(tempColorData[i + 1]),
                    evenNum(tempColorData[i + 2]),
                    evenNum(tempColorData[i + 3]),
                    // tempColorData[i],
                    // tempColorData[i + 1],
                    // tempColorData[i + 2],
                    // tempColorData[i + 3],
                ]);
            }
            console.log(this.blockList);
            this.loading = false;
        },
        drawHiddenData() {},
        processData(originalData) {
            let data = originalData.data;
            for (let i = 0; i < data.length; i++) {
                if (i % 4 == 0) {
                    // 红色分量
                    if (data[i] % 2 == 0) {
                        data[i] = 0;
                    } else {
                        data[i] = 255;
                    }
                } else if (i % 4 == 3) {
                    // alpha通道不做处理
                    continue;
                } else {
                    // 关闭其他分量，不关闭也不影响答案，甚至更美观 o(^▽^)o
                    data[i] = 0;
                }
            }
            // 将结果绘制到画布
            ctx.putImageData(originalData, 0, 0);
        },
        merge() {
            let oData = originalData.data;
            let bit, offset; // offset的作用是找到alpha通道值，这里需要大家自己动动脑筋

            switch (color) {
                case "R":
                    bit = 0;
                    offset = 3;
                    break;
                case "G":
                    bit = 1;
                    offset = 2;
                    break;
                case "B":
                    bit = 2;
                    offset = 1;
                    break;
            }

            for (let i = 0; i < oData.length; i++) {
                if (i % 4 == bit) {
                    // 只处理目标通道
                    if (newData[i + offset] === 0 && oData[i] % 2 === 1) {
                        // 没有信息的像素，该通道最低位置0，但不要越界
                        if (oData[i] === 255) {
                            oData[i]--;
                        } else {
                            oData[i]++;
                        }
                    } else if (newData[i + offset] !== 0 && oData[i] % 2 === 0) {
                        // // 有信息的像素，该通道最低位置1，可以想想上面的斑点效果是怎么实现的
                        if (oData[i] === 255) {
                            oData[i]--;
                        } else {
                            oData[i]++;
                        }
                    }
                }
            }
            ctx.putImageData(originalData, 0, 0);
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
        //重置
        reload() {
            // window.location.reload();
            console.log(this.canvas.viewportTransform);
            this.canvas.deactivateAll().renderAll();
            //http://fabricjs.com/fabric-intro-part-5#pan_zoom
            // this.canvas.clear(); // 清空画布
        },
    },
};
</script>
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
