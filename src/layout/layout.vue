<script setup lang="ts">
// @ts-ignore
import Menu from '@/layout/Menu.tsx'

const route = useRoute()
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
    <el-container>
      <el-header><Menu /></el-header>
      <el-main>
        <div id="content" class="content">
          <router-view :key="route.path" />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped lang="scss">
.page-container {
  user-select: none;
  display: flex;
  flex-direction: column;

  // height: 100vh;

  .el-header {
    padding: 0;
  }

  .el-main {
    flex: 1;
    padding: 0;

    .content {
      overflow: auto;
      height: calc(100vh - 60px);
      width: 100%;
      position: relative;
      background: #e8f1ff;
    }
  }
}
</style>
