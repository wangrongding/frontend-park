import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import layout from '@/layout/layout.vue'
import RouterContainer from './routerContainer'

export const routerMenu: RouteRecordRaw[] = [
  {
    path: '/home',
    component: layout,
    redirect: '/home/index',
    meta: { title: '首页', type: 'single' },
    children: [
      {
        path: '/home/index',
        component: () => import('@/page/home/index.vue'),
      },
    ],
  },
  {
    path: '/steganography',
    component: layout,
    meta: { title: '隐写术', type: 'multiple' },
    children: [
      {
        path: '/steganography/text',
        meta: { title: '文字隐写' },
        component: () => import('@/page/steganography/text-steganography.vue'),
      },
      {
        path: '/steganography/enImg',
        meta: { title: '图片隐写' },
        component: () => import('@/page/steganography/img-steganography.vue'),
      },
      {
        path: '/steganography/deImg',
        meta: { title: '解析图片隐写内容' },
        component: () => import('@/page/steganography/img-decryption.vue'),
      },
    ],
  },
  {
    path: '/image-processing',
    component: layout,
    meta: { title: '图像处理', type: 'multiple' },
    children: [
      {
        path: '/image-processing/random-elements',
        meta: { title: '随机生成图形' },
        component: () => import('@/page/image-processing/random-elements.vue'),
      },
      {
        path: '/image-processing/random-elements-boundary',
        meta: { title: '边界随机(不重叠)' },
        component: () =>
          import('@/page/image-processing/random-elements-boundary.vue'),
      },
      {
        path: '/image-processing/pixel-image',
        meta: { title: '千图成像' },
        component: () => import('@/page/image-processing/pixel-image.vue'),
      },
      {
        path: '/image-processing/edit-image',
        meta: { title: '图片编辑' },
        component: () => import('@/page/image-processing/edit-image.vue'),
      },
    ],
  },
  {
    path: '/threejs',
    component: layout,
    meta: { title: 'ThreeJs', type: 'multiple' },
    children: [
      {
        path: '/threejs/scene',
        meta: { title: '场景' },
        component: () => import('@/page/threejs/scene.vue'),
      },
      {
        path: '/threejs/mesh',
        meta: { title: '物体对象' },
        component: () => import('@/page/threejs/mesh.vue'),
      },
      {
        path: '/threejs/light',
        meta: { title: '光源' },
        component: () => import('@/page/threejs/light.vue'),
      },
      {
        path: '/threejs/animate',
        meta: { title: '动画' },
        component: () => import('@/page/threejs/animate.vue'),
      },
      {
        path: '/threejs/dataGUI',
        meta: { title: 'dat.GUI' },
        component: () => import('@/page/threejs/dat.gui.vue'),
      },
      {
        path: '/threejs/Controls',
        meta: { title: 'Controls' },
        component: () => import('@/page/threejs/controls.vue'),
      },
    ],
  },
  {
    path: '/drawBoard',
    component: layout,
    redirect: '/drawBoard/index',
    meta: { title: '画板' },
    children: [
      {
        path: '/drawBoard/index',
        component: () => import('@/page/other/test.vue'),
      },
    ],
  },
  // {
  //   path: '/tone',
  //   component: layout,
  //   redirect: '/tone/index',
  //   meta: { title: '电子音乐' },
  //   children: [
  //     {
  //       path: '/tone/index',
  //       component: () => import('@/page/tone/tone.vue'),
  //     },
  //   ],
  // },
  {
    path: '/other',
    component: layout,
    meta: { title: '杂项', type: 'multiple' },
    children: [
      {
        path: '/other/webRTC',
        component: RouterContainer,
        meta: { title: 'webRTC(开发中)', type: 'multiple' },
        children: [
          {
            path: '/other/webRTC/index',
            meta: { title: '选择设备' },
            component: () => import('@/page/webRTC/selectDevices.vue'),
          },
        ],
      },
      {
        path: '/other/lat-long',
        meta: { title: '经纬度' },
        component: () => import('@/page/other/latitude-longitude.vue'),
      },
    ],
  },
  {
    path: '/siteMap',
    component: layout,
    redirect: '/siteMap/index',
    meta: { title: '超人导航' },
    children: [
      {
        path: 'index',
        component: () => import('@/page/siteMap/index.vue'),
      },
    ],
  },
]

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home/index',
  },
  ...routerMenu,
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/page/error/404.vue'),
  },
]
const router = createRouter({ history: createWebHistory(), routes })
export default router
