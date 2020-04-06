import Scene from './scene';
import * as THREE from "three";
import { Vector3, Quaternion } from 'three';
export class P004Mouse extends Scene {
  private box: THREE.Mesh;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private zAngle: number = 0;
  private xAngle: number = 0;
  private px: number = 0;
  private py: number = 0;
  public get description() {
    return "マウス座標を取れるようにした！<br>クォータニオンとセットで使ってみたけど難しい。";
  }
  constructor() {
    super();
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
    this.camera.position.z = 0.6;
    this.camera.lookAt(this.box.position);
    this.scene.add(this.box);
    this.scene.add(new THREE.AxesHelper(1));
    this.preventMouseEvents = true;
    // attach
    this.currentScene = this.scene;
    this.currentCamera = this.camera;
  }
  public animate(deltaTime: number) {
    const yHRadian = (this.mouseX - this.px) * 0.006 / 2;
    const xHRadian = (this.mouseY - this.py) * 0.006 / 2;
    const q = new Quaternion();
    q.multiply(new THREE.Quaternion(
      1 * Math.sin(xHRadian),
      0,
      0,
      Math.cos(xHRadian)
    ));
    q.multiply(new THREE.Quaternion(
      0,
      1 * Math.sin(yHRadian),
      0,
      Math.cos(yHRadian)
    ));
    q.multiply(this.box.quaternion);
    this.box.rotation.setFromQuaternion(q);

    this.px = this.mouseX;
    this.py = this.mouseY;
  }
  public resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer?.setPixelRatio(window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio);
  }
}