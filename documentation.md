

# Documentation



- [FFStateApi](#ffstateapi)
- [FForm](#fform)
- [Basic schema properties](#basic-schema-properties)
- [Extended schema properties](#extended-schema-properties)
- [fformObjects](#fformobjects)
- [Validation](#validation)
- [Styling](#styling)
- [Customization](#customization)
- [SSR](#ssr)


##FFStateApi
-   `schema` - schema that will be used to create state
-   `name?: string` - name that will be used to access data in redux storage and for fields naming
-   `objects?` - fformObjects, that contains all nessary for  components creation
-   `store?:any` - redux store. [FForm](#fform) can take store from context
-   `getState?: () => any` - external state setter
-   `setState?: (state: any) => void` - external state getter


##FForm
- `core` - instance of FFStateApi or object with [FFStateApi props](#ffstateapi) 
- `state?: any` - state of FFStateApi
- `value?: any` - form's current value
- `inital?: any` - form's inital value
- `fieldCache?: boolean | number` - caching delay on updating form's value. Used for optimization purposes.
- `useTag?: string | Function` - html tag. Default 'form' 
- `parent?: any` - parent for form;
- `onSubmit?: (value: any, fform?: any) => boolean` -
- `onChange?: (value: any, fform?: any) => void` -
- `onStateChange?: (state: any, fform?: any) => void` -


##Basic schema properties
`$ref?: string`
  // Schema Metadata
  /* This is important because it tells refs where the root of the document is located*/
  id?: string;
  /* It is recommended that the meta-schema is included in the root of any JSON Schema*/
  $schema?: T;
  /* Title of the schema*/
  title?: string;
  /* Schema description*/
  description?: string;
  /* Default json for the object represented by this schema*/
  'default'?: any;

  // Number Validation
  /* The value must be a multiple of the number (e.g. 10 is a multiple of 5)*/
  multipleOf?: number;
  maximum?: number;
  /* If true maximum must be > value, >= otherwise*/
  exclusiveMaximum?: boolean;
  minimum?: number;
  /* If true minimum must be < value, <= otherwise*/
  exclusiveMinimum?: boolean;

  // String Validation
  maxLength?: number;
  minLength?: number;
  /* This is a regex string that the value must conform to*/
  pattern?: string;

  // Array Validation
  additionalItems?: boolean | T;
  items?: T | T[];
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;

  // Object Validation
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  additionalProperties?: boolean | T;
  /* Holds simple JSON Schema definitions for  referencing from elsewhere.*/
  definitions?: { [key: string]: T; }
  /* The keys that can exist on the object with the  json schema that should validate their value*/
  properties?: { [property: string]: T };
  /* The key of this object is a regex for which properties the schema applies to*/
  patternProperties?: { [pattern: string]: T };
  /* If the key is present as a property then the string of properties must also be present. If the value is a JSON Schema then it must 
   * also be valid for the object if the key is  present.*/
  dependencies?: { [key: string]: T | string[] };

  // The basic type of this schema, can be one of * [string, number, object, array, boolean, null] * or an array of the acceptable types*/
  type?: JsonSchemaTypes | JsonSchemaTypes[];
  // Enumerates the values that this schema can be  e.g. {"type": "string",   "enum": ["red", "green", "blue"]}
  'enum'?: any[];
  // Combining Schemas
  allOf?: T[];
  anyOf?: T[];
  oneOf?: T[];
  // The entity being validated must not match this schema
  not?: T;

##Extended schema properties

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
- `ff_custom?: FFCustomizeType`- component [customization](#customization)
- `ff_layout?: FFLayoutCustomizeType` - fields order and object/group extenion
- `ff_validators?: string[]`- sync/async validators as array of refs to [fformObjects](#fformobjects)
- `ff_dataMap?: [string, string, string][]`- mapping values in state

##fformObjects
Each field in form receive a set of objects that is parts of fformObjects (due to 'ff_presets' and 'ff_custom') that merges into one object. Then all functions that field finds in merged object binds to it during render. Exception is the props that starts with underscore.

####"magic" props
- `^/` - string value that begins with "^/" determines that the value is the reference and it will be resolved respectively
- `_` - underscore at the property name beginig prevent it from deep processing (makes only resolving if string value starts with "^/")
- `_%widget` - HTML tag or function that will we used as react.element
- `_$cx` - classnames processor, reference to '^/_$cx'
- `$_ref` - reference starts with '^' path separated by '/', multi-refs separated by ':', <details><summary>example</summary> `{$_ref:'^/sets/base:^/sets/boolean'}`</details>
- `$_reactRef` - creates reference to element with default name if true, if value is string then it is used as name 
- `$_maps` - mapping data from state to element
- `$_parse` - process value when passing it from element to state
- `$_fields` - layout that determines field's order and add additional elements and sub-layouts
- `anyName.bind` - binds value to function with name 'anyName'

####structure
- `extend` - extends fformObjects with passed object
- `widgets` - contains react.elements that is used in form components
- `sets` - component presets for commonly used schemas
- `fn` - function tha is used in $_maps/$_parse processing 
- `on` - methotds tha used in event processing
- `parts` - commonly used parts of components
- `_$cx` - simple classnames processor based on [classnames](https://github.com/JedWatson/classnames) with little modification <details><summary>explanation</summary> object property name added only if value is strict "true" (trusty is classnames), otherwise if value is trusty but not true it process recursively</details>

##Validation


##Styling


##Customization


##SSR