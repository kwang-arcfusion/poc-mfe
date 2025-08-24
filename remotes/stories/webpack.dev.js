// remotes/home/webpack.dev.js
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = (env = {}) =>
  merge(common({ ...env, mode: 'development' }), {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    devServer: {
      port: 3003,
      historyApiFallback: true,
      hot: true,
      open: false,
    },
  });
