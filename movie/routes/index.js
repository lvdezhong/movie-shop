var express = require('express')
var multiparty = require('multiparty')
var router = express.Router()

var db = require('../dao/db')
var redis = require('../dao/redis')
var util = require('../util/util')

router.post('/login', async function (req, res) {
  let param = req.body
  let userName = param.userName
  let password = param.password

  let resResult = { code: 200, reason: '成功', result: {} }
  let sql =
    'select user_id userId,user_name userName,password,telephone,status from user where user_name=?'

  let result = await db.execQuery(sql, [userName])
  if (result.length == 0) {
    resResult.code = 201
    resResult.reason = '登录用户名错误'
  } else {
    if (password != result[0].password) {
      resResult.code = 202
      resResult.reason = '登录密码错误'
    } else {
      resResult.code = 200
      resResult.reason = '登录成功'
      resResult.result.user = result[0]
      resResult.result.token = util.createToken({
        username: userName,
        userId: result[0].userId,
      })
    }
  }
  res.json(resResult)
})

router.post('/changUserInfo', async function (req, res) {
  let param = req.body
  let userId = param.userId
  let password = param.password
  let telephone = param.telephone

  let resResult = { code: 200, reason: '成功', result: {} }
  let sql = 'update user set password=?,telephone=? where user_id=?'

  let result = await db.execQuery(sql, [password, telephone, userId])

  res.json(resResult)
})

router.post('/register', async function (req, res) {
  let param = req.body
  let userName = param.userName
  let password = param.password
  let telephone = param.telephone

  let resResult = { code: 200, reason: '成功' }
  // let sql = "insert into user (user_name,password,telephone) values (?,?,?)"

  let sql = 'select * from user where user_name=?'

  let result = await db.execQuery(sql, [userName])
  if (result.length == 0) {
    let sql1 = 'insert into user (user_name,password,telephone) values (?,?,?)'
    try {
      await db.execQuery(sql1, [userName, password, telephone])
      resResult.code = 200
      resResult.reason = '注册成功'
    } catch (e) {
      resResult.code = 201
      resResult.reason = '注册失败'
    }
  } else {
    resResult.code = 201
    resResult.reason = '用户名已存在'
  }
  res.json(resResult)
})

router.get('/menu/list', async function (req, res) {
  let param = req.query || req.params
  // let beginTime = param.beginTime
  // let endTime = param.endTime
  let resResult = { code: 200, reason: '成功' }
  let sql =
    'select menu_id menuId,menu_name menuName,menu_role menuRole from menu'
  let result = await db.execQuery(sql, [])
  resResult.code = 200
  resResult.reason = '登录成功'
  resResult.result = result
  res.json(resResult)
})

//类型管理
router.get('/type/list', async function (req, res) {
  let param = req.query || req.params
  let resResult = { code: 200, reason: '成功' }
  let sql =
    'select type_id typeId,type_name typeName,type_remark typeRemark,type_num typeNum from type'
  let result = await db.execQuery(sql, [])
  resResult.code = 200
  resResult.reason = '成功'
  resResult.result = result
  res.json(resResult)
})

router.post('/type/add', async function (req, res) {
  let param = req.body
  let typeName = param.typeName
  let typeRemark = param.typeRemark
  let resResult = { code: 200, reason: '成功' }
  let sql = 'insert into type (type_name,type_remark) value (?,?)'
  let result = await db.execQuery(sql, [typeName, typeRemark])
  resResult.code = 200
  resResult.reason = '成功'
  resResult.result = result
  res.json(resResult)
})

router.post('/type/update', async function (req, res) {
  let param = req.body
  let typeId = param.typeId
  let typeName = param.typeName
  let typeRemark = param.typeRemark
  let resResult = { code: 200, reason: '成功' }
  if (typeId == null || typeId == '') {
    resResult.code = 201
    resResult.reason = '请选择类型'
    res.json(resResult)
  } else {
    let sql = 'update type set type_name=?,type_remark=? where type_id=?'
    let result = await db.execQuery(sql, [typeName, typeRemark, typeId])
    resResult.code = 200
    resResult.reason = '成功'
    resResult.result = result
    res.json(resResult)
  }
})

router.post('/type/delete', async function (req, res) {
  let param = req.body
  let typeId = param.typeId
  let resResult = { code: 200, reason: '成功' }
  if (typeId == null || typeId == '') {
    resResult.code = 201
    resResult.reason = '请选择要删除的类型'
    res.json(resResult)
  } else {
    let sql = 'delete from type where type_id=?'
    let result = await db.execQuery(sql, [typeId])
    resResult.code = 200
    resResult.reason = '成功'
    resResult.result = result
    res.json(resResult)
  }
})

