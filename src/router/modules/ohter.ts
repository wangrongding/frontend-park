import { RouteRecordRaw } from 'vue-router'

export const imageProcessing: RouteRecordRaw[] = [
  {
    path: '/other/lat-long',
    meta: { title: '经纬度' },
    component: () => import('@/page/other/latitude-longitude.vue'),
  },
]
