"use strict";

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __assign = this && this.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
    }
    return t;
};
var __rest = this && this.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};
var React = require("react");
var react_1 = require("react");
// const deref = require('./deref')();
var JSONSchemaValidator = require('./is-my-json-valid');
// const JSONSchemaValidator = (a:any,b:any)=>{};
var objKeys = Object.keys; // getOwnPropertyNames
var parseIntFn = parseInt;
var isArr = Array.isArray;
var isUndefined = function isUndefined(value) {
    return typeof value === "undefined";
};
// const hasOwnProperty = Object.prototype.hasOwnProperty;
var SymbolData = Symbol.for('FFormData');
var SymbolDelete = undefined; // Symbol.for('FFormDelete'); // 
var formReducerValue = 'forms';
/////////////////////////////////////////////
//  Actions names
/////////////////////////////////////////////
var actionName4setItems = 'FFORM_SET_ITEMS';
var actionName4forceValidation = 'FFORM_FORCE_VALIDATION';
// const Button = require('reactstrap/lib/Input');
// const InputGroup = require('reactstrap/lib/InputGroup');
function objKeysAndSymbols(obj) {
    var result = objKeys(obj);
    return result.concat(Object.getOwnPropertySymbols(obj));
}
function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(function (baseCtor) {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
/////////////////////////////////////////////
//  Hooks
/////////////////////////////////////////////
// function makeDataItem(dataItem: StateType) {
//   let result = {};
//   ['values', 'status', 'array'].forEach((key: string) => dataItem.hasOwnProperty(key) && (result[key] = JSON.parse(JSON.stringify(dataItem[key]))));
//   return result
// }
// function getDataItem(stateItems: StateType, state: StateType, path: Path) {
//   if (!stateItems[path2string(path)]) stateItems[path2string(path)] = makeDataItem(getIn(state, path.concat(SymbolData)));
//   return stateItems[path2string(path)];
// }
function hookManager() {
    var globalHooks = {};
    var Hooks = {};
    function setHook(name, hookName, hook) {
        getByKey(Hooks, [name, hookName], globalHooks[hookName].slice()).push(hook);
    }
    var add = function add(name, hookName, hook) {
        if (name == '') {
            // if (!globalHooks[hookName]) globalHooks[hookName] = [];
            // let globalHooksArray = getByKey(globalHooks, hookName, []);
            objKeys(Hooks).forEach(function (key) {
                return setHook(key, hookName, hook);
            });
            getByKey(globalHooks, hookName, []).push(hook);
        } else setHook(name, hookName, hook);
        return remove.bind(null, name, hookName, hook);
    };
    function remove(name, hookName, hook) {
        if (name == '') {
            globalHooks[hookName].splice(globalHooks[hookName].indexOf(hook), 1);
            objKeys(Hooks).forEach(function (key) {
                return Hooks[key][hookName].splice(Hooks[key][hookName].indexOf(hook));
            }, 1);
        } else Hooks[name][hookName].splice(Hooks[name][hookName].indexOf(hook), 1);
    }
    ;
    // add.remove = remove;
    add.get = function (name) {
        if (!Hooks[name]) {
            Hooks[name] = {};
            objKeys(globalHooks).map(function (hookName) {
                return Hooks[name][hookName] = globalHooks[hookName].slice();
            });
        }
        return Hooks[name];
    };
    return add;
}
var Hooks = hookManager();
exports.addHook = Hooks;
// recalc array
Hooks('', 'beforeMerge', function (state, item, utils, schema, data) {
    // function recurseSetData(stateItems: any, newState: StateType, track: Path) {
    //   stateItems[path2string(track)] = makeDataItem(newState[SymbolData]);
    //   objKeys(newState).forEach(key => recurseSetData(stateItems, newState[key], track.concat(key)))
    // }
    if (!item.keyPath) return [];
    var result = [];
    if (item.keyPath[0] == 'array' && item.keyPath[1] == 'lengths') {
        var dataItem = getIn(state, item.path)[SymbolData]; // getDataItem(stateItems, state, item.path);
        // const schema = state[SymbolData].schema;
        var lengthFull = dataItem.array.lengths; // || getIn(state, path.concat(SymbolData, 'length')) || {};
        var newLengthFull = merge(lengthFull, makeSlice(item.keyPath[2], item.value));
        var start = getMaxValue(lengthFull) || 0;
        var end = getMaxValue(newLengthFull) || 0;
        for (var i = start; i < end; i++) {
            var elemPath = item.path.concat(i);
            // console.time('makeStateFromSchema Hook');
            var newElem = makeStateFromSchema(schema, {}, elemPath);
            // console.timeEnd('makeStateFromSchema Hook');
            result.push(makeUpdateItem(elemPath, newElem.state));
            result.push(makeUpdateItem([], newElem.dataMap));
        }
        for (var _i = end; _i < start; _i++) {
            result.push({ path: item.path.concat(_i), value: SymbolDelete });
        }var arrayStartIndex = dataItem.array.arrayStartIndex;
        var newLength = getValue(newLengthFull);
        var schemaPart = getSchemaPart(schema, item.path);
        var minItems = schemaPart.minItems || 0;
        result.push({ path: item.path, keyPath: ['canAdd'], value: !(schemaPart.additionalItems === false) && newLength < (schemaPart.maxItems || Infinity) });
        for (var _i2 = Math.max(Math.min(getValue(lengthFull), newLength) - 1, 0); _i2 < newLength; _i2++) {
            var _elemPath = item.path.concat(_i2);
            if (_i2 >= arrayStartIndex) {
                result.push(makeUpdateItem(_elemPath, ['arrayItem', 'canUp'], arrayStartIndex < _i2));
                result.push(makeUpdateItem(_elemPath, ['arrayItem', 'canDown'], arrayStartIndex <= _i2 && _i2 < newLength - 1));
            }
            if (_i2 >= minItems) result.push(makeUpdateItem(_elemPath, ['arrayItem', 'canDel'], _i2 >= Math.min(arrayStartIndex, newLength - 1)));
        }
    }
    return result;
});
// set recalculate for parent
Hooks('', 'beforeMerge', function (state, item, utils, schema, data) {
    function recursivelySetChanges(statePart, keyPath, track) {
        after.push(makeUpdateItem(track, keyPath, item.value));
        getKeysAccording2schema(statePart, []).forEach(function (key) {
            return recursivelySetChanges(statePart[key], keyPath, track.concat(key));
        });
    }
    ;
    if (!item.keyPath) return [];
    var result = {};
    var after = [];
    result.after = after;
    if (item.keyPath[0] == 'switch' && item.keyPath.length == 3) {
        result.skip = true;
        recursivelySetChanges(getIn(state, item.path), item.keyPath.slice(1), item.path);
    }
    if (item.keyPath[0] == 'values') {
        var dataItem = getIn(state, item.path)[SymbolData];
        if (dataItem.values) after.push(makeUpdateItem(item.path, ['status', 'pristine'], getValue(dataItem.values) === getValue(dataItem.values, 'inital')));
    }
    // ------------------------- move to afterMerge-------------------------------
    //   if (item.keyPath[0] == 'values') { // calculate pristine value
    //     const dataItem = getDataItem(stateItems, state, item.path);
    //     if (dataItem[item.keyPath[0]]) dataItem[item.keyPath[0]][item.keyPath[1]] = item.value;
    //     if (dataItem.values) {
    //       let statusValue = getValue(dataItem.values) === getValue(dataItem.values, 'inital');
    //       let checkItem: UpdateItem = {path: item.path, keyPath: ['status', 'pristine'], value: statusValue};
    //       statusCheck.push(checkItem);
    //       afterThis.push(checkItem);
    //       dataItem.status.pristine = statusValue;
    //     }
    //   }
    //
    //   if (item.keyPath[0] == 'controls' && item.keyPath[1] == 'omit') {  // recalc all status when omit is changed
    //     let keys = objKeys(getIn(state, item.path.concat(SymbolData, 'status')));
    //
    //     if (item.value) {
    //       let path = item.path.slice(0, -1);
    //       keys.forEach(key => statusCheck.push({path, keyPath: ['status', key], value: SymbolRecalc}))
    //     } else {
    //       let path = item.path;
    //       keys.forEach(key => statusCheck.push({path, keyPath: ['status', key], value: getIn(getDataItem(stateItems, state, path), ['status', key])}))
    //     }
    //   }
    //
    //   if (statusCheck.length || item.keyPath[0] == 'status') {
    //     const dataItem = getDataItem(stateItems, state, item.path);
    //     let path = item.path.slice();
    //     const items2check: Array<UpdateItem & {keyPath: Path}> = [];
    //     if (statusCheck.length) push2array(items2check, statusCheck);
    //     else items2check.push(item as any);
    //
    //     items2check.forEach((item2check) => {
    //       let checkValue = true;
    //       if (item2check.keyPath[1] == 'pending') checkValue = false;
    //       path = item2check.path.slice();
    //       dataItem.status[item2check.keyPath[1]] = item2check.value;
    //       for (let i = 0; i < item2check.path.length; i++) {
    //         path.pop();
    //         const dataItem = getDataItem(stateItems, state, path);
    //         if (dataItem.status[item2check.keyPath[1]] != item2check.value) {
    //           if (item2check.value == SymbolRecalc || item2check.value == checkValue) {
    //             getByKey(getByKey(data, SymbolRecalc, []), [path.length, path2string(path, item2check.keyPath)], {
    //               path: path.slice(),
    //               keyPath: item2check.keyPath,
    //               checkValue
    //             }); // add data for afterMerge recalc hook
    //           } else setChangesWithCheck(path.slice(), item2check.keyPath, item2check.value);
    //         }
    //       }
    //     })
    //   }
    // --------------------------------------------------------------------------------
    return result;
});
// Recalculate
Hooks('', 'afterMerge', function (state, changesArray, utils, schema, data) {
    var addChangeData = [];
    var recalcArray = void 0;
    function countRecalc(state, changes) {
        var track = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ['#'];

        if (state === undefined) return;
        objKeys(changes).forEach(function (key) {
            return countRecalc(state[key], changes[key], track.concat(key));
        });
        var dataItemChanges = changes[SymbolData];
        if (!dataItemChanges) return;
        var dataItem = state[SymbolData];
        if (!dataItem) return;
        var status = [];
        var path = track.concat();
        var controls = dataItemChanges['controls'] || {};
        if (getIn(dataItemChanges, ['array', 'lengths'])) status = objKeys(dataItem.status);else if (controls.hasOwnProperty('omit') || controls.hasOwnProperty('omitBind')) {
            path.pop();
            status = objKeys(dataItem.status);
        } else if (dataItemChanges.status) {
            path.pop();
            status = objKeys(dataItemChanges.status);
        }
        var length = path.length;
        if (!recalcArray) recalcArray = [];
        for (var i = 0; i < length; i++) {
            status.forEach(function (key) {
                return getByKey(recalcArray, [path.length, path2string(path, ['status'].concat(key))], { path: path.slice(), keyPath: ['status'].concat(key), checkValue: key != 'pending' });
            });
            path.pop();
        }
    }
    // countRecalc(state, changes);
    changesArray.forEach(function (changes) {
        return countRecalc(state, changes);
    });
    if (recalcArray) {
        (function () {
            var newVals = {};

            var _loop = function _loop(i) {
                var obj = recalcArray[recalcArray.length - i - 1];
                if (obj) {
                    objKeys(obj).forEach(function (key) {
                        var _obj$key = obj[key],
                            path = _obj$key.path,
                            keyPath = _obj$key.keyPath,
                            checkValue = _obj$key.checkValue;

                        var keys = getKeysAccording2schema(state, path);
                        var result = checkValue;
                        for (var j = 0; j < keys.length; j++) {
                            if (getBindedValue(getIn(state, path.concat(keys[j], SymbolData, 'controls')), 'omit')) continue; // skip value if omit key is true
                            var pathString = path2string(path.concat(keys[j]), keyPath);
                            var value = newVals.hasOwnProperty(pathString) ? newVals[pathString] : utils.get(state, pathString);
                            if (value === !checkValue) {
                                result = !checkValue;
                                break;
                            } else if (value === null) result = null; // && result !== !checkValue - not needed, as we have break when set result = !checkValue
                        }
                        addChangeData.push({ path: path, keyPath: keyPath, value: result });
                        newVals[path2string(path, keyPath)] = result;
                    });
                }
            };

            for (var i = 0; i < recalcArray.length; i++) {
                _loop(i);
            }
        })();
    }
    return addChangeData;
});
function getKeysAccording2schema(state, path) {
    var data = getIn(state, path)[SymbolData];
    var keys = [];
    if (data.schemaData.type == 'array') for (var j = 0; j < getValue(data.array.lengths); j++) {
        keys.push(j.toString());
    } else keys = objKeys(getIn(state, path));
    return keys;
    // if (withOmited) return keys;
    // let res: string[] = [];
    // for (let j = 0; j < keys.length; j++) {
    //   if (getBindedValue(getIn(state, path.concat(keys[j], SymbolData, 'controls')), 'omit')) continue; // skip recalc if omit key is true
    //   res.push(keys[j])
    // }
    // return res;
}
/////////////////////////////////////////////
//  Api class
/////////////////////////////////////////////

var apiMixin = function () {
    function apiMixin() {
        _classCallCheck(this, apiMixin);

        this.currentState = {};
    }

    _createClass(apiMixin, [{
        key: "initState",
        value: function initState(props, setStateFunc) {
            var self = this;
            self.utils = utils;
            if (!self.reducer) self.reducer = formReducer();
            self.schema = __assign({}, props.schema); // make new object, so that keep untoched source
            self.schema[SymbolData] = {}; // storage for some some additional data 
            self.validator = JSONSchemaValidator(self.schema, { greedy: true });
            self.jValidator = self.jValidator.bind(self);
            self.keyMap = getKeyMapFromSchema(self.schema);
            self.setNewState = setStateFunc;
            var formValues = props.values || {};
            objKeys(formValues).forEach(function (type) {
                return formValues[type] = self.keyMap.unflatten(formValues[type]);
            });
            var state = props.state;
            if (!state) {
                var result = makeStateFromSchema(self.schema, formValues);
                state = merge(result.state, result.dataMap, { symbol: true });
                state[SymbolData]['version'] = 0;
            }
            return state;
        }
    }, {
        key: "_jValidator",
        value: function jValidator(data) {
            this.validator(data);
            var result = this.validator.errors;
            if (!result) return [];
            if (!isArr(result)) result = [result];
            return result.map(function (item) {
                return [item.field.split('.').slice(1), item.message];
            });
        }
    }, {
        key: "_dispath",
        value: function _dispath(action) {
            var self = this;
            if (typeof action === 'function') {
                return action(self._dispath.bind(self));
            } else {
                try {
                    self.isDispatching = true;
                    self.setNewState(self.reducer(self.currentState, action));
                } finally {
                    self.isDispatching = false;
                }
            }
            return action;
        }
    }]);

    return apiMixin;
}();

var makeApi = function (_apiMixin) {
    _inherits(makeApi, _apiMixin);

    function makeApi(props) {
        _classCallCheck(this, makeApi);

        var _this = _possibleConstructorReturn(this, (makeApi.__proto__ || Object.getPrototypeOf(makeApi)).call(this));

        var self = _this;
        var state = self.initState(props, self.setState.bind(self));
        self.api = apiCreator(self._dispath.bind(self), self.getState.bind(self), self.setState.bind(self), self.keyMap, Hooks.get(props.name), self._jValidator, self.schema);
        self.promise = self.api.setSingle([], state);
        return _this;
    }

    _createClass(makeApi, [{
        key: "setState",
        value: function setState(state) {
            this.currentState = state;
        }
    }, {
        key: "getState",
        value: function getState() {
            return this.currentState;
        }
    }]);

    return makeApi;
}(apiMixin);

exports.makeApi = makeApi;
/////////////////////////////////////////////
//  Main class
/////////////////////////////////////////////

var Form = function (_react_1$PureComponen) {
    _inherits(Form, _react_1$PureComponen);

    /*  static propTypes = {
     shchema: PropTypes.object.isRequired,
     name: PropTypes.string,
     store: PropTypes.object,
     dispath: PropTypes.func,
     values: PropTypes.object,
     initalValues: PropTypes.object,
     defaultValues: PropTypes.object,
     };*/
    function Form(props, context) {
        _classCallCheck(this, Form);

        var _this2 = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, props, context));

        _this2.currentState = {};
        var self = _this2;

        var tag = props.tag,
            store = props.store,
            iface = props.iface,
            rest = __rest(props, ["tag", "store", "iface"]);

        self.store = store;
        // self.schema = deref('', schema, [objects]);
        var newState = self.initState(rest, self.setState.bind(self));
        self._setIface(iface);
        self.promise = self.api.setSingle([], newState);
        return _this2;
    }

    _createClass(Form, [{
        key: "shouldComponentUpdate",
        value: function shouldComponentUpdate(newProps) {
            var self = this;
            if (!isEqual(this.props, newProps, { skipKeys: ['state', 'store', 'iface'] })) {
                if (this.props.store != newProps.store) this.store = newProps.store;
                if (this.props.iface != newProps.iface || this.props.store != newProps.store) this._setIface(newProps.iface);
                self.setState(newProps.state);
                return false;
            }
            return true;
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            if (this.unsubscribe) this.unsubscribe();
        }
    }, {
        key: "_handleChange",
        value: function _handleChange() {
            var self = this;
            var nextState = self.store.getState()[formReducerValue][self.props.name];
            if (nextState !== self.currentState) {
                self.setState(nextState);
            }
        }
    }, {
        key: "setState",
        value: function setState(state) {
            var self = this;
            if (self.currentState != state) {
                self.currentState = state;
                if (self.rootRef) self.rootRef.forceUpdate();
            }
        }
    }, {
        key: "_setIface",
        value: function _setIface(iface) {
            var self = this;
            if (!iface) iface = self.context.store || self.store ? 'redux' : 'local';
            self.iface = iface;
            if (self.iface == 'redux') {
                var store = void 0;
                if (self.store) store = self.store;else if (self.context.store) store = self.store = self.context.store;else throw new Error('In redux mode store must be provided either in context or in props.store');
                self.dispath = store.dispath;
                if (self.unsubscribe) self.unsubscribe();
                self.unsubscribe = store.subscribe(self._handleChange);
            } else {
                if (self.unsubscribe) {
                    self.unsubscribe();
                    delete self.unsubscribe;
                }
                self.dispath = self._dispath.bind(self);
            }
            self.api = apiCreator(self.dispath, self.getState.bind(self), self.setState.bind(self), self.keyMap, Hooks.get(self.props.name), self.jValidator, self.schema);
        }
    }, {
        key: "focus",
        value: function focus(path) {
            if (this.rootRef) this.rootRef.focus(path);
        }
    }, {
        key: "rebuild",
        value: function rebuild(path) {
            if (this.rootRef) this.rootRef.rebuild(path);
        }
    }, {
        key: "getState",
        value: function getState() {
            return this.currentState;
        }
    }, {
        key: "render",
        value: function render() {
            var self = this;
            var _a = self.props,
                name = _a.name,
                objects = _a.objects,
                values = _a.values,
                schema = _a.schema,
                iface = _a.iface,
                _a$widget = _a.widget,
                Widget = _a$widget === undefined ? 'form' : _a$widget,
                state = _a.state,
                store = _a.store,
                rest = __rest(_a, ["name", "objects", "values", "schema", "iface", "widget", "state", "store"]);
            var registry = {};
            registry.formName = name;
            registry.objects = objects;
            registry.schema = self.schema;
            registry.api = self.api;
            registry.utils = self.utils;
            registry.focus = self.focus.bind(self);
            registry.rebuild = self.rebuild.bind(self);
            return React.createElement(Widget, __assign({}, rest, { name: name }), React.createElement(Field, { ref: function ref(item) {
                    return self.rootRef = item;
                }, key: "main", registry: registry, path: ['#'] }));
        }
    }]);

    return Form;
}(react_1.PureComponent);