//商品管理
router.get('/product/list', async function (req, res) {
  let param = req.query || req.params
  let resResult = { code: 200, reason: '成功' }
  let sql =
    'SELECT product_id AS productId,product_no AS productNo,product_name AS productName, out_price AS outPrice, CONCAT("http://localhost:3000/getFile/",product_url) AS productUrl,remark,rating,ratingCount FROM product'
  let result = await db.execQuery(sql, [])
  resResult.code = 200
  resResult.reason = '成功'
  resResult.result = result
  res.json(resResult)
})

router.get('/product/detail', async function (req, res) {
  let param = req.query || req.params
  let { productId } = param
  let resResult = { code: 200, reason: '成功', result: {} }
  let sql = `
    SELECT
      product_id AS productId,
      product_no AS productNo,
      product_name AS productName,
      out_price AS outPrice,
      CONCAT("http://localhost:3000/getFile/",product_url) AS productUrl,
      remark,
      IFNULL(rating, 0) AS rating,
      IFNULL(ratingCount, 0) AS ratingCount
    FROM product
    WHERE product_id = ?
  `
  let result = await db.execQuery(sql, [productId])
  let commentsSql = `
    SELECT
      pc.comments_id AS commentsId,
      pc.product_id AS productId,
      pc.comments_content AS commentsContent,
      pc.rating AS rating,
      pc.comments_time AS commentsTime,
      pc.state AS state,
      u.user_name AS userName
    FROM product_comments pc
    LEFT JOIN user u ON pc.user_id = u.user_id
    WHERE pc.product_id = ?
    ORDER BY pc.comments_time DESC
  `
  let commentsResult = await db.execQuery(commentsSql, [productId])
  resResult.code = 200
  resResult.reason = '成功'
  resResult.result = { ...result[0], comments: commentsResult }
  res.json(resResult)
})

router.get('/product_comments/list', async function (req, res) {
  let param = req.query || req.params
  let { productId } = param

  // 校验必要参数
  if (!productId || productId <= 0) {
    return res.json({ code: 201, reason: '请求参数错误' })
  }

  let resResult = { code: 200, reason: '成功' }
  let sql = `
    SELECT
      pc.comments_id AS commentsId,
      pc.product_id AS productId,
      pc.comments_content AS commentsContent,
      pc.rating AS rating,
      DATE_FORMAT(pc.comments_time, '%Y-%m-%d %H:%i:%s') AS commentsTime,
      pc.state AS state,
      pc.user_id AS userId,
      u.user_name AS userName,
      CASE
        WHEN pc.state = '1' THEN '待审核'
        WHEN pc.state = '2' THEN '已审核'
        WHEN pc.state = '3' THEN '已拒绝'
        ELSE '其他'
      END AS stateText
    FROM product_comments pc
    LEFT JOIN user u ON pc.user_id = u.user_id
    WHERE pc.product_id = ?
    ORDER BY pc.comments_time DESC
  `

  try {
    let result = await db.execQuery(sql, [productId])
    resResult.result = result
  } catch (e) {
    console.error('查询评论失败:', e)
    resResult.code = 500
    resResult.reason = '查询失败'
  }

  res.json(resResult)
})

router.post('/product_comments/add', async function (req, res) {
  let param = req.body

  let { productId, commentsContent, rating, userId } = param

  let resResult = { code: 200, reason: '成功' }

  // 参数校验
  if (!productId || !commentsContent) {
    return res.json({ code: 201, reason: '商品ID和评论内容必填' })
  }

  // 设置默认状态：待审核
  const state = '1'

  // 验证评分范围（1-5分）
  if (rating && (rating < 1 || rating > 5)) {
    return res.json({ code: 201, reason: '评分必须在1-5分之间' })
  }

  let sql = `
    INSERT INTO product_comments
      (product_id, comments_content, rating, user_id, state)
    VALUES (?, ?, ?, ?, ?)
  `

  try {
    // 添加评论
    await db.execQuery(sql, [
      productId,
      commentsContent,
      rating || null,
      userId,
      state,
    ])

    // 如果有评分，更新商品的平均评分和评分人数
    if (rating) {
      const updateRatingSql = `
        UPDATE product p
        SET
          rating = ROUND(
            (
              SELECT AVG(rating)
              FROM product_comments
              WHERE product_id = ? AND rating IS NOT NULL
            ), 1
          ),
          ratingCount = (
            SELECT COUNT(*)
            FROM product_comments
            WHERE product_id = ? AND rating IS NOT NULL
          )
        WHERE product_id = ?
      `

      await db.execQuery(updateRatingSql, [productId, productId, productId])
    }

    resResult.reason = '评论提交成功，请等待审核'
  } catch (e) {
    console.error('保存评论失败:', e)
    resResult.code = 500
    resResult.reason = '保存失败'
  }

  res.json(resResult)
})

