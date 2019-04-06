/////////////////////////////////////////////
//  Actions function
/////////////////////////////////////////////
import {
  getIn,
  isMergeable,
  memoize,
  merge,
  push2array,
  objKeys,
  isArray,
  isUndefined,
  isString,
  deArray, toArray, isFunction, isObject
} from "./commonLib";

import {
  objMap,
  getFromState,
  getSchemaPart,
  oneOfFromState,
  path2string,
  string2path,
  normalizeFn,
  normalizePath,
  normalizeUpdate,
  setIfNotDeeper,
  initState,
  updateState,
  object2PathValues,
  SymData, SymReset, SymClear, SymDataMap, rehydrateState
} from "./stateLib";


// const JSONValidator: any = require('./is-my-json-valid');


class exoPromise {
  done: boolean = false;
  vals: any[] = [{}, {}];

  constructor() {
    let self = this;
    let promise: any = new Promise((resolve, reject) => {
      self.setFunction(0, resolve);
      self.setFunction(1, reject);
    });
    promise.resolve = self.execFunction.bind(self, 0);
    promise.reject = self.execFunction.bind(self, 1);
    promise.isPending = () => !self.done;
    promise.isResolved = () => self.vals[0]['done']; // return undefined if not done, true if resolved, false if rejected
    promise.isRejected = () => self.vals[1]['done'];
    promise.result = () => self.done && self.vals[self.vals[0]['done'] ? 0 : 1]['rest'];
    return promise;
  }

  setFunction(num: 0 | 1, func: any) {
    let vals = this.vals[num];
    vals['func'] = func;
    if (vals['done']) func(...vals['rest'])
  }

  execFunction(num: 0 | 1, ...rest: any[]) {
    if (!this.done) {
      this.done = true;
      let vals = this.vals[num];
      vals['rest'] = rest;
      vals['done'] = true;
      this.vals[1 - num]['done'] = false;
      if (vals['func']) vals['func'](...rest);
    }
  }
}

/////////////////////////////////////////////
//  FFormCore class
/////////////////////////////////////////////

const _CORES = new WeakMap();

function fformCores(name: string) {return _CORES[name]}

/** Creates a api that contains data and api for changing it */
class FFormStateManager {
  private _isDispatching: boolean;
  private _currentState: any;
  private _reducer: any;
  private _validator: any;
  private _unsubscribe: any;
  private _listeners: Array<(state: StateType) => void> = [];

  JSONValidator: any
  UPDATABLE: PROCEDURE_UPDATABLE_Type;
  props: FFormApiProps;
  schema: jsJsonSchema;
  dispatch: any;
  // JSONValidator: (values: any) => any;
  name?: string;

  constructor(props: FFormApiProps) {
    // if ((props.getState || props.setState) && props.store) throw new Error('Expected either "store" or "getState & setState" but not all of them.');
    if (((props.getState ? 1 : 0) + (props.setState ? 1 : 0)) == 1) new Error('Expected both "getState" and "setState" or none but not only one of them.');
    if (props.store && !props.name) throw new Error('Expected "name" to be passed together with "store".');

    const self = this;
    self.props = props;
    self.schema = isCompiled(props.schema) ? props.schema : compileSchema(props.objects, props.schema);
    self.name = props.name || '';
    self.dispatch = props.store ? props.store.dispatch : self._dispatch.bind(self);
    self._reducer = formReducer();
    if (props.JSONValidator) self.JSONValidator = props.JSONValidator(self.schema);
    //self._validator = props.JSONValidator && props.JSONValidator(self.schema, {greedy: true});
    //self.JSONValidator = self._validator && self.JSONValidator.bind(self);
    self._getState = self._getState.bind(self);
    self._setState = self._setState.bind(self);
    if (props.setState && props.store) self._unsubscribe = self.props.store.subscribe(self._handleChange.bind(self));
    if (props.name) _CORES[props.name] = self;
    self.UPDATABLE = {update: {}, replace: {}, api: self};
  }

  private _dispatch(action: any) {
    const self = this;
    if (typeof action === 'function') return action(self._dispatch.bind(self));
    else self._setState(self._reducer(self._getState() || {}, action));
    return action;
  };

  _setState(state: any) {
    const self = this;
    if (state === self._getState()) return;
    if (self.props.setState) self.props.setState(state);
    else self._currentState = state;
    if (self.props.store) self._setStoreState(state);
    self._listeners.forEach(fn => fn(state));
  }

