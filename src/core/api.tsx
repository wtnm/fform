/////////////////////////////////////////////
//  Actions function
/////////////////////////////////////////////
import {delIn, getByKey, getIn, isEqual, isMergeable, isObject, makeSlice, memoize, merge, mergeState, moveArrayElems, objKeysNSymb, push2array} from "./commonLib";
import {
  arrayStart,
  basicLengths,
  get,
  getBindedValue, getMaxValue, getSchemaPart, getValue,
  isReplaceable,
  makeArrayOfPathItem,
  makePathItem, makeStateBranch,
  makeStateFromSchema, makeUpdateItem,
  object2PathValues,
  path2string, RawValuesKeys, string2path, SymbolBranch,
  SymbolData, SymbolDelete,
  SymbolReset,
  UpdateItems, utils,
  val2path
} from "./stateLib";

import {objKeys, isArr, isUndefined} from "./commonLib";


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


let formReducerValue = 'fforms';

/////////////////////////////////////////////
//  Actions names
/////////////////////////////////////////////
const actionName4setItems = 'FFORM_SET_ITEMS';
const actionNameReplaceState = 'FFROM_REPLACE_STATE';
const actionNameExecAction = 'FFROM_EXEC_ACTIONS';


const actionUpdateState = (items: any[], stuff: any): SetItemsType => {
  return {type: actionName4setItems, items, stuff};
};

const actionExecActions = (actions: any[], stuff: any, forceValidation: any, opts: any, promises: any): any => {
  return execActions.bind({type: actionNameExecAction, actions, forceValidation, stuff, opts, promises});
};


/////////////////////////////////////////////
//  Hooks
/////////////////////////////////////////////


function hookManager() {
  const Hooks = {};

  const add: any = function (name: string, hookName: string, hook: HooksType) { // name = '' uses for global hooks
    getByKey(Hooks, [name, hookName], []).push(hook);
    return remove.bind(null, name, hookName, hook)
  };

  function remove(name: string, hookName: string, hook: HooksType) {
    Hooks[name][hookName].splice(Hooks[name][hookName].indexOf(hook), 1);
  };

  add.get = (name: string) => {
    if (!Hooks[name] || name == '') return Hooks[''];
    else return merge(Hooks[''], Hooks[name], {arrays: 'concat'});
  };
  return add;
}

const Hooks = hookManager();

function getValueFromUpdateItemIfExists(keyPath: Path, item: UpdateItem) {
  if (!item.keyPath) return;
  let i = 0;
  for (i; i < Math.min(item.keyPath.length, keyPath.length); i++) {
    if (keyPath[i] !== item.keyPath[i]) return;
  }
  if (item.keyPath.length <= keyPath.length) return getIn(item.value, keyPath.slice(i));
  else return makeSlice(item.keyPath.slice(i), item.value)
}

// recalc array and set pristine
Hooks('', 'beforeMerge', (state: StateType, item: UpdateItem, utils: utilsApiType, schema: JsonSchema, data: StateType) => {
  // function recurseSetData(stateItems: any, newState: StateType, track: Path) {
  //   stateItems[path2string(track)] = makeDataItem(newState[SymbolData]);
  //   objKeys(newState).forEach(key => recurseSetData(stateItems, newState[key], track.concat(key)))
  // }

  if (!item.keyPath) return [];
  const after: UpdateItem[] = [];
  let newLengthsValue = getValueFromUpdateItemIfExists(['array', 'lengths'], item);
  if (newLengthsValue) setArrayLength(after, schema, state, item.path, newLengthsValue);

  let newValues = getValueFromUpdateItemIfExists(['values'], item);

  if (newValues) { // calculate pristine value
    const dataItem = getIn(state, item.path)[SymbolData];
    if (dataItem.values) {
      newValues = merge(dataItem.values, newValues);
      if (newValues.current === SymbolReset) {
        newValues = merge(newValues, {'current': getValue(newValues, 'inital')});
        after.push(makeUpdateItem(item.path, ['values', 'current'], newValues.current));
      }
      after.push(makeUpdateItem(item.path, ['status', 'pristine'], isEqual(getValue(newValues), getValue(newValues, 'inital'))));
    }
  }

  return after
});

function recursivelySetChanges(after: UpdateItem[], statePart: StateType, keyPath: Path, value: any, track: Path) {
  after.push(makeUpdateItem(track, keyPath, value));
  getKeysAccording2schema(statePart, []).forEach(key => recursivelySetChanges(after, statePart[key], keyPath, value, track.concat(key)))
};
// switch 
Hooks('', 'beforeMerge', (state: StateType, item: UpdateItem, utils: utilsApiType, schema: JsonSchema, data: StateType) => {

  if (!item.keyPath) return [];
  const after: UpdateItem[] = [];
  const result: any = {after};
  let switches = getValueFromUpdateItemIfExists(['switch'], item);
  if (switches) {
    result.skip = true;
    if (isObject(switches)) object2PathValues(switches).forEach(pathValue => recursivelySetChanges(after, getIn(state, item.path), pathValue, pathValue.pop(), item.path));
  }
  return result;
});

