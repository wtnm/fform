(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"));
	else if(typeof define === 'function' && define.amd)
		define(["React"], factory);
	else if(typeof exports === 'object')
		exports["fform"] = factory(require("React"));
	else
		root["fform"] = factory(root["React"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_react__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/fform.tsx");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/api.tsx":
/*!*********************!*\
  !*** ./src/api.tsx ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
/////////////////////////////////////////////
//  Actions function
/////////////////////////////////////////////
const commonLib_1 = __webpack_require__(/*! ./commonLib */ "./src/commonLib.tsx");
const stateLib_1 = __webpack_require__(/*! ./stateLib */ "./src/stateLib.tsx");
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
const _CORES = new WeakMap();
function fformCores(name) { return _CORES[name]; }
exports.fformCores = fformCores;
/** Creates a api that contains data and api for changing it */
class FFormStateManager {
    constructor(props) {
        this._listeners = [];
        // if ((props.getState || props.setState) && props.store) throw new Error('Expected either "store" or "getState & setState" but not all of them.');
        if (((props.getState ? 1 : 0) + (props.setState ? 1 : 0)) == 1)
            new Error('Expected both "getState" and "setState" or none but not only one of them.');
        if (props.store && !props.name)
            throw new Error('Expected "name" to be passed together with "store".');
        const self = this;
        self.props = props;
        self.schema = isCompiled(props.schema) ? props.schema : compileSchema(props.elements, props.schema);
        self.name = props.name || '';
        self.dispatch = props.store ? props.store.dispatch : self._dispatch.bind(self);
        self._reducer = formReducer();
        if (props.JSONValidator)
            self.JSONValidator = props.JSONValidator(self.schema);
        //self._validator = props.JSONValidator && props.JSONValidator(self.schema, {greedy: true});
        //self.JSONValidator = self._validator && self.JSONValidator.bind(self);
        self._getState = self._getState.bind(self);
        self._setState = self._setState.bind(self);
        if (props.setState && props.store)
            self._unsubscribe = self.props.store.subscribe(self._handleChange.bind(self));
        if (props.name)
            _CORES[props.name] = self;
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
        return this.props.name && this.props.store.getState()[getFRVal()][this.props.name];
    }
    // private JSONValidator(data: any) {
    //   this._validator(data);
    //   let result = this._validator.errors;
    //   if (!result) return [];
    //   if (!isArray(result)) result = [result];
    //   return result.map((item: any) => [item.field.replace('["', '.').replace('"]', '').split('.').slice(1), item.message])
    // }
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
        if (commonLib_1.isUndefined(fn))
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
            return this._setExecution(null, commonLib_1.merge(opts, { execute: true }));
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
                while (!commonLib_1.getIn(state, path) && path.length) {
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
        this.switch = (path, value, opts = {}) => this.set(path, value, Object.assign({}, opts, { macros: 'switch' }));
        this.setMessages = (value, opts) => {
            let _a = opts || {}, { priority = 0, group = 3, path = [], props = undefined } = _a, rest = __rest(_a, ["priority", "group", "path", "props"]);
            const msgPath = '@/messages/' + priority + '/texts/' + group;
            if (value === null) {
                this.switch([path, msgPath], [], rest);
                if (commonLib_1.isObject(props))
                    this.switch([path, '@/messages/' + priority], props, rest);
            }
            else {
                stateLib_1.object2PathValues(value, { arrayAsValue: true }).forEach(p => {
                    this.set([path, p, msgPath], p.pop(), rest);
                    if (commonLib_1.isObject(props))
                        this.set([path, p, '@/messages/' + priority], props, rest);
                });
            }
        };
        this.reset = (opts = {}) => opts.status ? this.set(stateLib_1.normalizePath(opts.path || '/'), commonLib_1.isUndefined(opts.value) ? stateLib_1.SymReset : opts.value, { [stateLib_1.SymData]: ['status', opts.status], macros: 'switch' }) : this.setValue(stateLib_1.SymReset, opts);
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
        this.getSchemaPart = (path) => {
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
            else if (!commonLib_1.isUndefined(path) || forcePath)
                rest.path = wrapPath(path || './');
            return self.wrapOpts ? self.wrapOpts(rest) : rest;
            //rest.noValidation = isUndefined(noValidation) ? !self.liveValidate : noValidation;
        };
        const wrapped = {
            validate: (path = './', ...args) => wrapApi('validate')(typeof path == 'boolean' ? path : wrapPath(path), ...args),
            get: (...path) => wrapApi('get')(wrapPath(path)),
            // set: (path: string | Path = [], value: any, opts?: any, ...args: any[]) => wrapThis('set')(wrapPath(path), value, wrapOpts(opts)),
            setValue: (value, opts = {}, ...args) => wrapApi('setValue')(value, wrapOpts(opts)),
            bind: (object) => {
                self = object;
                return wrapped;
            },
            getValue: (opts = {}) => wrapped.get(stateLib_1.SymData, opts.inital ? 'inital' : 'current', wrapPath(opts.path)),
            getApi: () => api,
        };
        ['noExec', 'setState', 'getActive', 'getDefaultValue']
            .forEach(fn => wrapped[fn] = (...args) => wrapApi(fn)(...args));
        ['reset', 'clear', 'execute']
            .forEach(fn => wrapped[fn] = (opts, ...args) => wrapApi(fn)(wrapOpts(opts, true), ...args));
        ['showOnly', 'getSchemaPart']
            .forEach(fn => wrapped[fn] = (path = [], opts = {}, ...args) => wrapApi(fn)(wrapPath(path), wrapOpts(opts), ...args));
        ['set', 'switch', 'arrayAdd', 'arrayItemOps', 'setHidden', 'showOnly']
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
            commonLib_1.push2array(self._updates, addUpdates);
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
let formReducerValue = 'fforms';
function getFRVal() {
    return formReducerValue;
}
exports.getFRVal = getFRVal;
function formReducer(name) {
    if (name)
        formReducerValue = name;
    const reducersFunction = {};
    function replaceFormState(storageState, name, formState) {
        if (storageState[name] !== formState) {
            let resultState = Object.assign({}, storageState);
            resultState[name] = formState;
            return resultState;
        }
        return storageState;
    }
    reducersFunction[anSetState] = (state, action) => {
        if (action.api.props.store)
            return replaceFormState(state, action.api.name, action.state);
        return action.state;
    };
    return (state = {}, action) => {
        let reduce = reducersFunction[action.type];
        return reduce ? reduce(state, action) : state;
    };
}
exports.formReducer = formReducer;
/////////////////////////////////////////////
//  Schema compile functions
/////////////////////////////////////////////
const compileSchema = commonLib_1.memoize((elements, schema) => schemaCompiler(elements, schema));
function schemaCompiler(elements = {}, schema) {
    if (isCompiled(schema))
        return schema;
    let { _validators, _stateMaps, _oneOfSelector } = schema, rest = __rest(schema, ["_validators", "_stateMaps", "_oneOfSelector"]);
    const result = commonLib_1.isArray(schema) ? [] : { _compiled: true };
    const nFnOpts = { noStrictArrayResult: true };
    _validators && (result._validators = commonLib_1.toArray(objectResolver(elements, _validators)).map(f => stateLib_1.normalizeFn(f, nFnOpts)));
    _stateMaps && (result._stateMaps = objectResolver(elements, _stateMaps));
    _oneOfSelector && (result._oneOfSelector = objectResolver(elements, stateLib_1.normalizeFn(_oneOfSelector, nFnOpts)));
    //if (isFunction(result._oneOfSelector)) result._oneOfSelector = {$: result._oneOfSelector};
    commonLib_1.objKeys(rest).forEach(key => {
        if (key.substr(0, 1) == '_')
            return result[key] = rest[key];
        switch (key) {
            case 'default':
            case 'enum':
                result[key] = rest[key];
                break;
            case 'definitions':
            case 'properties':
            case 'patternProperties':
            case 'dependencies':
                result[key] = stateLib_1.objMap(rest[key], schemaCompiler.bind(null, elements));
                break;
            default:
                if (commonLib_1.isMergeable(rest[key]))
                    result[key] = schemaCompiler(elements, rest[key]);
                else
                    result[key] = rest[key];
                break;
        }
    });
    return result;
}
function isCompiled(schema) {
    return commonLib_1.getIn(schema, '_compiled');
}
function testRef(refRes, $_ref, track) {
    if (commonLib_1.isUndefined(refRes))
        throw new Error('Reference "' + $_ref + '" leads to undefined object\'s property in path: ' + stateLib_1.path2string(track));
    return true;
}
function objectDerefer(_elements, obj2deref, track = []) {
    if (!commonLib_1.isMergeable(obj2deref))
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
        let refRes = commonLib_1.getIn({ '^': _elements }, path);
        testRef(refRes, $_ref[i], track.concat('@' + i));
        if (commonLib_1.isMergeable(refRes))
            refRes = objectDerefer(_elements, refRes, track.concat('@' + i));
        objs2merge.push(refRes);
    }
    let result = commonLib_1.isArray(obj2deref) ? [] : {};
    for (let i = 0; i < objs2merge.length; i++)
        result = commonLib_1.merge(result, objs2merge[i]);
    return commonLib_1.merge(result, stateLib_1.objMap(restObj, objectDerefer.bind(null, _elements), track));
    //objKeys(restObj).forEach(key => result[key] = isMergeable(restObj[key]) ? objectDerefer(_objects, restObj[key]) : restObj[key]);
}
exports.objectDerefer = objectDerefer;
function objectResolver(_elements, obj2resolve, track = []) {
    const convRef = (refs, prefix = '') => commonLib_1.deArray(refs.split('|').map((ref, i) => {
        ref = ref.trim();
        if (isRef(ref))
            prefix = ref.substr(0, ref.lastIndexOf('/') + 1);
        else
            ref = prefix + ref;
        let refRes = commonLib_1.getIn(_objs, stateLib_1.string2path(ref));
        testRef(refRes, ref, track.concat('@' + i));
        return refRes;
    }));
    const isRef = (val) => val.substr(0, 2) == '^/';
    const _objs = { '^': _elements };
    const result = objectDerefer(_elements, obj2resolve);
    const retResult = commonLib_1.isArray(result) ? [] : {};
    commonLib_1.objKeys(result).forEach((key) => {
        let value = result[key];
        if (commonLib_1.isString(value) && isRef(value.trim())) {
            value = convRef(value);
            if (key !== '$' && key.substr(0, 2) !== '_$' && (commonLib_1.isFunction(value) || commonLib_1.isArray(value) && value.every(commonLib_1.isFunction)))
                value = { $: value };
        }
        if (key.substr(0, 2) !== '_$' && commonLib_1.isMergeable(value))
            retResult[key] = objectResolver(_elements, value, track.concat(key));
        else
            retResult[key] = value;
    });
    return retResult;
}
exports.objectResolver = objectResolver;


/***/ }),

/***/ "./src/commonLib.tsx":
/*!***************************!*\
  !*** ./src/commonLib.tsx ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const isUndefined = (value) => typeof value === 'undefined';
exports.isUndefined = isUndefined;
const isNumber = (value) => typeof value === "number";
exports.isNumber = isNumber;
const isInteger = (value) => typeof value === "number" && (Math.floor(value) === value || value > 9007199254740992 || value < -9007199254740992);
exports.isInteger = isInteger;
const isString = (value) => typeof value === 'string';
exports.isString = isString;
const isArray = Array.isArray;
exports.isArray = isArray;
const isObject = (value) => isMergeable(value) && !isArray(value);
exports.isObject = isObject;
const isFunction = (value) => typeof value === 'function';
exports.isFunction = isFunction;
const toArray = (value) => isArray(value) ? value : [value];
exports.toArray = toArray;
const deArray = (value, keepArray) => !keepArray && isArray(value) && value.length == 1 ? value[0] : value;
exports.deArray = deArray;
function isMergeable(val) {
    const nonNullObject = val && typeof val === 'object';
    return nonNullObject
        && Object.prototype.toString.call(val) !== '[object RegExp]'
        && Object.prototype.toString.call(val) !== '[object Date]';
}
exports.isMergeable = isMergeable;
const objKeys = Object.keys;
exports.objKeys = objKeys;
const objKeysNSymb = (obj) => objKeys(obj).concat(Object.getOwnPropertySymbols(obj));
exports.objKeysNSymb = objKeysNSymb;
const _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
    ? (obj) => typeof obj
    : (obj) => obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
function is(x, y) {
    // SameValue algorithm
    if (x === y) { // Steps 1-5, 7-10
        // Steps 6.b-6.e: +0 != -0
        return x !== 0 || 1 / x === 1 / y;
    }
    else {
        // Step 6.a: NaN == NaN
        return x !== x && y !== y;
    }
}
function isEqual(objA, objB, options = {}) {
    if (is(objA, objB))
        return true;
    if ((isUndefined(objA) ? 'undefined' : _typeof(objA)) !== 'object' || objA === null || (isUndefined(objB) ? 'undefined' : _typeof(objB)) !== 'object' || objB === null)
        return false;
    const fn = options.symbol ? objKeysNSymb : objKeys;
    const keysA = fn(objA);
    const keysB = fn(objB);
    if (keysA.length !== keysB.length)
        return false;
    const { skipKeys = [], deepKeys = [] } = options;
    for (let i = 0; i < keysA.length; i++) {
        if (~skipKeys.indexOf(keysA[i]))
            continue; // if key is an skip key, skip comparison
        if (options.deep || ~deepKeys.indexOf(keysA[i])) {
            const result = isEqual(objA[keysA[i]], objB[keysA[i]], options);
            if (!result)
                return false;
        }
        else if (!objB.hasOwnProperty(keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
            return false;
        }
    }
    return true;
}
exports.isEqual = isEqual;
function asNumber(value) {
    if (value === "")
        return null;
    if (/\.$/.test(value))
        return value; // "3." can't really be considered a number even if it parses in js. The user is most likely entering a float.
    if (/\.0$/.test(value))
        return value; // we need to return this as a string here, to allow for input like 3.07
    const n = Number(value);
    const valid = typeof n === "number" && !Number.isNaN(n);
    if (/\.\d*0$/.test(value))
        return value; // It's a number, that's cool - but we need it as a string so it doesn't screw with the user when entering dollar amounts or other values (such as those with specific precision or number of significant digits)
    return valid ? n : value;
}
exports.asNumber = asNumber;
function memoize(fn) {
    fn.cache = new Map();
    return function (...args) {
        let newArgs = [args.length].concat(args);
        let cache = fn.cache;
        let last = newArgs.pop();
        for (let i = 0; i < newArgs.length; i++) {
            cache.has(newArgs[i]) || cache.set(newArgs[i], new Map());
            cache = cache.get(newArgs[i]);
        }
        if (!cache.has(last))
            cache.set(last, fn.apply(this, args));
        return cache.get(last);
    };
}
exports.memoize = memoize;
function push2array(array, ...vals) {
    for (let i = 0; i < vals.length; i++) {
        if (isArray(vals[i]))
            array.push(...vals[i]);
        else
            array.push(vals[i]);
    }
    return array;
}
exports.push2array = push2array;
function moveArrayElems(arr, from, to) {
    let length = arr.length;
    if (length) {
        from = (from % length + length) % length;
        to = (to % length + length) % length;
    }
    let elem = arr[from];
    for (let i = from; i < to; i++)
        arr[i] = arr[i + 1];
    for (let i = from; i > to; i--)
        arr[i] = arr[i - 1];
    arr[to] = elem;
    return arr;
}
exports.moveArrayElems = moveArrayElems;
//////////////////////////////
//  object get/set functions
/////////////////////////////
function makeSlice(...pathValues) {
    let path = [];
    for (let i = 0; i < pathValues.length - 1; i++)
        push2array(path, pathValues[i]);
    const value = pathValues[pathValues.length - 1];
    if (!path.length)
        return value;
    return setIn({}, value, path);
}
exports.makeSlice = makeSlice;
function hasIn(state, ...paths) {
    if (paths.length > 0) {
        for (let i = 0; i < paths.length; i++) {
            let path = isArray(paths[i]) ? paths[i] : [paths[i]];
            for (let j = 0; j < path.length; j++) {
                if (isUndefined(path[j]))
                    continue;
                try {
                    if (!state.hasOwnProperty(path[j]))
                        return false;
                }
                catch (e) {
                    return false;
                }
                state = state[path[j]];
            }
        }
    }
    return true;
}
exports.hasIn = hasIn;
function setIn(state, value, ...paths) {
    let result = state;
    let key;
    if (paths.length > 0) {
        for (let i = 0; i < paths.length; i++) {
            let path = isArray(paths[i]) ? paths[i] : [paths[i]];
            for (let j = 0; j < path.length; j++) {
                if (isUndefined(path[j]))
                    continue;
                if (!isUndefined(key)) {
                    if (!isMergeable(result[key]))
                        result[key] = {};
                    result = result[key];
                }
                key = path[j];
                // prev = result;
                // result = result[key];
            }
        }
    }
    if (!isUndefined(key))
        result[key] = value;
    else
        return value;
    return state;
}
exports.setIn = setIn;
function delIn(state, path) {
    // if (path[0] == '#') path = path.slice(1);
    if (!path.length)
        return state;
    const keys = typeof path[0] == 'string' ? path[0].split(',') : [path[0]];
    const newPath = path.slice(1);
    if (newPath.length) {
        keys.forEach((key) => {
            let newObj;
            if (isMergeable(state[key]))
                newObj = delIn(state[key], newPath);
            if (newObj && (newObj !== state[key]))
                state = merge(merge(state, makeSlice(key, undefined)), makeSlice(key, newObj));
        });
    }
    else {
        for (let i = 0; i < keys.length; i++) {
            if (state.hasOwnProperty(keys[i])) {
                state = Object.assign({}, state);
                break;
            }
        }
        for (let i = 0; i < keys.length; i++)
            delete state[keys[i]];
    }
    return state;
}
exports.delIn = delIn;
function getIn(state, ...paths) {
    let res = state;
    for (let i = 0; i < paths.length; i++) {
        let track = paths[i];
        if (typeof track === 'function')
            track = track(res);
        if (!isArray(track))
            track = [track];
        for (let j = 0; j < track.length; j++) {
            //if (isUndefined(res) ) return res;
            if (!isMergeable(res))
                return undefined;
            if (isUndefined(track[j]))
                continue;
            res = res[track[j]];
        }
    }
    return res;
}
exports.getIn = getIn;
;
function getCreateIn(state, value, ...paths) {
    if (!hasIn(state, ...paths))
        setIn(state, value, ...paths);
    return getIn(state, ...paths);
}
exports.getCreateIn = getCreateIn;
//////////////////////////////
//  object merge functions
/////////////////////////////
function mergeState(state, source, options = {}) {
    const fn = options.noSymbol ? objKeys : objKeysNSymb;
    // let arrayMergeFn: any = false;
    let { SymbolDelete, del, diff, replace, arrays } = options;
    let forceReplace = replace;
    if (typeof forceReplace !== 'function') {
        if (!isMergeable(replace))
            forceReplace = () => false;
        else
            forceReplace = (path) => getIn(replace, path);
    }
    if (replace === true || forceReplace([], state, source) === true)
        return { state: source, changes: state !== source ? source : undefined };
    //const mergeArrays = arrays != 'replace';
    //const setLength = arrays == 'merge';
    // if (typeof mergeArrays === 'function') arrayMergeFn = mergeArrays;
    //const canMerge = mergeArrays === true ? isMergeable : isObject;
    if (!isFunction(arrays))
        arrays = undefined;
    function recusion(state, source, track = []) {
        const changes = {};
        const isSourceArray = isArray(source);
        if (!isMergeable(state)) {
            state = isSourceArray ? [] : {}; // return only elements
            if (isArray(state))
                changes.length = 0;
        }
        const isStateArray = isArray(state);
        if (!isMergeable(source))
            return { state }; // merge only mergeable elements, may be throw here
        if (isStateArray && isSourceArray) {
            if (arrays)
                source = arrays(state, source, track);
            if (state.length != source.length)
                changes.length = source.length;
        }
        let stateKeys = fn(state);
        if (stateKeys.length == 0 && !del) {
            if (!isStateArray && !isSourceArray)
                return fn(source).length ? { state: source, changes: source } : { state };
            if (isStateArray && isSourceArray) {
                if (state.length == source.length && source.length == 0)
                    return { state };
                return (fn(source).length || source.length !== state.length) ? { state: source, changes: source } : { state };
            }
        }
        let srcKeys = fn(source);
        const changedObjects = {};
        const result = (isStateArray ? [] : {});
        if (diff) {
            stateKeys.forEach(key => {
                if (!~srcKeys.indexOf(key))
                    changes[key] = SymbolDelete;
            });
        }
        srcKeys.forEach(key => {
            if (del && source[key] === SymbolDelete) {
                if (state.hasOwnProperty(key))
                    changes[key] = SymbolDelete;
            }
            else {
                let keyTrack = track.concat(key);
                if (!isMergeable(source[key]) || !isMergeable(state[key]) || forceReplace(keyTrack, state[key], source[key]) === true) {
                    if (!state.hasOwnProperty(key) || !is(state[key], source[key]))
                        changes[key] = source[key];
                }
                else {
                    if (state[key] !== source[key]) {
                        let obj = recusion(state[key], source[key], keyTrack);
                        if (obj.changes)
                            changedObjects[key] = obj;
                    }
                }
            }
        });
        let changedObjKeys = fn(changedObjects);
        let changesKeys = fn(changes);
        if (changesKeys.length == 0 && changedObjKeys.length == 0)
            return { state };
        else {
            Object.assign(result, state);
            changesKeys.forEach(key => {
                if (del && changes[key] === SymbolDelete || diff && !source.hasOwnProperty(key))
                    delete result[key];
                else
                    result[key] = changes[key];
            });
            changedObjKeys.forEach(key => {
                result[key] = changedObjects[key].state;
                changes[key] = changedObjects[key].changes;
            });
            return { state: result, changes };
        }
    }
    return recusion(state, source);
}
exports.mergeState = mergeState;
const merge = (a, b, opts = {}) => mergeState(a, b, opts).state;
exports.merge = merge;
merge.all = function (state, obj2merge, options = {}) {
    if (obj2merge.length == 0)
        return state; // no changes should be done
    else
        return obj2merge.reduce((prev, next) => merge(prev, next, options), state); // merge
};


/***/ }),

