declare type mixed = string | number | boolean | null | {}
declare type Path = Array<string | number | symbol | any>;  // [Path, Path, any] | [Path, any]
declare type PathItem = { path: Path, keyPath?: Path, fullPath?: Path };
declare type UpdateItem = PathItem & { value: any, opts?: MergeStateOptionsArgument };
declare type MapValuesItem = { from: PathItem, to: PathItem, fn: any };

declare type PathSlice = Array<string | number | any | Array<string | number | any>>;
declare type MessageData = Array<MessageLevelType | string> | MessageLevelType | string;

type MessageLevelType = {
  level: number;
  text: string;
  replace?: number;
  path?: Path;
  hidden?: boolean;
  hiddenBind?: boolean;
  type?: 'danger' | 'warning' | 'success' | 'info' | 'notice';
}


interface BasicData {
  path: Path;
  name: string;
  schema: JsonSchema;
  color?: 'danger' | 'warning' | 'success' | '';
  schemaPart: JsonSchema;
  arrayItem?: {
    canUp?: boolean;
    canDown?: boolean;
    canDel?: boolean;
  }
  status: {
    valid: boolean;  // true if ALL children true, null if ANY children null, otherwise false
    pristine: boolean;  // true if ALL children true
    touched: boolean; // true if ALL children true
    pending: boolean; // false if ALL children false
  }
  messages?: { [key: number]: MessagesDataType };
  funcs?: {
    parse?(this: FieldData): (val: mixed, name: string) => mixed;
    format?(this: FieldData): (val: mixed, name: string) => mixed;
  }
}

interface FieldData extends BasicData {
  values: ValuesType;
  params?: ParamsTypeField
  events?: {
    onFocus: () => {};
    onBlur: () => {};
    onChange: () => {};
  }
}

type ValuesType = {
  current?: mixed;
  inital?: mixed;
  'default'?: mixed;
}

interface MessagesDataType {
  textArray: string[];
  hidden?: boolean;
  hiddenBind?: boolean;
  type?: MessageType;
}


type MessageType = 'danger' | 'warning' | 'success' | 'info' | 'notice' | '';

interface MessageResultType {
  text: string;
  level?: number;
  type: MessageType;
  classes?: string | string [];
  style?: styleType;
  clearOnValidate?: boolean;
}

type styleType = { [key: string]: string | number }
type DataMapType = [string, string, MapFunction] | [string, string]
// type ResolvedMapType = [[Path, Path|undefined], [Path, Path|undefined], MapFunction | undefined]
// type MapTypeShort = [string, MapFunction | undefined]
type MapFunction = (value: any) => any;

interface ObjectData extends BasicData {
  params?: ParamsType;
}

interface ArrayData extends ObjectData {
  length: number;
  arrayStartIndex: number;
}

interface FormData extends ObjectData {
  active: Array<string | number>;
  changes: any;
}

interface ParamsType {
  liveValidate?: boolean;
}

interface ControlsType {
  readonly?: boolean;
  readonlyBind?: boolean;
  disabled?: boolean;
  disabledBind?: boolean;
  hidden?: boolean;
  hiddenBind?: boolean;
  omit?: boolean;
  omitBind?: boolean;
}

interface ParamsTypeField extends ParamsType {
  required?: boolean;
  autofocus?: boolean;
  placeholder?: mixed;
}

type makeDataObjectResult = { data: FieldData | ObjectData | ArrayData, dataMap: StateType }

type ObjectDataStorageForSchema = { [key: string]: any } & { [symbol: string]: { isArray: boolean, length: number, addable: boolean } }