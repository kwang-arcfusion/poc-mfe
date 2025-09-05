const path = require('path');
const createRemoteConfig = require('../../configs/webpack.config.remote');

module.exports = (env = {}) =>
  createRemoteConfig({
    name: 'ask_ai',
    exposes: {
      './AskAi': './src/AskAi.tsx',
    },
    packageJsonPath: path.resolve(__dirname, './package.json'),
    mode: env.mode,
  });
