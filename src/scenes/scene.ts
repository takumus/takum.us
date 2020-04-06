import ThreeForVue from '@takumus/three-for-vue';
import { ParamData } from '../params';
export default abstract class Scene extends ThreeForVue {
    public abstract get description(): string;
    public paramDatas: ParamData[] = [];
}