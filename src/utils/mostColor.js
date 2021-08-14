export function getMostColor(imgUrl) {
    return new Promise((resolve, reject) => {
        try {
            const canvas = document.createElement("canvas");
            //设置canvas的宽高都为20,越小越快,但是越小越不精确
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
                let colorList = [];
                let color = [];
                let colorKey = "";
                let colorArr = [];
                // 分组循环
                for (let i = 0; i < pixelData.length; i += 4) {
                    color[0] = pixelData[i];
                    color[1] = pixelData[i + 1];
                    color[2] = pixelData[i + 2];
                    color[3] = pixelData[i + 3];
                    colorKey = color.join(",");
                    if (colorKey in colorList) {
                        ++colorList[colorKey];
                    } else {
                        colorList[colorKey] = 1;
                    }
                }
                for (let prop in colorList) {
                    colorArr.push({
                        color: prop.split(","),
                        count: colorList[prop],
                    });
                }
                // 对所有颜色数组排序,取第一个为主色调
                colorArr.sort((a, b) => {
                    return b.count - a.count;
                });
                colorArr[0].url = imgUrl;
                console.log(
                    `%c rgba(${colorArr[0].color.join(",")})`,
                    `background: rgba(${colorArr[0].color.join(",")})`
                );
                resolve(colorArr[0]);
            };
        } catch (e) {
            reject(e);
        }
    });
}
