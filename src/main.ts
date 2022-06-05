import { App, createApp } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import app from './App.vue'
import router from './router/index'
import pinia from './store/index'
import 'element-plus/dist/index.css'

const appInstance: App<Element> = createApp(app)

// //全局挂载所有图标
/* eslint-disable-next-line */
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  /* @ts-ignore */
  appInstance.component(key, component)
}

// 挂载router,store
appInstance.use(router).use(pinia).mount('#app')
