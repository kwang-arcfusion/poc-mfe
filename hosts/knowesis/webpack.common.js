const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { container } = require('webpack');
const { ModuleFederationPlugin } = container;
const DotenvPlugin = require('dotenv-webpack'); // Rename variable to avoid confusion with `dotenv` library

// ===================================================================
// 1. Load .env manually as soon as this file is read.
// This line makes process.env available for all code in this file.
// ===================================================================
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

// 2. Now we can require this at the top, because process.env is populated.
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
      publicPath: 'auto',
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
      // 3. We still need to use DotenvPlugin
      // to inject process.env values into our browser-side code (e.g., in bootstrap.tsx).
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
          '@auth0/auth0-react': {
            singleton: true,
            requiredVersion: false,
            strictVersion: false,
            eager: false,
          },
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
