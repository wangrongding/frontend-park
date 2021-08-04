export function getAverageColor(canvas, img) {
    console.log(img.width, img.height);
    let context = canvas.getContext("2d");
    // 获取像素数据
    let data = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let r = 0,
        g = 0,
        b = 0;
    // 取所有像素的平均值
    for (let row = 0; row < canvas.height; row++) {
        for (let col = 0; col < canvas.width; col++) {
            r += data[(canvas.width * row + col) * 4];
            g += data[(canvas.width * row + col) * 4 + 1];
            b += data[(canvas.width * row + col) * 4 + 2];
        }
    }
    // 求取平均值
    r /= canvas.width * canvas.height;
    g /= canvas.width * canvas.height;
    b /= canvas.width * canvas.height;

    // 将最终的值取整
    r = Math.round(r);
    g = Math.round(g);
    b = Math.round(b);
    console.log("rgb(" + r + "," + g + "," + b + ")");
    return "rgb(" + r + "," + g + "," + b + ")";
}
