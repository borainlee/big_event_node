const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')
// 导入验证规则
const {
    update_userinfo_schema,
    update_password_schema,
    update_avatar_schema,
} = require('../schema/user')
// 挂载路由
const userinfo_handler = require('../router_handler/userinfo')
// 获取用户基本信息
router.get('/userinfo', userinfo_handler.getUserInfo)
// 更新用户基本信息
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)
// 更新密码
router.post('/updatepwd', expressJoi(update_password_schema), userinfo_handler.updatePassword)
// 更换头像
router.post('/update/avatar', expressJoi(update_avatar_schema), userinfo_handler.updateAvatar)
module.exports = router
