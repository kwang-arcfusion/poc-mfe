// remotes/ask_ai/webpack.common.js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { container } = require('webpack');
const { ModuleFederationPlugin } = container;

// ไม่ต้องใช้ HtmlWebpackPlugin และ Dotenv อีกต่อไป

module.exports = (env = {}) => {
  const isProd = env.mode === 'production';

  return {
    // เหลือแค่ entry เดียวสำหรับ Module Federation
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProd ? '[name].[contenthash].js' : '[name].js',
      clean: true,
      publicPath: 'auto',
      uniqueName: 'ask_ai',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      // alias ยังคงมีประโยชน์เพื่อให้ HMR และการ build ทำงานได้เสถียร
      alias: {
        '@arcfusion/ui': path.resolve(__dirname, '../../packages/ui/src'),
        '@arcfusion/store': path.resolve(__dirname, '../../packages/store/src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|jsx)$/,
          // include ยังจำเป็นเพื่อให้ host สามารถ transpile โค้ดจาก packages ได้
          include: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, '../../packages/ui/src'),
            path.resolve(__dirname, '../../packages/store/src'),
          ],
          use: {
            loader: 'babel-loader',
            options: {
              configFile: path.resolve(__dirname, '../../babel.config.js'),
            },
          },
        },
        {
          test: /\.css$/i,
          include: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, '../../packages/ui/src'),
          ],
          use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      // เหลือแค่ 2 plugins ที่จำเป็นสำหรับ remote
      new MiniCssExtractPlugin({
        filename: isProd ? '[name].[contenthash].css' : '[name].css',
      }),
      new ModuleFederationPlugin({
        name: 'ask_ai',
        filename: 'remoteEntry.js',
        exposes: {
          './AskAi': './src/AskAi.tsx',
        },
        shared: {
          react: { singleton: true, requiredVersion: false },
          'react-dom': { singleton: true, requiredVersion: false },
          '@auth0/auth0-react': { singleton: true, requiredVersion: false },
          zustand: { singleton: true, requiredVersion: false },
          '@arcfusion/store': { singleton: true, requiredVersion: false },
        },
      }),
    ],
  };
};
