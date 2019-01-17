import {getCreateIn, setIn, hasIn, getIn, objKeys, moveArrayElems, makeSlice, memoize, merge, objKeysNSymb, push2array, toArray, deArray} from "./commonLib";
import {isMergeable, isUndefined, isNumber, isInteger, isString, isArray, isObject, isFunction} from "./commonLib";
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

const types: any = ['null', 'boolean', 'integer', 'number', 'string', 'array', 'object'];

types.any = () => true;
types.null = (value: any) => value === null;
types.boolean = (value: any) => typeof value === "boolean";
types.array = isArray;
types.object = isObject; //(value: any) => typeof value === "object" && value && !isArray(value);// isObject(value);  //
types.number = isNumber;// (value: any) => typeof value === "number";
types.integer = isInteger; //(value: any) => typeof value === "number" && (Math.floor(value) === value || value > 9007199254740992 || value < -9007199254740992);
types.string = isString; //(value: any) => typeof value === "string";


/////////////////////////////////////////////
//  Macros
/////////////////////////////////////////////

function getBindedMaps2update(branch: StateType, path: Path = []) {
  const maps2disable: normalizedDataMapType[] = getIn(branch, SymDataMapTree, SymData) || [];
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

  // const length2test = 1 + item.path.length - (item.path[0] == '#' ? 1 : 0);  // length2test can be smaller because of leading '#' in item.path (replace function receives path without leading '#')
  state = merge(state, makeSlice(path, stateObject), {replace: trueIfLength(item.path.length + 1)}); //(path: Path) => path.length === length2test});
  state = merge(state, makeSlice(SymData, 'current', path, currentObject), {replace: trueIfLength(item.path.length + 3)});//(path: Path) => path.length === length2test + 2});
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
  newItem[SymData] = ['oneOf'];
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

const trueIfLength = (length: number) => (path: any) => getIn(path, 'length') === length;

function isTopPath(path: Path) {
  return path.length == 0 || path.length == 1 && path[0] == '#';
}

function recursivelyUpdate(state: StateType, schema: jsJsonSchema, UPDATABLE_object: PROCEDURE_UPDATABLE_objectType, item: NormalizedUpdateType) {
  const keys = branchKeys(getIn(state, item.path));
  if (item.value == SymReset && item[SymData][0] == 'status') {
    let i = {...item};
    i.value = item[SymData][1] == 'untouched' ? keys.length : 0;
    state = updateStatePROCEDURE(state, schema, UPDATABLE_object, i);
  } else state = updateStatePROCEDURE(state, schema, UPDATABLE_object, item);
  keys.forEach(key => state = recursivelyUpdate(state, schema, UPDATABLE_object, merge(item, {path: item.path.concat(key)})));
  return state
};

function oneOfFromState(state: StateType | Function): (path: Path) => oneOfStructureType {
  return (path: Path) => {
    let s = getIn(isFunction(state) ? state() : state, path, SymData);
    return {oneOf: getIn(s, 'oneOf'), type: getIn(s, 'fData', 'type')}
  };
}

function oneOfStructure(state: StateType | Function, path: Path) { // makes object than copies the structure of state[SymData].oneOf limited to path
  if (typeof state == 'function') state = state();
  const result = {};
  let tmp = result;
  setIn(tmp, getIn(state, SymData, 'oneOf'), SymData, 'oneOf');
  setIn(tmp, getIn(state, SymData, 'fData', 'type'), SymData, 'type');
  for (let i = 0; i < path.length; i++) {
    if (isUndefined(path[i]) || path[i] === '') continue;
    tmp[path[i]] = {};
    tmp = tmp[path[i]];
    state = getIn(state, path[i]);
    setIn(tmp, getIn(state, SymData, 'oneOf'), SymData, 'oneOf');
    setIn(tmp, getIn(state, SymData, 'fData', 'type'), SymData, 'type');
  }
  //return result
  const fn = function (path: Path, oneOf?: oneOfStructureType) {return isUndefined(oneOf) ? getIn(result, path, SymData) : setIn(result, oneOf, path, SymData)};
  fn._canSet = true;
  return fn
}


function branchKeys(branch: StateType) {
  let keys: string[] = [];
  if (branch[SymData].fData.type == 'array') for (let j = 0; j < getIn(branch, SymData, 'length'); j++) keys.push(j.toString());
  else keys = objKeys(branch).filter(v => v);
  return keys;
}


function getSchemaPart(schema: jsJsonSchema, path: Path, getOneOf: (path: Path) => oneOfStructureType, fullOneOf?: boolean): jsJsonSchema {

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

  function combineSchemasINNER_PROCEDURE(schemaPart: jsJsonSchema): jsJsonSchema | jsJsonSchema[] {
    if (schemaPart.$ref || schemaPart.allOf || schemaPart.oneOf) {
      if (combinedSchemas.get(schemaPart)) schemaPart = combinedSchemas.get(schemaPart);
      else {
        let schemaPartAsKey = schemaPart;
        schemaPart = derefAndMergeAllOf(schema, schemaPart);  // merge allOf, with derefing it and merge with schemaPart
        if (schemaPart.oneOf) {
          let {oneOf, ...restSchemaPart} = schemaPart;
          (schemaPart as any) = oneOf.map((oneOfPart) => merge(derefAndMergeAllOf(schema, oneOfPart), restSchemaPart, {array: 'replace'})) // deref every oneOf, merge allOf in there, and merge with schemaPart
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
  let schemaPart: jsJsonSchema | jsJsonSchema[] = schema;
  const combinedSchemas = getCreateIn(schemaStorage(schema), new Map(), 'combinedSchemas');
  let type;
  for (let i = path[0] == '#' ? 1 : 0; i < path.length; i++) {
    if (!schemaPart) throw new Error(errorText + path.join('/'));
    schemaPart = combineSchemasINNER_PROCEDURE(schemaPart);
    let {oneOf, type} = getOneOf(path.slice(0, i));
    if (isArray(schemaPart)) schemaPart = schemaPart[oneOf || 0];

    if (type == 'array') {
      if (isNaN(parseInt(path[i]))) throw new Error(errorText + path.join('/'));
      schemaPart = getArrayItemSchemaPart(path[i], schemaPart)
    } else {
      if (schemaPart.properties && schemaPart.properties[path[i]]) schemaPart = schemaPart.properties[path[i]];
      else throw new Error(errorText + path.join('/'));
    }
  }
  schemaPart = combineSchemasINNER_PROCEDURE(schemaPart);
  if (fullOneOf) return schemaPart as any;
  if (isArray(schemaPart)) schemaPart = schemaPart[getOneOf(path).oneOf || 0];
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

const getEnumOptions = (schemaPart: jsJsonSchema) => {
  if (!schemaPart.enum) return undefined;
  let exten: any[] = schemaPart.ff_enumExten || [];
  return schemaPart.enum.map((value, i) => isObject(exten[i]) ? merge(exten[i], {value}) : {value, label: exten[i] || value});
};

const basicStatus = {invalid: 0, dirty: 0, untouched: 1, pending: 0, valid: true, touched: false, pristine: true};

const makeDataStorage = memoize(function (schemaPart: jsJsonSchema, oneOf: number, type: string, value?: any) {
  // const x = schemaPart.x || ({} as FFSchemaExtensionType);
  const {ff_params = {}, ff_data = {}} = schemaPart;
  const result: any = Object.assign({params: ff_params}, ff_data);
  if (!isObject(result.messages)) result.messages = {};

  result.oneOf = oneOf;
  result.status = basicStatus;
  result.fData = {};
  result.fData.type = type;
  result.fData.required = schemaPart.required;
  result.fData.title = schemaPart.title;
  result.fData.placeholder = schemaPart.ff_placeholder;
  result.fData.enum = getEnumOptions(schemaPart);

  if (isSchemaSelfManaged(schemaPart, type)) result.value = isUndefined(value) ? schemaPart.default : value;
  else delete result.value;
  let untouched = 1;
  if (type == 'array') {
    result.length = getIn(value, 'length') || 0;
    if (!isUndefined(schemaPart.minItems) && result.length < schemaPart.minItems) result.length = schemaPart.minItems;
    result.fData.canAdd = isArrayCanAdd(schemaPart, result.length);
    untouched = result.length;
  } else if (type == 'object') untouched = objKeys(schemaPart.properties || {}).length;
  if (untouched != 1) {
    result.status = {...basicStatus};
    result.status.untouched = untouched;
  }
  return result;
});

function normalizeDataMap(dataMap: FFDataMapGeneric<Function | Function[]>[], path: Path): normalizedDataMapType[] {
  return dataMap.map((item) => {  // item is array where item[0] - from, item[1] - to
    return {emitter: path, from: item[0], to: item[1], action: (isFunction(item[2]) ? {$: item[2]} : item[2]) || true} as normalizedDataMapType;
  })
}

function getUniqKey() {return Date.now().toString(36) + Math.random().toString(36) }

function makeStateBranch(schema: jsJsonSchema, getNSetOneOf: (path: Path, upd?: oneOfStructureType) => oneOfStructureType, path: Path = [], value?: any) { //: { state: StateType, dataMap: StateType } {
  const result = {};
  const dataMapObjects: normalizedDataMapType[] = [];
  let defaultValues: any;
  const currentOneOf = (getNSetOneOf(path) || {}).oneOf;
  const schemaPartsOneOf = getSchemaPart(schema, path, getNSetOneOf, true);
  let {schemaPart, oneOf, type} = findOneOf(schemaPartsOneOf, value, currentOneOf);
  if (!isUndefined(currentOneOf) && currentOneOf != oneOf) { // value type is not that currentOneOf supports 
    console.info('Passed value is not supported by schema.type in path "' + path.join('/') + '" and oneOfIndex "' + currentOneOf + '". Reset value to default.\n');
    value = schemaPartsOneOf[currentOneOf].default; // so, reset value to default, cause keeping oneOf is in prior (if currentOneOf exists, otherwise oneOf is changed)
    const tmp = findOneOf(schemaPartsOneOf, value, currentOneOf);
    schemaPart = tmp.schemaPart;
    oneOf = tmp.oneOf;
    type = tmp.type;
  }
  push2array(dataMapObjects, normalizeDataMap(schemaPart.ff_dataMap || [], path));
  result[SymData] = makeDataStorage(schemaPart, oneOf, type, value);
  getNSetOneOf(path, {oneOf, type});
  // if (!isUndefined(oneOf)) {
  //   getNSetOneOf(path, oneOf);
  //   result[SymData] = merge(result[SymData], {oneOf});
  // }

  if ((result[SymData].hasOwnProperty('value'))) defaultValues = result[SymData].value;
  else {
    if (type == 'array') {
      defaultValues = [];
      defaultValues.length = result[SymData].length;
      for (let i = 0; i < defaultValues.length; i++) {
        let {state: branch, dataMap, defaultValues: dValue} = makeStateBranch(schema, getNSetOneOf, path.concat(i), getIn(isUndefined(value) ? schemaPart.default : value, i));
        defaultValues[i] = dValue;
        push2array(dataMapObjects, dataMap);
        branch = merge(branch, {[SymData]: {arrayItem: getArrayItemData(schemaPart, i, defaultValues.length)}}, {replace: {[SymData]: {ArrayItem: true}}});
        branch = merge(branch, {[SymData]: {params: getUniqKey()}});
        result[i] = branch;

      }
    } else if (type == 'object') {
      defaultValues = {};
      let arrayOfRequired = result[SymData].fData.required;
      arrayOfRequired = isArray(arrayOfRequired) && arrayOfRequired.length && arrayOfRequired;
      objKeys(schemaPart.properties || {}).forEach(field => {
        let {state: branch, dataMap, defaultValues: dValue} = makeStateBranch(schema, getNSetOneOf, path.concat(field), value && value[field]);
        defaultValues[field] = dValue;
        push2array(dataMapObjects, dataMap);
        if (arrayOfRequired && (~arrayOfRequired.indexOf(field))) branch = merge(branch, {[SymData]: {fData: {required: true}}});
        result[field] = branch;
      });
    }
    if (value) defaultValues = merge(value, defaultValues, {replace: trueIfLength(1)})
  }

  return {state: result, defaultValues, dataMap: dataMapObjects}
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

function setDataMapInState(state: StateType, schema: jsJsonSchema, dataMaps: normalizedDataMapType[], unset: boolean = false) {
  //let update: StateType = {};
  const UPDATABLE_object = {update: {}, replace: {}};
  dataMaps.forEach((dataMap) => {
    const emitterPath = dataMap.emitter;
    let bindMap2emitter: boolean = false;
    normalizeUpdate({path: emitterPath.join('/') + '/' + dataMap.from, to: normalizePath(dataMap.to, emitterPath), value: dataMap.action}, state).forEach(NdataMap => {
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
        setUPDATABLE(UPDATABLE_object, bindedMaps.concat(dataMap), true, emitterPath, SymDataMapTree, SymData);
        // setIn(UPDATABLE_object.replace, true, emitterPath, SymDataMapTree, SymData);
      }
      state = mergeStatePROCEDURE(state, UPDATABLE_object);
    }
  });
  return state
}

// function updDataMap2state(state: StateType, dataMap: normalizedDataMapType[], schema: jsJsonSchema) {
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

function isSchemaSelfManaged(schemaPart: jsJsonSchema, type: string) {
  return type !== 'array' && type !== 'object' || hasIn(schemaPart, 'ff_managed')
}

function findOneOf(oneOfShemas: any, value?: any, currentOneOf?: number) {
  if (!isArray(oneOfShemas)) oneOfShemas = [oneOfShemas];
  const oneOfKeys = oneOfShemas.map((v: any, i: number) => i);
  //for (let i = 0; i < oneOfShemas.length; i++) oneOfKeys.push(i);
  if (currentOneOf) moveArrayElems(oneOfKeys, currentOneOf, 0); // currentOneOf should be checked first to match type
  for (let k = 0; k < oneOfKeys.length; k++) {
    let oneOf = oneOfKeys[k];
    let schemaTypes = oneOfShemas[oneOf].type || types;
    if (!isArray(schemaTypes)) schemaTypes = [schemaTypes];
    let defaultUsed;
    let checkValue = isUndefined(value) ? (defaultUsed = true) && oneOfShemas[oneOf].default : value;
    for (let j = 0; j < schemaTypes.length; j++)
      if (types[schemaTypes[j]](checkValue) || isUndefined(checkValue)) return {schemaPart: oneOfShemas[oneOf], oneOf, type: schemaTypes[j]};
    if (defaultUsed && !isUndefined(oneOfShemas[oneOf].default))
      throw new Error('Type of schema.default is not supported by schema.type');
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

function setUPDATABLE(UPDATABLE_object: PROCEDURE_UPDATABLE_objectType, update: any, replace: any, ...pathes: any[]) {
  setIn(UPDATABLE_object, update, 'update', ...pathes);
  if (replace) setIn(UPDATABLE_object, replace, 'replace', ...pathes);
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
    setUPDATABLE(UPDATABLE_object, value, replace, path, SymData, keyPath);
    // setIn(update, value, path, SymData, keyPath);
    // if (replace) setIn(replace_UPDATABLE, replace, path, SymData, keyPath);

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
        setUPDATABLE(UPDATABLE_object, SymDelete, true, elemPath);
        // setIn(update, SymDelete, elemPath);
        // setIn(replace_UPDATABLE, SymDelete, elemPath);
      }

      let schemaPart = getSchemaPart(schema, path, oneOfFromState(state));
      setIn(update, isArrayCanAdd(schemaPart, end), path, SymData, 'fData', 'canAdd');
      for (let i = Math.max(Math.min(start, end) - 1, 0); i < end; i++)
        setUPDATABLE(UPDATABLE_object, getArrayItemData(schemaPart, i, end), true, path, i, SymData, 'arrayItem');

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
        const {value: v1, length: v2, oneOf: v3, fData: v4, ...previousBranchData} = oldBranch[SymData]; // remove data that should be replaced by new branch
        if (!isSelfManaged(oldBranch) || !isSelfManaged(branch)) delete previousBranchData.status; // keep status values only for self-managed branch, that keeps to be self-managed

        branch = merge(branch, {[SymData]: previousBranchData}, {arrays: 'replace'});
        if (path.length) {
          const topPath = path.slice();
          const field = topPath.pop();
          ['invalid', 'dirty', 'pending'].forEach(key => { // 'untouched',
            let oldStatusValue = getIn(oldBranch, SymData, 'status', key);
            let newStatusValue = getIn(branch, SymData, 'status', key);
            if (!oldStatusValue != !newStatusValue) state = Macros.setStatus(state, schema, UPDATABLE_object, makeNUpdate(topPath, ['status', key], newStatusValue ? 1 : -1));
          });
          let arrayOfRequired = getIn(state, topPath, SymData, 'fData', 'required');
          arrayOfRequired = isArray(arrayOfRequired) && arrayOfRequired.length && arrayOfRequired;
          if (arrayOfRequired && (~arrayOfRequired.indexOf(field))) branch = merge(branch, {[SymData]: {fData: {required: true}}});
        }

        if (getIn(oldBranch, SymData, 'status', 'untouched') == 0) branch = merge(branch, {[SymData]: {status: {untouched: 0}}});// stick untouched to zero
        state = merge(state, setIn({}, branch, path), {replace: setIn({}, true, path)});
        state = setDataMapInState(state, schema, maps2enable);
        if (getIn(branch, SymData, 'status', 'untouched') == 0) state = Macros.switch(state, schema, UPDATABLE_object, makeNUpdate(path, ['status', 'untouched'], 0));
        state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate([], push2array(['current'], path), defaultValues, true));
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

// todo: rework dataMaps and validation to work ...args and chains '|'
function executeDataMapsPROCEDURE(state: StateType, schema: jsJsonSchema, UPDATABLE_object: PROCEDURE_UPDATABLE_objectType, maps: any, item: NormalizedUpdateType) {
  const {value, path, replace} = item;
  const keyPath = item[SymData] || [];
  objKeys(maps || {}).forEach((pathTo) => {
    if (!maps[pathTo]) return; // disabled map
    const map: dataMapActionType = maps[pathTo];
    const NpathTo = path2string(normalizePath(pathTo, path));
    let executedValue = value;
    if (isObject(map)) {
      const bindObj = {path: NUpdate2string(item), pathTo: NpathTo, schema, getFromState: getFrom4DataMap(state, UPDATABLE_object)};
      executedValue = deArray(toArray(map.$).reduce((args, fn) => toArray(fn.call(bindObj, ...args)), push2array([executedValue], map.args)))
    }
    const updates = map.asUpdates ? toArray(executedValue) : [{path: NpathTo, value: executedValue, replace}];
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

function isNPath(path: any) {
  return getIn(path, SymData) === 'nPath';
}

function normalizePath(path: string | Path, base: string | Path = []): Path {
  let result = resolvePath(flattenPath(path), base.length ? flattenPath(base) : []);
  result[SymData] = 'nPath';
  return result;
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

const makeNUpdate = (path: Path, keyPath: Path, value?: any, replace?: any, rest: any = {}): NormalizedUpdateType => {return {path, [SymData]: keyPath, value, replace, ...rest}};


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
  if (state === value) return state;
  const path = flattenPath(pathes);
  let result = state;
  for (let i = 0; i < path.length - 1; i++) {
    if (result[path[i]] === value) return state;
    if (!isObject(result[path[i]])) result[path[i]] = {};
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

const objMap = (object: any, fn: (item: any, key: string, obj: anyObject) => any) =>
  objKeys(object).reduce((result, key) => (result[key] = fn(object[key], key, object)) && result, isArray(object) ? [] : {});

// function objKeysMap(obj: any, fn: Function, symbol = false) {
//   if (!isMergeable(obj)) return obj;
//   const result = _isArray(obj) ? [] : {};
//   (symbol ? objKeys : objKeysNSymb)(obj).forEach(key => result[fn(key)] = obj[key]);
//   return result;
// };

// function without(obj: {}, symbol = false, ...rest: any[]) {
//   //const args = arrFrom(rest); // [].slice.call(arguments);
//   const result = _isArray(obj) ? [] : {};
//   const fn = symbol ? objKeys : objKeysNSymb;
//   fn(obj).forEach(key => {
//     if (!~rest.indexOf(key)) result[key] = obj[key]
//   });
//   return result;
// };
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
// function replaceDeep(obj: any, value: any) {
//   if (!isMergeable(obj)) return value;
//   const result = _isArray(obj) ? [] : {};
//   objKeys(obj).forEach(field => result[field] = replaceDeep(obj[field], value));
//   return result;
// }
//


export {
  stateUpdates,
  string2NUpdate,
  //getValue,
  object2PathValues,
  makeStateFromSchema,
  makeStateBranch,
  string2path,
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
  setIfNotDeeper,
  objMap,
  setUPDATABLE,
  isNPath,
  multiplyPath
}

export {SymData, SymReset, SymClear, SymDelete}