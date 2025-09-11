// remotes/stories/webpack.common.js
const path = require('path');
const createRemoteConfig = require('../../configs/webpack.config.remote');

module.exports = (env = {}) =>
  createRemoteConfig({
    name: 'stories',
    exposes: {
      './Stories': './src/Stories.tsx',
      './StoryDetailPage': './src/StoryDetailPage.tsx',
    },
    // Pass the path to its own package.json
    packageJsonPath: path.resolve(__dirname, './package.json'),
    mode: env.mode,
  });
