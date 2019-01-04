import {getCreateIn, setIn, hasIn, getIn, isEqual, isMergeable, isObject, makeSlice, memoize, merge, objKeysNSymb, push2array} from "./commonLib";
import {objKeys, isArray, isUndefined, moveArrayElems} from "./commonLib";
import {number} from "prop-types";

const SymData: any = Symbol.for('FFormData');
const SymDataMapTree: any = Symbol.for('FFormDataMapTree');
const SymDataMap: any = Symbol.for('FFormDataMap');
// const SymBranch: any = Symbol.for('FFormBranch');
const SymReset: any = Symbol.for('FFormReset');
const SymClear: any = Symbol.for('FFormClear');
const SymDelete = undefined; // Symbol.for('FFormDelete'); // 
// const _rawValuesKeys = ['current', 'inital', 'default'];


const symConv: any = function (key: any, anotherKey?: any) {
  if (!isUndefined(anotherKey)) {
    symConv._data[key] = anotherKey;
    symConv._data[anotherKey] = key;
  } else return symConv._data[key]
};

symConv._data = {'#': ''};
symConv.sym2str = (sym: any) => typeof sym == 'symbol' && !isUndefined(symConv(sym)) ? symConv(sym) : sym;
symConv.str2sym = (str: any) => typeof str == 'string' && !isUndefined(symConv(str)) ? symConv(str) : str;

symConv('@', SymData);

class stateUpdates {  // used for passing stateUpdates instead of value in dataMap hook
  constructor(items: any) {
    this[SymData] = items;
  }
}

const types: any = {};

types.any = () => true;
types.null = (value: any) => value === null;
types.boolean = (value: any) => typeof value === "boolean";
types.array = (value: any) => isArray(value);
types.object = (value: any) => typeof value === "object" && value && !isArray(value);// isObject(value);  //
types.number = (value: any) => typeof value === "number";
types.integer = (value: any) => typeof value === "number" && (Math.floor(value) === value || value > 9007199254740992 || value < -9007199254740992);
types.string = (value: any) => typeof value === "string";


/////////////////////////////////////////////
//  Macros
/////////////////////////////////////////////

function getBindedMaps2update(branch: StateType, path: Path = []) {
  const maps2disable: DataMapStateType[] = getIn(branch, SymDataMapTree, SymData) || [];
  const maps2enable = maps2disable.map((map => merge(map, {emitter: path})));
  objKeys(branch).forEach(key => {
    let result: any;
    if (branch[key]) result = getBindedMaps2update(branch[key], path.concat(key));
    push2array(maps2disable, result.maps2disable);
    push2array(maps2enable, result.maps2enable);
  });
  return {maps2disable, maps2enable}
}

const Macros: { [key: string]: any } = {};

Macros.array = (state: StateType, schema: jsJsonSchema, UPDATABLE_object: PROCEDURE_UPDATABLE_objectType, item: NormalizedUpdateType) => {
  let path = item.path;
  let length = getUpdValue([UPDATABLE_object.update, state], path, SymData, 'length');
  if (isArray(item.value)) {
    let mergeArrayObj: any = [];
    let replaceArrayObj: any = {};
    for (let i = 0; i < item.value.length; i++) {
      mergeArrayObj[length + i] = item.value[i];
      replaceArrayObj[length + i] = getIn(item.replace, i);
    }
    mergeArrayObj.length = length + item.value.length;
    return updateCurrentRecursively(state, schema, UPDATABLE_object, mergeArrayObj, replaceArrayObj, path)
  } else {
    length += item.value || 1;
    return updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(path, ['length'], length));
  }
};

Macros.arrayItem = (state: StateType, schema: jsJsonSchema, UPDATABLE_object: PROCEDURE_UPDATABLE_objectType, item: NormalizedUpdateType) => {
  let path = item.path;
  let op = item.op;
  let opVal = item.value || 0;
  const from = parseInt(path.pop());
  let to = from;
  const min = arrayStart(getSchemaPart(schema, path, oneOfFromState(state))); // api.get(path.concat(SymData, 'array', 'arrayStartIndex'));
  const length = getUpdValue([UPDATABLE_object.update, state], path, SymData, 'length');
  const max = length - 1;
  if (op == 'up') to--;
  if (op == 'down') to++;
  if (op == 'first') to = min;
  if (op == 'last' || op == 'del') to = max;
  if (op == 'move') to = opVal;
  if (op == 'shift') to += opVal;
  if (to < min) to = min;
  if (to > max) to = max;

  let stateObject = {};
  let arrayItems = {};
  let dataMaps = {};
  let currentObject: any = {};
  let updObj: any[] = [];
  updObj[0] = getIn(UPDATABLE_object.update, path);
  updObj[1] = getIn(UPDATABLE_object.update, SymData, 'current', path);
  updObj[2] = getIn(UPDATABLE_object.replace, path);
  updObj[3] = getIn(UPDATABLE_object.replace, SymData, 'current', path);


  for (let i = Math.min(from, to); i <= Math.max(from, to); i++) {
    stateObject[i] = getIn(state, path, i);
    arrayItems[i] = stateObject[i][SymData].arrayItem; //delIn(stateObject[i][SymData].arrayItem, ['uniqId']); // save arrayItem values, except "uniqId"
    //dataMaps[i] = stateObject[i][SymDataMapTree];
    currentObject[i] = getIn(state, SymData, 'current', path, i);
    updObj.forEach(obj => isMergeable(obj) && !obj.hasOwnProperty(i) && (obj[i] = SymClear));
  }
  stateObject = moveArrayElems(stateObject, from, to);
  currentObject = moveArrayElems(currentObject, from, to);
  const {maps2disable, maps2enable} = getBindedMaps2update(stateObject, path);
  updObj.forEach(obj => {
    if (!isMergeable(obj)) return;
    moveArrayElems(obj, from, to);
    for (let i = Math.min(from, to); i <= Math.max(from, to); i++) {
      if (obj[i] === SymClear) delete obj[i];
    }
  });

  objKeys(stateObject).forEach(i => {
    stateObject[i] = merge(stateObject[i], makeSlice(SymData, 'arrayItem', arrayItems[i]), {replace: makeSlice(SymData, 'arrayItem', true)});
    //stateObject[i] = merge(stateObject[i], makeSlice(SymDataMapTree, dataMaps[i]), {replace: makeSlice(SymDataMapTree, true)});
  }); // restore arrayItem values and dataMap

  const length2test = 1 + item.path.length - (item.path[0] == '#' ? 1 : 0);  // length2test can be smaller because of leading '#' in item.path (replace function receives path without leading '#')
  state = merge(state, makeSlice(path, stateObject), {replace: (path: Path) => path.length === length2test});
  state = merge(state, makeSlice(SymData, 'current', path, currentObject), {replace: (path: Path) => path.length === length2test + 2});
  if (op == 'del') state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(path, ['length'], max));
  state = mergeStatePROCEDURE(state, UPDATABLE_object);
  state = setDataMapInState(state, schema, maps2disable, true);
  state = setDataMapInState(state, schema, maps2enable);
  return state
};

Macros.switch = (state: StateType, schema: jsJsonSchema, UPDATABLE_object: PROCEDURE_UPDATABLE_objectType, item: NormalizedUpdateType) => {
  let keyPath = item[SymData] || [];
  let switches = makeSlice(keyPath, item.value);
  object2PathValues(switches).forEach(pathValue => state = recursivelyUpdate(state, schema, UPDATABLE_object, makeNUpdate(item.path, pathValue, pathValue.pop())));
  return state
};