Form.contextTypes = {
    store: React.PropTypes.object
};
exports.FForm = Form;
applyMixins(Form, [apiMixin]);
/////////////////////////////////////////////
//  Section class
/////////////////////////////////////////////

var SectionWidget = function (_react_1$Component) {
    _inherits(SectionWidget, _react_1$Component);

    function SectionWidget() {
        _classCallCheck(this, SectionWidget);

        return _possibleConstructorReturn(this, (SectionWidget.__proto__ || Object.getPrototypeOf(SectionWidget)).apply(this, arguments));
    }

    _createClass(SectionWidget, [{
        key: "render",
        value: function render() {
            var _a = this.props,
                Widget = _a.widget,
                getDataProps = _a.getDataProps,
                wid = _a.wid,
                rest = __rest(_a, ["widget", "getDataProps", "wid"]);
            var dataMaped = getDataProps()[wid] || {};
            return React.createElement(Widget, __assign({}, rest, dataMaped));
        }
    }]);

    return SectionWidget;
}(react_1.Component);

function replaceWidgetNamesWithFunctions(presetArrays, objects) {
    var tmp = presetArrays;
    if (!isArr(tmp)) tmp = [tmp];

    var _loop2 = function _loop2(i) {
        var presetArray = tmp[i];
        var widget = presetArray.widget;
        if (widget) presetArray.widget = typeof widget === 'string' ? objects.widgets && objects.widgets[widget] || widget : widget;
        objKeys(presetArray).forEach(function (key) {
            return isObject(presetArray[key]) && (presetArray[key] = replaceWidgetNamesWithFunctions(presetArray[key], objects));
        });
    };

    for (var i = 0; i < tmp.length; i++) {
        _loop2(i);
    }
    return presetArrays;
}

var Section = function (_react_1$Component2) {
    _inherits(Section, _react_1$Component2);

    function Section(props, context) {
        _classCallCheck(this, Section);

        var _this4 = _possibleConstructorReturn(this, (Section.__proto__ || Object.getPrototypeOf(Section)).call(this, props, context));

        _this4.layouts = [];
        _this4.isArray = false;
        _this4.arrayAddable = true;
        _this4.arrayDelta = 0;
        _this4.shouldBuild = true;
        _this4.fields = {};
        _this4.wids = {};
        _this4.dataMaps = {};
        _this4.dataProps = {};
        var array = props.fieldOptions.registry.objects.array;
        // this.ArrayItem = typeof array.widget === 'function' ? array.widget : this._makeArrayItem(array);
        return _this4;
    }

    _createClass(Section, [{
        key: "focus",
        value: function focus(path) {
            var self = this;
            var field = void 0;
            if (!path.length) field = self.focusField;else {
                field = path[0];
                path = path.slice(1);
            }
            if (self.fields[field] && self.fields[field].focus) self.fields[field].focus(path);
        }
    }, {
        key: "rebuild",
        value: function rebuild(path) {
            var self = this;
            if (!path.length) {
                self.layouts = [];
                self.shouldBuild = true;
                self.forceUpdate();
            } else {
                var _field = path[0];
                path = path.slice(1);
                if (self.fields[_field] && self.fields[_field].rebuild) self.fields[_field].rebuild(path);
            }
        }
    }, {
        key: "_build",
        value: function _build(props) {
            function bindMetods(restField) {
                var track = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['#'];

                var result = __assign({}, restField);
                methodBindObject.methods2chain.forEach(function (methodName) {
                    if (typeof result[methodName] == 'function') result[methodName] = result[methodName].bind(methodBindObject);
                });
                objKeys(result).forEach(function (key) {
                    return isObject(result[key]) && (result[key] = bindMetods(result[key], track.concat(key)));
                });
                return result;
            }
            function makeLayout(keys, fields, groups) {
                var GroupWidget = widgets['Group'] || 'div';
                var groupPropsMap = field.mapProps['Group'];
                var layout = [];
                var groupKeys = objKeys(groups).map(function (key) {
                    return parseIntFn(key);
                });
                fields.forEach(function (field) {
                    if (typeof field == 'string') {
                        layout.push(SectionField(field));
                        keys.splice(keys.indexOf(field), 1);
                    } else if (typeof field == 'number') {
                        var _a = groups[field],
                            _a$fields = _a.fields,
                            groupFields = _a$fields === undefined ? [] : _a$fields,
                            _a$groups = _a.groups,
                            groupGroups = _a$groups === undefined ? [] : _a$groups,
                            _a$widget2 = _a.widget,
                            widget = _a$widget2 === undefined ? GroupWidget : _a$widget2,
                            propsMap = _a.propsMap,
                            restGroup = __rest(_a, ["fields", "groups", "widget", "propsMap"]);
                        var cnt = widCount;
                        widCount++;
                        layout.push(React.createElement(SectionWidget, __assign({ wid: cnt, getDataProps: getDataProps, widget: widget, key: 'group_' + field }, schemaProps['Group'], restGroup), makeLayout(keys, groupFields, groupGroups))); // for _dataProps['Group'] changes should make rebuild
                        if (propsMap || groupPropsMap) self.dataMaps[cnt] = merge(propsMap || {}, groupPropsMap || {});
                        groupKeys.splice(groupKeys.indexOf(field), 1);
                    } else if (isObject(field)) {
                        var _propsMap = field.propsMap,
                            passOptions = field.passOptions,
                            restField = __rest(field, ["propsMap", "passOptions"]);

                        restField = bindMetods(restField);
                        restField = replaceWidgetNamesWithFunctions(restField, registry.objects);
                        var opts = {};
                        if (passOptions) opts[passOptions === true ? 'options' : passOptions] = fieldOptions;
                        layout.push(React.createElement(SectionWidget, __assign({}, opts, { key: 'widget_' + widCount, wid: widCount, getDataProps: getDataProps, ref: setWidRef(widCount) }, restField)));
                        if (_propsMap) self.dataMaps[widCount] = _propsMap;
                        widCount++;
                    }
                });
                if (groupKeys.length) {
                    (function () {
                        var restGroups = {};
                        groupKeys.forEach(function (key) {
                            return groups[key] && (restGroups[key] = groups[key]);
                        });
                        push2array(layout, makeLayout(keys, groupKeys, restGroups));
                    })();
                }
                return layout;
            }
            var SectionField = function SectionField(field) {
                return React.createElement(Field, { key: field, ref: setRef(field), registry: registry, path: path.concat(field), childrenBlocks: fieldOptions.childrenBlocks });
            };
            var self = this;
            var fieldOptions = props.fieldOptions;
            var _props$fieldOptions = props.fieldOptions,
                path = _props$fieldOptions.path,
                registry = _props$fieldOptions.registry,
                widgets = _props$fieldOptions.widgets,
                schemaProps = _props$fieldOptions.schemaProps,
                schemaPart = _props$fieldOptions.schemaPart,
                field = _props$fieldOptions.field;

            var methodBindObject = field.methodBindObject;
            // let schemaPart = getSchemaPart(registry.schema, path);
            if (!schemaPart) return null;
            self.focusField = props.focusField;
            var setRef = function setRef(field) {
                return function (item) {
                    return self.fields[field] = item;
                };
            };
            var setWidRef = function setWidRef(key) {
                return function (item) {
                    return self.wids[key] = item;
                };
            };
            var getDataProps = function getDataProps() {
                return self.dataProps;
            };
            var widCount = 0;
            var _schemaPart$x = schemaPart.x,
                x = _schemaPart$x === undefined ? {} : _schemaPart$x,
                _schemaPart$propertie = schemaPart.properties,
                properties = _schemaPart$propertie === undefined ? {} : _schemaPart$propertie;
            var _x$groups = x.groups,
                groups = _x$groups === undefined ? [] : _x$groups;

            var getSingle = registry.api.getSingle;
            var keys = [];
            var arrayStartIndex = 0;
            var length = 0;
            if (schemaPart.type == 'array') {
                if (!self.focusField) self.focusField = '0';
                // self.isArray = true;
                // self.arrayAddable = !(schemaPart.additionalItems === false);
                length = props.length; // getValue(getSingle(path.concat(SymbolData, 'length'))) || 0;
                arrayStartIndex = getSingle(path.concat(SymbolData, 'array', 'arrayStartIndex'));
                if (length < arrayStartIndex) self.layouts = [];
                for (var i = 0; i < arrayStartIndex; i++) {
                    keys.push(i.toString());
                }
            } else {
                keys = objKeys(schemaPart.properties);
            }
            if (!self.focusField && keys[0]) self.focusField = keys[0];
            if (self.layouts.length == 0) {
                self.layouts = makeLayout(keys, x.fields || [], x.groups || []);
                keys.forEach(function (field) {
                    return self.layouts.push(SectionField(field));
                });
                objKeys(self.dataMaps).forEach(function (key) {
                    return self.dataProps[key] = mapProps(self.dataMaps[key], getSingle(path.concat(SymbolData)), methodBindObject);
                });
                self.arrayDelta = arrayStartIndex - self.layouts.length;
            }
            if (schemaPart.type == 'array') {
                var from = Math.max(arrayStartIndex, Math.min(self.layouts.length + self.arrayDelta, length));
                self.layouts.splice(from - self.arrayDelta, self.layouts.length - from); // = self.layoutsObject.slice(0, from);
                for (var _i3 = from; _i3 < length; _i3++) {
                    self.layouts[_i3 - self.arrayDelta] = SectionField(_i3.toString());
                }
            }
        }
    }, {
        key: "shouldComponentUpdate",
        value: function shouldComponentUpdate(newProps) {
            var self = this;
            var result = !isEqual(self.props, newProps, { skipKeys: ['dataTree'] });
            var getSingle = newProps.fieldOptions.registry.api.getSingle;
            var path = newProps.fieldOptions.path;

            if (getSingle(push2array([SymbolData, 'changes'], path, SymbolData, 'array', 'lengths')) !== undefined) {
                self.shouldBuild = true;
                result = true;
            }
            if (self.props.dataTree != newProps.dataTree) {
                var modifiedFields = getSingle(push2array([SymbolData, 'changes'], path));
                if (modifiedFields) {
                    objKeys(modifiedFields).forEach(function (field) {
                        return self.fields[field] && self.fields[field]['forceUpdate']();
                    });
                    if (modifiedFields[SymbolData]) {
                        (function () {
                            var dataProps = {};
                            objKeys(self.dataMaps).forEach(function (key) {
                                return dataProps[key] = mapProps(self.dataMaps[key], newProps.dataTree[SymbolData], newProps.fieldOptions.field.methodBindObject);
                            });
                            var tmp = mergeState(self.dataProps, dataProps);
                            self.dataProps = tmp.state;
                            if (tmp.changes) objKeys(tmp.changes).forEach(function (key) {
                                return self.wids[key] && self.wids[key]['forceUpdate']();
                            });
                        })();
                    }
                }
            }
            return result;
        }
    }, {
        key: "render",
        value: function render() {
            var self = this;
            var _a = self.props,
                _a$useTag = _a.useTag,
                UseTag = _a$useTag === undefined ? 'div' : _a$useTag,
                funcs = _a.funcs,
                length = _a.length,
                enumOptions = _a.enumOptions,
                fieldOptions = _a.fieldOptions,
                onChange = _a.onChange,
                onFocus = _a.onFocus,
                onBlur = _a.onBlur,
                dataTree = _a.dataTree,
                refName = _a.refName,
                focusField = _a.focusField,
                rest = __rest(_a, ["useTag", "funcs", "length", "_enumOptions", "fieldOptions", "onChange", "onFocus", "onBlur", "dataTree", "refName", "focusField"]);
            if (self.shouldBuild) self._build(self.props); // make rebuild here to avoid addComponentAsRefTo Invariant Violation error https://gist.github.com/jimfb/4faa6cbfb1ef476bd105
            self.shouldBuild = false;
            return React.createElement(UseTag, __assign({}, rest), self.layouts);
        }
    }]);

    return Section;
}(react_1.Component);

function ArrayBlock(props) {
    var _props$useTag = props.useTag,
        UseTag = _props$useTag === undefined ? 'div' : _props$useTag,
        empty = props.empty,
        addButton = props.addButton,
        length = props.length,
        canAdd = props.canAdd,
        id = props.id,
        children = props.children,
        hidden = props.hidden,
        fieldOptions = props.fieldOptions,
        rest = __rest(props, ["useTag", "empty", "addButton", "length", "canAdd", "id", "children", "hidden", "fieldOptions"]);

    var _empty$widget = empty.widget,
        Empty = _empty$widget === undefined ? 'div' : _empty$widget,
        emptyRest = __rest(empty, ["widget"]);

    var _addButton$widget = addButton.widget,
        AddButton = _addButton$widget === undefined ? 'button' : _addButton$widget,
        addButtonRest = __rest(addButton, ["widget"]);

    var onClick = function onClick() {
        // console.time('arrayOps');
        fieldOptions.registry.api.arrayOps(fieldOptions.path);
        // console.timeEnd('arrayOps');
    };
    if (hidden) rest.style = merge(rest.style || {}, { display: 'none' });
    if (length) return React.createElement(UseTag, __assign({}, rest), children, canAdd ? React.createElement(AddButton, __assign({ onClick: onClick }, addButtonRest)) : '');else return React.createElement(UseTag, __assign({}, rest), React.createElement(Empty, __assign({}, emptyRest), canAdd ? React.createElement(AddButton, __assign({ onClick: onClick }, addButtonRest)) : ''));
}
/////////////////////////////////////////////
//  FField class
/////////////////////////////////////////////
function getFieldProps(presets) {
    var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var presetName = arguments[2];
    var name = arguments[3];
    var methodBindObject = arguments[4];

    function getWidgetBefore(widgetsArray) {
        var widgetsArrayNames = widgetsArray.map(function (item) {
            return item.name;
        });
        var widgetsArrayCode = widgetsArray.map(function (item) {
            return item.toString();
        });
        return function (widget) {
            var a = widgetsArray.indexOf(widget);
            if (~a) return widgetsArray[a - 1];
            a = widgetsArrayNames.indexOf(widget.name);
            if (~a) return widgetsArray[a - 1];
            if (widgetsArrayCode) a = widgetsArrayCode.indexOf(widget.toString());
            if (~a) return widgetsArray[a - 1];
            return;
        };
    }
    function getPropBefore(presetArray) {
        var cache = {};
        return function (prop, path2prop) {
            var propPath = pathOrString2path(path2prop);
            var propString = path2string(propPath);
            if (!cache[propString]) cache[propString] = getArrayOfPropsFromArrayOfObjects(presetArray, propPath);
            var a = cache[propString].indexOf(prop);
            if (~a) return cache[propString][a - 1];
        };
    }
    function chainMethods(result) {
        var track = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['#'];

        methodBindObject.methods2chain.forEach(function (methodName) {
            var methods = getArrayOfPropsFromArrayOfObjects(presetArray, track.concat(methodName));
            var methods_rev = getArrayOfPropsFromArrayOfObjects(presetArray, track.concat('$' + methodName));
            methods_rev.reverse();
            methods = methods_rev.concat(methods);
            var prevMethod = methodBindObject.funcs[methodName];
            if (!methods.length) return;
            for (var i = 0; i < methods.length; i++) {
                var bindObj = __assign({}, methodBindObject);
                if (prevMethod) bindObj[methodName] = prevMethod;
                methods[i] = methods[i].bind(bindObj);
                prevMethod = methods[i];
            }
            result = merge(result, makeSlice(methodName, methods.pop()));
            result = merge(result, makeSlice('$' + methodName, SymbolDelete), { del: true });
        });
        objKeys(result).forEach(function (key) {
            return isObject(result[key]) && (result[key] = chainMethods(result[key], track.concat(key)));
        });
        return result;
    }
    var presetArray = [];
    var presetNames = presetName.split(':');
    presetNames.reverse();
    presetNames.forEach(function (presetName) {
        while (true) {
            var preset = getIn(presetName[0] == '#' ? x['custom'] : presets, string2path(presetName));
            if (preset) {
                preset[name] && presetArray.push(preset[name]);
                if (!preset['_']) break;
                presetName = preset['_'];
            } else break;
        }
    });
    presetArray.push(getIn(presets, ['*', name]) || {}); // this will be first
    presetArray.reverse();
    presetArray.push(getIn(x, ['custom', name]) || {}); // and this is last
    presetArray.push(makeSlice('_', undefined));
    presetArray = replaceWidgetNamesWithFunctions(presetArray, methodBindObject.registry.objects);
    var result = name == 'Main' ? __assign({}, methodBindObject.funcs) : {};
    result = chainMethods(merge.all(result, presetArray, { del: true }));
    result[SymbolData] = {
        all: presetArray,
        getPropBefore: getPropBefore(presetArray),
        getWidgetBefore: getWidgetBefore(getArrayOfPropsFromArrayOfObjects(presetArray, 'widget')),
        getPropArray: getArrayOfPropsFromArrayOfObjects.bind(null, presetArray)
    };
    return result;
}
exports.getFieldProps = getFieldProps;

