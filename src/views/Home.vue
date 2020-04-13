<template>
  <div class="home">
    <img class="logo" alt="logo" src="../assets/logo.png" />
    <div>
      <a href="https://github.com/takumus/takum.us"><img class="github" src="../assets/github.png"></a>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "../scss/utils.scss";
.logo {
  @include pc {
    max-width: 256px;
    min-width: 128px;
    width: 30%;
  }
  @include sp {
    width: 128px;
  }
  animation: rotating 5s linear infinite;
  animation-timing-function: cubic-bezier(0.68, -0.6, 0.32, 1.6);
  margin: 32px;
}
.github {
  width: 64px;
}
@keyframes rotating {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Home extends Vue { }
</script>
