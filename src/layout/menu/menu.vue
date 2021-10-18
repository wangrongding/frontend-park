<template>
    <el-menu
        background-color="#516FA3"
        text-color="#fff"
        active-text-color="#ffd04b"
        unique-opened
        mode="horizontal"
        :router="true"
    >
        <MenuItem :menuList="this.menuList"></MenuItem>
        <el-menu-item>
            <a href="https://fedtop.com" target="_blank">我的博客</a>
        </el-menu-item>
        <el-menu-item>
            <a href="https://github.com/wangrongding" target="_blank">GitHub</a>
        </el-menu-item>
    </el-menu>
</template>

<script>
import MenuItem from "./menu-item.vue"; //引进菜单模板
export default {
    data() {
        return {
            isCollapse: false, //菜单展开功能
            menuList: this.$router.options.routes, //菜单数据
        };
    },
    methods: {
        toggleClick() {
            //菜单展开功能
            this.isCollapse = !this.isCollapse;
        },
    },
    components: {
        MenuItem, //使用菜单组件
    },
};
</script>

<style scoped lang="scss"></style>
