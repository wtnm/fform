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
/////////////////////////////////////////////
//  Actions function
/////////////////////////////////////////////
const react_ts_utils_1 = require("react-ts-utils");
const stateLib_1 = require("./stateLib");
const fform_1 = require("./fform");
const dist_1 = require("react-ts-utils/dist");
class exoPromise {
    constructor() {
        this.done = false;
        this.vals = [{}, {}];
        let self = this;
        let promise = new Promise((resolve, reject) => {
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
    setFunction(num, func) {
        let vals = this.vals[num];
        vals['func'] = func;
        if (vals['done'])
            func(...vals['rest']);
    }
    execFunction(num, ...rest) {
        if (!this.done) {
            this.done = true;
            let vals = this.vals[num];
            vals['rest'] = rest;
            vals['done'] = true;
            this.vals[1 - num]['done'] = false;
            if (vals['func'])
                vals['func'](...rest);
        }
    }
}
/////////////////////////////////////////////
//  FFormCore class
/////////////////////////////////////////////
/** Creates a api that contains data and api for changing it */
class FFormStateManager {
    constructor(props) {
        this._listeners = [];
        if (fform_1._CORES[props.name]) {
            let core = fform_1._CORES[props.name];
            if (dist_1.isEqual(core.props, props))
                return core;
        }
        if (((props.getState ? 1 : 0) + (props.setState ? 1 : 0)) == 1)
            new Error('Expected both "getState" and "setState" or none but not only one of them.');
        const self = this;
        fform_1._CORES[props.name] = self;
        self.props = props;
        self.schema = compileSchema(props.schema, props.elements);
        self.name = props.name || '';
        self.dispatch = props.store ? props.store.dispatch : self._dispatch.bind(self);
        self._reducer = fform_1.formReducer();
        if (props.JSONValidator)
            self.JSONValidator = props.JSONValidator(self.schema);
        self._getState = self._getState.bind(self);
        self._setState = self._setState.bind(self);
        if (props.setState && props.store)
            self._unsubscribe = self.props.store.subscribe(self._handleChange.bind(self));
        self.UPDATABLE = { update: {}, replace: {}, api: self };
    }
    _dispatch(action) {
        const self = this;
        if (typeof action === 'function')
            return action(self._dispatch.bind(self));
        else
            self._setState(self._reducer(self._getState() || {}, action));
        return action;
    }
    ;
    _setState(state) {
        const self = this;
        if (state === self._getState())
            return;
        if (self.props.setState)
            self.props.setState(state);
        else
            self._currentState = state;
        if (self.props.store)
            self._setStoreState(state);
        self._listeners.forEach(fn => fn(state));
    }
    _getState() {
        const self = this;
        if (self.props.store)
            return self._getStoreState();
        else if (self.props.getState)
            return self.props.getState();
        else
            return self._currentState;
    }
    _setStoreState(state) {
        return this.props.store.dispatch({ type: anSetState, state, api: this });
    }
    _getStoreState() {
        return this.props.name && this.props.store.getState()[fform_1.getFRVal()][this.props.name];
    }
    _handleChange() {
        const self = this;
        let nextState = self._getStoreState();
        let curState = self.props.getState ? self.props.getState() : self._currentState;
        if (nextState !== curState)
            self._setState(nextState);
    }
    addListener(fn) {
        const self = this;
        self._listeners.push(fn);
        if (self.props.store && !self._unsubscribe)
            self._unsubscribe = self.props.store.subscribe(self._handleChange.bind(self));
        return self.delListener.bind(self, fn);
    }
    delListener(fn) {
        const self = this;
        if (react_ts_utils_1.isUndefined(fn))
            self._listeners = [];
        else {
            let idx = self._listeners.indexOf(fn);
            if (~idx)
                self._listeners.splice(idx, 1);
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
    //wrapped: any;
    constructor(props) {
        super(props);
        this._noExec = 0;
        this._updates = [];
        this._validation = null;
        this.getState = this._getState;
        //getState = () => this._getState();
        //setState = (state: StateType) => this._setState(state);
        this.noExec = () => { this._noExec++; };
        this.execute = (opts = {}) => {
            return this._setExecution(null, react_ts_utils_1.merge(opts, { execute: true }));
        };
        this.setState = (state, opts = {}) => {
            const self = this;
            self._updates = []; // reset all previous updates
            self._newState = state;
            return self._setExecution(null, opts);
        };
        this.getActive = () => this.get(stateLib_1.SymData, 'active');
        this.validate = (path = true, opts = {}) => {
            const self = this;
            if (typeof path == 'boolean')
                self._validation = path;
            else
                stateLib_1.normalizeUpdate({ path: path, value: true }, self.getState()).forEach(i => self._validation = stateLib_1.setIfNotDeeper(self._validation || {}, true, i.path));
            return self._setExecution(null, opts);
        };
        this.get = (...paths) => stateLib_1.getFromState(this.getState(), ...paths);
        this.set = (path, value, opts = {}) => {
            if (path === null)
                return this._setExecution([null], opts);
            let update = __rest(opts, []);
            update.path = path;
            update.value = value;
            return this._setExecution(update, opts);
        };
        this.getValue = (opts = {}) => this.get(stateLib_1.SymData, opts.inital ? 'inital' : 'current', opts.path || []);
        this.setValue = (value, opts = {}) => {
            let { path, inital, replace } = opts, update = __rest(opts, ["path", "inital", "replace"]);
            if (path === null)
                return this._setExecution([null], opts);
            path = stateLib_1.normalizePath(path || []).slice();
            if (~path.indexOf(stateLib_1.SymData))
                update.path = path;
            else {
                let state = this.getState();
                while (!react_ts_utils_1.getIn(state, path) && path.length) {
                    let nm = path.pop();
                    value = { [nm]: value };
                    replace = { [nm]: replace };
                }
                update.path = [inital ? '@inital' : '@current'].concat(path);
            }
            update.value = value;
            update.replace = replace;
            return this._setExecution(update, opts);
        };
        this.getDefaultValue = () => this.get(stateLib_1.SymData, 'default');
        this.switch = (path, value, opts = {}) => this.set(path, value, Object.assign(Object.assign({}, opts), { macros: 'switch' }));
        this.setMessages = (value, opts = {}) => {
            let { priority = 0, group = 3, path = [], props = undefined } = opts, rest = __rest(opts, ["priority", "group", "path", "props"]);
            const msgPath = '@/messages/' + priority + '/texts/' + group;
            if (value === null) {
                this.switch([path, msgPath], [], rest);
                if (react_ts_utils_1.isObject(props))
                    this.switch([path, '@/messages/' + priority], props, rest);
            }
            else {
                let r = stateLib_1.object2PathValues(value, { arrayAsValue: true });
                r.forEach(p => {
                    this.set([path, p, msgPath], p.pop(), Object.assign({ replace: true }, rest));
                    if (react_ts_utils_1.isObject(props))
                        this.set([path, p, '@/messages/' + priority], props, rest);
                });
            }
        };
        this.reset = (opts = {}) => {
            if (opts.status)
                this.set(stateLib_1.normalizePath(opts.path || '/'), react_ts_utils_1.isUndefined(opts.value) ? stateLib_1.SymReset : opts.value, { [stateLib_1.SymData]: ['status', opts.status], macros: 'switch' });
            else {
                this.setValue(stateLib_1.SymReset, opts);
                this.setMessages(opts);
            }
        };
        this.clear = (opts = {}) => this.setValue(stateLib_1.SymClear, opts);
        this.arrayAdd = (path, value = 1, opts = {}) => this._setExecution(Object.assign({ path, value: value, macros: 'array' }, opts), opts);
        this.arrayItemOps = (path, value, opts = {}) => this._setExecution(Object.assign({ path, op: value, macros: 'arrayItem' }, opts), opts);
        this.setHidden = (path, value = true, opts = {}) => this._setExecution([Object.assign({ path: [path, '@', '/params/hidden'], value }, opts)], opts);
        this.showOnly = (path, opts = {}) => {
            path = stateLib_1.normalizePath(path);
            return this._setExecution([
                Object.assign({ path: [path.slice(0, -1), '/*/@/params/hidden'], value: true }, opts),
                Object.assign({ path: [path, '@', '/params/hidden'], value: false }, opts),
            ], opts);
        };
        this.getSchemaPart = (path = []) => {
            path = stateLib_1.normalizePath(path);
            return stateLib_1.getSchemaPart(this.schema, path, stateLib_1.oneOfFromState(this.getState()));
        };
        const self = this;
        if (props.state)
            self._setState(props.state);
        else if (!self._getState())
            self._setState(stateLib_1.initState(self.UPDATABLE));
        const state = self._getState();
        if (!state[stateLib_1.SymDataMap]) // no data maps, it means that state from server-side render
            self._setState(stateLib_1.rehydrateState(state, self.UPDATABLE));
    }
    wrapper(self = {}) {
        const api = this;
        const wrapApi = (fn) => self[fn] || api[fn];
        const wrapPath = (path = './') => path && stateLib_1.normalizePath(path, self.path);
        const wrapOpts = (opts = {}, forcePath) => {
            const { path } = opts, rest = __rest(opts, ["path"]);
            if (path === null)
                rest.path = null;
            else if (!react_ts_utils_1.isUndefined(path) || forcePath)
                rest.path = wrapPath(path || './');
            return self.wrapOpts ? self.wrapOpts(rest) : rest;
            //rest.noValidation = isUndefined(noValidation) ? !self.liveValidate : noValidation;
        };
        const wrapped = {
            validate: (path = './', ...args) => wrapApi('validate')(typeof path == 'boolean' ? path : wrapPath(path), ...args),
            get: (...path) => wrapApi('get')(wrapPath(path)),
            // set: (path: string | Path = [], value: any, opts?: any, ...args: any[]) => wrapThis('set')(wrapPath(path), value, wrapOpts(opts)),
            //  setValue: (value: any, opts: any = {}, ...args: any[]) => wrapApi('setValue')(value, wrapOpts(opts)),
            bind: (object) => {
                self = object;
                return wrapped;
            },
            getValue: (opts = {}) => wrapped.get(stateLib_1.SymData, opts.inital ? 'inital' : 'current', wrapPath(opts.path)),
            getApi: () => api,
        };
        ['setValue', 'setMessages'].forEach(fn => wrapped[fn] = (value, opts = {}, ...args) => wrapApi(fn)(value, wrapOpts(opts), ...args));
        ['noExec', 'setState', 'getActive', 'getDefaultValue']
            .forEach(fn => wrapped[fn] = (...args) => wrapApi(fn)(...args));
        ['reset', 'clear', 'execute']
            .forEach(fn => wrapped[fn] = (opts, ...args) => wrapApi(fn)(wrapOpts(opts, true), ...args));
        ['showOnly', 'getSchemaPart']
            .forEach(fn => wrapped[fn] = (path = [], opts = {}, ...args) => wrapApi(fn)(wrapPath(path), wrapOpts(opts), ...args));
        ['set', 'switch', 'arrayAdd', 'arrayItemOps', 'setHidden']
            .forEach(fn => wrapped[fn] = (path = [], value, opts = {}, ...args) => wrapApi(fn)(wrapPath(path), value, wrapOpts(opts), ...args));
        return wrapped;
    }
    _clearActions() {
        const self = this;
        self._newState = undefined;
        self._defferedTimerId = null;
        self._validation = null;
        self._updates = [];
        self._promise(true);
    }
    _execBatch(updates, opts, promises, forceValidation) {
        const self = this;
        let action = { type: anUpdateState, state: self._newState, updates, api: self, forceValidation, opts, promises };
        self._clearActions();
        //console.log(' _execBatch.forceValidation', JSON.stringify(forceValidation));
        self.dispatch(stateLib_1.updateState.bind(action));
        return promises;
    }
    _setExecution(addUpdates, opts = {}) {
        if (opts.setExecution)
            return opts.setExecution(addUpdates, opts);
        const self = this;
        if (addUpdates)
            react_ts_utils_1.push2array(self._updates, addUpdates);
        // console.log('---------------- added updates', updates);
        if (opts.force === true && self._noExec > 0)
            self._noExec--;
        let promises = self._promise();
        if (opts.execute === false || self._noExec)
            return promises;
        if (self._defferedTimerId)
            clearTimeout(self._defferedTimerId);
        //console.log(' _setExecution._validation', JSON.stringify(self._validation));
        if (opts.execute === true)
            self._execBatch(self._updates, opts, promises, self._validation);
        else
            self._defferedTimerId = setTimeout(self._execBatch.bind(self, self._updates, opts, promises, self._validation), opts.execute || 0);
        return promises;
    }
    _promise(reset) {
        const self = this;
        if (reset)
            self._resultPromises = null;
        if (!self._resultPromises) {
            self._resultPromises = new exoPromise();
            self._resultPromises.vAsync = new exoPromise();
        }
        return self._resultPromises;
    }
}
exports.FFormStateAPI = FFormStateAPI;
/////////////////////////////////////////////
//  Actions names
/////////////////////////////////////////////
const anSetState = 'FFROM_SET_STATE';
exports.anSetState = anSetState;
const anUpdateState = 'FFROM_UPDATE_STATE';
/////////////////////////////////////////////
//  Reducer
/////////////////////////////////////////////
/////////////////////////////////////////////
//  Schema compile functions
/////////////////////////////////////////////
const compileSchema = (schema, elements) => isCompiled(schema) ? schema : getCompiledSchema(elements, schema);
exports.compileSchema = compileSchema;
const getCompiledSchema = react_ts_utils_1.memoize((elements, schema) => {
    let $id = fform_1.schemaRegister(schema);
    let res = schemaCompiler($id, elements, schema);
    res._elements = elements;
    res._schema = schema;
    return res;
});
const val2obj = (obj) => {
    return react_ts_utils_1.isObject(obj) ? obj : react_ts_utils_1.toArray(obj);
};
function schemaCompiler($id, elements = {}, schema, track = []) {
    if (isCompiled(schema))
        return schema;
    const result = react_ts_utils_1.isArray(schema) ? [] : { _compiled: true };
    let _a = schema, { _validators, _data$, _stateMaps, _oneOfSelector } = _a, rest = __rest(_a, ["_validators", "_data$", "_stateMaps", "_oneOfSelector"]);
    const nFnOpts = { noStrictArrayResult: true };
    if (_validators)
        result._validators = stateLib_1.objMap(val2obj(objectResolver(elements, _validators, track)), (f) => stateLib_1.normalizeFn(f, nFnOpts));
    if (_data$)
        result._data$ = stateLib_1.objMap(val2obj(objectResolver(elements, _data$, track)), (f) => stateLib_1.normalizeFn(f));
    if (_stateMaps)
        result._stateMaps = objectResolver(elements, _stateMaps, track);
    if (_oneOfSelector)
        result._oneOfSelector = objectResolver(elements, stateLib_1.normalizeFn(_oneOfSelector, nFnOpts), track);
    react_ts_utils_1.objKeys(rest).forEach(key => {
        if (key.substr(0, 1) == '_')
            return result[key] = key !== '_presets' && stateLib_1.isElemRef(rest[key]) ? convRef(elements, rest[key], track) : rest[key];
        switch (key) {
            case '$ref':
                if (rest[key][0] === '#')
                    result[key] = $id + rest[key];
                else
                    result[key] = rest[key];
                break;
            case 'default':
            case 'enum':
                result[key] = rest[key];
                break;
            case 'definitions':
            case 'properties':
            case 'patternProperties':
            case 'dependencies':
                let res = {};
                let obj = rest[key] || {};
                if (react_ts_utils_1.isArray(obj))
                    res = obj; // "dependencies" may be of string[] type
                else
                    react_ts_utils_1.objKeys(obj).forEach((k) => (res[k] = schemaCompiler($id, elements, obj[k], track.concat(key, k))));
                result[key] = res;
                //result[key] = objMap(rest[key], schemaCompiler.bind(null, elements));
                break;
            default:
                if (react_ts_utils_1.isMergeable(rest[key]))
                    result[key] = schemaCompiler($id, elements, rest[key], track.concat(key));
                else
                    result[key] = rest[key];
                break;
        }
    });
    return result;
}
function isCompiled(schema) {
    return react_ts_utils_1.getIn(schema, '_compiled');
}
function testRef(refRes, $_ref, track) {
    if (react_ts_utils_1.isUndefined(refRes))
        throw new Error('Reference "' + $_ref + '" leads to undefined object\'s property in path: ' + stateLib_1.path2string(track));
    return true;
}
function getInWithCheck(refRes, path) {
    let elems = refRes['^'];
    let whileBreak = false;
    while (!whileBreak) {
        whileBreak = true;
        for (let j = 0; j < path.length; j++) {
            refRes = react_ts_utils_1.getIn(refRes, path[j]);
            if (stateLib_1.isElemRef(refRes)) {
                path = stateLib_1.string2path(refRes).concat(path.slice(j + 1));
                refRes = { '^': elems };
                whileBreak = false;
                break;
            }
            if (react_ts_utils_1.isFunction(refRes) && j + 1 !== path.length) { // check if there is a function
                refRes = refRes(elems, path.slice(j + 1));
                break;
            }
            if (react_ts_utils_1.isUndefined(refRes))
                break;
        }
    }
    return refRes;
}
function objectDerefer(_elements, obj2deref, track = []) {
    if (!react_ts_utils_1.isMergeable(obj2deref))
        return obj2deref;
    let { $_ref = '' } = obj2deref, restObj = __rest(obj2deref, ["$_ref"]);
    $_ref = $_ref.split(':');
    const objs2merge = [];
    for (let i = 0; i < $_ref.length; i++) {
        if (!$_ref[i])
            continue;
        let path = stateLib_1.string2path($_ref[i]);
        if (path[0] !== '^')
            throw new Error('Can reffer only to ^');
        let refRes = getInWithCheck({ '^': _elements }, path);
        testRef(refRes, $_ref[i], track.concat('@' + i));
        if (react_ts_utils_1.isMergeable(refRes))
            refRes = objectDerefer(_elements, refRes, track.concat('@' + i));
        objs2merge.push(refRes);
    }
    let result = react_ts_utils_1.isArray(obj2deref) ? [] : {};
    for (let i = 0; i < objs2merge.length; i++)
        result = react_ts_utils_1.merge(result, objs2merge[i]);
    return react_ts_utils_1.merge(result, stateLib_1.objMap(restObj, objectDerefer.bind(null, _elements), track));
    //objKeys(restObj).forEach(key => result[key] = isMergeable(restObj[key]) ? objectDerefer(_objects, restObj[key]) : restObj[key]);
}
exports.objectDerefer = objectDerefer;
function skipKey(key, obj) {
    return key.substr(0, 2) == '_$' || obj['_$skipKeys'] && ~obj['_$skipKeys'].indexOf(key);
}
exports.skipKey = skipKey;
const convRef = (_elements, refs, track = [], prefix = '') => {
    const _objs = { '^': _elements };
    return react_ts_utils_1.deArray(refs.split('|').map((ref, i) => {
        ref = ref.trim();
        if (stateLib_1.isElemRef(ref))
            prefix = ref.substr(0, ref.lastIndexOf('/') + 1);
        else
            ref = prefix + ref;
        ref = ref.split(':');
        let result;
        for (let i = 0; i < ref.length; i++) {
            let r = ref[i];
            if (!r)
                continue;
            if (!stateLib_1.isElemRef(r))
                r = prefix + r;
            let refRes = getInWithCheck(_objs, stateLib_1.string2path(r));
            testRef(refRes, r, track.concat('@' + i));
            result = result ? react_ts_utils_1.merge(result, refRes) : refRes;
        }
        return result;
    }));
};
function objectResolver(_elements, obj2resolve, track = []) {
    if (stateLib_1.isElemRef(obj2resolve))
        return convRef(_elements, obj2resolve, track);
    if (!react_ts_utils_1.isMergeable(obj2resolve))
        return obj2resolve;
    const _objs = { '^': _elements };
    const result = objectDerefer(_elements, obj2resolve);
    const retResult = react_ts_utils_1.isArray(result) ? [] : {};
    react_ts_utils_1.objKeys(result).forEach((key) => {
        let value = result[key];
        if (stateLib_1.isElemRef(value)) {
            value = convRef(_elements, value, track);
            if (key !== '$' && !skipKey(key, result) && (react_ts_utils_1.isFunction(value) || react_ts_utils_1.isArray(value) && value.every(react_ts_utils_1.isFunction)))
                value = { $: value };
        }
        if (!skipKey(key, result))
            retResult[key] = objectResolver(_elements, value, track.concat(key));
        else
            retResult[key] = value;
    });
    return retResult;
}
exports.objectResolver = objectResolver;
//# sourceMappingURL=api.js.map