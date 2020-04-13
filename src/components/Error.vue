<template>
  <div>
    <img alt="logo" src="../assets/logo.png" />
    <h1>{{message}}</h1>
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
  animation: rotating 1s linear infinite;
}
@keyframes rotating {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component
export default class Error extends Vue {
  @Prop()
  message!: string;
  mounted() {
    document.body.style.backgroundColor = "#DDD";
  }
  destroyed() {
    document.body.style.backgroundColor = "";
  }
}
</script>