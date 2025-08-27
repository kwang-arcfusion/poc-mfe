// remotes/home/webpack.common.js
const path = require('path');
const createRemoteConfig = require('../../configs/webpack.config.remote'); // <-- Fix path correctly

module.exports = (env = {}) =>
  createRemoteConfig({
    name: 'home',
    exposes: {
      './Home': './src/Home.tsx',
    },
    // Pass the path to its own package.json
    packageJsonPath: path.resolve(__dirname, './package.json'),
    mode: env.mode,
  });
