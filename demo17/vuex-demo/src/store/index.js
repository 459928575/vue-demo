import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
const state={count:1 }
 const store=new Vuex({
     state:state
 });

export default  store