/***/ "./src/fform.tsx":
/*!***********************!*\
  !*** ./src/fform.tsx ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/** @jsx h */
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __webpack_require__(/*! react */ "react");
//const React = require('preact');
const commonLib_1 = __webpack_require__(/*! ./commonLib */ "./src/commonLib.tsx");
const stateLib_1 = __webpack_require__(/*! ./stateLib */ "./src/stateLib.tsx");
const api_1 = __webpack_require__(/*! ./api */ "./src/api.tsx");
exports.FFormStateAPI = api_1.FFormStateAPI;
exports.fformCores = api_1.fformCores;
exports.formReducer = api_1.formReducer;
/////////////////////////////////////////////
//  Main class
/////////////////////////////////////////////
class FForm extends react_1.Component {
    constructor(props, context) {
        super(props, context);
        this._methods = { onSubmit: null, onChange: null, onStateChange: null };
        this.wrapFns = bindProcessorToThis;
        const self = this;
        let { core: coreParams } = props;
        self.api = coreParams instanceof api_1.FFormStateAPI ? coreParams : self._getCoreFromParams(coreParams, context);
        Object.defineProperty(self, "elements", { get: () => self.api.props.elements });
        Object.defineProperty(self, "valid", { get: () => self.api.get('/@/status/valid') });
        self.parent = props.parent;
        // self.focus = self.focus.bind(self);
        const nextProps = Object.assign({}, props);
        if (props.touched !== null)
            nextProps.touched = !!nextProps.touched;
        FForm.params.forEach(k => {
            if (!commonLib_1.isUndefined(nextProps[k]))
                nextProps[k] = (v) => commonLib_1.isUndefined(v) ? props[k] : v;
        });
        self._updateMethods(props);
        self._updateValues(nextProps);
        if (!props.noValidation)
            self.api.validate(true);
        self._unsubscribe = self.api.addListener(self._handleStateUpdate.bind(self));
        self._setRootRef = self._setRootRef.bind(self);
        self._setFormRef = self._setFormRef.bind(self);
        self._submit = self._submit.bind(self);
        self._getPath = self._getPath.bind(self);
        self.reset = self.reset.bind(self);
    }
    _updateMethods(nextProps, prevProps = {}) {
        const self = this;
        const newMethods = {};
        commonLib_1.objKeys(self._methods).forEach(key => {
            if (prevProps[key] !== nextProps[key])
                newMethods[key] = nextProps[key];
        });
        Object.assign(self._methods, self.wrapFns(api_1.objectResolver(self.elements, newMethods), { noStrictArrayResult: true }));
    }
    _setRootRef(FField) {
        this._root = FField;
    }
    _setFormRef(form) {
        this._form = form;
    }
    _updateValues(nextProps, prevProps = {}) {
        const { state, value, inital, extData, noValidation, touched } = nextProps;
        const self = this;
        if (state && state !== prevProps.state)
            self.api.setState(state);
        if (inital && inital !== prevProps.inital)
            self.api.setValue(inital, { replace: true, inital: true, noValidation });
        if (value && value !== prevProps.value)
            self.api.setValue(value, { replace: true, noValidation });
        if (extData && extData !== prevProps.extData)
            commonLib_1.objKeys(extData).forEach(key => (self.api.set(key, extData[key], { replace: true })));
        if (!commonLib_1.isUndefined(touched) && touched !== null && touched !== prevProps.touched)
            self.api.reset({ status: 'untouched', value: touched ? 0 : undefined });
        FForm.params.forEach(k => (!commonLib_1.isUndefined(nextProps[k]) && nextProps[k] !== prevProps[k] &&
            self.api.switch('/@/params/' + k, nextProps[k])));
    }
    _handleStateUpdate(state) {
        const self = this;
        if (self._savedState == state)
            return;
        self._savedState = state;
        if (self._methods.onStateChange)
            self._methods.onStateChange(state, self);
        if (state[stateLib_1.SymData].current !== self._savedValue) {
            self._savedValue = state[stateLib_1.SymData].current;
            if (self._methods.onChange)
                self._methods.onChange(self._savedValue, self);
        }
        if (self._root)
            self._root.setState({ branch: state });
    }
    _submit(event) {
        const self = this;
        const setPending = (val) => self.api.set([], val, { [stateLib_1.SymData]: ['status', 'pending'] });
        self.api.set([], 0, { [stateLib_1.SymData]: ['status', 'untouched'], execute: true, macros: 'switch' });
        if (self._methods.onSubmit) {
            self.api.setMessages(null, { execute: true });
            let result = self._methods.onSubmit(event, self._savedValue, self);
            if (result && result.then && typeof result.then === 'function') { //Promise
                setPending(1);
                result.then((val) => {
                    setPending(0);
                    self.api.setMessages(val);
                }, (reason) => {
                    setPending(0);
                    self.api.setMessages(reason);
                });
            }
            else
                self.api.setMessages(result);
        }
    }
    _getCoreFromParams(coreParams, context) {
        if (commonLib_1.isUndefined(coreParams.store) && context.store)
            return new api_1.FFormStateAPI(commonLib_1.merge(coreParams, { store: context.store }));
        else
            return new api_1.FFormStateAPI(coreParams);
    }
    shouldComponentUpdate(nextProps) {
        const self = this;
        self.parent = nextProps.parent;
        let core = nextProps.core;
        let FFrormApiUpdate = false;
        if (core instanceof api_1.FFormStateAPI && self.api !== core) {
            self._unsubscribe();
            self.api = core;
            self._unsubscribe = self.api.addListener(self._handleStateUpdate.bind(self));
            FFrormApiUpdate = true;
        }
        self._updateMethods(nextProps, self.props);
        self._updateValues(nextProps, self.props);
        return FFrormApiUpdate || !commonLib_1.isEqual(self.props, nextProps, { skipKeys: ['core', 'state', 'value', 'inital', 'extData', 'fieldCache', 'flatten', 'noValidate', 'parent', 'onSubmit', 'onChange', 'onStateChange'] });
    }
    componentWillUnmount() {
        if (this._unsubscribe)
            this._unsubscribe();
    }
    // focus(path: Path | string): void {
    //   if (this._root) this._root.focus(normalizePath(path));
    // };
    getRef(path) {
        return this._root && this._root.getRef(path);
    }
    _getPath() {
        return '#';
    }
    getDataObject(branch, ffield) {
        return commonLib_1.getIn(branch, stateLib_1.SymData);
    }
    getValue(branch, ffield) {
        if (stateLib_1.isSelfManaged(branch))
            return commonLib_1.getIn(branch, stateLib_1.SymData, 'value');
        else
            return this.api.getValue({ path: ffield.path });
    }
    getBranch(path) {
        return this.api.get(path);
    }
    reset(event) {
        if (event)
            event.preventDefault();
        this.api.reset();
    }
    submit() {
        this._form.dispatchEvent(new Event('submit'));
    }
    render() {
        const self = this;
        let _a = self.props, { core, state, value, inital, extData, fieldCache, touched, parent, onSubmit, onChange, onStateChange, _$useTag: UseTag = 'form' } = _a, rest = __rest(_a, ["core", "state", "value", "inital", "extData", "fieldCache", "touched", "parent", "onSubmit", "onChange", "onStateChange", "_$useTag"]);
        FForm.params.forEach(k => delete rest[k]);
        return (react_1.createElement(UseTag, Object.assign({ ref: self._setFormRef }, rest, { onSubmit: self._submit, onReset: self.reset }),
            react_1.createElement(FField, { ref: self._setRootRef, id: rest.id ? rest.id + '/#' : undefined, name: self.api.name, pFForm: self, getPath: self._getPath, FFormApi: self.api })));
    }
}
FForm.params = ['readonly', 'disabled', 'viewer', 'liveValidate', 'liveUpdate'];
exports.FForm = FForm;
class FRefsGeneric extends react_1.Component {
    constructor(props, context) {
        super(props, context);
        this.$refs = {};
        const self = this;
        self._setRef = self._setRef.bind(self);
        // self._refProcess = self._refProcess.bind(self);
    }
    getRef(path) {
        const self = this;
        if (!path.length)
            return self;
        if (path.length == 1 && !self.$refs[path[0]].getRef)
            return self.$refs[path[0]];
        return self.$refs[path[0]] && self.$refs[path[0]].getRef && self.$refs[path[0]].getRef(path.slice(1));
    }
    _setRef(name) {
        const self = this;
        return (v) => self.$refs[name] = v;
    }
    _refProcess(defaultName, $reactRef) {
        const self = this;
        if ($reactRef === true)
            return self._setRef(defaultName);
        else if (commonLib_1.isString($reactRef))
            return self._setRef($reactRef);
        else if (commonLib_1.isMergeable($reactRef))
            return stateLib_1.objMap($reactRef, self._refProcess.bind(self, defaultName));
        return $reactRef;
    }
}
/////////////////////////////////////////////
//  FField class
/////////////////////////////////////////////
class FField extends FRefsGeneric {
    constructor(props, context) {
        super(props, context);
        this._mappedData = {};
        this._builderData = {};
        this._rebuild = true;
        this._blocks = [];
        this._maps = {};
        this._forceUpd = false;
        this.get = null;
        this.wrapFns = bindProcessorToThis;
        const self = this;
        Object.defineProperty(self, "path", { get: () => self.props.getPath() });
        Object.defineProperty(self, "pFForm", { get: () => self.props.pFForm });
        Object.defineProperty(self, "liveValidate", { get: () => commonLib_1.getIn(self.getData(), 'params', 'liveValidate') });
        Object.defineProperty(self, "liveUpdate", { get: () => commonLib_1.getIn(self.getData(), 'params', 'liveUpdate') });
        Object.defineProperty(self, "value", { get: () => self.props.pFForm.getValue(self.state.branch, self) });
        Object.defineProperty(self, "stateApi", { get: () => self.props.pFForm.api });
        self.state = { branch: self.pFForm.getBranch(self.path) };
        self.$branch = self.state.branch;
        self._updateStateApi(props.pFForm.api);
    }
    getRef(path) {
        path = stateLib_1.normalizePath(path);
        const self = this;
        if (!path.length)
            return self.$refs['@Main'];
        if (path.length == 1 && path[0] == stateLib_1.SymData)
            return self;
        if (path[0][0] == '@')
            return path.length == 1 ? self.$refs[path[0]] : self.$refs[path[0]].getRef(path.slice(1));
        return self.$refs['@Main'] && self.$refs['@Main'].getRef && self.$refs['@Main'].getRef(path);
    }
    _resolver(obj) {
        const self = this;
        try {
            return api_1.objectResolver(self.pFForm.elements, obj);
        }
        catch (e) {
            throw self._addErrPath(e);
        }
        //return result[SymData] ? merge(result, self._bind2self(result[SymData])) : result;
    }
    _addErrPath(e) {
        e.message = e.message + ', in form \'' + (this.pFForm.props.name || '') + '\', path: \'' + this.path + '\'';
        return e;
    }
    _updateStateApi(stateApi) {
        const self = this;
        if (stateApi) {
            const api = stateApi.wrapper({
                get path() { return self.path; },
            });
            api._set = api.set;
            api._setValue = api.setValue;
            api.set = (...args) => self._cacheValue(args[0], args[1], 'set', args[2]) || api._set(...args);
            api.setValue = (...args) => self._cacheValue((args[1] || {}).path, args[0], 'setValue', args[1]) || api._setValue(...args);
            self.api = api;
        }
    }
    _updateCachedValue(update = this.liveUpdate || this._forceUpd) {
        const self = this;
        self._cachedTimeout = undefined;
        if (update && self._cached) {
            self._forceUpd = false;
            self.stateApi.setValue(self._cached.value, Object.assign({ noValidation: !self.liveValidate, path: self.path }, self._cached.opts));
            self._cached = undefined;
        }
    }
    _cacheValue(path, value, fn = 'set', opts = {}) {
        //if (path === null) return;
        const self = this;
        let fieldCache = self.pFForm.props.fieldCache;
        if (commonLib_1.isUndefined(fieldCache) || fieldCache === true)
            fieldCache = 40;
        let valueSet = fn === 'setValue' && (!path || path == './' || path == '.');
        if (!valueSet) {
            let fPath = self.path;
            path = '#/' + stateLib_1.path2string(stateLib_1.normalizePath(path, self.path)) + (fn === 'setValue' ? '/@/value' : '');
            valueSet = (path == fPath + '/@/value') || (path == '#/@/current/' + fPath.slice(2));
        }
        // console.log(valueSet, 'setValue=', setValue,'path=',path)
        if (valueSet) {
            let prevData = self.getData();
            self._cached = { value, opts };
            if (fieldCache) {
                if (self._cachedTimeout)
                    clearTimeout(self._cachedTimeout);
                self._cachedTimeout = setTimeout(self._updateCachedValue.bind(self), fieldCache);
                const data = self.getData();
                const mappedData = self._mappedData;
                self.get = (...paths) => {
                    let path = stateLib_1.normalizePath(paths, self.path);
                    if (commonLib_1.isEqual(path, stateLib_1.normalizePath('./@value', self.path)))
                        return data.value;
                    return self.stateApi.get(path);
                };
                self._setMappedData(prevData, data, true);
                self.get = null;
                if (mappedData != self._mappedData)
                    self.forceUpdate();
            }
            else
                self._updateCachedValue();
            return true;
        }
        return;
    }
    _build() {
        const self = this;
        self.state = { branch: self.pFForm.getBranch(self.path) };
        self.$branch = self.state.branch;
        const schemaPart = self.api.getSchemaPart(self.path);
        self.schemaPart = schemaPart;
        self._isNotSelfManaged = !stateLib_1.isSelfManaged(self.state.branch) || undefined;
        if ((commonLib_1.isArray(schemaPart.type) || commonLib_1.isUndefined(schemaPart.type)) && !schemaPart._presets)
            throw new Error('schema._presets should be defined explicitly for multi type');
        self._layout = self.wrapFns(resolveComponents(self.pFForm.elements, schemaPart._layout));
        let resolvedComponents = resolveComponents(self.pFForm.elements, schemaPart._custom, schemaPart._presets || schemaPart.type);
        resolvedComponents = self.wrapFns(resolvedComponents);
        let { $_maps, rest: components } = extractMaps(resolvedComponents);
        self._maps = normalizeMaps($_maps);
        self._widgets = {};
        self._components = components;
        self._blocks = commonLib_1.objKeys(components).filter(key => components[key]);
        self._blocks.forEach((block) => {
            const _a = components[block], { _$widget, $_reactRef } = _a, staticProps = __rest(_a, ["_$widget", "$_reactRef"]);
            if (!_$widget)
                throw new Error('_$widget for "' + block + '" is empty');
            self._widgets[block] = _$widget;
            if ($_reactRef) { // $_reactRef - prop for react ref-function
                const $ref = self._refProcess('@' + block, $_reactRef);
                staticProps[commonLib_1.isFunction($ref) ? 'ref' : '$_reactRef'] = $ref;
            }
            self._mappedData[block] = staticProps; // properties, without reserved names      
        });
        self._setMappedData(undefined, self.getData(), 'build');
        self._rebuild = false;
    }
    _setMappedData(prevData, nextData, updateStage) {
        const self = this;
        let _gData = self.getData;
        self.getData = () => nextData;
        const _mappedData = updateProps(self._mappedData, prevData, nextData, updateStage == 'build' && self._maps.build, updateStage && self._maps.data, self._maps.every);
        self.getData = _gData;
        if (self._mappedData != _mappedData) {
            self._mappedData = _mappedData;
            return true;
        }
        return false;
    }
    getData(branch) {
        const self = this;
        const data = self.pFForm.getDataObject(branch || commonLib_1.getIn(self, 'state', 'branch'), self);
        return self._cached ? commonLib_1.merge(data, { value: self._cached.value }, { replace: { value: self._cached.opts.replace } }) : data;
    }
    shouldComponentUpdate(nextProps, nextState) {
        const self = this;
        if (nextProps.FFormApi !== self.props.FFormApi) {
            self._updateStateApi(nextProps.FFormApi);
            return (self._rebuild = true);
        }
        if (!commonLib_1.isEqual(nextProps, self.props))
            return (self._rebuild = true);
        if (commonLib_1.isUndefined(nextState.branch))
            return true;
        self.$branch = nextState.branch;
        let updateComponent = false;
        const prevData = self.getData();
        const nextData = self.getData(commonLib_1.getIn(nextState, 'branch'));
        if (commonLib_1.getIn(nextData, 'oneOf') !== commonLib_1.getIn(prevData, 'oneOf'))
            return (self._rebuild = true);
        try {
            updateComponent = self._setMappedData(prevData, nextData, nextData !== prevData) || updateComponent;
            updateComponent = updateComponent || commonLib_1.getIn(nextData, 'params', 'norender') !== commonLib_1.getIn(prevData, 'params', 'norender');
        }
        catch (e) {
            throw self._addErrPath(e);
        }
        return updateComponent;
    }
    render() {
        const self = this;
        try {
            if (commonLib_1.isUndefined(self.state.branch))
                return null;
            if (commonLib_1.getIn(self.getData(), 'params', 'norender'))
                return false;
            if (self._rebuild)
                this._build();
            return self._widgets['Builder'] ? react_1.createElement(self._widgets['Builder'], self._mappedData['Builder'], self._mappedData) : null;
        }
        catch (e) {
            throw self._addErrPath(e);
        }
    }
}
//enumOptions={self._enumOptions}
/////////////////////////////////////////////
//  Section class
/////////////////////////////////////////////
class FSectionWidget extends react_1.Component {
    _cn(props) {
        if (!props)
            return props;
        if (this.props._$cx && props.className && !commonLib_1.isString(props.className)) {
            if (passCx(this.props._$widget))
                return Object.assign({ _$cx: this.props._$cx }, props);
            else
                return Object.assign({}, props, { className: this.props._$cx(props.className) });
        }
        return props;
    }
    render() {
        const props = this._cn(this.props.getMappedData());
        return react_1.createElement(this.props._$widget, props, this.props.children || props.children);
    }
}
class FSection extends FRefsGeneric {
    //private _setRef: any;
    //$refs: { [key: string]: any } = {};
    constructor(props, context) {
        super(props, context);
        this._arrayStart = 0;
        this._rebuild = true;
        this._focusField = '';
        this._arrayKey2field = {};
        this._widgets = {};
        this._objectLayouts = [];
        this._arrayLayouts = [];
        this._maps = {};
        this._mappedData = {};
        this._isArray = false;
        const self = this;
        //self._setRef = (name: number | string) => (item: any) => self.$refs[name] = item;
        self._setWidRef = (key) => (item) => self._widgets[key] = item;
        // self._build(self.props);
    }
    // focus(path: Path) {
    //   const self = this;
    //   let field;
    //   if (!path.length) {
    //     field = self.props.focusField;
    //     if (isUndefined(field)) field = self.props.isArray ? '0' : (branchKeys(self.props.$branch)[0] || '');
    //   } else {
    //     field = path[0].toString();
    //     path = path.slice(1);
    //   }
    //   if (self.props.isArray && field >= self.props.arrayStart) field = self._arrayIndex2key(self.props.$branch[field]) || field;
    //   if (self.$refs[field] && self.$refs[field].focus) self.$refs[field].focus(path)
    // }
    _getMappedData(key) {
        const self = this;
        return () => self._mappedData[key];
    }
    _build(props) {
        function makeLayouts_INNER_PROCEDURE(UPDATABLE, fields) {
            const layout = [];
            fields.forEach(fieldOrLayout => {
                const { keys, counter } = UPDATABLE;
                if (commonLib_1.isString(fieldOrLayout)) { // if field is string then _makeFField
                    let idx = UPDATABLE.keys.indexOf(fieldOrLayout);
                    if (~idx) {
                        layout.push(self._makeFField(fieldOrLayout));
                        UPDATABLE.keys.splice(idx, 1);
                    }
                }
                else if (commonLib_1.isObject(fieldOrLayout)) { // layout
                    const counter = UPDATABLE.counter++;
                    let { _$widget, $_fields } = normalizeLayout(counter, fieldOrLayout);
                    layout.push(react_1.createElement(FSectionWidget, { "_$widget": _$widget, "_$cx": _$cx, key: 'widget_' + counter, ref: self._setWidRef((counter)), getMappedData: self._getMappedData(counter) }, $_fields && makeLayouts_INNER_PROCEDURE(UPDATABLE, $_fields)));
                }
            });
            return layout;
        }
        function normalizeLayout(counter, layout) {
            let { $_maps, rest } = extractMaps(layout, ['$_fields']);
            // rest = self.props.$FField.wrapFns(rest, ['$_maps']);
            let { $_fields, $_reactRef, _$widget = LayoutDefaultWidget, className } = rest, staticProps = __rest(rest, ["$_fields", "$_reactRef", "_$widget", "className"]);
            if ($_fields || !counter)
                className = commonLib_1.merge(LayoutDefaultClass, className);
            staticProps.className = className;
            let refObject = self._refProcess('@widget_' + counter, $_reactRef) || {};
            if (commonLib_1.isFunction(refObject))
                refObject = { 'ref': refObject };
            Object.assign(staticProps, refObject);
            let maps = normalizeMaps($_maps, counter.toString());
            mapsKeys.forEach(k => self._maps[k].push(...maps[k]));
            self._mappedData[counter] = staticProps;
            return { _$widget, $_fields };
        }
        const self = this;
        const { $branch, $layout, _$cx, arrayStart, LayoutDefaultWidget = 'div', LayoutDefaultClass = {}, uniqKey, focusField } = props;
        const mapsKeys = ['build', 'data', 'every'];
        mapsKeys.forEach(k => self._maps[k] = []);
        self.$refs = {};
        self._widgets = {};
        self._mappedData = {};
        self._objectLayouts = [];
        const UPDATABLE = { keys: self._getObjectKeys($branch), counter: 1 };
        self._focusField = focusField || UPDATABLE.keys[0] || '';
        let { _$widget, $_fields } = normalizeLayout(0, commonLib_1.isArray($layout) ? { $_fields: $layout } : $layout);
        self._$widget = _$widget;
        if ($_fields)
            self._objectLayouts = makeLayouts_INNER_PROCEDURE(UPDATABLE, $_fields); // we get inital _objectLayouts and every key, that was used in makeLayouts call removed from keys 
        UPDATABLE.keys.forEach(fieldName => self._objectLayouts.push(self._makeFField(fieldName))); // so here we have only keys was not used and we add them to _objectLayouts
        self._arrayLayouts = [];
        self._arrayKey2field = {};
        if (self.props.isArray) { // _makeArrayLayouts
            for (let i = arrayStart; i < self.props.length; i++) {
                let arrayKey = self._arrayIndex2key($branch[i]);
                self._arrayLayouts.push(self._makeFField(i.toString(), arrayKey));
                arrayKey && (self._arrayKey2field[arrayKey] = i);
            }
        }
        self._mappedData = self._updateMappedData(undefined, self._getData($branch), 'build');
        self._rebuild = false;
    }
    _makeFField(fieldName, arrayKey) {
        const self = this;
        return react_1.createElement(FField, { ref: self._setRef(arrayKey || fieldName), key: arrayKey || fieldName, pFForm: self.props.$FField.pFForm, FFormApi: self.props.FFormApi, id: self.props.id ? self.props.id + (arrayKey || fieldName) : undefined, name: self.props.name ? self.props.name + '[' + (self.props.isArray ? '${idx}_' + (arrayKey || fieldName) : fieldName) + ']' : undefined, getPath: arrayKey ? self._getArrayPath.bind(self, arrayKey) : self._getObjectPath.bind(self, fieldName) });
    }
    _arrayIndex2key($branch) {
        return this.props.uniqKey ? commonLib_1.getIn(this._getData($branch), stateLib_1.string2path(this.props.uniqKey)) : undefined;
    }
    _getObjectKeys($branch) {
        const self = this;
        let keys = [];
        if (self.props.isArray)
            for (let i = 0; i < self.props.arrayStart; i++)
                keys.push(i.toString());
        else
            keys = stateLib_1.branchKeys($branch);
        return keys;
    }
    _getObjectPath(field) {
        return this.props.$FField.path + '/' + field;
    }
    _getArrayPath(key) {
        return this.props.$FField.path + '/' + this._arrayKey2field[key];
    }
    _getArrayField(key) {
        const self = this;
        return self._arrayLayouts[key - self.props.arrayStart];
    }
    _reorderArrayLayout(prevBranch, nextBranch, props) {
        const self = this;
        const updatedArray = [];
        let doUpdate = false;
        for (let i = props.arrayStart; i < props.length; i++) {
            let arrayKey = self._arrayIndex2key(nextBranch[i]);
            if (commonLib_1.isUndefined(arrayKey))
                throw new Error('no unique key provided for array item');
            if (self.$refs[arrayKey])
                self.$refs[arrayKey].setState({ branch: nextBranch[i] });
            let prevIndex = self._arrayKey2field[arrayKey];
            if (self._arrayKey2field[arrayKey] !== i) {
                self._arrayKey2field[arrayKey] = i;
                doUpdate = true;
            }
            updatedArray.push(!commonLib_1.isUndefined(prevIndex) ? self._getArrayField(prevIndex) : self._makeFField(i.toString(), arrayKey));
        }
        if (self._arrayLayouts.length !== updatedArray.length)
            doUpdate = true;
        if (doUpdate)
            self._arrayLayouts = updatedArray;
        return doUpdate;
    }
    _updateMappedData(prevData, nextData, fullUpdate = prevData !== nextData) {
        const self = this;
        return updateProps(self._mappedData, prevData, nextData, fullUpdate == 'build' && self._maps.build, fullUpdate && self._maps.data, self._maps.every);
    }
    _getData(branch = this.props.$branch) {
        return this.props.$FField.getData(branch);
    }
    shouldComponentUpdate(nextProps) {
        const self = this;
        if (nextProps.FFormApi !== self.props.FFormApi || nextProps.oneOf !== self.props.oneOf)
            return self._rebuild = true;
        let doUpdate = !commonLib_1.isEqual(nextProps, self.props, { skipKeys: ['$branch'] });
        let prevBranch = self.props.$branch;
        let nextBranch = nextProps.$branch;
        if (prevBranch != nextBranch) {
            let newMapped;
            try {
                newMapped = self._updateMappedData(self._getData(prevBranch), self._getData(nextBranch));
            }
            catch (e) {
                throw self.props.$FField._addErrPath(e);
            }
            if (newMapped != self._mappedData) { // update self._widgets
                const oldMapped = self._mappedData;
                self._mappedData = newMapped;
                commonLib_1.objKeys(newMapped).forEach(key => self._widgets[key] && newMapped[key] != oldMapped[key] && self._widgets[key]['forceUpdate']());
            }
            // update object elements or if it _isArray elements that lower than self.props.arrayStart
            self._getObjectKeys(nextBranch).forEach(field => (nextBranch[field] !== prevBranch[field]) && self.$refs[field] && self.$refs[field].setState({ branch: nextBranch[field] }));
            if (self.props.isArray)
                doUpdate = self._reorderArrayLayout(prevBranch, nextBranch, nextProps) || doUpdate; // updates and reorders elements greater/equal than self.props.arrayStart
        }
        return doUpdate; //|| !isEqual(self.props, nextProps, {skipKeys: ['$branch']});
    }
    getRef(path) {
        const self = this;
        if (!self.props.isArray || isNaN(parseInt(path[0])) || path[0] < self.props.arrayStart)
            return super.getRef(path);
        let field = self._getArrayField(path[0]);
        return field && self.$refs[field.key].getRef(path.slice(1));
    }
    render() {
        const self = this;
        let props = self.props;
        try {
            if (props.viewer) {
                let _a = props.viewerProps || {}, { _$widget = UniversalViewer } = _a, rest = __rest(_a, ["_$widget"]);
                rest.inputProps = props;
                rest.value = props.$FField.value;
                return react_1.createElement(_$widget, rest);
            }
            if (stateLib_1.isSelfManaged(props.$branch))
                return null;
            if (self._rebuild)
                self._build(props); // make rebuild here to avoid addComponentAsRefTo Invariant Violation error https://gist.github.com/jimfb/4faa6cbfb1ef476bd105
            return react_1.createElement(FSectionWidget, { "_$widget": self._$widget, "_$cx": props._$cx, key: 'widget_0', ref: self._setWidRef((0)), getMappedData: self._getMappedData(0) },
                self._objectLayouts,
                self._arrayLayouts);
        }
        catch (e) {
            throw self.props.$FField._addErrPath(e);
        }
    }
}
/////////////////////////////////////////////
//  Basic components
/////////////////////////////////////////////
class GenericWidget extends FRefsGeneric {
    constructor(props, context) {
        super(props, context);
    }
    _newWidget(key, obj, passedReactRef = {}) {
        const { _$widget: Widget = GenericWidget, className, $_reactRef } = obj, rest = __rest(obj, ["_$widget", "className", "$_reactRef"]);
        const self = this;
        let refObject = self._refProcess(key, $_reactRef) || {};
        if (commonLib_1.isFunction(refObject))
            refObject = { ref: refObject };
        if (commonLib_1.isFunction(passedReactRef))
            refObject.ref = passedReactRef;
        else
            Object.assign(refObject, passedReactRef);
        return react_1.createElement(Widget, Object.assign({ key: key, className: (!passCx(Widget) && this.props._$cx) ? this.props._$cx(className) : className, "_$cx": passCx(Widget) ? this.props._$cx : undefined }, rest, refObject));
    }
    _mapChildren(children, $_reactRef) {
        const self = this;
        if (children !== self._children || self._reactRef !== $_reactRef) {
            const prev = self._children && commonLib_1.toArray(self._children);
            const next = children && commonLib_1.toArray(children);
            self._mapped = next && next.map((ch, i) => (!commonLib_1.isObject(ch) || ch.$$typeof) ? ch :
                ((!self._mapped ||
                    !commonLib_1.getIn(self._mapped, i) ||
                    prev[i] !== next[i] ||
                    commonLib_1.getIn(self._reactRef, i) !== commonLib_1.getIn($_reactRef, i)) ? self._newWidget(i, ch, commonLib_1.getIn($_reactRef, i)) :
                    self._mapped[i]));
            self._children = children;
            self._reactRef = $_reactRef;
        }
    }
    setRef2rest(rest, $_reactRef) {
        if (!$_reactRef)
            return rest;
        commonLib_1.objKeys($_reactRef).filter(v => isNaN(+v)).forEach(k => rest[k] = $_reactRef[k]); // assing all except numeric keys
        return rest;
        // if ($_reactRef['ref']) rest.ref = $_reactRef['ref'];
        // else Object.assign(rest, $_reactRef);
        // if ($_reactRef['tagRef'])
        //   rest.tagRef = $_reactRef['tagRef'];
    }
    render() {
        const self = this;
        if (self.props.norender)
            return null;
        const _a = self.props, { _$useTag: UseTag = 'div', _$cx, className, $_reactRef, children } = _a, rest = __rest(_a, ["_$useTag", "_$cx", "className", "$_reactRef", "children"]);
        self._mapChildren(children, $_reactRef);
        self.setRef2rest(rest, $_reactRef);
        return (react_1.createElement(UseTag, Object.assign({ children: self._mapped, className: _$cx ? _$cx(className) : className }, rest)));
    }
}
function isEmpty(value) {
    return commonLib_1.isMergeable(value) ? commonLib_1.objKeys(value).length === 0 : value === undefined || value === null || value === "";
}
function toString(emptyMock, enumExten = {}, value) {
    if (isEmpty(value))
        return emptyMock;
    if (commonLib_1.isArray(value))
        return value.map(toString.bind(null, emptyMock, enumExten)).join(', ');
    value = getExten(enumExten, value).label || value;
    if (!commonLib_1.isString(value))
        return JSON.stringify(value);
    return value;
}
function UniversalViewer(props) {
    let { _$useTag: UseTag = 'div', value, inputProps, _$cx, enumExten = {}, emptyMock = '(none)' } = props, rest = __rest(props, ["_$useTag", "value", "inputProps", "_$cx", "enumExten", "emptyMock"]);
    if (rest.className && _$cx)
        rest.className = _$cx(rest.className);
    return react_1.createElement(UseTag, rest, toString(emptyMock, enumExten, value));
}
class UniversalInput extends GenericWidget {
    render() {
        const self = this;
        const props = self.props;
        if (props.viewer) {
            let _a = props.viewerProps || {}, { _$widget = UniversalViewer } = _a, rest = __rest(_a, ["_$widget"]);
            rest.inputProps = props;
            rest.value = props.value;
            return react_1.createElement(_$widget, rest);
        }
        let { value, _$useTag: UseTag, type, $_reactRef, _$cx, viewer, viewerProps, children } = props, rest = __rest(props, ["value", "_$useTag", "type", "$_reactRef", "_$cx", "viewer", "viewerProps", "children"]);
        self._mapChildren(children, $_reactRef);
        self.setRef2rest(rest, $_reactRef);
        if (type == 'textarea' || type == 'select')
            UseTag = UseTag || type;
        else {
            UseTag = UseTag || 'input';
            if (type !== 'notInput')
                rest.type = type;
        }
        if (type !== 'notInput')
            rest[type === 'checkbox' ? 'checked' : 'value'] = value;
        // if (rest.value === null) rest.value = '';
        if (rest.className && _$cx)
            rest.className = _$cx(rest.className);
        //console.log(rest.value);
        return react_1.createElement(UseTag, rest, self._mapped);
    }
}
class Autowidth extends react_1.Component {
    componentDidMount() {
        const style = window && window.getComputedStyle(this.props.$FField.$refs['@Main']);
        if (!style || !this._elem)
            return;
        ['fontSize', 'fontFamily', 'fontWeight', 'fontStyle', 'letterSpacing'].forEach(key => this._elem.style[key] = style[key]);
    }
    render() {
        const self = this;
        const props = self.props;
        const value = (commonLib_1.isUndefined(props.value) || props.value === null ? '' : props.value.toString()) || props.placeholder || '';
        return (react_1.createElement("div", { style: Autowidth.sizerStyle, ref: (elem) => {
                (self._elem = elem) &&
                    props.$FField.$refs['@Main'] &&
                    (props.$FField.$refs['@Main'].style.width = Math.max(elem.scrollWidth + (props.addWidth || 45), props.minWidth || 0) + 'px');
            } }, value));
    }
}
Autowidth.sizerStyle = { position: 'absolute', top: 0, left: 0, visibility: 'hidden', height: 0, overflow: 'scroll', whiteSpace: 'pre' };
function FBuilder(props) {
    let { children: mapped, widgets } = props;
    const { Title, Body, Main, Message, Wrapper, Autowidth } = widgets;
    mapped = commonLib_1.deArray(mapped);
    return Wrapper ? react_1.createElement(Wrapper, mapped['Wrapper'], Title ? react_1.createElement(Title, mapped['Title']) : '', Body ? react_1.createElement(Body, mapped['Body'], Main ? react_1.createElement(Main, mapped['Main']) : '', Message ? react_1.createElement(Message, mapped['Message']) : '', Autowidth ? react_1.createElement(Autowidth, mapped['Autowidth']) : '') : '') : '';
}
function Wrapper(props) {
    let { _$useTag: WrapperW = 'div', _$cx = classNames, className, ArrayItemMenu, ArrayItemBody, arrayItem } = props, rest = __rest(props, ["_$useTag", "_$cx", "className", "ArrayItemMenu", "ArrayItemBody", "arrayItem"]);
    const _a = ArrayItemBody || {}, { _$widget: IBodyW = 'div', className: IBodyCN = {} } = _a, IBodyRest = __rest(_a, ["_$widget", "className"]);
    const _b = ArrayItemMenu || {}, { _$widget: IMenuW = 'div', className: IMenuCN = {} } = _b, IMenuRest = __rest(_b, ["_$widget", "className"]);
    const result = react_1.createElement(WrapperW, Object.assign({ className: _$cx ? _$cx(className) : className }, rest));
    if (arrayItem) {
        return (react_1.createElement(IBodyW, Object.assign({ className: _$cx ? _$cx(IBodyCN) : IBodyCN }, IBodyRest),
            result,
            react_1.createElement(IMenuW, Object.assign({ className: _$cx && _$cx(IMenuCN) }, IMenuRest))));
    }
    else
        return result;
}
function ItemMenu(props) {
    const { _$useTag: UseTag = 'div', _$cx, disabled, className, buttonsProps = {}, arrayItem, buttons = [], onClick: defaultOnClick } = props, rest = __rest(props, ["_$useTag", "_$cx", "disabled", "className", "buttonsProps", "arrayItem", "buttons", "onClick"]);
    if (!arrayItem)
        return null;
    // console.log(arrayItem)
    buttons.forEach((key) => delete rest[key]);
    return (react_1.createElement(UseTag, Object.assign({ className: _$cx(className) }, rest), buttons.map((key) => {
        const _a = buttonsProps[key] || {}, { _$widget: ButW = 'button', type = 'button', disabledCheck = '', className: ButCN = {}, onClick = defaultOnClick, title = key, children = key } = _a, restBut = __rest(_a, ["_$widget", "type", "disabledCheck", "className", "onClick", "title", "children"]);
        return (react_1.createElement(ButW, Object.assign({ key: key, type: type, title: title, className: _$cx ? _$cx(ButCN) : ButCN, children: children, disabled: disabled || disabledCheck && !arrayItem[disabledCheck] }, restBut, { onClick: () => onClick(key) })));
    })));
}
function CheckboxNull(props) {
    const self = this;
    let { checked, onChange, nullValue = null, dual, tagRef, type } = props, rest = __rest(props, ["checked", "onChange", "nullValue", "dual", "tagRef", "type"]);
    return react_1.createElement("input", Object.assign({ type: "checkbox", checked: checked === true }, rest, { onChange: (event) => {
            onChange(dual ? !checked : (checked === nullValue ? true : (checked === true ? false : nullValue)), event);
        }, ref: elem => {
            tagRef && tagRef(elem);
            elem && (elem.indeterminate = (checked === nullValue));
        } }));
}
///////////////////////////////
//     Functions
///////////////////////////////
function bindProcessorToThis(val, opts = {}) {
    const self = this;
    const bindedFn = bindProcessorToThis.bind(self);
    if (commonLib_1.isFunction(val))
        val = { $: val };
    if (stateLib_1.isMapFn(val)) {
        const map = val.norm ? val : stateLib_1.normalizeFn(val, Object.assign({}, opts, { wrapFn: bindedFn }));
        const fn = stateLib_1.processFn.bind(self, map);
        fn._map = map;
        return fn;
    }
    else if (commonLib_1.isMergeable(val)) {
        const result = commonLib_1.isArray(val) ? [] : {};
        commonLib_1.objKeys(val).forEach(key => result[key] = key.substr(0, 2) != '_$' ? bindedFn(val[key], opts) : val[key]); //!~ignore.indexOf(key) &&
        return result;
    }
    return val;
}
function passCx(Widget) {
    return Widget instanceof GenericWidget;
}
const resolveComponents = commonLib_1.memoize((elements, customizeFields = {}, sets) => {
    if (sets) {
        let $_ref = sets.split(':')
            .map(v => (v = v.trim()) && (v[0] != '^' ? '^/sets/' + v : v))
            .join(':') + ':' + (customizeFields.$_ref || '');
        customizeFields = commonLib_1.merge(customizeFields, { $_ref });
    }
    return api_1.objectResolver(elements, customizeFields);
});
function extractMaps(obj, skip = []) {
    let { $_maps } = obj, rest2extract = __rest(obj, ["$_maps"]);
    $_maps = Object.assign({}, $_maps);
    const rest = commonLib_1.isArray(obj) ? [] : {};
    commonLib_1.objKeys(rest2extract).forEach(key => {
        if (commonLib_1.isMergeable(rest2extract[key]) && !~skip.indexOf(key)) {
            let res = extractMaps(rest2extract[key], skip);
            rest[key] = res.rest;
            commonLib_1.objKeys(res.$_maps).forEach((nk) => $_maps[key + '/' + nk] = res.$_maps[nk]);
        }
        else
            rest[key] = rest2extract[key];
    });
    return { $_maps, rest };
}
exports.extractMaps = extractMaps;
function normalizeMaps($_maps, prePath = '') {
    const result = { data: [], every: [], build: [] };
    commonLib_1.objKeys($_maps).forEach(key => {
        let value = $_maps[key];
        if (!value)
            return;
        const to = stateLib_1.multiplyPath(stateLib_1.normalizePath((prePath ? prePath + '/' : '') + key));
        if (commonLib_1.isFunction(value) || commonLib_1.isArray(value)) {
            commonLib_1.toArray(value).forEach((fn) => {
                const _a = fn._map, { update = 'data', replace = true } = _a, rest = __rest(_a, ["update", "replace"]);
                //fn._map = {update, replace, to, ...rest};
                result[update].push(Object.assign({ update, replace }, rest, { to, $: fn }));
            });
        }
        else {
            if (commonLib_1.isString(value))
                value = { args: value };
            value = Object.assign({}, value, stateLib_1.normalizeArgs(value.args));
            let { args, update = 'data', replace = true } = value, rest = __rest(value, ["args", "update", "replace"]);
            //if (!isString(path)) throw new Error('$_maps value is not recognized');
            //if (path[0] === '@') path = path.substr(1);
            // lse console.warn('Expected "@" at the begining of string');
            result.data.push(Object.assign({ args: args[0], update, replace, to, dataRequest: true }, rest));
        }
    });
    return result;
}
exports.normalizeMaps = normalizeMaps;
//!map.$ && map.args[0] == 'selectorValue' && args[0]
function updateProps(mappedData, prevData, nextData, ...iterMaps) {
    // const getFromData = (arg: any) => isNPath(arg) ? getIn(nextData, arg) : arg;
    const needUpdate = (map) => commonLib_1.isUndefined(prevData) || !map.$ ||
        (map.dataRequest && map.args.some(arg => {
            if (stateLib_1.isNPath(arg))
                return commonLib_1.getIn(prevData, arg) !== commonLib_1.getIn(nextData, arg);
            if (stateLib_1.isMapFn(arg))
                return needUpdate(arg._map || arg);
            return false;
        })); //isFunction(map.args[0])
    const dataUpdates = { update: {}, replace: {}, api: {} };
    iterMaps.forEach(maps => maps && maps.forEach(map => {
        if (map.update == 'data' && !needUpdate(map))
            return;
        const value = map.$ ? map.$() : stateLib_1.processProp(nextData, map.args);
        commonLib_1.objKeys(map.to).forEach(k => stateLib_1.setUPDATABLE(dataUpdates, value, map.replace, map.to[k]));
        if (!map.replace)
            mappedData = stateLib_1.mergeUPD_PROC(mappedData, dataUpdates);
    }));
    return stateLib_1.mergeUPD_PROC(mappedData, dataUpdates);
}
exports.updateProps = updateProps;
const getExten = (enumExten, value) => {
    let res = commonLib_1.isFunction(enumExten) ? enumExten(value) : commonLib_1.getIn(enumExten, value);
    if (res && commonLib_1.isString(res))
        res = { label: res };
    return commonLib_1.isObject(res) ? res : {};
};
function classNames(...styles) {
    const classes = [];
    for (let i = 0; i < styles.length; i++) {
        let arg = styles[i];
        if (!arg)
            continue;
        const argType = typeof arg;
        if (argType === 'string' || argType === 'number') {
            classes.push(this && this[arg] || arg);
        }
        else if (commonLib_1.isArray(arg)) {
            classes.push(classNames.apply(this, arg));
        }
        else if (argType === 'object') {
            commonLib_1.objKeys(arg).forEach(key => {
                if (!arg[key])
                    return;
                if (typeof arg[key] == 'number' || arg[key] === true)
                    classes.push(this && this[key] || key);
                else
                    classes.push(classNames.call(this, arg[key]));
            });
        }
    }
    return classes.join(' ');
}
//
// function selectorMap(opts: { skipFields?: string[], replaceFields?: { [key: string]: string } } = {}) { //skipFields: string[] = [], replaceFields: { [key: string]: string } = {}) {
//   const skipFields = opts.skipFields || [];
//   const replaceFields = opts.replaceFields || {};
//   return function (value: any, props: any) {
//     const {path, getFromState, schema} = props;
//     let vals = (isArray(value) ? value : [value]).map(key => (replaceFields[key]) ? replaceFields[key] : key);
//     let tmpPath: any = normalizePath(path.split('@')[0]);
//     const selectorField = tmpPath.pop();
//     let stringPath = path2string(tmpPath);
//     vals = vals.filter(key => getFromState(stringPath + '/' + key));
//     vals.push(selectorField);
//     stringPath = stringPath + '/' + vals.join(',') + '/@/params/hidden';
//     return new stateUpdates([
//       {skipFields, path: stringPath, value: false, macros: 'setMultiply'}, {skipFields, path: stringPath, value: true, macros: 'setAllBut'}]);
//   }
// }
/////////////////////////////////////////////
//  elements
/////////////////////////////////////////////
let elementsBase = {
    extend(elements, opts) {
        return commonLib_1.merge.all(this, elements, opts);
    },
    // types: ['string', 'integer', 'number', 'object', 'array', 'boolean', 'null'],
    widgets: {
        Section: FSection,
        Generic: GenericWidget,
        Input: UniversalInput,
        Autowidth: Autowidth,
        Builder: FBuilder,
        Wrapper: Wrapper,
        ItemMenu: ItemMenu,
        CheckboxNull: CheckboxNull,
    },
    sets: {
        'base': {
            Wrapper: {
                _$widget: '^/widgets/Wrapper',
                ArrayItemMenu: {
                    $_ref: '^/parts/ArrayItemMenu'
                },
                _$cx: '^/_$cx',
                $_maps: {
                    'className/hidden': '@/params/hidden',
                    'arrayItem': '@/arrayItem'
                }
            },
            Builder: {
                _$widget: '^/widgets/Builder',
                _$cx: '^/_$cx',
                $_maps: {
                    widgets: { $: '^/fn/getProp', args: ['_widgets'], update: 'build' },
                },
            },
            //Title: {},
            Body: {
                _$widget: '^/widgets/Generic',
                _$cx: '^/_$cx',
                className: 'body',
            },
            //Main: {},
            Message: {
                _$widget: '^/widgets/Generic',
                _$cx: '^/_$cx',
                children: [],
                $_maps: {
                    children: { $: '^/fn/messages', args: ['@/messages', {}] },
                    'className/hidden': { $: '^/fn/not', args: '@/status/touched' },
                }
            }
        },
        simple: {
            $_ref: '^/sets/base',
            Main: {
                _$widget: '^/widgets/Input',
                _$cx: '^/_$cx',
                $_reactRef: { ref: true },
                viewerProps: { _$cx: '^/_$cx', emptyMock: '(no value)', className: { viewer: true } },
                onChange: { $: '^/fn/eventValue|setValue' },
                onBlur: { $: '^/fn/blur' },
                onFocus: { $: '^/fn/focus' },
                $_maps: {
                    // priority: '@/status/priority',
                    value: '@/value',
                    viewer: '@/params/viewer',
                    autoFocus: '@/params/autofocus',
                    readOnly: '@/params/readonly',
                    disabled: '@/params/disabled',
                    placeholder: '@/fData/placeholder',
                    required: '@/fData/required',
                    label: '@/fData/title',
                    'viewerProps/enumExten': '@/fData/enumExten',
                    id: { $: '^/fn/getProp', args: 'props/id', update: 'build' },
                    name: { $: '^/fn/getProp', args: 'props/name', update: 'build' },
                }
            },
            Title: {
                _$widget: '^/widgets/Generic',
                _$cx: '^/_$cx',
                _$useTag: 'label',
                children: [],
                $_maps: {
                    'className/required': '@/fData/required',
                    'children/0': '@/fData/title',
                    'className/hidden': { $: '^/fn/not', args: '@/fData/title' },
                    htmlFor: { $: '^/fn/getProp', args: ['id'], update: 'build' },
                    'className/title-viewer': '@/params/viewer'
                }
            },
        },
        string: {
            $_ref: '^/sets/simple',
            Main: { type: 'text' }
        },
        textarea: {
            $_ref: '^/sets/simple',
            Main: { type: 'textarea', viewerProps: { className: { viewer: false, 'viewer-inverted': true } } },
            Title: {
                $_maps: {
                    'className/title-viewer-inverted': '@/params/viewer'
                }
            }
        },
        integer: {
            $_ref: '^/sets/simple',
            Main: {
                type: 'number',
                onChange: { $: '^/fn/eventValue|parseNumber|setValue', args: ['${0}', true, 0] },
                $_maps: {
                    value: { $: '^/fn/iif', args: [{ $: '^/fn/equal', args: ['@value', null] }, '', '@value'] },
                }
            }
        },
        integerNull: {
            $_ref: '^/sets/integer',
            Main: {
                onChange: { args: { 2: null } },
            }
        },
        number: {
            $_ref: '^/sets/integer',
            Main: { onChange: { args: { 1: false } }, step: 'any' }
        },
        numberNull: {
            $_ref: '^/sets/integerNull',
            Main: { onChange: { args: { 1: false, 2: null } }, step: 'any' }
        },
        'null': { $_ref: '^/sets/simple', Main: false },
        boolean: {
            $_ref: '^/sets/simple',
            Main: {
                type: 'checkbox',
                onChange: { $: '^/fn/eventChecked|setValue|liveUpdate' }
            },
        },
        booleanLeft: {
            $_ref: '^/sets/base',
            Main: {
                _$widget: '^/widgets/Generic',
                _$useTag: 'label',
                _$cx: '^/_$cx',
                $_reactRef: { '0': { ref: true } },
                children: [
                    { $_ref: '^/sets/simple/Main:^/sets/boolean/Main', $_reactRef: false, viewerProps: { _$useTag: 'span' } },
                    { $_ref: '^/sets/simple/Title', _$useTag: 'span', $_maps: { 'className/hidden': '@/params/viewer' } }
                ]
            },
            Title: { $_ref: '^/sets/simple/Title', $_maps: { 'className/hidden': { $: '^/fn/not', args: '@/params/viewer' } } },
        },
        booleanNull: {
            $_ref: '^/sets/boolean',
            Main: {
                _$useTag: '^/widgets/CheckboxNull',
                $_reactRef: { tagRef: true },
                onChange: { $: '^/fn/setValue|liveUpdate', args: ['${0}'] },
            },
        },
        booleanNullLeft: {
            $_ref: '^/sets/booleanLeft',
            Main: {
                $_reactRef: { '0': { ref: null, tagRef: true } },
                children: [{ $_ref: '^/sets/booleanNull/Main' }, {}]
            }
        },
        object: {
            $_ref: '^/sets/base',
            Main: {
                _$widget: '^/widgets/Section',
                _$cx: '^/_$cx',
                $_reactRef: true,
                uniqKey: 'params/uniqKey',
                LayoutDefaultClass: 'layout',
                LayoutDefaultWidget: 'div',
                viewerProps: { $_ref: '^/sets/simple/Main/viewerProps' },
                $_maps: {
                    length: '@/length',
                    oneOf: '@/oneOf',
                    isArray: { $: '^/fn/equal', args: ['@/fData/type', 'array'] },
                    $branch: { $: '^/fn/getProp', args: '$branch', update: 'every' },
                    arrayStart: { $: '^/fn/getArrayStart', args: [], update: 'build' },
                    $FField: { $: '^/fn/getProp', args: [], update: 'build' },
                    FFormApi: { $: '^/fn/getProp', args: 'props/pFForm/api', update: 'build' },
                    id: { $: '^/fn/getProp', args: 'props/id', update: 'build' },
                    name: { $: '^/fn/getProp', args: 'props/name', update: 'build' },
                    $layout: { $: '^/fn/getProp', args: '_layout', update: 'build' }
                }
            },
            Title: {
                _$widget: '^/widgets/Generic',
                _$cx: '^/_$cx',
                _$useTag: 'legend',
                children: [
                    { $_ref: '^/sets/simple/Title', _$useTag: 'span' },
                    { $_ref: '^/parts/ArrayAddButton' },
                    { $_ref: '^/parts/ArrayDelButton' },
                    { $_ref: '^/parts/ArrayEmpty' }
                ],
            },
            Wrapper: { _$useTag: 'fieldset' },
        },
        array: { $_ref: '^/sets/object' },
        select: {
            $_ref: '^/sets/simple',
            Main: {
                type: 'select',
                children: [],
                $_maps: {
                    'children': { $: '^/fn/arrayOfEnum', args: ['@/fData/enum', '@/fData/enumExten', { _$widget: 'option' }], replace: false },
                    'label': false
                }
            }
        },
        multiselect: {
            $_ref: '^/sets/select',
            Main: {
                multiple: true,
                onChange: { $: '^/fn/eventMultiple|setValue' }
            }
        },
        radio: {
            $_ref: '^/sets/base',
            Title: { $_ref: '^/sets/simple/Title' },
            Main: {
                $_ref: '^/parts/RadioSelector',
                $_reactRef: true,
                viewerProps: { $_ref: '^/sets/simple/Main/viewerProps' },
                $_maps: {
                    value: '@/value',
                    viewer: '@/params/viewer',
                    children: [
                        {
                            args: [
                                '@/fData/enum',
                                '@/fData/enumExten',
                                { $_reactRef: { '$_reactRef': { '0': { 'ref': true } } } },
                                { onChange: { args: ['${0}'] } },
                                {},
                                true
                            ],
                        },
                        { args: ['@/fData/enum', '@/value'] },
                        { args: { 0: '@/fData/enum' } },
                    ]
                }
            }
        },
        checkboxes: { $_ref: '^/sets/radio', Main: { $_maps: { children: { '0': { args: { '3': { type: 'checkbox', onChange: { $: '^/fn/eventCheckboxes|setValue|liveUpdate' } }, '5': '[]' } } } } } },
        $radioNull: { Main: { $_maps: { children: { '0': { args: { '3': { onClick: '^/fn/eventValue|radioClear|liveUpdate' } } } } } } },
        $radioEmpty: { Main: { $_maps: { children: { '0': { args: { '3': { onClick: { $: '^/fn/eventValue|radioClear|liveUpdate', args: ['${0}', ''] } } } } } } } },
        $autowidth: {
            Autowidth: { $_ref: '^/parts/Autowidth' },
            Wrapper: { className: { shrink: true } },
        },
        $noArrayControls: { Wrapper: { $_maps: { 'arrayItem': false } } },
        $noArrayButtons: { Title: { $_ref: '^/sets/simple/Title' } },
        $inlineItems: { Main: { className: { 'inline': true } } },
        $inlineTitle: { Wrapper: { className: { 'inline': true } } },
        $inlineLayout: { Main: { LayoutDefaultClass: { 'inline': true } } },
        $inlineArrayControls: { Wrapper: { ArrayItemBody: { className: { 'inline': true } } } },
        $arrayControls3but: { Wrapper: { ArrayItemMenu: { buttons: ['up', 'down', 'del'], } } },
        $noTitle: { Title: false },
        $shrink: { Wrapper: { className: { 'shrink': true } } },
        $expand: { Wrapper: { className: { 'expand': true } } },
        $password: { Main: { type: 'password' } }
    },
    fn: {
        api(fn, ...args) { this.api[fn](...args); },
        format(str, ...args) {
            return args.reduce((str, val, i) => str.replace('${' + i + '}', val), str);
        },
        iif(iif, trueVal, falseVaL, ...args) { return [iif ? trueVal : falseVaL, ...args]; },
        not(v, ...args) { return [!v, ...args]; },
        equal(a, ...args) { return [args.some(b => a === b)]; },
        getArrayStart(...args) { return [stateLib_1.arrayStart(this.schemaPart), ...args]; },
        getProp(key, ...args) { return [commonLib_1.getIn(this, stateLib_1.normalizePath(key)), ...args]; },
        eventValue: (event, ...args) => [event.target.value, ...args],
        eventChecked: (event, ...args) => [event.target.checked, ...args],
        eventMultiple: (event, ...args) => [Array.from(event.target.options).filter((o) => o.selected).map((v) => v.value), ...args],
        parseNumber: (value, int = false, empty = null, ...args) => [value === '' ? empty : (int ? parseInt : parseFloat)(value), ...args],
        setValue(value, opts = {}, ...args) {
            this.api.setValue(value, opts);
            return args;
        },
        focus(value, ...args) {
            this.api.set('/@/active', this.path, { noValidation: true });
            return args;
        },
        blur(...args) {
            this.api.set('./', -1, { [stateLib_1.SymData]: ['status', 'untouched'], noValidation: true, macros: 'setStatus' });
            this.api.set('/@/active', undefined, { noValidation: true });
            this._updateCachedValue(true);
            !this.liveValidate && this.api.validate('./');
            return args;
        },
        liveUpdate(...args) {
            this._forceUpd = true;
            return args;
        },
        eventCheckboxes(event, ...args) {
            const selected = (this.getData().value || []).slice();
            const value = event.target.value;
            const at = selected.indexOf(value);
            const updated = selected.slice();
            if (at == -1)
                updated.push(value);
            else
                updated.splice(at, 1);
            const all = this.getData().fData.enum;
            updated.sort((a, b) => all.indexOf(a) > all.indexOf(b));
            return [updated, ...args];
        },
        radioClear(value, nullValue = null, ...args) {
            if (this.api.getValue() === value)
                this.api.setValue(nullValue);
            return args;
        },
        messages(messages, staticProps = {}) {
            const { className: cnSP = {} } = staticProps, restSP = __rest(staticProps, ["className"]);
            return [commonLib_1.objKeys(messages).map(priority => {
                    const _a = messages[priority], { norender, texts, className = {} } = _a, rest = __rest(_a, ["norender", "texts", "className"]);
                    const children = [];
                    commonLib_1.objKeys(texts).forEach((key) => commonLib_1.toArray(texts[key]).forEach((v, i, arr) => (commonLib_1.isString(v) && commonLib_1.isString(children[children.length - 1])) ? children.push(v, { _$widget: 'br' }) : children.push(v)));
                    if (norender || !children.length)
                        return null;
                    return Object.assign({ children }, restSP, { className: Object.assign({ ['priority_' + priority]: true }, cnSP, className) }, rest);
                })];
        },
        arrayOfEnum(enumVals = [], enumExten = {}, staticProps = {}, name) {
            return [enumVals.map(val => {
                    let extenProps = getExten(enumExten, val);
                    return Object.assign({ key: val, children: [extenProps.label || val], name: name && (this.name + (name === true ? '' : name)) }, extenProps, staticProps, { value: val });
                })];
        },
        enumInputs(enumVals = [], enumExten = {}, containerProps = {}, inputProps = {}, labelProps = {}, name) {
            // inputProps = this.wrapFns(inputProps);
            return [enumVals.map(val => {
                    let extenProps = getExten(enumExten, val);
                    return Object.assign({ key: val }, containerProps, { children: [
                            Object.assign({ name: name && (this.props.name + (name === true ? '' : name)) }, commonLib_1.merge(inputProps, extenProps), { value: val }),
                            Object.assign({}, labelProps, { children: [extenProps.label || val] })
                        ] });
                })];
        },
        enumInputProps(enumVals = [], ...rest) {
            let props = {};
            for (let i = 0; i < rest.length; i += 2)
                props[rest[i]] = rest[i + 1];
            return [enumVals.map(val => { return { 'children': { '0': props } }; })];
        },
        enumInputValue(enumVals = [], value, property = 'checked') {
            value = commonLib_1.toArray(value);
            return [enumVals.map(val => { return { 'children': { '0': { [property]: !!~value.indexOf(val) } } }; })];
        },
    },
    parts: {
        RadioSelector: {
            _$widget: '^/widgets/Input',
            _$cx: '^/_$cx',
            _$useTag: 'div',
            type: 'notInput',
            children: [],
            $_maps: {
                value: '@/selector/value',
                children: [
                    {
                        $: '^/fn/enumInputs',
                        args: [
                            '@/selector/enum',
                            '@/selector/enumExten',
                            { _$useTag: 'label', _$cx: '^/_$cx' },
                            {
                                _$widget: 'input',
                                type: 'radio',
                                onChange: { $: '^/fn/eventValue|setValue|liveUpdate', args: ['${0}', { path: './@/selector/value' }] },
                                onBlur: '^/sets/simple/Main/onBlur',
                                onFocus: '^/sets/simple/Main/onFocus',
                            },
                            { _$useTag: 'span', _$cx: '^/_$cx', },
                            true
                        ],
                        replace: false,
                    },
                    { $: '^/fn/enumInputValue', args: ['@/selector/enum', '@/selector/value'], replace: false },
                    { $: '^/fn/enumInputProps', args: ['@/selector/enum', 'readOnly', '@/params/readonly', 'disabled', '@/params/disabled'], replace: false }
                ]
            }
        },
        Autowidth: {
            _$widget: '^/widgets/Autowidth',
            addWidth: 35,
            minWidth: 60,
            $_maps: {
                value: 'value',
                placeholder: '@/params/placeholder',
                'className/hidden': '@/params/hidden',
                $FField: { $: '^/fn/getProp', args: [], update: 'build' },
            }
        },
        Button: {
            _$widget: '^/widgets/Generic',
            _$cx: '^/_$cx',
            _$useTag: 'button',
            type: 'button',
            $_maps: {
                'className/button-viewer': '@/params/viewer',
                disabled: '@/params/disabled',
            }
        },
        Submit: {
            $_ref: '^/parts/Button',
            type: 'submit',
            children: ['Submit']
            // $_maps: {disabled: {$: '^/fn/not', args: '@/status/valid'},}
        },
        Reset: {
            $_ref: '^/parts/Button',
            type: 'reset',
            children: ['Reset'],
            //onClick: {$: '^/fn/api', args: ['reset']},
            $_maps: {
                disabled: '@/status/pristine',
            }
        },
        ArrayAddButton: {
            $_ref: '^/parts/Button',
            children: ['+'],
            onClick: { $: '^/fn/api', args: ['arrayAdd', './', 1] },
            $_maps: {
                'className/hidden': { $: '^/fn/equal | ^/fn/not', args: ['@/fData/type', 'array'] },
                'disabled': { $: '^/fn/equal', args: [true, { $: '^/fn/not', args: '@/fData/canAdd' }, '@params/disabled'] }
            }
        },
        ArrayDelButton: {
            $_ref: '^/parts/Button',
            children: ['-'],
            onClick: { $: '^/fn/api', args: ['arrayAdd', './', -1] },
            $_maps: {
                'className/hidden': { $: '^/fn/equal | ^/fn/not', args: ['@/fData/type', 'array'] },
                'disabled': { $: '^/fn/equal', args: [true, { $: '^/fn/not', args: '@/length' }, '@params/disabled'] },
            },
        },
        ArrayEmpty: {
            children: '(array is empty)',
            _$useTag: 'span',
            $_maps: { 'className/hidden': { $: '^/fn/equal | ^/fn/not', args: ['@/length', 0] } }
        },
        ArrayItemMenu: {
            _$widget: '^/widgets/ItemMenu',
            _$cx: '^/_$cx',
            buttons: ['first', 'last', 'up', 'down', 'del'],
            onClick: { $: '^/fn/api', args: ['arrayItemOps', './', '${0}'] },
            buttonsProps: {
                first: { disabledCheck: 'canUp' },
                last: { disabledCheck: 'canDown' },
                up: { disabledCheck: 'canUp' },
                down: { disabledCheck: 'canDown' },
                del: { disabledCheck: 'canDel' },
            },
            $_maps: { arrayItem: '@/arrayItem', 'className/button-viewer': '@/params/viewer', disabled: '@params/disabled' },
        },
        Expander: { _$widget: 'div', className: { expand: true } }
    },
    _$cx: classNames
};
exports.elements = elementsBase;


