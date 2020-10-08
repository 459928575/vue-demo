<template>
  <div>
     <app-header></app-header>
     <app-nav-bar></app-nav-bar>
     <app-main></app-main>
  </div>
</template>

<script>
import AppHeader from './AppHeader.vue'
import AppMain from './AppMain.vue'
import AppNavBar from './AppNavBar.vue'
export default {
  components: {
    AppHeader,
    AppMain,
    AppNavBar
  },
};
</script>

<style>
.header {
  position: absolute;
  line-height: 50px;
  top: 0px;
  left: 0px;
  right: 0px;
  background-color: #130505;
}
.navbar{
    position: absolute;
  width: 200px;
  left:0px;
  top:50px;
  bottom:0px;
   background-color: #545c64;
     overflow-y: auto;
}
.main{
   position: absolute;
   background-color:white ;
   left: 200px;
   right: 0px;
   bottom: 0px;
   top:50px;
   padding: 10px;
   overflow-y: auto;

}
</style>