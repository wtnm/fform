import {getSetIn, setIn, hasIn, getIn, objKeys, moveArrayElems, memoize, merge, objKeysNSymb, push2array, toArray, deArray, mergeState} from "react-ts-utils";
import {isMergeable, isUndefined, isNumber, isInteger, isString, isArray, isObject, isFunction, resolvePath} from "react-ts-utils";
import {anSetState, compileSchema} from './api';
import {_SCHEMAS} from './fform'

/////////////////////////////////////////////
//  Symbols
/////////////////////////////////////////////

const SymData: any = Symbol.for('FFormData');
const SymDataMapTree: any = Symbol.for('FFormDataMapTree');
const SymDataMap: any = Symbol.for('FFormDataMap');
const SymReset: any = Symbol.for('FFormReset');
const SymClear: any = Symbol.for('FFormClear');
const SymDelete = undefined; // Symbol.for('FFormDelete'); //
// const SymBranch: any = Symbol.for('FFormBranch');

const STATUS_REV = {
  'untouched': 'touched',
  'dirty': 'pristine',
  'unsubmitted': 'submitted'
};

/////////////////////////////////////////////
//  JSON types detector
/////////////////////////////////////////////

const types: any = ['null', 'boolean', 'integer', 'number', 'string', 'array', 'object'];
types.any = () => true;
types.null = (value: any) => value === null;
types.boolean = (value: any) => typeof value === "boolean";
types.number = isNumber;// (value: any) => typeof value === "number";
types.integer = isInteger; //(value: any) => typeof value === "number" && (Math.floor(value) === value || value > 9007199254740992 || value < -9007199254740992);
types.string = isString; //(value: any) => typeof value === "string";
types.array = isArray;
types.object = isObject; //(value: any) => typeof value === "object" && value && !isArray(value);// isObject(value);  //
types.empty = {'any': null, 'null': null, 'boolean': false, 'number': 0, 'integer': 0, 'string': '', array: Object.freeze([]), object: Object.freeze({})};
types.detect = (value: any) => {
  for (let i = 0; i < types.length; i++) {
    if (types[types[i]](value)) return types[i]
  }
};

/////////////////////////////////////////////
//  Macros
/////////////////////////////////////////////

function getBindedMaps2update(branch: StateType, path: Path = []) {
  const maps2disable: normalizedDataMapType[] = getIn(branch, SymDataMapTree, SymData) || [];
  const maps2enable = maps2disable.map((map => merge(map, {emitter: path})));
  let clearBinded: any = (maps2disable.length) ? {[SymDataMapTree]: {[SymData]: []}} : undefined
  objKeys(branch).forEach(key => {
    let result: any;
    if (branch[key]) {
      result = getBindedMaps2update(branch[key], path.concat(key));
      push2array(maps2disable, result.maps2disable);
      push2array(maps2enable, result.maps2enable);
      if (result.clearBinded) {
        if (!clearBinded) clearBinded = {};
        clearBinded[key] = result.clearBinded;
      }
    }
  });
  return {maps2disable, maps2enable, clearBinded}
}

const Macros: { [key: string]: any } = {};

Macros.array = (state: StateType, schema: jsJsonSchema, UPDATABLE: PROCEDURE_UPDATABLE_Type, item: NormalizedUpdateType) => {
  let {path, macros, value, [SymData]: sym, ...rest} = item as any;
  let length = getUpdValue([UPDATABLE.update, state], path, SymData, 'length');
  if (!isNumber(length)) return state;

  if (isArray(item.value)) {
    let mergeArrayObj: any = [];
    let replaceArrayObj: any = {};
    for (let i = 0; i < item.value.length; i++) {
      mergeArrayObj[length + i] = item.value[i];
      replaceArrayObj[length + i] = getIn(item.replace, i);
    }
    mergeArrayObj.length = length + item.value.length;
    return updateCurrentPROC(state, UPDATABLE, mergeArrayObj, replaceArrayObj, path, item.setOneOf)
  } else {
    length += item.value || 1;
    if (length < 0) length = 0;
    return updatePROC(state, UPDATABLE, makeNUpdate(path, ['length'], length, false, rest));
  }
};

Macros.arrayItem = (state: StateType, schema: jsJsonSchema, UPDATABLE: PROCEDURE_UPDATABLE_Type, item: NormalizedUpdateType) => {
  let path = item.path;
  let op = item.op;
  let opVal = item.value || 0;
  const from = parseInt(path.pop());
  let to = from;
  const min = arrayStart(getSchemaPart(schema, path, oneOfFromState(state))); // api.get(path.concat(SymData, 'array', 'arrayStartIndex'));
  const length = getUpdValue([UPDATABLE.update, state], path, SymData, 'length');
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
  updObj[0] = getIn(UPDATABLE.update, path);
  updObj[1] = getIn(UPDATABLE.update, SymData, 'current', path);
  updObj[2] = getIn(UPDATABLE.replace, path);
  updObj[3] = getIn(UPDATABLE.replace, SymData, 'current', path);

  let keys = [...getFromUPD(state, UPDATABLE)(path, SymData, 'keys')];


  for (let i = Math.min(from, to); i <= Math.max(from, to); i++) {
    stateObject[i] = getIn(state, path, i);
    arrayItems[i] = stateObject[i][SymData].arrayItem; //delIn(stateObject[i][SymData].arrayItem, ['uniqId']); // save arrayItem values, except "uniqId"
    //dataMaps[i] = stateObject[i][SymDataMapTree];
    currentObject[i] = getIn(state, SymData, 'current', path, i);
    updObj.forEach(obj => isMergeable(obj) && !obj.hasOwnProperty(i) && (obj[i] = SymClear));
  }
  stateObject = moveArrayElems(stateObject, from, to);
  currentObject = moveArrayElems(currentObject, from, to);
  keys = moveArrayElems(keys, from, to);
  const {maps2disable, maps2enable, clearBinded} = getBindedMaps2update(stateObject, path);
  if (clearBinded) stateObject = merge(stateObject, clearBinded);
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
  state = updatePROC(state, UPDATABLE, makeNUpdate(path, ['keys'], keys));
  if (op == 'del') state = updatePROC(state, UPDATABLE, makeNUpdate(path, ['length'], max));
  state = mergeUPD_PROC(state, UPDATABLE);
  state = setDataMapInState(state, UPDATABLE, maps2disable, true);
  state = setDataMapInState(state, UPDATABLE, maps2enable);
  return state
};

Macros.switch = (state: StateType, schema: jsJsonSchema, UPDATABLE: PROCEDURE_UPDATABLE_Type, item: NormalizedUpdateType) => {
  let keyPath = item[SymData] || [];
  let switches = makeSlice(keyPath, item.value);
  object2PathValues(switches, {arrayAsValue: true}).forEach(pathValue => state = recursivelyUpdate(state, schema, UPDATABLE, makeNUpdate(item.path, pathValue, pathValue.pop())));
  return state
};

Macros.setExtraStatus = (state: StateType, schema: jsJsonSchema, UPDATABLE: PROCEDURE_UPDATABLE_Type, item: NormalizedUpdateType) => {
  const keyPath = item[SymData] || [];
  let prevVal = getUpdValue([UPDATABLE.update, state], item.path, SymData, keyPath);
  let value = item.value > 0;
  if (!prevVal == value) {
    state = updatePROC(state, UPDATABLE, makeNUpdate(item.path, keyPath, value));
    state = Macros.setStatus(state, schema, UPDATABLE, makeNUpdate(item.path, ['status', keyPath[keyPath.length - 1]], value ? 1 : -1));
  }
  return state
};

Macros.setStatus = (state: StateType, schema: jsJsonSchema, UPDATABLE: PROCEDURE_UPDATABLE_Type, item: NormalizedUpdateType) => {
  const keyPath = item[SymData] || [];
  if (keyPath.length > 2) return Macros.setExtraStatus(state, schema, UPDATABLE, item);
  let op = keyPath[1];
  if (!op) return state;
  if (op == 'valid' || op == 'pristine' || op == 'touched') throw new Error('Setting "' + op + '" directly is not allowed');

  let prevVal = getUpdValue([UPDATABLE.update, state], item.path, SymData, keyPath);
  const selfManaged = isSelfManaged(state, item.path);

  if ((op == 'untouched' || op == 'unsubmitted') && prevVal == 0 && !selfManaged) return state;  // stick "untouched" and "unsubmitted" to zero for elements and arrays
  let value = prevVal + item.value;
  if (selfManaged && value > 1) value = 1;
  if (value < 0) value = 0;
  state = updatePROC(state, UPDATABLE, makeNUpdate(item.path, ['status', op], value));
  if (!isTopPath(item.path) && (!prevVal != !value)) //(prevVal && !value || !prevVal && value))
    state = Macros.setStatus(state, schema, UPDATABLE, makeNUpdate(item.path.slice(0, -1), keyPath, value > 0 ? 1 : -1));

  return state
};

