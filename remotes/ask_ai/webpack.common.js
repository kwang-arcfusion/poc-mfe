// remotes/ask_ai/webpack.common.js
const path = require('path');
const createRemoteConfig = require('../../configs/webpack.config.remote');

module.exports = (env = {}) => {
  const isWebComponentBuild = env.entry === 'wc';

  // --- 1. ถ้าเป็นการ Build สำหรับ Web Component ---
  if (isWebComponentBuild) {
    console.log('Building AskAI as a standalone Web Component...');
    // เราจะ return config แบบง่ายๆ ที่ไม่มี Module Federation เลย
    return {
      entry: {
        'ask-ai-wc': './src/index.wc.tsx',
      },
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        clean: true,
      },
      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        alias: {
          '@arcfusion/ui': path.resolve(__dirname, '../../packages/ui/src'),
          '@arcfusion/store': path.resolve(__dirname, '../../packages/store/src'),
          '@arcfusion/client': path.resolve(__dirname, '../../packages/client/src'),
        },
      },
      module: {
        rules: [
          {
            test: /\.(ts|tsx|js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                configFile: path.resolve(__dirname, '../../configs/babel.config.js'),
              },
            },
          },
          {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
          },
        ],
      },
      plugins: [
        // ไม่มี ModuleFederationPlugin ที่นี่!
      ],
    };
  }

  // --- 2. ถ้าเป็นการ Build ปกติ (สำหรับ React Host) ---
  console.log('Building AskAI as a Module Federation remote...');
  return createRemoteConfig({
    name: 'ask_ai',
    exposes: {
      './AskAi': './src/index.tsx',
    },
    packageJsonPath: path.resolve(__dirname, './package.json'),
    mode: env.mode,
    // ส่ง entry เข้าไปตามปกติเพื่อให้ createRemoteConfig ทำงาน
    entry: { ask_ai: './src/index.tsx' },
  });
};
