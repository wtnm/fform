/////////////////////////////////////////////
//  Actions function
/////////////////////////////////////////////
import {
  getIn,
  setIn,
  isMergeable,
  isObject,
  memoize,
  merge,
  mergeState,
  push2array,
  objKeys,
  isArray,
  isUndefined,
  getCreateIn,
  isString,
  deArray, toArray
} from "./commonLib";

import {
  getDefaultFromSchema,
  getFromState,
  getSchemaPart,
  oneOfFromState,
  makeStateFromSchema,
  makeNUpdate,
  branchKeys,
  path2string,
  string2path,
  SymData, SymDelete, SymReset, SymClear,
  normalizePath,
  updateStatePROCEDURE,
  mergeStatePROCEDURE,
  isSelfManaged,
  normalizeUpdate,
  setIfNotDeeper, objMap
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
    self._validator = props.JSONValidator && props.JSONValidator(props.schema, {greedy: true});
    self.JSONValidator = self._validator && self.JSONValidator.bind(self);
    self._getState = self._getState.bind(self);
    self._setState = self._setState.bind(self);
    if (props.setState && props.store) self._unsubscribe = self.props.store.subscribe(self._handleChange.bind(self));
    if (props.name) _CORES[props.name] = self;
    // self.keyMap = getKeyMapFromSchema(self.schema, self._getState);
    if (!self._getState()) self._setState(makeStateFromSchema(props.schema));
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
    return this.props.store.dispatch({type: actionNameSetState, state, api: this});
  }

  private _getStoreState() {
    return this.props.name && this.props.store.getState()[getFRVal()][this.props.name];
  }

  private JSONValidator(data: any) {
    this._validator(data);
    let result = this._validator.errors;
    if (!result) return [];
    if (!isArray(result)) result = [result];
    return result.map((item: any) => [item.field.replace('["', '.').replace('"]', '').split('.').slice(1), item.message])
  }

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

  // constructor(props: FFormApiProps) {//schema: jsJsonSchema, name: string, dispatch: any, getState: () => StateType, setState: (state: any) => any, JSONValidator: any) {
  //   super(props);
  //   this.getState = this._getState;
  //   //   const self = this;
  //   //   this.keyMap = getKeyMapFromSchema(this.schema);
  //   //   self.setState(self.getState() || makeStateFromSchema(self.schema), {execute: true});
  // }

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
    let action = {type: actionNameUpdateState, state: self._newState, updates, api: self, forceValidation, opts, promises};
    self._clearActions();
    self.dispatch(updateState.bind(action));
    return promises;
  }

  private _setExecution(addUpdates: any, opts: APIOptsType = {}) {
    const self = this;
    if (addUpdates) push2array(self._updates, addUpdates);
    // console.log('---------------- added updates', updates);
    if (opts.force === true && self._noExec > 0) self._noExec--;
    let promises = self._promise();
    if (opts.execute === false || self._noExec) return promises;
    if (self._defferedTimerId) clearTimeout(self._defferedTimerId);
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

  set = (path: string | Path, value: any, opts: APIOptsType & { replace?: any, setOneOf?: number, macros?: string } = {}) => {
    let {...update} = opts;
    (update as StateApiUpdateType).path = path;
    (update as StateApiUpdateType).value = value;
    return this._setExecution((update as StateApiUpdateType), opts);
  };

  getValue = (opts: { path?: string | Path, inital?: boolean } = {}): any => {
    const path = normalizePath(opts.path || []);
    return getIn(this.getState(), SymData, opts.inital ? 'inital' : 'current', path);
  };

  setValue = (value: any, opts: APIOptsType & { path?: string | Path, replace?: any, setOneOf?: number, inital?: boolean } = {}) => {
    let {path, inital, ...update} = opts;
    (update as StateApiUpdateType).path = [inital ? '@inital' : '@current'].concat(normalizePath(path || []));
    (update as StateApiUpdateType).value = value;
    return this._setExecution(update, opts);
  };

  getDefaultValue = () => getDefaultFromSchema(this.schema);

  reset = (opts: APIOptsType & { path?: string | Path, status?: string } = {}) =>
    opts.status ? this.set([(opts.path || '/'), '@status/' + opts.status], SymReset, {macros: 'switch'}) : this.setValue(SymReset, opts);

  clear = (opts: APIOptsType & { path?: string | Path } = {}) => this.setValue(SymClear, opts);

  arrayAdd = (path: string | Path, value: number | any[] = 1, opts: APIOptsType = {}) =>
    this._setExecution({path, value: value, macros: 'array', ...opts}, opts);

  arrayItemOps = (path: string | Path, op: 'up' | 'down' | 'first' | 'last' | 'del' | 'move' | 'shift', opts: APIOptsType & { value?: number } = {}) =>
    this._setExecution({path, op: op, macros: 'arrayItem', ...opts}, opts);

  setHidden = (path: string | Path, value = true, opts: APIOptsType = {}) =>
    this._setExecution([{path: path + '@' + '/params/hidden', value, ...opts}], opts);

  showOnly = (path: string | Path, opts: APIOptsType = {}) => {
    path = normalizePath(path);
    return this._setExecution([
      {path: path2string(path.slice(0, -1)) + '/*/@/params/hidden', value: true, ...opts},
      {path: path2string(path) + '@' + '/params/hidden', value: false, ...opts},
    ], opts);
  };

  getSchemaPart = (path: string | Path) => {
    path = normalizePath(path);
    return getSchemaPart(this.schema, path, oneOfFromState(this.getState()))
  }

}


