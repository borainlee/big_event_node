const { db } = require('../db/db')
// 获取文章列表
exports.getArticleCates = (req, res) => {
    const sql = `select * from ev_article_cate where is_delete=0 order by id asc`
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取文章分类数据成功！',
            data: results,
        })
    })
}
// 新增文章
exports.addArticleCates = (req, res) => {
    // 定义查询分类名称和别名是否被占用
    const sql = `select * from ev_article_cate where name=? or alias=?`
    // 执行查重操作
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 分类名称 和 分类别名 都被占用
        if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        if (
            results.length === 1 &&
            results[0].name === req.body.name &&
            results[0].alias === req.body.alias
        )
            return res.cc('分类名称与别名被占用，请更换后重试！')
        // 分类名称 或 分类别名 被占用
        if (results.length === 1 && results[0].name === req.body.name)
            return res.cc('分类名称被占用，请更换后重试！')
        if (results.length === 1 && results[0].alias === req.body.alias)
            return res.cc('分类别名被占用，请更换后重试！')

        // TODO：新增文章分类
        const sql = `insert into ev_article_cate set ?`
        db.query(sql, req.body, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('新增文章分类失败！')
            res.cc('新增文章分类成功', 0)
        })
    })
}
// 删除文章分类的处理函数
exports.deleteCateById = (req, res) => {
    const sql = `update ev_article_cate set is_delete=1 where id=?`
    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('删除文章分类失败！')
        res.cc('删除文章分类成功', 0)
    })
}
// 获取文章分类的处理函数
exports.getArtCateById = (req, res) => {
    const sql = `select * from ev_article_cate where id=?`
    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('获取文章分类失败！')
        res.send({
            status: 0,
            message: '获取文章分类成功！',
            data: results[0],
        })
    })
}
exports.updateArtCateById = (req, res) => {
    // 定义分类名称和分类别名是否被占用
    const sql = `select * from ev_article_cate where Id<>? and (name=? or alias=?)`
    db.query(sqlStr, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
        if (err) return res.cc(err)
        // 分类名称 和 分类别名 都被占用
        if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        if (
            results.length === 1 &&
            results[0].name === req.body.name &&
            results[0].alias === req.body.alias
        )
            return res.cc('分类名称与别名被占用，请更换后重试！')
        // 分类名称 或 分类别名 被占用
        if (results.length === 1 && results[0].name === req.body.name)
            return res.cc('分类名称被占用，请更换后重试！')
        if (results.length === 1 && results[0].alias === req.body.alias)
            return res.cc('分类别名被占用，请更换后重试！')
    })
}
