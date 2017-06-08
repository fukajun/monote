const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    index: __dirname + '/source/index.js',
    main: __dirname + '/source/main.js',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/build/',
    libraryTarget: 'commonjs2',
  },
  target: 'electron',
  externals: [
    'electron',
    'fs'
  ],
  node: {
    __dirname: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: { presets: ['react', 'es2015'] }
      }
    ]
  },
  plugins: [
    new  CopyWebpackPlugin([
      {from: 'package.json'},
      {from: 'source/index.html'},
      {from: 'source/stylesheets', to: 'stylesheets'},
      {from: 'source/fonts', to: 'fonts'},
      {from: 'source/images', to: 'images'},
    ])
  ],
}