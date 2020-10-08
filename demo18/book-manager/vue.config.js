

const { any } = require("async")

//是对webpack.config.js的补充
module.exports=
{
   productionSourceMap:false,
   devServer:{ 
      port: 9001 ,
      open:true
      // , proxy:{
      //    '/dev-apis':{
      //       target:'url',
      //       changeOrigin:true,
      //       pathRewrite:{
      //          '^/dev-apis':''
      //       }
      //    }
      // }
      ,proxy:{//http://localhost:8082/data.json
        [process.env.VUE_APP_BASE_API]:{
            target:process.env.VUE_APP_SERVICE_URL,
            changeOrigin:true,
            pathRewrite:{
                // '^/dev-apis':''
                ['^'+process.env.VUE_APP_BASE_API]:''
            }
        }
    }
    },
    // useEslint: false,
   lintOnSave:false,//关闭格式检查
   outputDir:"dist",//输出目录
}