//购物车
router.get('/shopping_cart/list', async function (req, res) {
  let resResult = { code: 200, reason: '成功', result: [] }
  let { userId } = req.query || req.params
  let sql = `
    SELECT
      id AS id,
      shopping_cart.product_id AS productId,
      product_name AS productName,
      out_price AS outPrice,
      product_num AS productNum,
      subtotal AS subtotal
    FROM shopping_cart left join product on shopping_cart.product_id = product.product_id
    WHERE shopping_cart.user_id = ?
  `

  try {
    let result = await db.execQuery(sql, [userId])
    resResult.result = result
    res.json(resResult)
  } catch (e) {
    console.error('查询购物车失败:', e)
    resResult.code = 500
    resResult.reason = '查询失败'
    res.json(resResult)
  }
})

router.post('/shopping_cart/add', async function (req, res) {
  let param = req.body

  let { productId, productNum, outPrice, userId } = param

  let resResult = { code: 200, reason: '成功', result: {} }

  if (!productId || !productNum) {
    return res.json({ code: 201, reason: '商品ID和数量必填' })
  }

  // 查询是否存在该商品
  let existSql = `SELECT * FROM shopping_cart WHERE product_id = ? and user_id = ?`
  let existArgs = [productId, userId]
  try {
    let existResult = await db.execQuery(existSql, existArgs)

    if (existResult.length > 0) {
      // 如果存在，更新数量和价格
      let product = existResult[0]
      console.log(existResult[0])
      console.log(product.product_num)
      console.log(productNum)
      let subtotal = (product.product_num + productNum) * outPrice
      let updateSql = `UPDATE shopping_cart SET product_num = ?, subtotal = ? WHERE id = ?`
      let updateArgs = [product.product_num + productNum, subtotal, product.id]
      await db.execQuery(updateSql, updateArgs)
    } else {
      let subtotal = productNum * outPrice
      let insertSql = `
        INSERT INTO shopping_cart
          (product_id, product_num, subtotal,user_id)
        VALUES (?, ?, ?,?)
      `
      await db.execQuery(insertSql, [productId, productNum, subtotal, userId])
    }

    res.json(resResult)
  } catch (e) {
    console.error('添加购物车失败:', e)
    resResult.code = 500
    resResult.reason = '添加失败'
    res.json(resResult)
  }
})

router.post('/shopping_cart/delete', async function (req, res) {
  let param = req.body
  let { id } = param

  let resResult = { code: 200, reason: '成功' }

  // 参数校验
  if (!id || id <= 0) {
    resResult.code = 201
    resResult.reason = '请选择要删除的购物车项'
    return res.json(resResult)
  }

  let sql = 'DELETE FROM shopping_cart WHERE id = ?'

  try {
    await db.execQuery(sql, [id])
    res.json(resResult)
  } catch (e) {
    console.error('删除失败:', e)
    resResult.code = 500
    resResult.reason = '删除失败'
    res.json(resResult)
  }
})

//订单管理
router.get('/order/list', async function (req, res) {
  let param = req.query
  let { userId } = param

  let resResult = { code: 200, reason: '成功', result: [] }

  // 先查询用户状态
  let userSql = 'SELECT status FROM user WHERE user_id = ?'
  let userResult = await db.execQuery(userSql, [userId])

  // 构建订单查询SQL
  let sql = `
    SELECT
      order_id AS orderId,
      order_no AS orderNo,
      DATE_FORMAT(order_time, '%Y-%m-%d %H:%i:%s') AS orderTime,
      total AS total,
      total_num AS totalNum,
      order_state AS orderState,
      CASE
        WHEN order_state = '1' THEN '待处理'
        WHEN order_state = '2' THEN '已完成'
        WHEN order_state = '3' THEN '已取消'
        ELSE '其他'
      END AS stateText,
      u.user_name AS userName
    FROM \`order\` o
    LEFT JOIN user u ON o.user_id = u.user_id
  `

  let args = []

  // 如果不是管理员，只查询自己的订单
  if (!userResult[0] || userResult[0].status !== '1') {
    sql += ' WHERE o.user_id = ?'
    args.push(userId)
  }

  sql += ' ORDER BY o.order_time DESC'

  let detailSql = `
    SELECT
      product_name AS productName,
      product_num AS productNum,
      out_price AS outPrice,
      order_no AS orderNo,
      subtotal AS total
    FROM \`order_detail\`
  `

  let detailArgs = []

  // 如果不是管理员，只查询自己的订单详情
  if (!userResult[0] || userResult[0].status !== '1') {
    detailSql += ' WHERE user_id = ?'
    detailArgs.push(userId)
  }

  try {
    let result = await db.execQuery(sql, args)
    let detailResult = await db.execQuery(detailSql, detailArgs)

    for (let order of result) {
      order.items = []
      for (let detail of detailResult) {
        if (order.orderNo == detail.orderNo) {
          order.items.push(detail)
        }
      }
    }

    resResult.result = result
    res.json(resResult)
  } catch (e) {
    console.error('查询失败:', e)
    resResult.code = 500
    resResult.reason = '查询失败'
    res.json(resResult)
  }
})

