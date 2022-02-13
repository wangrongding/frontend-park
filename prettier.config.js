/**
 * 参考 https://prettier.io/docs/en/options.html
 */
module.exports = {
    jsxSingleQuote: false, // 在JSX中是否使用单引号
    trailingComma: "all", // 多行时尽可能打印尾随逗号
    bracketSpacing: true, // 对象文字中的括号之间打印空格
    arrowParens: "always",
    htmlWhitespaceSensitivity: "strict", // html中换行规则,[strict,ignore]
    vueIndentScriptAndStyle: false, // vue中script与style里的第一条语句是否空格
    endOfLine: "lf", // 换行符
    embeddedLanguageFormatting: "auto",
    tabWidth: 4, // 空格数
    useTabs: false, // 是否开启tab
    semi: true, // 是否在语句末尾打印分号
    singleQuote: false, // 是否使用单引号
    TrailingCooma: "all",
    printWidth: 100, // 换行的宽度
    quoteProps: "as-needed", // 对象的key仅在需要时用引号
    jsxBracketSameLine: false,
    bracketSameLine: false,
};
