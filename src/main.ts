import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.ts'
import pinia from './store/index.ts'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(router).use(pinia).mount('#app')
