[flexibile-form](../README.md) > ["core"](../modules/_core_.md)

# External module: "core"

## Index

### Classes

* [AutosizeBlock](../classes/_core_.autosizeblock.md)
* [FField](../classes/_core_.ffield.md)
* [FForm](../classes/_core_.fform.md)
* [FFormCore](../classes/_core_.fformcore.md)
* [Section](../classes/_core_.section.md)
* [SectionField](../classes/_core_.sectionfield.md)
* [SectionObject](../classes/_core_.sectionobject.md)

### Variables

* [JSONSchemaValidator](_core_.md#jsonschemavalidator)
* [_path2currentValue](_core_.md#_path2currentvalue)
* [_path2rawValues](_core_.md#_path2rawvalues)

### Functions

* [AddButtonBlock](_core_.md#addbuttonblock)
* [ArrayBlock](_core_.md#arrayblock)
* [ArrayInput](_core_.md#arrayinput)
* [ArrayItem](_core_.md#arrayitem)
* [BaseInput](_core_.md#baseinput)
* [CheckboxInput](_core_.md#checkboxinput)
* [DefaultBuilder](_core_.md#defaultbuilder)
* [DivBlock](_core_.md#divblock)
* [EmptyArray](_core_.md#emptyarray)
* [ItemMenu](_core_.md#itemmenu)
* [MessageBlock](_core_.md#messageblock)
* [MessageItem](_core_.md#messageitem)
* [TitleBlock](_core_.md#titleblock)
* [TristateBox](_core_.md#tristatebox)
* [Unsupported](_core_.md#unsupported)
* [applyMixins](_core_.md#applymixins)
* [getArrayOfPropsFromArrayOfObjects](_core_.md#getarrayofpropsfromarrayofobjects)
* [getFieldBlocks](_core_.md#getfieldblocks)
* [mapProps](_core_.md#mapprops)
* [onSelectChange](_core_.md#onselectchange)
* [replaceWidgetNamesWithFunctions](_core_.md#replacewidgetnameswithfunctions)
* [selectorMap](_core_.md#selectormap)
* [setFField](_core_.md#setffield)

### Object literals

* [basicObjects](_core_.md#basicobjects)
* [buttonObject](_core_.md#buttonobject)
* [sizerStyle](_core_.md#sizerstyle)

---

## Variables

<a id="jsonschemavalidator"></a>

### `<Const>` JSONSchemaValidator

**● JSONSchemaValidator**: *`any`* =  require('./is-my-json-valid')

*Defined in core.tsx:23*

___
<a id="_path2currentvalue"></a>

### `<Const>` _path2currentValue

**● _path2currentValue**: *(`string` |`symbol`)[]* =  [SymbolData, 'rawValues', 'current']

*Defined in core.tsx:26*

___
<a id="_path2rawvalues"></a>

### `<Const>` _path2rawValues

**● _path2rawValues**: *(`string` |`symbol`)[]* =  [SymbolData, 'rawValues']

*Defined in core.tsx:25*

___

## Functions

<a id="addbuttonblock"></a>

###  AddButtonBlock

▸ **AddButtonBlock**(props: *`any`*): `false` |`Element`

*Defined in core.tsx:1040*

**Parameters:**

| Param | Type |
| ------ | ------ |
| props | `any` | 

**Returns:** `false` |
`Element`

___
<a id="arrayblock"></a>

###  ArrayBlock

▸ **ArrayBlock**(props: *`any`*): `Element`

*Defined in core.tsx:524*

**Parameters:**

| Param | Type |
| ------ | ------ |
| props | `any` | 

**Returns:** `Element`

___
<a id="arrayinput"></a>

###  ArrayInput

▸ **ArrayInput**(props: *`any`*): `Element`

*Defined in core.tsx:909*

**Parameters:**

| Param | Type |
| ------ | ------ |
| props | `any` | 

**Returns:** `Element`

___
<a id="arrayitem"></a>

###  ArrayItem

▸ **ArrayItem**(props: *`any`*): `ReactElement`<`any`>

*Defined in core.tsx:1068*

**Parameters:**

| Param | Type |
| ------ | ------ |
| props | `any` | 

**Returns:** `ReactElement`<`any`>

___
<a id="baseinput"></a>

###  BaseInput

▸ **BaseInput**(props: *`any`*): `Element`

*Defined in core.tsx:874*

**Parameters:**

| Param | Type |
| ------ | ------ |
| props | `any` | 

**Returns:** `Element`

___
<a id="checkboxinput"></a>

###  CheckboxInput

▸ **CheckboxInput**(props: *`any`*): `Element`

*Defined in core.tsx:1009*

**Parameters:**

| Param | Type |
| ------ | ------ |
| props | `any` | 

**Returns:** `Element`

___
<a id="defaultbuilder"></a>

###  DefaultBuilder

▸ **DefaultBuilder**(props: *`any`*): `false` |`Element`

*Defined in core.tsx:809*

**Parameters:**

| Param | Type |
| ------ | ------ |
| props | `any` | 

**Returns:** `false` |
`Element`

___
<a id="divblock"></a>

###  DivBlock

▸ **DivBlock**(props: *`any`*): `Element`

*Defined in core.tsx:837*

**Parameters:**

| Param | Type |
| ------ | ------ |
| props | `any` | 

**Returns:** `Element`

___
<a id="emptyarray"></a>

###  EmptyArray

▸ **EmptyArray**(props: *`any`*): `Element`

*Defined in core.tsx:1035*

**Parameters:**

| Param | Type |
| ------ | ------ |
| props | `any` | 

**Returns:** `Element`

___
<a id="itemmenu"></a>

###  ItemMenu

▸ **ItemMenu**(props: *`any`*): `false` |`Element`

*Defined in core.tsx:1045*

**Parameters:**

| Param | Type |
| ------ | ------ |
| props | `any` | 

**Returns:** `false` |
`Element`

___
<a id="messageblock"></a>

###  MessageBlock

▸ **MessageBlock**(props: *`any`*): `Element`

*Defined in core.tsx:1014*

**Parameters:**

| Param | Type |
| ------ | ------ |
| props | `any` | 

**Returns:** `Element`

___
<a id="messageitem"></a>

###  MessageItem

▸ **MessageItem**(props: *`any`*): `Element`

*Defined in core.tsx:1028*

**Parameters:**

| Param | Type |
| ------ | ------ |
| props | `any` | 

**Returns:** `Element`

___
<a id="titleblock"></a>

###  TitleBlock

▸ **TitleBlock**(props: *`any`*): `Element`

*Defined in core.tsx:865*

**Parameters:**

| Param | Type |
| ------ | ------ |
| props | `any` | 

**Returns:** `Element`

___
<a id="tristatebox"></a>

###  TristateBox

▸ **TristateBox**(props: *`any`*): `Element`

*Defined in core.tsx:1157*

**Parameters:**

| Param | Type |
| ------ | ------ |
| props | `any` | 

**Returns:** `Element`

___
<a id="unsupported"></a>

###  Unsupported

▸ **Unsupported**(props: *`any`*): `Element`

*Defined in core.tsx:807*

**Parameters:**

| Param | Type |
| ------ | ------ |
| props | `any` | 

**Returns:** `Element`

___
<a id="applymixins"></a>

###  applyMixins

▸ **applyMixins**(derivedCtor: *`any`*, baseCtors: *`any`[]*): `void`

*Defined in core.tsx:29*

**Parameters:**

| Param | Type |
| ------ | ------ |
| derivedCtor | `any` | 
| baseCtors | `any`[] | 

**Returns:** `void`

___
<a id="getarrayofpropsfromarrayofobjects"></a>

###  getArrayOfPropsFromArrayOfObjects

▸ **getArrayOfPropsFromArrayOfObjects**(arr: *`any`*, propPath: *`string` |`Path`*): `any`

*Defined in core.tsx:1148*

**Parameters:**

| Param | Type |
| ------ | ------ |
| arr | `any` | 
| propPath | `string` |
`Path`
 | 

**Returns:** `any`

___
<a id="getfieldblocks"></a>

###  getFieldBlocks

▸ **getFieldBlocks**(presetsString: *`string` |`string`[]*, objects?: *`any`*, x?: *`any`*, initalFuncsObject?: *`any`*, object2bind?: *`any`*): `object`

*Defined in core.tsx:541*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| presetsString | `string` |
`string`[]
 | - | 
| `Default value` objects | `any` |  {} | 
| `Default value` x | `any` |  {} | 
| `Default value` initalFuncsObject | `any` |  {} | 
| `Default value` object2bind | `any` |  {} | 

**Returns:** `object`

___
<a id="mapprops"></a>

###  mapProps

▸ **mapProps**(map: *`PropsMapType`*, data: *`FieldData`*, bindObject: *`any`*): `object`

*Defined in core.tsx:784*

**Parameters:**

| Param | Type |
| ------ | ------ |
| map | `PropsMapType` | 
| data | `FieldData` | 
| bindObject | `any` | 

**Returns:** `object`

___
<a id="onselectchange"></a>

###  onSelectChange

▸ **onSelectChange**(event: *`any`*): `void`

*Defined in core.tsx:1131*

**Parameters:**

| Param | Type |
| ------ | ------ |
| event | `any` | 

**Returns:** `void`

___
<a id="replacewidgetnameswithfunctions"></a>

###  replaceWidgetNamesWithFunctions

▸ **replaceWidgetNamesWithFunctions**(presetArrays: *`any`*, objects: *`any`*): `any`

*Defined in core.tsx:318*

**Parameters:**

| Param | Type |
| ------ | ------ |
| presetArrays | `any` | 
| objects | `any` | 

**Returns:** `any`

___
<a id="selectormap"></a>

###  selectorMap

▸ **selectorMap**(opts?: *`object`*): `(Anonymous function)`

*Defined in core.tsx:1113*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` opts | `object` |  {} | 

**Returns:** `(Anonymous function)`

___
<a id="setffield"></a>

###  setFField

▸ **setFField**(pFForm: *`any`*, path: *`string`*, ref: *`any`*, fieldName?: *`undefined` |`string`*, keyField?: *`undefined` |`string`*): `Element`

*Defined in core.tsx:310*

**Parameters:**

| Param | Type |
| ------ | ------ |
| pFForm | `any` | 
| path | `string` | 
| ref | `any` | 
| `Optional` fieldName | `undefined` |
`string`
 | 
| `Optional` keyField | `undefined` |
`string`
 | 

**Returns:** `Element`

___

## Object literals

<a id="basicobjects"></a>

### `<Const>` basicObjects

**basicObjects**: *`object`*

*Defined in core.tsx:1173*

<a id="basicobjects.types"></a>

####  types

**● types**: *`string`[]* =  ['string', 'integer', 'number', 'object', 'array', 'boolean', 'null']

*Defined in core.tsx:1177*

___
<a id="basicobjects.extend"></a>

####  extend

▸ **extend**(obj: *`any`*): `any`

*Defined in core.tsx:1174*

**Parameters:**

| Param | Type |
| ------ | ------ |
| obj | `any` | 

**Returns:** `any`

___
<a id="basicobjects.methods2chain"></a>

####  methods2chain

**methods2chain**: *`object`*

*Defined in core.tsx:1178*

<a id="basicobjects.methods2chain.onblur"></a>

####  onBlur

**● onBlur**: *`boolean`* = true

*Defined in core.tsx:1179*

___
<a id="basicobjects.methods2chain.onchange"></a>

####  onChange

**● onChange**: *`boolean`* = true

*Defined in core.tsx:1179*

___
<a id="basicobjects.methods2chain.onclick"></a>

####  onClick

**● onClick**: *`boolean`* = true

*Defined in core.tsx:1179*

___
<a id="basicobjects.methods2chain.onfocus"></a>

####  onFocus

**● onFocus**: *`boolean`* = true

*Defined in core.tsx:1179*

___
<a id="basicobjects.methods2chain.onload"></a>

####  onLoad

**● onLoad**: *`boolean`* = true

*Defined in core.tsx:1179*

___
<a id="basicobjects.methods2chain.onmouseenter"></a>

####  onMouseEnter

**● onMouseEnter**: *`boolean`* = true

*Defined in core.tsx:1179*

___
<a id="basicobjects.methods2chain.onmouseleave"></a>

####  onMouseLeave

**● onMouseLeave**: *`boolean`* = true

*Defined in core.tsx:1179*

___
<a id="basicobjects.methods2chain.onmouseover"></a>

####  onMouseOver

**● onMouseOver**: *`boolean`* = true

*Defined in core.tsx:1179*

___
<a id="basicobjects.methods2chain.onselect"></a>

####  onSelect

**● onSelect**: *`boolean`* = true

*Defined in core.tsx:1179*

___
<a id="basicobjects.methods2chain.onsubmit"></a>

####  onSubmit

**● onSubmit**: *`boolean`* = true

*Defined in core.tsx:1179*

___
<a id="basicobjects.methods2chain.onunload"></a>

####  onUnload

**● onUnload**: *`boolean`* = true

*Defined in core.tsx:1179*

___

___
<a id="basicobjects.presetmap"></a>

####  presetMap

**presetMap**: *`object`*

*Defined in core.tsx:1407*

<a id="basicobjects.presetmap.array"></a>

####  array

**● array**: *`string`[]* =  ['select', 'checkboxes', 'files']

*Defined in core.tsx:1412*

___
<a id="basicobjects.presetmap.boolean"></a>

####  boolean

**● boolean**: *`string`[]* =  ['select', 'radio']

*Defined in core.tsx:1408*

___
<a id="basicobjects.presetmap.integer"></a>

####  integer

**● integer**: *`string`[]* =  ['select', 'updown', 'range', 'radio']

*Defined in core.tsx:1411*

___
<a id="basicobjects.presetmap.number"></a>

####  number

**● number**: *`string`[]* =  ['select', 'updown', 'range', 'radio']

*Defined in core.tsx:1410*

___
<a id="basicobjects.presetmap.string"></a>

####  string

**● string**: *`string`[]* =  ['select', 'password', 'email', 'hostname', 'ipv4', 'ipv6', 'uri', 'data-url', 'radio', 'textarea', 'hidden', 'date', 'datetime', 'date-time', 'color', 'file']

*Defined in core.tsx:1409*

___

___
<a id="basicobjects.presets"></a>

####  presets

**presets**: *`object`*

*Defined in core.tsx:1199*

<a id="basicobjects.presets._"></a>

####  *

*****: *`object`*

*Defined in core.tsx:1200*

<a id="basicobjects.presets._.array-1"></a>

####  Array

**Array**: *`object`*

*Defined in core.tsx:1210*

<a id="basicobjects.presets._.array-1.widget"></a>

####  widget

**● widget**: *`string`* = "Array"

*Defined in core.tsx:1211*

___
<a id="basicobjects.presets._.array-1.addbutton"></a>

####  addButton

**addButton**: *`object`*

*Defined in core.tsx:1213*

<a id="basicobjects.presets._.array-1.addbutton.widget-1"></a>

####  widget

**● widget**: *`string`* = "AddButton"

*Defined in core.tsx:1213*

___

___
<a id="basicobjects.presets._.array-1.empty"></a>

####  empty

**empty**: *`object`*

*Defined in core.tsx:1212*

<a id="basicobjects.presets._.array-1.empty.widget-2"></a>

####  widget

**● widget**: *`string`* = "EmptyArray"

*Defined in core.tsx:1212*

___

___
<a id="basicobjects.presets._.array-1.propsmap"></a>

####  propsMap

**propsMap**: *`object`*

*Defined in core.tsx:1214*

<a id="basicobjects.presets._.array-1.propsmap.canadd"></a>

####  canAdd

**● canAdd**: *`string`* = "array/canAdd"

*Defined in core.tsx:1216*

___
<a id="basicobjects.presets._.array-1.propsmap.length"></a>

####  length

**● length**: *`string`* = "array/lengths/current"

*Defined in core.tsx:1215*

___

___

___
<a id="basicobjects.presets._.arrayitem-1"></a>

####  ArrayItem

**ArrayItem**: *`object`*

*Defined in core.tsx:1219*

<a id="basicobjects.presets._.arrayitem-1.widget-3"></a>

####  widget

**● widget**: *`string`* = "ArrayItem"

*Defined in core.tsx:1220*

___
<a id="basicobjects.presets._.arrayitem-1.itemmenu-1"></a>

####  itemMenu

**itemMenu**: *`object`*

*Defined in core.tsx:1221*

<a id="basicobjects.presets._.arrayitem-1.itemmenu-1.buttons"></a>

####  buttons

**● buttons**: *`string`[]* =  ['first', 'last', 'up', 'down', 'del']

*Defined in core.tsx:1223*

___
<a id="basicobjects.presets._.arrayitem-1.itemmenu-1.widget-4"></a>

####  widget

**● widget**: *`string`* = "ItemMenu"

*Defined in core.tsx:1222*

___
<a id="basicobjects.presets._.arrayitem-1.itemmenu-1.buttonprops"></a>

####  buttonProps

**buttonProps**: *`object`*

*Defined in core.tsx:1224*

<a id="basicobjects.presets._.arrayitem-1.itemmenu-1.buttonprops.onclick-1"></a>

####  onClick

▸ **onClick**(key: *`string`*): `void`

*Defined in core.tsx:1225*

**Parameters:**

| Param | Type |
| ------ | ------ |
| key | `string` | 

**Returns:** `void`

___

___

___
<a id="basicobjects.presets._.arrayitem-1.propsmap-1"></a>

####  propsMap

**propsMap**: *`object`*

*Defined in core.tsx:1230*

<a id="basicobjects.presets._.arrayitem-1.propsmap-1.itemdata"></a>

####  itemData

**● itemData**: *`string`* = "arrayItem"

*Defined in core.tsx:1230*

___

___

___
<a id="basicobjects.presets._.autosize"></a>

####  Autosize

**Autosize**: *`object`*

*Defined in core.tsx:1203*

<a id="basicobjects.presets._.autosize.widget-5"></a>

####  widget

**● widget**: *`string`* = "Autosize"

*Defined in core.tsx:1204*

___
<a id="basicobjects.presets._.autosize.propsmap-2"></a>

####  propsMap

**propsMap**: *`object`*

*Defined in core.tsx:1205*

<a id="basicobjects.presets._.autosize.propsmap-2.placeholder"></a>

####  placeholder

**● placeholder**: *`string`* = "params/placeholder"

*Defined in core.tsx:1207*

___
<a id="basicobjects.presets._.autosize.propsmap-2.value"></a>

####  value

**● value**: *`string`* = "values/current"

*Defined in core.tsx:1206*

___

___

___
<a id="basicobjects.presets._.body"></a>

####  Body

**Body**: *`object`*

*Defined in core.tsx:1246*

<a id="basicobjects.presets._.body.classname"></a>

####  className

**● className**: *`string`* = "fform-body-block"

*Defined in core.tsx:1248*

___
<a id="basicobjects.presets._.body.widget-6"></a>

####  widget

**● widget**: *`string`* = "DivBlock"

*Defined in core.tsx:1247*

___

___
<a id="basicobjects.presets._.builder"></a>

####  Builder

**Builder**: *`object`*

*Defined in core.tsx:1232*

<a id="basicobjects.presets._.builder.widget-7"></a>

####  widget

**● widget**: *`string`* = "Builder"

*Defined in core.tsx:1233*

___
<a id="basicobjects.presets._.builder.propsmap-3"></a>

####  propsMap

**propsMap**: *`object`*

*Defined in core.tsx:1234*

<a id="basicobjects.presets._.builder.propsmap-3.hidden"></a>

####  hidden

**● hidden**: *`Object`* =  ['controls', (controls: any) => getBindedValue(controls, 'hidden')]

*Defined in core.tsx:1235*

___

___

___
<a id="basicobjects.presets._.groupblocks"></a>

####  GroupBlocks

**GroupBlocks**: *`object`*

*Defined in core.tsx:1242*

<a id="basicobjects.presets._.groupblocks.classname-1"></a>

####  className

**● className**: *`string`* = "fform-layout-block"

*Defined in core.tsx:1244*

___
<a id="basicobjects.presets._.groupblocks.widget-8"></a>

####  widget

**● widget**: *`string`* = "DivBlock"

*Defined in core.tsx:1243*

___

___
<a id="basicobjects.presets._.layouts"></a>

####  Layouts

**Layouts**: *`object`*

*Defined in core.tsx:1238*

<a id="basicobjects.presets._.layouts.classname-2"></a>

####  className

**● className**: *`string`* = "fform-group-block"

*Defined in core.tsx:1240*

___
<a id="basicobjects.presets._.layouts.widget-9"></a>

####  widget

**● widget**: *`string`* = "DivBlock"

*Defined in core.tsx:1239*

___

___
<a id="basicobjects.presets._.main"></a>

####  Main

**Main**: *`object`*

*Defined in core.tsx:1271*

<a id="basicobjects.presets._.main.refname"></a>

####  refName

**● refName**: *`string`* = "getRef"

*Defined in core.tsx:1273*

___
<a id="basicobjects.presets._.main.widget-10"></a>

####  widget

**● widget**: *`string`* = "BaseInput"

*Defined in core.tsx:1272*

___
<a id="basicobjects.presets._.main.propsmap-4"></a>

####  propsMap

**propsMap**: *`object`*

*Defined in core.tsx:1274*

<a id="basicobjects.presets._.main.propsmap-4.autofocus"></a>

####  autoFocus

**● autoFocus**: *`string`* = "params/autofocus"

*Defined in core.tsx:1276*

___
<a id="basicobjects.presets._.main.propsmap-4.disabled"></a>

####  disabled

**● disabled**: *`Object`* =  ['controls', (controls: any) => getBindedValue(controls, 'disabled')]

*Defined in core.tsx:1281*

___
<a id="basicobjects.presets._.main.propsmap-4.placeholder-1"></a>

####  placeholder

**● placeholder**: *`string`* = "params/placeholder"

*Defined in core.tsx:1277*

___
<a id="basicobjects.presets._.main.propsmap-4.readonly"></a>

####  readOnly

**● readOnly**: *`Object`* =  ['controls', (controls: any) => getBindedValue(controls, 'readonly')]

*Defined in core.tsx:1280*

___
<a id="basicobjects.presets._.main.propsmap-4.required"></a>

####  required

**● required**: *`string`* = "schemaData/required"

*Defined in core.tsx:1278*

___
<a id="basicobjects.presets._.main.propsmap-4.title"></a>

####  title

**● title**: *`string`* = "schemaData/title"

*Defined in core.tsx:1279*

___
<a id="basicobjects.presets._.main.propsmap-4.value-1"></a>

####  value

**● value**: *`string`* = "values/current"

*Defined in core.tsx:1275*

___

___

___
<a id="basicobjects.presets._.message"></a>

####  Message

**Message**: *`object`*

*Defined in core.tsx:1259*

<a id="basicobjects.presets._.message.widget-11"></a>

####  widget

**● widget**: *`string`* = "Messages"

*Defined in core.tsx:1260*

___
<a id="basicobjects.presets._.message.messageitem-1"></a>

####  messageItem

**messageItem**: *`object`*

*Defined in core.tsx:1267*

<a id="basicobjects.presets._.message.messageitem-1.widget-12"></a>

####  widget

**● widget**: *`string`* = "MessageItem"

*Defined in core.tsx:1268*

___

___
<a id="basicobjects.presets._.message.propsmap-5"></a>

####  propsMap

**propsMap**: *`object`*

*Defined in core.tsx:1261*

<a id="basicobjects.presets._.message.propsmap-5.itemsprops_0_hidden"></a>

####  itemsProps/0/hidden

**● itemsProps/0/hidden**: *`Object`* =  ['status/touched', not]

*Defined in core.tsx:1263*

___
<a id="basicobjects.presets._.message.propsmap-5.itemsprops_1_hidden"></a>

####  itemsProps/1/hidden

**● itemsProps/1/hidden**: *`Object`* =  ['status/touched', not]

*Defined in core.tsx:1264*

___
<a id="basicobjects.presets._.message.propsmap-5.itemsprops_2_hidden"></a>

####  itemsProps/2/hidden

**● itemsProps/2/hidden**: *`string`* = "status/pristine"

*Defined in core.tsx:1265*

___
<a id="basicobjects.presets._.message.propsmap-5.messages"></a>

####  messages

**● messages**: *`string`* = "messages"

*Defined in core.tsx:1262*

___

___

___
<a id="basicobjects.presets._.title-1"></a>

####  Title

**Title**: *`object`*

*Defined in core.tsx:1250*

<a id="basicobjects.presets._.title-1.requiresymbol"></a>

####  requireSymbol

**● requireSymbol**: *`string`* = "*"

*Defined in core.tsx:1253*

___
<a id="basicobjects.presets._.title-1.usetag"></a>

####  useTag

**● useTag**: *`string`* = "label"

*Defined in core.tsx:1252*

___
<a id="basicobjects.presets._.title-1.widget-13"></a>

####  widget

**● widget**: *`string`* = "Title"

*Defined in core.tsx:1251*

___
<a id="basicobjects.presets._.title-1.propsmap-6"></a>

####  propsMap

**propsMap**: *`object`*

*Defined in core.tsx:1254*

<a id="basicobjects.presets._.title-1.propsmap-6.required-1"></a>

####  required

**● required**: *`string`* = "schemaData/required"

*Defined in core.tsx:1255*

___
<a id="basicobjects.presets._.title-1.propsmap-6.title-2"></a>

####  title

**● title**: *`string`* = "schemaData/title"

*Defined in core.tsx:1256*

___

___

___
<a id="basicobjects.presets._.blocks"></a>

####  blocks

**blocks**: *`object`*

*Defined in core.tsx:1201*

<a id="basicobjects.presets._.blocks.arrayitem-2"></a>

####  ArrayItem

**● ArrayItem**: *`boolean`* = true

*Defined in core.tsx:1201*

___
<a id="basicobjects.presets._.blocks.autosize-1"></a>

####  Autosize

**● Autosize**: *`boolean`* = false

*Defined in core.tsx:1201*

___
<a id="basicobjects.presets._.blocks.body-1"></a>

####  Body

**● Body**: *`boolean`* = true

*Defined in core.tsx:1201*

___
<a id="basicobjects.presets._.blocks.builder-1"></a>

####  Builder

**● Builder**: *`boolean`* = true

*Defined in core.tsx:1201*

___
<a id="basicobjects.presets._.blocks.groupblocks-1"></a>

####  GroupBlocks

**● GroupBlocks**: *`boolean`* = true

*Defined in core.tsx:1201*

___
<a id="basicobjects.presets._.blocks.main-1"></a>

####  Main

**● Main**: *`boolean`* = true

*Defined in core.tsx:1201*

___
<a id="basicobjects.presets._.blocks.message-1"></a>

####  Message

**● Message**: *`boolean`* = true

*Defined in core.tsx:1201*

___
<a id="basicobjects.presets._.blocks.title-3"></a>

####  Title

**● Title**: *`boolean`* = true

*Defined in core.tsx:1201*

___

___

___
<a id="basicobjects.presets.array-2"></a>

####  array

**array**: *`object`*

*Defined in core.tsx:1364*

<a id="basicobjects.presets.array-2._-1"></a>

####  _

**● _**: *`string`* = "object"

*Defined in core.tsx:1365*

___
<a id="basicobjects.presets.array-2.groupblocks-2"></a>

####  GroupBlocks

**GroupBlocks**: *`object`*

*Defined in core.tsx:1368*

<a id="basicobjects.presets.array-2.groupblocks-2.usetag-1"></a>

####  useTag

**● useTag**: *`string`* = "fieldset"

*Defined in core.tsx:1368*

___

___
<a id="basicobjects.presets.array-2.main-2"></a>

####  Main

**Main**: *`object`*

*Defined in core.tsx:1367*

<a id="basicobjects.presets.array-2.main-2.propsmap-7"></a>

####  propsMap

**propsMap**: *`object`*

*Defined in core.tsx:1367*

<a id="basicobjects.presets.array-2.main-2.propsmap-7.length-1"></a>

####  length

**● length**: *`string`* = "array/lengths/current"

*Defined in core.tsx:1367*

___

___

___
<a id="basicobjects.presets.array-2.title-4"></a>

####  Title

**Title**: *`object`*

*Defined in core.tsx:1369*

<a id="basicobjects.presets.array-2.title-4.usetag-2"></a>

####  useTag

**● useTag**: *`string`* = "legend"

*Defined in core.tsx:1369*

___

___
<a id="basicobjects.presets.array-2.blocks-1"></a>

####  blocks

**blocks**: *`object`*

*Defined in core.tsx:1366*

<a id="basicobjects.presets.array-2.blocks-1.array-3"></a>

####  Array

**● Array**: *`boolean`* = true

*Defined in core.tsx:1366*

___

___

___
<a id="basicobjects.presets.arrayof"></a>

####  arrayOf

**arrayOf**: *`object`*

*Defined in core.tsx:1378*

<a id="basicobjects.presets.arrayof.main-3"></a>

####  Main

**Main**: *`object`*

*Defined in core.tsx:1379*

<a id="basicobjects.presets.arrayof.main-3.disabledclass"></a>

####  disabledClass

**● disabledClass**: *`string`* = "disabled"

*Defined in core.tsx:1384*

___
<a id="basicobjects.presets.arrayof.main-3.inputprops"></a>

####  inputProps

**● inputProps**: *`object`*

*Defined in core.tsx:1381*

#### Type declaration

___
<a id="basicobjects.presets.arrayof.main-3.labelprops"></a>

####  labelProps

**● labelProps**: *`object`*

*Defined in core.tsx:1382*

#### Type declaration

___
<a id="basicobjects.presets.arrayof.main-3.stackedprops"></a>

####  stackedProps

**● stackedProps**: *`object`*

*Defined in core.tsx:1383*

#### Type declaration

___
<a id="basicobjects.presets.arrayof.main-3.widget-14"></a>

####  widget

**● widget**: *`string`* = "ArrayInput"

*Defined in core.tsx:1380*

___

___

___
<a id="basicobjects.presets.autosize-2"></a>

####  autosize

**autosize**: *`object`*

*Defined in core.tsx:1393*

<a id="basicobjects.presets.autosize-2.groupblocks-3"></a>

####  GroupBlocks

**GroupBlocks**: *`object`*

*Defined in core.tsx:1395*

<a id="basicobjects.presets.autosize-2.groupblocks-3.style"></a>

####  style

**style**: *`object`*

*Defined in core.tsx:1395*

<a id="basicobjects.presets.autosize-2.groupblocks-3.style.flexgrow"></a>

####  flexGrow

**● flexGrow**: *`number`* = 0

*Defined in core.tsx:1395*

___

___

___
<a id="basicobjects.presets.autosize-2.blocks-2"></a>

####  blocks

**blocks**: *`object`*

*Defined in core.tsx:1394*

<a id="basicobjects.presets.autosize-2.blocks-2.autosize-3"></a>

####  Autosize

**● Autosize**: *`boolean`* = true

*Defined in core.tsx:1394*

___

___

___
<a id="basicobjects.presets.base"></a>

####  base

**base**: *`object`*

*Defined in core.tsx:1285*

<a id="basicobjects.presets.base.main-4"></a>

####  Main

**Main**: *`object`*

*Defined in core.tsx:1286*

<a id="basicobjects.presets.base.main-4.onchange-1"></a>

####  onChange

▸ **onChange**(event: *`any`*): `void`

*Defined in core.tsx:1287*

**Parameters:**

| Param | Type |
| ------ | ------ |
| event | `any` | 

**Returns:** `void`

___

___

___
<a id="basicobjects.presets.boolean-1"></a>

####  boolean

**boolean**: *`object`*

*Defined in core.tsx:1326*

<a id="basicobjects.presets.boolean-1._-2"></a>

####  _

**● _**: *`string`* = "booleanBase"

*Defined in core.tsx:1327*

___
<a id="basicobjects.presets.boolean-1.main-5"></a>

####  Main

**Main**: *`object`*

*Defined in core.tsx:1328*

<a id="basicobjects.presets.boolean-1.main-5.widget-15"></a>

####  widget

**● widget**: *`string`* = "CheckboxInput"

*Defined in core.tsx:1329*

___

___
<a id="basicobjects.presets.boolean-1.title-5"></a>

####  Title

**Title**: *`object`*

*Defined in core.tsx:1331*

<a id="basicobjects.presets.boolean-1.title-5.emptytitle"></a>

####  emptyTitle

**● emptyTitle**: *`boolean`* = true

*Defined in core.tsx:1331*

___

___

___
<a id="basicobjects.presets.booleanbase"></a>

####  booleanBase

**booleanBase**: *`object`*

*Defined in core.tsx:1320*

<a id="basicobjects.presets.booleanbase.main-6"></a>

####  Main

**Main**: *`object`*

*Defined in core.tsx:1321*

<a id="basicobjects.presets.booleanbase.main-6.type"></a>

####  type

**● type**: *`string`* = "checkbox"

*Defined in core.tsx:1322*

___
<a id="basicobjects.presets.booleanbase.main-6.onchange-2"></a>

####  onChange

▸ **onChange**(event: *`any`*): `void`

*Defined in core.tsx:1323*

**Parameters:**

| Param | Type |
| ------ | ------ |
| event | `any` | 

**Returns:** `void`

___

___

___
<a id="basicobjects.presets.buttons-1"></a>

####  buttons

**buttons**: *`object`*

*Defined in core.tsx:1388*

<a id="basicobjects.presets.buttons-1.main-7"></a>

####  Main

**Main**: *`object`*

*Defined in core.tsx:1388*

<a id="basicobjects.presets.buttons-1.main-7.inputprops-1"></a>

####  inputProps

**inputProps**: *`object`*

*Defined in core.tsx:1388*

<a id="basicobjects.presets.buttons-1.main-7.inputprops-1.classname-3"></a>

####  className

**● className**: *`string`* = "button"

*Defined in core.tsx:1388*

___

___
<a id="basicobjects.presets.buttons-1.main-7.labelprops-1"></a>

####  labelProps

**labelProps**: *`object`*

*Defined in core.tsx:1388*

<a id="basicobjects.presets.buttons-1.main-7.labelprops-1.classname-4"></a>

####  className

**● className**: *`string`* = "button"

*Defined in core.tsx:1388*

___

___

___

___
<a id="basicobjects.presets.checkboxes"></a>

####  checkboxes

**checkboxes**: *`object`*

*Defined in core.tsx:1390*

<a id="basicobjects.presets.checkboxes._-3"></a>

####  _

**● _**: *`string`* = "arrayOf"

*Defined in core.tsx:1390*

___
<a id="basicobjects.presets.checkboxes.main-8"></a>

####  Main

**Main**: *`object`*

*Defined in core.tsx:1390*

<a id="basicobjects.presets.checkboxes.main-8.type-1"></a>

####  type

**● type**: *`string`* = "checkbox"

*Defined in core.tsx:1390*

___

___
<a id="basicobjects.presets.checkboxes.fields"></a>

####  fields

**fields**: *`object`*

*Defined in core.tsx:1390*

<a id="basicobjects.presets.checkboxes.fields.array-4"></a>

####  Array

**● Array**: *`boolean`* = false

*Defined in core.tsx:1390*

___
<a id="basicobjects.presets.checkboxes.fields.layouts-1"></a>

####  Layouts

**● Layouts**: *`boolean`* = false

*Defined in core.tsx:1390*

___

___

___
<a id="basicobjects.presets.flexrow"></a>

####  flexRow

**flexRow**: *`object`*

*Defined in core.tsx:1397*

<a id="basicobjects.presets.flexrow.layouts-2"></a>

####  Layouts

**Layouts**: *`object`*

*Defined in core.tsx:1398*

<a id="basicobjects.presets.flexrow.layouts-2.style-1"></a>

####  style

**style**: *`object`*

*Defined in core.tsx:1398*

<a id="basicobjects.presets.flexrow.layouts-2.style-1.flexflow"></a>

####  flexFlow

**● flexFlow**: *`string`* = "row"

*Defined in core.tsx:1398*

___

___

___

___
<a id="basicobjects.presets.hidden-1"></a>

####  hidden

**hidden**: *`object`*

*Defined in core.tsx:1314*

<a id="basicobjects.presets.hidden-1.builder-2"></a>

####  Builder

**Builder**: *`object`*

*Defined in core.tsx:1315*

<a id="basicobjects.presets.hidden-1.builder-2.hidden-2"></a>

####  hidden

**● hidden**: *`boolean`* = true

*Defined in core.tsx:1316*

___
<a id="basicobjects.presets.hidden-1.builder-2.propsmap-8"></a>

####  propsMap

**propsMap**: *`object`*

*Defined in core.tsx:1317*

<a id="basicobjects.presets.hidden-1.builder-2.propsmap-8.hidden-3"></a>

####  hidden

**● hidden**: *`false`* = false

*Defined in core.tsx:1317*

___

___

___

___
<a id="basicobjects.presets.inlineitems"></a>

####  inlineItems

**inlineItems**: *`object`*

*Defined in core.tsx:1387*

<a id="basicobjects.presets.inlineitems.main-9"></a>

####  Main

**Main**: *`object`*

*Defined in core.tsx:1387*

<a id="basicobjects.presets.inlineitems.main-9.stackedprops-1"></a>

####  stackedProps

**● stackedProps**: *`boolean`* = false

*Defined in core.tsx:1387*

___

___

___
<a id="basicobjects.presets.inlinetitle"></a>

####  inlineTitle

**inlineTitle**: *`object`*

*Defined in core.tsx:1371*

<a id="basicobjects.presets.inlinetitle.groupblocks-4"></a>

####  GroupBlocks

**GroupBlocks**: *`object`*

*Defined in core.tsx:1372*

<a id="basicobjects.presets.inlinetitle.groupblocks-4.style-2"></a>

####  style

**style**: *`object`*

*Defined in core.tsx:1373*

<a id="basicobjects.presets.inlinetitle.groupblocks-4.style-2.flexflow-1"></a>

####  flexFlow

**● flexFlow**: *`string`* = "row"

*Defined in core.tsx:1373*

___

___

___

___
<a id="basicobjects.presets.integer-1"></a>

####  integer

**integer**: *`object`*

*Defined in core.tsx:1293*

<a id="basicobjects.presets.integer-1._-4"></a>

####  _

**● _**: *`string`* = "base"

*Defined in core.tsx:1294*

___
<a id="basicobjects.presets.integer-1.main-10"></a>

####  Main

**Main**: *`object`*

*Defined in core.tsx:1295*

<a id="basicobjects.presets.integer-1.main-10.type-2"></a>

####  type

**● type**: *`string`* = "number"

*Defined in core.tsx:1296*

___
<a id="basicobjects.presets.integer-1.main-10._onchange"></a>

####  $onChange

▸ **$onChange**(val: *`string`*): `void`

*Defined in core.tsx:1297*

**Parameters:**

| Param | Type |
| ------ | ------ |
| val | `string` | 

**Returns:** `void`

___

___

___
<a id="basicobjects.presets.multiselect"></a>

####  multiselect

**multiselect**: *`object`*

*Defined in core.tsx:1377*

<a id="basicobjects.presets.multiselect._-5"></a>

####  _

**● _**: *`string`* = "select"

*Defined in core.tsx:1377*

___
<a id="basicobjects.presets.multiselect.main-11"></a>

####  Main

**Main**: *`object`*

*Defined in core.tsx:1377*

<a id="basicobjects.presets.multiselect.main-11.multiply"></a>

####  multiply

**● multiply**: *`boolean`* = true

*Defined in core.tsx:1377*

___

___

___
<a id="basicobjects.presets.noarraybuttons"></a>

####  noArrayButtons

**noArrayButtons**: *`object`*

*Defined in core.tsx:1403*

<a id="basicobjects.presets.noarraybuttons.blocks-3"></a>

####  blocks

**blocks**: *`object`*

*Defined in core.tsx:1404*

<a id="basicobjects.presets.noarraybuttons.blocks-3.array-5"></a>

####  Array

**● Array**: *`boolean`* = false

*Defined in core.tsx:1404*

___

___

___
<a id="basicobjects.presets.noarrayitembuttons"></a>

####  noArrayItemButtons

**noArrayItemButtons**: *`object`*

*Defined in core.tsx:1400*

<a id="basicobjects.presets.noarrayitembuttons.blocks-4"></a>

####  blocks

**blocks**: *`object`*

*Defined in core.tsx:1401*

<a id="basicobjects.presets.noarrayitembuttons.blocks-4.arrayitem-3"></a>

####  ArrayItem

**● ArrayItem**: *`boolean`* = false

*Defined in core.tsx:1401*

___

___

___
<a id="basicobjects.presets.null"></a>

####  null

**null**: *`object`*

*Defined in core.tsx:1313*

<a id="basicobjects.presets.null.main-12"></a>

####  Main

**Main**: *`object`*

*Defined in core.tsx:1313*

<a id="basicobjects.presets.null.main-12.type-3"></a>

####  type

**● type**: *`string`* = "hidden"

*Defined in core.tsx:1313*

___

___

___
<a id="basicobjects.presets.number-1"></a>

####  number

**number**: *`object`*

*Defined in core.tsx:1302*

<a id="basicobjects.presets.number-1._-6"></a>

####  _

**● _**: *`string`* = "base"

*Defined in core.tsx:1303*

___
<a id="basicobjects.presets.number-1.main-13"></a>

####  Main

**Main**: *`object`*

*Defined in core.tsx:1304*

<a id="basicobjects.presets.number-1.main-13.step"></a>

####  step

**● step**: *`string`* = "any"

*Defined in core.tsx:1306*

___
<a id="basicobjects.presets.number-1.main-13.type-4"></a>

####  type

**● type**: *`string`* = "number"

*Defined in core.tsx:1305*

___
<a id="basicobjects.presets.number-1.main-13._onchange-1"></a>

####  $onChange

▸ **$onChange**(val: *`string`*): `void`

*Defined in core.tsx:1307*

**Parameters:**

| Param | Type |
| ------ | ------ |
| val | `string` | 

**Returns:** `void`

___

___

___
<a id="basicobjects.presets.object"></a>

####  object

**object**: *`object`*

*Defined in core.tsx:1346*

<a id="basicobjects.presets.object.groupblocks-5"></a>

####  GroupBlocks

**GroupBlocks**: *`object`*

*Defined in core.tsx:1361*

<a id="basicobjects.presets.object.groupblocks-5.usetag-3"></a>

####  useTag

**● useTag**: *`string`* = "fieldset"

*Defined in core.tsx:1361*

___

___
<a id="basicobjects.presets.object.main-14"></a>

####  Main

**Main**: *`object`*

*Defined in core.tsx:1348*

<a id="basicobjects.presets.object.main-14.refname-1"></a>

####  refName

**● refName**: *`string`* = "ref"

*Defined in core.tsx:1350*

___
<a id="basicobjects.presets.object.main-14.widget-16"></a>

####  widget

**● widget**: *`string`* = "Section"

*Defined in core.tsx:1349*

___
<a id="basicobjects.presets.object.main-14.propsmap-9"></a>

####  propsMap

**propsMap**: *`object`*

*Defined in core.tsx:1351*

<a id="basicobjects.presets.object.main-14.propsmap-9.autofocus-1"></a>

####  autoFocus

**● autoFocus**: *`false`* = false

*Defined in core.tsx:1353*

___
<a id="basicobjects.presets.object.main-14.propsmap-9.disabled-1"></a>

####  disabled

**● disabled**: *`false`* = false

*Defined in core.tsx:1358*

___
<a id="basicobjects.presets.object.main-14.propsmap-9.placeholder-2"></a>

####  placeholder

**● placeholder**: *`false`* = false

*Defined in core.tsx:1354*

___
<a id="basicobjects.presets.object.main-14.propsmap-9.readonly-1"></a>

####  readOnly

**● readOnly**: *`false`* = false

*Defined in core.tsx:1357*

___
<a id="basicobjects.presets.object.main-14.propsmap-9.required-2"></a>

####  required

**● required**: *`false`* = false

*Defined in core.tsx:1355*

___
<a id="basicobjects.presets.object.main-14.propsmap-9.title-6"></a>

####  title

**● title**: *`false`* = false

*Defined in core.tsx:1356*

___
<a id="basicobjects.presets.object.main-14.propsmap-9.value-2"></a>

####  value

**● value**: *`false`* = false

*Defined in core.tsx:1352*

___

___

___
<a id="basicobjects.presets.object.title-7"></a>

####  Title

**Title**: *`object`*

*Defined in core.tsx:1362*

<a id="basicobjects.presets.object.title-7.usetag-4"></a>

####  useTag

**● useTag**: *`string`* = "legend"

*Defined in core.tsx:1362*

___

___
<a id="basicobjects.presets.object.blocks-5"></a>

####  blocks

**blocks**: *`object`*

*Defined in core.tsx:1347*

<a id="basicobjects.presets.object.blocks-5.layouts-3"></a>

####  Layouts

**● Layouts**: *`boolean`* = true

*Defined in core.tsx:1347*

___

___

___
<a id="basicobjects.presets.radio"></a>

####  radio

**radio**: *`object`*

*Defined in core.tsx:1389*

<a id="basicobjects.presets.radio._-7"></a>

####  _

**● _**: *`string`* = "arrayOf"

*Defined in core.tsx:1389*

___
<a id="basicobjects.presets.radio.main-15"></a>

####  Main

**Main**: *`object`*

*Defined in core.tsx:1389*

<a id="basicobjects.presets.radio.main-15.type-5"></a>

####  type

**● type**: *`string`* = "radio"

*Defined in core.tsx:1389*

___

___

___
<a id="basicobjects.presets.range"></a>

####  range

**range**: *`object`*

*Defined in core.tsx:1312*

<a id="basicobjects.presets.range._-8"></a>

####  _

**● _**: *`string`* = "base"

*Defined in core.tsx:1312*

___
<a id="basicobjects.presets.range.main-16"></a>

####  Main

**Main**: *`object`*

*Defined in core.tsx:1312*

<a id="basicobjects.presets.range.main-16.type-6"></a>

####  type

**● type**: *`string`* = "range"

*Defined in core.tsx:1312*

___

___

___
<a id="basicobjects.presets.select"></a>

####  select

**select**: *`object`*

*Defined in core.tsx:1376*

<a id="basicobjects.presets.select.main-17"></a>

####  Main

**Main**: *`object`*

*Defined in core.tsx:1376*

<a id="basicobjects.presets.select.main-17.onchange-3"></a>

####  onChange

**● onChange**: *[onSelectChange](_core_.md#onselectchange)* =  onSelectChange

*Defined in core.tsx:1376*

___
<a id="basicobjects.presets.select.main-17.type-7"></a>

####  type

**● type**: *`string`* = "select"

*Defined in core.tsx:1376*

___

___

___
<a id="basicobjects.presets.string-1"></a>

####  string

**string**: *`object`*

*Defined in core.tsx:1292*

<a id="basicobjects.presets.string-1._-9"></a>

####  _

**● _**: *`string`* = "base"

*Defined in core.tsx:1292*

___
<a id="basicobjects.presets.string-1.main-18"></a>

####  Main

**Main**: *`object`*

*Defined in core.tsx:1292*

<a id="basicobjects.presets.string-1.main-18.type-8"></a>

####  type

**● type**: *`string`* = "text"

*Defined in core.tsx:1292*

___

___

___
<a id="basicobjects.presets.tristate"></a>

####  tristate

**tristate**: *`object`*

*Defined in core.tsx:1339*

<a id="basicobjects.presets.tristate._-10"></a>

####  _

**● _**: *`string`* = "tristateBase"

*Defined in core.tsx:1340*

___
<a id="basicobjects.presets.tristate.main-19"></a>

####  Main

**Main**: *`object`*

*Defined in core.tsx:1341*

<a id="basicobjects.presets.tristate.main-19.widget-17"></a>

####  widget

**● widget**: *`string`* = "CheckboxInput"

*Defined in core.tsx:1342*

___

___
<a id="basicobjects.presets.tristate.title-8"></a>

####  Title

**Title**: *`object`*

*Defined in core.tsx:1344*

<a id="basicobjects.presets.tristate.title-8.emptytitle-1"></a>

####  emptyTitle

**● emptyTitle**: *`boolean`* = true

*Defined in core.tsx:1344*

___

___

___
<a id="basicobjects.presets.tristatebase"></a>

####  tristateBase

**tristateBase**: *`object`*

*Defined in core.tsx:1333*

<a id="basicobjects.presets.tristatebase.main-20"></a>

####  Main

**Main**: *`object`*

*Defined in core.tsx:1334*

<a id="basicobjects.presets.tristatebase.main-20.type-9"></a>

####  type

**● type**: *`string`* = "tristate"

*Defined in core.tsx:1335*

___
<a id="basicobjects.presets.tristatebase.main-20.usetag-5"></a>

####  useTag

**● useTag**: *[TristateBox](_core_.md#tristatebox)* =  TristateBox

*Defined in core.tsx:1336*

___

___

___

___
<a id="basicobjects.presetscombineafter"></a>

####  presetsCombineAfter

**presetsCombineAfter**: *`object`*

*Defined in core.tsx:1414*

<a id="basicobjects.presetscombineafter.checkboxes-1"></a>

####  checkboxes

**● checkboxes**: *`string`[]* =  ['inlineItems', 'buttons']

*Defined in core.tsx:1416*

___
<a id="basicobjects.presetscombineafter.email"></a>

####  email

**● email**: *`string`[]* =  ['autosize']

*Defined in core.tsx:1420*

___
<a id="basicobjects.presetscombineafter.hostname"></a>

####  hostname

**● hostname**: *`string`[]* =  ['autosize']

*Defined in core.tsx:1422*

___
<a id="basicobjects.presetscombineafter.integer-2"></a>

####  integer

**● integer**: *`string`[]* =  ['autosize']

*Defined in core.tsx:1419*

___
<a id="basicobjects.presetscombineafter.number-2"></a>

####  number

**● number**: *`string`[]* =  ['autosize']

*Defined in core.tsx:1418*

___
<a id="basicobjects.presetscombineafter.password"></a>

####  password

**● password**: *`string`[]* =  ['autosize']

*Defined in core.tsx:1421*

___
<a id="basicobjects.presetscombineafter.radio-1"></a>

####  radio

**● radio**: *`string`[]* =  ['inlineItems', 'buttons']

*Defined in core.tsx:1415*

___
<a id="basicobjects.presetscombineafter.string-2"></a>

####  string

**● string**: *`string`[]* =  ['autosize']

*Defined in core.tsx:1417*

___
<a id="basicobjects.presetscombineafter.uri"></a>

####  uri

**● uri**: *`string`[]* =  ['autosize']

*Defined in core.tsx:1423*

___

___
<a id="basicobjects.presetscombinebefore"></a>

####  presetsCombineBefore

**presetsCombineBefore**: *`object`*

*Defined in core.tsx:1425*

<a id="basicobjects.presetscombinebefore.checkboxes-2"></a>

####  checkboxes

**● checkboxes**: *`string`[]* =  ['selector', 'tabs']

*Defined in core.tsx:1427*

___
<a id="basicobjects.presetscombinebefore.radio-2"></a>

####  radio

**● radio**: *`string`[]* =  ['selector', 'tabs']

*Defined in core.tsx:1426*

___
<a id="basicobjects.presetscombinebefore.select-1"></a>

####  select

**● select**: *`string`[]* =  ['selector', 'tabs']

*Defined in core.tsx:1428*

___

___
<a id="basicobjects.widgets"></a>

####  widgets

**widgets**: *`object`*

*Defined in core.tsx:1181*

<a id="basicobjects.widgets.addbutton-1"></a>

####  AddButton

**● AddButton**: *[AddButtonBlock](_core_.md#addbuttonblock)* =  AddButtonBlock

*Defined in core.tsx:1187*

___
<a id="basicobjects.widgets.array-6"></a>

####  Array

**● Array**: *[ArrayBlock](_core_.md#arrayblock)* =  ArrayBlock

*Defined in core.tsx:1184*

___
<a id="basicobjects.widgets.arrayinput-1"></a>

####  ArrayInput

**● ArrayInput**: *[ArrayInput](_core_.md#arrayinput)* =  ArrayInput

*Defined in core.tsx:1194*

___
<a id="basicobjects.widgets.arrayitem-4"></a>

####  ArrayItem

**● ArrayItem**: *[ArrayItem](_core_.md#arrayitem)* =  ArrayItem

*Defined in core.tsx:1185*

___
<a id="basicobjects.widgets.autosize-4"></a>

####  Autosize

**● Autosize**: *[AutosizeBlock](../classes/_core_.autosizeblock.md)* =  AutosizeBlock

*Defined in core.tsx:1197*

___
<a id="basicobjects.widgets.baseinput-1"></a>

####  BaseInput

**● BaseInput**: *[BaseInput](_core_.md#baseinput)* =  BaseInput

*Defined in core.tsx:1192*

___
<a id="basicobjects.widgets.builder-3"></a>

####  Builder

**● Builder**: *[DefaultBuilder](_core_.md#defaultbuilder)* =  DefaultBuilder

*Defined in core.tsx:1183*

___
<a id="basicobjects.widgets.checkboxinput-1"></a>

####  CheckboxInput

**● CheckboxInput**: *[CheckboxInput](_core_.md#checkboxinput)* =  CheckboxInput

*Defined in core.tsx:1193*

___
<a id="basicobjects.widgets.divblock-1"></a>

####  DivBlock

**● DivBlock**: *[DivBlock](_core_.md#divblock)* =  DivBlock

*Defined in core.tsx:1196*

___
<a id="basicobjects.widgets.emptyarray-1"></a>

####  EmptyArray

**● EmptyArray**: *[EmptyArray](_core_.md#emptyarray)* =  EmptyArray

*Defined in core.tsx:1186*

___
<a id="basicobjects.widgets.itemmenu-2"></a>

####  ItemMenu

**● ItemMenu**: *[ItemMenu](_core_.md#itemmenu)* =  ItemMenu

*Defined in core.tsx:1188*

___
<a id="basicobjects.widgets.messageitem-2"></a>

####  MessageItem

**● MessageItem**: *[MessageItem](_core_.md#messageitem)* =  MessageItem

*Defined in core.tsx:1191*

___
<a id="basicobjects.widgets.messages-1"></a>

####  Messages

**● Messages**: *[MessageBlock](_core_.md#messageblock)* =  MessageBlock

*Defined in core.tsx:1190*

___
<a id="basicobjects.widgets.section-1"></a>

####  Section

**● Section**: *[Section](../classes/_core_.section.md)* =  Section

*Defined in core.tsx:1195*

___
<a id="basicobjects.widgets.title-9"></a>

####  Title

**● Title**: *[TitleBlock](_core_.md#titleblock)* =  TitleBlock

*Defined in core.tsx:1189*

___

___

___
<a id="buttonobject"></a>

### `<Const>` buttonObject

**buttonObject**: *`object`*

*Defined in core.tsx:1433*

<a id="buttonobject.widget-18"></a>

####  widget

▸ **widget**(props: *`any`*): `Element`

*Defined in core.tsx:1434*

**Parameters:**

| Param | Type |
| ------ | ------ |
| props | `any` | 

**Returns:** `Element`

___

___
<a id="sizerstyle"></a>

### `<Const>` sizerStyle

**sizerStyle**: *`object`*

*Defined in core.tsx:844*

<a id="sizerstyle.height"></a>

####  height

**● height**: *`number`* = 0

*Defined in core.tsx:844*

___
<a id="sizerstyle.left"></a>

####  left

**● left**: *`number`* = 0

*Defined in core.tsx:844*

___
<a id="sizerstyle.overflow"></a>

####  overflow

**● overflow**: *`string`* = "scroll"

*Defined in core.tsx:844*

___
<a id="sizerstyle.position"></a>

####  position

**● position**: *`string`* = "absolute"

*Defined in core.tsx:844*

___
<a id="sizerstyle.top"></a>

####  top

**● top**: *`number`* = 0

*Defined in core.tsx:844*

___
<a id="sizerstyle.visibility"></a>

####  visibility

**● visibility**: *`string`* = "hidden"

*Defined in core.tsx:844*

___
<a id="sizerstyle.whitespace"></a>

####  whiteSpace

**● whiteSpace**: *`string`* = "pre"

*Defined in core.tsx:844*

___

___