router.post('/order/add', async function (req, res) {
  let param = req.body

  let { userId, proudctList } = param

  let resResult = { code: 200, reason: '成功', result: {} }

  // 校验必要字段
  if (proudctList.length == 0 || userId == '') {
    return res.json({ code: 201, reason: '信息缺失' })
  }
  let orderNo = generateOrderNumber()
  let total = 0
  let totalNum = 0
  let remark = ''
  let detailSql =
    'INSERT INTO order_detail ( order_no, product_id, product_num,product_name, out_price, subtotal,user_id ) VALUES '
  for (let i = 0; i < proudctList.length; i++) {
    let item = proudctList[i]
    total += item.outPrice * item.productNum
    totalNum += item.productNum
    remark += item.productName + '|'
    detailSql += `('${orderNo}',${item.productId},${item.productNum},'${
      item.productName
    }',${item.outPrice},${(item.outPrice * item.productNum).toFixed(
      2
    )},${userId}),`
  }
  remark = remark.substring(0, remark.length - 1)
  detailSql = detailSql.substring(0, detailSql.length - 1)
  let sql = `
    INSERT INTO \`order\` (
      order_no, user_id,remark,total,total_num
    ) VALUES (?, ?, ?,?,?)
  `

  try {
    let result = await db.execQuery(sql, [
      orderNo,
      userId,
      remark,
      total,
      totalNum,
    ])
    await db.execQuery(detailSql, [])

    // 清除购物车
    let clearCartSql = 'DELETE FROM shopping_cart WHERE user_id = ?'
    await db.execQuery(clearCartSql, [userId])

    res.json(resResult)
  } catch (e) {
    console.error('添加失败:', e)
    resResult.code = 500
    resResult.reason = '添加失败'
    res.json(resResult)
  }
})

router.post('/order/update', async function (req, res) {
  let param = req.body
  let { orderId, state } = param

  let resResult = { code: 200, reason: '成功', result: {} }

  if (!orderId || orderId <= 0) {
    resResult.code = 201
    resResult.reason = '请选择要付款的订单'
    return res.json(resResult)
  }

  let sql = 'update `order` set order_state=? WHERE order_id = ?'

  try {
    await db.execQuery(sql, [state, orderId])
    res.json(resResult)
  } catch (e) {
    console.error('更新失败:', e)
    resResult.code = 500
    resResult.reason = '更新失败'
    res.json(resResult)
  }
})

router.post('/order/delete', async function (req, res) {
  let param = req.body
  let { orderId } = param

  let resResult = { code: 200, reason: '成功' }

  if (!orderId || orderId <= 0) {
    resResult.code = 201
    resResult.reason = '请选择要删除的订单'
    return res.json(resResult)
  }

  let sql = 'update `order` set order_state=? WHERE order_id = ?'

  try {
    await db.execQuery(sql, [3, orderId])
    res.json(resResult)
  } catch (e) {
    console.error('删除失败:', e)
    resResult.code = 500
    resResult.reason = '删除失败'
    res.json(resResult)
  }
})

// 内容管理
router.get('/movie/list', async function (req, res) {
  let param = req.query || req.params
  let pageNo = param.pageNo
  let pageSize = param.pageSize
  let typeId = param.typeId
  let offset = (pageNo - 1) * pageSize
  let resResult = { code: 200, reason: '成功' }

  // 构建缓存键
  let cacheKey = typeId ? `movie:list:type:${typeId}` : 'movie:list:all'

  // 尝试从缓存获取数据
  try {
    const cachedData = await redis.getCache(cacheKey)
    if (cachedData) {
      resResult.result = cachedData
      res.json(resResult)
      return
    }
  } catch (err) {
    console.error('Redis缓存获取失败，继续查询数据库:', err)
  }

  // 缓存未命中，查询数据库
  let args = []
  let sql = `
    SELECT
      movie_id AS movieId,
      movie_name AS movieName,
      type_id AS typeId,
      director AS director,
      starring AS starring,
      year AS year,
      remark AS remark,
      CONCAT("http://localhost:3000/getFile/",img_url) AS imgUrl,
      state AS state,
      rating AS rating,
      ratingCount AS ratingCount
    FROM movie
    where 1=1
  `
  if (typeId != null && typeId != '') {
    sql = sql + ' and type_id = ?'
    args.push(typeId)
  }

  try {
    let result = await db.execQuery(sql, args)
    resResult.code = 200
    resResult.reason = '成功'
    resResult.result = result

    // 将结果存入缓存，设置5分钟过期时间
    try {
      await redis.setCache(cacheKey, result, 300)
    } catch (err) {
      console.error('Redis缓存设置失败:', err)
    }

    res.json(resResult)
  } catch (err) {
    console.error('数据库查询失败:', err)
    resResult.code = 500
    resResult.reason = '查询失败'
    res.json(resResult)
  }
})

