import { RouteRecordRaw } from 'vue-router'

export const tensorflow: RouteRecordRaw[] = [
  {
    path: '/tensorflow',
    meta: { title: 'tensorflow.js', type: 'multiple' },
    children: [
      {
        path: '/tensorflow/pose-detection',
        meta: { title: '姿态检测' },
        component: () => import('@/page/tensorflow/pose-detection.vue'),
      },
    ],
  },
]