Macros.setCurrent = (state: StateType, schema: jsJsonSchema, UPDATABLE: PROCEDURE_UPDATABLE_Type, item: NormalizedUpdateType) => {
  return updateCurrentPROC(state, UPDATABLE, item.value, item.replace, item.path, item.setOneOf)
};

Macros.setOneOf = (state: StateType, schema: jsJsonSchema, UPDATABLE: PROCEDURE_UPDATABLE_Type, item: NormalizedUpdateType) => {
  let oldOneOf = getIn(state, item.path, SymData, 'oneOf');
  if (oldOneOf == item.value) {
    if (!isUndefined(item.setValue)) state = updateCurrentPROC(state, UPDATABLE, item.setValue, false, item.path);
    return state;
  }
  const {macros, ...newItem} = item;
  newItem[SymData] = ['oneOf'];
  if (isUndefined(newItem.setValue)) {
    state = mergeUPD_PROC(state, UPDATABLE);
    newItem.setValue = getIn(state, SymData, 'current', item.path);
  }
  return updatePROC(state, UPDATABLE, newItem);
};


/////////////////////////////////////////////
//  Macros utils
/////////////////////////////////////////////


function recursivelyUpdate(state: StateType, schema: jsJsonSchema, UPDATABLE: PROCEDURE_UPDATABLE_Type, item: NormalizedUpdateType) {
  const branch = getIn(state, item.path);
  const keys = branchKeys(branch);
  if (item.value == SymReset && item[SymData][0] == 'status') {
    let i = {...item};
    i.value = (item[SymData][1] == 'untouched' || item[SymData][1] == 'unsubmitted') ? (isSelfManaged(branch) ? 1 : keys.length) : 0;
    state = updatePROC(state, UPDATABLE, i);
  } else state = updatePROC(state, UPDATABLE, item);
  keys.forEach(key => state = recursivelyUpdate(state, schema, UPDATABLE, merge(item, {path: item.path.concat(key)})));
  return state
};


function branchKeys(branch: StateType) {
  let keys: string[] = [];
  if (isSelfManaged(branch)) return keys;
  if (branch[SymData].fData.type == 'array') for (let j = 0; j < getIn(branch, SymData, 'length'); j++) keys.push(j.toString());
  else keys = objKeys(branch).filter(Boolean);
  return keys;
}


/////////////////////////////////////////////
//      Schema processing functions
/////////////////////////////////////////////

const schemaStorage = memoize(function (schema: jsJsonSchema) { // object that used to store and cache data for schema without modifying schema itself
  return {};
});

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


const additionalItemsSchema = memoize(function (items: jsJsonSchema[]): jsJsonSchema {
  return {
    _compiled: true,
    oneOf: items,
    _oneOfSelector: normalizeFn(function () {
      return string2path(this.path).pop() % items.length;
    }, {noStrictArrayResult: true})
  }
});

