<script>
`<template>
    <div>
        <template v-for="list in this.menuList">

            <el-submenu v-if="list.children.length > 1" :key="list.resourceId" :index="list.name">

                <template slot="title" style="padding-left: 10px">
                    <i class="el-icon-menu"></i>
                    <span slot="title">{{ list.name }}</span>
                </template>

                <MenuItem :menuList="list.children"></MenuItem>
                
            </el-submenu>


            <el-menu-item v-else :index="list.path" :key="list.resourceId">
                <span>{{ list.name }}</span>
            </el-menu-item>
        </template>
    </div>
</template>`;
export default {
    name: "Menu", //模板名称
    data() {
        return {};
    },
    render: function (createElement) {
        return this.menuList.map((item) => {
            return createElement("template", item.name);
        });

        /*  if (this.menuList.length) {
            return createElement(
                "ul",
                this.menuList.map(function (item) {
                    return createElement("li", item.name);
                })
            );
        } else {
            return createElement("p", "No items found.");
        } */
    },
    props: ["menuList"],
    created() {
        console.log("menuList", this.menuList);
    },
};
</script>
