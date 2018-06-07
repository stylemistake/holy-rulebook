'use strict';

const webpack = require('webpack');
const path = require('path');

const APP_ENV = process.env.APP_ENV || 'local';

const config = {
  mode: 'none',
  entry: {
    client: [
      'babel-polyfill',
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
              presets: APP_ENV === 'local'
                ? ['env', 'react', 'react-hmre']
                : ['env', 'react'],
              plugins: [
                'transform-decorators-legacy',
                'transform-class-properties',
              ],
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
          // unsafe: true,
          // passes: 2,
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
