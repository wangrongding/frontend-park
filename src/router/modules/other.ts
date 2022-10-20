import { RouteRecordRaw } from 'vue-router'

export const other: RouteRecordRaw[] = [
  {
    path: '/other',
    meta: { title: '其他杂项', type: 'multiple' },
    component: () => import('@/page/other/latitude-longitude.vue'),
    children: [
      {
        path: '/other/lat-long',
        meta: { title: '经纬度' },
        component: () => import('@/page/other/latitude-longitude.vue'),
      },
      {
        path: '/other/vibrate',
        meta: { title: '震动（暂只支持安卓）' },
        component: () => import('@/page/other/vibrate.vue'),
      },
      {
        path: '/other/cshi',
        meta: { title: 'CHSI在线证明(不可乱用)' },
        component: () => import('@/page/other/chsi/index-temp.vue'),
        // 自己删掉上面的，用这个↓
        // component: () => import('@/page/other/chsi/index.vue'),
      },
    ],
  },
]