router.get('/movie/isFavorite', async function (req, res) {
  let param = req.query || req.params
  let { userId, movieId } = param

  let resResult = { code: 200, reason: '成功', result: { isFavorite: 0 } }
  let sql =
    'SELECT  count(*) count FROM collect where movie_id=? and user_id=? '
  let result = await db.execQuery(sql, [movieId, userId])
  resResult.code = 200
  resResult.reason = '成功'
  resResult.result.isFavorite = result[0].count

  res.json(resResult)
})

router.get('/movie/detail', async function (req, res) {
  let param = req.query || req.params

  let { userId, movieId } = param

  let resResult = { code: 200, reason: '成功', result: {} }
  // 校验必要参数
  if (!movieId) {
    resResult.code = 201
    resResult.reason = '请提供影片ID'
    return res.json(resResult)
  }
  let args = []
  let sql = `
    SELECT
      movie_id AS movieId,
      movie_name AS movieName,
      type_id AS typeId,
      director AS director,
      starring AS starring,
      year AS year,
      remark AS remark,
      CONCAT("http://localhost:3000/getFile/",img_url) AS imgUrl,
      state AS state,
      IFNULL(rating, 0) AS rating,
      IFNULL(ratingCount, 0) AS ratingCount
    FROM movie
    where movie_id = ?
  `
  args.push(movieId)

  let result = await db.execQuery(sql, args)
  resResult.code = 200
  resResult.reason = '成功'

  resResult.result.movie = result[0]

  if (userId != null && userId != '') {
    let sql1 = 'SELECT * from collect where movie_id = ? and  user_id= ?'
    let collectResult = await db.execQuery(sql1, [movieId, userId])
    if (collectResult.length > 0) {
      resResult.result.movie.isCollect = true
    } else {
      resResult.result.movie.isCollect = false
    }
  } else {
    resResult.result.movie.isCollect = false
  }
  let selectCommonSql =
    'SELECT * from movie_comments where movie_id = ? and `state` = 2 order by comments_time desc'
  let commonResult = await db.execQuery(selectCommonSql, [movieId])
  resResult.result.comments = commonResult
  res.json(resResult)
})

router.post('/movie/add', async function (req, res) {
  let param = req.body
  let { movieName, typeId, director, starring, year, remark, imgUrl } = param

  let resResult = { code: 200, reason: '成功' }

  let sql =
    'INSERT INTO movie (movie_name, type_id, director, starring, year, remark, img_url) VALUES (?, ?, ?, ?, ?, ?, ?)'

  try {
    await db.execQuery(sql, [
      movieName,
      typeId,
      director,
      starring,
      year,
      remark,
      imgUrl,
    ])

    // 清除电影列表缓存
    try {
      await redis.clearMovieListCache()
    } catch (err) {
      console.error('清除缓存失败:', err)
    }
  } catch (e) {
    console.error('插入失败:', e)
    resResult.code = 500
    resResult.reason = '插入失败'
  }

  res.json(resResult)
})

router.post('/movie/update', async function (req, res) {
  let param = req.body

  let {
    movieId,
    movieName,
    typeId,
    director,
    starring,
    year,
    remark,
    imgUrl,
    state,
  } = param

  let resResult = { code: 200, reason: '成功' }

  // 校验必要参数
  if (!movieId) {
    resResult.code = 201
    resResult.reason = '请提供影片ID'
    return res.json(resResult)
  }

  let sql = `
    UPDATE movie
    SET movie_name = ?,
        type_id = ?,
        director = ?,
        starring = ?,
        year = ?,
        remark = ?,
        img_url = ?,
        state = ?
    WHERE movie_id = ?;
  `

  try {
    await db.execQuery(sql, [
      movieName,
      typeId,
      director,
      starring,
      year,
      remark,
      imgUrl,
      state,
      movieId,
    ])

    // 清除电影列表缓存
    try {
      await redis.clearMovieListCache()
    } catch (err) {
      console.error('清除缓存失败:', err)
    }

    resResult.reason = '更新成功'
  } catch (e) {
    console.error('更新失败:', e)
    resResult.code = 500
    resResult.reason = '更新失败'
  }

  res.json(resResult)
})

