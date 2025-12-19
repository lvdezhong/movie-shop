module.exports = {
  // devServer: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://192.168.103.22:3000',
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/api': ''
  //       },
  //       secure: false,
  //       ws: true,
  //       logLevel: 'debug',
  //       onProxyReq: function (proxyReq, req, res) {
  //         // 打印代理请求信息
  //         console.log('代理请求:', req.method, req.url);
  //       },
  //       onError: function (err, req, res) {
  //         // 打印代理错误信息
  //         console.error('代理错误:', err);
  //       }
  //     }
  //   }
  // }
  // 配置 sourceMap
  configureWebpack: {
    devtool: 'source-map', // 或 'cheap-module-source-map' 等
  },
}