Macros.setExtraStatus = (state: StateType, schema: jsJsonSchema, UPDATABLE_object: PROCEDURE_UPDATABLE_objectType, item: NormalizedUpdateType) => {
  const keyPath = item[SymData] || [];
  let prevVal = getUpdValue([UPDATABLE_object.update, state], item.path, SymData, keyPath);
  let value = item.value > 0;
  if (!prevVal == value) {
    state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(item.path, keyPath, value));
    state = Macros.setStatus(state, schema, UPDATABLE_object, makeNUpdate(item.path, ['status', keyPath[keyPath.length - 1]], value ? 1 : -1));
  }
  return state
};

// todo: make SymReset processing
Macros.setStatus = (state: StateType, schema: jsJsonSchema, UPDATABLE_object: PROCEDURE_UPDATABLE_objectType, item: NormalizedUpdateType) => {
  const keyPath = item[SymData] || [];
  if (keyPath.length > 2) return Macros.setExtraStatus(state, schema, UPDATABLE_object, item);
  let op = keyPath[1];
  if (!op) return state;
  if (op == 'valid' || op == 'pristine' || op == 'touched') throw new Error('Setting "' + op + '" directly is not allowed');

  let prevVal = getUpdValue([UPDATABLE_object.update, state], item.path, SymData, keyPath);
  const selfManaged = isSelfManaged(state, item.path);

  if (op == 'untouched' && prevVal == 0 && !selfManaged) return state;  // stick "untouched" to zero for objects and arrays
  let value = prevVal + item.value;
  if (selfManaged && value > 1) value = 1;
  if (value < 0) value = 0;
  state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(item.path, ['status', op], value));
  if (!isTopPath(item.path) && (!prevVal != !value)) //(prevVal && !value || !prevVal && value)) 
    state = Macros.setStatus(state, schema, UPDATABLE_object, makeNUpdate(item.path.slice(0, -1), keyPath, value > 0 ? 1 : -1));

  return state
};

Macros.setCurrent = (state: StateType, schema: jsJsonSchema, UPDATABLE_object: PROCEDURE_UPDATABLE_objectType, item: NormalizedUpdateType) => {
  return updateCurrentRecursively(state, schema, UPDATABLE_object, item.value, item.replace, item.path, item.setOneOf)
};

Macros.setOneOf = (state: StateType, schema: jsJsonSchema, UPDATABLE_object: PROCEDURE_UPDATABLE_objectType, item: NormalizedUpdateType) => {
  let oldOneOf = getIn(state, item.path, SymData, 'oneOf');
  if (oldOneOf == item.value) {
    if (!isUndefined(item.setValue)) state = updateCurrentRecursively(state, schema, UPDATABLE_object, item.setValue, false, item.path);
    return state;
  }
  const {macros, ...newItem} = item;
  if (isUndefined(newItem.setValue)) {
    state = mergeStatePROCEDURE(state, UPDATABLE_object);
    newItem.setValue = getIn(state, SymData, 'current', item.path);
  }
  return updateStatePROCEDURE(state, schema, UPDATABLE_object, newItem);
};


/////////////////////////////////////////////
//  End Macros
/////////////////////////////////////////////


const schemaStorage = memoize(function (schema: jsJsonSchema) { // object that used to store and cache data for schema without modifying schema itself  
  return {};
});

function isTopPath(path: Path) {
  return path.length == 0 || path.length == 1 && path[0] == '#';
}

function recursivelyUpdate(state: StateType, schema: jsJsonSchema, UPDATABLE_object: PROCEDURE_UPDATABLE_objectType, item: NormalizedUpdateType) {
  state = updateStatePROCEDURE(state, schema, UPDATABLE_object, item);
  const keys = branchKeys(getIn(state, item.path));
  keys.forEach(key => state = recursivelyUpdate(state, schema, UPDATABLE_object, merge(item, {path: item.path.concat(key)})));
  return state
};

function oneOfFromState(state: StateType | Function): (path: Path) => number {
  if (typeof state == 'function') return (path: Path) => getIn(state(), path, SymData, 'oneOf');
  return (path: Path) => getIn(state, path, SymData, 'oneOf')
}

function oneOfStructure(state: StateType | Function, path: Path) { // makes object than copies the structure of state[SymData].oneOf limited to path
  if (typeof state == 'function') state = state();
  const result = {};
  let tmp = result;
  setIn(tmp, getIn(state, SymData, 'oneOf'), SymData, 'oneOf');
  for (let i = 0; i < path.length; i++) {
    if (!path[i] || path[i] == '#') continue;
    tmp[path[i]] = {};
    tmp = tmp[path[i]];
    state = getIn(state, path[i]);
    setIn(tmp, getIn(state, SymData, 'oneOf'), SymData, 'oneOf');
  }
  //return result
  const fn = function (path: Path, oneOf?: number) {return isUndefined(oneOf) ? getIn(result, path, SymData, 'oneOf') : setIn(result, oneOf, path, SymData, 'oneOf')};
  fn._canSet = true;
  return fn
}

function branchKeys(branch: StateType) {
  let keys: string[] = [];
  if (branch[SymData].fData.type == 'array') for (let j = 0; j < getIn(branch, SymData, 'length'); j++) keys.push(j.toString());
  else keys = objKeys(branch).filter(v => v);
  return keys;
}

function getSchemaPart(schema: jsJsonSchema, path: Path, getOneOf?: (path: Path) => number, fullOneOf?: boolean): jsJsonSchema {

  function getArrayItemSchemaPart(index: number, schemaPart: jsJsonSchema): jsJsonSchema {
    let items: jsJsonSchema[] = [];
    if (schemaPart.items) {
      if (!isArray(schemaPart.items)) return schemaPart.items;
      else items = schemaPart.items;
    }
    if (index < items.length) return items[index];
    else {
      if (schemaPart.additionalItems !== false) {
        if (schemaPart.additionalItems && schemaPart.additionalItems !== true) return schemaPart.additionalItems;
        return items[items.length - 1]
      }
    }
    throw new Error(errorText + path.join('/'));
  }

  function getSchemaByRef(schema: jsJsonSchema, $ref: string) {
    const path = string2path($ref);
    if ($ref[0] == '#') return getIn(schema, path); // Extract and use the referenced definition if we have it.
    throw new Error(`Can only ref to #`);// No matching definition found, that's an error (bogus schema?)
  }

  function deref(schema: jsJsonSchema, schemaPart: jsJsonSchema) {
    while (schemaPart.$ref) schemaPart = getSchemaByRef(schema, schemaPart.$ref);
    return schemaPart;
  }

  function combineSchemasINNER_PROCEDURE(schemaPart: jsJsonSchema) {
    if (schemaPart.$ref || schemaPart.allOf || schemaPart.oneOf) {
      if (combinedSchemas.get(schemaPart)) schemaPart = combinedSchemas.get(schemaPart);
      else {
        let schemaPartAsKey = schemaPart;
        schemaPart = derefAndMergeAllOf(schema, schemaPart);  // merge allOf, with derefing it and merge with schemaPart
        if (schemaPart.oneOf) {
          let {oneOf, ...restSchemaPart} = schemaPart;
          (schemaPart as jsJsonSchema[]) = oneOf.map((oneOfPart) => merge(derefAndMergeAllOf(schema, oneOfPart), restSchemaPart, {array: 'replace'})) // deref every oneOf, merge allOf in there, and merge with schemaPart
        }
        combinedSchemas.set(schemaPartAsKey, schemaPart);
      }
    }
    return schemaPart;
  }

  function derefAndMergeAllOf(schema: jsJsonSchema, schemaPart: jsJsonSchema) {
    schemaPart = deref(schema, schemaPart);
    if (schemaPart.allOf) {
      let {allOf, ...restSchemaPart} = schemaPart;
      let result;
      for (let i = 0; i < allOf.length; i++) {
        result = merge(result, derefAndMergeAllOf(schema, allOf[i]), {array: 'replace'})
      }
      schemaPart = merge(result, restSchemaPart)
    }
    return schemaPart
  }


  const errorText = 'Schema path not found: ';
  let schemaPart: jsJsonSchema = schema;
  const combinedSchemas = getCreateIn(schemaStorage(schema), new Map(), 'combinedSchemas');

  for (let i = path[0] == '#' ? 1 : 0; i < path.length; i++) {
    if (!schemaPart) throw new Error(errorText + path.join('/'));
    schemaPart = combineSchemasINNER_PROCEDURE(schemaPart);
    if (isArray(schemaPart)) schemaPart = schemaPart[getOneOf && getOneOf(path.slice(0, i)) || 0];

    if (schemaPart.type == 'array') {
      if (isNaN(parseInt(path[i]))) throw new Error(errorText + path.join('/'));
      schemaPart = getArrayItemSchemaPart(path[i], schemaPart)
    } else {
      if (schemaPart.properties && schemaPart.properties[path[i]]) schemaPart = schemaPart.properties[path[i]];
      else throw new Error(errorText + path.join('/'));
    }
  }
  schemaPart = combineSchemasINNER_PROCEDURE(schemaPart);
  if (fullOneOf) return schemaPart;
  if (isArray(schemaPart)) schemaPart = schemaPart[getOneOf && getOneOf(path) || 0];
  return schemaPart;
}

