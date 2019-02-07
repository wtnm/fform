"use strict";
var __$_0__='length',__$_1__='isUndefined',__$_2__='getIn',__$_3__='forEach',__$_4__='push2array',__$_5__='concat',__$_6__='additionalItems',__$_7__='objKeys',__$_8__='value',__$_9__='isArray',__$_10__='replace',__$_11__='merge',__$_12__='makeSlice',__$_13__='oneOf',__$_14__='defaultValues',__$_15__='update',__$_16__='current',__$_17__='slice',__$_18__='isObject',__$_19__='path',__$_20__='moveArrayElems',__$_21__='setIn',__$_22__='isMergeable',__$_23__='setStatus',__$_24__='properties',__$_25__='indexOf',__$_26__='fData',__$_27__='macros',__$_28__='hasOwnProperty',__$_29__='hasIn',__$_30__='setValue',__$_31__='minItems',__$_32__='setOneOf',__$_33__='getOwnPropertySymbols',__$_34__='items',__$_35__='default',__$_36__='dataMap',__$_37__='toString',__$_38__='schemaPart';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array[__$_9__] (arr)) { for (var i = 0, arr2 = Array(arr[__$_0__] ); i < arr[__$_0__] ; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __rest = this && this.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e[__$_25__] (p) < 0) t[p] = s[p];
    }if (s != null && typeof Object[__$_33__]  === "function") for (var i = 0, p = Object[__$_33__] (s); i < p[__$_0__] ; i++) {
        if (e[__$_25__] (p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var commonLib_1 = require("./commonLib");
var commonLib_2 = require("./commonLib");
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

var symConv = function symConv(key, anotherKey) {
    if (!commonLib_2[__$_1__] (anotherKey)) {
        symConv._data[key] = anotherKey;
        symConv._data[anotherKey] = key;
    } else return symConv._data[key];
};
exports.symConv = symConv;
symConv._data = { '#': '' };
symConv.sym2str = function (sym) {
    return (typeof sym === "undefined" ? "undefined" : _typeof(sym)) == 'symbol' && !commonLib_2[__$_1__] (symConv(sym)) ? symConv(sym) : sym;
};
symConv.str2sym = function (str) {
    return typeof str == 'string' && !commonLib_2[__$_1__] (symConv(str)) ? symConv(str) : str;
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
types.number = commonLib_2.isNumber; 
types.integer = commonLib_2.isInteger; 
types.string = commonLib_2.isString; 
types.array = commonLib_2[__$_9__] ;
types.object = commonLib_2[__$_18__] ; 
types.empty = { 'any': null, 'null': null, 'boolean': false, 'number': 0, 'integer': 0, 'string': '', array: Object.freeze([]), object: Object.freeze({}) };



function getBindedMaps2update(branch) {
    var path = arguments[__$_0__]  > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var maps2disable = commonLib_1[__$_2__] (branch, SymDataMapTree, SymData) || [];
    var maps2enable = maps2disable.map(function (map) {
        return commonLib_1[__$_11__] (map, { emitter: path });
    });
    commonLib_1[__$_7__] (branch)[__$_3__] (function (key) {
        var result = void 0;
        if (branch[key]) {
            result = getBindedMaps2update(branch[key], path[__$_5__] (key));
            commonLib_1[__$_4__] (maps2disable, result.maps2disable);
            commonLib_1[__$_4__] (maps2enable, result.maps2enable);
        }
    });
    return { maps2disable: maps2disable, maps2enable: maps2enable };
}
var Macros = {};
Macros.array = function (state, schema, UPDATABLE_object, item) {
    var _a = item,
        path = _a[__$_19__] ,
        macros = _a[__$_27__] ,
        value = _a[__$_8__] ,
        _b = SymData,
        sym = _a[_b],
        rest = __rest(_a, ["path", "macros", "value", (typeof _b === "undefined" ? "undefined" : _typeof(_b)) === "symbol" ? _b : _b + ""]);
    var length = getUpdValue([UPDATABLE_object[__$_15__] , state], path, SymData, 'length');
    if (commonLib_2[__$_9__] (item[__$_8__] )) {
        var mergeArrayObj = [];
        var replaceArrayObj = {};
        for (var i = 0; i < item[__$_8__] .length; i++) {
            mergeArrayObj[length + i] = item[__$_8__] [i];
            replaceArrayObj[length + i] = commonLib_1[__$_2__] (item[__$_10__] , i);
        }
        mergeArrayObj[__$_0__]  = length + item[__$_8__] .length;
        return updateCurrentPROCEDURE(state, schema, UPDATABLE_object, mergeArrayObj, replaceArrayObj, path, item[__$_32__] );
    } else {
        length += item[__$_8__]  || 1;
        if (length < 0) length = 0;
        return updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(path, [__$_0__] , length, false, rest));
    }
};
Macros.arrayItem = function (state, schema, UPDATABLE_object, item) {
    var path = item[__$_19__] ;
    var op = item.op;
    var opVal = item[__$_8__]  || 0;
    var from = parseInt(path.pop());
    var to = from;
    var min = arrayStart(getSchemaPart(schema, path, oneOfFromState(state))); 
    var length = getUpdValue([UPDATABLE_object[__$_15__] , state], path, SymData, 'length');
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
    updObj[0] = commonLib_1[__$_2__] (UPDATABLE_object[__$_15__] , path);
    updObj[1] = commonLib_1[__$_2__] (UPDATABLE_object[__$_15__] , SymData, 'current', path);
    updObj[2] = commonLib_1[__$_2__] (UPDATABLE_object[__$_10__] , path);
    updObj[3] = commonLib_1[__$_2__] (UPDATABLE_object[__$_10__] , SymData, 'current', path);

    var _loop = function _loop(i) {
        stateObject[i] = commonLib_1[__$_2__] (state, path, i);
        arrayItems[i] = stateObject[i][SymData].arrayItem; 
        
        currentObject[i] = commonLib_1[__$_2__] (state, SymData, 'current', path, i);
        updObj[__$_3__] (function (obj) {
            return commonLib_2[__$_22__] (obj) && !obj[__$_28__] (i) && (obj[i] = SymClear);
        });
    };

    for (var i = Math.min(from, to); i <= Math.max(from, to); i++) {
        _loop(i);
    }
    stateObject = commonLib_1[__$_20__] (stateObject, from, to);
    currentObject = commonLib_1[__$_20__] (currentObject, from, to);

    var _getBindedMaps2update = getBindedMaps2update(stateObject, path),
        maps2disable = _getBindedMaps2update.maps2disable,
        maps2enable = _getBindedMaps2update.maps2enable;

    updObj[__$_3__] (function (obj) {
        if (!commonLib_2[__$_22__] (obj)) return;
        commonLib_1[__$_20__] (obj, from, to);
        for (var i = Math.min(from, to); i <= Math.max(from, to); i++) {
            if (obj[i] === SymClear) delete obj[i];
        }
    });
    commonLib_1[__$_7__] (stateObject)[__$_3__] (function (i) {
        stateObject[i] = commonLib_1[__$_11__] (stateObject[i], commonLib_1[__$_12__] (SymData, 'arrayItem', arrayItems[i]), { replace: commonLib_1[__$_12__] (SymData, 'arrayItem', true) });
        
    }); 
    
    state = commonLib_1[__$_11__] (state, commonLib_1[__$_12__] (path, stateObject), { replace: trueIfLength(item[__$_19__] .length + 1) }); 
    state = commonLib_1[__$_11__] (state, commonLib_1[__$_12__] (SymData, 'current', path, currentObject), { replace: trueIfLength(item[__$_19__] .length + 3) }); 
    if (op == 'del') state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(path, [__$_0__] , max));
    state = mergeStatePROCEDURE(state, UPDATABLE_object);
    state = setDataMapInState(state, schema, maps2disable, true);
    state = setDataMapInState(state, schema, maps2enable);
    return state;
};
Macros.switch = function (state, schema, UPDATABLE_object, item) {
    var keyPath = item[SymData] || [];
    var switches = commonLib_1[__$_12__] (keyPath, item[__$_8__] );
    object2PathValues(switches)[__$_3__] (function (pathValue) {
        return state = recursivelyUpdate(state, schema, UPDATABLE_object, makeNUpdate(item[__$_19__] , pathValue, pathValue.pop()));
    });
    return state;
};
Macros.setExtraStatus = function (state, schema, UPDATABLE_object, item) {
    var keyPath = item[SymData] || [];
    var prevVal = getUpdValue([UPDATABLE_object[__$_15__] , state], item[__$_19__] , SymData, keyPath);
    var value = item[__$_8__]  > 0;
    if (!prevVal == value) {
        state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(item[__$_19__] , keyPath, value));
        state = Macros[__$_23__] (state, schema, UPDATABLE_object, makeNUpdate(item[__$_19__] , ['status', keyPath[keyPath[__$_0__]  - 1]], value ? 1 : -1));
    }
    return state;
};
Macros[__$_23__]  = function (state, schema, UPDATABLE_object, item) {
    var keyPath = item[SymData] || [];
    if (keyPath[__$_0__]  > 2) return Macros.setExtraStatus(state, schema, UPDATABLE_object, item);
    var op = keyPath[1];
    if (!op) return state;
    if (op == 'valid' || op == 'pristine' || op == 'touched') throw new Error('Setting "' + op + '" directly is not allowed');
    var prevVal = getUpdValue([UPDATABLE_object[__$_15__] , state], item[__$_19__] , SymData, keyPath);
    var selfManaged = isSelfManaged(state, item[__$_19__] );
    if (op == 'untouched' && prevVal == 0 && !selfManaged) return state; 
    var value = prevVal + item[__$_8__] ;
    if (selfManaged && value > 1) value = 1;
    if (value < 0) value = 0;
    state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(item[__$_19__] , ['status', op], value));
    if (!isTopPath(item[__$_19__] ) && !prevVal != !value) 
        state = Macros[__$_23__] (state, schema, UPDATABLE_object, makeNUpdate(item[__$_19__] .slice(0, -1), keyPath, value > 0 ? 1 : -1));
    return state;
};
Macros.setCurrent = function (state, schema, UPDATABLE_object, item) {
    return updateCurrentPROCEDURE(state, schema, UPDATABLE_object, item[__$_8__] , item[__$_10__] , item[__$_19__] , item[__$_32__] );
};
Macros[__$_32__]  = function (state, schema, UPDATABLE_object, item) {
    var oldOneOf = commonLib_1[__$_2__] (state, item[__$_19__] , SymData, 'oneOf');
    if (oldOneOf == item[__$_8__] ) {
        if (!commonLib_2[__$_1__] (item[__$_30__] )) state = updateCurrentPROCEDURE(state, schema, UPDATABLE_object, item[__$_30__] , false, item[__$_19__] );
        return state;
    }
    var macros = item[__$_27__] ,
        newItem = __rest(item, [__$_27__] );
    newItem[SymData] = [__$_13__] ;
    if (commonLib_2[__$_1__] (newItem[__$_30__] )) {
        state = mergeStatePROCEDURE(state, UPDATABLE_object);
        newItem[__$_30__]  = commonLib_1[__$_2__] (state, SymData, 'current', item[__$_19__] );
    }
    return updateStatePROCEDURE(state, schema, UPDATABLE_object, newItem);
};



