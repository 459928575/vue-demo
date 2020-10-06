//引用node.js中的path，用来处理文件路径
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin=require('html-webpack-plugin');
const path=require("path")
module.exports={
    mode:'production',//production 、none
    //入口，指定要打包的文件在哪里
    entry:'./src/main.js',

    //出口，文件打包放到哪里去
    output:{
        // __dirname就能够获取到webpack.config.js文件的绝对路径
        path:path.join(__dirname,'./dist'),
        filename:'bundle.js'//打包名
    },
    plugins: [
        // new CleanWebpackPlugin()
        new HtmlWebpackPlugin({template:'./index.html'})
    ],
    module:{
         rules:[{
           test:/\.css$/,
           use:['style-loader','css-loader'] 
         },
         {
            test:/\.(png|svg|jpeg|bmp|jpg|gif)$/,
           use:['file-loader']   
         }
        ]
    },
    devServer:{contentBase:'./dist'} //在当前目录dist目录下查找文件
   
} 
