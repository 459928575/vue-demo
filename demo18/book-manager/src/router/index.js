import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login/index.vue'
import Layout from '@/components/Layout.vue'

import Home from '../views/home/home.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/",
    name: "layout",
    component: Layout,
     children:[{
      path: "/home",
      name: "home",
      component: Home
     }]
  },
 
]

const router = new VueRouter({
    //  mode:"history",
   base: process.env.BASE_URL,
  routes
})

export default router
