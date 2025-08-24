// remotes/home/webpack.common.js
const path = require('path');
const createRemoteConfig = require('../../configs/webpack.config.remote'); // <-- แก้ path ให้ถูกต้อง

module.exports = (env = {}) =>
  createRemoteConfig({
    name: 'home',
    exposes: {
      './Home': './src/Home.tsx',
    },
    // ส่ง path ไปยัง package.json ของตัวเอง
    packageJsonPath: path.resolve(__dirname, './package.json'),
    mode: env.mode,
  });
