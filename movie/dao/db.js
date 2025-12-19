var mysql = require('mysql2')

var pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'lvdezhong',
  database: 'movie_shop',
  port: '3306',
  decimalNumbers: true,
})

/**
 * 释放数据库连接
 */
exports.release = function (connection) {
  connection.end(function (error) {
    console.log('Connection closed')
  })
}

/**
 * 执行查询
 */
exports.execQuery = async function (sql, args) {
  try {
    const connection = await new Promise((resolve, reject) => {
      pool.getConnection((error, connection) => {
        if (error) {
          console.log(error)
          reject(error)
        } else {
          resolve(connection)
        }
      })
    })
    return new Promise((resolve, reject) => {
      connection.query(sql, args, (error, results) => {
        connection.release((error) => {
          if (error) {
            console.log(sql + ' ' + args + '执行异常 释放连接' + error)
          }
        })
        if (error) {
          console.log(sql + ' ' + args + '执行异常' + error)
          reject(error)
        } else {
          console.log(sql + ' ' + args + '执行成功')
          resolve(results)
        }
      })
    })
  } catch (error) {
    console.error(error)
  }
}
