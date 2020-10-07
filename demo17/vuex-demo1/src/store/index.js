import Vue from 'vue'
import Vuex from 'vuex'
import home from './modules/home'
import goods from './modules/goods'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
Vue.use(Vuex)


const store=new Vuex.Store({
   modules:{
        home,
        goods,       
   },
   getters,
   actions,
   mutations

})
//导出store对象
export default store