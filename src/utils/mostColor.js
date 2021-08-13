export function getMostColor(imgUrl) {
    return new Promise((resolve, reject) => {
        try {
            const canvas = document.createElement("canvas");
            canvas.width = 20;
            canvas.height = 20;
            const img = new Image(); // 创建img元素
            img.src = imgUrl; // 设置图片源地址
            img.onload = () => {
                const ctx = canvas.getContext("2d");
                const scaleH = canvas.height / img.height;
                img.height = canvas.height;
                img.width = img.width * scaleH;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                console.log(img.width, img.height);
                // 获取像素数据
                let pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
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
                arr[0].url = imgUrl;
                console.log(`%c ${arr[0].color}`, `background: ${arr[0].color};`);
                resolve(arr[0]);
            };
        } catch (e) {
            reject(e);
        }
    });
}