// Recalculate
Hooks('', 'afterMerge', (state: StateType, changesArray: StateType[], utils: utilsApiType, schema: JsonSchema, data: StateType) => {
  const addChangeData: UpdateItem[] = [];
  let recalcArray: any;

  function countRecalc(state: StateType, changes: StateType, track: Path = ['#']) {
    if (state === undefined) return;
    objKeys(changes).forEach(key => countRecalc(state[key], changes[key], track.concat(key)));
    const dataItemChanges = changes[SymbolData];
    if (!dataItemChanges) return;
    const dataItem = state[SymbolData];
    if (!dataItem) return;
    let status: string[] = [];
    let path = track.concat();
    let controls = dataItemChanges['controls'] || {};
    if (getIn(dataItemChanges, ['array', 'lengths'])) status = objKeys(dataItem.status);
    else if (controls.hasOwnProperty('omit') || controls.hasOwnProperty('omitBind')) {
      path.pop();
      status = objKeys(dataItem.status);
    } else if (dataItemChanges.status) {
      path.pop();
      status = objKeys(dataItemChanges.status);
    }
    let length = path.length;
    if (!recalcArray) recalcArray = [];
    for (let i = 0; i < length; i++) {
      status.forEach((key) => getByKey(recalcArray, [path.length, path2string(path, ['status'].concat(key))], {path: path.slice(), keyPath: ['status'].concat(key), checkValue: key != 'pending'}));
      path.pop();
    }
  }

  // countRecalc(state, changes);
  changesArray.forEach(changes => countRecalc(state, changes)); // fills recalcArray with values needed to recalculate

  if (recalcArray) {
    const newVals: any = {};
    for (let i = 0; i < recalcArray.length; i++) {
      const obj = recalcArray[recalcArray.length - i - 1];  // from bigger levels to smaller
      if (obj) {
        objKeys(obj).forEach((key) => {
          const {path, keyPath, checkValue} = obj[key];
          const lengths = keyPath[1] == 'pristine' && getIn(state, path.concat(SymbolData, 'array', 'lengths'));
          let result;
          if (lengths && lengths.current !== getValue(lengths, 'inital')) result = false;
          else {
            const keys = getKeysAccording2schema(state, path);  // get all keys to check
            result = checkValue;
            for (let j = 0; j < keys.length; j++) {
              if (getBindedValue(getIn(state, path.concat(keys[j], SymbolData, 'controls')), 'omit')) continue; // skip value if omit key is true
              let pathString = path2string(path.concat(keys[j]), keyPath);
              let value = newVals.hasOwnProperty(pathString) ? newVals[pathString] : utils.get(state, pathString);
              if (value === !checkValue) {
                result = !checkValue;
                break;
              } else if (value === null) result = null; // && result !== !checkValue - not needed, as we have break when set result = !checkValue
            }
          }
          addChangeData.push({path, keyPath, value: result});
          newVals[path2string(path, keyPath)] = result;
        })
      }
    }
  }
  return addChangeData;
});

function getKeysAccording2schema(state: StateType, path: Path) {
  const data = getIn(state, path)[SymbolData];
  let keys: string[] = [];
  if (data.schemaData.type == 'array') for (let j = 0; j < getValue(data.array.lengths); j++) keys.push(j.toString());
  else keys = objKeys(getIn(state, path));
  return keys;

}


/////////////////////////////////////////////
//  Reducer
/////////////////////////////////////////////


function getRawValuesChanges(prevState: StateType = {}, nextState: StateType, opts: { SymbolDelete?: any } = {}) {
// gather changed values from state, undefined values are not removed
  const forceCheck = {};
  const data = nextState[SymbolData];
  // if (!data) return {replace: false};
  if (prevState[SymbolData] !== nextState[SymbolData]) {
    if (data.values) {
      if (data.schemaData.type == 'object' || data.schemaData.type == 'array') return {replace: true, values: data.values};
      return {replace: false, values: data.values};
    } else {
      if (data.array) RawValuesKeys.forEach(val => {
        let a = getIn(prevState, SymbolData, 'array', 'lengths', val) || 0;
        let b = getIn(nextState, SymbolData, 'array', 'lengths', val) || 0;
        for (let i = a; i < b; i++) forceCheck[i] = true  // we need to force check arrayItems on length increase, because it is possible that (prevState[key] === nextState[key])
      })
    }
  }
  const result = {};
  RawValuesKeys.forEach(val => result[val] = data.array ? [] : {});
  const replace = {};
  objKeys(nextState).forEach(key => {
    if (nextState[key] && (prevState[key] !== nextState[key] || forceCheck[key])) {
      const childResult = getRawValuesChanges(prevState[key], nextState[key], opts);
      let childValues = childResult['values'];
      if (childResult['replace']) replace[key] = childResult['replace'];
      let omit = getBindedValue(getIn(nextState[key], SymbolData, 'controls'), 'omit');
      RawValuesKeys.forEach(val => result[val] && (result[val][key] = omit ? opts.SymbolDelete : childValues[val]));
    }
  });
  if (data.array) RawValuesKeys.forEach(val => (result[val].length = Math.max(data.array.lengths[val] || 0, 0)));
  if (objKeys(replace).length) return {replace, values: result};
  return {replace: false, values: result};
}

function haveValues(schemaPart: JsonSchema) {
  return (schemaPart.type != 'object' && schemaPart.type != 'array') || (schemaPart.x && schemaPart.x.values);
}

function recursivelyResetValue(items: UpdateItem[], schema: any, keyPath: Path, value: any, track: Path = ['#']) {
  const schemaPart = getSchemaPart(schema, track);
  const haveVals = haveValues(schemaPart);
  if (haveVals) items.push({path: track, keyPath, value});
  else if (schemaPart.type === 'object') objKeys(schemaPart.properties || {}).forEach(key => recursivelyResetValue(items, schema, keyPath, value, track.concat(key)));
  else if (schemaPart.type === 'array') items.push({path: track, keyPath: ['array', 'lengths', keyPath[1]], value: 0});
}

