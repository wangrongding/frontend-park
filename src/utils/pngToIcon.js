const ToIco = require("to-ico");
const fs = require("fs");
const electron = require("electron");

class Renderer {
    constructor() {
        this.buildUI();
        this.addListeners();
        this.windowResizeHandler();
    }

    buildUI() {
        this._root = document.querySelector("#root");
        this._btnConvert = document.querySelector("#btn-convert");
        this._fileFileds = document.querySelectorAll(".file-field");
    }

    /**
     *
     * @param file {File}
     * @returns {Promise<String>}
     */
    loadImage(file) {
        return new Promise((resolve, reject) => {
            let r = new FileReader();
            r.onload = () => resolve(r.result);
            r.onerror = reject;
            r.readAsDataURL(file);
        });
    }

    addSelectImagesListeners() {
        let self = this;

        $(".image-box .image").click(function () {
            $(this.parentNode).find(".file-field").click();
        });
        $(".file-field").change(function () {
            if (this.files && this.files.length) {
                let file = this.files[0];
                if (
                    file &&
                    file.name &&
                    file.name.toLowerCase().endsWith(".png")
                ) {
                    (async () => {
                        let url = await self.loadImage(file);
                        $(this.parentNode)
                            .find(".image")
                            .html(
                                `<img style="display: block;" src="${url}" width="68" height="68">`
                            );
                    })();
                } else {
                    alert("请选择png格式的图片");
                }
            }
        });
    }

    btnConvertClickedHandler() {
        let files = [];
        for (let ff of this._fileFileds) {
            if (ff.files && ff.files.length) {
                files.push(fs.readFileSync(ff.files[0].path));
            }
        }
        if (files.length) {
            let savedPath = electron.remote.dialog.showSaveDialog({
                title: "保存文件ico文件",
                defaultPath: "icon.ico",
            });
            if (savedPath) {
                (async () => {
                    let buf = await ToIco(files);
                    fs.writeFileSync(savedPath, buf);
                    alert("文件转换成功");
                })();
            }
        } else {
            alert("请至少选择一个png文件");
        }
    }

    addListeners() {
        window.onresize = this.windowResizeHandler.bind(this);
        this.addSelectImagesListeners();
        this._btnConvert.onclick = this.btnConvertClickedHandler.bind(this);
    }

    windowResizeHandler() {
        this._root.style.width = window.innerWidth + "px";
        this._root.style.height = window.innerHeight + "px";
    }
}

new Renderer();
