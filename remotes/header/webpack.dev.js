const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = (env = {}) =>
  merge(common({ ...env, mode: 'development' }), {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    devServer: {
      port: 3001,
      historyApiFallback: true, // index.html (standalone) เป็น SPA
      hot: true,
      open: true,
    },
  });
