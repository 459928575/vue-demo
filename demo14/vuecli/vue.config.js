const { any } = require("async")

//是对webpack.config.js的补充
module.exports=
{
   productionSourceMap:false,
   devServer:{ port: 9000 ,open:true },
   lintOnSave:false,//关闭格式检查
   outputDir:"dist",//输出目录
}