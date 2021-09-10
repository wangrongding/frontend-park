<template>
    <div class="page-container">
        <iframe
            src="https://wangrongding.github.io/jellyfish/"
            :height="windowInnerHeight"
            frameborder="0"
            sandbox="allow-same-origin allow-scripts allow-top-navigation allow-forms"
            width="100%"
        ></iframe>
        <div class="describe">
            <div class="content">
                <p>哈喽 ~ 我是荣顶🦄这里是我做的一些好玩的前端例子😉</p>
                <p>如果你也非常热爱前端相关技术！欢迎加入我的小密圈~</p>
                <p style="text-align: right">🦄 扫描这里，拉你进群一起探索好玩的前端技术🦄 → |</p>
            </div>
            <img src="../assets/qr.jpg" alt="" style="width: 200px" />
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    props: {},
    data() {
        return { windowInnerHeight: 500 };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
        this.windowInnerHeight = window.innerHeight;
    },
    methods: {},
};
</script>

<style scoped lang="scss">
.page-container {
    // text-align: center;
    background-color: #91a8d0;
    height: 100%;
    // padding: 300px;
    position: relative;
    .describe {
        position: absolute;
        // top: calc(50% - 150px);
        // left: calc(50% - 400px);
        right: 50px;
        bottom: 50px;
        width: 800px;
        height: 300px;
        pointer-events: none;
        color: white;
        padding: 50px;
        box-sizing: border-box;
        border-radius: 100px;
        font-size: 20px;
        background: rgba(179, 179, 179, 0.4);
        display: flex;
        align-items: center;
        justify-content: space-around;
        .content {
            p {
                margin: 35px 0;
            }
        }
    }
}
</style>
