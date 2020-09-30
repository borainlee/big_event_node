const { db } = require('../db/db')
const path = require('path')
exports.addArticle = (req, res) => {
    // 判断是否上传了文章封面
    if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！')
    // 表单数据合法，进行下一步操作
    const articleInfo = {
        // 标题、内容、发布状态、所属分类id
        ...req.body,
        // 文章封面的存放路径
        cover_img: path.join('/uploads', req.file.filename),
        // 文章发布时间
        pub_date: new Date(),
        // 文章作者Id
        author_id: req.user.id,
    }
    const sql = `insert into ev_articles set ?`
    db.query(sql, articleInfo, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('发布文章失败！')
        res.cc('发布文章成功', 0)
    })
}
