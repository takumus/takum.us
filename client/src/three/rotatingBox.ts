import ThreeForVue from '@takumus/three-for-vue';
import * as THREE from "three";
export default class ThreeRotatingBox extends ThreeForVue {
  private boxes: Box[];
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private time: number;
  constructor() {
    super();
    this.camera = new THREE.PerspectiveCamera(
      70,   // fov
      1,    // aspect
      0.01, // near
      10    // far
    );
    this.scene = new THREE.Scene();
    this.boxes = [];
    const l = 16;
    for (let i = 0; i < l; i++) {
      let box = new Box();
      this.scene.add(box);
      this.boxes.push(box);
      box.position.x = Math.cos(i / l * Math.PI * 2) * 0.8;
      box.position.z = Math.sin(i / l * Math.PI * 2) * 0.8;
    }
    this.time = Math.random()*10000;
    this.camera.position.y = 0.6;
    
    // attach
    this.currentScene = this.scene;
    this.currentCamera = this.camera;
  }
  public animate(deltaTime: number) {
    this.boxes.forEach((box, i) => {
      box.update(deltaTime);
      box.scale.x = box.scale.y = box.scale.z = 
        (Math.sin(-this.time * 0.01 + (i / (this.boxes.length - 1) * Math.PI * 2 * 3)) + 1) / 2 * 0.5 + 0.5;
    });
    this.time += deltaTime;
    const d = (Math.sin(this.time * 0.001) + 1) / 2 * 1 + 1;
    this.camera.position.z = Math.sin(this.time * 0.001) * d;
    this.camera.position.x = Math.cos(this.time * 0.001) * d;
    this.camera.position.y = Math.cos(this.time * 0.001) * 0.4;
    this.camera.lookAt(0, 0, 0);
  }
  public resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}
class Box extends THREE.Object3D {
  private mesh: THREE.Mesh;
  private geom: THREE.BoxGeometry;
  private baseGeom: THREE.BoxGeometry;
  private time: number;
  constructor() {
    super();
    this.geom = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    this.baseGeom = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    this.mesh = new THREE.Mesh(
      this.geom,
      new THREE.MeshNormalMaterial()
    );
    this.time = Math.random()*10000;
    this.add(this.mesh);
  }
  public update(deltaTime: number) {
    this.time += deltaTime;
    this.mesh.rotation.x = Math.sin(this.time * 0.001);
    this.mesh.rotation.y = Math.cos(this.time * 0.0005 + Math.PI) * 2;
    this.geom.vertices.forEach((v, i) => {
      const pos = this.baseGeom.vertices[i];
      v.x = pos.x + Math.cos(this.time * 0.01 + i * 0.7) * 0.04;
      v.y = pos.y + Math.sin(this.time * 0.01 + i * 0.7) * 0.04;
      v.z = pos.z + Math.cos(this.time * 0.01 + i * 0.7) * 0.04;
    });
    this.geom.verticesNeedUpdate = true;
  }
}