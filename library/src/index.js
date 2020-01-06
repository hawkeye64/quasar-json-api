const
  path = require('path'),
  { createFolder } = require('./build.utils')

module.exports = function () {
  if (global.rootDir === void 0) {
    console.log(`${red('quasar.json.api: "global.rootDir" is not set...exiting')}`)
    process.exit(1)
  }
  if (global.distDir === void 0) {
    console.log(`${red('quasar.json.api: "global.distDir" is not set...exiting')}`)
    process.exit(1)
  }

  // require('./script.clean.js')(global.distDir)

  // createFolder('dist')
  // createFolder('dist/api')

  require('./build.api').generate()
}
