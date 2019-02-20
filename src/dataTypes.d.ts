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
}

interface anyObject {
  [key: string]: any;

  [key: number]: any;
}

type StateType = { [key: string]: FFieldDataType } | { [key: number]: FFieldDataType };

type PROCEDURE_UPDATABLE_Type = { update: StateType, replace: StateType, forceCheck?: StateType, api: any, [key: string]: any }

interface FFieldDataType extends anyObject {
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
  textGroups: string[][];
  norender?: boolean;
  className?: any;
}

type MessageType = 'danger' | 'warning' | 'success' | 'info' | 'notice' | '';

interface formObjectsType {
  "presets"?: { [key: string]: jsFFCustomizeType | string };
  "widgets"?: { [key: string]: any };
  "types"?: string[];
  "presetMap"?: { [key: string]: string[] };

  [key: string]: any;
}

type styleType = { [key: string]: string | number }

type normalizedDataMapType = { emitter: Path, from: string, to: string, action: dataMapActionType | boolean | undefined }; //{ fromPath: Path, fromKeyPath: Path, to: string, fn: MapFunctionType | false }

type dataMapActionType = { $: Function[], args: any[], asUpdates: boolean }

type MapFunctionType = (value: any, props: MapPropsType) => any;

type MapPropsType = { path: string, pathTo: string, schema: jsJsonSchema, getFromState: (...pathes: Array<string | Path>) => any };

type makeDataObjectResult = { data: FFieldDataType, dataMap: StateType }

type ObjectDataStorageForSchema = { [key: string]: any } & { [symbol: string]: { isArray: boolean, length?: number, addable: boolean } }

type vPromisesType = Promise<any> & {
  validatedValue: any,
  path: Path,
  selfManaged: boolean;
}

type oneOfStructureType = { oneOf: number, type?: string };