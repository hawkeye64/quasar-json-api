module.exports = function (options) {
  if (global.rootDir === void 0) {
    console.log(`${red('quasar.json.api: "global.rootDir" is not set...exiting')}`)
    process.exit(1)
  }
  if (global.distDir === void 0) {
    console.log(`${red('quasar.json.api: "global.distDir" is not set...exiting')}`)
    process.exit(1)
  }

  let buildVetur = true // on by default for backwards compatibility
  if (options !== void 0 && options.buildVetur !== void 0) {
    buildVetur = options.buildVetur
  }

  let buildTypes = false // off by default
  if (options !== void 0 && options.buildTypes !== void 0) {
    buildTypes = options.buildTypes
  }

  let forcedTypes = []
  if (options !== void 0 && Array.isArray(options.forcedTypes) && options.forcedTypes.length > 0) {
    forcedTypes = options.forcedTypes
  }

  return require('./build.api.js').generate()
    .then(data => {
      if (buildVetur === true) {
        require('./build.vetur.js').generate(data)
      }
      if (buildTypes === true) {
        require('./build.types.js').generate(data, forcedTypes)
      }
  })
}
