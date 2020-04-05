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
