import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/components/Layout.vue'

import Login from '@/views/login/index.vue'
import Home from '../views/home/home.vue'
import Bookinfo from '../views/book/bookinfo.vue'
import Booktype from '../views/book/booktype.vue'
import Kucunseach from '../views/kucun/kucunseach.vue'
import Chukuseach from '../views/kucun/chukuseach.vue'
import Rukuseach from '../views/kucun/rukuseach.vue'
import User from '../views/user/user.vue'

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
    children: 
    [
      { path: "/home", name: "home", component: Home ,meta:{title:"首页"}},
      { path: "/bookinfo", name: "bookinfo", component: Bookinfo,meta:{title:"图书信息管理"}},
      { path: "/booktype", name: "booktype", component: Booktype,meta:{title:"图书类别管理"}},
      { path: "/kucunseach", name: "kucunseach", component: Kucunseach,meta:{title:"库存查询"}},
      { path: "/chukuseach", name: "chukuseach", component: Chukuseach,meta:{title:"出库查询"}},
      { path: "/rukuseach", name: "rukuseach", component: Rukuseach,meta:{title:"入库查询"}},
      { path: "/user", name: "user", component: User,meta:{title:"用户信息"}}
    ]
  },

]

const router = new VueRouter({
   mode:"history",
  base: process.env.BASE_URL,
  routes
})

export default router
