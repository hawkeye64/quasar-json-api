const
  glob = require('glob'),
  path = require('path'),
  { merge } = require('webpack-merge'),
  fs = require('fs')

const
  root = global.rootDir,
  resolvePath = file => path.resolve(root, file),
  distRoot = path.resolve(rootDir, './dist/api'),
  extendApi = require('./api.extends.json'),
  { logError, writeFile, kebabCase } = require('./build.utils'),
  ast = require('./ast')

// if destination folder does not exist, create it now
if (fs.existsSync(distRoot) === false) {
  fs.mkdirSync(distRoot)
}

function getMixedInAPI (api, mainFile) {
  api.mixins.forEach(mixin => {
    let mixinFile
    if (mixin.charAt(0) === '~') {
      try {
        mixinFile = mixin.slice(1) + '.json'
        mixinFile = require.resolve(mixinFile)
      }
      catch (e) {
        logError(`⚠️  build.api.js: Cannot resolve mixin file: ${mixinFile}`)
        process.exit(1)
      }
    }
    else {
      mixinFile = resolvePath('src/' + mixin + '.json')
    }

    if (!fs.existsSync(mixinFile)) {
      logError(`⚠️  build.api.js: ${path.relative(root, mainFile)} -> no such mixin ${mixin}`)
      process.exit(1)
    }

    const content = require(mixinFile)

    api = merge(
      content.mixins !== void 0
        ? getMixedInAPI(content, mixinFile)
        : content,
      api
    )
  })

  const { mixins, ...finalApi } = api
  return finalApi
}

const topSections = {
  plugin: [ 'meta', 'injection', 'quasarConfOptions', 'addedIn', 'deprecated', 'removedIn', 'props', 'methods' ],
  component: [ 'meta', 'behavior', 'quasarConfOptions', 'addedIn', 'deprecated', 'removedIn', 'props', 'slots', 'scopedSlots', 'events', 'methods', 'computed' ],
  directive: [ 'meta', 'quasarConfOptions', 'addedIn', 'deprecated', 'removedIn', 'value', 'arg', 'modifiers' ],
  util: [ 'meta', 'methods', 'constants' ]
}

