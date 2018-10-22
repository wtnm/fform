[flexibile-form](../README.md) > ["core"](../modules/_core_.md) > [FFormCore](../classes/_core_.fformcore.md)

# Class: FFormCore

Creates a core that contains data and api for changing it

## Hierarchy

**FFormCore**

## Index

### Constructors

* [constructor](_core_.fformcore.md#constructor)

### Properties

* [api](_core_.fformcore.md#api)
* [name](_core_.fformcore.md#name)
* [promise](_core_.fformcore.md#promise)
* [utils](_core_.fformcore.md#utils)

### Methods

* [addListener](_core_.fformcore.md#addlistener)
* [delListener](_core_.fformcore.md#dellistener)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new FFormCore**(props: *`FFormCoreProps`*): [FFormCore](_core_.fformcore.md)

*Defined in core.tsx:57*

**Parameters:**

| Param | Type |
| ------ | ------ |
| props | `FFormCoreProps` | 

**Returns:** [FFormCore](_core_.fformcore.md)

___

## Properties

<a id="api"></a>

###  api

**● api**: *`FormApi`*

*Defined in core.tsx:55*

___
<a id="name"></a>

###  name

**● name**: *`string`*

*Defined in core.tsx:57*

___
<a id="promise"></a>

###  promise

**● promise**: *`Promise`<`any`>*

*Defined in core.tsx:56*

___
<a id="utils"></a>

###  utils

**● utils**: *`utilsApiType`* =  utils

*Defined in core.tsx:54*

___

## Methods

<a id="addlistener"></a>

###  addListener

▸ **addListener**(fn: *`function`*): `any`

*Defined in core.tsx:92*

**Parameters:**

| Param | Type |
| ------ | ------ |
| fn | `function` | 

**Returns:** `any`

___
<a id="dellistener"></a>

###  delListener

▸ **delListener**(fn?: *`undefined` |`function`*): `void`

*Defined in core.tsx:99*

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Optional` fn | `undefined` |
`function`
 | 

**Returns:** `void`

___