function recursivelySetItems(items: UpdateItem[], schema: any, state: StateType, keyPath: Path, vals: any, track: Path = ['#'], forceSetLength: boolean = false) {
  let schemaPart;
  try {schemaPart = getSchemaPart(schema, track)} catch (e) {return}
  const haveVals = haveValues(schemaPart);  // if dataObjects has prop "values" it means that it has no children
  if (haveVals) { // if object have own values then update them
    //if (haveValues !== true) items.push({path: track, keyPath, value: undefined});  // add this item only for type == 'object' || type == 'array'
    items.push({path: track, keyPath, value: vals, opts: haveVals !== true ? {replace: makeSlice(track, SymbolData, keyPath, true)} : undefined}); // then set new value (set "replace" to true for track if values set for object or array)
  } else {
    if (isMergeable(vals)) {
      if (schemaPart.type == 'array' && vals.length !== undefined) {
        items.push({path: track, keyPath: ['array', 'lengths', keyPath[1]], value: vals.length});
        if (forceSetLength) setArrayLength(items, schema, state, track, makeSlice(keyPath[1], vals.length));
      }
      objKeys(vals).forEach(key => recursivelySetItems(items, schema, state, keyPath, vals[key], track.concat(key)));
    } else recursivelyResetValue(items, schema, keyPath, vals, track);
  }
}

function setArrayLength(items: UpdateItem[], schema: any, state: StateType, path: Path, newLengthsValue: { current?: number, inital?: number, 'default'?: number }) {
  //let newLengthsValue = getValueFromUpdateItemIfExists(['array', 'lengths'], item);
  const schemaPart = getSchemaPart(schema, path);
  const branch = getIn(state, path);
  const lengthFull = branch ? branch[SymbolData].array.lengths : basicLengths;
  let newLengthFull = merge(lengthFull, newLengthsValue);
  // if (newLengthFull.current === undefined) newLengthFull = merge(newLengthFull, {'current': getValue(newLengthFull, 'inital')});
  // objKeys(newLengthsValue).forEach(key => items.push(makeUpdateItem(path, ['array', 'lengths', key], newLengthFull[key])));
  let start = getMaxValue(lengthFull) || 0;
  let end = getMaxValue(newLengthFull) || 0;
  if (start < 0) start = 0;
  if (end < 0) end = 0;
  for (let i = start; i < end; i++) {
    let elemPath = path.concat(i);
    // console.time('makeStateFromSchema Hook');
    let newElem = makeStateBranch(schema, elemPath);
    // console.timeEnd('makeStateFromSchema Hook');
    items.push({path: elemPath, value: newElem.state, opts: {replace: makeSlice(elemPath, true)}});
    if (newElem.defaultValues) recursivelySetItems(items, schema, state, ['values', 'current'], newElem.defaultValues, elemPath, true);
    if (newElem.dataMap) items.push(makeUpdateItem([], newElem.dataMap));
  }
  for (let i = end; i < start; i++) items.push({path: path.concat(i), value: SymbolDelete});

  const arrayStartIndex = arrayStart(schemaPart); //; dataItem.array.arrayStartIndex;
  const newLength = getValue(newLengthFull);
  const minItems = schemaPart.minItems || 0;
  items.push({path: path, keyPath: ['array', 'canAdd'], value: (schemaPart.additionalItems !== false || newLength < arrayStartIndex) && (newLength < (schemaPart.maxItems || Infinity))});
  for (let i = Math.max(Math.min(getValue(lengthFull), newLength) - 1, 0); i < newLength; i++) {
    let elemPath = path.concat(i);
    if (i >= arrayStartIndex) {
      items.push(makeUpdateItem(elemPath, ['arrayItem', 'canUp'], arrayStartIndex < i));
      items.push(makeUpdateItem(elemPath, ['arrayItem', 'canDown'], (arrayStartIndex <= i) && (i < newLength - 1)));
    }
    if (i >= minItems) items.push(makeUpdateItem(elemPath, ['arrayItem', 'canDel'], i >= Math.min(arrayStartIndex, newLength - 1)));
  }
}

