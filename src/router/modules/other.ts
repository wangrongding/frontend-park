import { RouteRecordRaw } from 'vue-router'

export const other: RouteRecordRaw[] = [
  {
    path: '/other',
    meta: { title: '其他杂项', type: 'multiple' },
    component: () => import('@/page/other/latitude-longitude.vue'),
    children: [
      {
        path: '/other/communication-between-tabs',
        meta: { title: 'tab间通信' },
        component: () => import('@/page/other/communication-between-tabs.vue'),
      },
      {
        path: '/other/prohibit-debugging',
        meta: { title: '禁止调试' },
        component: () => import('@/page/other/prohibit-debugging.vue'),
      },
      {
        path: '/other/watermark',
        meta: { title: '水印' },
        component: () => import('@/page/other/watermark.vue'),
      },
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
        path: '/other/css-selector',
        meta: { title: 'css选择器训练' },
        component: () => import('@/page/other/css-selector.vue'),
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