function getSchemaPart(schema: jsJsonSchema, path: Path, value_or_getOneOf: ((path: Path) => oneOfStructureType) | any, opts: any = {}): jsJsonSchema {
  let {fullOneOf} = opts;

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
        return additionalItemsSchema(items);
        //return items[index % items.length]
      }
    }
    throw new Error(errorText + path.join('/'));
  }

  function getSchemaByRef(schema: jsJsonSchema, $ref: string) {

    let [$id, path] = $ref.split('#');
    if (_SCHEMAS[$id]) {
      let refSchema = compileSchema(_SCHEMAS[$id], schema._elements);
      return getIn(refSchema, string2path(path))
    } else throw new Error(`Schema with ${$id} not registered.`);// No matching definition found, that's an error (bogus schema?)
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
          (schemaPart as any) = oneOf.map((oneOfPart, i) => merge.all(derefAndMergeAllOf(schema, oneOfPart), [restSchemaPart, {_oneOfIndex: i}], {array: 'replace'})) // deref every oneOf, merge allOf in there, and merge with schemaPart
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

  function detectOneOfNType(schemaPart: jsJsonSchema | jsJsonSchema[], valuePart: any, path: Path): oneOfStructureType {
    let oneOf = 0, type = types.detect(valuePart);
    if (type) {
      schemaPart = toArray(schemaPart);
      for (let j = 0; j < schemaPart.length; j++) {
        let types = schemaPart[j].type;
        if (!types || toArray(types).some(t => (t === type))) {
          oneOf = j;
          break;
        }
      }
      if (schemaPart[oneOf]._oneOfSelector) {
        oneOf = processFn.call({path: path2string(path)}, schemaPart[oneOf]._oneOfSelector, valuePart);
        if (isArray(oneOf)) oneOf = oneOf[0]
      }
    }
    return {oneOf, type};
  }


  const getOneOf = isFunction(value_or_getOneOf) ? value_or_getOneOf : undefined;
  const value = !isFunction(value_or_getOneOf) ? value_or_getOneOf : undefined;
  const errorText = 'Schema path not found: ';
  let schemaPart: jsJsonSchema | jsJsonSchema[] = schema;
  const combinedSchemas = getSetIn(schemaStorage(schema), new Map(), 'combinedSchemas');
  //let type;
  for (let i = path[0] == '#' ? 1 : 0; i < path.length; i++) {
    if (!schemaPart) throw new Error(errorText + path.join('/'));
    schemaPart = combineSchemasINNER_PROCEDURE(schemaPart);
    //let oneOf: number = 0, type: string | undefined;
    let track = path.slice(0, i);
    let {oneOf, type} = getOneOf ? getOneOf(track) : detectOneOfNType(schemaPart, getIn(value, track), track);
    if (isArray(schemaPart)) schemaPart = schemaPart[oneOf || 0];

    if (isUndefined(type)) type = toArray(schemaPart.type || 'null')[0];

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
  if (isArray(schemaPart)) {
    let {oneOf, type} = getOneOf ? getOneOf(path) : detectOneOfNType(schemaPart, getIn(value, path), path);
    schemaPart = schemaPart[oneOf || 0];
  }
  return schemaPart;
}


const arrayStart = memoize(function (schemaPart: jsJsonSchema) {
    if (!isArray(schemaPart.items)) return 0;
    if (schemaPart.additionalItems === false) return schemaPart.items.length;
    if (typeof schemaPart.additionalItems === 'object') return schemaPart.items.length;
    if (schemaPart.items.length == 0) return 0;
    return schemaPart.items.length - 1;
  }
);

const basicStatus = {invalid: 0, dirty: 0, unsubmitted: 1, untouched: 1, pending: 0, valid: true, submitted: false, touched: false, pristine: true};

const makeDataStorage = memoize(function (schemaPart: jsJsonSchema, oneOf: number, type: string, value: any = schemaPart.default) {
  // const x = schemaPart.x || ({} as FFSchemaExtensionType);
  const {_params = {}, _data = {}} = schemaPart;
  let result: any = Object.assign({params: _params}, _data);
  if (!isObject(result.messages)) result.messages = {};

  if (isUndefined(value)) value = types.empty[type || 'any'];

  result.oneOf = oneOf;
  result.status = basicStatus;
  if (!isObject(result.fData)) result.fData = {};
  const fData = result.fData;
  fData.type = type;
  fData.required = schemaPart.required;
  fData.title = schemaPart.title;
  fData.placeholder = schemaPart._placeholder;
  fData.additionalProperties = schemaPart.additionalProperties;
  fData.strictLayout = schemaPart._strictLayout;
  // fData.default = isUndefined(schemaPart.default) ? types.empty[type || 'any'] : schemaPart.default;
  if (schemaPart.enum) fData.enum = schemaPart.enum;
  if (schemaPart._enumExten) fData.enumExten = schemaPart._enumExten;

  if (isArray(schemaPart._enumExten) && isArray(schemaPart.enum)) {
    let enumExten = {};
    fData.enumExten = fData.enumExten.map((v: any) => isString(v) ? {label: v} : v);
    fData.enum.forEach((v: any, i: number) => enumExten[v] = fData.enumExten[i]);
    fData.enumExten = enumExten;
  } else if (schemaPart._enumExten && !fData.enum) {
    if (isArray(fData.enumExten)) {
      let enumExten = {};
      let _enum: string[] = [];
      fData.enumExten.forEach((v: any) => {
        // if (!isString(v) && !v) return;
        if (isString(v)) {
          enumExten[v] = {label: v};
          _enum.push(v)
        } else if (isObject(v)) {
          if (!isUndefined(v.value)) {
            if (isUndefined(v.label)) v = {...v, label: v.value};
            enumExten[v.value] = v;
            _enum.push(v.value);
          } else if (!isUndefined(v.label)) {
            enumExten[v.label] = v;
            _enum.push(v.label)
          }
        }

      });
      fData.enumExten = enumExten;
      fData.enum = _enum;
    } else fData.enum = objKeys(fData.enumExten).filter(k => fData.enumExten[k]);
  }
  if (schemaPart._oneOfSelector) fData.oneOfSelector = true;

  if (isSchemaSelfManaged(schemaPart, type)) result.value = value;
  else delete result.value;
  let untouched = 1;
  if (type == 'array') {
    result.length = getIn(value, 'length') || 0;
    if (!isUndefined(schemaPart.minItems) && result.length < schemaPart.minItems) result.length = schemaPart.minItems;
    result.fData.canAdd = isArrayCanAdd(schemaPart, result.length);
    untouched = result.length;
  } else if (type == 'object') untouched = objKeys(schemaPart.properties || {}).length;
  if (untouched != 1) result.status = {...result.status, untouched, unsubmitted: untouched};

  if (schemaPart._data$) {
    let res: any[] = [];
    objKeys(schemaPart._data$).forEach((k: string) =>
      push2array(res, processFn.call({}, (schemaPart._data$ as any)[k], schemaPart)));
    result = merge(result, res)
  }

  return result;
});


function getUniqKey() {return Date.now().toString(36) + Math.random().toString(36) }

function makeStateBranch(schema: jsJsonSchema, getNSetOneOf: (path: Path, upd?: oneOfStructureType) => oneOfStructureType, path: Path = [], value?: any) { //: { state: StateType, dataMap: StateType } {
  const result = {};
  const dataMapObjects: normalizedDataMapType[] = [];
  let defaultValues: any;
  let currentOneOf = (getNSetOneOf(path) || {}).oneOf;
  const schemaPartsOneOf = toArray(getSchemaPart(schema, path, getNSetOneOf, {fullOneOf: true}));
  if (isUndefined(currentOneOf)) {
    const _oneOfSelector = schemaPartsOneOf[currentOneOf || 0]._oneOfSelector;
    if (_oneOfSelector) {
      let setOneOf = processFn.call({path: path2string(path)}, _oneOfSelector, value);
      if (isArray(setOneOf)) setOneOf = setOneOf[0];
      currentOneOf = setOneOf;
      //schemaPart = schemaPartsOneOf[oneOf];
    }
  }
  let {schemaPart, oneOf, type} = findOneOf(schemaPartsOneOf, value, currentOneOf);

  if (isUndefined(schemaPart) || !isUndefined(currentOneOf) && currentOneOf != oneOf) { // value type is not that currentOneOf supports
    console.info('Passed value: "' + value + '" is not supported by schema.type in path "' + path.join('/') + '" and oneOfIndex "' + currentOneOf + '". Reset value to default.\n');
    value = (schemaPartsOneOf)[currentOneOf || 0].default; // so, reset value to default, cause keeping oneOf is in prior (if currentOneOf exists, otherwise oneOf is changed)
    const tmp = findOneOf(schemaPartsOneOf, value, currentOneOf);
    schemaPart = tmp.schemaPart;
    oneOf = tmp.oneOf;
    type = tmp.type;
  }
  push2array(dataMapObjects, normalizeStateMaps(schemaPart._stateMaps || [], path));
  result[SymDataMap] = {};
  result[SymData] = makeDataStorage(schemaPart, oneOf, type, value);
  getNSetOneOf(path, {oneOf, type});

  if ((result[SymData].hasOwnProperty('value'))) {
    defaultValues = result[SymData].value;
  } else {
    if (type == 'array') {
      defaultValues = [];
      defaultValues.length = result[SymData].length;
      let keys = [];
      for (let i = 0; i < defaultValues.length; i++) {
        let {state: branch, dataMap, defaultValues: dValue} = makeStateBranch(schema, getNSetOneOf, path.concat(i), getIn(isUndefined(value) ? schemaPart.default : value, i));
        defaultValues[i] = dValue;
        push2array(dataMapObjects, dataMap);
        branch = merge(branch, {[SymData]: {arrayItem: getArrayItemData(schemaPart, i, defaultValues.length)}}, {replace: {[SymData]: {ArrayItem: true}}});
        branch = merge(branch, {[SymData]: {params: {uniqKey: getUniqKey()}}});
        result[i] = branch;
        keys[i] = branch[SymData].params.uniqKey
      }
      result[SymData] = merge(result[SymData], {keys});
    } else if (type == 'object') {
      defaultValues = isObject(schemaPart.default) ? {...schemaPart.default} : {};
      if (value && schemaPart.additionalProperties === false) {
        value = removeNotAllowedProperties(schemaPart, value);
        defaultValues = removeNotAllowedProperties(schemaPart, defaultValues);
      }
      if (isObject(value)) Object.assign(defaultValues, value);
      let arrayOfRequired = result[SymData].fData.required;
      arrayOfRequired = isArray(arrayOfRequired) && arrayOfRequired.length && arrayOfRequired;
      objKeys(schemaPart.properties || {}).forEach(field => {
        let {state: branch, dataMap, defaultValues: dValue} = makeStateBranch(schema, getNSetOneOf, path.concat(field), getIn(isUndefined(value) ? schemaPart.default : value, field));
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

function isSelfManaged(state: StateType, ...paths: any[]) {
  return hasIn(state, ...paths, SymData, 'value')
}

function isSchemaSelfManaged(schemaPart: jsJsonSchema, type: string) {
  return type !== 'array' && type !== 'object' || getIn(schemaPart, '_simple')
}

function findOneOf(oneOfShemas: any, value?: any, currentOneOf?: number) {
  if (!isArray(oneOfShemas)) oneOfShemas = [oneOfShemas];
  const oneOfKeys = oneOfShemas.map((v: any, i: number) => i);
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
  return {}
  //return {schemaPart: oneOfShemas[0], oneOf: 0, type: toArray(oneOfShemas[0].type || types)[0]}
}

function rehydrateState(state: any, UPDATABLE: PROCEDURE_UPDATABLE_Type) {
  let {dataMap = []} = makeStateBranch(UPDATABLE.api.schema, oneOfFromState(state));
  return setDataMapInState(state, UPDATABLE, dataMap, null);
}

/////////////////////////////////////////////
//      state update PROCEDURES
/////////////////////////////////////////////


function updateMessagesPROC(state: StateType, UPDATABLE: PROCEDURE_UPDATABLE_Type, track: Path, result?: MessageData, defaultGroup = 0) {
  function conv(item: MessageGroupType | string): MessageGroupType {
    return (typeof item === 'object') ? item : {group: defaultGroup, data: item};
  }

  let messages: MessageGroupType[] = toArray(result).map(conv);
  messages.forEach((item) => {
    let {path, ...itemNoPath} = item;
    if (path) {
      path = normalizePath(path, track);
      state = updateMessagesPROC(state, UPDATABLE, path, itemNoPath, defaultGroup)
    } else {
      let {group = defaultGroup, data, priority = 0, ...rest} = itemNoPath;
      const messageData = getSetIn(UPDATABLE.update, {}, track, SymData, 'messages', priority);
      Object.assign(messageData, rest);
      if (!isObject(messageData.texts)) messageData.texts = {};
      if (!isArray(messageData.texts[group])) messageData.texts[group] = [];
      if (data) push2array(messageData.texts[group], data);
    }
  });
  return state
}

function getCurrentPriority(messages: any) {
  let priorities = objKeys(messages || {});
  let currentPriority;
  for (let i = 0; i < priorities.length; i++) {
    let groups = getIn(messages, priorities[i], 'texts') || {};
    let grKeys = objKeys(groups);
    for (let j = 0; j < grKeys.length; j++) {
      if (groups[grKeys[j]] && groups[grKeys[j]].length) {
        currentPriority = parseInt(priorities[i]);
        break;
      }
    }
    if (!isUndefined(currentPriority)) break;
  }
  return currentPriority
}

function setPriorityPROC(state: StateType, UPDATABLE: PROCEDURE_UPDATABLE_Type, track: Path, currentPriority?: number) {
  state = updatePROC(state, UPDATABLE, makeNUpdate(track, ['status', 'validation', 'invalid'], currentPriority === 0 ? 1 : 0, true, {macros: 'setStatus'}));
  state = updatePROC(state, UPDATABLE, makeNUpdate(track, ['status', 'priority'], currentPriority));
  return state;
}

function setValidStatusPROC(state: StateType, UPDATABLE: PROCEDURE_UPDATABLE_Type, update: any, track: Path = []) {
  let currentPriority = getCurrentPriority(getIn(state, track, SymData, 'messages'));
  state = setPriorityPROC(state, UPDATABLE, track, currentPriority);
  if (!isSelfManaged(state, track)) objKeys(update).forEach(key => state = setValidStatusPROC(state, UPDATABLE, update[key], track.concat(key)));
  return state
}

function makeValidation(state: StateType, dispatch: any, action: any) {

  function recurseValidationInnerPROCEDURE(state: StateType, validatedValue: StateType, modifiedValues: StateType, track: Path = []) {
    let schemaPart: jsJsonSchema;
    try {schemaPart = getSchemaPart(schema, track, oneOfFromState(state))} catch (e) {return state}

    const selfManaged = isSelfManaged(state, track);
    if (!selfManaged)
      modifiedValues && objKeys(modifiedValues).forEach(key => state = recurseValidationInnerPROCEDURE(state, validatedValue[key], modifiedValues[key], track.concat(key)));

    let _validators = getIn(schemaPart, '_validators');

    if (_validators) {
      const field = makeSynthField(UPDATABLE.api, path2string(track));
      objKeys(_validators).forEach((k: string) => {
        let validator = (_validators as any)[k];
        const updates: any[] = [];
        field.updates = updates;
        let result = processFn.call(field, validator, validatedValue);
        if (result && result.then && typeof result.then === 'function') { //Promise
          result.validatedValue = validatedValue;
          result.path = track;
          result.selfManaged = selfManaged;
          vPromises.push(result);
          state = updatePROC(state, UPDATABLE, makeNUpdate(track, ['status', 'validation', 'pending'], 1, true, {macros: 'setStatus'}))
        } else state = updateMessagesPROC(state, UPDATABLE, track, result, 1);
        if (updates.length) updates.forEach((update: any) => state = updatePROC(state, UPDATABLE, update));
        field.updates = null
      })
    }
    return state
  }

  function clearDefaultMessagesInnerPROCEDURE(state: StateType, modifiedValues: StateType, track: Path = []) {
    const type = getIn(state, track, SymData, 'fData', 'type');
    if (!type) return state;
    if (type == 'object' || type == 'array')
      modifiedValues && objKeys(modifiedValues).forEach(key => clearDefaultMessagesInnerPROCEDURE(state, modifiedValues[key], track.concat(key)));
    setUPDATABLE(UPDATABLE, {}, true, track, SymData, 'messages', '0', 'texts');
    return state;
    //return updateMessagesPROC(state, UPDATABLE, track); // sets empty array for 0-level messages
  }

  let {api, force, opts, promises} = action;
  const {JSONValidator, schema, getState, UPDATABLE} = api;
  const currentValues = state[SymData].current;
  const vPromises: vPromisesType[] = [];
  const modifiedValues = force === true ? currentValues : force;
  //console.log('modifiedValues ', modifiedValues);

  if (!modifiedValues || objKeys(modifiedValues).length == 0) { // no changes, no validation
    promises.resolve();
    promises.vAsync.resolve();
    return state;
  }
  if (JSONValidator) {
    state = clearDefaultMessagesInnerPROCEDURE(state, modifiedValues);
    let errs = JSONValidator(currentValues);  // Validate, using JSONSchemaValidator;
    errs.forEach((item: any) => updateMessagesPROC(state, UPDATABLE, item[0], item[1]));
  }
  state = recurseValidationInnerPROCEDURE(state, currentValues, modifiedValues);
  let update = UPDATABLE.update;
  state = mergeUPD_PROC(state, UPDATABLE);
  state = setValidStatusPROC(state, UPDATABLE, update);
  state = mergeUPD_PROC(state, UPDATABLE);
  promises.resolve();
  if (vPromises.length) {
    Promise.all(vPromises).then((results) => {
      let state = getState();
      let UPDATABLE = api.UPDATABLE;
      let newValues = state[SymData].current; //getRawValues().current;
      for (let i = 0; i < vPromises.length; i++) {
        //if (!results[i]) continue;
        let {validatedValue, path, selfManaged} = vPromises[i];
        if (validatedValue == getIn(newValues, path)) {
          state = updateMessagesPROC(state, UPDATABLE, path, results[i] || '', 2);
          state = updatePROC(state, UPDATABLE, makeNUpdate(path, ['status', 'validation', 'pending'], 0, false, {macros: 'setStatus'}))
          // pendingStatus[path2string(path)] = false;
        }
      }
      let update = UPDATABLE.update;
      state = mergeUPD_PROC(state, UPDATABLE);
      state = setValidStatusPROC(state, UPDATABLE, update);
      state = mergeUPD_PROC(state, UPDATABLE);// merge(state, UPDATABLE.update, {replace: UPDATABLE.replace});
      dispatch({type: anSetState, state, api});
      promises.vAsync.resolve();
    }).catch(reason => {
      let state = getState();
      let UPDATABLE = api.UPDATABLE; // let UPDATABLE = {update: {}, replace: {}, api: {};
      let newValues = state[SymData].current; //getRawValues().current;
      for (let i = 0; i < vPromises.length; i++) {
        let {validatedValue, path, selfManaged} = vPromises[i];
        if (validatedValue == getIn(newValues, path)) {
          state = updatePROC(state, UPDATABLE, makeNUpdate(path, ['status', 'validation', 'pending'], 0, false, {macros: 'setStatus'}))
        }
      }
      let update = UPDATABLE.update;
      state = mergeUPD_PROC(state, UPDATABLE);
      state = setValidStatusPROC(state, UPDATABLE, update);
      state = mergeUPD_PROC(state, UPDATABLE);
      dispatch({type: anSetState, state, api});
      promises.vAsync.reject(reason);
    })
  } else promises.vAsync.resolve();
  return state;
}

function setDirtyPROC(state: StateType, UPDATABLE: PROCEDURE_UPDATABLE_Type, initial: any, current: any, track: Path = []) {
  if (isUndefined(initial)) initial = getIn(state, SymData, 'default', track);
  if (current === initial) return state;
  const {schema} = UPDATABLE.api;
  let schemaPart;
  try {schemaPart = getSchemaPart(schema, track, oneOfFromState(state))} catch (e) {}

  if (!schemaPart || isSelfManaged(state, track)) { //direct compare
    let path: Path = schemaPart ? track : track.slice(0, -1);
    state = updatePROC(state, UPDATABLE, makeNUpdate(path, ['status', 'dirty'], 1, false, {macros: 'setStatus'}))
  } else {
    let keys = objKeys(Object.assign({}, initial, current));
    keys.forEach(key => state = setDirtyPROC(state, UPDATABLE, getIn(initial, key), getIn(current, key), track.concat(key)))
  }
  return state
}

function updateDirtyPROC(state: StateType, UPDATABLE: PROCEDURE_UPDATABLE_Type, initial: any, currentChanges: any, track: Path = [], forceDirty = false) {
  const {schema} = UPDATABLE.api;
  let schemaPart;
  try {schemaPart = getSchemaPart(schema, track, oneOfFromState(state))} catch (e) {}
  if (!schemaPart || isSelfManaged(state, track)) { //direct compare
    let current = getIn(state, SymData, 'current', track);
    if (isUndefined(initial)) initial = getIn(state, SymData, 'default', track);
    let value = forceDirty || current !== initial ? 1 : -1;
    let path: Path = track;
    let keyPath = ['status', 'dirty'];
    if (!schemaPart) {
      path = path.slice();
      keyPath.push(path.pop(), keyPath.pop() as any);
    }
    state = updatePROC(state, UPDATABLE, makeNUpdate(path, keyPath, value, false, {macros: 'setStatus',}))
  } else {
    let keys = objKeys(currentChanges || {});
    if (schemaPart.type == 'array') {
      if (!~keys.indexOf('length')) keys.push('length');
      let existKeys = branchKeys(getIn(state, track));
      keys = keys.filter(k => isNaN(parseInt(k)) || ~existKeys.indexOf(k))
    }
    // if (schemaPart.type == 'array' && !~keys.indexOf('length')) keys.push('length');
    forceDirty = forceDirty || !isMergeable(initial);
    keys.forEach(key => state = updateDirtyPROC(state, UPDATABLE, getIn(initial, key), getIn(currentChanges, key), track.concat(key), forceDirty))
  }
  return state
}

function setPristinePROC(state: StateType, UPDATABLE: PROCEDURE_UPDATABLE_Type, initial: any, track: Path = []) {
  if (getIn(UPDATABLE.update, track, SymData, 'status', 'pristine')) {
    if (isMergeable(initial) && getIn(state, SymData, 'current', track) !== initial) {
      setIn(UPDATABLE.update, initial, SymData, 'current', track);
      setIn(UPDATABLE.replace, true, SymData, 'current', track);
    }
  } else {
    objKeys(getIn(UPDATABLE.update, track)).forEach(key => setPristinePROC(state, UPDATABLE, getIn(initial, key), track.concat(key)))
  }
  return state
}

function updateState(dispatch: any) {
  // console.time('execActions');

  let {updates, state, api, forceValidation, opts, promises} = this;
  let {getState, schema, UPDATABLE} = api;
  if (!state) state = getState();
  let prevState = state;

  updates.forEach((update: StateApiUpdateType) => state = updatePROC(state, UPDATABLE, update));
  state = mergeUPD_PROC(state, UPDATABLE);
  let oldCurrent = getIn(prevState, SymData, 'current');
  if (UPDATABLE.forceCheck) {
    oldCurrent = merge(oldCurrent, UPDATABLE.forceCheck);
    UPDATABLE.forceCheck = undefined;
  }
  if (prevState[SymData].initial !== state[SymData].initial) {  // check dirty for initial changes
    let initialChanges = mergeState(prevState[SymData].initial, state[SymData].initial, {diff: true}).changes;
    state = updateDirtyPROC(state, UPDATABLE, state[SymData].initial, initialChanges);
  }
  let currentChanges = mergeState(oldCurrent, getIn(state, SymData, 'current'), {diff: true}).changes;
  if (currentChanges)
    state = updateDirtyPROC(state, UPDATABLE, state[SymData].initial, currentChanges); // check dirty only for changes
  state = setPristinePROC(state, UPDATABLE, state[SymData].initial);
  state = mergeUPD_PROC(state, UPDATABLE);

  let force;
  if (opts.noValidation) force = forceValidation;
  else {
    if (forceValidation) {
      object2PathValues(currentChanges).forEach(path => {
        path.pop();
        setIfNotDeeper(forceValidation, true, path)
      });
      force = forceValidation;
    } else force = isMergeable(currentChanges) ? currentChanges : !isUndefined(currentChanges);
  }

  if (force) state = makeValidation(state, dispatch, {force, api, opts, promises});
  else {
    promises.resolve();
    promises.vAsync.resolve();
  }
  dispatch({type: anSetState, state, api});

  return promises;

}

const makeStateFromSchema = memoize(function (schema: jsJsonSchema) {
  return makeStateBranch(schema, oneOfStructure({}, []));
});

function initState(UPDATABLE: PROCEDURE_UPDATABLE_Type) {
  let {state, dataMap = [], defaultValues} = makeStateFromSchema(UPDATABLE.api.schema);
  state = merge(state, setIn({}, defaultValues, [SymData, 'current']));
  state = setDataMapInState(state, UPDATABLE, dataMap);
  const current: any = getIn(state, SymData, 'current');
  state = updatePROC(state, UPDATABLE, makeNUpdate([], ['initial'], current));
  state = updatePROC(state, UPDATABLE, makeNUpdate([], ['default'], current));
  state = mergeUPD_PROC(state, UPDATABLE);
  return state;
}


/////////////////////////////////////////////
//      items updating PROCEDURES
/////////////////////////////////////////////


function updateCurrentPROC(state: StateType, UPDATABLE: PROCEDURE_UPDATABLE_Type, value: any, replace: any, track: Path = [], setOneOf?: number): StateType {

  if (value === SymReset || isUndefined(value)) value = getIn(state, SymData, 'initial', track);
  if (value === SymClear || isUndefined(value)) value = getIn(state, SymData, 'default', track);
  if (getIn(state, SymData, 'current', track) === value && !hasIn(UPDATABLE.update, SymData, 'current', track)) return state;

  const schema = UPDATABLE.api.schema;
  let branch = getIn(state, track);

  // if no branch then no need to modify state for this value, just update current
  if (!branch) {
    if (track[track.length - 1] == 'length') {  // hook if someone decides to edit array's length directly
      const topPath = track.slice(0, -1);
      const topBranch = getIn(state, topPath);
      if (topBranch[SymData].fData.type == 'array')
        return updatePROC(state, UPDATABLE, makeNUpdate(topPath, ['length'], value));
    }
    return updatePROC(state, UPDATABLE, makeNUpdate([], ['current'].concat(track), value, replace));
  }

  if (branch[SymData].fData.oneOfSelector) {
    const field = makeSynthField(UPDATABLE.api, path2string(track));

  }
  const oneOfSelector = branch[SymData].fData.oneOfSelector;
  const type = branch[SymData].fData.type;
  // if (isUndefined(value)) {
  //   value = getIn(state, SymData, 'initial', track);
  //   if (isUndefined(value)) value = branch[SymData].fData.default;
  // }
  if (!isUndefined(setOneOf) || oneOfSelector || !types[type || 'any'](value)) { // if wrong type for current oneOf index search for proper type in oneOf
    // setOneOf =
    const parts = getSchemaPart(schema, track, oneOfFromState(state), {fullOneOf: true});
    let currentOneOf = branch[SymData].oneOf;
    if (oneOfSelector) {
      //const field = makeSynthField(UPDATABLE.api, path2string(track));
      const _oneOfSelector = parts[currentOneOf]._oneOfSelector;
      setOneOf = processFn.call({path: path2string(track)}, _oneOfSelector, value);
      if (isArray(setOneOf)) setOneOf = setOneOf[0];
    }

    const {schemaPart, oneOf, type} = findOneOf(parts, value, isUndefined(setOneOf) ? currentOneOf : setOneOf);
    if (currentOneOf !== oneOf) {
      if (schemaPart) {
        let cur = getIn(state, SymData, 'current', track);
        //if (!cur) debugger;
        if (!isSchemaSelfManaged(schemaPart, type) && branch[SymData].fData.type === type) value = merge(getIn(state, SymData, 'current', track), value, {replace});
        return updatePROC(state, UPDATABLE, makeNUpdate(track, ['oneOf'], oneOf, false, {type, setValue: value}));
      } else console.warn('Type "' + (types.detect(value)) + '" not found in path [' + track.join('/') + ']')
    }
  }

  if (isSelfManaged(branch)) { // if object has own value then replace it directly
    state = updatePROC(state, UPDATABLE, makeNUpdate(track, ['value'], value, replace));
  } else {
    if (isMergeable(value)) {  // if we receive object or array then apply their values to state
      if (type == 'array' && !isUndefined(value.length)) {
        state = updatePROC(state, UPDATABLE, makeNUpdate(track, ['length'], value.length));
        branch = getIn(state, track);
      }

      const removeNotAllowedProps = type == 'object' && branch[SymData].fData.additionalProperties === false;
      if (removeNotAllowedProps)  // keep only existing in state(schema) properties
        value = removeNotAllowedProperties(getSchemaPart(schema, track, oneOfFromState(state)), value);

      if (replace === true) { // restore value's props-structure that are exist in state
        let v = isArray(value) ? [] : {};
        branchKeys(branch).forEach(k => v[k] = undefined);
        value = Object.assign(v, value);
      }

      objKeys(value).forEach(key =>
        state = updateCurrentPROC(state, UPDATABLE, value[key], replace === true ? true : getIn(replace, key), track.concat(key)));

      if (replace === true || removeNotAllowedProps) { // remove props from current that are not in value or in state
        state = mergeUPD_PROC(state, UPDATABLE);
        branch = getIn(state, track);
        let current = getIn(state, SymData, 'current', track);
        //value = {...value};
        branchKeys(branch).forEach(k => value[k] = current[k]);
        state = updatePROC(state, UPDATABLE, makeNUpdate([], ['current'].concat(track), value, replace));
      }
    }
  }

  return state
}


function removeNotAllowedProperties(schemaPart: jsJsonSchema, value: any) {
  if (schemaPart.type !== 'object' || schemaPart.additionalProperties !== false) return value;
  let v = {};
  let properties = schemaPart.properties || {};
  let patterns = objKeys(schemaPart.patternProperties || {}).map(pattern => new RegExp(pattern));
  objKeys(value).forEach(k => {// test if match against properties or patternProperties
    if (properties[k] || patterns.some(re => k.match(re))) v[k] = value[k];
  });
  return v;

}

function splitValuePROC(state: StateType, UPDATABLE: PROCEDURE_UPDATABLE_Type, item: NormalizedUpdateType): StateType {
  const {value: itemValue, path, replace} = item;
  const keyPath = item[SymData] || [];
  if (keyPath.length == 0) {
    const {value, status, length, oneOf, ...rest} = itemValue;
    ['value', 'status', 'length', 'oneOf'].forEach(key => {
      if (hasIn(itemValue, key)) state = updatePROC(state, UPDATABLE, makeNUpdate(path, [key], itemValue[key], getIn(replace, key)))
    });
    if (objKeys(rest).length) state = updatePROC(state, UPDATABLE, makeNUpdate(path, keyPath, rest, replace))
  } else {
    objKeys(itemValue).forEach(key => {
      state = updatePROC(state, UPDATABLE, makeNUpdate(path, keyPath.concat(key), itemValue[key], getIn(replace, key)))
    });
  }
  return state
}

function updateNormalizationPROC(state: StateType, UPDATABLE: PROCEDURE_UPDATABLE_Type, item: StateApiUpdateType): StateType {
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

    state = updatePROC(state, UPDATABLE, i);
  });
  return state;
}

function setUPDATABLE(UPDATABLE: PROCEDURE_UPDATABLE_Type, update: any, replace: any, ...paths: any[]) {
  object2PathValues(replace).forEach(path => {
    let replaceValue = path.pop();
    setIn(UPDATABLE, getIn(update, path), 'update', ...paths, path);
    if (replaceValue) setIn(UPDATABLE, replaceValue, 'replace', ...paths, path);
  });
  return UPDATABLE;
}

function mergeUPD_PROC(state: StateType, UPDATABLE: PROCEDURE_UPDATABLE_Type) {
  state = merge(state, UPDATABLE.update, {replace: UPDATABLE.replace});
  UPDATABLE.update = {};
  UPDATABLE.replace = {};
  return state;
}

function updatePROC(state: StateType, UPDATABLE: PROCEDURE_UPDATABLE_Type, item: NormalizedUpdateType | StateApiUpdateType | null): StateType {
  if (!item) return state;
  const {update, replace: replace_UPDATABLE, api} = UPDATABLE;
  const {schema} = api;
  // normalize updates
  if (!isNUpdate(item)) return updateNormalizationPROC(state, UPDATABLE, item);

  // execute macros
  if (item.macros) {
    let macro = Macros[item.macros];
    if (!macro) throw new Error('"' + macro + '" not found in macros');
    return macro(state, schema, UPDATABLE, item);
  }

  let {value, path, replace} = item;
  const keyPath = item[SymData];
  if (isFunction(value)) value = value(getFromUPD(state, UPDATABLE)(path, SymData, keyPath));

  if (path.length == 0 && (keyPath[0] == 'initial' || keyPath[0] == 'default')) {
    // if (keyPath[0] == 'initial')  value = merge(getIn(state, SymData, 'default', keyPath.slice(1)), value);
    state = merge(state, makeSlice(SymData, keyPath, value), {replace: makeSlice(SymData, keyPath, replace)})
  } else {
    // split object for proper state update (for dataMap correct execution)
    if (isObject(value) && (keyPath.length == 0 && (hasIn(value, 'value') || hasIn(value, 'status') || hasIn(value, 'length') || hasIn(value, 'oneOf'))
      || (keyPath.length == 1 && keyPath[0] == 'status'))) return splitValuePROC(state, UPDATABLE, item);

    let branch = getIn(state, path);
    if (!isObject(branch)) return state; // check if there is branch in state

    if (keyPath[0] == 'value' && !hasIn(branch, SymData, 'value')) // value is not self managed, so modify only current
      return Macros.setCurrent(state, schema, UPDATABLE, {value, replace, path: path.concat(keyPath.slice(1))});

    // check if value is differ
    if (value === getUpdValue([UPDATABLE.update, state], path, SymData, keyPath)) return state;

    // set data
    setUPDATABLE(UPDATABLE, value, replace, path, SymData, keyPath);
    // setIn(update, value, path, SymData, keyPath);
    // if (replace) setIn(replace_UPDATABLE, replace, path, SymData, keyPath);

    // additional state modifying if required
    if (keyPath[0] == 'value') { // modify current
      state = updatePROC(state, UPDATABLE, makeNUpdate([], push2array(['current'], path, keyPath.slice(1)), value, replace))
    } else if (keyPath[0] == 'messages') { // modify valid status
      const messages = getFromUPD(state, UPDATABLE)(path, SymData, 'messages');
      let currentPriority = getCurrentPriority(messages);
      state = setPriorityPROC(state, UPDATABLE, path, currentPriority);
    } else if (keyPath[0] == 'length') { // modify state with new length
      state = updatePROC(state, UPDATABLE, makeNUpdate([], push2array(['current'], path, keyPath), value, replace));
      let start = branch[SymData].length;
      start = Math.max(start, 0);
      let end = Math.max(value || 0);
      const oneOfStateFn = oneOfStructure(state, path);
      const maps2enable: any[] = [];
      const maps2disable: any[] = [];
      let keys = [...getFromUPD(state, UPDATABLE)(path, SymData, 'keys')];
      keys.length = end;
      for (let i = start; i < end; i++) {
        let elemPath = path.concat(i);
        if (!isUndefined(item.setOneOf)) oneOfStateFn(elemPath, {oneOf: item.setOneOf});
        let {state: branch, dataMap = [], defaultValues} = makeStateBranch(schema, oneOfStateFn, elemPath);
        const untouched = getUpdValue([state, UPDATABLE.update], path, SymData, 'status', 'untouched');
        const unsubmitted = getUpdValue([state, UPDATABLE.update], path, SymData, 'status', 'unsubmitted');
        const mergeBranch: any = {[SymData]: {params: {uniqKey: getUniqKey()}}};
        keys[i] = mergeBranch[SymData].params.uniqKey;
        if (!untouched) setIn(mergeBranch[SymData], {untouched: 0, touched: true}, 'status');
        if (!unsubmitted) setIn(mergeBranch[SymData], {unsubmitted: 0, submitted: true}, 'status');
        branch = merge(branch, mergeBranch);
        state = merge(state, setIn({}, branch, elemPath), {replace: setIn({}, true, elemPath)});
        state = updatePROC(state, UPDATABLE, makeNUpdate([], push2array(['current'], elemPath), defaultValues, true));
        push2array(maps2enable, dataMap);
        if (untouched) state = Macros.setStatus(state, schema, UPDATABLE, makeNUpdate(path, ['status', 'untouched'], 1));
        if (unsubmitted) state = Macros.setStatus(state, schema, UPDATABLE, makeNUpdate(path, ['status', 'unsubmitted'], 1));
      }
      for (let i = end; i < start; i++) {
        let elemPath = path.concat(i);
        push2array(maps2disable, getIn(state, elemPath, SymDataMapTree, SymData) || []);
        ['invalid', 'dirty', 'unsubmitted', 'untouched', 'pending'].forEach(key => {
          let statusValue = getUpdValue([update, state], elemPath, SymData, 'status', key);
          if (statusValue) state = Macros.setStatus(state, schema, UPDATABLE, makeNUpdate(path, ['status', key], -1));
        });
        setUPDATABLE(UPDATABLE, SymDelete, true, elemPath);
        // setIn(update, SymDelete, elemPath);
        // setIn(replace_UPDATABLE, SymDelete, elemPath);
      }
      //setUPDATABLE(UPDATABLE, keys, true, path, SymData, 'keys');
      let schemaPart = getSchemaPart(schema, path, oneOfFromState(state));
      setIn(update, isArrayCanAdd(schemaPart, end), path, SymData, 'fData', 'canAdd');
      for (let i = Math.max(Math.min(start, end) - 1, 0); i < end; i++)
        setUPDATABLE(UPDATABLE, getArrayItemData(schemaPart, i, end), true, path, i, SymData, 'arrayItem');

      state = mergeUPD_PROC(state, UPDATABLE);
      state = setDataMapInState(state, UPDATABLE, maps2disable, true);
      state = setDataMapInState(state, UPDATABLE, maps2enable);
      state = updatePROC(state, UPDATABLE, makeNUpdate(path, ['keys'], keys));

    } else if (keyPath[0] == 'status') { // properly set status change
      let keyStatus = keyPath[1];
      let newKey;
      let value;
      if (keyStatus == 'invalid' || keyStatus == 'pending') {
        value = getUpdValue([update, state], path, SymData, 'status', 'pending') ? null : !getUpdValue([update, state], path, SymData, 'status', 'invalid');
        newKey = 'valid';
      } else if (keyStatus == 'untouched' || keyStatus == 'dirty' || keyStatus === 'unsubmitted') {
        value = !getUpdValue([update, state], path, SymData, 'status', keyStatus);
        newKey = STATUS_REV[keyStatus];
      }
      if (!isUndefined(newKey))
        state = updatePROC(state, UPDATABLE, makeNUpdate(path, ['status', newKey], value));
      //setIn(update, value, path, SymData, 'status', newKey);

    } else if (keyPath[0] == 'oneOf') {
      const oldBranch = getIn(state, path);
      let oldOneOf = getIn(oldBranch, SymData, 'oneOf') || 0;
      let newOneOf = getIn(UPDATABLE.update, path, SymData, 'oneOf');
      if ((oldOneOf != newOneOf) || (item.type && item.type != getIn(oldBranch, SymData, 'fData', 'type'))) {
        setIfNotDeeper(UPDATABLE, SymReset, 'forceCheck', item.path);
        state = mergeUPD_PROC(state, UPDATABLE);
        state = setDataMapInState(state, UPDATABLE, getIn(state, path, SymDataMapTree, SymData) || [], true);

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
            if (!oldStatusValue != !newStatusValue) state = Macros.setStatus(state, schema, UPDATABLE, makeNUpdate(topPath, ['status', key], newStatusValue ? 1 : -1));
          });
          let arrayOfRequired = getIn(state, topPath, SymData, 'fData', 'required');
          arrayOfRequired = isArray(arrayOfRequired) && arrayOfRequired.length && arrayOfRequired;
          if (arrayOfRequired && (~arrayOfRequired.indexOf(field))) branch = merge(branch, {[SymData]: {fData: {required: true}}});
        }
        ['untouched', 'unsubmitted'].forEach(statusKey => {
          if (getIn(oldBranch, SymData, 'status', statusKey) == 0)
            branch = merge(branch, {[SymData]: {status: {[statusKey]: 0, [STATUS_REV[statusKey]]: true}}});// stick untouched and unsubmitted to zero
          state = merge(state, setIn({}, branch, path), {replace: setIn({}, true, path)});
          state = updatePROC(state, UPDATABLE, makeNUpdate([], push2array(['current'], path), defaultValues, true));
          state = setDataMapInState(state, UPDATABLE, maps2enable);
          if (getIn(branch, SymData, 'status', statusKey) == 0) {
            state = Macros.switch(state, schema, UPDATABLE, makeNUpdate(path, ['status', statusKey], 0));
            state = Macros.switch(state, schema, UPDATABLE, makeNUpdate(path, ['status', STATUS_REV[statusKey]], true));
          }
        })

      }
    }
  }

  // apply dataMap
  let dataMap = getIn(state, path, SymDataMapTree);
  for (let i = 0; i < keyPath.length; i++) {
    if (!dataMap) break;

    state = executeDataMapsPROC(state, UPDATABLE, dataMap[SymDataMap],
      makeNUpdate(path, keyPath.slice(0, i), setIn({}, value, keyPath.slice(i)), setIn({}, replace, keyPath.slice(i)))
    );
    dataMap = dataMap[keyPath[i]];
  }

  if (dataMap) state = recursivelyExecuteDataMaps(dataMap, value, replace, keyPath);

  function recursivelyExecuteDataMaps(dataMap: any[], value: any, replace: any, track: Path = []) {
    state = executeDataMapsPROC(state, UPDATABLE, dataMap[SymDataMap], makeNUpdate(path, track, value, replace));
    isMergeable(value) && objKeys(dataMap).forEach(key => value.hasOwnProperty(key) && (state = recursivelyExecuteDataMaps(dataMap[key], value[key], getIn(replace, key), track.concat(key))))
    return state;
  }

  return state;
}


function normalizeStateMaps(dataMap: FFDataMapGeneric<Function | Function[]>[], emitter: Path): normalizedDataMapType[] {
  return objKeys(dataMap).map((key: string) => {
    let item: any = dataMap[key];
    let {from, to, ...action} = item;
    if (!action.$) action = true;
    else action = normalizeFn(action);
    if (!from || !to) action = false;
    // {action = {...action, ...normalizeArgs(action.args)};
    //   if (!action.args.length) action.args = ['${value}'];}
    return {emitter, from, to, action} as normalizedDataMapType;

  })
}

function setDataMapInState(state: StateType, UPDATABLE: PROCEDURE_UPDATABLE_Type, dataMaps: normalizedDataMapType[], unset: boolean | null = false) {
  const dataMaps2execute: any = [];
  dataMaps.forEach((dataMap) => {
    const emitterPath = dataMap.emitter;
    let bindMap2emitter: boolean = false;
    normalizeUpdate({path: (dataMap.from[0] == '/' ? '' : emitterPath.join('/')) + '/' + dataMap.from, value: null}, state).forEach(fromItem => {
        let key = fromItem[SymData][0];
        if (key == 'current' || key == 'initial' || key == 'default' && fromItem.path.length)
          fromItem = {...fromItem, path: [], [SymData]: [key, ...fromItem.path, ...fromItem[SymData].slice(1)]};

        normalizeUpdate({path: emitterPath.join('/') + '/' + dataMap.to, value: null}, state).forEach(toItem => {
          let relTo = path2string(relativePath(fromItem.path, toItem.path.concat(SymData, ...toItem[SymData])));
          //console.log(relTo);
          if (getIn(state, fromItem.path)) setIn(UPDATABLE.update, unset ? undefined : dataMap.action, fromItem.path, SymDataMapTree, fromItem[SymData], SymDataMap, relTo);
          if (!unset) {
            // state = executeDataMapsPROC(state, UPDATABLE, makeSlice(relTo, dataMap.action),
            //   makeNUpdate(fromItem.path, fromItem[SymData], getIn(state, fromItem.path, SymData, fromItem[SymData])));
            dataMaps2execute.push({
              map: makeSlice(relTo, dataMap.action),
              fromPath: fromItem.path,
              keyPath: fromItem[SymData]
            });
            if (!bindMap2emitter && relativePath(emitterPath, fromItem.path)[0] != '.') bindMap2emitter = true;
          }
          //state = mergeUPD_PROC(state, UPDATABLE);
        })
      }
    );
    if (bindMap2emitter) {
      const emitterBranch = getIn(state, emitterPath);
      if (emitterBranch) {
        let bindedMaps = getIn(emitterBranch, SymDataMapTree, SymData) || [];
        let i;
        for (i = 0; i < bindedMaps.length; i++) {
          if (dataMap.from === bindedMaps[i].from && dataMap.to === bindedMaps[i].to) break;
        }
        bindedMaps = bindedMaps.slice();
        bindedMaps[i] = dataMap;
        setUPDATABLE(UPDATABLE, bindedMaps, true, emitterPath, SymDataMapTree, SymData);
      }
    }
    state = mergeUPD_PROC(state, UPDATABLE);
  });
  if (unset !== null) dataMaps2execute.forEach((v: any) => {
    state = executeDataMapsPROC(state, UPDATABLE, v.map, makeNUpdate(v.fromPath, v.keyPath, getIn(state, v.fromPath, SymData, v.keyPath)));
    state = mergeUPD_PROC(state, UPDATABLE);
  });
  return state
}


function executeDataMapsPROC(state: StateType, UPDATABLE: PROCEDURE_UPDATABLE_Type, maps: any, item: NormalizedUpdateType) {
  const {value, path, replace} = item;
  // const keyPath = item[SymData] || [];
  const from = NUpdate2string(item);
  objKeys(maps || {}).forEach((pathTo) => {
    //console.log('maps=', maps);
    if (!maps[pathTo]) return; // disabled map
    const map: dataMapActionType = maps[pathTo];
    const NpathTo = path2string(normalizePath(pathTo, path));
    let executedValue = value;
    const updates: any[] = [];
    if (isObject(map)) {
      const field = makeSynthField(UPDATABLE.api, NpathTo, from);
      //let _get = field.api._get;
      //field.api._get = getFromUPD(state, UPDATABLE);
      field.get = getFromUPD(state, UPDATABLE);
      field.updates = updates;
      executedValue = processFn.call(field, map, value);
      field.updates = null;
      field.get = null;
    }
    if (!updates.length && (!(isUndefined(executedValue) && isObject(map))))
      updates.push({path: NpathTo, value: executedValue, replace: isUndefined(map.replace) ? replace : map.replace});
    updates.forEach((update: any) => state = updatePROC(state, UPDATABLE, update));
  });
  return state;
}


/////////////////////////////////////////////
//      state utilities
/////////////////////////////////////////////

const trueIfLength = (length: number) => (path: any) => getIn(path, 'length') === length;

function isTopPath(path: Path) {
  return path.length == 0 || path.length == 1 && path[0] == '#';
}

const makeSynthField = memoize(function (stateApi: any, to: string, from?: string) {
  const path = to.split('@')[0];
  const pathData = from ? from.split('@')[0] : path;
  const updates: any[] = [];
  const field: any = {from, to, path, stateApi, updates};
  field.api = stateApi.wrapper(field);
  field.wrapOpts = (rest: any) => {
    if (field.updates && isUndefined(rest.setExecution)) rest.setExecution = (addUpdates: any) => addUpdates && push2array(field.updates, addUpdates);
    return rest
  };
  field.getData = () => field.api.get(pathData, SymData);
  return field;
});


function getFromUPD(state: StateType, UPDATABLE: PROCEDURE_UPDATABLE_Type) {
  return (...tPath: Array<string | Path>) => {
    if (hasIn(UPDATABLE.update, ...tPath.map(path => normalizePath(path as any))))
      return merge(getFromState(state, ...tPath), getFromState(UPDATABLE.update, ...tPath), {replace: getFromState(UPDATABLE.replace, ...tPath)});
    return getFromState(state, ...tPath);
  }
}

function getUpdValue(states: StateType[], ...paths: Path) {
  for (let i = 0; i < states.length; i++) {
    if (hasIn(states[i], ...paths)) return getIn(states[i], ...paths);
  }
}


function getFromState(state: any, ...paths: Array<symbol | string | Path>) {
  return getIn(state, ...paths.map(path => normalizePath(path as any)));
}

const makeNUpdate = (path: Path, keyPath: Path, value?: any, replace?: any, rest: any = {}): NormalizedUpdateType => {return {path, [SymData]: keyPath, value, replace, ...rest}};


function isNUpdate(updateItem: any): updateItem is NormalizedUpdateType {
  return !isUndefined(getIn(updateItem, SymData)) && isArray(updateItem[SymData]);
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


function NUpdate2string(item: PathItem): string {
  let path = path2string(item.path);
  return path + (item[SymData] && !~path.indexOf('@') ? '/@/' + path2string(item[SymData]) : '');
}


function normalizeUpdate(update: StateApiUpdateType, state: StateType): NormalizedUpdateType[] {
  const {path, value, replace, base, ...rest} = update;
  const result: NormalizedUpdateType[] = [];
  let pathArray: string[] = path2string(path).split(';');
  pathArray.forEach(path => {
    let paths = normalizePath(path, base);
    let keyPathes: any = [];
    let a = paths.indexOf(SymData);
    if (~a) {
      keyPathes = paths.slice(a + 1);
      paths = paths.slice(0, a);
    }
    paths = multiplePath(paths, {'*': (p: Path) => branchKeys(getIn(state, p)).join(',')});
    keyPathes = multiplePath(keyPathes);
    objKeys(paths).forEach(p => objKeys(keyPathes).forEach(k => result.push(makeNUpdate(paths[p], keyPathes[k], value, replace, rest))));
  });
  return result;
}


/////////////////////////////////////////////
//  Path functions
/////////////////////////////////////////////

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


function multiplePath(path: Path, strReplace: { [key: string]: any } = {}) {
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
        tmp = multiplePath(tmp, strReplace);
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


function setIfNotDeeper(state: any, value: any, ...paths: any[]) {
  if (state === value) return state;
  const path = flattenPath(paths);
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

function isNPath(path: any) {
  return isMergeable(path) && getIn(path, SymData) === 'nPath';
}

function normalizePath(path: string | Path, base: string | Path = []): Path {
  let result = resolvePath(flattenPath(path), base.length ? flattenPath(base) : []);
  result[SymData] = 'nPath';
  return result;
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


/////////////////////////////////////////////
//      common utils
/////////////////////////////////////////////



function object2PathValues(vals: { [key: string]: any }, options: object2PathValuesOptions = {}, track: Path = []): PathValueType[] {
  const fn = options.symbol ? objKeysNSymb : objKeys;
  const check = options.arrayAsValue ? isObject : isMergeable;
  if (!check(vals)) return [[vals]];
  let result: any[] = [];
  fn(vals).forEach((key) => {
    let path = track.concat(key);
    if (check(vals[key])) object2PathValues(vals[key], options, path).forEach(item => result.push(item)); // result = result.concat(object2PathValues(vals[key], path));
    else {
      path.push(vals[key]);
      result.push(path)
    }
  });
  if (!result.length) return [push2array(track.slice(), {})]; // empty object
  return result
}

const isMapFn = (arg: any) => isObject(arg) && arg.$ || isFunction(arg) && arg._map;

function normalizeArgs(args: any, wrapFn?: any) {
  let dataRequest = false;
  args = toArray(isUndefined(args) ? [] : args).map((arg: any) => {
    if (isString(arg)) {
      let fnReq = 0;
      if (arg[0] == '@') fnReq = 1;
      if (arg.substr(0, 2) == '!@') fnReq = 2;
      if (arg.substr(0, 3) == '!!@') fnReq = 3;
      if (fnReq) {
        dataRequest = true;
        let res = normalizePath(arg.substr(fnReq));
        if (fnReq == 2)
          res[SymDataMap] = 'not';
        if (fnReq == 3) res[SymDataMap] = 'doubleNot';
        return res
      }
    }
    if (isMapFn(arg)) {
      let res = normalizeArgs(arg.args, wrapFn);
      if (res.dataRequest) dataRequest = true;
      res = {...arg, ...res};
      return wrapFn ? wrapFn(res) : res
    } else if (wrapFn && isMergeable(arg)) return wrapFn(arg);
    return arg;
  });
  return {dataRequest, args, norm: true}
}

function normalizeFn(fn: any, opts: any = {}): { $: Function, args: any, [key: string]: any } {
  const {wrapFn, ...restOpts} = opts;
  let nFn: any = !isObject(fn) ? {$: fn, ...restOpts} : {...fn, ...restOpts};
  if (nFn.args) Object.assign(nFn, normalizeArgs(nFn.args, opts.wrapFn));
  else nFn.args = ['${...}'];
  return nFn
}

function testArray(value: any) {
  if (isUndefined(value)) return [];
  if (!isArray(value)) throw new Error('array expected');
  return value
}

function processProp(nextData: any, arg: any) {
  let res = getIn(nextData, arg);
  switch (arg[SymDataMap]) {
    case 'not':
      return !res;
    case 'doubleNot':
      return !!res;
    default:
      return res
  }
}

function processFn(map: any, ...rest: any[]) {
  const processArg = (args: any[]) => {
    const resArgs: any[] = [];
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (isNPath(arg)) resArgs.push(processProp(nextData, arg));
      else if (isMapFn(arg)) resArgs.push(!arg._map ? processFn.call(this, arg, ...rest) : arg(...rest));
      else if (arg == '${...}') resArgs.push(...rest);
      else if (isString(arg) && ~arg.search(/^\${\d+}$/)) resArgs.push(rest[arg.substring(2, arg.length - 1)]);
      else resArgs.push(arg);
    }
    return resArgs;
  };
  const nextData = map.dataRequest ? this.getData() : null;
  const prArgs = processArg(map.args);
  const res = toArray(map.$).reduce(
    (args, fn) => isFunction(fn) ? (map.noStrictArrayResult ? toArray : testArray)(fn.apply(this, args)) : args,
    prArgs
  );
  return map.noStrictArrayResult ? deArray(res) : testArray(res)[0];
}


function makeSlice(...pathValues: any[]): StateType {
  let path: any[] = [];
  for (let i = 0; i < pathValues.length - 1; i++) push2array(path, pathValues[i]);
  const value = pathValues[pathValues.length - 1];
  if (!path.length) return value;
  return setIn({}, value, path);
}

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
  object2PathValues,
  string2path,
  relativePath,
  getSchemaPart,
  oneOfFromState,
  path2string,
  normalizePath,
  branchKeys,
  getFromState,
  arrayStart,
  mergeUPD_PROC,
  isSelfManaged,
  isSchemaSelfManaged,
  normalizeUpdate,
  setIfNotDeeper,
  setUPDATABLE,
  isNPath,
  multiplePath,
  normalizeArgs,
  normalizeFn,
  processFn,
  isMapFn,
  types,
  updateState,
  initState,
  rehydrateState,
  processProp
};
export {SymData, SymReset, SymClear, SymDelete, SymDataMap}
export {makeNUpdate, updatePROC, string2NUpdate, getUniqKey, makeSlice};
