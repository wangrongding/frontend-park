<template>
    <div class="page-container">
        <el-menu
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
        </el-menu>
        <div class="content">
            <!-- <div class="content" :style="`background: ${contentBackground};`"> -->
            <transition name="fade" mode="out-in">
                <router-view v-if="isRouterAlive" />
            </transition>
        </div>
    </div>
</template>

<script>
import { color } from "@/utils/china-color.js";
export default {
    components: {},
    props: {},
    data() {
        return { activeIndex: "1", isRouterAlive: true, color };
    },
    computed: {
        contentBackground() {
            return "#41ae3c";
        },
    },
    watch: {},
    created() {
        console.log(color);
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
        height: calc(100vh - 62px);
        overflow: hidden;
    }
}
</style>