const objectTypes = {
  Boolean: {
    props: [ 'tsInjectionPoint', 'desc', 'required', 'reactive', 'sync', 'link', 'default', 'examples', 'category', 'addedIn', 'deprecated', 'removedIn', 'applicable' ],
    required: [ 'desc' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync' ],
    isArray: [ 'examples' ]
  },

  String: {
    props: [ 'tsInjectionPoint', 'desc', 'required', 'reactive', 'sync', 'link', 'values', 'default', 'examples', 'category', 'addedIn', 'deprecated', 'removedIn', 'transformAssetUrls', 'applicable' ],
    required: [ 'desc', 'examples' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync', 'transformAssetUrls' ],
    isArray: [ 'examples', 'values' ]
  },

  Number: {
    props: [ 'tsInjectionPoint', 'desc', 'required', 'reactive', 'sync', 'link', 'values', 'default', 'examples', 'category', 'addedIn', 'deprecated', 'removedIn', 'applicable' ],
    required: [ 'desc', 'examples' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync' ],
    isArray: [ 'examples', 'values' ]
  },

  Object: {
    props: [ 'tsInjectionPoint', 'tsType', 'desc', 'required', 'reactive', 'sync', 'link', 'values', 'default', 'definition', 'examples', 'category', 'addedIn', 'deprecated', 'removedIn', 'applicable' ],
    required: [ 'desc', 'examples' ],
    recursive: [ 'definition' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync' ],
    isObject: [ 'definition' ],
    isArray: [ 'examples', 'values' ]
  },

  Array: {
    props: [ 'tsInjectionPoint', 'tsType', 'desc', 'required', 'reactive', 'sync', 'link', 'values', 'default', 'definition', 'examples', 'category', 'addedIn', 'deprecated', 'removedIn', 'applicable' ],
    required: [ 'desc', 'examples' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync' ],
    isObject: [ 'definition' ],
    isArray: [ 'examples', 'values' ]
  },

  Date: {
    props: [ 'tsInjectionPoint', 'tsType', 'desc', 'required', 'reactive', 'sync', 'link', 'values', 'default', 'definition', 'examples', 'category', 'addedIn', 'deprecated', 'removedIn', 'applicable' ],
    required: [ 'desc', 'examples' ],
    recursive: [ 'definition' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync' ],
    isObject: [ 'definition' ],
    isArray: [ 'examples', 'values' ]
  },

  Event: {
    props: [ 'tsInjectionPoint', 'tsType', 'desc', 'required', 'reactive', 'sync', 'link', 'values', 'default', 'definition', 'examples', 'category', 'addedIn', 'deprecated', 'removedIn', 'applicable' ],
    required: [ 'desc', 'examples' ],
    recursive: [ 'definition' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync' ],
    isObject: [ 'definition' ],
    isArray: [ 'examples', 'values' ]
  },

  Map: {
    props: [ 'tsInjectionPoint', 'tsType', 'desc', 'required', 'reactive', 'sync', 'link', 'values', 'default', 'definition', 'examples', 'category', 'addedIn', 'deprecated', 'removedIn', 'applicable' ],
    required: [ 'desc', 'examples' ],
    recursive: [ 'definition' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync' ],
    isObject: [ 'definition' ],
    isArray: [ 'examples', 'values' ]
  },

  Promise: {
    props: [ 'desc', 'required', 'reactive', 'sync', 'link', 'default', 'examples', 'category', 'addedIn', 'deprecated', 'removedIn', 'applicable' ],
    required: [ 'desc', 'examples' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync' ],
    isObject: [ 'definition' ],
    isArray: [ 'examples' ]
  },

  Function: {
    props: [ 'tsInjectionPoint', 'tsType', 'desc', 'required', 'reactive', 'sync', 'link', 'default', 'params', 'returns', 'examples', 'category', 'addedIn', 'deprecated', 'removedIn', 'applicable', 'values' ],
    required: [ 'desc', 'params', 'returns' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync' ],
    isObject: [ 'params', 'returns' ],
    canBeNull: [ 'params', 'returns', 'values' ],
    isArray: [ 'examples' ]
  },

  MultipleTypes: {
    props: [ 'tsInjectionPoint', 'tsType', 'desc', 'required', 'reactive', 'sync', 'link', 'values', 'default', 'definition', 'params', 'returns', 'examples', 'category', 'addedIn', 'deprecated', 'removedIn', 'applicable' ],
    required: [ 'desc', 'examples' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync' ],
    isObject: [ 'definition', 'params', 'returns' ],
    isArray: [ 'examples', 'values' ]
  },

  // special type, not common
  Error: {
    props: [ 'desc' ],
    required: [ 'desc' ]
  },

  // special type, not common
  Component: {
    props: [ 'desc' ],
    required: [ 'desc' ]
  },

  meta: {
    props: [ 'docsUrl' ],
    required: []
  },

  // special type, not common
  Element: {
    props: [ 'desc', 'examples' ],
    required: [ 'desc' ]
  },

  // special type, not common
  File: {
    props: [ 'desc', 'required' ],
    required: [ 'desc' ]
  },

  // special type, not common
  FileList: {
    props: [ 'desc', 'required', 'category', 'examples', 'addedIn', 'deprecated', 'removedIn' ],
    required: [ 'desc' ]
  },

  // special type, not common
  MediaElement: {
    props: [ 'desc', 'required', 'category', 'examples', 'addedIn', 'deprecated', 'removedIn' ],
    required: [ 'desc' ]
  },

  // component only
  slots: {
    props: [ 'desc', 'link', 'applicable', 'addedIn', 'deprecated', 'removedIn' ],
    required: [ 'desc' ]
  },

  // component only
  scopedSlots: {
    props: [ 'desc', 'link', 'scope', 'addedIn', 'deprecated', 'removedIn', 'applicable' ],
    required: [ 'desc', 'scope' ],
    isObject: [ 'scope' ]
  },

  // component only
  events: {
    props: [ 'desc', 'link', 'params', 'addedIn', 'deprecated', 'removedIn', 'applicable' ],
    required: [ 'desc' ],
    isObject: [ 'params' ]
  },

  methods: {
    props: [ 'tsInjectionPoint', 'tsType', 'desc', 'examples', 'link', 'params', 'returns', 'addedIn', 'deprecated', 'removedIn', 'applicable', 'values' ],
    required: [ 'desc' ],
    isBoolean: [ 'tsInjectionPoint' ],
    isObject: [ 'tsType', 'params', 'returns' ],
    isArray: [ 'values' ]
  },

  computed: {
    props: [ 'tsInjectionPoint', 'desc', 'examples', 'link', 'returns', 'addedIn', 'deprecated', 'removedIn', 'applicable' ],
    required: [ 'desc' ],
    isBoolean: [ 'tsInjectionPoint' ],
    isObject: [ 'tsType', 'params', 'returns' ],
    isArray: [ 'values' ]
  },

  // plugin only
  quasarConfOptions: {
    props: [ 'propName', 'definition', 'link', 'addedIn', 'deprecated', 'removedIn' ],
    required: [ 'propName', 'definition' ]
  }
}

function parseObject ({ banner, api, itemName, masterType, verifyCategory }) {
  let obj = api[itemName]

  if (obj.extends !== void 0 && extendApi[masterType] !== void 0) {
    if (extendApi[masterType][obj.extends] === void 0) {
      logError(`${banner} extends "${obj.extends}" which does not exists`)
      process.exit(1)
    }

    api[itemName] = merge(
      extendApi[masterType][obj.extends],
      api[itemName]
    )
    delete api[itemName].extends

    obj = api[itemName]
  }

  let type

  if (['props', 'modifiers'].includes(masterType)) {
    if (obj.type === void 0) {
      logError(`${banner} missing "type" prop`)
      process.exit(1)
    }

    type = Array.isArray(obj.type) || obj.type === 'Any'
      ? 'MultipleTypes'
      : obj.type
  }
  else {
    type = masterType
  }

  type = type.startsWith('Promise') ? 'Promise' : type

  if (objectTypes[type] === void 0) {
    logError(`${banner} object has unrecognized API type prop value: "${type}"`)
    console.error(obj)
    process.exit(1)
  }

  const def = objectTypes[type]

  for (const prop in obj) {
    if ([ 'type', '__exemption' ].includes(prop)) {
      continue
    }

    if (verifyCategory && obj.category === void 0) {
      logError(`${banner} missing required API prop "category" for its type (${type})`)
      console.error(obj)
      console.log()
      process.exit(1)
    }

    if (!def.props.includes(prop)) {
      logError(`${banner} object has unrecognized API prop "${prop}" for its type (${type})`)
      console.error(obj)
      console.log()
      process.exit(1)
    }

    def.required.forEach(prop => {
      if (obj.__exemption !== void 0 && obj.__exemption.includes(prop)) {
        return
      }
      if (
        !prop.examples &&
        (obj.definition !== void 0 || obj.values !== void 0)
      ) {
        return
      }

      if (obj[prop] === void 0) {
        logError(`${banner} missing required API prop "${prop}" for its type (${type})`)
        console.error(obj)
        console.log()
        process.exit(1)
      }
    })

    if (obj.__exemption !== void 0) {
      const { __exemption, ...p } = obj
      api[itemName] = p
    }

    def.isBoolean && def.isBoolean.forEach(prop => {
      if (obj[prop] && obj[prop] !== true && obj[prop] !== false) {
        logError(`${banner}/"${prop}" is not a Boolean`)
        console.error(obj)
        console.log()
        process.exit(1)
      }
    })

    def.isObject && def.isObject.forEach(prop => {
      if (obj[prop] && Object(obj[prop]) !== obj[prop]) {
        logError(`${banner}/"${prop}" is not an Object`)
        console.error(obj)
        console.log()
        process.exit(1)
      }
    })

    def.isArray && def.isArray.forEach(prop => {
      if (obj[prop] && !Array.isArray(obj[prop])) {
        logError(`${banner}/"${prop}" is not an Array`)
        console.error(obj)
        console.log()
        process.exit(1)
      }
    })
  }

  if (obj.returns) {
    parseObject({
      banner: `${banner}/"returns"`,
      api: api[itemName],
      itemName: 'returns',
      masterType: 'props'
    })
  }

  ;[ 'params', 'definition', 'scope', 'props' ].forEach(prop => {
    if (!obj[prop]) { return }

    for (const item in obj[prop]) {
      parseObject({
        banner: `${banner}/"${prop}"/"${item}"`,
        api: api[itemName][prop],
        itemName: item,
        masterType: 'props'
      })
    }
  })
}

// https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
// https://regex101.com/r/vkijKf/1/
const SEMANTIC_REGEX = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/

function isValidVersion (version) {
  return !!SEMANTIC_REGEX.exec(version)
}

function handleValidVersion (type, api, banner) {
  if (api[type] === void 0 || api[type].length === 0) {
    logError(`${banner} "${type}" is empty`)
    console.log()
    process.exit(1)
  }

  const value = api[type]

  if (value.charAt(0) !== 'v') {
    logError(`${banner} "${type}" value (${value}) must start with "v"`)
    console.log()
    process.exit(1)
  }

  if (isValidVersion(value.slice(1)) !== true) {
    logError(`${banner} "${type}" value (${value}) must follow sematic versioning`)
    console.log()
    process.exit(1)
  }
}

function convertBehavior (api, banner) {
  const behavior = {}

  if (api.behavior.$listeners !== void 0) {
    const target = api.behavior.$listeners === true
      ? ''
      : ` ${api.behavior.$listeners.target}`

    behavior.$listeners = {
      desc: `All native events are being propagated${target} (you don't need the '.native' modifier)`
    }
  }

  if (Object.keys(behavior).length === 0) {
    logError(`${banner} "${behavior}" is empty`)
    process.exit(1)
  }

  api.behavior = behavior
}

function parseAPI (file, apiType) {
  let api = require(file)

  if (api.mixins !== void 0) {
    api = getMixedInAPI(api, file)
  }

  const banner = `build.api.js: ${path.relative(root, file)} -> `

  if (api.meta === void 0 || api.meta.docsUrl === void 0) {
    logError(`${banner} API file does not contain meta > docsUrl`)
    process.exit(1)
  }

  // "props", "slots", ...
  for (const type in api) {
    if (!topSections[apiType].includes(type)) {
      logError(`${banner} "${type}" is not recognized for a ${apiType}`)
      process.exit(1)
    }

    if (type === 'injection') {
      if (typeof api.injection !== 'string' || api.injection.length === 0) {
        logError(`${banner} "${type}"/"injection" invalid content`)
        process.exit(1)
      }
      continue
    }

    if (type === 'behavior') {
      convertBehavior(api, banner)
      continue
    }

    if (type === 'addedIn' || type === 'deprecated' || type === 'removedIn') {
      handleValidVersion(type, api, banner)
      continue
    }

    if (['value', 'arg', 'quasarConfOptions', 'meta'].includes(type)) {
      if (Object(api[type]) !== api[type]) {
        logError(`${banner} "${type}"/"${type}" is not an object`)
        process.exit(1)
      }
    }

    if (['meta', 'quasarConfOptions'].includes(type)) {
      parseObject({
        banner: `${banner} "${type}"`,
        api,
        itemName: type,
        masterType: type
      })
      continue
    }

    if (['value', 'arg'].includes(type)) {
      parseObject({
        banner: `${banner} "${type}"`,
        api,
        itemName: type,
        masterType: 'props'
      })
      continue
    }

    const isComponent = banner.indexOf('component') > -1

    for (const itemName in api[type]) {
      parseObject({
        banner: `${banner} "${type}"/"${itemName}"`,
        api: api[type],
        itemName,
        masterType: type,
        verifyCategory: type === 'props' && isComponent
      })
    }
  }

  return api
}

function orderAPI (api, apiType) {
  const ordered = {
    type: apiType
  }

  topSections[apiType].forEach(section => {
    if (api[section] !== void 0) {
      ordered[section] = api[section]
    }
  })

  return ordered
}

const astExceptions = {
  'QTable.json': {
    methods: {
      getBody: true
    }
  },
  'QField.json': {
    props: {
      maxValues: true
    },
    slots: {
      rawControl: true
    }
  }
}

function arrayHasError (name, key, property, expected, propApi) {
  const apiVal = propApi[property]

  if (expected.length === 1 && expected[0] === apiVal) {
    return
  }

  const expectedVal = expected.filter(t => t.startsWith('__') === false)

  if (
    !Array.isArray(apiVal) ||
    apiVal.length !== expectedVal.length ||
    !expectedVal.every(t => apiVal.includes(t))
  ) {
    logError(`${name}: wrong definition for prop "${key}" on "${property}": expected ${expectedVal} but found ${apiVal}`)
    return true
  }
}

function fillAPI (apiType) {
  return file => {
    const
      name = path.basename(file),
      filePath = path.join(distRoot, name)

    const api = orderAPI(parseAPI(file, apiType), apiType)

    if (apiType === 'component') {
      let hasError = false

      const definition = fs.readFileSync(file.replace('.json', '.js'), {
        encoding: 'utf-8'
      })

      const slotRegex = /(this\.\$scopedSlots\[['`](\S+)['`]\]|slot\(this, '(\S+)'|this\.\$scopedSlots\.([A-Za-z]+)\()/g
      let slotMatch
      while ((slotMatch = slotRegex.exec(definition)) !== null) {
        const slotName = (slotMatch[2] || slotMatch[3] || slotMatch[4]).replace(/(\${.+})/g, '[name]')

        if (
          astExceptions[name] !== void 0 &&
          astExceptions[name].slots !== void 0 &&
          astExceptions[name].slots[slotName] === true
        ) {
          continue
        }

        if (!(api.slots || {})[slotName] && !(api.scopedSlots || {})[slotName]) {
          logError(`${name}: missing "slot|scopedSlots" -> "${slotName}" definition`)
          hasError = true // keep looping through to find as many as can be found before exiting
        }
      }

      ast.evaluate(definition, topSections[apiType], (prop, key, definition) => {
        if (key.startsWith('__')) {
          return
        }

        if (
          astExceptions[name] !== void 0 &&
          astExceptions[name][prop] !== void 0 &&
          astExceptions[name][prop][key] === true
        ) {
          return
        }

        if (prop === 'props') {
          key = key.replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/\s+/g, '-')
            .toLowerCase()
        }

        if (api[prop] === void 0 || api[prop][key] === void 0) {
          logError(`${name}: missing "${prop}" -> "${key}" definition`)
          hasError = true // keep looping through to find as many as can be found before exiting
        }

        if (definition) {
          const propApi = api[prop][key]
          if (typeof definition === 'string' && propApi.type !== definition) {
            logError(`${name}: wrong definition for prop "${key}": expected "${definition}" but found "${propApi.type}"`)
            hasError = true // keep looping through to find as many as can be found before exiting
          }
          else if (Array.isArray(definition)) {
            if (arrayHasError(name, key, 'type', definition, propApi)) {
              hasError = true // keep looping through to find as many as can be found before exiting
            }
          }
          else {
            if (definition.type) {
              if (Array.isArray(definition.type)) {
                if (arrayHasError(name, key, 'type', definition.type, propApi)) {
                  hasError = true
                }
              }
              else if (propApi.type !== definition.type) {
                logError(`${name}: wrong definition for prop "${key}" on "type": expected "${definition.type}" but found "${propApi.type}"`)
                hasError = true // keep looping through to find as many as can be found before exiting
              }
            }

            if (key !== 'value' && definition.required && Boolean(definition.required) !== propApi.required) {
              logError(`${name}: wrong definition for prop "${key}" on "required": expected "${definition.required}" but found "${propApi.required}"`)
              hasError = true // keep looping through to find as many as can be found before exiting
            }

            if (definition.validator && Array.isArray(definition.validator)) {
              if (arrayHasError(name, key, 'values', definition.validator, propApi)) {
                hasError = true // keep looping through to find as many as can be found before exiting
              }
            }
          }
        }
      })

      if (hasError === true) {
        logError(`Errors were found...exiting`)
        process.exit(1)
      }
    }

    // copy API file to dest
    writeFile(filePath, JSON.stringify(api, null, 2))

    return {
      name: name.substring(0, name.length - 5),
      api
    }
  }
}

function writeTransformAssetUrls (components) {
  const transformAssetUrls = {}

  components.forEach(({ name, api }) => {
    if (api.props !== void 0) {
      let props = Object.keys(api.props)
        .filter(name => api.props[name].transformAssetUrls === true)

      if (props.length > 0) {
        props = props.length > 1
          ? props
          : props[0]

        transformAssetUrls[name] = props
        transformAssetUrls[kebabCase(name)] = props
      }
    }
  })

  writeFile(
    path.join(root, 'dist/transform-asset-urls.json'),
    JSON.stringify(transformAssetUrls, null, 2)
  )
}

module.exports.generate = function () {
  return new Promise((resolve) => {
    const plugins = glob.sync(resolvePath('src/plugins/*.json'))
      .filter(file => !path.basename(file).startsWith('__'))
      .map(fillAPI('plugin'))

    const directives = glob.sync(resolvePath('src/directives/*.json'))
      .filter(file => !path.basename(file).startsWith('__'))
      .map(fillAPI('directive'))

    const components = glob.sync(resolvePath('src/components/**/*.json'))
      .filter(file => !path.basename(file).startsWith('__'))
      .map(fillAPI('component'))

    const utils = glob.sync(resolvePath('src/utils/**/*.json'))
      .filter(file => !path.basename(file).startsWith('__'))
      .map(fillAPI('util'))

    // writeTransformAssetUrls(components)

    resolve({ components, directives, plugins, utils })
  }).catch(err => {
    logError(`build.api.js: something went wrong...`)
    console.log()
    console.error(err)
    console.log()
    process.exit(1)
  })
}