function setStateChanges(startState: StateType, action: SetItemsType) {// resultObject: PathValueResultType, stuff: actionStuffType, options = {}) {
  function makeSliceFromUpdateItem(item: UpdateItem) {
    return delIn(item.keyPath ? makeSlice(item.path, SymbolData, item.keyPath, item.value) : makeSlice(item.path, item.value), [SymbolData, 'rawValues']);
  }

  function mergeProcedure(prevState: StateType, newState: StateType) {
    changes = mergeState(prevState, newState, options4changes).changes;
    // state = mergeResult.state;
    // changes = mergeResult.changes;
    if (changes) allChanges.push(changes);
    return newState;
  }

  function apiHandler(item: UpdateItem) {
    let result: UpdateItem[] = [];
    if (item.path.length == 0 && item.keyPath && (item.keyPath[0] == 'rawValues')) {
      throw new Error('"rawValues" cannot be changed directly.');
      // } else if (item.keyPath && item.keyPath[0] == 'array' && item.keyPath[1] == 'lengths') {
      //   let newLengthsValue = getValueFromUpdateItemIfExists(['array', 'lengths'], item);
      //   setArrayLength(result, stuff.schema, state, item.path, newLengthsValue);
    } else if (item.keyPath && item.keyPath[0] == 'api') {
      if (item.keyPath[1] == 'array') {  // array operation
        if (item.keyPath[2] == 'add') {
          let num = item.keyPath[3] || 1;
          let lengthOld = Math.max(0, (getIn(state, item.path, SymbolData, 'array', 'lengths', 'current') || 0));
          result.push({path: item.path, keyPath: ['array', 'lengths', 'current'], value: lengthOld + num});
          if (!item.value) {

          }
          if (item.value) {
            if (!isArr(item.value)) throw new Error('Expected values to be passed as array.');
            for (let i = 0; i < num; i++) recursivelySetItems(result, stuff.schema, state, ['values', 'current'], item.value[i], item.path.concat(lengthOld + i)) // result.push({path: item.path.concat(lengthOld + i), keyPath: ['values', 'current'], value: item.value[i]});
          }
        }
      } else if (item.keyPath[1] == 'setRawValues') {
        if (items.length > 1) throw new Error('"setRawValues" must be executed lonely');
        result = makeItems4rawValues(item.value.prevRaw, item.value.newRaw, stuff.schema, state);
      } else if (item.keyPath[1] == 'arrayItem') {
        let path = item.path.slice();
        let op = item.keyPath[2];
        let opVal = item.value || 0;
        const from = parseInt(path.pop());
        let to = from;
        const min = get(state, path, SymbolData, 'array', 'arrayStartIndex'); // api.get(path.concat(SymbolData, 'array', 'arrayStartIndex'));
        const lengthFull = get(state, path, SymbolData, 'array', 'lengths'); //api.get(path.concat(SymbolData, 'array', 'lengths'));
        const max = getValue(lengthFull) - 1;
        if (op == 'up') to--;
        if (op == 'down') to++;
        if (op == 'first') to = min;
        if (op == 'last' || op == 'del') to = max;
        if (op == 'move') to = opVal;
        if (op == 'shift') to += opVal;
        if (to < min) to = min;
        if (to > max) to = max;

        const valuesNames = ['inital', 'default'];
        const fullValues = {};
        valuesNames.forEach(key => { // save inital and default values for moved array items
          fullValues[key] = [];
          let arr = getIn(state[SymbolData]['rawValues'][key], path);
          if (!arr) return;
          for (let i = Math.min(from, to); i <= Math.max(from, to); i++) arr.hasOwnProperty(i) && (fullValues[key][i] = arr[i]);
          fullValues[key].length = arr.length;
        });

        let stateObject = {};
        let arrayItems = {};
        for (let i = Math.min(from, to); i <= Math.max(from, to); i++) {
          stateObject[i] = getIn(state, path.concat(i));
          arrayItems[i] = stateObject[i][SymbolData].arrayItem; //delIn(stateObject[i][SymbolData].arrayItem, ['uniqId']); // save arrayItem values, except "uniqId"
        }
        stateObject = moveArrayElems(stateObject, from, to);
        objKeys(arrayItems).forEach(i => {
          stateObject[i] = merge(stateObject[i], makeSlice(SymbolData, 'arrayItem', arrayItems[i]))
        }); // restore arrayItem values

        if (op == 'del') stateObject[to] = undefined;

        const length2test = item.path.length - (item.path[0] == '#' ? 1 : 0);  // length2test can be smaller because of leading '#' in item.path (replace function receives path without leading '#')
        result.push({path, value: stateObject, opts: {replace: (path) => path.length === length2test}});  // instead of merge do replace of items
        if (op == 'del') result.push({path, keyPath: ['array', 'lengths', 'current'], value: max}); // max = current length - 1
        valuesNames.forEach(key => fullValues[key] && recursivelySetItems(result, stuff.schema, state, ['values', key], fullValues[key], path)) // restore inital and default values for moved array items

      } else if (item.keyPath[1] == 'setMultiply') {

      } else if (item.keyPath[1] == 'setExceptMultiply') {

      } else if (item.keyPath[1] == 'switch') {

      } else if (item.keyPath[1] == 'setHidden') {

      } else if (item.keyPath[1] == 'showOnly') {

      } else if (item.keyPath[1] == 'selectOnly') {

      } else if (item.keyPath[1] == 'showNselect') {

      }

    } else result.push(item);
    return result;
  }

  function applyHooksProcedure(items: UpdateItem[], hookType: string) {
    for (let j = 0; j < items.length; j++) {
      let moreItems = apiHandler(items[j]);
      for (let k = 0; k < moreItems.length; k++) {
        const item = moreItems[k];
        if (item.keyPath && !isObject(getIn(state, item.path))) continue;
        const changes: any = {};
        changes.before = [];
        changes.after = [];
        changes.item = [item];

        for (let i = 0; i < beforeMerge.length; i++) {
          let res = beforeMerge[i](state, item, utils, stuff.schema, data, hookType);
          if (!res) return false;
          if (isArr(res)) res = {after: res};
          ['before', 'after'].forEach(key => res[key] && push2array(changes[key], res[key]));
          if (res.skip) changes.item = [];
        }
        ['before', 'item', 'after'].forEach(key => {
          changes[key].forEach((item: UpdateItem) => {
            state = merge(state, makeSliceFromUpdateItem(item), item.opts || defaultMergeOpts)
          })
        });
      }
    }
    afterMergeProcedureState = mergeProcedure(afterMergeProcedureState, state);
    for (let i = 0; i < afterMerge.length; i++) {
      let res = afterMerge[i](state, allChanges, utils, stuff.schema, data, hookType);
      if (!res) return false; // all changes blocked
      res.forEach(item => state = merge(state, makeSliceFromUpdateItem(item), item.opts || defaultMergeOpts));
      afterMergeProcedureState = mergeProcedure(afterMergeProcedureState, state);
    }
    return true;
  }

  const {stuff, items, mergeOptions: defaultMergeOpts = {}} = action;
  const schemaDataObj = stuff.schema[SymbolData];
  const allChanges: StateType[] = [];
  let replaceRawValues: any;
  // Object.assign(options, );

  let mergeResult, changes: any, state = startState, data = {};
  let options4changes = merge(defaultMergeOpts, {diff: true});
  let afterMergeProcedureState = startState;
  const {afterMerge, beforeMerge} = stuff.hooks;

  // console.time('applyHooksProcedure beforeMap');
  if (!applyHooksProcedure(items, 'beforeMap')) return startState;
  // console.timeEnd('applyHooksProcedure beforeMap'); 

  let apllyItems = applyMap(state, allChanges, stuff);
  if (!apllyItems) return startState; // all changes blocked

  // console.time('applyHooksProcedure afterMap');
  if (!applyHooksProcedure(apllyItems, 'afterMap')) return startState;

  return state;
}

