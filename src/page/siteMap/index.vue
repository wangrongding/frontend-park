<script setup lang="ts">
import multiavatar from '@multiavatar/multiavatar/esm'
import sites from './index'

function openPage(url: string) {
  window.open(url, '_blank')
}
function createAvatar(val: any) {
  return multiavatar(val + new Date().getTime())
}
</script>
<template>
  <div v-for="(item, index) in sites" :key="index" class="group">
    <p class="title">{{ item.name }}</p>
    <div class="list">
      <div
        v-for="(child, ind) in item.list"
        :key="ind"
        class="item"
        @click="openPage(child.url)"
      >
        <!-- <img class="item-image" :src="createAvatar(item.name + ind)" alt="" /> -->
        <div
          ref="item-image"
          class="item-image"
          v-html="createAvatar(item.name + ind)"
        ></div>
        <div class="content">
          <p>{{ child.name }}</p>
          <p :title="child.des">{{ child.des }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.group {
  margin: 20px;
  border: 1px solid #727171;
  padding: 20px;

  .title {
    font-size: 20px;
    font-weight: 900;
  }

  .list {
    display: grid;
    grid-template-columns: repeat(auto-fill, 320px);
    justify-content: space-around;

    .item {
      cursor: pointer;
      width: 280px;
      height: 80px;
      display: flex;
      padding: 10px 20px;
      justify-content: flex-start;
      align-content: center;
      align-items: center; /* 垂直居中 */
      flex-direction: row;
      transition: all 1s;
      @keyframes change-bg {
        0% {
          background: #e8f1ff;
        }

        100% {
          background: #516fa3;
          color: white;
        }
      }

      .item-image {
        width: 56px;
        height: 56px;
        border: 2px dashed #333;
        border-radius: 50%;

        // object-fit: cover;
        object-fit: contain;
        overflow: hidden;
      }

      &:hover {
        animation: change-bg 1s;
        animation-fill-mode: forwards;
        border-radius: 50px;

        .item-image {
          border: 2px dotted #dbe9ff;
        }
      }

      .content {
        // height: 60px;
        margin-left: 10px;

        & > p:first-child {
          font-size: 17px;
          font-weight: bolder;
        }

        & > p:last-child {
          font-size: 12px;
          width: 210px;

          // 单行省略
          // overflow: hidden;
          // text-overflow: ellipsis;
          // white-space: nowrap;

          // 多行省略
          display: box;
          -webkit-box-orient: vertical;

          /* 设置省略号在容器第四行文本后 */
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
