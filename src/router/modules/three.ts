import { RouteRecordRaw } from 'vue-router'

export const three: RouteRecordRaw[] = [
  {
    path: '/three',
    meta: { title: 'threeJs', type: 'multiple' },
    children: [
      {
        path: '/three/scene',
        meta: { title: '场景' },
        component: () => import('@/page/three/scene.vue'),
      },
      {
        path: '/three/mesh',
        meta: { title: '物体对象' },
        component: () => import('@/page/three/mesh.vue'),
      },
      {
        path: '/three/light',
        meta: { title: '光源' },
        component: () => import('@/page/three/light.vue'),
      },
      {
        path: '/three/animate',
        meta: { title: '动画' },
        component: () => import('@/page/three/animate.vue'),
      },
      {
        path: '/three/dataGUI',
        meta: { title: 'dat.GUI' },
        component: () => import('@/page/three/dat.gui.vue'),
      },
      {
        path: '/three/Controls',
        meta: { title: 'Controls' },
        component: () => import('@/page/three/controls.vue'),
      },
      {
        path: '/three/planet',
        meta: { title: '星球' },
        component: () => import('@/page/three/planet.vue'),
      },
    ],
  },
]
