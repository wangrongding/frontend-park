<template>
  <div class="error-page" @click="goHome">
    <div class="title">无法找到页面</div>
    <div class="status">404</div>
    <el-button type="primary" size="default" @click="goHome">
      回到首页
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
function goHome() {
  // router.go(-1)
  router.replace('/')
}
</script>
<style lang="scss" scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;

  .status {
    font-size: 100px;
  }
}
</style>