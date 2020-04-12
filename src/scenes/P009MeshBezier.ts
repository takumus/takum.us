import Scene from './scene';
import * as THREE from "three";
import { NumberType, ParamData } from '../params';
export class P009MeshBezier extends Scene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private time: number = 0;
  private geometry: THREE.PlaneGeometry;
  private baseGeometry: THREE.PlaneGeometry;
  private randomMode = false;
  private randomPos: THREE.Vector3[] = [];
  private arrows: THREE.ArrowHelper[] = [];
  // params
  private zd1: ParamData = {
    name: "zd1",
    value: 1,
    min: -1,
    max: 1,
    numberType: NumberType.FLOAT
  }
  private zd2: ParamData = {
    name: "zd2",
    value: -1,
    min: -1,
    max: 1,
    numberType: NumberType.FLOAT
  }
  private yd1: ParamData = {
    name: "yd1",
    value: 0.5,
    min: -1,
    max: 1,
    numberType: NumberType.FLOAT
  }
  private yd2: ParamData = {
    name: "yd2",
    value: -0.5,
    min: -1,
    max: 1,
    numberType: NumberType.FLOAT
  }
  private pd1: ParamData = {
    name: "pd1",
    value: 0,
    min: -2,
    max: 2,
    numberType: NumberType.FLOAT
  }
  private pd2: ParamData = {
    name: "pd2",
    value: 2,
    min: -2,
    max: 2,
    numberType: NumberType.FLOAT
  }
  public get description() {
    return 'ベジェ4つで4角形のメッシュを変形してみた。<br>上辺と下辺をベジェして、間は保管している。<br>クリックでランダムとパラメータ切り替えられる🧐';
  }
  constructor() {
    super();
    this.preventMouseEvents = true;
    this.paramDatas.push(this.zd1, this.zd2, this.yd1, this.yd2, this.pd1, this.pd2);
    this.camera = new THREE.PerspectiveCamera(
      70,   // fov
      1,    // aspect
      0.01, // near
      100    // far
    );
    this.scene = new THREE.Scene();
    // attach
    this.currentScene = this.scene;
    this.currentCamera = this.camera;
    this.geometry = new THREE.PlaneGeometry(1, 1, 16, 16);
    this.baseGeometry = new THREE.PlaneGeometry(1, 1, 16, 16);
    const line = new THREE.Mesh(
      this.geometry,
      new THREE.MeshNormalMaterial({
        side: THREE.DoubleSide
      })
    );
    for (let i = 0; i < 4; i++) {
      this.arrows.push(new THREE.ArrowHelper(new THREE.Vector3(), new THREE.Vector3(), 0.5, 0xffffff, 0.1, 0.05));
    }
    this.scene.add(...this.arrows);
    this.scene.add(line);
  }
  private getBezier(t: number, a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, d: THREE.Vector3) {
    const ex = (b.x - a.x) * t + a.x;
    const ey = (b.y - a.y) * t + a.y;
    const ez = (b.z - a.z) * t + a.z;
    const fx = (d.x - c.x) * t + c.x;
    const fy = (d.y - c.y) * t + c.y;
    const fz = (d.z - c.z) * t + c.z;
    const gx = (c.x - b.x) * t + b.x;
    const gy = (c.y - b.y) * t + b.y;
    const gz = (c.z - b.z) * t + b.z;
    const hx = (gx - ex) * t + ex;
    const hy = (gy - ey) * t + ey;
    const hz = (gz - ez) * t + ez;
    const ix = (fx - gx) * t + gx;
    const iy = (fy - gy) * t + gy;
    const iz = (fz - gz) * t + gz;
    const tx = (ix - hx) * t + hx;
    const ty = (iy - hy) * t + hy;
    const tz = (iz - hz) * t + hz;
    return new THREE.Vector3(tx, ty, tz);
  }
  public mouseDown() {
    this.randomMode = !this.randomMode;
    this.randomPos = [];
    for (let i = 0; i < 8; i++) {
      this.randomPos.push(new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ));
    }
  }
  public animate(deltaTime: number) {
    this.time += deltaTime;
    this.camera.position.z = Math.cos(this.time * 0.0005) * 1;
    this.camera.position.x = Math.sin(this.time * 0.0005) * 1;
    this.camera.position.y = 1.5;
    this.camera.lookAt(0, 0, 0);
    let p1 = new THREE.Vector3(-this.pd1.value / 2, 0.5, 0);
    let p2 = new THREE.Vector3(this.pd1.value / 2, 0.5, 0);
    let c1 = new THREE.Vector3(-0.5, this.yd1.value, this.zd1.value);
    let c2 = new THREE.Vector3(0.5, this.yd1.value, this.zd1.value);
    let p3 = new THREE.Vector3(-this.pd2.value / 2, -0.5, 0);
    let p4 = new THREE.Vector3(this.pd2.value / 2, -0.5, 0);
    let c3 = new THREE.Vector3(-0.5, this.yd2.value, this.zd2.value);
    let c4 = new THREE.Vector3(0.5, this.yd2.value, this.zd2.value);
    if (this.randomMode) {
      p1 = this.randomPos[0];
      p2 = this.randomPos[1];
      c1 = this.randomPos[2];
      c2 = this.randomPos[3];
      p3 = this.randomPos[4];
      p4 = this.randomPos[5];
      c3 = this.randomPos[6];
      c4 = this.randomPos[7];
    }
    this.geometry.vertices.forEach((v, i) => {
      const bp = this.baseGeometry.vertices[i];
      const tx = bp.x + 0.5;
      const ty = bp.y + 0.5;
      const bp1 = this.getBezier(tx, p1, c1, c2, p2);
      const bp2 = this.getBezier(tx, p3, c3, c4, p4);
      const tp = new THREE.Vector3(
        (bp2.x - bp1.x) * ty + bp1.x,
        (bp2.y - bp1.y) * ty + bp1.y,
        (bp2.z - bp1.z) * ty + bp1.z
      );
      v.copy(tp);
    });
    this.arrows[0].position.copy(p1);
    this.arrows[0].setDirection(new THREE.Vector3().copy(c1).sub(p1));
    this.arrows[0].setLength(c1.distanceTo(p1));
    this.arrows[1].position.copy(p2);
    this.arrows[1].setDirection(new THREE.Vector3().copy(c2).sub(p2));
    this.arrows[1].setLength(c2.distanceTo(p2));
    this.arrows[2].position.copy(p3);
    this.arrows[2].setDirection(new THREE.Vector3().copy(c3).sub(p3));
    this.arrows[2].setLength(c3.distanceTo(p3));
    this.arrows[3].position.copy(p4);
    this.arrows[3].setDirection(new THREE.Vector3().copy(c4).sub(p4));
    this.arrows[3].setLength(c4.distanceTo(p4));
    this.geometry.computeVertexNormals();
    this.geometry.verticesNeedUpdate = true;
    this.geometry.normalsNeedUpdate = true;
  }
  public resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer?.setPixelRatio(window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio);
  }
}