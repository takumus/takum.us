<template>
  <div id="app">
    <h1>takum.us{{env}}</h1>
    <div id="nav">
      <a href="https://blog.takum.us">blog</a>
      <router-link to="/">home</router-link>
      <router-link v-for="scene in scenes" :key="scene" :to="'/viewer/' + scene">{{scene}}</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
@import "./scss/utils.scss";
body {
  margin: 0px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0 10px;
  @include pc {
  };
  @include sp {
  };
}
#nav {
  padding-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
a {
  font-weight: bold;
  color: #2c3e50;
  margin: 0px 4px;
}
a.router-link-exact-active {
  color: #ff9d41;
}
</style>
<script lang="ts">
import * as scenes from "./scenes/";
import { Component, Vue } from "vue-property-decorator";
@Component
export default class App extends Vue {
  env = process.env.NODE_ENV == "development" ? "[DEV]" : "";
  scenes = Object.keys(scenes);
}
</script>