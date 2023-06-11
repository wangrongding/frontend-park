import { RouteRecordRaw } from 'vue-router'

export const tensorflow: RouteRecordRaw[] = [
  {
    path: '/tensorflow',
    meta: { title: 'tensorflow.js', type: 'multiple' },
    children: [
      {
        path: '/tensorflow/pose-detection',
        meta: { title: '姿态检测' },
        component: () => import('@/page/tensorflow/pose/pose-detection.vue'),
      },
      {
        path: '/tensorflow/eye-tracker-image',
        meta: { title: '眼动识别-image' },
        component: () => import('@/page/tensorflow/vision/eye-tracker-image.vue'),
      },
      {
        path: '/tensorflow/eye-tracker-video',
        meta: { title: '眼动识别-video' },
        component: () => import('@/page/tensorflow/vision/eye-tracker-video.vue'),
      },
    ],
  },
]
