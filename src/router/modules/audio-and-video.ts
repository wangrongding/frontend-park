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
