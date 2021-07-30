export function inputFile() {
    this.inputfile = document.createElement("input");
    this.inputfile.setAttribute("id", "file");
    this.inputfile.setAttribute("type", "file");
    this.inputfile.setAttribute("name", "file");
    this.inputfile.setAttribute("style", "visibility:hidden");
    document.querySelector("#file").addEventListener("change", (e) => {
        console.log(e.target.files[0]);
        // let tempUrl = URL.createObjectURL(e.target.files[0]);
        // console.log(tempUrl);
    });
    this.inputfile.click();
}
