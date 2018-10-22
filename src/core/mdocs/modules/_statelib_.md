[flexibile-form](../README.md) > ["stateLib"](../modules/_statelib_.md)

# External module: "stateLib"

## Index

### Classes

* [UpdateItems](../classes/_statelib_.updateitems.md)

### Variables

* [RawValuesKeys](_statelib_.md#rawvalueskeys)
* [SymbolBranch](_statelib_.md#symbolbranch)
* [SymbolData](_statelib_.md#symboldata)
* [SymbolDelete](_statelib_.md#symboldelete)
* [SymbolReset](_statelib_.md#symbolreset)
* [arrayStart](_statelib_.md#arraystart)
* [getSchemaData](_statelib_.md#getschemadata)
* [isReplaceable](_statelib_.md#isreplaceable)
* [makeDataStorage](_statelib_.md#makedatastorage)
* [makeStateFromSchema](_statelib_.md#makestatefromschema)
* [utils](_statelib_.md#utils)

### Functions

* [get](_statelib_.md#get)
* [getAsObject](_statelib_.md#getasobject)
* [getBindedValue](_statelib_.md#getbindedvalue)
* [getKeyMapFromSchema](_statelib_.md#getkeymapfromschema)
* [getMaxValue](_statelib_.md#getmaxvalue)
* [getParentArrayValue](_statelib_.md#getparentarrayvalue)
* [getParentSchema](_statelib_.md#getparentschema)
* [getSchemaPart](_statelib_.md#getschemapart)
* [getUniqId](_statelib_.md#getuniqid)
* [getValue](_statelib_.md#getvalue)
* [isPropRequired](_statelib_.md#isproprequired)
* [makeArrayOfPathItem](_statelib_.md#makearrayofpathitem)
* [makeDataMap](_statelib_.md#makedatamap)
* [makePathItem](_statelib_.md#makepathitem)
* [makeRelativePath](_statelib_.md#makerelativepath)
* [makeStateBranch](_statelib_.md#makestatebranch)
* [makeUpdateItem](_statelib_.md#makeupdateitem)
* [object2PathValues](_statelib_.md#object2pathvalues)
* [path2string](_statelib_.md#path2string)
* [string2path](_statelib_.md#string2path)
* [val2path](_statelib_.md#val2path)

### Object literals

* [basicArrayItem](_statelib_.md#basicarrayitem)
* [basicLengths](_statelib_.md#basiclengths)
* [basicStatus](_statelib_.md#basicstatus)

---

## Variables

<a id="rawvalueskeys"></a>

### `<Const>` RawValuesKeys

**● RawValuesKeys**: *`string`[]* =  ['current', 'inital', 'default']

*Defined in stateLib.tsx:8*

___
<a id="symbolbranch"></a>

### `<Const>` SymbolBranch

**● SymbolBranch**: *`unique symbol`* =  Symbol.for('FFormBranch')

*Defined in stateLib.tsx:5*

___
<a id="symboldata"></a>

### `<Const>` SymbolData

**● SymbolData**: *`unique symbol`* =  Symbol.for('FFormData')

*Defined in stateLib.tsx:4*

___
<a id="symboldelete"></a>

### `<Const>` SymbolDelete

**● SymbolDelete**: *`undefined`* =  undefined

*Defined in stateLib.tsx:7*

___
<a id="symbolreset"></a>

### `<Const>` SymbolReset

**● SymbolReset**: *`unique symbol`* =  Symbol.for('FFormReset')

*Defined in stateLib.tsx:6*

___
<a id="arraystart"></a>

### `<Const>` arrayStart

**● arrayStart**: *`(Anonymous function)`* =  memoize(function (schemaPart: JsonSchema) {
    if (!isArr(schemaPart.items)) return 0;
    if (schemaPart.additionalItems === false) return schemaPart.items.length;
    if (typeof schemaPart.additionalItems === 'object') return schemaPart.items.length;
    if (schemaPart.items.length == 0) return 0;
    return schemaPart.items.length - 1;
  }
)

*Defined in stateLib.tsx:114*

___
<a id="getschemadata"></a>

### `<Const>` getSchemaData

**● getSchemaData**: *`(Anonymous function)`* =  memoize(function (scheme: JsonSchema) { // schemaData is used to store and cache data for scheme without modifying schema itself  
  return {};
})

*Defined in stateLib.tsx:24*

___
<a id="isreplaceable"></a>

### `<Const>` isReplaceable

**● isReplaceable**: *`(Anonymous function)`* =  memoize(function (scheme: JsonSchema) {
  const fn = memoize(function (schemaPart: JsonSchema) {return (schemaPart.type == 'array' || schemaPart.type == 'object') && !isUndefined(getIn(schemaPart, 'x', 'values'))});
  return (path: Path) => {try {return fn(getSchemaPart(scheme, path))} catch (e) {return true}}
})

*Defined in stateLib.tsx:19*

___
<a id="makedatastorage"></a>

### `<Const>` makeDataStorage

**● makeDataStorage**: *`(Anonymous function)`* =  memoize(function (schemaPart: JsonSchema, required: boolean, arrayItem: boolean) {
  const x = schemaPart.x || ({} as xType);
  const {custom, preset, dataMap, fields, flatten, keyField, validators, ...rest} = x;
  const result: any = merge({controls: {}, messages: {}}, rest);
  result.status = basicStatus;
  result.schemaData = {};
  result.schemaData.title = schemaPart.title;
  result.schemaData.type = isArr(schemaPart.type) ? schemaPart.type[0] : schemaPart.type;
  if (schemaPart.type != 'object' && schemaPart.type != 'array') {
    if (isUndefined(result.values)) result.values = {current: schemaPart.default, inital: undefined, 'default': schemaPart.default};
    //if (!isArr(schemaPart.required)) result.schemaData.required = required || (schemaPart.required === true);
    result.schemaData.required = required || !!schemaPart.required;
  }
  if (schemaPart.type == 'array') {
    result.array = {
      lengths: basicLengths,
      // arrayStartIndex: arrayStart(schemaPart),
      canAdd: (schemaPart.additionalItems !== false || getIn(schemaPart, 'items', 'length')) && (schemaPart.maxItems !== 0)
    }
  }
  if (arrayItem) result.arrayItem = basicArrayItem;
  return result;
})

*Defined in stateLib.tsx:127*

___
<a id="makestatefromschema"></a>

### `<Const>` makeStateFromSchema

**● makeStateFromSchema**: *`(Anonymous function)`* =  memoize(function (schema: JsonSchema) {return makeStateBranch(schema)})

*Defined in stateLib.tsx:201*

___
<a id="utils"></a>

### `<Const>` utils

**● utils**: *`any`*

*Defined in stateLib.tsx:429*

___

## Functions

<a id="get"></a>

###  get

▸ **get**(state: *`any`*, ...pathes: *`Array`<`symbol` |`string` |`Path`>*): `any`

*Defined in stateLib.tsx:462*

**Parameters:**

| Param | Type |
| ------ | ------ |
| state | `any` | 
| `Rest` pathes | `Array`<`symbol` |`string` |`Path`> | 

**Returns:** `any`

___
<a id="getasobject"></a>

###  getAsObject

▸ **getAsObject**(state: *`StateType`*, keyPath: *`Path`*, fn?: *`undefined` |`function`*, keyObject?: *`StateType`*): `any`

*Defined in stateLib.tsx:320*

**Parameters:**

| Param | Type |
| ------ | ------ |
| state | `StateType` | 
| keyPath | `Path` | 
| `Optional` fn | `undefined` |
`function`
 | 
| `Optional` keyObject | `StateType` | 

**Returns:** `any`

___
<a id="getbindedvalue"></a>

###  getBindedValue

▸ **getBindedValue**(obj: *`any`*, valueName: *`string`*): `any`

*Defined in stateLib.tsx:343*

**Parameters:**

| Param | Type |
| ------ | ------ |
| obj | `any` | 
| valueName | `string` | 

**Returns:** `any`

___
<a id="getkeymapfromschema"></a>

###  getKeyMapFromSchema

▸ **getKeyMapFromSchema**(schema: *`JsonSchema`*): `any`

*Defined in stateLib.tsx:204*

**Parameters:**

| Param | Type |
| ------ | ------ |
| schema | `JsonSchema` | 

**Returns:** `any`

___
<a id="getmaxvalue"></a>

###  getMaxValue

▸ **getMaxValue**(values: *`any`*): `any`

*Defined in stateLib.tsx:525*

**Parameters:**

| Param | Type |
| ------ | ------ |
| values | `any` | 

**Returns:** `any`

___
<a id="getparentarrayvalue"></a>

###  getParentArrayValue

▸ **getParentArrayValue**(schema: *`JsonSchema`*, path: *`Path`*): `any`

*Defined in stateLib.tsx:80*

**Parameters:**

| Param | Type |
| ------ | ------ |
| schema | `JsonSchema` | 
| path | `Path` | 

**Returns:** `any`

___
<a id="getparentschema"></a>

###  getParentSchema

▸ **getParentSchema**(schema: *`JsonSchema`*, path: *`Path`*): `false` |`JsonSchema`

*Defined in stateLib.tsx:163*

**Parameters:**

| Param | Type |
| ------ | ------ |
| schema | `JsonSchema` | 
| path | `Path` | 

**Returns:** `false` |
`JsonSchema`

___
<a id="getschemapart"></a>

###  getSchemaPart

▸ **getSchemaPart**(schema: *`JsonSchema`*, path: *`Path`*): `JsonSchema`

*Defined in stateLib.tsx:28*

**Parameters:**

| Param | Type |
| ------ | ------ |
| schema | `JsonSchema` | 
| path | `Path` | 

**Returns:** `JsonSchema`

___
<a id="getuniqid"></a>

###  getUniqId

▸ **getUniqId**(): `string`

*Defined in stateLib.tsx:172*

**Returns:** `string`

___
<a id="getvalue"></a>

###  getValue

▸ **getValue**(values: *`ValuesType`*, type?: *"current" |"inital" |"default"*): `any`

*Defined in stateLib.tsx:516*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| values | `ValuesType` | - | 
| `Default value` type | "current" |
"inital" |
"default"
 | &quot;current&quot; | 

**Returns:** `any`

___
<a id="isproprequired"></a>

###  isPropRequired

▸ **isPropRequired**(schema: *`JsonSchema`*, path: *`Path`*): `boolean`

*Defined in stateLib.tsx:168*

**Parameters:**

| Param | Type |
| ------ | ------ |
| schema | `JsonSchema` | 
| path | `Path` | 

**Returns:** `boolean`

___
<a id="makearrayofpathitem"></a>

###  makeArrayOfPathItem

▸ **makeArrayOfPathItem**(path: *`Path` |`string`*, basePath?: *`Path`*, delimiter?: *`string`*): `PathItem`[]

*Defined in stateLib.tsx:391*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| path | `Path` |
`string`
 | - | 
| `Default value` basePath | `Path` |  [] | 
| `Default value` delimiter | `string` | &quot;@&quot; | 

**Returns:** `PathItem`[]

___
<a id="makedatamap"></a>

###  makeDataMap

▸ **makeDataMap**(dataMap: *`DataMapType`[]*, path: *`Path`*): `any`

*Defined in stateLib.tsx:151*

**Parameters:**

| Param | Type |
| ------ | ------ |
| dataMap | `DataMapType`[] | 
| path | `Path` | 

**Returns:** `any`

___
<a id="makepathitem"></a>

###  makePathItem

▸ **makePathItem**(path: *`Path` |`string`*, relativePath?: *`Path` |`undefined`*, delimiter?: *`string`*): `PathItem`

*Defined in stateLib.tsx:360*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| path | `Path` |
`string`
 | - | 
| `Default value` relativePath | `Path` |
`undefined`
 |  undefined | 
| `Default value` delimiter | `string` | &quot;@&quot; | 

**Returns:** `PathItem`

___
<a id="makerelativepath"></a>

###  makeRelativePath

▸ **makeRelativePath**(from: *`Path`*, to: *`Path`*): `any`[]

*Defined in stateLib.tsx:97*

**Parameters:**

| Param | Type |
| ------ | ------ |
| from | `Path` | 
| to | `Path` | 

**Returns:** `any`[]

___
<a id="makestatebranch"></a>

###  makeStateBranch

▸ **makeStateBranch**(schema: *`JsonSchema`*, path?: *`Path`*): `object`

*Defined in stateLib.tsx:174*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| schema | `JsonSchema` | - | 
| `Default value` path | `Path` |  [&#x27;#&#x27;] | 

**Returns:** `object`

___
<a id="makeupdateitem"></a>

###  makeUpdateItem

▸ **makeUpdateItem**(path: *`Path` |`string`*, ...rest: *`any`[]*): `UpdateItem`

*Defined in stateLib.tsx:347*

**Parameters:**

| Param | Type |
| ------ | ------ |
| path | `Path` |
`string`
 | 
| `Rest` rest | `any`[] | 

**Returns:** `UpdateItem`

___
<a id="object2pathvalues"></a>

###  object2PathValues

▸ **object2PathValues**(vals: *`object`*, options?: *`object2PathValuesOptions`*, track?: *`Path`*): `PathValueType`[]

*Defined in stateLib.tsx:412*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| vals | `object` | - | 
| `Default value` options | `object2PathValuesOptions` |  {} | 
| `Default value` track | `Path` |  [] | 

**Returns:** `PathValueType`[]

___
<a id="path2string"></a>

###  path2string

▸ **path2string**(path: *`Path` |`PathItem`*, keyPath?: *`Path`*): `string`

*Defined in stateLib.tsx:440*

**Parameters:**

| Param | Type |
| ------ | ------ |
| path | `Path` |
`PathItem`
 | 
| `Optional` keyPath | `Path` | 

**Returns:** `string`

___
<a id="string2path"></a>

###  string2path

▸ **string2path**(str: *`string`*, relativePath?: *`Path` |`undefined`*, delimiter?: *`string`*): `Path`

*Defined in stateLib.tsx:448*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| str | `string` | - | 
| `Default value` relativePath | `Path` |
`undefined`
 |  undefined | 
| `Default value` delimiter | `string` | &quot;@&quot; | 

**Returns:** `Path`

___
<a id="val2path"></a>

###  val2path

▸ **val2path**(path: *`Path` |`string`*, basePath?: *`Path`*, delimiter?: *`string`*): `Path`

*Defined in stateLib.tsx:386*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| path | `Path` |
`string`
 | - | 
| `Default value` basePath | `Path` |  [] | 
| `Default value` delimiter | `string` | &quot;@&quot; | 

**Returns:** `Path`

___

## Object literals

<a id="basicarrayitem"></a>

### `<Const>` basicArrayItem

**basicArrayItem**: *`object`*

*Defined in stateLib.tsx:125*

<a id="basicarrayitem.candel"></a>

####  canDel

**● canDel**: *`boolean`* = false

*Defined in stateLib.tsx:125*

___
<a id="basicarrayitem.candown"></a>

####  canDown

**● canDown**: *`boolean`* = false

*Defined in stateLib.tsx:125*

___
<a id="basicarrayitem.canup"></a>

####  canUp

**● canUp**: *`boolean`* = false

*Defined in stateLib.tsx:125*

___

___
<a id="basiclengths"></a>

### `<Const>` basicLengths

**basicLengths**: *`object`*

*Defined in stateLib.tsx:124*

<a id="basiclengths.current"></a>

####  current

**● current**: *`number`* = 0

*Defined in stateLib.tsx:124*

___
<a id="basiclengths.default"></a>

####  default

**● default**: *`number`* = 0

*Defined in stateLib.tsx:124*

___
<a id="basiclengths.inital"></a>

####  inital

**● inital**: *`number`* = 0

*Defined in stateLib.tsx:124*

___

___
<a id="basicstatus"></a>

### `<Const>` basicStatus

**basicStatus**: *`object`*

*Defined in stateLib.tsx:123*

<a id="basicstatus.color"></a>

####  color

**● color**: *`string`* = ""

*Defined in stateLib.tsx:123*

___
<a id="basicstatus.pending"></a>

####  pending

**● pending**: *`boolean`* = false

*Defined in stateLib.tsx:123*

___
<a id="basicstatus.pristine"></a>

####  pristine

**● pristine**: *`boolean`* = true

*Defined in stateLib.tsx:123*

___
<a id="basicstatus.touched"></a>

####  touched

**● touched**: *`boolean`* = false

*Defined in stateLib.tsx:123*

___
<a id="basicstatus.valid"></a>

####  valid

**● valid**: *`boolean`* = true

*Defined in stateLib.tsx:123*

___

___

