// 导入express
const express = require('express')

// 创建web服务器
const app = express()
const joi = require('@hapi/joi')
// 导入配置cors中间件
const cors = require('cors')
app.use(cors())
// 配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }))
// 封装res.cc函数
app.use((req, res, next) => {
    // status默认为1,表示失败的情况
    // err的值，可能是一个错误对象也可能是一个错误的描述字符串
    res.cc = function (err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err,
        })
    }
    next()
})
// 配置解析token的中间件
const expressJWT = require('express-jwt')
const config = require('./config')

app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

// 导入并使用路由模块
app.use('/api', require('./router/user'))
// 导入使用用户信息的路由模块
app.use('/my',require('./router/userinfo'))
// 导入并使用文章分类的路由模块
app.use('/my/article',require('./router/artcate'))
// 新增文章分类的路由


app.use((err, req, res, next) => {
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err)
    // 身份认证失败后的错误
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    res.cc(err)
})

// 启动服务器
app.listen(80)
console.log('http://127.0.0.1')