/////////////////////////////////////////////
//  Reducer
/////////////////////////////////////////////

function updateMessagesPROCEDURE(state: StateType, schema: jsJsonSchema, UPDATABLE_object: PROCEDURE_UPDATABLE_objectType, track: Path, result?: MessageData, defaultGroup = 0) {
  function conv(item: MessageGroupType | string): MessageGroupType {
    return (typeof item === 'object') ? item : {group: defaultGroup, text: item};
  };
  let messages: MessageGroupType[] = isArray(result) ? (result as any).map(conv) : [conv(result as any)];
  messages.forEach((item) => {
    let {path, ...itemNoPath} = item;
    if (path) {
      path = normalizePath(path, track);
      return updateMessagesPROCEDURE(state, schema, UPDATABLE_object, path, itemNoPath, defaultGroup)
    } else {
      let {group = defaultGroup, text, priority = 0, ...rest} = itemNoPath;
      //if (!hasIn(UPDATABLE_object.update, track, SymData, 'messages')) setIn(UPDATABLE_object.update, {}, track, SymData, 'messages', priority);
      //const messageData = getIn(UPDATABLE_object.update, track, SymData, 'messages', priority);
      const messageData = getCreateIn(UPDATABLE_object.update, {}, track, SymData, 'messages', priority);
      // setIn(UPDATABLE_object.replace, true, track, SymData, 'messages', priority, group);
      Object.assign(messageData, rest);
      if (!isObject(messageData.textGroups)) messageData.textGroups = {};
      if (!isArray(messageData.textGroups[group])) messageData.textGroups[group] = [];
      if (text) push2array(messageData.textGroups[group], text);
    }
  });
  return state
}

function setValidStatusPROCEDURE(state: StateType, schema: jsJsonSchema, UPDATABLE_object: PROCEDURE_UPDATABLE_objectType, track: Path = []) {
  let schemaPart: jsJsonSchema;
  try {schemaPart = getSchemaPart(schema, track, oneOfFromState(state))} catch (e) {return state}
  const selfManaged = isSelfManaged(state, track);
  let priorities = objKeys(Object.assign({}, getIn(state, track, SymData, 'messages') || {}, getIn(UPDATABLE_object.update, track, SymData, 'messages') || {}));
  let currentPriority;
  for (let i = 0; i < priorities.length; i++) {
    let groups = objKeys(Object.assign({}, getIn(state, track, SymData, 'messages', priorities[i]) || {}, getIn(UPDATABLE_object.update, track, SymData, 'messages', priorities[i]) || {}));
    for (let j = 0; j < groups.length; j++) {
      if (getIn(groups, groups[j], 'length')) {
        currentPriority = parseInt(priorities[i]);
        break;
      }
    }
    if (!isUndefined(currentPriority)) break;
  }

  state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(track, ['status', 'validation', 'invalid'], currentPriority === 0 ? 1 : 0, true, {macros: 'setStatus'}));
  state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(track, ['status', 'priority'], currentPriority));

  if (!selfManaged) objKeys(getIn(UPDATABLE_object.update, track)).forEach(key => state = setValidStatusPROCEDURE(state, schema, UPDATABLE_object, track.concat(key)));

  return state
}

