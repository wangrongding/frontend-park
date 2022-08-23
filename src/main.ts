import { createApp } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router/index'
import pinia from './store/index'
import 'element-plus/dist/index.css'
import '@/router/permission'

// 公共样式
import '@/styles/index.scss'
// svg图标
import 'virtual:svg-icons-register'

// 所有图标的名称
// import icons from 'virtual:svg-icons-names'
// console.log('🚀🚀🚀 / icons', icons)

const app = createApp(App)
// 全局挂载所有图标
Object.keys(ElementPlusIconsVue).forEach((key) => {
  app.component(
    key,
    ElementPlusIconsVue[key as keyof typeof ElementPlusIconsVue],
  )
})

app.use(router).use(pinia).mount('#app')
