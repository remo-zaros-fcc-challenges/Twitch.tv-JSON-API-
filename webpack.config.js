const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const merge = require('webpack-merge')

const parts = require('./webpack.parts')

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
}

const commonConfig = merge([
  {
    entry: {
      app: PATHS.app,
    },
    output: {
      path: PATHS.build,
      filename: '[name].js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        hash: true,
        title: 'Twitch status viewer.',
        template: '!!ejs-compiled-loader!' + PATHS.app + '/index.ejs',
      }),
    ],
  },
  parts.babel({exclude: /node_modules/}),
  //parts.html({}),
])

const productionConfig = merge([
  parts.extractCSS({
    use: ['css-loader', parts.autoprefix()],
  }),
  parts.loadImages({
    options: {
      limit: 15000,
      name: '[name].[ext]',
    },
  }),
])

const developmentConfig = merge([
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  parts.loadCSS(),
  parts.loadImages(),
])

module.exports = (env) => {
  if (env === 'production') {
    return merge(commonConfig, productionConfig)
  }
  return merge(commonConfig, developmentConfig)
}