// function getParentArrayValue(schema: jsJsonSchema, path: Path) {
//   let pathPart = path.slice();
//   let keyPart: Path = [];
//   let result;
//   for (let i = 0; i < path.length; i++) {
//     let key = pathPart.pop();
//     keyPart.unshift(key);
//     let schemaPart = getSchemaPart(schema, pathPart);
//     if (!schemaPart) return;
//     if (schemaPart.type == 'array') {
//       let tmp = getIn(schemaPart.default, keyPart);
//       if (tmp) result = tmp;
//     }
//   }
//   return result;
// }


const arrayStart = memoize(function (schemaPart: jsJsonSchema) {
    if (!isArray(schemaPart.items)) return 0;
    if (schemaPart.additionalItems === false) return schemaPart.items.length;
    if (typeof schemaPart.additionalItems === 'object') return schemaPart.items.length;
    if (schemaPart.items.length == 0) return 0;
    return schemaPart.items.length - 1;
  }
);

const basicStatus = {invalid: 0, dirty: 0, untouched: 1, pending: 0, valid: true, touched: false, pristine: true};
const basicArrayItem = {canUp: false, canDown: false, canDel: false};

const makeDataStorage = memoize(function (schemaPart: jsJsonSchema, type: string, required: boolean, arrayItem: boolean, value?: any) {
  // const x = schemaPart.x || ({} as FFSchemaExtensionType);
  const {ff_params = {}, ff_data = {}} = schemaPart;
  const result: any = Object.assign({params: ff_params}, ff_data);
  if (!isObject(result.messages)) result.messages = {};

  result.status = basicStatus;
  result.fData = {};
  result.fData.type = type;
  result.fData.required = required || !!schemaPart.required;
  result.fData.title = schemaPart.title;
  result.fData.placeholder = schemaPart.ff_placeholder;
  if (isSchemaSelfManaged(schemaPart)) result.value = isUndefined(value) ? schemaPart.default : value;
  else delete result.value;
  // if (type != 'object' && type != 'array') {
  //   if (!isUndefined(value)) result.value = value;
  //   else if (isSchemaSelfManaged(schemaPart)) result.value = schemaPart.default;
  //   else delete result.value;
  // }
  if (type == 'array') {
    result.length = getIn(value, 'length') || 0;
    if (!isUndefined(schemaPart.minItems) && result.length < schemaPart.minItems) result.length = schemaPart.minItems;
    result.fData.canAdd = isArrayCanAdd(schemaPart, result.length);
  }
  if (arrayItem) result.arrayItem = basicArrayItem;
  return result;
});

function makeDataMap(dataMap: FFDataMapGeneric<MapFunctionType>[], path: Path): DataMapStateType[] {
  return dataMap.map((item) => {  // item is array where item[0] - from, item[1] - to
    return {emitter: path, from: item[0], to: item[1], fn: typeof item[2] == 'function' && item[2] || true} as DataMapStateType;
  })
}

//from: ((item[0][0] == '.' && path2string(path) + '/') || '') + item[0],
//       to: ((item[1][0] == '.' && path2string(path) + '/') || '') + item[1],


function getParentSchema(schema: jsJsonSchema, path: Path, getOneOf?: (path: Path) => number) {
  if (!path.length || path.length == 1 && path[0] === '#') return false;
  return getSchemaPart(schema, path.slice(0, -1), getOneOf);
}

function isPropRequired(schema: jsJsonSchema, path: Path) {
  return !!(schema.type == 'object' && isArray(schema.required) && ~schema.required.indexOf(path[path.length - 1]))
}

function getUniqId() {return Date.now().toString(36) + Math.random().toString(36) }

function makeStateBranch(schema: jsJsonSchema, getOneOf: (path: Path, value?: number) => number, path: Path = [], value?: any) { //: { state: StateType, dataMap: StateType } {
  const result = {};
  //const schemaPart = getSchemaPart(schema, path, getOneOf);
  const parentSchemaPart = getParentSchema(schema, path, getOneOf);
  const isArrayItem = getIn(parentSchemaPart, 'type') == 'array'; // && !getIn(parentSchemaPart, 'x', 'managed');
  const isReqiured = parentSchemaPart ? isPropRequired(parentSchemaPart, path[path.length - 1]) : false;
  const dataMapObjects: DataMapStateType[] = [];
  let defaultValues: any;
  const currentOneOf = getOneOf(path);
  const schemaPartsOneOf = getSchemaPart(schema, path, getOneOf, true);
  let {schemaPart, oneOf, type} = findOneOf(schemaPartsOneOf, value, currentOneOf);
  if (!isUndefined(currentOneOf) && currentOneOf != oneOf) { // keep existing structure of one of
    value = schemaPartsOneOf[currentOneOf].default;
    const tmp = findOneOf(schemaPartsOneOf, value, currentOneOf);
    schemaPart = tmp.schemaPart;
    oneOf = tmp.oneOf;
    type = tmp.type;
  }
  push2array(dataMapObjects, makeDataMap(schemaPart.ff_dataMap || [], path));
  result[SymData] = makeDataStorage(schemaPart, type, isReqiured, isArrayItem, value);
  if (isArrayItem) result[SymData] = merge(result[SymData], {uniqId: getUniqId()});
  if (!isUndefined(oneOf)) {
    getOneOf(path, oneOf);
    result[SymData] = merge(result[SymData], {oneOf});
  }

  if ((result[SymData].hasOwnProperty('value'))) defaultValues = result[SymData].value;
  else if (type == 'array') {
    defaultValues = [];
    defaultValues.length = result[SymData].length;
    for (let i = 0; i < defaultValues.length; i++) {
      let dataObj = makeStateBranch(schema, getOneOf, path.concat(i), getIn(isUndefined(value) ? schemaPart.default : value, i));
      if (dataObj.dataMap) push2array(dataMapObjects, dataObj.dataMap);
      dataObj.state = merge(dataObj.state, setIn({}, getArrayItemData(schemaPart, i, defaultValues.length), SymData, 'arrayItem'));
      result[i] = dataObj.state;
      defaultValues[i] = dataObj.defaultValues
    }
    result[SymData] = merge(result[SymData], {status: {untouched: defaultValues.length}})
  } else if (type == 'object') {
    defaultValues = {};
    objKeys(schemaPart.properties || {}).forEach(field => {
      let dataObj = makeStateBranch(schema, getOneOf, path.concat(field), value && value[field]);
      if (dataObj.dataMap) push2array(dataMapObjects, dataObj.dataMap);
      result[field] = dataObj.state;
      defaultValues[field] = dataObj.defaultValues
    });
    result[SymData] = merge(result[SymData], {status: {untouched: objKeys(defaultValues).length}})
  }
  return {state: result, defaultValues, dataMap: dataMapObjects.length ? dataMapObjects : undefined}
}

