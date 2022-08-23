import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import * as path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import VueTypeImports from 'vite-plugin-vue-type-imports'
import filePathInject from './plugins/vite-plugin-filepath-injector'
// https://vitejs.dev/config/

export default defineConfig((config) => ({
  plugins: [
    vue({
      // 开启响应式语法糖
      reactivityTransform: true,
    }),
    VueTypeImports(), // 解决 vue 的 type 引入问题
    vueJsx(),
    // Api自动导入
    AutoImport({
      dts: true,
      // 目标文件
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
      ],
      // 全局引入插件
      imports: ['vue', 'vue-router'],
      resolvers: [
        // 自动导入Element-Plus的Api
        ElementPlusResolver(),
        // 自动导入图标组件
        // 自动导入必须遵循名称格式 {prefix：默认为i}-{collection：图标集合的名称}-{icon：图标名称}
      ],
      // eslint报错解决方案
      eslintrc: {
        enabled: true, // Default `false`
        filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
    }),
    // 按需导入组件
    Components({
      dts: true, // enabled by default if `typescript` is installed
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
      ],
      resolvers: [
        // 自动导入 Element Plus 组件
        ElementPlusResolver(),
      ],
    }),
  ],
  // 服务器特定选项，如主机、端口、https…
  server: {
    host: '0.0.0.0',
    port: 9421,
    // open: true,
    proxy: {
      '/api': {
        target: loadEnv(config.mode, process.cwd()).VITE_APP_BASE_API,
        changeOrigin: true,
        rewrite: (pathStr) => pathStr.replace(/^\/api/, ''),
      },
    },
  },
  // 配置解析器
  resolve: {
    // 设置别名
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    extensions: ['.ts', '.js', 'tsx'],
  },
  // 预处理器和Css模块
  css: {
    // css预处理器
    preprocessorOptions: {
      scss: {
        // 给含有中文的scss文件添加 @charset:UTF-8;
        charset: false,
        // 在全局中使用 index.scss中预定义的变量
        additionalData: '@import "./src/styles/index.scss";',
      },
    },
    postcss: {
      plugins: [
        {
          // 通过postcss删除组件库中 scss 文件的 @charset:UTF-8
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: (atRule) => {
              if (atRule.name === 'charset') {
                atRule.remove()
              }
            },
          },
        },
      ],
    },
  },
  // 热更新时，清空控制台
  clearScreen: true,
}))
