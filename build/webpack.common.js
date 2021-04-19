const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const glob = require('glob')
const webpack = require('webpack')

const toUpper = str => str.substring(0, 1).toUpperCase() + str.substring(1)

function getEntry() {
  const obj = {
    entry: {},
    html: []
  }
  const { html, entry } = obj
  const tempList = []
  // 读取src目录所有js文件
  glob.sync('./src/**/index.ts')
    .forEach(function (filePath) {
      const fileName = filePath.split('/')
      const key = fileName[2] + toUpper(fileName[3].slice(0, -3))
      entry[key] = filePath
      tempList.push(key)
    });
  glob.sync('./src/**/*.html')
    .forEach((fileName, index) => {
      const htmlName = fileName.split('/')[2]
      html.push(new HtmlWebpackPlugin({
        filename: `${htmlName}.html`,
        template: fileName,
        chunks: [tempList[index]]
      }))
    })
  return obj
}

const { entry, html } = getEntry()

module.exports = {
  entry,
  output: {
    filename: 'js/[name].js',
    path: path.join(__dirname, '../dist')
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            cacheDirectory: true,
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node-modeules/
      },
      {
        test: /\.css$|\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      {
        test: /\.(png|jpe?g|gif|ico)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              outputPath: './img'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './css/[name].css'
    }),
    ...html,
    new webpack.LoaderOptionsPlugin({
      options: {
        htmlLoader: {
          attrs: ['img:src', 'link:href']
        }
      }
    }),
    new FriendlyErrorsWebpackPlugin()
  ]
}