<template>
    <div class="page-container" v-loading="loading">
        <div class="container">
            <p>运行该项目示例可能需要科学上网(由于使用的是mobileNet模型,资源在外网)</p>
            <img id="img" :src="imageUrl" alt="" />
        </div>
        <div class="side-bar">
            <el-input
                style="width: 95%; margin: 10px"
                placeholder="请输入图片地址"
                v-model="imageUrl"
                class="input-with-select"
            >
                <el-button slot="append">确定</el-button>
            </el-input>
            <el-button
                style="width: 95%; margin: 10px"
                type="primary"
                size="default"
                @click="selectFile"
                >选取文件</el-button
            >
            <el-button
                style="width: 95%; margin: 10px"
                type="success"
                size="default"
                @click="identify"
                >识别</el-button
            >
            <p v-for="(item, index) in infoList" :key="index" class="discern-content">
                图中为:
                <span>{{ item.className }}</span>
                ,概率:
                <span :style="`color:${item.probability > 0.5 ? 'green' : 'red'}`">{{
                    item.probability
                }}</span>
            </p>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import * as tf from "@tensorflow/tfjs-core";
import * as mobilenet from "@tensorflow-models/mobilenet";
//👇解决识别后No backend found in registry.的问题
import "@tensorflow/tfjs-backend-webgl";
import { inputFile } from "@/utils/inputFile";
export default {
    components: {},
    props: {},
    data() {
        return { loading: false, infoList: [], imageUrl: require("../../assets/cat.jpg") };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
        console.log(tf);
        console.log(mobilenet);
    },
    methods: {
        async identify() {
            this.loading = true;
            const img = document.getElementById("img");
            // Load the model.
            const model = await mobilenet.load(/* { version: "1.0" } */);
            // Classify the image.
            this.infoList = await model.classify(img);
            this.loading = false;
            console.log("infoList: ");
            console.log(this.infoList);
        },
        async selectFile() {
            let file = await inputFile();
            console.log(file, "======");
            this.imageUrl = file[0];
        },
    },
};
</script>

<style scoped lang="scss">
.page-container {
    display: flex;
    width: 100%;
    flex-direction: row;
    height: 100%;
    .container {
        flex: 1;
    }
    .side-bar {
        background: #91a8d0;
        width: 300px;
        text-align: center;
        padding: 20px;
        .discern-content {
            text-align: left;
            font-weight: bolder;
        }
    }
}
</style>
