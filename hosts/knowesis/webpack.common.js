const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { container } = require('webpack');
const { ModuleFederationPlugin } = container;
const Dotenv = require('dotenv-webpack');
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
              configFile: path.resolve(__dirname, '../../babel.config.js'),
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
      new Dotenv(),
      new HtmlWebpackPlugin({ template: 'public/index.html' }),
      new MiniCssExtractPlugin({
        filename: isProd ? '[name].[contenthash].css' : '[name].css',
      }),
      new ModuleFederationPlugin({
        name: 'knowesis',
        filename: 'remoteEntry.js',
        remotes: {
          ask_ai: 'ask_ai@http://localhost:3001/remoteEntry.js',
          home: 'home@http://localhost:3002/remoteEntry.js',
          stories: 'stories@http://localhost:3003/remoteEntry.js',
          overview: 'overview@http://localhost:3004/remoteEntry.js',
        },
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
        },
      }),
    ],
  };
};
