module.exports = function () {
  if (global.rootDir === void 0) {
    console.log(`${red('quasar.json.api: "global.rootDir" is not set...exiting')}`)
    process.exit(1)
  }
  if (global.distDir === void 0) {
    console.log(`${red('quasar.json.api: "global.distDir" is not set...exiting')}`)
    process.exit(1)
  }

  return require('./build.api').generate()
    .then(data => {
      require('./build.vetur')(data)
  })
}
