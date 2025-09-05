const path = require('path');
const createRemoteConfig = require('../../configs/webpack.config.remote');

module.exports = (env = {}) =>
  createRemoteConfig({
    name: 'home',
    exposes: {
      './Home': './src/Home.tsx',
    },
    packageJsonPath: path.resolve(__dirname, './package.json'),
    mode: env.mode,
  });
