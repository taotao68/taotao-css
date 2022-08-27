const  MiniCssExtractPlugin=require('mini-css-extract-plugin')
module.exports = {
    module:{
        // 配置的规则有好多，所以是一个数组，里面是一个个对象
        rules:[
            {
              enforce:'pre',   //这个是强制性的预先去执行这个loader
              test:/\.css$/,
              exclude:/node_modules/,
              loader:'typed-css-modules-loader'  //这个插件可以动态的帮助我们生成一个css.d.ts的声明文件
            },
            {
            test:/\.css$/i,
            use:[
            // "style-loader",
            // style-loader和下面的是相互区分的，style-loader是把css加进去，mini-css-extract-plugin是把css单独抽离出来
            MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader"
                // loader:'css-loader',
                // options:{
                //     modules:true
                // }
            ]   //css的规则是从右到左去使用插件的
            }
           
        ]
    },
    plugins:[new MiniCssExtractPlugin({
        filename:'styles/[name].css',
        chunkFilename:'styles/[id].css',
        ignoreOrder:false
    })]
  };