import Scene from "./scene";
import * as THREE from "three";
import image from "../assets/img001.png";
import { NumberType, ParamData } from "../params";
export class P005Texture extends Scene {
  private paper: THREE.Mesh;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private material: NamiMaterial;
  private time = 0;
  // params
  private paramFrequency: ParamData = {
    name: "freq",
    value: 10,
    min: 0,
    max: 30,
    numberType: NumberType.FLOAT
  }
  private paramDepth: ParamData = {
    name: "depth",
    value: 0.1,
    min: 0,
    max: 3,
    numberType: NumberType.FLOAT
  }
  private paramCameraDistance: ParamData = {
    name: "camera",
    value: 1,
    min: 0,
    max: 10,
    numberType: NumberType.FLOAT
  }
  public get description() {
    return "初vertexシェーダー。<br>ロックマン🎮の絵を読み込んでvertexシェーダーで波を作ってみた。<br>もちろんだけど陰影が無い😖";
  }
  constructor() {
    super();
    this.paramDatas.push(this.paramDepth, this.paramFrequency, this.paramCameraDistance);
    this.camera = new THREE.PerspectiveCamera(
      70,   // fov
      1,    // aspect
      0.01, // near
      100    // far
    );
    this.scene = new THREE.Scene();
    this.material = new NamiMaterial(new THREE.TextureLoader().load(image));
    this.paper = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1, 32, 32),
      this.material
    );
    this.camera.position.z = 1;
    this.scene.add(this.paper);
    this.preventMouseEvents = true;
    // attach
    this.currentScene = this.scene;
    this.currentCamera = this.camera;
  }
  public animate(deltaTime: number) {
    this.time += deltaTime * 0.01;
    this.paper.rotation.y = (this.mouseRatioX - 0.5);
    this.paper.rotation.x = (this.mouseRatioY - 0.5);
    this.material.time = this.time;
    this.material.frequency = this.paramFrequency.value;
    this.material.depth = this.paramDepth.value;
    this.camera.position.z = this.paramCameraDistance.value;
  }
  public resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer?.setPixelRatio(window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio);
  }
}
class NamiMaterial extends THREE.ShaderMaterial {
  private vert = `
  varying vec2 vUv;
  uniform float time;
  uniform float frequency;
  uniform float depth;
  void main()
  {
    vUv = uv;
    float tx = position.x;
    float ty = position.y;
    float tz = sin((tx * tx + ty * ty) * frequency + time) * depth;
    vec4 mv = modelViewMatrix * vec4(tx, ty, tz, 1.0);
    gl_Position = projectionMatrix * mv;
  }
  `;
  private frag = `
  uniform sampler2D texture;
  varying vec2 vUv;
  void main()
  {
    gl_FragColor = texture2D(texture, vUv);
  }
  `;
  constructor(texture: THREE.Texture) {
    super();
    this.uniforms = {
      time: { value: 0 },
      frequency: { value: 0 },
      depth: { value: 0 },
      texture: { value: texture }
    }
    this.vertexShader = this.vert;
    this.fragmentShader = this.frag;
  }
  public set time(value: number) {
    this.uniforms.time.value = -value;
  }
  public set depth(value: number) {
    this.uniforms.depth.value = value;
  }
  public set frequency(value: number) {
    this.uniforms.frequency.value = value;
  }
}