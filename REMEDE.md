css的进阶学习

css in js  就是把css写进js中，打包编译的时候就不会单独打包解析css了，直接是和js一起
css in js有许多的框架  2022-8-25号  现在用的比较多的是styled components ， css Modules ， Emotion 前三个

css发展 
1.css预处理器  就是把一些浏览器不认识的css文件转化为可以识别的css文件，像sass,less就是需要预处理器编译浏览器才可以认识
2.css后处理器  处理css的样式美观，压缩啥的；但是后处理器与预处理器之间是由时间间隔的，万一中间被别的插件给修改了，就不好了
所以能不能把预处理与后处理器合并到一起呢？
就出现了postcss 是预处理器和后处理器的合体

cssnext的小demo1  实现居中一个小球，网页颜色根据小球的位置渐变
background-image:radial-gradient() 用来生成径向渐变的图片
小demo的代码如下：
<style type="text/css">
        /* :root相当于是定义全部的样式变量 */
        :root{
            --colors:red,yellow,lime,aqua,blue,magenta,red;
            --mouse-x:50%;
            --mouse-y:50%
        }
        body{
            width:100vw;
            height:100vh;
            /* --center是局部变量 */
            --center:var(--mouse-x) var(--mouse-y,50%);
            background-image: radial-gradient(
                circle at var(--center),
                red,
                blue 2%,
                transparent 2%
            ),conic-gradient(at var(--center),var(--colors)); 这是生成锥形的渐变填充
        }
    </style>
    接下来是写一点js，让css与js进行交互
    js操作css的渐变  通过后台的cpu计算的，过滤掉重绘重排的过程
    可以实现中心圆点随着鼠标的移动进行移动，整个锥形的渐变也随之改变
    <script type="text/javascript">
        // documentElement 是整个节点数的根节点root,即<html>标签
      const root=document.documentElement;
      document.addEventListener('mousemove',(e)=>{
        // innerWidth innderHeight:表示获取window窗体的内部宽度和高度，不包括用户界面元素，比如窗框。
        // 下面是获取到中心点的相对于整个网页的x,y的相对位置
         const x=(e.clientX/innerWidth)*100;
         const y=(e.clientY/innerHeight)*100;
        //  新接下来是改变root全局变量中定义的x,y的位置，从而实现改成中心原点的位置
        root.style.setProperty('--mouse-x',`${x}%`);
        root.style.setProperty('--mouse-y',`${y}%`);
      })
    </script>

    demo2中主要是学习了cssnext语法中@nest 的用法

    demo3 来学习使用css-doodle 可以生成比较酷炫的动画图画


// 以下两种方式引入css文件是完全不同的 
//把css当做对象引入到项目中
import index from './index.css'
//进行独立的拆包
import('./index.css')

ACSS+BEM+CSS Modules +css next +渲染原理

接下来是学习加上webapck  postcss 配置的学习
1.pnpm init 生成package.json文件
2.安装webpack webpack-cli   pnpm  add webpack webpack-cli -D  是开发依赖
3.scripts中写成：启动编译的命令
  “dev";"webpack --mode development"
4.安装postcss postcss-loader  pnpm add postcss postcss-loader -D
5.新建webpack.config.js文件
6.还需要新建个postcss.config.js文件来解析转化css的配置的
7.还需要两个插件css-loader用来解析css的  y与style-loader用来解析js中的css的
css-loader只是帮我们解析了css文件里面的css代码，默认webpack是只解析js代码的，所以想要应用样式我们要把解析完的css代码拿出来加入到style标签中。
style-loader就是帮我们直接将css-loader解析后的内容挂载到html页面当中
也就是css-loader与style-loader两者是相互依赖的
安装 pnpm add css-loader -D  pnpm add style-loader -D


// 这个编译后就是css in js中
import index from './index.css'