router.post('/movie/delete', async function (req, res) {
  let param = req.body
  let movieId = param.movieId

  let resResult = { code: 200, reason: '成功' }

  // 校验必要参数
  if (!movieId || movieId <= 0) {
    resResult.code = 201
    resResult.reason = '请选择要删除的影片'
    return res.json(resResult)
  }

  let sql = 'DELETE FROM movie WHERE movie_id = ?'
  let sql2 = 'DELETE FROM collect WHERE movie_id = ?'
  let sql3 = 'DELETE FROM movie_comments WHERE movie_id = ?'

  try {
    await db.execQuery(sql, [movieId])
    await db.execQuery(sql2, [movieId])
    await db.execQuery(sql3, [movieId])

    // 清除电影列表缓存
    try {
      await redis.clearMovieListCache()
    } catch (err) {
      console.error('清除缓存失败:', err)
    }

    resResult.reason = '删除成功'
  } catch (e) {
    console.error('删除失败:', e)
    resResult.code = 500
    resResult.reason = '删除失败'
  }

  res.json(resResult)
})

//影片评论
router.get('/movie_comments/list', async function (req, res) {
  let param = req.query || req.params
  let { movieId } = param

  let resResult = { code: 200, reason: '成功', result: [] }

  let sql = `
    SELECT
        mc.comments_id AS commentsId,
        mc.movie_id AS movieId,
        mc.comments_content AS commentsContent,
        mc.score AS score,
        DATE_FORMAT(mc.comments_time, '%Y-%m-%d %H:%i:%s') AS commentsTime,
        mc.state AS state,
        mc.user_id AS userId,
        u.user_name AS userName,

        CASE WHEN mc.state = '1' THEN '待审核'
		          WHEN mc.state = '2' THEN '已审核'
		          WHEN mc.state = '3' THEN '已拒绝' ELSE '其他' END AS stateText
    FROM movie_comments mc left join user u on mc.user_id = u.user_id
    WHERE mc.movie_id = ? and mc.state = '2'
    ORDER BY comments_time DESC
  `

  try {
    let result = await db.execQuery(sql, [movieId])
    resResult.result = result
  } catch (e) {
    console.error('查询评论失败:', e)
    resResult.code = 500
    resResult.reason = '查询失败'
  }

  res.json(resResult)
})

router.get('/movie_comments/listAll', async function (req, res) {
  let param = req.query || req.params
  let { commentsContent } = param

  let resResult = { code: 200, reason: '成功', result: [] }

  let sql = `
    SELECT
        mc.comments_id AS commentsId,
        mc.movie_id AS movieId,
        mc.comments_content AS commentsContent,
        mc.score AS score,
        DATE_FORMAT(mc.comments_time, '%Y-%m-%d %H:%i:%s') AS commentsTime,
        mc.state AS state,
        mc.user_id AS userId,
        u.user_name AS userName,
        m.movie_name AS movieName,
        CASE WHEN mc.state = '1' THEN '待审核'
		          WHEN mc.state = '2' THEN '已审核'
		          WHEN mc.state = '3' THEN '已拒绝' ELSE '其他' END AS stateText
    FROM movie_comments mc left join user u on mc.user_id = u.user_id left join movie m on mc.movie_id = m.movie_id
    where mc.comments_content like concat('%', ?, '%')
    ORDER BY comments_time DESC
  `

  try {
    let result = await db.execQuery(sql, [commentsContent])
    resResult.result = result
  } catch (e) {
    console.error('查询评论失败:', e)
    resResult.code = 500
    resResult.reason = '查询失败'
  }

  res.json(resResult)
})

router.post('/movie_comments/add', async function (req, res) {
  let param = req.body

  let { movieId, commentsContent, score, userId } = param

  let resResult = { code: 200, reason: '成功' }

  // 参数校验
  if (!movieId || !commentsContent) {
    return res.json({ code: 201, reason: '影片ID和评论内容必填' })
  }

  // 设置默认状态：待审核
  const state = '1'

  // 验证评分范围（1-5分）
  if (score && (score < 1 || score > 5)) {
    return res.json({ code: 201, reason: '评分必须在1-5分之间' })
  }

  let sql = `
    INSERT INTO movie_comments (movie_id, comments_content, score, user_id, state)
    VALUES (?, ?, ?, ?, ?);
  `

  try {
    // 添加评论
    await db.execQuery(sql, [
      movieId,
      commentsContent,
      score || null,
      userId,
      state,
    ])

    // 更新影片的平均评分和评分人数（移除 state = '2' 条件，让所有有效评分的评论都计入）
    const updateRatingSql = `
      UPDATE movie m
      SET
        rating = ROUND(
          (
            SELECT AVG(score)
            FROM movie_comments
            WHERE movie_id = ? AND score IS NOT NULL
          ), 1
        ),
        ratingCount = (
          SELECT COUNT(*)
          FROM movie_comments
          WHERE movie_id = ? AND score IS NOT NULL
        )
      WHERE movie_id = ?
    `

    await db.execQuery(updateRatingSql, [movieId, movieId, movieId])

    resResult.reason = '评论提交成功，请等待审核'
  } catch (e) {
    console.error('保存评论失败:', e)
    resResult.code = 500
    resResult.reason = '保存失败'
  }

  res.json(resResult)
})

