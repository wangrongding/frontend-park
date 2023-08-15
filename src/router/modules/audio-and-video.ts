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
        meta: { title: 'WebRTC', type: 'multiple' },
        children: [
          {
            path: '/audio-and-video/webRTC/take-photos',
            meta: { title: '拍照' },
            component: () => import('@/page/webRTC/take-photos.vue'),
          },
          {
            path: '/audio-and-video/webRTC/record',
            meta: { title: '音视频，分享屏幕，录制' },
            component: () => import('@/page/webRTC/record.vue'),
          },
          {
            path: '/audio-and-video/webRTC/background-process',
            meta: { title: '视频背景替换' },
            component: () => import('@/page/webRTC/background-process.vue'),
          },
          {
            path: '/audio-and-video/webRTC/p2p',
            meta: { title: '音视频通话-不通过信令p2p' },
            component: () => import('@/page/webRTC/p2p.vue'),
          },
          {
            path: '/audio-and-video/webRTC/signaling-p2p',
            meta: { title: '音视频通话-信令p2p' },
            component: () => import('@/page/webRTC/signaling-p2p.vue'),
          },
          {
            path: '/audio-and-video/webRTC/file-transfer',
            meta: { title: 'P2P文件快传' },
            component: () => import('@/page/webRTC/file-transfer.vue'),
          },
        ],
      },
    ],
  },
]
