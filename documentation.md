
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
  * [Validation](#validation)
    + [JSON validation](#json-validation)
    + [Sync validation](#sync-validation)
    + [Async validation](#async-validation)
  * [Customization](#customization)
  * [Object layout](#object-layout)
- [Elements](#elements)
    + [Props processing](#props-processing)
    + [Data processors](#data-processors)
    + [$_maps](#_maps-)
    + [Structure](#structure)
- [Styling](#styling)
- [SSR](#ssr)

<!-- tocstop -->


## FForm
- `core` - instance of [FFStateApi](#ffstateapi)  or object with [FFStateApi props](#ffstateapi)
- `state?: any` - state of FFStateApi
- `value?: any` - form's current value
- `inital?: any` - form's initial value
- `noInitValidate?: boolean` - skip validation on creation
- `fieldCache?: boolean | number` - caching delay on updating form's value. Used for optimization purposes.
- `useTag?: string | Function` - html tag. Default 'form'
- `parent?: any` - parent for form;
- `onSubmit?: (value: any, fform?: any) => boolean` -
- `onChange?: (value: any, fform?: any) => void` -
- `onStateChange?: (state: any, fform?: any) => void` -

After creation [FFStateApi](#ffstateapi) can accessed throught `api` property

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
- `$ref?: string`
-  `type?: JsonSchemaTypes | JsonSchemaTypes[]` - The basic type of this schema, can be one of * [string, number, object, array, boolean, null] * or an array of the acceptable types
-  `enum?: any[]` - Enumerates the values that this schema can be  e.g. {"type": "string",   "enum": ["red", "green", "blue"]}
-  `definitions?: { [key: string]: JSONschema }` - Holds simple JSON Schema definitions for  referencing from elsewhere.
#### Metadata
- `id?: string` - This is important because it tells refs where the root of the document is located
- `$schema?: JSONschema;` - It is recommended that the meta-schema is included in the root of any JSON Schema
- `title?: string` - Title of the schema
- `description?: string` - Schema description
- `default?: any` - Default json for the object represented by this schema
#### Number Validation
-  `multipleOf?: number` - The value must be a multiple of the number (e.g. 10 is a multiple of 5)
-  `maximum?: number` - maximum value
-  `exclusiveMaximum?: boolean` - If true maximum must be > value, >= otherwise
-  `minimum?: number `- minimum value
-  `exclusiveMinimum?: boolean` - If true minimum must be < value, <= otherwise
#### String Validation
-  `maxLength?: number`
-  `minLength?: number`
-  `pattern?: string `- This is a regex string that the value must conform to
#### Array Validation
-  `additionalItems?: boolean | JSONschema`
-  `items?: JSONschema | JSONschema[]`
-  `maxItems?: number`
-  `minItems?: number`
-  `uniqueItems?: boolean`
#### Object Validation
-  `maxProperties?: number`
-  `minProperties?: number`
-  `required?: string[] | boolean`
-  `additionalProperties?: boolean | JSONschema` - if `false`, then any keys that are not listed in the `properties` or match the `patternProperties` are not allowed.
-  `properties?: { [property: string]: JSONschema }` - The keys that can exist on the object with the  json schema that should validate their value
-  `patternProperties?: { [pattern: string]: T }` - The key of this object is a regex for which properties the schema applies to
-  `dependencies?: { [key: string]: T | string[] }` - If the key is present as property then the string of properties must also be present. If the value is a JSON Schema then it must. Also, be valid for the object if the key is  present.
#### Combining Schemas
-  `allOf?: JSONschema[]` - used for merging schemes
-  `anyOf?: JSONschema[]` - only for validation
-  `oneOf?: JSONschema[]` - used for switching schemes
-  `not?: JSONschema` - The entity being validated must not match this schema

## Extended schema properties
As JSON format doesn't support js-code all function moved to [elements](#elements). So in the schema you should specify a [reference to elements](#object-refs) as a string value that starts with "^/". It will be resolved at [FFStateApi](#ffstateapi) creating.

- `_placeholder?: string`- field's placeholder
- `_params?: FFParamsType` - params that can be edited in state
	-   `liveValidate?: boolean` -
	-  `autofocus?: boolean` -
	-  `readonly?: boolean` -
	-  `disabled?: boolean` -
	-  `hidden?: boolean` -
	-  `norender?: boolean` -
	-  `viewer?: boolean` -
- `_data?: any` - any additional data you may need
- `_presets?: string`- presets for rendering components
- `_simple?: boolean`- determine that value managed by the component itself (for objects and arrays)
- `_enumExten?: { [key: string]: undefined | string | object }`- enum extension. Keys are taken from enum. String converts to object with property `{label}`
- `_stateMaps?: Array<{from: string, to:string, $?:string, args?:'string'}>`- <a name='statemaps'></a> maps data in the state. An array of objects with 2-4 properties, where: `from` - path from where value is taken, `to` - path to where value is placed, `$` and `args` - [data processor](#data-event-processors) that process value when mapping.
- `_validators?: Array<string | dataProcessor>`- [sync/async validators](#validation) as an array of  [data processor](#data-event-processors). Each data processor receives field value as the first parameter on value change. Only the last function in a [data processor](#data-event-processors) can be async.
- `_oneOfSelector: string | DataProcessor` -  [data processor](#data-event-processors) that receive value to determine which oneOf schema should be chosen.
- `_custom?: FFCustomizeType`- component [customization](#customization)
- `_layout?: FFLayoutCustomizeType` - fields, objects, groups in an [object or tuple layout](#object-layout)

### Validation
#### JSON validation
FForm uses external JSON Validators by wrapping them and converting the result to a single format. There are 2 wrappers, for now, that can be found in `addons/wrappers`, one for `is-my-json-valid`, another for `jsonschema`. Use wrapper and pass the result as `JSONValidator` property for [FFStateApi](#ffstateapi). Examle:
```javascript
const jsonschemaWrapper = require('fform/addons/wrappers/jsonschema').default;
const Validator = require('jsonschema').Validator;
const JSONValidator = jsonschemaWrapper(new Validator());
```

Default `message group` for JSON validation is 0 (more details about groups below).

#### Sync validation
A function that receive value as the first parameter and should return string or object in the following format (or array of strings or objects):
-  `group?: number` - group that replaces on each validation call. By default 0 - used for JSON validation, 1 - for sync validation, 2 - for async validation.
-  `data: any` - message(s) that should be displayed. Can be React-element(s).
-  `priority?: number` - Default value 0. If the field has at least one message with priority 0 it means that validation failed. Any priority is greater than 0 doesn't affect validation status (used for warning, info, success, etc).
-  `path?: string` - path to another field you want message to be set .
-  `{[key: string]: any}` - result may have any other props (such as className or style). It will be added to the div layer for that priority on render.


#### Async validation
If function return promise then on resolve its result will be processed as for sync function (with default group equal 2)


### Customization
Each field build from the following blocks:
- `Wrapper` - wraps all and add array item controls when the field is an array element
- `Title` - shows title property from the schema, and provide array add/del buttons when the field is an array
- `Body` - contains Main and Messages to align then together
- `Main` - in this block input element is placed
- `Messages` - element that shows messages (error, warnings, info, etc)

In `_custom` schema property, you can add/overwrite any property of any block. It supports [the element's props processing](#props-processing). It merges with `_presets` refs on field build. See [example](https://wtnm.github.io/fform-constructor/index.html#url=examples.json&selector=5).

### Object layout
Schema property `_layout` can be object or array of strings | objects. The string is the name of the field and it determines the order in which fields will be placed. Object supports [elements props processing](#props-processing) with `$_fields` (that is an array of strings | objects) property and can be customized. See [example](https://wtnm.github.io/fform-constructor/index.html#url=examples.json&selector=1).


## Elements
Each field in form receives a set of objects that is parts of elements (due to '_presets' and '_custom') that merges into one object. Then all functions that field finds in merged object binds to it during render. The exception is the props that start with an underscore.

#### Props processing
- `^/`<a name="object-refs"></a> - string value that begins with `^/` determines that value is the reference and resolved respectively
- `_$` - leading `_$` in property name prevent it value from deep processing, but if value is string and starts with `^/` resolving still made
- `$_` - leading `$_` in property name means than property has special processing
- `_%widget: string | Function` - HTML tag or function that will we used as React-element
- `_$cx: Function` - classnames processor, reference to '^/_$cx'
- `$_ref: string` - reference starts with '^' path separated by `/`, multi-refs separated by `:`, <details><summary>example</summary> `{$_ref:'^/sets/base:^/sets/boolean'}`</details>
- `$_reactRef: boolean | string` - creates reference to element with default name if true, if value is string then it is used as name
- `$_maps` - maps data from state to element. [Functions](#functions) can be used to process data.
- `$_fields` - layout that determines field's order and add additional elements and sub-layouts

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
	- Args that starts with `@` replaced with [data object](data-object) value according to [path](#path). Example: `@/value`
		- Args starts with `!` negated (`!!` negated twice). Example: `!@/value`
- `update?: 'build' | 'data' | 'every'` - for `$_maps` processors. Determines when it executes.
	- `build` - on component build/rebuild
	- `data` - on [data object](data-object)
	- `update, `every` - on each update

**As functions executed in pipe each function that used in processors should return result as _array_** (except `_oneOfSelector`).

Each function (except for those ones that are used in `_oneOfSelector`) has access to [API](#api) during runtime thought `this.api`.

Any argument of `args` can be data processor (an object with `$` property), it will be executed (_recursively as it args can be data processor too_) and its result passed as value.

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

Use `addon/dehydrator.js` to dehydrate state and pass it to the client. On the client side use the passed state as initial value.
