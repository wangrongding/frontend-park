<template>
    <div class="page-container">
        <MenuList
            :routers="$router.options.routes"
            :is-collapse="isCollapse"
            :active-route="activeRoute"
        />
        <!-- <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            background-color="#516FA3"
            text-color="#fff"
            active-text-color="#ffd04b"
            :router="true"
        >
            <template v-for="route in $router.options.routes">
                <el-menu-item
                    v-if="route.children.length == 1"
                    :index="route.path"
                    :key="route.path"
                >
                    <span slot="title" class="title">{{ route.name }}</span>
                </el-menu-item>
            </template>
            <el-menu-item>
                <a href="https://fedtop.com" target="_blank">我的博客</a>
            </el-menu-item>
            <el-menu-item>
                <a href="https://github.com/wangrongding" target="_blank">GitHub</a>
            </el-menu-item>
        </el-menu> -->
        <div class="content">
            <!-- <div class="content" :style="`background: ${contentBackground};`"> -->
            <transition name="fade" mode="out-in">
                <router-view v-if="isRouterAlive" />
            </transition>
        </div>
    </div>
</template>

<script>
import MenuList from "./menu/MenuList.js";
// import Menu from "./menu/menu.vue";
// import { color } from "@/utils/china-color.js";
export default {
    components: { MenuList },
    props: {},
    data() {
        return {
            activeIndex: "1",
            isRouterAlive: true /* color */,
            activeRoute: "",
            isCollapse: true,
        };
    },
    computed: {
        contentBackground() {
            return "#41ae3c";
        },
    },
    watch: {
        $route: {
            handler(route) {
                this.activeRoute = route.path;
                console.log("activeRoute", this.activeRoute);
            },
            immediate: true,
        },
    },
    created() {
        // console.log(color);
    },
    mounted() {},
    provide() {
        return {
            contentReload: this.reload,
        };
    },
    methods: {
        reload() {
            this.isRouterAlive = false;
            this.$nextTick(function () {
                this.isRouterAlive = true;
            });
        },
    },
};
</script>

<style scoped lang="scss">
.page-container {
    .content {
        height: calc(100vh - 60px);
        overflow-y: auto;
    }
}
.el-menu.el-menu--horizontal {
    border: none;
}
.el-menu{
    display: flex;
    width:100vw;
    height:60px;
    overflow-x: auto;
    overflow-y:hidden;
    box-sizing: border-box;
}
</style>
