<script setup lang="ts">
// @ts-ignore
import Menu from '@/layout/Menu.tsx'

onMounted(() => {
  // 禁止右键菜单
  // document.oncontextmenu = () => false
  // // oncopy事件禁用复制;
  // document.oncopy = () => false
  // // oncut事件禁用剪切
  // document.oncut = () => false
  // // onselectstart事件禁用网页上选取的内容
  // document.onselectstart = () => false
})
</script>
<template>
  <div class="page-container">
    <Menu />
    <div id="content" class="content">
      <router-view />
      <!-- <router-view><router-view /></router-view> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-container {
  // user-select: none;
  // display: flex;
  // flex-direction: column;
  height: 100vh;

  .content {
    position: relative;
    background: #e8f1ff;
    overflow-y: auto;

    // flex: 1;
  }
}
</style>
