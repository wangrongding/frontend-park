/*  
FileReader 使用不同的方法读取
readAsBinaryString(Blob|File)：返回二进制字符串，该字符串每个字节包含一个 0 到 255 之间的整数。

readAsText(Blob|File, opt_encoding)
：返回文本字符串。默认情况下，文本编码格式是’UTF-8’，可以通过可选的格式参数，指定其他编码格式的文本。

readAsDataURL(Blob|File)：返回一个基于 Base64 编码的 data-uri 对象。

readAsArrayBuffer(Blob|File) ：返回一个 ArrayBuffer（数组缓存）对象。
———————————————————————————————————————————————————————————————————————
获取上传对象的文本内容的方法：

    var reader = new FileReader();
    reader.onload = function(e){
        // target.result 该属性表示目标对象的DataURL
        console.log(e.target.result);
    }
    // 传入一个参数对象即可得到基于该参数对象的文本内容
    reader.rederAsDataURL(file);

———————————————————————————————————————————————————————————————————————
利用File Api讲blob转成File对象
let files = new window.File([this.blob], file.name, {type: file.type})
 */
