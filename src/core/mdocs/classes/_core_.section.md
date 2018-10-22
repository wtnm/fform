[flexibile-form](../README.md) > ["core"](../modules/_core_.md) > [Section](../classes/_core_.section.md)

# Class: Section

## Hierarchy

 `Component`<`any`, `any`>

**↳ Section**

## Index

### Constructors

* [constructor](_core_.section.md#constructor)

### Properties

* [ArrayItem](_core_.section.md#arrayitem)
* [arrayStartIndex](_core_.section.md#arraystartindex)
* [context](_core_.section.md#context)
* [dataMaps](_core_.section.md#datamaps)
* [dataProps](_core_.section.md#dataprops)
* [fields](_core_.section.md#fields)
* [focusField](_core_.section.md#focusfield)
* [getDataProps](_core_.section.md#getdataprops)
* [isArray](_core_.section.md#isarray)
* [keyField](_core_.section.md#keyfield)
* [layoutsArray](_core_.section.md#layoutsarray)
* [layoutsObject](_core_.section.md#layoutsobject)
* [length](_core_.section.md#length)
* [prevState](_core_.section.md#prevstate)
* [props](_core_.section.md#props)
* [refs](_core_.section.md#refs)
* [setFieldRef](_core_.section.md#setfieldref)
* [setWidRef](_core_.section.md#setwidref)
* [shouldBuild](_core_.section.md#shouldbuild)
* [state](_core_.section.md#state)
* [wids](_core_.section.md#wids)

### Methods

* [_build](_core_.section.md#_build)
* [_clear](_core_.section.md#_clear)
* [_getObjectKeys](_core_.section.md#_getobjectkeys)
* [_makeArrayItems](_core_.section.md#_makearrayitems)
* [focus](_core_.section.md#focus)
* [forceUpdate](_core_.section.md#forceupdate)
* [rebuild](_core_.section.md#rebuild)
* [render](_core_.section.md#render)
* [setState](_core_.section.md#setstate)
* [shouldComponentUpdate](_core_.section.md#shouldcomponentupdate)
* [componentDidCatch](_core_.section.md#componentdidcatch)
* [componentDidMount](_core_.section.md#componentdidmount)
* [componentDidUpdate](_core_.section.md#componentdidupdate)
* [componentWillMount](_core_.section.md#componentwillmount)
* [componentWillReceiveProps](_core_.section.md#componentwillreceiveprops)
* [componentWillUnmount](_core_.section.md#componentwillunmount)
* [componentWillUpdate](_core_.section.md#componentwillupdate)
* [shouldComponentUpdate](_core_.section.md#shouldcomponentupdate-1)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Section**(props: *`any`*, context: *`any`*): [Section](_core_.section.md)

*Overrides Component.__constructor*

*Defined in core.tsx:347*

**Parameters:**

| Param | Type |
| ------ | ------ |
| props | `any` | 
| context | `any` | 

**Returns:** [Section](_core_.section.md)

___

## Properties

<a id="arrayitem"></a>

###  ArrayItem

**● ArrayItem**: *`any`*

*Defined in core.tsx:333*

___
<a id="arraystartindex"></a>

###  arrayStartIndex

**● arrayStartIndex**: *`number`* = 0

*Defined in core.tsx:335*

___
<a id="context"></a>

###  context

**● context**: *`any`*

*Inherited from Component.context*

*Defined in C:/workspace/nodejs/FForm/node_modules/@types/react/index.d.ts:294*

___
<a id="datamaps"></a>

###  dataMaps

**● dataMaps**: *`object`*

*Defined in core.tsx:340*

#### Type declaration

[key: `string`]: `any`

___
<a id="dataprops"></a>

###  dataProps

**● dataProps**: *`object`*

*Defined in core.tsx:341*

#### Type declaration

[key: `string`]: `any`

___
<a id="fields"></a>

###  fields

**● fields**: *`object`*

*Defined in core.tsx:338*

#### Type declaration

[key: `string`]: `any`

___
<a id="focusfield"></a>

###  focusField

**● focusField**: *`string`* = ""

*Defined in core.tsx:337*

___
<a id="getdataprops"></a>

###  getDataProps

**● getDataProps**: *`any`*

*Defined in core.tsx:342*

___
<a id="isarray"></a>

###  isArray

**● isArray**: *`boolean`* = false

*Defined in core.tsx:334*

___
<a id="keyfield"></a>

###  keyField

**● keyField**: *`string`*

*Defined in core.tsx:347*

___
<a id="layoutsarray"></a>

###  layoutsArray

**● layoutsArray**: *`any`[]* =  []

*Defined in core.tsx:332*

___
<a id="layoutsobject"></a>

###  layoutsObject

**● layoutsObject**: *`any`[]* =  []

*Defined in core.tsx:331*

___
<a id="length"></a>

###  length

**● length**: *`number`*

*Defined in core.tsx:346*

___
<a id="prevstate"></a>

###  prevState

**● prevState**: *`any`*

*Defined in core.tsx:345*

___
<a id="props"></a>

###  props

**● props**: *`Readonly`<`object`> &
`Readonly`<`any`>
*

*Inherited from Component.props*

*Defined in C:/workspace/nodejs/FForm/node_modules/@types/react/index.d.ts:292*

___
<a id="refs"></a>

###  refs

**● refs**: *`object`*

*Inherited from Component.refs*

*Defined in C:/workspace/nodejs/FForm/node_modules/@types/react/index.d.ts:295*

#### Type declaration

[key: `string`]: `ReactInstance`

___
<a id="setfieldref"></a>

###  setFieldRef

**● setFieldRef**: *`any`*

*Defined in core.tsx:344*

___
<a id="setwidref"></a>

###  setWidRef

**● setWidRef**: *`any`*

*Defined in core.tsx:343*

___
<a id="shouldbuild"></a>

###  shouldBuild

**● shouldBuild**: *`boolean`* = true

*Defined in core.tsx:336*

___
<a id="state"></a>

###  state

**● state**: *`Readonly`<`any`>*

*Inherited from Component.state*

*Defined in C:/workspace/nodejs/FForm/node_modules/@types/react/index.d.ts:293*

___
<a id="wids"></a>

###  wids

**● wids**: *`object`*

*Defined in core.tsx:339*

#### Type declaration

[key: `string`]: `any`

___

## Methods

<a id="_build"></a>

###  _build

▸ **_build**(props: *`any`*): `void`

*Defined in core.tsx:382*

**Parameters:**

| Param | Type |
| ------ | ------ |
| props | `any` | 

**Returns:** `void`

___
<a id="_clear"></a>

###  _clear

▸ **_clear**(): `void`

*Defined in core.tsx:473*

**Returns:** `void`

___
<a id="_getobjectkeys"></a>

###  _getObjectKeys

▸ **_getObjectKeys**(stateBranch: *`StateType`*, props: *`any`*): `string`[]

*Defined in core.tsx:481*

**Parameters:**

| Param | Type |
| ------ | ------ |
| stateBranch | `StateType` | 
| props | `any` | 

**Returns:** `string`[]

___
<a id="_makearrayitems"></a>

###  _makeArrayItems

▸ **_makeArrayItems**(props: *`any`*): `number`

*Defined in core.tsx:463*

**Parameters:**

| Param | Type |
| ------ | ------ |
| props | `any` | 

**Returns:** `number`

___
<a id="focus"></a>

###  focus

▸ **focus**(path: *`Path`*): `void`

*Defined in core.tsx:359*

**Parameters:**

| Param | Type |
| ------ | ------ |
| path | `Path` | 

**Returns:** `void`

___
<a id="forceupdate"></a>

###  forceUpdate

▸ **forceUpdate**(callBack?: *`undefined` |`function`*): `void`

*Inherited from Component.forceUpdate*

*Defined in C:/workspace/nodejs/FForm/node_modules/@types/react/index.d.ts:284*

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Optional` callBack | `undefined` |
`function`
 | 

**Returns:** `void`

___
<a id="rebuild"></a>

###  rebuild

▸ **rebuild**(path: *`Path`*): `void`

*Defined in core.tsx:370*

**Parameters:**

| Param | Type |
| ------ | ------ |
| path | `Path` | 

**Returns:** `void`

___
<a id="render"></a>

###  render

▸ **render**(): `Element`

*Overrides Component.render*

*Defined in core.tsx:515*

**Returns:** `Element`

___
<a id="setstate"></a>

###  setState

▸ **setState**K(f: *`function`*, callback?: *`undefined` |`function`*): `void`

▸ **setState**K(state: *`Pick`<`any`, `K`>*, callback?: *`undefined` |`function`*): `void`

*Inherited from Component.setState*

*Defined in C:/workspace/nodejs/FForm/node_modules/@types/react/index.d.ts:280*

**Type parameters:**

#### K :  `keyof any`
**Parameters:**

| Param | Type |
| ------ | ------ |
| f | `function` | 
| `Optional` callback | `undefined` |
`function`
 | 

**Returns:** `void`

*Inherited from Component.setState*

*Defined in C:/workspace/nodejs/FForm/node_modules/@types/react/index.d.ts:281*

**Type parameters:**

#### K :  `keyof any`
**Parameters:**

| Param | Type |
| ------ | ------ |
| state | `Pick`<`any`, `K`> | 
| `Optional` callback | `undefined` |
`function`
 | 

**Returns:** `void`

___
<a id="shouldcomponentupdate"></a>

###  shouldComponentUpdate

▸ **shouldComponentUpdate**(newProps: *`any`*): `boolean`

*Defined in core.tsx:489*

**Parameters:**

| Param | Type |
| ------ | ------ |
| newProps | `any` | 

**Returns:** `boolean`

___
<a id="componentdidcatch"></a>

### `<Static>``<Optional>` componentDidCatch

▸ **componentDidCatch**(error: *`Error`*, errorInfo: *`ErrorInfo`*): `void`

*Inherited from ComponentLifecycle.componentDidCatch*

*Defined in C:/workspace/nodejs/FForm/node_modules/@types/react/index.d.ts:401*

Catches exceptions generated in descendant components. Unhandled exceptions will cause the entire component tree to unmount.

**Parameters:**

| Param | Type |
| ------ | ------ |
| error | `Error` | 
| errorInfo | `ErrorInfo` | 

**Returns:** `void`

___
<a id="componentdidmount"></a>

### `<Static>``<Optional>` componentDidMount

▸ **componentDidMount**(): `void`

*Inherited from ComponentLifecycle.componentDidMount*

*Defined in C:/workspace/nodejs/FForm/node_modules/@types/react/index.d.ts:362*

Called immediately after a compoment is mounted. Setting state here will trigger re-rendering.

**Returns:** `void`

___
<a id="componentdidupdate"></a>

### `<Static>``<Optional>` componentDidUpdate

▸ **componentDidUpdate**(prevProps: *`Readonly`<`any`>*, prevState: *`Readonly`<`any`>*, prevContext: *`any`*): `void`

*Inherited from ComponentLifecycle.componentDidUpdate*

*Defined in C:/workspace/nodejs/FForm/node_modules/@types/react/index.d.ts:391*

Called immediately after updating occurs. Not called for the initial render.

**Parameters:**

| Param | Type |
| ------ | ------ |
| prevProps | `Readonly`<`any`> | 
| prevState | `Readonly`<`any`> | 
| prevContext | `any` | 

**Returns:** `void`

___
<a id="componentwillmount"></a>

### `<Static>``<Optional>` componentWillMount

▸ **componentWillMount**(): `void`

*Inherited from ComponentLifecycle.componentWillMount*

*Defined in C:/workspace/nodejs/FForm/node_modules/@types/react/index.d.ts:358*

Called immediately before mounting occurs, and before `Component#render`. Avoid introducing any side-effects or subscriptions in this method.

**Returns:** `void`

___
<a id="componentwillreceiveprops"></a>

### `<Static>``<Optional>` componentWillReceiveProps

▸ **componentWillReceiveProps**(nextProps: *`Readonly`<`any`>*, nextContext: *`any`*): `void`

*Inherited from ComponentLifecycle.componentWillReceiveProps*

*Defined in C:/workspace/nodejs/FForm/node_modules/@types/react/index.d.ts:370*

Called when the component may be receiving new props. React may call this even if props have not changed, so be sure to compare new and existing props if you only want to handle changes.

Calling `Component#setState` generally does not trigger this method.

**Parameters:**

| Param | Type |
| ------ | ------ |
| nextProps | `Readonly`<`any`> | 
| nextContext | `any` | 

**Returns:** `void`

___
<a id="componentwillunmount"></a>

### `<Static>``<Optional>` componentWillUnmount

▸ **componentWillUnmount**(): `void`

*Inherited from ComponentLifecycle.componentWillUnmount*

*Defined in C:/workspace/nodejs/FForm/node_modules/@types/react/index.d.ts:396*

Called immediately before a component is destroyed. Perform any necessary cleanup in this method, such as cancelled network requests, or cleaning up any DOM elements created in `componentDidMount`.

**Returns:** `void`

___
<a id="componentwillupdate"></a>

### `<Static>``<Optional>` componentWillUpdate

▸ **componentWillUpdate**(nextProps: *`Readonly`<`any`>*, nextState: *`Readonly`<`any`>*, nextContext: *`any`*): `void`

*Inherited from ComponentLifecycle.componentWillUpdate*

*Defined in C:/workspace/nodejs/FForm/node_modules/@types/react/index.d.ts:387*

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call `Component#setState` here.

**Parameters:**

| Param | Type |
| ------ | ------ |
| nextProps | `Readonly`<`any`> | 
| nextState | `Readonly`<`any`> | 
| nextContext | `any` | 

**Returns:** `void`

___
<a id="shouldcomponentupdate-1"></a>

### `<Static>``<Optional>` shouldComponentUpdate

▸ **shouldComponentUpdate**(nextProps: *`Readonly`<`any`>*, nextState: *`Readonly`<`any`>*, nextContext: *`any`*): `boolean`

*Inherited from ComponentLifecycle.shouldComponentUpdate*

*Defined in C:/workspace/nodejs/FForm/node_modules/@types/react/index.d.ts:381*

Called to determine whether the change in props and state should trigger a re-render.

`Component` always returns true. `PureComponent` implements a shallow comparison on props and state and returns true if any props or states have changed.

If false is returned, `Component#render`, `componentWillUpdate` and `componentDidUpdate` will not be called.

**Parameters:**

| Param | Type |
| ------ | ------ |
| nextProps | `Readonly`<`any`> | 
| nextState | `Readonly`<`any`> | 
| nextContext | `any` | 

**Returns:** `boolean`

___

