<script setup lang="ts">
// import * as tf from '@tensorflow/tfjs-core'
import * as mobilenet from '@tensorflow-models/mobilenet'
// 👇解决识别后No backend found in registry.的问题
import '@tensorflow/tfjs-backend-webgl'

import testImg from '@/assets/test.jpg'

let loading = $ref(false)
let infoList: any = $ref([])

const identify = async () => {
  loading = true
  const testImg = document.getElementById('local') as HTMLImageElement
  // Load the model.
  const model = await mobilenet.load(/* { version: "1.0" } */)
  // Classify the image.
  const predictions = await model.classify(testImg)
  // eslint-disable-next-line no-console
  console.log('🚀🚀🚀 / predictions', predictions)
  infoList = predictions
  loading = false
}
</script>

<template>
  <div v-loading="loading" class="">
    <img id="img" src="./test1.png" width="400" height="400" alt="" />
    <el-button type="primary" size="default" @click="identify">识别</el-button>
    <p v-for="(item, index) in infoList" :key="index">图中为: {{ item.className }},概率:{{ item.probability }}</p>
  </div>
</template>

<style>
#img {
  width: 400px;
  height: 400px;
}
</style>
