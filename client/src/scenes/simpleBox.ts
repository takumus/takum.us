import ThreeForVue from '@takumus/three-for-vue';
import * as THREE from "three";
export default class SimpleBox extends ThreeForVue {
  private box: THREE.Mesh;
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
    this.box.rotation.x += deltaTime * 0.001;
    this.box.rotation.y += deltaTime * 0.002;
  }
  public resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}