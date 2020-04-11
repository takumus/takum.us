import Scene from "./scene";
import * as THREE from "three";
import image from "../assets/img001.png";
import { NumberType, ParamData } from "../params";
export class P006Vertex extends Scene {
  private texturePaper: THREE.Mesh;
  private normalPaper: THREE.Mesh;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private textureMaterial: NamiMaterial;
  private normalMaterial: NamiNormalMaterial;
  private meshResolution = 64;
  private time = 0;
  // params
  private paramFrequency: ParamData = {
    name: "freq",
    value: 30,
    min: 0,
    max: 60,
    numberType: NumberType.FLOAT
  }
  private paramDepth: ParamData = {
    name: "depth",
    value: 0.06,
    min: 0,
    max: 3,
    numberType: NumberType.FLOAT
  }
  private paramCameraDistance: ParamData = {
    name: "camera",
    value: 1.6,
    min: 0,
    max: 10,
    numberType: NumberType.FLOAT
  }
  private paramSpecular: ParamData = {
    name: "spec",
    value: 0.1,
    min: 0,
    max: 1,
    numberType: NumberType.FLOAT
  }
  private paramShiness: ParamData = {
    name: "shiness",
    value: 100,
    min: 0,
    max: 100,
    numberType: NumberType.FLOAT
  }
  public get description() {
    return "今回は法線を無理やり計算してみた。陰影がある！😀<br>ただ、思い付きで書いたから法線の求め方としては絶対におかしい😠";
  }
  constructor() {
    super();
    this.paramDatas.push(this.paramDepth, this.paramFrequency, this.paramCameraDistance, this.paramShiness, this.paramSpecular);
    this.camera = new THREE.PerspectiveCamera(
      70,   // fov
      1,    // aspect
      0.01, // near
      100    // far
    );
    this.scene = new THREE.Scene();
    this.textureMaterial = new NamiMaterial(new THREE.TextureLoader().load(image));
    this.normalMaterial = new NamiNormalMaterial();
    this.texturePaper = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1, this.meshResolution, this.meshResolution),
      this.textureMaterial
    );
    this.normalPaper = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1, this.meshResolution, this.meshResolution),
      this.normalMaterial
    );
    this.camera.position.z = 1;
    const light = new THREE.PointLight(0x48FECB, 1);
    light.position.z = 20;
    light.position.y = -20;
    const light2 = new THREE.PointLight(0xFC7CB5, 1);
    light2.position.z = 20;
    light2.position.y = 20;
    this.scene.add(light);
    this.scene.add(light2);
    this.scene.add(this.texturePaper);
    this.scene.add(this.normalPaper);
    this.texturePaper.position.x = 0.6;
    this.normalPaper.position.x = -0.6;
    this.preventMouseEvents = true;
    // attach
    this.currentScene = this.scene;
    this.currentCamera = this.camera;
  }
  public animate(deltaTime: number) {
    this.time += deltaTime * 0.0003;
    this.texturePaper.rotation.y += ((this.mouseRatioX - 0.5) * 2 - this.texturePaper.rotation.y) * 0.1;
    this.texturePaper.rotation.x += ((this.mouseRatioY - 0.5) * 2 - this.texturePaper.rotation.x) * 0.1;
    this.normalPaper.rotation.x = this.texturePaper.rotation.x;
    this.normalPaper.rotation.y = this.texturePaper.rotation.y;
    this.normalMaterial.time = this.textureMaterial.time = this.time;
    this.normalMaterial.frequency = this.textureMaterial.frequency = this.paramFrequency.value;
    this.normalMaterial.depth = this.textureMaterial.depth = this.paramDepth.value;
    this.normalMaterial.resolution = this.textureMaterial.resolution = this.meshResolution;
    this.textureMaterial.specular = new THREE.Color().setRGB(this.paramSpecular.value, this.paramSpecular.value, this.paramSpecular.value);
    this.textureMaterial.shininess = this.paramShiness.value;
    this.camera.position.z = this.camera.position.z = this.paramCameraDistance.value;
  }
  public resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer?.setPixelRatio(window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio);
  }
}
function getShader(shader: THREE.Shader) {
  // 追加分のユニフォーム達
  const uniforms: {[key: string]: THREE.IUniform} = {
    time: { value: 0 },
    depth: { value: 0 },
    frequency: { value: 0 },
    resolution: { value: 0 }
  }
  // 挿入分のトランスフォームと法線計算処理。
  const transform = `
    vec3 transformed = position.xyz;
    float t = 1.0 / resolution;
    float x = position.x;
    float y = position.y;
    float mz = sin((pow2(x) + pow2(y) + time) * frequency);
    float rz = sin((pow2(x + t) + pow2(y) + time) * frequency);
    float lz = sin((pow2(x - t) + pow2(y) + time) * frequency);
    float tz = sin((pow2(x) + pow2(y - t) + time) * frequency);
    float bz = sin((pow2(x) + pow2(y + t) + time) * frequency);
    objectNormal = normalize(vec3(0.0, 0.0, 0.0));
    vNormal = normalMatrix * normalize(vec3((rz - lz) * depth, (tz - bz) * depth, depth+0.01));
    transformed.z = mz * depth;
  `;
  // 元のユニフォーム群と合成
  shader.uniforms = {
    ...shader.uniforms,
    ...uniforms
  }
  // 無理やり連結
  shader.vertexShader = Object.keys(uniforms).map((n) => `uniform float ${n};\n`).join("") + shader.vertexShader;
  // 無理やり挿入
  shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", transform);
  // console.log(shader.vertexShader);
  return shader;
}
class NamiNormalMaterial extends THREE.MeshNormalMaterial {
  private shader?: THREE.Shader;
  constructor() {
    super();
  }
  onBeforeCompile(shader: THREE.Shader) {
    this.shader = getShader(shader);
  }
  public set time(value: number) {
    if (this.shader) this.shader.uniforms.time.value = -value;
  }
  public set depth(value: number) {
    if (this.shader) this.shader.uniforms.depth.value = value;
  }
  public set frequency(value: number) {
    if (this.shader) this.shader.uniforms.frequency.value = value;
  }
  public set resolution(value: number) {
    if (this.shader) this.shader.uniforms.resolution.value = value;
  }
}
class NamiMaterial extends THREE.MeshPhongMaterial {
  private shader?: THREE.Shader;
  constructor(texture: THREE.Texture) {
    super({
      map: texture,
      shininess: 0,
      specular: 0
    });
  }
  onBeforeCompile(shader: THREE.Shader) {
    this.shader = getShader(shader);
  }
  public set time(value: number) {
    if (this.shader) this.shader.uniforms.time.value = -value;
  }
  public set depth(value: number) {
    if (this.shader) this.shader.uniforms.depth.value = value;
  }
  public set frequency(value: number) {
    if (this.shader) this.shader.uniforms.frequency.value = value;
  }
  public set resolution(value: number) {
    if (this.shader) this.shader.uniforms.resolution.value = value;
  }
}