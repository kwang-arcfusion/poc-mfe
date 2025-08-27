// remotes/ask_ai/webpack.common.js
const path = require('path');
const createRemoteConfig = require('../../configs/webpack.config.remote'); // <-- Fix path correctly

module.exports = (env = {}) =>
  createRemoteConfig({
    name: 'ask_ai',
    exposes: {
      './AskAi': './src/AskAi.tsx',
    },
    // Pass the path to its own package.json
    packageJsonPath: path.resolve(__dirname, './package.json'),
    mode: env.mode,
  });
