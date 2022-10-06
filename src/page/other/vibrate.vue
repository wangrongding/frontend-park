<script setup lang="ts">
// 关于振动 API 的不幸现实是，这仅适用于 Android 手机，因为 Apple 不支持它。这是关于该主题的Stack Overflow 评论：https://stackoverflow.com/questions/56926591/navigator-vibrate-break-the-code-on-ios-browsers
let canVibrate = false
if ('vibrate' in navigator) canVibrate = true

function vibrate() {
  if (!canVibrate) return
  // navigator.vibrate(1000)
  // 振动 1000 毫秒，停止 500 毫秒，然后再次振动 1000 毫秒
  navigator.vibrate([1000, 500, 1000])
}
</script>
<template>
  这仅适用于 Android 手机，Apple 不支持它。
  <el-button
    style="margin: 200px auto"
    type="primary"
    size="default"
    @click="vibrate"
  >
    点击震动
  </el-button>
</template>
<style lang="scss" scoped></style>
