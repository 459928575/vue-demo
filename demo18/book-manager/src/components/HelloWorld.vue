<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h3>{{list}}</h3>
    <ul>
      <li v-for="(value,index) in list" :key="index">{{value.bookname}}--{{value.price}}</li>
    </ul>
  </div>
</template>


<script>
// import myaxios from '../utils/myaxios.js'
import testApi from '@/api/test.js'
export default {
   data() {
     return {
       list:[]
     }
   },
  created() {
    this.fetchData()
    testApi.getList().then(resp=>{console.log(resp.data);this.list=resp.data }).catch(err=>{console.log(err);})
  },
  methods: {
      fetchData(){}
  },
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
