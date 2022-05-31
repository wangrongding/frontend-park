<script setup lang="ts">
import { reactive } from 'vue'

const state = reactive({
  text: '', // 明文
  hiddenText: '', // 隐写的隐藏文本
  cipherText: '', // 隐写后的密文
  tempText: '', // 临时的复制文本框
  decodeText: '', // 解密后的文本
})

function reset() {}

// 字符串转零宽字符串
function encodeStr() {
  let tempStrArr = []
  tempStrArr = state.text.split('')
  tempStrArr.splice(
    1,
    0,
    // 加密的文本
    state.hiddenText
      .split('')
      // ['荣', '顶' ]
      .map((char) => char.codePointAt(0)!.toString(2))
      // ['1000001101100011','1001100001110110']
      .join(' ')
      // "1000001101100011 1001100001110110"
      .split('')
      /* [ '1', ''1', '1',  '0', '0', '0','1', '0', '1',  '1', '0'] */
      .map((binaryNum) => {
        if (binaryNum === '1') {
          return String.fromCharCode(8203) // 零宽空格符&#8203;
        }
        if (binaryNum === '0') {
          return String.fromCharCode(8204) // 零宽不连字符&#8204;
        }
        return String.fromCharCode(8205) // 空格 -> 零宽连字符&#8205;
      })
      .join(String.fromCharCode(8206)),
  )
  state.cipherText = tempStrArr.join('')
}

// 零宽字符转字符串
function decodeStr() {
  if (!state.tempText) {
    state.decodeText = ''
    return
  }
  const text = state.tempText.replace(/[\u200b-\u200f\uFEFF\u202a-\u202e]/g, '')
  const hiddenText = state.tempText.replace(
    /[^\u200b-\u200f\uFEFF\u202a-\u202e]/g,
    '',
  )
  state.decodeText = hiddenText
    .split('‎') // 不是空字符串,是 &#8206;
    .map((char) => {
      if (char === '​' /* 不是空字符串,是&#8203; */) {
        return '1'
      }
      if (char === '‌' /*  不是空字符串,是&#8204; */) {
        return '0'
      }
      /* 是&#8205;时,用空格替换 */
      return ' '
    })
    .join('')
    // 转数组
    .split(' ')
    // 根据指定的 Unicode 编码中的序号值来返回一个字符串。
    .map((binaryNum) => String.fromCharCode(parseInt(binaryNum, 2)))
    .join('')
}
</script>

<template>
  <div class="steganography">
    <h2>加密:🔒</h2>
    <p>将要嵌入密文的明文:</p>
    <el-input
      v-model="state.text"
      placeholder="输入文本"
      size="default"
      clearable
    ></el-input>
    <p>嵌入的密文</p>
    <el-input
      v-model="state.hiddenText"
      placeholder="输入隐藏的文本"
      size="default"
      clearable
    ></el-input>
    <el-button
      type="primary"
      style="width: 100%; margin: 10px auto"
      size="default"
      @click="encodeStr"
    >
      生成隐写文本
    </el-button>
    <p>生成的隐写文本</p>
    <el-input
      v-model="state.cipherText"
      placeholder="生成的隐写文本"
      size="default"
      clearable
    ></el-input>
    <h2 style="margin-top: 100px">解密:🔓</h2>
    <p>将隐写后的文本-复制黏贴到这里👇:</p>
    <el-input
      v-model="state.tempText"
      placeholder="将生成的隐写文本-复制黏贴到我里面来!"
      size="default"
      clearable
      @input="decodeStr"
    ></el-input>
    <p>解析出的密文:</p>
    <p
      style="
        height: 80px;
        line-height: 80px;
        color: gray;
        text-align: center;
        border: 1px solid gray;
      "
    >
      {{ state.decodeText }}
    </p>
    <el-button
      type="success"
      style="width: 100%; margin: 10px auto"
      size="default"
      @click="reset"
    >
      重置
    </el-button>
  </div>
</template>
<style lang="scss" scoped>
.steganography {
  width: 500px;
  margin: 100px auto;

  p {
    font-weight: bold;
  }

  h2 {
    margin: 20px 0;
  }
}
</style>
