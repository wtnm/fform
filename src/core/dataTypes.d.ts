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
  value?: any;
  params?: ParamsTypeField
  fData: {
    inital?: any;
    'default'?: any;
    title: string;  // true if ALL children true
    type: string; // true if ALL children true
    required: boolean; // false if ALL children false
  };
  array?:{
    length: number;
    canAdd: boolean;
    canUp: boolean;
    canDown: boolean;
    canDel: boolean;
  }
  arrayItem?: {
    canUp?: boolean;
    canDown?: boolean;
    canDel?: boolean;
  }
  status: {
    color?: 'danger' | 'warning' | 'success' | '';
    valid: boolean;  // true if ALL children true, null if ANY children null, otherwise false
    pristine: boolean;  // true if ALL children true
    touched: boolean; // true if ALL children true
    pending: boolean; // false if ALL children false
  }
  messages?: { [key: number]: MessagesDataType };
  controls: controlType;
}

interface MessagesDataType {
  textArray: string[];
  hidden?: boolean;
  hiddenBind?: boolean;
  type?: MessageType;
}

interface ParamsTypeField {
  liveValidate?: boolean;
  autofocus?: boolean;
  placeholder?: string;
}

type controlType = {
  readonly?: boolean;
  readonlyBind?: boolean;
  disabled?: boolean;
  disabledBind?: boolean; // bind value if not undefined and ignores "disabled" value
  hidden?: boolean;
  hiddenBind?: boolean; // bind value if not undefined and ignores "show" value
  omit?: boolean;
  omitBind?: boolean;
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

interface FormData extends BasicData {
  active: Array<string | number>;
  formValue: any;
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


type makeDataObjectResult = { data: BasicData, dataMap: StateType }

type ObjectDataStorageForSchema = { [key: string]: any } & { [symbol: string]: { isArray: boolean, length: number, addable: boolean } }