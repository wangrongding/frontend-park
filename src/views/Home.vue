<template>
    <div class="home">
        <div class="content" :style="`background:${background}`" v-loading="loading">
            <div style="text-align: left; width: 800px">
                <p>使用方法:</p>
                <p style="font-size: 12px">
                    选取目标文件后,再选取需要用来合成目标文件的素材图片,通过自定义的一些配置,生成像素图,点击导出图片即可
                </p>
            </div>
            <canvas id="canvas" ref="canvas" width="800" height="800"></canvas>
        </div>
        <div class="operations">
            <div style="height: 800px">
                <EasyForm :formParams="formParams">
                    <template #inputFile="{}">
                        <el-button type="primary" size="small" @click="inputFile">
                            选择文件
                        </el-button>
                        <div>共选择{{ imgList.length }}个文件</div>
                    </template>
                </EasyForm>
                <el-button type="primary" size="default" @click="reload">重置</el-button>
                <el-button type="primary" size="default" @click="generateImg">生成图片</el-button>
                <el-button type="success" size="default" @click="exportCanvas">导出图片</el-button>
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
// @ is an alias to /src
import { getMostColor } from "@utils/mostColor.js";
import { inputFile } from "@utils/inputFile.js";
import { fabric } from "fabric";
export default {
    name: "Home",
    components: {},
    data() {
        return {
            imgList: [],
            loading: false,
            src: require("../assets/rd.png"),
            formParams: {
                data: {}, // 表单数据对象
                formList: {
                    targetFile: {
                        type: "upload",
                        label: "目标图片",
                        limit: 1,
                        action: "#",
                        listType: "file-list",
                        fileList: [],
                        autoUpload: false,
                        onChange: this.fileChange,
                    },
                    inputFile: {
                        type: "customItem",
                        label: "素材图片",
                        name: "inputFile",
                    },
                    /* userN2ww2ame: {
                        type: "slider",
                        label: "贴片大小",
                    }, */
                    //TODO
                    aaa: {
                        type: "select",
                        label: "分布方式",
                        placeholder: "请选择",
                        selectOptions: [],
                    },
                    bbb: {
                        type: "select",
                        label: "高清程度",
                        placeholder: "请选择",
                        selectOptions: [],
                    },
                    ccc: {
                        type: "switch",
                        label: "连续重复:",
                        placeholder: "请选择",
                    },
                    ddd: {
                        type: "switch",
                        label: "按比例调整",
                    },
                    eee: {
                        type: "select",
                        label: "方向／比例",
                        selectOptions: [],
                    },
                    fff: {
                        type: "slider",
                        label: "贴片高度",
                    },
                    ggg: {
                        type: "slider",
                        label: "贴片宽度",
                    },
                },

                labelWidth: "90px",
                rules: {},
            },
            background: "#91A8D0",
            ctx: null,
            canvas: null,
        };
    },
    mounted() {
        this.initCanvas();
    },
    methods: {
        //初始化画布
        initCanvas() {
            this.canvas = new fabric.Canvas("canvas", {
                isDrawingMode: false, //自由绘画模式
                selectable: false,
                selection: false,
                hoverCursor: "pointer",
                devicePixelRatio: true, //Retina 高清屏 屏幕支持
                stroke: "lightgreen",
                strokeWidth: 4,
            });
            this.ctx = canvas.getContext("2d");
            this.canvas.freeDrawingBrush.color = "blue";
            this.canvas.freeDrawingBrush.width = 5;
            this.addCanvasEvent();
        },
        //重置
        reload() {
            // window.location.reload();
            console.log(this.canvas.viewportTransform);
            this.canvas.deactivateAll().renderAll();
            //http://fabricjs.com/fabric-intro-part-5#pan_zoom
            // this.canvas.clear(); // 清空画布
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
        //目标图片选择回调
        fileChange(file, fileList) {
            let tempUrl = window.URL.createObjectURL(file.raw);
            this.drawImage(tempUrl);
        },
        //素材图片选择回调
        async inputFile() {
            let files = await inputFile();
            this.loading = true;
            console.log(files);
            for (let i = 0; i < files.length; i++) {
                let image = await getMostColor(files[i]);
                this.imgList.push(image);
            }
            console.log(this.imgList);
            for (let k = 0; k < this.imgList.length; k++) {
                fabric.Image.fromURL(this.imgList[k].url, (img) => {
                    img.scale(8 / img.height);
                    img.set({
                        left: k * 8,
                        top: k * 8,
                        originX: "center",
                        scaleX: 8 / img.height,
                        scaleY: 8 / img.height,
                    });
                    this.canvas.add(img);
                });
            }
            /* for (let i = 0; i < 100; i++) {
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
            } */
            this.loading = false;
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
            let pixelList = [];
            for (let Y = 0; Y < this.canvas.height; Y += 8) {
                for (let X = 0; X < this.canvas.width; X += 8) {
                    //每8*8像素的一块区域一组
                    let tempColorData = this.ctx.getImageData(X * 8, Y * 8, 8, 8).data;
                    //将获取到数据每4个一组,每组都是一个像素
                    pixelList[(Y / 8) * 100 + X / 8] = [];
                    for (let i = 0; i < tempColorData.length; i += 4) {
                        pixelList[(Y / 8) * 100 + X / 8].push([
                            tempColorData[i],
                            tempColorData[i + 1],
                            tempColorData[i + 2],
                            tempColorData[i + 3],
                        ]);
                    }
                }
            }
            console.log(pixelList);
        },
        //绘制目标图片
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
                        selectable: false,
                    });
                    img.on("added", (e) => {
                        //这里有个问题,added后获取的是之前的画布像素数据,其他手动触发的事件,不会有这种问题
                        //故用一个异步解决
                        setTimeout(() => {
                            this.getCanvasData();
                        }, 500);
                    });
                    this.canvas.add(img);
                    this.drawLine();
                },
                { crossOrigin: "anonymous" }
            );
        },
        //计算颜色差异
        colorDiff(color1, color2) {
            let d = 0;
            for (let i = 0; i < color1.length; i++) {
                d += (color1[i] - color2[i]) ** 2;
            }
            return Math.sqrt(d);
        },
        //添加画布事件
        addCanvasEvent() {
            //画布重绘
            this.canvas.on("after:render", (e) => {});
            //有对象添加进来
            this.canvas.on("object:added", (e) => {});
            //鼠标单击
            this.canvas.on("mouse:down", (e) => {
                //ALT键盘+单击,获取当前光标处像素的值
                if (e.e.ctrlKey) {
                    let mouse = this.canvas.getPointer(e.e);
                    let x = parseInt(mouse.x);
                    let y = parseInt(mouse.y);
                    let px = this.ctx.getImageData(x, y, 1, 1).data;
                    console.log(
                        `%c x,y:(${x},${y})/rgba(${px[0]},${px[1]},${px[2]},${px[3]})`,
                        `background: rgba(${px[0]},${px[1]},${px[2]},${px[3]});`
                    );
                }
            });
            // 滚轮事件
            this.canvas.on("mouse:wheel", (e) => {
                e.e.preventDefault();
                e.e.stopPropagation();
                let ZOOM = 0.05;
                //(alt + whell 缩放)
                if (!e.e.ctrlKey) {
                    return;
                } else if (e.e.altKey && e.e.ctrlKey) {
                    //(ctrl + alt + whell 加速缩放)
                    ZOOM = 1;
                }
                console.log(e);
                this.zoom = (e.e.deltaY > 0 ? -ZOOM : ZOOM) + this.canvas.getZoom();
                this.zoom = Math.max(0.1, this.zoom); //最小为原来的0.05倍
                this.zoom = Math.min(10, this.zoom); //最大是原来的10倍
                this.canvas.zoomToPoint(new fabric.Point(e.pointer.x, e.pointer.y), this.zoom);
            });
            //画布随着鼠标移动。
            this.canvas.on({
                "mouse:down": (e) => {
                    if (e.e.altKey) {
                        this.panning = true;
                        this.canvas.selection = false;
                    }
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
                //对象被移动时,添加透明效果
                "object:moving": function (e) {
                    e.target.opacity = 0.5;
                },
                //对象被改变后
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
<style lang="scss" scoped>
::v-deep .el-form-item__label {
    color: white !important;
}
::v-deep .el-upload-list {
    max-width: 200px;
    overflow: hidden;
}
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
    }
}
#canvas {
    border: 2px dashed #516fa3;
    object-fit: fill;
    background-color: white;
}
</style>