  _getState() {
    const self = this;
    if (self.props.store) return self._getStoreState();
    else if (self.props.getState) return self.props.getState();
    else return self._currentState;
  }

  private _setStoreState(state: any) {
    return this.props.store.dispatch({type: anSetState, state, api: this});
  }

  private _getStoreState() {
    return this.props.name && this.props.store.getState()[getFRVal()][this.props.name];
  }

  // private JSONValidator(data: any) {
  //   this._validator(data);
  //   let result = this._validator.errors;
  //   if (!result) return [];
  //   if (!isArray(result)) result = [result];
  //   return result.map((item: any) => [item.field.replace('["', '.').replace('"]', '').split('.').slice(1), item.message])
  // }

  private _handleChange() {
    const self = this;
    let nextState = self._getStoreState();
    let curState = self.props.getState ? self.props.getState() : self._currentState;
    if (nextState !== curState) self._setState(nextState);
  }


  addListener(fn: (state: StateType) => void) {
    const self = this;
    self._listeners.push(fn);
    if (self.props.store && !self._unsubscribe) self._unsubscribe = self.props.store.subscribe(self._handleChange.bind(self));
    return self.delListener.bind(self, fn);
  }

  delListener(fn?: (state: StateType) => void) {
    const self = this;
    if (isUndefined(fn)) self._listeners = [];
    else {
      let idx = self._listeners.indexOf(fn);
      if (~idx) self._listeners.splice(idx, 1)
    }
    if (!self._listeners.length && self._unsubscribe && !self.props.setState) {
      self._unsubscribe();
      delete self._unsubscribe;
    }
  }
}

/////////////////////////////////////////////
//  API
/////////////////////////////////////////////

class FFormStateAPI extends FFormStateManager {
  private _noExec = 0;
  private _resultPromises: any;
  private _newState: StateType | undefined;
  private _updates: StateApiUpdateType[] = [];
  private _validation: StateType | boolean | null = null;
  private _defferedTimerId: any;
  getState = this._getState;

  //wrapped: any;

  constructor(props: FFormApiProps) {
    super(props);
    const self = this;
    if (props.state) self._setState(props.state);
    else if (!self._getState()) self._setState(initState(self.UPDATABLE));
    const state = self._getState();
    if (!state[SymDataMap])  // no data maps, it means that state from server-side render
      self._setState(rehydrateState(state, self.UPDATABLE));
  }

  wrapper(self: any = {}) {
    const api = this;
    const wrapApi = (fn: string) => self[fn] || api[fn];
    const wrapPath = (path: null | string | Path = './') => path && normalizePath(path, self.path);
    const wrapOpts = (opts: any = {}, forcePath?: boolean) => {
      const {path, ...rest} = opts;
      if (path === null) rest.path = null;
      else if (!isUndefined(path) || forcePath) rest.path = wrapPath(path || './');
      return self.wrapOpts ? self.wrapOpts(rest) : rest;
      //rest.noValidation = isUndefined(noValidation) ? !self.liveValidate : noValidation;
    };

    const wrapped = {
      validate: (path: boolean | string | Path = './', ...args: any[]) => wrapApi('validate')(typeof path == 'boolean' ? path : wrapPath(path), ...args),
      get: (...path: any[]) => wrapApi('get')(wrapPath(path)),
      // set: (path: string | Path = [], value: any, opts?: any, ...args: any[]) => wrapThis('set')(wrapPath(path), value, wrapOpts(opts)),
      setValue: (value: any, opts: any = {}, ...args: any[]) => wrapApi('setValue')(value, wrapOpts(opts)),
      bind: (object: any) => {
        self = object;
        return wrapped
      },
      getValue: (opts: any = {}) => wrapped.get(SymData, opts.inital ? 'inital' : 'current', wrapPath(opts.path)),
      getApi: () => api,
    };
    ['noExec', 'setState', 'getActive', 'getDefaultValue']
      .forEach(fn => wrapped[fn] = (...args: any[]) => wrapApi(fn)(...args));
    ['reset', 'clear', 'execute']
      .forEach(fn => wrapped[fn] = (opts: any, ...args: any[]) => wrapApi(fn)(wrapOpts(opts, true), ...args));
    ['showOnly', 'getSchemaPart']
      .forEach(fn => wrapped[fn] = (path: string | Path = [], opts: any = {}, ...args: any[]) => wrapApi(fn)(wrapPath(path), wrapOpts(opts), ...args));
    ['set', 'switch', 'arrayAdd', 'arrayItemOps', 'setHidden', 'showOnly']
      .forEach(fn => wrapped[fn] = (path: string | Path = [], value: any, opts: any = {}, ...args: any[]) => wrapApi(fn)(wrapPath(path), value, wrapOpts(opts), ...args));
    return wrapped;
  }

