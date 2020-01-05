# quasar-json-api

![quasar-json-api](https://img.shields.io/npm/v/quasar-json-api.svg?label=quasar-json-api)
[![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/hawkeye64/quasar-json-api.svg)]()
[![GitHub repo size in bytes](https://img.shields.io/github/repo-size/hawkeye64/quasar-json-api.svg)]()
[![npm](https://img.shields.io/npm/dt/quasar-json-api.svg)](https://www.npmjs.com/package/quasar-json-api)

# Description
The `quasar-json-api` is a library to **normalize** and **validate** your JSON Api for a Quasar Component, Directive, Mixin or Plugin.

The output of the results will be placed in the **dist/api** folder.


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

In your `build/script.javascript.js` find the `build(builds)` command and modify as follows:

```js
build(builds)
  .then(() => {
    require('./build.api')
  })
```

That's it!

When you build your Component or Directive via `yarn build` (from your UI kit templated package), your JSON API will be **Normalized** and **Validated** and the output will be placed in the `dist/api` folder.

One more item to disclose. The JSON file should have the same name as your component so it can validate against the source after the normalization is done.

For instance, if your component or directive is **MyComponent.js**, then your JSON API file will be called **MyComponent.json**.

If you want to set up a script in your `package.json`, you can add the following:

```json
  "scripts": {
    "lint": "eslint --ext .js,.vue src",
    "lint-fix": "eslint --ext .js,.vue src --fix",
    "dev": "cd dev && yarn dev && cd ..",
    "dev:umd": "yarn build && node build/script.open-umd.js",
    "dev:ssr": "cd dev && yarn 'dev:ssr' && cd ..",
    "dev:ios": "cd dev && yarn 'dev:ios' && cd ..",
    "dev:android": "cd dev && yarn 'dev:android' && cd ..",
    "dev:electron": "cd dev && yarn 'dev:electron' && cd ..",
    "build": "node build/index.js",
    "build:js": "node build/script.javascript.js",
    "build:css": "node build/script.css.js",
    "build:api": "node build/build.api.js"
  },
```
Notice the addition of the last line.

Now, you can concentrate on any JSON API issues you have by running `yarn build:api`.

# JSON API
**TODO**

# Common Errors

## Normalization
Normalization is a check of your JSON file so that it contains all requirements.

Some properties are required based on the type.

You will see an error like this if you are missing a required property:
```
[Error] build.api.js: src/components/MyComponent.json ->  "props"/"items" missing required API prop "category" for its type (Array)
```

In this case, the JSON API item needs **category: ""**

Here is another common error:
```
[Error] build.api.js: src/components/MyComponent.json ->  "props"/"error-color" missing required API prop "examples" for its type (String)
```

In this case, the JSON API item needs **examples: []**

## Validation
Validation is done after the JSON file is processed.

The code will check your declared props against the associated source file. If the definition of a prop is not in the json file, you will see a message like this:
```
[Error] MyComponent.json: missing "props" -> "some-prop" definition
```

This means, your code has, in **props**, a property of **some-prop** that is missing from your JSON API and it should be documented.

Another validation error you might see is:
```
Error] MyComponent.json: missing "methods" -> "renderComponent" definition
```
All functions are validated against the source. Non-public functions should start with two underscores (`__`). All public functions should be decribed in your JSON API.

# Donate
If you appreciate the work that went into this, please consider donating to [Quasar](https://donate.quasar.dev) or [Jeff](https://github.com/sponsors/hawkeye64).

# License
MIT (c) Jeff Galbraith <jeff@quasar.dev>
