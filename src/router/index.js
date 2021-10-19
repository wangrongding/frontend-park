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
                component: () => import("@/views/text-steganography.vue"),
            },
            {
                path: "enImg",
                name: "图片隐写",
                component: () => import("@/views/img-steganography.vue"),
            },
            {
                path: "deImg",
                name: "图片解密",
                component: () => import("@/views/img-decryption.vue"),
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
                component: () => import("@/views/pixel-image.vue"),
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
                component: () => import("@/views/test.vue"),
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
