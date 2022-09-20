import { RouteRecordRaw } from 'vue-router'

export const imageProcessing: RouteRecordRaw[] = [
  {
    path: '/image-processing',
    meta: { title: '图像处理', type: 'multiple' },
    children: [
      {
        path: '/image-processing/pixel-image',
        meta: { title: '千图成像' },
        component: () => import('@/page/image-processing/pixel-image.vue'),
      },
      {
        path: '/image-processing/image-compression',
        meta: { title: '图片压缩' },
        component: () =>
          import('@/page/image-processing/image-compression.vue'),
      },
      {
        path: '/image-processing/edit-image',
        meta: { title: '图片编辑' },
        component: () => import('@/page/image-processing/edit-image.vue'),
      },
      {
        path: '/image-processing/drawBoard',
        meta: { title: '画板' },
        component: () => import('@/page/other/test.vue'),
      },
      {
        path: '/image-processing/boundaryRandom',
        meta: { title: '边界随机(不重叠)' },
        component: () => import('@/page/canvas/boundaryRandom.vue'),
      },
      {
        path: '/image-processing/random-elements',
        meta: { title: '随机生成图形' },
        component: () => import('@/page/canvas/random-elements.vue'),
      },
      {
        path: '/image-processing/base-tree',
        meta: { title: '树' },
        component: () => import('@/page/canvas/base-tree.vue'),
      },
    ],
  },
]
