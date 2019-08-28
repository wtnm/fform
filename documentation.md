
# Documentation

<!-- toc -->

- [FForm](#fform)
    + [Passing FFStateApi props](#passing-ffstateapi-props)
    + [Using with redux Provider](#using-with-redux-provider)
- [FFStateApi](#ffstateapi)
  * [Storages](#storages)
    + [Redux storage](#redux-storage)
    + [External storage](#external-storage)
    + [Internal storage](#internal-storage)
  * [Path](#path)
  * [Data object](#data-object)
- [API](#api)
    + [`get(...paths: string | string[]`)](#getpaths-string--string)
    + [`set(path: string | string[], value: any, opts?: setOpts )`](#setpath-string--string-value-any-opts-setopts-)
    + [`getValue(opts?: getValueOpts)`](#getvalueopts-getvalueopts)
    + [`setValue(value: any, opts?: setValueOpts)`](#setvaluevalue-any-opts-setvalueopts)
    + [`getDefaultValue()`](#getdefaultvalue)
    + [`reset(opts?: resetOpts)`](#resetopts-resetopts)
    + [`clear(opts?: clearOpts)`](#clearopts-clearopts)
    + [`validate(path: boolean | string | string[], opts?: APIOptsType)`](#validatepath-boolean--string--string-opts-apioptstype)
    + [`arrayAdd(path: string | string[], value: number | any[], opts?: APIOptsType)`](#arrayaddpath-string--string-value-number--any-opts-apioptstype)
    + [`arrayItemOps(path: string | string[], op: string, opts: arrayItemOpts)`](#arrayitemopspath-string--string-op-string-opts-arrayitemopts)
    + [`setHidden(path: string | string[], value?: boolean, opts?: APIOptsType)`](#sethiddenpath-string--string-value-boolean-opts-apioptstype)
    + [`showOnly(path: string | string[], opts?: APIOptsType)`](#showonlypath-string--string-opts-apioptstype)
    + [`getActive()`](#getactive)
    + [`execute()`](#execute)
- [Basic schema properties](#basic-schema-properties)
    + [Metadata](#metadata)
    + [Number Validation](#number-validation)
    + [String Validation](#string-validation)
    + [Array Validation](#array-validation)
    + [Object Validation](#object-validation)
    + [Combining Schemas](#combining-schemas)
- [Extended schema properties](#extended-schema-properties)
    + [`_placeholder?: string`](#_placeholder-string)
    + [`_params?: FFParamsType`](#_params-ffparamstype)
    + [`_data?: any`](#_data-any)
    + [`_presets?: string`](#_presets-string)
    + [`_simple?: boolean`](#_simple-boolean)
    + [`_enumExten?: { [key: string]: undefined | string | object }`](#_enumexten--key-string-undefined--string--object-)
    + [`_stateMaps?: Array`](#_statemaps-array-)
    + [`_validators?: Array`](#_validators-array)
    + [`_oneOfSelector: string | DataProcessor`](#_oneofselector-string--dataprocessor)
    + [`_custom?: FFCustomizeType`](#_custom-ffcustomizetype)
    + [`_layout?: FFLayoutCustomizeType`](#_layout-fflayoutcustomizetype)
- [Validation](#validation)
    + [JSON validation](#json-validation)
    + [Sync/async validation](#syncasync-validation)
- [Field customization](#field-customization)
- [Form layout](#form-layout)
- [Elements](#elements)
    + [Props processing](#props-processing)
    + [Data processors](#data-processors)
    + [$_maps](#_maps-)
    + [Structure](#structure)
- [Styling](#styling)
- [SSR](#ssr)

<!-- tocstop -->


## FForm
Component expects following properties:
- `core` - instance of [FFStateApi](#ffstateapi)  or object with [FFStateApi props](#ffstateapi)
- `state?: any` - state of FFStateApi.
- `value?: any` - form's current value.
- `inital?: any` - form's initial value.
- `fieldCache?: boolean | number` - caching delay on updating form's value. Used for optimization purposes.
- `_$useTag?: string | Function` - html tag. Default `form`.
- `touched` - sets `untouched` property to `false`.

- `onSubmit?: (event: any) => any` - executed on form submit. Supports `event.preventDefault()`.
- `onChange?: (event: any) => void` - executed on value change.
- `onStateChange?: (event: any) => void` - executed on state change.

For methods `onSubmit`, `onChange`, `onStateChange` event has access to additional properties:
`value` - current form value.
`state` - current form state.
`fform` - link to the form.

After creation [FFStateApi](#ffstateapi) can accessed throught `api` property.

#### Passing FFStateApi props
Property `core` with [FFStateApi props](#ffstateapi) processed only on creation (creating new instance of [FFStateApi](#ffstateapi)). On property update, if `core` is an object with [FFStateApi props](#ffstateapi) then `core` is ignored (new instance of [FFStateApi](#ffstateapi) is not created). Otherwise, if (on property update) `core` is instance of [FFStateApi](#ffstateapi)  `FForm` component will make full rebuild.

#### Using with redux Provider
`FForm` can take store from the context on creation if property `core` is object with [FFStateApi props](#ffstateapi). Just put `FForm` inside redux `Provider` with a properly created store and leave `store` property undefined. To prevent from taking store from context (and not using store at all) set `store` property to false or null.

## FFStateApi
On creation pass to constructor object as first argument with following props:
-   `schema` - schema that will be used to create state
-   `name?: string` - name that will be used to access data in redux storage and for fields naming
-   `objects?` - [elements](#elements), that contains all necessary for  components creation
-   `JSONValidator?` - JSON schema validator for [JSON validation](#json-validation)
-   `store?:any` - redux store. [FForm](#fform) can take store from context
-   `getState?: () => any` - external state setter
-   `setState?: (state: any) => void` - external state getter

After creation FFStateApi can be manipulated through [API methods](#api)

### Storages
#### Redux storage
Create redux store with [thunk](#https://github.com/reduxjs/redux-thunk) and with `formReducer` with "fforms" in root reducer:
```
const {formReducer} = require('fform');
const {createStore, combineReducers, applyMiddleware} = require('redux');
const thunk = require('redux-thunk').default;
store = createStore(combineReducers({fforms: formReducer()}), applyMiddleware(thunk))
```
Then pass redux store in `store` property on [FFStateApi](#ffstateapi) creation:
```
const {FFormStateAPI} = require('fform');
stateApi = new FFormStateAPI({store, schema})
```

#### External storage
Pass `setState/getState` function  from any storage on [FFStateApi](#ffstateapi) creation and it will use them for setting and getting fform state.

#### Internal storage
if no `setState/getState` or `store` are passed on creation then [FFStateApi](#ffstateapi) will use own internal storage for fform state.


### Path<a name="path"></a>
String (or array or strings) value delimited with '/' that describes path to field. Following paths are equal:` '#/objects/array/field_1',  ['#', 'object/array', 'field_1'], ['object', '/array/', '/field_1/']`

Each field has [data object](#data-object) that can be accessed in path by using `'@'` symbol: `'/field_1@value', ['object/array', '@', 'length']`

`'#'` - is the root element of schema state. Can be omitted.

A path can be relative. The relative path starts with `'.'` or `'..'` and resolved relatively fields it has used.

API set functions support path-multiplying:
- Comma-separated fields. Path 'array/1,2/field,prop' turns to 4 paths 'array/1/field', 'array/1/prop', 'array/2/field', 'array/2/prop'. Works for both field-part(part before '@') and data-part(part after '@') of path.
- Symbol `'*'` turns into all props of object/array. Path 'array/*' (for array with length 3) turns to 'array/0', 'array/1', 'array/2'. Works only for field-part(part before '@') of path.

### Data object<a name="data-object"></a>
Each field has data object that is created according to [JSON schema](#basic-schema-properties) and can be changed through [API](#api)
Data object has the following props:
- `value?: any`
- `length?: number`
- `oneOf: number`
- `fData`:
    - `title: string`
    - `type: string`
    - `required: boolean`
    - `canAdd?: boolean`
    - `placeholder?: string`
- `status`:
    - `priority?: number`
    - `invalid: number` - 0 if all children is 0
    - `dirty: number` - 0 if all children is 0
    - `untouched: number` - 0 if all children is 0
    - `pending: number` - 0 if all children is 0
    - `valid: boolean` - null if pending else !invalid
    - `pristine: boolean` - !dirty
    - `touched: boolean` - !untouched
- `params`:
	- `liveUpdate?: boolean`
	- `liveValidate?: boolean`
	- `autofocus?: boolean`
	- `readonly?: boolean`
	- `disabled?: boolean`
	- `hidden?: boolean`
	- `norender?: boolean`
	- `viewer?: boolean`
-  `arrayItem?`:
    `canUp?: boolean`
    `canDown?: boolean`
    `canDel?: boolean`
-  `messages?: { [priority: number]: {`
	- `textGroups: string[][]`
	- `norender?: boolean`
`} )`



## API
- #### `get(...paths: string | string[]`)
*Returns* data in [path(es)](#path)

- #### `set(path: string | string[], value: any, opts?: setOpts )`
Set value in path. *Returns* [ApiPromise](#apipromise)
	- `path: string | string[]` - [path](#path) to data
	- `value: any` - value to set
	- `opts?: setOpts` - object with props:
		- [APIOptsType](#apioptstype)
		- `replace?: boolean` - replace value if true or merge if false (actual for objects and arrays)
		- `setOneOf?: number` - will try to switch to [oneOf index](#combining-schemas)
		- `macros?: string` - executes macros


- #### `getValue(opts?: getValueOpts)`
*Returns* form's value
	- `opts: getValueOpts` - object with props:
		- `path?: string | string[]` - path to field. If not passed value of all form will be returned.
		- `inital?: boolean` - if true returns inital value else current value will be returned


- #### `setValue(value: any, opts?: setValueOpts)`
Set form's value *Returns* [ApiPromise](#apipromise)
	- `value: any` - value to set
	- `opts?: setValueOpts` - object with props:
		- [APIOptsType](#apioptstype)
		- `path?: string | string[]` - path to field. If not passed value of all form will be set.
		- `inital?: boolean` - if true returns inital value else current value will be returned
		- `replace?: boolean` - replace value if true or merge if false (actual for objects and arrays)
		- `setOneOf?: number` - will try to switch to [oneOf index](#combining-schemas)


- #### `getDefaultValue()`
*Returns* form's default value


- #### `reset(opts?: resetOpts)`
Set form's value to inital. *Returns* [ApiPromise](#apipromise)
	- `opts?: resetOpts` - object with props:
		- [APIOptsType](#apioptstype)
		- `path?: string | string[]` - path to field. If not passed all form will be reset.
		- `status?: 'untouched' | 'invalid' | 'dirty' | 'pending'` = resets passed status instead of reseting form's value


- #### `clear(opts?: clearOpts)`
Set form's value to default. *Returns* [ApiPromise](#apipromise)
	- `opts?: clearOpts` - object with props:
		- [APIOptsType](#apioptstype)
		- `path?: string | string[]` - path to field. If not passed all form will be cleared.


- #### `validate(path: boolean | string | string[], opts?: APIOptsType)`
Validates form in path.  *Returns* [ApiPromise](#apipromise)
	- `path: string | string[]` - If path is `true` then validates full form. If path is `false` then cancel any validation that was set before.
	- `opts?: `[APIOptsType](#apioptstype)


- #### `arrayAdd(path: string | string[], value: number | any[], opts?: APIOptsType)`
*Returns* [ApiPromise](#apipromise)
	- `path: string | string[]` - path to array field
	- `value` - number determines how many items will added (or removed if negtive). If value is any[] then it will be concated to existing array's value
	- `opts?: `[APIOptsType](#apioptstype)


- #### `arrayItemOps(path: string | string[], op: string, opts: arrayItemOpts)`
*Returns* [ApiPromise](#apipromise)
	- `path: string | string[]` - path to array's item field
	- `op: 'up' | 'down' | 'first' | 'last' | 'del' | 'move' | 'shift'` - operation that should be done to item
	- `opts?: arrayItemOpts` - object with props:
		- [APIOptsType](#apioptstype)
		- `value?: number` - for 'move' and 'shift'`operations. If 'move' then item will be moved to that position. If 'shift' then item will be shifted to that value


- #### `setHidden(path: string | string[], value?: boolean, opts?: APIOptsType)`
Set hidden param in [path](#path). *Returns* [ApiPromise](#apipromise)
	- `path: string | string[]` - path to field
	- `value?: boolean` - value that shold be set to param hidden. Default is true.
	- `opts?: `[APIOptsType](#apioptstype)


- #### `showOnly(path: string | string[], opts?: APIOptsType)`
Shows properties of object in  [path](#path) and hides others. *Returns* [ApiPromise](#apipromise)
	- `path: string | string[]` - path to field
	- `opts?: `[APIOptsType](#apioptstype)


- #### `getActive()`
*Returns* path of currently active field.


- #### `execute()`
Executes all bathed updates.  *Returns* [ApiPromise](#apipromise)


**ApiPromise** <a name="apipromise"></a>:
API set functions returns promise that will be resolved after changes is made (actual only for asynchronous updates).
Also returned promise has property 'vAsync' which is promise either. This promise will be resolved after all async validation that was triggered by update will be resolved.


**ApiOptsType** <a name="apioptstype"></a>:
- `execute?: true | number` - if true then execute synchronously and immediately. If number then executed asynchronously after the number in milliseconds passed. Default is 0, that means asynchronous execution right after calling code is finished.
Multiple asynchronous commands are stacking in batch and executes together.
- `noValidation?: boolean` - No validation is made if true.



## Basic schema properties
- **`$ref?: string`** - used by `fform`. Reference to another part of the schema. Logically replaced with the thing that it points to.  If set, then all other properties are ignored. Logically replaced with the thing that it points to. Togetger with `allOf` property, it is used to extend schemes.
- **`type?: string | string[]`** - used by `fform`. The basic type of this schema, can be one of * [string, number, object, array, boolean, null] * or an array of the acceptable types
-  **`enum?: any[]`** - used by `fform`. Enumerates the values that this schema can be  e.g. {"type": "string",   "enum": ["red", "green", "blue"]}
-  **`definitions?: { [key: string]: JSONschema }`** - used by `fform`. Holds simple JSON Schema definitions for  referencing from elsewhere.

#### Metadata
- **`title?: string`** - used by `fform`. Title of the field.
- **`default?: any`** - used by `fform`. Default value for the object represented by this schema.
- `id?: string` - This tells refs where the root of the document is located.
- `$schema?: JSONschema;` - It is recommended that the meta-schema is included in the root of any JSON Schema.
- `description?: string` - Schema description.

#### Number Validation
-  `multipleOf?: number` - The value must be a multiple of the number (e.g. 10 is a multiple of 5)
-  `maximum?: number` - maximum value.
-  `exclusiveMaximum?: boolean` - If true maximum must be > value, >= otherwise.
-  `minimum?: number `- minimum value.
-  `exclusiveMinimum?: boolean` - If true minimum must be < value, <= otherwise.

#### String Validation
-  `maxLength?: number` - maximum length.
-  `minLength?: number` - minimum length.
-  `pattern?: string `- This is a regex string that the value must conform to.

#### Array Validation
-  **`items?: JSONschema | JSONschema[]`**  - used by `fform`. Defines fields in array.
-  **`additionalItems?: boolean | JSONschema`**  - used by `fform`. If `false` then array limited to `items` property. If `true` then `items` is used for array elements. If `JSONschema` then it is used for array elements which index is greater then `items` length.
-  **`maxItems?: number`**  - used by `fform`. Maximum length of array. Used to calculate `canAdd` value in [data-object](#data-object).
-  **`minItems?: number`**  - used by `fform`. Used to calculate `canDel` value in [data-object](#data-object).
-   `uniqueItems?: boolean` - if `true` then array elements must be unique.

#### Object Validation
-  **`required?: string[] | boolean`**  - used by `fform`.
-  **`properties?: { [property: string]: JSONschema }`** - used by `fform`. The keys that can exist on the object with the  json schema that should validate their value
-  **`additionalProperties?: boolean | JSONschema`** - used by `fform`. If `false`, then any keys that are not listed in the `properties` or match the `patternProperties` are not allowed.
-  `patternProperties?: { [pattern: string]: T }` - The key of this object is a regex for which properties the schema applies to
-  `dependencies?: { [key: string]: T | string[] }` - If the key is present as property then the string of properties must also be present. If the value is a JSON Schema then it must. Also, be valid for the object if the key is  present.
-  `maxProperties?: number` - maximum number of properties.
-  `minProperties?: number` - minimum number of properties.

#### Combining Schemas
-  **`oneOf?: JSONschema[]`** - used by `fform`. Switches the form between listed schemes. Must be valid against exactly one of the subschemas.
-  **`allOf?: JSONschema[]`** - used by `fform`. Merges listed schemes. Must be valid against all of the subschemas.
-  `anyOf?: JSONschema[]` - Must be valid against any of the subschemas.
-  `not?: JSONschema` - Must not be valid against the given schema.

## Extended schema properties
As JSON format doesn't support js-code all function moved to [elements](#elements). So in the schema you should specify a [reference to elements](#object-refs) as a string value that starts with "^/". It will be resolved at [FFStateApi](#ffstateapi) creating.

#### `_placeholder?: string`
Field's placeholder.

#### `_params?: FFParamsType` 
Inital values for parameters that can be futher changed in [data-object](#data-object)
- `liveUpdate?: boolean`
- `liveValidate?: boolean`
- `autofocus?: boolean`
-  `readonly?: boolean`
-  `disabled?: boolean`
-  `hidden?: boolean`
-  `norender?: boolean`
-  `viewer?: boolean`

#### `_data?: any` 
Any additional inital data in [data-object](#data-object)

#### `_presets?: string`
References (divided by `:`) that points to [elements](#elements). Merged into one object. If reference value without leading `^/` then `^/sets/` prepends to it. Used for component rendering.

#### `_simple?: boolean`
Determines that the value controlled by the component itself (actual for objects and arrays). This means that `fform` will create state without routines that are normally executed for objects/arrays.

#### `_enumExten?: { [key: string]: undefined | string | object }`
`enum` property extension. Keys are taken from enum. String converts to object with property `{label}`.

#### `_stateMaps?: Array<{from: string, to:string, $?:string, args?:'string'}>` <a name='statemaps'></a> 
Transmits (and processes) data within the state. An array of objects with following properties: `from` - path (can be relative) from where value is taken, `to` - path (can be relative) to where value is placed, `$` and `args` - [data processor](#data-processors) that process value when mapping. Data processor receives value according to `from` property as the first parameter
During execution each function in [data processor](#data-processors) has access (as `this`) to special object with following properties:
- `api` - [API](#api) functions. Supports relative path.
- `from` - absolute path that points to value that were passed to [data processor](#data-processors)
- `to` - absolute path that point to where result will be placed
- `path` = absolute path points to location it is executed.

After [data processor](#data-processors) executed the result will be placed according to `to` property, even if value is `undefined`. Sometimes, it is not nessesary, so to prevent this behaviour use `this.api.set(null)` construction in any function during execution. Any API call of `set` or `setValue` methods prevents from setting result that returned by [data processor](#data-processors).

#### `_validators?: Array<string | dataProcessor>`
<a name='_validators'></a> [Sync/async validators](#validation) as an array of  [data processors](#data-processors). Each data processor receives form value according to path as the first parameter when value changed. 
During execution each validator has access (as `this`) to special object with following properties:
- `api` - [API](#api) functions. Supports relative path.
- `path` = absolute path points to location it is executed.

[Data processors](#data-processors) result expected to be following type:  `Array<MessageGroupType | string> | MessageGroupType | string;`, where `MessageGroupType` is object with following properties:
-	`group?: number` -  text group, default value is: 0 - for JSON validation, 1 - for sync validation, 2 - for async validation, 3 - for submit validation.
-	`data: string | string[]` - message data. Can be [elements](#elements) reference and supports [elements props processing](#props-processing).
-	`priority?: number` - Defines the priority layer the message will be set. Default priority is `0`. If `0`-priority layer is not empty the validation considered failed. Any other priority values used for information purposes only.
-	`path?: string` - path of field where message will be placed. Default value is current schema path.
- `[key: string]: any` - any props (className, style, etc.) that will be set for this priority layer.
  inputClassName?: string;  // className for input choosen from the message with lowest priority

For async validation [Data processors](#data-processors) should return `Promise` that will be resolved to the result of type described above. Notice, that due to data processor's limitation, the promise should be returne by the last function in a [data processor](#data-processors).

#### `_oneOfSelector: string | DataProcessor`
[Data processor](#data-event-processors) that receive value to determine which oneOf schema should be chosen. Receives form value according to schema path. Expected result is index of `oneOf` array.

#### `_custom?: FFCustomizeType`
Component [customization](#customization).

#### `_layout?: FFLayoutCustomizeType`
Fields, objects, groups in an [object/array layout](#object-layout)


## Validation
#### JSON validation
FForm uses external JSON Validators by wrapping them and converting the result to a single format. There are 2 wrappers, for now, that can be found in `addons/wrappers`, one for `is-my-json-valid`, another for `jsonschema`. Use wrapper and pass the result as `JSONValidator` property for [FFStateApi](#ffstateapi). Examle:
```javascript
const jsonschemaWrapper = require('fform/addons/wrappers/jsonschema').default;
const Validator = require('jsonschema').Validator;
const JSONValidator = jsonschemaWrapper(new Validator());
```

Default `group` for JSON validation is 0 (more details about groups [here](#_validators)).

#### Sync/async validation
Sync/async validation described [here](#_validators).


## Field structure and customization
Each field of form is built by builder, that assembles field from the following blocks:
- `Wrapper` - wraps all and add array item controls when the field is an array element
- `Title` - shows title property from the schema, and provide array add/del buttons when the field is an array
- `Body` - contains Main and Messages to align then together
- `Main` - in this block input element is placed
- `Messages` - element that shows messages (error, warnings, info, etc)

In `_custom` schema property, you can add/overwrite any property of any block. It supports [the element's props processing](#props-processing). It merges with `_presets` refs on field build. See [example](https://wtnm.github.io/fform-constructor/index.html#url=examples.json&selector=5) for details.

Field receives a set of objects (structured as it described above) that is the parts of the elements (`_presets` and `_custom` props define it) that merged then into one object. All functions that is found by field's processor in that object binds to field's instance during render. The exception is the props that have leading `_$` in their names or listed in `_$skipKeys` property.

## Form layout
For the `object` and` array` types, the JSON-schema's property `_layout` defines a layer that can be customized by setting the required props. It supports [elements props processing](#props-processing). 

Besides, it supports the `$ _fieds` property, which sets the order in which the fields listed in the` definition` property for `object` and in the` items` property for `array` will be displayed. In addition to the fields in `$_fieds`, you can add objects that are also processed by [elements props processing](# props-processing) and support the `$_fieds` property, which allows you to create layers with the desired level of nesting. See [example](https://wtnm.github.io/fform-constructor/index.html#url=examples.json&selector=1) for more details.


## Elements
Elements is object that contains React components, functions, frequently used parts of components and, in principle, any other js or JSON code that can be referenced both from any part of the Elements and from the extended fields of the JSONSchema.

Elements can be extended, and in essence it is a repository of bricks of code from which the whole form is then assembled, and the degree of elementarity of these cypriots is determined by the developer.

#### Props processing
Properties of elements are processed as follows:
- `^/`<a name="object-refs"></a> - string value that begins with `^/` determines that value is the reference and resolved respectively
- `_$` - leading `_$` in property name prevent it value from deep processing, but if value is string and starts with `^/` resolving still made
- `$_` - leading `$_` in property name means than property has special processing
- `_$skipKeys:string[]` - props that listed in this array are prevented from deep processing, as if it name start with `_$`.
- `_%widget: string | Function` - HTML tag or function that will we used as React-element
- `_$cx: Function` - classnames processor, reference to '^/_$cx'
- `$_ref: string` - reference starts with '^' path separated by `/`, multi-refs separated by `:`, <details><summary>example</summary> `{$_ref:'^/sets/base:^/sets/boolean'}`</details>
- `$_reactRef: boolean | string` - creates reference to element with default name if true, if value is string then it is used as name
- `$_maps` - maps data from state to element. [Functions](#functions) can be used to process data.

#### Data processors
Any object in `elements` that has `$` property threaten as data processor. It has following properties:
- `$: string` - link (with leading `^/`) to function(s). Can be used in pipes (linux style, with `|` delimiter). Example `^/fn/first | ^/fn/second`. Output from first function send to second.
- `replace?: boolean` - if `true` the data processor's result will be replaced, otherwise merged.
- `args?: any[]` - arguments passed to very first function in `$`. Default `['${...}']`. Has several replacements:
	- `${<number>}` - replaced with value that data processor receive according to number. If `${...}` passed then all values sent to input. Depending on the place where data processor is used it receive different values:
	 	- at `schema._stateMaps` - value is taken according to `from` property
	 	- at `schema._validators` and `schema._oneOfSelector` receive form current value according to schema path
	 	- at `elements.$_maps` receive no values
	 	- at `elements.<onEventMethod>` receive event
	- Args that starts with `@` replaced with [data object](#data-object) value according to [path](#path). Example: `@/value`
		- Args starts with `!` negated (`!!` negated twice). Example: `!@/value`
- `update?: 'build' | 'data' | 'every'` - for `$_maps` processors. Determines when it executes.
	- `build` - on component build/rebuild
	- `data` - on [data object](data-object)
	- `update, `every` - on each update

**As functions executed in pipe each function that used in processors should return result as _array_** (except `_oneOfSelector`).

Each function (except for those ones that are used in `_oneOfSelector`) has access to [API](#api) during runtime through `this.api`.

Any argument of `args` can be a data processor (an object with `$` property), it will be executed (_recursively as it args can be data processor too_) and its result will be passed as a value.

#### $_maps <a name='_maps'></a>
`$_maps: {path2property: string}: string | dataProcessor | dataProcessor[]` is the object that decribes translation data from state's [data objects]($data-object) to component properties.

Key `path2property` defines the path (with symbol `/` as delimiter) in object, where `$_maps` belongs, for example `className/hidden`. Notice: `$_maps` doesn't change the type of property if it was set before and is mergeable (i.e. array or object type), otherwise when needed object is created. For example, if you define something like this `{"children": [], $_maps{"children/0":"@/anything"}}` the type of `children` will always be array.

String value should start with `@`, and defines path in [data object]($data-object) from where the value shold be taken, examle `"className/hidden": "@/params/hidden[^]"`. Also, supports leading `!` or `!!` to negate (convert to boolean) value, examle: `"className/shown": "!@/params/hidden[^]"`.

[Data processor](#data-processors) (array of it) process data it receives. In `$_maps` there is no default input values, so you have to define them in `args` property. Example: 
```js
{
	"className": "",
    "$_maps": {
		"className/equal": {
        	"$": "^/fn/equal", 
            "args": ["@/someTestValue", "value2compare"]
         }
	}
}
```
Here `someTestValue` property will be taken from [data object]($data-object) and then passed as 1st argument with string `value2compare` as 2nd to function at `elements.fn.equal`, and the result will be set in `className.equal` with `className` converted to object.

**Important notice:** during runtime functions in data processor have acces to API througth `this.api` and can use `api.get` to gain access to data in another fields. It is not recommended, cause changing data in another field won't trigger data update in current. Instead use schema's [_stateMaps](#statemaps) propery to translate data from any other field's data to the current field's [data object]($data-object), and then take it from [data object]($data-object) as it shown above.

#### Structure
- `widgets` - contains react components that is used in form building, some of them:
	- `Section` - renders object and array types of schema
    - `Generic` - generic widget for many uses
    - `Input` - widget that renders all types, except object and array
    - `Builder` - build field from blocks
    - `Wrapper` - wraps all others blocks and provides array item menu if needed
    - `ItemMenu` - renders array item menu
    - `CheckboxNull` - renders tristate checkbox
- `sets` - presets for frequently used field's schemes, some of them:
	- `base` - basic set of blocks that used in every field
	- `simple` - basic set for non-object types of schema
	- `string` - set for string type of schema
	- `textarea` - set for large string values
	- `integer` - set for integer type of schema
	- `integerNull` - set for integer and null types of schema
	- `number` - set for number type of schema
	- `numberNull` - set for number and null type of schema
	- `boolean` - set for boolean type of schema
	- `booleanLeft` - set for boolean type of schema with left placement of checkbox
	- `booleanNull` - set for boolean and null type of schema
	- `booleanNullLeft`- set for boolean  and null type of schema with left placement of checkbox
	- `object` - set for object and array types of schema
	- `array`  - set for object and array types of schema
	- `select` - set for enum values
	- `multiselect` - set for array of enum values
	- `radio` - set for enum values as radio buttons
	- `checkboxes` - set for array of enum values as checkbox buttons
- `fn` - functions that is used in [data, event processing](#data-event-processors), some of them:
	- `api(fn: string, ...args: any[])` - executes `this.api[fn](...args)`
    - `format(str: string, ...args: any[])` - replaces `${<number>}` in `str` with `args[<number>]`
    - `iif(iif: any, trueVal: any, falseVaL: any, ...args: any[])` - if `iif` is trusty returns `trueVal`, otherwise `falseVaL`
    - `not(value: any, ...args: any[])` - returns negated `value`, `args` keeps untouched
    - `equal(value: any, ...args: any[])` - tests if `value` strictly equal to any of `args`
    - `eventValue: (event: any, ...args: any[])` - returns `event.target.value`, `args` keeps untouched
    - `eventChecked: (event: any, ...args: any[])` - returns `event.target.checked`, `args` keeps untouched
    - `eventMultiple: (event: any, ...args: any[])` - returns selected values from multiselect, `args` keeps untouched
    - `parseNumber: (value: any, int: boolean, empty: number | null, ...args: any[])` - conver value to number if `int` is false, to iteger if `int` is true. If value is empty string returns `empty`. `args` keeps untouched
    - `setValue(value: any, opts: any = {}, ...args: any[])` - set `value` in state using [`this.api.setState`](#setvaluevalue-any-opts-setvalueopts) with `opts`. Returns untouched `args`.
    - `liveUpdate` - updates value not waiting for focus out (as if liveUpdate enabled)
- `parts` <a name='parts'></a> - commonly used parts of JSON, js-code, some of them:
	- `Submit` - submit button
	- `Reset` - reset button
	- `Button` - button
	- `ArrayAddButton` - array add button
	- `ArrayDelButton` - array del button
	- `ArrayEmpty` - array is empty notificator
	- `ArrayItemMenu` - array item menu
	- `Expander` - expander to fill space
	- `RadioSelector` - radio selector
- `extend(objects: any[])` - merges elements with passed objects
- `_$cx` <a name="cx"></a> - simple classnames processor based on [classnames](https://github.com/JedWatson/classnames) with little modification <details><summary>explanation</summary> object property name added only if value is strict "true" or non-zero "number"  (trusty in classnames), otherwise if value is trusty but not true or number it processes recursively</details>



## Styling
FForm using classnames processor based on [classnames/bind](https://github.com/JedWatson/classnames) ([`_$cx` property](#structure)). [Elements](#elements) property `_$cx.bind` can be used to bind objects with class replacements to `_$cx` .

Most common classes that are used in [elements](#elements):
`fform-hidden` - to hide elements
`fform-message-priority-N` - for message styles
`fform-inline` - to place elements in line
`fform-required` - to mark a title as required
`fform-viewer` - class for viewer
`fform-layout` - default class for object layout's elements
`fform-shrink` - to shrink an element
`fform-expand` - to expand an element

More classNames that can be applied to [elements](#elements) can be found in `addons/styling/basic.json`

## SSR

Use `addon/dehydrator.js` to convert state to string on server side and then pass it to the client. On the client side use the passed state as `state` prop of [FForm](#fform) component.

Server side:
```js
const dehydrate = require('../addons/dehydrator').default;
const core = new FFormStateAPI({name: 'core', schema});
const state = core.getState();
let reState = dehydrate(state); // reState now string
```
Client side:
```js
const reState = {reState string from server}
const reCore = new FFormStateAPI({state: reState, name: 'core', schema});
```