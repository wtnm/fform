declare type mixed = string | number | boolean | null | {}
declare type Path = Array<string | number | symbol | any>;  // [Path, Path, any] | [Path, any]
declare type PathItem = { path: Path, keyPath?: Path, fullPath?: Path };
declare type MapValuesItem = { from: PathItem, to: PathItem, fn: any };
declare type StateApiUpdateType = { path: any, value: any, replace?: boolean, macros?: string, [key: string]: any };
declare type NormalizedUpdateType = { path: Path, value: any, replace?: boolean, [key: string]: any };


declare type PathSlice = Array<string | number | any | Array<string | number | any>>;
declare type MessageData = Array<MessageGroupType | string> | MessageGroupType | string;

type MessageGroupType = {
  group?: number;
  text: string | string[];
  priority?: number;  // 0 and below means validation failed, else if priority > 0 message considered valid 
  path?: Path | string;
  className?: string;
  inputClassName?: string;  // className for input choosen from the message with lowest priority


  // replace?: number;
  // hidden?: boolean;
  // hiddenBind?: boolean;
  // type?: 'danger' | 'warning' | 'success' | 'info' | 'notice';

}

interface anyObject {
  [key: string]: any;

  [key: number]: any;
}

type StateType = { [key: string]: BasicData } | { [key: number]: BasicData };

type PROCEDURE_UPDATABLE_objectType = { update: StateType, replace: StateType }

interface BasicData extends anyObject {
  value?: any;
  length?: number;
  oneOf?: number;
  fData: {
    title: string;  //
    type: string; //
    required: boolean; // 
    canAdd?: boolean;
    placeholder?: string;
  };
  status: {
    priority: number;
    invalid: number;  // 0 if ALL children 0
    dirty: number;  // 0 if ALL children 0
    untouched: number; // 0 if ALL children 0
    pending: number; // 0 if ALL children 0
    valid: boolean; // null if pending else !invalid
    pristine: boolean; // !dirty
    touched: boolean; // !untouched
  }
  params?: FFParamsType
  arrayItem?: {
    canUp?: boolean;
    canDown?: boolean;
    canDel?: boolean;
  }
  messages?: { [key: number]: MessagesDataType };

}

interface MessagesDataType {
  priority: number;
  textGroups: string[][];
  skip?: boolean;
  className?: any;
}

// interface FFParamsType {
//  
//   placeholder?: string;
// }

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

type MessageType = 'danger' | 'warning' | 'success' | 'info' | 'notice' | '';

// interface MessageResultType {
//   text: string;
//   level?: number;
//   type: MessageType;
//   classes?: string | string [];
//   style?: styleType;
//   // clearOnValidate?: boolean;
// }

type styleType = { [key: string]: string | number }


type DataMapStateType = { emitter: Path, from: string, to: string, fn: MapFunctionType | true | undefined }; //{ fromPath: Path, fromKeyPath: Path, to: string, fn: MapFunctionType | false }

// type ResolvedMapType = [[Path, Path|undefined], [Path, Path|undefined], MapFunctionType | undefined]
// type MapTypeShort = [string, MapFunctionType | undefined]
type MapFunctionType = (value: any, props: MapPropsType) => any;

type MapPropsType = { path: string, pathTo: string, schema: JsonSchema, getFromState: (...pathes: Array<string | Path>) => any };


// interface FormData extends BasicData {
//   active: Array<string | number>;
//   current: any;
//   inital: any;
// }


type makeDataObjectResult = { data: BasicData, dataMap: StateType }

type ObjectDataStorageForSchema = { [key: string]: any } & { [symbol: string]: { isArray: boolean, length?: number, addable: boolean } }

type vPromisesType = Promise<any> & {
  validatedValue: any,
  path: Path,
  selfManaged: boolean;
}