const makeStateFromSchema = memoize(function (schema: jsJsonSchema) {
  let {state, dataMap = [], defaultValues} = makeStateBranch(schema, oneOfStructure({}, []));
  state = merge(state, setIn({}, defaultValues, [SymData, 'current']));
  state = setDataMapInState(state, schema, dataMap);
  const UPDATABLE_object: PROCEDURE_UPDATABLE_objectType = {update: {}, replace: {}};
  state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate([], ['inital'], getIn(state, SymData, 'current')));
  state = mergeStatePROCEDURE(state, UPDATABLE_object);
  return state;
});

function setDataMapInState(state: StateType, schema: jsJsonSchema, dataMaps: DataMapStateType[], unset: boolean = false) {
  //let update: StateType = {};
  const UPDATABLE_object = {update: {}, replace: {}};
  dataMaps.forEach((dataMap) => {
    const emitterPath = dataMap.emitter;
    let bindMap2emitter: boolean = false;
    normalizeUpdate({path: emitterPath.join('/') + '/' + dataMap.from, to: normalizePath(dataMap.to, emitterPath), value: dataMap.fn}, state).forEach(NdataMap => {
        let relTo = path2string(relativePath(NdataMap.path, NdataMap.to));
        if (getIn(state, NdataMap.path)) setIn(UPDATABLE_object.update, unset ? undefined : NdataMap.value, NdataMap.path, SymDataMapTree, NdataMap[SymData], SymDataMap, relTo);
        if (!unset) {
          executeDataMapsPROCEDURE(state, schema, UPDATABLE_object, makeSlice(relTo, NdataMap.value),
            makeNUpdate(NdataMap.path, NdataMap[SymData], getIn(state, NdataMap.path, SymData, NdataMap[SymData])));
          if (!bindMap2emitter && relativePath(emitterPath, NdataMap.path)[0] != '.') bindMap2emitter = true;
        }
        state = mergeStatePROCEDURE(state, UPDATABLE_object);
      }
    );
    if (bindMap2emitter) {
      const emitterBranch = getIn(state, emitterPath);
      if (emitterBranch) {
        let bindedMaps = getIn(emitterBranch, SymDataMapTree, SymData) || [];
        setIn(UPDATABLE_object.update, bindedMaps.concat(dataMap), emitterPath, SymDataMapTree, SymData);
        setIn(UPDATABLE_object.replace, true, emitterPath, SymDataMapTree, SymData);
      }
      state = mergeStatePROCEDURE(state, UPDATABLE_object);
    }
  });
  return state
}

// function updDataMap2state(state: StateType, dataMap: DataMapStateType[], schema: jsJsonSchema) {
//   const UPDATABLE_object = {update: {}, replace: {}};
//   dataMap.forEach((dataMap) => {
//     if (dataMap.fn === false) return; // disabled map
//     const branch = getIn(state, dataMap.path);
//     executeDataMapsPROCEDURE(state, schema, UPDATABLE_object, [getIn(branch, SymDataMapTree, dataMap[SymData], SymDataMap, dataMap.to)], makeNUpdate(dataMap.path, dataMap[SymData], getIn(branch, SymData, dataMap[SymData])));
//     state = mergeStatePROCEDURE(state, UPDATABLE_object);
//   });
//   return state
// }

function isArrayCanAdd(schemaPart: jsJsonSchema, length: number) {
  const arrayStartIndex = arrayStart(schemaPart); //; dataItem.array.arrayStartIndex;
  const minItems = schemaPart.minItems || 0;
  return (schemaPart.additionalItems !== false || length < arrayStartIndex) && (length < (schemaPart.maxItems || Infinity))
}

function getArrayItemData(schemaPart: jsJsonSchema, index: number, length: number) {
  let result: { [key: string]: boolean } = {};
  const arrayStartIndex = arrayStart(schemaPart); //; dataItem.array.arrayStartIndex;
  const minItems = schemaPart.minItems || 0;
  // if (index >= arrayStartIndex) {
  result.canUp = arrayStartIndex < index;
  result.canDown = (arrayStartIndex <= index) && (index < length - 1);
  // } 
  // if (index >= minItems) 
  result.canDel = index >= Math.min(arrayStartIndex, length - 1);
  return result
}

function isSelfManaged(state: StateType, ...pathes: any[]) {
  return hasIn(state, ...pathes, SymData, 'value')
}

function isSchemaSelfManaged(schemaPart: jsJsonSchema) {
  return schemaPart.type !== 'array' && schemaPart.type !== 'object' || hasIn(schemaPart, 'ff_props', 'managed')
}

function findOneOf(oneOfShemas: any, value?: any, currentOneOf?: number) {
  if (!isArray(oneOfShemas)) oneOfShemas = [oneOfShemas];
  const oneOfKeys = oneOfShemas.map((v: any, i: number) => i);
  //for (let i = 0; i < oneOfShemas.length; i++) oneOfKeys.push(i);
  if (currentOneOf) moveArrayElems(oneOfKeys, currentOneOf, 0); // currentOneOf should be checked first to match type
  for (let k = 0; k < oneOfKeys.length; k++) {
    let oneOf = oneOfKeys[k];
    let schemaTypes = oneOfShemas[oneOf].type;
    if (!isArray(schemaTypes)) schemaTypes = [schemaTypes];
    let checkValue = isUndefined(value) ? oneOfShemas[oneOf].default : value;
    for (let j = 0; j < schemaTypes.length; j++) {
      if (types[schemaTypes[j] || 'any'](checkValue) || isUndefined(checkValue)) return {schemaPart: oneOfShemas[oneOf], oneOf, type: schemaTypes[j]}
    }
  }
  return {};
}

