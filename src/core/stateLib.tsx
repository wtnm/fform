import {getByKey, getIn, isEqual, isMergeable, isObject, makeSlice, memoize, merge, objKeysNSymb, push2array} from "./commonLib";
import  {objKeys, isArr, isUndefined}  from "./commonLib";

const SymbolData = Symbol.for('FFormData');
const SymbolBranch = Symbol.for('FFormBranch');
const SymbolReset = Symbol.for('FFormReset');
const SymbolDelete = undefined; // Symbol.for('FFormDelete'); // 
const RawValuesKeys = ['current', 'inital', 'default'];


class UpdateItems {  // used for passing UpdateItems instead of value in dataMap hook
  items: any;
  constructor(items: any) {
    this.items = items;
  }
}


const isReplaceable = memoize(function (scheme: JsonSchema) {
  const fn = memoize(function (schemaPart: JsonSchema) {return (schemaPart.type == 'array' || schemaPart.type == 'object') && !isUndefined(getIn(schemaPart, 'x', 'values'))});
  return (path: Path) => {try {return fn(getSchemaPart(scheme, path))} catch (e) {return true}}
});

const getSchemaData = memoize(function (scheme: JsonSchema) { // schemaData is used to store and cache data for scheme without modifying schema itself  
  return {};
});

