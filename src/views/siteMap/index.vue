<template>
    <div class="page-container">
        <div class="group">
            <p class="title">title</p>
            <div class="list">
                <div class="item" v-for="(item, index) in [1, 2, 3, 4, 5, 6]" :key="index">
                    <img
                        class="item-image"
                        src="https://cdn.docschina.org/home/logo/react.svg"
                        alt=""
                    />
                    <div>
                        <p>name</p>
                        <p>des</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    props: {},
    data() {
        return {};
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {},
    methods: {},
};
</script>

<style scoped lang="scss">
.page-container {
    .group {
        width: 100%;
        .list {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
        }
        .item {
            width: 250px;
        }
    }
}
</style>
