import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
// productionSourceMap:false

new Vue({
  render: h => h(App),
}).$mount('#app')
