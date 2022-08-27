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