"use strict";
/** @jsx h */
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
//const React = require('preact');
const commonLib_1 = require("./commonLib");
const stateLib_1 = require("./stateLib");
const api_1 = require("./api");
exports.FFormStateAPI = api_1.FFormStateAPI;
exports.fformCores = api_1.fformCores;
exports.formReducer = api_1.formReducer;
const _$cxSym = Symbol('_$cx');
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
        return coreParams instanceof api_1.FFormStateAPI ? coreParams : api_1.fformCores(coreParams.name) || new api_1.FFormStateAPI(coreParams);
    }
    _initState(props) {
        const self = this;
        const nextProps = Object.assign({}, props);
        if (props.touched !== null)
            nextProps.touched = !!nextProps.touched;
        FForm.params.forEach(k => {
            if (!commonLib_1.isUndefined(nextProps[k]))
                nextProps[k] = (v) => commonLib_1.isUndefined(v) ? props[k] : v;
        });
        if (commonLib_1.isUndefined(nextProps['value']))
            nextProps['value'] = nextProps['inital'];
        self._updateValues(nextProps);
        if (!props.noValidation)
            self.api.validate(true);
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
        let active = self.api.get('/@active');
        if (active) {
            let activeField = self.getRef(active + '@');
            if (activeField) {
                activeField._updateCachedValue(true);
                self.api.execute();
            }
        }
        const setPending = (val) => self.api.set([], val, { [stateLib_1.SymData]: ['status', 'pending'] });
        const setMessagesFromSubmit = (messages = []) => {
            if (commonLib_1.isUndefined(messages))
                return;
            commonLib_1.toArray(messages).forEach(value => {
                if (!value)
                    return;
                let opts = value[stateLib_1.SymData];
                self.api.setMessages(commonLib_1.objKeys(value).length ? value : null, opts);
            });
        };
        self.api.set([], 0, { [stateLib_1.SymData]: ['status', 'untouched'], execute: true, macros: 'switch' });
        if (self._methods.onSubmit) {
            self.api.setMessages(null, { execute: true });
            let result = self._methods.onSubmit(self._extendEvent(event));
            if (result && result.then && typeof result.then === 'function') { //Promise
                setPending(1);
                result.then((messages) => {
                    setPending(0);
                    setMessagesFromSubmit(messages);
                }, (reason) => {
                    setPending(0);
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
    static _getPath() {
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
        let event = new FFormEvent('submit', { cancelable: true });
        // let e = new Event('submit');
        // this._form.dispatchEvent(e);
        this._submit(event);
        if (!event.defaultPrevented)
            this._form.submit();
    }
    render() {
        const self = this;
        let _a = self.props, { core, state, value, inital, extData, fieldCache, touched, parent, onSubmit, onChange, onStateChange, _$useTag: UseTag = self.elements.widgets.Form || 'form' } = _a, rest = __rest(_a, ["core", "state", "value", "inital", "extData", "fieldCache", "touched", "parent", "onSubmit", "onChange", "onStateChange", "_$useTag"]);
        FForm.params.forEach(k => delete rest[k]);
        commonLib_1.objKeys(rest).forEach(k => (k[0] === '_' || k[0] === '$') && delete rest[k]); // remove props that starts with '_' or '$'
        return (react_1.createElement(UseTag, Object.assign({ ref: self._setFormRef }, rest, { onSubmit: self._submit, onReset: self.reset }),
            react_1.createElement(FField, { ref: self._setRootRef, id: (rest.id || self.api.name) + '/#', name: self.api.name, pFForm: self, getPath: FForm._getPath, FFormApi: self.api })));
    }
}
exports.FForm = FForm;
FForm.params = ['readonly', 'disabled', 'viewer', 'liveValidate', 'liveUpdate'];
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
        // private _enumOptions: any;
        // private _isNotSelfManaged: boolean | undefined;
        this._blocks = [];
        this._maps = {};
        this._forceLiveUpd = false;
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
    _resolver(value) {
        const self = this;
        try {
            return api_1.objectResolver(self.pFForm.elements, value);
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
    _updateCachedValue(update = this.liveUpdate || this._forceLiveUpd) {
        const self = this;
        self._cachedTimeout = undefined;
        if (update && self._cached) {
            self.stateApi.setValue(self._cached.value, Object.assign({ noValidation: !self.liveValidate && !self._forceLiveUpd, path: self.path }, self._cached.opts));
            self._forceLiveUpd = false;
            self._cached = undefined;
        }
    }
    _cacheValue(path, value, fn = 'set', opts = {}) {
        //if (path === null) return;
        const self = this;
        let fieldCache = self.pFForm.props.fieldCache;
        if (commonLib_1.isUndefined(fieldCache) || fieldCache === true)
            fieldCache = commonLib_1.isNumber(this.liveUpdate) ? this.liveUpdate : 40;
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
            if (fieldCache && !self._forceUpd) {
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
            else {
                self._forceUpd = false;
                self._updateCachedValue();
            }
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
        // self._isNotSelfManaged = !isSelfManaged(self.state.branch) || undefined;
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
            const _a = components[block], { _$widget, $_reactRef, _$skipKeys } = _a, staticProps = __rest(_a, ["_$widget", "$_reactRef", "_$skipKeys"]);
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
        //try {
        if (commonLib_1.isUndefined(self.state.branch))
            return null;
        if (commonLib_1.getIn(self.getData(), 'params', 'norender'))
            return false;
        if (self._rebuild)
            this._build();
        return self._widgets['Builder'] ? react_1.createElement(self._widgets['Builder'], self._mappedData['Builder'], self._mappedData) : null;
        // } catch (e) {
        //   throw self._addErrPath(e)
        // }
    }
}
exports.FField = FField;
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
                return Object.assign(Object.assign({}, props), { className: this.props._$cx(props.className) });
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
        self._setWidRef = (key) => (item) => self._widgets[key] = item;
    }
    _getMappedData(key) {
        const self = this;
        return () => self._mappedData[key];
    }
    _build(props) {
        function makeLayouts_INNER_PROCEDURE(UPDATABLE, fields) {
            const layout = [];
            commonLib_1.objKeys(fields).forEach(key => {
                let fieldOrLayout = fields[key];
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
            let { $_fields, $_reactRef, _$skipKeys, _$widget = LayoutDefaultWidget, className } = rest, staticProps = __rest(rest, ["$_fields", "$_reactRef", "_$skipKeys", "_$widget", "className"]);
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
        const { $branch, $layout, _$cx, arrayStart, strictLayout, LayoutDefaultWidget = 'div', LayoutDefaultClass = {}, uniqKey, focusField } = props;
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
        if ($_fields) // we make inital _objectLayouts, every key that was used in makeLayouts call removed from UPDATABLE.keys 
            self._objectLayouts = makeLayouts_INNER_PROCEDURE(UPDATABLE, $_fields);
        if (strictLayout !== true) // and here in UPDATABLE.keys we have only keys was not used, we add them to the top layer if strictLayout allows
            UPDATABLE.keys.forEach(fieldName => self._objectLayouts.push(self._makeFField(fieldName)));
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
        return react_1.createElement(FField, { ref: self._setRef(arrayKey || fieldName), key: arrayKey || fieldName, pFForm: self.props.$FField.pFForm, FFormApi: self.props.FFormApi, id: self.props.id ? self.props.id + '/' + (arrayKey || fieldName) : undefined, name: self.props.name ? self.props.name + '[' + (self.props.isArray ? '${idx}_' + (arrayKey || fieldName) : fieldName) + ']' : undefined, getPath: arrayKey ? self._getArrayPath.bind(self, arrayKey) : self._getObjectPath.bind(self, fieldName) });
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
        if (['FFormApi', 'oneOf', 'branchKeys'].some(comparePropsFn(self.props, nextProps)))
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
        // try {
        if (props.viewer) {
            let _a = props.$_viewerProps || {}, { _$widget = UniversalViewer } = _a, rest = __rest(_a, ["_$widget"]);
            rest.inputProps = props;
            rest.value = props.$FField.value;
            return react_1.createElement(_$widget, rest);
        }
        // if (isSelfManaged(props.$branch)) return null;
        if (self._rebuild)
            self._build(props); // make rebuild here to avoid addComponentAsRefTo Invariant Violation error https://gist.github.com/jimfb/4faa6cbfb1ef476bd105
        return react_1.createElement(FSectionWidget, { "_$widget": self._$widget, "_$cx": props._$cx, key: 'widget_0', ref: self._setWidRef((0)), getMappedData: self._getMappedData(0) },
            self._objectLayouts,
            self._arrayLayouts);
        // } catch (e) {
        //   throw self.props.$FField._addErrPath(e)
        // }
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
        // console.log('className', className);
        if (typeof className == "string")
            debugger;
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
        commonLib_1.objKeys($_reactRef).filter(v => isNaN(+v)).forEach(k => rest[k] = $_reactRef[k]); // assing all except numeric keys, as then assigned at _mapChildren
        return rest;
    }
    setElements2rest(rest, _$elements) {
        if (!_$elements)
            return rest;
        let elms = { '^': _$elements };
        commonLib_1.objKeys(rest).forEach(k => stateLib_1.isElemRef(rest[k]) && (rest[k] = commonLib_1.getIn(elms, stateLib_1.string2path(rest[k]))));
        return rest;
    }
    render() {
        const self = this;
        if (self.props.norender)
            return null;
        let _a = self.props, { _$useTag: UseTag = 'div', _$cx, _$elements, className, $_reactRef, children } = _a, rest = __rest(_a, ["_$useTag", "_$cx", "_$elements", "className", "$_reactRef", "children"]);
        self._mapChildren(children, $_reactRef);
        self.setRef2rest(rest, $_reactRef);
        self.setElements2rest(rest, _$elements);
        if (!_$cx && _$elements)
            _$cx = _$elements._$cx;
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
            let _a = props.$_viewerProps || {}, { _$widget = UniversalViewer } = _a, rest = __rest(_a, ["_$widget"]);
            rest.inputProps = props;
            rest.value = props.value;
            return react_1.createElement(_$widget, rest);
        }
        let { value, _$useTag: UseTag, type, $_reactRef, _$cx, _$elements, viewer, $_viewerProps, children } = props, rest = __rest(props, ["value", "_$useTag", "type", "$_reactRef", "_$cx", "_$elements", "viewer", "$_viewerProps", "children"]);
        self._mapChildren(children, $_reactRef);
        self.setRef2rest(rest, $_reactRef);
        self.setElements2rest(rest, _$elements);
        if (!_$cx && _$elements)
            _$cx = _$elements._$cx;
        if (UseTag) {
            rest.type = type;
        }
        else {
            if (type == 'textarea' || type == 'select')
                UseTag = type;
            else {
                UseTag = 'input';
                rest.type = type;
            }
        }
        rest[type === 'checkbox' ? 'checked' : 'value'] = value;
        if (rest.className && _$cx)
            rest.className = _$cx(rest.className);
        //console.log(rest.value);
        return react_1.createElement(UseTag, rest, self._mapped);
    }
}
class Autowidth extends react_1.Component {
    componentDidMount() {
        let style;
        try {
            style = window && window.getComputedStyle(this.props.$FField.$refs['@Main']);
        }
        catch (e) {
        }
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
                    props.$FField.$refs['@Main'].style &&
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
    let { _$useTag: WrapperW = 'div', _$cx = classNames, className, wrapperClassName = {}, ArrayItemMenu, ArrayItemBody, arrayItem } = props, rest = __rest(props, ["_$useTag", "_$cx", "className", "wrapperClassName", "ArrayItemMenu", "ArrayItemBody", "arrayItem"]);
    let _a = ArrayItemBody || {}, { _$widget: IBodyW = 'div', className: IBodyCN = {} } = _a, IBodyRest = __rest(_a, ["_$widget", "className"]);
    let _b = ArrayItemMenu || {}, { _$widget: IMenuW = 'div', className: IMenuCN = {} } = _b, IMenuRest = __rest(_b, ["_$widget", "className"]);
    if (!arrayItem)
        wrapperClassName = [wrapperClassName, className];
    else
        IBodyCN = [IBodyCN, className];
    const result = react_1.createElement(WrapperW, Object.assign({ className: _$cx ? _$cx(wrapperClassName) : wrapperClassName }, rest));
    if (arrayItem) {
        return (react_1.createElement(IBodyW, Object.assign({ className: _$cx ? _$cx(IBodyCN) : IBodyCN }, IBodyRest),
            result,
            react_1.createElement(IMenuW, Object.assign({ className: _$cx && _$cx(IMenuCN) }, IMenuRest))));
    }
    else
        return result;
}
function ItemMenu(props) {
    const { _$useTag: UseTag = 'div', _$buttonDefaults = {}, _$cx, disabled, className, buttonsProps = {}, arrayItem, buttons = [], onClick: defaultOnClick } = props, rest = __rest(props, ["_$useTag", "_$buttonDefaults", "_$cx", "disabled", "className", "buttonsProps", "arrayItem", "buttons", "onClick"]);
    if (!arrayItem)
        return null;
    // console.log(arrayItem)
    buttons.forEach((key) => delete rest[key]);
    return (react_1.createElement(UseTag, Object.assign({ className: _$cx(className) }, rest), buttons.map((key) => {
        let _a = Object.assign({}, _$buttonDefaults, buttonsProps[key] || {}), { _$widget: ButW = 'button', type = 'button', disabledCheck = '', className: ButCN = {}, onClick = defaultOnClick, title = key, children = key } = _a, restBut = __rest(_a, ["_$widget", "type", "disabledCheck", "className", "onClick", "title", "children"]);
        if (!restBut.dangerouslySetInnerHTML)
            restBut.children = children;
        return (react_1.createElement(ButW, Object.assign({ key: key, type: type, title: title, className: _$cx ? _$cx(ButCN) : ButCN }, restBut, { disabled: disabled || disabledCheck && !arrayItem[disabledCheck], onClick: () => onClick(key) })));
    })));
}
const Checkbox = react_1.forwardRef((_a, ref) => {
    var { $tags = {}, $props = {}, children, placeholder, role = 'checkbox', type = "checkbox", className = "" } = _a, rest = __rest(_a, ["$tags", "$props", "children", "placeholder", "role", "type", "className"]);
    rest.ref = ref;
    rest.type = type;
    rest.key = "input";
    rest.role = "input";
    if ($props['input'])
        Object.assign(rest, $props['input']);
    return (react_1.createElement($tags['parent'] || 'label', Object.assign({ className, role }, $props['parent'] || {}), [
        react_1.createElement($tags['input'] || 'input', rest),
        react_1.createElement($tags['label'] || 'span', Object.assign({ key: "label", role: "label" }, $props['label'] || {}), placeholder)
    ]));
});
const CheckboxNull = react_1.forwardRef((props, ref) => {
    const self = this;
    let { checked, onChange, nullValue = "", type } = props, rest = __rest(props, ["checked", "onChange", "nullValue", "type"]);
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
    if (commonLib_1.isFunction(val))
        val = { $: val };
    if (stateLib_1.isMapFn(val)) {
        const map = val.norm ? val : stateLib_1.normalizeFn(val, Object.assign(Object.assign({}, opts), { wrapFn: bindedFn }));
        const fn = stateLib_1.processFn.bind(self, map);
        fn._map = map;
        return fn;
    }
    else if (commonLib_1.isMergeable(val)) {
        const result = commonLib_1.isArray(val) ? [] : {};
        commonLib_1.objKeys(val).forEach(key => result[key] = !api_1.skipKey(key, val) ? bindedFn(val[key], opts) : val[key]); //!~ignore.indexOf(key) &&
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
        const to = stateLib_1.multiplePath(stateLib_1.normalizePath((prePath ? prePath + '/' : '') + key));
        if (commonLib_1.isFunction(value) || commonLib_1.isArray(value)) {
            commonLib_1.toArray(value).forEach((fn) => {
                const _a = fn._map, { update = 'data', replace = true } = _a, rest = __rest(_a, ["update", "replace"]);
                //fn._map = {update, replace, to, ...rest};
                result[update].push(Object.assign(Object.assign({ update, replace }, rest), { to, $: fn }));
            });
        }
        else {
            if (commonLib_1.isString(value))
                value = { args: value };
            value = Object.assign(Object.assign({}, value), stateLib_1.normalizeArgs(value.args));
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
exports.classNames = classNames;
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
        let res = commonLib_1.merge.all(this, elements, opts);
        if (this['_$cx.bind'] !== res['_$cx.bind'])
            res = commonLib_1.merge(res, { '_$cx': res['_$cx.bind'] ? this[_$cxSym].bind(res['_$cx.bind']) : this[_$cxSym] });
        return res;
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
        Checkbox: Checkbox,
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
                    'className/fform-hidden': '@/params/hidden',
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
                className: 'fform-body',
            },
            //Main: {},
            Message: { $_ref: '^/parts/Message' }
        },
        simple: {
            $_ref: '^/sets/base',
            Main: {
                _$widget: '^/widgets/Input',
                _$cx: '^/_$cx',
                $_reactRef: { ref: true },
                $_viewerProps: { _$cx: '^/_$cx', emptyMock: '(no value)', className: { 'fform-viewer': true } },
                onChange: { $: '^/fn/eventValue|setValue' },
                onBlur: { $: '^/fn/blur' },
                onFocus: { $: '^/fn/focus' },
                $_maps: {
                    // priority: '@/status/priority',
                    value: { $: '^/fn/iif', args: [{ $: '^/fn/equal', args: ['@value', null] }, '', '@value'] },
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
            Title: {
                _$widget: '^/widgets/Generic',
                _$cx: '^/_$cx',
                _$useTag: 'label',
                children: [],
                $_maps: {
                    'className/fform-required': '@/fData/required',
                    'children/0': '@/fData/title',
                    'className/fform-hidden': { $: '^/fn/not', args: '@/fData/title' },
                    htmlFor: { $: '^/fn/getProp', args: ['id'], update: 'build' },
                    'className/fform-title-viewer': '@/params/viewer'
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
                onChange: { $: '^/fn/eventValue|parseNumber|setValue', args: ['${0}', true, 0] },
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
                _$useTag: "^/widgets/Checkbox",
                onChange: { $: '^/fn/eventChecked|setValue|liveUpdate' }
            },
        },
        booleanNull: {
            $_ref: '^/sets/boolean',
            Main: {
                $tags: { 'input': '^/widgets/CheckboxNull', _$skipKeys: ['input'] },
                onChange: { $: '^/fn/parseTristate|setValue|liveUpdate', args: ['${0}'] },
            },
        },
        booleanLeft: { $_ref: '^/sets/boolean' },
        booleanNullLeft: { $_ref: '^/sets/booleanNull' },
        object: {
            $_ref: '^/sets/base',
            Main: {
                _$widget: '^/widgets/Section',
                _$cx: '^/_$cx',
                $_reactRef: true,
                uniqKey: 'params/uniqKey',
                LayoutDefaultClass: 'layout',
                LayoutDefaultWidget: 'div',
                $_viewerProps: { $_ref: '^/sets/simple/Main/$_viewerProps' },
                $_maps: {
                    length: '@/length',
                    oneOf: '@/oneOf',
                    branchKeys: '@/branchKeys',
                    strictLayout: '@/fData/strictLayout',
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
            Title: { $_ref: '^/sets/simple/Title' },
            Main: {
                $_ref: '^/parts/RadioSelector',
                $_reactRef: true,
                $_viewerProps: { $_ref: '^/sets/simple/Main/$_viewerProps' },
                $_maps: {
                    value: '@/value',
                    viewer: '@/params/viewer',
                    children: [
                        {
                            args: [
                                '@/fData/enum',
                                '@/fData/enumExten',
                                { onChange: { args: ['${0}'] } },
                                { name: true }
                            ],
                        },
                        { args: ['@/fData/enum', '@/value'] },
                        { args: { 0: '@/fData/enum' } },
                    ]
                }
            }
        },
        checkboxes: {
            $_ref: '^/sets/radio', Main: {
                $_maps: {
                    children: {
                        '0': {
                            args: {
                                '2': { type: 'checkbox', onChange: { $: '^/fn/eventCheckboxes|setValue|liveUpdate' } },
                                '3': { name: '[]' }
                            }
                        }
                    }
                }
            }
        },
        $radioInteger: {
            Main: {
                $_maps: {
                    children: {
                        '0': {
                            args: {
                                '2': {
                                    onChange: {
                                        $: '^/fn/eventValue|parseNumber|setValue|liveUpdate',
                                        args: ['${0}', true, 0]
                                    },
                                }
                            }
                        }
                    }
                }
            }
        },
        $radioNull: { Main: { $_maps: { children: { '0': { args: { '2': { onClick: '^/fn/eventValue|radioClear|liveUpdate' } } } } } } },
        $radioEmpty: { Main: { $_maps: { children: { '0': { args: { '2': { onClick: { $: '^/fn/eventValue|radioClear|liveUpdate', args: ['${0}', ''] } } } } } } } },
        $autowidth: {
            Autowidth: { $_ref: '^/parts/Autowidth' },
            Wrapper: { className: { 'fform-shrink': true } },
        },
        $noArrayControls: { Wrapper: { $_maps: { 'arrayItem': false } } },
        $noArrayButtons: { Title: { $_ref: '^/sets/simple/Title' } },
        $inlineItems: { Main: { className: { 'fform-inline': true } } },
        $inlineTitle: { Wrapper: { wrapperClassName: { 'fform-inline': true } } },
        $inlineLayout: { Main: { LayoutDefaultClass: { 'fform-inline': true } } },
        $inlineArrayControls: { Wrapper: { ArrayItemBody: { className: { 'fform-inline': true } } } },
        $arrayControls3but: { Wrapper: { ArrayItemMenu: { buttons: ['up', 'down', 'del'], } } },
        $arrayControlsDelOnly: { Wrapper: { ArrayItemMenu: { buttons: ['del'], } } },
        $noTitle: { Title: false },
        $noMessage: { Message: false },
        $shrink: { Wrapper: { className: { 'fform-shrink': true } } },
        $expand: { Wrapper: { className: { 'fform-expand': true } } },
        $password: { Main: { type: 'password' } },
        // $W: (path: Path, rPath: Path) => ({Wrapper: {className: {[rPath[0]]: !rPath[1]}}}),
        // $A: (path: Path, rPath: Path) => ({Wrapper: {ArrayItemMenu: {className: {[rPath[0]]: !rPath[1]}}}}),
        // $M: (path: Path, rPath: Path) => ({Main: {className: {[rPath[0]]: !rPath[1]}}}),
        // $T: (path: Path, rPath: Path) => ({Title: {className: {[rPath[0]]: !rPath[1]}}}),
        // $B: (path: Path, rPath: Path) => ({Body: {className: {[rPath[0]]: !rPath[1]}}}),
        // $MSG: (path: Path, rPath: Path) => ({Message: {className: {[rPath[0]]: !rPath[1]}}}),
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
        getProp(key, ...args) { return [commonLib_1.getIn(this, stateLib_1.normalizePath(key)), ...args]; },
        eventValue: (event, ...args) => [
            event.target.value, ...args
        ],
        eventChecked: (event, ...args) => [event.target.checked, ...args],
        parseTristate: (value, ...args) => [value === "" ? null : value, ...args],
        eventMultiple: (event, ...args) => [Array.from(event.target.options).filter((o) => o.selected).map((v) => v.value), ...args],
        parseNumber: (value, int = false, empty = null, ...args) => [value === '' ? empty : (int ? parseInt : parseFloat)(value), ...args],
        stringify(value, ...args) {
            if (!commonLib_1.isString(value))
                value = JSON.stringify(value);
            return [value, ...args];
        },
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
        messages(messages, staticProps = {}) {
            const { className: cnSP = {} } = staticProps, restSP = __rest(staticProps, ["className"]);
            return [commonLib_1.objKeys(messages || []).map(priority => {
                    const _a = messages[priority], { norender, texts, className = {} } = _a, rest = __rest(_a, ["norender", "texts", "className"]);
                    const children = [];
                    commonLib_1.objKeys(texts).forEach((key) => commonLib_1.toArray(texts[key]).forEach((v, i, arr) => {
                        if (stateLib_1.isElemRef(v))
                            v = this._resolver(v);
                        (commonLib_1.isString(v) && commonLib_1.isString(children[children.length - 1])) ? children.push({ _$widget: 'br' }, v) : children.push(v);
                    }));
                    if (norender || !children.length)
                        return null;
                    return Object.assign(Object.assign(Object.assign({ children }, restSP), { className: Object.assign(Object.assign({ ['fform-message-priority-' + priority]: true }, cnSP), className) }), rest);
                })];
        },
        arrayOfEnum(enumVals = [], enumExten = {}, staticProps = {}, name) {
            return [enumVals.map(val => {
                    let extenProps = getExten(enumExten, val);
                    return Object.assign(Object.assign(Object.assign({ key: val, children: [extenProps.label || val], name: name && (this.name + (name === true ? '' : name)) }, extenProps), staticProps), { value: val });
                })];
        },
        enumInputs(enumVals = [], enumExten = {}, inputProps = {}, opts = {}) {
            inputProps = Object.assign({}, inputProps);
            delete inputProps._$skipKeys;
            return [enumVals.map(val => {
                    let _a = getExten(enumExten, val), { label } = _a, extenProps = __rest(_a, ["label"]);
                    return Object.assign(Object.assign({ key: val, name: opts.name && (this.props.name + (opts.name === true ? '' : opts.name)) }, commonLib_1.merge(inputProps, extenProps)), { placeholder: label || val, value: val });
                })];
        },
        enumInputProps(enumVals = [], ...rest) {
            let props = {};
            for (let i = 0; i < rest.length; i += 2)
                props[rest[i]] = rest[i + 1];
            return [enumVals.map(val => props)];
        },
        enumInputValue(enumVals = [], value, property = 'checked') {
            value = commonLib_1.toArray(value);
            return [enumVals.map(val => { return { [property]: !!~value.indexOf(val) }; })];
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
            _$widget: '^/widgets/Generic',
            _$cx: '^/_$cx',
            children: [],
            $_maps: {
                children: { $: '^/fn/messages', args: ['@/messages', {}] },
                'className/fform-hidden': { $: '^/fn/or', args: ['@/params/viewer', '!@/status/touched'] },
            }
        },
        RadioSelector: {
            _$widget: '^/widgets/Input',
            _$cx: '^/_$cx',
            _$useTag: 'div',
            //type: 'notInput',
            children: [],
            $_maps: {
                value: '@/selector/value',
                children: [
                    {
                        $: '^/fn/enumInputs',
                        args: [
                            '@/selector/enum',
                            '@/selector/enumExten',
                            {
                                _$widget: '^/widgets/Checkbox',
                                type: 'radio',
                                onChange: { $: '^/fn/eventValue|setValue|liveUpdate', args: ['${0}', { path: './@/selector/value' }] },
                                onBlur: '^/sets/simple/Main/onBlur',
                                onFocus: '^/sets/simple/Main/onFocus',
                            },
                            { name: true }
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
                'className/fform-hidden': '@/params/hidden',
                $FField: { $: '^/fn/getProp', args: [], update: 'build' },
            }
        },
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
            children: ['Submit']
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
            _$buttonDefaults: '^/parts/Button',
            buttons: ['first', 'last', 'up', 'down', 'del'],
            onClick: { $: '^/fn/api', args: ['arrayItemOps', './', '${0}'] },
            buttonsProps: {
                first: { disabledCheck: 'canUp' },
                last: { disabledCheck: 'canDown' },
                up: { disabledCheck: 'canUp' },
                down: { disabledCheck: 'canDown' },
                del: { disabledCheck: 'canDel' },
            },
            $_maps: { arrayItem: '@/arrayItem', 'className/fform-button-viewer': '@/params/viewer', disabled: '@params/disabled' },
        },
        Expander: { _$widget: 'div', className: { 'fform-expand': true } }
    },
    _$cx: classNames,
    [_$cxSym]: classNames,
    $: (elems, path) => {
        let pathVal = path.map((v) => {
            v = elems['_$shorts'][v] || v;
            if (commonLib_1.isString(v) && v.length == 2) {
                let el0 = elems['_$shorts'][v[0]];
                let el1 = elems['_$shorts'][v[1]];
                if (el0 && el1) {
                    if (commonLib_1.isArray(el1))
                        v = el1.map((k) => el0 + k);
                    else
                        v = el0 + el1;
                }
                return commonLib_1.toArray(v).join(',');
            }
            return v;
        });
        let pathes = stateLib_1.multiplePath(pathVal);
        let res = {};
        commonLib_1.objKeys(pathes).forEach(key => commonLib_1.setIn(res, pathes[key].pop(), pathes[key]));
        return res;
    },
    $C: (elems, path) => {
        path = path.slice();
        let className = path.pop();
        let value = !(className[0] === '!');
        if (!value)
            className = className.substr(1);
        commonLib_1.push2array(path, 'className', className, value);
        return elems.$(elems, path);
    },
    $S: (elems, path) => {
        path = path.slice();
        let style = [];
        style.unshift(path.pop());
        style.unshift(path.pop());
        commonLib_1.push2array(path, 'style', style);
        return elems.$(elems, path);
    },
    _$shorts: {
        'W': 'Wrapper',
        'M': 'Main',
        'B': 'Body',
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