function applyMap(state: StateType, changesArray: StateType[], stuff: any): UpdateItem[] | false {
  let result: UpdateItem[] = [];

  function recurse(statePart: StateType, changes: StateType, track: Path = ['#']) {
    if (getIn(statePart, [SymbolData, 'dataMap'])) {
      let dataObj = statePart[SymbolData];
      const trackString = path2string(track);
      objKeysNSymb(dataObj['dataMap']).forEach((keyPathFrom: any) => {
        let mapTo = dataObj['dataMap'][keyPathFrom];
        let value = keyPathFrom === SymbolBranch ? statePart : getIn(dataObj, string2path(keyPathFrom)); // SymbolBranch means that we want to map branch, if we want to map dataObject keyPathFrom = ''
        let from = makePathItem(keyPathFrom === SymbolBranch ? track : path2string(track) + '/@/' + keyPathFrom);
        objKeys(mapTo).forEach(key => {
          let valueFn = mapTo[key];
          let to = makePathItem(key, track);
          if (keyPathFrom === SymbolBranch && to.keyPath) delete to.keyPath; // don't alow to map branch into data object 
          //(to as UpdateItem).value = valueFn ? valueFn.bind({state, from, to, utils})(value) : value;
          //result.push((to as UpdateItem));
          let res = value;
          if (valueFn) res = valueFn.bind({state, from, to, utils, api: stuff.api})(value);
          if (res instanceof UpdateItems) push2array(result, res.items);
          else {
            (to as UpdateItem).value = res;
            result.push((to as UpdateItem));
          }
        });
      });
    }
    if (isObject(changes)) objKeys(changes).forEach((key) => recurse(statePart[key], changes[key], track.concat(key)));
  }

  changesArray.forEach(changes => recurse(state, changes));
  return result
}

function makeItems4rawValues(rawValues: any, newRawValues: any, schema: any, state: StateType) {
  let result: UpdateItem[] = [];
  objKeys(newRawValues).forEach(key => {
    let changes = mergeState(rawValues[key], newRawValues[key], {arrays: 'merge', diff: true, replace: isReplaceable(schema)}).changes;
    if (changes) recursivelySetItems(result, schema, state, ['values', key], changes)
  });
  return result
}

const getValsFromSchema: any = memoize(function (schema: JsonSchema, empty: boolean = false) {
  return getRawValuesChanges({}, makeStateFromSchema(schema).state).values[empty ? 'inital' : 'default']; // inital is allways empty
});

function rawValuesReplaceable(schema: JsonSchema) {
  let fn = isReplaceable(schema);
  return (path: Path) => path.length ? fn(path.slice(1)) : false;
}

const getEmptyRawValsForSchema: any = memoize(function (schema: JsonSchema) {
  const obj = getValsFromSchema(schema, true);
  return {current: obj, inital: obj, 'default': obj};
});

function restoreStructure(obj: any, example: any) {
  if (!isObject(example)) return obj;
  let changes: any = {};
  objKeys(example).forEach(key => {
    if (!obj.hasOwnProperty(key)) {
      changes[key] = example[key];
    } else if (isObject(example[key])) {
      let res = restoreStructure(obj[key], example[key]);
      if (obj[key] !== res) changes[key] = res;
    }
  });
  if (!objKeys(changes).length) return obj;
  else return Object.assign({}, obj, changes);
}

function getUpdatedRawValues(rawValues: any, prevState: StateType, nextState: StateType, stuff: any, replaceRawValues?: any) {
  const {schema, apiOpts} = stuff;
  let rawValuesChanges = getRawValuesChanges(prevState, nextState).values;
  if (replaceRawValues && objKeys(replaceRawValues).length < 3) replaceRawValues = restoreStructure(Object.assign({}, rawValues, replaceRawValues), getEmptyRawValsForSchema(schema));
  let newRawValues = merge(replaceRawValues ? replaceRawValues : rawValues, rawValuesChanges, {replace: rawValuesReplaceable(schema), arrays: 'merge'});
  const inital = getValue(newRawValues, 'inital');
  if (apiOpts.keepEqualRawValues && nextState[SymbolData].status.pristine && newRawValues.current !== inital) {
    const schemaPart = getSchemaPart(schema, []);
    // if rawValues.current is object then it will be replaced only if deep equal with rawValues.inital (schemaPart.additionalProperties ignored and used only in validation)
    if (schemaPart.type == 'object' && isEqual(newRawValues.current, inital, {deep: true})) { // {skipKeys: objKeys(schemaPart.properties)})) {
      newRawValues = Object.assign({}, newRawValues);
      newRawValues.current = inital;
    } else if (schemaPart.type == 'array') {  // additional items (except for numeric keys, of couse) not supported by arrays, so simply replace if status.pristine == true
      newRawValues = Object.assign([], newRawValues);
      newRawValues.current = inital;
    }
  }
  return newRawValues;
}

