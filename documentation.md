

# Documentation

[TOC]



##FForm
- `core` - instance of FFStateApi or object with [FFStateApi props](#ffstateapi) 
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



##FFStateApi
On creation pass to constructor object as first argument with following props:
-   `schema` - schema that will be used to create state
-   `name?: string` - name that will be used to access data in redux storage and for fields naming
-   `objects?` - [fformObjects](#fformobjects), that contains all nessary for  components creation
-   `JSONValidator?` - JSON schema validator for [JSON validation](#json-validation)
-   `store?:any` - redux store. [FForm](#fform) can take store from context
-   `getState?: () => any` - external state setter
-   `setState?: (state: any) => void` - external state getter

After creation FFStateApi can be manipulated throught [API methods](#api)

##API
#####set
#####get
#####setValue
#####getValue
#####getDefaultValue
#####clear
#####reset
#####validate
#####arrayAdd
#####arrayItemOps
#####setHidden
#####showOnly
#####getSchemaPart
#####getActive
#####execute


##Basic schema properties
- `$ref?: string`
-  `type?: JsonSchemaTypes | JsonSchemaTypes[]` - The basic type of this schema, can be one of * [string, number, object, array, boolean, null] * or an array of the acceptable types
-  `enum?: any[]` - Enumerates the values that this schema can be  e.g. {"type": "string",   "enum": ["red", "green", "blue"]}
-  `definitions?: { [key: string]: JSONschema }` - Holds simple JSON Schema definitions for  referencing from elsewhere.
#####Meta data
- `id?: string` - This is important because it tells refs where the root of the document is located
- `$schema?: JSONschema;` - It is recommended that the meta-schema is included in the root of any JSON Schema
- `title?: string` - Title of the schema
- `description?: string` - Schema description
- `default?: any` - Default json for the object represented by this schema
#####Number Validation
-  `multipleOf?: number` - The value must be a multiple of the number (e.g. 10 is a multiple of 5)
-  `maximum?: number` - maximum value
-  `exclusiveMaximum?: boolean` - If true maximum must be > value, >= otherwise
-  `minimum?: number `- minimum value
-  `exclusiveMinimum?: boolean` - If true minimum must be < value, <= otherwise
#####String Validation
-  `maxLength?: number`
-  `minLength?: number`
-  `pattern?: string `- This is a regex string that the value must conform to
#####Array Validation
-  `additionalItems?: boolean | JSONschema`
-  `items?: JSONschema | JSONschema[]`
-  `maxItems?: number`
-  `minItems?: number`
-  `uniqueItems?: boolean`
#####Object Validation
-  `maxProperties?: number`
-  `minProperties?: number`
-  `required?: string[] | boolean`
-  `additionalProperties?: boolean | JSONschema`
-  `properties?: { [property: string]: JSONschema }` - The keys that can exist on the object with the  json schema that should validate their value
-  `patternProperties?: { [pattern: string]: T }` - The key of this object is a regex for which properties the schema applies to
-  `dependencies?: { [key: string]: T | string[] }` - If the key is present as a property then the string of properties must also be present. If the value is a JSON Schema then it must. Also be valid for the object if the key is  present.
#####Combining Schemas
-  `allOf?: JSONschema[]` - used for merging schemas
-  `anyOf?: JSONschema[]` - only for validation
-  `oneOf?: JSONschema[]` - used for switching schemas
-  `not?: JSONschema` - The entity being validated must not match this schema

##Extended schema properties
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
- `ff_custom?: FFCustomizeType`- component [customization](#customization)
- `ff_layout?: FFLayoutCustomizeType` - fields, objects, groups in [object/turple layout](#object-layout)

##fformObjects
Each field in form receive a set of objects that is parts of fformObjects (due to 'ff_presets' and 'ff_custom') that merges into one object. Then all functions that field finds in merged object binds to it during render. Exception is the props that starts with underscore.

####magic props
- `^/`<a name="object-refs"></a> - string value that begins with "^/" determines that the value is the reference and it will be resolved respectively
- `_` - property name that starts with underscore prevent it value from deep processing (makes only resolving if string value starts with "^/")
- `_%widget: string | Function` - HTML tag or function that will we used as react.element
- `_$cx: Function` - classnames processor, reference to '^/_$cx'
- `$_ref: string` - reference starts with '^' path separated by '/', multi-refs separated by ':', <details><summary>example</summary> `{$_ref:'^/sets/base:^/sets/boolean'}`</details>
- `$_reactRef: boolean | string` - creates reference to element with default name if true, if value is string then it is used as name 
- `$_maps` - mapping data from state to element
- `$_parse` - process value when passing it from element to state
- `$_fields` - layout that determines field's order and add additional elements and sub-layouts
- `anyName.bind: any[]` - binds value to function with name 'anyName'

####structure
- `extend` - extends fformObjects with passed object
- `widgets` - contains react.elements that is used in form components
- `sets` - component presets for commonly used schemas
- `fn` - function tha is used in $_maps/$_parse processing 
- `on` - methotds tha used in event processing
- `parts` - commonly used parts of components
- `_$cx` - simple classnames processor based on [classnames](https://github.com/JedWatson/classnames) with little modification <details><summary>explanation</summary> object property name added only if value is strict "true" (trusty is classnames), otherwise if value is trusty but not true it process recursively</details>

##Validation
####JSON validation
For JSON validation used [is-my-json-valid](#https://github.com/mafintosh/is-my-json-valid) with modifications for smaller (3 times) bundle size. It is placed in `addons/is-my-json-valid-lite`. Pass it as `JSONValidator` property for [FFStateApi](#ffstateapi). Default group for JSON validation is 0.
####Sync validation
Custom function that receive value as first parameter and should return string or object in the following format (or array of strings or objects):
-  `group?: number` - group that replaces on each validation call. By default 0 - used for JSON validation, 1 - for sync validation, 2 - for async validation.
-  `text: string | string[]` - message(s) that should be displayed
-  `priority?: number` - Default value 0. If field has at least one message with priority 0 it means that validation failed. Any priority greater that 0 doesn't affect validation status (used for warning, info, success etc). 
-  `path?: string` - path to another field for which you want to set message.
-  `{[key: string]: any}` - result may have any other props (such as className or style). It will be added to div layer for that priority on render.


####Async validation
If function return promise then on resolve its result will be processed as for sync function (with default group equal 2)


##Customization
Each field build from following blocks: 
- `Wrapper` - wrapps all and add array item controls when field is array element
- `Title` - shows title property fromschema, and provide array add/del buttons when field is array
- `Body` - contains Main and Messages to align then together
- `Main` - in this block input element is placed
- `Messages` - element that shows messages (error, warnigns, info etc)

In `ff_custom` schema property you can add/overwrite any proprerty of any block. It supports [fformObjects "magic" props](#magic-props). It merges with `ff_presets` refs on field build. More details in examples.

##Object layout
`ff_layout` can be object or array of strings | objects. String is the name of field and it determines the order in which fields will be placed. Object supports [fformObjects "magic" props](#magic-props) with `$_fields` property and can be customized freely. More details in examples.

##Styling
FForm using classnames processor based on [classnames/bind](https://github.com/JedWatson/classnames) and can be binded class name replacement.
Classes that are used in [fformObjects](#fformobjects):
`hidden`
`priority_1`
`inline`
`required`

All classes that can be apllied to every block and set in [fformObjects](#fformobjects) placed in `sample/style.json` 

##SSR

In progress. Will be in `addon/ssr.ts`