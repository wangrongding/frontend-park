<script setup lang="ts">
const state = reactive({
  height: 0,
})
onMounted(() => {
  // state.height = document.body.clientHeight
  state.height = document.querySelector('.fish-container')!.clientHeight
})
</script>

<template>
  <div class="fish-container">
    <iframe
      id="fishWin"
      src="https://wangrongding.github.io/jellyfish/"
      :height="state.height"
      frameborder="0"
      scrolling="no"
      sandbox="allow-same-origin allow-scripts allow-top-navigation allow-forms"
      width="100%"
    ></iframe>
    <div class="describe">
      <div class="content">
        <p>哈喽 ~ 我是荣顶🦄</p>
        <p>
          我将在这个仓库中，分享平时做的一些好玩的前端项目😉如果你也非常热爱前端相关技术！
        </p>
        <p>欢迎加入我的前端交流群🦄 →</p>
      </div>
      <img src="../../assets/qr.jpg" alt="" style="width: 200px" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.fish-container {
  background-color: #91a8d0;
  height: 100%;
  position: relative;
  overflow: hidden;

  .describe {
    overflow: hidden;
    position: absolute;
    right: 50px;
    bottom: 50px;
    width: 600px;
    height: 200px;
    pointer-events: none;
    color: white;
    padding-left: 40px;
    box-sizing: border-box;
    border-radius: 40px;
    font-size: 14px;
    background: rgb(179 179 179 / 40%);
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
}
</style>