function updateCurrentRecursively(state: StateType, schema: jsJsonSchema, UPDATABLE_object: PROCEDURE_UPDATABLE_objectType, value: any, replace: any, track: Path = [], setOneOf?: number): StateType {

  if (value === SymReset) value = getIn(state, SymData, 'inital', track);
  if (value === SymClear) value = getIn(getDefaultFromSchema(schema), track);
  if (getIn(state, SymData, 'current', track) === value && !hasIn(UPDATABLE_object.update, SymData, 'current', track)) return state;

  let branch = getIn(state, track);

  // if no branch then no need to modify state for this value, just update current
  if (!branch) {
    if (track[track.length - 1] == 'length') {  // hook if someone decides to edit array's length directly
      const topPath = track.slice(0, -1);
      const topBranch = getIn(state, topPath);
      if (topBranch[SymData].fData.type == 'array')
        return updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(topPath, ['length'], value));
    }
    return updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate([], ['current'].concat(track), value, replace));
  }

  if (!types[branch[SymData].fData.type || 'any'](value)) { // if wrong type for current oneOf index search for proper type in oneOf
    const {schemaPart, oneOf, type} = findOneOf(getSchemaPart(schema, track, oneOfFromState(state), true), value, isUndefined(setOneOf) ? branch[SymData].oneOf : setOneOf);
    if (schemaPart) {
      return updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(track, ['oneOf'], oneOf, false, {type, setValue: value}));
      //branch = getIn(state, track);
    } else console.warn('Type not found in path [' + track.join('/') + ']')
  }

  if (isSelfManaged(branch)) { // if object has own value then replace it directly
    state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(track, ['value'], value, replace))
  } else {
    if (isMergeable(value)) {  // if we receive object or array then apply their values to state
      if (branch[SymData].fData.type == 'array' && !isUndefined(value.length))
        state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(track, ['length'], value.length));

      objKeys(value).forEach(key => {
        state = updateCurrentRecursively(state, schema, UPDATABLE_object, value[key], getIn(replace, key), track.concat(key))
      })
    }
  }

  return state
}

function getUpdValue(states: StateType[], ...pathes: Path) {
  for (let i = 0; i < states.length; i++) {
    if (hasIn(states[i], ...pathes)) return getIn(states[i], ...pathes);
  }
}


function splitValuePROCEDURE(state: StateType, schema: jsJsonSchema, UPDATABLE_object: PROCEDURE_UPDATABLE_objectType, item: NormalizedUpdateType): StateType {
  const {value: itemValue, path, replace} = item;
  const keyPath = item[SymData] || [];
  if (keyPath.length == 0) {
    const {value, status, length, oneOf, ...rest} = itemValue;
    ['value', 'status', 'length', 'oneOf'].forEach(key => {
      if (hasIn(itemValue, key)) state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(path, [key], itemValue[key], getIn(replace, key)))
    });
    if (objKeys(rest).length) state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(path, keyPath, rest, replace))
  } else {
    objKeys(itemValue).forEach(key => {
      state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(path, keyPath.concat(key), itemValue[key], getIn(replace, key)))
    });
  }
  return state
}

function updateNormalizationPROCEDURE(state: StateType, schema: jsJsonSchema, UPDATABLE_object: PROCEDURE_UPDATABLE_objectType, item: StateApiUpdateType): StateType {
  const items = normalizeUpdate(item, state);
  items.forEach(i => {
    if (i.path.length === 0 && i[SymData][0] == 'current') {
      i.macros = 'setCurrent';
      i.path = i[SymData].slice(1);
      i[SymData] = [];
    }
    if (i[SymData][0] == 'value') {
      i.macros = 'setCurrent';
      i.path = i.path.concat(i[SymData].slice(1));
      i[SymData] = [];
    } else if (i[SymData][0] == 'status') {
      console.warn('Status should not be changed through StateApi. Update ignored.');
      return;
    } else if (i[SymData][0] == 'oneOf') {
      i.macros = 'setOneOf';
    }

    state = updateStatePROCEDURE(state, schema, UPDATABLE_object, i);
  });
  return state;
}

function mergeStatePROCEDURE(state: StateType, UPDATABLE_object: PROCEDURE_UPDATABLE_objectType) {
  state = merge(state, UPDATABLE_object.update, {replace: UPDATABLE_object.replace});
  UPDATABLE_object.update = {};
  UPDATABLE_object.replace = {};
  return state;
}

function updateStatePROCEDURE(state: StateType, schema: jsJsonSchema, UPDATABLE_object: PROCEDURE_UPDATABLE_objectType, item: NormalizedUpdateType | StateApiUpdateType): StateType {
  const {update, replace: replace_UPDATABLE} = UPDATABLE_object;

  // normalize updates
  if (!isNUpdate(item)) return updateNormalizationPROCEDURE(state, schema, UPDATABLE_object, item);

  // execute macros
  if (item.macros) {
    let macro = Macros[item.macros];
    if (!macro) throw new Error('"' + macro + '" not found in macros');
    return macro(state, schema, UPDATABLE_object, item);
  }

  const {value, path, replace} = item;
  const keyPath = item[SymData];

  if (path.length == 0 && keyPath[0] == 'inital') {
    state = merge(state, makeSlice(SymData, keyPath, value), {replace: makeSlice(SymData, keyPath, replace)})
  } else {
    // split object for proper state update (for dataMap correct execution)
    if (isObject(value) && (keyPath.length == 0 && (hasIn(value, 'value') || hasIn(value, 'status') || hasIn(value, 'length') || hasIn(value, 'oneOf'))
      || (keyPath.length == 1 && keyPath[0] == 'status'))) return splitValuePROCEDURE(state, schema, UPDATABLE_object, item);

    let branch = getIn(state, path);
    if (!isObject(branch)) return state; // check if there is branch in state

    if (keyPath[0] == 'value' && !hasIn(branch, SymData, 'value')) // value is not self managed, so modify only current
      return Macros.setCurrent(state, schema, UPDATABLE_object, {value, replace, path: path.concat(keyPath.slice(1))});

    // set data
    setIn(update, value, path, SymData, keyPath);
    if (replace) setIn(replace_UPDATABLE, replace, path, SymData, keyPath);

    // additional state modifying if required
    if (keyPath[0] == 'value') { // modify current
      state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate([], push2array(['current'], path, keyPath.slice(1)), value, replace))
    } else if (keyPath[0] == 'length') { // modify state with new length
      state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate([], push2array(['current'], path, keyPath), value, replace));
      let start = branch[SymData].length;
      start = Math.max(start, 0);
      let end = Math.max(value || 0);
      //setIn(update, end, SymData, 'current', path, 'length');
      //state = mergeStatePROCEDURE(state, UPDATABLE_object);
      const oneOfStateFn = oneOfStructure(state, path);
      const maps2enable: any[] = [];
      const maps2disable: any[] = [];
      for (let i = start; i < end; i++) {
        let elemPath = path.concat(i);
        let {state: branch, dataMap = [], defaultValues} = makeStateBranch(schema, oneOfStateFn, elemPath);
        state = merge(state, setIn({}, branch, elemPath), {replace: setIn({}, true, elemPath)});
        state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate([], push2array(['current'], elemPath), defaultValues, true));
        //state = merge(state, makeSlice(SymData, 'current', elemPath, defaultValues), {replace: makeSlice(SymData, 'current', elemPath, true)});
        push2array(maps2enable, dataMap);
        //state = updDataMap2state(state, dataMap, schema, UPDATABLE_object);
        state = Macros.setStatus(state, schema, UPDATABLE_object, makeNUpdate(path, ['status', 'untouched'], 1));
      }
      for (let i = end; i < start; i++) {
        let elemPath = path.concat(i);
        push2array(maps2disable, getIn(state, elemPath, SymDataMapTree, SymData) || []);
        ['invalid', 'dirty', 'untouched', 'pending'].forEach(key => {
          let statusValue = getUpdValue([update, state], path, SymData, 'status', key);
          if (statusValue) state = Macros.setStatus(state, schema, UPDATABLE_object, makeNUpdate(path, ['status', key], -1));
        });
        setIn(update, SymDelete, elemPath);
        setIn(replace_UPDATABLE, SymDelete, elemPath);
      }

      let schemaPart = getSchemaPart(schema, path, oneOfFromState(state));
      setIn(update, isArrayCanAdd(schemaPart, end), path, SymData, 'fData', 'canAdd');
      for (let i = Math.max(Math.min(start, end) - 1, 0); i < end; i++) {
        setIn(update, getArrayItemData(schemaPart, i, end), path, i, SymData, 'arrayItem')
      }

      state = mergeStatePROCEDURE(state, UPDATABLE_object);
      state = setDataMapInState(state, schema, maps2disable, true);
      state = setDataMapInState(state, schema, maps2enable);


    } else if (keyPath[0] == 'status') { // properly set status change
      let keyStatus = keyPath[1];
      let newKey;
      let value;
      if (keyStatus == 'invalid' || keyStatus == 'pending') {
        value = getUpdValue([update, state], path, SymData, 'status', 'pending') ? null : !getUpdValue([update, state], path, SymData, 'status', 'invalid');
        newKey = 'valid';
      } else if (keyStatus == 'untouched' || keyStatus == 'dirty') {
        value = !getUpdValue([update, state], path, SymData, 'status', keyStatus);
        newKey = keyStatus == 'untouched' ? 'touched' : 'pristine';
      }
      if (!isUndefined(newKey)) setIn(update, value, path, SymData, 'status', newKey);

    } else if (keyPath[0] == 'oneOf') {
      const oldBranch = getIn(state, path);
      let oldOneOf = getIn(oldBranch, SymData, 'oneOf') || 0;
      let newOneOf = getIn(UPDATABLE_object.update, path, SymData, 'oneOf');
      if ((oldOneOf != newOneOf) || (item.type && item.type != getIn(oldBranch, SymData, 'fData', 'type'))) {
        setIfNotDeeper(UPDATABLE_object, SymReset, 'forceCheck', item.path);
        state = mergeStatePROCEDURE(state, UPDATABLE_object);
        state = setDataMapInState(state, schema, getIn(state, path, SymDataMapTree, SymData) || [], true);

        let {state: branch, dataMap: maps2enable = [], defaultValues} = makeStateBranch(schema, oneOfStructure(state, path), path, item.setValue);
        if (isSelfManaged(oldBranch) && isSelfManaged(branch)) {  // keep status values for self-managed branch
          const {value, length, oneOf, fData, ...rest} = oldBranch[SymData];
          branch = merge(branch, makeSlice(SymData, {...rest}));
        } else {
          const {value, length, oneOf, fData, status, ...rest} = oldBranch[SymData];
          branch = merge(branch, makeSlice(SymData, {...rest}));
        }
        state = merge(state, setIn({}, branch, path), {replace: setIn({}, true, path)});
        state = setDataMapInState(state, schema, maps2enable);
        state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate([], push2array(['current'], path), defaultValues, true));
        if (path.length) {
          const topPath = path.slice(0, -1);
          ['invalid', 'dirty', 'untouched', 'pending'].forEach(key => {
            let oldStatusValue = getIn(oldBranch, SymData, 'status', key);
            let newStatusValue = getIn(branch, SymData, 'status', key);
            if (!oldStatusValue != !newStatusValue) state = Macros.setStatus(state, schema, UPDATABLE_object, makeNUpdate(topPath, ['status', key], newStatusValue ? 1 : -1));
          });
        }
      }
    }
  }

  // apply dataMap
  let dataMap = getIn(state, path, SymDataMapTree);
  for (let i = 0; i < keyPath.length; i++) {
    if (!dataMap) break;

    state = executeDataMapsPROCEDURE(state, schema, UPDATABLE_object, dataMap[SymDataMap],
      makeNUpdate(path, keyPath.slice(0, i), setIn({}, value, keyPath.slice(i)), setIn({}, replace, keyPath.slice(i)))
    );
    dataMap = dataMap[keyPath[i]];
  }

  if (dataMap) state = recursivelyExecuteDataMaps(dataMap, value, replace, keyPath);

  function recursivelyExecuteDataMaps(dataMap: any[], value: any, replace: any, track: Path = []) {
    state = executeDataMapsPROCEDURE(state, schema, UPDATABLE_object, dataMap[SymDataMap], makeNUpdate(path, track, value, replace));
    isMergeable(value) && objKeys(dataMap).forEach(key => value.hasOwnProperty(key) && (state = recursivelyExecuteDataMaps(dataMap[key], value[key], getIn(replace, key), track.concat(key))))
    return state;
  }

  return state;
}

