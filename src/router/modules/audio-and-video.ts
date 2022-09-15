import { RouteRecordRaw } from 'vue-router'

export const audioAndVideo: RouteRecordRaw[] = [
  {
    path: '/audio-and-video',
    meta: { title: '音视频', type: 'multiple' },
    children: [
      // {
      //   path: '/audio-and-video/toneJs',
      //   meta: { title: '电子音乐' },
      //   component: () => import('@/page/tone/tone.vue'),
      // },
      {
        path: '/audio-and-video/webRTC',
        meta: { title: 'webRTC(开发中)', type: 'multiple' },
        children: [
          {
            path: '/audio-and-video/webRTC/take-photos',
            meta: { title: '拍照' },
            component: () => import('@/page/webRTC/take-photos.vue'),
          },
          {
            path: '/audio-and-video/webRTC/p2p',
            meta: { title: 'p2p（不通过信令）' },
            component: () => import('@/page/webRTC/p2p.vue'),
          },
          {
            path: '/audio-and-video/webRTC/signaling-p2p',
            meta: { title: '信令p2p' },
            component: () => import('@/page/webRTC/signaling-p2p.vue'),
          },
          {
            path: '/audio-and-video/webRTC/select-devices',
            meta: { title: '选择设备' },
            component: () => import('@/page/webRTC/select-devices.vue'),
          },
          {
            path: '/audio-and-video/webRTC/index',
            meta: { title: '测试页' },
            component: () => import('@/page/webRTC/index.vue'),
          },
        ],
      },
    ],
  },
]
