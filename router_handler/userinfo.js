// 导入数据库操作模块和bcryptjs
const { db, bcrypt } = require('../db/db')
// 获取用户基本信息的处理函数--------------------------------------------
exports.getUserInfo = (req, res) => {
    // 定义查询用户信息的 SQL 语句
    const sql = `select id, username, nickname, email, user_pic from ev_users where id=?`
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, req.user.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但是查询的结果可能为空
        if (results.length !== 1) return res.cc('获取用户信息失败！')
        // 用户信息获取成功
        res.send({
            status: 0,
            message: '获取用户信息成功！',
            data: results[0],
        })
    })
}
// 更新用户信息的处理函数--------------------------------------------------
exports.updateUserInfo = (req, res) => {
    const sql = `update ev_users set ? where id = ?`
    db.query(sql, [req.body, req.body.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('更新用户信息失败！')
        res.cc('更新用户信息成功！', 0)
    })
}
// 重置密码的处理函数-----------------------------------------------------
exports.updatePassword = (req, res) => {
    const sql = `select * from ev_users where id=?`
    // 查询用户是否存在
    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('用户不存在！')
        // 判断旧密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult) return res.cc('旧密码错误！')
        // 旧密码正确
        const sql = 'update ev_users set password = ? where id = ?'
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        db.query(sql, [newPwd, req.user.id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('更新密码失败！')
            res.cc('更新密码成功！', 0)
        })
    })
}
// 更换头像-------------------------------------------------------------
exports.updateAvatar = (req, res) => {
    const sql = `update ev_users set user_pic=? where id=?`
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('更新头像失败！')
        res.cc('更新头像成功', 0)
    })
}
