// 导入mysql模块
const mysql = require('mysql')
// 导入bcrypt模块
const bcrypt = require('bcryptjs')

require('dotenv').config()
// 创建数据库连接对象
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user:  process.env.DB_USER,
    password:  process.env.DB_PWD,
    database:  process.env.DB_NAME,
})
// 向外共享db数据库连接对象
module.exports = {
    db,
    bcrypt,
}