function makeValidation(state: StateType, dispatch: any, action: any) {

  function recurseValidationInnerPROCEDURE(state: StateType, validatedValue: StateType, modifiedValues: StateType, track: Path = []) {
    let schemaPart: jsJsonSchema;
    try {schemaPart = getSchemaPart(schema, track, oneOfFromState(state))} catch (e) {return state}

    const selfManaged = isSelfManaged(state, track);
    if (!selfManaged)
      modifiedValues && objKeys(modifiedValues).forEach(key => state = recurseValidationInnerPROCEDURE(state, validatedValue[key], modifiedValues[key], track.concat(key)));

    let ff_validators = schemaPart.ff_validators;

    if (ff_validators) {
      const props = {state, path: path2string(track), schema, getFromState: (...tPath: Array<string | Path>) => getFromState(state, ...tPath)};
      ff_validators.forEach((validator: any) => {
        let result = validator.$.call(props, validatedValue, validator.args || []);
        if (result && result.then && typeof result.then === 'function') { //Promise
          result.validatedValue = validatedValue;
          result.path = track;
          result.selfManaged = selfManaged;
          vPromises.push(result);
          updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(track, ['status', 'validation', 'pending'], 1, true, {macros: 'setStatus'}))
        } else state = updateMessagesPROCEDURE(state, schema, UPDATABLE_object, track, result, 1)
      })
    }
    return state
  }

  function clearDefaultMessagesInnerPROCEDURE(state: StateType, modifiedValues: StateType, track: Path = []) {
    const type = getIn(state, track, SymData, 'fData', 'type');
    if (!type) return state;
    if (type == 'object' || type == 'array')
      modifiedValues && objKeys(modifiedValues).forEach(key => clearDefaultMessagesInnerPROCEDURE(state, modifiedValues[key], track.concat(key)));
    return updateMessagesPROCEDURE(state, schema, UPDATABLE_object, track); // sets empty array for 0-level messages
  }

  let {api, force, opts, promises} = action;
  const schemaDataObj = api.schema[SymData];
  const {JSONValidator, schema, getState} = api;
  const currentValues = state[SymData].current;
  const pendingStatus = {};
  const vPromises: vPromisesType[] = [];

  let UPDATABLE_object = {update: {}, replace: {}};

  const modifiedValues = force === true ? currentValues : force;
  if (!modifiedValues || objKeys(modifiedValues).length == 0) { // no changes, no validation
    promises.resolve();
    promises.vAsync.resolve();
    return state;
  }
  if (JSONValidator) {
    state = clearDefaultMessagesInnerPROCEDURE(state, modifiedValues);
    let errs = JSONValidator(currentValues);  // Validate, using JSONSchemaValidator;
    errs.forEach((item: any) => updateMessagesPROCEDURE(state, schema, UPDATABLE_object, item[0], item[1]));
  }
  state = recurseValidationInnerPROCEDURE(state, currentValues, modifiedValues);
  state = setValidStatusPROCEDURE(state, schema, UPDATABLE_object);
  state = mergeStatePROCEDURE(state, UPDATABLE_object);
  promises.resolve();
  if (vPromises.length) {
    Promise.all(vPromises).then((results) => {
      let state = getState();
      let UPDATABLE_object = {update: {}, replace: {}};
      let newValues = state[SymData].current; //getRawValues().current;
      for (let i = 0; i < vPromises.length; i++) {
        if (!results[i]) continue;
        let {validatedValue, path, selfManaged} = vPromises[i];
        if (validatedValue == getIn(newValues, path)) {
          state = updateMessagesPROCEDURE(state, schema, UPDATABLE_object, path, results[i], 2);
          state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(path, ['status', 'validation', 'pending'], 0, false, {macros: 'setStatus'}))
          // pendingStatus[path2string(path)] = false;
        }
      }
      state = setValidStatusPROCEDURE(state, schema, UPDATABLE_object);
      state = mergeStatePROCEDURE(state, UPDATABLE_object);// merge(state, UPDATABLE_object.update, {replace: UPDATABLE_object.replace});
      dispatch({type: actionNameSetState, state, api});
      promises.vAsync.resolve();
    }).catch(reason => {
      let state = getState();
      let UPDATABLE_object = {update: {}, replace: {}};
      let newValues = state[SymData].current; //getRawValues().current;
      for (let i = 0; i < vPromises.length; i++) {
        let {validatedValue, path, selfManaged} = vPromises[i];
        if (validatedValue == getIn(newValues, path)) {
          state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(path, ['status', 'validation', 'pending'], 0, false, {macros: 'setStatus'}))
        }
      }
      state = setValidStatusPROCEDURE(state, schema, UPDATABLE_object);
      state = merge(state, UPDATABLE_object.update, {replace: UPDATABLE_object.replace});
      dispatch({type: actionNameSetState, state, api});
      promises.vAsync.reject(reason);
    })
  } else promises.vAsync.resolve();
  return state;
}

