import { RouteRecordRaw } from 'vue-router'

export const steganography: RouteRecordRaw[] = [
  {
    path: '/steganography',
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
]
