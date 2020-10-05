(function(){
    const MyPlugin={}
    MyPlugin.install = function (Vue, options) {
        // 1. 添加全局方法或 property
        Vue.myGlobalMethod = function () {
          // 逻辑...
          console.log(" 1. 添加全局方法或 property");
        }
      
        // 2. 添加全局资源
        Vue.directive('my-directive', {
            inserted(el,binding){el.innerHTML="xxxx"+binding.value; console.log(" 2. 添加全局资源"); }
        //   bind (el, binding, vnode, oldVnode) {
        //     // 逻辑...
        //     console.log(" 2. 添加全局资源");
        //   }
    
        })
      
        // 3. 注入组件选项
        Vue.mixin({
          created: function () {
            // 逻辑...
            console.log(" 3. 注入组件选项");
          }
   
        })
        //5、添加过滤器
        Vue.filter("upcase",data=>{
              if(!data) return ""
              data=data.toString()
              return data.charAt(0).toUpperCase()+data.slice(1)
        }) 

        // 4. 添加实例方法
        Vue.prototype.$myMethod = function (methodOptions) {
          // 逻辑...
          console.log(" 4. 添加实例方法"+methodOptions);
        }
      }
      window.MyPlugin=MyPlugin;
})()