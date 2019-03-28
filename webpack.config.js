const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const postcssUrl = require('postcss-url');
const postcssImport = require('postcss-import');
const postcssCssnext = require('postcss-cssnext');

function createConfig(isProduction) {
  const plugins = [];
  if (!isProduction) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
    plugins.push(new LiveReloadPlugin({ port: 35729, appendScriptTag: true }));
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      plugins: [
        postcssImport(),
        postcssUrl(),
        postcssCssnext()
      ]
    }
  };

  const deleteGoogleFontsLoader = {
    loader: 'string-replace-loader',
    options: {
      search: '@import url(https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic&subset=latin);',
      replace: ''
    }
  };

  return {
    devtool: isProduction ? '' : '#cheap-source-map',
    entry: {
      app: './src/index'
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].js',
      publicPath: isProduction ? '' : '/'
    },
    plugins: plugins.concat([
      new webpack.NoEmitOnErrorsPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.template.html'
      })
    ]),
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            !isProduction ? 'style-loader' : MiniCssExtractPlugin.loader,
            deleteGoogleFontsLoader,
            'css-loader',
            postcssLoader
          ]
        },
        {
          test: /\.less$/,
          use: [
            !isProduction ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            postcssLoader,
            {
              loader: 'less-loader'
            }
          ]
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          options: { compact: false, cacheDirectory: true },
          include: path.join(__dirname, 'src')
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                digest: 'hex',
                name: '[name].[ext]'
              }
            },
            {
              loader: 'image-webpack-loader',
              options: {
                query: {
                  optipng: {
                    optimizationLevel: 7
                  },
                  gifsicle: {
                    interlaced: false
                  }
                }
              }
            }
          ]
        },
        {
          test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'file-loader',
          options: {
            name: 'fonts/[name]-[hash].[ext]'
          }
        }
      ],
      noParse: [
        /^jquery(-.*)?$/,
        /^semantic(-.*)?$/,
        /^lodash$/,
        /^react(-.*)?$/,
        /^redux(-.*)?$/,
        /aws-sdk/
      ]
    }
  };
}

module.exports = (env) => {
  const isProduction = env && env.production;
  return createConfig(isProduction);
};
