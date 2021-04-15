import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/utils/_html'
import { Tab, Tabs, List, Cell, Swipe, SwipeItem, Lazyload } from 'vant';
import './assets/css/reset.css'
import './assets/css/common.scss'
import './assets/css/animate.css'


Vue.use(Tab);
Vue.use(Tabs);
Vue.use(List);
Vue.use(Cell);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Lazyload);


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
