[flexibile-form](../README.md) > ["api"](../modules/_api_.md)

# External module: "api"

## Index

### Classes

* [exoPromise](../classes/_api_.exopromise.md)

### Variables

* [Hooks](_api_.md#hooks)
* [actionName4setItems](_api_.md#actionname4setitems)
* [actionNameExecAction](_api_.md#actionnameexecaction)
* [actionNameReplaceState](_api_.md#actionnamereplacestate)
* [formReducerValue](_api_.md#formreducervalue)
* [getEmptyRawValsForSchema](_api_.md#getemptyrawvalsforschema)
* [getValsFromSchema](_api_.md#getvalsfromschema)

### Functions

* [actionExecActions](_api_.md#actionexecactions)
* [actionUpdateState](_api_.md#actionupdatestate)
* [apiCreator](_api_.md#apicreator)
* [applyMap](_api_.md#applymap)
* [execActions](_api_.md#execactions)
* [formReducer](_api_.md#formreducer)
* [getFRVal](_api_.md#getfrval)
* [getKeysAccording2schema](_api_.md#getkeysaccording2schema)
* [getRawValuesChanges](_api_.md#getrawvalueschanges)
* [getUpdatedRawValues](_api_.md#getupdatedrawvalues)
* [getValueFromUpdateItemIfExists](_api_.md#getvaluefromupdateitemifexists)
* [haveValues](_api_.md#havevalues)
* [hookManager](_api_.md#hookmanager)
* [makeItems4rawValues](_api_.md#makeitems4rawvalues)
* [makeValidation](_api_.md#makevalidation)
* [rawValuesReplaceable](_api_.md#rawvaluesreplaceable)
* [recursivelyResetValue](_api_.md#recursivelyresetvalue)
* [recursivelySetChanges](_api_.md#recursivelysetchanges)
* [recursivelySetItems](_api_.md#recursivelysetitems)
* [restoreStructure](_api_.md#restorestructure)
* [setArrayLength](_api_.md#setarraylength)
* [setStateChanges](_api_.md#setstatechanges)

---

## Variables

<a id="hooks"></a>

### `<Const>` Hooks

**● Hooks**: *`any`* =  hookManager()

*Defined in api.tsx:108*

___
<a id="actionname4setitems"></a>

### `<Const>` actionName4setItems

**● actionName4setItems**: *"FFORM_SET_ITEMS"* = "FFORM_SET_ITEMS"

*Defined in api.tsx:68*

___
<a id="actionnameexecaction"></a>

### `<Const>` actionNameExecAction

**● actionNameExecAction**: *"FFROM_EXEC_ACTIONS"* = "FFROM_EXEC_ACTIONS"

*Defined in api.tsx:70*

___
<a id="actionnamereplacestate"></a>

### `<Const>` actionNameReplaceState

**● actionNameReplaceState**: *"FFROM_REPLACE_STATE"* = "FFROM_REPLACE_STATE"

*Defined in api.tsx:69*

___
<a id="formreducervalue"></a>

### `<Let>` formReducerValue

**● formReducerValue**: *`string`* = "forms"

*Defined in api.tsx:63*

___
<a id="getemptyrawvalsforschema"></a>

### `<Const>` getEmptyRawValsForSchema

**● getEmptyRawValsForSchema**: *`any`* =  memoize(function (schema: JsonSchema) {
  const obj = getValsFromSchema(schema, true);
  return {current: obj, inital: obj, 'default': obj};
})

*Defined in api.tsx:563*

___
<a id="getvalsfromschema"></a>

### `<Const>` getValsFromSchema

**● getValsFromSchema**: *`any`* =  memoize(function (schema: JsonSchema, empty: boolean = false) {
  return getRawValuesChanges({}, makeStateFromSchema(schema).state).values[empty ? 'inital' : 'default']; // inital is allways empty
})

*Defined in api.tsx:554*

___

## Functions

<a id="actionexecactions"></a>

### `<Const>` actionExecActions

▸ **actionExecActions**(actions: *`any`[]*, stuff: *`any`*, forceValidation: *`any`*, opts: *`any`*, promises: *`any`*): `any`

*Defined in api.tsx:77*

**Parameters:**

| Param | Type |
| ------ | ------ |
| actions | `any`[] | 
| stuff | `any` | 
| forceValidation | `any` | 
| opts | `any` | 
| promises | `any` | 

**Returns:** `any`

___
<a id="actionupdatestate"></a>

### `<Const>` actionUpdateState

▸ **actionUpdateState**(items: *`any`[]*, stuff: *`any`*): `SetItemsType`

*Defined in api.tsx:73*

**Parameters:**

| Param | Type |
| ------ | ------ |
| items | `any`[] | 
| stuff | `any` | 

**Returns:** `SetItemsType`

___
<a id="apicreator"></a>

###  apiCreator

▸ **apiCreator**(schema: *`JsonSchema`*, dispath: *`any`*, getState: *`function`*, setState: *`function`*, keyMap: *`any`*, hooks: *`HooksObjectType`*, JSONValidator: *`any`*, apiOpts: *`APICreateOptsType`*): `FormApi`

*Defined in api.tsx:808*

**Parameters:**

| Param | Type |
| ------ | ------ |
| schema | `JsonSchema` | 
| dispath | `any` | 
| getState | `function` | 
| setState | `function` | 
| keyMap | `any` | 
| hooks | `HooksObjectType` | 
| JSONValidator | `any` | 
| apiOpts | `APICreateOptsType` | 

**Returns:** `FormApi`

___
<a id="applymap"></a>

###  applyMap

▸ **applyMap**(state: *`StateType`*, changesArray: *`StateType`[]*, stuff: *`any`*): `UpdateItem`[] |`false`

*Defined in api.tsx:511*

**Parameters:**

| Param | Type |
| ------ | ------ |
| state | `StateType` | 
| changesArray | `StateType`[] | 
| stuff | `any` | 

**Returns:** `UpdateItem`[] |
`false`

___
<a id="execactions"></a>

###  execActions

▸ **execActions**(dispath: *`any`*): `any`

*Defined in api.tsx:736*

**Parameters:**

| Param | Type |
| ------ | ------ |
| dispath | `any` | 

**Returns:** `any`

___
<a id="formreducer"></a>

###  formReducer

▸ **formReducer**(name?: *`undefined` |`string`*): `any`

*Defined in api.tsx:782*

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Optional` name | `undefined` |
`string`
 | 

**Returns:** `any`

___
<a id="getfrval"></a>

###  getFRVal

▸ **getFRVal**(): `string`

*Defined in api.tsx:778*

**Returns:** `string`

___
<a id="getkeysaccording2schema"></a>

###  getKeysAccording2schema

▸ **getKeysAccording2schema**(state: *`StateType`*, path: *`Path`*): `string`[]

*Defined in api.tsx:233*

**Parameters:**

| Param | Type |
| ------ | ------ |
| state | `StateType` | 
| path | `Path` | 

**Returns:** `string`[]

___
<a id="getrawvalueschanges"></a>

###  getRawValuesChanges

▸ **getRawValuesChanges**(prevState?: *`StateType`*, nextState: *`StateType`*, opts?: *`object`*): `object` |`object`

*Defined in api.tsx:248*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` prevState | `StateType` |  {} | 
| nextState | `StateType` | - | 
| `Default value` opts | `object` |  {} | 

**Returns:** `object` |
`object`

___
<a id="getupdatedrawvalues"></a>

###  getUpdatedRawValues

▸ **getUpdatedRawValues**(rawValues: *`any`*, prevState: *`StateType`*, nextState: *`StateType`*, stuff: *`any`*, replaceRawValues?: *`any`*): `any`

*Defined in api.tsx:583*

**Parameters:**

| Param | Type |
| ------ | ------ |
| rawValues | `any` | 
| prevState | `StateType` | 
| nextState | `StateType` | 
| stuff | `any` | 
| `Optional` replaceRawValues | `any` | 

**Returns:** `any`

___
<a id="getvaluefromupdateitemifexists"></a>

###  getValueFromUpdateItemIfExists

▸ **getValueFromUpdateItemIfExists**(keyPath: *`Path`*, item: *`UpdateItem`*): `any`

*Defined in api.tsx:110*

**Parameters:**

| Param | Type |
| ------ | ------ |
| keyPath | `Path` | 
| item | `UpdateItem` | 

**Returns:** `any`

___
<a id="havevalues"></a>

###  haveValues

▸ **haveValues**(schemaPart: *`JsonSchema`*): `any`

*Defined in api.tsx:282*

**Parameters:**

| Param | Type |
| ------ | ------ |
| schemaPart | `JsonSchema` | 

**Returns:** `any`

___
<a id="hookmanager"></a>

###  hookManager

▸ **hookManager**(): `any`

*Defined in api.tsx:89*

**Returns:** `any`

___
<a id="makeitems4rawvalues"></a>

###  makeItems4rawValues

▸ **makeItems4rawValues**(rawValues: *`any`*, newRawValues: *`any`*, schema: *`any`*, state: *`StateType`*): (`object` &`object`)[]

*Defined in api.tsx:545*

**Parameters:**

| Param | Type |
| ------ | ------ |
| rawValues | `any` | 
| newRawValues | `any` | 
| schema | `any` | 
| state | `StateType` | 

**Returns:** (`object` &`object`)[]

___
<a id="makevalidation"></a>

###  makeValidation

▸ **makeValidation**(state: *`any`*, dispath: *`any`*, action: *`any`*): `Promise`<`void`>

*Defined in api.tsx:603*

**Parameters:**

| Param | Type |
| ------ | ------ |
| state | `any` | 
| dispath | `any` | 
| action | `any` | 

**Returns:** `Promise`<`void`>

___
<a id="rawvaluesreplaceable"></a>

###  rawValuesReplaceable

▸ **rawValuesReplaceable**(schema: *`JsonSchema`*): `(Anonymous function)`

*Defined in api.tsx:558*

**Parameters:**

| Param | Type |
| ------ | ------ |
| schema | `JsonSchema` | 

**Returns:** `(Anonymous function)`

___
<a id="recursivelyresetvalue"></a>

###  recursivelyResetValue

▸ **recursivelyResetValue**(items: *`UpdateItem`[]*, schema: *`any`*, keyPath: *`Path`*, value: *`any`*, track?: *`Path`*): `void`

*Defined in api.tsx:286*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| items | `UpdateItem`[] | - | 
| schema | `any` | - | 
| keyPath | `Path` | - | 
| value | `any` | - | 
| `Default value` track | `Path` |  [&#x27;#&#x27;] | 

**Returns:** `void`

___
<a id="recursivelysetchanges"></a>

###  recursivelySetChanges

▸ **recursivelySetChanges**(after: *`UpdateItem`[]*, statePart: *`StateType`*, keyPath: *`Path`*, value: *`any`*, track: *`Path`*): `void`

*Defined in api.tsx:149*

**Parameters:**

| Param | Type |
| ------ | ------ |
| after | `UpdateItem`[] | 
| statePart | `StateType` | 
| keyPath | `Path` | 
| value | `any` | 
| track | `Path` | 

**Returns:** `void`

___
<a id="recursivelysetitems"></a>

###  recursivelySetItems

▸ **recursivelySetItems**(items: *`UpdateItem`[]*, schema: *`any`*, state: *`StateType`*, keyPath: *`Path`*, vals: *`any`*, track?: *`Path`*, forceSetLength?: *`boolean`*): `void`

*Defined in api.tsx:294*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| items | `UpdateItem`[] | - | 
| schema | `any` | - | 
| state | `StateType` | - | 
| keyPath | `Path` | - | 
| vals | `any` | - | 
| `Default value` track | `Path` |  [&#x27;#&#x27;] | 
| `Default value` forceSetLength | `boolean` | false | 

**Returns:** `void`

___
<a id="restorestructure"></a>

###  restoreStructure

▸ **restoreStructure**(obj: *`any`*, example: *`any`*): `any`

*Defined in api.tsx:568*

**Parameters:**

| Param | Type |
| ------ | ------ |
| obj | `any` | 
| example | `any` | 

**Returns:** `any`

___
<a id="setarraylength"></a>

###  setArrayLength

▸ **setArrayLength**(items: *`UpdateItem`[]*, schema: *`any`*, state: *`StateType`*, path: *`Path`*, newLengthsValue: *`object`*): `void`

*Defined in api.tsx:312*

**Parameters:**

| Param | Type |
| ------ | ------ |
| items | `UpdateItem`[] | 
| schema | `any` | 
| state | `StateType` | 
| path | `Path` | 
| newLengthsValue | `object` | 

**Returns:** `void`

___
<a id="setstatechanges"></a>

###  setStateChanges

▸ **setStateChanges**(startState: *`StateType`*, action: *`SetItemsType`*): `object`

*Defined in api.tsx:349*

**Parameters:**

| Param | Type |
| ------ | ------ |
| startState | `StateType` | 
| action | `SetItemsType` | 

**Returns:** `object`

___

