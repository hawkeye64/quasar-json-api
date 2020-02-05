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
The JSON API can be used to simplify your component/directive by having a consistent JSON structure that can be read by several libraries. This is currently supported by Quasar's command-line via `quasar describe <component|directive>`. It is also supported by the [JSON API Viewer](https://github.com/hawkeye64/json-api-viewer) component.

JSON API can be parsed for one or more Components, Directives, Plugins, or utility libraries.

## Top-Level Blocks
There are several top-level blocks:
1. meta
2. props
3. events
4. slots
5. scopedSlots
6. methods

### Meta
The **meta** object currently contains a single **docsUrl** key, which is the location to your documentation. This is used by the `quasar describe ...` command-line utility.

Example:
```json
  "meta": {
    "docsUrl": "https://quasarframework.github.io/quasar-ui-qmediaplayer/docs"
  },
```

## Anatomy of an Object
An object describes a portion of your API. Let's say you want to describe a property called **backgroundColor**. You need to change any camel-case names to snake-case, so when described, this property now becomes **background-color**.

Example:
```json
  "background-color": {
    "type": "String",
    "category": "style",
    "desc": "Color name for component from the [Quasar Color Pallete](https://quasar.dev/style/color-palette)",
    "applicable": [ "Audio", "Video" ],
    "examples": [
      "background-color=\"black\"",
      "background-color=\"teal-10\""
    ]
  },
```

Available keys for described objects are:
1. type (required) | [String | Array]
2. category (required) | String
3. desc (required) | String
4. applicable | [String | Array]
5. examples (required, unless type is Boolean) | Array
6. required | Boolean
7. values | Array
8. definition | Object
9. reactive | Boolean
10. sync | Boolean
11. link | String (URL)
12. addedIn | String
13. params | Object
14. returns | Any
15. scope | Object (scopedSlots only)

Not all keys are applicable to all the top-level blocks.

### Types
The available types are:
1. Boolean
2. String
3. Number
4. Object
5. Array
6. Date
7. Event
8. FileList
9. Map
10. Promise
11. Function
12. MultipleTypes
13. Error
14. Component

### Describing
Let's look at a longer property description:
```json
  "sources": {
    "type": "Array",
    "category": "model",
    "desc": "The one or more sources for Video or Audio. The browser will pick the best one to play based on available codecs on the client's system",
    "applicable": [ "Audio", "Video" ],
    "definition": {
      "src": {
        "type": "String",
        "desc": "Path to a source",
        "examples": [
          "src='https://your-server/your-video.mov'",
          "src='https://your-server/your-audio.mp3'"
        ]
      },
      "type": {
        "type": "String",
        "desc": "The kind of source",
        "examples": [
          "type='video/mp4'",
          "type='audio/mp3'"
        ]
      }
    },
    "examples": [
      ":sources=\"[{ src: 'https://your-server/your-video.mov', type: 'video/mp4' }]\"",
      ":sources=\"[{ src: 'https://your-server/your-audio.mp3', type: 'audio/mp3' }]\""
    ]
  },
```

And, here is an example of a property that is a **Function**:
```json
  "extend": {
    "type": "Function",
    "category": "extend",
    "desc": "Used to extend the markdown processor. You can use any 'markdown-it' plugin or write your own",
    "params": {
      "md": {
        "type": "Object",
        "desc": "The `markdown-it` instance",
        "__exemption": [ "examples" ]
      }
    },
    "examples": [
      ":extend=\"extendMarkdownFn\"",
      ":extend=\"(md) => extendMarkdownFn(md)\""
    ],
    "returns": null
  },
```

Notice for the **params** section, we defer the required example by using **"__exemption": [ "examples" ]** instead. Soime places just don't make sense to have an example, if you have examples elsewhere for that object.

