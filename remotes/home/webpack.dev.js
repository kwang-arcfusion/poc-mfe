const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = (env = {}) =>
  merge(common({ ...env, mode: 'development' }), {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    devServer: {
      port: 3002,
      historyApiFallback: true, // SPA → refresh ที่เส้นทางย่อยไม่พัง
      hot: true,
      open: true, // เปิด http://localhost:3002/ (คือ standalone)
    },
  });
