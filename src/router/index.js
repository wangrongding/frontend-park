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
        redirect: "/home",
        children: [
            {
                path: "home",
                component: () => import("@/views/home.vue"),
            },
        ],
    },
    {
        path: "/text",
        component: layout,
        redirect: "/text/index",
        name: "文字隐写",
        children: [
            {
                path: "index",
                component: () => import("@/views/text-steganography.vue"),
            },
        ],
    },
    {
        path: "/enImg",
        redirect: "/enImg/index",
        component: layout,
        name: "图片隐写",
        children: [
            {
                path: "index",
                component: () => import("@/views/img-steganography.vue"),
            },
        ],
    },
    {
        path: "/deImg",
        redirect: "/deImg/index",
        name: "图片解密",
        component: layout,
        children: [
            {
                path: "index",
                component: () => import("@/views/img-decryption.vue"),
            },
        ],
    },

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
];

const router = new VueRouter({
    // mode: "history",
    base: process.env.BASE_URL,
    routes,
});

export default router;
