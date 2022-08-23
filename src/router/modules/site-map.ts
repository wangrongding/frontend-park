import { RouteRecordRaw } from 'vue-router'

export const siteMap: RouteRecordRaw[] = [
  {
    path: '/site-map',
    meta: { title: '超人导航', type: 'single' },
    component: () => import('@/page/siteMap/index.vue'),
  },
]
