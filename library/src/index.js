const
  type = process.argv[2],
  parallel = require('os').cpus().length > 1,
  // { join } = require('path'),
  path = require('path'),
  { createFolder } = require('./build.utils'),
  runJob = parallel ? require('child_process').fork : require,
  { green, blue, red } = require('chalk')

module.exports = function () {
  if (global.rootDir === void 0) {
    console.log(`${red('quasar.json.api: "global.rootDir" is not set...exiting')}`)
    process.exit(1)
  }
  if (global.distDir === void 0) {
    console.log(`${red('quasar.json.api: "global.distDir" is not set...exiting')}`)
    process.exit(1)
  }

  require('./script.clean.js')(global.distDir)

  createFolder(global.distDir)
  createFolder(path.resolve(global.distDir, 'api'))

  require('./build.api').generate()
}