var schemaStorage = commonLib_1.memoize(function (schema) {
    return {};
});
var trueIfLength = function trueIfLength(length) {
    return function (path) {
        return commonLib_1[__$_2__] (path, 'length') === length;
    };
};
function isTopPath(path) {
    return path[__$_0__]  == 0 || path[__$_0__]  == 1 && path[0] == '#';
}
exports.isTopPath = isTopPath;
function recursivelyUpdate(state, schema, UPDATABLE_object, item) {
    var keys = branchKeys(commonLib_1[__$_2__] (state, item[__$_19__] ));
    if (item[__$_8__]  == SymReset && item[SymData][0] == 'status') {
        var i = Object.assign({}, item);
        i[__$_8__]  = item[SymData][1] == 'untouched' ? keys[__$_0__]  : 0;
        state = updateStatePROCEDURE(state, schema, UPDATABLE_object, i);
    } else state = updateStatePROCEDURE(state, schema, UPDATABLE_object, item);
    keys[__$_3__] (function (key) {
        return state = recursivelyUpdate(state, schema, UPDATABLE_object, commonLib_1[__$_11__] (item, { path: item[__$_19__] [__$_5__] (key) }));
    });
    return state;
}
;
function oneOfFromState(state) {
    return function (path) {
        var s = commonLib_1[__$_2__] (commonLib_2.isFunction(state) ? state() : state, path, SymData);
        return { oneOf: commonLib_1[__$_2__] (s, 'oneOf'), type: commonLib_1[__$_2__] (s, 'fData', 'type') };
    };
}
exports.oneOfFromState = oneOfFromState;
function oneOfStructure(state, path) {
    if (typeof state == 'function') state = state();
    var result = {};
    var tmp = result;
    commonLib_1[__$_21__] (tmp, commonLib_1[__$_2__] (state, SymData, 'oneOf'), SymData, 'oneOf');
    commonLib_1[__$_21__] (tmp, commonLib_1[__$_2__] (state, SymData, 'fData', 'type'), SymData, 'type');
    for (var i = 0; i < path[__$_0__] ; i++) {
        if (commonLib_2[__$_1__] (path[i]) || path[i] === '') continue;
        tmp[path[i]] = {};
        tmp = tmp[path[i]];
        state = commonLib_1[__$_2__] (state, path[i]);
        commonLib_1[__$_21__] (tmp, commonLib_1[__$_2__] (state, SymData, 'oneOf'), SymData, 'oneOf');
        commonLib_1[__$_21__] (tmp, commonLib_1[__$_2__] (state, SymData, 'fData', 'type'), SymData, 'type');
    }
    
    var fn = function fn(path, oneOf) {
        return commonLib_2[__$_1__] (oneOf) ? commonLib_1[__$_2__] (result, path, SymData) : commonLib_1[__$_21__] (result, oneOf, path, SymData);
    };
    fn._canSet = true;
    return fn;
}
exports.oneOfStructure = oneOfStructure;
function branchKeys(branch) {
    var keys = [];
    if (isSelfManaged(branch)) return keys;
    if (branch[SymData][__$_26__] .type == 'array') for (var j = 0; j < commonLib_1[__$_2__] (branch, SymData, 'length'); j++) {
        keys.push(j[__$_37__] ());
    } else keys = commonLib_1[__$_7__] (branch).filter(function (v) {
        return v;
    });
    return keys;
}
exports.branchKeys = branchKeys;
function getSchemaPart(schema, path, getOneOf, fullOneOf) {
    function getArrayItemSchemaPart(index, schemaPart) {
        var items = [];
        if (schemaPart[__$_34__] ) {
            if (!commonLib_2[__$_9__] (schemaPart[__$_34__] )) return schemaPart[__$_34__] ;else items = schemaPart[__$_34__] ;
        }
        if (index < items[__$_0__] ) return items[index];else {
            if (schemaPart[__$_6__]  !== false) {
                if (schemaPart[__$_6__]  && schemaPart[__$_6__]  !== true) return schemaPart[__$_6__] ;
                return items[items[__$_0__]  - 1];
            }
        }
        throw new Error(errorText + path.join('/'));
    }
    function getSchemaByRef(schema, $ref) {
        var path = string2path($ref);
        if ($ref[0] == '#') return commonLib_1[__$_2__] (schema, path); 
        throw new Error("Can only ref to #"); 
    }
    function deref(schema, schemaPart) {
        while (schemaPart.$ref) {
            schemaPart = getSchemaByRef(schema, schemaPart.$ref);
        }return schemaPart;
    }
    function combineSchemasINNER_PROCEDURE(schemaPart) {
        if (schemaPart.$ref || schemaPart.allOf || schemaPart[__$_13__] ) {
            if (combinedSchemas.get(schemaPart)) schemaPart = combinedSchemas.get(schemaPart);else {
                var schemaPartAsKey = schemaPart;
                schemaPart = derefAndMergeAllOf(schema, schemaPart); 
                if (schemaPart[__$_13__] ) {
                    var _schemaPart = schemaPart,
                        oneOf = _schemaPart[__$_13__] ,
                        restSchemaPart = __rest(schemaPart, [__$_13__] );

                    schemaPart = oneOf.map(function (oneOfPart) {
                        return commonLib_1[__$_11__] (derefAndMergeAllOf(schema, oneOfPart), restSchemaPart, { array: 'replace' });
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
                result = commonLib_1[__$_11__] (result, derefAndMergeAllOf(schema, allOf[i]), { array: 'replace' });
            }
            schemaPart = commonLib_1[__$_11__] (result, restSchemaPart);
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
            oneOf = _getOneOf[__$_13__] ,
            _type = _getOneOf.type;

        if (commonLib_2[__$_9__] (schemaPart)) schemaPart = schemaPart[oneOf || 0];
        if (_type == 'array') {
            if (isNaN(parseInt(path[i]))) throw new Error(errorText + path.join('/'));
            schemaPart = getArrayItemSchemaPart(path[i], schemaPart);
        } else {
            if (schemaPart[__$_24__]  && schemaPart[__$_24__] [path[i]]) schemaPart = schemaPart[__$_24__] [path[i]];else throw new Error(errorText + path.join('/'));
        }
    }
    schemaPart = combineSchemasINNER_PROCEDURE(schemaPart);
    if (fullOneOf) return schemaPart;
    if (commonLib_2[__$_9__] (schemaPart)) schemaPart = schemaPart[getOneOf(path)[__$_13__]  || 0];
    return schemaPart;
}
exports.getSchemaPart = getSchemaPart;
















var arrayStart = commonLib_1.memoize(function (schemaPart) {
    if (!commonLib_2[__$_9__] (schemaPart[__$_34__] )) return 0;
    if (schemaPart[__$_6__]  === false) return schemaPart[__$_34__] .length;
    if (_typeof(schemaPart[__$_6__] ) === 'object') return schemaPart[__$_34__] .length;
    if (schemaPart[__$_34__] .length == 0) return 0;
    return schemaPart[__$_34__] .length - 1;
});
exports.arrayStart = arrayStart;





var basicStatus = { invalid: 0, dirty: 0, untouched: 1, pending: 0, valid: true, touched: false, pristine: true };
var makeDataStorage = commonLib_1.memoize(function (schemaPart, oneOf, type) {
    var value = arguments[__$_0__]  > 3 && arguments[3] !== undefined ? arguments[3] : schemaPart[__$_35__] ;

    
    var _schemaPart$ff_params = schemaPart.ff_params,
        ff_params = _schemaPart$ff_params === undefined ? {} : _schemaPart$ff_params,
        _schemaPart$ff_data = schemaPart.ff_data,
        ff_data = _schemaPart$ff_data === undefined ? {} : _schemaPart$ff_data;

    var result = Object.assign({ params: ff_params }, ff_data);
    if (!commonLib_2[__$_18__] (result.messages)) result.messages = {};
    if (commonLib_2[__$_1__] (value)) value = types.empty[type || 'any'];
    result[__$_13__]  = oneOf;
    result.status = basicStatus;
    if (!commonLib_2[__$_18__] (result[__$_26__] )) result[__$_26__]  = {};
    result[__$_26__] .type = type;
    result[__$_26__] .required = schemaPart.required;
    if (schemaPart.title) result[__$_26__] .title = schemaPart.title;
    if (schemaPart.ff_placeholder) result[__$_26__] .placeholder = schemaPart.ff_placeholder;
    if (schemaPart.enum) result[__$_26__] .enum = schemaPart.enum;
    if (schemaPart.ff_enumExten) result[__$_26__] .enumExten = schemaPart.ff_enumExten;
    if (isSchemaSelfManaged(schemaPart, type)) result[__$_8__]  = value;else delete result[__$_8__] ;
    var untouched = 1;
    if (type == 'array') {
        result[__$_0__]  = commonLib_1[__$_2__] (value, 'length') || 0;
        if (!commonLib_2[__$_1__] (schemaPart[__$_31__] ) && result[__$_0__]  < schemaPart[__$_31__] ) result[__$_0__]  = schemaPart[__$_31__] ;
        result[__$_26__] .canAdd = isArrayCanAdd(schemaPart, result[__$_0__] );
        untouched = result[__$_0__] ;
    } else if (type == 'object') untouched = commonLib_1[__$_7__] (schemaPart[__$_24__]  || {})[__$_0__] ;
    if (untouched != 1) result.status = Object.assign({}, result.status, { untouched: untouched });
    return result;
});
function normalizeDataMap(dataMap, path) {
    return dataMap.map(function (item) {
        return { emitter: path, from: item[0], to: item[1], action: (commonLib_2.isFunction(item[2]) ? { $: item[2] } : item[2]) || true };
    });
}
function getUniqKey() {
    return Date.now()[__$_37__] (36) + Math.random()[__$_37__] (36);
}
function makeStateBranch(schema, getNSetOneOf) {
    var path = arguments[__$_0__]  > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var value = arguments[3];

    var result = {};
    var dataMapObjects = [];
    var defaultValues = void 0;
    var currentOneOf = (getNSetOneOf(path) || {})[__$_13__] ;
    var schemaPartsOneOf = getSchemaPart(schema, path, getNSetOneOf, true);

    var _findOneOf = findOneOf(schemaPartsOneOf, value, currentOneOf),
        schemaPart = _findOneOf[__$_38__] ,
        oneOf = _findOneOf[__$_13__] ,
        type = _findOneOf.type;

    if (!commonLib_2[__$_1__] (currentOneOf) && currentOneOf != oneOf) {
        
        console.info('Passed value is not supported by schema.type in path "' + path.join('/') + '" and oneOfIndex "' + currentOneOf + '". Reset value to default.\n');
        value = schemaPartsOneOf[currentOneOf][__$_35__] ; 
        var tmp = findOneOf(schemaPartsOneOf, value, currentOneOf);
        schemaPart = tmp[__$_38__] ;
        oneOf = tmp[__$_13__] ;
        type = tmp.type;
    }
    commonLib_1[__$_4__] (dataMapObjects, normalizeDataMap(schemaPart.ff_dataMap || [], path));
    result[SymData] = makeDataStorage(schemaPart, oneOf, type, value);
    getNSetOneOf(path, { oneOf: oneOf, type: type });
    if (result[SymData][__$_28__] ('value')) defaultValues = result[SymData][__$_8__] ;else {
        if (type == 'array') {
            defaultValues = [];
            defaultValues[__$_0__]  = result[SymData][__$_0__] ;
            for (var i = 0; i < defaultValues[__$_0__] ; i++) {
                var _makeStateBranch = makeStateBranch(schema, getNSetOneOf, path[__$_5__] (i), commonLib_1[__$_2__] (commonLib_2[__$_1__] (value) ? schemaPart[__$_35__]  : value, i)),
                    branch = _makeStateBranch.state,
                    dataMap = _makeStateBranch[__$_36__] ,
                    dValue = _makeStateBranch[__$_14__] ;

                defaultValues[i] = dValue;
                commonLib_1[__$_4__] (dataMapObjects, dataMap);
                branch = commonLib_1[__$_11__] (branch, _defineProperty({}, SymData, { arrayItem: getArrayItemData(schemaPart, i, defaultValues[__$_0__] ) }), { replace: _defineProperty({}, SymData, { ArrayItem: true }) });
                branch = commonLib_1[__$_11__] (branch, _defineProperty({}, SymData, { params: { uniqKey: getUniqKey() } }));
                result[i] = branch;
            }
        } else if (type == 'object') {
            defaultValues = {};
            var arrayOfRequired = result[SymData][__$_26__] .required;
            arrayOfRequired = commonLib_2[__$_9__] (arrayOfRequired) && arrayOfRequired[__$_0__]  && arrayOfRequired;
            commonLib_1[__$_7__] (schemaPart[__$_24__]  || {})[__$_3__] (function (field) {
                var _makeStateBranch2 = makeStateBranch(schema, getNSetOneOf, path[__$_5__] (field), value && value[field]),
                    branch = _makeStateBranch2.state,
                    dataMap = _makeStateBranch2[__$_36__] ,
                    dValue = _makeStateBranch2[__$_14__] ;

                defaultValues[field] = dValue;
                commonLib_1[__$_4__] (dataMapObjects, dataMap);
                if (arrayOfRequired && ~arrayOfRequired[__$_25__] (field)) branch = commonLib_1[__$_11__] (branch, _defineProperty({}, SymData, { fData: { required: true } }));
                result[field] = branch;
            });
        }
        if (value) defaultValues = commonLib_1[__$_11__] (value, defaultValues, { replace: trueIfLength(1) });
    }
    return { state: result, defaultValues: defaultValues, dataMap: dataMapObjects };
}
exports.makeStateBranch = makeStateBranch;
var makeStateFromSchema = commonLib_1.memoize(function (schema) {
    var _makeStateBranch3 = makeStateBranch(schema, oneOfStructure({}, [])),
        state = _makeStateBranch3.state,
        _makeStateBranch3$dat = _makeStateBranch3[__$_36__] ,
        dataMap = _makeStateBranch3$dat === undefined ? [] : _makeStateBranch3$dat,
        defaultValues = _makeStateBranch3[__$_14__] ;

    state = commonLib_1[__$_11__] (state, commonLib_1[__$_21__] ({}, defaultValues, [SymData, 'current']));
    state = setDataMapInState(state, schema, dataMap);
    var UPDATABLE_object = { update: {}, replace: {} };
    state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate([], ['inital'], commonLib_1[__$_2__] (state, SymData, 'current')));
    state = mergeStatePROCEDURE(state, UPDATABLE_object);
    return state;
});
exports.makeStateFromSchema = makeStateFromSchema;
function setDataMapInState(state, schema, dataMaps) {
    var unset = arguments[__$_0__]  > 3 && arguments[3] !== undefined ? arguments[3] : false;

    
    var UPDATABLE_object = { update: {}, replace: {} };
    dataMaps[__$_3__] (function (dataMap) {
        var emitterPath = dataMap.emitter;
        var bindMap2emitter = false;
        normalizeUpdate({ path: emitterPath.join('/') + '/' + dataMap.from, to: normalizePath(dataMap.to, emitterPath), value: dataMap.action }, state)[__$_3__] (function (NdataMap) {
            var relTo = path2string(relativePath(NdataMap[__$_19__] , NdataMap.to));
            if (commonLib_1[__$_2__] (state, NdataMap[__$_19__] )) commonLib_1[__$_21__] (UPDATABLE_object[__$_15__] , unset ? undefined : NdataMap[__$_8__] , NdataMap[__$_19__] , SymDataMapTree, NdataMap[SymData], SymDataMap, relTo);
            if (!unset) {
                executeDataMapsPROCEDURE(state, schema, UPDATABLE_object, commonLib_1[__$_12__] (relTo, NdataMap[__$_8__] ), makeNUpdate(NdataMap[__$_19__] , NdataMap[SymData], commonLib_1[__$_2__] (state, NdataMap[__$_19__] , SymData, NdataMap[SymData])));
                if (!bindMap2emitter && relativePath(emitterPath, NdataMap[__$_19__] )[0] != '.') bindMap2emitter = true;
            }
            state = mergeStatePROCEDURE(state, UPDATABLE_object);
        });
        if (bindMap2emitter) {
            var emitterBranch = commonLib_1[__$_2__] (state, emitterPath);
            if (emitterBranch) {
                var bindedMaps = commonLib_1[__$_2__] (emitterBranch, SymDataMapTree, SymData) || [];
                setUPDATABLE(UPDATABLE_object, bindedMaps[__$_5__] (dataMap), true, emitterPath, SymDataMapTree, SymData);
                
            }
            state = mergeStatePROCEDURE(state, UPDATABLE_object);
        }
    });
    return state;
}










function isArrayCanAdd(schemaPart, length) {
    var arrayStartIndex = arrayStart(schemaPart); 
    var minItems = schemaPart[__$_31__]  || 0;
    return (schemaPart[__$_6__]  !== false || length < arrayStartIndex) && length < (schemaPart.maxItems || Infinity);
}
function getArrayItemData(schemaPart, index, length) {
    var result = {};
    var arrayStartIndex = arrayStart(schemaPart); 
    var minItems = schemaPart[__$_31__]  || 0;
    
    result.canUp = arrayStartIndex < index;
    result.canDown = arrayStartIndex <= index && index < length - 1;
    
    
    result.canDel = index >= Math.min(arrayStartIndex, length - 1);
    return result;
}
function isSelfManaged(state) {
    for (var _len = arguments[__$_0__] , pathes = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        pathes[_key - 1] = arguments[_key];
    }

    return commonLib_1[__$_29__] .apply(commonLib_1, [state][__$_5__] (pathes, [SymData, 'value']));
}
exports.isSelfManaged = isSelfManaged;
function isSchemaSelfManaged(schemaPart, type) {
    return type !== 'array' && type !== 'object' || commonLib_1[__$_29__] (schemaPart, 'ff_managed');
}
exports.isSchemaSelfManaged = isSchemaSelfManaged;
function findOneOf(oneOfShemas, value, currentOneOf) {
    if (!commonLib_2[__$_9__] (oneOfShemas)) oneOfShemas = [oneOfShemas];
    var oneOfKeys = oneOfShemas.map(function (v, i) {
        return i;
    });
    
    if (currentOneOf) commonLib_1[__$_20__] (oneOfKeys, currentOneOf, 0); 
    for (var k = 0; k < oneOfKeys[__$_0__] ; k++) {
        var oneOf = oneOfKeys[k];
        var schemaTypes = oneOfShemas[oneOf].type || types;
        if (!commonLib_2[__$_9__] (schemaTypes)) schemaTypes = [schemaTypes];
        var defaultUsed = void 0;
        var checkValue = commonLib_2[__$_1__] (value) ? (defaultUsed = true) && oneOfShemas[oneOf][__$_35__]  : value;
        for (var j = 0; j < schemaTypes[__$_0__] ; j++) {
            if (types[schemaTypes[j]](checkValue) || commonLib_2[__$_1__] (checkValue)) return { schemaPart: oneOfShemas[oneOf], oneOf: oneOf, type: schemaTypes[j] };
        }if (defaultUsed && !commonLib_2[__$_1__] (oneOfShemas[oneOf][__$_35__] )) throw new Error('Type of schema.default is not supported by schema.type');
    }
    return {};
}
function updateCurrentPROCEDURE(state, schema, UPDATABLE_object, value, replace) {
    var track = arguments[__$_0__]  > 5 && arguments[5] !== undefined ? arguments[5] : [];
    var setOneOf = arguments[6];

    if (value === SymReset) value = commonLib_1[__$_2__] (state, SymData, 'inital', track);
    if (value === SymClear) value = commonLib_1[__$_2__] (getDefaultFromSchema(schema), track);
    if (commonLib_1[__$_2__] (state, SymData, 'current', track) === value && !commonLib_1[__$_29__] (UPDATABLE_object[__$_15__] , SymData, 'current', track)) return state;
    var branch = commonLib_1[__$_2__] (state, track);
    
    if (!branch) {
        if (track[track[__$_0__]  - 1] == 'length') {
            
            var topPath = track[__$_17__] (0, -1);
            var topBranch = commonLib_1[__$_2__] (state, topPath);
            if (topBranch[SymData][__$_26__] .type == 'array') return updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(topPath, [__$_0__] , value));
        }
        return updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate([], [__$_16__] .concat(track), value, replace));
    }
    var type = branch[SymData][__$_26__] .type;
    if (commonLib_2[__$_1__] (value)) value = types.empty[type || 'any'];
    if (!types[type || 'any'](value)) {
        
        var _findOneOf2 = findOneOf(getSchemaPart(schema, track, oneOfFromState(state), true), value, commonLib_2[__$_1__] (setOneOf) ? branch[SymData][__$_13__]  : setOneOf),
            schemaPart = _findOneOf2[__$_38__] ,
            oneOf = _findOneOf2[__$_13__] ,
            _type2 = _findOneOf2.type;

        if (schemaPart) {
            return updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(track, [__$_13__] , oneOf, false, { type: _type2, setValue: value }));
        } else console.warn('Type not found in path [' + track.join('/') + ']');
    }
    if (isSelfManaged(branch)) {
        
        state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(track, [__$_8__] , value, replace));
    } else {
        if (commonLib_2[__$_22__] (value)) {
            
            if (type == 'array' && !commonLib_2[__$_1__] (value[__$_0__] )) state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(track, [__$_0__] , value[__$_0__] ));
            commonLib_1[__$_7__] (value)[__$_3__] (function (key) {
                return state = updateCurrentPROCEDURE(state, schema, UPDATABLE_object, value[key], commonLib_1[__$_2__] (replace, key), track[__$_5__] (key));
            });
        }
    }
    return state;
}
function getUpdValue(states) {
    for (var _len2 = arguments[__$_0__] , pathes = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        pathes[_key2 - 1] = arguments[_key2];
    }

    for (var i = 0; i < states[__$_0__] ; i++) {
        if (commonLib_1[__$_29__] .apply(commonLib_1, [states[i]][__$_5__] (pathes))) return commonLib_1[__$_2__] .apply(commonLib_1, [states[i]][__$_5__] (pathes));
    }
}
exports.getUpdValue = getUpdValue;
function splitValuePROCEDURE(state, schema, UPDATABLE_object, item) {
    var itemValue = item[__$_8__] ,
        path = item[__$_19__] ,
        replace = item[__$_10__] ;

    var keyPath = item[SymData] || [];
    if (keyPath[__$_0__]  == 0) {
        var value = itemValue[__$_8__] ,
            status = itemValue.status,
            length = itemValue[__$_0__] ,
            oneOf = itemValue[__$_13__] ,
            rest = __rest(itemValue, ["value", "status", "length", "oneOf"]);

        ['value', 'status', 'length', 'oneOf'][__$_3__] (function (key) {
            if (commonLib_1[__$_29__] (itemValue, key)) state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(path, [key], itemValue[key], commonLib_1[__$_2__] (replace, key)));
        });
        if (commonLib_1[__$_7__] (rest)[__$_0__] ) state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(path, keyPath, rest, replace));
    } else {
        commonLib_1[__$_7__] (itemValue)[__$_3__] (function (key) {
            state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate(path, keyPath[__$_5__] (key), itemValue[key], commonLib_1[__$_2__] (replace, key)));
        });
    }
    return state;
}
function updateNormalizationPROCEDURE(state, schema, UPDATABLE_object, item) {
    var items = normalizeUpdate(item, state);
    items[__$_3__] (function (i) {
        if (i[__$_19__] .length === 0 && i[SymData][0] == 'current') {
            i[__$_27__]  = 'setCurrent';
            i[__$_19__]  = i[SymData][__$_17__] (1);
            i[SymData] = [];
        }
        if (i[SymData][0] == 'value') {
            i[__$_27__]  = 'setCurrent';
            i[__$_19__]  = i[__$_19__] .concat(i[SymData][__$_17__] (1));
            i[SymData] = [];
        } else if (i[SymData][0] == 'status') {
            console.warn('Status should not be changed through StateApi. Update ignored.');
            return;
        } else if (i[SymData][0] == 'oneOf') {
            i[__$_27__]  = 'setOneOf';
        }
        state = updateStatePROCEDURE(state, schema, UPDATABLE_object, i);
    });
    return state;
}
function setUPDATABLE(UPDATABLE_object, update, replace) {
    for (var _len3 = arguments[__$_0__] , pathes = Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) {
        pathes[_key3 - 3] = arguments[_key3];
    }

    commonLib_1[__$_21__] .apply(commonLib_1, [UPDATABLE_object, update, 'update'][__$_5__] (pathes));
    if (replace) commonLib_1[__$_21__] .apply(commonLib_1, [UPDATABLE_object, replace, 'replace'][__$_5__] (pathes));
}
exports.setUPDATABLE = setUPDATABLE;
function mergeStatePROCEDURE(state, UPDATABLE_object) {
    state = commonLib_1[__$_11__] (state, UPDATABLE_object[__$_15__] , { replace: UPDATABLE_object[__$_10__]  });
    UPDATABLE_object[__$_15__]  = {};
    UPDATABLE_object[__$_10__]  = {};
    return state;
}
exports.mergeStatePROCEDURE = mergeStatePROCEDURE;
function updateStatePROCEDURE(state, schema, UPDATABLE_object, item) {
    var update = UPDATABLE_object[__$_15__] ,
        replace_UPDATABLE = UPDATABLE_object[__$_10__] ;
    

    if (!isNUpdate(item)) return updateNormalizationPROCEDURE(state, schema, UPDATABLE_object, item);
    
    if (item[__$_27__] ) {
        var macro = Macros[item[__$_27__] ];
        if (!macro) throw new Error('"' + macro + '" not found in macros');
        return macro(state, schema, UPDATABLE_object, item);
    }
    var value = item[__$_8__] ,
        path = item[__$_19__] ,
        replace = item[__$_10__] ;

    var keyPath = item[SymData];
    if (path[__$_0__]  == 0 && keyPath[0] == 'inital') {
        state = commonLib_1[__$_11__] (state, commonLib_1[__$_12__] (SymData, keyPath, value), { replace: commonLib_1[__$_12__] (SymData, keyPath, replace) });
    } else {
        
        if (commonLib_2[__$_18__] (value) && (keyPath[__$_0__]  == 0 && (commonLib_1[__$_29__] (value, 'value') || commonLib_1[__$_29__] (value, 'status') || commonLib_1[__$_29__] (value, 'length') || commonLib_1[__$_29__] (value, 'oneOf')) || keyPath[__$_0__]  == 1 && keyPath[0] == 'status')) return splitValuePROCEDURE(state, schema, UPDATABLE_object, item);
        var branch = commonLib_1[__$_2__] (state, path);
        if (!commonLib_2[__$_18__] (branch)) return state; 
        if (keyPath[0] == 'value' && !commonLib_1[__$_29__] (branch, SymData, 'value')) 
            return Macros.setCurrent(state, schema, UPDATABLE_object, { value: value, replace: replace, path: path[__$_5__] (keyPath[__$_17__] (1)) });
        
        setUPDATABLE(UPDATABLE_object, value, replace, path, SymData, keyPath);
        
        
        
        if (keyPath[0] == 'value') {
            
            state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate([], commonLib_1[__$_4__] ([__$_16__] , path, keyPath[__$_17__] (1)), value, replace));
        } else if (keyPath[0] == 'length') {
            
            state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate([], commonLib_1[__$_4__] ([__$_16__] , path, keyPath), value, replace));
            var start = branch[SymData][__$_0__] ;
            start = Math.max(start, 0);
            var end = Math.max(value || 0);
            
            
            var oneOfStateFn = oneOfStructure(state, path);
            var maps2enable = [];
            var maps2disable = [];
            for (var i = start; i < end; i++) {
                var elemPath = path[__$_5__] (i);
                if (item[__$_32__] ) oneOfStateFn(elemPath, { oneOf: item[__$_32__]  });

                var _makeStateBranch4 = makeStateBranch(schema, oneOfStateFn, elemPath),
                    _branch = _makeStateBranch4.state,
                    _makeStateBranch4$dat = _makeStateBranch4[__$_36__] ,
                    _dataMap = _makeStateBranch4$dat === undefined ? [] : _makeStateBranch4$dat,
                    defaultValues = _makeStateBranch4[__$_14__] ;

                _branch = commonLib_1[__$_11__] (_branch, _defineProperty({}, SymData, { params: { uniqKey: getUniqKey() } }));
                state = commonLib_1[__$_11__] (state, commonLib_1[__$_21__] ({}, _branch, elemPath), { replace: commonLib_1[__$_21__] ({}, true, elemPath) });
                state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate([], commonLib_1[__$_4__] ([__$_16__] , elemPath), defaultValues, true));
                
                commonLib_1[__$_4__] (maps2enable, _dataMap);
                
                state = Macros[__$_23__] (state, schema, UPDATABLE_object, makeNUpdate(path, ['status', 'untouched'], 1));
            }
            for (var _i = end; _i < start; _i++) {
                var _elemPath = path[__$_5__] (_i);
                commonLib_1[__$_4__] (maps2disable, commonLib_1[__$_2__] (state, _elemPath, SymDataMapTree, SymData) || []);
                ['invalid', 'dirty', 'untouched', 'pending'][__$_3__] (function (key) {
                    var statusValue = getUpdValue([update, state], path, SymData, 'status', key);
                    if (statusValue) state = Macros[__$_23__] (state, schema, UPDATABLE_object, makeNUpdate(path, ['status', key], -1));
                });
                setUPDATABLE(UPDATABLE_object, SymDelete, true, _elemPath);
                
                
            }
            var schemaPart = getSchemaPart(schema, path, oneOfFromState(state));
            commonLib_1[__$_21__] (update, isArrayCanAdd(schemaPart, end), path, SymData, 'fData', 'canAdd');
            for (var _i2 = Math.max(Math.min(start, end) - 1, 0); _i2 < end; _i2++) {
                setUPDATABLE(UPDATABLE_object, getArrayItemData(schemaPart, _i2, end), true, path, _i2, SymData, 'arrayItem');
            }state = mergeStatePROCEDURE(state, UPDATABLE_object);
            state = setDataMapInState(state, schema, maps2disable, true);
            state = setDataMapInState(state, schema, maps2enable);
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
            var oldBranch = commonLib_1[__$_2__] (state, path);
            var oldOneOf = commonLib_1[__$_2__] (oldBranch, SymData, 'oneOf') || 0;
            var newOneOf = commonLib_1[__$_2__] (UPDATABLE_object[__$_15__] , path, SymData, 'oneOf');
            if (oldOneOf != newOneOf || item.type && item.type != commonLib_1[__$_2__] (oldBranch, SymData, 'fData', 'type')) {
                setIfNotDeeper(UPDATABLE_object, SymReset, 'forceCheck', item[__$_19__] );
                state = mergeStatePROCEDURE(state, UPDATABLE_object);
                state = setDataMapInState(state, schema, commonLib_1[__$_2__] (state, path, SymDataMapTree, SymData) || [], true);

                var _makeStateBranch5 = makeStateBranch(schema, oneOfStructure(state, path), path, item[__$_30__] ),
                    _branch2 = _makeStateBranch5.state,
                    _makeStateBranch5$dat = _makeStateBranch5[__$_36__] ,
                    _maps2enable = _makeStateBranch5$dat === undefined ? [] : _makeStateBranch5$dat,
                    defaultValues = _makeStateBranch5[__$_14__] ;

                var _a = oldBranch[SymData],
                    v1 = _a[__$_8__] ,
                    v2 = _a[__$_0__] ,
                    v3 = _a[__$_13__] ,
                    v4 = _a[__$_26__] ,
                    previousBranchData = __rest(_a, ["value", "length", "oneOf", "fData"]); 
                if (!isSelfManaged(oldBranch) || !isSelfManaged(_branch2)) delete previousBranchData.status; 
                _branch2 = commonLib_1[__$_11__] (_branch2, _defineProperty({}, SymData, previousBranchData), { arrays: 'replace' });
                if (path[__$_0__] ) {
                    var topPath = path[__$_17__] ();
                    var field = topPath.pop();
                    ['invalid', 'dirty', 'pending'][__$_3__] (function (key) {
                        var oldStatusValue = commonLib_1[__$_2__] (oldBranch, SymData, 'status', key);
                        var newStatusValue = commonLib_1[__$_2__] (_branch2, SymData, 'status', key);
                        if (!oldStatusValue != !newStatusValue) state = Macros[__$_23__] (state, schema, UPDATABLE_object, makeNUpdate(topPath, ['status', key], newStatusValue ? 1 : -1));
                    });
                    var arrayOfRequired = commonLib_1[__$_2__] (state, topPath, SymData, 'fData', 'required');
                    arrayOfRequired = commonLib_2[__$_9__] (arrayOfRequired) && arrayOfRequired[__$_0__]  && arrayOfRequired;
                    if (arrayOfRequired && ~arrayOfRequired[__$_25__] (field)) _branch2 = commonLib_1[__$_11__] (_branch2, _defineProperty({}, SymData, { fData: { required: true } }));
                }
                if (commonLib_1[__$_2__] (oldBranch, SymData, 'status', 'untouched') == 0) _branch2 = commonLib_1[__$_11__] (_branch2, _defineProperty({}, SymData, { status: { untouched: 0 } })); 
                state = commonLib_1[__$_11__] (state, commonLib_1[__$_21__] ({}, _branch2, path), { replace: commonLib_1[__$_21__] ({}, true, path) });
                state = setDataMapInState(state, schema, _maps2enable);
                if (commonLib_1[__$_2__] (_branch2, SymData, 'status', 'untouched') == 0) state = Macros.switch(state, schema, UPDATABLE_object, makeNUpdate(path, ['status', 'untouched'], 0));
                state = updateStatePROCEDURE(state, schema, UPDATABLE_object, makeNUpdate([], commonLib_1[__$_4__] ([__$_16__] , path), defaultValues, true));
            }
        }
    }
    
    var dataMap = commonLib_1[__$_2__] (state, path, SymDataMapTree);
    for (var _i3 = 0; _i3 < keyPath[__$_0__] ; _i3++) {
        if (!dataMap) break;
        state = executeDataMapsPROCEDURE(state, schema, UPDATABLE_object, dataMap[SymDataMap], makeNUpdate(path, keyPath[__$_17__] (0, _i3), commonLib_1[__$_21__] ({}, value, keyPath[__$_17__] (_i3)), commonLib_1[__$_21__] ({}, replace, keyPath[__$_17__] (_i3))));
        dataMap = dataMap[keyPath[_i3]];
    }
    if (dataMap) state = recursivelyExecuteDataMaps(dataMap, value, replace, keyPath);
    function recursivelyExecuteDataMaps(dataMap, value, replace) {
        var track = arguments[__$_0__]  > 3 && arguments[3] !== undefined ? arguments[3] : [];

        state = executeDataMapsPROCEDURE(state, schema, UPDATABLE_object, dataMap[SymDataMap], makeNUpdate(path, track, value, replace));
        commonLib_2[__$_22__] (value) && commonLib_1[__$_7__] (dataMap)[__$_3__] (function (key) {
            return value[__$_28__] (key) && (state = recursivelyExecuteDataMaps(dataMap[key], value[key], commonLib_1[__$_2__] (replace, key), track[__$_5__] (key)));
        });
        return state;
    }
    return state;
}
exports.updateStatePROCEDURE = updateStatePROCEDURE;

