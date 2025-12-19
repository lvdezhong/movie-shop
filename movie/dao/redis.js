const redis = require('redis')

// 创建 Redis 客户端
const client = redis.createClient({
  socket: {
    host: '127.0.0.1',
    port: 6379,
  },
})

// 连接 Redis
client.connect().catch(console.error)

// 错误处理
client.on('error', (err) => {
  console.error('Redis Client Error:', err)
})

// 设置缓存
const setCache = async (key, value, expireSeconds = 300) => {
  try {
    if (expireSeconds > 0) {
      await client.setEx(key, expireSeconds, JSON.stringify(value))
    } else {
      await client.set(key, JSON.stringify(value))
    }
    console.log(`缓存设置成功: ${key}`)
  } catch (err) {
    console.error(`设置缓存失败 ${key}:`, err)
  }
}

// 获取缓存
const getCache = async (key) => {
  try {
    const data = await client.get(key)
    if (data) {
      console.log(`缓存命中: ${key}`)
      return JSON.parse(data)
    }
    console.log(`缓存未命中: ${key}`)
    return null
  } catch (err) {
    console.error(`获取缓存失败 ${key}:`, err)
    return null
  }
}

// 删除缓存
const deleteCache = async (key) => {
  try {
    await client.del(key)
    console.log(`缓存删除成功: ${key}`)
  } catch (err) {
    console.error(`删除缓存失败 ${key}:`, err)
  }
}

// 清除所有电影列表缓存
const clearMovieListCache = async () => {
  try {
    const keys = await client.keys('movie:list:*')
    if (keys.length > 0) {
      await client.del(keys)
      console.log(`清除电影列表缓存: ${keys.length} 个键`)
    }
  } catch (err) {
    console.error('清除电影列表缓存失败:', err)
  }
}

module.exports = {
  client,
  setCache,
  getCache,
  deleteCache,
  clearMovieListCache,
}
