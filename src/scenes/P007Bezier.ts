import Scene from './scene';
import * as THREE from "three";
export class P007Bezier extends Scene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private points: THREE.Vector3[] = [];
  private time: number = 0;
  private cylinder: THREE.Mesh;
  public get description() {
    return "3D空間でもベジェの式が普通に使えることが分かった😀<br>ベジェな線を連結した。ループするようにしてる。<br>次は頂点を動かしたりするぞ。";
  }
  constructor() {
    super();
    this.camera = new THREE.PerspectiveCamera(
      70,   // fov
      1,    // aspect
      0.01, // near
      100    // far
    );
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AxesHelper(10));
    this.camera.position.z = 1;
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
    // this.scene.add(new THREE.AmbientLight(0xffffff, 0.1));
    this.drawBezierLine();
  }
  public drawBezierLine() {
    const getPos = (t: number, a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, d: THREE.Vector3) => {
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
    const rand = (n = 2) => (Math.random() - 0.5) * n;
    const fa = new THREE.Vector3(rand(1), rand(1), rand(1));
    const fb = new THREE.Vector3(rand(), rand(), rand());
    let a = new THREE.Vector3(fa.x, fa.y, fa.z);
    let b = new THREE.Vector3(fb.x, fb.y, fb.z);
    const len = 20;
    for (let i = 0; i < len; i++) {
      let c = new THREE.Vector3(rand(), rand(), rand());
      let d = new THREE.Vector3(rand(1), rand(1), rand(1));
      if (i == len - 1) {
        c = fb.sub(fa).multiplyScalar(-1).add(fa);
        d = fa;
      }
      for (let t = 0; t < 1; t += 0.001) {
        this.points.push(getPos(t, a, b, c, d));
      }
      a = d;
      b = c.sub(d).multiplyScalar(-1).add(d);
    }
    this.points.push(fa);
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(this.points),
      new THREE.MeshBasicMaterial({color:0xffffff})
    );
    this.scene.add(line);
  }
  public animate(deltaTime: number) {
    this.time += deltaTime;
    this.camera.position.z = Math.cos(this.time * 0.00001) * 0.5;
    this.camera.position.x = Math.sin(this.time * 0.0003) * 0.5;
    this.camera.position.y = Math.sin(this.time * 0.0002) * 1.4;
    const ti = this.time * 0.5;
    const cp = this.points[Math.floor(ti % this.points.length)];
    const np = this.points[Math.floor((ti + 1) % this.points.length)];
    this.cylinder.position.copy(cp);
    this.cylinder.lookAt(np);
    this.camera.lookAt(this.cylinder.position);
  }
  public resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer?.setPixelRatio(window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio);
  }
}