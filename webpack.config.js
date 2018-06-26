'use strict';

const webpack = require('webpack');
const path = require('path');
const { compact } = require('lodash');

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
                  modules: false,
                  useBuiltIns: 'usage',
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
                APP_ENV === 'local' && 'react-hot-loader/babel',
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
        test: /\.ya?ml$/,
        use: [
          './src/loaders/yaml-loader.js',
        ],
      },
    ],
  },
  plugins: [],
  devtool: 'source-map',
  devServer: {
    inline: true,
    port: 3000,
    contentBase: 'public',
    historyApiFallback: {
      index: '/index.html'
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
