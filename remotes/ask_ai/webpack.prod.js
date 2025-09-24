// remotes/ask_ai/webpack.prod.js
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = (env = {}) => {
  // ✨ 1. ตรวจสอบว่าเป็น Web Component build หรือไม่
  const isWebComponentBuild = env.entry === 'wc';

  // ✨ 2. กำหนดค่า optimization ตามประเภทของการ build
  const optimizationConfig = {
    // ถ้าเป็น WC build, ให้ splitChunks เป็น false
    // ถ้าเป็น build ปกติ, ให้ทำงานเหมือนเดิม
    splitChunks: isWebComponentBuild ? false : { chunks: 'all' },
    runtimeChunk: isWebComponentBuild ? false : 'single',
  };

  // ✨ 3. Merge config เข้าด้วยกัน
  return merge(common({ ...env, mode: 'production' }), {
    mode: 'production',
    devtool: false,
    optimization: optimizationConfig,
  });
};
