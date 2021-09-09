const path = require("path");
const resolve = (dir) => path.join(__dirname, dir);
module.exports = {
    publicPath: "./",
    outputDir: "docs", // 输出文件目录
    devServer: {
        port: 9425,
        hot: true,
        open: true,
        overlay: {
            warnings: false,
            errors: true,
        },
        host: "0.0.0.0",
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
        // config.plugin("html").tap((args) => {
        //     args[0].title = "千图成像";
        //     return args;
        // });
    },
};
