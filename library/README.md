# quasar-json-api

![quasar-json-api](https://img.shields.io/npm/v/quasar-json-api.svg?label=quasar-json-api)
[![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/hawkeye64/quasar-json-api.svg)]()
[![GitHub repo size in bytes](https://img.shields.io/github/repo-size/hawkeye64/quasar-json-api.svg)]()
[![npm](https://img.shields.io/npm/dt/quasar-json-api.svg)](https://www.npmjs.com/package/quasar-json-api)

# Description
The `quasar-json-api` is a library to **normalize** and **validate** your JSON Api for a Quasar Component, Directive, Mixin or Plugin.

As well, it'll create `Vetur` compliant files, so that when using `vscode` with `vetur` you get suggestions and completions.

The output of the results will be placed in the **dist/api** and **dist/vetur** folders, respectively.


# Usage

Before proceeding, make sure you are using the Quasar build system from the **UI** kit.

```bash
$ yarn add --dev quasar-json-api
```

In your `build` folder, create a file called: `build.api.js`

Add the following to it:

```js
const path = require('path')
global.rootDir = path.resolve(__dirname, '..')
global.distDir = path.resolve(__dirname, '../dist')

require('quasar-json-api')()
```

In your `build/index.js` find the `createFolder('dist')` command and modify as follows:

```js
createFolder('dist')
createFolder('dist/api')
createFolder('dist/vetur')
```

In your `build/script.javascript.js` find the `build(builds)` command and modify as follows:

```js
build(builds)
  .then(() => {
    require('./build.api')
  })
```

In your `package.json, add the following:

```json
  "vetur": {
    "tags": "dist/vetur/tags.json",
    "attributes": "dist/vetur/attributes.json"
  },
```

That's it!

When you build your Component or Directive via `yarn build` (from your UI kit templated package), your JSON API will be **Normalized** and **Validated** and the output will be placed in the `dist/api` folder.

# JSON API
**TODO**

# Donate
If you appreciate the work that went into this, please consider donating to [Quasar](https://donate.quasar.dev) or [Jeff](https://github.com/sponsors/hawkeye64).

# License
MIT (c) Jeff Galbraith <jeff@quasar.dev>
