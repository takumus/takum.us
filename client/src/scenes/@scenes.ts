import ThreeForVue from '@takumus/three-for-vue';
import Scene001Box from './scene001Box';
import Scene002Toras from './scene002Toras';
export const scenes: { [key: string]: { new(): ThreeForVue } } = {
    "001-box": Scene001Box,
    "002-toras": Scene002Toras,
}