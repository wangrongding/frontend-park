module.exports = {
  env: {
    browser: true,
    es2021: true,
    // 开启setup语法糖环境
    'vue/setup-compiler-macros': true,
  },
  extends: [
    // 'plugin:vue/essential',// vue核心规范
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended', // vue3规范
    'prettier', // prettier规范,覆盖eslint格式配置,写在最后
    '.eslintrc-auto-import.json', // unplugin-auto-import自动导入的api
  ],
  // 针对特定文件重写eslint规则
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.vue'],
      rules: {
        // 解决 ts 全局类型定义后，eslint报错的问题
        'no-undef': 'off',
      },
    },
  ],
  // 支持ts的最新语法
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  // 添加vue和@typescript-eslint插件，增强eslint的能力
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }], // 禁止提交 log
    'import/no-extraneous-dependencies': 0, // 禁止使用无关的包
    'import/no-unresolved': 0, // 关闭检查未解析的模块
    'vue/multi-word-component-names': 0, // 禁止使用多单词组件名
    'no-unused-vars': 0, // 关闭未使用变量检查
    'no-param-reassign': 0, // 禁止对函数参数进行重新赋值
    '@typescript-eslint/no-empty-function': 0, // 禁止空函数
    'no-use-before-define': 0, // 禁止在未定义前使用变量
    '@typescript-eslint/no-explicit-any': 0, // 禁止使用any
    '@typescript-eslint/no-non-null-assertion': 0, // 禁止使用non-null
    '@typescript-eslint/no-unused-vars': 0, // 禁止未使用的变量
    '@typescript-eslint/ban-ts-comment': 0, // 禁止使用ts忽略检查注释
    'arrow-body-style': 0, // 禁止箭头函数体使用大括号
    'prefer-destructuring': 0,
    'no-plusplus': 0, // 禁止使用++，--
    'no-continue': 0, // 禁止使用continue
    'import/prefer-default-export': 0, // 禁止使用export default
    'no-shadow': 0, // 禁止变量声明时使用相同名字
    'import/extensions': 0, // 使用文件扩展名
    'no-underscore-dangle': 0, // 禁止使用下划线
    'no-multi-assign': 0, // 禁止连续赋值
    // 'eol-last': ['error', 'never'], // 文件末尾强制换行
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