function makeValidation(state: any, dispath: any, action: any): Promise<void> {

  function addValidatorResult2message(srcMessages: any, track: Path, result?: MessageData | { [key: string]: MessageData }, defLevel = 0) {
    function conv(item: MessageLevelType | string): MessageLevelType {
      return (typeof item === 'object') ? item : {level: defLevel, text: item};
    };
    const colors = ['', 'success', 'warning', 'danger'];  // in order of importance, higher index owerwrite lower
    if (isObject(result)) objKeys(result as any).forEach((key) => addValidatorResult2message(srcMessages, track.concat(key), (result as any)[key], defLevel));
    else {
      let messages: MessageLevelType[] = isArr(result) ? (result as any).map(conv) : [conv(result as any)];
      messages.forEach((item) => {
        let {level, text, path, replace, type = 'danger', ...rest} = item;
        path = track.concat((typeof path === 'string' ? string2path(path) : path) || []);
        const fullPath = path2string(path, ['messages', level]);
        let mData = getByKey(srcMessages, fullPath, {textArray: []});
        mData = getByKey(validationMessages, fullPath, mData);
        if (text) {
          if (replace === undefined) mData.textArray.push(text);
          else mData.textArray[replace] = text;
        }
        Object.assign(mData, rest);
        const shortPath = path2string(path);
        if (type == 'danger') {
          let valid = validStatus[shortPath];
          if ((isUndefined(valid) || valid || mData.textArray.length)) validStatus[shortPath] = !mData.textArray.length; // "false" overwrite null, true, undefined and never owerwritten
        } // "null" owerwrites true, undefined and owerwritten by false, "true" owerwrites undefined and owerwritten by false and null
        if (isUndefined(colorStatus[shortPath])) colorStatus[shortPath] = '';
        if (mData.textArray.length && (colors.indexOf(colorStatus[shortPath]) < colors.indexOf(type))) colorStatus[shortPath] = ~colors.indexOf(type) ? type : '';
      });
    }
  }

  function recurseValidation(curValues: StateType, modifiedValues: StateType, track: Path = []) {
    const data = getIn(state, track.concat([SymbolData]));
    //console.log('recurseValidation track', track);
    //console.log('objKeys(modifiedValues)', modifiedValues);
    if (!data) return;
    const schemaPart = getSchemaPart(schema, track);

    if ((schemaPart.type == 'object' || schemaPart.type == 'array') && !getIn(schemaPart, ['x', 'values']))
      modifiedValues && objKeys(modifiedValues).forEach(key => recurseValidation(curValues[key], modifiedValues[key], track.concat(key)));

    let x = schemaPart.x;
    if (x && x.validators) {
      x.validators.forEach((validator: any) => {
        let result = validator({utils, state: state, path: track, schemaPart, schema}, curValues);
        // if (!result) return;
        if (result && result.then && typeof result.then === 'function') { //Promise
          result.vData = {curValues, path: track};
          vPromises.push(result);
          pendingStatus[path2string(track)] = true;
        } else addValidatorResult2message(validationMessages, track, result, 1)
      })
    }
  }

  function getUpdateItems4Messages() {
    objKeys(validationMessages).forEach(pathString => {
      let item = makePathItem(pathString);
      (item as UpdateItem).value = validationMessages[pathString];
      validationUpdates.push(item as UpdateItem)
    });
    objKeys(validStatus).forEach(pathString => validationUpdates.push({path: string2path(pathString), keyPath: ['status', 'valid'], value: validStatus[pathString]}));
    objKeys(pendingStatus).forEach(pathString => validationUpdates.push({path: string2path(pathString), keyPath: ['status', 'pending'], value: pendingStatus[pathString]}));
    objKeys(colorStatus).forEach(pathString => validationUpdates.push({path: string2path(pathString), keyPath: ['status', 'color'], value: colorStatus[pathString]}));
    return validationUpdates;
    // if (validationUpdates.length) dispath({
    //   type: actionName4setItems,
    //   items: validationUpdates,
    //   stuff,
    // });
  }

  function clearDefaultMessages(modifiedValues: StateType, track: Path = []) {

    const data = getIn(state, track.concat([SymbolData]));
    if (!data) return;
    if (data.schemaData.type == 'object' || data.schemaData.type == 'array')
      modifiedValues && objKeys(modifiedValues).forEach(key => clearDefaultMessages(modifiedValues[key], track.concat(key)));
    addValidatorResult2message(validationMessages, track); // sets empty array for 0-level messages
  }

  let {stuff, force, opts, promises} = action;
  const schemaDataObj = stuff.schema[SymbolData];
  const {JSONValidator, schema, getState} = stuff;

  // const state = getState();
  const currentValues = state[SymbolData]['rawValues'].current; // getRawValues().current;
  // const newValues = state[SymbolData]['rawValues'].current;
  let validStatus = {};
  let pendingStatus = {};
  let colorStatus = {};
  let validationMessages: any = {};
  let validationUpdates: UpdateItem[] = [];
  const vPromises: any[] = [];

  const modifiedValues = force === true ? currentValues : force; //
  if (!modifiedValues || objKeys(modifiedValues).length == 0) {
    promises.resolve();
    promises.vAsync.resolve();
    return state;
  }  // no changes, no validation

  clearDefaultMessages(modifiedValues);
  let errs = JSONValidator(currentValues);
  errs.forEach((item: any) => addValidatorResult2message(validationMessages, item[0], item[1])); // Validate, using JSONSchemaValidator;
  recurseValidation(currentValues, modifiedValues);
  let items = getUpdateItems4Messages();
  let mergeOptions = {arrays: 'merge'};
  state = setStateChanges(state, {items, stuff, type: actionName4setItems, mergeOptions});
  promises.resolve();
  if (vPromises.length) {
    validationMessages = {};
    validStatus = {};
    validationUpdates = [];
    Promise.all(vPromises).then((results) => {
      let newValues = getState()[SymbolData]['rawValues'].current; //getRawValues().current;
      for (let i = 0; i < vPromises.length; i++) {
        if (!results[i]) continue;
        let {curValues, path} = vPromises[i].vData;
        if (curValues == getIn(newValues, path)) {
          addValidatorResult2message(validationMessages, path, results[i], 2);
          pendingStatus[path2string(path)] = false;
        }
      }
      let items = getUpdateItems4Messages();
      dispath({type: actionName4setItems, items, stuff, mergeOptions});
      promises.vAsync.resolve();
    }).catch(reason => promises.vAsync.reject(reason))
  } else promises.vAsync.resolve();
  return state;
}

