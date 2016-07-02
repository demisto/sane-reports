const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const postcssUrl = require('postcss-url');
const postcssImport = require('postcss-import');
const postcssCssnext = require('postcss-cssnext');
const postcssReporter = require('postcss-reporter');

const assets = 'assets';

module.exports = {
  devtool: 'eval',
  entry: {
    app: './src/index'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: assets + '/[name].js',
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new LiveReloadPlugin({ port: 35831, appendScriptTag: true }),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin(assets + '/[name].css', { allChunks: true }),
    new webpack.DefinePlugin({
      __DEV_TOOLS__: JSON.stringify(JSON.parse(process.env.DEV_TOOLS || 'false'))
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.template.html'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss')
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss!less')
      },
      {
        test: /\.js$/,
        loaders: ['babel'],
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file?digest=hex&name=' + assets + '/[name].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file?name=' + assets + '/fonts/[name]-[hash].[ext]'
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  },
  postcss: (wp) => {
    return [
      postcssImport({ addDependencyTo: wp }),
      postcssUrl(),
      postcssCssnext(),
      postcssReporter()
    ];
  }
};