/***/ }),

/***/ "./src/stateLib.tsx":
/*!**************************!*\
  !*** ./src/stateLib.tsx ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const commonLib_1 = __webpack_require__(/*! ./commonLib */ "./src/commonLib.tsx");
const commonLib_2 = __webpack_require__(/*! ./commonLib */ "./src/commonLib.tsx");
const api_1 = __webpack_require__(/*! ./api */ "./src/api.tsx");
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
types.number = commonLib_2.isNumber; // (value: any) => typeof value === "number";
types.integer = commonLib_2.isInteger; //(value: any) => typeof value === "number" && (Math.floor(value) === value || value > 9007199254740992 || value < -9007199254740992);
types.string = commonLib_2.isString; //(value: any) => typeof value === "string";
types.array = commonLib_2.isArray;
types.object = commonLib_2.isObject; //(value: any) => typeof value === "object" && value && !isArray(value);// isObject(value);  //
types.empty = { 'any': null, 'null': null, 'boolean': false, 'number': 0, 'integer': 0, 'string': '', array: Object.freeze([]), object: Object.freeze({}) };
/////////////////////////////////////////////
//  Macros
/////////////////////////////////////////////
function getBindedMaps2update(branch, path = []) {
    const maps2disable = commonLib_1.getIn(branch, SymDataMapTree, SymData) || [];
    const maps2enable = maps2disable.map((map => commonLib_1.merge(map, { emitter: path })));
    let clearBinded = (maps2disable.length) ? { [SymDataMapTree]: { [SymData]: [] } } : undefined;
    commonLib_1.objKeys(branch).forEach(key => {
        let result;
        if (branch[key]) {
            result = getBindedMaps2update(branch[key], path.concat(key));
            commonLib_1.push2array(maps2disable, result.maps2disable);
            commonLib_1.push2array(maps2enable, result.maps2enable);
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
    if (!commonLib_2.isNumber(length))
        return state;
    if (commonLib_2.isArray(item.value)) {
        let mergeArrayObj = [];
        let replaceArrayObj = {};
        for (let i = 0; i < item.value.length; i++) {
            mergeArrayObj[length + i] = item.value[i];
            replaceArrayObj[length + i] = commonLib_1.getIn(item.replace, i);
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
    updObj[0] = commonLib_1.getIn(UPDATABLE.update, path);
    updObj[1] = commonLib_1.getIn(UPDATABLE.update, SymData, 'current', path);
    updObj[2] = commonLib_1.getIn(UPDATABLE.replace, path);
    updObj[3] = commonLib_1.getIn(UPDATABLE.replace, SymData, 'current', path);
    for (let i = Math.min(from, to); i <= Math.max(from, to); i++) {
        stateObject[i] = commonLib_1.getIn(state, path, i);
        arrayItems[i] = stateObject[i][SymData].arrayItem; //delIn(stateObject[i][SymData].arrayItem, ['uniqId']); // save arrayItem values, except "uniqId"
        //dataMaps[i] = stateObject[i][SymDataMapTree];
        currentObject[i] = commonLib_1.getIn(state, SymData, 'current', path, i);
        updObj.forEach(obj => commonLib_2.isMergeable(obj) && !obj.hasOwnProperty(i) && (obj[i] = SymClear));
    }
    stateObject = commonLib_1.moveArrayElems(stateObject, from, to);
    currentObject = commonLib_1.moveArrayElems(currentObject, from, to);
    const { maps2disable, maps2enable, clearBinded } = getBindedMaps2update(stateObject, path);
    if (clearBinded)
        stateObject = commonLib_1.merge(stateObject, clearBinded);
    updObj.forEach(obj => {
        if (!commonLib_2.isMergeable(obj))
            return;
        commonLib_1.moveArrayElems(obj, from, to);
        for (let i = Math.min(from, to); i <= Math.max(from, to); i++) {
            if (obj[i] === SymClear)
                delete obj[i];
        }
    });
    commonLib_1.objKeys(stateObject).forEach(i => {
        stateObject[i] = commonLib_1.merge(stateObject[i], commonLib_1.makeSlice(SymData, 'arrayItem', arrayItems[i]), { replace: commonLib_1.makeSlice(SymData, 'arrayItem', true) });
        //stateObject[i] = merge(stateObject[i], makeSlice(SymDataMapTree, dataMaps[i]), {replace: makeSlice(SymDataMapTree, true)});
    }); // restore arrayItem values and dataMap
    // const length2test = 1 + item.path.length - (item.path[0] == '#' ? 1 : 0);  // length2test can be smaller because of leading '#' in item.path (replace function receives path without leading '#')
    state = commonLib_1.merge(state, commonLib_1.makeSlice(path, stateObject), { replace: trueIfLength(item.path.length + 1) }); //(path: Path) => path.length === length2test});
    state = commonLib_1.merge(state, commonLib_1.makeSlice(SymData, 'current', path, currentObject), { replace: trueIfLength(item.path.length + 3) }); //(path: Path) => path.length === length2test + 2});
    if (op == 'del')
        state = updatePROC(state, UPDATABLE, makeNUpdate(path, ['length'], max));
    state = mergeUPD_PROC(state, UPDATABLE);
    state = setDataMapInState(state, UPDATABLE, maps2disable, true);
    state = setDataMapInState(state, UPDATABLE, maps2enable);
    return state;
};
Macros.switch = (state, schema, UPDATABLE, item) => {
    let keyPath = item[SymData] || [];
    let switches = commonLib_1.makeSlice(keyPath, item.value);
    object2PathValues(switches).forEach(pathValue => state = recursivelyUpdate(state, schema, UPDATABLE, makeNUpdate(item.path, pathValue, pathValue.pop())));
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
    let oldOneOf = commonLib_1.getIn(state, item.path, SymData, 'oneOf');
    if (oldOneOf == item.value) {
        if (!commonLib_2.isUndefined(item.setValue))
            state = updateCurrentPROC(state, UPDATABLE, item.setValue, false, item.path);
        return state;
    }
    const { macros } = item, newItem = __rest(item, ["macros"]);
    newItem[SymData] = ['oneOf'];
    if (commonLib_2.isUndefined(newItem.setValue)) {
        state = mergeUPD_PROC(state, UPDATABLE);
        newItem.setValue = commonLib_1.getIn(state, SymData, 'current', item.path);
    }
    return updatePROC(state, UPDATABLE, newItem);
};
/////////////////////////////////////////////
//  Macros utils
/////////////////////////////////////////////
function recursivelyUpdate(state, schema, UPDATABLE, item) {
    const branch = commonLib_1.getIn(state, item.path);
    const keys = branchKeys(branch);
    if (item.value == SymReset && item[SymData][0] == 'status') {
        let i = Object.assign({}, item);
        i.value = item[SymData][1] == 'untouched' ? isSelfManaged(branch) ? 1 : keys.length : 0;
        state = updatePROC(state, UPDATABLE, i);
    }
    else
        state = updatePROC(state, UPDATABLE, item);
    keys.forEach(key => state = recursivelyUpdate(state, schema, UPDATABLE, commonLib_1.merge(item, { path: item.path.concat(key) })));
    return state;
}
;
function branchKeys(branch) {
    let keys = [];
    if (isSelfManaged(branch))
        return keys;
    if (branch[SymData].fData.type == 'array')
        for (let j = 0; j < commonLib_1.getIn(branch, SymData, 'length'); j++)
            keys.push(j.toString());
    else
        keys = commonLib_1.objKeys(branch).filter(v => v);
    return keys;
}
exports.branchKeys = branchKeys;
/////////////////////////////////////////////
//      Schema processing functions
/////////////////////////////////////////////
const schemaStorage = commonLib_1.memoize(function (schema) {
    return {};
});
function oneOfFromState(state) {
    return (path) => {
        let s = commonLib_1.getIn(commonLib_2.isFunction(state) ? state() : state, path, SymData);
        return { oneOf: commonLib_1.getIn(s, 'oneOf'), type: commonLib_1.getIn(s, 'fData', 'type') };
    };
}
exports.oneOfFromState = oneOfFromState;
function oneOfStructure(state, path) {
    if (typeof state == 'function')
        state = state();
    const result = {};
    let tmp = result;
    commonLib_1.setIn(tmp, commonLib_1.getIn(state, SymData, 'oneOf'), SymData, 'oneOf');
    commonLib_1.setIn(tmp, commonLib_1.getIn(state, SymData, 'fData', 'type'), SymData, 'type');
    for (let i = 0; i < path.length; i++) {
        if (commonLib_2.isUndefined(path[i]) || path[i] === '')
            continue;
        tmp[path[i]] = {};
        tmp = tmp[path[i]];
        state = commonLib_1.getIn(state, path[i]);
        commonLib_1.setIn(tmp, commonLib_1.getIn(state, SymData, 'oneOf'), SymData, 'oneOf');
        commonLib_1.setIn(tmp, commonLib_1.getIn(state, SymData, 'fData', 'type'), SymData, 'type');
    }
    //return result
    const fn = function (path, oneOf) { return commonLib_2.isUndefined(oneOf) ? commonLib_1.getIn(result, path, SymData) : commonLib_1.setIn(result, oneOf, path, SymData); };
    fn._canSet = true;
    return fn;
}
const additionalItemsSchema = commonLib_1.memoize(function (items) {
    return {
        _compiled: true,
        oneOf: items,
        _oneOfSelector: normalizeFn(function () {
            return string2path(this.path).pop() % items.length;
        }, { noStrictArrayResult: true })
    };
});
function getSchemaPart(schema, path, getOneOf, fullOneOf) {
    function getArrayItemSchemaPart(index, schemaPart) {
        let items = [];
        if (schemaPart.items) {
            if (!commonLib_2.isArray(schemaPart.items))
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
            return commonLib_1.getIn(schema, path); // Extract and use the referenced definition if we have it.
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
                    schemaPart = oneOf.map((oneOfPart) => commonLib_1.merge(derefAndMergeAllOf(schema, oneOfPart), restSchemaPart, { array: 'replace' })); // deref every oneOf, merge allOf in there, and merge with schemaPart
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
                result = commonLib_1.merge(result, derefAndMergeAllOf(schema, allOf[i]), { array: 'replace' });
            }
            schemaPart = commonLib_1.merge(result, restSchemaPart);
        }
        return schemaPart;
    }
    const errorText = 'Schema path not found: ';
    let schemaPart = schema;
    const combinedSchemas = commonLib_1.getCreateIn(schemaStorage(schema), new Map(), 'combinedSchemas');
    let type;
    for (let i = path[0] == '#' ? 1 : 0; i < path.length; i++) {
        if (!schemaPart)
            throw new Error(errorText + path.join('/'));
        schemaPart = combineSchemasINNER_PROCEDURE(schemaPart);
        let { oneOf, type } = getOneOf(path.slice(0, i));
        if (commonLib_2.isArray(schemaPart))
            schemaPart = schemaPart[oneOf || 0];
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
    if (commonLib_2.isArray(schemaPart))
        schemaPart = schemaPart[getOneOf(path).oneOf || 0];
    return schemaPart;
}
exports.getSchemaPart = getSchemaPart;
const arrayStart = commonLib_1.memoize(function (schemaPart) {
    if (!commonLib_2.isArray(schemaPart.items))
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
const makeDataStorage = commonLib_1.memoize(function (schemaPart, oneOf, type, value = schemaPart.default) {
    // const x = schemaPart.x || ({} as FFSchemaExtensionType);
    const { _params = {}, _data = {} } = schemaPart;
    const result = Object.assign({ params: _params }, _data);
    if (!commonLib_2.isObject(result.messages))
        result.messages = {};
    if (commonLib_2.isUndefined(value))
        value = types.empty[type || 'any'];
    result.oneOf = oneOf;
    result.status = basicStatus;
    if (!commonLib_2.isObject(result.fData))
        result.fData = {};
    const fData = result.fData;
    fData.type = type;
    fData.required = schemaPart.required;
    fData.title = schemaPart.title;
    fData.placeholder = schemaPart._placeholder;
    if (schemaPart.enum)
        fData.enum = schemaPart.enum;
    if (schemaPart._enumExten)
        fData.enumExten = schemaPart._enumExten;
    if (commonLib_2.isArray(schemaPart._enumExten) && commonLib_2.isArray(schemaPart.enum)) {
        let enumExten = {};
        fData.enumExten = fData.enumExten.map((v) => commonLib_2.isString(v) ? { label: v } : v);
        fData.enum.forEach((v, i) => enumExten[v] = fData.enumExten[i]);
        fData.enumExten = enumExten;
    }
    else if (schemaPart._enumExten && !fData.enum) {
        if (commonLib_2.isArray(fData.enumExten)) {
            let enumExten = {};
            fData.enumExten.forEach((v) => {
                // if (!isString(v) && !v) return;
                if (commonLib_2.isString(v))
                    enumExten[v] = { label: v };
                else if (commonLib_2.isObject(v)) {
                    if (!commonLib_2.isUndefined(v.value)) {
                        if (commonLib_2.isUndefined(v.label))
                            v = Object.assign({}, v, { label: v.value });
                        enumExten[v.value] = v;
                    }
                    else if (!commonLib_2.isUndefined(v.label))
                        enumExten[v.label] = v;
                }
            });
            fData.enumExten = enumExten;
        }
        fData.enum = commonLib_1.objKeys(fData.enumExten).filter(k => fData.enumExten[k]);
    }
    if (schemaPart._oneOfSelector)
        fData.oneOfSelector = true;
    if (isSchemaSelfManaged(schemaPart, type))
        result.value = value;
    else
        delete result.value;
    let untouched = 1;
    if (type == 'array') {
        result.length = commonLib_1.getIn(value, 'length') || 0;
        if (!commonLib_2.isUndefined(schemaPart.minItems) && result.length < schemaPart.minItems)
            result.length = schemaPart.minItems;
        result.fData.canAdd = isArrayCanAdd(schemaPart, result.length);
        untouched = result.length;
    }
    else if (type == 'object')
        untouched = commonLib_1.objKeys(schemaPart.properties || {}).length;
    if (untouched != 1)
        result.status = Object.assign({}, result.status, { untouched });
    return result;
});
function getUniqKey() { return Date.now().toString(36) + Math.random().toString(36); }
function makeStateBranch(schema, getNSetOneOf, path = [], value) {
    const result = {};
    const dataMapObjects = [];
    let defaultValues;
    let currentOneOf = (getNSetOneOf(path) || {}).oneOf;
    const schemaPartsOneOf = commonLib_1.toArray(getSchemaPart(schema, path, getNSetOneOf, true));
    if (commonLib_2.isUndefined(currentOneOf)) {
        const _oneOfSelector = schemaPartsOneOf[currentOneOf || 0]._oneOfSelector;
        if (_oneOfSelector) {
            let setOneOf = processFn.call({ path: path2string(path) }, _oneOfSelector, value);
            if (commonLib_2.isArray(setOneOf))
                setOneOf = setOneOf[0];
            currentOneOf = setOneOf;
            //schemaPart = schemaPartsOneOf[oneOf];
        }
    }
    let { schemaPart, oneOf, type } = findOneOf(schemaPartsOneOf, value, currentOneOf);
    if (commonLib_2.isUndefined(schemaPart) || !commonLib_2.isUndefined(currentOneOf) && currentOneOf != oneOf) { // value type is not that currentOneOf supports 
        console.info('Passed value: "' + value + '" is not supported by schema.type in path "' + path.join('/') + '" and oneOfIndex "' + currentOneOf + '". Reset value to default.\n');
        value = (schemaPartsOneOf)[currentOneOf || 0].default; // so, reset value to default, cause keeping oneOf is in prior (if currentOneOf exists, otherwise oneOf is changed)
        const tmp = findOneOf(schemaPartsOneOf, value, currentOneOf);
        schemaPart = tmp.schemaPart;
        oneOf = tmp.oneOf;
        type = tmp.type;
    }
    commonLib_1.push2array(dataMapObjects, normalizeStateMaps(schemaPart._stateMaps || [], path));
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
            for (let i = 0; i < defaultValues.length; i++) {
                let { state: branch, dataMap, defaultValues: dValue } = makeStateBranch(schema, getNSetOneOf, path.concat(i), commonLib_1.getIn(commonLib_2.isUndefined(value) ? schemaPart.default : value, i));
                defaultValues[i] = dValue;
                commonLib_1.push2array(dataMapObjects, dataMap);
                branch = commonLib_1.merge(branch, { [SymData]: { arrayItem: getArrayItemData(schemaPart, i, defaultValues.length) } }, { replace: { [SymData]: { ArrayItem: true } } });
                branch = commonLib_1.merge(branch, { [SymData]: { params: { uniqKey: getUniqKey() } } });
                result[i] = branch;
            }
        }
        else if (type == 'object') {
            defaultValues = {};
            let arrayOfRequired = result[SymData].fData.required;
            arrayOfRequired = commonLib_2.isArray(arrayOfRequired) && arrayOfRequired.length && arrayOfRequired;
            commonLib_1.objKeys(schemaPart.properties || {}).forEach(field => {
                let { state: branch, dataMap, defaultValues: dValue } = makeStateBranch(schema, getNSetOneOf, path.concat(field), commonLib_1.getIn(commonLib_2.isUndefined(value) ? schemaPart.default : value, field));
                defaultValues[field] = dValue;
                commonLib_1.push2array(dataMapObjects, dataMap);
                if (arrayOfRequired && (~arrayOfRequired.indexOf(field)))
                    branch = commonLib_1.merge(branch, { [SymData]: { fData: { required: true } } });
                result[field] = branch;
            });
        }
        if (value)
            defaultValues = commonLib_1.merge(value, defaultValues, { replace: trueIfLength(1) });
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
    return commonLib_1.hasIn(state, ...paths, SymData, 'value');
}
exports.isSelfManaged = isSelfManaged;
function isSchemaSelfManaged(schemaPart, type) {
    return type !== 'array' && type !== 'object' || commonLib_1.getIn(schemaPart, '_simple');
}
function findOneOf(oneOfShemas, value, currentOneOf) {
    if (!commonLib_2.isArray(oneOfShemas))
        oneOfShemas = [oneOfShemas];
    const oneOfKeys = oneOfShemas.map((v, i) => i);
    if (currentOneOf)
        commonLib_1.moveArrayElems(oneOfKeys, currentOneOf, 0); // currentOneOf should be checked first to match type
    for (let k = 0; k < oneOfKeys.length; k++) {
        let oneOf = oneOfKeys[k];
        let schemaTypes = oneOfShemas[oneOf].type || types;
        if (!commonLib_2.isArray(schemaTypes))
            schemaTypes = [schemaTypes];
        let defaultUsed;
        let checkValue = commonLib_2.isUndefined(value) ? (defaultUsed = true) && oneOfShemas[oneOf].default : value;
        for (let j = 0; j < schemaTypes.length; j++)
            if (types[schemaTypes[j]](checkValue) || commonLib_2.isUndefined(checkValue))
                return { schemaPart: oneOfShemas[oneOf], oneOf, type: schemaTypes[j] };
        if (defaultUsed && !commonLib_2.isUndefined(oneOfShemas[oneOf].default))
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
    let messages = commonLib_1.toArray(result).map(conv);
    messages.forEach((item) => {
        let { path } = item, itemNoPath = __rest(item, ["path"]);
        if (path) {
            path = normalizePath(path, track);
            state = updateMessagesPROC(state, UPDATABLE, path, itemNoPath, defaultGroup);
        }
        else {
            let { group = defaultGroup, data, priority = 0 } = itemNoPath, rest = __rest(itemNoPath, ["group", "data", "priority"]);
            const messageData = commonLib_1.getCreateIn(UPDATABLE.update, {}, track, SymData, 'messages', priority);
            Object.assign(messageData, rest);
            if (!commonLib_2.isObject(messageData.texts))
                messageData.texts = {};
            if (!commonLib_2.isArray(messageData.texts[group]))
                messageData.texts[group] = [];
            if (data)
                commonLib_1.push2array(messageData.texts[group], data);
        }
    });
    return state;
}
function getCurrentPriority(messages) {
    let priorities = commonLib_1.objKeys(messages || {});
    let currentPriority;
    for (let i = 0; i < priorities.length; i++) {
        let groups = commonLib_1.getIn(messages, priorities[i], 'texts') || {};
        let grKeys = commonLib_1.objKeys(groups);
        for (let j = 0; j < grKeys.length; j++) {
            if (groups[grKeys[j]] && groups[grKeys[j]].length) {
                currentPriority = parseInt(priorities[i]);
                break;
            }
        }
        if (!commonLib_2.isUndefined(currentPriority))
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
    let currentPriority = getCurrentPriority(commonLib_1.getIn(state, track, SymData, 'messages'));
    state = setPriorityPROC(state, UPDATABLE, track, currentPriority);
    if (!isSelfManaged(state, track))
        commonLib_1.objKeys(update).forEach(key => state = setValidStatusPROC(state, UPDATABLE, update[key], track.concat(key)));
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
            modifiedValues && commonLib_1.objKeys(modifiedValues).forEach(key => state = recurseValidationInnerPROCEDURE(state, validatedValue[key], modifiedValues[key], track.concat(key)));
        let _validators = schemaPart._validators;
        if (_validators) {
            const field = makeSynthField(UPDATABLE.api, path2string(track));
            _validators.forEach((validator) => {
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
        const type = commonLib_1.getIn(state, track, SymData, 'fData', 'type');
        if (!type)
            return state;
        if (type == 'object' || type == 'array')
            modifiedValues && commonLib_1.objKeys(modifiedValues).forEach(key => clearDefaultMessagesInnerPROCEDURE(state, modifiedValues[key], track.concat(key)));
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
    if (!modifiedValues || commonLib_1.objKeys(modifiedValues).length == 0) { // no changes, no validation
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
                if (validatedValue == commonLib_1.getIn(newValues, path)) {
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
                if (validatedValue == commonLib_1.getIn(newValues, path)) {
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
        let keys = commonLib_1.objKeys(Object.assign({}, inital, current));
        keys.forEach(key => state = setDirtyPROC(state, UPDATABLE, commonLib_1.getIn(inital, key), commonLib_1.getIn(current, key), track.concat(key)));
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
        let current = commonLib_1.getIn(state, SymData, 'current', track);
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
        let keys = commonLib_1.objKeys(currentChanges || {});
        if (schemaPart.type == 'array') {
            if (!~keys.indexOf('length'))
                keys.push('length');
            let existKeys = branchKeys(commonLib_1.getIn(state, track));
            keys = keys.filter(k => isNaN(parseInt(k)) || ~existKeys.indexOf(k));
        }
        // if (schemaPart.type == 'array' && !~keys.indexOf('length')) keys.push('length');
        forceDirty = forceDirty || !commonLib_2.isMergeable(inital);
        keys.forEach(key => state = updateDirtyPROC(state, UPDATABLE, commonLib_1.getIn(inital, key), currentChanges[key], track.concat(key), forceDirty));
    }
    return state;
}
function setPristinePROC(state, UPDATABLE, inital, track = []) {
    if (commonLib_1.getIn(UPDATABLE.update, track, SymData, 'status', 'pristine')) {
        if (commonLib_2.isMergeable(inital) && commonLib_1.getIn(state, SymData, 'current', track) !== inital) {
            commonLib_1.setIn(UPDATABLE.update, inital, SymData, 'current', track);
            commonLib_1.setIn(UPDATABLE.replace, true, SymData, 'current', track);
        }
    }
    else {
        commonLib_1.objKeys(commonLib_1.getIn(UPDATABLE.update, track)).forEach(key => setPristinePROC(state, UPDATABLE, commonLib_1.getIn(inital, key), track.concat(key)));
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
    let oldCurrent = commonLib_1.getIn(prevState, SymData, 'current');
    if (UPDATABLE.forceCheck) {
        oldCurrent = commonLib_1.merge(oldCurrent, UPDATABLE.forceCheck);
        UPDATABLE.forceCheck = undefined;
    }
    if (prevState[SymData].inital !== state[SymData].inital) { // check dirty for inital changes
        let initalChanges = commonLib_1.mergeState(prevState[SymData].inital, state[SymData].inital, { diff: true }).changes;
        state = updateDirtyPROC(state, UPDATABLE, state[SymData].inital, initalChanges);
    }
    let currentChanges = commonLib_1.mergeState(oldCurrent, commonLib_1.getIn(state, SymData, 'current'), { diff: true }).changes;
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
            force = commonLib_2.isMergeable(currentChanges) ? currentChanges : !commonLib_2.isUndefined(currentChanges);
    }
    if (force)
        state = makeValidation(state, dispatch, { force, api, opts, promises });
    dispatch({ type: api_1.anSetState, state, api });
    return promises;
}
exports.updateState = updateState;
const makeStateFromSchema = commonLib_1.memoize(function (schema) {
    return makeStateBranch(schema, oneOfStructure({}, []));
});
function initState(UPDATABLE) {
    let { state, dataMap = [], defaultValues } = makeStateFromSchema(UPDATABLE.api.schema);
    state = commonLib_1.merge(state, commonLib_1.setIn({}, defaultValues, [SymData, 'current']));
    state = setDataMapInState(state, UPDATABLE, dataMap);
    const current = commonLib_1.getIn(state, SymData, 'current');
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
    if (value === SymReset)
        value = commonLib_1.getIn(state, SymData, 'inital', track);
    if (value === SymClear)
        value = commonLib_1.getIn(state, SymData, 'default', track);
    if (commonLib_1.getIn(state, SymData, 'current', track) === value && !commonLib_1.hasIn(UPDATABLE.update, SymData, 'current', track))
        return state;
    const schema = UPDATABLE.api.schema;
    let branch = commonLib_1.getIn(state, track);
    // if no branch then no need to modify state for this value, just update current
    if (!branch) {
        if (track[track.length - 1] == 'length') { // hook if someone decides to edit array's length directly
            const topPath = track.slice(0, -1);
            const topBranch = commonLib_1.getIn(state, topPath);
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
    if (commonLib_2.isUndefined(value))
        value = types.empty[type || 'any'];
    if (oneOfSelector || !types[type || 'any'](value)) { // if wrong type for current oneOf index search for proper type in oneOf
        // setOneOf = 
        const parts = getSchemaPart(schema, track, oneOfFromState(state), true);
        let currentOneOf = branch[SymData].oneOf;
        if (oneOfSelector) {
            //const field = makeSynthField(UPDATABLE.api, path2string(track));
            const _oneOfSelector = parts[currentOneOf]._oneOfSelector;
            setOneOf = processFn.call({ path: path2string(track) }, _oneOfSelector, value);
            if (commonLib_2.isArray(setOneOf))
                setOneOf = setOneOf[0];
        }
        const { schemaPart, oneOf, type } = findOneOf(parts, value, commonLib_2.isUndefined(setOneOf) ? currentOneOf : setOneOf);
        if (currentOneOf !== oneOf) {
            if (schemaPart) {
                return updatePROC(state, UPDATABLE, makeNUpdate(track, ['oneOf'], oneOf, false, { type, setValue: value }));
            }
            else
                console.warn('Type "' + (typeof value) + '" not found in path [' + track.join('/') + ']');
        }
    }
    if (isSelfManaged(branch)) { // if object has own value then replace it directly
        state = updatePROC(state, UPDATABLE, makeNUpdate(track, ['value'], value, replace));
    }
    else {
        if (commonLib_2.isMergeable(value)) { // if we receive object or array then apply their values to state
            if (type == 'array' && !commonLib_2.isUndefined(value.length)) {
                state = updatePROC(state, UPDATABLE, makeNUpdate(track, ['length'], value.length));
                branch = commonLib_1.getIn(state, track);
            }
            if (replace === true) { // restore value's props-structure that are exist in state
                let v = commonLib_2.isArray(value) ? [] : {};
                branchKeys(branch).forEach(k => v[k] = undefined);
                value = Object.assign(v, value);
            }
            commonLib_1.objKeys(value).forEach(key => state = updateCurrentPROC(state, UPDATABLE, value[key], replace === true ? true : commonLib_1.getIn(replace, key), track.concat(key)));
            if (replace === true) { // this code removes props from current that are not preset in value and not exists in state
                state = mergeUPD_PROC(state, UPDATABLE);
                branch = commonLib_1.getIn(state, track);
                let current = commonLib_1.getIn(state, SymData, 'current', track);
                branchKeys(branch).forEach(k => value[k] = current[k]); // value was reassigned in block below, so change it directly
                state = updatePROC(state, UPDATABLE, makeNUpdate([], ['current'].concat(track), value, replace));
            }
        }
    }
    return state;
}
function splitValuePROC(state, UPDATABLE, item) {
    const { value: itemValue, path, replace } = item;
    const keyPath = item[SymData] || [];
    if (keyPath.length == 0) {
        const { value, status, length, oneOf } = itemValue, rest = __rest(itemValue, ["value", "status", "length", "oneOf"]);
        ['value', 'status', 'length', 'oneOf'].forEach(key => {
            if (commonLib_1.hasIn(itemValue, key))
                state = updatePROC(state, UPDATABLE, makeNUpdate(path, [key], itemValue[key], commonLib_1.getIn(replace, key)));
        });
        if (commonLib_1.objKeys(rest).length)
            state = updatePROC(state, UPDATABLE, makeNUpdate(path, keyPath, rest, replace));
    }
    else {
        commonLib_1.objKeys(itemValue).forEach(key => {
            state = updatePROC(state, UPDATABLE, makeNUpdate(path, keyPath.concat(key), itemValue[key], commonLib_1.getIn(replace, key)));
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
        commonLib_1.setIn(UPDATABLE, commonLib_1.getIn(update, path), 'update', ...paths, path);
        if (replaceValue)
            commonLib_1.setIn(UPDATABLE, replaceValue, 'replace', ...paths, path);
    });
    return UPDATABLE;
}
exports.setUPDATABLE = setUPDATABLE;
function mergeUPD_PROC(state, UPDATABLE) {
    state = commonLib_1.merge(state, UPDATABLE.update, { replace: UPDATABLE.replace });
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
    if (commonLib_2.isFunction(value))
        value = value(getFromUPD(state, UPDATABLE)(path, SymData, keyPath));
    if (path.length == 0 && (keyPath[0] == 'inital' || keyPath[0] == 'default')) {
        state = commonLib_1.merge(state, commonLib_1.makeSlice(SymData, keyPath, value), { replace: commonLib_1.makeSlice(SymData, keyPath, replace) });
    }
    else {
        // split object for proper state update (for dataMap correct execution)
        if (commonLib_2.isObject(value) && (keyPath.length == 0 && (commonLib_1.hasIn(value, 'value') || commonLib_1.hasIn(value, 'status') || commonLib_1.hasIn(value, 'length') || commonLib_1.hasIn(value, 'oneOf'))
            || (keyPath.length == 1 && keyPath[0] == 'status')))
            return splitValuePROC(state, UPDATABLE, item);
        let branch = commonLib_1.getIn(state, path);
        if (!commonLib_2.isObject(branch))
            return state; // check if there is branch in state
        if (keyPath[0] == 'value' && !commonLib_1.hasIn(branch, SymData, 'value')) // value is not self managed, so modify only current
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
            state = updatePROC(state, UPDATABLE, makeNUpdate([], commonLib_1.push2array(['current'], path, keyPath.slice(1)), value, replace));
        }
        else if (keyPath[0] == 'messages') { // modify valid status
            const messages = getFromUPD(state, UPDATABLE)(path, SymData, 'messages');
            let currentPriority = getCurrentPriority(messages);
            state = setPriorityPROC(state, UPDATABLE, path, currentPriority);
        }
        else if (keyPath[0] == 'length') { // modify state with new length
            state = updatePROC(state, UPDATABLE, makeNUpdate([], commonLib_1.push2array(['current'], path, keyPath), value, replace));
            let start = branch[SymData].length;
            start = Math.max(start, 0);
            let end = Math.max(value || 0);
            const oneOfStateFn = oneOfStructure(state, path);
            const maps2enable = [];
            const maps2disable = [];
            for (let i = start; i < end; i++) {
                let elemPath = path.concat(i);
                if (!commonLib_2.isUndefined(item.setOneOf))
                    oneOfStateFn(elemPath, { oneOf: item.setOneOf });
                let { state: branch, dataMap = [], defaultValues } = makeStateBranch(schema, oneOfStateFn, elemPath);
                const untouched = getUpdValue([state, UPDATABLE.update], path, SymData, 'status', 'untouched');
                const mergeBranch = { [SymData]: { params: { uniqKey: getUniqKey() } } };
                if (!untouched)
                    commonLib_1.setIn(mergeBranch[SymData], { untouched: 0, touched: true }, 'status');
                branch = commonLib_1.merge(branch, mergeBranch);
                state = commonLib_1.merge(state, commonLib_1.setIn({}, branch, elemPath), { replace: commonLib_1.setIn({}, true, elemPath) });
                state = updatePROC(state, UPDATABLE, makeNUpdate([], commonLib_1.push2array(['current'], elemPath), defaultValues, true));
                commonLib_1.push2array(maps2enable, dataMap);
                if (untouched)
                    state = Macros.setStatus(state, schema, UPDATABLE, makeNUpdate(path, ['status', 'untouched'], 1));
            }
            for (let i = end; i < start; i++) {
                let elemPath = path.concat(i);
                commonLib_1.push2array(maps2disable, commonLib_1.getIn(state, elemPath, SymDataMapTree, SymData) || []);
                ['invalid', 'dirty', 'untouched', 'pending'].forEach(key => {
                    let statusValue = getUpdValue([update, state], elemPath, SymData, 'status', key);
                    if (statusValue)
                        state = Macros.setStatus(state, schema, UPDATABLE, makeNUpdate(path, ['status', key], -1));
                });
                setUPDATABLE(UPDATABLE, SymDelete, true, elemPath);
                // setIn(update, SymDelete, elemPath);
                // setIn(replace_UPDATABLE, SymDelete, elemPath);
            }
            let schemaPart = getSchemaPart(schema, path, oneOfFromState(state));
            commonLib_1.setIn(update, isArrayCanAdd(schemaPart, end), path, SymData, 'fData', 'canAdd');
            for (let i = Math.max(Math.min(start, end) - 1, 0); i < end; i++)
                setUPDATABLE(UPDATABLE, getArrayItemData(schemaPart, i, end), true, path, i, SymData, 'arrayItem');
            state = mergeUPD_PROC(state, UPDATABLE);
            state = setDataMapInState(state, UPDATABLE, maps2disable, true);
            state = setDataMapInState(state, UPDATABLE, maps2enable);
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
            if (!commonLib_2.isUndefined(newKey))
                state = updatePROC(state, UPDATABLE, makeNUpdate(path, ['status', newKey], value));
            //setIn(update, value, path, SymData, 'status', newKey);
        }
        else if (keyPath[0] == 'oneOf') {
            const oldBranch = commonLib_1.getIn(state, path);
            let oldOneOf = commonLib_1.getIn(oldBranch, SymData, 'oneOf') || 0;
            let newOneOf = commonLib_1.getIn(UPDATABLE.update, path, SymData, 'oneOf');
            if ((oldOneOf != newOneOf) || (item.type && item.type != commonLib_1.getIn(oldBranch, SymData, 'fData', 'type'))) {
                setIfNotDeeper(UPDATABLE, SymReset, 'forceCheck', item.path);
                state = mergeUPD_PROC(state, UPDATABLE);
                state = setDataMapInState(state, UPDATABLE, commonLib_1.getIn(state, path, SymDataMapTree, SymData) || [], true);
                let { state: branch, dataMap: maps2enable = [], defaultValues } = makeStateBranch(schema, oneOfStructure(state, path), path, item.setValue);
                const _a = oldBranch[SymData], { value: v1, length: v2, oneOf: v3, fData: v4 } = _a, previousBranchData = __rest(_a, ["value", "length", "oneOf", "fData"]); // remove data that should be replaced by new branch
                if (!isSelfManaged(oldBranch) || !isSelfManaged(branch))
                    delete previousBranchData.status; // keep status values only for self-managed branch, that keeps to be self-managed
                branch = commonLib_1.merge(branch, { [SymData]: previousBranchData }, { arrays: 'replace' });
                if (path.length) {
                    const topPath = path.slice();
                    const field = topPath.pop();
                    ['invalid', 'dirty', 'pending'].forEach(key => {
                        let oldStatusValue = commonLib_1.getIn(oldBranch, SymData, 'status', key);
                        let newStatusValue = commonLib_1.getIn(branch, SymData, 'status', key);
                        if (!oldStatusValue != !newStatusValue)
                            state = Macros.setStatus(state, schema, UPDATABLE, makeNUpdate(topPath, ['status', key], newStatusValue ? 1 : -1));
                    });
                    let arrayOfRequired = commonLib_1.getIn(state, topPath, SymData, 'fData', 'required');
                    arrayOfRequired = commonLib_2.isArray(arrayOfRequired) && arrayOfRequired.length && arrayOfRequired;
                    if (arrayOfRequired && (~arrayOfRequired.indexOf(field)))
                        branch = commonLib_1.merge(branch, { [SymData]: { fData: { required: true } } });
                }
                if (commonLib_1.getIn(oldBranch, SymData, 'status', 'untouched') == 0)
                    branch = commonLib_1.merge(branch, { [SymData]: { status: { untouched: 0 } } }); // stick untouched to zero
                state = commonLib_1.merge(state, commonLib_1.setIn({}, branch, path), { replace: commonLib_1.setIn({}, true, path) });
                state = updatePROC(state, UPDATABLE, makeNUpdate([], commonLib_1.push2array(['current'], path), defaultValues, true));
                state = setDataMapInState(state, UPDATABLE, maps2enable);
                if (commonLib_1.getIn(branch, SymData, 'status', 'untouched') == 0)
                    state = Macros.switch(state, schema, UPDATABLE, makeNUpdate(path, ['status', 'untouched'], 0));
            }
        }
    }
    // apply dataMap
    let dataMap = commonLib_1.getIn(state, path, SymDataMapTree);
    for (let i = 0; i < keyPath.length; i++) {
        if (!dataMap)
            break;
        state = executeDataMapsPROC(state, UPDATABLE, dataMap[SymDataMap], makeNUpdate(path, keyPath.slice(0, i), commonLib_1.setIn({}, value, keyPath.slice(i)), commonLib_1.setIn({}, replace, keyPath.slice(i))));
        dataMap = dataMap[keyPath[i]];
    }
    if (dataMap)
        state = recursivelyExecuteDataMaps(dataMap, value, replace, keyPath);
    function recursivelyExecuteDataMaps(dataMap, value, replace, track = []) {
        state = executeDataMapsPROC(state, UPDATABLE, dataMap[SymDataMap], makeNUpdate(path, track, value, replace));
        commonLib_2.isMergeable(value) && commonLib_1.objKeys(dataMap).forEach(key => value.hasOwnProperty(key) && (state = recursivelyExecuteDataMaps(dataMap[key], value[key], commonLib_1.getIn(replace, key), track.concat(key))));
        return state;
    }
    return state;
}
exports.updatePROC = updatePROC;
function normalizeStateMaps(dataMap, emitter) {
    return dataMap.map((item) => {
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
        normalizeUpdate({ path: emitterPath.join('/') + '/' + dataMap.from, value: null }, state).forEach(fromItem => {
            let key = fromItem[SymData][0];
            if (key == 'current' || key == 'inital' || key == 'default' && fromItem.path.length)
                fromItem = Object.assign({}, fromItem, { path: [], [SymData]: [key, ...fromItem.path, ...fromItem[SymData].slice(1)] });
            normalizeUpdate({ path: emitterPath.join('/') + '/' + dataMap.to, value: null }, state).forEach(toItem => {
                let relTo = path2string(relativePath(fromItem.path, toItem.path.concat(SymData, ...toItem[SymData])));
                //console.log(relTo);
                if (commonLib_1.getIn(state, fromItem.path))
                    commonLib_1.setIn(UPDATABLE.update, unset ? undefined : dataMap.action, fromItem.path, SymDataMapTree, fromItem[SymData], SymDataMap, relTo);
                if (!unset) {
                    // state = executeDataMapsPROC(state, UPDATABLE, makeSlice(relTo, dataMap.action),
                    //   makeNUpdate(fromItem.path, fromItem[SymData], getIn(state, fromItem.path, SymData, fromItem[SymData])));
                    dataMaps2execute.push({
                        map: commonLib_1.makeSlice(relTo, dataMap.action),
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
            const emitterBranch = commonLib_1.getIn(state, emitterPath);
            if (emitterBranch) {
                let bindedMaps = commonLib_1.getIn(emitterBranch, SymDataMapTree, SymData) || [];
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
            state = executeDataMapsPROC(state, UPDATABLE, v.map, makeNUpdate(v.fromPath, v.keyPath, commonLib_1.getIn(state, v.fromPath, SymData, v.keyPath)));
            state = mergeUPD_PROC(state, UPDATABLE);
        });
    return state;
}
function executeDataMapsPROC(state, UPDATABLE, maps, item) {
    const { value, path, replace } = item;
    const keyPath = item[SymData] || [];
    const from = NUpdate2string(item);
    commonLib_1.objKeys(maps || {}).forEach((pathTo) => {
        //console.log('maps=', maps);
        if (!maps[pathTo])
            return; // disabled map
        const map = maps[pathTo];
        const NpathTo = path2string(normalizePath(pathTo, path));
        let executedValue = value;
        const updates = [];
        if (commonLib_2.isObject(map)) {
            const field = makeSynthField(UPDATABLE.api, NpathTo, from);
            //let _get = field.api._get;
            //field.api._get = getFromUPD(state, UPDATABLE);
            field.get = getFromUPD(state, UPDATABLE);
            field.updates = updates;
            executedValue = processFn.call(field, map, value);
            field.updates = null;
            field.get = null;
        }
        if (!updates.length)
            updates.push({ path: NpathTo, value: executedValue, replace: commonLib_2.isUndefined(map.replace) ? replace : map.replace });
        updates.forEach((update) => state = updatePROC(state, UPDATABLE, update));
    });
    return state;
}
/////////////////////////////////////////////
//      state utilities
/////////////////////////////////////////////
const trueIfLength = (length) => (path) => commonLib_1.getIn(path, 'length') === length;
function isTopPath(path) {
    return path.length == 0 || path.length == 1 && path[0] == '#';
}
const makeSynthField = commonLib_1.memoize(function (stateApi, to, from) {
    const path = to.split('@')[0];
    const pathData = from ? from.split('@')[0] : path;
    const updates = [];
    const field = { from, to, path, stateApi, updates };
    field.api = stateApi.wrapper(field);
    field.wrapOpts = (rest) => {
        if (field.updates && commonLib_2.isUndefined(rest.setExecution))
            rest.setExecution = (addUpdates) => addUpdates && commonLib_1.push2array(field.updates, addUpdates);
        return rest;
    };
    field.getData = () => field.api.get(pathData, SymData);
    return field;
});
function getFromUPD(state, UPDATABLE) {
    return (...tPath) => {
        if (commonLib_1.hasIn(UPDATABLE.update, ...tPath.map(path => normalizePath(path))))
            return commonLib_1.merge(getFromState(state, ...tPath), getFromState(UPDATABLE.update, ...tPath), { replace: getFromState(UPDATABLE.replace, ...tPath) });
        return getFromState(state, ...tPath);
    };
}
function getUpdValue(states, ...paths) {
    for (let i = 0; i < states.length; i++) {
        if (commonLib_1.hasIn(states[i], ...paths))
            return commonLib_1.getIn(states[i], ...paths);
    }
}
function getFromState(state, ...paths) {
    return commonLib_1.getIn(state, ...paths.map(path => normalizePath(path)));
}
exports.getFromState = getFromState;
const makeNUpdate = (path, keyPath, value, replace, rest = {}) => { return Object.assign({ path, [SymData]: keyPath, value, replace }, rest); };
exports.makeNUpdate = makeNUpdate;
function isNUpdate(updateItem) {
    return !commonLib_2.isUndefined(commonLib_1.getIn(updateItem, SymData)) && commonLib_2.isArray(updateItem[SymData]);
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
        paths = multiplyPath(paths, { '*': (p) => branchKeys(commonLib_1.getIn(state, p)).join(',') });
        keyPathes = multiplyPath(keyPathes);
        commonLib_1.objKeys(paths).forEach(p => commonLib_1.objKeys(keyPathes).forEach(k => result.push(makeNUpdate(paths[p], keyPathes[k], value, replace, rest))));
    });
    return result;
}
exports.normalizeUpdate = normalizeUpdate;
/////////////////////////////////////////////
//  Path functions
/////////////////////////////////////////////
const symConv = function (key, anotherKey) {
    if (!commonLib_2.isUndefined(anotherKey)) {
        symConv._data[key] = anotherKey;
        symConv._data[anotherKey] = key;
    }
    else
        return symConv._data[key];
};
symConv._data = { '#': '' };
symConv.sym2str = (sym) => typeof sym == 'symbol' && !commonLib_2.isUndefined(symConv(sym)) ? symConv(sym) : sym;
symConv.str2sym = (str) => typeof str == 'string' && !commonLib_2.isUndefined(symConv(str)) ? symConv(str) : str;
symConv('@', SymData);
function multiplyPath(path, strReplace = {}) {
    let result = { '': [] };
    path.forEach(value => {
        let res = {};
        value = strReplace[value] || value;
        if (typeof value == 'string' && ~value.indexOf(',')) {
            commonLib_1.objKeys(result).forEach(key => value.split(',').forEach((k) => res[key && (key + ',' + k) || k] = result[key].concat(k.trim())));
        }
        else if (typeof value == 'function') {
            commonLib_1.objKeys(result).forEach(key => {
                let tmp = value(result[key]);
                if (typeof tmp == 'string')
                    tmp = string2path(tmp);
                tmp = multiplyPath(tmp, strReplace);
                commonLib_1.objKeys(tmp).forEach(k => res[key && (key + (k ? ',' + k : '')) || k] = result[key].concat(tmp[k]));
            });
        }
        else
            commonLib_1.objKeys(result).forEach(key => commonLib_1.push2array(result[key], value));
        if (commonLib_1.objKeys(res).length)
            result = res;
    });
    return result;
}
exports.multiplyPath = multiplyPath;
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
    return commonLib_1.push2array(result, destination.slice(i));
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
        if (!commonLib_2.isObject(result[path[i]]))
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
    if (commonLib_2.isArray(path)) {
        const result = [];
        commonLib_1.push2array(result, ...path.map(flattenPath));
        return result;
    }
    else if (typeof path == 'string')
        return string2path(path);
    return [path];
}
function isNPath(path) {
    return commonLib_2.isMergeable(path) && commonLib_1.getIn(path, SymData) === 'nPath';
}
exports.isNPath = isNPath;
function normalizePath(path, base = []) {
    let result = resolvePath(flattenPath(path), base.length ? flattenPath(base) : []);
    result[SymData] = 'nPath';
    return result;
}
exports.normalizePath = normalizePath;
function path2string(path) {
    return commonLib_2.isArray(path) ? path.map(path2string).join('/') : symConv.sym2str(path);
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
function object2PathValues(vals, options = {}, track = []) {
    const fn = options.symbol ? commonLib_1.objKeysNSymb : commonLib_1.objKeys;
    const check = options.arrayAsValue ? commonLib_2.isObject : commonLib_2.isMergeable;
    if (!check(vals))
        return [[vals]];
    let result = [];
    fn(vals).forEach((key) => {
        let path = track.concat(key);
        if (check(vals[key]))
            object2PathValues(vals[key], options, path).forEach(item => result.push(item)); // result = result.concat(object2PathValues(vals[key], path));
        else
            result.push(commonLib_1.push2array(path, vals[key]));
    });
    if (!result.length)
        return [commonLib_1.push2array(track.slice(), {})]; // empty object
    return result;
}
exports.object2PathValues = object2PathValues;
const objMap = (object, fn, track = []) => commonLib_1.objKeys(object).reduce((result, key) => ((result[key] = fn(object[key], track.concat(key))) || true) && result, commonLib_2.isArray(object) ? [] : {});
exports.objMap = objMap;
const isMapFn = (arg) => commonLib_2.isObject(arg) && arg.$ || commonLib_2.isFunction(arg) && arg._map;
exports.isMapFn = isMapFn;
function normalizeArgs(args, wrapFn) {
    let dataRequest = false;
    args = commonLib_1.toArray(commonLib_2.isUndefined(args) ? [] : args).map((arg) => {
        if (commonLib_2.isString(arg)) {
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
            res = Object.assign({}, arg, res);
            return wrapFn ? wrapFn(res) : res;
        }
        else if (wrapFn && commonLib_2.isMergeable(arg))
            return wrapFn(arg);
        return arg;
    });
    return { dataRequest, args, norm: true };
}
exports.normalizeArgs = normalizeArgs;
function normalizeFn(fn, opts = {}) {
    const { wrapFn } = opts, restOpts = __rest(opts, ["wrapFn"]);
    let nFn = !commonLib_2.isObject(fn) ? Object.assign({ $: fn }, restOpts) : Object.assign({}, fn, restOpts);
    if (nFn.args)
        Object.assign(nFn, normalizeArgs(nFn.args, opts.wrapFn));
    else
        nFn.args = ['${...}'];
    return nFn;
}
exports.normalizeFn = normalizeFn;
function testArray(value) {
    if (commonLib_2.isUndefined(value))
        return [];
    if (!commonLib_2.isArray(value))
        throw new Error('array expected');
    return value;
}
function processProp(nextData, arg) {
    let res = commonLib_1.getIn(nextData, arg);
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
            else if (arg == '${0}')
                resArgs.push(rest[0]);
            else
                resArgs.push(arg);
        }
        return resArgs;
    };
    const nextData = map.dataRequest ? this.getData() : null;
    const prArgs = processArg(map.args);
    const res = commonLib_1.toArray(map.$).reduce((args, fn) => commonLib_2.isFunction(fn) ? (map.noStrictArrayResult ? commonLib_1.toArray : testArray)(fn.apply(this, args)) : args, prArgs);
    return map.noStrictArrayResult ? commonLib_1.deArray(res) : testArray(res)[0];
}
exports.processFn = processFn;


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_react__;

/***/ })

/******/ });
});
//# sourceMappingURL=fform.js.map