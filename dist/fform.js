"use strict";
/** @jsx h */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const react_1 = require("react");
const react_ts_utils_1 = require("react-ts-utils");
const stateLib_1 = require("./stateLib");
const api_1 = require("./api");
const _$cxSym = Symbol('_$cx');
exports._CORES = new WeakMap();
exports._SCHEMAS = new WeakMap();
const _schemasId = new WeakMap();
function fformCores(nameOrProps) {
    return react_ts_utils_1.isString(nameOrProps) ? exports._CORES[nameOrProps] : new api_1.FFormStateAPI(nameOrProps);
}
exports.fformCores = fformCores;
function schemaRegister(schema) {
    let $id = schema.$id || _schemasId.get(schema);
    if (!$id) {
        _schemasId.set(schema, stateLib_1.getUniqKey());
        $id = _schemasId.get(schema);
    }
    exports._SCHEMAS[$id] = schema._schema || schema;
    return $id;
}
exports.schemaRegister = schemaRegister;
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
    reducersFunction[api_1.anSetState] = (state, action) => {
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
class FFormEvent {
    constructor(event, params = {}) {
        const self = this;
        self.type = event;
        self.bubbles = !!params.bubbles;
        self.cancelable = !!params.cancelable;
        self.detail = !!params.detail;
    }
    preventDefault() {
        this.defaultPrevented = true;
    }
}
/////////////////////////////////////////////
//  Main class
/////////////////////////////////////////////
class FForm extends react_1.Component {
    constructor(props, ...args) {
        super(props, ...args);
        this._methods = { onSubmit: null, onChange: null, onStateChange: null };
        this.wrapFns = bindProcessorToThis;
        this.applyCache = () => {
            const self = this;
            let active = self.api.get('/@active');
            if (active) {
                let activeField = self.getRef(active + '@');
                if (activeField) {
                    activeField._updateCachedValue(true);
                    self.api.execute();
                }
            }
        };
        const self = this;
        self.api = self._coreFromParams(props.core);
        Object.defineProperty(self, "elements", { get: () => self.api.props.elements });
        Object.defineProperty(self, "valid", { get: () => self.api.get('/@/status/valid') });
        self.parent = props.parent;
        self._updateMethods(props);
        self._initState(props);
        self._unsubscribe = self.api.addListener(self._handleStateUpdate.bind(self));
        self._setRootRef = self._setRootRef.bind(self);
        self._setFormRef = self._setFormRef.bind(self);
        self._submit = self._submit.bind(self);
        self.reset = self.reset.bind(self);
    }
    _coreFromParams(coreParams) {
        return coreParams instanceof api_1.FFormStateAPI ? coreParams : new api_1.FFormStateAPI(coreParams);
    }
    _initState(props) {
        const self = this;
        const nextProps = Object.assign({}, props);
        if (props.touched !== null)
            nextProps.touched = !!nextProps.touched;
        FForm.params.forEach(k => {
            if (!react_ts_utils_1.isUndefined(nextProps[k]))
                nextProps[k] = (v) => react_ts_utils_1.isUndefined(v) ? props[k] : v;
        });
        if (react_ts_utils_1.isUndefined(nextProps['value']))
            nextProps['value'] = nextProps['initial'];
        self._updateValues(nextProps);
        if (!props.noValidation)
            self.api.validate(true);
    }
    _updateMethods(nextProps, prevProps = {}) {
        const self = this;
        const newMethods = {};
        react_ts_utils_1.objKeys(self._methods).forEach(key => {
            if (prevProps[key] !== nextProps[key])
                newMethods[key] = nextProps[key];
        });
        Object.assign(self._methods, self.wrapFns(react_ts_utils_1.objectResolver(self.elements, newMethods), { noStrictArrayResult: true }));
    }
    _setRootRef(FField) {
        this._root = FField;
    }
    _setFormRef(form) {
        this._form = form;
    }
    _updateValues(nextProps, prevProps = {}) {
        const { state, value, initial, extData, noValidation, touched } = nextProps;
        const self = this;
        if (state && state !== prevProps.state)
            self.api.setState(state);
        if (initial && initial !== prevProps.initial)
            self.api.setValue(initial, { replace: true, initial: true, noValidation });
        if (value && value !== prevProps.value)
            self.api.setValue(value, { replace: true, noValidation });
        if (extData && extData !== prevProps.extData)
            react_ts_utils_1.objKeys(extData).forEach(key => (self.api.set(key, extData[key], { replace: true })));
        if (!react_ts_utils_1.isUndefined(touched) && touched !== null && touched !== prevProps.touched)
            self.api.reset({ status: 'untouched', value: touched ? 0 : undefined });
        FForm.params.forEach(k => (!react_ts_utils_1.isUndefined(nextProps[k]) && nextProps[k] !== prevProps[k] &&
            self.api.switch('/@/params/' + k, nextProps[k])));
    }
    _handleStateUpdate(state) {
        const self = this;
        if (self._savedState == state)
            return;
        self._savedState = state;
        if (self._methods.onStateChange)
            self._methods.onStateChange(self._extendEvent(new FFormEvent('stateChanged')));
        if (state[stateLib_1.SymData].current !== self._savedValue) {
            self._savedValue = state[stateLib_1.SymData].current;
            if (self._methods.onChange)
                self._methods.onChange(self._extendEvent(new FFormEvent('valueChanged')));
        }
        if (self._root)
            self._root.setState({ branch: state });
    }
    _extendEvent(event) {
        const self = this;
        event.value = self.api.getValue();
        event.state = self.api.getState();
        event.fform = self;
        return event;
    }
    _submit(event) {
        const self = this;
        self.applyCache();
        const setSubmitting = (val) => self.api.set([], val, { [stateLib_1.SymData]: ['status', 'submitting'] });
        const setMessagesFromSubmit = (messages = []) => {
            if (react_ts_utils_1.isUndefined(messages))
                return;
            react_ts_utils_1.toArray(messages).forEach(value => {
                if (!value)
                    return;
                let opts = value[stateLib_1.SymData];
                self.api.setMessages(react_ts_utils_1.objKeys(value).length ? value : null, opts);
            });
        };
        self.api.set([], 0, { [stateLib_1.SymData]: ['status', 'untouched'], execute: true, macros: 'switch' });
        self.api.set([], 0, { [stateLib_1.SymData]: ['status', 'unsubmitted'], execute: true, macros: 'switch' });
        if (self._methods.onSubmit) {
            self.api.setMessages(null, { execute: true });
            let result = self._methods.onSubmit(self._extendEvent(event));
            if (result && result.then && typeof result.then === 'function') { //Promise
                setSubmitting(1);
                result.then((messages) => {
                    setSubmitting(0);
                    setMessagesFromSubmit(messages);
                }, (reason) => {
                    setSubmitting(0);
                    setMessagesFromSubmit(reason);
                });
            }
            else
                setMessagesFromSubmit(result);
        }
    }
    shouldComponentUpdate(nextProps) {
        const self = this;
        self.parent = nextProps.parent;
        let FFrormApiUpdate = false;
        let core = self._coreFromParams(nextProps.core);
        if (self.api !== core) {
            self._unsubscribe();
            self.api = core;
            self._unsubscribe = self.api.addListener(self._handleStateUpdate.bind(self));
            FFrormApiUpdate = true;
            self._initState(nextProps);
        }
        else
            self._updateValues(nextProps, self.props);
        self._updateMethods(nextProps, self.props);
        return FFrormApiUpdate || !react_ts_utils_1.isEqual(self.props, nextProps, { skipKeys: ['core', 'state', 'value', 'initial', 'extData', 'fieldCache', 'flatten', 'noValidate', 'parent', 'onSubmit', 'onChange', 'onStateChange'] });
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
    static _getPath() {
        return '#';
    }
    getDataObject(branch, ffield) {
        return react_ts_utils_1.getIn(branch, stateLib_1.SymData);
    }
    getValue(branch, ffield) {
        if (stateLib_1.isSelfManaged(branch))
            return react_ts_utils_1.getIn(branch, stateLib_1.SymData, 'value');
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
        let event = new FFormEvent('submit', { cancelable: true });
        // let e = new Event('submit');
        // this._form.dispatchEvent(e);
        this._submit(event);
        if (!event.defaultPrevented)
            this._form.submit();
    }
    render() {
        const self = this;
        let _a = self.props, { core, state, value, initial, extData, fieldCache, touched, parent, onSubmit, onChange, onStateChange, _$useTag: UseTag = self.elements.widgets.Form || 'form' } = _a, rest = __rest(_a, ["core", "state", "value", "initial", "extData", "fieldCache", "touched", "parent", "onSubmit", "onChange", "onStateChange", "_$useTag"]);
        FForm.params.forEach(k => delete rest[k]);
        react_ts_utils_1.objKeys(rest).forEach(k => (k[0] === '_' || k[0] === '$') && delete rest[k]); // remove props that starts with '_' or '$'
        return (react_1.createElement(UseTag, Object.assign({ ref: self._setFormRef }, rest, { onSubmit: self._submit, onReset: self.reset }),
            react_1.createElement(FField, { ref: self._setRootRef, id: (rest.id || self.api.name) + '/#', name: self.api.name, pFForm: self, getPath: FForm._getPath, FFormApi: self.api })));
    }
}
exports.FForm = FForm;
FForm.params = ['readonly', 'disabled', 'viewer', 'liveValidate', 'liveUpdate'];
class FRefsGeneric extends react_1.Component {
    constructor() {
        super(...arguments);
        this.$refs = {};
        this._setRef = (name) => {
            return (v) => react_ts_utils_1.setIn(this.$refs, v, react_ts_utils_1.isString(name) ? name.split('/') : name);
        };
    }
    getRef(path) {
        const self = this;
        if (!path.length)
            return self;
        if (path.length == 1 && !self.$refs[path[0]].getRef)
            return self.$refs[path[0]];
        return self.$refs[path[0]] && self.$refs[path[0]].getRef && self.$refs[path[0]].getRef(path.slice(1));
    }
    _refProcess($reactRef) {
        const self = this;
        // if ($reactRef === true) return self._setRef(defaultName);
        // else
        if (react_ts_utils_1.isString($reactRef) || react_ts_utils_1.isArray($reactRef))
            return self._setRef($reactRef);
        else if (react_ts_utils_1.isMergeable($reactRef))
            return react_ts_utils_1.objMap($reactRef, self._refProcess.bind(self));
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
        this._uniqKey2key = {};
        this._uniqKey2field = {};
        // private _arrayLayouts: any[] = [];
        this._$wrapper = 'div';
        this._maps = {};
        this._forceLiveUpd = false;
        this._preventLiveUpd = false;
        this._forceUpd = false;
        this.get = null;
        this.wrapFns = bindProcessorToThis;
        this._setWidRef = (key) => (item) => this._widgets[key] = item;
        this._getMappedData = (key) => {
            return () => {
                // console.log(key);
                // let data = this._mappedData[key];
                // if (data[3])
                //   debugger;
                // console.log(this);
                return this._mappedData[key];
            };
        };
        this._getUniqKey = (key, branch = this.state.branch) => react_ts_utils_1.getIn(branch, key, stateLib_1.SymData, 'params', 'uniqKey');
        this._updateWidgets = (oldMapped, newMapped) => {
            const self = this;
            react_ts_utils_1.objKeys(newMapped).forEach(key => self._widgets[key] && newMapped[key] != oldMapped[key] && self._widgets[key]['forceUpdate']());
        };
        const self = this;
        Object.defineProperty(self, "path", { get: () => self.props.getPath() });
        Object.defineProperty(self, "pFForm", { get: () => self.props.pFForm });
        Object.defineProperty(self, "liveValidate", { get: () => react_ts_utils_1.getIn(self.getData(), 'params', 'liveValidate') });
        Object.defineProperty(self, "liveUpdate", { get: () => react_ts_utils_1.getIn(self.getData(), 'params', 'liveUpdate') });
        Object.defineProperty(self, "value", { get: () => self.props.pFForm.getValue(self.state.branch, self) });
        Object.defineProperty(self, "stateApi", { get: () => self.props.pFForm.api });
        Object.defineProperty(self, "_$cx", { get: () => self.props.pFForm.elements._$cx });
        self.state = { branch: self.pFForm.getBranch(self.path) };
        self.$branch = self.state.branch;
        self._updateStateApi(props.pFForm.api);
    }
    getRef(path) {
        path = stateLib_1.normalizePath(path);
        const self = this;
        if (!path.length)
            return self.$refs['@Main'];
        let field = self.$refs[self._getUniqKey(path[0])] || self.$refs[path[0]];
        let restPath = path.slice(1);
        if (restPath.length === 0) {
            if (path[0] === stateLib_1.SymData)
                return self;
            if (field && !(field instanceof FField))
                return field;
        }
        // if (field[0] == '@') return path.length == 1 ? self.$refs[field] : self.$refs[field].getRef(path.slice(1));
        return field && field.getRef && field.getRef(restPath);
    }
    _resolver(value) {
        const self = this;
        try {
            return react_ts_utils_1.objectResolver(self.pFForm.elements, value);
        }
        catch (e) {
            throw self._addErrPath(e);
        }
    }
    _addErrPath(e) {
        e.message = e.message + ', in form \'' + (this.pFForm.props.name || '') + '\', path: \'' + this.path + '\'';
        return e;
    }
    _updateStateApi(stateApi) {
        const self = this;
        if (stateApi) {
            if (!stateApi.wrapper) {
                self.api = stateApi;
                return;
            }
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
    _updateCachedValue(update = (this.liveUpdate || this._forceLiveUpd) && !this._preventLiveUpd) {
        const self = this;
        self._cachedTimeout = undefined;
        if (update && self._cached) {
            console.log('update', self._cached);
            let prevData = self.getData();
            let stateUpd = self.stateApi.setValue(self._cached.value, Object.assign({ noValidation: !self.liveValidate && !self._forceLiveUpd, path: self.path }, self._cached.opts));
            self._forceLiveUpd = false;
            self._cached = undefined;
            (() => __awaiter(this, void 0, void 0, function* () {
                yield stateUpd;
                let data = self.getData();
                //console.log('data', data);
                self._setMappedData(prevData, data, true);
            }))();
        }
    }
    _cacheValue(path, value, fn = 'set', opts = {}) {
        const self = this;
        let fieldCache = self.pFForm.props.fieldCache;
        if (react_ts_utils_1.isUndefined(fieldCache) || fieldCache === true)
            fieldCache = react_ts_utils_1.isNumber(this.liveUpdate) ? this.liveUpdate : 40;
        let valueSet = fn === 'setValue' && (!path || path == './' || path == '.');
        if (!valueSet) {
            let fPath = self.path;
            path = '#/' + stateLib_1.path2string(stateLib_1.normalizePath(path, self.path)) + (fn === 'setValue' ? '/@/value' : '');
            valueSet = (path == fPath + '/@/value') || (path == '#/@/current/' + fPath.slice(2));
        }
        if (valueSet) {
            console.log('valueSet', valueSet);
            let prevData = self.getData();
            self._cached = { value, opts };
            if (fieldCache && !self._forceUpd) {
                if (self._cachedTimeout)
                    clearTimeout(self._cachedTimeout);
                self._cachedTimeout = setTimeout(self._updateCachedValue.bind(self), fieldCache);
                const data = self.getData();
                const oldMappedData = self._mappedData;
                self.get = (...paths) => {
                    let path = stateLib_1.normalizePath(paths, self.path);
                    if (react_ts_utils_1.isEqual(path, stateLib_1.normalizePath('./@value', self.path)))
                        return data.value;
                    return self.stateApi.get(path);
                };
                self._mappedData = self._setMappedData(prevData, data, true);
                self.get = null;
                if (oldMappedData != self._mappedData)
                    self._updateWidgets(oldMappedData, self._mappedData);
            }
            else {
                self._forceUpd = false;
                self._updateCachedValue();
            }
            return true;
        }
        return;
    }
    _build() {
        function makeLayouts_INNER_PROCEDURE(UPDATABLE, fields, opts = {}, layout = []) {
            fields = react_ts_utils_1.toArray(fields);
            react_ts_utils_1.objKeys(fields).forEach(key => {
                let fieldOrLayout = fields[key];
                let blockName;
                if (react_ts_utils_1.isString(fieldOrLayout) && fieldOrLayout[0] === '%') {
                    if (fieldOrLayout[1] === '@') {
                        blockName = fieldOrLayout.substr(2);
                        fieldOrLayout = null;
                        let idx = UPDATABLE.blocks.indexOf(blockName);
                        if (~idx) {
                            fieldOrLayout = restComponents[blockName];
                            UPDATABLE.blocks.splice(idx, 1);
                        }
                        else
                            blockName = null;
                    }
                    else { // if field is string then _makeFField
                        let fieldName = fieldOrLayout.substr(1);
                        let idx = UPDATABLE.keys.indexOf(fieldName);
                        if (~idx) {
                            layout.push(self._makeFField(fieldName, false));
                            self._layoutKeys.add(fieldName);
                            UPDATABLE.keys.splice(idx, 1);
                        }
                        return;
                    }
                }
                if (react_ts_utils_1.isString(fieldOrLayout)) {
                    layout.push(fieldOrLayout);
                }
                else if (react_ts_utils_1.isArray(fieldOrLayout)) {
                    makeLayouts_INNER_PROCEDURE(UPDATABLE, fieldOrLayout, opts, layout);
                }
                else if (react_ts_utils_1.isObject(fieldOrLayout)) { // layout
                    if (react_1.isValidElement(fieldOrLayout))
                        layout.push(fieldOrLayout);
                    else {
                        const counter = UPDATABLE.counter++;
                        let { _$widget, $_fields, opts: newOpts } = normalizeLayout(counter, fieldOrLayout, opts);
                        let section = react_1.createElement(FSectionWidget, { "_$widget": _$widget, "_$cx": self._$cx, key: 'widget_' + counter, ref: self._setWidRef((counter)), getMappedData: self._getMappedData(counter) }, $_fields && makeLayouts_INNER_PROCEDURE(UPDATABLE, $_fields, newOpts));
                        layout.push(section);
                        if (blockName)
                            restComponents[blockName] = section;
                    }
                }
            });
            return layout;
        }
        function normalizeLayout(counter, layout, opts = {}) {
            let { $_maps, rest } = extractMaps(layout, ['children']);
            let { children: $_fields, $_reactRef, _$skipKeys, _$widget, $_setReactRef, className, $defaultWidget } = rest, staticProps = __rest(rest, ["children", "$_reactRef", "_$skipKeys", "_$widget", "$_setReactRef", "className", "$defaultWidget"]);
            $defaultWidget = $defaultWidget || opts.$defaultWidget || 'div';
            _$widget = _$widget || $defaultWidget;
            if ($_fields) {
                if (react_ts_utils_1.isObject($_fields)) {
                    let { _$order = [] } = $_fields, restFields = __rest($_fields, ["_$order"]);
                    $_fields = [];
                    let restKeys = new Set(react_ts_utils_1.objKeys(restFields));
                    _$order.forEach((k) => {
                        if (!react_ts_utils_1.isUndefined(restFields[k]))
                            $_fields.push(restFields[k]);
                        restKeys.delete(k);
                    });
                    [...restKeys].forEach((k) => $_fields.push(restFields[k]));
                }
            }
            staticProps.className = className;
            // if ($_fields) staticProps.children = [];
            let refObject = self._refProcess($_reactRef) || {};
            if (react_ts_utils_1.isFunction(refObject))
                refObject = { 'ref': refObject };
            Object.assign(staticProps, refObject);
            let maps = normalizeMaps($_maps, counter.toString());
            mapsKeys.forEach(k => self._maps[k].push(...maps[k]));
            if ($_setReactRef)
                staticProps[$_setReactRef === true ? '$_setReactRef' : $_setReactRef] = self._setRef;
            self._mappedData[counter] = staticProps;
            return { _$widget, $_fields, opts: { $defaultWidget } };
        }
        const self = this;
        let $branch = self.pFForm.getBranch(self.path);
        self.state = { branch: $branch };
        const data = self.getData();
        const { fData } = data;
        // console.log('self.props.id', self.props.id);
        const schemaPart = self.api.getSchemaPart(self.path);
        self.schemaPart = schemaPart;
        self.arrayStart = stateLib_1.arrayStart(schemaPart);
        if ((react_ts_utils_1.isArray(schemaPart.type) || react_ts_utils_1.isUndefined(schemaPart.type)) && !schemaPart._presets)
            throw new Error('schema._presets should be defined explicitly for multi type');
        let { presets, main: mainPreset } = normailzeSets(schemaPart._presets, schemaPart.type);
        self.mainPreset = mainPreset;
        self.fieldName = self.props.fieldName || '';
        self.simple = stateLib_1.isSelfManaged($branch) ? 'simple' : '';
        let $layout = self.wrapFns(resolveComponents(self.pFForm.elements, schemaPart._layout));
        let resolvedComponents = resolveComponents(self.pFForm.elements, schemaPart._custom, presets);
        resolvedComponents = self.wrapFns(resolvedComponents);
        const mapsKeys = ['build', 'data', 'every'];
        mapsKeys.forEach(k => self._maps[k] = []);
        self.$refs = {};
        self._widgets = {};
        self._mappedData = {};
        self._layoutKeys = new Set();
        self._uniqKey2key = {};
        self._uniqKey2field = {};
        self.restFields = [];
        // self._focusField = focusField || UPDATABLE.keys[0] || '';
        let { Layout, Wrapper } = resolvedComponents, restComponents = __rest(resolvedComponents, ["Layout", "Wrapper"]);
        const UPDATABLE = { keys: stateLib_1.branchKeys($branch), blocks: react_ts_utils_1.objKeys(restComponents), counter: 1 };
        if (react_ts_utils_1.isObject(Layout))
            Layout = react_ts_utils_1.merge(Layout, react_ts_utils_1.isArray($layout) ? { children: $layout } : $layout);
        else
            Layout = react_ts_utils_1.isMergeable($layout) ? react_ts_utils_1.merge(Layout, $layout) : Layout;
        let _layouts = makeLayouts_INNER_PROCEDURE(UPDATABLE, Layout || []);
        let blocks = ['Layout', ...UPDATABLE.blocks];
        makeLayouts_INNER_PROCEDURE(UPDATABLE, UPDATABLE.blocks.map(bl => '%@' + bl));
        restComponents['Layout'] = _layouts;
        UPDATABLE.blocks = blocks;
        self._$wrapper = react_ts_utils_1.deArray(makeLayouts_INNER_PROCEDURE(UPDATABLE, react_ts_utils_1.isArray(Wrapper) ? { children: Wrapper } : Wrapper));
        if (fData.strictLayout !== true) // and here in UPDATABLE.keys we have only keys was not used, we add them to the top layer if strictLayout allows
            UPDATABLE.keys.forEach(fieldName => self.restFields.push(self._makeFField(fieldName)));
        self._mappedData = self._setMappedData(undefined, data, 'build');
        self._rebuild = false;
    }
    _setMappedData(prevData, nextData, updateStage) {
        const self = this;
        let _gData = self.getData;
        self.getData = () => nextData;
        const _mappedData = updateProps(self._mappedData, prevData, nextData, updateStage == 'build' && self._maps.build, updateStage && self._maps.data, self._maps.every);
        self.getData = _gData;
        return _mappedData;
    }
    _makeFField(fieldName, branch) {
        const self = this;
        let uniqKey = self._getUniqKey(fieldName, branch || undefined);
        let uniqName = branch !== false ? (uniqKey || fieldName) : fieldName;
        let type = react_ts_utils_1.getIn(self.getData(branch), 'fData', 'type');
        let field = react_1.createElement(FField, { ref: self._setRef(uniqName), key: uniqName, pFForm: self.pFForm, FFormApi: self.props.FFormApi, fieldName: type === 'object' ? fieldName : undefined, id: self.props.id ? self.props.id + '/' + (uniqKey || fieldName) : undefined, name: self.props.name ? self.props.name + '[' + (type === 'array' ? '${idx}_' + (uniqKey || fieldName) : fieldName) + ']' : undefined, getPath: self._getPath.bind(self, uniqName) });
        if (uniqKey) {
            this._uniqKey2key[uniqName] = fieldName;
            this._uniqKey2field[uniqName] = field;
        }
        return field;
    }
    _getPath(key) {
        return this.path + '/' + (this._uniqKey2key[key] || key);
    }
    getData(branch) {
        const self = this;
        const data = self.pFForm.getDataObject(branch || react_ts_utils_1.getIn(self, 'state', 'branch'), self);
        return self._cached ? react_ts_utils_1.merge(data, { value: self._cached.value }, { replace: { value: self._cached.opts.replace } }) : data;
    }
    // _arrayIndex2key = ($branch: any) => {
    //   return this.props.uniqKey ? getIn(this.getData($branch), string2path(this.props.uniqKey)) : undefined;
    // };
    //
    // _getObjectKeys = ($branch: StateType) => {
    //   const self = this;
    //   let keys: string[] = [];
    //   if (self.props.isArray) for (let i = 0; i < self.props.arrayStart; i++) keys.push(i.toString());
    //   else keys = branchKeys($branch);
    //   return keys;
    // };
    //
    // _getObjectPath(field: string) {
    //   return this.path + '/' + field;
    // }
    //
    // _getArrayField(key: any) {
    //   const self = this;
    //   return self._arrayLayouts[key - self.props.arrayStart]
    // }
    //
    // _reorderArrayLayout(prevBranch: StateType, nextBranch: StateType, props: any) {
    //   const self = this;
    //   const updatedArray = [];
    //   let doUpdate = false;
    //   for (let i = props.arrayStart; i < props.length; i++) {
    //     let arrayKey = self._arrayIndex2key(nextBranch[i]);
    //     if (isUndefined(arrayKey)) throw new Error('no unique key provided for array item');
    //     if (self.$refs[arrayKey]) self.$refs[arrayKey].setState({branch: nextBranch[i]});
    //     let prevIndex = self._arrayKey2field[arrayKey];
    //     if (self._arrayKey2field[arrayKey] !== i) {
    //       self._arrayKey2field[arrayKey] = i;
    //       doUpdate = true
    //     }
    //     updatedArray.push(!isUndefined(prevIndex) ? self._getArrayField(prevIndex) : self._makeFField(i.toString(), arrayKey));
    //   }
    //   if (self._arrayLayouts.length !== updatedArray.length) doUpdate = true;
    //   if (doUpdate) self._arrayLayouts = updatedArray;
    //   return doUpdate;
    // }
    //
    // getRef(path: Path) {
    //   const self = this;
    //   if (!self.props.isArray || isNaN(parseInt(path[0])) || path[0] < self.props.arrayStart) return super.getRef(path);
    //   let field = self._getArrayField(path[0]);
    //   return field && self.$refs[field.key].getRef(path.slice(1))
    // }
    shouldComponentUpdate(nextProps, nextState) {
        const self = this;
        // console.log('nextProps', nextProps);
        // console.log('nextState', nextState);
        if (nextProps.FFormApi !== self.props.FFormApi) {
            self._updateStateApi(nextProps.FFormApi);
            return (self._rebuild = true);
        }
        if (!react_ts_utils_1.isEqual(nextProps, self.props))
            return (self._rebuild = true);
        if (react_ts_utils_1.isUndefined(nextState.branch))
            return true;
        // self.$branch = nextState.branch;
        let prevBranch = self.state.branch;
        let nextBranch = nextState.branch;
        const prevData = self.getData();
        const nextData = self.getData(react_ts_utils_1.getIn(nextState, 'branch'));
        if (react_ts_utils_1.getIn(nextData, 'oneOf') !== react_ts_utils_1.getIn(prevData, 'oneOf'))
            return (self._rebuild = true);
        if (prevData.keys !== nextData.keys) {
            let oldUniq2field = this._uniqKey2field;
            self._uniqKey2key = {};
            self._uniqKey2field = {};
            stateLib_1.branchKeys(nextBranch).forEach(fieldName => {
                if (self._layoutKeys.has(fieldName))
                    return;
                let uniqKey = self._getUniqKey(fieldName, nextBranch);
                if (!uniqKey)
                    return;
                if (self._uniqKey2field[uniqKey]) {
                    self._uniqKey2key[uniqKey] = fieldName;
                    self._uniqKey2field[uniqKey] = oldUniq2field[uniqKey];
                }
                else
                    self._uniqKey2field[uniqKey] = self._makeFField(fieldName, nextBranch);
            });
            let restFields = [];
            nextData.keys.forEach((uniqKey) => {
                if (!self._layoutKeys.has(self._uniqKey2key[uniqKey]))
                    restFields.push(self._uniqKey2field[uniqKey]);
            });
            if (!react_ts_utils_1.isEqual(self.restFields, restFields))
                self.restFields = restFields;
        }
        let newMapped = self._setMappedData(prevData, nextData, nextData !== prevData);
        if (newMapped != self._mappedData) { // update self._widgets
            const oldMapped = self._mappedData;
            self._updateWidgets(oldMapped, self._mappedData = newMapped);
        }
        // update object elements or if it _isArray elements that lower than self.props.arrayStart
        // let keys: any = [...branchKeys(prevBranch), ...branchKeys(nextBranch)];
        // keys = [...(new Map(keys))];
        react_ts_utils_1.objKeys(prevBranch).forEach((fieldName) => {
            let uniqKey;
            if (!self._layoutKeys.has(fieldName)) {
                uniqKey = self._getUniqKey(fieldName, nextBranch);
                if (!uniqKey)
                    uniqKey = self._getUniqKey(fieldName, prevBranch);
            } // console.log('uniqKey', uniqKey);
            if ((nextBranch[fieldName] !== prevBranch[fieldName]) && self.$refs[uniqKey || fieldName])
                self.$refs[uniqKey || fieldName].setState({ branch: nextBranch[fieldName] });
        });
        // try {
        //   updateComponent = self._setMappedData(prevData, nextData, nextData !== prevData) || updateComponent;
        //   updateComponent = updateComponent || getIn(nextData, 'params', 'norender') !== getIn(prevData, 'params', 'norender');
        // } catch (e) {
        //   throw self._addErrPath(e)
        // }
        return false;
    }
    render() {
        const self = this;
        let { state, props } = self;
        if (react_ts_utils_1.isUndefined(state.branch))
            return null;
        if (react_ts_utils_1.getIn(self.getData(), 'params', 'norender'))
            return false;
        if (self._rebuild)
            this._build();
        return self._$wrapper;
        // if (props.viewer) {
        //   let {_$widget = UniversalViewer, ...rest} = props.$_viewerProps || {};
        //   rest.inputProps = props;
        //   rest.value = props.$FField.value;
        //   return h(_$widget, rest)
        // }
        // if (isSelfManaged(props.$branch)) return null;
        // if (self._rebuild) self._build(props); // make rebuild here to avoid addComponentAsRefTo Invariant Violation error https://gist.github.com/jimfb/4faa6cbfb1ef476bd105
        // return <FSectionWidget _$widget={self._$wrapper} _$cx={self._$cx} key={'widget_0'} ref={self._setWidRef(0)}
        //                        getMappedData={self._getMappedData(0)}>{self._layouts}</FSectionWidget>
        // return self._widgets['Builder'] ? h(self._widgets['Builder'], self._mappedData['Builder'], self._mappedData) : null;
        // let data = self.getData();
        // let {length, oneOf, branchKeys, fData} = data;
        // let {type, strictLayout} = fData;
        // let {$branch, id, name} = self.props;
        // return h(FSection, {
        //   length, oneOf, branchKeys, type, isArray: type === 'array', strictLayout, $branch, id, name, $blocks: self._widgets,
        //   $FField: self, FFormApi: self.stateApi, $layout: self._layout, arrayStart: arrayStart(self.schemaPart)
        // })
        //           length: '@/length',
        //           oneOf: '@/oneOf',
        //           branchKeys: '@/branchKeys',
        //           strictLayout: '@/fData/strictLayout',
        //           isArray: {$: '^/fn/equal', args: ['@/fData/type', 'array']},
        //           $branch: {$: '^/fn/getProp', args: '$branch', update: 'every'},
        //           arrayStart: {$: '^/fn/getArrayStart', args: [], update: 'build'},
        //           $FField: {$: '^/fn/getProp', args: [], update: 'build'},
        //           FFormApi: {$: '^/fn/getProp', args: 'props/pFForm/api', update: 'build'},
        //           id: {$: '^/fn/getProp', args: 'props/id', update: 'build'},
        //           name: {$: '^/fn/getProp', args: 'props/name', update: 'build'},
        //           $layout: {$: '^/fn/getProp', args: '_layout', update: 'build'}
    }
}
exports.FField = FField;
/////////////////////////////////////////////
//  Section class
/////////////////////////////////////////////
function RestWidget({ children }) {
    return children || null;
}
const obj2react = react_ts_utils_1.memoize((props, _$cx, key) => {
    if (react_ts_utils_1.isUndefined(props))
        return null;
    // if (props.key == 'option 1')
    //   debugger
    if (!react_ts_utils_1.isObject(props) || react_1.isValidElement(props))
        return props;
    let { _$widget = 'div', children } = props, rest = __rest(props, ["_$widget", "children"]);
    if (props.className)
        props.className = _$cx(props.className);
    if (react_ts_utils_1.isUndefined(rest.key) || rest.key === '')
        rest.key = key;
    if (children)
        children = children.map((v, idx) => obj2react(v, _$cx, idx));
    return react_1.createElement(_$widget, rest, children);
});
class FSectionWidget extends react_1.Component {
    _cn(props) {
        if (!props)
            return props;
        if (props.className && !react_ts_utils_1.isString(props.className)) {
            // if (passCx(this.props._$widget)) return {_$cx: this.props._$cx, ...props};
            return Object.assign(Object.assign({}, props), { className: this.props._$cx(props.className) });
        }
        return props;
    }
    render() {
        const props = this._cn(this.props.getMappedData());
        let { children, _$cx } = this.props;
        if (props.children) {
            children = [...(children || [])];
            react_ts_utils_1.objKeys(props.children).forEach(k => {
                if (!react_1.isValidElement(children[k])) {
                    if (react_ts_utils_1.isMergeable(props.children[k]))
                        children[k] = react_ts_utils_1.merge(children[k], props.children[k]);
                    else
                        children[k] = props.children[k];
                }
            });
        }
        if (this.props._$widget == 'option')
            debugger;
        // console.log(this.props._$widget);
        // console.log('props', props);
        // let children = this.props.children && (this.props.children as any).length ? this.props.children : undefined
        return react_1.createElement(this.props._$widget, props, children && children.map((v, idx) => obj2react(v, _$cx, idx)));
    }
}
// class FSection extends FRefsGeneric {
//   private _arrayStart: number = 0;
//   private _rebuild = true;
//   private _focusField: string = '';
//   private _arrayKey2field: { [key: string]: number } = {};
//   private _widgets: { [key: string]: any } = {};
//   private _objectLayouts: any[] = [];
//   private _arrayLayouts: any[] = [];
//   private _setWidRef: any;
//   private _maps: NPM4WidgetsType = {};
//   private _mappedData: { [key: string]: any } = {};
//   private _$widget: any;
//   private _isArray: boolean = false;
//
//   constructor(props: any, context: any) {
//     super(props, context);
//     const self = this;
//     self._setWidRef = (key: number | string) => (item: any) => self._widgets[key] = item;
//   }
//
//   _getMappedData(key: number) {
//     const self = this;
//     return () => self._mappedData[key]
//   }
//
//
//   _build(props: any) {
//
//     function makeLayouts_INNER_PROCEDURE(UPDATABLE: { counter: number, keys: string[] }, fields: Array<string | FFLayoutGeneric<jsFFCustomizeType>>, layout: any[] = []) {
//       objKeys(fields).forEach(key => {
//         let fieldOrLayout = fields[key];
//         const {keys, counter} = UPDATABLE;
//         if (isString(fieldOrLayout)) { // if field is string then _makeFField
//           let idx = UPDATABLE.keys.indexOf(fieldOrLayout);
//           if (~idx) {
//             layout.push(self._makeFField(fieldOrLayout));
//             UPDATABLE.keys.splice(idx, 1);
//           }
//         } else if (isArray(fieldOrLayout)) {
//           makeLayouts_INNER_PROCEDURE(UPDATABLE, fieldOrLayout, layout);
//         } else if (isObject(fieldOrLayout)) { // layout
//           const counter = UPDATABLE.counter++;
//           let {_$widget, $_fields} = normalizeLayout(counter, fieldOrLayout as FFLayoutGeneric<jsFFCustomizeType>);
//           layout.push(<FSectionWidget _$widget={_$widget} _$cx={_$cx} key={'widget_' + counter} ref={self._setWidRef((counter))}
//                                       getMappedData={self._getMappedData(counter)}>{$_fields && makeLayouts_INNER_PROCEDURE(UPDATABLE, $_fields)}</FSectionWidget>)
//         }
//       });
//       return layout
//     }
//
//     function normalizeLayout(counter: number, layout: FFLayoutGeneric<jsFFCustomizeType>) {
//       let {$_maps, rest} = extractMaps(layout, ['$_fields']);
//       // rest = self.props.$FField.wrapFns(rest, ['$_maps']);
//       let {$_fields, $_reactRef, _$skipKeys, _$widget = LayoutDefaultWidget, className, ...staticProps} = rest;
//       if ($_fields || !counter) className = merge(LayoutDefaultClass, className);
//       staticProps.className = className;
//       let refObject = self._refProcess($_reactRef) || {};
//       if (isFunction(refObject)) refObject = {'ref': refObject};
//       Object.assign(staticProps, refObject);
//       let maps = normalizeMaps($_maps, counter.toString());
//       mapsKeys.forEach(k => self._maps[k].push(...maps[k]));
//       self._mappedData[counter] = staticProps;
//       return {_$widget, $_fields}
//     }
//
//     const self = this;
//
//     const {$branch, $layout, _$cx, arrayStart, strictLayout, LayoutDefaultWidget = 'div', LayoutDefaultClass = {}, uniqKey, focusField} = props;
//
//     const mapsKeys = ['build', 'data', 'every'];
//     mapsKeys.forEach(k => self._maps[k] = []);
//     self.$refs = {};
//     self._widgets = {};
//     self._mappedData = {};
//     self._objectLayouts = [];
//
//     const UPDATABLE = {keys: self._getObjectKeys($branch), counter: 1};
//     self._focusField = focusField || UPDATABLE.keys[0] || '';
//
//     let {_$widget, $_fields} = normalizeLayout(0, isArray($layout) ? {$_fields: $layout} : $layout);
//     self._$widget = _$widget;
//
//     if ($_fields)// make initial _objectLayouts, every key that was used in makeLayouts call removed from UPDATABLE.keys
//       self._objectLayouts = makeLayouts_INNER_PROCEDURE(UPDATABLE, $_fields);
//     if (strictLayout !== true)// and here in UPDATABLE.keys we have only keys was not used, we add them to the top layer if strictLayout allows
//       UPDATABLE.keys.forEach(fieldName => self._objectLayouts.push(self._makeFField(fieldName)));
//
//     self._arrayLayouts = [];
//     self._arrayKey2field = {};
//     if (self.props.isArray) {  // _makeArrayLayouts
//       for (let i = arrayStart; i < self.props.length; i++) {
//         let arrayKey = self._arrayIndex2key($branch[i]);
//         self._arrayLayouts.push(self._makeFField(i.toString(), arrayKey));
//         arrayKey && (self._arrayKey2field[arrayKey] = i);
//       }
//     }
//     self._mappedData = self._updateMappedData(undefined, self._getData($branch), 'build');
//     self._rebuild = false;
//   }
//
//   _makeFField(fieldName: string, arrayKey?: string) {
//     const self = this;
//     return <FField ref={self._setRef(arrayKey || fieldName)} key={arrayKey || fieldName} pFForm={self.props.$FField.pFForm} FFormApi={self.props.FFormApi}
//                    id={self.props.id ? self.props.id + '/' + (arrayKey || fieldName) : undefined}
//                    name={self.props.name ? self.props.name + '[' + (self.props.isArray ? '${idx}_' + (arrayKey || fieldName) : fieldName) + ']' : undefined}
//                    getPath={arrayKey ? self._getArrayPath.bind(self, arrayKey) : self._getObjectPath.bind(self, fieldName)}/>;
//   }
//
//   _arrayIndex2key($branch: any) {
//     return this.props.uniqKey ? getIn(this._getData($branch), string2path(this.props.uniqKey)) : undefined;
//   }
//
//   _getObjectKeys($branch: StateType) {
//     const self = this;
//     let keys: string[] = [];
//     if (self.props.isArray) for (let i = 0; i < self.props.arrayStart; i++) keys.push(i.toString());
//     else keys = branchKeys($branch);
//     return keys;
//   }
//
//   _getObjectPath(field: string) {
//     return this.props.$FField.path + '/' + field;
//   }
//
//   _getArrayPath(key: string) {
//     return this.props.$FField.path + '/' + this._arrayKey2field[key];
//   }
//
//   _getArrayField(key: any) {
//     const self = this;
//     return self._arrayLayouts[key - self.props.arrayStart]
//   }
//
//   _reorderArrayLayout(prevBranch: StateType, nextBranch: StateType, props: any) {
//     const self = this;
//     const updatedArray = [];
//     let doUpdate = false;
//     for (let i = props.arrayStart; i < props.length; i++) {
//       let arrayKey = self._arrayIndex2key(nextBranch[i]);
//       if (isUndefined(arrayKey)) throw new Error('no unique key provided for array item');
//       if (self.$refs[arrayKey]) self.$refs[arrayKey].setState({branch: nextBranch[i]});
//       let prevIndex = self._arrayKey2field[arrayKey];
//       if (self._arrayKey2field[arrayKey] !== i) {
//         self._arrayKey2field[arrayKey] = i;
//         doUpdate = true
//       }
//       updatedArray.push(!isUndefined(prevIndex) ? self._getArrayField(prevIndex) : self._makeFField(i.toString(), arrayKey));
//     }
//     if (self._arrayLayouts.length !== updatedArray.length) doUpdate = true;
//     if (doUpdate) self._arrayLayouts = updatedArray;
//     return doUpdate;
//   }
//
//   _updateMappedData(prevData: any, nextData: any, fullUpdate: boolean | 'build' = prevData !== nextData) {
//     const self = this;
//     return updateProps(self._mappedData, prevData, nextData, fullUpdate == 'build' && self._maps.build, fullUpdate && self._maps.data, self._maps.every);
//   }
//
//   _getData(branch = this.props.$branch) {
//     return this.props.$FField.getData(branch)
//   }
//
//   shouldComponentUpdate(nextProps: any) {
//     const self = this;
//     if (['FFormApi', 'oneOf', 'branchKeys'].some(comparePropsFn(self.props, nextProps)))
//       return self._rebuild = true;
//
//     let doUpdate = !isEqual(nextProps, self.props, {skipKeys: ['$branch']});
//
//     let prevBranch = self.props.$branch;
//     let nextBranch = nextProps.$branch;
//
//     if (prevBranch != nextBranch) {
//       let newMapped: any;
//       try {
//         newMapped = self._updateMappedData(self._getData(prevBranch), self._getData(nextBranch));
//       } catch (e) {
//         throw self.props.$FField._addErrPath(e)
//       }
//
//       if (newMapped != self._mappedData) { // update self._widgets
//         const oldMapped = self._mappedData;
//         self._mappedData = newMapped;
//         objKeys(newMapped).forEach(key => self._widgets[key] && newMapped[key] != oldMapped[key] && self._widgets[key]['forceUpdate']());
//       }
//       // update object elements or if it _isArray elements that lower than self.props.arrayStart
//       self._getObjectKeys(nextBranch).forEach(field => (nextBranch[field] !== prevBranch[field]) && self.$refs[field] && self.$refs[field].setState({branch: nextBranch[field]}));
//
//       if (self.props.isArray) doUpdate = self._reorderArrayLayout(prevBranch, nextBranch, nextProps) || doUpdate; // updates and reorders elements greater/equal than self.props.arrayStart
//
//     }
//
//     return doUpdate; //|| !isEqual(self.props, nextProps, {skipKeys: ['$branch']});
//   }
//
//   getRef(path: Path) {
//     const self = this;
//     if (!self.props.isArray || isNaN(parseInt(path[0])) || path[0] < self.props.arrayStart) return super.getRef(path);
//     let field = self._getArrayField(path[0]);
//     return field && self.$refs[field.key].getRef(path.slice(1))
//   }
//
//   render() {
//     const self = this;
//     let props = self.props;
//     // try {
//     if (props.viewer) {
//       let {_$widget = UniversalViewer, ...rest} = props.$_viewerProps || {};
//       rest.inputProps = props;
//       rest.value = props.$FField.value;
//       return h(_$widget, rest)
//     }
//     // if (isSelfManaged(props.$branch)) return null;
//     if (self._rebuild) self._build(props); // make rebuild here to avoid addComponentAsRefTo Invariant Violation error https://gist.github.com/jimfb/4faa6cbfb1ef476bd105
//     return <FSectionWidget _$widget={self._$widget} _$cx={props._$cx} key={'widget_0'} ref={self._setWidRef((0))}
//                            getMappedData={self._getMappedData(0)}>{self._objectLayouts}{self._arrayLayouts}</FSectionWidget>
//     // } catch (e) {
//     //   throw self.props.$FField._addErrPath(e)
//     // }
//   }
// }
/////////////////////////////////////////////
//  Basic components
/////////////////////////////////////////////
// class GenericWidget extends FRefsGeneric {
//   private _children: any;
//   private _reactRef: any;
//   protected _mapped: any[];
//
//   constructor(props: any, context: any) {
//     super(props, context);
//   }
//
//   private _newWidget(key: any, obj: any, passedReactRef: anyObject = {}) {
//     const {_$widget: Widget = GenericWidget, className, $_reactRef, ...rest} = obj;
//     const self = this;
//     let refObject = self._refProcess($_reactRef) || {};
//     if (isFunction(refObject)) refObject = {ref: refObject};
//     if (isFunction(passedReactRef)) refObject.ref = passedReactRef;
//     else Object.assign(refObject, passedReactRef);
//     // console.log('className', className);
//     if (typeof className == "string") debugger;
//     return <Widget key={key}
//                    className={(!passCx(Widget) && this.props._$cx) ? this.props._$cx(className) : className}
//                    _$cx={passCx(Widget) ? this.props._$cx : undefined} {...rest} {...refObject}/>
//   }
//
//   protected _mapChildren(children: any, $_reactRef: anyObject) {
//     const self = this;
//     if (children !== self._children || self._reactRef !== $_reactRef) {
//       const prev = self._children && toArray(self._children);
//       const next = children && toArray(children);
//       self._mapped = next && next.map((ch: any, i: number) => (!isObject(ch) || ch.$$typeof) ? ch :
//         ((!self._mapped ||
//           !getIn(self._mapped, i) ||
//           prev[i] !== next[i] ||
//           getIn(self._reactRef, i) !== getIn($_reactRef, i)) ? self._newWidget(i, ch, getIn($_reactRef, i)) :
//           self._mapped[i]));
//       self._children = children;
//       self._reactRef = $_reactRef
//     }
//   }
//
//   protected setRef2rest(rest: anyObject, $_reactRef: anyObject) {
//     if (!$_reactRef) return rest;
//     objKeys($_reactRef).filter(v => isNaN(+v)).forEach(k => rest[k] = $_reactRef[k]); // assing all except numeric keys, as then assigned at _mapChildren
//     return rest;
//   }
//
//   protected setElements2rest(rest: anyObject, _$elements: any) {
//     if (!_$elements) return rest;
//     let elms = {'^': _$elements};
//     objKeys(rest).forEach(k => isElemRef(rest[k]) && (rest[k] = getIn(elms, string2path(rest[k]))));
//     return rest
//   }
//
//   render(): any {
//     const self = this;
//     if (self.props.norender) return null;
//     let {_$useTag: UseTag = 'div', _$cx, _$elements, className, $_reactRef, children, ...rest} = self.props;
//     self._mapChildren(children, $_reactRef);
//     self.setRef2rest(rest, $_reactRef);
//     self.setElements2rest(rest, _$elements);
//     if (!_$cx && _$elements) _$cx = _$elements._$cx;
//     return (<UseTag children={self._mapped} className={_$cx ? _$cx(className) : className} {...rest} />)
//   }
// }
function isEmpty(value) {
    return react_ts_utils_1.isMergeable(value) ? react_ts_utils_1.objKeys(value).length === 0 : value === undefined || value === null || value === "";
}
function toString(emptyMock, enumExten = {}, value) {
    if (isEmpty(value))
        return emptyMock;
    if (react_ts_utils_1.isArray(value))
        return value.map(toString.bind(null, emptyMock, enumExten)).join(', ');
    value = getExten(enumExten, value).label || value;
    if (!react_ts_utils_1.isString(value))
        return JSON.stringify(value);
    return value;
}
function UniversalViewer(props) {
    let { _$useTag: UseTag = 'div', value, inputProps, _$cx, enumExten = {}, emptyMock = '(none)' } = props, rest = __rest(props, ["_$useTag", "value", "inputProps", "_$cx", "enumExten", "emptyMock"]);
    if (rest.className && _$cx)
        rest.className = _$cx(rest.className);
    return react_1.createElement(UseTag, rest, toString(emptyMock, enumExten, value));
}
const UniversalInput = react_1.forwardRef(function (props, ref) {
    if (props.viewer) {
        let _a = props.$_viewerProps || {}, { _$widget = UniversalViewer } = _a, rest = __rest(_a, ["_$widget"]);
        rest.inputProps = props;
        rest.value = props.value;
        return react_1.createElement(_$widget, rest);
    }
    let { _$useTag, type, viewer, $_viewerProps } = props, rest = __rest(props, ["_$useTag", "type", "viewer", "$_viewerProps"]);
    // if (!_$cx && _$elements) _$cx = _$elements._$cx;
    rest.ref = ref;
    if (_$useTag) {
        rest.type = type;
    }
    else {
        if (type == 'textarea' || type == 'select')
            _$useTag = type;
        else {
            _$useTag = 'input';
            rest.type = type;
        }
    }
    // if (_$passCx) rest._$cx = _$cx;
    // if (rest.className && _$cx) rest.className = _$cx(rest.className);
    return react_1.createElement(_$useTag, rest);
});
// class Autowidth extends Component<any, any> {
//   static readonly sizerStyle: any = {position: 'absolute', top: 0, left: 0, visibility: 'hidden', height: 0, overflow: 'scroll', whiteSpace: 'pre'};
//   private _elem: any;
//
//   componentDidMount() {
//     let style: any;
//     try {
//       style = window && window.getComputedStyle(this.props.$FField.$refs['@Main']);
//     } catch (e) {
//
//     }
//     if (!style || !this._elem) return;
//     ['fontSize', 'fontFamily', 'fontWeight', 'fontStyle', 'letterSpacing'].forEach(key => this._elem.style[key] = style[key]);
//   }
//
//   render() {
//     const self = this;
//     const props = self.props;
//     const value = (isUndefined(props.value) || props.value === null ? '' : props.value.toString()) || props.placeholder || '';
//     return (<div style={Autowidth.sizerStyle as any} ref={(elem) => {
//       (self._elem = elem) &&
//       props.$FField &&
//       props.$FField.$refs['@Main'] &&
//       props.$FField.$refs['@Main'].style &&
//       (props.$FField.$refs['@Main'].style.width = Math.max((elem as any).scrollWidth + (props.addWidth || 45), props.minWidth || 0) + 'px')
//     }}>{value}</div>)
//   }
// }
//
//
// function FBuilder(props: any) {
//   let {children: mapped, widgets} = props;
//   const {Title, Body, Main, Message, Wrapper, Autowidth} = widgets;
//
//   mapped = deArray(mapped);
//   return Wrapper ? h(Wrapper, mapped['Wrapper'],
//     Title ? h(Title, mapped['Title']) : '',
//     Body ? h(Body, mapped['Body'],
//       Main ? h(Main, mapped['Main']) : '',
//       Message ? h(Message, mapped['Message']) : '',
//       Autowidth ? h(Autowidth, mapped['Autowidth']) : ''
//     ) : ''
//   ) : ''
// }
//
//
// function Wrapper(props: any) {
//   let {_$useTag: WrapperW = 'div', _$cx = classNames, className, wrapperClassName = {}, ArrayItemMenu, ArrayItemBody, arrayItem, ...rest} = props;
//   let {_$widget: IBodyW = 'div', className: IBodyCN = {}, ...IBodyRest} = ArrayItemBody || {};
//   let {_$widget: IMenuW = 'div', className: IMenuCN = {}, ...IMenuRest} = ArrayItemMenu || {};
//   if (!arrayItem) wrapperClassName = [wrapperClassName, className];
//   else IBodyCN = [IBodyCN, className];
//
//   const result = <WrapperW className={_$cx ? _$cx(wrapperClassName) : wrapperClassName} {...rest} />;
//   if (arrayItem) {
//     return (
//       <IBodyW className={_$cx ? _$cx(IBodyCN) : IBodyCN} {...IBodyRest}>
//         {result}
//         <IMenuW className={_$cx && _$cx(IMenuCN)} {...IMenuRest}/>
//       </IBodyW>
//     )
//   } else return result
// }
function ItemMenu(props) {
    const { _$cx, disabled, buttonsProps = {}, arrayItem, buttons = [], onClick: defaultOnClick } = props, _$buttonDefaults = __rest(props, ["_$cx", "disabled", "buttonsProps", "arrayItem", "buttons", "onClick"]);
    if (!arrayItem)
        return null;
    return (buttons.map((key) => {
        let _a = Object.assign({}, _$buttonDefaults, buttonsProps[key] || {}), { _$widget: ButW = 'button', type = 'button', disabledCheck = '', className: ButCN = {}, onClick = defaultOnClick, title = key, children = key } = _a, restBut = __rest(_a, ["_$widget", "type", "disabledCheck", "className", "onClick", "title", "children"]);
        if (!restBut.dangerouslySetInnerHTML)
            restBut.children = children;
        return (react_1.createElement(ButW, Object.assign({ key: key, type: type, title: title, className: _$cx ? _$cx(ButCN) : ButCN }, restBut, { disabled: disabled || disabledCheck && !arrayItem[disabledCheck], onClick: () => onClick(key) })));
    }));
}
const CheckboxNull = react_1.forwardRef((props, ref) => {
    let { checked, onChange, nullValue = null, type } = props, rest = __rest(props, ["checked", "onChange", "nullValue", "type"]);
    return react_1.createElement("input", Object.assign({ type: "checkbox", checked: checked === true }, rest, { onChange: (event) => {
            onChange((checked === nullValue ? true : (checked === true ? false : nullValue)), event);
        }, ref: elem => {
            ref && ref(elem);
            elem && (elem.indeterminate = (checked === nullValue));
        } }));
});
///////////////////////////////
//     Functions
///////////////////////////////
function bindProcessorToThis(val, opts = {}) {
    const self = this;
    const bindedFn = bindProcessorToThis.bind(self);
    if (react_ts_utils_1.isFunction(val))
        val = { $: val };
    if (stateLib_1.isMapFn(val)) {
        const map = val.norm ? val : stateLib_1.normalizeFn(val, Object.assign(Object.assign({}, opts), { wrapFn: bindedFn }));
        const fn = stateLib_1.processFn.bind(self, map);
        fn._map = map;
        return fn;
    }
    else if (react_ts_utils_1.isMergeable(val)) {
        const result = react_ts_utils_1.isArray(val) ? [] : {};
        react_ts_utils_1.objKeys(val).forEach(key => result[key] = !react_ts_utils_1.skipKey(key, val) ? bindedFn(val[key], opts) : val[key]); //!~ignore.indexOf(key) &&
        return result;
    }
    return val;
}
// function passCx(Widget: any) {
//   return Widget instanceof GenericWidget
// }
function normailzeSets(sets = '', type) {
    if (!react_ts_utils_1.isString(type))
        type = '';
    let presets = sets.split(':');
    let main = '';
    let rest = [];
    for (let i = 0; i < presets.length; i++) {
        if (presets[i][0] !== '$')
            main = main || presets[i];
        else
            rest.push(presets[i]);
    }
    return { presets: [main || type].concat(rest).join(':'), main: main || type };
}
const resolveComponents = react_ts_utils_1.memoize((elements, customizeFields, sets) => {
    if (sets) {
        let $_ref = sets.split(':')
            .map(v => (v = v.trim()) && (v[0] != '^' ? '^/sets/' + v : v))
            .join(':') + ':' + ((customizeFields && customizeFields.$_ref) || '');
        customizeFields = react_ts_utils_1.merge(customizeFields, { $_ref });
    }
    return react_ts_utils_1.objectResolver(elements, customizeFields);
});
function extractMaps(obj, skip = []) {
    let { $_maps } = obj, rest2extract = __rest(obj, ["$_maps"]);
    $_maps = Object.assign({}, $_maps);
    const rest = react_ts_utils_1.isArray(obj) ? [] : {};
    react_ts_utils_1.objKeys(rest2extract).forEach(key => {
        if (react_ts_utils_1.isMergeable(rest2extract[key]) && !~skip.indexOf(key)) {
            let res = extractMaps(rest2extract[key], skip);
            rest[key] = res.rest;
            react_ts_utils_1.objKeys(res.$_maps).forEach((nk) => $_maps[key + '/' + nk] = res.$_maps[nk]);
        }
        else
            rest[key] = rest2extract[key];
    });
    return { $_maps, rest };
}
exports.extractMaps = extractMaps;
function normalizeMaps($_maps, prePath = '') {
    const result = { data: [], every: [], build: [] };
    react_ts_utils_1.objKeys($_maps).forEach(key => {
        let value = $_maps[key];
        if (!value)
            return;
        const to = stateLib_1.multiplePath(stateLib_1.normalizePath((prePath ? prePath + '/' : '') + key));
        if (react_ts_utils_1.isFunction(value) || react_ts_utils_1.isArray(value)) {
            react_ts_utils_1.toArray(value).forEach((fn) => {
                const _a = fn._map, { update = 'data', replace = true } = _a, rest = __rest(_a, ["update", "replace"]);
                //fn._map = {update, replace, to, ...rest};
                result[update].push(Object.assign(Object.assign({ update, replace }, rest), { to, $: fn }));
            });
        }
        else {
            if (react_ts_utils_1.isString(value))
                value = { args: value };
            value = Object.assign(Object.assign({}, value), stateLib_1.normalizeArgs(value.args));
            let { args, update = 'data', replace = true } = value, rest = __rest(value, ["args", "update", "replace"]);
            result.data.push(Object.assign({ args: args[0], update, replace, to, dataRequest: true }, rest));
        }
    });
    return result;
}
exports.normalizeMaps = normalizeMaps;
function updateProps(mappedData, prevData, nextData, ...iterMaps) {
    const needUpdate = (map) => react_ts_utils_1.isUndefined(prevData) || !map.$ ||
        (map.dataRequest && map.args.some(arg => {
            if (stateLib_1.isNPath(arg))
                return react_ts_utils_1.getIn(prevData, arg) !== react_ts_utils_1.getIn(nextData, arg);
            if (stateLib_1.isMapFn(arg))
                return needUpdate(arg._map || arg);
            return false;
        })); //isFunction(map.args[0])
    const dataUpdates = { update: {}, replace: {}, api: {} };
    iterMaps.forEach(maps => maps && maps.forEach(map => {
        if (map.update == 'data' && !needUpdate(map))
            return;
        const value = map.$ ? map.$() : stateLib_1.processProp(nextData, map.args);
        react_ts_utils_1.objKeys(map.to).forEach(k => stateLib_1.setUPDATABLE(dataUpdates, value, map.replace, map.to[k]));
        if (!map.replace)
            mappedData = stateLib_1.mergeUPD_PROC(mappedData, dataUpdates);
    }));
    return stateLib_1.mergeUPD_PROC(mappedData, dataUpdates);
}
exports.updateProps = updateProps;
const getExten = (enumExten, value) => {
    let res = react_ts_utils_1.isFunction(enumExten) ? enumExten(value) : react_ts_utils_1.getIn(enumExten, value);
    if (res && react_ts_utils_1.isString(res))
        res = { label: res };
    return react_ts_utils_1.isObject(res) ? res : {};
};
exports.getExten = getExten;
function comparePropsFn(prevProps, nextProps, opts = {}) {
    if (opts.equal)
        return (key) => prevProps[key] === nextProps[key];
    else
        return (key) => prevProps[key] !== nextProps[key];
}
exports.comparePropsFn = comparePropsFn;
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
        else if (react_ts_utils_1.isArray(arg)) {
            classes.push(classNames.apply(this, arg));
        }
        else if (argType === 'object') {
            react_ts_utils_1.objKeys(arg).forEach(key => {
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
exports.classNames = classNames;
/////////////////////////////////////////////
//  elements
/////////////////////////////////////////////
const toKebabCase = (str) => str &&
    str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map((x) => x.toLowerCase())
        .join('-');
let elementsBase = {
    extend(elements, opts) {
        let res = react_ts_utils_1.merge.all(this, elements, opts);
        if (this['_$cx.bind'] !== res['_$cx.bind'])
            res = react_ts_utils_1.merge(res, { '_$cx': res['_$cx.bind'] ? this[_$cxSym].bind(res['_$cx.bind']) : this[_$cxSym] });
        return res;
    },
    // types: ['string', 'integer', 'number', 'object', 'array', 'boolean', 'null'],
    widgets: {
        // Section: FSection,
        // Generic: GenericWidget,
        // Builder: FBuilder,
        // Wrapper,
        Input: UniversalInput,
        Rest: RestWidget,
        ItemMenu,
        Checkbox: react_ts_utils_1.Checkbox,
        CheckboxNull,
        Checkboxes: react_ts_utils_1.Checkboxes
    },
    sets: {
        'base': {
            Wrapper: {
                children: ['%@Title', '%@Layout', '%@Main', '%@Message'],
                $_maps: {
                    'className/fform-hidden': '@/params/hidden',
                },
                $_reactRef: '@Wrapper',
            },
            Title: {
                _$widget: 'label',
                children: [],
                $_maps: {
                    'className/fform-required': '@/fData/required',
                    'children/0': '@/fData/title',
                    'className/fform-hidden': { $: '^/fn/not', args: '@/fData/title' },
                    htmlFor: { $: '^/fn/getProp', args: ['props/id'], update: 'build' },
                    'className/fform-title-viewer': '@/params/viewer'
                }
            },
            Main: {},
            Message: { $_ref: '^/parts/Message' }
        },
        simple: {
            $_ref: '^/sets/base',
            Main: {
                _$widget: '^/widgets/Input',
                $_reactRef: '@Main',
                // _$cx: '^/_$cx',
                $_viewerProps: { _$cx: '^/_$cx', emptyMock: '(no value)', className: { 'fform-viewer': true } },
                onChange: { $: '^/fn/eventValue|setValue' },
                onBlur: { $: '^/fn/blur' },
                onFocus: { $: '^/fn/focus' },
                $_maps: {
                    // priority: '@/status/priority',
                    value: '@value',
                    viewer: '@/params/viewer',
                    autoFocus: '@/params/autofocus',
                    readOnly: '@/params/readonly',
                    disabled: '@/params/disabled',
                    placeholder: '@/fData/placeholder',
                    required: '@/fData/required',
                    label: '@/fData/title',
                    '$_viewerProps/enumExten': '@/fData/enumExten',
                    id: { $: '^/fn/getProp', args: 'props/id', update: 'build' },
                    name: { $: '^/fn/getProp', args: 'props/name', update: 'build' },
                    'className/fform-input-priority': { $: '^/fn/setInputPriority', args: '@/status/priority' }
                }
            },
        },
        string: {
            $_ref: '^/sets/simple',
            Main: { type: 'text' }
        },
        textarea: {
            $_ref: '^/sets/simple',
            Main: { type: 'textarea', $_viewerProps: { className: { 'fform-viewer': false, 'fform-viewer-inverted': true } } },
            Title: {
                $_maps: {
                    'className/fform-title-viewer-inverted': '@/params/viewer'
                }
            }
        },
        integer: {
            $_ref: '^/sets/simple',
            Main: {
                type: 'number',
                onChange: { $: '^/fn/eventValue|prepareNumber|parse|preventEmptyLiveUpd|setValue' },
                onBlur: "^/fn/setZeroIfEmpty|blur"
            }
        },
        integerNull: {
            $_ref: '^/sets/integer',
            Main: {
                onChange: { $: '^/fn/eventValue|prepareNumber|parse|empty2null|setValue' },
                onBlur: "^/fn/blur",
                $_maps: {
                    value: { $: '^/fn/null2empty', args: ['@value'] }
                }
            }
        },
        number: {
            $_ref: '^/sets/integer',
            Main: { step: 'any' }
        },
        numberNull: {
            $_ref: '^/sets/integerNull',
            Main: { step: 'any' }
        },
        'null': { $_ref: '^/sets/simple', Main: false },
        boolean: {
            $_ref: '^/sets/simple',
            Main: {
                type: 'checkbox',
                _$useTag: "^/widgets/Checkbox",
                _$cx: '^/_$cx',
                onChange: { $: '^/fn/eventChecked|setValue|liveUpdate' },
                $_maps: {
                    placeholder: false,
                    value: false,
                    label: '@/fData/placeholder',
                    checked: '@value'
                }
            },
        },
        booleanNull: {
            $_ref: '^/sets/boolean',
            Main: {
                $extend: { 'input': { "_$tag": '^/widgets/CheckboxNull' } },
                onChange: { $: '^/fn/parseTristate|setValue|liveUpdate', args: ['${0}'] },
            },
        },
        booleanLeft: { $_ref: '^/sets/boolean' },
        booleanNullLeft: { $_ref: '^/sets/booleanNull' },
        object: {
            $_ref: '^/sets/base',
            Layout: {
                className: { 'fform-layout': true }
            },
            Main: {
                _$widget: '^/widgets/Rest',
                $_maps: {
                    children: { $: '^/fn/getProp', args: 'restFields', update: 'every' }
                }
                // _$cx: '^/_$cx',
                // $_reactRef: '@Main',
                // uniqKey: 'params/uniqKey',
                // LayoutDefaultClass: 'layout',
                // LayoutDefaultWidget: 'div',
                // $_viewerProps: {$_ref: '^/sets/simple/Main/$_viewerProps'},
                // $_maps: {
                //   length: '@/length',
                //   oneOf: '@/oneOf',
                //   branchKeys: '@/branchKeys',
                //   strictLayout: '@/fData/strictLayout',
                //   isArray: {$: '^/fn/equal', args: ['@/fData/type', 'array']},
                //   $branch: {$: '^/fn/getProp', args: '$branch', update: 'every'},
                //   arrayStart: {$: '^/fn/getArrayStart', args: [], update: 'build'},
                //   $FField: {$: '^/fn/getProp', args: [], update: 'build'},
                //   FFormApi: {$: '^/fn/getProp', args: 'props/pFForm/api', update: 'build'},
                //   id: {$: '^/fn/getProp', args: 'props/id', update: 'build'},
                //   name: {$: '^/fn/getProp', args: 'props/name', update: 'build'},
                //   $layout: {$: '^/fn/getProp', args: '_layout', update: 'build'}
                // }
            },
        },
        array: { $_ref: '^/sets/object' },
        select: {
            $_ref: '^/sets/simple',
            Main: {
                type: 'select',
                children: [],
                onChange: { $: '^/fn/eventValue|setValue|liveUpdate' },
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
                onChange: { $: '^/fn/eventMultiple|setValue|liveUpdate' }
            }
        },
        radio: {
            $_ref: '^/sets/base',
            Main: {
                $_ref: '^/parts/RadioSelector',
                $_reactRef: '@Main',
                $_setReactRef: '$setRef',
                $prefixRefName: '@enum/',
                $_viewerProps: { $_ref: '^/sets/simple/Main/$_viewerProps' },
                staticProps: { onChange: { args: ['${0}'] } },
                $_maps: {
                    value: '@/value',
                    viewer: '@/params/viewer',
                    $enum: '@/fData/enum',
                    $enumExten: '@/fData/enumExten',
                }
            }
        },
        checkboxes: {
            $_ref: '^/sets/radio',
            Main: {
                type: 'checkbox',
                staticProps: {
                    onChange: { $: '^/fn/eventCheckboxes|setValue|liveUpdate' }
                }
            }
        },
        $radioParse: {
            Main: { staticProps: { onChange: { $: '^/fn/eventValue|parse|setValue|liveUpdate' } } }
        },
        $checkboxesParse: {
            Main: { staticProps: { onChange: { $: '^/fn/eventCheckboxes|parse|setValue|liveUpdate' } } }
        },
        $radioNull: { Main: { $staticProps: { onClick: '^/fn/eventValue|radioClear|liveUpdate' } } },
        $radioEmpty: { Main: { $staticProps: { onClick: { $: '^/fn/eventValue|radioClear|liveUpdate', args: ['${0}', ''] } } } },
        // $autowidth: {
        //   Autowidth: {$_ref: '^/parts/Autowidth'},
        //   Wrapper: {className: {'fform-shrink': true}},
        // },
        $inlineItems: { Main: { className: { 'fform-inline': true } } },
        $inlineLayout: { Layout: { className: { 'fform-inline': true } } },
        // $inlineTitle: {Wrapper: {wrapperClassName: {'fform-inline': true}}},
        // $inlineArrayControls: {Wrapper: {ArrayItemBody: {className: {'fform-inline': true}}}},
        // $arrayControls3but: {Wrapper: {ArrayItemMenu: {buttons: ['up', 'down', 'del'],}}},
        // $arrayControlsDelOnly: {Wrapper: {ArrayItemMenu: {buttons: ['del'],}}},
        $noTitle: { Title: false },
        $noMessage: { Message: false },
        $shrink: { Wrapper: { className: { 'fform-shrink': true } } },
        $expand: { Wrapper: { className: { 'fform-expand': true } } },
        $password: { Main: { type: 'password' } },
        $: '^/$',
        $C: '^/$C',
        $S: '^/$S',
    },
    fn: {
        api(fn, ...args) { this.api[fn](...args); },
        format(str, ...args) {
            return [args.reduce((str, val, i) => str.replace('{' + i + '}', val), str)];
        },
        iif: (iif, trueVal, falseVaL, ...args) => [iif ? trueVal : falseVaL, ...args],
        not: (v, ...args) => [!v, ...args],
        equal: (a, ...args) => [args.some(b => a === b)],
        equalAll: (a, ...args) => [args.every(b => a === b)],
        or: (...args) => [args.some(Boolean)],
        and: (...args) => [args.every(Boolean)],
        getArrayStart(...args) { return [stateLib_1.arrayStart(this.schemaPart), ...args]; },
        getProp(key, ...args) { return [react_ts_utils_1.getIn(this, stateLib_1.normalizePath(key)), ...args]; },
        getClassNameByProp(prefix, key, ...args) {
            let value = react_ts_utils_1.getIn(this, stateLib_1.normalizePath(key));
            if (value)
                return [{ [prefix + toKebabCase(value)]: true }, ...args];
            else
                return [{}, ...args];
        },
        formPropExec(e, fnName) {
            if (react_ts_utils_1.isObject(e)) {
                this.pFForm.applyCache();
                e.fform = this.pFForm;
                e.value = this.pFForm.api.getValue();
            }
            let fn = react_ts_utils_1.getIn(this.pFForm, 'props', fnName);
            if (react_ts_utils_1.isFunction(fn))
                fn.call(this, e);
            else
                throw new Error(`Prop '${fnName}' is not a function.`);
        },
        eventValue: (event, ...args) => [
            event.target.value, ...args
        ],
        eventChecked: (event, ...args) => [event.target.checked, ...args],
        parseTristate: (value, ...args) => [value === "" ? null : value, ...args],
        prepareNumber(value, ...args) {
            if (react_ts_utils_1.isString(value)) {
                value = value.replace(/^(-?)0+(?=\d)/, "$1")
                    .replace("-.", "-0.")
                    .replace(/^\./, "0.");
            }
            return [value, ...args];
        },
        parse(value, ...args) {
            try {
                value = react_ts_utils_1.isArray(value) ? value.map(v => JSON.parse(v)) : JSON.parse(value);
            }
            catch (e) {
            }
            return [value, ...args];
        },
        eventMultiple: (event, ...args) => [Array.from(event.target.options).filter((o) => o.selected).map((v) => v.value), ...args],
        null2empty(value, ...args) {
            return [value == null ? '' : value, ...args];
        },
        empty2null(value, ...args) {
            return [value === '' ? null : value, ...args];
        },
        preventEmptyLiveUpd(...args) {
            this._preventLiveUpd = (args[0] === '');
            return args;
        },
        setZeroIfEmpty(event, ...args) {
            if (event.target.value === "")
                this.api.setValue(0);
            return [event, ...args];
        },
        stringify(value, ...args) {
            if (!react_ts_utils_1.isString(value))
                value = JSON.stringify(value);
            return [value, ...args];
        },
        setValue(value, opts = {}, ...args) {
            console.log('value', value);
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
            this._forceLiveUpd = true;
            return args;
        },
        forceUpdate(...args) {
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
        messages(messages, staticProps = {}, { _$cx }) {
            const { className: cnSP = {} } = staticProps, restSP = __rest(staticProps, ["className"]);
            return [react_ts_utils_1.objKeys(messages || []).map(priority => {
                    const _a = messages[priority], { norender, texts, className = {} } = _a, rest = __rest(_a, ["norender", "texts", "className"]);
                    const children = [];
                    react_ts_utils_1.objKeys(texts).forEach((key) => react_ts_utils_1.toArray(texts[key]).forEach((v, i, arr) => {
                        if (react_ts_utils_1.isElemRef(v))
                            v = this._resolver(v);
                        (react_ts_utils_1.isString(v) && react_ts_utils_1.isString(children[children.length - 1])) ? children.push({ _$widget: 'br' }, v) : children.push(v);
                    }));
                    if (norender || !children.length)
                        return null;
                    return Object.assign(Object.assign(Object.assign({ children }, restSP), { className: _$cx(Object.assign(Object.assign({ ['fform-message-priority-' + priority]: true }, cnSP), className)) }), rest);
                })];
        },
        arrayOfEnum(enumVals = [], enumExten = {}, staticProps = {}, name) {
            return [enumVals.map(val => {
                    let extenProps = getExten(enumExten, val);
                    return Object.assign(Object.assign(Object.assign({ key: val, children: [extenProps.label || val], name: name && (this.name + (name === true ? '' : name)) }, extenProps), staticProps), { value: val });
                })];
        },
        setInputPriority(priority) {
            if (typeof priority == 'number')
                return ['fform-input-priority-' + priority];
            else
                return [false];
        }
    },
    parts: {
        Message: {
            // _$widget: '^/widgets/Generic',
            // _$cx: '^/_$cx',
            children: [],
            $_maps: {
                children: { $: '^/fn/messages', args: ['@/messages', {}, { _$cx: '^/_$cx' }] },
                'className/fform-hidden': { $: '^/fn/or', args: ['@/params/viewer', '!@/status/touched'] },
            }
        },
        RadioSelector: {
            _$widget: '^/widgets/Input',
            _$useTag: '^/widgets/Checkboxes',
            _$cx: '^/_$cx',
            // _$passCx: true,
            staticProps: {
                type: 'radio',
                onChange: { $: '^/fn/eventValue|setValue|liveUpdate', args: ['${0}', { path: './@/selector/value' }] },
                onBlur: '^/sets/simple/Main/onBlur',
                onFocus: '^/sets/simple/Main/onFocus',
                _$tag: '^/widgets/Checkbox',
            },
            $_maps: {
                value: '@/selector/value',
                $enum: '@/selector/enum',
                $enumExten: '@/selector/enumExten',
                name: { $: '^/fn/getProp', args: 'props/name', update: 'build' },
                "staticProps/readOnly": '@/params/readonly',
                "staticProps/disabled": '@/params/disabled',
            }
        },
        // Autowidth: {
        //   _$widget: '^/widgets/Autowidth',
        //   addWidth: 35,
        //   minWidth: 60,
        //   $_maps: {
        //     value: 'value',
        //     placeholder: '@/params/placeholder',
        //     'className/fform-hidden': '@/params/hidden',
        //     $FField: {$: '^/fn/getProp', args: [], update: 'build'},
        //   }
        // },
        Button: {
            _$widget: 'button',
            type: 'button',
            $_maps: {
                'className/fform-hidden': '@/params/viewer',
                disabled: '@/params/disabled',
            }
        },
        Submit: {
            $_ref: '^/parts/Button',
            type: 'submit',
            children: ['Submit'],
            $_maps: {
                disabled: { $: '^/fn/or', args: ['@/status/submitting', '@/params/disabled'] },
            }
        },
        Reset: {
            $_ref: '^/parts/Button',
            type: 'reset',
            children: ['Reset'],
            $_maps: {
                disabled: '@/status/pristine',
            }
        },
        ArrayAddButton: {
            $_ref: '^/parts/Button',
            children: ['+'],
            onClick: { $: '^/fn/api', args: ['arrayAdd', './', 1] },
            $_maps: {
                'className/fform-hidden': { $: '^/fn/or', args: ['@/params/viewer', { $: '^/fn/equal | ^/fn/not', args: ['@/fData/type', 'array'] }] },
                'disabled': { $: '^/fn/or', args: ['!@/fData/canAdd', '@params/disabled'] }
            }
        },
        ArrayDelButton: {
            $_ref: '^/parts/ArrayAddButton',
            children: ['-'],
            onClick: { args: { 2: -1 } },
            $_maps: {
                'disabled': { $: '^/fn/or', args: ['!@/length', '@params/disabled'] }
            }
        },
        ArrayEmpty: {
            children: '(array is empty)',
            _$widget: 'span',
            $_maps: { 'className/fform-hidden': { $: '^/fn/equal | ^/fn/not', args: ['@/length', 0] } }
        },
        ArrayItemMenu: {
            _$widget: '^/widgets/ItemMenu',
            _$cx: '^/_$cx',
            $_ref: '^/parts/Button',
            buttons: ['first', 'last', 'up', 'down', 'del'],
            onClick: { $: '^/fn/api', args: ['arrayItemOps', './', '${0}'] },
            buttonsProps: {
                first: { disabledCheck: 'canUp' },
                last: { disabledCheck: 'canDown' },
                up: { disabledCheck: 'canUp' },
                down: { disabledCheck: 'canDown' },
                del: { disabledCheck: 'canDel' },
            },
            $_maps: { arrayItem: '@/arrayItem' },
        },
        Expander: { _$widget: 'div', className: { 'fform-expand': true } }
    },
    _$cx: classNames,
    [_$cxSym]: classNames,
    $form: (elems, rest) => {
        return { $: "^/fn/formPropExec", args: ["${0}", ...rest] };
    },
    $: (elems, path) => {
        let pathVal = path.map((v) => {
            v = elems['_$shorts'][v] || v;
            if (react_ts_utils_1.isString(v) && v.length == 2) {
                let el0 = elems['_$shorts'][v[0]];
                let el1 = elems['_$shorts'][v[1]];
                if (el0 && el1) {
                    if (react_ts_utils_1.isArray(el1))
                        v = el1.map((k) => el0 + k);
                    else
                        v = el0 + el1;
                }
                return react_ts_utils_1.toArray(v).join(',');
            }
            return v;
        });
        let pathes = stateLib_1.multiplePath(pathVal);
        let res = {};
        react_ts_utils_1.objKeys(pathes).forEach(key => react_ts_utils_1.setIn(res, pathes[key].pop(), pathes[key]));
        return res;
    },
    $C: (elems, path) => {
        path = path.slice();
        let className = path.pop();
        let value = !(className[0] === '!');
        if (!value)
            className = className.substr(1);
        react_ts_utils_1.push2array(path, 'className', className, value);
        return elems.$(elems, path);
    },
    $S: (elems, path) => {
        path = path.slice();
        let style = [];
        style.unshift(path.pop());
        style.unshift(path.pop());
        react_ts_utils_1.push2array(path, 'style', style);
        return elems.$(elems, path);
    },
    $selector: (elems, path) => {
        let nm = path[0];
        return {
            staticProps: {
                onChange: { args: ['${0}', { path: `@/${nm}/value` }] },
            },
            $_maps: {
                value: `@/${nm}/value`,
                $enum: `@/${nm}/enum`,
                $enumExten: `@/${nm}/enumExten`
            }
        };
    },
    _$shorts: {
        'W': 'Wrapper',
        'M': 'Main',
        'T': 'Title',
        'MSG': 'Message',
        'm': 'margin',
        'p': 'padding',
        't': 'Top',
        'b': 'Bottom',
        'l': 'Left',
        'r': 'Right',
        'x': ['Left', 'Right'],
        'y': ['Top', 'Bottom'],
        'fg': 'flexGrow',
        'fs': 'flexShirnk',
        'fd': 'flexDirection',
        'fw': 'flexWrap',
        'fb': 'flexBasis',
        'minW': 'minWidth',
        'minH': 'minHeight',
        'maxW': 'maxWidth',
        'maxH': 'maxHeight',
        'as': 'alignSelf',
        'ai': 'alignItems',
        'jc': 'justifyContent'
    }
};
exports.elements = elementsBase;
//# sourceMappingURL=fform.js.map