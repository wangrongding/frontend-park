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
            <el-menu-item index="4">
                <a href="https://fedtop.com" target="_blank">我的博客</a>
            </el-menu-item>
        </el-menu>
        <div class="content">
            <transition name="fade" mode="out-in">
                <router-view v-if="isRouterAlive" />
            </transition>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    props: {},
    data() {
        return { activeIndex: "1", isRouterAlive: true };
    },
    computed: {},
    watch: {},
    created() {},
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
