<template>
  <div class="parent" ref="parent">
    <canvas ref="canvas"></canvas>
  </div>
</template>
<style lang="scss" scoped>
  .parent {
    width: 100%;
    height: 300px;
    margin-bottom: 10px;
  }
</style>
<script lang="ts">
import RotatingBox from '../three/rotatingBox';
import { Component, Vue, Ref } from 'vue-property-decorator';
@Component
export default class About extends Vue {
  // refs
  @Ref() canvas!: HTMLCanvasElement;
  @Ref() parent!: HTMLElement;
  // datas
  rotatingBox = new RotatingBox();
  mounted() {
    this.rotatingBox.mount(this.canvas);
    window.addEventListener('resize', this.resize);
    this.resize();
  }
  destroyed() {
    this.rotatingBox.destroy();
    window.removeEventListener('resize', this.resize);
  }
  resize() {
    const rect = this.parent.getBoundingClientRect();
    this.rotatingBox.setSize(rect.width, rect.height);
  }
}
</script>