function executeDataMapsPROCEDURE(state: StateType, schema: jsJsonSchema, UPDATABLE_object: PROCEDURE_UPDATABLE_objectType, maps: any, item: NormalizedUpdateType) {
  const {value, path, replace} = item;
  const keyPath = item[SymData] || [];
  objKeys(maps || {}).forEach((pathTo) => {
    if (!maps[pathTo]) return; // disabled map
    const NpathTo = path2string(normalizePath(pathTo, path));
    const executedValue = maps[pathTo] && maps[pathTo] !== true ? maps[pathTo](value, {path: NUpdate2string(item), pathTo: NpathTo, schema, getFromState: getFrom4DataMap(state, UPDATABLE_object)}) : value;
    const updates = executedValue instanceof stateUpdates ? executedValue[SymData] : [{path: NpathTo, value: executedValue, replace}];
    updates.forEach((update: any) => state = updateStatePROCEDURE(state, schema, UPDATABLE_object, update));
  });
  return state;
}

function getFrom4DataMap(state: StateType, UPDATABLE_object: PROCEDURE_UPDATABLE_objectType) {
  return (...tPath: Array<string | Path>) => {
    if (hasIn(UPDATABLE_object.update, ...tPath.map(path => normalizePath(path as any))))
      return merge(getFromState(state, ...tPath), getFromState(UPDATABLE_object.update, ...tPath), {replace: getFromState(UPDATABLE_object.replace, ...tPath)});
    return getFromState(state, ...tPath);
  }
}

function getDefaultFromSchema(schema: jsJsonSchema) {
  return makeStateFromSchema(schema)[SymData].current
}