router.post('/movie_comments/updateState', async function (req, res) {
  let param = req.body
  console.log(param)
  let { commentsId, state } = param

  let resResult = { code: 200, reason: '成功' }

  // 参数校验
  if (!commentsId || !state) {
    return res.json({ code: 201, reason: '请提供评论ID和状态' })
  }

  // 可选：增加状态值校验（例如只允许 2 或 3）
  if (![2, 3].includes(state)) {
    return res.json({ code: 201, reason: '状态值不合法' })
  }

  let sql = 'UPDATE movie_comments SET state = ? WHERE comments_id = ?'

  try {
    await db.execQuery(sql, [state, commentsId])
    resResult.reason = '状态更新成功'
    // if (state == 2) {// 评论审核通过更新评分
    //   let commentScopeSql = "select AVG(mc.score) avgScope from movie_comments mc where mc.movie_id = ? and mc.state = 2 group by movie_id "
    //   let commentScopeArg = [movieId]
    //   let commentScopeResult = await db.execQuery(commentScopeSql, commentScopeArg)
    //   if (commentScopeArg.length > 0) {
    //     let movieScopeSql = "update movie set movie_scope = ? where movie_id = ?"
    //     let movieScopeArg = [commentScopeResult[0].avgScope, movieId]
    //     await db.execQuery(movieScopeSql, movieScopeArg)
    //   }
    // }
  } catch (e) {
    console.error('状态更新失败:', e)
    resResult.code = 500
    resResult.reason = '更新失败'
  }

  res.json(resResult)
})

router.post('/movie_comments/delete', async function (req, res) {
  let param = req.body
  let { commentsId } = param

  let resResult = { code: 200, reason: '成功' }

  // 参数校验
  if (!commentsId || commentsId <= 0) {
    resResult.code = 201
    resResult.reason = '请选择要删除的评论'
    return res.json(resResult)
  }

  let sql = 'DELETE FROM movie_comments WHERE comments_id = ?'

  try {
    await db.execQuery(sql, [commentsId])
    resResult.reason = '删除成功'
  } catch (e) {
    console.error('删除失败:', e)
    resResult.code = 500
    resResult.reason = '删除失败'
  }

  res.json(resResult)
})

//影片收藏
router.get('/movie_collet/list', async function (req, res) {
  let param = req.query
  let { userId } = param

  if (userId) {
    let resResult = { code: 200, reason: '成功', result: [] }

    let sql = `
      SELECT
        c.collect_id AS collectId,
        c.movie_id AS movieId,
        CASE
          WHEN c.movie_id IS NULL THEN '已删除'
          ELSE m.movie_name
        END AS movieName,
        CASE
          WHEN c.movie_id IS NULL THEN NULL
          ELSE m.type_id
        END AS typeId,
        CASE
          WHEN c.movie_id IS NULL THEN NULL
          ELSE m.director
        END AS director,
        CASE
          WHEN c.movie_id IS NULL THEN NULL
          ELSE m.starring
        END AS starring,
        CASE
          WHEN c.movie_id IS NULL THEN NULL
          ELSE m.year
        END AS year,
        CASE
          WHEN c.movie_id IS NULL THEN '该电影已被删除'
          ELSE m.remark
        END AS remark,
        CASE
          WHEN c.movie_id IS NULL THEN NULL
          ELSE m.img_url
        END AS imgUrl,
        CASE
          WHEN c.movie_id IS NULL THEN 1
          ELSE 0
        END AS isDeleted
      FROM collect c
      LEFT JOIN movie m ON m.movie_id = c.movie_id
      WHERE c.user_id = ?
    `

    try {
      let result = await db.execQuery(sql, [userId])
      resResult.result = result
    } catch (e) {
      console.error('查询收藏失败:', e)
      resResult.code = 500
      resResult.reason = '查询失败'
    }

    res.json(resResult)
  } else {
    return res.json({ code: 201, reason: '请提供用户ID' })
  }
})

router.post('/movie_collet/add', async function (req, res) {
  let param = req.body
  let { userId, movieId } = param

  if (userId && movieId) {
    let resResult = { code: 200, reason: '成功', result: [] }

    let sql = 'insert into collect (user_id,movie_id) values (?,?)'

    try {
      let result = await db.execQuery(sql, [userId, movieId])
      resResult.result = result
    } catch (e) {
      console.error('收藏失败:', e)
      resResult.code = 500
      resResult.reason = '查询失败'
    }

    res.json(resResult)
  } else {
    return res.json({ code: 201, reason: '请提供用户ID及影片ID' })
  }
})

router.post('/movie_collet/delete', async function (req, res) {
  let param = req.body
  let { movieId, userId } = param

  let resResult = { code: 200, reason: '成功' }

  let sql = 'DELETE FROM collect WHERE movie_id = ? and user_id = ?'

  try {
    await db.execQuery(sql, [movieId, userId])
    resResult.reason = '删除成功'
  } catch (e) {
    console.error('删除失败:', e)
    resResult.code = 500
    resResult.reason = '删除失败'
  }

  res.json(resResult)
})

