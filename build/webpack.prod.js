const merge = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const common = require('./webpack.common')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CompressionPlugin = require("compression-webpack-plugin")

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CompressionPlugin(),
    new BundleAnalyzerPlugin()
  ]
})
