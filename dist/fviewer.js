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
const fform_1 = require("./fform");
const commonLib_1 = require("./commonLib");
const api_1 = require("./api");
const stateLib_1 = require("./stateLib");
class FViewer extends react_1.Component {
    constructor(props, ...args) {
        super(props, ...args);
        const self = this;
        self.schema = api_1.compileSchema(props.schema, props.elements);
        self._setRootRef = self._setRootRef.bind(self);
        self._setFormRef = self._setFormRef.bind(self);
        self._customData = self._normalizeCustom(props.customData);
        self._customReplace = self._normalizeCustom(props.customReplace);
        self._state = self._value2state(props.value);
        self._setApi(props);
    }
    get elements() { return this.props.elements; }
    _setApi(props) {
        const self = this;
        self.api = { getSchemaPart: self.getSchemaPart.bind(self), schema: props.schema, elements: props.elements };
    }
    _normalizeCustom(customData = {}) {
        const self = this;
        const _customData = {};
        commonLib_1.objKeys(customData).forEach(key => {
            let pathes = stateLib_1.multiplePath(stateLib_1.normalizePath(key));
            commonLib_1.objKeys(pathes).forEach((keyPath) => _customData[stateLib_1.path2string(pathes[keyPath])] = customData[key]);
        });
        return _customData;
    }
    _setRootRef(FField) {
        this._root = FField;
    }
    _setFormRef(form) {
        this._form = form;
    }
    static _makeStateDataObj(schemaPart, type, newVal) {
        let fData = { type };
        fData.title = schemaPart.title;
        if (schemaPart.enum)
            fData.enum = schemaPart.enum;
        if (schemaPart._enumExten)
            fData.enumExten = schemaPart._enumExten;
        let dataObj = { oneOf: schemaPart._oneOfIndex || 0, fData, schemaPart, params: FViewer.paramsBase };
        let isSelf = stateLib_1.isSchemaSelfManaged(schemaPart, type);
        if (isSelf)
            dataObj.value = newVal;
        else {
            if (commonLib_1.isArray(newVal))
                dataObj.length = newVal.length;
            dataObj.branchKeys = commonLib_1.objKeys(newVal).sort().join(',');
        }
        return dataObj;
    }
    _value2state(newVal, prevVal, prevState) {
        const self = this;
        function recurse(newValPart, prevValPart, prevStatePart, track = []) {
            if (newValPart === prevValPart)
                return prevStatePart;
            let type = stateLib_1.types.detect(newValPart);
            let schemaPart = stateLib_1.getSchemaPart(self.schema, track, newVal);
            let dataObj = FViewer._makeStateDataObj(schemaPart, type, newValPart);
            let pathKey = stateLib_1.path2string(track);
            let mergeCustom = self._customData[pathKey];
            let state = { [stateLib_1.SymData]: mergeCustom ? commonLib_1.merge(dataObj, mergeCustom, { replace: commonLib_1.getIn(self._customReplace, pathKey) }) : dataObj };
            if (!stateLib_1.isSelfManaged(state))
                commonLib_1.objKeys(newValPart).forEach(k => state[k] = recurse(newValPart[k], commonLib_1.getIn(prevValPart, k), commonLib_1.getIn(prevStatePart, k), track.concat(k)));
            return state;
        }
        return recurse(newVal, prevVal, prevState);
    }
    shouldComponentUpdate(nextProps) {
        const self = this;
        self.parent = nextProps.parent;
        if (['elements', 'schema'].some(nm => self.props[nm] !== nextProps[nm]))
            self.schema = api_1.compileSchema(nextProps.schema, nextProps.elements);
        let prevState = self._state;
        const propsNotEqual = fform_1.comparePropsFn(self.props, nextProps);
        if (['customData', 'customReplace'].some(propsNotEqual)) {
            let prevCustom = self._customData;
            let prevReplace = self._customReplace;
            self._customData = self._normalizeCustom(nextProps.customData);
            self._customReplace = self._normalizeCustom(nextProps.customReplace);
            const dataUpdates = { update: {}, replace: {}, api: {} };
            const prevKeys = commonLib_1.objKeys(prevCustom);
            commonLib_1.objKeys(self._customData).forEach(key => {
                prevKeys.splice(prevKeys.indexOf(key), 1);
                let path = stateLib_1.string2path(key);
                let branch = commonLib_1.getIn(self._state, path, stateLib_1.SymData);
                if (branch && (prevCustom[key] !== self._customData[key] || prevReplace[key] !== self._customReplace[key]))
                    stateLib_1.setUPDATABLE(dataUpdates, commonLib_1.merge(FViewer._makeStateDataObj(branch.schemaPart, branch.fData.type, branch.value), self._customData[key], { replace: commonLib_1.getIn(self._customReplace, key) }), true, path, stateLib_1.SymData);
            });
            prevKeys.forEach(key => {
                let path = stateLib_1.string2path(key);
                let branch = commonLib_1.getIn(self._state, path, stateLib_1.SymData);
                if (branch)
                    stateLib_1.setUPDATABLE(dataUpdates, FViewer._makeStateDataObj(branch.schemaPart, branch.fData.type, branch.value), true, path, stateLib_1.SymData);
            });
            self._state = stateLib_1.mergeUPD_PROC(self._state, dataUpdates);
        }
        if (self.props.value !== nextProps.value)
            self._state = this._value2state(nextProps.value, self.props.value, self._state);
        if (self._root && prevState !== self._state)
            self._root.setState({ branch: self._state });
        if (['schema', 'elements'].some(propsNotEqual))
            self._setApi(nextProps);
        return !commonLib_1.isEqual(self.props, nextProps, { skipKeys: ['parent', 'value', 'customData', 'customReplace'] });
    }
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
            return commonLib_1.getIn(this.props.value, stateLib_1.normalizePath(ffield.path));
    }
    getBranch(path) {
        return commonLib_1.getIn(this._state, stateLib_1.normalizePath(path));
    }
    getSchemaPart(path) {
        return commonLib_1.getIn(this._state, stateLib_1.normalizePath(path), stateLib_1.SymData, 'schemaPart');
    }
    render() {
        const self = this;
        let _a = self.props, { value, parent, _$useTag: UseTag = self.props.elements.widgets.Viewer || 'div' } = _a, rest = __rest(_a, ["value", "parent", "_$useTag"]);
        commonLib_1.objKeys(rest).forEach(k => (k[0] === '_' || k[0] === '$') && delete rest[k]); // remove props that starts with '_' or '$'
        return (react_1.createElement(UseTag, Object.assign({ ref: self._setFormRef }, rest),
            react_1.createElement(fform_1.FField, { ref: self._setRootRef, id: rest.id ? rest.id + '/#' : undefined, name: rest.name ? rest.name + '/#' : undefined, pFForm: self, getPath: FViewer._getPath, FFormApi: self.api })));
    }
}
FViewer.paramsBase = { viewer: true, noEditor: true };
exports.FViewer = FViewer;
//# sourceMappingURL=fviewer.js.map