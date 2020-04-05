<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">home</router-link>
      <router-link v-for="scene in scenes" :key="scene" :to="'/viewer/' + scene">{{scene}}</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
@import "./scss/utils.scss";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  @include pc {
  };
  @include sp {
  };
}
#nav {
  padding: 30px;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
  margin: 0px 2px;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
<script lang="ts">
import { scenes } from "./scenes/@scenes";
import { Component, Vue } from "vue-property-decorator";
@Component
export default class App extends Vue {
  scenes = Object.keys(scenes);
}
</script>