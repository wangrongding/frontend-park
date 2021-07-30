export function colorCount(canvas, img) {
    const context = canvas.getContext("2d");
    // console.log("img", img);
    console.log(img.width, img.height);
    // 获取像素数据
    let pixelData = context.getImageData(0, 0, canvas.width, canvas.height).data;
    // console.log(pixelData);

    let colorList = [];
    let rgba = [];
    let rgbaStr = "";
    // 分组循环
    for (let i = 0; i < pixelData.length; i += 4) {
        rgba[0] = pixelData[i];
        rgba[1] = pixelData[i + 1];
        rgba[2] = pixelData[i + 2];
        rgba[3] = pixelData[i + 3];
        if (rgba.indexOf(undefined) !== -1 || pixelData[i + 3] === 0) {
            continue;
        }
        // console.log("rgba", rgba);
        rgbaStr = rgba.join(",");
        if (rgbaStr in colorList) {
            ++colorList[rgbaStr];
        } else {
            colorList[rgbaStr] = 1;
        }
    }
    let arr = [];
    for (let prop in colorList) {
        arr.push({
            // 如果只获取rgb,则为`rgb(${prop})`
            color: `rgba(${prop})`,
            count: colorList[prop],
        });
    }
    // 数组排序
    arr.sort((a, b) => {
        return b.count - a.count;
    });
    // console.log("arr", arr[0].color);
    // document.body.style.background = arr[0].color;
    console.log("arr", arr);
    return arr;
}
