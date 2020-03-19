"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_ts_utils_1 = require("react-ts-utils");
const react_ts_utils_2 = require("react-ts-utils");
const api_1 = require("./api");
/////////////////////////////////////////////
//  Symbols
/////////////////////////////////////////////
const SymData = Symbol.for('FFormData');
exports.SymData = SymData;
const SymDataMapTree = Symbol.for('FFormDataMapTree');
const SymDataMap = Symbol.for('FFormDataMap');
exports.SymDataMap = SymDataMap;
const SymReset = Symbol.for('FFormReset');
exports.SymReset = SymReset;
const SymClear = Symbol.for('FFormClear');
exports.SymClear = SymClear;
const SymDelete = undefined; // Symbol.for('FFormDelete'); //
exports.SymDelete = SymDelete;
// const SymBranch: any = Symbol.for('FFormBranch');
/////////////////////////////////////////////
//  JSON types detector
/////////////////////////////////////////////
const types = ['null', 'boolean', 'integer', 'number', 'string', 'array', 'object'];
exports.types = types;
types.any = () => true;
types.null = (value) => value === null;
types.boolean = (value) => typeof value === "boolean";
types.number = react_ts_utils_2.isNumber; // (value: any) => typeof value === "number";
types.integer = react_ts_utils_2.isInteger; //(value: any) => typeof value === "number" && (Math.floor(value) === value || value > 9007199254740992 || value < -9007199254740992);
types.string = react_ts_utils_2.isString; //(value: any) => typeof value === "string";
types.array = react_ts_utils_2.isArray;
types.object = react_ts_utils_2.isObject; //(value: any) => typeof value === "object" && value && !isArray(value);// isObject(value);  //
types.empty = { 'any': null, 'null': null, 'boolean': false, 'number': 0, 'integer': 0, 'string': '', array: Object.freeze([]), object: Object.freeze({}) };
types.detect = (value) => {
    for (let i = 0; i < types.length; i++) {
        if (types[types[i]](value))
            return types[i];
    }
};
/////////////////////////////////////////////
//  Macros
/////////////////////////////////////////////
function getBindedMaps2update(branch, path = []) {
    const maps2disable = react_ts_utils_1.getIn(branch, SymDataMapTree, SymData) || [];
    const maps2enable = maps2disable.map((map => react_ts_utils_1.merge(map, { emitter: path })));
    let clearBinded = (maps2disable.length) ? { [SymDataMapTree]: { [SymData]: [] } } : undefined;
    react_ts_utils_1.objKeys(branch).forEach(key => {
        let result;
        if (branch[key]) {
            result = getBindedMaps2update(branch[key], path.concat(key));
            react_ts_utils_1.push2array(maps2disable, result.maps2disable);
            react_ts_utils_1.push2array(maps2enable, result.maps2enable);
            if (result.clearBinded) {
                if (!clearBinded)
                    clearBinded = {};
                clearBinded[key] = result.clearBinded;
            }
        }
    });
    return { maps2disable, maps2enable, clearBinded };
}
const Macros = {};
Macros.array = (state, schema, UPDATABLE, item) => {
    let _a = item, { path, macros, value } = _a, _b = SymData, sym = _a[_b], rest = __rest(_a, ["path", "macros", "value", typeof _b === "symbol" ? _b : _b + ""]);
    let length = getUpdValue([UPDATABLE.update, state], path, SymData, 'length');
    if (!react_ts_utils_2.isNumber(length))
        return state;
    if (react_ts_utils_2.isArray(item.value)) {
        let mergeArrayObj = [];
        let replaceArrayObj = {};
        for (let i = 0; i < item.value.length; i++) {
            mergeArrayObj[length + i] = item.value[i];
            replaceArrayObj[length + i] = react_ts_utils_1.getIn(item.replace, i);
        }
        mergeArrayObj.length = length + item.value.length;
        return updateCurrentPROC(state, UPDATABLE, mergeArrayObj, replaceArrayObj, path, item.setOneOf);
    }
    else {
        length += item.value || 1;
        if (length < 0)
            length = 0;
        return updatePROC(state, UPDATABLE, makeNUpdate(path, ['length'], length, false, rest));
    }
};
Macros.arrayItem = (state, schema, UPDATABLE, item) => {
    let path = item.path;
    let op = item.op;
    let opVal = item.value || 0;
    const from = parseInt(path.pop());
    let to = from;
    const min = arrayStart(getSchemaPart(schema, path, oneOfFromState(state))); // api.get(path.concat(SymData, 'array', 'arrayStartIndex'));
    const length = getUpdValue([UPDATABLE.update, state], path, SymData, 'length');
    const max = length - 1;
    if (op == 'up')
        to--;
    if (op == 'down')
        to++;
    if (op == 'first')
        to = min;
    if (op == 'last' || op == 'del')
        to = max;
    if (op == 'move')
        to = opVal;
    if (op == 'shift')
        to += opVal;
    if (to < min)
        to = min;
    if (to > max)
        to = max;
    let stateObject = {};
    let arrayItems = {};
    let dataMaps = {};
    let currentObject = {};
    let updObj = [];
    updObj[0] = react_ts_utils_1.getIn(UPDATABLE.update, path);
    updObj[1] = react_ts_utils_1.getIn(UPDATABLE.update, SymData, 'current', path);
    updObj[2] = react_ts_utils_1.getIn(UPDATABLE.replace, path);
    updObj[3] = react_ts_utils_1.getIn(UPDATABLE.replace, SymData, 'current', path);
    let keys = [...getFromUPD(state, UPDATABLE)(path, SymData, 'keys')];
    for (let i = Math.min(from, to); i <= Math.max(from, to); i++) {
        stateObject[i] = react_ts_utils_1.getIn(state, path, i);
        arrayItems[i] = stateObject[i][SymData].arrayItem; //delIn(stateObject[i][SymData].arrayItem, ['uniqId']); // save arrayItem values, except "uniqId"
        //dataMaps[i] = stateObject[i][SymDataMapTree];
        currentObject[i] = react_ts_utils_1.getIn(state, SymData, 'current', path, i);
        updObj.forEach(obj => react_ts_utils_2.isMergeable(obj) && !obj.hasOwnProperty(i) && (obj[i] = SymClear));
    }
    stateObject = react_ts_utils_1.moveArrayElems(stateObject, from, to);
    currentObject = react_ts_utils_1.moveArrayElems(currentObject, from, to);
    keys = react_ts_utils_1.moveArrayElems(keys, from, to);
    const { maps2disable, maps2enable, clearBinded } = getBindedMaps2update(stateObject, path);
    if (clearBinded)
        stateObject = react_ts_utils_1.merge(stateObject, clearBinded);
    updObj.forEach(obj => {
        if (!react_ts_utils_2.isMergeable(obj))
            return;
        react_ts_utils_1.moveArrayElems(obj, from, to);
        for (let i = Math.min(from, to); i <= Math.max(from, to); i++) {
            if (obj[i] === SymClear)
                delete obj[i];
        }
    });
    react_ts_utils_1.objKeys(stateObject).forEach(i => {
        stateObject[i] = react_ts_utils_1.merge(stateObject[i], makeSlice(SymData, 'arrayItem', arrayItems[i]), { replace: makeSlice(SymData, 'arrayItem', true) });
        //stateObject[i] = merge(stateObject[i], makeSlice(SymDataMapTree, dataMaps[i]), {replace: makeSlice(SymDataMapTree, true)});
    }); // restore arrayItem values and dataMap
    // const length2test = 1 + item.path.length - (item.path[0] == '#' ? 1 : 0);  // length2test can be smaller because of leading '#' in item.path (replace function receives path without leading '#')
    state = react_ts_utils_1.merge(state, makeSlice(path, stateObject), { replace: trueIfLength(item.path.length + 1) }); //(path: Path) => path.length === length2test});
    state = react_ts_utils_1.merge(state, makeSlice(SymData, 'current', path, currentObject), { replace: trueIfLength(item.path.length + 3) }); //(path: Path) => path.length === length2test + 2});
    state = updatePROC(state, UPDATABLE, makeNUpdate(path, ['keys'], keys));
    if (op == 'del')
        state = updatePROC(state, UPDATABLE, makeNUpdate(path, ['length'], max));
    state = mergeUPD_PROC(state, UPDATABLE);
    state = setDataMapInState(state, UPDATABLE, maps2disable, true);
    state = setDataMapInState(state, UPDATABLE, maps2enable);
    return state;
};
Macros.switch = (state, schema, UPDATABLE, item) => {
    let keyPath = item[SymData] || [];
    let switches = makeSlice(keyPath, item.value);
    object2PathValues(switches, { arrayAsValue: true }).forEach(pathValue => state = recursivelyUpdate(state, schema, UPDATABLE, makeNUpdate(item.path, pathValue, pathValue.pop())));
    return state;
};
Macros.setExtraStatus = (state, schema, UPDATABLE, item) => {
    const keyPath = item[SymData] || [];
    let prevVal = getUpdValue([UPDATABLE.update, state], item.path, SymData, keyPath);
    let value = item.value > 0;
    if (!prevVal == value) {
        state = updatePROC(state, UPDATABLE, makeNUpdate(item.path, keyPath, value));
        state = Macros.setStatus(state, schema, UPDATABLE, makeNUpdate(item.path, ['status', keyPath[keyPath.length - 1]], value ? 1 : -1));
    }
    return state;
};
Macros.setStatus = (state, schema, UPDATABLE, item) => {
    const keyPath = item[SymData] || [];
    if (keyPath.length > 2)
        return Macros.setExtraStatus(state, schema, UPDATABLE, item);
    let op = keyPath[1];
    if (!op)
        return state;
    if (op == 'valid' || op == 'pristine' || op == 'touched')
        throw new Error('Setting "' + op + '" directly is not allowed');
    let prevVal = getUpdValue([UPDATABLE.update, state], item.path, SymData, keyPath);
    const selfManaged = isSelfManaged(state, item.path);
    if (op == 'untouched' && prevVal == 0 && !selfManaged)
        return state; // stick "untouched" to zero for elements and arrays
    let value = prevVal + item.value;
    if (selfManaged && value > 1)
        value = 1;
    if (value < 0)
        value = 0;
    state = updatePROC(state, UPDATABLE, makeNUpdate(item.path, ['status', op], value));
    if (!isTopPath(item.path) && (!prevVal != !value)) //(prevVal && !value || !prevVal && value))
        state = Macros.setStatus(state, schema, UPDATABLE, makeNUpdate(item.path.slice(0, -1), keyPath, value > 0 ? 1 : -1));
    return state;
};
Macros.setCurrent = (state, schema, UPDATABLE, item) => {
    return updateCurrentPROC(state, UPDATABLE, item.value, item.replace, item.path, item.setOneOf);
};
Macros.setOneOf = (state, schema, UPDATABLE, item) => {
    let oldOneOf = react_ts_utils_1.getIn(state, item.path, SymData, 'oneOf');
    if (oldOneOf == item.value) {
        if (!react_ts_utils_2.isUndefined(item.setValue))
            state = updateCurrentPROC(state, UPDATABLE, item.setValue, false, item.path);
        return state;
    }
    const { macros } = item, newItem = __rest(item, ["macros"]);
    newItem[SymData] = ['oneOf'];
    if (react_ts_utils_2.isUndefined(newItem.setValue)) {
        state = mergeUPD_PROC(state, UPDATABLE);
        newItem.setValue = react_ts_utils_1.getIn(state, SymData, 'current', item.path);
    }
    return updatePROC(state, UPDATABLE, newItem);
};
/////////////////////////////////////////////
//  Macros utils
/////////////////////////////////////////////
function recursivelyUpdate(state, schema, UPDATABLE, item) {
    const branch = react_ts_utils_1.getIn(state, item.path);
    const keys = branchKeys(branch);
    if (item.value == SymReset && item[SymData][0] == 'status') {
        let i = Object.assign({}, item);
        i.value = item[SymData][1] == 'untouched' ? isSelfManaged(branch) ? 1 : keys.length : 0;
        state = updatePROC(state, UPDATABLE, i);
    }
    else
        state = updatePROC(state, UPDATABLE, item);
    keys.forEach(key => state = recursivelyUpdate(state, schema, UPDATABLE, react_ts_utils_1.merge(item, { path: item.path.concat(key) })));
    return state;
}
;
function branchKeys(branch) {
    let keys = [];
    if (isSelfManaged(branch))
        return keys;
    if (branch[SymData].fData.type == 'array')
        for (let j = 0; j < react_ts_utils_1.getIn(branch, SymData, 'length'); j++)
            keys.push(j.toString());
    else
        keys = react_ts_utils_1.objKeys(branch).filter(Boolean);
    return keys;
}
exports.branchKeys = branchKeys;
/////////////////////////////////////////////
//      Schema processing functions
/////////////////////////////////////////////
const schemaStorage = react_ts_utils_1.memoize(function (schema) {
    return {};
});
function oneOfFromState(state) {
    return (path) => {
        let s = react_ts_utils_1.getIn(react_ts_utils_2.isFunction(state) ? state() : state, path, SymData);
        return { oneOf: react_ts_utils_1.getIn(s, 'oneOf'), type: react_ts_utils_1.getIn(s, 'fData', 'type') };
    };
}
exports.oneOfFromState = oneOfFromState;
function oneOfStructure(state, path) {
    if (typeof state == 'function')
        state = state();
    const result = {};
    let tmp = result;
    react_ts_utils_1.setIn(tmp, react_ts_utils_1.getIn(state, SymData, 'oneOf'), SymData, 'oneOf');
    react_ts_utils_1.setIn(tmp, react_ts_utils_1.getIn(state, SymData, 'fData', 'type'), SymData, 'type');
    for (let i = 0; i < path.length; i++) {
        if (react_ts_utils_2.isUndefined(path[i]) || path[i] === '')
            continue;
        tmp[path[i]] = {};
        tmp = tmp[path[i]];
        state = react_ts_utils_1.getIn(state, path[i]);
        react_ts_utils_1.setIn(tmp, react_ts_utils_1.getIn(state, SymData, 'oneOf'), SymData, 'oneOf');
        react_ts_utils_1.setIn(tmp, react_ts_utils_1.getIn(state, SymData, 'fData', 'type'), SymData, 'type');
    }
    //return result
    const fn = function (path, oneOf) { return react_ts_utils_2.isUndefined(oneOf) ? react_ts_utils_1.getIn(result, path, SymData) : react_ts_utils_1.setIn(result, oneOf, path, SymData); };
    fn._canSet = true;
    return fn;
}
const additionalItemsSchema = react_ts_utils_1.memoize(function (items) {
    return {
        _compiled: true,
        oneOf: items,
        _oneOfSelector: normalizeFn(function () {
            return string2path(this.path).pop() % items.length;
        }, { noStrictArrayResult: true })
    };
});
function getSchemaPart(schema, path, value_or_getOneOf, fullOneOf) {
    function getArrayItemSchemaPart(index, schemaPart) {
        let items = [];
        if (schemaPart.items) {
            if (!react_ts_utils_2.isArray(schemaPart.items))
                return schemaPart.items;
            else
                items = schemaPart.items;
        }
        if (index < items.length)
            return items[index];
        else {
            if (schemaPart.additionalItems !== false) {
                if (schemaPart.additionalItems && schemaPart.additionalItems !== true)
                    return schemaPart.additionalItems;
                return additionalItemsSchema(items);
                //return items[index % items.length]
            }
        }
        throw new Error(errorText + path.join('/'));
    }
    function getSchemaByRef(schema, $ref) {
        const path = string2path($ref);
        if ($ref[0] == '#')
            return react_ts_utils_1.getIn(schema, path); // Extract and use the referenced definition if we have it.
        throw new Error(`Can only ref to #`); // No matching definition found, that's an error (bogus schema?)
    }
    function deref(schema, schemaPart) {
        while (schemaPart.$ref)
            schemaPart = getSchemaByRef(schema, schemaPart.$ref);
        return schemaPart;
    }
    function combineSchemasINNER_PROCEDURE(schemaPart) {
        if (schemaPart.$ref || schemaPart.allOf || schemaPart.oneOf) {
            if (combinedSchemas.get(schemaPart))
                schemaPart = combinedSchemas.get(schemaPart);
            else {
                let schemaPartAsKey = schemaPart;
                schemaPart = derefAndMergeAllOf(schema, schemaPart); // merge allOf, with derefing it and merge with schemaPart
                if (schemaPart.oneOf) {
                    let { oneOf } = schemaPart, restSchemaPart = __rest(schemaPart, ["oneOf"]);
                    schemaPart = oneOf.map((oneOfPart, i) => react_ts_utils_1.merge.all(derefAndMergeAllOf(schema, oneOfPart), [restSchemaPart, { _oneOfIndex: i }], { array: 'replace' })); // deref every oneOf, merge allOf in there, and merge with schemaPart
                }
                combinedSchemas.set(schemaPartAsKey, schemaPart);
            }
        }
        return schemaPart;
    }
    function derefAndMergeAllOf(schema, schemaPart) {
        schemaPart = deref(schema, schemaPart);
        if (schemaPart.allOf) {
            let { allOf } = schemaPart, restSchemaPart = __rest(schemaPart, ["allOf"]);
            let result;
            for (let i = 0; i < allOf.length; i++) {
                result = react_ts_utils_1.merge(result, derefAndMergeAllOf(schema, allOf[i]), { array: 'replace' });
            }
            schemaPart = react_ts_utils_1.merge(result, restSchemaPart);
        }
        return schemaPart;
    }
    function detectOneOfNType(schemaPart, valuePart, path) {
        let oneOf = 0, type = types.detect(valuePart);
        if (type) {
            schemaPart = react_ts_utils_1.toArray(schemaPart);
            for (let j = 0; j < schemaPart.length; j++) {
                let types = schemaPart[j].type;
                if (!types || react_ts_utils_1.toArray(types).some(t => (t === type))) {
                    oneOf = j;
                    break;
                }
            }
            if (schemaPart[oneOf]._oneOfSelector) {
                oneOf = processFn.call({ path: path2string(path) }, schemaPart[oneOf]._oneOfSelector, valuePart);
                if (react_ts_utils_2.isArray(oneOf))
                    oneOf = oneOf[0];
            }
        }
        return { oneOf, type };
    }
    const getOneOf = react_ts_utils_2.isFunction(value_or_getOneOf) ? value_or_getOneOf : undefined;
    const value = !react_ts_utils_2.isFunction(value_or_getOneOf) ? value_or_getOneOf : undefined;
    const errorText = 'Schema path not found: ';
    let schemaPart = schema;
    const combinedSchemas = react_ts_utils_1.getSetIn(schemaStorage(schema), new Map(), 'combinedSchemas');
    //let type;
    for (let i = path[0] == '#' ? 1 : 0; i < path.length; i++) {
        if (!schemaPart)
            throw new Error(errorText + path.join('/'));
        schemaPart = combineSchemasINNER_PROCEDURE(schemaPart);
        //let oneOf: number = 0, type: string | undefined;
        let track = path.slice(0, i);
        let { oneOf, type } = getOneOf ? getOneOf(track) : detectOneOfNType(schemaPart, react_ts_utils_1.getIn(value, track), track);
        if (react_ts_utils_2.isArray(schemaPart))
            schemaPart = schemaPart[oneOf || 0];
        if (react_ts_utils_2.isUndefined(type))
            type = react_ts_utils_1.toArray(schemaPart.type || 'null')[0];
        if (type == 'array') {
            if (isNaN(parseInt(path[i])))
                throw new Error(errorText + path.join('/'));
            schemaPart = getArrayItemSchemaPart(path[i], schemaPart);
        }
        else {
            if (schemaPart.properties && schemaPart.properties[path[i]])
                schemaPart = schemaPart.properties[path[i]];
            else
                throw new Error(errorText + path.join('/'));
        }
    }
    schemaPart = combineSchemasINNER_PROCEDURE(schemaPart);
    if (fullOneOf)
        return schemaPart;
    if (react_ts_utils_2.isArray(schemaPart)) {
        let { oneOf, type } = getOneOf ? getOneOf(path) : detectOneOfNType(schemaPart, react_ts_utils_1.getIn(value, path), path);
        schemaPart = schemaPart[oneOf || 0];
    }
    return schemaPart;
}
exports.getSchemaPart = getSchemaPart;
const arrayStart = react_ts_utils_1.memoize(function (schemaPart) {
    if (!react_ts_utils_2.isArray(schemaPart.items))
        return 0;
    if (schemaPart.additionalItems === false)
        return schemaPart.items.length;
    if (typeof schemaPart.additionalItems === 'object')
        return schemaPart.items.length;
    if (schemaPart.items.length == 0)
        return 0;
    return schemaPart.items.length - 1;
});
exports.arrayStart = arrayStart;
const basicStatus = { invalid: 0, dirty: 0, untouched: 1, pending: 0, valid: true, touched: false, pristine: true };
const makeDataStorage = react_ts_utils_1.memoize(function (schemaPart, oneOf, type, value = schemaPart.default) {
    // const x = schemaPart.x || ({} as FFSchemaExtensionType);
    const { _params = {}, _data = {} } = schemaPart;
    let result = Object.assign({ params: _params }, _data);
    if (!react_ts_utils_2.isObject(result.messages))
        result.messages = {};
    if (react_ts_utils_2.isUndefined(value))
        value = types.empty[type || 'any'];
    result.oneOf = oneOf;
    result.status = basicStatus;
    if (!react_ts_utils_2.isObject(result.fData))
        result.fData = {};
    const fData = result.fData;
    fData.type = type;
    fData.required = schemaPart.required;
    fData.title = schemaPart.title;
    fData.placeholder = schemaPart._placeholder;
    fData.additionalProperties = schemaPart.additionalProperties;
    fData.strictLayout = schemaPart._strictLayout;
    // fData.default = isUndefined(schemaPart.default) ? types.empty[type || 'any'] : schemaPart.default;
    if (schemaPart.enum)
        fData.enum = schemaPart.enum;
    if (schemaPart._enumExten)
        fData.enumExten = schemaPart._enumExten;
    if (react_ts_utils_2.isArray(schemaPart._enumExten) && react_ts_utils_2.isArray(schemaPart.enum)) {
        let enumExten = {};
        fData.enumExten = fData.enumExten.map((v) => react_ts_utils_2.isString(v) ? { label: v } : v);
        fData.enum.forEach((v, i) => enumExten[v] = fData.enumExten[i]);
        fData.enumExten = enumExten;
    }
    else if (schemaPart._enumExten && !fData.enum) {
        if (react_ts_utils_2.isArray(fData.enumExten)) {
            let enumExten = {};
            let _enum = [];
            fData.enumExten.forEach((v) => {
                // if (!isString(v) && !v) return;
                if (react_ts_utils_2.isString(v)) {
                    enumExten[v] = { label: v };
                    _enum.push(v);
                }
                else if (react_ts_utils_2.isObject(v)) {
                    if (!react_ts_utils_2.isUndefined(v.value)) {
                        if (react_ts_utils_2.isUndefined(v.label))
                            v = Object.assign(Object.assign({}, v), { label: v.value });
                        enumExten[v.value] = v;
                        _enum.push(v.value);
                    }
                    else if (!react_ts_utils_2.isUndefined(v.label)) {
                        enumExten[v.label] = v;
                        _enum.push(v.label);
                    }
                }
            });
            fData.enumExten = enumExten;
            fData.enum = _enum;
        }
        else
            fData.enum = react_ts_utils_1.objKeys(fData.enumExten).filter(k => fData.enumExten[k]);
    }
    if (schemaPart._oneOfSelector)
        fData.oneOfSelector = true;
    if (isSchemaSelfManaged(schemaPart, type))
        result.value = value;
    else
        delete result.value;
    let untouched = 1;
    if (type == 'array') {
        result.length = react_ts_utils_1.getIn(value, 'length') || 0;
        if (!react_ts_utils_2.isUndefined(schemaPart.minItems) && result.length < schemaPart.minItems)
            result.length = schemaPart.minItems;
        result.fData.canAdd = isArrayCanAdd(schemaPart, result.length);
        untouched = result.length;
    }
    else if (type == 'object')
        untouched = react_ts_utils_1.objKeys(schemaPart.properties || {}).length;
    if (untouched != 1)
        result.status = Object.assign(Object.assign({}, result.status), { untouched });
    if (schemaPart._data$) {
        let res = [];
        react_ts_utils_1.objKeys(schemaPart._data$).forEach((k) => react_ts_utils_1.push2array(res, processFn.call({}, schemaPart._data$[k], schemaPart)));
        result = react_ts_utils_1.merge(result, res);
    }
    return result;
});
function getUniqKey() { return Date.now().toString(36) + Math.random().toString(36); }
exports.getUniqKey = getUniqKey;
function makeStateBranch(schema, getNSetOneOf, path = [], value) {
    const result = {};
    const dataMapObjects = [];
    let defaultValues;
    let currentOneOf = (getNSetOneOf(path) || {}).oneOf;
    const schemaPartsOneOf = react_ts_utils_1.toArray(getSchemaPart(schema, path, getNSetOneOf, true));
    if (react_ts_utils_2.isUndefined(currentOneOf)) {
        const _oneOfSelector = schemaPartsOneOf[currentOneOf || 0]._oneOfSelector;
        if (_oneOfSelector) {
            let setOneOf = processFn.call({ path: path2string(path) }, _oneOfSelector, value);
            if (react_ts_utils_2.isArray(setOneOf))
                setOneOf = setOneOf[0];
            currentOneOf = setOneOf;
            //schemaPart = schemaPartsOneOf[oneOf];
        }
    }
    let { schemaPart, oneOf, type } = findOneOf(schemaPartsOneOf, value, currentOneOf);
    if (react_ts_utils_2.isUndefined(schemaPart) || !react_ts_utils_2.isUndefined(currentOneOf) && currentOneOf != oneOf) { // value type is not that currentOneOf supports
        console.info('Passed value: "' + value + '" is not supported by schema.type in path "' + path.join('/') + '" and oneOfIndex "' + currentOneOf + '". Reset value to default.\n');
        value = (schemaPartsOneOf)[currentOneOf || 0].default; // so, reset value to default, cause keeping oneOf is in prior (if currentOneOf exists, otherwise oneOf is changed)
        const tmp = findOneOf(schemaPartsOneOf, value, currentOneOf);
        schemaPart = tmp.schemaPart;
        oneOf = tmp.oneOf;
        type = tmp.type;
    }
    react_ts_utils_1.push2array(dataMapObjects, normalizeStateMaps(schemaPart._stateMaps || [], path));
    result[SymDataMap] = {};
    result[SymData] = makeDataStorage(schemaPart, oneOf, type, value);
    getNSetOneOf(path, { oneOf, type });
    if ((result[SymData].hasOwnProperty('value'))) {
        defaultValues = result[SymData].value;
    }
    else {
        if (type == 'array') {
            defaultValues = [];
            defaultValues.length = result[SymData].length;
            let keys = [];
            for (let i = 0; i < defaultValues.length; i++) {
                let { state: branch, dataMap, defaultValues: dValue } = makeStateBranch(schema, getNSetOneOf, path.concat(i), react_ts_utils_1.getIn(react_ts_utils_2.isUndefined(value) ? schemaPart.default : value, i));
                defaultValues[i] = dValue;
                react_ts_utils_1.push2array(dataMapObjects, dataMap);
                branch = react_ts_utils_1.merge(branch, { [SymData]: { arrayItem: getArrayItemData(schemaPart, i, defaultValues.length) } }, { replace: { [SymData]: { ArrayItem: true } } });
                branch = react_ts_utils_1.merge(branch, { [SymData]: { params: { uniqKey: getUniqKey() } } });
                result[i] = branch;
                keys[i] = branch[SymData].params.uniqKey;
            }
            result[SymData] = react_ts_utils_1.merge(result[SymData], { keys });
        }
        else if (type == 'object') {
            defaultValues = react_ts_utils_2.isObject(schemaPart.default) ? Object.assign({}, schemaPart.default) : {};
            if (value && schemaPart.additionalProperties === false) {
                value = removeNotAllowedProperties(schemaPart, value);
                defaultValues = removeNotAllowedProperties(schemaPart, defaultValues);
            }
            if (react_ts_utils_2.isObject(value))
                Object.assign(defaultValues, value);
            let arrayOfRequired = result[SymData].fData.required;
            arrayOfRequired = react_ts_utils_2.isArray(arrayOfRequired) && arrayOfRequired.length && arrayOfRequired;
            react_ts_utils_1.objKeys(schemaPart.properties || {}).forEach(field => {
                let { state: branch, dataMap, defaultValues: dValue } = makeStateBranch(schema, getNSetOneOf, path.concat(field), react_ts_utils_1.getIn(react_ts_utils_2.isUndefined(value) ? schemaPart.default : value, field));
                defaultValues[field] = dValue;
                react_ts_utils_1.push2array(dataMapObjects, dataMap);
                if (arrayOfRequired && (~arrayOfRequired.indexOf(field)))
                    branch = react_ts_utils_1.merge(branch, { [SymData]: { fData: { required: true } } });
                result[field] = branch;
            });
        }
        if (value)
            defaultValues = react_ts_utils_1.merge(value, defaultValues, { replace: trueIfLength(1) });
    }
    return { state: result, defaultValues, dataMap: dataMapObjects };
}
function isArrayCanAdd(schemaPart, length) {
    const arrayStartIndex = arrayStart(schemaPart); //; dataItem.array.arrayStartIndex;
    const minItems = schemaPart.minItems || 0;
    return (schemaPart.additionalItems !== false || length < arrayStartIndex) && (length < (schemaPart.maxItems || Infinity));
}
function getArrayItemData(schemaPart, index, length) {
    let result = {};
    const arrayStartIndex = arrayStart(schemaPart); //; dataItem.array.arrayStartIndex;
    const minItems = schemaPart.minItems || 0;
    // if (index >= arrayStartIndex) {
    result.canUp = arrayStartIndex < index;
    result.canDown = (arrayStartIndex <= index) && (index < length - 1);
    // }
    // if (index >= minItems)
    result.canDel = index >= Math.min(arrayStartIndex, length - 1);
    return result;
}
function isSelfManaged(state, ...paths) {
    return react_ts_utils_1.hasIn(state, ...paths, SymData, 'value');
}
exports.isSelfManaged = isSelfManaged;
function isSchemaSelfManaged(schemaPart, type) {
    return type !== 'array' && type !== 'object' || react_ts_utils_1.getIn(schemaPart, '_simple');
}
exports.isSchemaSelfManaged = isSchemaSelfManaged;
function findOneOf(oneOfShemas, value, currentOneOf) {
    if (!react_ts_utils_2.isArray(oneOfShemas))
        oneOfShemas = [oneOfShemas];
    const oneOfKeys = oneOfShemas.map((v, i) => i);
    if (currentOneOf)
        react_ts_utils_1.moveArrayElems(oneOfKeys, currentOneOf, 0); // currentOneOf should be checked first to match type
    for (let k = 0; k < oneOfKeys.length; k++) {
        let oneOf = oneOfKeys[k];
        let schemaTypes = oneOfShemas[oneOf].type || types;
        if (!react_ts_utils_2.isArray(schemaTypes))
            schemaTypes = [schemaTypes];
        let defaultUsed;
        let checkValue = react_ts_utils_2.isUndefined(value) ? (defaultUsed = true) && oneOfShemas[oneOf].default : value;
        for (let j = 0; j < schemaTypes.length; j++)
            if (types[schemaTypes[j]](checkValue) || react_ts_utils_2.isUndefined(checkValue))
                return { schemaPart: oneOfShemas[oneOf], oneOf, type: schemaTypes[j] };
        if (defaultUsed && !react_ts_utils_2.isUndefined(oneOfShemas[oneOf].default))
            throw new Error('Type of schema.default is not supported by schema.type');
    }
    return {};
    //return {schemaPart: oneOfShemas[0], oneOf: 0, type: toArray(oneOfShemas[0].type || types)[0]}
}
function rehydrateState(state, UPDATABLE) {
    let { dataMap = [] } = makeStateBranch(UPDATABLE.api.schema, oneOfFromState(state));
    return setDataMapInState(state, UPDATABLE, dataMap, null);
}
exports.rehydrateState = rehydrateState;
/////////////////////////////////////////////
//      state update PROCEDURES
/////////////////////////////////////////////
function updateMessagesPROC(state, UPDATABLE, track, result, defaultGroup = 0) {
    function conv(item) {
        return (typeof item === 'object') ? item : { group: defaultGroup, data: item };
    }
    let messages = react_ts_utils_1.toArray(result).map(conv);
    messages.forEach((item) => {
        let { path } = item, itemNoPath = __rest(item, ["path"]);
        if (path) {
            path = normalizePath(path, track);
            state = updateMessagesPROC(state, UPDATABLE, path, itemNoPath, defaultGroup);
        }
        else {
            let { group = defaultGroup, data, priority = 0 } = itemNoPath, rest = __rest(itemNoPath, ["group", "data", "priority"]);
            const messageData = react_ts_utils_1.getSetIn(UPDATABLE.update, {}, track, SymData, 'messages', priority);
            Object.assign(messageData, rest);
            if (!react_ts_utils_2.isObject(messageData.texts))
                messageData.texts = {};
            if (!react_ts_utils_2.isArray(messageData.texts[group]))
                messageData.texts[group] = [];
            if (data)
                react_ts_utils_1.push2array(messageData.texts[group], data);
        }
    });
    return state;
}
function getCurrentPriority(messages) {
    let priorities = react_ts_utils_1.objKeys(messages || {});
    let currentPriority;
    for (let i = 0; i < priorities.length; i++) {
        let groups = react_ts_utils_1.getIn(messages, priorities[i], 'texts') || {};
        let grKeys = react_ts_utils_1.objKeys(groups);
        for (let j = 0; j < grKeys.length; j++) {
            if (groups[grKeys[j]] && groups[grKeys[j]].length) {
                currentPriority = parseInt(priorities[i]);
                break;
            }
        }
        if (!react_ts_utils_2.isUndefined(currentPriority))
            break;
    }
    return currentPriority;
}
function setPriorityPROC(state, UPDATABLE, track, currentPriority) {
    state = updatePROC(state, UPDATABLE, makeNUpdate(track, ['status', 'validation', 'invalid'], currentPriority === 0 ? 1 : 0, true, { macros: 'setStatus' }));
    state = updatePROC(state, UPDATABLE, makeNUpdate(track, ['status', 'priority'], currentPriority));
    return state;
}
function setValidStatusPROC(state, UPDATABLE, update, track = []) {
    let currentPriority = getCurrentPriority(react_ts_utils_1.getIn(state, track, SymData, 'messages'));
    state = setPriorityPROC(state, UPDATABLE, track, currentPriority);
    if (!isSelfManaged(state, track))
        react_ts_utils_1.objKeys(update).forEach(key => state = setValidStatusPROC(state, UPDATABLE, update[key], track.concat(key)));
    return state;
}
function makeValidation(state, dispatch, action) {
    function recurseValidationInnerPROCEDURE(state, validatedValue, modifiedValues, track = []) {
        let schemaPart;
        try {
            schemaPart = getSchemaPart(schema, track, oneOfFromState(state));
        }
        catch (e) {
            return state;
        }
        const selfManaged = isSelfManaged(state, track);
        if (!selfManaged)
            modifiedValues && react_ts_utils_1.objKeys(modifiedValues).forEach(key => state = recurseValidationInnerPROCEDURE(state, validatedValue[key], modifiedValues[key], track.concat(key)));
        let _validators = react_ts_utils_1.getIn(schemaPart, '_validators');
        if (_validators) {
            const field = makeSynthField(UPDATABLE.api, path2string(track));
            react_ts_utils_1.objKeys(_validators).forEach((k) => {
                let validator = _validators[k];
                const updates = [];
                field.updates = updates;
                let result = processFn.call(field, validator, validatedValue);
                if (result && result.then && typeof result.then === 'function') { //Promise
                    result.validatedValue = validatedValue;
                    result.path = track;
                    result.selfManaged = selfManaged;
                    vPromises.push(result);
                    state = updatePROC(state, UPDATABLE, makeNUpdate(track, ['status', 'validation', 'pending'], 1, true, { macros: 'setStatus' }));
                }
                else
                    state = updateMessagesPROC(state, UPDATABLE, track, result, 1);
                if (updates.length)
                    updates.forEach((update) => state = updatePROC(state, UPDATABLE, update));
                field.updates = null;
            });
        }
        return state;
    }
    function clearDefaultMessagesInnerPROCEDURE(state, modifiedValues, track = []) {
        const type = react_ts_utils_1.getIn(state, track, SymData, 'fData', 'type');
        if (!type)
            return state;
        if (type == 'object' || type == 'array')
            modifiedValues && react_ts_utils_1.objKeys(modifiedValues).forEach(key => clearDefaultMessagesInnerPROCEDURE(state, modifiedValues[key], track.concat(key)));
        setUPDATABLE(UPDATABLE, {}, true, track, SymData, 'messages', '0', 'texts');
        return state;
        //return updateMessagesPROC(state, UPDATABLE, track); // sets empty array for 0-level messages
    }
    let { api, force, opts, promises } = action;
    const { JSONValidator, schema, getState, UPDATABLE } = api;
    const currentValues = state[SymData].current;
    const vPromises = [];
    const modifiedValues = force === true ? currentValues : force;
    //console.log('modifiedValues ', modifiedValues);
    if (!modifiedValues || react_ts_utils_1.objKeys(modifiedValues).length == 0) { // no changes, no validation
        promises.resolve();
        promises.vAsync.resolve();
        return state;
    }
    if (JSONValidator) {
        state = clearDefaultMessagesInnerPROCEDURE(state, modifiedValues);
        let errs = JSONValidator(currentValues); // Validate, using JSONSchemaValidator;
        errs.forEach((item) => updateMessagesPROC(state, UPDATABLE, item[0], item[1]));
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
                let { validatedValue, path, selfManaged } = vPromises[i];
                if (validatedValue == react_ts_utils_1.getIn(newValues, path)) {
                    state = updateMessagesPROC(state, UPDATABLE, path, results[i] || '', 2);
                    state = updatePROC(state, UPDATABLE, makeNUpdate(path, ['status', 'validation', 'pending'], 0, false, { macros: 'setStatus' }));
                    // pendingStatus[path2string(path)] = false;
                }
            }
            let update = UPDATABLE.update;
            state = mergeUPD_PROC(state, UPDATABLE);
            state = setValidStatusPROC(state, UPDATABLE, update);
            state = mergeUPD_PROC(state, UPDATABLE); // merge(state, UPDATABLE.update, {replace: UPDATABLE.replace});
            dispatch({ type: api_1.anSetState, state, api });
            promises.vAsync.resolve();
        }).catch(reason => {
            let state = getState();
            let UPDATABLE = api.UPDATABLE; // let UPDATABLE = {update: {}, replace: {}, api: {};
            let newValues = state[SymData].current; //getRawValues().current;
            for (let i = 0; i < vPromises.length; i++) {
                let { validatedValue, path, selfManaged } = vPromises[i];
                if (validatedValue == react_ts_utils_1.getIn(newValues, path)) {
                    state = updatePROC(state, UPDATABLE, makeNUpdate(path, ['status', 'validation', 'pending'], 0, false, { macros: 'setStatus' }));
                }
            }
            let update = UPDATABLE.update;
            state = mergeUPD_PROC(state, UPDATABLE);
            state = setValidStatusPROC(state, UPDATABLE, update);
            state = mergeUPD_PROC(state, UPDATABLE);
            dispatch({ type: api_1.anSetState, state, api });
            promises.vAsync.reject(reason);
        });
    }
    else
        promises.vAsync.resolve();
    return state;
}
function setDirtyPROC(state, UPDATABLE, inital, current, track = []) {
    if (react_ts_utils_2.isUndefined(inital))
        inital = react_ts_utils_1.getIn(state, SymData, 'default', track);
    if (current === inital)
        return state;
    const { schema } = UPDATABLE.api;
    let schemaPart;
    try {
        schemaPart = getSchemaPart(schema, track, oneOfFromState(state));
    }
    catch (e) { }
    if (!schemaPart || isSelfManaged(state, track)) { //direct compare
        let path = schemaPart ? track : track.slice(0, -1);
        state = updatePROC(state, UPDATABLE, makeNUpdate(path, ['status', 'dirty'], 1, false, { macros: 'setStatus' }));
    }
    else {
        let keys = react_ts_utils_1.objKeys(Object.assign({}, inital, current));
        keys.forEach(key => state = setDirtyPROC(state, UPDATABLE, react_ts_utils_1.getIn(inital, key), react_ts_utils_1.getIn(current, key), track.concat(key)));
    }
    return state;
}
function updateDirtyPROC(state, UPDATABLE, inital, currentChanges, track = [], forceDirty = false) {
    const { schema } = UPDATABLE.api;
    let schemaPart;
    try {
        schemaPart = getSchemaPart(schema, track, oneOfFromState(state));
    }
    catch (e) { }
    if (!schemaPart || isSelfManaged(state, track)) { //direct compare
        let current = react_ts_utils_1.getIn(state, SymData, 'current', track);
        if (react_ts_utils_2.isUndefined(inital))
            inital = react_ts_utils_1.getIn(state, SymData, 'default', track);
        let value = forceDirty || current !== inital ? 1 : -1;
        let path = track;
        let keyPath = ['status', 'dirty'];
        if (!schemaPart) {
            path = path.slice();
            keyPath.push(path.pop(), keyPath.pop());
        }
        state = updatePROC(state, UPDATABLE, makeNUpdate(path, keyPath, value, false, { macros: 'setStatus', }));
    }
    else {
        let keys = react_ts_utils_1.objKeys(currentChanges || {});
        if (schemaPart.type == 'array') {
            if (!~keys.indexOf('length'))
                keys.push('length');
            let existKeys = branchKeys(react_ts_utils_1.getIn(state, track));
            keys = keys.filter(k => isNaN(parseInt(k)) || ~existKeys.indexOf(k));
        }
        // if (schemaPart.type == 'array' && !~keys.indexOf('length')) keys.push('length');
        forceDirty = forceDirty || !react_ts_utils_2.isMergeable(inital);
        keys.forEach(key => state = updateDirtyPROC(state, UPDATABLE, react_ts_utils_1.getIn(inital, key), react_ts_utils_1.getIn(currentChanges, key), track.concat(key), forceDirty));
    }
    return state;
}
function setPristinePROC(state, UPDATABLE, inital, track = []) {
    if (react_ts_utils_1.getIn(UPDATABLE.update, track, SymData, 'status', 'pristine')) {
        if (react_ts_utils_2.isMergeable(inital) && react_ts_utils_1.getIn(state, SymData, 'current', track) !== inital) {
            react_ts_utils_1.setIn(UPDATABLE.update, inital, SymData, 'current', track);
            react_ts_utils_1.setIn(UPDATABLE.replace, true, SymData, 'current', track);
        }
    }
    else {
        react_ts_utils_1.objKeys(react_ts_utils_1.getIn(UPDATABLE.update, track)).forEach(key => setPristinePROC(state, UPDATABLE, react_ts_utils_1.getIn(inital, key), track.concat(key)));
    }
    return state;
}
function updateState(dispatch) {
    // console.time('execActions');
    let { updates, state, api, forceValidation, opts, promises } = this;
    let { getState, schema, UPDATABLE } = api;
    if (!state)
        state = getState();
    let prevState = state;
    updates.forEach((update) => state = updatePROC(state, UPDATABLE, update));
    state = mergeUPD_PROC(state, UPDATABLE);
    let oldCurrent = react_ts_utils_1.getIn(prevState, SymData, 'current');
    if (UPDATABLE.forceCheck) {
        oldCurrent = react_ts_utils_1.merge(oldCurrent, UPDATABLE.forceCheck);
        UPDATABLE.forceCheck = undefined;
    }
    if (prevState[SymData].inital !== state[SymData].inital) { // check dirty for inital changes
        let initalChanges = react_ts_utils_1.mergeState(prevState[SymData].inital, state[SymData].inital, { diff: true }).changes;
        state = updateDirtyPROC(state, UPDATABLE, state[SymData].inital, initalChanges);
    }
    let currentChanges = react_ts_utils_1.mergeState(oldCurrent, react_ts_utils_1.getIn(state, SymData, 'current'), { diff: true }).changes;
    if (currentChanges)
        state = updateDirtyPROC(state, UPDATABLE, state[SymData].inital, currentChanges); // check dirty only for changes
    state = setPristinePROC(state, UPDATABLE, state[SymData].inital);
    state = mergeUPD_PROC(state, UPDATABLE);
    let force;
    if (opts.noValidation)
        force = forceValidation;
    else {
        if (forceValidation) {
            object2PathValues(currentChanges).forEach(path => {
                path.pop();
                setIfNotDeeper(forceValidation, true, path);
            });
            force = forceValidation;
        }
        else
            force = react_ts_utils_2.isMergeable(currentChanges) ? currentChanges : !react_ts_utils_2.isUndefined(currentChanges);
    }
    if (force)
        state = makeValidation(state, dispatch, { force, api, opts, promises });
    dispatch({ type: api_1.anSetState, state, api });
    return promises;
}
exports.updateState = updateState;
const makeStateFromSchema = react_ts_utils_1.memoize(function (schema) {
    return makeStateBranch(schema, oneOfStructure({}, []));
});
function initState(UPDATABLE) {
    let { state, dataMap = [], defaultValues } = makeStateFromSchema(UPDATABLE.api.schema);
    state = react_ts_utils_1.merge(state, react_ts_utils_1.setIn({}, defaultValues, [SymData, 'current']));
    state = setDataMapInState(state, UPDATABLE, dataMap);
    const current = react_ts_utils_1.getIn(state, SymData, 'current');
    state = updatePROC(state, UPDATABLE, makeNUpdate([], ['inital'], current));
    state = updatePROC(state, UPDATABLE, makeNUpdate([], ['default'], current));
    state = mergeUPD_PROC(state, UPDATABLE);
    return state;
}
exports.initState = initState;
/////////////////////////////////////////////
//      items updating PROCEDURES
/////////////////////////////////////////////
function updateCurrentPROC(state, UPDATABLE, value, replace, track = [], setOneOf) {
    if (value === SymReset || react_ts_utils_2.isUndefined(value))
        value = react_ts_utils_1.getIn(state, SymData, 'inital', track);
    if (value === SymClear || react_ts_utils_2.isUndefined(value))
        value = react_ts_utils_1.getIn(state, SymData, 'default', track);
    if (react_ts_utils_1.getIn(state, SymData, 'current', track) === value && !react_ts_utils_1.hasIn(UPDATABLE.update, SymData, 'current', track))
        return state;
    const schema = UPDATABLE.api.schema;
    let branch = react_ts_utils_1.getIn(state, track);
    // if no branch then no need to modify state for this value, just update current
    if (!branch) {
        if (track[track.length - 1] == 'length') { // hook if someone decides to edit array's length directly
            const topPath = track.slice(0, -1);
            const topBranch = react_ts_utils_1.getIn(state, topPath);
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
    //   value = getIn(state, SymData, 'inital', track);
    //   if (isUndefined(value)) value = branch[SymData].fData.default;
    // }
    if (!react_ts_utils_2.isUndefined(setOneOf) || oneOfSelector || !types[type || 'any'](value)) { // if wrong type for current oneOf index search for proper type in oneOf
        // setOneOf =
        const parts = getSchemaPart(schema, track, oneOfFromState(state), true);
        let currentOneOf = branch[SymData].oneOf;
        if (oneOfSelector) {
            //const field = makeSynthField(UPDATABLE.api, path2string(track));
            const _oneOfSelector = parts[currentOneOf]._oneOfSelector;
            setOneOf = processFn.call({ path: path2string(track) }, _oneOfSelector, value);
            if (react_ts_utils_2.isArray(setOneOf))
                setOneOf = setOneOf[0];
        }
        const { schemaPart, oneOf, type } = findOneOf(parts, value, react_ts_utils_2.isUndefined(setOneOf) ? currentOneOf : setOneOf);
        if (currentOneOf !== oneOf) {
            if (schemaPart) {
                let cur = react_ts_utils_1.getIn(state, SymData, 'current', track);
                //if (!cur) debugger;
                if (!isSchemaSelfManaged(schemaPart, type) && branch[SymData].fData.type === type)
                    value = react_ts_utils_1.merge(react_ts_utils_1.getIn(state, SymData, 'current', track), value, { replace });
                return updatePROC(state, UPDATABLE, makeNUpdate(track, ['oneOf'], oneOf, false, { type, setValue: value }));
            }
            else
                console.warn('Type "' + (types.detect(value)) + '" not found in path [' + track.join('/') + ']');
        }
    }
    if (isSelfManaged(branch)) { // if object has own value then replace it directly
        state = updatePROC(state, UPDATABLE, makeNUpdate(track, ['value'], value, replace));
    }
    else {
        if (react_ts_utils_2.isMergeable(value)) { // if we receive object or array then apply their values to state
            if (type == 'array' && !react_ts_utils_2.isUndefined(value.length)) {
                state = updatePROC(state, UPDATABLE, makeNUpdate(track, ['length'], value.length));
                branch = react_ts_utils_1.getIn(state, track);
            }
            const removeNotAllowedProps = type == 'object' && branch[SymData].fData.additionalProperties === false;
            if (removeNotAllowedProps) // keep only existing in state(schema) properties
                value = removeNotAllowedProperties(getSchemaPart(schema, track, oneOfFromState(state)), value);
            if (replace === true) { // restore value's props-structure that are exist in state
                let v = react_ts_utils_2.isArray(value) ? [] : {};
                branchKeys(branch).forEach(k => v[k] = undefined);
                value = Object.assign(v, value);
            }
            react_ts_utils_1.objKeys(value).forEach(key => state = updateCurrentPROC(state, UPDATABLE, value[key], replace === true ? true : react_ts_utils_1.getIn(replace, key), track.concat(key)));
            if (replace === true || removeNotAllowedProps) { // remove props from current that are not in value or in state
                state = mergeUPD_PROC(state, UPDATABLE);
                branch = react_ts_utils_1.getIn(state, track);
                let current = react_ts_utils_1.getIn(state, SymData, 'current', track);
                //value = {...value};
                branchKeys(branch).forEach(k => value[k] = current[k]);
                state = updatePROC(state, UPDATABLE, makeNUpdate([], ['current'].concat(track), value, replace));
            }
        }
    }
    return state;
}
function removeNotAllowedProperties(schemaPart, value) {
    if (schemaPart.type !== 'object' || schemaPart.additionalProperties !== false)
        return value;
    let v = {};
    let properties = schemaPart.properties || {};
    let patterns = react_ts_utils_1.objKeys(schemaPart.patternProperties || {}).map(pattern => new RegExp(pattern));
    react_ts_utils_1.objKeys(value).forEach(k => {
        if (properties[k] || patterns.some(re => k.match(re)))
            v[k] = value[k];
    });
    return v;
}
function splitValuePROC(state, UPDATABLE, item) {
    const { value: itemValue, path, replace } = item;
    const keyPath = item[SymData] || [];
    if (keyPath.length == 0) {
        const { value, status, length, oneOf } = itemValue, rest = __rest(itemValue, ["value", "status", "length", "oneOf"]);
        ['value', 'status', 'length', 'oneOf'].forEach(key => {
            if (react_ts_utils_1.hasIn(itemValue, key))
                state = updatePROC(state, UPDATABLE, makeNUpdate(path, [key], itemValue[key], react_ts_utils_1.getIn(replace, key)));
        });
        if (react_ts_utils_1.objKeys(rest).length)
            state = updatePROC(state, UPDATABLE, makeNUpdate(path, keyPath, rest, replace));
    }
    else {
        react_ts_utils_1.objKeys(itemValue).forEach(key => {
            state = updatePROC(state, UPDATABLE, makeNUpdate(path, keyPath.concat(key), itemValue[key], react_ts_utils_1.getIn(replace, key)));
        });
    }
    return state;
}
function updateNormalizationPROC(state, UPDATABLE, item) {
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
        }
        else if (i[SymData][0] == 'status') {
            console.warn('Status should not be changed through StateApi. Update ignored.');
            return;
        }
        else if (i[SymData][0] == 'oneOf') {
            i.macros = 'setOneOf';
        }
        state = updatePROC(state, UPDATABLE, i);
    });
    return state;
}
function setUPDATABLE(UPDATABLE, update, replace, ...paths) {
    object2PathValues(replace).forEach(path => {
        let replaceValue = path.pop();
        react_ts_utils_1.setIn(UPDATABLE, react_ts_utils_1.getIn(update, path), 'update', ...paths, path);
        if (replaceValue)
            react_ts_utils_1.setIn(UPDATABLE, replaceValue, 'replace', ...paths, path);
    });
    return UPDATABLE;
}
exports.setUPDATABLE = setUPDATABLE;
function mergeUPD_PROC(state, UPDATABLE) {
    state = react_ts_utils_1.merge(state, UPDATABLE.update, { replace: UPDATABLE.replace });
    UPDATABLE.update = {};
    UPDATABLE.replace = {};
    return state;
}
exports.mergeUPD_PROC = mergeUPD_PROC;
function updatePROC(state, UPDATABLE, item) {
    if (!item)
        return state;
    const { update, replace: replace_UPDATABLE, api } = UPDATABLE;
    const { schema } = api;
    // normalize updates
    if (!isNUpdate(item))
        return updateNormalizationPROC(state, UPDATABLE, item);
    // execute macros
    if (item.macros) {
        let macro = Macros[item.macros];
        if (!macro)
            throw new Error('"' + macro + '" not found in macros');
        return macro(state, schema, UPDATABLE, item);
    }
    let { value, path, replace } = item;
    const keyPath = item[SymData];
    if (react_ts_utils_2.isFunction(value))
        value = value(getFromUPD(state, UPDATABLE)(path, SymData, keyPath));
    if (path.length == 0 && (keyPath[0] == 'inital' || keyPath[0] == 'default')) {
        // if (keyPath[0] == 'inital')  value = merge(getIn(state, SymData, 'default', keyPath.slice(1)), value);
        state = react_ts_utils_1.merge(state, makeSlice(SymData, keyPath, value), { replace: makeSlice(SymData, keyPath, replace) });
    }
    else {
        // split object for proper state update (for dataMap correct execution)
        if (react_ts_utils_2.isObject(value) && (keyPath.length == 0 && (react_ts_utils_1.hasIn(value, 'value') || react_ts_utils_1.hasIn(value, 'status') || react_ts_utils_1.hasIn(value, 'length') || react_ts_utils_1.hasIn(value, 'oneOf'))
            || (keyPath.length == 1 && keyPath[0] == 'status')))
            return splitValuePROC(state, UPDATABLE, item);
        let branch = react_ts_utils_1.getIn(state, path);
        if (!react_ts_utils_2.isObject(branch))
            return state; // check if there is branch in state
        if (keyPath[0] == 'value' && !react_ts_utils_1.hasIn(branch, SymData, 'value')) // value is not self managed, so modify only current
            return Macros.setCurrent(state, schema, UPDATABLE, { value, replace, path: path.concat(keyPath.slice(1)) });
        // check if value is differ
        if (value === getUpdValue([UPDATABLE.update, state], path, SymData, keyPath))
            return state;
        // set data
        setUPDATABLE(UPDATABLE, value, replace, path, SymData, keyPath);
        // setIn(update, value, path, SymData, keyPath);
        // if (replace) setIn(replace_UPDATABLE, replace, path, SymData, keyPath);
        // additional state modifying if required
        if (keyPath[0] == 'value') { // modify current
            state = updatePROC(state, UPDATABLE, makeNUpdate([], react_ts_utils_1.push2array(['current'], path, keyPath.slice(1)), value, replace));
        }
        else if (keyPath[0] == 'messages') { // modify valid status
            const messages = getFromUPD(state, UPDATABLE)(path, SymData, 'messages');
            let currentPriority = getCurrentPriority(messages);
            state = setPriorityPROC(state, UPDATABLE, path, currentPriority);
        }
        else if (keyPath[0] == 'length') { // modify state with new length
            state = updatePROC(state, UPDATABLE, makeNUpdate([], react_ts_utils_1.push2array(['current'], path, keyPath), value, replace));
            let start = branch[SymData].length;
            start = Math.max(start, 0);
            let end = Math.max(value || 0);
            const oneOfStateFn = oneOfStructure(state, path);
            const maps2enable = [];
            const maps2disable = [];
            let keys = [...getFromUPD(state, UPDATABLE)(path, SymData, 'keys')];
            keys.length = end;
            for (let i = start; i < end; i++) {
                let elemPath = path.concat(i);
                if (!react_ts_utils_2.isUndefined(item.setOneOf))
                    oneOfStateFn(elemPath, { oneOf: item.setOneOf });
                let { state: branch, dataMap = [], defaultValues } = makeStateBranch(schema, oneOfStateFn, elemPath);
                const untouched = getUpdValue([state, UPDATABLE.update], path, SymData, 'status', 'untouched');
                const mergeBranch = { [SymData]: { params: { uniqKey: getUniqKey() } } };
                keys[i] = mergeBranch[SymData].params.uniqKey;
                if (!untouched)
                    react_ts_utils_1.setIn(mergeBranch[SymData], { untouched: 0, touched: true }, 'status');
                branch = react_ts_utils_1.merge(branch, mergeBranch);
                state = react_ts_utils_1.merge(state, react_ts_utils_1.setIn({}, branch, elemPath), { replace: react_ts_utils_1.setIn({}, true, elemPath) });
                state = updatePROC(state, UPDATABLE, makeNUpdate([], react_ts_utils_1.push2array(['current'], elemPath), defaultValues, true));
                react_ts_utils_1.push2array(maps2enable, dataMap);
                if (untouched)
                    state = Macros.setStatus(state, schema, UPDATABLE, makeNUpdate(path, ['status', 'untouched'], 1));
            }
            for (let i = end; i < start; i++) {
                let elemPath = path.concat(i);
                react_ts_utils_1.push2array(maps2disable, react_ts_utils_1.getIn(state, elemPath, SymDataMapTree, SymData) || []);
                ['invalid', 'dirty', 'untouched', 'pending'].forEach(key => {
                    let statusValue = getUpdValue([update, state], elemPath, SymData, 'status', key);
                    if (statusValue)
                        state = Macros.setStatus(state, schema, UPDATABLE, makeNUpdate(path, ['status', key], -1));
                });
                setUPDATABLE(UPDATABLE, SymDelete, true, elemPath);
                // setIn(update, SymDelete, elemPath);
                // setIn(replace_UPDATABLE, SymDelete, elemPath);
            }
            //setUPDATABLE(UPDATABLE, keys, true, path, SymData, 'keys');
            let schemaPart = getSchemaPart(schema, path, oneOfFromState(state));
            react_ts_utils_1.setIn(update, isArrayCanAdd(schemaPart, end), path, SymData, 'fData', 'canAdd');
            for (let i = Math.max(Math.min(start, end) - 1, 0); i < end; i++)
                setUPDATABLE(UPDATABLE, getArrayItemData(schemaPart, i, end), true, path, i, SymData, 'arrayItem');
            state = mergeUPD_PROC(state, UPDATABLE);
            state = setDataMapInState(state, UPDATABLE, maps2disable, true);
            state = setDataMapInState(state, UPDATABLE, maps2enable);
            state = updatePROC(state, UPDATABLE, makeNUpdate(path, ['keys'], keys));
        }
        else if (keyPath[0] == 'status') { // properly set status change
            let keyStatus = keyPath[1];
            let newKey;
            let value;
            if (keyStatus == 'invalid' || keyStatus == 'pending') {
                value = getUpdValue([update, state], path, SymData, 'status', 'pending') ? null : !getUpdValue([update, state], path, SymData, 'status', 'invalid');
                newKey = 'valid';
            }
            else if (keyStatus == 'untouched' || keyStatus == 'dirty') {
                value = !getUpdValue([update, state], path, SymData, 'status', keyStatus);
                newKey = keyStatus == 'untouched' ? 'touched' : 'pristine';
            }
            if (!react_ts_utils_2.isUndefined(newKey))
                state = updatePROC(state, UPDATABLE, makeNUpdate(path, ['status', newKey], value));
            //setIn(update, value, path, SymData, 'status', newKey);
        }
        else if (keyPath[0] == 'oneOf') {
            const oldBranch = react_ts_utils_1.getIn(state, path);
            let oldOneOf = react_ts_utils_1.getIn(oldBranch, SymData, 'oneOf') || 0;
            let newOneOf = react_ts_utils_1.getIn(UPDATABLE.update, path, SymData, 'oneOf');
            if ((oldOneOf != newOneOf) || (item.type && item.type != react_ts_utils_1.getIn(oldBranch, SymData, 'fData', 'type'))) {
                setIfNotDeeper(UPDATABLE, SymReset, 'forceCheck', item.path);
                state = mergeUPD_PROC(state, UPDATABLE);
                state = setDataMapInState(state, UPDATABLE, react_ts_utils_1.getIn(state, path, SymDataMapTree, SymData) || [], true);
                let { state: branch, dataMap: maps2enable = [], defaultValues } = makeStateBranch(schema, oneOfStructure(state, path), path, item.setValue);
                const _a = oldBranch[SymData], { value: v1, length: v2, oneOf: v3, fData: v4 } = _a, previousBranchData = __rest(_a, ["value", "length", "oneOf", "fData"]); // remove data that should be replaced by new branch
                if (!isSelfManaged(oldBranch) || !isSelfManaged(branch))
                    delete previousBranchData.status; // keep status values only for self-managed branch, that keeps to be self-managed
                branch = react_ts_utils_1.merge(branch, { [SymData]: previousBranchData }, { arrays: 'replace' });
                if (path.length) {
                    const topPath = path.slice();
                    const field = topPath.pop();
                    ['invalid', 'dirty', 'pending'].forEach(key => {
                        let oldStatusValue = react_ts_utils_1.getIn(oldBranch, SymData, 'status', key);
                        let newStatusValue = react_ts_utils_1.getIn(branch, SymData, 'status', key);
                        if (!oldStatusValue != !newStatusValue)
                            state = Macros.setStatus(state, schema, UPDATABLE, makeNUpdate(topPath, ['status', key], newStatusValue ? 1 : -1));
                    });
                    let arrayOfRequired = react_ts_utils_1.getIn(state, topPath, SymData, 'fData', 'required');
                    arrayOfRequired = react_ts_utils_2.isArray(arrayOfRequired) && arrayOfRequired.length && arrayOfRequired;
                    if (arrayOfRequired && (~arrayOfRequired.indexOf(field)))
                        branch = react_ts_utils_1.merge(branch, { [SymData]: { fData: { required: true } } });
                }
                if (react_ts_utils_1.getIn(oldBranch, SymData, 'status', 'untouched') == 0)
                    branch = react_ts_utils_1.merge(branch, { [SymData]: { status: { untouched: 0, touched: true } } }); // stick untouched to zero
                state = react_ts_utils_1.merge(state, react_ts_utils_1.setIn({}, branch, path), { replace: react_ts_utils_1.setIn({}, true, path) });
                state = updatePROC(state, UPDATABLE, makeNUpdate([], react_ts_utils_1.push2array(['current'], path), defaultValues, true));
                state = setDataMapInState(state, UPDATABLE, maps2enable);
                if (react_ts_utils_1.getIn(branch, SymData, 'status', 'untouched') == 0) {
                    state = Macros.switch(state, schema, UPDATABLE, makeNUpdate(path, ['status', 'untouched'], 0));
                    state = Macros.switch(state, schema, UPDATABLE, makeNUpdate(path, ['status', 'touched'], true));
                }
            }
        }
    }
    // apply dataMap
    let dataMap = react_ts_utils_1.getIn(state, path, SymDataMapTree);
    for (let i = 0; i < keyPath.length; i++) {
        if (!dataMap)
            break;
        state = executeDataMapsPROC(state, UPDATABLE, dataMap[SymDataMap], makeNUpdate(path, keyPath.slice(0, i), react_ts_utils_1.setIn({}, value, keyPath.slice(i)), react_ts_utils_1.setIn({}, replace, keyPath.slice(i))));
        dataMap = dataMap[keyPath[i]];
    }
    if (dataMap)
        state = recursivelyExecuteDataMaps(dataMap, value, replace, keyPath);
    function recursivelyExecuteDataMaps(dataMap, value, replace, track = []) {
        state = executeDataMapsPROC(state, UPDATABLE, dataMap[SymDataMap], makeNUpdate(path, track, value, replace));
        react_ts_utils_2.isMergeable(value) && react_ts_utils_1.objKeys(dataMap).forEach(key => value.hasOwnProperty(key) && (state = recursivelyExecuteDataMaps(dataMap[key], value[key], react_ts_utils_1.getIn(replace, key), track.concat(key))));
        return state;
    }
    return state;
}
exports.updatePROC = updatePROC;
function normalizeStateMaps(dataMap, emitter) {
    return react_ts_utils_1.objKeys(dataMap).map((key) => {
        let item = dataMap[key];
        let { from, to } = item, action = __rest(item, ["from", "to"]);
        if (!action.$)
            action = true;
        else
            action = normalizeFn(action);
        if (!from || !to)
            action = false;
        // {action = {...action, ...normalizeArgs(action.args)};
        //   if (!action.args.length) action.args = ['${value}'];}
        return { emitter, from, to, action };
    });
}
function setDataMapInState(state, UPDATABLE, dataMaps, unset = false) {
    const dataMaps2execute = [];
    dataMaps.forEach((dataMap) => {
        const emitterPath = dataMap.emitter;
        let bindMap2emitter = false;
        normalizeUpdate({ path: (dataMap.from[0] == '/' ? '' : emitterPath.join('/')) + '/' + dataMap.from, value: null }, state).forEach(fromItem => {
            let key = fromItem[SymData][0];
            if (key == 'current' || key == 'inital' || key == 'default' && fromItem.path.length)
                fromItem = Object.assign(Object.assign({}, fromItem), { path: [], [SymData]: [key, ...fromItem.path, ...fromItem[SymData].slice(1)] });
            normalizeUpdate({ path: emitterPath.join('/') + '/' + dataMap.to, value: null }, state).forEach(toItem => {
                let relTo = path2string(relativePath(fromItem.path, toItem.path.concat(SymData, ...toItem[SymData])));
                //console.log(relTo);
                if (react_ts_utils_1.getIn(state, fromItem.path))
                    react_ts_utils_1.setIn(UPDATABLE.update, unset ? undefined : dataMap.action, fromItem.path, SymDataMapTree, fromItem[SymData], SymDataMap, relTo);
                if (!unset) {
                    // state = executeDataMapsPROC(state, UPDATABLE, makeSlice(relTo, dataMap.action),
                    //   makeNUpdate(fromItem.path, fromItem[SymData], getIn(state, fromItem.path, SymData, fromItem[SymData])));
                    dataMaps2execute.push({
                        map: makeSlice(relTo, dataMap.action),
                        fromPath: fromItem.path,
                        keyPath: fromItem[SymData]
                    });
                    if (!bindMap2emitter && relativePath(emitterPath, fromItem.path)[0] != '.')
                        bindMap2emitter = true;
                }
                //state = mergeUPD_PROC(state, UPDATABLE);
            });
        });
        if (bindMap2emitter) {
            const emitterBranch = react_ts_utils_1.getIn(state, emitterPath);
            if (emitterBranch) {
                let bindedMaps = react_ts_utils_1.getIn(emitterBranch, SymDataMapTree, SymData) || [];
                let i;
                for (i = 0; i < bindedMaps.length; i++) {
                    if (dataMap.from === bindedMaps[i].from && dataMap.to === bindedMaps[i].to)
                        break;
                }
                bindedMaps = bindedMaps.slice();
                bindedMaps[i] = dataMap;
                setUPDATABLE(UPDATABLE, bindedMaps, true, emitterPath, SymDataMapTree, SymData);
            }
        }
        state = mergeUPD_PROC(state, UPDATABLE);
    });
    if (unset !== null)
        dataMaps2execute.forEach((v) => {
            state = executeDataMapsPROC(state, UPDATABLE, v.map, makeNUpdate(v.fromPath, v.keyPath, react_ts_utils_1.getIn(state, v.fromPath, SymData, v.keyPath)));
            state = mergeUPD_PROC(state, UPDATABLE);
        });
    return state;
}
function executeDataMapsPROC(state, UPDATABLE, maps, item) {
    const { value, path, replace } = item;
    // const keyPath = item[SymData] || [];
    const from = NUpdate2string(item);
    react_ts_utils_1.objKeys(maps || {}).forEach((pathTo) => {
        //console.log('maps=', maps);
        if (!maps[pathTo])
            return; // disabled map
        const map = maps[pathTo];
        const NpathTo = path2string(normalizePath(pathTo, path));
        let executedValue = value;
        const updates = [];
        if (react_ts_utils_2.isObject(map)) {
            const field = makeSynthField(UPDATABLE.api, NpathTo, from);
            //let _get = field.api._get;
            //field.api._get = getFromUPD(state, UPDATABLE);
            field.get = getFromUPD(state, UPDATABLE);
            field.updates = updates;
            executedValue = processFn.call(field, map, value);
            field.updates = null;
            field.get = null;
        }
        if (!updates.length && (!(react_ts_utils_2.isUndefined(executedValue) && react_ts_utils_2.isObject(map))))
            updates.push({ path: NpathTo, value: executedValue, replace: react_ts_utils_2.isUndefined(map.replace) ? replace : map.replace });
        updates.forEach((update) => state = updatePROC(state, UPDATABLE, update));
    });
    return state;
}
/////////////////////////////////////////////
//      state utilities
/////////////////////////////////////////////
const trueIfLength = (length) => (path) => react_ts_utils_1.getIn(path, 'length') === length;
function isTopPath(path) {
    return path.length == 0 || path.length == 1 && path[0] == '#';
}
const makeSynthField = react_ts_utils_1.memoize(function (stateApi, to, from) {
    const path = to.split('@')[0];
    const pathData = from ? from.split('@')[0] : path;
    const updates = [];
    const field = { from, to, path, stateApi, updates };
    field.api = stateApi.wrapper(field);
    field.wrapOpts = (rest) => {
        if (field.updates && react_ts_utils_2.isUndefined(rest.setExecution))
            rest.setExecution = (addUpdates) => addUpdates && react_ts_utils_1.push2array(field.updates, addUpdates);
        return rest;
    };
    field.getData = () => field.api.get(pathData, SymData);
    return field;
});
function getFromUPD(state, UPDATABLE) {
    return (...tPath) => {
        if (react_ts_utils_1.hasIn(UPDATABLE.update, ...tPath.map(path => normalizePath(path))))
            return react_ts_utils_1.merge(getFromState(state, ...tPath), getFromState(UPDATABLE.update, ...tPath), { replace: getFromState(UPDATABLE.replace, ...tPath) });
        return getFromState(state, ...tPath);
    };
}
function getUpdValue(states, ...paths) {
    for (let i = 0; i < states.length; i++) {
        if (react_ts_utils_1.hasIn(states[i], ...paths))
            return react_ts_utils_1.getIn(states[i], ...paths);
    }
}
function getFromState(state, ...paths) {
    return react_ts_utils_1.getIn(state, ...paths.map(path => normalizePath(path)));
}
exports.getFromState = getFromState;
const makeNUpdate = (path, keyPath, value, replace, rest = {}) => { return Object.assign({ path, [SymData]: keyPath, value, replace }, rest); };
exports.makeNUpdate = makeNUpdate;
function isNUpdate(updateItem) {
    return !react_ts_utils_2.isUndefined(react_ts_utils_1.getIn(updateItem, SymData)) && react_ts_utils_2.isArray(updateItem[SymData]);
}
function string2NUpdate(path, base = [], rest = {}) {
    path = normalizePath(path, base);
    let keyPath = [];
    let a = path.indexOf(SymData);
    if (~a) {
        keyPath = path.slice(a + 1);
        path = path.slice(0, a);
    }
    const { value, replace } = rest, r = __rest(rest, ["value", "replace"]);
    return makeNUpdate(path, keyPath, value, replace, r);
}
exports.string2NUpdate = string2NUpdate;
function NUpdate2string(item) {
    let path = path2string(item.path);
    return path + (item[SymData] && !~path.indexOf('@') ? '/@/' + path2string(item[SymData]) : '');
}
function normalizeUpdate(update, state) {
    const { path, value, replace, base } = update, rest = __rest(update, ["path", "value", "replace", "base"]);
    const result = [];
    let pathArray = path2string(path).split(';');
    pathArray.forEach(path => {
        let paths = normalizePath(path, base);
        let keyPathes = [];
        let a = paths.indexOf(SymData);
        if (~a) {
            keyPathes = paths.slice(a + 1);
            paths = paths.slice(0, a);
        }
        paths = multiplePath(paths, { '*': (p) => branchKeys(react_ts_utils_1.getIn(state, p)).join(',') });
        keyPathes = multiplePath(keyPathes);
        react_ts_utils_1.objKeys(paths).forEach(p => react_ts_utils_1.objKeys(keyPathes).forEach(k => result.push(makeNUpdate(paths[p], keyPathes[k], value, replace, rest))));
    });
    return result;
}
exports.normalizeUpdate = normalizeUpdate;
/////////////////////////////////////////////
//  Path functions
/////////////////////////////////////////////
const symConv = function (key, anotherKey) {
    if (!react_ts_utils_2.isUndefined(anotherKey)) {
        symConv._data[key] = anotherKey;
        symConv._data[anotherKey] = key;
    }
    else
        return symConv._data[key];
};
symConv._data = { '#': '' };
symConv.sym2str = (sym) => typeof sym == 'symbol' && !react_ts_utils_2.isUndefined(symConv(sym)) ? symConv(sym) : sym;
symConv.str2sym = (str) => typeof str == 'string' && !react_ts_utils_2.isUndefined(symConv(str)) ? symConv(str) : str;
symConv('@', SymData);
function multiplePath(path, strReplace = {}) {
    let result = { '': [] };
    path.forEach(value => {
        let res = {};
        value = strReplace[value] || value;
        if (typeof value == 'string' && ~value.indexOf(',')) {
            react_ts_utils_1.objKeys(result).forEach(key => value.split(',').forEach((k) => res[key && (key + ',' + k) || k] = result[key].concat(k.trim())));
        }
        else if (typeof value == 'function') {
            react_ts_utils_1.objKeys(result).forEach(key => {
                let tmp = value(result[key]);
                if (typeof tmp == 'string')
                    tmp = string2path(tmp);
                tmp = multiplePath(tmp, strReplace);
                react_ts_utils_1.objKeys(tmp).forEach(k => res[key && (key + (k ? ',' + k : '')) || k] = result[key].concat(tmp[k]));
            });
        }
        else
            react_ts_utils_1.objKeys(result).forEach(key => react_ts_utils_1.push2array(result[key], value));
        if (react_ts_utils_1.objKeys(res).length)
            result = res;
    });
    return result;
}
exports.multiplePath = multiplePath;
const num2string = (value) => typeof value == 'number' ? value.toString() : value;
function relativePath(base, destination) {
    if (base[0] === '#')
        base = base.slice(1);
    if (destination[0] === '#')
        destination = destination.slice(1);
    // let same = true;
    // let res: Path = [];
    const result = [];
    let i;
    for (i = 0; i < base.length; i++)
        if (num2string(base[i]) !== num2string(destination[i]))
            break;
    for (let j = i; j < base.length; j++)
        result.push('..');
    if (!result.length)
        result.push('.');
    return react_ts_utils_1.push2array(result, destination.slice(i));
    // return result;
}
exports.relativePath = relativePath;
function resolvePath(path, base) {
    const result = (base && (path[0] === '.' || path[0] == '..')) ? base.slice() : [];
    for (let i = 0; i < path.length; i++) {
        let val = path[i];
        if (val === '..')
            result.pop();
        else if (val !== '' && val !== '.')
            result.push(val);
    }
    return result;
}
function setIfNotDeeper(state, value, ...paths) {
    if (state === value)
        return state;
    const path = flattenPath(paths);
    let result = state;
    for (let i = 0; i < path.length - 1; i++) {
        if (result[path[i]] === value)
            return state;
        if (!react_ts_utils_2.isObject(result[path[i]]))
            result[path[i]] = {};
        result = result[path[i]];
    }
    if (path.length)
        result[path[path.length - 1]] = value;
    else
        return value;
    return state;
}
exports.setIfNotDeeper = setIfNotDeeper;
function flattenPath(path) {
    if (react_ts_utils_2.isArray(path)) {
        const result = [];
        react_ts_utils_1.push2array(result, ...path.map(flattenPath));
        return result;
    }
    else if (typeof path == 'string')
        return string2path(path);
    return [path];
}
function isNPath(path) {
    return react_ts_utils_2.isMergeable(path) && react_ts_utils_1.getIn(path, SymData) === 'nPath';
}
exports.isNPath = isNPath;
function normalizePath(path, base = []) {
    let result = resolvePath(flattenPath(path), base.length ? flattenPath(base) : []);
    result[SymData] = 'nPath';
    return result;
}
exports.normalizePath = normalizePath;
function path2string(path) {
    return react_ts_utils_2.isArray(path) ? path.map(path2string).join('/') : symConv.sym2str(path);
}
exports.path2string = path2string;
function string2path(path) {
    path = path.replace(symConv(SymData), '/' + symConv(SymData) + '/');
    path = path.replace(/\/+/g, '/');
    const result = [];
    path.split('/').forEach(key => key && (key = symConv.str2sym(key.trim())) && result.push(key));
    return result;
}
exports.string2path = string2path;
/////////////////////////////////////////////
//      common utils
/////////////////////////////////////////////
const isElemRef = (val) => react_ts_utils_2.isString(val) && val.trim().substr(0, 2) == '^/';
exports.isElemRef = isElemRef;
function object2PathValues(vals, options = {}, track = []) {
    const fn = options.symbol ? react_ts_utils_1.objKeysNSymb : react_ts_utils_1.objKeys;
    const check = options.arrayAsValue ? react_ts_utils_2.isObject : react_ts_utils_2.isMergeable;
    if (!check(vals))
        return [[vals]];
    let result = [];
    fn(vals).forEach((key) => {
        let path = track.concat(key);
        if (check(vals[key]))
            object2PathValues(vals[key], options, path).forEach(item => result.push(item)); // result = result.concat(object2PathValues(vals[key], path));
        else {
            path.push(vals[key]);
            result.push(path);
        }
    });
    if (!result.length)
        return [react_ts_utils_1.push2array(track.slice(), {})]; // empty object
    return result;
}
exports.object2PathValues = object2PathValues;
const objMap = (object, fn, track = []) => react_ts_utils_1.objKeys(object).reduce((result, key) => ((result[key] = fn(object[key], track.concat(key))) || true) && result, react_ts_utils_2.isArray(object) ? [] : {});
exports.objMap = objMap;
const isMapFn = (arg) => react_ts_utils_2.isObject(arg) && arg.$ || react_ts_utils_2.isFunction(arg) && arg._map;
exports.isMapFn = isMapFn;
function normalizeArgs(args, wrapFn) {
    let dataRequest = false;
    args = react_ts_utils_1.toArray(react_ts_utils_2.isUndefined(args) ? [] : args).map((arg) => {
        if (react_ts_utils_2.isString(arg)) {
            let fnReq = 0;
            if (arg[0] == '@')
                fnReq = 1;
            if (arg.substr(0, 2) == '!@')
                fnReq = 2;
            if (arg.substr(0, 3) == '!!@')
                fnReq = 3;
            if (fnReq) {
                dataRequest = true;
                let res = normalizePath(arg.substr(fnReq));
                if (fnReq == 2)
                    res[SymDataMap] = 'not';
                if (fnReq == 3)
                    res[SymDataMap] = 'doubleNot';
                return res;
            }
        }
        if (isMapFn(arg)) {
            let res = normalizeArgs(arg.args, wrapFn);
            if (res.dataRequest)
                dataRequest = true;
            res = Object.assign(Object.assign({}, arg), res);
            return wrapFn ? wrapFn(res) : res;
        }
        else if (wrapFn && react_ts_utils_2.isMergeable(arg))
            return wrapFn(arg);
        return arg;
    });
    return { dataRequest, args, norm: true };
}
exports.normalizeArgs = normalizeArgs;
function normalizeFn(fn, opts = {}) {
    const { wrapFn } = opts, restOpts = __rest(opts, ["wrapFn"]);
    let nFn = !react_ts_utils_2.isObject(fn) ? Object.assign({ $: fn }, restOpts) : Object.assign(Object.assign({}, fn), restOpts);
    if (nFn.args)
        Object.assign(nFn, normalizeArgs(nFn.args, opts.wrapFn));
    else
        nFn.args = ['${...}'];
    return nFn;
}
exports.normalizeFn = normalizeFn;
function testArray(value) {
    if (react_ts_utils_2.isUndefined(value))
        return [];
    if (!react_ts_utils_2.isArray(value))
        throw new Error('array expected');
    return value;
}
function processProp(nextData, arg) {
    let res = react_ts_utils_1.getIn(nextData, arg);
    switch (arg[SymDataMap]) {
        case 'not':
            return !res;
        case 'doubleNot':
            return !!res;
        default:
            return res;
    }
}
exports.processProp = processProp;
function processFn(map, ...rest) {
    const processArg = (args) => {
        const resArgs = [];
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            if (isNPath(arg))
                resArgs.push(processProp(nextData, arg));
            else if (isMapFn(arg))
                resArgs.push(!arg._map ? processFn.call(this, arg, ...rest) : arg(...rest));
            else if (arg == '${...}')
                resArgs.push(...rest);
            else if (react_ts_utils_2.isString(arg) && ~arg.search(/^\${\d+}$/))
                resArgs.push(rest[arg.substring(2, arg.length - 1)]);
            else
                resArgs.push(arg);
        }
        return resArgs;
    };
    const nextData = map.dataRequest ? this.getData() : null;
    const prArgs = processArg(map.args);
    const res = react_ts_utils_1.toArray(map.$).reduce((args, fn) => react_ts_utils_2.isFunction(fn) ? (map.noStrictArrayResult ? react_ts_utils_1.toArray : testArray)(fn.apply(this, args)) : args, prArgs);
    return map.noStrictArrayResult ? react_ts_utils_1.deArray(res) : testArray(res)[0];
}
exports.processFn = processFn;
function makeSlice(...pathValues) {
    let path = [];
    for (let i = 0; i < pathValues.length - 1; i++)
        react_ts_utils_1.push2array(path, pathValues[i]);
    const value = pathValues[pathValues.length - 1];
    if (!path.length)
        return value;
    return react_ts_utils_1.setIn({}, value, path);
}
exports.makeSlice = makeSlice;
//# sourceMappingURL=stateLib.js.map