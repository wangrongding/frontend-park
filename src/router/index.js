/* eslint-disable */
import Vue from "vue";
import VueRouter from "vue-router";
import layout from "@/layout/layout.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        component: layout,
        name: "首页",
        redirect: "/index",
        children: [
            {
                path: "index",
                component: () => import("@/views/home.vue"),
            },
        ],
    },
    {
        path: "/steganography",
        name: "隐写术",
        component: layout,
        children: [
            {
                path: "text",
                name: "文字隐写",
                component: () => import("@/views/steganography/text-steganography.vue"),
            },
            {
                path: "enImg",
                name: "图片隐写",
                component: () => import("@/views/steganography/img-steganography.vue"),
            },
            {
                path: "deImg",
                name: "图片解密",
                component: () => import("@/views/steganography/img-decryption.vue"),
            },
        ],
    },
    /*  {
        path: "/image",
        name: "图像处理",
        component: layout,
        children: [
            {
                path: "pixel-image",
                name: "千图成像",
                component: () => import("@/views/pixel-image.vue"),
            },
        ],
    }, */
    {
        path: "/pixel-image",
        redirect: "/pixel-image/index",
        name: "千图成像",
        component: layout,
        children: [
            {
                path: "index",
                component: () => import("@/views/image-processing/pixel-image.vue"),
            },
        ],
    },
    {
        path: "/machine-learning",
        redirect: "/machine-learning/index",
        name: "机器学习",
        component: layout,
        children: [
            {
                path: "index",
                component: () => import("@/views/machineLearning/tf.vue"),
            },
        ],
    },
    {
        path: "/tone",
        redirect: "/tone/index",
        name: "电子音乐",
        component: layout,
        children: [
            {
                path: "index",
                component: () => import("@/views/tone/tone.vue"),
            },
        ],
    },
    {
        path: "/three",
        // redirect: "/tone/index",
        name: "ThreeJs",
        component: layout,
        children: [
            {
                path: "scene",
                name: "场景",
                component: () => import("@/views/three/scene.vue"),
            },
            {
                path: "mesh",
                name: "物体对象",
                component: () => import("@/views/three/mesh.vue"),
            },
            {
                path: "light",
                name: "光源",
                component: () => import("@/views/three/light.vue"),
            },
            {
                path: "animate",
                name: "动画",
                component: () => import("@/views/three/animate.vue"),
            },
        ],
    },
    {
        path: "/siteMap",
        redirect: "/siteMap/index",
        name: "超人导航",
        component: layout,
        children: [
            {
                path: "index",
                component: () => import("@/views/siteMap/index.vue"),
            },
        ],
    },
    {
        path: "/test",
        redirect: "/test/index",
        name: "测试",
        component: layout,
        children: [
            {
                path: "index",
                component: () => import("@/views/other/test.vue"),
            },
        ],
    },
    {
        custom: true,
        path: "https://fedtop.com",
        name: "我的博客",
    },
    {
        custom: true,
        path: "https://github.com/wangrongding",
        name: "GitHub",
    },
];

const router = new VueRouter({
    // mode: "history",
    base: process.env.BASE_URL,
    routes,
});

export default router;