function setDirtyPROCEDURE(state: StateType, schema: jsJsonSchema, UPDATABLE_object: PROCEDURE_UPDATABLE_objectType, inital: any, current: any, track: Path = []) {
  if (current === inital) return state;
  let schemaPart;
  try {schemaPart = getSchemaPart(schema, track, oneOfFromState(state))} catch (e) {}

  if (!schemaPart || isSelfManaged(state, track)) { //direct compare
    let path: Path = schemaPart ? track : track.slice(0, -1);
    state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(path, ['status', 'dirty'], 1, false, {macros: 'setStatus'}))
  } else {
    let keys = objKeys(Object.assign({}, inital, current));
    keys.forEach(key => state = setDirtyPROCEDURE(state, schema, UPDATABLE_object, getIn(inital, key), getIn(current, key), track.concat(key)))
  }
  return state
}

function updateDirtyPROCEDURE(state: StateType, schema: jsJsonSchema, UPDATABLE_object: PROCEDURE_UPDATABLE_objectType, inital: any, currentChanges: any, track: Path = [], forceDirty = false) {
  let schemaPart;
  try {schemaPart = getSchemaPart(schema, track, oneOfFromState(state))} catch (e) {}
  if (!schemaPart || isSelfManaged(state, track)) { //direct compare
    let current = getIn(state, SymData, 'current', track);
    let value = forceDirty || current !== inital ? 1 : -1;
    let path: Path = schemaPart ? track : track.slice(0, -1);
    state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(path, ['status', 'dirty'], value, false, {macros: 'setStatus',}))
  } else {
    let keys = objKeys(currentChanges || {});
    if (schemaPart.type == 'array') {
      let existKeys = branchKeys(getIn(state, track));
      keys = keys.filter(k => isNaN(parseInt(k)) || ~existKeys.indexOf(k))
    }
    // if (schemaPart.type == 'array' && !~keys.indexOf('length')) keys.push('length');
    forceDirty = forceDirty || !isMergeable(inital);
    keys.forEach(key => state = updateDirtyPROCEDURE(state, schema, UPDATABLE_object, getIn(inital, key), currentChanges[key], track.concat(key), forceDirty))
  }
  return state
}

function setCurrentPristine(state: StateType, schema: jsJsonSchema, UPDATABLE_object: PROCEDURE_UPDATABLE_objectType, inital: any, track: Path = []) {
  if (getIn(UPDATABLE_object.update, track, SymData, 'status', 'pristine')) {
    if (isMergeable(inital) && getIn(state, SymData, 'current', track) !== inital) {
      setIn(UPDATABLE_object.update, inital, SymData, 'current', track);
      setIn(UPDATABLE_object.replace, true, SymData, 'current', track);
    }
  } else {
    objKeys(getIn(UPDATABLE_object.update, track)).forEach(key => setCurrentPristine(state, schema, UPDATABLE_object, getIn(inital, key), track.concat(key)))
  }
  return state
}

