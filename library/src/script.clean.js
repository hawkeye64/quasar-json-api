const
  rimraf = require('rimraf'),
  path = require('path')

module.exports = function (distFolder) {
  rimraf.sync(`${distFolder}/api/*`)
  // console.log(` 💥 Cleaned API artifacts.\n`)
}
