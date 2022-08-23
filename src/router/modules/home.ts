import { RouteRecordRaw } from 'vue-router'

export const home: RouteRecordRaw[] = [
  {
    path: '/home',
    component: () => import('@/page/home/index.vue'),
    meta: { title: '首页', type: 'single' },
  },
]
