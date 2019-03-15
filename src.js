"use strict";
var __$_0__='length',__$_1__='isUndefined',__$_2__='forEach',__$_3__='getIn',__$_4__='push2array',__$_5__='objKeys',__$_6__='concat',__$_7__='isMergeable',__$_8__='additionalItems',__$_9__='replace',__$_10__='isArray',__$_11__='update',__$_12__='current',__$_13__='value',__$_14__='isObject',__$_15__='path',__$_16__='merge',__$_17__='slice',__$_18__='makeSlice',__$_19__='oneOf',__$_20__='defaultValues',__$_21__='setIn',__$_22__='moveArrayElems',__$_23__='indexOf',__$_24__='setStatus',__$_25__='assign',__$_26__='default',__$_27__='properties',__$_28__='textGroups',__$_29__='macros',__$_30__='updates',__$_31__='validatedValue',__$_32__='hasOwnProperty',__$_33__='isFunction',__$_34__='minItems',__$_35__='memoize',__$_36__='fData',__$_37__='setOneOf',__$_38__='setValue',__$_39__='inital',__$_40__='getOwnPropertySymbols',__$_41__='hasIn',__$_42__='UPDATABLE',__$_43__='dataMap',__$_44__='clearBinded',__$_45__='items',__$_46__='selfManaged',__$_47__='toString',__$_48__='anSetState',__$_49__='schemaPart',__$_50__='ff_oneOfSelector';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array[__$_10__] (arr)) { for (var i = 0, arr2 = Array(arr[__$_0__] ); i < arr[__$_0__] ; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var __rest = this && this.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e[__$_23__] (p) < 0) t[p] = s[p];
    }if (s != null && typeof Object[__$_40__]  === "function") for (var i = 0, p = Object[__$_40__] (s); i < p[__$_0__] ; i++) {
        if (e[__$_23__] (p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var commonLib_1 = require("./commonLib");
var commonLib_2 = require("./commonLib");
var api_1 = require("./api");



var SymData = Symbol.for('FFormData');
exports.SymData = SymData;
var SymDataMapTree = Symbol.for('FFormDataMapTree');
var SymDataMap = Symbol.for('FFormDataMap');
var SymReset = Symbol.for('FFormReset');
exports.SymReset = SymReset;
var SymClear = Symbol.for('FFormClear');
exports.SymClear = SymClear;
var SymDelete = undefined; 
exports.SymDelete = SymDelete;




var types = ['null', 'boolean', 'integer', 'number', 'string', 'array', 'object'];
exports.types = types;
types.any = function () {
    return true;
};
types.null = function (value) {
    return value === null;
};
types.boolean = function (value) {
    return typeof value === "boolean";
};
types.number = commonLib_2.isNumber; 
types.integer = commonLib_2.isInteger; 
types.string = commonLib_2.isString; 
types.array = commonLib_2[__$_10__] ;
types.object = commonLib_2[__$_14__] ; 
types.empty = { 'any': null, 'null': null, 'boolean': false, 'number': 0, 'integer': 0, 'string': '', array: Object.freeze([]), object: Object.freeze({}) };



function getBindedMaps2update(branch) {
    var path = arguments[__$_0__]  > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var maps2disable = commonLib_1[__$_3__] (branch, SymDataMapTree, SymData) || [];
    var maps2enable = maps2disable.map(function (map) {
        return commonLib_1[__$_16__] (map, { emitter: path });
    });
    var clearBinded = maps2disable[__$_0__]  ? _defineProperty({}, SymDataMapTree, _defineProperty({}, SymData, [])) : undefined;
    commonLib_1[__$_5__] (branch)[__$_2__] (function (key) {
        var result = void 0;
        if (branch[key]) {
            result = getBindedMaps2update(branch[key], path[__$_6__] (key));
            commonLib_1[__$_4__] (maps2disable, result.maps2disable);
            commonLib_1[__$_4__] (maps2enable, result.maps2enable);
            if (result[__$_44__] ) {
                if (!clearBinded) clearBinded = {};
                clearBinded[key] = result[__$_44__] ;
            }
        }
    });
    return { maps2disable: maps2disable, maps2enable: maps2enable, clearBinded: clearBinded };
}
var Macros = {};
Macros.array = function (state, schema, UPDATABLE, item) {
    var _a = item,
        path = _a[__$_15__] ,
        macros = _a[__$_29__] ,
        value = _a[__$_13__] ,
        _b = SymData,
        sym = _a[_b],
        rest = __rest(_a, ["path", "macros", "value", (typeof _b === "undefined" ? "undefined" : _typeof(_b)) === "symbol" ? _b : _b + ""]);
    var length = getUpdValue([UPDATABLE[__$_11__] , state], path, SymData, 'length');
    if (!commonLib_2.isNumber(length)) return state;
    if (commonLib_2[__$_10__] (item[__$_13__] )) {
        var mergeArrayObj = [];
        var replaceArrayObj = {};
        for (var i = 0; i < item[__$_13__] .length; i++) {
            mergeArrayObj[length + i] = item[__$_13__] [i];
            replaceArrayObj[length + i] = commonLib_1[__$_3__] (item[__$_9__] , i);
        }
        mergeArrayObj[__$_0__]  = length + item[__$_13__] .length;
        return updateCurrentPROC(state, UPDATABLE, mergeArrayObj, replaceArrayObj, path, item[__$_37__] );
    } else {
        length += item[__$_13__]  || 1;
        if (length < 0) length = 0;
        return updatePROC(state, UPDATABLE, makeNUpdate(path, [__$_0__] , length, false, rest));
    }
};
Macros.arrayItem = function (state, schema, UPDATABLE, item) {
    var path = item[__$_15__] ;
    var op = item.op;
    var opVal = item[__$_13__]  || 0;
    var from = parseInt(path.pop());
    var to = from;
    var min = arrayStart(getSchemaPart(schema, path, oneOfFromState(state))); 
    var length = getUpdValue([UPDATABLE[__$_11__] , state], path, SymData, 'length');
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
    updObj[0] = commonLib_1[__$_3__] (UPDATABLE[__$_11__] , path);
    updObj[1] = commonLib_1[__$_3__] (UPDATABLE[__$_11__] , SymData, 'current', path);
    updObj[2] = commonLib_1[__$_3__] (UPDATABLE[__$_9__] , path);
    updObj[3] = commonLib_1[__$_3__] (UPDATABLE[__$_9__] , SymData, 'current', path);

    var _loop = function _loop(i) {
        stateObject[i] = commonLib_1[__$_3__] (state, path, i);
        arrayItems[i] = stateObject[i][SymData].arrayItem; 
        
        currentObject[i] = commonLib_1[__$_3__] (state, SymData, 'current', path, i);
        updObj[__$_2__] (function (obj) {
            return commonLib_2[__$_7__] (obj) && !obj[__$_32__] (i) && (obj[i] = SymClear);
        });
    };

    for (var i = Math.min(from, to); i <= Math.max(from, to); i++) {
        _loop(i);
    }
    stateObject = commonLib_1[__$_22__] (stateObject, from, to);
    currentObject = commonLib_1[__$_22__] (currentObject, from, to);

    var _getBindedMaps2update = getBindedMaps2update(stateObject, path),
        maps2disable = _getBindedMaps2update.maps2disable,
        maps2enable = _getBindedMaps2update.maps2enable,
        clearBinded = _getBindedMaps2update[__$_44__] ;

    if (clearBinded) stateObject = commonLib_1[__$_16__] (stateObject, clearBinded);
    updObj[__$_2__] (function (obj) {
        if (!commonLib_2[__$_7__] (obj)) return;
        commonLib_1[__$_22__] (obj, from, to);
        for (var i = Math.min(from, to); i <= Math.max(from, to); i++) {
            if (obj[i] === SymClear) delete obj[i];
        }
    });
    commonLib_1[__$_5__] (stateObject)[__$_2__] (function (i) {
        stateObject[i] = commonLib_1[__$_16__] (stateObject[i], commonLib_1[__$_18__] (SymData, 'arrayItem', arrayItems[i]), { replace: commonLib_1[__$_18__] (SymData, 'arrayItem', true) });
        
    }); 
    
    state = commonLib_1[__$_16__] (state, commonLib_1[__$_18__] (path, stateObject), { replace: trueIfLength(item[__$_15__] .length + 1) }); 
    state = commonLib_1[__$_16__] (state, commonLib_1[__$_18__] (SymData, 'current', path, currentObject), { replace: trueIfLength(item[__$_15__] .length + 3) }); 
    if (op == 'del') state = updatePROC(state, UPDATABLE, makeNUpdate(path, [__$_0__] , max));
    state = mergeUPD_PROC(state, UPDATABLE);
    state = setDataMapInState(state, UPDATABLE, maps2disable, true);
    state = setDataMapInState(state, UPDATABLE, maps2enable);
    return state;
};
Macros.switch = function (state, schema, UPDATABLE, item) {
    var keyPath = item[SymData] || [];
    var switches = commonLib_1[__$_18__] (keyPath, item[__$_13__] );
    object2PathValues(switches)[__$_2__] (function (pathValue) {
        return state = recursivelyUpdate(state, schema, UPDATABLE, makeNUpdate(item[__$_15__] , pathValue, pathValue.pop()));
    });
    return state;
};
Macros.setExtraStatus = function (state, schema, UPDATABLE, item) {
    var keyPath = item[SymData] || [];
    var prevVal = getUpdValue([UPDATABLE[__$_11__] , state], item[__$_15__] , SymData, keyPath);
    var value = item[__$_13__]  > 0;
    if (!prevVal == value) {
        state = updatePROC(state, UPDATABLE, makeNUpdate(item[__$_15__] , keyPath, value));
        state = Macros[__$_24__] (state, schema, UPDATABLE, makeNUpdate(item[__$_15__] , ['status', keyPath[keyPath[__$_0__]  - 1]], value ? 1 : -1));
    }
    return state;
};
Macros[__$_24__]  = function (state, schema, UPDATABLE, item) {
    var keyPath = item[SymData] || [];
    if (keyPath[__$_0__]  > 2) return Macros.setExtraStatus(state, schema, UPDATABLE, item);
    var op = keyPath[1];
    if (!op) return state;
    if (op == 'valid' || op == 'pristine' || op == 'touched') throw new Error('Setting "' + op + '" directly is not allowed');
    var prevVal = getUpdValue([UPDATABLE[__$_11__] , state], item[__$_15__] , SymData, keyPath);
    var selfManaged = isSelfManaged(state, item[__$_15__] );
    if (op == 'untouched' && prevVal == 0 && !selfManaged) return state; 
    var value = prevVal + item[__$_13__] ;
    if (selfManaged && value > 1) value = 1;
    if (value < 0) value = 0;
    state = updatePROC(state, UPDATABLE, makeNUpdate(item[__$_15__] , ['status', op], value));
    if (!isTopPath(item[__$_15__] ) && !prevVal != !value) 
        state = Macros[__$_24__] (state, schema, UPDATABLE, makeNUpdate(item[__$_15__] .slice(0, -1), keyPath, value > 0 ? 1 : -1));
    return state;
};
Macros.setCurrent = function (state, schema, UPDATABLE, item) {
    return updateCurrentPROC(state, UPDATABLE, item[__$_13__] , item[__$_9__] , item[__$_15__] , item[__$_37__] );
};
Macros[__$_37__]  = function (state, schema, UPDATABLE, item) {
    var oldOneOf = commonLib_1[__$_3__] (state, item[__$_15__] , SymData, 'oneOf');
    if (oldOneOf == item[__$_13__] ) {
        if (!commonLib_2[__$_1__] (item[__$_38__] )) state = updateCurrentPROC(state, UPDATABLE, item[__$_38__] , false, item[__$_15__] );
        return state;
    }
    var macros = item[__$_29__] ,
        newItem = __rest(item, [__$_29__] );
    newItem[SymData] = [__$_19__] ;
    if (commonLib_2[__$_1__] (newItem[__$_38__] )) {
        state = mergeUPD_PROC(state, UPDATABLE);
        newItem[__$_38__]  = commonLib_1[__$_3__] (state, SymData, 'current', item[__$_15__] );
    }
    return updatePROC(state, UPDATABLE, newItem);
};



function recursivelyUpdate(state, schema, UPDATABLE, item) {
    var branch = commonLib_1[__$_3__] (state, item[__$_15__] );
    var keys = branchKeys(branch);
    if (item[__$_13__]  == SymReset && item[SymData][0] == 'status') {
        var i = Object[__$_25__] ({}, item);
        i[__$_13__]  = item[SymData][1] == 'untouched' ? isSelfManaged(branch) ? 1 : keys[__$_0__]  : 0;
        state = updatePROC(state, UPDATABLE, i);
    } else state = updatePROC(state, UPDATABLE, item);
    keys[__$_2__] (function (key) {
        return state = recursivelyUpdate(state, schema, UPDATABLE, commonLib_1[__$_16__] (item, { path: item[__$_15__] [__$_6__] (key) }));
    });
    return state;
}
;
function branchKeys(branch) {
    var keys = [];
    if (isSelfManaged(branch)) return keys;
    if (branch[SymData][__$_36__] .type == 'array') for (var j = 0; j < commonLib_1[__$_3__] (branch, SymData, 'length'); j++) {
        keys.push(j[__$_47__] ());
    } else keys = commonLib_1[__$_5__] (branch).filter(function (v) {
        return v;
    });
    return keys;
}
exports.branchKeys = branchKeys;



var schemaStorage = commonLib_1[__$_35__] (function (schema) {
    return {};
});
function oneOfFromState(state) {
    return function (path) {
        var s = commonLib_1[__$_3__] (commonLib_2[__$_33__] (state) ? state() : state, path, SymData);
        return { oneOf: commonLib_1[__$_3__] (s, 'oneOf'), type: commonLib_1[__$_3__] (s, 'fData', 'type') };
    };
}
exports.oneOfFromState = oneOfFromState;
function oneOfStructure(state, path) {
    if (typeof state == 'function') state = state();
    var result = {};
    var tmp = result;
    commonLib_1[__$_21__] (tmp, commonLib_1[__$_3__] (state, SymData, 'oneOf'), SymData, 'oneOf');
    commonLib_1[__$_21__] (tmp, commonLib_1[__$_3__] (state, SymData, 'fData', 'type'), SymData, 'type');
    for (var i = 0; i < path[__$_0__] ; i++) {
        if (commonLib_2[__$_1__] (path[i]) || path[i] === '') continue;
        tmp[path[i]] = {};
        tmp = tmp[path[i]];
        state = commonLib_1[__$_3__] (state, path[i]);
        commonLib_1[__$_21__] (tmp, commonLib_1[__$_3__] (state, SymData, 'oneOf'), SymData, 'oneOf');
        commonLib_1[__$_21__] (tmp, commonLib_1[__$_3__] (state, SymData, 'fData', 'type'), SymData, 'type');
    }
    
    var fn = function fn(path, oneOf) {
        return commonLib_2[__$_1__] (oneOf) ? commonLib_1[__$_3__] (result, path, SymData) : commonLib_1[__$_21__] (result, oneOf, path, SymData);
    };
    fn._canSet = true;
    return fn;
}
var additionalItemsSchema = commonLib_1[__$_35__] (function (items) {
    return {
        ff_compiled: true,
        oneOf: items,
        ff_oneOfSelector: normalizeFn(function () {
            return items[__$_0__]  % string2path(this[__$_15__] ).pop();
        })
    };
});
function getSchemaPart(schema, path, getOneOf, fullOneOf) {
    function getArrayItemSchemaPart(index, schemaPart) {
        var items = [];
        if (schemaPart[__$_45__] ) {
            if (!commonLib_2[__$_10__] (schemaPart[__$_45__] )) return schemaPart[__$_45__] ;else items = schemaPart[__$_45__] ;
        }
        if (index < items[__$_0__] ) return items[index];else {
            if (schemaPart[__$_8__]  !== false) {
                if (schemaPart[__$_8__]  && schemaPart[__$_8__]  !== true) return schemaPart[__$_8__] ;
                return additionalItemsSchema(items);
                
            }
        }
        throw new Error(errorText + path.join('/'));
    }
    function getSchemaByRef(schema, $ref) {
        var path = string2path($ref);
        if ($ref[0] == '#') return commonLib_1[__$_3__] (schema, path); 
        throw new Error("Can only ref to #"); 
    }
    function deref(schema, schemaPart) {
        while (schemaPart.$ref) {
            schemaPart = getSchemaByRef(schema, schemaPart.$ref);
        }return schemaPart;
    }
    function combineSchemasINNER_PROCEDURE(schemaPart) {
        if (schemaPart.$ref || schemaPart.allOf || schemaPart[__$_19__] ) {
            if (combinedSchemas.get(schemaPart)) schemaPart = combinedSchemas.get(schemaPart);else {
                var schemaPartAsKey = schemaPart;
                schemaPart = derefAndMergeAllOf(schema, schemaPart); 
                if (schemaPart[__$_19__] ) {
                    var _schemaPart = schemaPart,
                        oneOf = _schemaPart[__$_19__] ,
                        restSchemaPart = __rest(schemaPart, [__$_19__] );

                    schemaPart = oneOf.map(function (oneOfPart) {
                        return commonLib_1[__$_16__] (derefAndMergeAllOf(schema, oneOfPart), restSchemaPart, { array: 'replace' });
                    }); 
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
            for (var i = 0; i < allOf[__$_0__] ; i++) {
                result = commonLib_1[__$_16__] (result, derefAndMergeAllOf(schema, allOf[i]), { array: 'replace' });
            }
            schemaPart = commonLib_1[__$_16__] (result, restSchemaPart);
        }
        return schemaPart;
    }
    var errorText = 'Schema path not found: ';
    var schemaPart = schema;
    var combinedSchemas = commonLib_1.getCreateIn(schemaStorage(schema), new Map(), 'combinedSchemas');
    var type = void 0;
    for (var i = path[0] == '#' ? 1 : 0; i < path[__$_0__] ; i++) {
        if (!schemaPart) throw new Error(errorText + path.join('/'));
        schemaPart = combineSchemasINNER_PROCEDURE(schemaPart);

        var _getOneOf = getOneOf(path[__$_17__] (0, i)),
            oneOf = _getOneOf[__$_19__] ,
            _type = _getOneOf.type;

        if (commonLib_2[__$_10__] (schemaPart)) schemaPart = schemaPart[oneOf || 0];
        if (_type == 'array') {
            if (isNaN(parseInt(path[i]))) throw new Error(errorText + path.join('/'));
            schemaPart = getArrayItemSchemaPart(path[i], schemaPart);
        } else {
            if (schemaPart[__$_27__]  && schemaPart[__$_27__] [path[i]]) schemaPart = schemaPart[__$_27__] [path[i]];else throw new Error(errorText + path.join('/'));
        }
    }
    schemaPart = combineSchemasINNER_PROCEDURE(schemaPart);
    if (fullOneOf) return schemaPart;
    if (commonLib_2[__$_10__] (schemaPart)) schemaPart = schemaPart[getOneOf(path)[__$_19__]  || 0];
    return schemaPart;
}
exports.getSchemaPart = getSchemaPart;
var arrayStart = commonLib_1[__$_35__] (function (schemaPart) {
    if (!commonLib_2[__$_10__] (schemaPart[__$_45__] )) return 0;
    if (schemaPart[__$_8__]  === false) return schemaPart[__$_45__] .length;
    if (_typeof(schemaPart[__$_8__] ) === 'object') return schemaPart[__$_45__] .length;
    if (schemaPart[__$_45__] .length == 0) return 0;
    return schemaPart[__$_45__] .length - 1;
});
exports.arrayStart = arrayStart;
var basicStatus = { invalid: 0, dirty: 0, untouched: 1, pending: 0, valid: true, touched: false, pristine: true };
var makeDataStorage = commonLib_1[__$_35__] (function (schemaPart, oneOf, type) {
    var value = arguments[__$_0__]  > 3 && arguments[3] !== undefined ? arguments[3] : schemaPart[__$_26__] ;

    
    var _schemaPart$ff_params = schemaPart.ff_params,
        ff_params = _schemaPart$ff_params === undefined ? {} : _schemaPart$ff_params,
        _schemaPart$ff_data = schemaPart.ff_data,
        ff_data = _schemaPart$ff_data === undefined ? {} : _schemaPart$ff_data;

    var result = Object[__$_25__] ({ params: ff_params }, ff_data);
    if (!commonLib_2[__$_14__] (result.messages)) result.messages = {};
    if (commonLib_2[__$_1__] (value)) value = types.empty[type || 'any'];
    result[__$_19__]  = oneOf;
    result.status = basicStatus;
    if (!commonLib_2[__$_14__] (result[__$_36__] )) result[__$_36__]  = {};
    var fData = result[__$_36__] ;
    fData.type = type;
    fData.required = schemaPart.required;
    if (schemaPart.title) fData.title = schemaPart.title;
    if (schemaPart.ff_placeholder) fData.placeholder = schemaPart.ff_placeholder;
    if (schemaPart.enum) fData.enum = schemaPart.enum;
    if (schemaPart.ff_enumExten) fData.enumExten = schemaPart.ff_enumExten;
    if (schemaPart[__$_50__] ) fData.oneOfSelector = true;
    if (isSchemaSelfManaged(schemaPart, type)) result[__$_13__]  = value;else delete result[__$_13__] ;
    var untouched = 1;
    if (type == 'array') {
        result[__$_0__]  = commonLib_1[__$_3__] (value, 'length') || 0;
        if (!commonLib_2[__$_1__] (schemaPart[__$_34__] ) && result[__$_0__]  < schemaPart[__$_34__] ) result[__$_0__]  = schemaPart[__$_34__] ;
        result[__$_36__] .canAdd = isArrayCanAdd(schemaPart, result[__$_0__] );
        untouched = result[__$_0__] ;
    } else if (type == 'object') untouched = commonLib_1[__$_5__] (schemaPart[__$_27__]  || {})[__$_0__] ;
    if (untouched != 1) result.status = Object[__$_25__] ({}, result.status, { untouched: untouched });
    return result;
});
function getUniqKey() {
    return Date.now()[__$_47__] (36) + Math.random()[__$_47__] (36);
}
function makeStateBranch(schema, getNSetOneOf) {
    var path = arguments[__$_0__]  > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var value = arguments[3];

    var result = {};
    var dataMapObjects = [];
    var defaultValues = void 0;
    var currentOneOf = (getNSetOneOf(path) || {})[__$_19__] ;
    var schemaPartsOneOf = getSchemaPart(schema, path, getNSetOneOf, true);

    var _findOneOf = findOneOf(schemaPartsOneOf, value, currentOneOf),
        schemaPart = _findOneOf[__$_49__] ,
        oneOf = _findOneOf[__$_19__] ,
        type = _findOneOf.type;

    if (!commonLib_2[__$_1__] (currentOneOf) && currentOneOf != oneOf) {
        
        console.info('Passed value is not supported by schema.type in path "' + path.join('/') + '" and oneOfIndex "' + currentOneOf + '". Reset value to default.\n');
        value = schemaPartsOneOf[currentOneOf][__$_26__] ; 
        var tmp = findOneOf(schemaPartsOneOf, value, currentOneOf);
        schemaPart = tmp[__$_49__] ;
        oneOf = tmp[__$_19__] ;
        type = tmp.type;
    }
    commonLib_1[__$_4__] (dataMapObjects, normalizeDataMap(schemaPart.ff_dataMap || [], path));
    result[SymData] = makeDataStorage(schemaPart, oneOf, type, value);
    getNSetOneOf(path, { oneOf: oneOf, type: type });
    if (result[SymData][__$_32__] ('value')) defaultValues = result[SymData][__$_13__] ;else {
        if (type == 'array') {
            defaultValues = [];
            defaultValues[__$_0__]  = result[SymData][__$_0__] ;
            for (var i = 0; i < defaultValues[__$_0__] ; i++) {
                var _makeStateBranch = makeStateBranch(schema, getNSetOneOf, path[__$_6__] (i), commonLib_1[__$_3__] (commonLib_2[__$_1__] (value) ? schemaPart[__$_26__]  : value, i)),
                    branch = _makeStateBranch.state,
                    dataMap = _makeStateBranch[__$_43__] ,
                    dValue = _makeStateBranch[__$_20__] ;

                defaultValues[i] = dValue;
                commonLib_1[__$_4__] (dataMapObjects, dataMap);
                branch = commonLib_1[__$_16__] (branch, _defineProperty({}, SymData, { arrayItem: getArrayItemData(schemaPart, i, defaultValues[__$_0__] ) }), { replace: _defineProperty({}, SymData, { ArrayItem: true }) });
                branch = commonLib_1[__$_16__] (branch, _defineProperty({}, SymData, { params: { uniqKey: getUniqKey() } }));
                result[i] = branch;
            }
        } else if (type == 'object') {
            defaultValues = {};
            var arrayOfRequired = result[SymData][__$_36__] .required;
            arrayOfRequired = commonLib_2[__$_10__] (arrayOfRequired) && arrayOfRequired[__$_0__]  && arrayOfRequired;
            commonLib_1[__$_5__] (schemaPart[__$_27__]  || {})[__$_2__] (function (field) {
                var _makeStateBranch2 = makeStateBranch(schema, getNSetOneOf, path[__$_6__] (field), commonLib_1[__$_3__] (commonLib_2[__$_1__] (value) ? schemaPart[__$_26__]  : value, field)),
                    branch = _makeStateBranch2.state,
                    dataMap = _makeStateBranch2[__$_43__] ,
                    dValue = _makeStateBranch2[__$_20__] ;

                defaultValues[field] = dValue;
                commonLib_1[__$_4__] (dataMapObjects, dataMap);
                if (arrayOfRequired && ~arrayOfRequired[__$_23__] (field)) branch = commonLib_1[__$_16__] (branch, _defineProperty({}, SymData, { fData: { required: true } }));
                result[field] = branch;
            });
        }
        if (value) defaultValues = commonLib_1[__$_16__] (value, defaultValues, { replace: trueIfLength(1) });
    }
    return { state: result, defaultValues: defaultValues, dataMap: dataMapObjects };
}
function isArrayCanAdd(schemaPart, length) {
    var arrayStartIndex = arrayStart(schemaPart); 
    var minItems = schemaPart[__$_34__]  || 0;
    return (schemaPart[__$_8__]  !== false || length < arrayStartIndex) && length < (schemaPart.maxItems || Infinity);
}
function getArrayItemData(schemaPart, index, length) {
    var result = {};
    var arrayStartIndex = arrayStart(schemaPart); 
    var minItems = schemaPart[__$_34__]  || 0;
    
    result.canUp = arrayStartIndex < index;
    result.canDown = arrayStartIndex <= index && index < length - 1;
    
    
    result.canDel = index >= Math.min(arrayStartIndex, length - 1);
    return result;
}
function isSelfManaged(state) {
    for (var _len = arguments[__$_0__] , pathes = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        pathes[_key - 1] = arguments[_key];
    }

    return commonLib_1[__$_41__] .apply(commonLib_1, [state][__$_6__] (pathes, [SymData, 'value']));
}
exports.isSelfManaged = isSelfManaged;
function isSchemaSelfManaged(schemaPart, type) {
    return type !== 'array' && type !== 'object' || commonLib_1[__$_3__] (schemaPart, 'ff_managed');
}
function findOneOf(oneOfShemas, value, currentOneOf) {
    if (!commonLib_2[__$_10__] (oneOfShemas)) oneOfShemas = [oneOfShemas];
    var oneOfKeys = oneOfShemas.map(function (v, i) {
        return i;
    });
    if (currentOneOf) commonLib_1[__$_22__] (oneOfKeys, currentOneOf, 0); 
    for (var k = 0; k < oneOfKeys[__$_0__] ; k++) {
        var oneOf = oneOfKeys[k];
        var schemaTypes = oneOfShemas[oneOf].type || types;
        if (!commonLib_2[__$_10__] (schemaTypes)) schemaTypes = [schemaTypes];
        var defaultUsed = void 0;
        var checkValue = commonLib_2[__$_1__] (value) ? (defaultUsed = true) && oneOfShemas[oneOf][__$_26__]  : value;
        for (var j = 0; j < schemaTypes[__$_0__] ; j++) {
            if (types[schemaTypes[j]](checkValue) || commonLib_2[__$_1__] (checkValue)) return { schemaPart: oneOfShemas[oneOf], oneOf: oneOf, type: schemaTypes[j] };
        }if (defaultUsed && !commonLib_2[__$_1__] (oneOfShemas[oneOf][__$_26__] )) throw new Error('Type of schema.default is not supported by schema.type');
    }
    return {};
}



function updateMessagesPROC(state, UPDATABLE, track, result) {
    var defaultGroup = arguments[__$_0__]  > 4 && arguments[4] !== undefined ? arguments[4] : 0;

    function conv(item) {
        return (typeof item === "undefined" ? "undefined" : _typeof(item)) === 'object' ? item : { group: defaultGroup, text: item };
    }
    ;
    var messages = commonLib_2[__$_10__] (result) ? result.map(conv) : [conv(result)];
    messages[__$_2__] (function (item) {
        var path = item[__$_15__] ,
            itemNoPath = __rest(item, [__$_15__] );
        if (path) {
            path = normalizePath(path, track);
            return updateMessagesPROC(state, UPDATABLE, path, itemNoPath, defaultGroup);
        } else {
            var _itemNoPath$group = itemNoPath.group,
                group = _itemNoPath$group === undefined ? defaultGroup : _itemNoPath$group,
                text = itemNoPath.text,
                _itemNoPath$priority = itemNoPath.priority,
                priority = _itemNoPath$priority === undefined ? 0 : _itemNoPath$priority,
                rest = __rest(itemNoPath, ["group", "text", "priority"]);

            var messageData = commonLib_1.getCreateIn(UPDATABLE[__$_11__] , {}, track, SymData, 'messages', priority);
            Object[__$_25__] (messageData, rest);
            if (!commonLib_2[__$_14__] (messageData[__$_28__] )) messageData[__$_28__]  = {};
            if (!commonLib_2[__$_10__] (messageData[__$_28__] [group])) messageData[__$_28__] [group] = [];
            if (text) commonLib_1[__$_4__] (messageData[__$_28__] [group], text);
        }
    });
    return state;
}
function setValidStatusPROC(state, UPDATABLE) {
    var track = arguments[__$_0__]  > 2 && arguments[2] !== undefined ? arguments[2] : [];

    var schemaPart = void 0;
    try {
        schemaPart = getSchemaPart(UPDATABLE.api.schema, track, oneOfFromState(state));
    } catch (e) {
        return state;
    }
    var selfManaged = isSelfManaged(state, track);
    var priorities = commonLib_1[__$_5__] (Object[__$_25__] ({}, commonLib_1[__$_3__] (state, track, SymData, 'messages') || {}, commonLib_1[__$_3__] (UPDATABLE[__$_11__] , track, SymData, 'messages') || {}));
    var currentPriority = void 0;
    for (var i = 0; i < priorities[__$_0__] ; i++) {
        var groups = commonLib_1[__$_5__] (Object[__$_25__] ({}, commonLib_1[__$_3__] (state, track, SymData, 'messages', priorities[i]) || {}, commonLib_1[__$_3__] (UPDATABLE[__$_11__] , track, SymData, 'messages', priorities[i]) || {}));
        for (var j = 0; j < groups[__$_0__] ; j++) {
            if (commonLib_1[__$_3__] (groups, groups[j], 'length')) {
                currentPriority = parseInt(priorities[i]);
                break;
            }
        }
        if (!commonLib_2[__$_1__] (currentPriority)) break;
    }
    state = updatePROC(state, UPDATABLE, makeNUpdate(track, ['status', 'validation', 'invalid'], currentPriority === 0 ? 1 : 0, true, { macros: 'setStatus' }));
    state = updatePROC(state, UPDATABLE, makeNUpdate(track, ['status', 'priority'], currentPriority));
    if (!selfManaged) commonLib_1[__$_5__] (commonLib_1[__$_3__] (UPDATABLE[__$_11__] , track))[__$_2__] (function (key) {
        return state = setValidStatusPROC(state, UPDATABLE, track[__$_6__] (key));
    });
    return state;
}
function makeValidation(state, dispatch, action) {
    function recurseValidationInnerPROCEDURE(state, validatedValue, modifiedValues) {
        var track = arguments[__$_0__]  > 3 && arguments[3] !== undefined ? arguments[3] : [];

        var schemaPart = void 0;
        try {
            schemaPart = getSchemaPart(schema, track, oneOfFromState(state));
        } catch (e) {
            return state;
        }
        var selfManaged = isSelfManaged(state, track);
        if (!selfManaged) modifiedValues && commonLib_1[__$_5__] (modifiedValues)[__$_2__] (function (key) {
            return state = recurseValidationInnerPROCEDURE(state, validatedValue[key], modifiedValues[key], track[__$_6__] (key));
        });
        var ff_validators = schemaPart.ff_validators;
        if (ff_validators) {
            var field = makeSynthField(UPDATABLE.api, path2string(track));
            ff_validators[__$_2__] (function (validator) {
                var updates = [];
                field[__$_30__]  = updates;
                var result = processFn.call(field, validator, validatedValue);
                if (result && result.then && typeof result.then === 'function') {
                    
                    result[__$_31__]  = validatedValue;
                    result[__$_15__]  = track;
                    result[__$_46__]  = selfManaged;
                    vPromises.push(result);
                    state = updatePROC(state, UPDATABLE, makeNUpdate(track, ['status', 'validation', 'pending'], 1, true, { macros: 'setStatus' }));
                } else state = updateMessagesPROC(state, UPDATABLE, track, result, 1);
                if (updates[__$_0__] ) updates[__$_2__] (function (update) {
                    return state = updatePROC(state, UPDATABLE, update);
                });
                field[__$_30__]  = null;
            });
        }
        return state;
    }
    function clearDefaultMessagesInnerPROCEDURE(state, modifiedValues) {
        var track = arguments[__$_0__]  > 2 && arguments[2] !== undefined ? arguments[2] : [];

        var type = commonLib_1[__$_3__] (state, track, SymData, 'fData', 'type');
        if (!type) return state;
        if (type == 'object' || type == 'array') modifiedValues && commonLib_1[__$_5__] (modifiedValues)[__$_2__] (function (key) {
            return clearDefaultMessagesInnerPROCEDURE(state, modifiedValues[key], track[__$_6__] (key));
        });
        return updateMessagesPROC(state, UPDATABLE, track); 
    }
    var api = action.api,
        force = action.force,
        opts = action.opts,
        promises = action.promises;

    var schemaDataObj = api.schema[SymData];
    var JSONValidator = api.JSONValidator,
        schema = api.schema,
        getState = api.getState,
        UPDATABLE = api[__$_42__] ;

    var currentValues = state[SymData][__$_12__] ;
    var pendingStatus = {};
    var vPromises = [];
    var modifiedValues = force === true ? currentValues : force;
    
    if (!modifiedValues || commonLib_1[__$_5__] (modifiedValues)[__$_0__]  == 0) {
        
        promises.resolve();
        promises.vAsync.resolve();
        return state;
    }
    if (JSONValidator) {
        state = clearDefaultMessagesInnerPROCEDURE(state, modifiedValues);
        var errs = JSONValidator(currentValues); 
        errs[__$_2__] (function (item) {
            return updateMessagesPROC(state, UPDATABLE, item[0], item[1]);
        });
    }
    state = recurseValidationInnerPROCEDURE(state, currentValues, modifiedValues);
    state = setValidStatusPROC(state, UPDATABLE);
    state = mergeUPD_PROC(state, UPDATABLE);
    promises.resolve();
    if (vPromises[__$_0__] ) {
        Promise.all(vPromises).then(function (results) {
            var state = getState();
            var UPDATABLE = api[__$_42__] ;
            var newValues = state[SymData][__$_12__] ; 
            for (var i = 0; i < vPromises[__$_0__] ; i++) {
                
                var _vPromises$i = vPromises[i],
                    validatedValue = _vPromises$i[__$_31__] ,
                    path = _vPromises$i[__$_15__] ,
                    selfManaged = _vPromises$i[__$_46__] ;

                if (validatedValue == commonLib_1[__$_3__] (newValues, path)) {
                    state = updateMessagesPROC(state, UPDATABLE, path, results[i] || '', 2);
                    state = updatePROC(state, UPDATABLE, makeNUpdate(path, ['status', 'validation', 'pending'], 0, false, { macros: 'setStatus' }));
                    
                }
            }
            state = setValidStatusPROC(state, UPDATABLE);
            state = mergeUPD_PROC(state, UPDATABLE); 
            dispatch({ type: api_1[__$_48__] , state: state, api: api });
            promises.vAsync.resolve();
        }).catch(function (reason) {
            var state = getState();
            var UPDATABLE = api[__$_42__] ; 
            var newValues = state[SymData][__$_12__] ; 
            for (var i = 0; i < vPromises[__$_0__] ; i++) {
                var _vPromises$i2 = vPromises[i],
                    validatedValue = _vPromises$i2[__$_31__] ,
                    path = _vPromises$i2[__$_15__] ,
                    selfManaged = _vPromises$i2[__$_46__] ;

                if (validatedValue == commonLib_1[__$_3__] (newValues, path)) {
                    state = updatePROC(state, UPDATABLE, makeNUpdate(path, ['status', 'validation', 'pending'], 0, false, { macros: 'setStatus' }));
                }
            }
            state = setValidStatusPROC(state, UPDATABLE);
            state = mergeUPD_PROC(state, UPDATABLE);
            dispatch({ type: api_1[__$_48__] , state: state, api: api });
            promises.vAsync.reject(reason);
        });
    } else promises.vAsync.resolve();
    return state;
}
function setDirtyPROC(state, UPDATABLE, inital, current) {
    var track = arguments[__$_0__]  > 4 && arguments[4] !== undefined ? arguments[4] : [];

    if (current === inital) return state;
    var schema = UPDATABLE.api.schema;

    var schemaPart = void 0;
    try {
        schemaPart = getSchemaPart(schema, track, oneOfFromState(state));
    } catch (e) {}
    if (!schemaPart || isSelfManaged(state, track)) {
        
        var path = schemaPart ? track : track[__$_17__] (0, -1);
        state = updatePROC(state, UPDATABLE, makeNUpdate(path, ['status', 'dirty'], 1, false, { macros: 'setStatus' }));
    } else {
        var keys = commonLib_1[__$_5__] (Object[__$_25__] ({}, inital, current));
        keys[__$_2__] (function (key) {
            return state = setDirtyPROC(state, UPDATABLE, commonLib_1[__$_3__] (inital, key), commonLib_1[__$_3__] (current, key), track[__$_6__] (key));
        });
    }
    return state;
}
function updateDirtyPROC(state, UPDATABLE, inital, currentChanges) {
    var track = arguments[__$_0__]  > 4 && arguments[4] !== undefined ? arguments[4] : [];
    var forceDirty = arguments[__$_0__]  > 5 && arguments[5] !== undefined ? arguments[5] : false;
    var schema = UPDATABLE.api.schema;

    var schemaPart = void 0;
    try {
        schemaPart = getSchemaPart(schema, track, oneOfFromState(state));
    } catch (e) {}
    if (!schemaPart || isSelfManaged(state, track)) {
        
        var current = commonLib_1[__$_3__] (state, SymData, 'current', track);
        var value = forceDirty || current !== inital ? 1 : -1;
        var path = schemaPart ? track : track[__$_17__] (0, -1);
        state = updatePROC(state, UPDATABLE, makeNUpdate(path, ['status', 'dirty'], value, false, { macros: 'setStatus' }));
    } else {
        var keys = commonLib_1[__$_5__] (currentChanges || {});
        if (schemaPart.type == 'array') {
            var existKeys = branchKeys(commonLib_1[__$_3__] (state, track));
            keys = keys.filter(function (k) {
                return isNaN(parseInt(k)) || ~existKeys[__$_23__] (k);
            });
        }
        
        forceDirty = forceDirty || !commonLib_2[__$_7__] (inital);
        keys[__$_2__] (function (key) {
            return state = updateDirtyPROC(state, UPDATABLE, commonLib_1[__$_3__] (inital, key), currentChanges[key], track[__$_6__] (key), forceDirty);
        });
    }
    return state;
}
function setPristinePROC(state, UPDATABLE, inital) {
    var track = arguments[__$_0__]  > 3 && arguments[3] !== undefined ? arguments[3] : [];

    if (commonLib_1[__$_3__] (UPDATABLE[__$_11__] , track, SymData, 'status', 'pristine')) {
        if (commonLib_2[__$_7__] (inital) && commonLib_1[__$_3__] (state, SymData, 'current', track) !== inital) {
            commonLib_1[__$_21__] (UPDATABLE[__$_11__] , inital, SymData, 'current', track);
            commonLib_1[__$_21__] (UPDATABLE[__$_9__] , true, SymData, 'current', track);
        }
    } else {
        commonLib_1[__$_5__] (commonLib_1[__$_3__] (UPDATABLE[__$_11__] , track))[__$_2__] (function (key) {
            return setPristinePROC(state, UPDATABLE, commonLib_1[__$_3__] (inital, key), track[__$_6__] (key));
        });
    }
    return state;
}
function updateState(dispatch) {
    
    var updates = this[__$_30__] ,
        state = this.state,
        api = this.api,
        forceValidation = this.forceValidation,
        opts = this.opts,
        promises = this.promises;
    var getState = api.getState,
        schema = api.schema,
        UPDATABLE = api[__$_42__] ;

    if (!state) state = getState();
    var prevState = state;
    updates[__$_2__] (function (update) {
        return state = updatePROC(state, UPDATABLE, update);
    });
    state = mergeUPD_PROC(state, UPDATABLE);
    var oldCurrent = commonLib_1[__$_3__] (prevState, SymData, 'current');
    if (UPDATABLE.forceCheck) oldCurrent = commonLib_1[__$_16__] (oldCurrent, UPDATABLE.forceCheck);
    var currentChanges = commonLib_1.mergeState(oldCurrent, commonLib_1[__$_3__] (state, SymData, 'current'), { diff: true }).changes;
    if (prevState[SymData][__$_39__]  !== state[SymData][__$_39__] ) {
        
        state = updatePROC(state, UPDATABLE, makeNUpdate([], ['status', 'dirty'], 0, false, { macros: 'switch' })); 
        state = setDirtyPROC(state, UPDATABLE, state[SymData][__$_39__] , state[SymData][__$_12__] );
    } else if (currentChanges) state = updateDirtyPROC(state, UPDATABLE, state[SymData][__$_39__] , currentChanges); 
    state = setPristinePROC(state, UPDATABLE, state[SymData][__$_39__] );
    state = mergeUPD_PROC(state, UPDATABLE);
    var force = void 0;
    if (opts.noValidation) force = forceValidation;else {
        if (forceValidation) {
            object2PathValues(currentChanges)[__$_2__] (function (path) {
                path.pop();
                setIfNotDeeper(forceValidation, true, path);
            });
            force = forceValidation;
        } else force = commonLib_2[__$_7__] (currentChanges) ? currentChanges : !commonLib_2[__$_1__] (currentChanges);
    }
    if (force) state = makeValidation(state, dispatch, { force: force, api: api, opts: opts, promises: promises });
    dispatch({ type: api_1[__$_48__] , state: state, api: api });
    return promises;
}
exports.updateState = updateState;
var makeStateFromSchema = commonLib_1[__$_35__] (function (schema) {
    return makeStateBranch(schema, oneOfStructure({}, []));
});
function initState(UPDATABLE) {
    var _makeStateFromSchema = makeStateFromSchema(UPDATABLE.api.schema),
        state = _makeStateFromSchema.state,
        _makeStateFromSchema$ = _makeStateFromSchema[__$_43__] ,
        dataMap = _makeStateFromSchema$ === undefined ? [] : _makeStateFromSchema$,
        defaultValues = _makeStateFromSchema[__$_20__] ;

    state = commonLib_1[__$_16__] (state, commonLib_1[__$_21__] ({}, defaultValues, [SymData, 'current']));
    state = setDataMapInState(state, UPDATABLE, dataMap);
    var current = commonLib_1[__$_3__] (state, SymData, 'current');
    state = updatePROC(state, UPDATABLE, makeNUpdate([], [__$_39__] , current));
    state = updatePROC(state, UPDATABLE, makeNUpdate([], [__$_26__] , current));
    state = mergeUPD_PROC(state, UPDATABLE);
    return state;
}
exports.initState = initState;



function updateCurrentPROC(state, UPDATABLE, value, replace) {
    var track = arguments[__$_0__]  > 4 && arguments[4] !== undefined ? arguments[4] : [];
    var setOneOf = arguments[5];

    if (value === SymReset) value = commonLib_1[__$_3__] (state, SymData, 'inital', track);
    if (value === SymClear) value = commonLib_1[__$_3__] (state, SymData, 'default', track);
    if (commonLib_1[__$_3__] (state, SymData, 'current', track) === value && !commonLib_1[__$_41__] (UPDATABLE[__$_11__] , SymData, 'current', track)) return state;
    var branch = commonLib_1[__$_3__] (state, track);
    
    if (!branch) {
        if (track[track[__$_0__]  - 1] == 'length') {
            
            var topPath = track[__$_17__] (0, -1);
            var topBranch = commonLib_1[__$_3__] (state, topPath);
            if (topBranch[SymData][__$_36__] .type == 'array') return updatePROC(state, UPDATABLE, makeNUpdate(topPath, [__$_0__] , value));
        }
        return updatePROC(state, UPDATABLE, makeNUpdate([], [__$_12__] [__$_6__] (track), value, replace));
    }
    if (branch[SymData][__$_36__] .oneOfSelector) {
        var field = makeSynthField(UPDATABLE.api, path2string(track));
    }
    var oneOfSelector = branch[SymData][__$_36__] .oneOfSelector;
    var type = branch[SymData][__$_36__] .type;
    if (commonLib_2[__$_1__] (value)) value = types.empty[type || 'any'];
    if (oneOfSelector || !types[type || 'any'](value)) {
        
        
        var parts = getSchemaPart(UPDATABLE.api.schema, track, oneOfFromState(state), true);
        var currentOneOf = branch[SymData][__$_19__] ;
        if (oneOfSelector) {
            var _field = makeSynthField(UPDATABLE.api, path2string(track));
            var ff_oneOfSelector = parts[currentOneOf][__$_50__] ;
            setOneOf = processFn.call(_field, ff_oneOfSelector, value);
        }

        var _findOneOf2 = findOneOf(parts, value, commonLib_2[__$_1__] (setOneOf) ? currentOneOf : setOneOf),
            schemaPart = _findOneOf2[__$_49__] ,
            oneOf = _findOneOf2[__$_19__] ,
            _type2 = _findOneOf2.type;

        if (currentOneOf !== oneOf) {
            if (schemaPart) {
                return updatePROC(state, UPDATABLE, makeNUpdate(track, [__$_19__] , oneOf, false, { type: _type2, setValue: value }));
            } else console.warn('Type not found in path [' + track.join('/') + ']');
        }
    }
    if (isSelfManaged(branch)) {
        
        state = updatePROC(state, UPDATABLE, makeNUpdate(track, [__$_13__] , value, replace));
    } else {
        if (commonLib_2[__$_7__] (value)) {
            
            if (type == 'array' && !commonLib_2[__$_1__] (value[__$_0__] )) state = updatePROC(state, UPDATABLE, makeNUpdate(track, [__$_0__] , value[__$_0__] ));
            if (replace === true) {
                
                var v = commonLib_2[__$_10__] (value) ? [] : {};
                branchKeys(branch)[__$_2__] (function (k) {
                    return v[k] = undefined;
                });
                value = Object[__$_25__] (v, value);
            }
            commonLib_1[__$_5__] (value)[__$_2__] (function (key) {
                return state = updateCurrentPROC(state, UPDATABLE, value[key], replace === true ? true : commonLib_1[__$_3__] (replace, key), track[__$_6__] (key));
            });
            if (replace === true) {
                
                state = mergeUPD_PROC(state, UPDATABLE);
                var current = commonLib_1[__$_3__] (state, SymData, 'current', track);
                branchKeys(branch)[__$_2__] (function (k) {
                    return value[k] = current[k];
                }); 
                state = updatePROC(state, UPDATABLE, makeNUpdate([], [__$_12__] .concat(track), value, replace));
            }
        }
    }
    return state;
}
function splitValuePROC(state, UPDATABLE, item) {
    var itemValue = item[__$_13__] ,
        path = item[__$_15__] ,
        replace = item[__$_9__] ;

    var keyPath = item[SymData] || [];
    if (keyPath[__$_0__]  == 0) {
        var value = itemValue[__$_13__] ,
            status = itemValue.status,
            length = itemValue[__$_0__] ,
            oneOf = itemValue[__$_19__] ,
            rest = __rest(itemValue, ["value", "status", "length", "oneOf"]);

        ['value', 'status', 'length', 'oneOf'][__$_2__] (function (key) {
            if (commonLib_1[__$_41__] (itemValue, key)) state = updatePROC(state, UPDATABLE, makeNUpdate(path, [key], itemValue[key], commonLib_1[__$_3__] (replace, key)));
        });
        if (commonLib_1[__$_5__] (rest)[__$_0__] ) state = updatePROC(state, UPDATABLE, makeNUpdate(path, keyPath, rest, replace));
    } else {
        commonLib_1[__$_5__] (itemValue)[__$_2__] (function (key) {
            state = updatePROC(state, UPDATABLE, makeNUpdate(path, keyPath[__$_6__] (key), itemValue[key], commonLib_1[__$_3__] (replace, key)));
        });
    }
    return state;
}
function updateNormalizationPROC(state, UPDATABLE, item) {
    var items = normalizeUpdate(item, state);
    items[__$_2__] (function (i) {
        if (i[__$_15__] .length === 0 && i[SymData][0] == 'current') {
            i[__$_29__]  = 'setCurrent';
            i[__$_15__]  = i[SymData][__$_17__] (1);
            i[SymData] = [];
        }
        if (i[SymData][0] == 'value') {
            i[__$_29__]  = 'setCurrent';
            i[__$_15__]  = i[__$_15__] .concat(i[SymData][__$_17__] (1));
            i[SymData] = [];
        } else if (i[SymData][0] == 'status') {
            console.warn('Status should not be changed through StateApi. Update ignored.');
            return;
        } else if (i[SymData][0] == 'oneOf') {
            i[__$_29__]  = 'setOneOf';
        }
        state = updatePROC(state, UPDATABLE, i);
    });
    return state;
}
function setUPDATABLE(UPDATABLE, update, replace) {
    for (var _len2 = arguments[__$_0__] , pathes = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
        pathes[_key2 - 3] = arguments[_key2];
    }

    object2PathValues(replace)[__$_2__] (function (path) {
        var replaceValue = path.pop();
        commonLib_1[__$_21__] .apply(commonLib_1, [UPDATABLE, commonLib_1[__$_3__] (update, path), 'update'][__$_6__] (pathes, [path]));
        if (replaceValue) commonLib_1[__$_21__] .apply(commonLib_1, [UPDATABLE, replaceValue, 'replace'][__$_6__] (pathes, [path]));
    });
    return UPDATABLE;
}
exports.setUPDATABLE = setUPDATABLE;
function mergeUPD_PROC(state, UPDATABLE) {
    state = commonLib_1[__$_16__] (state, UPDATABLE[__$_11__] , { replace: UPDATABLE[__$_9__]  });
    UPDATABLE[__$_11__]  = {};
    UPDATABLE[__$_9__]  = {};
    return state;
}
exports.mergeUPD_PROC = mergeUPD_PROC;
function updatePROC(state, UPDATABLE, item) {
    if (!item) return state;
    var update = UPDATABLE[__$_11__] ,
        replace_UPDATABLE = UPDATABLE[__$_9__] ,
        api = UPDATABLE.api;
    var schema = api.schema;
    

    if (!isNUpdate(item)) return updateNormalizationPROC(state, UPDATABLE, item);
    
    if (item[__$_29__] ) {
        var macro = Macros[item[__$_29__] ];
        if (!macro) throw new Error('"' + macro + '" not found in macros');
        return macro(state, schema, UPDATABLE, item);
    }
    var value = item[__$_13__] ,
        path = item[__$_15__] ,
        replace = item[__$_9__] ;

    var keyPath = item[SymData];
    if (commonLib_2[__$_33__] (value)) value = value(getUpdValue([UPDATABLE[__$_11__] , state], path, SymData, keyPath));
    if (path[__$_0__]  == 0 && (keyPath[0] == 'inital' || keyPath[0] == 'default')) {
        state = commonLib_1[__$_16__] (state, commonLib_1[__$_18__] (SymData, keyPath, value), { replace: commonLib_1[__$_18__] (SymData, keyPath, replace) });
    } else {
        
        if (commonLib_2[__$_14__] (value) && (keyPath[__$_0__]  == 0 && (commonLib_1[__$_41__] (value, 'value') || commonLib_1[__$_41__] (value, 'status') || commonLib_1[__$_41__] (value, 'length') || commonLib_1[__$_41__] (value, 'oneOf')) || keyPath[__$_0__]  == 1 && keyPath[0] == 'status')) return splitValuePROC(state, UPDATABLE, item);
        var branch = commonLib_1[__$_3__] (state, path);
        if (!commonLib_2[__$_14__] (branch)) return state; 
        if (keyPath[0] == 'value' && !commonLib_1[__$_41__] (branch, SymData, 'value')) 
            return Macros.setCurrent(state, schema, UPDATABLE, { value: value, replace: replace, path: path[__$_6__] (keyPath[__$_17__] (1)) });
        
        setUPDATABLE(UPDATABLE, value, replace, path, SymData, keyPath);
        
        
        
        if (keyPath[0] == 'value') {
            
            state = updatePROC(state, UPDATABLE, makeNUpdate([], commonLib_1[__$_4__] ([__$_12__] , path, keyPath[__$_17__] (1)), value, replace));
        } else if (keyPath[0] == 'length') {
            
            state = updatePROC(state, UPDATABLE, makeNUpdate([], commonLib_1[__$_4__] ([__$_12__] , path, keyPath), value, replace));
            var start = branch[SymData][__$_0__] ;
            start = Math.max(start, 0);
            var end = Math.max(value || 0);
            var oneOfStateFn = oneOfStructure(state, path);
            var maps2enable = [];
            var maps2disable = [];
            for (var i = start; i < end; i++) {
                var elemPath = path[__$_6__] (i);
                if (item[__$_37__] ) oneOfStateFn(elemPath, { oneOf: item[__$_37__]  });

                var _makeStateBranch3 = makeStateBranch(schema, oneOfStateFn, elemPath),
                    _branch = _makeStateBranch3.state,
                    _makeStateBranch3$dat = _makeStateBranch3[__$_43__] ,
                    _dataMap = _makeStateBranch3$dat === undefined ? [] : _makeStateBranch3$dat,
                    defaultValues = _makeStateBranch3[__$_20__] ;

                var untouched = getUpdValue([state, UPDATABLE[__$_11__] ], path, SymData, 'status', 'untouched');
                var mergeBranch = _defineProperty({}, SymData, { params: { uniqKey: getUniqKey() } });
                if (!untouched) commonLib_1[__$_21__] (mergeBranch[SymData], { untouched: 0, touched: true }, 'status');
                _branch = commonLib_1[__$_16__] (_branch, mergeBranch);
                state = commonLib_1[__$_16__] (state, commonLib_1[__$_21__] ({}, _branch, elemPath), { replace: commonLib_1[__$_21__] ({}, true, elemPath) });
                state = updatePROC(state, UPDATABLE, makeNUpdate([], commonLib_1[__$_4__] ([__$_12__] , elemPath), defaultValues, true));
                commonLib_1[__$_4__] (maps2enable, _dataMap);
                if (untouched) state = Macros[__$_24__] (state, schema, UPDATABLE, makeNUpdate(path, ['status', 'untouched'], 1));
            }
            for (var _i = end; _i < start; _i++) {
                var _elemPath = path[__$_6__] (_i);
                commonLib_1[__$_4__] (maps2disable, commonLib_1[__$_3__] (state, _elemPath, SymDataMapTree, SymData) || []);
                ['invalid', 'dirty', 'untouched', 'pending'][__$_2__] (function (key) {
                    var statusValue = getUpdValue([update, state], path, SymData, 'status', key);
                    if (statusValue) state = Macros[__$_24__] (state, schema, UPDATABLE, makeNUpdate(path, ['status', key], -1));
                });
                setUPDATABLE(UPDATABLE, SymDelete, true, _elemPath);
                
                
            }
            var schemaPart = getSchemaPart(schema, path, oneOfFromState(state));
            commonLib_1[__$_21__] (update, isArrayCanAdd(schemaPart, end), path, SymData, 'fData', 'canAdd');
            for (var _i2 = Math.max(Math.min(start, end) - 1, 0); _i2 < end; _i2++) {
                setUPDATABLE(UPDATABLE, getArrayItemData(schemaPart, _i2, end), true, path, _i2, SymData, 'arrayItem');
            }state = mergeUPD_PROC(state, UPDATABLE);
            state = setDataMapInState(state, UPDATABLE, maps2disable, true);
            state = setDataMapInState(state, UPDATABLE, maps2enable);
        } else if (keyPath[0] == 'status') {
            
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
            if (!commonLib_2[__$_1__] (newKey)) commonLib_1[__$_21__] (update, _value, path, SymData, 'status', newKey);
        } else if (keyPath[0] == 'oneOf') {
            var oldBranch = commonLib_1[__$_3__] (state, path);
            var oldOneOf = commonLib_1[__$_3__] (oldBranch, SymData, 'oneOf') || 0;
            var newOneOf = commonLib_1[__$_3__] (UPDATABLE[__$_11__] , path, SymData, 'oneOf');
            if (oldOneOf != newOneOf || item.type && item.type != commonLib_1[__$_3__] (oldBranch, SymData, 'fData', 'type')) {
                setIfNotDeeper(UPDATABLE, SymReset, 'forceCheck', item[__$_15__] );
                state = mergeUPD_PROC(state, UPDATABLE);
                state = setDataMapInState(state, UPDATABLE, commonLib_1[__$_3__] (state, path, SymDataMapTree, SymData) || [], true);

                var _makeStateBranch4 = makeStateBranch(schema, oneOfStructure(state, path), path, item[__$_38__] ),
                    _branch2 = _makeStateBranch4.state,
                    _makeStateBranch4$dat = _makeStateBranch4[__$_43__] ,
                    _maps2enable = _makeStateBranch4$dat === undefined ? [] : _makeStateBranch4$dat,
                    defaultValues = _makeStateBranch4[__$_20__] ;

                var _a = oldBranch[SymData],
                    v1 = _a[__$_13__] ,
                    v2 = _a[__$_0__] ,
                    v3 = _a[__$_19__] ,
                    v4 = _a[__$_36__] ,
                    previousBranchData = __rest(_a, ["value", "length", "oneOf", "fData"]); 
                if (!isSelfManaged(oldBranch) || !isSelfManaged(_branch2)) delete previousBranchData.status; 
                _branch2 = commonLib_1[__$_16__] (_branch2, _defineProperty({}, SymData, previousBranchData), { arrays: 'replace' });
                if (path[__$_0__] ) {
                    var topPath = path[__$_17__] ();
                    var field = topPath.pop();
                    ['invalid', 'dirty', 'pending'][__$_2__] (function (key) {
                        var oldStatusValue = commonLib_1[__$_3__] (oldBranch, SymData, 'status', key);
                        var newStatusValue = commonLib_1[__$_3__] (_branch2, SymData, 'status', key);
                        if (!oldStatusValue != !newStatusValue) state = Macros[__$_24__] (state, schema, UPDATABLE, makeNUpdate(topPath, ['status', key], newStatusValue ? 1 : -1));
                    });
                    var arrayOfRequired = commonLib_1[__$_3__] (state, topPath, SymData, 'fData', 'required');
                    arrayOfRequired = commonLib_2[__$_10__] (arrayOfRequired) && arrayOfRequired[__$_0__]  && arrayOfRequired;
                    if (arrayOfRequired && ~arrayOfRequired[__$_23__] (field)) _branch2 = commonLib_1[__$_16__] (_branch2, _defineProperty({}, SymData, { fData: { required: true } }));
                }
                if (commonLib_1[__$_3__] (oldBranch, SymData, 'status', 'untouched') == 0) _branch2 = commonLib_1[__$_16__] (_branch2, _defineProperty({}, SymData, { status: { untouched: 0 } })); 
                state = commonLib_1[__$_16__] (state, commonLib_1[__$_21__] ({}, _branch2, path), { replace: commonLib_1[__$_21__] ({}, true, path) });
                state = updatePROC(state, UPDATABLE, makeNUpdate([], commonLib_1[__$_4__] ([__$_12__] , path), defaultValues, true));
                state = setDataMapInState(state, UPDATABLE, _maps2enable);
                if (commonLib_1[__$_3__] (_branch2, SymData, 'status', 'untouched') == 0) state = Macros.switch(state, schema, UPDATABLE, makeNUpdate(path, ['status', 'untouched'], 0));
            }
        }
    }
    
    var dataMap = commonLib_1[__$_3__] (state, path, SymDataMapTree);
    for (var _i3 = 0; _i3 < keyPath[__$_0__] ; _i3++) {
        if (!dataMap) break;
        state = executeDataMapsPROC(state, UPDATABLE, dataMap[SymDataMap], makeNUpdate(path, keyPath[__$_17__] (0, _i3), commonLib_1[__$_21__] ({}, value, keyPath[__$_17__] (_i3)), commonLib_1[__$_21__] ({}, replace, keyPath[__$_17__] (_i3))));
        dataMap = dataMap[keyPath[_i3]];
    }
    if (dataMap) state = recursivelyExecuteDataMaps(dataMap, value, replace, keyPath);
    function recursivelyExecuteDataMaps(dataMap, value, replace) {
        var track = arguments[__$_0__]  > 3 && arguments[3] !== undefined ? arguments[3] : [];

        state = executeDataMapsPROC(state, UPDATABLE, dataMap[SymDataMap], makeNUpdate(path, track, value, replace));
        commonLib_2[__$_7__] (value) && commonLib_1[__$_5__] (dataMap)[__$_2__] (function (key) {
            return value[__$_32__] (key) && (state = recursivelyExecuteDataMaps(dataMap[key], value[key], commonLib_1[__$_3__] (replace, key), track[__$_6__] (key)));
        });
        return state;
    }
    return state;
}
exports.updatePROC = updatePROC;
function normalizeDataMap(dataMap, emitter) {
    return dataMap.map(function (item) {
        var from = item.from,
            to = item.to,
            action = __rest(item, ["from", "to"]);

        if (!action.$) action = true;else action = normalizeFn(action);
        
        
        return { emitter: emitter, from: from, to: to, action: action };
    });
}
function setDataMapInState(state, UPDATABLE, dataMaps) {
    var unset = arguments[__$_0__]  > 3 && arguments[3] !== undefined ? arguments[3] : false;

    
    
    dataMaps[__$_2__] (function (dataMap) {
        var emitterPath = dataMap.emitter;
        var bindMap2emitter = false;
        var toItem = { path: normalizePath(dataMap.to, emitterPath) };
        normalizeUpdate({ path: emitterPath.join('/') + '/' + dataMap.from, value: null }, state)[__$_2__] (function (fromItem) {
            normalizeUpdate({ path: emitterPath.join('/') + '/' + dataMap.to, value: null }, state)[__$_2__] (function (toItem) {
                var _toItem$path;

                var relTo = path2string(relativePath(fromItem[__$_15__] , (_toItem$path = toItem[__$_15__] )[__$_6__] .apply(_toItem$path, [SymData][__$_6__] (_toConsumableArray(toItem[SymData])))));
                
                if (commonLib_1[__$_3__] (state, fromItem[__$_15__] )) commonLib_1[__$_21__] (UPDATABLE[__$_11__] , unset ? undefined : dataMap.action, fromItem[__$_15__] , SymDataMapTree, fromItem[SymData], SymDataMap, relTo);
                if (!unset) {
                    state = executeDataMapsPROC(state, UPDATABLE, commonLib_1[__$_18__] (relTo, dataMap.action), makeNUpdate(fromItem[__$_15__] , fromItem[SymData], commonLib_1[__$_3__] (state, fromItem[__$_15__] , SymData, fromItem[SymData])));
                    if (!bindMap2emitter && relativePath(emitterPath, fromItem[__$_15__] )[0] != '.') bindMap2emitter = true;
                }
                state = mergeUPD_PROC(state, UPDATABLE);
            });
        });
        if (bindMap2emitter) {
            var emitterBranch = commonLib_1[__$_3__] (state, emitterPath);
            if (emitterBranch) {
                var bindedMaps = commonLib_1[__$_3__] (emitterBranch, SymDataMapTree, SymData) || [];
                
                var i = void 0;
                for (i = 0; i < bindedMaps[__$_0__] ; i++) {
                    if (dataMap.from === bindedMaps[i].from && dataMap.to === bindedMaps[i].to) break;
                }
                bindedMaps = bindedMaps[__$_17__] ();
                bindedMaps[i] = dataMap;
                
                setUPDATABLE(UPDATABLE, bindedMaps, true, emitterPath, SymDataMapTree, SymData);
                
            }
            state = mergeUPD_PROC(state, UPDATABLE);
        }
    });
    return state;
}
function executeDataMapsPROC(state, UPDATABLE, maps, item) {
    var value = item[__$_13__] ,
        path = item[__$_15__] ,
        replace = item[__$_9__] ;

    var keyPath = item[SymData] || [];
    var from = NUpdate2string(item);
    commonLib_1[__$_5__] (maps || {})[__$_2__] (function (pathTo) {
        
        if (!maps[pathTo]) return; 
        var map = maps[pathTo];
        var NpathTo = path2string(normalizePath(pathTo, path));
        var executedValue = value;
        var updates = [];
        if (commonLib_2[__$_14__] (map)) {
            var field = makeSynthField(UPDATABLE.api, NpathTo, from);
            
            
            field.get = getFromUPD(state, UPDATABLE);
            field[__$_30__]  = updates;
            executedValue = processFn.call(field, map, value);
            field[__$_30__]  = null;
            field.get = null;
        }
        if (!updates[__$_0__] ) updates.push({ path: NpathTo, value: executedValue, replace: commonLib_2[__$_1__] (map[__$_9__] ) ? replace : map[__$_9__]  });
        updates[__$_2__] (function (update) {
            return state = updatePROC(state, UPDATABLE, update);
        });
    });
    return state;
}



var trueIfLength = function trueIfLength(length) {
    return function (path) {
        return commonLib_1[__$_3__] (path, 'length') === length;
    };
};
function isTopPath(path) {
    return path[__$_0__]  == 0 || path[__$_0__]  == 1 && path[0] == '#';
}
var makeSynthField = commonLib_1[__$_35__] (function (stateApi, to, from) {
    var path = to.split('@')[0];
    var pathData = from ? from.split('@')[0] : path;
    var updates = [];
    var field = { from: from, to: to, path: path, stateApi: stateApi, updates: updates };
    field.api = stateApi.wrapper(field);
    field.wrapOpts = function (rest) {
        if (field[__$_30__]  && commonLib_2[__$_1__] (rest.setExecution)) rest.setExecution = function (addUpdates) {
            return addUpdates && commonLib_1[__$_4__] (field[__$_30__] , addUpdates);
        };
        return rest;
    };
    field.getData = function () {
        return field.api.get(pathData, SymData);
    };
    return field;
});
function getFromUPD(state, UPDATABLE) {
    return function () {
        for (var _len3 = arguments[__$_0__] , tPath = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            tPath[_key3] = arguments[_key3];
        }

        if (commonLib_1[__$_41__] .apply(commonLib_1, [UPDATABLE[__$_11__] ][__$_6__] (_toConsumableArray(tPath.map(function (path) {
            return normalizePath(path);
        }))))) return commonLib_1[__$_16__] (getFromState.apply(undefined, [state][__$_6__] (tPath)), getFromState.apply(undefined, [UPDATABLE[__$_11__] ][__$_6__] (tPath)), { replace: getFromState.apply(undefined, [UPDATABLE[__$_9__] ][__$_6__] (tPath)) });
        return getFromState.apply(undefined, [state][__$_6__] (tPath));
    };
}
function getUpdValue(states) {
    for (var _len4 = arguments[__$_0__] , pathes = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        pathes[_key4 - 1] = arguments[_key4];
    }

    for (var i = 0; i < states[__$_0__] ; i++) {
        if (commonLib_1[__$_41__] .apply(commonLib_1, [states[i]][__$_6__] (pathes))) return commonLib_1[__$_3__] .apply(commonLib_1, [states[i]][__$_6__] (pathes));
    }
}
function getFromState(state) {
    for (var _len5 = arguments[__$_0__] , pathes = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        pathes[_key5 - 1] = arguments[_key5];
    }

    return commonLib_1[__$_3__] .apply(commonLib_1, [state][__$_6__] (_toConsumableArray(pathes.map(function (path) {
        return normalizePath(path);
    }))));
}
exports.getFromState = getFromState;
var makeNUpdate = function makeNUpdate(path, keyPath, value, replace) {
    var _Object$assign;

    var rest = arguments[__$_0__]  > 4 && arguments[4] !== undefined ? arguments[4] : {};
    return Object[__$_25__] ((_Object$assign = { path: path }, _defineProperty(_Object$assign, SymData, keyPath), _defineProperty(_Object$assign, "value", value), _defineProperty(_Object$assign, "replace", replace), _Object$assign), rest);
};
exports.makeNUpdate = makeNUpdate;
function isNUpdate(updateItem) {
    return !commonLib_2[__$_1__] (commonLib_1[__$_3__] (updateItem, SymData)) && commonLib_2[__$_10__] (updateItem[SymData]);
}
function string2NUpdate(path) {
    var base = arguments[__$_0__]  > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var rest = arguments[__$_0__]  > 2 && arguments[2] !== undefined ? arguments[2] : {};

    path = normalizePath(path, base);
    var keyPath = [];
    var a = path[__$_23__] (SymData);
    if (~a) {
        keyPath = path[__$_17__] (a + 1);
        path = path[__$_17__] (0, a);
    }

    var value = rest[__$_13__] ,
        replace = rest[__$_9__] ,
        r = __rest(rest, ["value", "replace"]);

    return makeNUpdate(path, keyPath, value, replace, r);
}
exports.string2NUpdate = string2NUpdate;
function NUpdate2string(item) {
    var path = path2string(item[__$_15__] );
    return path + (item[SymData] && !~path[__$_23__] ('@') ? '/@/' + path2string(item[SymData]) : '');
}
function normalizeUpdate(update, state) {
    var path = update[__$_15__] ,
        value = update[__$_13__] ,
        replace = update[__$_9__] ,
        base = update.base,
        rest = __rest(update, ["path", "value", "replace", "base"]);

    var result = [];
    var pathArray = path2string(path).split(';');
    pathArray[__$_2__] (function (path) {
        var pathes = normalizePath(path, base);
        var keyPathes = [];
        var a = pathes[__$_23__] (SymData);
        if (~a) {
            keyPathes = pathes[__$_17__] (a + 1);
            pathes = pathes[__$_17__] (0, a);
        }
        pathes = multiplyPath(pathes, { '*': function _(p) {
                return branchKeys(commonLib_1[__$_3__] (state, p)).join(',');
            } });
        keyPathes = multiplyPath(keyPathes);
        commonLib_1[__$_5__] (pathes)[__$_2__] (function (p) {
            return commonLib_1[__$_5__] (keyPathes)[__$_2__] (function (k) {
                return result.push(makeNUpdate(pathes[p], keyPathes[k], value, replace, rest));
            });
        });
    });
    return result;
}
exports.normalizeUpdate = normalizeUpdate;



var symConv = function symConv(key, anotherKey) {
    if (!commonLib_2[__$_1__] (anotherKey)) {
        symConv._data[key] = anotherKey;
        symConv._data[anotherKey] = key;
    } else return symConv._data[key];
};
symConv._data = { '#': '' };
symConv.sym2str = function (sym) {
    return (typeof sym === "undefined" ? "undefined" : _typeof(sym)) == 'symbol' && !commonLib_2[__$_1__] (symConv(sym)) ? symConv(sym) : sym;
};
symConv.str2sym = function (str) {
    return typeof str == 'string' && !commonLib_2[__$_1__] (symConv(str)) ? symConv(str) : str;
};
symConv('@', SymData);
function multiplyPath(path) {
    var strReplace = arguments[__$_0__]  > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var result = { '': [] };
    path[__$_2__] (function (value) {
        var res = {};
        value = strReplace[value] || value;
        if (typeof value == 'string' && ~value[__$_23__] (',')) {
            commonLib_1[__$_5__] (result)[__$_2__] (function (key) {
                return value.split(',')[__$_2__] (function (k) {
                    return res[key && key + ',' + k || k] = result[key][__$_6__] (k.trim());
                });
            });
        } else if (typeof value == 'function') {
            commonLib_1[__$_5__] (result)[__$_2__] (function (key) {
                var tmp = value(result[key]);
                if (typeof tmp == 'string') tmp = string2path(tmp);
                tmp = multiplyPath(tmp, strReplace);
                commonLib_1[__$_5__] (tmp)[__$_2__] (function (k) {
                    return res[key && key + (k ? ',' + k : '') || k] = result[key][__$_6__] (tmp[k]);
                });
            });
        } else commonLib_1[__$_5__] (result)[__$_2__] (function (key) {
            return commonLib_1[__$_4__] (result[key], value);
        });
        if (commonLib_1[__$_5__] (res)[__$_0__] ) result = res;
    });
    return result;
}
exports.multiplyPath = multiplyPath;
var num2string = function num2string(value) {
    return typeof value == 'number' ? value[__$_47__] () : value;
};
function relativePath(base, destination) {
    if (base[0] === '#') base = base[__$_17__] (1);
    if (destination[0] === '#') destination = destination[__$_17__] (1);
    
    
    var result = [];
    var i = void 0;
    for (i = 0; i < base[__$_0__] ; i++) {
        if (num2string(base[i]) !== num2string(destination[i])) break;
    }for (var j = i; j < base[__$_0__] ; j++) {
        result.push('..');
    }if (!result[__$_0__] ) result.push('.');
    return commonLib_1[__$_4__] (result, destination[__$_17__] (i));
    
}
exports.relativePath = relativePath;
function resolvePath(path, base) {
    var result = base && (path[0] === '.' || path[0] == '..') ? base[__$_17__] () : [];
    for (var i = 0; i < path[__$_0__] ; i++) {
        var val = path[i];
        if (val === '..') result.pop();else if (val !== '' && val !== '.') result.push(val);
    }
    return result;
}
function setIfNotDeeper(state, value) {
    if (state === value) return state;

    for (var _len6 = arguments[__$_0__] , pathes = Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
        pathes[_key6 - 2] = arguments[_key6];
    }

    var path = flattenPath(pathes);
    var result = state;
    for (var i = 0; i < path[__$_0__]  - 1; i++) {
        if (result[path[i]] === value) return state;
        if (!commonLib_2[__$_14__] (result[path[i]])) result[path[i]] = {};
        result = result[path[i]];
    }
    if (path[__$_0__] ) result[path[path[__$_0__]  - 1]] = value;else return value;
    return state;
}
exports.setIfNotDeeper = setIfNotDeeper;
function flattenPath(path) {
    if (commonLib_2[__$_10__] (path)) {
        var result = [];
        commonLib_1[__$_4__] .apply(commonLib_1, [result][__$_6__] (_toConsumableArray(path.map(flattenPath))));
        return result;
    } else if (typeof path == 'string') return string2path(path);
    return [path];
}
function isNPath(path) {
    return commonLib_2[__$_7__] (path) && commonLib_1[__$_3__] (path, SymData) === 'nPath';
}
exports.isNPath = isNPath;
function normalizePath(path) {
    var base = arguments[__$_0__]  > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var result = resolvePath(flattenPath(path), base[__$_0__]  ? flattenPath(base) : []);
    result[SymData] = 'nPath';
    return result;
}
exports.normalizePath = normalizePath;
function path2string(path) {
    return commonLib_2[__$_10__] (path) ? path.map(path2string).join('/') : symConv.sym2str(path);
}
exports.path2string = path2string;
function string2path(path) {
    path = path[__$_9__] (symConv(SymData), '/' + symConv(SymData) + '/');
    path = path[__$_9__] (/\/+/g, '/');
    var result = [];
    path.split('/')[__$_2__] (function (key) {
        return key && (key = symConv.str2sym(key.trim())) && result.push(key);
    });
    return result;
}
exports.string2path = string2path;



function object2PathValues(vals) {
    var options = arguments[__$_0__]  > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var track = arguments[__$_0__]  > 2 && arguments[2] !== undefined ? arguments[2] : [];

    var fn = options.symbol ? commonLib_1.objKeysNSymb : commonLib_1[__$_5__] ;
    var check = options.arrayAsValue ? commonLib_2[__$_14__]  : commonLib_2[__$_7__] ;
    if (!check(vals)) return [[vals]];
    var result = [];
    fn(vals)[__$_2__] (function (key) {
        var path = track[__$_6__] (key);
        if (check(vals[key])) object2PathValues(vals[key], options, path)[__$_2__] (function (item) {
            return result.push(item);
        }); 
        else result.push(commonLib_1[__$_4__] (path, vals[key]));
    });
    if (!result[__$_0__] ) return [commonLib_1[__$_4__] (track[__$_17__] (), {})]; 
    return result;
}
exports.object2PathValues = object2PathValues;
var objMap = function objMap(object, fn) {
    var track = arguments[__$_0__]  > 2 && arguments[2] !== undefined ? arguments[2] : [];
    return commonLib_1[__$_5__] (object).reduce(function (result, key) {
        return ((result[key] = fn(object[key], track[__$_6__] (key))) || true) && result;
    }, commonLib_2[__$_10__] (object) ? [] : {});
};
exports.objMap = objMap;
var isMapFn = function isMapFn(arg) {
    return commonLib_2[__$_14__] (arg) && arg.$ || commonLib_2[__$_33__] (arg) && arg._map;
};
exports.isMapFn = isMapFn;
function normalizeArgs(args, wrapFn) {
    var dataRequest = false;
    args = commonLib_1.toArray(commonLib_2[__$_1__] (args) ? [] : args).map(function (arg) {
        if (commonLib_2.isString(arg) && arg[0] == '@') return (dataRequest = true) && normalizePath(arg.substr(1));
        if (isMapFn(arg)) {
            var res = normalizeArgs(arg.args, wrapFn);
            if (res.dataRequest) dataRequest = true;
            res = Object[__$_25__] ({}, arg, res);
            return wrapFn ? wrapFn(res) : res;
        } else if (wrapFn && commonLib_2[__$_7__] (arg)) return wrapFn(arg);
        return arg;
    });
    return { dataRequest: dataRequest, args: args, norm: true };
}
exports.normalizeArgs = normalizeArgs;
function normalizeFn(fn, wrapFn, dontAddValue) {
    var nFn = !commonLib_2[__$_14__] (fn) ? { $: fn } : fn;
    nFn = Object[__$_25__] ({}, nFn, normalizeArgs(nFn.args, wrapFn));
    if (!nFn.args.length && !dontAddValue) nFn.args = ['${value}'];
    return nFn;
}
exports.normalizeFn = normalizeFn;
function processFn(map, value, nextData) {
    var _this = this;

    var processArg = function processArg(arg) {
        if (isNPath(arg)) return commonLib_1[__$_3__] (nextData, arg);
        if (isMapFn(arg)) return !arg._map ? processFn.call(_this, arg, value, nextData) : arg(value, nextData);
        
        if (arg == '${value}') return value;
        
        return arg;
    };
    if (map.dataRequest && !nextData) nextData = this.getData();
    return commonLib_1.deArray(commonLib_1.toArray(map.$).reduce(function (args, fn) {
        return commonLib_2[__$_33__] (fn) ? commonLib_1.toArray(fn.apply(_this, args)) : args;
    }, (map.args || []).map(processArg)), map.arrayResult);
}
exports.processFn = processFn;