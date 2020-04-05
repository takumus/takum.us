<template>
  <div>
    <div class="container">
      <div class="parent" ref="parent"></div>
    </div>
    <h3>{{description}}</h3>
    <a :href="url"><img src="../assets/github.png"></a>
  </div>
</template>
<style lang="scss" scoped>
@import "../scss/utils.scss";
.container {
  width: 100%;
  display: flex;
  justify-content: center;
}
.parent {
  width: 100%;
  margin-bottom: 10px;
  @include pc {
    height: 500px;
    max-width: 800px;
  }
  @include sp {
    height: 300px;
  }
}
h3 {
  margin: 10px;
}
img {
  width: 128px;
  @include sp {
    width: 64px;
  }
}
</style>
<script lang="ts">
import * as scenes from "../scenes/";
import Scene from '../scenes/scene';
import { Component, Vue, Ref, Prop, Watch } from "vue-property-decorator";
@Component
export default class Viewer extends Vue {
  // refs
  @Ref() parent!: HTMLElement;
  // datas
  scene!: Scene | null;
  canvas!: HTMLCanvasElement | null;
  description = "☺";
  url = "";
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
    const sceneName = this.$route.params.id.toString();
    const SceneClass = (scenes as  { [key: string]: { new(): Scene } })[sceneName];
    if (!SceneClass) return;
    this.destroyScene();
    this.canvas = document.createElement("canvas");
    this.parent.appendChild(this.canvas);
    this.scene = new SceneClass();
    this.scene.mount(this.canvas);
    this.description = this.scene.description;
    this.url = `https://github.com/takumus/takum.us/blob/master/client/src/scenes/${sceneName}.ts`;
    this.resize();
  }
  @Watch("$route")
  changeRoute() {
    this.createScene();
  }
}
</script>