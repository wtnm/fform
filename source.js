"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __rest = this && this.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var commonLib_1 = require("./commonLib");
var commonLib_2 = require("./commonLib");
var SymData = Symbol.for('FFormData');
exports.SymData = SymData;
var SymDataMapTree = Symbol.for('FFormDataMapTree');
var SymDataMap = Symbol.for('FFormDataMap');
// const SymBranch: any = Symbol.for('FFormBranch');
var SymReset = Symbol.for('FFormReset');
exports.SymReset = SymReset;
var SymClear = Symbol.for('FFormClear');
exports.SymClear = SymClear;
var SymDelete = undefined; // Symbol.for('FFormDelete'); // 
exports.SymDelete = SymDelete;
// const _rawValuesKeys = ['current', 'inital', 'default'];
var symConv = function symConv(key, anotherKey) {
    if (!commonLib_2.isUndefined(anotherKey)) {
        symConv._data[key] = anotherKey;
        symConv._data[anotherKey] = key;
    } else return symConv._data[key];
};
exports.symConv = symConv;
symConv._data = { '#': '' };
symConv.sym2str = function (sym) {
    return (typeof sym === "undefined" ? "undefined" : _typeof(sym)) == 'symbol' && !commonLib_2.isUndefined(symConv(sym)) ? symConv(sym) : sym;
};
symConv.str2sym = function (str) {
    return typeof str == 'string' && !commonLib_2.isUndefined(symConv(str)) ? symConv(str) : str;
};
symConv('@', SymData);

var stateUpdates = function stateUpdates(items) {
    _classCallCheck(this, stateUpdates);

    this[SymData] = items;
};

