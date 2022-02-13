module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: ["plugin:vue/essential", "eslint:recommended", "prettier"],
    parserOptions: {
        parser: "babel-eslint",
    },
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        indent: ["error", 4], //缩进
        "linebreak-style": ["error", "windows"], //换行符风格 |unix|windows|
        quotes: ["error", "double"], //使用双引号或单引号
        semi: ["error", "always"], //语句末尾使用分号
        "comma-dangle": ["error", "always-multiline"], //使用拖尾逗号
        curly: "warn", //强制所有控制语句使用一致的括号风格
        // eqeqeq: "warn", //需要使用 `===` and `!==`
        "no-throw-literal": "warn", //禁止抛出异常字面量
    },
};
