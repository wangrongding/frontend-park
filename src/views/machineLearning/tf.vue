<template>
    <div class="page-container" v-loading="loading">
        <img id="img" src="../../assets/cat.jpg" alt="" />
        <el-button type="primary" size="default" @click="identify">识别</el-button>
        <p v-for="(item, index) in infoList" :key="index">
            图中为: {{ item.className }},概率:{{ item.probability }}
        </p>
    </div>
</template>

<script>
/* eslint-disable */
import * as tf from "@tensorflow/tfjs-core";
import * as mobilenet from "@tensorflow-models/mobilenet";
//👇解决识别后No backend found in registry.的问题
import "@tensorflow/tfjs-backend-webgl";
export default {
    components: {},
    props: {},
    data() {
        return { loading: false, infoList: [] };
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
    },
};
</script>

<style scoped lang="scss">
.page-container {
}
</style>
