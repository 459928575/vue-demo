<template>
    <div>
      <h3> hello Vicm！ppp</h3>
       <!-- 使用组件 -->
    <Child></Child>
    {{msg}}
     </div>
</template>

<script>
import Child from './Child.vue'
   export default 
    {  
       components: {Child},
       data() {
          return {
             msg:"2020-10-7 09:46"
          }
       },
     }
</script>

<style scoped>
    h3{color :greenyellow}
</style>