// 全局配置文件
const config = {
  // 后台API基础地址
  baseUrl: 'http://localhost:3000',
  // 图片上传资源基础地址
  uploadBaseUrl: 'http://localhost:3000/upload',
  // 图片资源基础地址
  imageBaseUrl: 'http://localhost:3000/getFile',
  // 视频资源基础地址
  videoBaseUrl: 'http://localhost:8080/static/videos',
}

export default config
export const { baseUrl, uploadBaseUrl, imageBaseUrl, videoBaseUrl } = config
