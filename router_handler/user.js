const { db, bcrypt } = require('../db/db')
// 导入生成token字符串的包
const jwt = require('jsonwebtoken')

const config = require('../config')
// 注册处理函数
exports.regUser = (req, res) => {
    // 获取客户端提交给服务器的用户数据
    const userInfo = req.body
    // 对表单中恶数据进行合法性校验
    if (!userInfo.username || !userInfo.password) {
        // return res.send({ status: 1, message: '用户名或密码不能为空' })
        return res.cc('用户名或密码不能为空')
    }
    // 定义sql语句，查询用户名是否被占用
    const sqlStr = 'select * from ev_users where username=?'
    db.query(sqlStr, userInfo.username, (err, results) => {
        // 执行sql语句失败
        if (err) {
            // return res.send({ status: 1, message: err.message })
            return res.cc(err)
        }
        // 用户名被占用
        if (results.length > 0) {
            // return res.send({ status: 1, message: '用户名被占用' })
            return res.cc('用户名被占用')
        }
        // 后续操作
        // 调用bcrypt.hashSync()对密码进行加密
        userInfo.password = bcrypt.hashSync(userInfo.password, 10)
        // 定义插入新用户的sql语句
        const sql = 'insert into ev_users(username,password) values(?,?)'
        db.query(sql, [userInfo.username, userInfo.password], (err, results) => {
            // 执行sql失败
            if (err) {
                // return res.send({ status: 1, message: err.message })
                return res.cc(err)
            }
            // 执行sql成功，但是影响行数不为1
            if (results.affectedRows !== 1) {
                // return res.send({ status: 1, message: '用户注册失败' })
                return res.cc('用户注册失败')
            }
            // 注册成功
            // return res.send({ status: 0, message: '注册成功' })
            return res.cc('注册成功', 0)
        })
    })
}
// 登录处理函数
exports.login = (req, res) => {
    // 接收表单数据
    const userinfo = req.body
    // 定义sql语句
    const sql = 'select * from ev_users where username=?'
    // 执行sql语句，根据用户名查询用户信息
    db.query(sql, userinfo.username, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('登录失败')
        // 判断密码是否正确
        // 拿着用户输入的密码,和数据库中存储的密码进行对比
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        // 如果对比的结果等于 false, 则证明用户输入的密码错误
        if (!compareResult) {
            return res.cc('登录失败！')
        }
        // 在服务器端生成token的字符串
        const user = { ...results[0], password: '', user_pic: '' }
        // jwt.sign(对象，密钥，过期时间)
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: '10h' })
        res.send({
            status: 0,
            message: '登录成功',
            token: 'Bearer ' + tokenStr,
        })
    })
}
