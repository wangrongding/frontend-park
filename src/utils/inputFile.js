export function inputFile() {
    return new Promise(function (resolve, reject) {
        if (document.getElementById("myInput")) {
            let inputFile = document.getElementById("myInput");
            inputFile.onchange = (e) => {
                let urlArr = [];
                for (let i = 0; i < e.target.files.length; i++) {
                    urlArr.push(URL.createObjectURL(e.target.files[i]));
                }
                resolve(urlArr);
            };
            inputFile.click();
        } else {
            let inputFile = document.createElement("input");
            inputFile.setAttribute("id", "myInput");
            inputFile.setAttribute("type", "file");
            inputFile.setAttribute("accept", "image/*");
            inputFile.setAttribute("name", "file");
            inputFile.setAttribute("multiple", "multiple");
            inputFile.setAttribute("style", "display: none");
            inputFile.onchange = (e) => {
                // console.log(e.target.files[0]);
                // console.log(e.target.files);
                // let tempUrl = URL.createObjectURL(e.target.files[0]);
                // console.log(tempUrl);
                let urlArr = [];
                for (let i = 0; i < e.target.files.length; i++) {
                    urlArr.push(URL.createObjectURL(e.target.files[i]));
                }
                resolve(urlArr);
            };
            document.body.appendChild(inputFile);
            inputFile.click();
        }
    });
}