function getSchemaPart(schema: JsonSchema, path: Path): JsonSchema {

  function getArrayItemSchemaPart(index: number, schemaPart: JsonSchema): JsonSchema {
    let items: JsonSchema[] = [];
    if (schemaPart.items) {
      if (!isArr(schemaPart.items)) return schemaPart.items;
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

  function getSchemaByRef(schema: JsonSchema, $ref: string) {
    const path = string2path($ref);
    if (path[0] == '#') return getIn(schema, path); // Extract and use the referenced definition if we have it.
    throw new Error(`Can only ref to #`);// No matching definition found, that's an error (bogus schema?)
  }

  const errorText = 'Schema path not found: ';
  let schemaPart: JsonSchema = schema;

  for (let i = path[0] == '#' ? 1 : 0; i < path.length; i++) {
    if (!schemaPart) throw new Error(errorText + path.join('/'));
    if (schemaPart.$ref) {
      const $refSchema = getSchemaByRef(schema, schemaPart.$ref,);
      const {$ref, ...localSchema} = schemaPart;
      schemaPart = merge($refSchema, localSchema);
    }

    if (schemaPart.type == 'array') {
      schemaPart = getArrayItemSchemaPart(path[i], schemaPart)
    } else {
      if (schemaPart.properties && schemaPart.properties[path[i]]) schemaPart = schemaPart.properties[path[i]];
      else throw new Error(errorText + path.join('/'));
    }
  }
  if (!schemaPart.$ref) return schemaPart;
  let refMap = getByKey(getSchemaData(schema), ['refs', schemaPart.$ref], new Map());
  if (!refMap.get(schemaPart)) {
    const $refSchema = getSchemaByRef(schema, schemaPart.$ref,);
    const {$ref, ...localSchema} = schemaPart;
    refMap.set(schemaPart, merge($refSchema, localSchema));
  }
  return refMap.get(schemaPart)
}

function getParentArrayValue(schema: JsonSchema, path: Path) {
  let pathPart = path.slice();
  let keyPart: Path = [];
  let result;
  for (let i = 0; i < path.length; i++) {
    let key = pathPart.pop();
    keyPart.unshift(key);
    let schemaPart = getSchemaPart(schema, pathPart);
    if (!schemaPart) return;
    if (schemaPart.type == 'array') {
      let tmp = getIn(schemaPart.default, keyPart);
      if (tmp) result = tmp;
    }
  }
  return result;
}

function makeRelativePath(from: Path, to: Path) {
  if (from[0] === '#') from = from.slice(1);
  if (to[0] === '#') to = to.slice(1);
  let same = true;
  let res: Path = [];
  let result: Path = [];
  let i;
  for (i = 0; i < from.length; i++) {
    if (same) same = (from[i] === to[i]);
    if (!same) break;
  }
  for (let j = i; j < from.length; j++) result.push('..');
  push2array(result, to.slice(i));
  return result;
}


const arrayStart = memoize(function (schemaPart: JsonSchema) {
    if (!isArr(schemaPart.items)) return 0;
    if (schemaPart.additionalItems === false) return schemaPart.items.length;
    if (typeof schemaPart.additionalItems === 'object') return schemaPart.items.length;
    if (schemaPart.items.length == 0) return 0;
    return schemaPart.items.length - 1;
  }
);

const basicStatus = {color: '', touched: false, pending: false, valid: true, pristine: true};
const basicLengths = {current: 0, inital: 0, 'default': 0};
const basicArrayItem = {canUp: false, canDown: false, canDel: false};

const makeDataStorage = memoize(function (schemaPart: JsonSchema, required: boolean, arrayItem: boolean) {
  const x = schemaPart.x || ({} as xType);
  const {custom, preset, dataMap, fields, flatten, keyField, validators, ...rest} = x;
  const result: any = merge({controls: {}, messages: {}}, rest);
  result.status = basicStatus;
  result.schemaData = {};
  result.schemaData.title = schemaPart.title;
  result.schemaData.type = isArr(schemaPart.type) ? schemaPart.type[0] : schemaPart.type;
  if (schemaPart.type != 'object' && schemaPart.type != 'array') {
    if (isUndefined(result.values)) result.values = {current: schemaPart.default, inital: undefined, 'default': schemaPart.default};
    //if (!isArr(schemaPart.required)) result.schemaData.required = required || (schemaPart.required === true);
    result.schemaData.required = required || !!schemaPart.required;
  }
  if (schemaPart.type == 'array') {
    result.array = {
      lengths: basicLengths,
      // arrayStartIndex: arrayStart(schemaPart),
      canAdd: (schemaPart.additionalItems !== false || getIn(schemaPart, 'items', 'length')) && (schemaPart.maxItems !== 0)
    }
  }
  if (arrayItem) result.arrayItem = basicArrayItem;
  return result;
});

function makeDataMap(dataMap: DataMapType[], path: Path) {
  return merge.all({}, dataMap.map((item) => {  // item is array where item[0] - from, item[1] - to
    let from = makePathItem(item[0], path);
    let to: string;
    if (item[1][0] === '.') {
      let toFull: any = makePathItem(item[1], path);
      to = './' + makeRelativePath(from.path, toFull.path).join('/') + (toFull.keyPath ? '/@/' + path2string(toFull.keyPath) : '');
    } else to = item[1];
    return makeSlice(from.path, SymbolData, 'dataMap', from.keyPath ? path2string(from.keyPath) : SymbolBranch, to, item[2]) // SymbolBranch means to map full branch
  }))
}

function getParentSchema(schema: JsonSchema, path: Path) {
  if (!path.length || path.length == 1 && path[0] === '#') return false;
  return getSchemaPart(schema, path.slice(0, -1));
}

function isPropRequired(schema: JsonSchema, path: Path) {
  return !!(schema.type == 'object' && isArr(schema.required) && ~schema.required.indexOf(path[path.length - 1]))
}

function getUniqId() {return Date.now().toString(36) + Math.random().toString(36) }

function makeStateBranch(schema: JsonSchema, path: Path = ['#']) { //: { state: StateType, dataMap: StateType } {
  const result = {};
  const schemaPart = getSchemaPart(schema, path);
  const parentSchemaPart = getParentSchema(schema, path);
  const isArrayItem = getIn(parentSchemaPart, 'type') == 'array' && !getIn(parentSchemaPart, 'x', 'values');
  const isReqiured = parentSchemaPart ? isPropRequired(parentSchemaPart, path[path.length - 1]) : false;
  const dataMap = getIn(schemaPart, 'x', 'dataMap');
  const dataMapObjects: StateType[] = [];
  let defaultValues: any;

  if (dataMap) dataMapObjects.push(makeDataMap(dataMap, path));
  result[SymbolData] = makeDataStorage(schemaPart, isReqiured, isArrayItem);
  if (isArrayItem) result[SymbolData] = merge(result[SymbolData], {uniqId: getUniqId()});
  if (result[SymbolData].values) defaultValues = getParentArrayValue(schema, path) || schemaPart.default || result[SymbolData].values.default;
  else if (schemaPart.type == 'array') defaultValues = schemaPart.default || [];
  else if (schemaPart.type == 'object') {
    defaultValues = {};
    objKeys(schemaPart.properties || {}).forEach(field => {
      let dataObj = makeStateBranch(schema, path.concat(field));
      if (dataObj.dataMap) dataMapObjects.push(dataObj.dataMap);
      result[field] = dataObj.state;
      defaultValues[field] = dataObj.defaultValues
    });
  }
  return {state: result, defaultValues, dataMap: dataMapObjects.length ? merge.all({}, dataMapObjects) : undefined}
}

const makeStateFromSchema = memoize(function (schema: JsonSchema) {return makeStateBranch(schema)});


function getKeyMapFromSchema(schema: JsonSchema): any {
  return {
    key2path,
    path2key,
    flatten: mapObj.bind(null, path2key, key2path),
    unflatten: mapObj.bind(null, key2path, path2key),
  };

  function getKeyMap(schema: JsonSchema, track: Path = ['#']) {
    function checkIfHaveKey(key: string) {if (keyMap.key2path.hasOwnProperty(key)) throw new Error(`Duplicate flatten name for ${key}`);}

    function mapPath2key(prefix: string, obj: any) {
      let result = {};
      objKeys(obj).forEach((val: string) => {
        if (typeof obj[val] == 'string') result[val] = prefix + obj[val];
        else result[val] = mapPath2key(prefix, obj[val])
      });
      return result
    }

    let schemaPart = getSchemaPart(schema, track);
    let keyMaps = getByKey(schema, [SymbolData, 'keyMaps'], new Map());
    if (keyMaps.get(schemaPart)) return keyMaps.get(schemaPart);
    if (schemaPart.type != 'object') return;
    let result = {};
    let fields = objKeys(schemaPart.properties || {});
    let keyMap = getByKey(result, [SymbolData, 'keyMap'], {key2path: {}, path2key: {}});
    if (schemaPart.x && schemaPart.x.flatten) keyMap.prefix = schemaPart.x.flatten !== true && schemaPart.x.flatten || '';

    fields.forEach(field => {
      let keyResult = getKeyMap(schema, track.concat(field));
      let objKeyMap = getIn(keyResult, [SymbolData, 'keyMap']) || {};
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
      let path = getIn(getKeyMap(schema, result), [SymbolData, 'keyMap', 'key2path', key]);
      result = push2array(result, path ? path : key);
    });
    return result;
  }

  function path2key(path: Path): Path {
    let result: Path = [];
    let i = 0;
    while (i < path.length) {
      let key = path[i];
      let path2key = getIn(getKeyMap(schema, path.slice(0, i)), [SymbolData, 'keyMap', 'path2key']);
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

  function mapObj(fnDirect: any, fnReverse: any, object: any): any {
    if (!isMergeable(object)) return object;
    const result = isArr(object) ? [] : {};

    function recurse(value: any, track: Path = []) {
      let keys;
      if (isMergeable(value) && !getIn(getSchemaPart(schema, (fnDirect == key2path ? key2path(track) : track)), ['x', 'values'])) {
        keys = objKeys(value);
        keys.forEach(key => recurse(value[key], track.concat(key)))
      }
      if (!(keys && keys.length) && getIn(getKeyMap(schema, (fnDirect == key2path ? key2path(track) : track)), [SymbolData, 'keyMap', 'prefix']) === undefined) {
        let tmp = result;
        let path = fnDirect(track);
        for (let i = 0; i < path.length - 1; i++) {
          let field = path[i];
          if (!tmp[field]) tmp[field] = isArr(getIn(object, fnReverse(path.slice(0, i + 1)))) ? [] : {};
          tmp = tmp[field];
        }
        if (path.length) tmp[path.pop()] = value;
      }
    }

    recurse(object);
    return result;
  }
}

function getAsObject(state: StateType, keyPath: Path, fn?: (val: any) => any, keyObject?: StateType) {
  if (!fn) fn = x => x;
  let type = state[SymbolData].schemaData.type;
  if ((type == 'object' || type == 'array') && !state[SymbolData].values) {
    let result: any = type == 'array' ? [] : {};
    let keys: Array<string> = objKeys(keyObject && objKeys(keyObject).length > 0 ? keyObject : state);
    if (type == 'array') {
      let idx = 0;
      let arrKeys = [];
      if (keyPath[1] == 'values' && keyPath[2]) idx = getIn(state, [SymbolData, 'array', 'lengths', keyPath[2]]) || 0;
      else idx = getValue(getIn(state, [SymbolData, 'array', 'lengths']) || {}) || 0;
      const lengthChange = keyObject && getIn(keyObject, [SymbolData, 'array', 'lengths']);
      for (let i = 0; i < idx; i++) if (lengthChange || ~keys.indexOf(i.toString())) arrKeys.push(i.toString());
      keys = arrKeys;
      result.length = idx;
    }
    keys.forEach((key) => {
      if (state[key]) result[key] = getBindedValue(getIn(state[key], [SymbolData, 'controls']), 'omit') ? Symbol.for('FFormDelete') : getAsObject(state[key], keyPath, fn, keyObject ? keyObject[key] : undefined)
    });
    return result;
  } else return fn(getIn(state, keyPath))
}

function getBindedValue(obj: any, valueName: string) {
  return isUndefined(obj[valueName + 'Bind']) ? obj[valueName] : obj[valueName + 'Bind'];
}

function makeUpdateItem(path: Path | string, ...rest: any[]): UpdateItem {
  let value, keyPath, updateItem;
  if (rest.length == 1) value = rest[0];
  if (rest.length == 2) {
    keyPath = rest[0];
    value = rest[1];
  }
  updateItem = makePathItem(path);
  if (keyPath) updateItem.keyPath = isArr(keyPath) ? keyPath : string2path(keyPath);
  (updateItem as UpdateItem).value = value;
  return updateItem as UpdateItem;
}

function makePathItem(path: Path | string, relativePath: Path | undefined = undefined, delimiter = '@'): PathItem {
  const pathItem: any = {};
  pathItem.toString = function () {
    return path2string(this)
  };
  Object.defineProperty(pathItem, "toString", {enumerable: false});
  Object.defineProperty(pathItem, "fullPath", {
    get: function (): Path {
      return this.keyPath ? this.path.concat(SymbolData, this.keyPath) : this.path;
    },
    set: function (path: Path) {
      let a = path.indexOf(SymbolData);
      if (a == -1) {
        this.path = path.slice();
        delete this.keyPath
      } else {
        this.path = path.slice(0, a);
        this.keyPath = path.slice(a + 1);
      }
    }
  });
  path = val2path(path, relativePath, delimiter);
  pathItem.fullPath = path;
  return pathItem;
}

function val2path(path: Path | string, basePath: Path = [], delimiter = '@'): Path {
  if (typeof path == 'string') path = string2path(path, basePath, delimiter);
  return path
}

function makeArrayOfPathItem(path: Path | string, basePath: Path = [], delimiter = '@'): PathItem[] {
  path = val2path(path, basePath, delimiter);
  let result: any[] = [[]];
  path.forEach(value => {
    let res: any[] = [];
    if (typeof value == 'string' || typeof value == 'number') {
      result.forEach(pathPart => value.toString().split(',').forEach(key => res.push(pathPart.concat(key))))
    } else if (typeof value == 'symbol') {
      result.forEach(pathPart => res.push(pathPart.concat(value)))
    } else if (typeof value == 'function') {
      result.forEach(pathPart => {
        let tmp = value(pathPart);
        if (!isArr(tmp)) tmp = [tmp];
        tmp.forEach((tmpVal: string | number | false) => tmpVal === false ? false : tmpVal.toString().split(',').forEach(key => res.push(pathPart.concat(key))))
      });
    } else throw new Error('not allowed type');
    result = res;
  });
  return result.map(path => makePathItem(path));
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


/////////////////////////////////////////////
//      Utilities
/////////////////////////////////////////////
const utils: any = {};
utils.get = get;
utils.getIn = getIn;
utils.isEqual = isEqual;
utils.merge = merge;
utils.getValue = getValue;
utils.makePathItem = makePathItem;
utils.string2path = string2path;
utils.getSchemaPart = getSchemaPart;


function path2string(path: Path | PathItem, keyPath?: Path): string {
  if (!isArr(path)) {
    keyPath = (path as PathItem).keyPath;
    path = (path as PathItem).path;
  }
  return (keyPath ? path.concat('@', keyPath) : path).join('/'); // (path.length ? '' : '/') +
}

function string2path(str: string, relativePath: Path | undefined = undefined, delimiter = '@'): Path {
  str = str.replace(/\/+/g, '/');
  let res: Array<string | symbol> = str.split('/');
  if (res[0] === '.' || res[0] == '..') {if (relativePath) res = relativePath.concat(res);}
  // if (res[0] === '') res[0] = '#';
  let result: Array<string | symbol | number> = [];
  for (let i = 0; i < res.length; i++) {
    let val = res[i];
    if (val === '..') result.pop();
    else if (val !== '' && val !== '.') result.push(val === delimiter ? SymbolData : val);
  }
  return result
}

function get(state: any, ...pathes: Array<symbol | string | Path>) {
  return getIn(state, ...pathes.map(path => val2path(path as any)));
}


// function without(obj: {}, symbol = false, ...rest: any[]) {
//   //const args = arrFrom(rest); // [].slice.call(arguments);
//   const result = isArr(obj) ? [] : {};
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
//   const result = isArr(obj) ? [] : {};
//   objKeys(obj).forEach(field => result[field] = replaceDeep(obj[field], value));
//   return result;
// }


function getValue(values: ValuesType, type: 'current' | 'inital' | 'default' = 'current'): any {
  // const types = ['current', 'inital', 'default'];
  for (let i = RawValuesKeys.indexOf(type); i < RawValuesKeys.length; i++) {
    // if (values.hasOwnProperty(RawValuesKeys[i]) && values[RawValuesKeys[i]] !== SymbolDelete) return values[RawValuesKeys[i]];
    if (values[RawValuesKeys[i]] !== undefined) return values[RawValuesKeys[i]];
  }
  return undefined;
}

function getMaxValue(values: any): any {
  return Math.max(values['current'] || 0, values['inital'] || 0, values['default'] || 0);
}

export {
  UpdateItems,
  makeUpdateItem,
  getValue,
  object2PathValues,
  getKeyMapFromSchema,
  makeStateFromSchema,
  makeStateBranch,
  string2path,
  makePathItem,
  getBindedValue, 
  makeRelativePath,
  getSchemaPart,
  path2string,
  val2path,
  get,
  isReplaceable,
  basicLengths,
  arrayStart,
  getMaxValue,
  makeArrayOfPathItem,
}

export {SymbolData, SymbolBranch, SymbolReset, SymbolDelete, RawValuesKeys, utils}