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
            <el-button type="success" size="default" @click="exportCanvas">导出图片</el-button>
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
        this.canvas = new fabric.Canvas("canvas", {
            isDrawingMode: false, //自由绘画模式
            selectable: false,
            selection: false,
            hoverCursor: "pointer",
            devicePixelRatio: true, //Retina 高清屏 屏幕支持
        });
        this.ctx = canvas.getContext("2d");
        this.canvas.freeDrawingBrush.color = "blue";
        this.canvas.freeDrawingBrush.width = 5;
        this.addCanvasEvent();
    },
    methods: {
        reload() {
            // window.location.reload();
            console.log(this.canvas.getWidth(), this.canvas.getHeight());
            this.canvas.clear(); // 清空画布
        },
        //生成图片
        generateImg() {
            let canvas = new fabric.Canvas("canvas");
            this.imgList.forEach((item, index) => {
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
        //目标图片选择回调
        fileChange(file, fileList) {
            let tempUrl = window.URL.createObjectURL(file.raw);
            this.drawImage(tempUrl);
        },
        //素材图片选择回调
        async imgListChange(file, fileList) {
            let tempUrl = window.URL.createObjectURL(file.raw);
            // getAverageColor(tempUrl);
            let mostColor = await getMostColor(tempUrl);
            this.imgList.push({ url: tempUrl, color: mostColor });
            console.log(this.imgList);
            for (let i = 0; i < 100; i++) {
                for (let j = 0; j < 100; j++) {
                    fabric.Image.fromURL(tempUrl, (img) => {
                        img.scale(8 / img.height);
                        img.set({
                            left: j * 8,
                            top: i * 8,
                            originX: "center",
                            scaleX: 8 / img.height,
                            scaleY: 8 / img.height,
                        });
                        this.canvas.add(img);
                    });
                }
            }
        },
        //栅格线
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
        //获取画布像素数据
        getCanvasData() {
            let tempImageData = this.ctx.getImageData(
                0,
                0,
                this.canvas.width,
                this.canvas.height
            ).data;
            let colorList = [];
            for (let i = 0; i < tempImageData.length; i += 4) {
                colorList.push(
                    `rgba(${tempImageData[i]},${tempImageData[i + 1]},${tempImageData[i + 2]},${
                        tempImageData[i + 3]
                    })`
                );
            }
            let pixelList = [];
            for (let i = 0; i < colorList.length / this.canvas.width; i++) {
                pixelList[i] = [];
                for (let j = i * 800; j < (i + 1) * 800; j++) {
                    pixelList[i].push(colorList[i * 800 + j]);
                }
            }
            console.log(colorList);
            console.log(pixelList);
        },
        //绘制图片
        drawImage(url) {
            fabric.Image.fromURL(
                url,
                (img) => {
                    img.set({
                        left: this.canvas.height / 2,
                        originX: "center",
                        top: 0,
                        scaleX: this.canvas.height / img.height,
                        scaleY: this.canvas.height / img.height,
                        // selectable: false,
                    });
                    this.canvas.add(img);
                    setTimeout(() => {
                        this.getCanvasData();
                    }, 500);
                    // this.drawLine();
                },
                { crossOrigin: "anonymous" }
            );
        },
        //添加画布事件
        addCanvasEvent() {
            this.canvas.on("object:added", (e) => {
                // console.log(e);
            });
            //获取当前光标处像素的值
            this.canvas.on("mouse:down", (e) => {
                if (!e.e.ctrlKey) {
                    return;
                }
                let mouse = this.canvas.getPointer(e.e);
                let x = parseInt(mouse.x);
                let y = parseInt(mouse.y);
                let px = this.ctx.getImageData(x, y, 1, 1).data;
                console.log(
                    `%c x,y:(${x},${y})/rgba(${px[0]},${px[1]},${px[2]},${px[3]})
                                                                        `,
                    `background: rgba(${px[0]},${px[1]},${px[2]},${px[3]});`
                );
            });
            // 滚轮缩放 (alt + whell 缩放)
            this.canvas.on("mouse:wheel", (e) => {
                e.e.preventDefault();
                e.e.stopPropagation();
                let ZOOM = 0.05;
                if (!e.e.altKey) {
                    return;
                } else if (e.e.altKey && e.e.ctrlKey) {
                    ZOOM = 1;
                } else if (e.e.altKey) {
                }
                console.log(e);
                this.zoom = (e.e.deltaY > 0 ? -ZOOM : ZOOM) + this.canvas.getZoom();
                this.zoom = Math.max(0.05, this.zoom); //最小为原来的0.05倍
                this.zoom = Math.min(10, this.zoom); //最大是原来的10倍
                this.zoomPoint = new fabric.Point(e.pointer.x, e.pointer.y);
                this.canvas.zoomToPoint(this.zoomPoint, this.zoom);
            });
            //画布随着鼠标移动。
            this.canvas.on({
                "mouse:down": (e) => {
                    if (!e.e.altKey) {
                        return;
                    }
                    this.panning = true;
                    this.canvas.selection = false;
                },
                "mouse:up": (e) => {
                    this.panning = false;
                    this.canvas.selection = true;
                },
                "mouse:move": (e) => {
                    if (this.panning && e && e.e) {
                        let delta = new fabric.Point(e.e.movementX, e.e.movementY);
                        this.canvas.relativePan(delta);
                    }
                },
            });
            this.canvas.on({
                "object:moving": function (e) {
                    e.target.opacity = 0.5;
                },
                "object:modified": function (e) {
                    e.target.opacity = 1;
                },
            });
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
