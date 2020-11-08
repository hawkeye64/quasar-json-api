const
  path = require('path')

const
  { logError, writeFile, kebabCase } = require('./build.utils')
  rootDir = global.rootDir,
  resolvePath = file => path.resolve(rootDir + '/dist/vetur', file)

function getTags (data) {
  const tags = {}

  data.forEach(comp => {
    tags[comp.name] = {
      attributes: Object.keys(comp.props),
      description: ''
    }
  })

  return tags
}

function getAttributes (data) {
  const attrs = {}

  data.forEach(comp => {
    Object.keys(comp.props).forEach(propName => {
      const prop = comp.props[propName]

      attrs[`${comp.name}/${propName}`] = {
        type: Array.isArray(prop.type)
          ? prop.type.map(t => t.toLowerCase()).join('|')
          : prop.type.toLowerCase(),
        description: prop.desc
      }
    })
  })

  return attrs
}

function stripRemovedIn (props) {
  const value = {}
  Object.keys(props).forEach(prop => {
    if (props[prop].removedIn === void 0) {
      value[prop] = props[prop] 
    }
  })
  return value
}

module.exports = function ({ components }) {
  const data = components.map(c => ({
    name: kebabCase(c.name),
    props: stripRemovedIn(c.api.props) || {}
  }))

  try {
    writeFile(
      resolvePath('tags.json'),
      JSON.stringify(getTags(data), null, 2)
    )

    writeFile(
      resolvePath('attributes.json'),
      JSON.stringify(getAttributes(data), null, 2)
    )
  }
  catch (err) {
    logError(`build.vetur.js: something went wrong...`)
    console.log()
    console.error(err)
    console.log()
    process.exit(1)
  }
}
