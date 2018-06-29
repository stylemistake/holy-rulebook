'use strict';

const webpack = require('webpack');
const path = require('path');
const { compact } = require('lodash');
const BuildNotifierPlugin = require('webpack-build-notifier');

const APP_ENV = process.env.APP_ENV || 'local';

const config = {
  mode: 'none',
  entry: {
    client: [
      './src/client/index.jsx',
    ],
  },
  output: {
    path: path.resolve(__dirname, 'public/bundles'),
    publicPath: '/bundles/',
    filename: '[name].bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  // modules: false,
                  // useBuiltIns: 'usage',
                  targets: {
                    browsers: [
                      'last 1 chrome version',
                      'last 1 firefox version',
                    ],
                  },
                }],
                '@babel/preset-react',
              ],
              plugins: compact([
                ['@babel/plugin-proposal-decorators', {
                  legacy: true,
                }],
                '@babel/plugin-proposal-class-properties',
                // APP_ENV === 'local' && 'react-hot-loader/babel',
              ]),
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif|ico)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(ttf|woff|woff2|eot|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.ya?ml$/,
        use: [
          './src/loaders/yaml-loader.js',
        ],
      },
    ],
  },
  plugins: [
    new BuildNotifierPlugin(),
  ],
  devtool: 'source-map',
  devServer: {
    // Mandatory settings
    port: 3000,
    contentBase: 'public',
    historyApiFallback: {
      index: '/index.html'
    },
    // Informational flags
    progress: false,
    quiet: false,
    noInfo: false,
    // Fine-grained logging control
    stats: {
      assets: false,
      builtAt: false,
      cached: false,
      children: false,
      chunks: true,
      colors: true,
      hash: false,
      timings: false,
      version: false,
      modules: false,
    },
  },
};

// Add optimization plugins when generating the final bundle
if (APP_ENV === 'production') {
  const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
  config.devtool = false;
  config.plugins = config.plugins.concat([
    // Disable development features of React
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new UglifyJsPlugin({
      parallel: false,
      uglifyOptions: {
        ecma: 8,
        parse: {},
        compress: {
          passes: 2,
        },
        output: {
          beautify: false,
          comments: false,
        },
      },
    }),
  ]);
}

module.exports = config;
