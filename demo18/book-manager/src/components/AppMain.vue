<template>
    <div class="main">
    <el-breadcrumb separator-class="el-icon-arrow-right" v-show="$route.path!='/home' && $route.path!='/'">
      <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
      <span class="line">x</span>
      <el-breadcrumb-item v-show="$route.path=='/bookinfo' || $route.path=='/booktype'">图书信息管理</el-breadcrumb-item>
      <el-breadcrumb-item v-show="$route.path=='/kucunsearch' || $route.path=='/chukusearch' || $route.path=='/rukusearch'">图书库存管理</el-breadcrumb-item>
      <el-breadcrumb-item  :to="{ path: $route.path }" >{{$route.meta.title}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 路由出口 -->
    <router-view></router-view>
  </div>
</template>

<script>
   export default 
    {  
       data () { return { } }, 
       components: {},
     }
</script>

<style>

</style>