// /configs/webpack.config.remote.js

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { container } = require('webpack');
const { ModuleFederationPlugin } = container;

/**
 * @param {object} options
 * @param {string} options.name - The name of the remote.
 * @param {Record<string, string>} options.exposes - The modules to expose.
 * @param {string} options.packageJsonPath - The absolute path to the package.json file.
 * @param {'development' | 'production'} [options.mode='development'] - The build mode.
 */
module.exports = function createRemoteConfig({
  name,
  exposes,
  packageJsonPath,
  mode = 'development',
}) {
  const packageJson = require(packageJsonPath);
  const deps = packageJson.dependencies;
  const isProd = mode === 'production';

  return {
    // เราจะรัน webpack จากในโฟลเดอร์ของ remote นั้นๆ ดังนั้น entry path ไม่ต้องเปลี่ยน
    entry: './src/index.tsx',
    output: {
      // ใช้ path.resolve กับ process.cwd() เพื่อให้แน่ใจว่า path จะชี้ไปที่ dist ของ remote ที่กำลัง build อยู่เสมอ
      path: path.resolve(process.cwd(), 'dist'),
      filename: isProd ? '[name].[contenthash].js' : '[name].js',
      clean: true,
      publicPath: 'auto',
      uniqueName: name,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        // Path ต้องปรับให้ถูกต้องจากตำแหน่งของ remote ไปยัง packages
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
              // Path ไปยัง babel.config.js กลาง
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
      new MiniCssExtractPlugin({
        filename: isProd ? '[name].[contenthash].css' : '[name].css',
      }),
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
        },
      }),
    ],
  };
};
