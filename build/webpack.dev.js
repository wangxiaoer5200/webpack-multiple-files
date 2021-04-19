
const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common')
const path = require('path')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-eval-module-source-map',
  devServer: {
    port: 3000,
    open: true,
    before(app, server, compiler) {
      const watchFiles = ['.html'];
      compiler.hooks.done.tap('done', () => {
        const changedFiles = Object.keys(compiler.watchFileSystem.watcher.mtimes)
        if (
          this.hot &&
          changedFiles.some(filePath => watchFiles.includes(path.parse(filePath).ext))
        ) {
          server.sockWrite(server.sockets, 'content-changed');
        }
      })
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
})