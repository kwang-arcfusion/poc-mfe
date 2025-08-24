// remotes/stories/webpack.common.js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { container } = require('webpack');
const { ModuleFederationPlugin } = container;

module.exports = (env = {}) => {
  const isProd = env.mode === 'production';

  return {
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProd ? '[name].[contenthash].js' : '[name].js',
      clean: true,
      publicPath: 'auto',
      uniqueName: 'stories',
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
          include: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, '../../packages/ui/src'),
            path.resolve(__dirname, '../../packages/store/src'),
          ],
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
          include: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, '../../packages/ui/src'),
          ],
          use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: isProd ? '[name].[contenthash].css' : '[name].css',
      }),
      new ModuleFederationPlugin({
        name: 'stories',
        filename: 'remoteEntry.js',
        exposes: {
          './Stories': './src/Stories.tsx',
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
