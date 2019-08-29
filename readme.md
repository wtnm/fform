# Table of content

<!-- toc -->

- [Overview](#overview)
    + [Features](#features)
- [Installation & Usage](#installation--usage)
    + [Without JSON validaton](#without-json-validaton)
    + [With JSON validaton](#with-json-validaton)
- [Examples](#examples)
- [Documentation](#documentation)

<!-- tocstop -->

## Overview
Flexible Form (`fform`) - form builder with minimum redundancy, maximum flexibility, and extendability. It uses **JSONSchema** (draft v4) to describe forms, **React** (v16) for rendering and has native **Redux** support for state storage but can be used with any other external storage or can use only internal storage (storage agnostic).

See [fform-constructor](https://wtnm.github.io/fform-constructor/index.html) for live demo.

#### Features
- **90kb** minified, **26kb** gziped
- [form-constuctor](https://wtnm.github.io/fform-constructor/index.html) for quick start
- form extension, combination and reuse with JSONSchema's `allOf`, `oneOf`, `$ref` properties
- sync/async/JSON/submit validation
- storage agnostic, native redux support, can be used with any external storage or can use own internal storage
- built-in arrays (add/del/move operations)
- built-in viewer
- fully customizable
- SSR support
- Zero dependencies (React as external)


## Installation & Usage

To install the stable version:

```
npm install --save fform
```

This assumes that you are using [npm](https://www.npmjs.com/) with a module bundler like [webpack](https://webpack.js.org/)


#### Without JSON validaton

```js
import {FForm, elements} from 'fform';
import {render} from 'react-dom';

render(<FForm core={{schema: {type:"string"}, elements}}/>, document.querySelector('#root'));
```

#### With JSON validaton

```js
import {FForm, elements} from 'fform';
import {render} from 'react-dom';

import imjvWrapper from 'fform/addons/imjvWrapper';
import * as imjvValidator from 'fform/addons/is-my-json-valid-lite';
const JSONValidator = imjvWrapper(imjvValidator);

render(<FForm core={{schema: {type:"string"}, elements, JSONValidator}}/>,
		document.querySelector('#root'));
```

How to use with different storages see in [documentation](documentation.md#redux-storage)

## Examples
<!-- toc-examples -->

- [simple form](https://wtnm.github.io/fform-constructor/index.html#url=examples.json&selector=0)
- [layouts and viewer](https://wtnm.github.io/fform-constructor/index.html#url=examples.json&selector=1)
- [arrays and oneOf](https://wtnm.github.io/fform-constructor/index.html#url=examples.json&selector=2)
- [stateMaps](https://wtnm.github.io/fform-constructor/index.html#url=examples.json&selector=3)
- [validation](https://wtnm.github.io/fform-constructor/index.html#url=examples.json&selector=4)
- [format and parse](https://wtnm.github.io/fform-constructor/index.html#url=examples.json&selector=5)
- [schema exten](https://wtnm.github.io/fform-constructor/index.html#url=examples.json&selector=6)
- [custom input](https://wtnm.github.io/fform-constructor/index.html#url=examples.json&selector=7)
- [tabs and steps](https://wtnm.github.io/fform-constructor/index.html#url=examples.json&selector=8)

<!-- tocstop -->


## Documentation
<!-- toc-docs -->

- [FForm](documentation.md#fform)
    + [Passing FFStateApi props](documentation.md#passing-ffstateapi-props)
    + [Using with redux Provider](documentation.md#using-with-redux-provider)
- [FFStateApi](documentation.md#ffstateapi)
  * [Storages](documentation.md#storages)
    + [Redux storage](documentation.md#redux-storage)
    + [External storage](documentation.md#external-storage)
    + [Internal storage](documentation.md#internal-storage)
  * [Path](documentation.md#path)
  * [Data object](documentation.md#data-object)
- [API](documentation.md#api)
    + [`get(...paths: string | string[]`)](documentation.md#getpaths-string--string)
    + [`set(path: string | string[], value: any, opts?: setOpts )`](documentation.md#setpath-string--string-value-any-opts-setopts-)
    + [`getValue(opts?: getValueOpts)`](documentation.md#getvalueopts-getvalueopts)
    + [`setValue(value: any, opts?: setValueOpts)`](documentation.md#setvaluevalue-any-opts-setvalueopts)
    + [`getDefaultValue()`](documentation.md#getdefaultvalue)
    + [`reset(opts?: resetOpts)`](documentation.md#resetopts-resetopts)
    + [`clear(opts?: clearOpts)`](documentation.md#clearopts-clearopts)
    + [`validate(path: boolean | string | string[], opts?: APIOptsType)`](documentation.md#validatepath-boolean--string--string-opts-apioptstype)
    + [`arrayAdd(path: string | string[], value: number | any[], opts?: APIOptsType)`](documentation.md#arrayaddpath-string--string-value-number--any-opts-apioptstype)
    + [`arrayItemOps(path: string | string[], op: string, opts: arrayItemOpts)`](documentation.md#arrayitemopspath-string--string-op-string-opts-arrayitemopts)
    + [`setHidden(path: string | string[], value?: boolean, opts?: APIOptsType)`](documentation.md#sethiddenpath-string--string-value-boolean-opts-apioptstype)
    + [`showOnly(path: string | string[], opts?: APIOptsType)`](documentation.md#showonlypath-string--string-opts-apioptstype)
    + [`getActive()`](documentation.md#getactive)
    + [`execute()`](documentation.md#execute)
- [Basic schema properties](documentation.md#basic-schema-properties)
    + [Metadata](documentation.md#metadata)
    + [Number Validation](documentation.md#number-validation)
    + [String Validation](documentation.md#string-validation)
    + [Array Validation](documentation.md#array-validation)
    + [Object Validation](documentation.md#object-validation)
    + [Combining Schemas](documentation.md#combining-schemas)
- [Extended schema properties](documentation.md#extended-schema-properties)
    + [`_placeholder?: string`](documentation.md#_placeholder-string)
    + [`_params?: FFParamsType`](documentation.md#_params-ffparamstype)
    + [`_data?: any`](documentation.md#_data-any)
    + [`_presets?: string`](documentation.md#_presets-string)
    + [`_simple?: boolean`](documentation.md#_simple-boolean)
    + [`_enumExten?: { [key: string]: undefined | string | object }`](documentation.md#_enumexten--key-string-undefined--string--object-)
    + [`_stateMaps?: Array`](documentation.md#_statemaps-array-)
    + [`_validators?: Array`](documentation.md#_validators-array)
    + [`_oneOfSelector: string | dataHandler`](documentation.md#_oneofselector-string--datahandler)
    + [`_custom?: FFCustomizeType`](documentation.md#_custom-ffcustomizetype)
    + [`_layout?: FFLayoutCustomizeType`](documentation.md#_layout-fflayoutcustomizetype)
- [Validation](documentation.md#validation)
    + [JSON validation](documentation.md#json-validation)
    + [Sync/async validation](documentation.md#syncasync-validation)
- [Field structure and customization](documentation.md#field-structure-and-customization)
- [Form layout](documentation.md#form-layout)
- [Elements](documentation.md#elements)
    + [Props processing](documentation.md#props-processing)
    + [Data handlers](documentation.md#data-handlers)
    + [$_maps](documentation.md#_maps-)
    + [Structure](documentation.md#structure)
- [Styling](documentation.md#styling)
- [SSR](documentation.md#ssr)

<!-- tocstop -->
