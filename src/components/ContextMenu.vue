<script setup lang="ts">
import { reactive } from 'vue'
import type { Menu } from '@/components/index.d'

const props = defineProps<{
  menuList: Menu[]
}>()

const contextMenu = ref(null)

defineExpose({
  contextMenu,
})

const state = reactive({})
</script>
<template>
  <div ref="contextMenu" class="context-menu-container">
    <el-row v-for="(item, index) in menuList" :key="index">
      <el-button link :type="item.type" @click="item.callback">
        {{ item.text }}
      </el-button>
    </el-row>
  </div>
</template>
<style lang="scss" scoped>
.context-menu-container {
}
</style>