function getKeyMapFromSchema(schema: jsJsonSchema, getState: () => StateType): any {
  return {
    key2path,
    path2key,
    flatten: mapObj.bind(null, path2key, key2path),
    unflatten: mapObj.bind(null, key2path, path2key),
  };

  function getKeyMap(schema: jsJsonSchema, track: Path = []) {
    function checkIfHaveKey(key: string) {if (keyMap.key2path.hasOwnProperty(key)) throw new Error(`Duplicate flatten name for ${key}`);}

    function mapPath2key(prefix: string, obj: any) {
      let result = {};
      objKeys(obj).forEach((val: string) => {
        if (typeof obj[val] == 'string') result[val] = prefix + obj[val];
        else result[val] = mapPath2key(prefix, obj[val])
      });
      return result
    }

    let schemaPart = getSchemaPart(schema, track, oneOfFromState(getState));
    let keyMaps = getCreateIn(schemaStorage(schema), new Map(), SymData, 'keyMaps');
    if (keyMaps.get(schemaPart)) return keyMaps.get(schemaPart);
    if (schemaPart.type != 'object') return;
    let result = {};
    let fields = objKeys(schemaPart.properties || {});
    let keyMap = getCreateIn(result, {key2path: {}, path2key: {}}, SymData, 'keyMap');
    if (schemaPart.ff_props && schemaPart.ff_props.flatten) keyMap.prefix = schemaPart.ff_props.flatten !== true && schemaPart.ff_props.flatten || '';

    fields.forEach(field => {
      let keyResult = getKeyMap(schema, track.concat(field));
      let objKeyMap = getIn(keyResult, [SymData, 'keyMap']) || {};
      if (!isUndefined(objKeyMap.prefix)) {  // if objKeyMap.prefix is exists it means that child is object
        objKeys(objKeyMap.key2path).forEach((key: any) => {
          checkIfHaveKey(objKeyMap.prefix + key);
          keyMap.key2path[objKeyMap.prefix + key] = [field].concat(objKeyMap.key2path[key]);
        });
        keyMap.path2key[field] = mapPath2key(objKeyMap.prefix, objKeyMap.path2key)
      } else if (!isUndefined(keyMap.prefix)) {
        checkIfHaveKey(field);
        keyMap.key2path[field] = field;
        keyMap.path2key[field] = field;
      }
    });
    keyMaps.set(schemaPart, result);
    return result;
  }

  function key2path(keyPath: string | Path): Path {
    if (typeof keyPath == 'string') keyPath = string2path(keyPath);
    let result: Path = [];
    keyPath.forEach((key) => {
      let path = getIn(getKeyMap(schema, result), [SymData, 'keyMap', 'key2path', key]);
      result = push2array(result, path ? path : key);
    });
    return result;
  }

  function path2key(path: Path): Path {
    let result: Path = [];
    let i = 0;
    while (i < path.length) {
      let key = path[i];
      let path2key = getIn(getKeyMap(schema, path.slice(0, i)), [SymData, 'keyMap', 'path2key']);
      if (path2key) {
        let j = 0;
        while (1) {
          if (path2key[key]) {
            if (typeof path2key[key] == 'string') {
              key = path2key[key];
              i += j;
              break;
            } else {
              path2key = path2key[key];
              j++;
              key = path [i + j];
            }
          } else {
            key = path [i];
            break;
          }
        }
      }
      result.push(key);
      i++;
    }
    return result;
  }

  function mapObj(fnDirect: any, fnReverse: any, object: any, path: Path = []): any {
    if (!isMergeable(object)) return object;
    const result = isArray(object) ? [] : {};

    function recurse(value: any, track: Path = []) {
      let keys;
      if (isMergeable(value) && !isSchemaSelfManaged(getSchemaPart(schema, (fnDirect == key2path ? key2path(track) : track), oneOfFromState(getState)))) { //!isSelfManaged(getState(), (fnDirect == key2path ? key2path(track) : track))) {//
        keys = objKeys(value);
        keys.forEach(key => recurse(value[key], track.concat(key)))
      }
      if (!(keys && keys.length) && isUndefined(getIn(getKeyMap(schema, (fnDirect == key2path ? key2path(track) : track)), [SymData, 'keyMap', 'prefix']))) {
        let tmp = result;
        let path = fnDirect(track);
        for (let i = 0; i < path.length - 1; i++) {
          let field = path[i];
          if (!tmp[field]) tmp[field] = isArray(getIn(object, fnReverse(path.slice(0, i + 1)))) ? [] : {};
          tmp = tmp[field];
        }
        if (path.length) tmp[path.pop()] = value;
      }
    }

    recurse(object, path);
    return result;
  }
}

// function getAsObject(state: StateType, keyPath: Path, fn?: (val: any) => any, keyObject?: StateType) {
//   if (!fn) fn = x => x;
//   let type = state[SymData].fData.type;
//   if ((type == 'object' || type == 'array') && !state[SymData].values) {
//     let result: any = type == 'array' ? [] : {};
//     let keys: Array<string> = objKeys(keyObject && objKeys(keyObject).length > 0 ? keyObject : state);
//     if (type == 'array') {
//       let idx = 0;
//       let arrKeys = [];
//       if (keyPath[1] == 'values' && keyPath[2]) idx = getIn(state, [SymData, 'array', 'lengths', keyPath[2]]) || 0;
//       else idx = getValue(getIn(state, [SymData, 'array', 'lengths']) || {}) || 0;
//       const lengthChange = keyObject && getIn(keyObject, [SymData, 'array', 'lengths']);
//       for (let i = 0; i < idx; i++) if (lengthChange || ~keys.indexOf(i.toString())) arrKeys.push(i.toString());
//       keys = arrKeys;
//       result.length = idx;
//     }
//     keys.forEach((key) => {
//       if (state[key]) result[key] = getBindedValue(getIn(state[key], [SymData, 'controls']), 'omit') ? Symbol.for('FFormDelete') : getAsObject(state[key], keyPath, fn, keyObject ? keyObject[key] : undefined)
//     });
//     return result;
//   } else return fn(getIn(state, keyPath))
// }

function getBindedValue(obj: any, valueName: string) {
  return isUndefined(obj[valueName + 'Bind']) ? obj[valueName] : obj[valueName + 'Bind'];
}

// function makeUpdateItem(path: Path | string, ...rest: any[]): NormalizedUpdateType {
//   let value, keyPath, updateItem;
//   if (rest.length == 1) value = rest[0];
//   if (rest.length == 2) {
//     keyPath = rest[0];
//     value = rest[1];
//   }
//   updateItem = makePathItem(path);
//   if (keyPath) updateItem.keyPath = isArray(keyPath) ? keyPath : string2path(keyPath);
//   (updateItem as NormalizedUpdateType).value = value;
//   return updateItem as NormalizedUpdateType;
// }
//
// function makePathItem(path: Path | string, relativePath: Path | undefined = undefined, delimiter = '@'): PathItem {
//   const pathItem: any = {};
//   pathItem.toString = function () {
//     return NUpdate2string(this)
//   };
//   Object.defineProperty(pathItem, "toString", {enumerable: false});
//   Object.defineProperty(pathItem, "fullPath", {
//     get: function (): Path {
//       return this.keyPath ? this.path.concat(SymData, this.keyPath) : this.path;
//     },
//     set: function (path: Path) {
//       let a = path.indexOf(SymData);
//       if (a == -1) {
//         this.path = path.slice();
//         delete this.keyPath
//       } else {
//         this.path = path.slice(0, a);
//         this.keyPath = path.slice(a + 1);
//       }
//     }
//   });
//   path = normalizePath(path, relativePath, delimiter);
//   pathItem.fullPath = path;
//   return pathItem;
// }


// function makeArrayOfPathItem(path: Path | string, basePath: Path = [], delimiter = '@'): PathItem[] {
//   path = normalizePath(path, basePath, delimiter);
//   let result: any[] = [[]];
//   path.forEach(value => {
//     let res: any[] = [];
//     if (typeof value == 'string' || typeof value == 'number') {
//       result.forEach(pathPart => value.toString().split(',').forEach(key => res.push(pathPart.concat(key.trim()))))
//     } else if (typeof value == 'symbol') {
//       result.forEach(pathPart => res.push(pathPart.concat(value)))
//     } else if (typeof value == 'function') {
//       result.forEach(pathPart => {
//         let tmp = value(pathPart);
//         if (!isArray(tmp)) tmp = [tmp];
//         tmp.forEach((tmpVal: string | number | false) => tmpVal === false ? false : tmpVal.toString().split(',').forEach(key => res.push(pathPart.concat(key))))
//       });
//     } else throw new Error('not allowed type');
//     result = res;
//   });
//   return result.map(path => makePathItem(path));
// }

function object2PathValues(vals: { [key: string]: any }, options: object2PathValuesOptions = {}, track: Path = []): PathValueType[] {
  const fn = options.symbol ? objKeysNSymb : objKeys;
  const check = options.arrayAsValue ? isObject : isMergeable;
  let result: any[] = [];
  fn(vals).forEach((key) => {
    let path = track.concat(key);
    if (check(vals[key])) object2PathValues(vals[key], options, path).forEach(item => result.push(item)); // result = result.concat(object2PathValues(vals[key], path));
    else result.push(push2array(path, vals[key]))
  });
  if (!result.length) return [push2array(track.slice(), {})]; // empty object
  return result
}

