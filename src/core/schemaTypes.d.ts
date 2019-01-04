//type jsJsonSchema = BasicJsonSchema & FFExtensionType;

// interface jsJsonSchema extends FFCompiledExtensionType, BasicJsonSchema {}

interface JsonSchemaGeneric<T> {
  $ref?: string;
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
  'enumNames'?: any[];
  // Combining Schemas
  allOf?: T[];
  anyOf?: T[];
  oneOf?: T[];
  // The entity being validated must not match this schema
  not?: T;
}

type JsonSchemaTypes = 'string' | 'number' | 'object' | 'array' | 'boolean' | 'null';

interface jsJsonSchema extends JsonSchemaGeneric<jsJsonSchema>, FFCommonSchemaType {
  ff_validators?: Function[]; // sync/async validators
  ff_dataMap?: FFDataMapGeneric<MapFunctionType>[]; // mapping values in state
  ff_fields?: FFieldsGeneric<jsFFCustomizeType>; // fields order and object/group extenion
  ff_preset?: string; // presets for rendering components
  ff_custom?: jsFFCustomizeType; // components customization
}

interface JsonSchema extends JsonSchemaGeneric<JsonSchema>, FFCommonSchemaType {
  ff_validators?: string[]; // sync/async validators
  ff_dataMap?: FFDataMapGeneric<string>; // mapping values in state
  ff_fields?: FFieldsGeneric<FFCustomizeType>; // fields order and object/group extenion
  ff_preset?: string; // presets for rendering components
  ff_custom?: FFCustomizeType; // components customization
}

interface FFCommonSchemaType {
  ff_placeholder?: string;
  ff_params?: FFParamsType; // editable in state params
  ff_props?: FFPropsType; // not editable in state params
  ff_data?: { [key: string]: any } | { [key: number]: any };
}

type FFDataMapGeneric<FN> = [string, string, FN] | [string, string]

type PropsMapGeneric<FN> = { [key: string]: false | string | [string, FN] }

type FFieldsGeneric<T> = Array<string | FFGroupGeneric<T>>;

type FFGroupGeneric<T> = T & {
  _fields?: FFieldsGeneric<T>,
  _pFField?: true | string
}

interface FFCustomizeType {
  _widget?: string,
  _propsMap?: PropsMapGeneric<string>;
  $ref?: string;

  [key: string]: string | object | undefined;
}

interface jsFFCustomizeType {
  _widget?: string | Function,
  _propsMap?: PropsMapGeneric<MapFunctionType>;
  $ref?: string;

  [key: string]: any;
}

interface FFPropsType {
  flatten?: boolean | string; // prefix if string
  managed?: boolean;
  keyField?: string,
}

type FFParamsType = {
  liveValidate?: boolean;
  autofocus?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  norender?: boolean;
}