function execActions(dispath: any) {
  // console.time('execActions');

  let {actions, stuff, forceValidation, opts, promises} = this;
  let {getState, schema} = stuff;
  let state = getState();
  let prevState = state;
  let rawValues = getIn(prevState, SymbolData, 'rawValues') || {};
  let prevRawValues = rawValues;
  // console.log(actions);
  for (let i = 0; i < actions.length; i++) {
    let action = actions[i];
    if (action.state) { // replace state, rawValues too, expecting state to be validated, don't use it for inital set
      state = action.state;
      rawValues = getIn(prevState, SymbolData, 'rawValues');
      if (!rawValues) rawValues = getUpdatedRawValues(rawValues, prevState, state, stuff); // inital rawValues build, validaion needed
      else prevRawValues = rawValues; // if raw values already present then skip validation
    } else {
      if (action.items) state = setStateChanges(state, {items: action.items, stuff, type: actionName4setItems}); // dispath(actionUpdateState(action.items, stuff));
      //else if (action.rawValues) state = setStateChanges(state, {items: makeItems4rawValues(rawValues, action.rawValues, schema, state), stuff, type: actionName4setItems}); // dispath(actionUpdateState(makeItems4rawValues(rawValues, action.rawValues, schema), stuff));
      else if (action.rawValues) state = setStateChanges(state, {items: [{path: [], keyPath: ['api', 'setRawValues'], value: {prevRaw: rawValues, newRaw: action.rawValues}}], stuff, type: actionName4setItems}); // dispath(actionUpdateState(makeItems4rawValues(rawValues, action.rawValues, schema), stuff));
      rawValues = getUpdatedRawValues(rawValues, prevState, state, stuff, action.rawValues);
    }
    prevState = state;
  }

  if (prevRawValues !== rawValues) state = merge(state, makeSlice(SymbolData, 'rawValues', rawValues), {replace: makeSlice(SymbolData, 'rawValues', true)});

  if (opts.noValidation) {
    promises.resolve();
    promises.vAsync.resolve();
  } else {
    let force = forceValidation === true ? true : merge(forceValidation || {}, mergeState(prevRawValues['current'], rawValues['current']).changes);
    state = makeValidation(state, dispath, {force, stuff, opts, promises})
  }
  dispath({type: actionNameReplaceState, state, stuff});

  // console.timeEnd('execActions');
  return promises;

}

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

  reducersFunction[actionName4setItems] = (state: any, action: SetItemsType): any => {
    if (action.stuff.name) return replaceFormState(state, action.stuff.name, setStateChanges(state[action.stuff.name], action));
    return setStateChanges(state, action);
  };

  reducersFunction[actionNameReplaceState] = (state: any, action: any): any => {
    if (action.stuff.name) return replaceFormState(state, action.stuff.name, action.state);
    return action.state
  };

  // reducersFunction[actionNameSetRawValues] = (state: any, action: SetRawValuesType): any => {
  //   return merge(state, makeSlice(SymbolData, 'rawValues', action.rawValues), {replace: makeSlice(SymbolData, 'rawValues', true)});
  // };

  return (state: any = {}, action: ActionType) => {
    let reduce = reducersFunction[action.type];
    return reduce ? reduce(state, action) : state;
  }
}


/////////////////////////////////////////////
//  API
/////////////////////////////////////////////


