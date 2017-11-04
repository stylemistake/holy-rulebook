'use strict';

const webpack = require('webpack');
const path = require('path');

const APP_ENV = process.env.APP_ENV || 'local';

const config = {
  entry: {
    client: [
      'babel-polyfill',
      './src/index.js',
    ],
  },
  output: {
    path: path.resolve(__dirname, 'public/bundles'),
    publicPath: '/bundles/',
    filename: '[name].bundle.js',
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
          './src/lib/loaders/yaml-loader.js',
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
  config.devtool = false,
  config.plugins = config.plugins.concat([
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
  ]);
}

module.exports = config;
