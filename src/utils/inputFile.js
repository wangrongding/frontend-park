async function handleAttribute(inputFile, multiple) {
    console.log(4);
    if (multiple) {
        await inputFile.setAttribute("multiple", "multiple");
    } else {
        await inputFile.removeAttribute("multiple");
    }
}

export function inputFile(multiple = true) {
    return new Promise(async function (resolve, reject) {
        if (document.getElementById("myInput")) {
            let inputFile = document.getElementById("myInput");
            await handleAttribute(inputFile, multiple);
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
            inputFile.setAttribute("accept", "image/jpeg,image/jpg,image/png");
            inputFile.setAttribute("name", "file");
            console.log(1);

            await handleAttribute(inputFile, multiple);
            console.log(2);

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
            console.log(3);
            inputFile.click();
        }
    });
}
