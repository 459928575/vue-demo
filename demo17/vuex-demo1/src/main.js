import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// 默认就会到store文件夹下找index.js
import store from './store'
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