exports.stateUpdates = stateUpdates;
var types = ['null', 'boolean', 'integer', 'number', 'string', 'array', 'object'];
types.any = function () {
    return true;
};
types.null = function (value) {
    return value === null;
};
types.boolean = function (value) {
    return typeof value === "boolean";
};
types.number = commonLib_2.isNumber; // (value: any) => typeof value === "number";
types.integer = commonLib_2.isInteger; //(value: any) => typeof value === "number" && (Math.floor(value) === value || value > 9007199254740992 || value < -9007199254740992);
types.string = commonLib_2.isString; //(value: any) => typeof value === "string";
types.array = commonLib_2.isArray;
types.object = commonLib_2.isObject; //(value: any) => typeof value === "object" && value && !isArray(value);// isObject(value);  //
types.empty = { 'any': null, 'null': null, 'boolean': false, 'number': 0, 'integer': 0, 'string': '', array: Object.freeze([]), object: Object.freeze({}) };
/////////////////////////////////////////////
//  Macros
/////////////////////////////////////////////
function getBindedMaps2update(branch) {
    var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var maps2disable = commonLib_1.getIn(branch, SymDataMapTree, SymData) || [];
    var maps2enable = maps2disable.map(function (map) {
        return commonLib_1.merge(map, { emitter: path });
    });
    commonLib_1.objKeys(branch).forEach(function (key) {
        var result = void 0;
        if (branch[key]) {
            result = getBindedMaps2update(branch[key], path.concat(key));
            commonLib_1.push2array(maps2disable, result.maps2disable);
            commonLib_1.push2array(maps2enable, result.maps2enable);
        }
    });
    return { maps2disable: maps2disable, maps2enable: maps2enable };
}
var Macros = {};
Macros.array = function (state, schema, UPDATABLE_object, item) {
    var _a = item,
        path = _a.path,
        macros = _a.macros,
        value = _a.value,
        _b = SymData,
        sym = _a[_b],
        rest = __rest(_a, ["path", "macros", "value", (typeof _b === "undefined" ? "undefined" : _typeof(_b)) === "symbol" ? _b : _b + ""]);
    var length = getUpdValue([UPDATABLE_object.update, state], path, SymData, 'length');
    if (commonLib_2.isArray(item.value)) {
        var mergeArrayObj = [];
        var replaceArrayObj = {};
        for (var i = 0; i < item.value.length; i++) {
            mergeArrayObj[length + i] = item.value[i];
            replaceArrayObj[length + i] = commonLib_1.getIn(item.replace, i);
        }
        mergeArrayObj.length = length + item.value.length;
        return updateCurrentPROCEDURE(state, schema, UPDATABLE_object, mergeArrayObj, replaceArrayObj, path, item.setOneOf);
    } else {
        length += item.value || 1;
        if (length < 0) length = 0;
        return updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(path, ['length'], length, false, rest));
    }
};
Macros.arrayItem = function (state, schema, UPDATABLE_object, item) {
    var path = item.path;
    var op = item.op;
    var opVal = item.value || 0;
    var from = parseInt(path.pop());
    var to = from;
    var min = arrayStart(getSchemaPart(schema, path, oneOfFromState(state))); // api.get(path.concat(SymData, 'array', 'arrayStartIndex'));
    var length = getUpdValue([UPDATABLE_object.update, state], path, SymData, 'length');
    var max = length - 1;
    if (op == 'up') to--;
    if (op == 'down') to++;
    if (op == 'first') to = min;
    if (op == 'last' || op == 'del') to = max;
    if (op == 'move') to = opVal;
    if (op == 'shift') to += opVal;
    if (to < min) to = min;
    if (to > max) to = max;
    var stateObject = {};
    var arrayItems = {};
    var dataMaps = {};
    var currentObject = {};
    var updObj = [];
    updObj[0] = commonLib_1.getIn(UPDATABLE_object.update, path);
    updObj[1] = commonLib_1.getIn(UPDATABLE_object.update, SymData, 'current', path);
    updObj[2] = commonLib_1.getIn(UPDATABLE_object.replace, path);
    updObj[3] = commonLib_1.getIn(UPDATABLE_object.replace, SymData, 'current', path);

    var _loop = function _loop(i) {
        stateObject[i] = commonLib_1.getIn(state, path, i);
        arrayItems[i] = stateObject[i][SymData].arrayItem; //delIn(stateObject[i][SymData].arrayItem, ['uniqId']); // save arrayItem values, except "uniqId"
        //dataMaps[i] = stateObject[i][SymDataMapTree];
        currentObject[i] = commonLib_1.getIn(state, SymData, 'current', path, i);
        updObj.forEach(function (obj) {
            return commonLib_2.isMergeable(obj) && !obj.hasOwnProperty(i) && (obj[i] = SymClear);
        });
    };

    for (var i = Math.min(from, to); i <= Math.max(from, to); i++) {
        _loop(i);
    }
    stateObject = commonLib_1.moveArrayElems(stateObject, from, to);
    currentObject = commonLib_1.moveArrayElems(currentObject, from, to);

    var _getBindedMaps2update = getBindedMaps2update(stateObject, path),
        maps2disable = _getBindedMaps2update.maps2disable,
        maps2enable = _getBindedMaps2update.maps2enable;

    updObj.forEach(function (obj) {
        if (!commonLib_2.isMergeable(obj)) return;
        commonLib_1.moveArrayElems(obj, from, to);
        for (var i = Math.min(from, to); i <= Math.max(from, to); i++) {
            if (obj[i] === SymClear) delete obj[i];
        }
    });
    commonLib_1.objKeys(stateObject).forEach(function (i) {
        stateObject[i] = commonLib_1.merge(stateObject[i], commonLib_1.makeSlice(SymData, 'arrayItem', arrayItems[i]), { replace: commonLib_1.makeSlice(SymData, 'arrayItem', true) });
        //stateObject[i] = merge(stateObject[i], makeSlice(SymDataMapTree, dataMaps[i]), {replace: makeSlice(SymDataMapTree, true)});
    }); // restore arrayItem values and dataMap
    // const length2test = 1 + item.path.length - (item.path[0] == '#' ? 1 : 0);  // length2test can be smaller because of leading '#' in item.path (replace function receives path without leading '#')
    state = commonLib_1.merge(state, commonLib_1.makeSlice(path, stateObject), { replace: trueIfLength(item.path.length + 1) }); //(path: Path) => path.length === length2test});
    state = commonLib_1.merge(state, commonLib_1.makeSlice(SymData, 'current', path, currentObject), { replace: trueIfLength(item.path.length + 3) }); //(path: Path) => path.length === length2test + 2});
    if (op == 'del') state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(path, ['length'], max));
    state = mergeStatePROCEDURE(state, UPDATABLE_object);
    state = setDataMapInState(state, schema, maps2disable, true);
    state = setDataMapInState(state, schema, maps2enable);
    return state;
};
Macros.switch = function (state, schema, UPDATABLE_object, item) {
    var keyPath = item[SymData] || [];
    var switches = commonLib_1.makeSlice(keyPath, item.value);
    object2PathValues(switches).forEach(function (pathValue) {
        return state = recursivelyUpdate(state, schema, UPDATABLE_object, makeNUpdate(item.path, pathValue, pathValue.pop()));
    });
    return state;
};
Macros.setExtraStatus = function (state, schema, UPDATABLE_object, item) {
    var keyPath = item[SymData] || [];
    var prevVal = getUpdValue([UPDATABLE_object.update, state], item.path, SymData, keyPath);
    var value = item.value > 0;
    if (!prevVal == value) {
        state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(item.path, keyPath, value));
        state = Macros.setStatus(state, schema, UPDATABLE_object, makeNUpdate(item.path, ['status', keyPath[keyPath.length - 1]], value ? 1 : -1));
    }
    return state;
};
Macros.setStatus = function (state, schema, UPDATABLE_object, item) {
    var keyPath = item[SymData] || [];
    if (keyPath.length > 2) return Macros.setExtraStatus(state, schema, UPDATABLE_object, item);
    var op = keyPath[1];
    if (!op) return state;
    if (op == 'valid' || op == 'pristine' || op == 'touched') throw new Error('Setting "' + op + '" directly is not allowed');
    var prevVal = getUpdValue([UPDATABLE_object.update, state], item.path, SymData, keyPath);
    var selfManaged = isSelfManaged(state, item.path);
    if (op == 'untouched' && prevVal == 0 && !selfManaged) return state; // stick "untouched" to zero for objects and arrays
    var value = prevVal + item.value;
    if (selfManaged && value > 1) value = 1;
    if (value < 0) value = 0;
    state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(item.path, ['status', op], value));
    if (!isTopPath(item.path) && !prevVal != !value) //(prevVal && !value || !prevVal && value)) 
        state = Macros.setStatus(state, schema, UPDATABLE_object, makeNUpdate(item.path.slice(0, -1), keyPath, value > 0 ? 1 : -1));
    return state;
};
Macros.setCurrent = function (state, schema, UPDATABLE_object, item) {
    return updateCurrentPROCEDURE(state, schema, UPDATABLE_object, item.value, item.replace, item.path, item.setOneOf);
};
Macros.setOneOf = function (state, schema, UPDATABLE_object, item) {
    var oldOneOf = commonLib_1.getIn(state, item.path, SymData, 'oneOf');
    if (oldOneOf == item.value) {
        if (!commonLib_2.isUndefined(item.setValue)) state = updateCurrentPROCEDURE(state, schema, UPDATABLE_object, item.setValue, false, item.path);
        return state;
    }
    var macros = item.macros,
        newItem = __rest(item, ["macros"]);
    newItem[SymData] = ['oneOf'];
    if (commonLib_2.isUndefined(newItem.setValue)) {
        state = mergeStatePROCEDURE(state, UPDATABLE_object);
        newItem.setValue = commonLib_1.getIn(state, SymData, 'current', item.path);
    }
    return updateStatePROCEDURE(state, schema, UPDATABLE_object, newItem);
};
/////////////////////////////////////////////
//  End Macros
/////////////////////////////////////////////
var schemaStorage = commonLib_1.memoize(function (schema) {
    return {};
});
var trueIfLength = function trueIfLength(length) {
    return function (path) {
        return commonLib_1.getIn(path, 'length') === length;
    };
};
function isTopPath(path) {
    return path.length == 0 || path.length == 1 && path[0] == '#';
}
exports.isTopPath = isTopPath;
function recursivelyUpdate(state, schema, UPDATABLE_object, item) {
    var keys = branchKeys(commonLib_1.getIn(state, item.path));
    if (item.value == SymReset && item[SymData][0] == 'status') {
        var i = Object.assign({}, item);
        i.value = item[SymData][1] == 'untouched' ? keys.length : 0;
        state = updateStatePROCEDURE(state, schema, UPDATABLE_object, i);
    } else state = updateStatePROCEDURE(state, schema, UPDATABLE_object, item);
    keys.forEach(function (key) {
        return state = recursivelyUpdate(state, schema, UPDATABLE_object, commonLib_1.merge(item, { path: item.path.concat(key) }));
    });
    return state;
}
;
function oneOfFromState(state) {
    return function (path) {
        var s = commonLib_1.getIn(commonLib_2.isFunction(state) ? state() : state, path, SymData);
        return { oneOf: commonLib_1.getIn(s, 'oneOf'), type: commonLib_1.getIn(s, 'fData', 'type') };
    };
}
exports.oneOfFromState = oneOfFromState;
function oneOfStructure(state, path) {
    if (typeof state == 'function') state = state();
    var result = {};
    var tmp = result;
    commonLib_1.setIn(tmp, commonLib_1.getIn(state, SymData, 'oneOf'), SymData, 'oneOf');
    commonLib_1.setIn(tmp, commonLib_1.getIn(state, SymData, 'fData', 'type'), SymData, 'type');
    for (var i = 0; i < path.length; i++) {
        if (commonLib_2.isUndefined(path[i]) || path[i] === '') continue;
        tmp[path[i]] = {};
        tmp = tmp[path[i]];
        state = commonLib_1.getIn(state, path[i]);
        commonLib_1.setIn(tmp, commonLib_1.getIn(state, SymData, 'oneOf'), SymData, 'oneOf');
        commonLib_1.setIn(tmp, commonLib_1.getIn(state, SymData, 'fData', 'type'), SymData, 'type');
    }
    //return result
    var fn = function fn(path, oneOf) {
        return commonLib_2.isUndefined(oneOf) ? commonLib_1.getIn(result, path, SymData) : commonLib_1.setIn(result, oneOf, path, SymData);
    };
    fn._canSet = true;
    return fn;
}
exports.oneOfStructure = oneOfStructure;
function branchKeys(branch) {
    var keys = [];
    if (isSelfManaged(branch)) return keys;
    if (branch[SymData].fData.type == 'array') for (var j = 0; j < commonLib_1.getIn(branch, SymData, 'length'); j++) {
        keys.push(j.toString());
    } else keys = commonLib_1.objKeys(branch).filter(function (v) {
        return v;
    });
    return keys;
}
exports.branchKeys = branchKeys;
function getSchemaPart(schema, path, getOneOf, fullOneOf) {
    function getArrayItemSchemaPart(index, schemaPart) {
        var items = [];
        if (schemaPart.items) {
            if (!commonLib_2.isArray(schemaPart.items)) return schemaPart.items;else items = schemaPart.items;
        }
        if (index < items.length) return items[index];else {
            if (schemaPart.additionalItems !== false) {
                if (schemaPart.additionalItems && schemaPart.additionalItems !== true) return schemaPart.additionalItems;
                return items[items.length - 1];
            }
        }
        throw new Error(errorText + path.join('/'));
    }
    function getSchemaByRef(schema, $ref) {
        var path = string2path($ref);
        if ($ref[0] == '#') return commonLib_1.getIn(schema, path); // Extract and use the referenced definition if we have it.
        throw new Error("Can only ref to #"); // No matching definition found, that's an error (bogus schema?)
    }
    function deref(schema, schemaPart) {
        while (schemaPart.$ref) {
            schemaPart = getSchemaByRef(schema, schemaPart.$ref);
        }return schemaPart;
    }
    function combineSchemasINNER_PROCEDURE(schemaPart) {
        if (schemaPart.$ref || schemaPart.allOf || schemaPart.oneOf) {
            if (combinedSchemas.get(schemaPart)) schemaPart = combinedSchemas.get(schemaPart);else {
                var schemaPartAsKey = schemaPart;
                schemaPart = derefAndMergeAllOf(schema, schemaPart); // merge allOf, with derefing it and merge with schemaPart
                if (schemaPart.oneOf) {
                    var _schemaPart = schemaPart,
                        oneOf = _schemaPart.oneOf,
                        restSchemaPart = __rest(schemaPart, ["oneOf"]);

                    schemaPart = oneOf.map(function (oneOfPart) {
                        return commonLib_1.merge(derefAndMergeAllOf(schema, oneOfPart), restSchemaPart, { array: 'replace' });
                    }); // deref every oneOf, merge allOf in there, and merge with schemaPart
                }
                combinedSchemas.set(schemaPartAsKey, schemaPart);
            }
        }
        return schemaPart;
    }
    function derefAndMergeAllOf(schema, schemaPart) {
        schemaPart = deref(schema, schemaPart);
        if (schemaPart.allOf) {
            var _schemaPart2 = schemaPart,
                allOf = _schemaPart2.allOf,
                restSchemaPart = __rest(schemaPart, ["allOf"]);

            var result = void 0;
            for (var i = 0; i < allOf.length; i++) {
                result = commonLib_1.merge(result, derefAndMergeAllOf(schema, allOf[i]), { array: 'replace' });
            }
            schemaPart = commonLib_1.merge(result, restSchemaPart);
        }
        return schemaPart;
    }
    var errorText = 'Schema path not found: ';
    var schemaPart = schema;
    var combinedSchemas = commonLib_1.getCreateIn(schemaStorage(schema), new Map(), 'combinedSchemas');
    var type = void 0;
    for (var i = path[0] == '#' ? 1 : 0; i < path.length; i++) {
        if (!schemaPart) throw new Error(errorText + path.join('/'));
        schemaPart = combineSchemasINNER_PROCEDURE(schemaPart);

        var _getOneOf = getOneOf(path.slice(0, i)),
            oneOf = _getOneOf.oneOf,
            _type = _getOneOf.type;

        if (commonLib_2.isArray(schemaPart)) schemaPart = schemaPart[oneOf || 0];
        if (_type == 'array') {
            if (isNaN(parseInt(path[i]))) throw new Error(errorText + path.join('/'));
            schemaPart = getArrayItemSchemaPart(path[i], schemaPart);
        } else {
            if (schemaPart.properties && schemaPart.properties[path[i]]) schemaPart = schemaPart.properties[path[i]];else throw new Error(errorText + path.join('/'));
        }
    }
    schemaPart = combineSchemasINNER_PROCEDURE(schemaPart);
    if (fullOneOf) return schemaPart;
    if (commonLib_2.isArray(schemaPart)) schemaPart = schemaPart[getOneOf(path).oneOf || 0];
    return schemaPart;
}
exports.getSchemaPart = getSchemaPart;
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
var arrayStart = commonLib_1.memoize(function (schemaPart) {
    if (!commonLib_2.isArray(schemaPart.items)) return 0;
    if (schemaPart.additionalItems === false) return schemaPart.items.length;
    if (_typeof(schemaPart.additionalItems) === 'object') return schemaPart.items.length;
    if (schemaPart.items.length == 0) return 0;
    return schemaPart.items.length - 1;
});
exports.arrayStart = arrayStart;
// const getEnumOptions = (schemaPart: jsJsonSchema) => {
//   if (!schemaPart.enum) return undefined;
//   let exten: any[] = schemaPart.ff_enumExten || [];
//   return schemaPart.enum.map((value, i) => isObject(exten[i]) ? merge(exten[i], {value}) : {value, label: exten[i] || value});
// };
var basicStatus = { invalid: 0, dirty: 0, untouched: 1, pending: 0, valid: true, touched: false, pristine: true };
var makeDataStorage = commonLib_1.memoize(function (schemaPart, oneOf, type) {
    var value = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : schemaPart.default;

    // const x = schemaPart.x || ({} as FFSchemaExtensionType);
    var _schemaPart$ff_params = schemaPart.ff_params,
        ff_params = _schemaPart$ff_params === undefined ? {} : _schemaPart$ff_params,
        _schemaPart$ff_data = schemaPart.ff_data,
        ff_data = _schemaPart$ff_data === undefined ? {} : _schemaPart$ff_data;

    var result = Object.assign({ params: ff_params }, ff_data);
    if (!commonLib_2.isObject(result.messages)) result.messages = {};
    if (commonLib_2.isUndefined(value)) value = types.empty[type || 'any'];
    result.oneOf = oneOf;
    result.status = basicStatus;
    if (!commonLib_2.isObject(result.fData)) result.fData = {};
    result.fData.type = type;
    result.fData.required = schemaPart.required;
    if (schemaPart.title) result.fData.title = schemaPart.title;
    if (schemaPart.ff_placeholder) result.fData.placeholder = schemaPart.ff_placeholder;
    if (schemaPart.enum) result.fData.enum = schemaPart.enum;
    if (schemaPart.ff_enumExten) result.fData.enumExten = schemaPart.ff_enumExten;
    if (isSchemaSelfManaged(schemaPart, type)) result.value = value;else delete result.value;
    var untouched = 1;
    if (type == 'array') {
        result.length = commonLib_1.getIn(value, 'length') || 0;
        if (!commonLib_2.isUndefined(schemaPart.minItems) && result.length < schemaPart.minItems) result.length = schemaPart.minItems;
        result.fData.canAdd = isArrayCanAdd(schemaPart, result.length);
        untouched = result.length;
    } else if (type == 'object') untouched = commonLib_1.objKeys(schemaPart.properties || {}).length;
    if (untouched != 1) result.status = Object.assign({}, result.status, { untouched: untouched });
    return result;
});
function normalizeDataMap(dataMap, path) {
    return dataMap.map(function (item) {
        return { emitter: path, from: item[0], to: item[1], action: (commonLib_2.isFunction(item[2]) ? { $: item[2] } : item[2]) || true };
    });
}
function getUniqKey() {
    return Date.now().toString(36) + Math.random().toString(36);
}
function makeStateBranch(schema, getNSetOneOf) {
    var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var value = arguments[3];

    var result = {};
    var dataMapObjects = [];
    var defaultValues = void 0;
    var currentOneOf = (getNSetOneOf(path) || {}).oneOf;
    var schemaPartsOneOf = getSchemaPart(schema, path, getNSetOneOf, true);

    var _findOneOf = findOneOf(schemaPartsOneOf, value, currentOneOf),
        schemaPart = _findOneOf.schemaPart,
        oneOf = _findOneOf.oneOf,
        type = _findOneOf.type;

    if (!commonLib_2.isUndefined(currentOneOf) && currentOneOf != oneOf) {
        // value type is not that currentOneOf supports 
        console.info('Passed value is not supported by schema.type in path "' + path.join('/') + '" and oneOfIndex "' + currentOneOf + '". Reset value to default.\n');
        value = schemaPartsOneOf[currentOneOf].default; // so, reset value to default, cause keeping oneOf is in prior (if currentOneOf exists, otherwise oneOf is changed)
        var tmp = findOneOf(schemaPartsOneOf, value, currentOneOf);
        schemaPart = tmp.schemaPart;
        oneOf = tmp.oneOf;
        type = tmp.type;
    }
    commonLib_1.push2array(dataMapObjects, normalizeDataMap(schemaPart.ff_dataMap || [], path));
    result[SymData] = makeDataStorage(schemaPart, oneOf, type, value);
    getNSetOneOf(path, { oneOf: oneOf, type: type });
    if (result[SymData].hasOwnProperty('value')) defaultValues = result[SymData].value;else {
        if (type == 'array') {
            defaultValues = [];
            defaultValues.length = result[SymData].length;
            for (var i = 0; i < defaultValues.length; i++) {
                var _makeStateBranch = makeStateBranch(schema, getNSetOneOf, path.concat(i), commonLib_1.getIn(commonLib_2.isUndefined(value) ? schemaPart.default : value, i)),
                    branch = _makeStateBranch.state,
                    dataMap = _makeStateBranch.dataMap,
                    dValue = _makeStateBranch.defaultValues;

                defaultValues[i] = dValue;
                commonLib_1.push2array(dataMapObjects, dataMap);
                branch = commonLib_1.merge(branch, _defineProperty({}, SymData, { arrayItem: getArrayItemData(schemaPart, i, defaultValues.length) }), { replace: _defineProperty({}, SymData, { ArrayItem: true }) });
                branch = commonLib_1.merge(branch, _defineProperty({}, SymData, { params: { uniqKey: getUniqKey() } }));
                result[i] = branch;
            }
        } else if (type == 'object') {
            defaultValues = {};
            var arrayOfRequired = result[SymData].fData.required;
            arrayOfRequired = commonLib_2.isArray(arrayOfRequired) && arrayOfRequired.length && arrayOfRequired;
            commonLib_1.objKeys(schemaPart.properties || {}).forEach(function (field) {
                var _makeStateBranch2 = makeStateBranch(schema, getNSetOneOf, path.concat(field), value && value[field]),
                    branch = _makeStateBranch2.state,
                    dataMap = _makeStateBranch2.dataMap,
                    dValue = _makeStateBranch2.defaultValues;

                defaultValues[field] = dValue;
                commonLib_1.push2array(dataMapObjects, dataMap);
                if (arrayOfRequired && ~arrayOfRequired.indexOf(field)) branch = commonLib_1.merge(branch, _defineProperty({}, SymData, { fData: { required: true } }));
                result[field] = branch;
            });
        }
        if (value) defaultValues = commonLib_1.merge(value, defaultValues, { replace: trueIfLength(1) });
    }
    return { state: result, defaultValues: defaultValues, dataMap: dataMapObjects };
}
exports.makeStateBranch = makeStateBranch;
var makeStateFromSchema = commonLib_1.memoize(function (schema) {
    var _makeStateBranch3 = makeStateBranch(schema, oneOfStructure({}, [])),
        state = _makeStateBranch3.state,
        _makeStateBranch3$dat = _makeStateBranch3.dataMap,
        dataMap = _makeStateBranch3$dat === undefined ? [] : _makeStateBranch3$dat,
        defaultValues = _makeStateBranch3.defaultValues;

    state = commonLib_1.merge(state, commonLib_1.setIn({}, defaultValues, [SymData, 'current']));
    state = setDataMapInState(state, schema, dataMap);
    var UPDATABLE_object = { update: {}, replace: {} };
    state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate([], ['inital'], commonLib_1.getIn(state, SymData, 'current')));
    state = mergeStatePROCEDURE(state, UPDATABLE_object);
    return state;
});
exports.makeStateFromSchema = makeStateFromSchema;
function setDataMapInState(state, schema, dataMaps) {
    var unset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    //let update: StateType = {};
    var UPDATABLE_object = { update: {}, replace: {} };
    dataMaps.forEach(function (dataMap) {
        var emitterPath = dataMap.emitter;
        var bindMap2emitter = false;
        normalizeUpdate({ path: emitterPath.join('/') + '/' + dataMap.from, to: normalizePath(dataMap.to, emitterPath), value: dataMap.action }, state).forEach(function (NdataMap) {
            var relTo = path2string(relativePath(NdataMap.path, NdataMap.to));
            if (commonLib_1.getIn(state, NdataMap.path)) commonLib_1.setIn(UPDATABLE_object.update, unset ? undefined : NdataMap.value, NdataMap.path, SymDataMapTree, NdataMap[SymData], SymDataMap, relTo);
            if (!unset) {
                executeDataMapsPROCEDURE(state, schema, UPDATABLE_object, commonLib_1.makeSlice(relTo, NdataMap.value), makeNUpdate(NdataMap.path, NdataMap[SymData], commonLib_1.getIn(state, NdataMap.path, SymData, NdataMap[SymData])));
                if (!bindMap2emitter && relativePath(emitterPath, NdataMap.path)[0] != '.') bindMap2emitter = true;
            }
            state = mergeStatePROCEDURE(state, UPDATABLE_object);
        });
        if (bindMap2emitter) {
            var emitterBranch = commonLib_1.getIn(state, emitterPath);
            if (emitterBranch) {
                var bindedMaps = commonLib_1.getIn(emitterBranch, SymDataMapTree, SymData) || [];
                setUPDATABLE(UPDATABLE_object, bindedMaps.concat(dataMap), true, emitterPath, SymDataMapTree, SymData);
                // setIn(UPDATABLE_object.replace, true, emitterPath, SymDataMapTree, SymData);
            }
            state = mergeStatePROCEDURE(state, UPDATABLE_object);
        }
    });
    return state;
}
// function updDataMap2state(state: StateType, dataMap: normalizedDataMapType[], schema: jsJsonSchema) {
//   const UPDATABLE_object = {update: {}, replace: {}};
//   dataMap.forEach((dataMap) => {
//     if (dataMap.fn === false) return; // disabled map
//     const branch = getIn(state, dataMap.path);
//     executeDataMapsPROCEDURE(state, schema, UPDATABLE_object, [getIn(branch, SymDataMapTree, dataMap[SymData], SymDataMap, dataMap.to)], makeNUpdate(dataMap.path, dataMap[SymData], getIn(branch, SymData, dataMap[SymData])));
//     state = mergeUPD_PROC(state, UPDATABLE_object);
//   });
//   return state
// }
function isArrayCanAdd(schemaPart, length) {
    var arrayStartIndex = arrayStart(schemaPart); //; dataItem.array.arrayStartIndex;
    var minItems = schemaPart.minItems || 0;
    return (schemaPart.additionalItems !== false || length < arrayStartIndex) && length < (schemaPart.maxItems || Infinity);
}
function getArrayItemData(schemaPart, index, length) {
    var result = {};
    var arrayStartIndex = arrayStart(schemaPart); //; dataItem.array.arrayStartIndex;
    var minItems = schemaPart.minItems || 0;
    // if (index >= arrayStartIndex) {
    result.canUp = arrayStartIndex < index;
    result.canDown = arrayStartIndex <= index && index < length - 1;
    // } 
    // if (index >= minItems) 
    result.canDel = index >= Math.min(arrayStartIndex, length - 1);
    return result;
}
function isSelfManaged(state) {
    for (var _len = arguments.length, pathes = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        pathes[_key - 1] = arguments[_key];
    }

    return commonLib_1.hasIn.apply(commonLib_1, [state].concat(pathes, [SymData, 'value']));
}
exports.isSelfManaged = isSelfManaged;
function isSchemaSelfManaged(schemaPart, type) {
    return type !== 'array' && type !== 'object' || commonLib_1.getIn(schemaPart, 'ff_managed');
}
exports.isSchemaSelfManaged = isSchemaSelfManaged;
function findOneOf(oneOfShemas, value, currentOneOf) {
    if (!commonLib_2.isArray(oneOfShemas)) oneOfShemas = [oneOfShemas];
    var oneOfKeys = oneOfShemas.map(function (v, i) {
        return i;
    });
    //for (let i = 0; i < oneOfShemas.length; i++) oneOfKeys.push(i);
    if (currentOneOf) commonLib_1.moveArrayElems(oneOfKeys, currentOneOf, 0); // currentOneOf should be checked first to match type
    for (var k = 0; k < oneOfKeys.length; k++) {
        var oneOf = oneOfKeys[k];
        var schemaTypes = oneOfShemas[oneOf].type || types;
        if (!commonLib_2.isArray(schemaTypes)) schemaTypes = [schemaTypes];
        var defaultUsed = void 0;
        var checkValue = commonLib_2.isUndefined(value) ? (defaultUsed = true) && oneOfShemas[oneOf].default : value;
        for (var j = 0; j < schemaTypes.length; j++) {
            if (types[schemaTypes[j]](checkValue) || commonLib_2.isUndefined(checkValue)) return { schemaPart: oneOfShemas[oneOf], oneOf: oneOf, type: schemaTypes[j] };
        }if (defaultUsed && !commonLib_2.isUndefined(oneOfShemas[oneOf].default)) throw new Error('Type of schema.default is not supported by schema.type');
    }
    return {};
}
function updateCurrentPROCEDURE(state, schema, UPDATABLE_object, value, replace) {
    var track = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];
    var setOneOf = arguments[6];

    if (value === SymReset) value = commonLib_1.getIn(state, SymData, 'inital', track);
    if (value === SymClear) value = commonLib_1.getIn(getDefaultFromSchema(schema), track);
    if (commonLib_1.getIn(state, SymData, 'current', track) === value && !commonLib_1.hasIn(UPDATABLE_object.update, SymData, 'current', track)) return state;
    var branch = commonLib_1.getIn(state, track);
    // if no branch then no need to modify state for this value, just update current
    if (!branch) {
        if (track[track.length - 1] == 'length') {
            // hook if someone decides to edit array's length directly
            var topPath = track.slice(0, -1);
            var topBranch = commonLib_1.getIn(state, topPath);
            if (topBranch[SymData].fData.type == 'array') return updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(topPath, ['length'], value));
        }
        return updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate([], ['current'].concat(track), value, replace));
    }
    var type = branch[SymData].fData.type;
    if (commonLib_2.isUndefined(value)) value = types.empty[type || 'any'];
    if (!types[type || 'any'](value)) {
        // if wrong type for current oneOf index search for proper type in oneOf
        var _findOneOf2 = findOneOf(getSchemaPart(schema, track, oneOfFromState(state), true), value, commonLib_2.isUndefined(setOneOf) ? branch[SymData].oneOf : setOneOf),
            schemaPart = _findOneOf2.schemaPart,
            oneOf = _findOneOf2.oneOf,
            _type2 = _findOneOf2.type;

        if (schemaPart) {
            return updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(track, ['oneOf'], oneOf, false, { type: _type2, setValue: value }));
        } else console.warn('Type not found in path [' + track.join('/') + ']');
    }
    if (isSelfManaged(branch)) {
        // if object has own value then replace it directly
        state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(track, ['value'], value, replace));
    } else {
        if (commonLib_2.isMergeable(value)) {
            // if we receive object or array then apply their values to state
            if (type == 'array' && !commonLib_2.isUndefined(value.length)) state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(track, ['length'], value.length));
            commonLib_1.objKeys(value).forEach(function (key) {
                return state = updateCurrentPROCEDURE(state, schema, UPDATABLE_object, value[key], commonLib_1.getIn(replace, key), track.concat(key));
            });
        }
    }
    return state;
}
function getUpdValue(states) {
    for (var _len2 = arguments.length, pathes = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        pathes[_key2 - 1] = arguments[_key2];
    }

    for (var i = 0; i < states.length; i++) {
        if (commonLib_1.hasIn.apply(commonLib_1, [states[i]].concat(pathes))) return commonLib_1.getIn.apply(commonLib_1, [states[i]].concat(pathes));
    }
}
exports.getUpdValue = getUpdValue;
function splitValuePROCEDURE(state, schema, UPDATABLE_object, item) {
    var itemValue = item.value,
        path = item.path,
        replace = item.replace;

    var keyPath = item[SymData] || [];
    if (keyPath.length == 0) {
        var value = itemValue.value,
            status = itemValue.status,
            length = itemValue.length,
            oneOf = itemValue.oneOf,
            rest = __rest(itemValue, ["value", "status", "length", "oneOf"]);

        ['value', 'status', 'length', 'oneOf'].forEach(function (key) {
            if (commonLib_1.hasIn(itemValue, key)) state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(path, [key], itemValue[key], commonLib_1.getIn(replace, key)));
        });
        if (commonLib_1.objKeys(rest).length) state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(path, keyPath, rest, replace));
    } else {
        commonLib_1.objKeys(itemValue).forEach(function (key) {
            state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(path, keyPath.concat(key), itemValue[key], commonLib_1.getIn(replace, key)));
        });
    }
    return state;
}
function updateNormalizationPROCEDURE(state, schema, UPDATABLE_object, item) {
    var items = normalizeUpdate(item, state);
    items.forEach(function (i) {
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
function setUPDATABLE(UPDATABLE_object, update, replace) {
    for (var _len3 = arguments.length, pathes = Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) {
        pathes[_key3 - 3] = arguments[_key3];
    }

    commonLib_1.setIn.apply(commonLib_1, [UPDATABLE_object, update, 'update'].concat(pathes));
    if (replace) commonLib_1.setIn.apply(commonLib_1, [UPDATABLE_object, replace, 'replace'].concat(pathes));
}
exports.setUPDATABLE = setUPDATABLE;
function mergeStatePROCEDURE(state, UPDATABLE_object) {
    state = commonLib_1.merge(state, UPDATABLE_object.update, { replace: UPDATABLE_object.replace });
    UPDATABLE_object.update = {};
    UPDATABLE_object.replace = {};
    return state;
}
exports.mergeStatePROCEDURE = mergeStatePROCEDURE;
function updateStatePROCEDURE(state, schema, UPDATABLE_object, item) {
    var update = UPDATABLE_object.update,
        replace_UPDATABLE = UPDATABLE_object.replace;
    // normalize updates

    if (!isNUpdate(item)) return updateNormalizationPROCEDURE(state, schema, UPDATABLE_object, item);
    // execute macros
    if (item.macros) {
        var macro = Macros[item.macros];
        if (!macro) throw new Error('"' + macro + '" not found in macros');
        return macro(state, schema, UPDATABLE_object, item);
    }
    var value = item.value,
        path = item.path,
        replace = item.replace;

    var keyPath = item[SymData];
    value = commonLib_2.isFunction(value) ? value(getUpdValue([UPDATABLE_object.update, state], path, SymData, keyPath)) : value;
    if (path.length == 0 && keyPath[0] == 'inital') {
        state = commonLib_1.merge(state, commonLib_1.makeSlice(SymData, keyPath, value), { replace: commonLib_1.makeSlice(SymData, keyPath, replace) });
    } else {
        // split object for proper state update (for dataMap correct execution)
        if (commonLib_2.isObject(value) && (keyPath.length == 0 && (commonLib_1.hasIn(value, 'value') || commonLib_1.hasIn(value, 'status') || commonLib_1.hasIn(value, 'length') || commonLib_1.hasIn(value, 'oneOf')) || keyPath.length == 1 && keyPath[0] == 'status')) return splitValuePROCEDURE(state, schema, UPDATABLE_object, item);
        var branch = commonLib_1.getIn(state, path);
        if (!commonLib_2.isObject(branch)) return state; // check if there is branch in state
        if (keyPath[0] == 'value' && !commonLib_1.hasIn(branch, SymData, 'value')) // value is not self managed, so modify only current
            return Macros.setCurrent(state, schema, UPDATABLE_object, { value: value, replace: replace, path: path.concat(keyPath.slice(1)) });
        // set data
        setUPDATABLE(UPDATABLE_object, value, replace, path, SymData, keyPath);
        // setIn(update, value, path, SymData, keyPath);
        // if (replace) setIn(replace_UPDATABLE, replace, path, SymData, keyPath);
        // additional state modifying if required
        if (keyPath[0] == 'value') {
            // modify current
            state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate([], commonLib_1.push2array(['current'], path, keyPath.slice(1)), value, replace));
        } else if (keyPath[0] == 'length') {
            // modify state with new length
            state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate([], commonLib_1.push2array(['current'], path, keyPath), value, replace));
            var start = branch[SymData].length;
            start = Math.max(start, 0);
            var end = Math.max(value || 0);
            //setIn(update, end, SymData, 'current', path, 'length');
            //state = mergeUPD_PROC(state, UPDATABLE_object);
            var oneOfStateFn = oneOfStructure(state, path);
            var maps2enable = [];
            var maps2disable = [];
            for (var i = start; i < end; i++) {
                var elemPath = path.concat(i);
                if (item.setOneOf) oneOfStateFn(elemPath, { oneOf: item.setOneOf });

                var _makeStateBranch4 = makeStateBranch(schema, oneOfStateFn, elemPath),
                    _branch = _makeStateBranch4.state,
                    _makeStateBranch4$dat = _makeStateBranch4.dataMap,
                    _dataMap = _makeStateBranch4$dat === undefined ? [] : _makeStateBranch4$dat,
                    defaultValues = _makeStateBranch4.defaultValues;

                _branch = commonLib_1.merge(_branch, _defineProperty({}, SymData, { params: { uniqKey: getUniqKey() } }));
                state = commonLib_1.merge(state, commonLib_1.setIn({}, _branch, elemPath), { replace: commonLib_1.setIn({}, true, elemPath) });
                state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate([], commonLib_1.push2array(['current'], elemPath), defaultValues, true));
                //state = merge(state, makeSlice(SymData, 'current', elemPath, defaultValues), {replace: makeSlice(SymData, 'current', elemPath, true)});
                commonLib_1.push2array(maps2enable, _dataMap);
                //state = updDataMap2state(state, dataMap, schema, UPDATABLE_object);
                state = Macros.setStatus(state, schema, UPDATABLE_object, makeNUpdate(path, ['status', 'untouched'], 1));
            }
            for (var _i = end; _i < start; _i++) {
                var _elemPath = path.concat(_i);
                commonLib_1.push2array(maps2disable, commonLib_1.getIn(state, _elemPath, SymDataMapTree, SymData) || []);
                ['invalid', 'dirty', 'untouched', 'pending'].forEach(function (key) {
                    var statusValue = getUpdValue([update, state], path, SymData, 'status', key);
                    if (statusValue) state = Macros.setStatus(state, schema, UPDATABLE_object, makeNUpdate(path, ['status', key], -1));
                });
                setUPDATABLE(UPDATABLE_object, SymDelete, true, _elemPath);
                // setIn(update, SymDelete, elemPath);
                // setIn(replace_UPDATABLE, SymDelete, elemPath);
            }
            var schemaPart = getSchemaPart(schema, path, oneOfFromState(state));
            commonLib_1.setIn(update, isArrayCanAdd(schemaPart, end), path, SymData, 'fData', 'canAdd');
            for (var _i2 = Math.max(Math.min(start, end) - 1, 0); _i2 < end; _i2++) {
                setUPDATABLE(UPDATABLE_object, getArrayItemData(schemaPart, _i2, end), true, path, _i2, SymData, 'arrayItem');
            }state = mergeStatePROCEDURE(state, UPDATABLE_object);
            state = setDataMapInState(state, schema, maps2disable, true);
            state = setDataMapInState(state, schema, maps2enable);
        } else if (keyPath[0] == 'status') {
            // properly set status change
            var keyStatus = keyPath[1];
            var newKey = void 0;
            var _value = void 0;
            if (keyStatus == 'invalid' || keyStatus == 'pending') {
                _value = getUpdValue([update, state], path, SymData, 'status', 'pending') ? null : !getUpdValue([update, state], path, SymData, 'status', 'invalid');
                newKey = 'valid';
            } else if (keyStatus == 'untouched' || keyStatus == 'dirty') {
                _value = !getUpdValue([update, state], path, SymData, 'status', keyStatus);
                newKey = keyStatus == 'untouched' ? 'touched' : 'pristine';
            }
            if (!commonLib_2.isUndefined(newKey)) commonLib_1.setIn(update, _value, path, SymData, 'status', newKey);
        } else if (keyPath[0] == 'oneOf') {
            var oldBranch = commonLib_1.getIn(state, path);
            var oldOneOf = commonLib_1.getIn(oldBranch, SymData, 'oneOf') || 0;
            var newOneOf = commonLib_1.getIn(UPDATABLE_object.update, path, SymData, 'oneOf');
            if (oldOneOf != newOneOf || item.type && item.type != commonLib_1.getIn(oldBranch, SymData, 'fData', 'type')) {
                setIfNotDeeper(UPDATABLE_object, SymReset, 'forceCheck', item.path);
                state = mergeStatePROCEDURE(state, UPDATABLE_object);
                state = setDataMapInState(state, schema, commonLib_1.getIn(state, path, SymDataMapTree, SymData) || [], true);

                var _makeStateBranch5 = makeStateBranch(schema, oneOfStructure(state, path), path, item.setValue),
                    _branch2 = _makeStateBranch5.state,
                    _makeStateBranch5$dat = _makeStateBranch5.dataMap,
                    _maps2enable = _makeStateBranch5$dat === undefined ? [] : _makeStateBranch5$dat,
                    defaultValues = _makeStateBranch5.defaultValues;

                var _a = oldBranch[SymData],
                    v1 = _a.value,
                    v2 = _a.length,
                    v3 = _a.oneOf,
                    v4 = _a.fData,
                    previousBranchData = __rest(_a, ["value", "length", "oneOf", "fData"]); // remove data that should be replaced by new branch
                if (!isSelfManaged(oldBranch) || !isSelfManaged(_branch2)) delete previousBranchData.status; // keep status values only for self-managed branch, that keeps to be self-managed
                _branch2 = commonLib_1.merge(_branch2, _defineProperty({}, SymData, previousBranchData), { arrays: 'replace' });
                if (path.length) {
                    var topPath = path.slice();
                    var field = topPath.pop();
                    ['invalid', 'dirty', 'pending'].forEach(function (key) {
                        var oldStatusValue = commonLib_1.getIn(oldBranch, SymData, 'status', key);
                        var newStatusValue = commonLib_1.getIn(_branch2, SymData, 'status', key);
                        if (!oldStatusValue != !newStatusValue) state = Macros.setStatus(state, schema, UPDATABLE_object, makeNUpdate(topPath, ['status', key], newStatusValue ? 1 : -1));
                    });
                    var arrayOfRequired = commonLib_1.getIn(state, topPath, SymData, 'fData', 'required');
                    arrayOfRequired = commonLib_2.isArray(arrayOfRequired) && arrayOfRequired.length && arrayOfRequired;
                    if (arrayOfRequired && ~arrayOfRequired.indexOf(field)) _branch2 = commonLib_1.merge(_branch2, _defineProperty({}, SymData, { fData: { required: true } }));
                }
                if (commonLib_1.getIn(oldBranch, SymData, 'status', 'untouched') == 0) _branch2 = commonLib_1.merge(_branch2, _defineProperty({}, SymData, { status: { untouched: 0 } })); // stick untouched to zero
                state = commonLib_1.merge(state, commonLib_1.setIn({}, _branch2, path), { replace: commonLib_1.setIn({}, true, path) });
                state = setDataMapInState(state, schema, _maps2enable);
                if (commonLib_1.getIn(_branch2, SymData, 'status', 'untouched') == 0) state = Macros.switch(state, schema, UPDATABLE_object, makeNUpdate(path, ['status', 'untouched'], 0));
                state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate([], commonLib_1.push2array(['current'], path), defaultValues, true));
            }
        }
    }
    // apply dataMap
    var dataMap = commonLib_1.getIn(state, path, SymDataMapTree);
    for (var _i3 = 0; _i3 < keyPath.length; _i3++) {
        if (!dataMap) break;
        state = executeDataMapsPROCEDURE(state, schema, UPDATABLE_object, dataMap[SymDataMap], makeNUpdate(path, keyPath.slice(0, _i3), commonLib_1.setIn({}, value, keyPath.slice(_i3)), commonLib_1.setIn({}, replace, keyPath.slice(_i3))));
        dataMap = dataMap[keyPath[_i3]];
    }
    if (dataMap) state = recursivelyExecuteDataMaps(dataMap, value, replace, keyPath);
    function recursivelyExecuteDataMaps(dataMap, value, replace) {
        var track = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

        state = executeDataMapsPROCEDURE(state, schema, UPDATABLE_object, dataMap[SymDataMap], makeNUpdate(path, track, value, replace));
        commonLib_2.isMergeable(value) && commonLib_1.objKeys(dataMap).forEach(function (key) {
            return value.hasOwnProperty(key) && (state = recursivelyExecuteDataMaps(dataMap[key], value[key], commonLib_1.getIn(replace, key), track.concat(key)));
        });
        return state;
    }
    return state;
}
exports.updateStatePROCEDURE = updateStatePROCEDURE;
// todo: rework dataMaps and validation to work ...args and chains '|'
function executeDataMapsPROCEDURE(state, schema, UPDATABLE_object, maps, item) {
    var value = item.value,
        path = item.path,
        replace = item.replace;

    var keyPath = item[SymData] || [];
    commonLib_1.objKeys(maps || {}).forEach(function (pathTo) {
        if (!maps[pathTo]) return; // disabled map
        var map = maps[pathTo];
        var NpathTo = path2string(normalizePath(pathTo, path));
        var executedValue = value;
        if (commonLib_2.isObject(map)) {
            var bindObj = { path: NUpdate2string(item), pathTo: NpathTo, schema: schema, getFromState: getFrom4DataMap(state, UPDATABLE_object) };
            executedValue = commonLib_1.deArray(commonLib_1.toArray(map.$).reduce(function (args, fn) {
                return commonLib_1.toArray(fn.call.apply(fn, [bindObj].concat(_toConsumableArray(args))));
            }, commonLib_1.push2array([executedValue], map.args)));
        }
        var updates = map.asUpdates ? commonLib_1.toArray(executedValue) : [{ path: NpathTo, value: executedValue, replace: replace }];
        updates.forEach(function (update) {
            return state = updateStatePROCEDURE(state, schema, UPDATABLE_object, update);
        });
    });
    return state;
}
function getFrom4DataMap(state, UPDATABLE_object) {
    return function () {
        for (var _len4 = arguments.length, tPath = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            tPath[_key4] = arguments[_key4];
        }

        if (commonLib_1.hasIn.apply(commonLib_1, [UPDATABLE_object.update].concat(_toConsumableArray(tPath.map(function (path) {
            return normalizePath(path);
        }))))) return commonLib_1.merge(getFromState.apply(undefined, [state].concat(tPath)), getFromState.apply(undefined, [UPDATABLE_object.update].concat(tPath)), { replace: getFromState.apply(undefined, [UPDATABLE_object.replace].concat(tPath)) });
        return getFromState.apply(undefined, [state].concat(tPath));
    };
}
function getDefaultFromSchema(schema) {
    return makeStateFromSchema(schema)[SymData].current;
}
exports.getDefaultFromSchema = getDefaultFromSchema;
function object2PathValues(vals) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var track = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    var fn = options.symbol ? commonLib_1.objKeysNSymb : commonLib_1.objKeys;
    var check = options.arrayAsValue ? commonLib_2.isObject : commonLib_2.isMergeable;
    var result = [];
    fn(vals).forEach(function (key) {
        var path = track.concat(key);
        if (check(vals[key])) object2PathValues(vals[key], options, path).forEach(function (item) {
            return result.push(item);
        }); // result = result.concat(object2PathValues(vals[key], path));
        else result.push(commonLib_1.push2array(path, vals[key]));
    });
    if (!result.length) return [commonLib_1.push2array(track.slice(), {})]; // empty object
    return result;
}
exports.object2PathValues = object2PathValues;
function isNPath(path) {
    return commonLib_1.getIn(path, SymData) === 'nPath';
}
exports.isNPath = isNPath;
function normalizePath(path) {
    var base = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var result = resolvePath(flattenPath(path), base.length ? flattenPath(base) : []);
    result[SymData] = 'nPath';
    return result;
}
exports.normalizePath = normalizePath;
function normalizeUpdate(update, state) {
    var path = update.path,
        value = update.value,
        replace = update.replace,
        base = update.base,
        rest = __rest(update, ["path", "value", "replace", "base"]);

    var result = [];
    var pathes = normalizePath(path, base);
    var keyPathes = [];
    var a = pathes.indexOf(SymData);
    if (~a) {
        keyPathes = pathes.slice(a + 1);
        pathes = pathes.slice(0, a);
    }
    pathes = multiplyPath(pathes, { '*': function _(path) {
            return branchKeys(commonLib_1.getIn(state, path)).join(',');
        } });
    keyPathes = multiplyPath(keyPathes);
    commonLib_1.objKeys(pathes).forEach(function (p) {
        return commonLib_1.objKeys(keyPathes).forEach(function (k) {
            return result.push(makeNUpdate(pathes[p], keyPathes[k], value, replace, rest));
        });
    });
    return result;
}
exports.normalizeUpdate = normalizeUpdate;
function string2NUpdate(path) {
    var base = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var rest = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    path = normalizePath(path, base);
    var keyPath = [];
    var a = path.indexOf(SymData);
    if (~a) {
        keyPath = path.slice(a + 1);
        path = path.slice(0, a);
    }

    var value = rest.value,
        replace = rest.replace,
        r = __rest(rest, ["value", "replace"]);

    return makeNUpdate(path, keyPath, value, replace, r);
}
exports.string2NUpdate = string2NUpdate;
/////////////////////////////////////////////
//      Utilities
/////////////////////////////////////////////
function NUpdate2string(item) {
    var path = path2string(item.path);
    return path + (item.keyPath && !~path.indexOf('@') ? '/@/' + path2string(item.keyPath) : '');
}
var makeNUpdate = function makeNUpdate(path, keyPath, value, replace) {
    var _Object$assign;

    var rest = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    return Object.assign((_Object$assign = { path: path }, _defineProperty(_Object$assign, SymData, keyPath), _defineProperty(_Object$assign, "value", value), _defineProperty(_Object$assign, "replace", replace), _Object$assign), rest);
};
exports.makeNUpdate = makeNUpdate;
function isNUpdate(updateItem) {
    return !commonLib_2.isUndefined(commonLib_1.getIn(updateItem, SymData)) && commonLib_2.isArray(updateItem[SymData]);
}
function multiplyPath(path) {
    var strReplace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var result = { '': [] };
    path.forEach(function (value) {
        var res = {};
        value = strReplace[value] || value;
        if (typeof value == 'string' && ~value.indexOf(',')) {
            commonLib_1.objKeys(result).forEach(function (key) {
                return value.split(',').forEach(function (k) {
                    return res[key && key + ',' + k || k] = result[key].concat(k.trim());
                });
            });
        } else if (typeof value == 'function') {
            commonLib_1.objKeys(result).forEach(function (key) {
                var tmp = value(result[key]);
                if (typeof tmp == 'string') tmp = string2path(tmp);
                tmp = multiplyPath(tmp, strReplace);
                commonLib_1.objKeys(tmp).forEach(function (k) {
                    return res[key && key + (k ? ',' + k : '') || k] = result[key].concat(tmp[k]);
                });
            });
        } else commonLib_1.objKeys(result).forEach(function (key) {
            return commonLib_1.push2array(result[key], value);
        });
        if (commonLib_1.objKeys(res).length) result = res;
    });
    return result;
}
exports.multiplyPath = multiplyPath;
var num2string = function num2string(value) {
    return typeof value == 'number' ? value.toString() : value;
};
function relativePath(base, destination) {
    if (base[0] === '#') base = base.slice(1);
    if (destination[0] === '#') destination = destination.slice(1);
    // let same = true;
    // let res: Path = [];
    var result = [];
    var i = void 0;
    for (i = 0; i < base.length; i++) {
        if (num2string(base[i]) !== num2string(destination[i])) break;
    }for (var j = i; j < base.length; j++) {
        result.push('..');
    }if (!result.length) result.push('.');
    return commonLib_1.push2array(result, destination.slice(i));
    // return result;
}
exports.relativePath = relativePath;
function resolvePath(path, base) {
    var result = base && (path[0] === '.' || path[0] == '..') ? base.slice() : [];
    for (var i = 0; i < path.length; i++) {
        var val = path[i];
        if (val === '..') result.pop();else if (val !== '' && val !== '.') result.push(val);
    }
    return result;
}
function setIfNotDeeper(state, value) {
    if (state === value) return state;

    for (var _len5 = arguments.length, pathes = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
        pathes[_key5 - 2] = arguments[_key5];
    }

    var path = flattenPath(pathes);
    var result = state;
    for (var i = 0; i < path.length - 1; i++) {
        if (result[path[i]] === value) return state;
        if (!commonLib_2.isObject(result[path[i]])) result[path[i]] = {};
        result = result[path[i]];
    }
    if (path.length) result[path[path.length - 1]] = value;else return value;
    return state;
}
exports.setIfNotDeeper = setIfNotDeeper;
function flattenPath(path) {
    if (commonLib_2.isArray(path)) {
        var result = [];
        commonLib_1.push2array.apply(commonLib_1, [result].concat(_toConsumableArray(path.map(flattenPath))));
        return result;
    } else if (typeof path == 'string') return string2path(path);
    return [path];
}
function path2string(path) {
    return commonLib_2.isArray(path) ? path.map(path2string).join('/') : symConv.sym2str(path);
}
exports.path2string = path2string;
function string2path(path) {
    path = path.replace(symConv(SymData), '/' + symConv(SymData) + '/');
    path = path.replace(/\/+/g, '/');
    var result = [];
    path.split('/').forEach(function (key) {
        return key && (key = symConv.str2sym(key.trim())) && result.push(key);
    });
    return result;
}
exports.string2path = string2path;
function getFromState(state) {
    for (var _len6 = arguments.length, pathes = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
        pathes[_key6 - 1] = arguments[_key6];
    }

    return commonLib_1.getIn.apply(commonLib_1, [state].concat(_toConsumableArray(pathes.map(function (path) {
        return normalizePath(path);
    }))));
}
exports.getFromState = getFromState;
var objMap = function objMap(object, fn) {
    return commonLib_1.objKeys(object).reduce(function (result, key) {
        return ((result[key] = fn(object[key], key, object)) || true) && result;
    }, commonLib_2.isArray(object) ? [] : {});
};
exports.objMap = objMap;