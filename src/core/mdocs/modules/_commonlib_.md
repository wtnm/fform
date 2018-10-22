[flexibile-form](../README.md) > ["commonLib"](../modules/_commonlib_.md)

# External module: "commonLib"

## Index

### Variables

* [_typeof](_commonlib_.md#_typeof)
* [isArr](_commonlib_.md#isarr)
* [objKeys](_commonlib_.md#objkeys)

### Functions

* [asNumber](_commonlib_.md#asnumber)
* [delIn](_commonlib_.md#delin)
* [getByKey](_commonlib_.md#getbykey)
* [getIn](_commonlib_.md#getin)
* [getSlice](_commonlib_.md#getslice)
* [is](_commonlib_.md#is)
* [isEqual](_commonlib_.md#isequal)
* [isMergeable](_commonlib_.md#ismergeable)
* [isObject](_commonlib_.md#isobject)
* [isUndefined](_commonlib_.md#isundefined)
* [makeSlice](_commonlib_.md#makeslice)
* [memoize](_commonlib_.md#memoize)
* [merge](_commonlib_.md#merge)
* [mergeState](_commonlib_.md#mergestate)
* [moveArrayElems](_commonlib_.md#movearrayelems)
* [not](_commonlib_.md#not)
* [objKeysNSymb](_commonlib_.md#objkeysnsymb)
* [push2array](_commonlib_.md#push2array)

---

## Variables

<a id="_typeof"></a>

### `<Const>` _typeof

**● _typeof**: *`(Anonymous function)`* =  typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
  ? (obj: any) => typeof obj
  : (obj: any) => obj && typeof Symbol === "function" && obj.constructor === Symbol
    ? "symbol"
    : typeof obj

*Defined in commonLib.tsx:6*

___
<a id="isarr"></a>

### `<Const>` isArr

**● isArr**: *`isArray`* =  Array.isArray

*Defined in commonLib.tsx:2*

___
<a id="objkeys"></a>

### `<Const>` objKeys

**● objKeys**: *`keys`* =  Object.keys

*Defined in commonLib.tsx:1*

___

## Functions

<a id="asnumber"></a>

###  asNumber

▸ **asNumber**(value: *`any`*): `any`

*Defined in commonLib.tsx:59*

**Parameters:**

| Param | Type |
| ------ | ------ |
| value | `any` | 

**Returns:** `any`

___
<a id="delin"></a>

###  delIn

▸ **delIn**(state: *`StateType`*, path: *`Path`*): `object`

*Defined in commonLib.tsx:108*

**Parameters:**

| Param | Type |
| ------ | ------ |
| state | `StateType` | 
| path | `Path` | 

**Returns:** `object`

___
<a id="getbykey"></a>

###  getByKey

▸ **getByKey**(obj: *`any`*, keys: *`Array`<`string` |`number` |`symbol`> |`string` |`number` |`symbol`*, value?: *`any`*): `any`

*Defined in commonLib.tsx:286*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| obj | `any` | - | 
| keys | `Array`<`string` |`number` |`symbol`> |
`string` |
`number` |
`symbol`
 | - | 
| `Default value` value | `any` |  {} | 

**Returns:** `any`

___
<a id="getin"></a>

###  getIn

▸ **getIn**(state: *`any`*, ...paths: *`any`[]*): `any`

*Defined in commonLib.tsx:132*

**Parameters:**

| Param | Type |
| ------ | ------ |
| state | `any` | 
| `Rest` paths | `any`[] | 

**Returns:** `any`

___
<a id="getslice"></a>

###  getSlice

▸ **getSlice**(store: *`any`*, path: *`PathSlice`*, track?: *`PathSlice`*): `StateType`

*Defined in commonLib.tsx:54*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| store | `any` | - | 
| path | `PathSlice` | - | 
| `Default value` track | `PathSlice` |  [] | 

**Returns:** `StateType`

___
<a id="is"></a>

###  is

▸ **is**(x: *`any`*, y: *`any`*): `boolean`

*Defined in commonLib.tsx:13*

**Parameters:**

| Param | Type |
| ------ | ------ |
| x | `any` | 
| y | `any` | 

**Returns:** `boolean`

___
<a id="isequal"></a>

###  isEqual

▸ **isEqual**(objA: *`any`*, objB: *`any`*, options?: *`IsEqualOptions`*): `boolean`

*Defined in commonLib.tsx:24*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| objA | `any` | - | 
| objB | `any` | - | 
| `Default value` options | `IsEqualOptions` |  {} | 

**Returns:** `boolean`

___
<a id="ismergeable"></a>

###  isMergeable

▸ **isMergeable**(val: *`any`*): `boolean`

*Defined in commonLib.tsx:261*

**Parameters:**

| Param | Type |
| ------ | ------ |
| val | `any` | 

**Returns:** `boolean`

___
<a id="isobject"></a>

###  isObject

▸ **isObject**(val: *`any`*): `boolean`

*Defined in commonLib.tsx:257*

**Parameters:**

| Param | Type |
| ------ | ------ |
| val | `any` | 

**Returns:** `boolean`

___
<a id="isundefined"></a>

### `<Const>` isUndefined

▸ **isUndefined**(value: *`any`*): `boolean`

*Defined in commonLib.tsx:3*

**Parameters:**

| Param | Type |
| ------ | ------ |
| value | `any` | 

**Returns:** `boolean`

___
<a id="makeslice"></a>

###  makeSlice

▸ **makeSlice**(...pathValues: *`any`[]*): `StateType`

*Defined in commonLib.tsx:91*

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Rest` pathValues | `any`[] | 

**Returns:** `StateType`

___
<a id="memoize"></a>

###  memoize

▸ **memoize**(fn: *`any`*): `(Anonymous function)`

*Defined in commonLib.tsx:270*

**Parameters:**

| Param | Type |
| ------ | ------ |
| fn | `any` | 

**Returns:** `(Anonymous function)`

___
<a id="merge"></a>

### `<Const>` merge

▸ **merge**(a: *`any`*, b: *`any`*, opts?: *`MergeStateOptionsArgument`*): `any`

*Defined in commonLib.tsx:250*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| a | `any` | - | 
| b | `any` | - | 
| `Default value` opts | `MergeStateOptionsArgument` |  {} | 

**Returns:** `any`

___
<a id="mergestate"></a>

###  mergeState

▸ **mergeState**(state: *`any`*, source: *`any`*, options?: *`MergeStateOptionsArgument`*): `MergeStateResult`

*Defined in commonLib.tsx:148*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| state | `any` | - | 
| source | `any` | - | 
| `Default value` options | `MergeStateOptionsArgument` |  {} | 

**Returns:** `MergeStateResult`

___
<a id="movearrayelems"></a>

###  moveArrayElems

▸ **moveArrayElems**(arr: *`any`*, from: *`number`*, to: *`number`*): `Array`<`any`>

*Defined in commonLib.tsx:78*

**Parameters:**

| Param | Type |
| ------ | ------ |
| arr | `any` | 
| from | `number` | 
| to | `number` | 

**Returns:** `Array`<`any`>

___
<a id="not"></a>

###  not

▸ **not**(val: *`any`*): `boolean`

*Defined in commonLib.tsx:296*

**Parameters:**

| Param | Type |
| ------ | ------ |
| val | `any` | 

**Returns:** `boolean`

___
<a id="objkeysnsymb"></a>

###  objKeysNSymb

▸ **objKeysNSymb**(obj: *`any`*): `Array`<`string`>

*Defined in commonLib.tsx:49*

**Parameters:**

| Param | Type |
| ------ | ------ |
| obj | `any` | 

**Returns:** `Array`<`string`>

___
<a id="push2array"></a>

###  push2array

▸ **push2array**(array: *`any`[]*, ...vals: *`any`[]*): `any`

*Defined in commonLib.tsx:69*

**Parameters:**

| Param | Type |
| ------ | ------ |
| array | `any`[] | 
| `Rest` vals | `any`[] | 

**Returns:** `any`

___

