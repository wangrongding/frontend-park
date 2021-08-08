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
        return { text: "???" };
    },
    created() {},
    mounted() {
        this.generate();
    },
    methods: {
        generate() {
            let canvas = new fabric.Canvas("canvas");
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush.color = "blue";
            canvas.freeDrawingBrush.width = 5;
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
            /* let rect = new fabric.Rect({
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
            canvas.add(circle, triangle); */

            //绘制图片
            /*             fabric.Image.fromURL(require("./aaa.jpeg"), (img) => {
                img.scale(0.5);
                canvas.add(img);
            });
            fabric.Image.fromURL(require("./aaa.jpeg"), (img) => {
                img.scale(0.5);
                // 添加滤镜
                img.filters.push(
                    new fabric.Image.filters.Grayscale(),
                    new fabric.Image.filters.Sepia(), //色偏
                    new fabric.Image.filters.Brightness({ brightness: 0.2 }) //亮度
                );
                // 图片加载完成之后，应用滤镜效果
                img.applyFilters();
                img.set({
                    left: 300,
                    top: 250,
                });
                canvas.add(img);
            }); */

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
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush.color = "blue";
            canvas.freeDrawingBrush.width = 5;
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
