
const glob = require('glob')

const toUpper = str => str.substring(0, 1).toUpperCase() + str.substring(1)

function getEntry() {
  const obj = {
    entry: {},
    html: []
  }
  const { html, entry } = obj
  const tempList = []
  // 读取src目录所有js文件
  glob.sync('./src/**/index.js')
    .forEach(function (filePath) {
      const fileName = filePath.split('/')
      const key = fileName[2] + toUpper(fileName[3].slice(0, -3))
      entry[key] = filePath
      tempList.push(key)
    });
  glob.sync('./src/**/*.html')
    .forEach((fileName, index) => {
      const htmlName = fileName.split('/')[2]
      html.push({
        filename: `${htmlName}.html`,
        template: fileName,
        inject: true,
        chunks: tempList[index]
      })
    })
  return obj
}

console.log(getEntry())