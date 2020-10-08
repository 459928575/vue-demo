<template>
  <div class="main">
    <el-breadcrumb separator-class="el-icon-arrow-right" v-show="$route.path!='/home' && $route.path!='/'">
      <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
      <span class="line">|</span>
      <el-breadcrumb-item v-show="$route.path=='/bookinfo' ||$route.path=='/booktype' ">图书信息管理</el-breadcrumb-item>
      <el-breadcrumb-item v-show="$route.path=='/chukuseach' ||$route.path=='/kucunseach'||$route.path=='/rukuseach' ">图书库存管理</el-breadcrumb-item>
      <el-breadcrumb-item  :to="{path: $route.path }">{{$route.meta.title}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 路由出口 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  components: {},
};
</script>

<style scoped>
 .el-breadcrumb{ height: 10px; padding: 15px; border-radius: 5px;  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); margin-bottom: 10px;}
 .line{ position: absolute; color:white; border-left: 3px solid red; left: 10px;}
</style>