  private _clearActions() {
    const self = this;
    self._newState = undefined;
    self._defferedTimerId = null;
    self._validation = null;
    self._updates = [];
    self._promise(true);
  }

  private _execBatch(updates: StateApiUpdateType[], opts: APIOptsType, promises: any, forceValidation: StateType | boolean | null) {
    const self = this;
    let action = {type: anUpdateState, state: self._newState, updates, api: self, forceValidation, opts, promises};
    self._clearActions();
    //console.log(' _execBatch.forceValidation', JSON.stringify(forceValidation));
    self.dispatch(updateState.bind(action));
    return promises;
  }

  private _setExecution(addUpdates: any, opts: APIOptsType = {}) {
    if (opts.setExecution) return opts.setExecution(addUpdates, opts);
    const self = this;
    if (addUpdates) push2array(self._updates, addUpdates);
    // console.log('---------------- added updates', updates);
    if (opts.force === true && self._noExec > 0) self._noExec--;
    let promises = self._promise();
    if (opts.execute === false || self._noExec) return promises;
    if (self._defferedTimerId) clearTimeout(self._defferedTimerId);
    //console.log(' _setExecution._validation', JSON.stringify(self._validation));
    if (opts.execute === true) self._execBatch(self._updates, opts, promises, self._validation);
    else self._defferedTimerId = setTimeout(self._execBatch.bind(self, self._updates, opts, promises, self._validation), opts.execute || 0);

    return promises;
  }

  private _promise(reset?: true): apiPromises {
    const self = this;
    if (reset) self._resultPromises = null;
    if (!self._resultPromises) {
      self._resultPromises = new exoPromise();
      self._resultPromises.vAsync = new exoPromise();
    }
    return self._resultPromises;
  }

  //getState = () => this._getState();
  //setState = (state: StateType) => this._setState(state);

  noExec = () => {this._noExec++;};

  execute = (opts: APIOptsType = {}) => {
    return this._setExecution(null, merge(opts, {execute: true}));
  };

  setState = (state: StateType, opts: APIOptsType = {}) => {
    const self = this;
    self._updates = []; // reset all previous updates
    self._newState = state;
    return self._setExecution(null, opts);
  };

  getActive = () => this.get(SymData, 'active');

  validate = (path: boolean | string | Path = true, opts: APIOptsType = {}) => {
    const self = this;
    if (typeof path == 'boolean') self._validation = path;
    else normalizeUpdate({path: path, value: true}, self.getState()).forEach(i => self._validation = setIfNotDeeper(self._validation || {}, true, i.path));
    return self._setExecution(null, opts);
  };

  get = (...pathes: Array<string | Path>): any => getFromState(this.getState(), ...pathes);

  set = (path: string | Path | null, value: any, opts: APIOptsType & { replace?: any, setOneOf?: number, macros?: string } = {}) => {
    if (path === null) return this._setExecution([null], opts);
    let {...update} = opts;
    (update as StateApiUpdateType).path = path;
    (update as StateApiUpdateType).value = value;
    return this._setExecution((update as StateApiUpdateType), opts);
  };

  getValue = (opts: { path?: string | Path, inital?: boolean } = {}): any => this.get(SymData, opts.inital ? 'inital' : 'current', opts.path || []);

  setValue = (value: any, opts: APIOptsType & { path?: string | Path, replace?: any, setOneOf?: number, inital?: boolean } = {}) => {
    let {path, inital, replace, ...update} = opts;
    if (path === null) return this._setExecution([null], opts);
    path = normalizePath(path || []).slice();
    if (~path.indexOf(SymData)) (update as StateApiUpdateType).path = path;
    else {
      let state = this.getState();
      while (!getIn(state, path) && path.length) {
        let nm = path.pop();
        value = {[nm]: value};
        replace = {[nm]: replace};
      }
      (update as StateApiUpdateType).path = [inital ? '@inital' : '@current'].concat(path);
    }
    (update as StateApiUpdateType).value = value;
    (update as StateApiUpdateType).replace = replace;
    return this._setExecution(update, opts);
  };