function normalizePath(path: string | Path, base: string | Path = []): Path {
  return resolvePath(flattenPath(path), base.length ? flattenPath(base) : []);
}

function normalizeUpdate(update: StateApiUpdateType, state: StateType): NormalizedUpdateType[] {
  const {path, value, replace, base, ...rest} = update;
  const result: NormalizedUpdateType[] = [];
  let pathes = normalizePath(path, base);
  let keyPathes: any = [];
  let a = pathes.indexOf(SymData);
  if (~a) {
    keyPathes = pathes.slice(a + 1);
    pathes = pathes.slice(0, a);
  }
  pathes = multiplyPath(pathes, {'*': (path: Path) => branchKeys(getIn(state, path)).join(',')});
  keyPathes = multiplyPath(keyPathes);
  objKeys(pathes).forEach(p => objKeys(keyPathes).forEach(k => result.push(makeNUpdate(pathes[p], keyPathes[k], value, replace, rest))));
  return result;
}

function string2NUpdate(path: string | Path, base: string | Path = [], rest: any = {}): NormalizedUpdateType {
  path = normalizePath(path, base);
  let keyPath: any = [];
  let a = path.indexOf(SymData);
  if (~a) {
    keyPath = path.slice(a + 1);
    path = path.slice(0, a);
  }
  const {value, replace, ...r} = rest;
  return makeNUpdate(path, keyPath, value, replace, r);
}

/////////////////////////////////////////////
//      Utilities
/////////////////////////////////////////////

function NUpdate2string(item: PathItem): string {
  let path = path2string(item.path);
  return path + (item.keyPath && !~path.indexOf('@') ? '/@/' + path2string(item.keyPath) : '');
}

function makeNUpdate(path: Path, keyPath: Path, value?: any, replace?: any, rest: any = {}): NormalizedUpdateType {
  const updateItem = {path, value, replace, ...rest};
  updateItem[SymData] = keyPath;
  return updateItem
}

function isNUpdate(updateItem: any): updateItem is NormalizedUpdateType {
  return !isUndefined(getIn(updateItem, SymData)) && isArray(updateItem[SymData]);
}

function multiplyPath(path: Path, strReplace: { [key: string]: any } = {}) {
  let result: any = {'': []};
  path.forEach(value => {
    let res: any = {};
    value = strReplace[value] || value;
    if (typeof value == 'string' && ~value.indexOf(',')) {
      objKeys(result).forEach(key => value.split(',').forEach((k: string) => res[key && (key + ',' + k) || k] = result[key].concat(k.trim())))
    } else if (typeof value == 'function') {
      objKeys(result).forEach(key => {
        let tmp: any = value(result[key]);
        if (typeof tmp == 'string') tmp = string2path(tmp);
        tmp = multiplyPath(tmp, strReplace);
        objKeys(tmp).forEach(k => res[key && (key + (k ? ',' + k : '')) || k] = result[key].concat(tmp[k]))
      });
    } else objKeys(result).forEach(key => push2array(result[key], value));
    if (objKeys(res).length) result = res;
  });
  return result;
}

const num2string = (value: any) => typeof value == 'number' ? value.toString() : value;

function relativePath(base: Path, destination: Path) {
  if (base[0] === '#') base = base.slice(1);
  if (destination[0] === '#') destination = destination.slice(1);
  // let same = true;
  // let res: Path = [];
  const result: Path = [];
  let i;
  for (i = 0; i < base.length; i++) if (num2string(base[i]) !== num2string(destination[i])) break;
  for (let j = i; j < base.length; j++) result.push('..');
  if (!result.length) result.push('.');
  return push2array(result, destination.slice(i));
  // return result;
}

function resolvePath(path: Path, base?: Path) {
  const result: Path = (base && (path[0] === '.' || path[0] == '..')) ? base.slice() : [];
  for (let i = 0; i < path.length; i++) {
    let val = path[i];
    if (val === '..') result.pop();
    else if (val !== '' && val !== '.') result.push(val);
  }
  return result;
}

function setIfNotDeeper(state: any, value: any, ...pathes: any[]) {
  const path = flattenPath(pathes);
  let result = state;
  for (let i = 0; i < path.length - 1; i++) {
    if (result === value) return state;
    result[path[i]] = {};
    result = result[path[i]];
  }
  if (path.length) result[path[path.length - 1]] = value;
  else return value;
  return state
}

function flattenPath(path: any): Path {
  if (isArray(path)) {
    const result: Path = [];
    push2array(result, ...path.map(flattenPath));
    return result;
  } else if (typeof path == 'string') return string2path(path);
  return [path];
}

function path2string(path: any): string {
  return isArray(path) ? path.map(path2string).join('/') : symConv.sym2str(path);
}

function string2path(path: string) {
  path = path.replace(symConv(SymData), '/' + symConv(SymData) + '/');
  path = path.replace(/\/+/g, '/');
  const result: Path = [];
  path.split('/').forEach(key => key && (key = symConv.str2sym(key.trim())) && result.push(key));
  return result
}

function getFromState(state: any, ...pathes: Array<symbol | string | Path>) {
  return getIn(state, ...pathes.map(path => normalizePath(path as any)));
}


// function without(obj: {}, symbol = false, ...rest: any[]) {
//   //const args = arrFrom(rest); // [].slice.call(arguments);
//   const result = isArray(obj) ? [] : {};
//   const fn = symbol ? objKeys : objKeysNSymb;
//   fn(obj).forEach(key => {
//     if (!~rest.indexOf(key)) result[key] = obj[key]
//   });
//   return result;
// };
//
//
// function split(test: (key: string, val: any) => boolean, obj: any, symbol = false) {
//   const passed = {};
//   const wrong = {};
//
//   const fn = symbol ? objKeys : objKeysNSymb;
//   fn(obj).forEach(key => {
//     let val = obj[key];
//     if (test(key, val)) passed[key] = val;
//     else wrong[key] = val;
//   });
//
//   return [passed, wrong];
// };
//
//
// function map(fnc: (val: any) => any, obj: any, symbol = false) {
//   const result = {};
//   const fn = symbol ? objKeys : objKeysNSymb;
//   fn(obj).forEach(key => result[key] = fnc(obj[key]));
//   return result
// };
//
//
// function mapKeys(fnc: (val: any) => any, obj: any, symbol = false) {
//   const result = {};
//   const fn = symbol ? objKeys : objKeysNSymb;
//   fn(obj).map(key => result[fnc(key)] = obj[key]);
//   return result;
// };
//
// function replaceDeep(obj: any, value: any) {
//   if (!isMergeable(obj)) return value;
//   const result = isArray(obj) ? [] : {};
//   objKeys(obj).forEach(field => result[field] = replaceDeep(obj[field], value));
//   return result;
// }


export {
  stateUpdates,
  string2NUpdate,
  //getValue,
  object2PathValues,
  getKeyMapFromSchema,
  makeStateFromSchema,
  makeStateBranch,
  string2path,
  getBindedValue,
  relativePath,
  getSchemaPart,
  oneOfFromState,
  oneOfStructure,
  path2string,
  normalizePath,
  branchKeys,
  makeNUpdate,
  getFromState,
  arrayStart,
  getDefaultFromSchema,
  updateStatePROCEDURE,
  mergeStatePROCEDURE,
  isSelfManaged,
  isSchemaSelfManaged,
  getUpdValue,
  isTopPath,
  symConv,
  normalizeUpdate,
  setIfNotDeeper
}

export {SymData, SymReset, SymClear, SymDelete}