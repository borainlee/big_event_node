const express = require('express')
const router = express.Router()
// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入文章分类的验证模块
const {
    add_cate_schema,
    delete_cate_schema,
    get_cate_schema,
    update_cate_schema,
} = require('../schema/artcate')

const article_handler = require('../router_handler/artcates')
// 获取文章列表
router.get('/cates', article_handler.getArticleCates)
// 新增文章列表
router.post('/addcates', expressJoi(add_cate_schema), article_handler.addArticleCates)
// 根据Id删除文章分类
router.get('/deletecate/:id', expressJoi(delete_cate_schema), article_handler.deleteCateById)
// 根据id获取文章分类
router.get('/cates/:id', expressJoi(get_cate_schema), article_handler.getArtCateById)
// 根据id更新文章分类
router.post('/cates/:id', expressJoi(update_cate_schema), article_handler.updateArtCateById)
module.exports = router
