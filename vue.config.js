const path = require("path");
const resolve = (dir) => path.join(__dirname, dir);
const appName = require("./package.json").name;
module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
    outputDir: "docs", // 输出文件目录
    devServer: {
        port: 9425,
        hot: true,
        open: true,
        // https: true,
        overlay: {
            warnings: false,
            errors: true,
        },
        headers: {
            "Access-Control-Allow-Origin": "*", // 主应用获取子应用时跨域响应头
        },
        host: "0.0.0.0",
    },
    configureWebpack: {
        output: {
            library: `${appName}-[name]`, //微应用的包名，与主应用中注册的微应用名称必须一致
            libraryTarget: "umd", // 把微应用打包成 umd 库格式
            jsonpFunction: `webpackJsonp_${appName}`, //按需加载相关，设置为 webpackJsonp_VueMicroApp 即可
        },
    },
    chainWebpack: (config) => {
        config.resolve.alias
            .set("@", resolve("src"))
            .set("@api", resolve("src/api"))
            .set("@assets", resolve("src/assets"))
            .set("@components", resolve("src/components"))
            .set("@utils", resolve("src/utils"));
        // 忽略 runtime 块，提高首屏渲染速度 （默认配置：https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171）
        config.plugin("preload").tap(() => [
            {
                rel: "preload",
                include: "initial",
                fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
            },
        ]);
        //配置网页title
        config.plugin("html").tap((args) => {
            args[0].title = "frontend-park";
            return args;
        });
    },
};
