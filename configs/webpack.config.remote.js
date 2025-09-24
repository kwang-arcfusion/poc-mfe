// /configs/webpack.config.remote.js
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { container } = require('webpack');
const { ModuleFederationPlugin } = container;

/**
 * @param {object} options
 * @param {string} options.name - The name of the remote.
 * @param {Record<string, string>} options.exposes - The modules to expose.
 * @param {string} options.packageJsonPath - The absolute path to the package.json file.
 * @param {'development' | 'production'} [options.mode='development'] - The build mode.
 * @param {Record<string, string>} [options.entry] - Optional custom entry points.
 */
module.exports = function createRemoteConfig({
  name,
  exposes,
  packageJsonPath,
  mode = 'development',
  // ✨ 1. เพิ่ม option 'entry' เพื่อรับ object ที่มีหลาย entry points
  entry,
}) {
  const packageJson = require(packageJsonPath);
  const deps = packageJson.dependencies;
  const isProd = mode === 'production';

  return {
    // ✨ 2. ใช้ entry ที่รับเข้ามา, ถ้าไม่มีก็ใช้ default entry สำหรับ MF
    entry: entry || { [name]: './src/index.tsx' },

    output: {
      path: path.resolve(process.cwd(), 'dist'),
      // ✨ 3. ใช้ [name] เพื่อให้ webpack สร้างไฟล์ตามชื่อ key ของ entry object
      // เช่น ask_ai.bundle.js และ ask-ai-wc.bundle.js
      filename: '[name].bundle.js',
      clean: true,
      publicPath: 'auto',
      uniqueName: name,
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        '@arcfusion/ui': path.resolve(process.cwd(), '../../packages/ui/src'),
        '@arcfusion/store': path.resolve(process.cwd(), '../../packages/store/src'),
      },
    },

    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          include: [
            path.resolve(process.cwd(), 'src'),
            path.resolve(process.cwd(), '../../packages/ui/src'),
            path.resolve(process.cwd(), '../../packages/store/src'),
          ],
          use: {
            loader: 'babel-loader',
            options: {
              configFile: path.resolve(process.cwd(), '../../configs/babel.config.js'),
            },
          },
        },
        {
          test: /\.css$/i,
          use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'],
        },
      ],
    },

    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(process.cwd(), 'public/_headers'),
            to: path.resolve(process.cwd(), 'dist'),
            noErrorOnMissing: true,
          },
        ],
      }),
      new MiniCssExtractPlugin({
        filename: isProd ? '[name].[contenthash].css' : '[name].css',
      }),
      // ✨ 4. ไม่ต้องมีเงื่อนไขอีกต่อไป Plugin นี้จะทำงานเสมอ
      // เพื่อสร้าง remoteEntry.js สำหรับโปรเจกต์ React ที่ต้องการใช้งาน
      new ModuleFederationPlugin({
        name,
        filename: 'remoteEntry.js',
        exposes,
        shared: {
          react: { singleton: true, requiredVersion: false },
          'react-dom': { singleton: true, requiredVersion: false },
          '@auth0/auth0-react': { singleton: true, requiredVersion: false },
          zustand: { singleton: true, requiredVersion: false },
          '@arcfusion/store': { singleton: true, requiredVersion: false },
          '@fluentui/react-components': {
            singleton: true,
            requiredVersion: deps['@fluentui/react-components'],
          },
          '@fluentui/react-icons': {
            singleton: true,
            requiredVersion: deps['@fluentui/react-icons'],
          },
          '@arcfusion/client': { singleton: true, requiredVersion: false, strictVersion: false },
        },
      }),
    ],
  };
};
