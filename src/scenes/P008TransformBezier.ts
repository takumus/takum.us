import Scene from './scene';
import * as THREE from "three";
import cb from '@takumus/cubic-bezier';
import { NumberType, ParamData } from '../params';
export class P008TransformBezier extends Scene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private bezierPoints: THREE.Vector3[] = [];
  private fromBezierPoints: THREE.Vector3[] = [];
  private nextBezierPoints: THREE.Vector3[] = [];
  private generatedPoints: THREE.Vector3[] = [];
  private time: number = 0;
  private cylinder: THREE.Mesh;
  private geometry: THREE.BufferGeometry;
  private easing = cb(0.77, 0, 0.175, 1);
  private easingProgress: number[] = [];
  // params
  private easingOffset: ParamData = {
    name: "eOffset",
    value: 2,
    min: 0,
    max: 10,
    numberType: NumberType.FLOAT
  }
  private easingSpeed: ParamData = {
    name: "sSpeed",
    value: 2,
    min: 0.1,
    max: 10,
    numberType: NumberType.FLOAT
  }
  private rotateSpeed: ParamData = {
    name: "sSpeed",
    value: 1,
    min: 0,
    max: 20,
    numberType: NumberType.FLOAT
  }
  public get description() {
    return '昨日のベジェを動かした。イージングには<a href="https://github.com/takumus/cubic-bezier">@takumus/cubic-bezier</a>を使ってるよ😀';
  }
  constructor() {
    super();
    this.paramDatas.push(this.easingOffset, this.easingSpeed, this.rotateSpeed);
    this.camera = new THREE.PerspectiveCamera(
      70,   // fov
      1,    // aspect
      0.01, // near
      100    // far
    );
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AxesHelper(10));
    // attach
    this.currentScene = this.scene;
    this.currentCamera = this.camera;

    this.cylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.06, 0.2, 32),
      new THREE.MeshPhongMaterial({
        color: 0xCCCCCC,
        shininess: 100,
        specular: 0xffffff
      })
    );
    this.cylinder.geometry.rotateX(Math.PI/2);
    const light1 = new THREE.SpotLight(0x48FECB, 1, 100);
    const light2 = new THREE.PointLight(0xFC7CB5, 1, 100);
    light1.position.set(3, 3, 3);
    light1.position.set(-3,-3,-3);
    this.scene.add(light1, light2);
    this.scene.add(this.cylinder);
    this.geometry = new THREE.BufferGeometry();
    const line = new THREE.Line(
      this.geometry,
      new THREE.MeshBasicMaterial({color:0xffffff})
    );
    this.scene.add(line);
    this.initParams();
    this.generateNextBezierPoints();
    this.generatePoints();
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
  private random(n = 2) {
    return (Math.random() - 0.5) * n;
  }
  public initParams() {
    this.bezierPoints = [];
    this.fromBezierPoints = [];
    for (let i = 0; i < 7; i++) {
      this.bezierPoints.push(new THREE.Vector3(), new THREE.Vector3());
      this.fromBezierPoints.push(new THREE.Vector3(), new THREE.Vector3());
      this.easingProgress.push(0, 0);
    }
  }
  public generateNextBezierPoints() {
    if (this.nextBezierPoints.length > 0) this.fromBezierPoints = this.nextBezierPoints.map((v) => new THREE.Vector3().copy(v));
    this.nextBezierPoints = [];
    for (let i = 0; i < this.bezierPoints.length; i++) {
      const p = new THREE.Vector3(
        this.random(1),
        this.random(1),
        this.random(1)
      );
      const cp = new THREE.Vector3(
        this.random(),// + p.x,
        this.random(),// + p.y,
        this.random()// + p.z
      );
      this.nextBezierPoints.push(p);
      this.nextBezierPoints.push(cp);
    }
  }
  public generatePoints() {
    const fa = this.bezierPoints[0];
    const fb = this.bezierPoints[1];
    let a = new THREE.Vector3(fa.x, fa.y, fa.z);
    let b = new THREE.Vector3(fb.x, fb.y, fb.z);
    this.generatedPoints = [];
    for (let i = 2; i < this.bezierPoints.length; i++) {
      let c = this.bezierPoints[i+1];
      let d = this.bezierPoints[i];
      if (i == this.bezierPoints.length - 1) {
        c = new THREE.Vector3().copy(fb).sub(fa).multiplyScalar(-1).add(fa);
        d = fa;
      }
      for (let t = 0; t < 1; t += 0.01) {
        this.generatedPoints.push(this.getBezier(t, a, b, c, d));
      }
      a = d;
      b = new THREE.Vector3().copy(c).sub(d).multiplyScalar(-1).add(d);
    }
    this.generatedPoints.push(fa);
    this.geometry.setFromPoints(this.generatedPoints);
  }
  public mouseDown() {
    this.generateNextBezierPoints();
  }
  public animate(deltaTime: number) {
    for (let i = 0; i < this.easingProgress.length; i++) {
      this.easingProgress[i] += deltaTime * 0.001 * this.easingSpeed.value;
      if (this.easingProgress[i] >= 1) {
        this.easingProgress[i] = 1;
        if (i == this.easingProgress.length - 1) {
          this.easingProgress.forEach((v, n) => {
            this.easingProgress[n] = (-n / this.easingProgress.length) * this.easingOffset.value;
          });
          this.generateNextBezierPoints();
        }
      }
    }
    this.bezierPoints.forEach((p, i) => {
      const np = this.nextBezierPoints[i];
      const fp = this.fromBezierPoints[i];
      const e = this.easing(this.easingProgress[i]);
      p.x = e * (np.x - fp.x) + fp.x;
      p.y = e * (np.y - fp.y) + fp.y;
      p.z = e * (np.z - fp.z) + fp.z;
    })
    this.generatePoints();
    this.time += deltaTime;
    this.camera.position.z = Math.cos(this.time * 0.0001 * this.rotateSpeed.value) * 1;
    this.camera.position.x = Math.sin(this.time * 0.0001 * this.rotateSpeed.value) * 1;
    this.camera.position.y = 0.8;
    const ti = this.time * 0.1;
    const cp = this.generatedPoints[Math.floor(ti % this.generatedPoints.length)];
    const np = this.generatedPoints[Math.floor((ti + 1) % this.generatedPoints.length)];
    this.cylinder.position.copy(cp);
    this.cylinder.lookAt(np);
    this.camera.lookAt(0, 0, 0);
  }
  public resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer?.setPixelRatio(window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio);
  }
}