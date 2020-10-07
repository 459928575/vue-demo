//引用node.js中的path，用来处理文件路径
const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin');
//1.导入vue-loader插件
const VueLoaderPlugin = require('vue-loader/lib/plugin')
//（1）导入webpack，模块热替换需要
const webpack = require('webpack');

module.exports = {
    mode: 'none',
    //入口，指定要打包的文件在哪里
    entry: './src/main.js',
    //出口，文件打包放到哪里去
    output: {
        // __dirname就能够获取到webpack.config.js文件的绝对路径
        path: path.join(__dirname, './dist'),
        filename: 'bundle.js'

    },
    // 配置插件
    plugins: [
        new HtmlWebpackPlugin({
            //指定要打包的模板页面index.html,采用的是相对路径，与当前配置文件在同级目录，所以为./。就会找到把index.html文件并把它打包到与输出文件bundle.js的同级目录下
            template: './index.html'
        }),
           // 3.请确保引入这个插件！（实例化插件）
        new VueLoaderPlugin(),
         //(3)实例化模块热替换插件
          new webpack.HotModuleReplacementPlugin()


    ],
    //实时重新加载
    devServer: {
        //在当前目录的dist目录下查找文件
        contentBase: './dist',
        hot: true //（2）开启模块热替换
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
             },
             { //2.指定扩展名为.vue的文件用vue-loader加载
                test: /\.vue$/,
                loader: 'vue-loader'
            },

            // {//解决兼容性问题
            //     test: /\.m?js$/,
            //     exclude: /(node_modules)/,//排除node_modules【是各种插件安装目录】下的代码不用babel_loader去转换
            //     use: {
            //       loader: 'babel-loader',
            //       options: {
            //         presets: ['@babel/preset-env']//babel中内置的转换规则工具，刚才配套一起安装的就还有这个。
            //       }
            //     }
            //   }           
        ]
    },
   // 去引用完整版 vue.js 
//    resolve:
//    {
//        alias:
//            { 'vue$': 'vue/dist/vue.js' }
//    } 

}