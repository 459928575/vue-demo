<template>
  <div>
    获取store仓库中count对象值:{{this.$store.state.home.count}}
    <button @click="addCount">增加</button>
      <button @click="decrement">减小</button>
      <br>
      派生属性值:{{this.$store.getters.msg1}}，奇偶性：{{this.$store.getters.isEvenOrOdd}}
  </div>
</template>

<script>
export default{
  methods:{
    addCount(){
      //怎么让集中状态管理器（store/index.js)中的increment方法去执行呢？
      //提交突变
      // this.$store.commit('increment',5)
      this.$store.dispatch('add',5)
    },
    decrement(){
      //  this.$store.commit('decrement',5)
      this.$store.dispatch('decrement')
    }
  }
}
</script>
