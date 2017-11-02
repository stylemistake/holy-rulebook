'use strict';

const webpack = require('webpack');
const path = require('path');

const WEBPACK_ENV = process.env.WEBPACK_ENV || 'local';

const config = {
  entry: {
    client: [
      'babel-polyfill',
      './src/index.js',
    ],
  },
  output: {
    path: path.resolve(__dirname, 'public'),
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
              presets: WEBPACK_ENV === 'local'
                ? ['env', 'react', 'react-hmre']
                : ['env', 'react'],
            },
          },
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
if (WEBPACK_ENV === 'production') {
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
