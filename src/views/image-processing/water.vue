<template>
    <!--  -->
    <div class="home">
        <div class="content" :style="`background:white`" v-loading="loading">
            <div class="watermarkContainer" id="watermarkContainer">
                <canvas id="watermark" ref="watermark"></canvas>
            </div>
            <canvas id="canvas" ref="canvas" width="400" height="400"></canvas>
        </div>
        <div class="operations">
            <div style="height: 800px; margin: 0 auto">
                <el-button
                    type="success"
                    style="width: 100%; margin: 10px auto"
                    size="default"
                    @click="aaa"
                >
                    选择文件
                </el-button>
                <el-button
                    type="primary"
                    style="width: 100%; margin: 10px auto"
                    size="default"
                    @click="aaa"
                >
                    重置
                </el-button>
                <el-button
                    type="primary"
                    style="width: 100%; margin: 10px auto"
                    size="default"
                    @click="aaa"
                >
                    生成图片
                </el-button>
                <el-button
                    type="success"
                    style="width: 100%; margin: 10px auto"
                    size="default"
                    @click="aaa"
                >
                    导出图片
                </el-button>
            </div>
        </div>
    </div>
</template>
<script>
/* eslint-disable */
import { fabric } from "fabric";
export default {
    components: {},
    data() {
        return { loading: false, ctx: null, canvas: null, watermark: null };
    },
    mounted() {
        this.initCanvas();
        window.addEventListener("resize", this.resizeCanvas, false);
        this.initWaterMark();
        this.monitor();
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
            // this.watermark = document.getElementById("watermark");
        },
        //重置
        reload() {
            // window.location.reload();
            console.log(this.canvas.viewportTransform);
            this.canvas.deactivateAll().renderAll();
            //http://fabricjs.com/fabric-intro-part-5#pan_zoom
            // this.canvas.clear(); // 清空画布
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
            // let blockList = [];
            for (let Y = 0; Y < this.canvas.height / 8; Y++) {
                for (let X = 0; X < this.canvas.width / 8; X++) {
                    //每8*8像素的一块区域一组
                    let tempColorData = this.ctx.getImageData(X * 8, Y * 8, 8, 8).data;
                    // console.log(X, Y, tempColorData);
                    //将获取到数据每4个一组,每组都是一个像素
                    this.blockList[Y * 100 + X] = { position: [X, Y], color: [] };
                    for (let i = 0; i < tempColorData.length; i += 4) {
                        this.blockList[Y * 100 + X].color.push([
                            tempColorData[i],
                            tempColorData[i + 1],
                            tempColorData[i + 2],
                            tempColorData[i + 3],
                        ]);
                    }
                }
            }
            console.log(mostBlockColor(this.blockList));
            this.mostBlockColor(this.blockList);
            this.loading = false;
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
        aaa() {},
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
        //调整水印画布大小
        resizeCanvas() {
            //canvas 的 width/height 属性对应的是画布内的 coordinate space，并不归 CSS 管
            // this.watermark.width = window.innerWidth;
            // this.watermark.height = window.innerHeight;
            this.watermark.setHeight(window.innerHeight);
            this.watermark.setWidth(window.innerWidth);
            this.watermark.renderAll();
            console.log(this.watermark.width, this.watermark.height);
        },
        //初始化水印
        initWaterMark() {
            this.watermark = new fabric.Canvas("watermark", {
                width: window.innerWidth,
                height: window.innerHeight,
                selectable: false,
                selection: false,
            });
            for (let i = 0; i < this.watermark.width; i += 250) {
                for (let j = 0; j < this.watermark.height; j += 250) {
                    let text = new fabric.Text("荣顶~", {
                        left: i,
                        top: j,
                        fontSize: 25, //字号
                        angle: 45,
                        fontWeight: 800, //字体粗细
                        textAlign: "center", //文本对齐方式
                        lineHeight: 1.5, //行高
                        fill: " rgba(0, 0, 0, 0.1)",
                    });
                    this.watermark.add(text);
                }
            }
        },
        //监听DOM的改变
        monitor() {
            /* document.querySelector("#watermarkContainer").addEventListener(
                "DOMNodeRemoved",
                (e) => {
                    let watermark = document.createElement("div");
                    watermark.innerHTML = `
                        <div class="watermarkContainer" id="watermarkContainer">
                            <canvas id="watermark" ref="watermark"></canvas>
                        </div>`;
                    console.log(e);
                    document.querySelector(".content").appendChild(watermark);
                    setTimeout(() => {
                        this.monitor();
                        this.initWaterMark();
                    }, 500);
                },
                false
            ); */
            // 创建一个观察器实例并传入回调函数
            const observer = new MutationObserver((mutationsList, observer) => {
                let watermarkContainer = document.querySelector("#watermarkContainer");
                for (let mutation of mutationsList) {
                    if (mutation.type === "childList") {
                        if (watermarkContainer) {
                            let watermark = document.createElement("div");
                            watermark.innerHTML = `
                            <div class="watermarkContainer" id="watermarkContainer">
                                <canvas id="watermark" ref="watermark"></canvas>
                            </div>`;
                            document.querySelector(".content").appendChild(watermark);
                            this.monitor();
                            this.initWaterMark();
                            console.log(mutation, "qweqweqweqwe");
                        }
                    } else if (mutation.type === "attributes") {
                        console.log(mutation, `modified:${mutation.attributeName}`);
                        if (!watermark) {
                            content.appendChild(watermark);
                            this.monitor();
                            console.log(mutation, "qweqweqweqwe");
                        }
                    }
                }
            });
            // 以上述配置开始观察目标节点/ 观察器的配置（需要观察什么变动）
            observer.observe(document.querySelector(".content"), {
                attributes: true,
                childList: true,
                subtree: true,
            });
            // 之后，可停止观察
            // observer.disconnect();
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
        #watermark {
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
