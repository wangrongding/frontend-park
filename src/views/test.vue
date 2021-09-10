<template>
    <div class="page-container">
        <canvas class="canvas" id="canvas" ref="canvas" width="800" height="500"></canvas>
        <!-- <img id="img" src="../assets/rd.png" alt="" /> -->
    </div>
</template>

<script>
/* eslint-disable */
import { fabric } from "fabric";
export default {
    data() {
        return { text: "???", ctx: null, canvas: null };
    },
    created() {},
    mounted() {
        this.generate();
        //初始化画布
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
        this.addCanvasEvent(); //给画布添加事件
    },
    methods: {
        generate() {
            let canvas = new fabric.Canvas("canvas");
            let ctx = canvas.getContext("2d");
            // canvas.isDrawingMode = true;
            // canvas.freeDrawingBrush.color = "blue";
            // canvas.freeDrawingBrush.width = 5;
            /*             let rect = new fabric.Rect({
                left: 400, //距离左边的距离
                top: 200, //距离上边的距离
                fill: "green", //填充的颜色
                width: 200, //宽度
                height: 200, //高度
            });
            let circle = new fabric.Circle({
                left: 0, //距离左边的距离
                top: 0, //距离上边的距离
                fill: "red", //填充的颜色
                radius: 50, //圆的半径
            });
            console.log(circle);

            circle.setGradient("fill", {
                // 渐变开始的位置
                x1: 0,
                y1: 0,
                // 渐变结束的位置
                x2: circle.width,
                y2: 0,
                //渐变的颜色
                colorStops: {
                    // 渐变的范围(0,0.1,0.3,0.5,0.75,1)0-1之间都可以
                    0: "red",
                    1: "blue",
                },
            }); */
            /* rect.animate("angle", 45, {
                onChange: canvas.renderAll.bind(canvas),
            }); */
            /* rect.set({ angle: 45 });
            rect.animate("angle", "-=90", {
                onChange: canvas.renderAll.bind(canvas),
                duration: 2000,
            }); */
            /* rect.animate("left", 100, {
                onChange: canvas.renderAll.bind(canvas),
                duration: 1500,
            }); */
            /*             rect.animate("left", "+=100", {
                onChange: canvas.renderAll.bind(canvas),
                duration: 1000,
            }); */
            /* rect.animate("left", 100, {
                onChange: canvas.renderAll.bind(canvas),
                duration: 1000,
                easing: fabric.util.ease.easeOutBounce,
            });
            canvas.add(rect); */
            // let canvas = new fabric.StaticCanvas("canvas");
            // 创建一个矩形对象
            let rect = new fabric.Rect({
                left: 200, //距离左边的距离
                top: 200, //距离上边的距离
                fill: "green", //填充的颜色
                width: 200, //宽度
                height: 200, //高度
            });
            // 创建一个圆形对象
            let circle = new fabric.Circle({
                left: 0, //距离左边的距离
                top: 0, //距离上边的距离
                fill: "red", //填充的颜色
                radius: 50, //圆的半径
            });
            // 创建一个三角形对象
            let triangle = new fabric.Triangle({
                left: 200, //距离左边的距离
                top: 0, //距离上边的距离
                fill: "blue", //填充的颜色
                width: 100, //宽度
                height: 100, //高度
            });
            // 将图形形添加到canvas画布上
            canvas.add(rect);
            canvas.add(circle, triangle);

            //绘制图片

            fabric.Image.fromURL(
                "https://img2.baidu.com/it/u=2067045147,1367384486&fm=26&fmt=auto&gp=0.jpg",
                (img) => {
                    // 添加滤镜
                    img.filters.push(new fabric.Image.filters.Grayscale());
                    // 图片加载完成之后，应用滤镜效果
                    img.applyFilters();
                    img.set({
                        left: 0,
                        top: 0,
                    });
                    canvas.add(img);
                },
                { crossOrigin: "anonymous" }
            );

            /* fabric.Image.fromURL("../assets/rd.png", function (img) {
                img.scale(0.5);
                canvas.add(img);
            }); */

            /* let customPath = new fabric.Path(
                "M 0 0 L 300 100 L 170 100 L 70 300 L 20 200 C136.19,2.98,128.98,0,121.32,0 z"
            ); */

            /* customPath.set({
                left: 100,
                top: 100,
                fill: "green",
            });
            canvas.add(customPath); */

            /* canvas.on("mouse:down", function (options) {
                canvas.clear();
                let text = new fabric.Text("你点我啦~", {
                    left: 200,
                    top: 200,
                });
                canvas.add(text);
                console.log(options.e.clientX, options.e.clientY);
            });
            canvas.on("mouse:up", function (options) {
                this.text = "你没点我0.0";
                canvas.clear();
                let text = new fabric.Text("你没点我0.0", {
                    left: 200,
                    top: 200,
                });
                canvas.add(text);
                console.log(options.e.clientX, options.e.clientY);
            }); */
            // canvas.isDrawingMode = true;
            // canvas.freeDrawingBrush.color = "blue";
            // canvas.freeDrawingBrush.width = 5;
        },
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
        }, //添加画布事件
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
                let point = new fabric.Point(this.canvas.width / 2 - 1, this.canvas.height / 2 - 1);
                //(alt + whell 缩放)
                if (!e.e.ctrlKey) {
                    return;
                } else if (e.e.altKey && e.e.ctrlKey) {
                    //(ctrl + alt + whell 加速缩放)
                    // ZOOM = 0.1;
                    point = new fabric.Point(e.pointer.x, e.pointer.y);
                }
                this.zoom = (e.e.deltaY > 0 ? -ZOOM : ZOOM) + this.canvas.getZoom();
                this.zoom = Math.max(0.1, this.zoom); //最小为原来的0.1倍
                this.zoom = Math.min(10, this.zoom); //最大是原来的10倍
                this.canvas.zoomToPoint(point, this.zoom);
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
                    console.log(123);
                    e.target.opacity = 0.5;
                },
                //对象被改变后
                "object:modified": function (e) {
                    e.target.opacity = 1;
                },
            });
        },
    },
};
</script>

<style scoped lang="scss">
.page-container {
    text-align: center;
    .canvas {
        margin: 0 auto;
        border: 1px solid black;
    }
}
</style>
