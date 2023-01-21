<script setup lang="ts">
let targetNode: HTMLElement

const childrenDom = `
<div class="childrenDom">
  <h1>尝试删改水印👇</h1>
  <div 
    class="watermark"
    style="
      line-height:100%;
      text-align:center;
      background-image: url(https://cdn.dancf.com/fe-assets/20220427/0febd2a022ea179d9f761eb04cdc2b00.svg) !important;
      background-size: auto 100% !important;
      position: absolute !important;
      left: 0px !important;
      top: 0px !important;
      right: 0px !important;
      bottom: 0px !important;
      width: 100% !important;
      height: 100% !important;
      opacity: 1 !important;
      visibility: visible !important;
      display: flex !important;
      transform: none !important;
  "></div>
</div>
`

const options = {
  attributes: true, // 监听属性变化
  childList: true, // 监听子节点变化
  subtree: true, // 监听子节点的子节点变化
  attributesOldValue: true, // 监听属性变化时，记录旧值
  characterData: true, // 监听文本节点变化
  characterDataOldValue: true, // 监听文本节点变化时，记录旧值
}
onMounted(() => {
  targetNode = document.querySelector('.test-dom') as HTMLElement
  targetNode.innerHTML = childrenDom
})

function reset(expression = () => {}) {
  setTimeout(() => {
    observer.disconnect()
    // 执行恢复方法
    expression()
    observer.observe(targetNode, options)
  }, 0)
}

const callback = (records: any) => {
  const record = records[0]
  // console.log('🚀🚀🚀 / record', record)
  if (record.type === 'attributes') {
    reset(() => {
      // targetNode.innerHTML = '别改我...'
      targetNode.innerHTML = childrenDom
    })
  } else if (record.type === 'childList') {
    reset(() => {
      targetNode.innerHTML = childrenDom
    })
  }
}
const observer = new MutationObserver(callback)
// 监听的改变
onMounted(() => {
  observer.observe(targetNode, options)
})
</script>
<template>
  <div class="grid content-center gap-10 h-full">
    <div class="text-center bg-orange-200">
      <p>删改下面的水印后，会重新恢复(但是用户通过 Event Listeners 删除对应的事件即可)</p>
      <p>思考🤔：稿定是怎么做到怎么都删不掉的</p>
    </div>
    <div class="test-dom grid place-content-center m-auto w-[500px] h-[500px] relative bg-[coral]">
      <h1 style="text-align: center">删改下面的水印👇</h1>
      <div class="watermark h-full w-full bg-red-700">我是水印，尝试移除我。</div>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
