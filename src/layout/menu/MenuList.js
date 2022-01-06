/* eslint-disable */
import Vue from "vue";
function loopDom(createElement, routers, path) {
    return routers.map((route) => {
        if (route.custom) {
            return createElement("el-menu-item", [
                createElement("a", {
                    domProps: { href: route.path, target: "_blank", innerHTML: route.name },
                    style: {
                        height: "60px",
                        display: "block",
                    },
                }),
            ]);
        }
        const relativePath = path ? `${path}/${route.path}` : route.path;
        // console.log("relativePath: ", relativePath, "path: ", path, " route.path: ", route.path);
        if (route.children && route.children.length > 1) {
            return createElement(
                "el-submenu",
                {
                    props: {
                        index: route.name,
                    },
                    key: route.path,
                    style: {
                        display: route.status == 0 && "none",
                    },
                },
                [
                    createElement(
                        "template",
                        {
                            slot: "title",
                        },
                        [
                            createElement("i", {
                                class: route.icon,
                            }),
                            createElement("span", {
                                domProps: {
                                    innerHTML: route.name,
                                },
                            }),
                        ]
                    ),
                    loopDom(createElement, route.children, relativePath),
                ]
            );
        } else {
            return createElement(
                "el-menu-item",
                {
                    props: {
                        index: path
                            ? path + "/" + route.path
                            : route.path + (route.path == "/" ? "index" : "/index"),
                    },
                    attrs: {
                        path: path ? path + "/" + route.path : route.path,
                    },
                    style: {
                        display: route.status == 0 && "none",
                    },
                },
                [
                    createElement("i", {
                        class: route.icon,
                    }),
                    createElement("span", {
                        slot: "title",
                        domProps: {
                            innerHTML: route.name,
                        },
                    }),
                ]
            );
        }
    });
}

const menuList = Vue.component("menuList", {
    render(h) {
        return h(
            "el-menu",
            {
                // class: "menu-part",
                props: {
                    "background-color": "#516FA3",
                    "text-color": "#fff",
                    "active-text-color": "#ffd04b",
                    "unique-opened": true,
                    mode: "horizontal",
                    "menu-trigger": "hover",
                    router: true,
                    "default-active": this.activeRoute,
                },
                style: {
                    userSelect: "none",
                },
                on: {
                    select: this.menuClick,
                },
            },
            loopDom(h, this.routers)
        );
    },
    props: {
        routers: {
            type: Array,
            default: () => [],
        },
        isCollapse: {
            type: Boolean,
            default: true,
        },
        activeRoute: {
            type: String,
            default: "",
        },
    },
    created() {
        // console.log("activeRoute22222", this.activeRoute);
    },
    methods: {
        menuClick(index, indexPath, c) {
            // console.log(index, indexPath, c);
        },
    },
});

export default menuList;