  getDefaultValue = () => this.get(SymData, 'default');

  switch = (path: string | Path | null, value: any, opts: APIOptsType & { replace?: any, setOneOf?: number, macros?: string } = {}) =>
    this.set(path, value, {...opts, macros: 'switch'});

  setMessages = (value: anyObject | null, opts: APIOptsType & { priority?: number, group?: number, path?: string | Path, props?: any }) => {
    let {priority = 0, group = 3, path = [], props = undefined, ...rest} = opts || {};
    const msgPath = '@/messages/' + priority + '/texts/' + group;
    if (value === null) {
      this.switch([path, msgPath], [], rest);
      if (isObject(props)) this.switch([path, '@/messages/' + priority], props, rest);
    } else {
      object2PathValues(value, {arrayAsValue: true}).forEach(p => {
        this.set([path, p, msgPath], p.pop(), rest);
        if (isObject(props)) this.set([path, p, '@/messages/' + priority], props, rest);
      })
    }
  };

  reset = (opts: APIOptsType & { path?: string | Path, status?: string, value?: any } = {}) =>
    opts.status ? this.set(normalizePath(opts.path || '/'), isUndefined(opts.value) ? SymReset : opts.value,
      {[SymData]: ['status', opts.status], macros: 'switch'}) : this.setValue(SymReset, opts);

  clear = (opts: APIOptsType & { path?: string | Path } = {}) => this.setValue(SymClear, opts);

  arrayAdd = (path: string | Path, value: number | any[] = 1, opts: APIOptsType = {}) =>
    this._setExecution({path, value: value, macros: 'array', ...opts}, opts);

  arrayItemOps = (path: string | Path, value: 'up' | 'down' | 'first' | 'last' | 'del' | 'move' | 'shift', opts: APIOptsType & { value?: number } = {}) =>
    this._setExecution({path, op: value, macros: 'arrayItem', ...opts}, opts);

  setHidden = (path: string | Path, value = true, opts: APIOptsType = {}) =>
    this._setExecution([{path: [path, '@', '/params/hidden'], value, ...opts}], opts);

  showOnly = (path: string | Path, opts: APIOptsType = {}) => {
    path = normalizePath(path);
    return this._setExecution([
      {path: [path.slice(0, -1), '/*/@/params/hidden'], value: true, ...opts},
      {path: [path, '@', '/params/hidden'], value: false, ...opts},
    ], opts);
  };

  getSchemaPart = (path: string | Path) => {
    path = normalizePath(path);
    return getSchemaPart(this.schema, path, oneOfFromState(this.getState()))
  }

}


/////////////////////////////////////////////
//  Actions names
/////////////////////////////////////////////

const anSetState = 'FFROM_SET_STATE';
const anUpdateState = 'FFROM_UPDATE_STATE';

/////////////////////////////////////////////
//  Reducer
/////////////////////////////////////////////


let formReducerValue = 'fforms';

function getFRVal() {
  return formReducerValue
}

function formReducer(name?: string): any {
  if (name) formReducerValue = name;
  const reducersFunction = {};

  function replaceFormState(storageState: any, name: string, formState: any) {
    if (storageState[name] !== formState) {
      let resultState = {...storageState};
      resultState[name] = formState;
      return resultState;
    }
    return storageState
  }

  reducersFunction[anSetState] = (state: any, action: any): any => {
    if (action.api.props.store) return replaceFormState(state, action.api.name, action.state);
    return action.state
  };

  return (state: any = {}, action: ActionType) => {
    let reduce = reducersFunction[action.type];
    return reduce ? reduce(state, action) : state;
  }
}

/////////////////////////////////////////////
//  Schema compile functions
/////////////////////////////////////////////

const compileSchema = memoize((fformObjects: formObjectsType, schema: JsonSchema): jsJsonSchema => schemaCompiler(fformObjects, schema));

