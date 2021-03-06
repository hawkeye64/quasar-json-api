# quasar-json-api

![quasar-json-api](https://img.shields.io/npm/v/quasar-json-api.svg?label=quasar-json-api)
[![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/hawkeye64/quasar-json-api.svg)]()
[![GitHub repo size in bytes](https://img.shields.io/github/repo-size/hawkeye64/quasar-json-api.svg)]()
[![npm](https://img.shields.io/npm/dt/quasar-json-api.svg)](https://www.npmjs.com/package/quasar-json-api)

# Description
The `quasar-json-api` is a library to **normalize** and **validate** your JSON Api for a Quasar Component, Directive, or Mixin.

As well, it'll create `Vetur` compliant files, so that when using `vscode` with `vetur` you get suggestions and completions.

(New **v1.2.0**): Not only that, but `quasar-json-api` can generate your typescript definitions automatically inferred by your JSON API. More on this below.

The output of the results will be placed in the **dist/api**, **dist/vetur** and **dist/types** folders, respectively.

**Note:** starting with **v1.2.0** you no longer have to add the code to create the specific folders in `./build/index.js`. If you have this, then you can safely remove it.

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

require('quasar-json-api')({
  buildVetur: true,  // optional
  buildTypes: true,  // optional
  forcedTypes: [     // optional
    'Timestamp'      // force type def to import from your types.d.ts
  ]
})
```

Notice the `options`? This is where you can turn on/off particular builds. By default, `buildVetur` is `true` for backwards compatibility. However, by default, the `buildTypes` is `false` and must be explicitly turned on.

In your `build/script.javascript.js` find the `build(builds)` command and modify as follows:

```js
build(builds)
  .then(() => {
    require('./build.api.js')
  })
```

In your `package.json`, add the following for Vetur:

```json
  "vetur": {
    "tags": "dist/vetur/tags.json",
    "attributes": "dist/vetur/attributes.json"
  },
```

In your `package.json`, add the following for Types:

```json
  "typings": "dist/types/index.d.ts",
  },
```

That's it!

When you build your Component or Directive via `yarn build` (from your UI kit templated package), your JSON API will be **Normalized** and **Validated** and the output will be placed in the `dist/api` folder.

One more item to disclose. The JSON file should have the same name as your component so it can validate against the source after the normalization is done.

For instance, if your component or directive is **MyComponent.js**, then your JSON API file will be called **MyComponent.json**.

_Note:_ Files atarting with two underscores (`__`) are ignored.

If you want to set up a script in your `package.json`, you can add the following:

```json
  "scripts": {
    "build:api": "node build/build.api.js"
  },
```

Now, you can concentrate on any JSON API issues you have by running `yarn build:api`.

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
7. computed

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
1. type (required) | [String | Array | Object]
2. tsType | String
3. category (required) | String
4. desc (required) | String
5. applicable | [String | Array]
6. examples (required, unless type is Boolean) | Array
7. required | Boolean
8. values | Array
9. definition | Object
10. reactive | Boolean
11. sync | Boolean
12. link | String (URL)
13. addedIn | String
14. params | Object
15. returns | Any
16. addedIn | String
17. deprecated | String
18. removedIn | String
19. scope | Object (scopedSlots only)

Not all keys are applicable to all the top-level blocks.

Also, notice the "tsType" which is new for building typescript definitions. More about this below.

## Types

The available types are:
1. Boolean
2. String
3. Number
4. Object
5. Array
6. Date
7. Event
8. File
9. FileList
10. Map
11. Promise
12. Function
13. MultipleTypes
14. Error
15. Component

## Describing

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

Notice for the **params** section, we defer the required example by using **"__exemption": [ "examples" ]** instead. Some objects just don't make sense to have an example, if you have examples elsewhere for that object.

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

Let's describe an **event**:
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
        "tsType": "Timestamp",
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
        "tsType": "Timestamp",
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

## Methods and Computed

When a JSON file is parsed, a corresponding JS file of the same name is located. If found, this file is also parsed. When the **methods** or **computed** sections are parsed, it looks for __private__ vs __public__ methods. Private methods/computed should start with two underscores (**__**). If a method or computed is found, that is public and not described in your JSON API, this will cause an error. Either make the method/computed private or add a section for it in your JSON API.

If a described method/computed does not include a **returns** key, then it is assumed to be **undefined**.

Here is an example of describing a method:

```json
  "move": {
    "desc": "Triggers component to move for count iterations, depending on positive (forwards) or negative (backwards) value",
    "applicable": [ "All"],
    "params": {
      "count": {
        "type": "Number",
        "desc": "The amount of iterations to move (negative for backwards, positive for forwards)",
        "examples": [
          "-5 (moves 5 iterations backward - if in `month` view, this would be -5 months",
          "5 (moves 5 iterations forward - if in `day` view, this would be 5 days"
        ]
      }
    }
  },
```

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
[Error] MyComponent.json: missing "methods" -> "renderComponent" definition
```
All functions are validated against the source. Non-public functions should start with two underscores (`__`). All public functions should be decribed in your JSON API.

# Typescript Definitions

(Optional) In the `ui` folder create a `types` folder, sibling to the `src` folder. Anything in this folder will be copied over to your `dist/types` folder. Here, you can add a `types.d.ts` file. You would put any additional type defintions here that are used in your JSON API with the `tsType` JSON API key.

This is an example from QCalendar
```ts
export interface Timestamp {
  date: string;
  time: string;
  year: number;
  month: number;
  day: number;
  weekday: number;
  hour: number;
  minute: number;
  doy: number;
  workweek: number;
  hasDay: boolean;
  hasTime: boolean;
  past: boolean;
  current: boolean;
  future: boolean;
  disabled: boolean;
}

export type TimestampArray = Timestamp[]
export type TimestampOrNull = Timestamp | null

export type TimestampFormatter = (timestamp: Timestamp, short: boolean) => string;
export type TimestampFormatOptions = (timestamp: Timestamp, short: boolean) => TimestampFormatter;
export type TimestampMoveOperation = (timestamp: Timestamp) => Timestamp;

export interface TimeObject {
  hour: number,
  minute: number
}

export type TimeObjectOrNumberOrString = TimeObject | number | string

export interface AddToDateOptions {
  year?: number | string,
  month?: number | string,
  day?: number | string,
  hour?: number | string,
  minute?: number | string,
}

export interface ColumnObject {
  id?: number | string,
  key?: number | string
}

export type ColumnObjectArray = ColumnObject[]

export interface ResourceObject {
  label?: string,
  height?: number,
  expanded?: boolean,
  children?: ResourceObjectArray
}

export type ResourceObjectArray = ResourceObject[]
```

These are all used in the QCalendar.json file. When the parser sees a `"tsType": "Timestamp"` defined on an item (where it'd also have `"type": "Object"`), then `Timestamp` will be imported from your `types.d.ts` file. You you don't provide a `tsType`, then definitions with Object or Array will get a type of `LooseDictionary`, if they cannot be built from the JSON API "definition" schema.

And don't worry, all of your types will also be automatically exported for `types.d.ts` from within the `index.d.ts` file. However, if you found something is missing, you can force it with the option key `forcedTypes` which is an array of types to import from your `types.d.ts`.


So, if you have additional files in the `types` folder, then make sure you do this from your `types.d.ts` so everything is exported properly:

```ts
export * from './your-file-name' // your-file-name.d.ts
```

Needless to say, DO NOT add an `index.d.ts` in your `types` folder, otherwise it will be overwritten. Other files created, that you should avoid colliding with, are: `ts-helpers.d.ts`, `tsconfig.json` and `vue.d.ts`.

One last item to mention. Avoid using arrays on `tsType`. Instead, in your `types.d.ts`, export a `type` that combines your types, like this, into a single type:

```ts
export type TimeObjectOrNumberOrString = TimeObject | number | string
export type TimeObjectOrNumberOrStringArray = TimeObjectOrNumberOrString[]
```

And then use the exported type in your JSON API. This will then be imported into `index.d.ts` from your `types.d.ts`.

Additionally, the first time it is run, a `types` will be added to your `package.json`:

```json
"typings": "dist/types/index.d.ts",
```

If this already exists, it will **not** be overwritten. Meaning if it is incorrect, your type definitions will not work correctly.

## Typescript Definition Issues

Before releasing your package, the first time you generate typescript definitions, or any time you build after a subsequent change to your JSON API, you should inspect the `dist/types/index.d.ts` for issues or descrepancies and correct any that you may have.

---

# JSON API Examples

- [QCalendar](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/dev/ui/src/components/QCalendar.json)
- [QMarkdown](https://raw.githubusercontent.com/quasarframework/quasar-ui-qmarkdown/dev/ui/src/components/QMarkdown.json)
- [QMediaPlayer](https://raw.githubusercontent.com/quasarframework/quasar-ui-qmediaplayer/dev/ui/src/components/QMediaPlayer.json)

# Donate

If you appreciate the work that went into this, please consider donating to [Quasar](https://donate.quasar.dev) or [Jeff](https://github.com/sponsors/hawkeye64).

# License

MIT (c) Jeff Galbraith <jeff@quasar.dev>
