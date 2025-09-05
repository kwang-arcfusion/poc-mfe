const path = require('path');
const createRemoteConfig = require('../../configs/webpack.config.remote');

module.exports = (env = {}) =>
  createRemoteConfig({
    name: 'stories',
    exposes: {
      './Stories': './src/Stories.tsx',
      './StoryDetailPage': './src/StoryDetailPage.tsx',
    },
    packageJsonPath: path.resolve(__dirname, './package.json'),
    mode: env.mode,
  });
