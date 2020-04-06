<template>
  <div>
    <div class="container">
      <div class="parent" ref="parent"></div>
      <div ref="params" v-show="paramsGUI!=null" class="params"></div>
    </div>
    <h4 v-html="description"></h4>
    <a :href="url"><img src="../assets/github.png"></a>
  </div>
</template>
<style lang="scss" scoped>
@import "../scss/utils.scss";
.container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.parent {
  width: 100%;
  @include pc {
    height: 500px;
    max-width: 800px;
  }
  @include sp {
    height: 300px;
  }
  overflow: hidden;
  border-radius: 16px;
}
h4 {
  margin: 16px;
}
img {
  width: 128px;
  @include sp {
    width: 64px;
  }
  margin: 10px;
}
.params {
  width: 100%;
  max-width: 500px;
  margin: auto;
  margin-top: 18px;
}
</style>
<script lang="ts">
import * as scenes from "../scenes/";
import Scene from '../scenes/scene';
import { Component, Vue, Ref, Prop, Watch } from "vue-property-decorator";
import { ParamsGUI } from '../params';
@Component
export default class Viewer extends Vue {
  // refs
  @Ref() parent!: HTMLElement;
  @Ref() params!: HTMLElement;
  // datas
  scene: Scene | null = null;
  canvas: HTMLCanvasElement | null = null;
  paramsGUI: ParamsGUI | null = null;
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
    if (this.paramsGUI) {
      this.paramsGUI.destroy();
      this.paramsGUI = null;
    }
  }
  createScene() {
    const sceneName = this.$route.params.id.toString();
    const SceneClass = (scenes as  { [key: string]: { new(): Scene } })[sceneName];
    if (!SceneClass) {
      this.$router.push("/NotFound");
    }
    this.destroyScene();
    this.canvas = document.createElement("canvas");
    this.parent.appendChild(this.canvas);
    this.scene = new SceneClass();
    this.scene.mount(this.canvas);
    if (this.scene.paramDatas && this.scene.paramDatas.length > 0) {
      this.paramsGUI = new ParamsGUI(this.scene.paramDatas);
      this.params.appendChild(this.paramsGUI.element);
    }
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