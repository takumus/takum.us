<template>
  <div class="about">
    <h1>☺</h1>
    <RotatingBox></RotatingBox>
    <RotatingBox></RotatingBox>
    <RotatingBox></RotatingBox>
    <RotatingBox></RotatingBox>
  </div>
</template>
<style lang="scss" scoped>

</style>
<script lang="ts">
import RotatingBox from './RotatingBox.vue';
import { Component, Vue, Ref } from 'vue-property-decorator';
@Component({
  components: {
    RotatingBox
  }
})
export default class About extends Vue {
  // refs
}
</script>