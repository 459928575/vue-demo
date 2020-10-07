// import Vue from 'vue/dist/vue.js'
import Vue from 'vue'
import App from './App.vue'

// var vm=new Vue({
//     el:"#app",
//     //  components:{
//     //       App
//     //  },
//     //  template:'<App/>'
//     render(h) {
//         return h(App);
//     },
// })

var vm=new Vue({
    render(h) {
        return h(App)
    },
}).$mount("#app")