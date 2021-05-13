<template>
  <div id="app">
    hello
  </div>
</template>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
body, html{
  width: 100%;
  height: 100%;
  user-select: none;
  text-align: center;
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
export default class App extends Vue {}
</script>
