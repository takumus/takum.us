<template>
  <span>{{emoji}}</span>
</template>

<style lang="scss">
span {
  font-size: 8em;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
body, html{
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  background-color: #ffffff;
  font-family: "Helvetica Neue",
    Arial,
    "Hiragino Kaku Gothic ProN",
    "Hiragino Sans",
    Meiryo,
    sans-serif;
    overflow: hidden;
}
</style>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
@Options({
})
export default class App extends Vue {
  get emoji() {
    const emojis = "😎,😀,🙂,😐,😷,🙁,😠".split(",");
    return emojis[Math.floor(emojis.length * Math.random())];
  }
}
</script>
