import Scene from './scene';
import * as THREE from "three";
import { NumberType, ParamData } from '../params';
import { Vector3, MeshNormalMaterial } from 'three';
export class P007Bezier extends Scene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  public get description() {
    return "3D空間でもベジェの式が普通に使えることが分かった😀<br>ベジェな線を５本描いて連結した。<br>次はこれを動かしたりするぞ。";
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
    const rand = (n = 2) => (Math.random() - 0.5) * n;
    const copy = (v: THREE.Vector3) => new THREE.Vector3(v.x, v.y, v.z);
    let a = new THREE.Vector3(rand(1), rand(1), rand(1));
    let b = new THREE.Vector3(rand(), rand(), rand());
    for (let i = 0; i < 10; i++) {
      const points: THREE.Vector3[] = [];
      const c = new THREE.Vector3(rand(), rand(), rand());
      const d = new THREE.Vector3(rand(1), rand(1), rand(1));
      const getPos = (t: number) => {
        const e = copy(b).sub(a).multiplyScalar(t).add(a);
        const f = copy(d).sub(c).multiplyScalar(t).add(c);
        const g = copy(c).sub(b).multiplyScalar(t).add(b);
        const h = copy(g).sub(e).multiplyScalar(t).add(e);
        const i = copy(f).sub(g).multiplyScalar(t).add(g);
        const tp = copy(i).sub(h).multiplyScalar(t).add(h);
        return tp;
      }
      for (let t = 0; t < 1; t += 0.01) {
        points.push(getPos(t));
      }
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.MeshBasicMaterial({color:0xffffff})
      );
      this.scene.add(line);
      for (let t = 0; t <= 1; t += 0.2) {
        const box = new THREE.Mesh(
          new THREE.BoxGeometry(0.03, 0.03, 0.03),
          new MeshNormalMaterial()
        );
        const tp = getPos(t);
        const tp2 = getPos(t + 0.1);
        box.position.set(tp.x, tp.y, tp.z);
        box.lookAt(tp2);
        this.scene.add(box);
      }
      a = d;
      b = copy(c).sub(d).multiplyScalar(-1).add(d);
    }
    this.scene.add(new THREE.AxesHelper(10));
    this.camera.position.z = 1;
    // attach
    this.currentScene = this.scene;
    this.currentCamera = this.camera;
  }
  public animate(deltaTime: number) {
    this.scene.rotation.x += deltaTime * 0.001;
    this.scene.rotation.y += deltaTime * 0.002;
  }
  public resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer?.setPixelRatio(window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio);
  }
}