import ThreeForVue from '@takumus/three-for-vue';
export default abstract class Scene extends ThreeForVue {
    public abstract get description(): string;
}