<template>
    <div class="page-container">
        <div v-for="(item, index) in Notes" :key="index" style="display: inline-block">
            <div
                @click="play(item)"
                v-if="item.type == 'white'"
                :class="item.name == sign ? 'Press key' : 'key'"
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
import * as Tone from "tone";
import { Notes, NotesMap } from "./config";
export default {
    components: {},
    props: {},
    data() {
        return {
            Notes,
            sign: "",
            urls: {},
            synth: new Tone.Synth().toDestination(),
            sampler: null,
        };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
        this.Notes.forEach((item) => {
            this.urls[item.name] = item.url;
        });
        console.log(this.urls, "=====");
        this.sampler = new Tone.Sampler({
            urls: this.urls,
            release: 1,
            baseUrl: "./piano/",
            // baseUrl: "/static/piano/",
            onload: () => {
                console.log("装载完成...");
                sampler.triggerAttackRelease(["C1", "E1", "G1", "B1"], 0.5);
            },
        }).toDestination();
        document.addEventListener("keydown", this.keydown);
    },
    methods: {
        play(item) {
            // synth.triggerAttackRelease("C4", "7n");
            // this.sampler.triggerAttackRelease(item.name, "6n");
            this.synth.triggerAttackRelease(item.name, "6n");
        },
        //格式化成简谱标识
        getNumMusicalNotation(key) {
            const mapNum = { C: 1, D: 2, E: 3, F: 4, G: 5, A: 6, B: 7 };
            return mapNum[key.slice(0, 1)];
        },
        keydown(event) {
            //表示键盘监听所触发的事件，同时传递传递参数event
            console.log(event.keyCode); //keyCode表示键盘编码
            let note = this.Notes.find((item) => {
                return item.keyCode == event.keyCode;
            });
            this.synth.triggerAttackRelease(note.name, "6n");
            this.sign = note.name;
            console.log("🚀🚀🚀", note);
        },
    },
};
</script>

<style scoped lang="scss">
.page-container {
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
    .Press {
        background: burlywood;
    }
}
</style>
