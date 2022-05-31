module.exports = {
  env: {
    browser: true,
    es2021: true,
    // 开启setup语法糖环境
    'vue/setup-compiler-macros': true,
  },
  extends: [
    // 'plugin:vue/essential',// vue核心规范
    'plugin:vue/vue3-recommended', // vue3规范
    'airbnb-base',
    'prettier', // prettier规范,覆盖eslint格式配置,写在最后
    '.eslintrc-auto-import.json',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'import/no-extraneous-dependencies': 0, // 禁止使用无关的包
    'import/no-unresolved': 0, // 关闭检查未解析的模块
    'vue/multi-word-component-names': 0, // 禁止使用多单词组件名
    'vue/no-mutating-props': 0, // 禁止更改props传进来的值
    'vue/no-deprecated-slot-attribute': 0, // 禁止使用过时的slot属性
    'no-unused-vars': 0, // 关闭未使用变量检查
    'no-param-reassign': 0, // 禁止对函数参数进行重新赋值
    'no-console': 2, //
    // 'import/extensions': [2, 'always', { ignorePackages: true }],
    'import/extensions': 0,
  },
}

// 整个文件范围内禁止规则出现警告   将/* eslint-disable */放置于文件最顶部===============
/* eslint-disable */

//将需要忽略的代码块用注释包裹起来============
/* eslint-disable */
// alert('foo');
/* eslint-enable */

// 将需要忽略的代码块用注释包裹起来==================
/* eslint-disable no-alert, no-console */
// alert('foo');
// console.log('bar');
/* eslint-enable no-alert, no-console */

// 在指定行上禁用指定的某个规则============
// alert("foo"); // eslint-disable-line no-alert
// eslint-disable-next-line no-alert
// alert("foo");

// 在某个特定的行上禁用多个规则==============
// alert("foo"); // eslint-disable-line no-alert, quotes, semi
// eslint-disable-next-line no-alert, quotes, semi
// alert("foo");

// 对指定行禁用规则警告==============
// alert("foo"); // eslint-disable-line
// eslint-disable-next-line
// alert("foo");
