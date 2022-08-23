<template>
  <div class="tone-container">
    <p>通过鼠标点击,或者敲击对应音符的摁键开始奏乐~</p>
    <div
      v-for="(item, index) in Notes"
      :key="index"
      style="display: inline-block"
    >
      <div
        v-if="item.type == 'white'"
        :class="item.name == sign ? 'press key' : 'key'"
        @click="play(item)"
      >
        <p>{{ item.name }}</p>
        <p>{{ item.key }}</p>
        <p>{{ getNumMusicalNotation(item.name) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import * as Tone from 'tone'
import { Notes, NotesMap } from './config.ts'
export default {
  components: {},
  props: {},
  data() {
    return {
      Notes,
      sign: '',
      urls: {},
      synth: new Tone.Synth().toDestination(),
      sampler: null,
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.Notes.forEach((item) => {
      this.urls[item.name] = item.url
    })
    console.log(this.urls, '=====')
    this.sampler = new Tone.Sampler({
      urls: this.urls,
      release: 1,
      baseUrl: '/public/piano/',
      onload: () => {
        console.log('装载完成...')
        const now = Tone.now()
        sampler.triggerAttackRelease(
          ['C1', 'E1', 'G1', 'B1'],
          0.5,
          now + Math.random() * 10,
        )
      },
    }).toDestination()
    document.addEventListener('keydown', this.keydown)
  },
  methods: {
    play(item) {
      const now = Tone.now()
      this.synth.triggerAttackRelease(item.name, '6n', now + Math.random() * 10)
    },
    //格式化成简谱标识
    getNumMusicalNotation(key) {
      const mapNum = { C: 1, D: 2, E: 3, F: 4, G: 5, A: 6, B: 7 }
      return mapNum[key.slice(0, 1)]
    },
    keydown(event) {
      //表示键盘监听所触发的事件，同时传递传递参数event
      console.log(event.keyCode) //keyCode表示键盘编码
      let note = this.Notes.find((item) => {
        return item.keyCode == event.keyCode
      })
      const now = Tone.now()
      this.synth.triggerAttackRelease(note.name, '6n', now + Math.random() * 10)
      this.sign = note.name
      console.log('🚀🚀🚀', note)
    },
  },
}
</script>

<style scoped lang="scss">
.tone-container {
  text-align: center;
  padding-top: 200px;
  user-select: none;

  .key {
    width: 25px;
    height: 80px;
    border: 1px solid black;
    font-size: 12px;
    cursor: pointer;

    // display: inline-block;
    // display: inline-flex;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .press {
    background: burlywood;
  }
}
</style>