function executeDataMapsPROCEDURE(state, schema, UPDATABLE_object, maps, item) {
    var value = item[__$_8__] ,
        path = item[__$_19__] ,
        replace = item[__$_10__] ;

    var keyPath = item[SymData] || [];
    commonLib_1[__$_7__] (maps || {})[__$_3__] (function (pathTo) {
        if (!maps[pathTo]) return; 
        var map = maps[pathTo];
        var NpathTo = path2string(normalizePath(pathTo, path));
        var executedValue = value;
        if (commonLib_2[__$_18__] (map)) {
            var bindObj = { path: NUpdate2string(item), pathTo: NpathTo, schema: schema, getFromState: getFrom4DataMap(state, UPDATABLE_object) };
            executedValue = commonLib_1.deArray(commonLib_1.toArray(map.$).reduce(function (args, fn) {
                return commonLib_1.toArray(fn.call.apply(fn, [bindObj][__$_5__] (_toConsumableArray(args))));
            }, commonLib_1[__$_4__] ([executedValue], map.args)));
        }
        var updates = map.asUpdates ? commonLib_1.toArray(executedValue) : [{ path: NpathTo, value: executedValue, replace: replace }];
        updates[__$_3__] (function (update) {
            return state = updateStatePROCEDURE(state, schema, UPDATABLE_object, update);
        });
    });
    return state;
}
function getFrom4DataMap(state, UPDATABLE_object) {
    return function () {
        for (var _len4 = arguments[__$_0__] , tPath = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            tPath[_key4] = arguments[_key4];
        }

        if (commonLib_1[__$_29__] .apply(commonLib_1, [UPDATABLE_object[__$_15__] ][__$_5__] (_toConsumableArray(tPath.map(function (path) {
            return normalizePath(path);
        }))))) return commonLib_1[__$_11__] (getFromState.apply(undefined, [state][__$_5__] (tPath)), getFromState.apply(undefined, [UPDATABLE_object[__$_15__] ][__$_5__] (tPath)), { replace: getFromState.apply(undefined, [UPDATABLE_object[__$_10__] ][__$_5__] (tPath)) });
        return getFromState.apply(undefined, [state][__$_5__] (tPath));
    };
}
function getDefaultFromSchema(schema) {
    return makeStateFromSchema(schema)[SymData][__$_16__] ;
}
exports.getDefaultFromSchema = getDefaultFromSchema;
function object2PathValues(vals) {
    var options = arguments[__$_0__]  > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var track = arguments[__$_0__]  > 2 && arguments[2] !== undefined ? arguments[2] : [];

    var fn = options.symbol ? commonLib_1.objKeysNSymb : commonLib_1[__$_7__] ;
    var check = options.arrayAsValue ? commonLib_2[__$_18__]  : commonLib_2[__$_22__] ;
    var result = [];
    fn(vals)[__$_3__] (function (key) {
        var path = track[__$_5__] (key);
        if (check(vals[key])) object2PathValues(vals[key], options, path)[__$_3__] (function (item) {
            return result.push(item);
        }); 
        else result.push(commonLib_1[__$_4__] (path, vals[key]));
    });
    if (!result[__$_0__] ) return [commonLib_1[__$_4__] (track[__$_17__] (), {})]; 
    return result;
}
exports.object2PathValues = object2PathValues;
function isNPath(path) {
    return commonLib_1[__$_2__] (path, SymData) === 'nPath';
}
exports.isNPath = isNPath;
function normalizePath(path) {
    var base = arguments[__$_0__]  > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var result = resolvePath(flattenPath(path), base[__$_0__]  ? flattenPath(base) : []);
    result[SymData] = 'nPath';
    return result;
}
exports.normalizePath = normalizePath;
function normalizeUpdate(update, state) {
    var path = update[__$_19__] ,
        value = update[__$_8__] ,
        replace = update[__$_10__] ,
        base = update.base,
        rest = __rest(update, ["path", "value", "replace", "base"]);

    var result = [];
    var pathes = normalizePath(path, base);
    var keyPathes = [];
    var a = pathes[__$_25__] (SymData);
    if (~a) {
        keyPathes = pathes[__$_17__] (a + 1);
        pathes = pathes[__$_17__] (0, a);
    }
    pathes = multiplyPath(pathes, { '*': function _(path) {
            return branchKeys(commonLib_1[__$_2__] (state, path)).join(',');
        } });
    keyPathes = multiplyPath(keyPathes);
    commonLib_1[__$_7__] (pathes)[__$_3__] (function (p) {
        return commonLib_1[__$_7__] (keyPathes)[__$_3__] (function (k) {
            return result.push(makeNUpdate(pathes[p], keyPathes[k], value, replace, rest));
        });
    });
    return result;
}
exports.normalizeUpdate = normalizeUpdate;
function string2NUpdate(path) {
    var base = arguments[__$_0__]  > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var rest = arguments[__$_0__]  > 2 && arguments[2] !== undefined ? arguments[2] : {};

    path = normalizePath(path, base);
    var keyPath = [];
    var a = path[__$_25__] (SymData);
    if (~a) {
        keyPath = path[__$_17__] (a + 1);
        path = path[__$_17__] (0, a);
    }

    var value = rest[__$_8__] ,
        replace = rest[__$_10__] ,
        r = __rest(rest, ["value", "replace"]);

    return makeNUpdate(path, keyPath, value, replace, r);
}
exports.string2NUpdate = string2NUpdate;



