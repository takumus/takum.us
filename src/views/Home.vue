<template>
  <div class="home">
    <img alt="logo" src="../assets/logo.png" />
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
  -webkit-animation: rotating 5s linear infinite;
  -moz-animation: rotating 5s linear infinite;
  -ms-animation: rotating 5s linear infinite;
  -o-animation: rotating 5s linear infinite;
  animation: rotating 5s linear infinite;
  animation-timing-function: cubic-bezier(0.68, -0.6, 0.32, 1.6);
  -webkit-animation-timing-function: cubic-bezier(0.68, -0.6, 0.32, 1.6);
  -moz-animation-timing-function: cubic-bezier(0.68, -0.6, 0.32, 1.6);
  -o-animation-timing-function: cubic-bezier(0.68, -0.6, 0.32, 1.6);
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
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: "Home",
  components: {}
};
</script>