var Field = function (_react_1$Component3) {
    _inherits(Field, _react_1$Component3);

    function Field(props, context) {
        _classCallCheck(this, Field);

        // schemaProps: any = {};
        var _this5 = _possibleConstructorReturn(this, (Field.__proto__ || Object.getPrototypeOf(Field)).call(this, props, context));

        _this5.mapProps = {};
        _this5.dataProps = {};
        _this5.builderData = {};
        _this5.blocks = [];
        _this5.forceRebuild = true;
        _this5.dynEnum = {};
        _this5.fieldOptions = {};
        return _this5;
    }

    _createClass(Field, [{
        key: "focus",
        value: function focus(path) {
            var self = this;
            self.mainRef && self.mainRef.focus && self.mainRef.focus(path); // path.length ? self.mainRef.focus(path) : self.mainRef.focus();
        }
    }, {
        key: "rebuild",
        value: function rebuild(path) {
            var self = this;
            if (!path.length) {
                self.forceRebuild = true;
                self.forceUpdate();
            }
            self.mainRef && self.mainRef['rebuild'] && self.mainRef['rebuild'](path);
        }
    }, {
        key: "_build",
        value: function _build() {
            var isMultiSelect = function isMultiSelect(schema) {
                return Array.isArray(schema.items && schema.items.enum) && schema.uniqueItems;
            };
            var isFilesArray = function isFilesArray(schema) {
                return schema.items && schema.items.type === "string" && schema.items.format === "data-url";
            };
            var getPresetName = function getPresetName(schemaPart, type) {
                return type == 'array' ? isMultiSelect(schemaPart) ? 'multiselect' : isFilesArray(schemaPart) ? 'files' : 'array' : type;
            };
            var getWidget = function getWidget(objects, widget) {
                return typeof widget === 'string' ? objects.widgets && objects.widgets[widget] || widget : widget;
            };
            var getEnumOptions = function getEnumOptions(schemaPart) {
                if (!schemaPart.enum) return undefined;
                var result = [],
                    vals = schemaPart.enum,
                    names = schemaPart.enumNames || [];
                vals.forEach(function (value, i) {
                    return result[i] = { value: value, label: names[i] || value };
                });
                return result;
            };
            var self = this;
            var _self$props = self.props,
                registry = _self$props.registry,
                path = _self$props.path,
                _self$props$childrenB = _self$props.childrenBlocks,
                childrenBlocks = _self$props$childrenB === undefined ? {} : _self$props$childrenB;

            var schemaPart = getSchemaPart(registry.schema, path);
            // self.schemaPart = schemaPart;
            var type = isArr(schemaPart.type) ? schemaPart.type[0] : schemaPart.type;
            var x = schemaPart.x || {};
            // self.registry = registry;
            var objects = registry.objects;
            var presets = objects.presets;
            var presetName = x.preset || getPresetName(schemaPart, type);
            var pathValue = path.concat(SymbolData, 'values', 'current');
            var pathTouched = path.concat(SymbolData, 'status', 'touched');
            var pathString = '/' + path.join('/');
            var funcs = {};
            funcs.onChange = function (value) {
                return registry.api.setSingle(pathValue, value === "" ? undefined : value, self.liveValidate);
            };
            funcs.onBlur = function (value) {
                registry.api.setSingle(pathTouched, true, false);
                !self.liveValidate ? registry.api.validate(pathString) : null;
            };
            funcs.onFocus = function (value) {
                return registry.api.setSingle('/@/active', path, false);
            };
            var methods2chain = objKeys(objects.methods2chain).filter(function (key) {
                return objects.methods2chain[key];
            });
            self.methodBindObject = { registry: registry, path: path, schemaPart: schemaPart, field: self, funcs: funcs, methods2chain: methods2chain };
            self.builderProps = getFieldProps(presets, x, presetName, 'Builder', self.methodBindObject);
            // self.builderProps.widget = getWidget(self.builderProps.widget);
            var idPath = push2array([registry.formName], path);
            self.enumOptions = getEnumOptions(schemaPart);
            var widgets = {},
                schemaProps = {},
                preset = {};
            self.blocks = merge(childrenBlocks, getFieldProps(presets, x, presetName, 'blocks', self.methodBindObject));
            self.blocks = objKeys(self.blocks).filter(function (key) {
                return self.blocks[key];
            });
            self.blocks.forEach(function (block) {
                var _a = getFieldProps(presets, x, presetName, block, self.methodBindObject),
                    propsMap = _a.propsMap,
                    widget = _a.widget,
                    rest = __rest(_a, ["propsMap", "widget"]);
                schemaProps[block] = rest;
                self.mapProps[block] = propsMap;
                widgets[block] = widget;
                preset[block] = rest[SymbolData];
                delete rest[SymbolData];
                schemaProps[block].id = idPath.join('/');
                if (rest.refName) schemaProps[block][rest.refName] = self._getRef.bind(self);
            });
            self.fieldOptions = { field: self, funcs: funcs, widgets: widgets, schemaProps: schemaProps, preset: preset, registry: registry, path: path, schemaPart: schemaPart, childrenBlocks: getFieldProps(presets, x, presetName, 'childrenBlocks', self.methodBindObject) };
        }
        // _makeDynEnum(data: any) {
        //   const self = this;
        //   let result: any[];
        //   if (self.dynEnum['enum'] == data.enum && self.dynEnum.enumNames == data.enumNames) {
        //     result = self.dynEnum._enumOptions;
        //   } else {
        //     result = [];
        //     let vals: any[] = data.enum;
        //     let names: any[] = data.enumNames || [];
        //     for (let i = 0; i < vals.length; i++) result[i] = {value: vals[i], label: names[i] || vals[i]};
        //     self.dynEnum._enumOptions = result;
        //     self.dynEnum['enum'] = data.enum;
        //     self.dynEnum.enumNames = data.enumNames;
        //   }
        //   return result
        // }

    }, {
        key: "_getRef",
        value: function _getRef(item) {
            this.mainRef = item;
        }
    }, {
        key: "render",
        value: function render() {
            var self = this;
            if (self.forceRebuild) this._build();
            self.forceRebuild = false;
            var api = self.fieldOptions.registry.api;
            var data = api.getSingle(self.props.path.concat(SymbolData)); // self.props.data; //
            var enumOptions = self.enumOptions || data.enum; //&& self._makeDynEnum(data);
            self.liveValidate = data.params && data.params._liveValidate;
            var dataProps = {};
            self.blocks.forEach(function (block) {
                return dataProps[block] = mapProps(self.mapProps[block], data, self.methodBindObject);
            });
            self.dataProps = merge(self.dataProps, dataProps);
            var _a = self.builderProps,
                BuilderWidget = _a.widget,
                builderPropsMap = _a.propsMap,
                restProps = __rest(_a, ["widget", "propsMap"]);
            if (restProps.refName) restProps[restProps.refName] = self._getRef.bind(self);
            var builderDataProps = mapProps(builderPropsMap, data, self.methodBindObject);
            self.builderData = merge(self.builderData, builderDataProps);
            return React.createElement(BuilderWidget, __assign({ enumOptions: enumOptions }, restProps, self.builderData, { fieldOptions: self.fieldOptions, dataProps: self.dataProps, dataTree: api.getSingle(self.props.path) }));
        }
    }]);

    return Field;
}(react_1.Component);

function mapProps(map, data, bindObject) {
    if (!map) return {};
    var result = {};
    var keys = objKeys(map).filter(function (key) {
        return map[key];
    });
    keys.forEach(function (to) {
        var item = map[to];
        if (!isArr(item)) item = [item];
        var value = getIn(data, string2path(item[0]));
        var fn = item[1];
        var path = string2path(to);
        var key = path.pop();
        var obj = getByKey(result, path);
        obj[key] = fn ? fn.bind(bindObject)(value) : value;
    });
    return result;
}
/////////////////////////////////////////////
//  Basic components
/////////////////////////////////////////////
function Unsupported(props) {
    return React.createElement("div", null, "Unsupported");
}
function DefaultBuilder(props) {
    var hidden = props.hidden,
        omit = props.omit,
        dataProps = props._dataProps,
        rest = __rest(props, ["hidden", "omit", "_dataProps"]);

    if (omit) return false;
    var fieldOptions = props.fieldOptions;
    var widgets = fieldOptions.widgets,
        schemaProps = fieldOptions.schemaProps;
    var Title = widgets.Title,
        Body = widgets.Body,
        Main = widgets.Main,
        Message = widgets.Message,
        Groups = widgets.Groups,
        Layout = widgets.Layout,
        ArrayItem = widgets.ArrayItem,
        Array = widgets.Array,
        Autosize = widgets.Autosize;

    var field = React.createElement(Layout, __assign({ hidden: hidden }, schemaProps['Layout'], dataProps['Layout']), React.createElement(Title, __assign({}, schemaProps['Title'], dataProps['Title'])), React.createElement(Body, __assign({}, schemaProps['Body'], dataProps['Body']), React.createElement(Main, __assign({}, schemaProps['Main'], dataProps['Main'], rest)), React.createElement(Message, __assign({}, schemaProps['Message'], dataProps['Message'])), Autosize ? React.createElement(Autosize, __assign({ hidden: hidden }, schemaProps['Autosize'], dataProps['Autosize'], { fieldOptions: fieldOptions })) : ''));
    if (Array) field = React.createElement(Array, __assign({ hidden: hidden }, schemaProps['Array'], dataProps['Array'], { fieldOptions: fieldOptions }), field);
    if (ArrayItem && dataProps['Main'].itemData) field = React.createElement(ArrayItem, __assign({ hidden: hidden }, schemaProps['ArrayItem'], dataProps['ArrayItem'], { fieldOptions: fieldOptions }), field);
    return field;
}
// function LayoutBlock(props: any): any {
//   let {style, flexFlow, flex, alignItems, display, hidden, useTag: UseTag = 'div', children, id, ...rest} = props;
//   if (hidden) rest.style = merge(rest.style || {}, {display: 'none'});
//   return (
//     <UseTag style={style} {...rest}>
//       {children}
//     </UseTag>
//   )
// }
function DivBlock(props) {
    var id = props.id,
        _props$useTag2 = props.useTag,
        UseTag = _props$useTag2 === undefined ? 'div' : _props$useTag2,
        hidden = props.hidden,
        children = props.children,
        rest = __rest(props, ["id", "useTag", "hidden", "children"]);

    if (hidden) rest.style = merge(rest.style || {}, { visibility: 'hidden', height: 0 }); // merge(rest.style || {}, {display: 'none'});
    return React.createElement(UseTag, __assign({}, rest), children);
}
var sizerStyle = { position: 'absolute', top: 0, left: 0, visibility: 'hidden', height: 0, overflow: 'scroll', whiteSpace: 'pre' };

var AutosizeBlock = function (_React$Component) {
    _inherits(AutosizeBlock, _React$Component);

    function AutosizeBlock() {
        _classCallCheck(this, AutosizeBlock);

        return _possibleConstructorReturn(this, (AutosizeBlock.__proto__ || Object.getPrototypeOf(AutosizeBlock)).apply(this, arguments));
    }

    _createClass(AutosizeBlock, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this7 = this;

            var style = window && window.getComputedStyle(this.props.fieldOptions.field.mainRef);
            if (!style || !this.elem) return;
            ['fontSize', 'fontFamily', 'fontWeight', 'fontStyle', 'letterSpacing'].forEach(function (key) {
                return _this7.elem.style[key] = style[key];
            });
        }
    }, {
        key: "render",
        value: function render() {
            var self = this;
            var props = self.props;
            var value = (isUndefined(props.value) ? '' : props.value.toString()) || props.placeholder || '';
            return React.createElement("div", { style: sizerStyle, ref: function ref(elem) {
                    (self.elem = elem) && (props.fieldOptions.field.mainRef.style.width = elem.scrollWidth + (props.addWidth || 45) + 'px');
                } }, value);
        }
    }]);

    return AutosizeBlock;
}(React.Component);
// props.fieldOptions.field.mainRef


