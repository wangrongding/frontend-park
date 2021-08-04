export function getAverageColor(imgUrl) {
    return new Promise((resolve, reject) => {
        try {
            const canvas = document.createElement("canvas");
            const img = new Image(); // 创建img元素
            img.src = imgUrl; // 设置图片源地址
            img.onload = () => {
                console.log(img.width, img.height);
                let ctx = canvas.getContext("2d");
                const scaleH = canvas.height / img.height;
                img.height = canvas.height;
                img.width = img.width * scaleH;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                // 获取像素数据
                let data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                let r = 0,
                    g = 0,
                    b = 0,
                    a = 0;
                // 取所有像素的平均值
                for (let row = 0; row < canvas.height; row++) {
                    for (let col = 0; col < canvas.width; col++) {
                        r += data[(canvas.width * row + col) * 4];
                        g += data[(canvas.width * row + col) * 4 + 1];
                        b += data[(canvas.width * row + col) * 4 + 2];
                        a += data[(canvas.width * row + col) * 4 + 3];
                    }
                }
                // 求取平均值
                r /= canvas.width * canvas.height;
                g /= canvas.width * canvas.height;
                b /= canvas.width * canvas.height;
                a /= canvas.width * canvas.height;

                // 将最终的值取整
                r = Math.round(r);
                g = Math.round(g);
                b = Math.round(b);
                a = Math.round(a);
                // console.log("rgba(" + r + "," + g + "," + b + "," + a + ")");
                console.log(
                    `%c ${"rgba(" + r + "," + g + "," + b + "," + a + ")"}
                                                                        `,
                    `background: ${"rgba(" + r + "," + g + "," + b + "," + a + ")"};`
                );
                resolve("rgba(" + r + "," + g + "," + b + ")");
            };
        } catch (e) {
            reject(e);
        }
    });
}
