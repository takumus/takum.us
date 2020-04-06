import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Viewer from '../views/Viewer.vue'
import NotFound from '../views/NotFound.vue'
import IE11 from '../views/IE11.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/viewer/:id',
    name: 'Viewer',
    component: Viewer
  },
  {
    path: '/ie11',
    name: 'IE11',
    component: IE11
  },
  {
    path: '*',
    name: 'Not Found',
    component: NotFound
  }
]
function isIE() {
  const ua = window.navigator.userAgent;
  const msie = ua.indexOf('MSIE ');
  const trident = ua.indexOf('Trident/');
  return (msie > 0 || trident > 0);
}
if (isIE()) {
  routes.length = 0;
  routes.push({
    path: '*',
    name: 'IE11',
    component: IE11
  });
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
