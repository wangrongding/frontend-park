<script setup lang="ts">
import { reactive } from 'vue'

const props = defineProps<{ filePath: string }>()

const isDev = process.env.NODE_ENV === 'development'
const state = reactive({})
function open(type: string) {
  let url: string
  if (type === 'VsCode') {
    url = `vscode://file/${props.filePath}:0:0`
  } else if (type === 'WebStorm') {
    url = `phpstorm://open?file=${props.filePath}&line=0&column=0`
  } else {
    url = `https://github.com/wangrongding/frontend-park/blob/main/${`src${
      props.filePath.split('src').slice(-1)[0]
    }`}`
  }
  const win = window.open(url, '_blank')
}
</script>
<template>
  <div class="filepath-box-container">
    <el-popover placement="top-start" :width="510" trigger="click">
      <template #reference>
        <el-button type="primary" color="#e8f1aa" icon="FolderOpened">
          本页面的文件路径
        </el-button>
      </template>
      <div style="text-align: left">
        <p style="margin: 0 0 5px">
          开发环境可以快速在VsCode或WebStorm中打开文件
        </p>
        <el-input
          :model-value="`src${props.filePath.split('src').slice(-1)[0]}`"
        ></el-input>
        <el-button
          type="primary"
          icon="View"
          size="default"
          color="#000000"
          @click="open('GitHub')"
        >
          在GitHub中打开
        </el-button>
        <el-button
          type="primary"
          icon="View"
          color="#26b2f3"
          :disabled="!isDev"
          size="default"
          @click="open('VsCode')"
        >
          在VsCode中打开
        </el-button>
        <el-button
          type="primary"
          icon="View"
          color="#00cdd7"
          :disabled="!isDev"
          size="default"
          @click="open('WebStorm')"
        >
          在WebStorm中打开
        </el-button>
      </div>
    </el-popover>
  </div>
</template>
<style lang="scss" scoped>
.filepath-box-container {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.el-button {
  margin-top: 10px;
}
</style>