Let's look at one more property that takes a Function so you get a feel for the JSON:
```json
  "drag-over-func": {
    "type": "Function",
    "category": "behavior",
    "desc": "The function to handle dragover events",
    "params": {
      "event": {
        "type": "Object",
        "desc": "The event associated with the dragover",
        "__exemption": [ "examples" ]
      },
      "timestamp": {
        "type": "Object",
        "desc": "The timestamp object associated with the date and optional time (if an interval)",
        "__exemption": [ "examples" ]
      },
      "type": {
        "type": "String",
        "desc": "This can be 'day', 'interval' or 'resource'",
        "examples": [
          "day",
          "interval",
          "resource"
        ]
      },
      "index": {
        "type": "Number",
        "desc": "The column-count index location of the start of the drag (only available if property `column-count` is set)",
        "__exemption": [ "examples" ]
      }
    },
    "applicable": [
      "All"
    ],
    "returns": {
      "type": "Boolean",
      "desc": "If the event was handled"
    },
    "examples": [
      ":drag-over-func=\"onDragOver\""
    ]
  },
```

Notice in the previous example, the return type was just **null**. In the example above, the return type is slightly more sophisticated.

Let's describe an event:
```json
  "toc": {
    "desc": "If `toc` property is `true` then if a TOC is generated it is emitted via this event",
    "params": {
      "tocData": {
        "type": "Array",
        "desc": "Array of one or more TOC data objects",
        "definition": {
          "id": {
            "type": "String",
            "desc": "The id for the TOC header",
            "__exemption": [ "examples" ]
          },
          "label": {
            "type": "String",
            "desc": "The TOC header label",
            "__exemption": [ "examples" ]
          },
          "level": {
            "type": "Number",
            "desc": "The TOC header type (1=h1, 2=h2, etc)",
            "__exemption": [ "examples" ]
          },
          "children": {
            "type": "Array",
            "desc": "This is normally empty, unless you pass this toc array to the `makeTree` method",
            "__exemption": [ "examples" ]
          }
        }
      }
    }
  }
```
You will notice some of the keys used for properties do not apply, even if it was required.

Let's describe a slot and scopedSlot:
```json
  "spinner": {
    "desc": "Slot for replacing the default spinner/loading icon",
    "applicable": [ "Audio", "Video" ]
  },
```

```json
  "column-header-before": {
    "desc": "Use to render items before the column header",
    "scope": {
      "data": {
        "type": "Object",
        "desc": "Timestamp object",
        "__exemption": [ "examples" ]
      }
    },
    "applicable": [
      "day"
    ]
  },
  "column-header-after": {
    "desc": "Use to render items after the column header",
    "scope": {
      "data": {
        "type": "Object",
        "desc": "Timestamp object",
        "__exemption": [ "examples" ]
      }
    },
    "applicable": [
      "day"
    ]
  },
```

Notice for **scopedSlots** the use of the **scope** key.

#### Methods
When a JSON file is parsed, a corresponding JS file of the same name is located. If found, this file is also parsed. When the **methods** section is parsed, it looks for __private__ vs __public__ methods. Private methods should start with two underscores (**__**). If a method is found, that is public and not described in your JSON API, this will cause an error. Either make the method public or add a section for it in your JSON API.

If a described method does not include a **returns** key, then it is assumed to be **undefined**.

# JSON API Examples
[QCalendar](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/dev/ui/src/components/QCalendar.json)
[QMarkdown](https://raw.githubusercontent.com/quasarframework/quasar-ui-qmarkdown/dev/ui/src/components/QMarkdown.json)
[QMediaPlayer](https://raw.githubusercontent.com/quasarframework/quasar-ui-qmediaplayer/dev/ui/src/components/QMediaPlayer.json)

# Donate
If you appreciate the work that went into this, please consider donating to [Quasar](https://donate.quasar.dev) or [Jeff](https://github.com/sponsors/hawkeye64).

# License
MIT (c) Jeff Galbraith <jeff@quasar.dev>
