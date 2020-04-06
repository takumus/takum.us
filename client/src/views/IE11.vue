<template>
  <div class="home">
    <img alt="logo" src="../assets/logo.png" />
    <h1>Why are you still using Internet Exploler?</h1>
  </div>
</template>
<style lang="scss" scoped>
@import "../scss/utils.scss";
img {
  @include pc {
    max-width: 256px;
    min-width: 128px;
    width: 30%;
  }
  @include sp {
    width: 128px;
  }
  filter: grayscale(100%);
  -webkit-animation: rotating 1s linear infinite;
  -moz-animation: rotating 1s linear infinite;
  -ms-animation: rotating 1s linear infinite;
  -o-animation: rotating 1s linear infinite;
  animation: rotating 1s linear infinite;
}
@-webkit-keyframes rotating {
  from {
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes rotating {
  from {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
<script lang="ts">
import { Component, Vue, Ref, Prop, Watch } from "vue-property-decorator";
@Component
export default class IE11 extends Vue {
  mounted() {
    document.body.style.backgroundColor = "#DDD";
  }
  destroyed() {
    document.body.style.backgroundColor = "";
  }
}
</script>