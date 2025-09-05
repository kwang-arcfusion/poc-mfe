// hosts/knowesis/webpack.common.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { container } = require('webpack');
const { ModuleFederationPlugin } = container;
const DotenvPlugin = require('dotenv-webpack');

require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const remotesConfig = require('./remotes.config');
const packageJson = require('./package.json');
const deps = packageJson.dependencies;

module.exports = (env = {}) => {
 const isProd = env.mode === 'production';

 return {
  entry: './src/index.tsx',
  output: {
   path: path.resolve(__dirname, 'dist'),
   filename: isProd ? '[name].[contenthash].js' : '[name].js',
   clean: true,
   publicPath: '/',
   uniqueName: 'knowesis',
  },
  resolve: {
   extensions: ['.ts', '.tsx', '.js', '.jsx'],
   alias: {
    '@arcfusion/ui': path.resolve(__dirname, '../../packages/ui/src'),
    '@arcfusion/store': path.resolve(__dirname, '../../packages/store/src'),
   },
  },
  module: {
   rules: [
    {
     test: /\.(ts|tsx|js|jsx)$/,
     exclude: /node_modules/,
     include: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, '../../packages/ui/src'),
      path.resolve(__dirname, '../../packages/store/src'),
     ],
     use: {
      loader: 'babel-loader',
      options: {
       configFile: path.resolve(__dirname, '../../configs/babel.config.js'),
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
   new DotenvPlugin({
    path: path.resolve(__dirname, './.env'),
   }),
   new HtmlWebpackPlugin({ template: 'public/index.html' }),
   new MiniCssExtractPlugin({
    filename: isProd ? '[name].[contenthash].css' : '[name].css',
   }),
   new ModuleFederationPlugin({
    name: 'knowesis',
    filename: 'remoteEntry.js',
    remotes: remotesConfig,
    shared: {
     react: { singleton: true, requiredVersion: false, strictVersion: false, eager: false },
     'react-dom': {
      singleton: true,
      requiredVersion: false,
      strictVersion: false,
      eager: false,
     },
     // ✨ ลบบรรทัดข้างล่างนี้ออก
     // '@auth0/auth0-react': { ... },
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