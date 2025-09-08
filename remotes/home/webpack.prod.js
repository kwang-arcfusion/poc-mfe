const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = (env = {}) =>
  merge(common({ ...env, mode: 'production' }), {
    mode: 'production',
    devtool: false,
    optimization: {
      splitChunks: { chunks: 'all' },
      runtimeChunk: false,
    },
  });
