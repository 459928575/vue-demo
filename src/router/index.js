import Vue from "vue";
import VueRouter from 'vue-router'
import User from '../views/user'
import Login from '../views/login'
Vue.use(VueRouter)

const routes = [
  {
    path: '/user',
    name: 'user',
    component: User,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
]

const router = new VueRouter({
  routes
})

export default router