function NUpdate2string(item) {
    var path = path2string(item[__$_19__] );
    return path + (item.keyPath && !~path[__$_25__] ('@') ? '/@/' + path2string(item.keyPath) : '');
}
var makeNUpdate = function makeNUpdate(path, keyPath, value, replace) {
    var _Object$assign;

    var rest = arguments[__$_0__]  > 4 && arguments[4] !== undefined ? arguments[4] : {};
    return Object.assign((_Object$assign = { path: path }, _defineProperty(_Object$assign, SymData, keyPath), _defineProperty(_Object$assign, "value", value), _defineProperty(_Object$assign, "replace", replace), _Object$assign), rest);
};
exports.makeNUpdate = makeNUpdate;
function isNUpdate(updateItem) {
    return !commonLib_2[__$_1__] (commonLib_1[__$_2__] (updateItem, SymData)) && commonLib_2[__$_9__] (updateItem[SymData]);
}
function multiplyPath(path) {
    var strReplace = arguments[__$_0__]  > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var result = { '': [] };
    path[__$_3__] (function (value) {
        var res = {};
        value = strReplace[value] || value;
        if (typeof value == 'string' && ~value[__$_25__] (',')) {
            commonLib_1[__$_7__] (result)[__$_3__] (function (key) {
                return value.split(',')[__$_3__] (function (k) {
                    return res[key && key + ',' + k || k] = result[key][__$_5__] (k.trim());
                });
            });
        } else if (typeof value == 'function') {
            commonLib_1[__$_7__] (result)[__$_3__] (function (key) {
                var tmp = value(result[key]);
                if (typeof tmp == 'string') tmp = string2path(tmp);
                tmp = multiplyPath(tmp, strReplace);
                commonLib_1[__$_7__] (tmp)[__$_3__] (function (k) {
                    return res[key && key + (k ? ',' + k : '') || k] = result[key][__$_5__] (tmp[k]);
                });
            });
        } else commonLib_1[__$_7__] (result)[__$_3__] (function (key) {
            return commonLib_1[__$_4__] (result[key], value);
        });
        if (commonLib_1[__$_7__] (res)[__$_0__] ) result = res;
    });
    return result;
}
exports.multiplyPath = multiplyPath;
var num2string = function num2string(value) {
    return typeof value == 'number' ? value[__$_37__] () : value;
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

    for (var _len5 = arguments[__$_0__] , pathes = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
        pathes[_key5 - 2] = arguments[_key5];
    }

    var path = flattenPath(pathes);
    var result = state;
    for (var i = 0; i < path[__$_0__]  - 1; i++) {
        if (result[path[i]] === value) return state;
        if (!commonLib_2[__$_18__] (result[path[i]])) result[path[i]] = {};
        result = result[path[i]];
    }
    if (path[__$_0__] ) result[path[path[__$_0__]  - 1]] = value;else return value;
    return state;
}
exports.setIfNotDeeper = setIfNotDeeper;
function flattenPath(path) {
    if (commonLib_2[__$_9__] (path)) {
        var result = [];
        commonLib_1[__$_4__] .apply(commonLib_1, [result][__$_5__] (_toConsumableArray(path.map(flattenPath))));
        return result;
    } else if (typeof path == 'string') return string2path(path);
    return [path];
}
function path2string(path) {
    return commonLib_2[__$_9__] (path) ? path.map(path2string).join('/') : symConv.sym2str(path);
}
exports.path2string = path2string;
function string2path(path) {
    path = path[__$_10__] (symConv(SymData), '/' + symConv(SymData) + '/');
    path = path[__$_10__] (/\/+/g, '/');
    var result = [];
    path.split('/')[__$_3__] (function (key) {
        return key && (key = symConv.str2sym(key.trim())) && result.push(key);
    });
    return result;
}
exports.string2path = string2path;
function getFromState(state) {
    for (var _len6 = arguments[__$_0__] , pathes = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
        pathes[_key6 - 1] = arguments[_key6];
    }

    return commonLib_1[__$_2__] .apply(commonLib_1, [state][__$_5__] (_toConsumableArray(pathes.map(function (path) {
        return normalizePath(path);
    }))));
}
exports.getFromState = getFromState;
var objMap = function objMap(object, fn) {
    return commonLib_1[__$_7__] (object).reduce(function (result, key) {
        return ((result[key] = fn(object[key], key, object)) || true) && result;
    }, commonLib_2[__$_9__] (object) ? [] : {});
};
exports.objMap = objMap;