// 有没有一个插件可以提示index中的样式名称  有的就是  typed-css-modules-loader
document.getElementById('app').innerHTML=`<h1 class=${index.qq}>涛涛爱前端</h1>`
安装 pnpm add typed-css-modules-loader
安装好，还需要在webpack.config.js中配置才可以起作用
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
            use:["style-loader","css-loader"]   //css的规则是从右到左去使用插件的
            上面的代码可以改为如下的代码，就是另外的一种写法
            loader: "style-loader!css-loader?modules"
            }
           
        ]
    }
  };

  重新编译会生成一个index.css.d.ts的文件


按照上面的步骤进行编译之后，会报错，找不到qq这个变量，是因为我们还没有给css-loader中开启css modules 
// 这个编译后就是css in js中
import index from './index.css'

// 有没有一个插件可以提示index中的样式名称  有的就是  typed-css-modules-loader
document.getElementById('app').innerHTML=`<h1 class=${index.qq}>涛涛爱前端</h1>`
报下面的错：
Uncaught TypeError: Cannot read properties of undefined (reading 'qq')

需要在webpack.config.js中进行配置,在css-loader配置下进行添加选项配置
 {
            test:/\.css$/i,
            use:["style-loader",{
                loader:'css-loader',
                options:{
                    modules:true
                }
            }]   //css的规则是从右到左去使用插件的
    }

// 这个编译后就是css in js中
import index from './index.css'
console.log('1212',index)   打印结果是：1212 {qq: 'm72Y9Isk0mYVuBAU79ya'}
// 有没有一个插件可以提示index中的样式名称  有的就是  typed-css-modules-loader
document.getElementById('app').innerHTML=`<h1 class=${index.qq}>涛涛爱前端</h1>`

上面用到的index.css里面的代码如下：
 .qq{
    background-color:yellowgreen;
 }

 上面就是css modules  与css in js中的学习

 接下来学习cssnext的知识点
 index.css如果这样写：
 :root{
   --bgColor:yellowgreen;  
}
.qq{
   height:100px;
   width:100px;
   //--textColor:red;    //这个地方的局部变量是不能乱用的  应该放在下面
   background-color: var(--bgColor);
   & h2{
      --textColor:red; 
      background-color:var(--textColor);
   }
 }
 上面的配置就不能够满足我们的要求，因为嵌套的并没有编译  也就是h2里面的东西没有编译，如何解决呢？
 使用postcss来帮忙编译这种css代码
 除了postcss-loader  还需要postcss-preset-env  来编译cssnext的代码  pnpm add postcss-preset-env
 接下来就是webpack.config.js中的配置
 此时就要把css modules 的配置去掉，改用postcss loader 来
 灵盖还需要在postcss.config.js进行一个配置进行输出
 module.exports={
    plugins:{
        "postcss-preset-env":{
            stage:0,
            // 接下来是一些特性，保证他的嵌套是ok的就可以
            features:{
                "nesting-rules":true
            }
        }
    }
}

下面使用的时候可以直接用样式名  qq
// 这个编译后就是css in js中
import index from './index.css'
// 有没有一个插件可以提示index中的样式名称  有的就是  typed-css-modules-loader
document.getElementById('app').innerHTML=`<div class="qq"><h2>涛涛爱前端</h2></div>`


接下来配置mini-css-extract-plugin  插件 pnpm add mini-css-extract-plugin -D
用来将css单独提取出来单独成包
安装好后，在webpack.config.js中配置
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
  进行项目的打包 会生成一个styles文件 下面有main.css文件，会把你写的css文件编译成如下的代码
:root{
   --bgColor:yellowgreen;  
}
.qq{
   height:100px;
   width:100px;
   background-color: yellowgreen;
   background-color: var(--bgColor);
 }
.qq h2{
      --textColor:red; 
      background-color:var(--textColor);
   }

但是打开项目，样式并没有起作用，是因为没有引入，自己写的html  没有配置html-plugin的插件，需要自己引入

接下来学习css in js的知识点
css 魔术师 Houdini  不是规范推出的，有一些小组推出的 让开发者能够介入浏览器的 css engine 

一个js经过  js->style->layout->paint->composite  最终看到我们的界面

cssom 通过document.stylesheets查看