function TitleBlock(props) {
    var id = props.id,
        _props$title = props.title,
        title = _props$title === undefined ? '' : _props$title,
        required = props.required,
        _props$useTag3 = props.useTag,
        UseTag = _props$useTag3 === undefined ? 'label' : _props$useTag3,
        requireSymbol = props.requireSymbol,
        emptyTitle = props.emptyTitle,
        rest = __rest(props, ["id", "title", "required", "useTag", "requireSymbol", "emptyTitle"]);

    return React.createElement(UseTag, __assign({}, UseTag == 'label' ? { htmlFor: id } : {}, rest), emptyTitle ? typeof emptyTitle == 'string' ? emptyTitle : '' : required ? title + requireSymbol : title);
}
function BaseInput(props) {
    var value = props.value,
        UseTag = props.useTag,
        _props$type = props.type,
        type = _props$type === undefined ? 'text' : _props$type,
        title = props.title,
        dataTree = props.dataTree,
        fieldOptions = props.fieldOptions,
        enumOptions = props._enumOptions,
        refName = props.refName,
        rest = __rest(props, ["value", "useTag", "type", "title", "dataTree", "fieldOptions", "_enumOptions", "refName"]);

    UseTag = UseTag || (type == 'textarea' || type == 'select' ? type : 'input');
    var refObj = {};
    var ref = rest[refName];
    if (refName) delete rest[refName];
    if (typeof UseTag == 'string') refObj.ref = ref;else refObj[refName] = ref;
    var commonProps = { name: props.id, label: title || props.id.split('/').slice(-1)[0] }; //, onFocus: onFocus.bind(props), _onChange: _onChange.bind(props), onBlur: onBlur.bind(props)};
    var valueObj = {};
    if (type === 'checkbox') valueObj.checked = isUndefined(value) ? false : value;else if (type === 'tristate') valueObj.checked = value;else valueObj.value = isUndefined(value) ? "" : value;
    if (type === 'textarea') return React.createElement(UseTag, __assign({}, rest, refObj, commonProps), valueObj.value);
    if (type === 'select') {
        var placeholder = rest.placeholder,
            selectRest = __rest(rest, ["placeholder"]);
        return React.createElement(UseTag, __assign({}, selectRest, refObj, commonProps, { value: isUndefined(value) ? props.multiple ? [] : "" : value }), !props.multiple && placeholder && React.createElement("option", { value: "" }, placeholder), enumOptions.map(function (_ref, i) {
            var value = _ref.value,
                label = _ref.label;
            return React.createElement("option", { key: i, value: value }, label);
        }));
    } // {_enumOptions.map(({value, name}:any, i: number) => <option key={i} value={value}>{name}</option>)}
    else return React.createElement(UseTag, __assign({}, rest, refObj, valueObj, { type: type }, commonProps));
}
;
function ArrayInput(props) {
    function selectValue(value, selected, all) {
        var at = all.indexOf(value);
        var updated = selected.slice(0, at).concat(value, selected.slice(at));
        return updated.sort(function (a, b) {
            return all.indexOf(a) > all.indexOf(b);
        }); // reorder the updated selection to match the initial order
    }
    function deselectValue(value, selected) {
        return selected.filter(function (v) {
            return v !== value;
        });
    }

    var value = props.value,
        _props$useTag4 = props.useTag,
        UseTag = _props$useTag4 === undefined ? 'div' : _props$useTag4,
        type = props.type,
        title = props.title,
        onFocus = props.onFocus,
        onBlur = props.onBlur,
        _onChange = props.onChange,
        dataTree = props.dataTree,
        fieldOptions = props.fieldOptions,
        enumOptions = props._enumOptions,
        refName = props.refName,
        autofocus = props.autofocus,
        disabled = props.disabled,
        disabledClass = props.disabledClass,
        inputProps = props.inputProps,
        labelProps = props.labelProps,
        stackedProps = props.stackedProps,
        rest = __rest(props, ["value", "useTag", "type", "title", "onFocus", "onBlur", "onChange", "dataTree", "fieldOptions", "_enumOptions", "refName", "autofocus", "disabled", "disabledClass", "inputProps", "labelProps", "stackedProps"]);

    type = fieldOptions.schemaPart.type == 'array' ? 'checkbox' : 'radio';
    var name = props.id;
    var ref = rest[refName];
    if (refName) delete rest[refName];

    var _inputProps$useTag = inputProps.useTag,
        InputUseTag = _inputProps$useTag === undefined ? 'input' : _inputProps$useTag,
        restInput = __rest(inputProps, ["useTag"]);

    var _labelProps$useTag = labelProps.useTag,
        LabelUseTag = _labelProps$useTag === undefined ? 'label' : _labelProps$useTag,
        restLabel = __rest(labelProps, ["useTag"]);

    var stacked = !!stackedProps;
    if (!stackedProps) stackedProps = {};

    var _stackedProps = stackedProps,
        _stackedProps$useTag = _stackedProps.useTag,
        StackedlUseTag = _stackedProps$useTag === undefined ? 'div' : _stackedProps$useTag,
        restStacked = __rest(stackedProps, ["useTag"]);

    return React.createElement(UseTag, __assign({}, rest), enumOptions && enumOptions.map(function (option, i) {
        var addClass = disabled ? disabledClass : "";
        var input = void 0;
        if (type == 'radio') {
            var checked = option.value === value; // checked={checked} has been moved above name={name}, this is a temporary fix for radio button rendering bug in React, facebook/react#7630.
            input = React.createElement(InputUseTag, __assign({ type: type, checked: checked, id: name + "/" + i, name: name, value: option.value, disabled: disabled, autoFocus: autofocus && i === 0, onFocus: onFocus, onBlur: onBlur, onChange: function onChange(event) {
                    _onChange(option.value);
                } }, restInput));
        } else {
            var _checked = value.indexOf(option.value) !== -1;
            input = React.createElement(InputUseTag, __assign({ type: type, checked: _checked, id: name + "/" + i, name: name + "/" + i, disabled: disabled, autoFocus: autofocus && i === 0, onFocus: onFocus.bind(props), onBlur: onBlur.bind(props), onChange: function onChange(event) {
                    var all = enumOptions.map(function (_ref2) {
                        var value = _ref2.value;
                        return value;
                    });
                    if (event.target.checked) props.funcs.onChange(selectValue(option.value, value, all));else props.funcs.onChange(deselectValue(option.value, value));
                } }, restInput));
        }
        if (addClass) {
            var _obj = stacked ? restStacked : restLabel;
            _obj.className = (_obj.className || "" + " " + addClass).trim();
        }
        return stacked ? React.createElement(StackedlUseTag, __assign({ key: i }, restStacked), React.createElement(LabelUseTag, __assign({}, restLabel), input, React.createElement("span", null, option.label))) : React.createElement(LabelUseTag, __assign({ key: i }, restLabel), input, React.createElement("span", null, option.label));
    }));
}
function CheckboxInput(props) {
    var labelProps = props.labelProps,
        rest = __rest(props, ["labelProps"]);
    return React.createElement("label", __assign({}, labelProps), React.createElement(BaseInput, __assign({}, rest)), React.createElement("span", null, props.title));
}
function MessageBlock(props) {
    var _props$useTag5 = props.useTag,
        UseTag = _props$useTag5 === undefined ? 'div' : _props$useTag5,
        messageItem = props.messageItem,
        _props$messages = props.messages,
        messages = _props$messages === undefined ? {} : _props$messages,
        _props$itemsProps = props.itemsProps,
        itemsProps = _props$itemsProps === undefined ? {} : _props$itemsProps,
        id = props.id,
        rest = __rest(props, ["useTag", "messageItem", "messages", "itemsProps", "id"]);

    var WidgetMessageItem = messageItem.widget,
        restMessageItem = __rest(messageItem, ["widget"]);
    var keys = objKeys(messages);
    var result = [];
    var mergedMessages = merge(messages, itemsProps);
    keys.sort(function (a, b) {
        return parseFloat(a) - parseFloat(b);
    });
    keys.forEach(function (key) {
        if (mergedMessages[key].hiddenBind === true || mergedMessages[key].hidden || !mergedMessages[key].textArray.length) return;
        result.push(React.createElement(WidgetMessageItem, __assign({ key: key, message: mergedMessages[key] }, restMessageItem)));
    });
    return React.createElement(UseTag, __assign({}, rest), result);
}
function MessageItem(props) {
    var _props$useTag6 = props.useTag,
        UseTag = _props$useTag6 === undefined ? 'div' : _props$useTag6,
        message = props.message,
        rest = __rest(props, ["useTag", "message"]);
    //color={message.type}


    return React.createElement(UseTag, __assign({}, rest), message.textArray.join(React.createElement("br", null)));
}
function EmptyArray(props) {
    var _props$useTag7 = props.useTag,
        UseTag = _props$useTag7 === undefined ? 'div' : _props$useTag7,
        _props$text = props.text,
        text = _props$text === undefined ? 'This array is empty.' : _props$text,
        rest = __rest(props, ["useTag", "text"]);

    return React.createElement(UseTag, __assign({}, rest), text, " ", props.children);
}
function AddButtonBlock(props) {
    var _props$useTag8 = props.useTag,
        UseTag = _props$useTag8 === undefined ? 'button' : _props$useTag8,
        _props$text2 = props.text,
        text = _props$text2 === undefined ? 'Add new item' : _props$text2,
        _props$type2 = props.type,
        type = _props$type2 === undefined ? 'button' : _props$type2,
        rest = __rest(props, ["useTag", "text", "type"]);

    return React.createElement(UseTag, __assign({ type: type }, rest), text);
}
function ItemMenu(props) {
    var _props$useTag9 = props.useTag,
        UseTag = _props$useTag9 === undefined ? 'div' : _props$useTag9,
        _props$buttonProps = props.buttonProps,
        buttonProps = _props$buttonProps === undefined ? {} : _props$buttonProps,
        buttons = props.buttons,
        itemData = props.itemData,
        fieldOptions = props.fieldOptions,
        dataTree = props.dataTree,
        rest = __rest(props, ["useTag", "buttonProps", "buttons", "itemData", "fieldOptions", "dataTree"]);

    if (!itemData) return false;
    var canUp = itemData.canUp,
        canDown = itemData.canDown,
        canDel = itemData.canDel;
    var path = fieldOptions.path,
        registry = fieldOptions.registry;

    var api = registry.api;

    var _buttonProps$useTag = buttonProps.useTag,
        UseButtonTag = _buttonProps$useTag === undefined ? 'button' : _buttonProps$useTag,
        _buttonProps$type = buttonProps.type,
        type = _buttonProps$type === undefined ? 'button' : _buttonProps$type,
        _onClick = buttonProps.onClick,
        titles = buttonProps.titles,
        restButton = __rest(buttonProps, ["useTag", "type", "onClick", "titles"]);

    var canChecks = { 'first': canUp, 'last': canDown, 'up': canUp, 'down': canDown, 'del': canDel };
    buttons.forEach(function (key) {
        return delete rest[key];
    });
    return React.createElement(UseTag, __assign({}, rest), buttons.map(function (key) {
        var KeyWidget = props[key];
        if (KeyWidget === false || canChecks[key] === undefined) return '';
        return React.createElement(UseButtonTag, __assign({ key: key, type: type, title: titles && titles[key] ? titles[key] : key, "data-bType": key, disabled: !canChecks[key] }, restButton, { onClick: function onClick() {
                return _onClick(key);
            } }), typeof KeyWidget === 'function' ? React.createElement(KeyWidget, null) : KeyWidget || key);
    }));
}
function ArrayItem(props) {
    if (!props.itemData) return React.Children.only(props.children);

    var children = props.children,
        hidden = props.hidden,
        itemMain = props.itemMain,
        itemBody = props.itemBody,
        itemMenu = props.itemMenu,
        rest = __rest(props, ["children", "hidden", "itemMain", "itemBody", "itemMenu"]);

    var _a = itemMain || {},
        _a$widget3 = _a.widget,
        Item = _a$widget3 === undefined ? 'div' : _a$widget3,
        itemRest = __rest(_a, ["widget"]);var _b = itemBody || {},
        _b$widget = _b.widget,
        ItemBody = _b$widget === undefined ? 'div' : _b$widget,
        itemBodyRest = __rest(_b, ["widget"]);var _c = itemMenu || {},
        _c$widget = _c.widget,
        ItemMenu = _c$widget === undefined ? 'div' : _c$widget,
        itemMenuRest = __rest(_c, ["widget"]);
    if (hidden) itemRest.style = merge(itemRest.style || {}, { display: 'none' });
    return React.createElement(Item, __assign({}, itemRest), React.createElement(ItemBody, __assign({}, itemBodyRest), React.Children.only(children)), React.createElement(ItemMenu, __assign({}, itemMenuRest, rest)));
}
function CombineWidgets(props) {
    function processWidget(key) {
        if (skip[key]) return false;
        var _a = this[key],
            Widget = _a.widget,
            _a$inner = _a.inner,
            inner = _a$inner === undefined ? {} : _a$inner,
            _a$innerProps = _a.innerProps,
            innerProps = _a$innerProps === undefined ? [] : _a$innerProps,
            _a$addProps = _a.addProps,
            addProps = _a$addProps === undefined ? [] : _a$addProps,
            _a$extractProps = _a.extractProps,
            extractProps = _a$extractProps === undefined ? [] : _a$extractProps,
            rest = __rest(_a, ["widget", "inner", "innerProps", "addProps", "extractProps"]);var InnerWidget = inner.widget,
            restInner = __rest(inner, ["widget"]);
        var widgetProps = {},
            innerWidgetProps = {};
        addProps.forEach(function (propName) {
            return widgetProps[propName] = props[propName];
        });
        innerProps.forEach(function (propName) {
            return innerWidgetProps[propName] = props[propName];
        });
        push2array(props2remove, extractProps);
        return InnerWidget ? React.createElement(Widget, __assign({ key: key }, widgetProps, rest), React.createElement(InnerWidget, __assign({}, innerWidgetProps, restInner))) : React.createElement(Widget, __assign({ key: key }, widgetProps, rest));
    }

    var Widget = props.widget,
        _props$before = props.before,
        before = _props$before === undefined ? {} : _props$before,
        _props$after = props.after,
        after = _props$after === undefined ? {} : _props$after,
        _props$skip = props.skip,
        skip = _props$skip === undefined ? {} : _props$skip,
        Layout = props.Layout,
        rest = __rest(props, ["widget", "before", "after", "skip", "Layout"]);

    var PrevWidget = props.fieldOptions.preset['Main'].getWidgetBefore(CombineWidgets);
    var LayoutWidget = Layout.widget,
        layoutRest = __rest(Layout, ["widget"]);
    var props2remove = [];
    var beforeWidgets = objKeys(before).sort().map(processWidget.bind(before));
    var afterWidgets = objKeys(after).sort().map(processWidget.bind(after));
    props2remove.forEach(function (key) {
        return delete rest[key];
    });
    return React.createElement(LayoutWidget, __assign({}, layoutRest), beforeWidgets, React.createElement(PrevWidget, __assign({}, rest)), afterWidgets);
}
function selectorOnChange(asTabs) {
    return function (value) {
        var _this8 = this;

        var api = this.registry.api;
        api.startBatch();
        this.onChange(value);
        var vals = void 0;
        if (isArr(value)) vals = value.slice();else vals = [value];
        var path = this.path.slice();
        var selectorField = path.pop();
        var stringPath = path2string(path);
        vals = vals.filter(function (key) {
            return _this8.registry.api.getSingle(stringPath + '/' + key);
        });
        vals.push(selectorField);
        if (asTabs) api.showOnly(stringPath + '/' + vals.join(','));else api.selectNshow(stringPath + '/' + vals.join(','));
        api.execBatch();
    };
}
function onSelectChange(event) {
    function processSelectValue(_ref3, value) {
        var type = _ref3.type,
            items = _ref3.items;

        if (value === "") return undefined;else if (type === "array" && items && (items.type == "number" || items.type == "integer")) return value.map(asNumber);else if (type === "boolean") return value === "true";else if (type === "number") return asNumber(value);
        return value;
    }
    function getSelectValue(event, multiple) {
        if (multiple) return [].slice.call(event.target.options).filter(function (item) {
            return item.selected;
        }).map(function (item) {
            return item.value;
        });else return event.target.value;
    }
    this.onChange(processSelectValue(this.field.fieldOptions.schemaPart, getSelectValue(event, this.field.fieldOptions.schemaProps['Main'].multiple)));
}
function getArrayOfPropsFromArrayOfObjects(arr, propPath) {
    propPath = pathOrString2path(propPath);

    var _loop3 = function _loop3(i) {
        arr = arr.filter(function (item) {
            return item.hasOwnProperty(propPath[i]);
        }).map(function (item) {
            return item[propPath[i]];
        });
        if (!arr.length) return "break";
    };

    for (var i = propPath[0] == '#' ? 1 : 0; i < propPath.length; i++) {
        var _ret6 = _loop3(i);

        if (_ret6 === "break") break;
    }
    return arr;
}
function TristateBox(props) {
    var self = this;

    var checked = props.checked,
        _onChange2 = props.onChange,
        nullValue = props.nullValue,
        getRef = props.getRef,
        type = props.type,
        rest = __rest(props, ["checked", "onChange", "nullValue", "getRef", "type"]);

    return React.createElement("input", __assign({ type: "checkbox", checked: checked === true }, rest, { onChange: function onChange(event) {
            _onChange2(checked === nullValue ? false : checked === false ? true : nullValue, event);
        }, ref: function ref(elem) {
            getRef && getRef(elem);
            elem && (elem.indeterminate = checked === nullValue);
        } }));
}
/////////////////////////////////////////////
//  basicObjects
/////////////////////////////////////////////
var basicObjects = {
    extend: function extend(obj) {
        return merge(this, obj);
    },
    types: ['string', 'number', 'object', 'array', 'boolean', 'null'],
    methods2chain: {
        'onBlur': true, 'onMouseOver': true, 'onChange': true, 'onSelect': true, 'onClick': true, 'onSubmit': true, 'onFocus': true, 'onUnload': true, 'onLoad': true
    },
    widgets: {
        CombineWidgets: CombineWidgets,
        Builder: DefaultBuilder,
        Array: ArrayBlock,
        ArrayItem: ArrayItem,
        EmptyArray: EmptyArray,
        AddButton: AddButtonBlock,
        ItemMenu: ItemMenu,
        Title: TitleBlock,
        Messages: MessageBlock,
        MessageItem: MessageItem,
        BaseInput: BaseInput,
        CheckboxInput: CheckboxInput,
        ArrayInput: ArrayInput,
        Section: Section,
        DivBlock: DivBlock,
        AutosizeBlock: AutosizeBlock
    },
    presets: {
        '*': {
            blocks: { 'Title': true, 'Body': true, 'Main': true, 'Message': true, 'Layout': true, 'ArrayItem': true, 'Autosize': false },
            // childrenBlocks: {},
            Autosize: {
                widget: 'AutosizeBlock',
                propsMap: {
                    value: ['values', getValue],
                    placeholder: 'params/placeholder'
                }
            },
            Array: {
                widget: 'Array',
                empty: { widget: 'EmptyArray' },
                addButton: { widget: 'AddButton' },
                propsMap: {
                    length: ['array/lengths', getValue],
                    canAdd: 'array/canAdd'
                }
            },
            ArrayItem: {
                widget: 'ArrayItem',
                itemMenu: {
                    widget: 'ItemMenu',
                    buttons: ['first', 'last', 'up', 'down', 'del'],
                    buttonProps: { onClick: function onClick(key) {
                            this.registry.api.arrayItemOps(this.path, key);
                        } }
                },
                propsMap: { itemData: 'arrayItem' }
            },
            Builder: {
                widget: 'Builder',
                propsMap: {
                    hidden: ['controls', function (controls) {
                        return getBindedValue(controls, 'hidden');
                    }]
                }
            },
            Group: {
                widget: 'DivBlock',
                className: 'fform-group-block'
            },
            Layout: {
                widget: 'DivBlock',
                className: 'fform-layout-block'
            },
            Body: {
                widget: 'DivBlock',
                className: 'fform-body-block'
            },
            Title: {
                widget: 'Title',
                useTag: 'label',
                requireSymbol: '*',
                propsMap: {
                    required: 'schemaData/required',
                    title: 'schemaData/title'
                }
            },
            Message: {
                widget: 'Messages',
                propsMap: {
                    messages: 'messages',
                    'itemsProps/0/hidden': ['status/touched', not],
                    'itemsProps/1/hidden': ['status/touched', not],
                    'itemsProps/2/hidden': 'status/pristine'
                },
                messageItem: {
                    widget: 'MessageItem'
                }
            },
            Main: {
                widget: 'BaseInput',
                refName: 'getRef',
                propsMap: {
                    value: ['values', getValue],
                    autoFocus: 'params/autofocus',
                    placeholder: 'params/placeholder',
                    required: 'schemaData/required',
                    title: 'schemaData/title',
                    readOnly: ['controls', function (controls) {
                        return getBindedValue(controls, 'readonly');
                    }],
                    disabled: ['controls', function (controls) {
                        return getBindedValue(controls, 'disabled');
                    }]
                }
            }
        },
        base: { Main: { onChange: function onChange(event) {
                    this.onChange(event.target.value);
                } } },
        string: { _: 'base', Main: { type: 'text' } },
        number: { _: 'base', Main: { type: 'number' } },
        integer: { _: 'number' },
        range: { _: 'base', Main: { type: 'range' } },
        'null': { Main: { type: 'hidden' } },
        booleanBase: {
            Main: {
                type: 'checkbox',
                onChange: function onChange(event) {
                    this.onChange(event.target.checked);
                }
            }
        },
        boolean: {
            _: 'booleanBase',
            Main: {
                widget: 'CheckboxInput'
            },
            Title: { emptyTitle: true }
        },
        tristateBase: {
            Main: {
                type: 'tristate',
                useTag: TristateBox
            }
        },
        tristate: {
            _: 'tristateBase',
            Main: {
                widget: 'CheckboxInput'
            },
            Title: { emptyTitle: true }
        },
        object: {
            blocks: { 'Group': true },
            Main: {
                widget: 'Section',
                refName: 'ref',
                propsMap: {
                    value: false,
                    autoFocus: false,
                    placeholder: false,
                    required: false,
                    title: false,
                    readOnly: false,
                    disabled: false
                }
            },
            Layout: { useTag: 'fieldset' },
            Title: { useTag: 'legend' }
        },
        array: {
            _: 'object',
            blocks: { 'Array': true },
            Main: { propsMap: { length: ['array/lengths', getValue] } },
            Layout: { useTag: 'fieldset' },
            Title: { useTag: 'legend' }
        },
        inlineTitle: {
            Layout: {
                style: { flexFlow: 'row' }
            }
        },
        select: { Main: { type: 'select', onChange: onSelectChange } },
        multiselect: { _: 'select', Main: { multiply: true } },
        arrayOf: {
            Main: {
                widget: 'ArrayInput',
                inputProps: {},
                labelProps: {},
                stackedProps: {},
                disabledClass: 'disabled'
            }
        },
        inlineItems: { Main: { stackedProps: false } },
        buttons: { Main: { inputProps: { className: 'button' }, labelProps: { className: 'button' } } },
        radio: { _: 'arrayOf', Main: { type: 'radio' } },
        checkboxes: { _: 'arrayOf', Main: { type: 'checkbox' }, fields: { 'Group': false, 'Array': false } },
        selector: { Main: { onChange: selectorOnChange(false) } },
        tabs: { Main: { onChange: selectorOnChange(true) } },
        autosize: {
            blocks: { 'Autosize': true },
            Layout: { style: { flexGrow: 0 } }
        }
    },
    presetMap: {
        boolean: ['select', 'radio'],
        string: ['select', 'password', 'email', 'hostname', 'ipv4', 'ipv6', 'uri', 'data-url', 'radio', 'textarea', 'hidden', 'date', 'datetime', 'date-time', 'color', 'file'],
        number: ['select', 'updown', 'range', 'radio'],
        integer: ['select', 'updown', 'range', 'radio'],
        array: ['select', 'checkboxes', 'files']
    },
    presetsCombine: {
        radio: [['selector', 'tabs'], 'inline', 'buttons'],
        checkboxes: [['selector', 'tabs'], 'inline', 'buttons'],
        select: ['selector', 'tabs']
    }
};
exports.basicObjects = basicObjects;
/////////////////////////////////////////////
//  Actions function
/////////////////////////////////////////////
function makeValidation(dispath) {
    function addValidatorResult2message(srcMessages, track, result) {
        var defLevel = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        function conv(item) {
            return (typeof item === "undefined" ? "undefined" : _typeof2(item)) === 'object' ? item : { level: defLevel, text: item };
        }
        ;
        var colors = ['', 'success', 'warning', 'danger']; // in order of importance, higher index owerwrite lower
        if (isObject(result)) objKeys(result).forEach(function (key) {
            return addValidatorResult2message(srcMessages, track.concat(key), result[key], defLevel);
        });else {
            var messages = isArr(result) ? result.map(conv) : [conv(result)];
            messages.forEach(function (item) {
                var level = item.level,
                    text = item.text,
                    path = item.path,
                    replace = item.replace,
                    _item$type = item.type,
                    type = _item$type === undefined ? 'danger' : _item$type,
                    rest = __rest(item, ["level", "text", "path", "replace", "type"]);

                path = track.concat((typeof path === 'string' ? string2path(path) : path) || []);
                var fullPath = path2string(path, ['messages', level]);
                var mData = getByKey(srcMessages, fullPath, { textArray: [] });
                mData = getByKey(validationMessages, fullPath, mData);
                if (text) {
                    if (replace === undefined) mData.textArray.push(text);else mData.textArray[replace] = text;
                }
                Object.assign(mData, rest);
                var shortPath = path2string(path);
                if (type == 'danger') {
                    var valid = validStatus[shortPath];
                    if (isUndefined(valid) || valid || mData.textArray.length) validStatus[shortPath] = !mData.textArray.length; // "false" overwrite null, true, undefined and never owerwritten
                } // "null" owerwrites true, undefined and owerwritten by false, "true" owerwrites undefined and owerwritten by false and null
                if (isUndefined(colorStatus[shortPath])) colorStatus[shortPath] = '';
                if (mData.textArray.length && colors.indexOf(colorStatus[shortPath]) < colors.indexOf(type)) colorStatus[shortPath] = ~colors.indexOf(type) ? type : '';
            });
        }
    }
    function recurseValidation(curValues, modifiedValues) {
        var track = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

        var data = getIn(state, track.concat([SymbolData]));
        if (!data) return;
        var schemaPart = getSchemaPart(schema, track);
        if (schemaPart.type == 'object' || schemaPart.type == 'array') modifiedValues && objKeys(modifiedValues).forEach(function (key) {
            return recurseValidation(curValues[key], modifiedValues[key], track.concat(key));
        });
        var x = schemaPart.x;
        if (x && x.validators) {
            x.validators.forEach(function (validator) {
                var result = validator({ utils: utils, state: state, path: track, schemaPart: schemaPart, schema: schema }, curValues);
                // if (!result) return;
                if (result && result.then && typeof result.then === 'function') {
                    result.vData = { curValues: curValues, path: track };
                    promises.push(result);
                    pendingStatus[path2string(track)] = true;
                } else addValidatorResult2message(validationMessages, track, result, 1);
            });
        }
    }
    function sendMessages2State() {
        objKeys(validationMessages).forEach(function (pathString) {
            var item = makePathItem(pathString);
            item.value = validationMessages[pathString];
            validationUpdates.push(item);
        });
        objKeys(validStatus).forEach(function (pathString) {
            return validationUpdates.push({ path: string2path(pathString), keyPath: ['status', 'valid'], value: validStatus[pathString] });
        });
        objKeys(pendingStatus).forEach(function (pathString) {
            return validationUpdates.push({ path: string2path(pathString), keyPath: ['status', 'pending'], value: pendingStatus[pathString] });
        });
        objKeys(colorStatus).forEach(function (pathString) {
            return validationUpdates.push({ path: string2path(pathString), keyPath: ['status', 'color'], value: colorStatus[pathString] });
        });
        if (validationUpdates.length) dispath({
            type: actionName4setItems,
            items: validationUpdates,
            stuff: stuff
        });
    }
    function clearDefaultMessages(modifiedValues) {
        var track = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        var data = getIn(state, track.concat([SymbolData]));
        if (!data) return;
        if (data.schemaData.type == 'object' || data.schemaData.type == 'array') modifiedValues && objKeys(modifiedValues).forEach(function (key) {
            return clearDefaultMessages(modifiedValues[key], track.concat(key));
        });
        addValidatorResult2message(validationMessages, track); // sets empty array for 0-level messages
    }
    var stuff = this.stuff,
        force = this.force;
    var JSONValidator = stuff.JSONValidator,
        schema = stuff.schema,
        getState = stuff.getState;

    var oldState = getState();
    // console.time('validation dispath 1');
    if (force) oldState = null; // force validate without changing
    else dispath(this);
    // console.timeEnd('validation dispath 1');
    var state = getState();
    if (oldState == state) return Promise.resolve(); // no changes, no validation
    var newValues = state[SymbolData]['currentValue'];
    var validStatus = {};
    var pendingStatus = {};
    var colorStatus = {};
    var validationMessages = {};
    var validationUpdates = [];
    var promises = [];
    var modifiedValues = force === true ? newValues : force || state[SymbolData]['currentValueChanges']; // getAsObject(newState, [SymbolData, 'values'], getValue, newState[SymbolData].changes);
    if (!modifiedValues) return Promise.resolve(); // no changes, no validation
    clearDefaultMessages(modifiedValues);
    var errs = JSONValidator(newValues);
    errs.forEach(function (item) {
        return addValidatorResult2message(validationMessages, item[0], item[1]);
    }); // Validate, using JSONSchemaValidator;
    recurseValidation(newValues, modifiedValues);
    // console.time('validation getUpdateItems4Messages');
    sendMessages2State();
    // console.timeEnd('validation getUpdateItems4Messages');
    getState()[SymbolData].changes = merge(state[SymbolData].changes, getState()[SymbolData].changes, { symbol: true }); // a little hack
    if (promises.length) {
        // let syncMessages = validationMessages;
        validationMessages = {};
        validStatus = {};
        validationUpdates = [];
        return Promise.all(promises).then(function (results) {
            var newValues = getState()[SymbolData]['currentValue'];
            for (var i = 0; i < promises.length; i++) {
                if (!results[i]) continue;
                var _promises$i$vData = promises[i].vData,
                    curValues = _promises$i$vData.curValues,
                    _path = _promises$i$vData.path;

                if (curValues == getIn(newValues, _path)) {
                    addValidatorResult2message(validationMessages, _path, results[i], 2);
                    pendingStatus[path2string(_path)] = false;
                }
            }
            sendMessages2State();
        }).catch(function (reason) {
            throw new Error(reason);
        });
    }
    return Promise.resolve();
}
var actionSetItems = function actionSetItems(items, stuff, validate) {
    var action = { type: actionName4setItems, items: items, stuff: stuff };
    return validate ? makeValidation.bind(action) : action;
};
var actionForceValidation = function actionForceValidation(force, stuff) {
    var action = { type: actionName4forceValidation, force: force, stuff: stuff };
    return makeValidation.bind(action);
};
/////////////////////////////////////////////
//  Reducer
/////////////////////////////////////////////
function formReducer(name) {
    if (name) formReducerValue = name;
    var reducersFunction = {};
    function setStateChanges(startState, action) {
        function makeSliceFromUpdateItem(item) {
            if (item.keyPath) return makeSlice(item.path, SymbolData, item.keyPath, item.value);else return makeSlice(item.path, item.value);
        }
        function setCurrentValue(state, changes) {
            return mergeState(state[SymbolData]['currentValue'], getAsObject(state, [SymbolData, 'values'], getValue, changes), { arrays: 'mergeWithLength', del: true, SymbolDelete: Symbol.for('FFormDelete') });
        }
        function mergeProcedure(prevState, newState) {
            mergeResult = mergeState(prevState, newState, options4changes);
            state = mergeResult.state;
            changes = mergeResult.changes;
            if (changes) allChanges.push(changes);
            return state;
        }
        function applyHooksProcedure(items, hookType) {
            var _loop4 = function _loop4(j) {
                var item = items[j];
                if (!isObject(getIn(state, item.path))) return "continue";
                var changes = {};
                changes.before = [];
                changes.after = [];
                changes.item = [item];

                var _loop5 = function _loop5(_i4) {
                    var res = beforeMerge[_i4](state, item, utils, stuff.schema, data, hookType);
                    if (!res) return {
                            v: {
                                v: false
                            }
                        };
                    if (isArr(res)) res = { after: res };
                    ['before', 'after'].forEach(function (key) {
                        return res[key] && push2array(changes[key], res[key]);
                    });
                    if (res.skip) changes.item = [];
                };

                for (var _i4 = 0; _i4 < beforeMerge.length; _i4++) {
                    var _ret8 = _loop5(_i4);

                    if ((typeof _ret8 === "undefined" ? "undefined" : _typeof2(_ret8)) === "object") return _ret8.v;
                }
                ['before', 'item', 'after'].forEach(function (key) {
                    return changes[key].forEach(function (item) {
                        return state = merge(state, makeSliceFromUpdateItem(item), options);
                    });
                });
            };

            for (var j = 0; j < items.length; j++) {
                var _ret7 = _loop4(j);

                switch (_ret7) {
                    case "continue":
                        continue;

                    default:
                        if ((typeof _ret7 === "undefined" ? "undefined" : _typeof2(_ret7)) === "object") return _ret7.v;
                }
            }
            afterMergeProcedureState = mergeProcedure(afterMergeProcedureState, state);
            for (var i = 0; i < afterMerge.length; i++) {
                var res = afterMerge[i](state, allChanges, utils, stuff.schema, data, hookType);
                if (!res) return false; // all changes blocked
                res.forEach(function (item) {
                    return state = merge(state, makeSliceFromUpdateItem(item), options);
                });
                afterMergeProcedureState = mergeProcedure(afterMergeProcedureState, state);
            }
            return true;
        }
        var _action$options = action.options,
            options = _action$options === undefined ? {} : _action$options,
            stuff = action.stuff,
            items = action.items;

        var allChanges = [];
        Object.assign(options, { symbol: true });
        var mergeResult = void 0,
            changes = void 0,
            state = startState,
            data = {};
        var options4changes = merge(options, { diff: true });
        var afterMergeProcedureState = startState;
        var _stuff$hooks = stuff.hooks,
            afterMerge = _stuff$hooks.afterMerge,
            beforeMerge = _stuff$hooks.beforeMerge;
        // console.time('applyHooksProcedure beforeMap');

        if (!applyHooksProcedure(items, 'beforeMap')) return startState;
        // console.timeEnd('applyHooksProcedure beforeMap');
        var apllyItems = applyMap(state, allChanges);
        if (!apllyItems) return startState; // all changes blocked
        // console.time('applyHooksProcedure afterMap');
        if (!applyHooksProcedure(apllyItems, 'afterMap')) return startState;
        // console.timeEnd('applyHooksProcedure afterMap');
        // console.time('state startState');
        if (state != startState) {
            if (allChanges.length > 1) mergeProcedure(startState, state);else changes = allChanges[0];
            state[SymbolData] = Object.assign({}, state[SymbolData]); // make new object for shallow compare
            var cur = setCurrentValue(state, changes);
            state[SymbolData]['currentValue'] = cur.state;
            state[SymbolData]['currentValueChanges'] = cur.changes;
            state[SymbolData]['version']++;
            if (state == changes) {
                changes = Object.assign({}, state);
                changes[SymbolData] = Object.assign({}, state[SymbolData]);
            }
            state[SymbolData]['changes'] = changes;
        }
        // console.timeEnd('state startState');
        return state;
    }
    function applyMap(state, changesArray) {
        var result = [];
        function recurse(state, changes) {
            var track = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ['#'];

            if (getIn(state, [SymbolData, 'dataMap'])) {
                (function () {
                    var dataObj = state[SymbolData];
                    var trackString = path2string(track);
                    objKeysAndSymbols(dataObj['dataMap']).forEach(function (keyPathFrom) {
                        var mapTo = dataObj['dataMap'][keyPathFrom];
                        var value = keyPathFrom == SymbolData ? state : getIn(dataObj, string2path(keyPathFrom));
                        objKeys(mapTo).forEach(function (key) {
                            var valueFn = mapTo[key];
                            var to = makePathItem(key, track);
                            if (keyPathFrom == SymbolData && to.keyPath) delete to.keyPath; // don't alow to map branch into data object 
                            to.value = valueFn ? valueFn.bind({ state: state, path: track, utils: utils })(value) : value;
                            if (to.keyPath && isObject(value)) {
                                object2PathValues(value).forEach(function (pathValue) {
                                    var value = pathValue.pop();
                                    var keyPath = to.keyPath.concat(pathValue);
                                    result.push({ path: to.path, keyPath: keyPath, value: value });
                                });
                            } else {
                                result.push(to);
                            }
                        });
                    });
                })();
            }
            if (isObject(changes)) objKeys(changes).forEach(function (key) {
                return recurse(state[key], changes[key], track.concat(key));
            });
        }
        changesArray.forEach(function (changes) {
            return recurse(state, changes);
        });
        return result;
    }
    // function applyUpdateHooks(stateObject: StateObjectType, additionalData: StateType, hooks: UpdateHook[], hookType: string): UpdateItem[] | false {
    //   let result: UpdateItem[] = [];
    //   if (hooks) {
    //     for (let i = 0; i < hooks.length; i++) {
    //       let res = hooks[i](stateObject, utils, additionalData, hookType);
    //       if (!res) return false; // all changes blocked
    //       res.forEach((item: any) => result.push(item))
    //     }
    //   }
    //   return result
    // }
    //
    // function applyMergeHooks(mainItem: UpdateItem, state: StateType, data: StateType, hooks: MergeHook[], hookType: string): ApplyMergeHooksResultObject | false {
    //   const changesHookNames = ['beforeThis', 'afterThis', 'beforeAll', 'afterAll'];
    //   const changesHooks = {};
    //   changesHookNames.forEach(name => changesHooks[name] = []);
    //   let changes: any[] = [];
    //   let result = true;
    //   for (let i = 0; i < hooks.length; i++) {
    //     let res = hooks[i](mainItem, state, data, utils, hookType);
    //     if (!res) return false;
    //     if (isArr(res)) res = {result: true, changes: {afterThis: res}};
    //     if (res.changes) {
    //       for (let j = 0; j < changesHookNames.length; j++) {
    //         let name = changesHookNames[j];
    //         if (res.changes[name]) res.changes[name].forEach((item: UpdateItem) => changesHooks[name].push(item));
    //       }
    //     }
    //     if (!res.result) result = false;
    //   }
    //   changesHooks['beforeThis'].forEach((item: UpdateItem) => changes.push(item));
    //   if (result) changes.push(mainItem);
    //   changesHooks['afterThis'].forEach((item: UpdateItem) => changes.push(item));
    //   return {changes, beforeAll: changesHooks['beforeAll'], afterAll: changesHooks['afterAll']}
    // }
    //
    // function processItems(state: StateType, items: UpdateItem[], stuff: any, data: StateType = {}, hookType = 'beforeMap') {
    //   let result: UpdateItem[] = [];
    //   // let data = {};
    //   let beforeAllChanges: any[] = [];
    //   let afterAllChanges: any[] = [];
    //   for (let i = 0; i < items.length; i++) {
    //     let item = items[i];
    //     // if (getIn(state, item.path) == undefined) continue;
    //     let res = applyMergeHooks(item, state, data, stuff.hooks.beforeMerge, hookType);
    //     if (res) {  // false means don't apply this change
    //       if (res.changes) res.changes.forEach((item: any) => result.push(item)); // additional changes
    //       if (res.beforeAll) res.beforeAll.forEach((item: any) => beforeAllChanges.push(item));
    //       if (res.afterAll) res.afterAll.forEach((item: any) => afterAllChanges.push(item));
    //     }
    //   }
    //   result = beforeAllChanges.concat(result, afterAllChanges);
    //   return {result: result.map(item => makeSliceFromUpdateItem(item)), data}
    // }
    //
    // reducersFunction[actionName4setDirectly] = (state: any, action: SetDirectlyType): any => {
    //   const {payload, type, ...rest} = action;
    //   return setStateChanges(state, {type: 'FFORM_EXEC_BATCH', payload: [payload], ...rest});
    //   //return setStateChanges(state, {result: [action.payload.state]}, action.payload.stuff, action.options)
    // };
    //
    // reducersFunction[actionName4execBatch] = (state: any, action: ExecBatchType): any => {
    //   return setStateChanges(state, action);
    //   // let result: any = [];
    //   // let payload = action.payload;
    //   // payload.batchedActions.forEach((action: any) => {
    //   //   if (action.type == actionName4setItems) processItems(state, action.payload, data).result.forEach((item: any) => result.push(item));
    //   //   else if (action.type == actionName4setDirectly) result.push(action.payload.state)
    //   // });
    //   // return setStateChanges(state, {result, data}, payload.stuff, action.options); // setStateChanges(mergeState(state, pathValueSlices), state);
    // };
    reducersFunction[actionName4setItems] = function (state, action) {
        return setStateChanges(state, action);
    };
    return function (state, action) {
        var reduce = reducersFunction[action.type];
        return reduce ? reduce(state, action) : state;
    };
}
exports.formReducer = formReducer;
/////////////////////////////////////////////
//  API
/////////////////////////////////////////////
function apiCreator(dispath, getState, setState, keyMap, hooks, JSONValidator, schema) {
    var api = {};
    var batching = 0;
    var batchedItems = [];
    var dispathAction = dispath;
    var stuff = { JSONValidator: JSONValidator, hooks: hooks, getState: getState, schema: schema };
    // api._key2path = (keyPath: string | Path): Path => {
    //   if (typeof keyPath == 'string') keyPath = string2path(keyPath);
    //   let result: Path = [];
    //   keyPath.forEach((key) => {
    //     let keyMap = getIn(getState(), result.concat(SymbolData, 'keyMap'));
    //     if (keyMap && keyMap.key2path[key]) {
    //       result = result.concat(keyMap.key2path[key])
    //     } else result.push(key)
    //   });
    //   return result;
    // };
    //
    // api._path2key = (path: Path): Path => {
    //   let result: Path = [];
    //   let i = 0;
    //   while (i < path.length) {
    //     let key = path[i];
    //     let keyMap = getIn(getState(), path.slice(0, i).concat(SymbolData, 'keyMap'));
    //     let path2key = keyMap && keyMap.path2key;
    //     if (path2key) {
    //       let j = 0;
    //       while (1) {
    //         if (path2key[key]) {
    //           if (typeof path2key[key] == 'string') {
    //             key = path2key[key];
    //             i += j;
    //             break;
    //           } else {
    //             path2key = path2key[key];
    //             j++;
    //             key = path [i + j];
    //           }
    //         } else {
    //           key = path [i];
    //           break;
    //         }
    //       }
    //     }
    //     result.push(key);
    //     i++;
    //   }
    //   return result;
    // };
    // api.flatten = mapObj.bind(null, api._path2key, api._key2path);
    // api.unflatten = mapObj.bind(null, api._key2path, api._path2key);
    // api._setDirectly = (state: StateType, validate = !batching): Promise<void> => dispathAction(actionSetDirectly({state}, stuff, validate));
    api.getState = getState;
    api.validate = function () {
        var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        if (typeof force === 'string') force = [force];
        if (isArr(force)) {
            (function () {
                var result = {};
                force.forEach(function (value) {
                    return getByKey(result, string2path(value));
                });
                force = result;
            })();
        }
        return dispath(actionForceValidation(force, stuff));
    };
    api.getSingle = function (path) {
        return getIn(getState(), typeof path == 'string' ? string2path(path) : path);
    };
    api.setSingle = function (path, value) {
        var validate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : !batching;

        return dispathAction(actionSetItems([makeUpdateItem(path, value)], stuff, validate));
    };
    api.setMultiply = function (path, value) {
        var validate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : !batching;

        var items = makeArrayOfPathItem(path);
        items.forEach(function (item) {
            return item.value = value;
        });
        return dispathAction(actionSetItems(items, stuff, validate));
    };
    api.setExceptMultiply = function (path, value) {
        var validate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : !batching;

        var items = makeArrayOfPathItem(path);
        var obj = {};
        var result = [];
        items.forEach(function (item) {
            var key = item.path.slice(0, -1).concat(item.keyPath ? push2array(['@'], item.keyPath) : []).join('/');
            if (!obj[key]) obj[key] = [];
            obj[key].push(item.path[item.path.length - 1]);
        });
        var state = getState();
        objKeys(obj).forEach(function (pathString) {
            var pathItem = makePathItem(pathString);
            var keys = getKeysAccording2schema(state, pathItem.path); // objKeys(getIn());
            obj[pathString].forEach(function (key2del) {
                return ~keys.indexOf(key2del) && keys.splice(keys.indexOf(key2del), 1);
            });
            keys.forEach(function (key) {
                return result.push({ path: pathItem.path.concat(key), keyPath: pathItem.keyPath, value: value });
            });
        });
        items = result;
        return dispathAction(actionSetItems(items, stuff, validate));
    };
    api.getAsObject = function (keyPath, unflatten, fn) {
        var value = getAsObject(getState(), push2array([SymbolData], typeof keyPath == 'string' ? string2path(keyPath) : keyPath), fn);
        return unflatten ? value : keyMap.flatten(value);
    };
    api.setAsObject = function (vals, keyPath) {
        var validate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : !batching;

        function recursivelySetLength4arrays(items, vals) {
            var track = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

            if (isArr(vals) && changeLength) items.push({ path: ['#'].concat(keyMap.key2path(track)), keyPath: ['array', 'lengths', changeLength], value: vals.length });
            if (isMergeableObject(vals)) objKeys(vals).forEach(function (key) {
                return recursivelySetLength4arrays(items, vals[key], track.concat(key));
            });
        }
        if (typeof keyPath == 'string') keyPath = string2path(keyPath);
        var items = [];
        var changeLength = keyPath[0] == 'values' && keyPath[1];
        recursivelySetLength4arrays(items, vals);
        object2PathValues(vals).forEach(function (item) {
            var value = item.pop();
            items.push({ path: ['#'].concat(keyMap.key2path(item)), keyPath: keyPath, value: value });
        });
        return dispathAction(actionSetItems(items, stuff, validate));
    };
    api.getValues = function (unflatten) {
        return unflatten ? getState()[SymbolData]['currentValue'] : keyMap.flatten(getState()[SymbolData]['currentValue']);
    };
    api.setValues = function (vals) {
        var validate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : !batching;
        return api.setAsObject(vals, ['values', 'current'], validate);
    };
    api.getItital = function () {
        return api.getAsObject(['values', 'inital']);
    };
    api.setItital = function (vals) {
        var validate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : !batching;
        return api.setAsObject(vals, ['values', 'inital'], validate);
    };
    api.getActive = function () {
        return api.getSingle([[], ['active']]);
    };
    api.arrayOps = function (path) {
        var op = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'add';

        path = typeof path == 'string' ? string2path(path) : path;
        if (op == 'add') return api.setSingle(path.concat(SymbolData, 'array', 'lengths', 'current'), getValue(api.getSingle(path.concat(SymbolData, 'array', 'lengths'))) + 1);
    };
    api.arrayItemOps = function (path, op, value) {
        path = typeof path == 'string' ? string2path(path) : path.slice();
        var from = parseIntFn(path.pop());
        var to = from;
        var min = api.getSingle(path.concat(SymbolData, 'array', 'arrayStartIndex'));
        var lengthFull = api.getSingle(path.concat(SymbolData, 'array', 'lengths'));
        var max = getValue(lengthFull) - 1;
        if (op == 'up') to--;
        if (op == 'down') to++;
        if (op == 'first') to = min;
        if (op == 'last' || op == 'del') to = max;
        if (op == 'move' && value !== undefined) to = value;
        if (op == 'shift' && value !== undefined) to += value;
        if (to < min) to = min;
        if (to > max) to = max;
        var valuesNames = ['inital', 'default'];
        var state = api.getState();
        var arrayValues = {}; //getIn(api.getUnflattenValues(), path);
        var delStateObject = {};
        var arrayItems = {};
        var stateObject = {};
        var mergeObject = {};
        valuesNames.forEach(function (name) {
            arrayValues[name] = getIn(api.getAsObject(['values', name], true), path);
        });
        arrayValues['current'] = getIn(api.getValues(true), path);
        // console.log('getValues', arrayValues['current']);
        // if (!isArr(array)) return;
        for (var i = Math.min(from, to); i <= Math.max(from, to); i++) {
            delStateObject[i] = SymbolDelete;
            stateObject[i] = getIn(state, path.concat(i));
            arrayItems[i] = stateObject[i][SymbolData].arrayItem;
            mergeObject[i] = arrayValues['current'][i];
        }
        stateObject = moveArrayElems(stateObject, from, to);
        objKeys(arrayItems).forEach(function (i) {
            stateObject[i][SymbolData].arrayItem = arrayItems[i];
        });
        mergeObject = moveArrayElems(mergeObject, from, to);
        api.startBatch();
        var promise = void 0;
        if (op == 'del') {
            delete mergeObject[to];
            stateObject[to] = makeStateFromSchema(schema, {}, path.concat(to));
        }
        promise = api.setSingle(path, delStateObject);
        promise = api.setSingle(path, stateObject);
        // promise = api.execBatch(false);
        // api.startBatch();
        op == 'del' && api.setSingle(path.concat(SymbolData, 'array', 'lengths', 'current'), max);
        valuesNames.forEach(function (name) {
            return !isUndefined(arrayValues[name]) && api.setAsObject(makeSlice(path, arrayValues[name]), ['values', name]);
        });
        // console.log(mergeObject);
        promise = api.setAsObject(makeSlice(path, mergeObject), ['values', 'current']);
        return api.execBatch();
        // return api.setAsObject(makeSlice(path, mergeObject), ['values', 'current'])
    };
    api.setHidden = function (path) {
        var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var items = makeArrayOfPathItem(path);
        items.forEach(function (item) {
            item.value = value;
            item.keyPath = ['controls', 'hidden'];
        });
        return dispathAction(actionSetItems(items, stuff, false));
    };
    api.showOnly = function (path) {
        api.startBatch();
        var promise = api.setMultiply(path + '/@/controls/hidden', false);
        promise = api.setExceptMultiply(path + '/@/controls/hidden', true);
        return api.execBatch();
    };
    // api.selectOnly = (path: string): void => {
    //   api.startBatch();
    //   let promise = api.setMultiply(path + '/@/controls/hidden', false);
    //   promise = api.setExceptMultiply(path + '/@/controls/hidden', true);
    //   promise = api.setMultiply(path + '/@/controls/omit', false);
    //   promise = api.setExceptMultiply(path + '/@/controls/omit', true);
    //   return api.execBatch();
    // };
    api.selectOnly = function (path) {
        api.startBatch();
        var promise = api.setMultiply(path + '/@/controls/omit', false);
        promise = api.setExceptMultiply(path + '/@/controls/omit', true);
        return api.execBatch();
    };
    api.selectNshow = function (path) {
        api.startBatch();
        api.showOnly(path);
        api.selectOnly(path);
        return api.execBatch();
    };
    api.startBatch = function () {
        batching++;
        dispathAction = function dispathAction(_ref4) {
            var items = _ref4.items;

            push2array(batchedItems, items);
            return Promise.resolve();
        };
    };
    api.execBatch = function () {
        var validate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        batching--;
        if (batching || !batchedItems.length) return Promise.resolve();
        dispathAction = dispath;
        var result = dispath(actionSetItems(batchedItems, stuff, validate));
        batchedItems = [];
        return result;
    };
    return api;
}
/////////////////////////////////////////////
//      Schema utilities
/////////////////////////////////////////////
// function getSchemaApi(schema: JsonSchema) {
//   return {schema, getSchemaPart: getSchemaPart.bind(null, schema), makeDataObject: makeDataObject.bind(null, schema)};
// };
function getSchemaPart(schema, path) {
    function getArrayItemSchemaPart(index, schemaPart) {
        var items = [];
        if (schemaPart.items) {
            if (!isArr(schemaPart.items)) return schemaPart.items;else items = schemaPart.items;
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
        if (path[0] == '#') return getIn(schema, path); // Extract and use the referenced definition if we have it.
        throw new Error("Can only ref to #"); // No matching definition found, that's an error (bogus schema?)
    }
    var errorText = 'Schema path not found: ';
    var schemaPart = schema;
    for (var i = path[0] == '#' ? 1 : 0; i < path.length; i++) {
        if (!schemaPart) throw new Error(errorText + path.join('/'));
        if (schemaPart.$ref) {
            var $refSchema = getSchemaByRef(schema, schemaPart.$ref);

            var _schemaPart = schemaPart,
                $ref = _schemaPart.$ref,
                localSchema = __rest(schemaPart, ["$ref"]);

            schemaPart = merge($refSchema, localSchema);
        }
        if (schemaPart.type == 'array') {
            schemaPart = getArrayItemSchemaPart(path[i], schemaPart);
        } else {
            if (schemaPart.properties && schemaPart.properties[path[i]]) schemaPart = schemaPart.properties[path[i]];else throw new Error(errorText + path.join('/'));
            ;
        }
    }
    if (!schemaPart.$ref) return schemaPart;
    var refMap = getByKey(schema, [SymbolData, 'refs', schemaPart.$ref], new Map());
    if (!refMap.get(schemaPart)) {
        var _$refSchema = getSchemaByRef(schema, schemaPart.$ref);

        var _schemaPart2 = schemaPart,
            _$ref = _schemaPart2.$ref,
            _localSchema = __rest(schemaPart, ["$ref"]);

        refMap.set(schemaPart, merge(_$refSchema, _localSchema));
    }
    return refMap.get(schemaPart);
}
function makeDataObject(schema, values, path) {
    function isParentRequires(path, resolvedSchema) {
        if (!path.length) return false;
        var schemaPart = getSchemaPart(resolvedSchema, path.slice(0, -1));
        return !!(schemaPart.type == 'object' && isArr(schemaPart.required) && ~schemaPart.required.indexOf(path[path.length - 1]));
    }
    function getValueFromSchema(path, keyPath, resolvedSchema) {
        // return getIn(getSchemaPart(resolvedSchema, path), keyPath);
        var tmpPath = path.concat(null);
        for (var i = 0; i < path.length + 1; i++) {
            tmpPath.pop();
            var _schemaPart3 = getSchemaPart(resolvedSchema, path);
            if (_schemaPart3) return getIn(_schemaPart3, keyPath);
        }
    }
    function getParentArrayValue(path, resolvedSchema) {
        var pathPart = path.slice();
        var keyPart = [];
        var result = void 0;
        for (var i = 0; i < path.length; i++) {
            var key = pathPart.pop();
            keyPart.unshift(key);
            var _schemaPart4 = getSchemaPart(resolvedSchema, pathPart);
            if (!_schemaPart4) return;
            if (_schemaPart4.type == 'array') {
                var tmp = getIn(_schemaPart4.default, keyPart);
                if (tmp) result = tmp;
            }
        }
        return result;
    }
    function makeDataMap(dataMap) {
        return merge.all({}, dataMap.map(function (item) {
            var from = makePathItem(item[0], path);
            var to = item[1];
            return makeSlice(from.path, SymbolData, 'dataMap', from.keyPath ? path2string(from.keyPath) : SymbolData, to, item[2]);
        }), { symbol: true });
    }
    var bindObject = { schema: schema, utils: utils };
    var schemaPart = getSchemaPart(schema, path);
    if (!schemaPart) throw new Error("Schema not found in path \"" + path.join('/') + "\"");
    var x = schemaPart.x || {};

    var custom = x.custom,
        preset = x.preset,
        dataMap = x.dataMap,
        fields = x.fields,
        flatten = x.flatten,
        groups = x.groups,
        selectOnly = x.selectOnly,
        validators = x.validators,
        showOnly = x.showOnly,
        rest = __rest(x, ["custom", "preset", "dataMap", "fields", "flatten", "groups", "selectOnly", "validators", "showOnly"]);

    var result = merge({ controls: {}, messages: {} }, rest);
    var schemaData = result.schemaData = {};
    schemaData.title = schemaPart.title;
    schemaData.type = isArr(schemaPart.type) ? schemaPart.type[0] : schemaPart.type;
    //schemaData.type = schemaPart.type;
    if (schemaPart.type != 'object' && schemaPart.type != 'array') {
        schemaData.required = !!isParentRequires(path, schema) || schemaPart.required;
        result.values = {
            'default': getParentArrayValue(path, schema) || schemaPart.default
        };
        ['current', 'inital', 'default'].forEach(function (type) {
            var val = getIn(values[type], path);
            if (!isUndefined(val)) result.values[type] = val;
        });
    }
    var status = result.status = {};
    status.color = '';
    status.touched = false;
    status.pending = false;
    status.valid = true;
    status.pristine = result.values ? getValue(result.values) === getValue(result.values, 'inital') : true;
    return { data: result, dataMap: dataMap ? makeDataMap(dataMap) : {} };
}
var getArrayStartIndex = function getArrayStartIndex(schemaPart) {
    if (!isArr(schemaPart.items)) return 0;
    if (schemaPart.additionalItems === false) return Infinity;
    if (_typeof2(schemaPart.additionalItems) === 'object') return schemaPart.items.length;
    return schemaPart.items.length - 1;
};
function makeStateFromSchema(schema) {
    var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var currentPath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ['#'];

    function mapPath2key(prefix, obj) {
        var result = {};
        objKeys(obj).forEach(function (val) {
            if (typeof obj[val] == 'string') result[val] = prefix + obj[val];else result[val] = mapPath2key(prefix, obj[val]);
        });
        return result;
    }
    var result = {};
    var dataMapObjects = [];
    var dataObj = makeDataObject(schema, values, currentPath);
    var schemaPart = getSchemaPart(schema, currentPath);
    result[SymbolData] = dataObj.data;
    dataMapObjects.push(dataObj.dataMap);
    var keys = [];
    if (schemaPart.type == 'array') {
        (function () {
            var vals = schemaPart.default;
            var lengthFull = { 'default': 0 };
            if (vals && isArr(vals)) lengthFull.default = vals.length;
            if (schemaPart.minItems) lengthFull.default = Math.max(lengthFull.default, schemaPart.minItems);
            var maxLength = lengthFull.default;
            ['current', 'inital', 'default'].forEach(function (type) {
                var val = getIn(values[type], currentPath);
                if (!isUndefined(val)) lengthFull[type] = val.length;
            });
            for (var i = 0; i < getMaxValue(lengthFull); i++) {
                keys.push(i.toString());
            }result[SymbolData].array = {
                lengths: lengthFull,
                arrayStartIndex: getArrayStartIndex(schemaPart),
                canAdd: !(schemaPart.additionalItems === false) && getValue(lengthFull) < (schemaPart.maxItems || Infinity)
            };
        })();
    } else if (schemaPart.type == 'object') {
        keys = objKeys(schemaPart.properties);
    }
    keys.forEach(function (field) {
        var dataObj = makeStateFromSchema(schema, values, currentPath.concat(field));
        dataMapObjects.push(dataObj.dataMap);
        result[field] = dataObj.state;
        if (schemaPart.type == 'array') {
            var num = parseIntFn(field);
            var arrayItem = getByKey(result[field][SymbolData], 'arrayItem');
            var arrayStartIndex = result[SymbolData].array.arrayStartIndex;
            var length = getValue(result[SymbolData].array.lengths);
            if (num >= arrayStartIndex) {
                arrayItem.canUp = arrayStartIndex < num;
                arrayItem.canDown = arrayStartIndex <= num && num < length - 1;
            }
            var minItems = schemaPart.minItems || 0;
            if (num >= minItems) arrayItem.canDel = num >= Math.min(arrayStartIndex, length - 1);
        }
    });
    return { state: result, dataMap: merge.all({}, dataMapObjects, { symbol: true }) };
}
exports.makeStateFromSchema = makeStateFromSchema;
function getKeyMapFromSchema(schema) {
    return {
        key2path: key2path,
        path2key: path2key,
        flatten: mapObj.bind(null, path2key, key2path),
        unflatten: mapObj.bind(null, key2path, path2key)
    };
    function getKeyMap(schema) {
        var track = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['#'];

        function checkIfHaveKey(key) {
            if (keyMap.key2path.hasOwnProperty(key)) throw new Error("Duplicate flatten name for " + key);
        }
        function mapPath2key(prefix, obj) {
            var result = {};
            objKeys(obj).forEach(function (val) {
                if (typeof obj[val] == 'string') result[val] = prefix + obj[val];else result[val] = mapPath2key(prefix, obj[val]);
            });
            return result;
        }
        var schemaPart = getSchemaPart(schema, track);
        var keyMaps = getByKey(schema, [SymbolData, 'keyMaps'], new Map());
        if (keyMaps.get(schemaPart)) return keyMaps.get(schemaPart);
        if (schemaPart.type != 'object') return;
        var result = {};
        var fields = objKeys(schemaPart.properties || {});
        var keyMap = getByKey(result, [SymbolData, 'keyMap'], { key2path: {}, path2key: {} });
        if (schemaPart.x && schemaPart.x.flatten) keyMap.prefix = schemaPart.x.flatten !== true && schemaPart.x.flatten || '';
        fields.forEach(function (field) {
            var keyResult = getKeyMap(schema, track.concat(field));
            var objKeyMap = getIn(keyResult, [SymbolData, 'keyMap']) || {};
            if (!isUndefined(objKeyMap.prefix)) {
                objKeys(objKeyMap.key2path).forEach(function (key) {
                    checkIfHaveKey(objKeyMap.prefix + key);
                    keyMap.key2path[objKeyMap.prefix + key] = [field].concat(objKeyMap.key2path[key]);
                });
                keyMap.path2key[field] = mapPath2key(objKeyMap.prefix, objKeyMap.path2key);
            } else if (!isUndefined(keyMap.prefix)) {
                checkIfHaveKey(field);
                keyMap.key2path[field] = field;
                keyMap.path2key[field] = field;
            }
        });
        keyMaps.set(schemaPart, result);
        return result;
    }
    function key2path(keyPath) {
        if (typeof keyPath == 'string') keyPath = string2path(keyPath);
        var result = [];
        keyPath.forEach(function (key) {
            var path = getIn(getKeyMap(schema, result), [SymbolData, 'keyMap', 'key2path', key]);
            result = push2array(result, path ? path : key);
        });
        return result;
    }
    function path2key(path) {
        var result = [];
        var i = 0;
        while (i < path.length) {
            var key = path[i];
            var _path2key = getIn(getKeyMap(schema, path.slice(0, i)), [SymbolData, 'keyMap', 'path2key']);
            if (_path2key) {
                var j = 0;
                while (1) {
                    if (_path2key[key]) {
                        if (typeof _path2key[key] == 'string') {
                            key = _path2key[key];
                            i += j;
                            break;
                        } else {
                            _path2key = _path2key[key];
                            j++;
                            key = path[i + j];
                        }
                    } else {
                        key = path[i];
                        break;
                    }
                }
            }
            result.push(key);
            i++;
        }
        return result;
    }
    function mapObj(fnDirect, fnReverse, object) {
        var result = {};
        function recurse(value) {
            var track = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

            var keys = void 0;
            if (isMergeableObject(value)) {
                keys = objKeys(value);
                keys.forEach(function (key) {
                    return recurse(value[key], track.concat(key));
                });
            }
            if (!(keys && keys.length) && getIn(getKeyMap(schema, fnDirect == key2path ? key2path(track) : track), [SymbolData, 'keyMap', 'prefix']) === undefined) {
                var tmp = result;
                var _path2 = fnDirect(track);
                for (var i = 0; i < _path2.length - 1; i++) {
                    var _field2 = _path2[i];
                    if (!tmp[_field2]) tmp[_field2] = isArr(getIn(object, fnReverse(_path2.slice(0, i + 1)))) ? [] : {};
                    tmp = tmp[_field2];
                }
                tmp[_path2.pop()] = value;
            }
        }
        recurse(object);
        return result;
    }
}
exports.getKeyMapFromSchema = getKeyMapFromSchema;
/////////////////////////////////////////////
//      mergeState
/////////////////////////////////////////////
// returns {state, changes} where state is new object only if changes were made, otherwise return {state} where state is passed state
function mergeState(state, source) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var fn = options.symbol ? objKeysAndSymbols : objKeys;
    // let arrayMergeFn: any = false;
    var SymbolDelete = options.SymbolDelete,
        del = options.del,
        diff = options.diff,
        _options$arrays = options.arrays,
        arrays = _options$arrays === undefined ? 'replace' : _options$arrays;

    var mergeArrays = arrays != 'replace';
    var setArrayLength = arrays == 'mergeWithLength';
    var concatArray = arrays == 'concat';
    // if (typeof mergeArrays === 'function') arrayMergeFn = mergeArrays;
    var canMerge = mergeArrays === true ? isMergeableObject : isObject;
    function recusion(state, source) {
        var track = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

        var isSourceArray = isArr(source);
        if (!isMergeableObject(state)) state = isSourceArray ? [] : {}; // return only objects
        var isStateArray = isArr(state);
        if (!isMergeableObject(source)) return { state: state }; // merge only mergeable objects, may be throw here
        var stateKeys = fn(state);
        if (stateKeys.length == 0 && !del && (!isStateArray || isSourceArray && arrays != 'merge')) return { state: source, changes: source };
        var srcKeys = fn(source);
        var changes = {};
        var changedObjects = {};
        var result = isStateArray ? [] : {}; //
        if (diff) {
            stateKeys.forEach(function (key) {
                if (!~srcKeys.indexOf(key)) changes[key] = SymbolDelete;
            });
        }
        if (isStateArray && isSourceArray) {
            if (concatArray) {
                if (!source.length) return { state: state };
                var srcPrev = source;
                if (!del) {
                    srcPrev.forEach(function (item, idx) {
                        return changes[state.length + idx] = item;
                    });
                    srcKeys = [];
                } else {
                    source = [];
                    srcPrev.forEach(function (item, idx) {
                        return source[state.length + idx] = item;
                    });
                    srcKeys = fn(source);
                }
            }
            if (setArrayLength && state.length != source.length) changes.length = source.length;
        }
        srcKeys.forEach(function (key) {
            if (del && source[key] === SymbolDelete) {
                if (state.hasOwnProperty(key)) changes[key] = SymbolDelete;
            } else {
                if (!canMerge(source[key])) {
                    if (!state.hasOwnProperty(key) || !is(state[key], source[key])) changes[key] = source[key];
                } else {
                    if (state[key] !== source[key]) {
                        var _obj2 = recusion(state[key], source[key], track.concat(key));
                        if (_obj2.changes) changedObjects[key] = _obj2;
                    }
                }
            }
        });
        var changedObjKeys = fn(changedObjects);
        var changesKeys = fn(changes);
        if (changesKeys.length == 0 && changedObjKeys.length == 0) return { state: state };else {
            Object.assign(result, state);
            //Object.assign(result, changes);
            changesKeys.forEach(function (key) {
                if (del && changes[key] === SymbolDelete) delete result[key];else result[key] = changes[key];
            });
            changedObjKeys.forEach(function (key) {
                result[key] = changedObjects[key].state;
                changes[key] = changedObjects[key].changes;
            });
            return { state: result, changes: changes };
        }
    }
    return recusion(state, source);
}
exports.mergeState = mergeState;
;
// mergeState.all = function (state: StateType, obj2merge: StateType[], options: MergeStateOptionsArgument = {}) {
//   let obj;
//   if (obj2merge.length == 0) return {state};  // no changes should be done
//   else if (obj2merge.length == 1) return mergeState(state, obj2merge[0], options);
//   else obj = obj2merge.reduce((prev, next) => mergeState(prev, next, options).state, state);  // merge
//   let options4obj = Object.assign({}, options);
//   options4obj.diff = true;
//   return mergeState(state, obj, options4obj);
// };
var merge = function merge(a, b) {
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return mergeState(a, b, opts).state;
};
exports.merge = merge;
merge.all = function (state, obj2merge) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (obj2merge.length == 0) return state; // no changes should be done
    else return obj2merge.reduce(function (prev, next) {
            return merge(prev, next, options);
        }, state); // merge
};
function isObject(val) {
    return isMergeableObject(val) && !isArr(val);
}
function isMergeableObject(val) {
    var nonNullObject = val && (typeof val === "undefined" ? "undefined" : _typeof2(val)) === 'object';
    return nonNullObject && Object.prototype.toString.call(val) !== '[object RegExp]' && Object.prototype.toString.call(val) !== '[object Date]';
}
/////////////////////////////////////////////
//      Utilities
/////////////////////////////////////////////
var utils = {};
utils.get = function (state, path) {
    return getIn(state, string2path(path));
};
utils.isEqual = isEqual;
utils.merge = merge;
utils.getValue = getValue;
utils.makePathItem = makePathItem;
utils.string2path = string2path;
utils.getSchemaPart = getSchemaPart;
function getByKey(obj, keys) {
    var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (!isArr(keys)) keys = [keys];
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] == '#') continue;
        if (!obj.hasOwnProperty(keys[i])) obj[keys[i]] = i == keys.length - 1 ? value : {};
        obj = obj[keys[i]];
    }
    return obj;
}
function path2string(path, keyPath) {
    if (!isArr(path)) {
        keyPath = path.keyPath;
        path = path.path;
    }
    return (keyPath ? path.concat('@', keyPath) : path).join('/'); // (path.length ? '' : '/') +
}
function string2path(str) {
    var relativePath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    var delimiter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '@';

    str = str.replace(/\/+/g, '/');
    var res = str.split('/');
    if (res[0] === '.' || res[0] == '..') {
        if (relativePath) res = relativePath.concat(res);
    }
    if (res[0] === '') res[0] = '#';
    var tmp = [];
    for (var i = 0; i < res.length; i++) {
        var val = res[i];
        if (val === '..') tmp.pop();else if (val !== '' && val !== '.') tmp.push(val);
    }
    res = tmp;
    // if (res[res.length - 1] == '') res.pop();
    var a = res.indexOf(delimiter);
    if (~a) res[a] = SymbolData;
    return res;
}
exports.string2path = string2path;
// class PathItem {
//   path: Path;
//   keyPath?: Path;
//
//   constructor(path: Path | string) {
//     if (typeof path == 'string') path = string2path(path, relativePath, delimiter);
//     this.fullPath = path;
//   }
//
//   get fullPath(): Path {
//     return this.keyPath ? this.path.concat(SymbolData, this.keyPath) : this.path;
//   }
//
//   set fullPath(path: Path) {
//     if (typeof path == 'string') path = string2path(path, relativePath, delimiter);
//     let a = path.indexOf(SymbolData);
//     if (a == -1) {
//       this.path = path.slice();
//       delete this.keyPath
//     } else {
//       this.path = path.slice(0, a);
//       this.keyPath = path.slice(a + 1);
//     }
//   }
// }
//
function makeUpdateItem(path) {
    var value = void 0,
        keyPath = void 0,
        updateItem = void 0;
    if ((arguments.length <= 1 ? 0 : arguments.length - 1) == 1) value = arguments.length <= 1 ? undefined : arguments[1];
    if ((arguments.length <= 1 ? 0 : arguments.length - 1) == 2) {
        keyPath = arguments.length <= 1 ? undefined : arguments[1];
        value = arguments.length <= 2 ? undefined : arguments[2];
    }
    updateItem = makePathItem(path);
    if (keyPath) updateItem.keyPath = isArr(keyPath) ? keyPath : string2path(keyPath);
    updateItem.value = value;
    return updateItem;
}
function makePathItem(path) {
    var relativePath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    var delimiter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '@';

    var pathItem = {};
    pathItem.toString = function () {
        return path2string(this);
    };
    Object.defineProperty(pathItem, "toString", { enumerable: false });
    Object.defineProperty(pathItem, "fullPath", {
        get: function get() {
            return this.keyPath ? this.path.concat(SymbolData, this.keyPath) : this.path;
        },
        set: function set(path) {
            var a = path.indexOf(SymbolData);
            if (a == -1) {
                this.path = path.slice();
                delete this.keyPath;
            } else {
                this.path = path.slice(0, a);
                this.keyPath = path.slice(a + 1);
            }
        }
    });
    path = pathOrString2path(path, relativePath, delimiter);
    pathItem.fullPath = path;
    return pathItem;
}
exports.makePathItem = makePathItem;
function pathOrString2path(path) {
    var basePath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var delimiter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '@';

    if (typeof path == 'string') path = string2path(path, basePath, delimiter);
    return path;
}
function makeArrayOfPathItem(path) {
    var basePath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var delimiter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '@';

    path = pathOrString2path(path, basePath, delimiter);
    var result = [[]];
    path.forEach(function (value) {
        var res = [];
        if (typeof value == 'string' || typeof value == 'number') {
            result.forEach(function (pathPart) {
                return value.toString().split(',').forEach(function (key) {
                    return res.push(pathPart.concat(key));
                });
            });
        } else if ((typeof value === "undefined" ? "undefined" : _typeof2(value)) == 'symbol') {
            result.forEach(function (pathPart) {
                return res.push(pathPart.concat(value));
            });
        } else if (typeof value == 'function') {
            result.forEach(function (pathPart) {
                var tmp = value(pathPart);
                if (!isArr(tmp)) tmp = [tmp];
                tmp.forEach(function (tmpVal) {
                    return tmpVal === false ? false : tmpVal.toString().split(',').forEach(function (key) {
                        return res.push(pathPart.concat(key));
                    });
                });
            });
        } else throw new Error('not allowed type');
        result = res;
    });
    return result.map(function (path) {
        return makePathItem(path);
    });
}
// function string2PathKeyPath(str: string, path?: Path): Path[] {
//   let res: any = str.split('@/');
//   if (res[0][0] == '/') res[0] = res[0].split('/').slice(1);
//   else res[0] = path ? path.concat(res[0].split('/')) : res[0].split('/');
//   if (res[1] !== undefined) {
//     res[0].pop();
//     res[1] = res[1].split('/');
//     if (res[1][0] == '') res[1] = res[1].slice(1);
//   } else if (res[0][0] == '') res[0] = res[0].slice(1);
//   return res;
// }
function push2array(array) {
    for (var _len = arguments.length, vals = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        vals[_key - 1] = arguments[_key];
    }

    for (var i = 0; i < vals.length; i++) {
        if (isArr(vals[i])) array.push.apply(array, _toConsumableArray(vals[i]));else array.push(vals[i]);
    }
    return array;
}
exports.push2array = push2array;
function object2PathValues(vals) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var track = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    var fn = options.symbol ? objKeysAndSymbols : objKeys;
    var check = options.arrayAsValue ? isObject : isMergeableObject;
    var result = [];
    fn(vals).forEach(function (key) {
        var path = track.concat(key);
        if (check(vals[key])) object2PathValues(vals[key], options, path).forEach(function (item) {
            return result.push(item);
        }); // result = result.concat(object2PathValues(vals[key], path));
        else result.push(push2array(path, vals[key]));
    });
    if (!result.length) return [push2array(track.slice(), {})]; // empty object
    return result;
}
exports.object2PathValues = object2PathValues;
function moveArrayElems(arr, from, to) {
    var length = arr.length;
    if (length) {
        from = (from % length + length) % length;
        to = (to % length + length) % length;
    }
    var elem = arr[from];
    for (var i = from; i < to; i++) {
        arr[i] = arr[i + 1];
    }for (var _i5 = from; _i5 > to; _i5--) {
        arr[_i5] = arr[_i5 - 1];
    }arr[to] = elem;
    return arr;
}
function makeSlice() {
    var result = {};
    var obj = result;

    for (var _len2 = arguments.length, pathValues = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        pathValues[_key2] = arguments[_key2];
    }

    var lastI = pathValues.length - 2;
    if (!lastI && isArr(pathValues[0]) && !pathValues[0].length) return pathValues[1];
    for (var i = 0; i < pathValues.length - 1; i++) {
        var _path3 = pathValues[i];
        if (!isArr(_path3)) _path3 = [_path3];
        for (var j = 0; j < _path3.length; j++) {
            if (_path3[j] == '#') continue;
            obj[_path3[j]] = i == lastI && j == _path3.length - 1 ? pathValues[pathValues.length - 1] : {};
            obj = obj[_path3[j]];
        }
    }
    return result;
}
exports.makeSlice = makeSlice;
function getIn(store, path) {
    if (path.length == 0 || store == undefined) return store;else if (path[0] == '#') return getIn(store, path.slice(1));else if (typeof path[0] === 'function') return getIn(store[path[0](store)], path.slice(1));
    return getIn(store[path[0]], path.slice(1));
}
exports.getIn = getIn;
;
function getSlice(store, path) {
    var track = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    return makeSlice(path, getIn(store, path));
}
function getAsObject(store, keyPath, fn, keyObject) {
    if (!fn) fn = function fn(x) {
        return x;
    };
    var type = store[SymbolData].schemaData.type;
    if (type == 'object' || type == 'array') {
        var _ret12 = function () {
            var result = type == 'array' ? [] : {};
            var keys = objKeys(keyObject && objKeys(keyObject).length > 0 ? keyObject : store);
            if (type == 'array') {
                var idx = 0;
                var arrKeys = [];
                if (keyPath[1] == 'values' && keyPath[2]) idx = getIn(store, [SymbolData, 'array', 'lengths', keyPath[2]]) || 0;else idx = getValue(getIn(store, [SymbolData, 'array', 'lengths']) || {}) || 0;
                var lengthChange = keyObject && getIn(keyObject, [SymbolData, 'array', 'lengths']);
                for (var i = 0; i < idx; i++) {
                    if (lengthChange || ~keys.indexOf(i.toString())) arrKeys.push(i.toString());
                }keys = arrKeys;
                result.length = idx;
            }
            keys.forEach(function (key) {
                if (store[key]) result[key] = getBindedValue(getIn(store[key], [SymbolData, 'controls']), 'omit') ? Symbol.for('FFormDelete') : getAsObject(store[key], keyPath, fn, keyObject ? keyObject[key] : undefined);
            });
            return {
                v: result
            };
        }();

        if ((typeof _ret12 === "undefined" ? "undefined" : _typeof2(_ret12)) === "object") return _ret12.v;
    } else return fn(getIn(store, keyPath));
}
function getBindedValue(obj, valName) {
    return isUndefined(obj[valName + 'Bind']) ? obj[valName] : obj[valName + 'Bind'];
}
function asNumber(value) {
    if (value === "") return undefined;
    if (/\.$/.test(value)) return value; // "3." can't really be considered a number even if it parses in js. The user is most likely entering a float.
    if (/\.0$/.test(value)) return value; // we need to return this as a string here, to allow for input like 3.07
    var n = Number(value);
    var valid = typeof n === "number" && !Number.isNaN(n);
    if (/\.\d*0$/.test(value)) return value; // It's a number, that's cool - but we need it as a string so it doesn't screw with the user when entering dollar amounts or other values (such as those with specific precision or number of significant digits)
    return valid ? n : value;
}
function without(obj) {
    for (var _len3 = arguments.length, rest = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        rest[_key3 - 2] = arguments[_key3];
    }

    var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    //const args = arrFrom(rest); // [].slice.call(arguments);
    var result = isArr(obj) ? [] : {};
    var fn = symbol ? objKeys : objKeysAndSymbols;
    fn(obj).forEach(function (key) {
        if (!~rest.indexOf(key)) result[key] = obj[key];
    });
    return result;
}
;
function split(test, obj) {
    var symbol = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var passed = {};
    var wrong = {};
    var fn = symbol ? objKeys : objKeysAndSymbols;
    fn(obj).forEach(function (key) {
        var val = obj[key];
        if (test(key, val)) passed[key] = val;else wrong[key] = val;
    });
    return [passed, wrong];
}
;
function map(fnc, obj) {
    var symbol = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var result = {};
    var fn = symbol ? objKeys : objKeysAndSymbols;
    fn(obj).forEach(function (key) {
        return result[key] = fnc(obj[key]);
    });
    return result;
}
;
function mapKeys(fnc, obj) {
    var symbol = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var result = {};
    var fn = symbol ? objKeys : objKeysAndSymbols;
    fn(obj).map(function (key) {
        return result[fnc(key)] = obj[key];
    });
    return result;
}
;
var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
function is(x, y) {
    // SameValue algorithm
    if (x === y) {
        // Steps 6.b-6.e: +0 != -0
        return x !== 0 || 1 / x === 1 / y;
    } else {
        // Step 6.a: NaN == NaN
        return x !== x && y !== y;
    }
}
function isEqual(objA, objB) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (is(objA, objB)) return true;
    if ((isUndefined(objA) ? 'undefined' : _typeof(objA)) !== 'object' || objA === null || (isUndefined(objB) ? 'undefined' : _typeof(objB)) !== 'object' || objB === null) return false;
    var fn = options.symbol ? objKeysAndSymbols : objKeys;
    var keysA = fn(objA);
    var keysB = fn(objB);
    if (keysA.length !== keysB.length) return false;
    var _options$skipKeys = options.skipKeys,
        skipKeys = _options$skipKeys === undefined ? [] : _options$skipKeys,
        _options$deepKeys = options.deepKeys,
        deepKeys = _options$deepKeys === undefined ? [] : _options$deepKeys;

    for (var i = 0; i < keysA.length; i++) {
        if (~skipKeys.indexOf(keysA[i])) continue; // if key is an skip key, skip comparison
        if (options.deep || ~deepKeys.indexOf(keysA[i])) {
            var result = isEqual(objA[keysA[i]], objB[keysA[i]], options);
            if (!result) return false;
        } else if (!objB.hasOwnProperty(keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
            return false;
        }
    }
    return true;
}
exports.isEqual = isEqual;
function not(val) {
    return !val;
}
exports.not = not;
function getValue(values) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'current';

    var types = ['current', 'inital', 'default'];
    for (var i = types.indexOf(type); i < 3; i++) {
        // if (values.hasOwnProperty(types[i]) && values[types[i]] !== SymbolDelete) return values[types[i]];
        if (values[types[i]] !== undefined) return values[types[i]];
    }
    return undefined;
}
exports.getValue = getValue;
function getMaxValue(values) {
    return Math.max(values['current'] || 0, values['inital'] || 0, values['default'] || 0);
}
function replaceDeep(obj, value) {
    if (!isMergeableObject(obj)) return value;
    var result = isArr(obj) ? [] : {};
    objKeys(obj).forEach(function (field) {
        return result[field] = replaceDeep(obj[field], value);
    });
    return result;
}
// export function makeSlice(path: PathSlice, value: any, track: PathSlice = []): StateType {
//   if (path.length == 0) return value;
//   let keys: any = path[0];
//   if (typeof keys === 'function') keys = keys(path, track);
//   if (!isArr(keys)) keys = [keys];
//   let result = {};
//   keys.forEach((key: string | number) => {
//     let newTrack = track.slice();
//     newTrack.push(key);
//     result[key] = makeSlice(path.slice(1), value, newTrack)
//   });
//   return result;
// }
// export function getSlice(store: any, path: PathSlice, track: PathSlice = []): {} {
//   if (path.length == 0 || store == undefined)
//     return store;
//   else {
//     let keys: any = path[0];
//     if (typeof keys === 'function') keys = keys(store, path, track);
//     if (!isArr(keys)) keys = [keys];
//     let result = {};
//     keys.forEach((key: string | number) => {
//       let newTrack = track.slice();
//       newTrack.push(key);
//       result[key] = getSlice(store[key], path.slice(1), newTrack)
//     });
//     return result;
//   }
// };
//
// export function setIn(store: {}, path: Path, value: any) {
//   if (path.length == 0)
//     return value;
//   else {
//     let child = (store == null) ? null : store[path[0]];
//     value = setIn(child || [], path.slice(1), value);
//     return mergeState(store, object(path[0], value)).state;
//   }
// };
//
//
// export function setSlice(store: any, ...rest: any[]): SetSliceResultType {
//   let changes = [];
//   for (let i = 0; i + 1 < rest.length; i += 2) {
//     let path = rest[i], value = rest[i + 1];
//     if (!isEqual(getIn(store, path), value, {deep: true, symbol: true, onlyKeysB: true}))
//       changes.push(makeSlice(value, path));
//   }
//   if (changes.length == 0) return {data: store};
//   if (changes.length > 1) changes = merge.all(changes); else changes = changes[0];
//   return {data: merge(store, changes), changes}
// }
//
// function object(...args: any[]) {
//   // const args = arrFrom(arguments);
//   let result: any = [];
//   for (let i = 0; i + 1 < args.length; i += 2) {
//     let x = args[i];
//     if (typeof x != 'number' || x < 0 || x % 1 != 0) result = {};
//   }
//   for (let i = 0; i + 1 < args.length; i += 2) result[args[i]] = args[i + 1];
//   return result;
// };
// function flatten(data: any, symbol = false) {
//   const result = {};
//   const delimiter = '/';
//   const fn = symbol ? objKeys : objKeysNSymb;
//
//   function recursivelySetValues(cur: any, prop = '') {
//     if (Object(cur) !== cur) {
//       result[prop] = cur;
//     } else if (isArr(cur)) {
//       if (!cur.length) result[prop] = [];
//
//       cur.forEach((item, i) => {
//         recursivelySetValues(cur[i], prop
//           ? [prop, i].join(delimiter)
//           : `${i}`);
//       });
//     } else {
//       let isEmpty = true;
//
//       fn(cur).forEach((key) => {
//         isEmpty = false;
//         recursivelySetValues(cur[key], prop
//           ? [prop, key].join(delimiter)
//           : key);
//       });
//
//       if (isEmpty) result[prop] = {};
//     }
//   }
//   recursivelySetValues(data);
//   return result;
// }
//
// function del(state: any, symbol = false) { // remove undefined values and empty objects or arrays
//   let result: any, isArray: boolean;
//   if (state === undefined) result = undefined;
//   else if (isArr(state) || isObject(state)) {
//     isArray = isArr(state);
//     result = isArray ? [] : {};
//     const fn = symbol ? objKeys : objKeysNSymb;
//     fn(state).forEach(key => {
//       let val = del(state[key]);
//       if (val !== undefined) {
//         if (isArray) result.push(val); else result[key] = val;
//       }
//     });
//     if (fn(result).length == 0) result = undefined;
//   } else result = state;
//   return result;
// };
//
// function getDiffForSecondObject(objA: any, objB: any, symbol = false) {
//   const fn = symbol ? objKeysNSymb : objKeys;
//   const result = {};
//   fn(objB).forEach((key) => {
//     if (isObject(objB)) {
//       if (isObject(objA)) result[key] = getDiffForSecondObject(objA[key], objB[key], symbol);
//       else result[key] = objB[key];
//     } else {
//       if (objB[key] != objA[key]) result[key] = objB[key];
//     }
//   });
//   return result;
// }
/*
 /////////////////////////////////////////////
 // https://github.com/KyleAMathews/deepmerge, modified to merge Symbols
 /////////////////////////////////////////////


 const merge: any = function () {

 function emptyTarget(val: any) {
 return isArr(val) ? [] : {}
 }

 function cloneIfNecessary(value: any, optionsArgument?: DeepmergeOptionsArgument) {
 const clone = optionsArgument && optionsArgument.clone === true;
 return (clone && isMergeable(value)) ? deepmerge(emptyTarget(value), value, optionsArgument) : value
 }

 function defaultArrayMerge(target: any, source: any, optionsArgument?: DeepmergeOptionsArgument) {
 const destination = target.slice();
 source.forEach(function (e: any, i: any) {
 if (typeof destination[i] === 'undefined') {
 destination[i] = cloneIfNecessary(e, optionsArgument)
 } else if (isMergeable(e)) {
 destination[i] = deepmerge(target[i], e, optionsArgument)
 } else if (target.indexOf(e) === -1) {
 destination.push(cloneIfNecessary(e, optionsArgument))
 }
 });
 return destination
 }

 function mergeObject(target: any, source: any, optionsArgument?: DeepmergeOptionsArgument) {
 const destination = {};
 let fn = (optionsArgument && optionsArgument.symbol) ? objKeysNSymb : objKeys;
 if (isMergeable(target)) {
 fn(target).forEach(function (key) {
 destination[key] = cloneIfNecessary(target[key], optionsArgument)
 })
 }
 fn(source).forEach(function (key) {
 if (!isMergeable(source[key]) || !target[key]) {
 destination[key] = cloneIfNecessary(source[key], optionsArgument)
 } else {
 destination[key] = deepmerge(target[key], source[key], optionsArgument)
 }
 });
 return destination
 }

 const deepmerge: any = function (target: any, source: any, optionsArgument?: DeepmergeOptionsArgument) {
 const array = isArr(source);
 const options = optionsArgument || {arrayMerge: defaultArrayMerge};
 const arrayMerge = options.arrayMerge || defaultArrayMerge;

 if (array) {
 return isArr(target) ? arrayMerge(target, source, optionsArgument) : cloneIfNecessary(source, optionsArgument)
 } else {
 return mergeObject(target, source, optionsArgument)
 }
 };

 deepmerge.all = function deepmergeAll(array: any[], optionsArgument?: DeepmergeOptionsArgument) {
 if (array.length < 2) throw new Error('Should be at least two elements');

 // we are sure there are at least 2 values, so it is safe to have no initial value
 return array.reduce(function (prev, next) {
 return deepmerge(prev, next, optionsArgument)
 })
 };

 return deepmerge

 }();*/