function updateState(dispatch: any) {
  // console.time('execActions');

  let {updates, state, api, forceValidation, opts, promises} = this;
  let {getState, schema} = api;
  if (!state) state = getState();
  let prevState = state;
  let UPDATABLE_object: PROCEDURE_UPDATABLE_objectType = {update: {}, replace: {}};

  updates.forEach((update: StateApiUpdateType) => state = updateStatePROCEDURE(state, schema, UPDATABLE_object, update));
  state = mergeStatePROCEDURE(state, UPDATABLE_object);
  let oldCurrent = getIn(prevState, SymData, 'current');
  if (UPDATABLE_object.forceCheck) oldCurrent = merge(oldCurrent, UPDATABLE_object.forceCheck);
  let currentChanges = mergeState(oldCurrent, getIn(state, SymData, 'current'), {diff: true}).changes;
  if (prevState[SymData].inital !== state[SymData].inital) {  // check dirty for all
    state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate([], ['status', 'dirty'], 0, false, {macros: 'switch'}));  //reset all dirty
    state = setDirtyPROCEDURE(state, schema, UPDATABLE_object, state[SymData].inital, state[SymData].current);
  } else if (currentChanges)
    state = updateDirtyPROCEDURE(state, schema, UPDATABLE_object, state[SymData].inital, currentChanges); // check dirty only for changes
  state = setCurrentPristine(state, schema, UPDATABLE_object, state[SymData].inital);
  state = mergeStatePROCEDURE(state, UPDATABLE_object);

  if (opts.noValidation) {
    promises.resolve();
    promises.vAsync.resolve();
  } else if (forceValidation !== false) {
    UPDATABLE_object = {update: {}, replace: {}};
    let force = forceValidation === true ? true : currentChanges; //merge(forceValidation || {}, mergeState(prevRawValues['current'], rawValues['current']).changes);
    state = makeValidation(state, dispatch, {force, api, opts, promises});
    // state = merge(state, UPDATABLE_object.update, {replace: UPDATABLE_object.replace});
  }
  dispatch({type: actionNameSetState, state, api});

  // console.timeEnd('execActions');
  return promises;

}

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

  reducersFunction[actionNameSetState] = (state: any, action: any): any => {
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

  let {ff_validators, ff_dataMap, ...rest} = schema;
  const result: any = isArray(schema) ? [] : {ff_compiled: true};

  ff_validators && (result.ff_validators = toArray(objectResolver(fformObjects, ff_validators, false)).map((v) => isObject(v) ? (v as any) : {$: v}));
  ff_dataMap && (result.ff_dataMap = objectResolver(fformObjects, ff_dataMap, false));

  objKeys(rest).forEach(key => {
    switch (key) {
      case 'ff_custom':
      case 'ff_preset':
      case 'ff_layout':
      case 'ff_data':
      case 'ff_params':
      case 'ff_placeholder':
      case 'ff_props':
      case 'ff_enumExten':
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

function objectDerefer(_objects: any, obj2deref: any) { // todo: test
  if (!isMergeable(obj2deref)) return obj2deref;
  let {$_ref = '', ...restObj} = obj2deref;
  $_ref = $_ref.split(':');
  const objs2merge: any[] = [];
  for (let i = 0; i < $_ref.length; i++) {
    if (!$_ref[i]) continue;
    let path = string2path($_ref[i]);
    if (path[0] !== '^') throw new Error('Can reffer only to ^');
    let refObj = getIn({'^': _objects}, path);
    if (isMergeable(refObj)) refObj = objectDerefer(_objects, refObj);
    objs2merge.push(refObj);
  }
  let result = isArray(obj2deref) ? [] : {};

  for (let i = 0; i < objs2merge.length; i++) result = merge(result, objs2merge[i]);
  return merge(result, objMap(restObj, objectDerefer.bind(null, _objects)));
  //objKeys(restObj).forEach(key => result[key] = isMergeable(restObj[key]) ? objectDerefer(_objects, restObj[key]) : restObj[key]);
}

function objectResolver(_objects: any, obj2resolve: any, extract2SymData?: boolean): any { // todo: test
  const convRef = (refs: string) => deArray(refs.split('|').map(r => getIn(_objs, string2path(r.trim()))));
  const _objs = {'^': _objects};
  const result = objectDerefer(_objects, obj2resolve);
  const retResult = isArray(result) ? [] : {};
  objKeys(result).forEach((key) => {
    const resolvedValue = isString(result[key]) && result[key].substr(0, 2) == '^/' ? convRef(result[key]) : result[key];
    if (key[0] == '_') retResult[key] = resolvedValue;  //do only resolve for keys that begins with _
    else if (extract2SymData && key.substr(-5) == '.bind') {
      const proccessed = isMergeable(resolvedValue) ? objectResolver(_objects, resolvedValue) : resolvedValue;
      setIn(retResult, proccessed, SymData, string2path(key));
    } else if (isMergeable(resolvedValue)) {
      retResult[key] = objectResolver(_objects, resolvedValue, extract2SymData);
      if (retResult[key][SymData]) setIn(retResult, retResult[key][SymData], SymData, key);
      delete retResult[key][SymData];
    } else if (extract2SymData && typeof resolvedValue == 'function') setIn(retResult, resolvedValue, SymData, key);
    else retResult[key] = resolvedValue;
  });

  return retResult
}

/////////////////////////////////////////////
//  Actions names
/////////////////////////////////////////////

const actionNameSetState = 'FFROM_SET_STATE';
const actionNameUpdateState = 'FFROM_UPDATE_STATE';

export {getFRVal, FFormStateAPI, formReducer, fformCores, objectDerefer, objectResolver}