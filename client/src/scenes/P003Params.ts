import Scene from './scene';
import * as THREE from "three";
import { NumberType, ParamData } from '../params';
export class P003Params extends Scene {
  private box: THREE.Mesh;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private time: number;
  private param1: ParamData;
  private param2: ParamData;
  public get description() {
    return "";
  }
  constructor() {
    super();
    this.param1 = {
      name: "param1",
      value: 0,
      min: -1,
      max: 1,
      numberType: NumberType.FLOAT
    }
    this.param2 = {
      name: "param2",
      value: 0,
      min: -1,
      max: 1,
      numberType: NumberType.FLOAT
    }
    this.paramDatas = [
      this.param1, this.param2
    ];
    this.camera = new THREE.PerspectiveCamera(
      70,   // fov
      1,    // aspect
      0.01, // near
      10    // far
    );
    this.scene = new THREE.Scene();
    this.box = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.2, 0.2),
      new THREE.MeshNormalMaterial()
    );
    this.camera.position.y = 0.4;
    this.camera.lookAt(this.box.position);
    this.scene.add(this.box);
    this.time = 0;
    // attach
    this.currentScene = this.scene;
    this.currentCamera = this.camera;
  }
  public animate(deltaTime: number) {
    this.box.rotation.x += deltaTime * this.param1.value * 0.01;
    this.box.rotation.y += deltaTime * this.param2.value * 0.01;
  }
  public resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer?.setPixelRatio(window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio);
  }
}