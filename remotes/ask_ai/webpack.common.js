const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { container } = require('webpack');
const { ModuleFederationPlugin } = container;
const Dotenv = require('dotenv-webpack');

module.exports = (env = {}) => {
  const isProd = env.mode === 'production';

  return {
    // remote มี 2 entries: main (federation) + standalone (โหมด dev/preview)
    entry: {
      main: './src/index.tsx', // federation entry (ไม่มี render)
      standalone: './src/standalone.tsx', // standalone entry
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProd ? '[name].[contenthash].js' : '[name].js',
      clean: true,
      publicPath: 'auto',
      uniqueName: 'ask_ai',
    },
    resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: 'defaults' }],
                ['@babel/preset-react', { runtime: 'classic' }],
                ['@babel/preset-typescript', { allowDeclareFields: true }],
              ],
            },
          },
        },
        {
          test: /\.css$/i,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader',
          ],
        },
      ],
    },
    plugins: [
      new Dotenv(),
      // ทำให้ standalone เป็น index.html (เปิดที่รากโดเมนได้เลย)
      new HtmlWebpackPlugin({
        template: 'public/index.html',
        filename: 'index.html',
        chunks: ['standalone'],
      }),
      // หน้าเสริมให้ main (ดู bundle ได้ถ้าจำเป็น)
      new HtmlWebpackPlugin({
        template: 'public/index.html',
        filename: 'mf.html',
        chunks: ['main'],
      }),
      new MiniCssExtractPlugin({
        filename: isProd ? '[name].[contenthash].css' : '[name].css',
      }),
      new ModuleFederationPlugin({
        name: 'ask_ai',
        filename: 'remoteEntry.js',
        exposes: {
          './AskAi': './src/AskAi.tsx',
        },
        remotes: {},
        shared: {
          react: { singleton: true, requiredVersion: false, strictVersion: false, eager: false },
          'react-dom': {
            singleton: true,
            requiredVersion: false,
            strictVersion: false,
            eager: false,
          },
          '@auth0/auth0-react': {
            singleton: true,
            requiredVersion: false,
            strictVersion: false,
            eager: false,
          },
        },
      }),
    ],
  };
};