router.post('/movie_collet/deleteAllByUser', async function (req, res) {
  let param = req.body
  let { userId } = param

  let resResult = { code: 200, reason: '成功' }

  // 参数校验
  if (!userId || userId <= 0) {
    resResult.code = 201
    resResult.reason = '请求参数错误'
    return res.json(resResult)
  }

  let sql = 'DELETE FROM collect WHERE user_id = ?'

  try {
    await db.execQuery(sql, [userId])
    resResult.reason = '删除成功'
  } catch (e) {
    console.error('删除失败:', e)
    resResult.code = 500
    resResult.reason = '删除失败'
  }

  res.json(resResult)
})

//上传封面
router.post('/upload', function (req, res) {
  var form = new multiparty.Form()
  form.uploadDir = __dirname + '/../uploads'
  console.log(form.uploadDir)
  //上传完成后处理
  form.parse(req, function (err, fields, files) {
    const file = files.file[0]
    const pathTemp = file.path.split('/')
    const path = pathTemp[pathTemp.length - 1]
    res.json({
      code: 200,
      reason: '成功',
      result: {
        path: path,
      },
    })
  })
})

router.get('/getFile/:fileName', async function (req, res) {
  const basePath = __dirname + '/../uploads'
  let fileName = req.params.fileName
  let filePath = basePath + '/' + fileName
  let fs = require('fs')
  fs.readFile(filePath, 'binary', function (err, file) {
    console.log(err)
    res.writeHead(200, {
      'Content-Type': 'image/png',
    })
    res.write(file, 'binary')
    res.end()
  })

  // res.sendFile(filePath);
})

function generateOrderNumber() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0') // Months are zero-based
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  // Optional: Add a random number or sequence for uniqueness
  const randomNum = Math.floor(Math.random() * 900) + 100 // Generates 3-digit number

  return `ORD${year}${month}${day}${hours}${minutes}${seconds}${randomNum}`
}

// 查询用户信息
router.get('/user/info', async function (req, res) {
  let param = req.query || req.params
  let { userId } = param

  let resResult = { code: 200, reason: '成功', result: {} }

  // 校验必要参数
  if (!userId) {
    resResult.code = 201
    resResult.reason = '请提供用户ID'
    return res.json(resResult)
  }

  let sql = `
    SELECT
      user_id AS userId,
      user_name AS userName,
      password,
      telephone,
      status,
      CASE
        WHEN status = '1' THEN '正常'
        WHEN status = '2' THEN '禁用'
        ELSE '未知'
      END AS statusText
    FROM user
    WHERE user_id = ?
  `

  try {
    let result = await db.execQuery(sql, [userId])
    if (result.length === 0) {
      resResult.code = 201
      resResult.reason = '用户不存在'
    } else {
      // 不返回密码等敏感信息
      resResult.result = result[0]
    }
  } catch (e) {
    console.error('查询用户信息失败:', e)
    resResult.code = 500
    resResult.reason = '查询失败'
  }

  res.json(resResult)
})

// 更新用户信息
router.post('/user/update', async function (req, res) {
  let param = req.body
  let { userId, userName, telephone, password } = param

  let resResult = { code: 200, reason: '成功' }

  // 校验必要参数
  if (!userId) {
    resResult.code = 201
    resResult.reason = '请提供用户ID'
    return res.json(resResult)
  }

  // 如果更新用户名，需要检查是否已存在
  if (userName) {
    let checkSql =
      'SELECT COUNT(*) as count FROM user WHERE user_name = ? AND user_id != ?'
    let checkResult = await db.execQuery(checkSql, [userName, userId])
    if (checkResult[0].count > 0) {
      resResult.code = 201
      resResult.reason = '用户名已存在'
      return res.json(resResult)
    }
  }

  // 构建更新SQL
  let updateFields = []
  let updateValues = []

  if (userName) {
    updateFields.push('user_name = ?')
    updateValues.push(userName)
  }
  if (telephone) {
    updateFields.push('telephone = ?')
    updateValues.push(telephone)
  }
  if (password) {
    updateFields.push('password = ?')
    updateValues.push(password)
  }

  if (updateFields.length === 0) {
    resResult.code = 201
    resResult.reason = '没有要更新的信息'
    return res.json(resResult)
  }

  updateValues.push(userId)
  let sql = `UPDATE user SET ${updateFields.join(', ')} WHERE user_id = ?`

  try {
    await db.execQuery(sql, updateValues)
    resResult.reason = '更新成功'
  } catch (e) {
    console.error('更新用户信息失败:', e)
    resResult.code = 500
    resResult.reason = '更新失败'
  }

  res.json(resResult)
})

module.exports = router
