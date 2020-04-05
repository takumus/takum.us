import ThreeForVue from '@takumus/three-for-vue';
import RotatingBox from './rotatingBox';
import Toras from './toras';
export const scenes: {[key:string]: { new(): ThreeForVue }} = {
    "toras": Toras,
    "box": RotatingBox
}