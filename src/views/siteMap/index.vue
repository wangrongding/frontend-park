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
                        <p>{{ item.des }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as multiavatar from "@multiavatar/multiavatar/dist/esm/index";
import { sites } from "./siteList.js";
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
        // width: 100%;
        margin: 20px;
        border: 1px solid #727171;
        padding: 20px;
        .title {
            font-size: 20px;
            font-weight: 900;
            // margin: 20px;
        }
        .list {
            display: grid;
            // grid-template-columns: repeat(5, 250px);
            // grid-template-rows: repeat(5, 250px);
            grid-template-columns: repeat(auto-fill, 320px);
            // grid-gap: 20px;
            justify-content: space-around;
            // padding: 20px;
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
                &:hover {
                    background: #91a8d0;
                }
                .item-image {
                    width: 60px;
                    height: 60px;
                    border: 1px solid #333;
                    border-radius: 50%;
                    // object-fit: cover;
                    object-fit: contain;
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
                        color: #727171;
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
