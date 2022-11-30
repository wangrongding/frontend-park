import { createRouter, createWebHistory, RouteRecordRaw, Router } from 'vue-router'
import Layout from '@/layout/layout.vue'
import { formatFlatteningRoutes } from './utils'
import { home } from './modules/home'
import { steganography } from './modules/steganography'
import { imageProcessing } from './modules/image-processing'
import { audioAndVideo } from './modules/audio-and-video'
import { siteMap } from './modules/site-map'
import { three } from './modules/three'
import { tensorflow } from './modules/tensorflow'
import { other } from './modules/other'
// 用于渲染菜单，面包屑，保持原始层级
export const routerList: Array<RouteRecordRaw> = [...home, ...steganography, ...imageProcessing, ...audioAndVideo, ...tensorflow, ...three, ...siteMap, ...other]

// 扁平化的路由
const flatRouters = formatFlatteningRoutes(routerList)

//
export const routes: Array<RouteRecordRaw> = [
  // 根目录重定向的页面
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [...flatRouters],
  },
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/page/error/404.vue'),
  },
]
const router: Router = createRouter({ history: createWebHistory(), routes })
export default router
