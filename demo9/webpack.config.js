//引用node.js中的path，用来处理文件路径
const path=require("path")
module.exports={
    mode:'production',
    //入口，指定要打包的文件在哪里
    entry:'./src/main.js',
    //出口，文件打包放到哪里去
    output:{
        // __dirname就能够获取到webpack.config.js文件的绝对路径
        path:path.join(__dirname,'./dist'),
        filename:'bundle.js'//打包名
    }
}