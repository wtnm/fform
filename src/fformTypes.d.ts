declare type mixed = string | number | boolean | null | {}
declare type Path = Array<string | number | symbol | any>;  // [Path, Path, any] | [Path, any]
declare type PathItem = { path: Path, keyPath?: Path, fullPath?: Path };
declare type StateApiUpdateType = { path: any, value: any, replace?: any, macros?: string, [key: string]: any };
declare type NormalizedUpdateType = { path: Path, value: any, replace?: any, [key: string]: any };

declare type MessageData = Array<MessageGroupType | string> | MessageGroupType | string;

type MessageGroupType = {
  group?: number;
  data: any;
  priority?: number;  // 0 and below means validation failed, else if priority > 0 message considered valid
  path?: Path | string;
  [key: string]: any;
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
    unsubmitted: number; // 0 if ALL children 0
    pending: number; // 0 if ALL children 0
    submitted:boolean; // true if ALL children true
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

interface elementsType {
  "presets"?: { [key: string]: jsFFCustomizeType | string };
  "widgets"?: { [key: string]: any };
  "types"?: string[];
  "presetMap"?: { [key: string]: string[] };

  [key: string]: any;
}

type normalizedDataMapType = { emitter: Path, from: string, to: string, action: dataMapActionType | boolean | undefined }; //{ fromPath: Path, fromKeyPath: Path, to: string, fn: MapFunctionType | false }

type dataMapActionType = { $: Function[], args: any[], replace: boolean }

type vPromisesType = Promise<any> & {
  validatedValue: any,
  path: Path,
  selfManaged: boolean;
}

type oneOfStructureType = { oneOf: number, type?: string };

/** Parameters to creates a FFormCore */
interface FFormApiProps {
  name: string;
  /** name that will be used to access data in redux storage */
  schema: jsJsonSchema | JsonSchema;
  /** schema that will be used to create state */
  JSONValidator?: any;
  elements?: { [key: string]: any };
  store?: any,   // redux
  getState?: () => any  // external
  setState?: (state: any) => void // external
  state?: any;
}


interface FViewerProps {
  value: any;
  schema: any;
  elements: any;
  customData?: any;
  customReplace?: any;
  _$useTag?: any;
  parent?: any;
  id?: any;
  name?: any;

  [k: string]: any;
}

interface FFormProps {
  _$useTag?: any;

  id?: any;
  core: any;
  state?: any;
  value?: any;
  initial?: any;
  extData?: { [key: string]: any };
  fieldCache?: boolean | number;
  touched?: boolean;
  noValidation?: boolean;

  parent?: any;

  onSubmit?: (event: any, value: any, fform: any) => any;
  onChange?: (value: any, fform?: any) => void;
  onStateChange?: (state: any, fform?: any) => void;

  [k: string]: any;
}


interface ActionType {
  type: string;
  core: any,
  mergeOptions?: any;
}


type APIOptsType = {
  execute?: boolean | number;
  force?: boolean;
  noValidation?: boolean;
  setExecution?: Function;
}

interface apiPromises extends Promise<any> {
  vAsync: Promise<any>;
}

type PathValueType = Array<any>;

interface object2PathValuesOptions {
  symbol?: boolean;
  arrayAsValue?: boolean;
}
