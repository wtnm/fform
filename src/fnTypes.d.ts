interface FormApi {

  validate: (forceValidate: boolean | StateType | string[] | string, opts?: APIOptsType) => Promise<void>
  getState: () => StateType;
  replaceState: (state: any, opts?: APIOptsType) => Promise<void>;

  get: (...rest: Array<string | Path>) => void;
  set: (path: string | Path, value: any, opts?: APIOptsType) => Promise<void>;

  setMultiply: (path: string | Path, value: any, opts?: APIOptsType) => Promise<void>
  setExceptMultiply: (path: string | Path, value: any, opts?: APIOptsType) => Promise<void>

  // getAsObject: (keyPath: string, fn?: any) => any;
  // setAsObject: (vals: any, keyPath: string, opts?: APIOptsType) => void;

  // getAsSlice: (path: PathSlice) => any;
  // setAsSlice: (path: PathSlice, value: any) => void;

  getValues: (opts?: { valueType?: 'inital' | 'default', flatten?: boolean }) => void;
  setValues: (vals: any, opts?: APIOptsType & { inital?: boolean, flatten?: boolean }) => Promise<void>;

  // setFocus: (path: Path) => void;

  setHidden: (path: string, value: boolean) => Promise<void>;

  showOnly: (path: string, opts?: APIOptsType) => Promise<void>;
  selectOnly: (path: string, opts?: APIOptsType) => Promise<void>;

  noExec: () => void;
  execute: (opts: (APIOptsType & { force?: boolean })) => Promise<void>;
}

interface FFormProps {
  useTag?: any;

  core: any;
  state?: any;
  value?: any;
  inital?: any;
  extData?: { [key: string]: any };
  fieldCache?: boolean | number;
  noInitValidate?: boolean;
  noValidate?: boolean;

  parent?: any;

  onSubmit?: (value: any, fform?: any) => boolean;
  onChange?: (value: any, fform?: any) => void;
  onStateChange?: (state: any, fform?: any) => void;
}

/** Parameters to creates a FFormCore */
interface FFormApiProps {
  schema: jsJsonSchema | JsonSchema;
  /** schema that will be used to create state */
  JSONValidator?: any;
  objects?: { [key: string]: any };
  name?: string;
  /** name that will be used to access data in redux storage */
  store?: any,   // redux
  getState?: () => any  // external
  setState?: (state: any) => void // external

}


interface DeepmergeOptionsArgument {
  arrayMerge?: any;
  clone?: boolean;
  symbol?: boolean;
}

interface MergeStateOptionsArgument {
  noSymbol?: boolean;
  del?: boolean;  // remove props with SymDelete
  diff?: boolean;
  arrays?: 'replace' | 'merge' | 'concat'; // 'mergeWithoutLength'
  replace?: replaceType; // force replace for mergeable object instead of merge, should be and object with true value for the keys that must be replaced, can be recursive for deep objects
  SymbolDelete?: any;
  // mergeArrays?: boolean;
  // setArrayLength?: boolean;
}

type replaceType = { [key: string]: boolean | replaceType } | boolean | ((path: Path) => boolean);

interface IsEqualOptions {
  deep?: boolean;
  symbol?: boolean;
  skipKeys?: string[];
  deepKeys?: string[];
  onlyKeysB?: boolean;
}

interface ActionType {
  type: string;
  core: any,
  mergeOptions?: any;
}


interface SetItemsType extends ActionType {
  type: 'FFORM_SET_ITEMS';
  items: NormalizedUpdateType[];
}

interface ForceValidationType extends ActionType {
  type: 'FFORM_VALIDATION';
  force: StateType;
}

interface SetRawValuesType extends ActionType {
  type: 'FFORM_SET_RAW_VALUES';
  rawValues: any;
}

type APIOptsType = {
  execute?: boolean | number;
  force?: boolean;
  noValidation?: boolean;
  setExecution?: Function;
}

interface apiPromises extends Promise<any> {
  // vSync: Promise<any>;
  vAsync: Promise<any>;
}

interface HooksObjectType {
  beforeMerge: MergeHook[],
  afterMerge: UpdateHook[],
}

interface MergeStateResult {
  state: any,
  changes?: any,
}

interface SetSliceResultType {
  data: any,
  changes?: any
}

type PathValueType = Array<any>;

interface object2PathValuesOptions {
  symbol?: boolean;
  arrayAsValue?: boolean;
}


type MergeHook = (state: StateType, item: NormalizedUpdateType, utils: utilsApiType, schema: jsJsonSchema, data: StateType, hookType: string) =>
  false
  | NormalizedUpdateType[]
  | { before?: NormalizedUpdateType[], after?: NormalizedUpdateType[], skip?: boolean };
type UpdateHook = (state: StateType, changesArray: StateType[], utils: utilsApiType, schema: jsJsonSchema, data: StateType, hookType: string) => false | NormalizedUpdateType[]
type HooksType = MergeHook | UpdateHook;

// type MergeHookResultObject =  {result: boolean, changes?: MergeHookChanges}
// type MergeHookChanges = {beforeThis?: NormalizedUpdateType[], afterThis?: NormalizedUpdateType[], beforeAll?: NormalizedUpdateType[], afterAll?: NormalizedUpdateType[]}


// type HooksObjectType = {beforeMerge: MergeHook[], beforeUpdate: UpdateHook[]}

interface utilsApiType {
  get: (state: any, path: string) => StateType | mixed;
  isEqual: (objA: any, objB: any, options?: IsEqualOptions) => boolean
}

interface StateObjectType {
  prevState: StateType;
  changes: StateType
  state: StateType
}

interface PathValueResultType {
  result: StateType[]
  data?: StateType
}