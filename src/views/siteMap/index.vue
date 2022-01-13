<template>
    <div class="page-container">
        <div class="group" v-for="(item, index) in sites" :key="index">
            <p class="title">{{ item.name }}</p>
            <div class="list">
                <div
                    class="item"
                    @click="openPage(item.url)"
                    v-for="(item, index) in item.list"
                    :key="index"
                >
                    <!-- <img class="item-image" :src="createAvatar(item.name + index)" alt="" /> -->
                    <div
                        class="item-image"
                        ref="item-image"
                        v-html="createAvatar(item.name + index)"
                    ></div>
                    <div class="content">
                        <p>{{ item.name }}</p>
                        <p :title="item.des">{{ item.des }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as multiavatar from "@multiavatar/multiavatar/dist/esm/index";
import { sites } from "./index.js";
export default {
    components: {},
    props: {},
    data() {
        return { sites };
    },
    computed: {},
    watch: {},
    created() {
        console.log(this.sites);
    },
    mounted() {},
    methods: {
        openPage(url) {
            window.open(url, "_blank");
        },
        createAvatar(val) {
            return multiavatar.default(val);
        },
    },
};
</script>

<style scoped lang="scss">
.page-container {
    .group {
        margin: 20px;
        border: 1px solid #727171;
        padding: 20px;
        .title {
            font-size: 20px;
            font-weight: 900;
        }
        .list {
            display: grid;
            // grid-template-columns: repeat(5, 250px);
            // grid-template-rows: repeat(5, 250px);
            grid-template-columns: repeat(auto-fill, 320px);
            // grid-gap: 20px;//间隙
            justify-content: space-around;
            .item {
                cursor: pointer;
                width: 280px;
                height: 80px;
                display: flex;
                // margin: 20px;
                padding: 10px 20px;
                justify-content: flex-start;
                align-content: center;
                align-items: center; /*垂直居中*/
                flex-direction: row;
                transition: all 1s;
                background: white;
                @keyframes changeBg {
                    0% {
                        background: white;
                    }
                    100% {
                        background: #516fa3;
                        color: white;
                    }
                }
                &:hover {
                    // background: linear-gradient(to bottom, #516fa3, #91a8d0);
                    animation: changeBg 1s;
                    animation-fill-mode: forwards;
                    border-radius: 50px;
                    .item-image {
                        border: 2px dotted #dbe9ff;
                    }
                }
                .item-image {
                    width: 56px;
                    height: 56px;
                    border: 2px dashed #333;
                    border-radius: 50%;
                    // object-fit: cover;
                    object-fit: contain;
                    overflow: hidden;
                }

                .content {
                    // height: 60px;
                    margin-left: 10px;
                    & > p:first-child {
                        font-size: 17px;
                        font-weight: bolder;
                    }
                    & > p:last-child {
                        font-size: 12px;
                        width: 210px;
                        /* 
                        //单行省略
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                         */
                        //多行省略
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        /*设置省略号在容器第四行文本后*/
                        -webkit-line-clamp: 2;
                        overflow: hidden;
                    }
                }
            }
        }
    }
}
</style>
