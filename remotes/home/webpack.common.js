const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { container } = require('webpack');
const { ModuleFederationPlugin } = container;

module.exports = (env = {}) => {
  const isProd = env.mode === 'production';

  return {
    // โหมด remote: มี 2 entries → main (federation) + standalone (preview/dev)
    entry: {
      main: './src/index.tsx', // federation entry
      standalone: './src/standalone.tsx', // standalone entry
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProd ? '[name].[contenthash].js' : '[name].js',
      clean: true,
      publicPath: 'auto',
      uniqueName: 'home',
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
                ['@babel/preset-react', { runtime: 'automatic' }],
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
      // ให้โหมด standalone เป็น index.html (เปิดที่รากโดเมนได้ทันที)
      new HtmlWebpackPlugin({
        template: 'public/index.html',
        filename: 'index.html',
        chunks: ['standalone'],
      }),
      // หน้าเสริมสำหรับ entry "main" (ดูบันเดิล federation ได้ถ้าต้องการ)
      new HtmlWebpackPlugin({
        template: 'public/index.html',
        filename: 'mf.html',
        chunks: ['main'],
      }),
      new MiniCssExtractPlugin({
        filename: isProd ? '[name].[contenthash].css' : '[name].css',
      }),
      new ModuleFederationPlugin({
        name: 'home',
        filename: 'remoteEntry.js',
        exposes: {
          './Home': './src/Home.tsx',
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
        },
      }),
    ],
  };
};