function schemaCompiler(fformObjects: formObjectsType = {}, schema: JsonSchema): jsJsonSchema {
  if (isCompiled(schema)) return schema;

  let {ff_validators, ff_dataMap, ff_oneOfSelector, ...rest} = schema;
  const result: any = isArray(schema) ? [] : {ff_compiled: true};

  ff_validators && (result.ff_validators = toArray(objectResolver(fformObjects, ff_validators)).map(f => normalizeFn(f)));
  ff_dataMap && (result.ff_dataMap = objectResolver(fformObjects, ff_dataMap));
  ff_oneOfSelector && (result.ff_oneOfSelector = objectResolver(fformObjects, normalizeFn(ff_oneOfSelector)));
  //if (isFunction(result.ff_oneOfSelector)) result.ff_oneOfSelector = {$: result.ff_oneOfSelector};

  objKeys(rest).forEach(key => {
    if (key.substr(0, 3) == 'ff_') return result[key] = rest[key];
    switch (key) {
      case 'default':
      case 'enum':
        result[key] = rest[key];
        break;
      case 'definitions':
      case 'properties':
      case 'patternProperties':
      case 'dependencies':
        result[key] = objMap(rest[key], schemaCompiler.bind(null, fformObjects));
        break;
      default:
        if (isMergeable(rest[key])) result[key] = schemaCompiler(fformObjects, rest[key]);
        else result[key] = rest[key];
        break;
    }
  });
  return result;
}

function isCompiled(schema: any): schema is jsJsonSchema {
  return getIn(schema, 'ff_objects');
}

function testRef(refRes: any, $_ref: string, track: string[]) {
  if (isUndefined(refRes)) throw new Error('Reference "' + $_ref + '" leads to undefined object\'s property in path: ' + path2string(track));
  return true;
}

function objectDerefer(_objects: any, obj2deref: any, track: string[] = []) { // todo: test
  if (!isMergeable(obj2deref)) return obj2deref;
  let {$_ref = '', ...restObj} = obj2deref;
  $_ref = $_ref.split(':');
  const objs2merge: any[] = [];
  for (let i = 0; i < $_ref.length; i++) {
    if (!$_ref[i]) continue;
    let path = string2path($_ref[i]);
    if (path[0] !== '^') throw new Error('Can reffer only to ^');
    let refRes = getIn({'^': _objects}, path);
    testRef(refRes, $_ref[i], track.concat('@' + i));
    if (isMergeable(refRes)) refRes = objectDerefer(_objects, refRes, track.concat('@' + i));
    objs2merge.push(refRes);
  }
  let result = isArray(obj2deref) ? [] : {};

  for (let i = 0; i < objs2merge.length; i++) result = merge(result, objs2merge[i]);
  return merge(result, objMap(restObj, objectDerefer.bind(null, _objects), track));
  //objKeys(restObj).forEach(key => result[key] = isMergeable(restObj[key]) ? objectDerefer(_objects, restObj[key]) : restObj[key]);
}

function objectResolver(_objects: any, obj2resolve: any, track: string[] = []): any { // todo: test
  const convRef = (refs: string, prefix = '') => deArray(refs.split('|').map((ref, i) => {
    ref = ref.trim();
    if (isRef(ref)) prefix = ref.substr(0, ref.lastIndexOf('/') + 1);
    else ref = prefix + ref;
    let refRes = getIn(_objs, string2path(ref));
    testRef(refRes, ref, track.concat('@' + i));
    return refRes;
  }));
  const isRef = (val: string) => val.substr(0, 2) == '^/';
  const _objs = {'^': _objects};
  const result = objectDerefer(_objects, obj2resolve);
  const retResult = isArray(result) ? [] : {};
  objKeys(result).forEach((key) => {
    //const resolvedValue = isString(result[key]) && result[key].substr(0, 2) == '^/' ? convRef(result[key]) : result[key];
    let resolvedValue = result[key];
    if (isString(resolvedValue) && isRef(resolvedValue.trim())) {
      resolvedValue = convRef(resolvedValue);
      if (key !== '$' && key[0] !== '_' && (isFunction(resolvedValue) || isArray(resolvedValue) && resolvedValue.every(isFunction)))
        resolvedValue = {$: resolvedValue}
    }
    if (key[0] == '_') retResult[key] = resolvedValue;  //do only resolve for keys that begins with _ 
    else if (isMergeable(resolvedValue)) retResult[key] = objectResolver(_objects, resolvedValue, track.concat(key));
    else retResult[key] = resolvedValue;
  });

  return retResult
}


export {anSetState, getFRVal, FFormStateAPI, formReducer, fformCores, objectDerefer, objectResolver}