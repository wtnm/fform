

# Documentation

[TOC]


##FFStateApi
-   `schema` - schema that will be used to create state
-   `name?: string` - name that will be used to access data in redux storage and for fields naming
-   `objects?` - [fformObjects](#fformobjects), that contains all nessary for  components creation
-   `JSONValidator?` - JSON schema validator for [JSON validation](#json-validation)
-   `store?:any` - redux store. [FForm](#fform) can take store from context
-   `getState?: () => any` - external state setter
-   `setState?: (state: any) => void` - external state getter


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
- `ff_validators?: string[]`- [sync/async validators](#validation) as array of [refs to fformObjects](#object-refs)
- `ff_dataMap?: [string, string, string][]`- [maps data in state](#state-data-mapping)
- `ff_custom?: FFCustomizeType`- component [customization](#customization)
- `ff_layout?: FFLayoutCustomizeType` - fields, objects, groups in [object/turple layout](#object-layout)

##fformObjects
Each field in form receive a set of objects that is parts of fformObjects (due to 'ff_presets' and 'ff_custom') that merges into one object. Then all functions that field finds in merged object binds to it during render. Exception is the props that starts with underscore.

####"magic" props
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
####Sync validation
####Async validation


##State data mapping


##Customization


##Object layout


##Styling


##SSR