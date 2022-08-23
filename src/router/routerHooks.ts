import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import router from '@/router/index.ts'

export interface toRouteType extends RouteLocationNormalized {
  meta: {
    keepAlive?: boolean
    refreshRedirect: string
    dynamicLevel?: string
  }
}
NProgress.configure({
  // 指定此项以更改父容器。（默认body：）
  parent: '#app',
  // 通过将其设置为 false 来关闭加载微调器。（默认true：）
  showSpinner: true,
  // 使用缓动（CSS 缓动字符串）和速度（以毫秒为单位）调整动画设置
  easing: 'ease',
  speed: 500,
})
/* 
beforeEach(前置守卫)：导航执行前
beforeResolve（解析守卫）：导航解析完成前
afterEach（后置守卫）：导航完成后
beforeEnter：路由内守卫
beforeRouteEnter: 进入组件页面前
beforeRouteUpdate：组件路由更新前
beforeRouteLeave：离开组件前
*/
router.beforeEach(
  async (to: toRouteType, from: toRouteType, next: NavigationGuardNext) => {
    NProgress.start()
    next()
  },
)

router.beforeResolve(async () => {
  NProgress.done()
})
