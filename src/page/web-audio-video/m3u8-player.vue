<script setup lang="ts">
import TinyPlayer from 'tiny-player'

const videoSource = ref('https://assets.fedtop.com/picbed/index-v1-a1.m3u8')
const tp = ref<TinyPlayer>()

function initPlayer() {
  destroy()
  tp.value = new TinyPlayer({
    container: document.querySelector('#tiny-player')!, // 挂载节点
    loop: true, // 循环播放
    volume: 0.9, // 音量
    playbackRate: 1, // 播放速率
    autoplay: true, // 自动播放
    controlOptions: {
      playTime: true, // 是否显示播放时间
      volumeControl: true, // 是否显示音量控制条
      fullScreenControl: true, // 是否显示全屏按钮
      nativeControls: false, // 是否使用原生控制条
    },
    preload: 'metadata', // 预加载
    src: videoSource.value, // 视频地址
    type: 'hls', // 视频类型
    width: '900px', // 自定义宽度
  })
}

function destroy() {
  if (tp.value) tp.value.destroy()
}
</script>
<template>
  <div class="flex items-center justify-center flex-col gap-10 mt-10">
    <div class="w-[900px] flex">
      <el-input v-model="videoSource" placeholder="Please input"></el-input>
      <el-button @click="initPlayer">播放</el-button>
    </div>
    <p class="bg-emerald-300">播放 m3u8 文件, 可以填入你要播放的 m3u8 地址</p>
    <div id="tiny-player" class="border-2 border-teal-200 w-[900px] text-center">请点击播放</div>
  </div>
</template>
<style lang="scss" scoped>
.test {
  color: red;
}
</style>
