<script setup lang="ts">
// mode 1
if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
  document.body.innerHTML = '检测到非法调试,请关闭后刷新重试!'
}
setInterval(() => {
  // eslint-disable-next-line no-new-func
  Function('debugger')()
}, 50)

// mode 2
// function block() {
//   if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
//     document.body.innerHTML = '检测到非法调试,请关闭后刷新重试!'
//   }
//   setInterval(() => {
//     ;(function prohibitDebug() {
//       return false
//     }
//       .constructor('debugger')
//       .call())
//   }, 50)
// }
// block()
</script>
<template>
  <div class="grid place-content-center h-[300px]">
    <h1 class="text-center text-5xl">打开控制台调试本页面</h1>
    <div>
      增加调试成本，但对懂的人来说，实际并没有什么用。 可参考我之前的文章:
      <a class="text-blue-500" href="https://juejin.cn/post/7000784414858805256">如何防止他人恶意调试你的web程序</a>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
