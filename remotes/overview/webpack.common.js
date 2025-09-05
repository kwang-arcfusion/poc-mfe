const path = require('path');
const createRemoteConfig = require('../../configs/webpack.config.remote');

module.exports = (env = {}) =>
  createRemoteConfig({
    name: 'overview',
    exposes: {
      './Overview': './src/Overview.tsx',
    },
    packageJsonPath: path.resolve(__dirname, './package.json'),
    mode: env.mode,
  });
