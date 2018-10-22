[flexibile-form](../README.md) > ["core"](../modules/_core_.md) > [FForm](../classes/_core_.fform.md)

# Class: FForm

## Hierarchy

 `PureComponent`<`any`, `any`>

**↳ FForm**

## Index

### Constructors

* [constructor](_core_.fform.md#constructor)

### Properties

* [_currentState](_core_.fform.md#_currentstate)
* [_setRef](_core_.fform.md#_setref)
* [_unsubscribe](_core_.fform.md#_unsubscribe)
* [api](_core_.fform.md#api)
* [core](_core_.fform.md#core)
* [formName](_core_.fform.md#formname)
* [objects](_core_.fform.md#objects)
* [parent](_core_.fform.md#parent)
* [rRefs](_core_.fform.md#rrefs)
* [schema](_core_.fform.md#schema)
* [utils](_core_.fform.md#utils)

### Methods

* [_getCoreFromParams](_core_.fform.md#_getcorefromparams)
* [_submit](_core_.fform.md#_submit)
* [_updateState](_core_.fform.md#_updatestate)
* [componentWillUnmount](_core_.fform.md#componentwillunmount)
* [focus](_core_.fform.md#focus)
* [render](_core_.fform.md#render)
* [shouldComponentUpdate](_core_.fform.md#shouldcomponentupdate)
* [componentDidCatch](_core_.fform.md#componentdidcatch)
* [componentDidMount](_core_.fform.md#componentdidmount)
* [componentDidUpdate](_core_.fform.md#componentdidupdate)
* [componentWillMount](_core_.fform.md#componentwillmount)
* [componentWillReceiveProps](_core_.fform.md#componentwillreceiveprops)
* [componentWillUnmount](_core_.fform.md#componentwillunmount-1)
* [componentWillUpdate](_core_.fform.md#componentwillupdate)
* [shouldComponentUpdate](_core_.fform.md#shouldcomponentupdate-1)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new FForm**(props: *`FFormProps`*, context: *`any`*): [FForm](_core_.fform.md)

*Defined in core.tsx:168*

**Parameters:**

| Param | Type |
| ------ | ------ |
| props | `FFormProps` | 
| context | `any` | 

**Returns:** [FForm](_core_.fform.md)

___

## Properties

<a id="_currentstate"></a>

###  _currentState

**● _currentState**: *`any`*

*Defined in core.tsx:157*

___
<a id="_setref"></a>

###  _setRef

**● _setRef**: *`any`*

*Defined in core.tsx:159*

___
<a id="_unsubscribe"></a>

###  _unsubscribe

**● _unsubscribe**: *`any`*

*Defined in core.tsx:156*

___
<a id="api"></a>

###  api

**● api**: *`any`*

*Defined in core.tsx:165*

___
<a id="core"></a>

###  core

**● core**: *`any`*

*Defined in core.tsx:161*

___
<a id="formname"></a>

###  formName

**● formName**: *`any`*

*Defined in core.tsx:163*

___
<a id="objects"></a>

###  objects

**● objects**: *`any`*

*Defined in core.tsx:167*

___
<a id="parent"></a>

###  parent

**● parent**: *`any`*

*Defined in core.tsx:168*

___
<a id="rrefs"></a>

###  rRefs

**● rRefs**: *`any`*

*Defined in core.tsx:162*

___
<a id="schema"></a>

###  schema

**● schema**: *`any`*

*Defined in core.tsx:164*

___
<a id="utils"></a>

###  utils

**● utils**: *`any`*

*Defined in core.tsx:166*

___

## Methods

<a id="_getcorefromparams"></a>

###  _getCoreFromParams

▸ **_getCoreFromParams**(core: *`any`*, context: *`any`*): [FFormCore](_core_.fformcore.md)

*Defined in core.tsx:218*

**Parameters:**

| Param | Type |
| ------ | ------ |
| core | `any` | 
| context | `any` | 

**Returns:** [FFormCore](_core_.fformcore.md)

___
<a id="_submit"></a>

###  _submit

▸ **_submit**(): `any`

*Defined in core.tsx:207*

**Returns:** `any`

___
<a id="_updatestate"></a>

###  _updateState

▸ **_updateState**(state: *`StateType`*): `void`

*Defined in core.tsx:190*

**Parameters:**

| Param | Type |
| ------ | ------ |
| state | `StateType` | 

**Returns:** `void`

___
<a id="componentwillunmount"></a>

###  componentWillUnmount

▸ **componentWillUnmount**(): `void`

*Defined in core.tsx:256*

**Returns:** `void`

___
<a id="focus"></a>

###  focus

▸ **focus**(path: *`Path` |`string`*): `void`

*Defined in core.tsx:260*

**Parameters:**

| Param | Type |
| ------ | ------ |
| path | `Path` |
`string`
 | 

**Returns:** `void`

___
<a id="render"></a>

###  render

▸ **render**(): `Element`

*Defined in core.tsx:268*

**Returns:** `Element`

___
<a id="shouldcomponentupdate"></a>

###  shouldComponentUpdate

▸ **shouldComponentUpdate**(newProps: *`FFormProps`*): `boolean`

*Defined in core.tsx:223*

**Parameters:**

| Param | Type |
| ------ | ------ |
| newProps | `FFormProps` | 

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
<a id="componentwillunmount-1"></a>

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

