/* eslint-disable */
export default function filePathInject() {
  // 返回的是插件主体
  return {
    // 指定插件名称,用于在控制台输出
    name: 'vite-plugin-filepath-injector',
    // 替换插件指定内容
    transform(code, id) {
      if (/\.(vue)$/.test(id) && /__filePath__/g.test(code)) {
        code = code.replace(
          /__filePath__/g,
          id,
          // '文件地址: src' + id.split('src').slice(-1)[0],
        )
        return code
      }
    },
  }
}
