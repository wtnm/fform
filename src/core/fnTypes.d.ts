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

  getValues: (opts?: { valueType?: 'current' | 'inital' | 'default', flatten?: boolean }) => void;
  setValues: (vals: any, opts?: APIOptsType & { valueType?: 'current' | 'inital' | 'default', flatten?: boolean }) => Promise<void>;

  // setFocus: (path: Path) => void;

  setHidden: (path: string, value: boolean) => Promise<void>;

  showOnly: (path: string, opts?: APIOptsType) => Promise<void>;
  selectOnly: (path: string, opts?: APIOptsType) => Promise<void>;

  noExec: () => void;
  execute: (opts: (APIOptsType & { force?: boolean })) => Promise<void>;
}

interface FFormProps {
  core: any;
  objects: { [key: string]: any };
  onSubmit?: (value: any, fform?: any) => boolean;
  onChange?: (value: any, fform?: any) => void;
  values?: any;
  rawValues?: { current?: any, inital?: any, 'default'?: any };
  state?: any;
  widget?: any;
  extData?: { [key: string]: any };
  fieldCache?: boolean;
}

/** Parameters to creates a FFormCore */
interface FFormCoreProps {
  /** schema that will be used to create state */
  schema: any;
  /** name that will be used to access data in redux storage */
  name?: string;
  current?: any;
  inital?: any;
  'default'?: any;
  store?: any,   // redux
  getState?: () => any  // external
  setState?: (state: any) => void // external
  opts?: APICreateOptsType
}

type APICreateOptsType = { flatValues?: boolean, skipInitValidate?: boolean, keepEqualRawValues?: boolean }


interface FormValues {

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
  stuff: actionStuffType,
  mergeOptions?: any;
}

type actionStuffType = {
  hooks: HooksObjectType;
  getState: () => StateType;
  getRawValues: () => { current: any, inital: any, 'default': any };
  JSONValidator: any;
  schema: JsonSchema;
  name?: string;
  keyMap: any;
}

interface SetItemsType extends ActionType {
  type: 'FFORM_SET_ITEMS';
  items: UpdateItem[];
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
  returnItems?: boolean;
  // async?: boolean | 'syncValidation';
  noValidation?: boolean;
  getState?: any;
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

type StateType = { [key: string]: any };
type MergeHook = (state: StateType, item: UpdateItem, utils: utilsApiType, schema: JsonSchema, data: StateType, hookType: string) =>
  false
  | UpdateItem[]
  | { before?: UpdateItem[], after?: UpdateItem[], skip?: boolean };
type UpdateHook = (state: StateType, changesArray: StateType[], utils: utilsApiType, schema: JsonSchema, data: StateType, hookType: string) => false | UpdateItem[]
type HooksType = MergeHook | UpdateHook;

// type MergeHookResultObject =  {result: boolean, changes?: MergeHookChanges}
// type MergeHookChanges = {beforeThis?: UpdateItem[], afterThis?: UpdateItem[], beforeAll?: UpdateItem[], afterAll?: UpdateItem[]}


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