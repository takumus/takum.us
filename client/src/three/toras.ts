import ThreeForVue from '@takumus/three-for-vue';
import * as THREE from "three";
export default class Torases extends ThreeForVue {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private objs: Toras[];
  constructor() {
    super();
    this.camera = new THREE.PerspectiveCamera(
      70,   // fov
      1,    // aspect
      0.01, // near
      10    // far
    );
    this.scene = new THREE.Scene();
    this.camera.position.z = 2;

    this.objs = [];
    this.objs.push(new Toras(32, 3, 0.3, 0.1, 0, new THREE.MeshNormalMaterial()));
    this.objs.push(new Toras(32, 4, 0.3, 0.1, 1, new THREE.MeshNormalMaterial()));
    this.objs.push(new Toras(32, 10, 0.3, 0.1, 0, new THREE.MeshPhongMaterial(), 0, 3));
    this.objs.push(new Toras(32, 10, 0.3, 0.1, 0, new THREE.MeshPhongMaterial(), 1, 4));
    this.objs.push(new Toras(32, 16, 0.3, 0.1, 3, new THREE.MeshNormalMaterial(), 0, 2));
    this.objs.forEach((o, i) => {
      const r = i / this.objs.length * Math.PI * 2;
      o.position.x = Math.cos(r) * 0.8;
      o.position.y = Math.sin(r) * 0.8;
      this.scene.add(o);
    });
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(-1, 2, 4);
    this.scene.add(light);
    // attach
    this.currentScene = this.scene;
    this.currentCamera = this.camera;
  }
  public animate(deltaTime: number) {
    this.camera.lookAt(0, 0, 0);
    this.objs.forEach((o) => {
      o.animate(deltaTime);
    });
  }
  public resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}
class Toras extends THREE.Object3D {
  private time: number;
  private g: THREE.Geometry;
  private res1: number;
  private res2: number;
  private radius1: number;
  private radius2: number;
  private mesh: THREE.Mesh;
  private nejire: number;
  private normalMode: number;
  private kobu: number;
  constructor(res1: number, res2: number, radius1: number, radius2: number, nejire: number, material: THREE.Material, normalMode: number = 0, kobu: number = 0) {
    super();
    this.time = 0;
    this.res1 = res1;
    this.res2 = res2;
    this.radius1 = radius1;
    this.radius2 = radius2;
    this.nejire = nejire;
    this.normalMode = normalMode;
    this.kobu = kobu;
    this.g = new THREE.Geometry();
    for (let i = 0; i < this.res1; i++) {
      for (let ii = 0; ii < this.res2; ii++) {
        this.g.vertices.push(new THREE.Vector3(0, 0, 0));
        if (this.res1 - 1 == i && nejire != 0) {
          let a = i * this.res2;
          const cci = ii + a;
          const ccni = (cci + 1) % this.res2 + a;
          this.g.faces.push(
            new THREE.Face3(
              ccni,
              cci,
              (ii + res2 / 2)%res2
            ),
            new THREE.Face3(
              (ii + res2 / 2)%res2,
              (ii + res2 / 2 + 1)%res2,
              ccni
            )
          );
        }else {
          let a = i * this.res2;
          const cci = ii + a;
          const ccni = (cci + 1) % this.res2 + a;
          let b = ((i + 1) % this.res1) * this.res2;
          const nci = b + ii;
          const ncni = (nci + 1) % this.res2 + b;
          this.g.faces.push(
            new THREE.Face3(ccni, cci, nci),
            new THREE.Face3(ccni, nci, ncni)
          );
        }
      }
    }
    this.mesh = new THREE.Mesh(this.g, material);
    this.add(this.mesh);
  }
  public animate(deltaTime: number) {
    this.time += deltaTime;
    const rr = this.time * 0.002;
    this.rotation.y += deltaTime * 0.001;
    for (let i = 0; i < this.res1; i++) {
      for (let ii = 0; ii < this.res2; ii++) {
        const radian = ii / this.res2 * Math.PI * 2 - rr + (i / (this.res1)) * Math.PI * this.nejire;
        const tr = Math.sin(i / this.res1 * Math.PI * 2 * this.kobu + rr*5);
        const r2 = this.radius2 + (this.kobu != 0 ? tr * 0.03 : 0);
        const r = this.radius1 + Math.cos(radian) * r2;
        const cpx = Math.cos(i / this.res1 * Math.PI * 2) * r;
        const cpy = Math.sin(i / this.res1 * Math.PI * 2) * r;
        const p = new THREE.Vector3(
          cpx,
          cpy,
          Math.sin(radian) * r2
        );
        this.g.vertices[i * this.res2 + ii].x = p.x;
        this.g.vertices[i * this.res2 + ii].y = p.y;
        this.g.vertices[i * this.res2 + ii].z = p.z;
      }
    }
    if (this.normalMode == 0) {
      this.g.computeFaceNormals();
    }else {
      this.g.computeVertexNormals();
    }
    this.g.verticesNeedUpdate = true;
    this.g.normalsNeedUpdate = true;
  }
}