<template>
  <div class="error-page" @click="back">
    <div class="title">无法找到页面</div>
    <div class="status">404</div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
function back() {
  router.go(-1)
}
</script>
<style lang="scss" scoped>
.error-page {
  text-align: center;

  .status {
    font-size: 100px;
  }
}
</style>
