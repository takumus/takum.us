<template>
  <div class="parent" ref="parent"></div>
</template>
<style lang="scss" scoped>
@import "../scss/utils.scss";
.parent {
  width: 100%;
  height: 500px;
  margin-bottom: 10px;
  @include pc {
    height: 800px;
  }
  @include sp {
    height: 400px;
  }
}
</style>
<script lang="ts">
import { scenes } from "../scenes/@scenes";
import ThreeForVue from "@takumus/three-for-vue";
import { Component, Vue, Ref, Prop, Watch } from "vue-property-decorator";
@Component
export default class Viewer extends Vue {
  // refs
  @Ref() parent!: HTMLElement;
  // datas
  scene!: ThreeForVue | null;
  canvas!: HTMLCanvasElement | null;
  mounted() {
    this.createScene();
    window.addEventListener("resize", this.resize);
  }
  destroyed() {
    this.destroyScene();
    window.removeEventListener("resize", this.resize);
  }
  resize() {
    const rect = this.parent.getBoundingClientRect();
    if (this.scene) this.scene.setSize(rect.width, rect.height);
  }
  destroyScene() {
    if (this.scene) {
      this.scene.destroy();
      this.scene = null;
    }
    if (this.canvas) {
      this.canvas.remove();
      this.canvas = null;
    }
  }
  createScene() {
    const SceneClass = scenes[this.$route.params.id.toString()];
    if (!SceneClass) return;
    this.destroyScene();
    this.canvas = document.createElement("canvas");
    this.parent.appendChild(this.canvas);
    this.scene = new SceneClass();
    this.scene.mount(this.canvas);
    this.resize();
  }
  @Watch("$route")
  changeRoute() {
    this.createScene();
  }
}
</script>