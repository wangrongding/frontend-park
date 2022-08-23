<script setup lang="ts">
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

interface IProps {
  /** svg 的图标的名称 */
  iconName: string
  color: string
}
// const symbolId = computed(() => `#${props.prefix}-${props.name}`)
const props = defineProps<IProps>()
const symbolId = computed(() => `#icon-${props.iconName}`)

const elIconList = Object.keys(ElementPlusIconsVue)
const isElIcon = computed(() => {
  // return props.iconName.startsWith('el-')
  return elIconList.includes(props.iconName)
})
</script>

<template>
  <el-icon v-if="isElIcon" :color="color" :size="20">
    <component :is="iconName.replace('el-', '')"></component>
  </el-icon>
  <div v-else style="tab-size: 4px; margin-right: 5px" class="svg-icon">
    <svg aria-hidden="true" :style="{ margin: '2px', width: '20px' }">
      <use :href="symbolId" />
    </svg>
  </div>
</template>

<style>
.svg-icon {
  /* 将icon大小设置和字体大小一致，后续在通过svg-icon 使用icon的时候，可直接设置图标的font-size即可控制图标大小 */
  margin-right: 5px;
  display: inline-block;

  /* 定义元素的颜色，currentColor是一个变量，这个变量的值就表示当前元素的color值，如果当前元素未设置color值，则从父元素继承 */
  fill: currentcolor;
  overflow: hidden;
  vertical-align: middle;

  /* 因icon大小被设置为和字体大小一致，而span等标签的下边缘会和字体的基线对齐，故需设置一个往下的偏移比例，来纠正视觉上的未对齐效果 */

  /* vertical-align: -0.15em; */
}
</style>