function apiCreator(schema: JsonSchema, name: string, dispath: any, getState: () => StateType, setState: (state: any) => any, keyMap: any, hooks: HooksObjectType, JSONValidator: any, apiOpts: APICreateOptsType): FormApi {
  let api: any = {};
  let noExec = 0;
  let apiResultPromises: any;
  let items: UpdateItem[] = [];
  let batchedActions: any[] = [];
  let forceValidation: StateType | boolean = false;
  let dispathAction: (action: any) => Promise<void> = dispath;
  let defferedTimerId: any;
  let stateChanges = new Map();
  // let rawValues = {};
  const APIDefaultOpts = {execute: true};
  const stuff = {JSONValidator, hooks, getState, schema, name, keyMap, api, apiOpts};
  api.getState = getState;

  function apiPromises(reset?: true): apiPromises {
    if (reset) apiResultPromises = null;
    if (!apiResultPromises) {
      apiResultPromises = new exoPromise();
      apiResultPromises.vAsync = new exoPromise();
    }
    return apiResultPromises;
  }

  function clearActions() {
    defferedTimerId = null;
    forceValidation = false;
    items = [];
    stateChanges.clear();
    batchedActions = [];
    apiPromises(true);
  }

  function execBatch(actions: any[], items: UpdateItem[], opts: APIOptsType, promises: any, forceValidation: StateType | boolean) {
    if (items.length) actions.push({items});
    clearActions();
    dispath(actionExecActions(actions, stuff, forceValidation, opts, promises));
    return promises;
  }

  function setExecution(addItems: any, opts: APIOptsType = APIDefaultOpts) {
    if (addItems.length) push2array(items, addItems);
    // console.log('---------------- added items', items);
    if (opts.force === true && noExec > 0) noExec--;
    let promises = apiPromises();
    if (opts.execute === false || noExec) return promises;
    if (defferedTimerId) clearTimeout(defferedTimerId);
    if (opts.returnItems && opts.execute === true) {
      let result = items;
      clearActions();
      return result;
    }
    if (typeof opts.execute == 'number') {
      if (opts.execute > 0) defferedTimerId = setTimeout(execBatch.bind(null, batchedActions, items, opts, promises, forceValidation), opts.execute)
    } else execBatch(batchedActions, items, opts, promises, forceValidation);
    return promises;
  }

  api.getStateChanges = (state: any) => {
    if (!stateChanges.has(state)) stateChanges.set(state, mergeState(getState(), state, {diff: true}).changes);
    return stateChanges.get(state);
  };

  api.noExec = () => {noExec++;};

  api.execute = (opts: (APIOptsType) = {execute: true}) => {
    return setExecution([], opts);
  };

  api.replaceState = (state: StateType, opts: APIOptsType = APIDefaultOpts) => {
    // if (items.length) batchedActions.push({items});
    // batchedActions.push({state});
    items = [];
    batchedActions = [{state}];
    return setExecution([], opts);
  };

  api.validate = (forceValidate: boolean | StateType | string[] | string = true, opts: APIOptsType = APIDefaultOpts) => {
    if (forceValidate === false) forceValidation = false;
    else if (forceValidation !== true) {
      if (typeof forceValidate === 'string') forceValidate = [forceValidate];
      if (isArr(forceValidate)) {
        let result = {};
        forceValidate.forEach(value => getByKey(result, string2path(value)));
        forceValidate = result;
      }
      if (forceValidate === true) forceValidation = true;
      else forceValidation = merge(forceValidation || {}, forceValidate);
    }
    return setExecution([], opts);
  };

  api.get = (...pathes: Array<string | Path>): any => get(getState(), ...pathes);

  api.set = (path: string | Path, value: any, opts: APIOptsType & { replace?: boolean } = APIDefaultOpts) => {
    let item = makeUpdateItem(path, value);
    if (opts.replace) item.opts = {replace: makeSlice(val2path(path), true)};
    return setExecution([item], opts);
  };

  api.setMultiply = (path: string | Path, value: any, opts: APIOptsType & { skipFields?: string[] } = APIDefaultOpts) => {
    let items: PathItem[] = makeArrayOfPathItem(path);
    if (opts.skipFields) items = items.filter(item => !(~(opts as any).skipFields.indexOf(item.path[item.path.length - 1])));
    items.forEach(item => (item as UpdateItem).value = value);
    return setExecution(items, opts);
  };

  api.setExceptMultiply = (path: string | Path, value: any, opts: APIOptsType & { skipFields?: string[] } = APIDefaultOpts) => {
    let items: PathItem[] = makeArrayOfPathItem(path);
    const obj: any = {};
    const result: UpdateItem[] = [];
    items.forEach(item => {
      let key = item.path.slice(0, -1).concat(item.keyPath ? push2array(['@'], item.keyPath) : []).join('/');
      if (!obj[key]) obj[key] = [];
      obj[key].push(item.path[item.path.length - 1]);
    });
    const state = (opts.getState || getState)();
    objKeys(obj).forEach(pathString => {
      const pathItem = makePathItem(pathString);
      let keys = getKeysAccording2schema(state, pathItem.path); // objKeys(getIn());
      obj[pathString].forEach((key2del: string) => ~keys.indexOf(key2del) && keys.splice(keys.indexOf(key2del), 1));
      keys.forEach(key => result.push({path: pathItem.path.concat(key), keyPath: pathItem.keyPath, value}))
    });
    items = result;
    if (opts.skipFields) items = items.filter(item => !(~(opts as any).skipFields.indexOf(item.path[item.path.length - 1])));
    return setExecution(items, opts);
  };

  api.getValues = (opts: APIOptsType & { valueType?: 'current' | 'inital' | 'default', flatten?: boolean } = {}): any => {
    let rawValues = (opts.getState || getState)()[SymbolData]['rawValues'];
    if (opts.valueType) return opts.flatten ? keyMap.flatten(rawValues[opts.valueType]) : rawValues[opts.valueType];
    if (!opts.flatten) return rawValues;
    let res = {};
    objKeys(rawValues).forEach(key => res[key] = keyMap.flatten(rawValues[key]));
    return res;
  };

  api.setValues = (vals: any, opts: APIOptsType & { valueType?: 'current' | 'inital' | 'default', flatten?: boolean } = APIDefaultOpts) => {
    let properRawValues = {};
    if (opts.valueType) properRawValues[opts.valueType] = vals;
    else properRawValues = vals;
    if (opts.flatten) objKeys(properRawValues).forEach(key => properRawValues[key] = keyMap.unflatten(properRawValues[key]));
    if (items.length) batchedActions.push({items});
    items = [];
    batchedActions.push({rawValues: properRawValues});
    return setExecution([], opts);
  };

  api.getActive = () => api.get([[], ['active']]);

  api.arrayOps = (path: string | Path, op = 'add', opts: APIOptsType & { num?: number, values?: any[] } = APIDefaultOpts) => {
    return setExecution([makeUpdateItem(val2path(path), ['api', 'array', op, opts.num || 1], opts.values)], opts);
  };

  api.arrayItemOps = (path: string | Path, op: 'up' | 'down' | 'first' | 'last' | 'del' | 'move' | 'shift', opts: APIOptsType & { value?: number } = APIDefaultOpts) => {
    return setExecution([makeUpdateItem(val2path(path), ['api', 'arrayItem', op], opts.value || 0)], opts);
  };

  api.setHidden = (path: string, value = true, opts: APIOptsType = APIDefaultOpts) => {
    const items: UpdateItem[] | PathItem[] = makeArrayOfPathItem(path);
    items.forEach(item => {
      (item as UpdateItem).value = value;
      (item as UpdateItem).keyPath = ['controls', 'hidden'];
    });
    //return dispathAction(actionSetItems(items, stuff, false));
    return setExecution(items, opts);
  };

  api.showOnly = (path: string, opts: APIOptsType & { skipFields?: string[] } = APIDefaultOpts) => {
    let opts4sub = merge(opts, {execute: 0});
    let promise = api.setMultiply(path + '/@/controls/hidden', false, opts4sub);
    promise = api.setExceptMultiply(path + '/@/controls/hidden', true, opts4sub);
    return setExecution([], opts);
  };

  api.selectOnly = (path: string, opts: APIOptsType & { skipFields?: string[] } = APIDefaultOpts) => {
    let opts4sub = merge(opts, {execute: 0});
    let promise = api.setMultiply(path + '/@/controls/omit', false, opts4sub);
    promise = api.setExceptMultiply(path + '/@/controls/omit', true, opts4sub);
    return setExecution([], opts);
  };

  api.selectNshow = (path: string, opts: APIOptsType & { skipFields?: string[] } = APIDefaultOpts) => {
    let opts4sub = merge(opts, {execute: 0});
    api.showOnly(path, opts4sub);
    api.selectOnly(path, opts4sub);
    return setExecution([], opts);
  };

  return api
}

export {getFRVal, apiCreator, getRawValuesChanges, formReducer, getValsFromSchema, Hooks}

export {getValueFromUpdateItemIfExists}