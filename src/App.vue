<template>
    <div id="app">
        <router-view />
    </div>
</template>

<style lang="scss">
* {
    // user-select: none;
    margin: 0;
    padding: 0;
}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    // text-align: center;
    color: #2c3e50;
}
/* fade */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.28s;
}
.fade-enter,
.fade-leave-active {
    opacity: 0;
}
/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
    transition: all 0.5s;
}
.fade-transform-enter {
    opacity: 0;
    transform: translateX(-30px);
}
.fade-transform-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
// 滚动条整体宽度
::-webkit-scrollbar {
    width: 8px !important;
    height: 8px !important;
} // 滚动条滑槽样式
::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.3);
    border-radius: 8px;
} // 滚动条样式
::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background: #91a8d0;
    -webkit-box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.8);
}
::-webkit-scrollbar-thumb:hover {
    background: #7ca5ff !important;
}
::-webkit-scrollbar-thumb:active {
    background: #8db7ff !important;
} // 浏览器失焦的样式
::-webkit-scrollbar-thumb:window-inactive {
    background: #91a8d0 !important;
}
</style>
