[flexibile-form](../README.md) > ["core"](../modules/_core_.md) > [SectionObject](../classes/_core_.sectionobject.md)

# Class: SectionObject

## Hierarchy

 `Component`<`any`, `any`>

**↳ SectionObject**

## Index

### Constructors

* [constructor](_core_.sectionobject.md#constructor)

### Properties

* [context](_core_.sectionobject.md#context)
* [props](_core_.sectionobject.md#props)
* [refs](_core_.sectionobject.md#refs)
* [state](_core_.sectionobject.md#state)

### Methods

* [forceUpdate](_core_.sectionobject.md#forceupdate)
* [render](_core_.sectionobject.md#render)
* [setState](_core_.sectionobject.md#setstate)
* [componentDidCatch](_core_.sectionobject.md#componentdidcatch)
* [componentDidMount](_core_.sectionobject.md#componentdidmount)
* [componentDidUpdate](_core_.sectionobject.md#componentdidupdate)
* [componentWillMount](_core_.sectionobject.md#componentwillmount)
* [componentWillReceiveProps](_core_.sectionobject.md#componentwillreceiveprops)
* [componentWillUnmount](_core_.sectionobject.md#componentwillunmount)
* [componentWillUpdate](_core_.sectionobject.md#componentwillupdate)
* [shouldComponentUpdate](_core_.sectionobject.md#shouldcomponentupdate)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new SectionObject**(props?: *`P`*, context?: *`any`*): [SectionObject](_core_.sectionobject.md)

*Inherited from Component.__constructor*

*Defined in C:/workspace/nodejs/FForm/node_modules/@types/react/index.d.ts:275*

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Optional` props | `P` | 
| `Optional` context | `any` | 

**Returns:** [SectionObject](_core_.sectionobject.md)

___

## Properties

<a id="context"></a>

###  context

**● context**: *`any`*

*Inherited from Component.context*

*Defined in C:/workspace/nodejs/FForm/node_modules/@types/react/index.d.ts:294*

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
<a id="state"></a>

###  state

**● state**: *`Readonly`<`any`>*

*Inherited from Component.state*

*Defined in C:/workspace/nodejs/FForm/node_modules/@types/react/index.d.ts:293*

___

## Methods

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
<a id="render"></a>

###  render

▸ **render**(): `Element`

*Overrides Component.render*

*Defined in core.tsx:296*

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
<a id="shouldcomponentupdate"></a>

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

