import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from "./router.js";
import Router from "vue-router";
import Http from './service/http'
import * as filters from './assets/filters'
import $config from '../src/config/config'
import $check from '../src/utils/check'
import $aes from '../src/utils/aes'



Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})


// 把Http挂载到Vue实例上
Vue.prototype.$Http = Http
Vue.prototype.$config = $config
Vue.prototype.$check = $check
Vue.prototype.$aes = $aes

Vue.config.productionTip = false


/**
 * 注意：下述代码，为了解决当前element UI中当前路由点击跳转当前路由的报错问题
 */
Vue.use(Router)
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}




new Vue({
    router,
    render: h => h(App),
}).$mount('#app')