/* eslint-disable */

//webpack 暴露了一个名为 __webpack_public_path__ 的全局变量。所以在应用程序的 entry point 中，可以直接如下设置：

//__webpack_public_path__ = process.env.ASSET_PATH;

if (window.__POWERED_BY_QIANKUN__) {
    // 动态设置 webpack publicPath，防止资源加载出错
    __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
    /*  if (process.env.NODE_ENV === "development") {
         __webpack_public_path__ = `//localhost:9427`;
     } */
}
