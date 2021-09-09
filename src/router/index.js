/* eslint-disable */
import Vue from "vue";
import VueRouter from "vue-router";
import layout from "../views/layout.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        component: layout,
        redirect: "/text",
        name: "文字隐写",
        children: [
            {
                path: "text",
                component: () => import("../views/text-steganography.vue"),
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
                component: () => import("../views/img-steganography.vue"),
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
                component: () => import("../views/img-steganography.vue"),
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
                component: () => import("../views/pixel-image.vue"),
            },
        ],
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

export default router;
