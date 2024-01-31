<script setup lang="ts">
const bc = new BroadcastChannel('ding')
const local = ref<HTMLElement>()
const remote = ref<HTMLElement>()

bc.onmessage = (e) => {
  const { x: screenX, y: screenY } = e.data
  const left = screenX - remote.value!.offsetWidth - document.body.offsetLeft
  const top = screenY - remote.value!.offsetHeight
  remote.value!.style.left = `${left}px`
  remote.value!.style.top = `${top}px`
}

bc.onmessageerror = (e) => {
  console.warn('receive:', e.data)
}

// local 拖拽移动并发送坐标
const handleMouseDown = (event: MouseEvent) => {
  const { offsetX, offsetY } = event
  const handleMouseMove = (event: MouseEvent) => {
    const { clientX, clientY } = event
    const left = clientX - offsetX
    const top = clientY - offsetY
    local.value!.style.left = `${left}px`
    local.value!.style.top = `${top}px`
    bc.postMessage({ x: event.screenX, y: event.screenY })
  }
  const handleMouseUp = () => {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
}

onMounted(() => {})

// 销毁
onUnmounted(() => {
  bc.close()
})
</script>
<template>
  <div class="">
    <div ref="local" class="item local" @mousedown="handleMouseDown">local</div>
    <div ref="remote" class="item remote">remote</div>
  </div>
</template>
<style lang="scss" scoped>
.item {
  width: 300px;
  height: 300px;
  border: 1px solid #000;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
}

.local {
  background-color: #0f0;
  cursor: move;
  top: 400px;
  left: 400px;
}

.remote {
  background-color: #f00;
  top: -400px;
  left: -400px;
}
</style>
