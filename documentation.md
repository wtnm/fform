
# Documentation

<!-- toc -->

- [FForm](#fform)
    + [Passing [FFStateApi props](#ffstateapi)](#passing-ffstateapi-props%23ffstateapi)
    + [Using with redux Provider](#using-with-redux-provider)
- [FFStateApi](#ffstateapi)
    + [Redux storage](#redux-storage)
    + [External storage](#external-storage)
    + [Internal storage](#internal-storage)
- [API](#api)
    + [`get(...pathes: string | string[]`)](#getpathes-string--string)
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
- [Path](#path-)
- [Data object](#data-object-)
- [Basic schema properties](#basic-schema-properties)
    + [Meta data](#meta-data)
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
- [fformObjects](#fformobjects)
    + [props processing](#props-processing)
    + [structure](#structure)
    + [functions](#functions)
- [Styling](#styling)
- [SSR](#ssr)

<!-- tocstop -->


## FForm
- `core` - instance of [FFStateApi](#ffstateapi)  or object with [FFStateApi props](#ffstateapi) 
- `state?: any` - state of FFStateApi
- `value?: any` - form's current value
- `inital?: any` - form's inital value
- `noInitValidate?: boolean` - skip validation on creation
- `fieldCache?: boolean | number` - caching delay on updating form's value. Used for optimization purposes.
- `useTag?: string | Function` - html tag. Default 'form' 
- `parent?: any` - parent for form;
- `onSubmit?: (value: any, fform?: any) => boolean` -
- `onChange?: (value: any, fform?: any) => void` -
- `onStateChange?: (state: any, fform?: any) => void` -

After creation [FFStateApi](#ffstateapi) can accessed throught `api` property

#### Passing [FFStateApi props](#ffstateapi)
Property `core` with [FFStateApi props](#ffstateapi) processed only on creation (creating new instance of [FFStateApi](#ffstateapi)). On property update, if `core` is object with [FFStateApi props](#ffstateapi) then `core` is ignored (new instance of [FFStateApi](#ffstateapi) is not created). Otherwise, if (on property update) `core` is instance of [FFStateApi](#ffstateapi)  `FForm` component will make full rebuild.

#### Using with redux Provider
`FFrom` can take store from context on creation if property `core` is object with [FFStateApi props](#ffstateapi). Just put `FForm` inside redux `Provider` with properly created store and leave `store` property undefined. To prevent from taking store from context (and not using store at all) set `store` property to false or null.

## FFStateApi
On creation pass to constructor object as first argument with following props:
-   `schema` - schema that will be used to create state
-   `name?: string` - name that will be used to access data in redux storage and for fields naming
-   `objects?` - [fformObjects](#fformobjects), that contains all nessary for  components creation
-   `JSONValidator?` - JSON schema validator for [JSON validation](#json-validation)
-   `store?:any` - redux store. [FForm](#fform) can take store from context
-   `getState?: () => any` - external state setter
-   `setState?: (state: any) => void` - external state getter

After creation FFStateApi can be manipulated throught [API methods](#api)

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



## API
- #### `get(...pathes: string | string[]`)
*Returns* data in [path(es)](#path)

- #### `set(path: string | string[], value: any, opts?: setOpts )`
Set value in path. *Returns* [ApiPromise](#apipromise)
	- `path: string | string[]` - [path](#path) to data
	- `value: any` - value to set
	- `opts?: setOpts` - object with props:
		- [APIOptsType](#apioptstype)
		- `replace?: boolean` - replace value if true or merge if false (actual for objects and arrays)
		- `setOneOf?: number` - will try to switch to [oneOf index](#combining-schemas)
		- `macros?: string` - excute macros


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
API set functions returns promise that will be resolved after changes is made (actual only for asyncronous updates).
Also returned promise has property 'vAsync' which is promis either. This promise will be resolved after all async validation that was triggered by update will be resolved.


**ApiOptsType** <a name="apioptstype"></a>:
- `execute?: true | number` - if true then execute synchronously and immediatly. If number then executed asynchronously after number in milliseconds passed. Default is 0, that means asynchronous execution right after calling code is finished.
Multiply asynchronous commands are stacking in batch and executes together.
- `noValidation?: boolean` - No validation is made if true.


## Path <a name="path"></a>
String (or array or strings) value delimited with '/' that describes path to field. Following pathes are equal:` '#/obects/array/field_1',  ['#', 'object/array', 'field_1'], ['object', '/array/', '/field_1/']`

Each field has [data object](#data-object) that can be accessed in path by using `'@'` symbol: `'/field_1@value', ['object/array', '@', 'length']`

`'#'` - is the root element of schema state. Can be ommited.

Path can be relative. Relative path starts with `'.'` or `'..'` and resolved relatively fields it eas used.

API set functions support path-muliplying:
- Comma-separated fields. Path 'array/1,2/field,prop' turns to 4 pathes 'array/1/field', 'array/1/prop', 'array/2/field', 'array/2/prop'. Works for both field-part(part before '@') and data-part(part after '@') of path.
- Symbol `'*'` turns into all props of object/array. Path 'array/*' (for arrat with length 3) turns to 'array/0', 'array/1', 'array/2'. Works only for field-part(part before '@') of path.

## Data object <a name="data-object"></a>
Each field has data object that is created according to [JSON schema](#basic-schema-properties) and can be changed throught [API](#api)
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


## Basic schema properties
- `$ref?: string`
-  `type?: JsonSchemaTypes | JsonSchemaTypes[]` - The basic type of this schema, can be one of * [string, number, object, array, boolean, null] * or an array of the acceptable types
-  `enum?: any[]` - Enumerates the values that this schema can be  e.g. {"type": "string",   "enum": ["red", "green", "blue"]}
-  `definitions?: { [key: string]: JSONschema }` - Holds simple JSON Schema definitions for  referencing from elsewhere.
#### Meta data
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
-  `additionalProperties?: boolean | JSONschema`
-  `properties?: { [property: string]: JSONschema }` - The keys that can exist on the object with the  json schema that should validate their value
-  `patternProperties?: { [pattern: string]: T }` - The key of this object is a regex for which properties the schema applies to
-  `dependencies?: { [key: string]: T | string[] }` - If the key is present as a property then the string of properties must also be present. If the value is a JSON Schema then it must. Also be valid for the object if the key is  present.
#### Combining Schemas
-  `allOf?: JSONschema[]` - used for merging schemas
-  `anyOf?: JSONschema[]` - only for validation
-  `oneOf?: JSONschema[]` - used for switching schemas
-  `not?: JSONschema` - The entity being validated must not match this schema

## Extended schema properties
As JSON format doesn't support js-code all function moved to [fformObjects](#fformobjects). So in schema you should specify [reference to fformObjects](#object-refs) as string value that starts with "^/". It will be resolved at [FFStateApi](#ffstateapi) creating.

- `ff_placeholder?: string`- field's placeholder
- `ff_params?: FFParamsType` - params that can be edited in state
	-   `liveValidate?: boolean` - 
	-  `autofocus?: boolean` -
	-  `readonly?: boolean` -
	-  `disabled?: boolean` -
	-  `hidden?: boolean` -
	-  `norender?: boolean` -
	-  `viewer?: boolean` -
- `ff_data?: any` - any additional data you may need
- `ff_presets?: string`- presets for rendering components
- `ff_managed?: boolean`- determine that value managed by component itself (for objects and arrays)
- `ff_enumExten?: { [key: string]: undefined | string | object }`- enum extension. Keys taken from enum. String converts to object with property `{label}`
- `ff_dataMap?: [string, string, string][]`- maps data in state. Array of turples of 2 or 3 elems where: 0 - path from value taken, 1 - path to value placed, and 2 - [refs to fformObjects](#object-refs) that process value on mapping.
- `ff_validators?: string[]`- [sync/async validators](#validation) as array of [refs to fformObjects](#object-refs). Each function receive field value as first parameter on field value change.
- `ff_oneOfSelector: string` - function that receive value to determine which oneOf schema select.
- `ff_custom?: FFCustomizeType`- component [customization](#customization)
- `ff_layout?: FFLayoutCustomizeType` - fields, objects, groups in [object/turple layout](#object-layout)

### Validation
#### JSON validation
For JSON validation used [is-my-json-valid](#https://github.com/mafintosh/is-my-json-valid) with modifications for smaller (3 times) bundle size. It is placed in `addons/is-my-json-valid-lite`. Pass it as `JSONValidator` property for [FFStateApi](#ffstateapi). Default group for JSON validation is 0.

#### Sync validation
Custom function that receive value as first parameter and should return string or object in the following format (or array of strings or objects):
-  `group?: number` - group that replaces on each validation call. By default 0 - used for JSON validation, 1 - for sync validation, 2 - for async validation.
-  `text: string | string[]` - message(s) that should be displayed
-  `priority?: number` - Default value 0. If field has at least one message with priority 0 it means that validation failed. Any priority greater that 0 doesn't affect validation status (used for warning, info, success etc). 
-  `path?: string` - path to another field for which you want to set message.
-  `{[key: string]: any}` - result may have any other props (such as className or style). It will be added to div layer for that priority on render.


#### Async validation
If function return promise then on resolve its result will be processed as for sync function (with default group equal 2)


### Customization
Each field build from following blocks: 
- `Wrapper` - wrapps all and add array item controls when field is array element
- `Title` - shows title property fromschema, and provide array add/del buttons when field is array
- `Body` - contains Main and Messages to align then together
- `Main` - in this block input element is placed
- `Messages` - element that shows messages (error, warnigns, info etc)

In `ff_custom` schema property you can add/overwrite any proprerty of any block. It supports [fformObjects "magic" props](#magic-props). It merges with `ff_presets` refs on field build. More details in examples.

### Object layout
Schema property `ff_layout` can be object or array of strings | objects. String is the name of field and it determines the order in which fields will be placed. Object supports [fformObjects "magic" props](#magic-props) with `$_fields` (that is array of strings | objects) property and can be customized. More details in examples.


## fformObjects
Each field in form receive a set of objects that is parts of fformObjects (due to 'ff_presets' and 'ff_custom') that merges into one object. Then all functions that field finds in merged object binds to it during render. Exception is the props that starts with underscore.

#### props processing
- `^/`<a name="object-refs"></a> - string value that begins with "^/" determines that value is the reference and resolved respectively
- `_` - property name that starts with underscore prevent it value from deep processing (makes only resolving if string value starts with "^/")
- `_%widget: string | Function` - HTML tag or function that will we used as react.element
- `_$cx: Function` - classnames processor, reference to '^/_$cx'
- `$_ref: string` - reference starts with '^' path separated by '/', multi-refs separated by ':', <details><summary>example</summary> `{$_ref:'^/sets/base:^/sets/boolean'}`</details>
- `$_reactRef: boolean | string` - creates reference to element with default name if true, if value is string then it is used as name 
- `$_maps` - maps data from state to element. [Functions](#functions) can be used to proccess data.
- `$_fields` - layout that determines field's order and add additional elements and sub-layouts
- `anyName.bind: any[]` - binds value to function with name 'anyName'

#### structure
- `extend` - extends fformObjects with passed object
- `widgets` - contains react.elements that is used in form components
- `sets` - component presets for commonly used schemas
- `fn` - function tha is used in $_maps/$_parse processing 
- `parts` - commonly used parts of components
- `_$cx` - simple classnames processor based on [classnames](https://github.com/JedWatson/classnames) with little modification <details><summary>explanation</summary> object property name added only if value is strict "true" or non-zero "number"  (trusty in classnames), otherwise if value is trusty but not true or number it processes recursively</details>

#### functions
Object with properties:
- `$: string` - link (starts with `^/`) to function(s). Can be used in pipes (linux style, with `|` delimiter). Example `^/fn/equal|^/fn/not`.
- `replace?: boolean` - if `true` the result will be replaced, otherwise merged.
- `args?: any[]` - arguments passed to function. Has several replacements:
	- `${value}` - replaced with value that function receive. 
	- Args that starts with `@` replaced with [data object](data-object) value in [path](#path). 
	- Args starts with `!` (`!!`) negated (negated twice).
- `update?: 'build' | 'data' | 'every'` - actual only for `$_maps` functions. Determines how often function executed. `build` - only on component build/rebuild, `data` - on [data object](data-object) update, `every` - on each update.
As functions executed in pipe it results should be returned as array.
Functions (except for that ones that defined in `ff_oneOfSelector`) has access to [api](#api) thougth `this.api`.

## Styling
FForm using classnames processor based on [classnames/bind](https://github.com/JedWatson/classnames) ([`_$cx` property](#structure)) and it can be binded for class name's replacement.
Classes that are used in [fformObjects](#fformobjects):
`hidden` - to hide elements
`priority_0` - for errors styling
`inline` - to place elements in line
`required` - to mark title as required
`layout` - default class for object layout's elemets
`shrink` - to shrink an element
`expand` - to expand an element

ClassNames that can be apllied to [fformObjects](#fformobjects) can be found in `addons/styles.json` 

## SSR

In progress. Will be in `addon/ssr.ts`