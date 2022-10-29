<script setup lang="ts">
// 生成随机数
const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const list = [...Array(100)].map(() => random(1, 10))
</script>
<template>
  <div class="css-temp">
    <div v-for="item in list" :key="item" class="item" :attr="`${item}`">
      {{ item }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
.css-temp {
  display: grid;
  place-content: center;
  grid-template-columns: repeat(10, 40px);
  grid-template-rows: repeat(10, 40px);
  flex-wrap: wrap;
  gap: 20px;
  padding: 50px;
  width: 800px;
  margin: auto;
}

// 100 个元素，每个元素都有一个属性 attr，值为 1-10 的随机数
.item {
  background: #eba3a3;
  text-align: center;
  line-height: 40px;
}

// 实现选择器： hover元素，当 attr 属性值为 x 时，背景变色
// 方式一 scss 的 for 循环
@for $i from 1 through 10 {
  :has([attr='#{$i}']:hover) [attr='#{$i}'] {
    background: blue;
  }
}

// 方式二，使用 js 动态生成

// 方式三，使用 css 的 属性选择器，一个一个写？？
:has([attr='1']:hover) [attr='1'] {
  background: blue;
}

:has([attr='2']:hover) [attr='2'] {
  background: blue;
}

// ...
// 问： 以上方式都会生成 很多个套选择器，有一套选择器能实现的方式吗？
</style>
