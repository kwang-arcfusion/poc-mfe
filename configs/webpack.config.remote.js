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
    // We will run webpack from within the remote's folder, so the entry path doesn't need to change.
    entry: './src/index.tsx',
    output: {
      // Use path.resolve with process.cwd() to ensure the path always points to the dist of the remote being built.
      path: path.resolve(process.cwd(), 'dist'),
      filename: isProd ? '[name].[contenthash].js' : '[name].js',
      clean: true,
      publicPath: 'auto',
      uniqueName: name,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        // Paths must be adjusted correctly from the remote's location to the packages.
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
              // Path to the central babel.config.js
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
