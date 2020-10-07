<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>

      <button @click="send"> ajaxi-send</button>
  </div>

</template>

<script>
import HelloWorld from './components/HelloWorld.vue'


export default {
  name: 'App',
  components: {
    HelloWorld
  },
  methods: {
    send(){
      this.$http.get('https://api.github.com/users/xuzhaoxing2020')
      .then(resp=>{ console.log(resp); console.log(resp.data); })
      .catch(err=>{console.log('err:'+err);
      })
    }
  },

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
