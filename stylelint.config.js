module.exports = {
  defaultSeverity: 'error',
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recommended-vue', 'stylelint-config-prettier'],
  plugins: ['stylelint-order'],
  rules: {
    'max-empty-lines': 1,
    'color-no-invalid-hex': true,
    'color-hex-case': 'lower',
    'block-no-empty': null,
    'no-empty-source': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'forward', 'function', 'if', 'each', 'include', 'mixin', 'for'],
      },
    ],
    'scss/at-rule-no-unknown': null,
  },
  ignoreFiles: [
    '**/*.js',
    '**/*.jsx',
    '**/*.ts',
    '**/*.tsx',
    '**/*.png',
    '**/*.jpg',
    '**/*.jpeg',
    '**/*.gif',
    '**/*.svg',
    '**/*.mp3',
    '**/*.mp4',
    '**/*.webm',
    '**/*.woff',
    '**/*.woff2',
    '**/*.ttf',
    '**/*.woff',
    '**/*.json',
    '**/*.md',
    '**/*.html',
  ],
}

// 以忽略整個檔案
/* stylelint-disable */
// 忽略下一行
/* stylelint-disable-next-line */
// 指定需要忽略的文件
// ignoreFiles: ["src/assets/scss/abc.scss"];
