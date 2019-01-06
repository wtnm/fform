"use strict";
var __$_0__='createElement',__$_1__='length',__$_2__='forEach',__$_3__='fieldOptions',__$_4__='concat',__$_5__='keyPath',__$_6__='indexOf',__$_7__='methodBindObject',__$_8__='widget',__$_9__='additionalItems',__$_10__='hasOwnProperty',__$_11__='_savedState',__$_12__='currentValue',__$_13__='useTag',__$_14__='prototype',__$_15__='unsubscribe',__$_16__='getPrototypeOf',__$_17__='_dataProps',__$_18__='toString',__$_19__='_focusField',__$_20__='push',__$_21__='value',__$_22__='_objectLayouts',__$_23__='slice',__$_24__='properties',__$_25__='schema',__$_26__='getSingle',__$_27__='changes',__$_28__='fields',__$_29__='getOwnPropertySymbols',__$_30__='__proto__',__$_31__='textArray',__$_32__='dataTree',__$_33__='onChange',__$_34__='registry',__$_35__='startBatch',__$_36__='path',__$_37__='default',__$_38__='forceUpdate',__$_39__='dataMap',__$_40__='_rebuild',__$_41__='_enumOptions',__$_42__='setAsObject',__$_43__='props',__$_44__='_dataMaps',__$_45__='key2path',__$_46__='execBatch',__$_47__='methods2chain',__$_48__='type',__$_49__='items',__$_50__='schemaData',__$_51__='arrayDelta',__$_52__='setExceptMultiply',__$_53__='refs',__$_54__='rebuild',__$_55__='_forceRebuild',__$_56__='values',__$_57__='status',__$_58__='setState',__$_59__='setSingle',__$_60__='rRefs',__$_61__='_builderData',__$_62__='refName',__$_63__='currentValueChanges',__$_64__='Main',__$_65__='store',__$_66__='defineProperty',__$_67__='placeholder',__$_68__='_jValidator',__$_69__='widgets',__$_70__='required',__$_71__='ArrayItem',__$_72__='getState',__$_73__='state',__$_74__='children',__$_75__='labelProps',__$_76__='current',__$_77__='filter',__$_78__='Autosize',__$_79__='_liveValidate',__$_80__='Component',__$_81__='blocks',__$_82__='assign',__$_83__='Layout',__$_84__='objects',__$_85__='schemaProps',__$_86__='Message',__$_87__='resolve',__$_88__='setMultiply',__$_89__='getAsObject',__$_90__='$ref',__$_91__='splice',__$_92__='minItems',__$_93__='Group',__$_94__='prefix',__$_95__='showOnly',__$_96__='mapProps',__$_97__='propsMap',__$_98__='validators',__$_99__='schemaPart',__$_100__='selectOnly',__$_101__='#',__$_102__='bind';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol[__$_14__]  ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props[__$_1__] ; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object[__$_66__] (target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor[__$_14__] , protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr[__$_1__] ); i < arr[__$_1__] ; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass[__$_14__]  = Object.create(superClass && superClass[__$_14__] , { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass[__$_30__]  = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __assign = this && this.__assign || Object[__$_82__]  || function (t) {
    for (var s, i = 1, n = arguments[__$_1__] ; i < n; i++) {
        s = arguments[i];
        for (var p in s) {
            if (Object[__$_14__] .hasOwnProperty.call(s, p)) t[p] = s[p];
        }
    }
    return t;
};
var __rest = this && this.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object[__$_14__] .hasOwnProperty.call(s, p) && e[__$_6__] (p) < 0) t[p] = s[p];
    }if (s != null && typeof Object[__$_29__]  === "function") for (var i = 0, p = Object[__$_29__] (s); i < p[__$_1__] ; i++) {
        if (e[__$_6__] (p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};
var React = require("react");
var react_1 = require("react");

var JSONSchemaValidator = require('./is-my-json-valid');

var objKeys = Object.keys; 
var parseIntFn = parseInt;
var isArr = Array.isArray;
var isUndefined = function isUndefined(value) {
    return typeof value === "undefined";
};

var SymbolData = Symbol.for('FFormData');
var SymbolDelete = undefined; 
var formReducerValue = 'forms';



var actionName4setItems = 'FFORM_SET_ITEMS';
var actionName4forceValidation = 'FFORM_FORCE_VALIDATION';


function objKeysAndSymbols(obj) {
    var result = objKeys(obj);
    return result[__$_4__] (Object[__$_29__] (obj));
}
function applyMixins(derivedCtor, baseCtors) {
    baseCtors[__$_2__] (function (baseCtor) {
        Object.getOwnPropertyNames(baseCtor[__$_14__] )[__$_2__] (function (name) {
            derivedCtor[__$_14__] [name] = baseCtor[__$_14__] [name];
        });
    });
}












function hookManager() {
    var globalHooks = {};
    var Hooks = {};
    function setHook(name, hookName, hook) {
        getByKey(Hooks, [name, hookName], globalHooks[hookName][__$_23__] ())[__$_20__] (hook);
    }
    var add = function add(name, hookName, hook) {
        if (name == '') {
            
            
            objKeys(Hooks)[__$_2__] (function (key) {
                return setHook(key, hookName, hook);
            });
            getByKey(globalHooks, hookName, [])[__$_20__] (hook);
        } else setHook(name, hookName, hook);
        return remove[__$_102__] (null, name, hookName, hook);
    };
    function remove(name, hookName, hook) {
        if (name == '') {
            globalHooks[hookName][__$_91__] (globalHooks[hookName][__$_6__] (hook), 1);
            objKeys(Hooks)[__$_2__] (function (key) {
                return Hooks[key][hookName][__$_91__] (Hooks[key][hookName][__$_6__] (hook));
            }, 1);
        } else Hooks[name][hookName][__$_91__] (Hooks[name][hookName][__$_6__] (hook), 1);
    }
    ;
    
    add.get = function (name) {
        if (!Hooks[name]) {
            Hooks[name] = {};
            objKeys(globalHooks).map(function (hookName) {
                return Hooks[name][hookName] = globalHooks[hookName][__$_23__] ();
            });
        }
        return Hooks[name];
    };
    return add;
}
var Hooks = hookManager();
exports.addHook = Hooks;

Hooks('', 'beforeMerge', function (state, item, utils, schema, data) {
    
    
    
    
    if (!item[__$_5__] ) return [];
    var result = [];
    if (item[__$_5__] [0] == 'array' && item[__$_5__] [1] == 'lengths') {
        var dataItem = getIn(state, item[__$_36__] )[SymbolData]; 
        
        var lengthFull = dataItem.array.lengths; 
        var newLengthFull = merge(lengthFull, makeSlice(item[__$_5__] [2], item[__$_21__] ));
        var start = getMaxValue(lengthFull) || 0;
        var end = getMaxValue(newLengthFull) || 0;
        for (var i = start; i < end; i++) {
            var elemPath = item[__$_36__] [__$_4__] (i);
            
            var newElem = makeStateFromSchema(schema, {}, elemPath);
            
            result[__$_20__] (makeUpdateItem(elemPath, newElem[__$_73__] ));
            result[__$_20__] (makeUpdateItem([], newElem[__$_39__] ));
        }
        for (var _i = end; _i < start; _i++) {
            result[__$_20__] ({ path: item[__$_36__] [__$_4__] (_i), value: SymbolDelete });
        }var arrayStartIndex = dataItem.array.arrayStartIndex;
        var newLength = getValue(newLengthFull);
        var schemaPart = getSchemaPart(schema, item[__$_36__] );
        var minItems = schemaPart[__$_92__]  || 0;
        result[__$_20__] ({ path: item[__$_36__] , keyPath: ['canAdd'], value: !(schemaPart[__$_9__]  === false) && newLength < (schemaPart.maxItems || Infinity) });
        for (var _i2 = Math.max(Math.min(getValue(lengthFull), newLength) - 1, 0); _i2 < newLength; _i2++) {
            var _elemPath = item[__$_36__] [__$_4__] (_i2);
            if (_i2 >= arrayStartIndex) {
                result[__$_20__] (makeUpdateItem(_elemPath, ['arrayItem', 'canUp'], arrayStartIndex < _i2));
                result[__$_20__] (makeUpdateItem(_elemPath, ['arrayItem', 'canDown'], arrayStartIndex <= _i2 && _i2 < newLength - 1));
            }
            if (_i2 >= minItems) result[__$_20__] (makeUpdateItem(_elemPath, ['arrayItem', 'canDel'], _i2 >= Math.min(arrayStartIndex, newLength - 1)));
        }
    }
    return result;
});

Hooks('', 'beforeMerge', function (state, item, utils, schema, data) {
    function recursivelySetChanges(statePart, keyPath, track) {
        after[__$_20__] (makeUpdateItem(track, keyPath, item[__$_21__] ));
        getKeysAccording2schema(statePart, [])[__$_2__] (function (key) {
            return recursivelySetChanges(statePart[key], keyPath, track[__$_4__] (key));
        });
    }
    ;
    if (!item[__$_5__] ) return [];
    var result = {};
    var after = [];
    result.after = after;
    if (item[__$_5__] [0] == 'switch' && item[__$_5__] .length == 3) {
        result.skip = true;
        recursivelySetChanges(getIn(state, item[__$_36__] ), item[__$_5__] .slice(1), item[__$_36__] );
    }
    if (item[__$_5__] [0] == 'values') {
        var dataItem = getIn(state, item[__$_36__] )[SymbolData];
        if (dataItem[__$_56__] ) after[__$_20__] (makeUpdateItem(item[__$_36__] , ['status', 'pristine'], getValue(dataItem[__$_56__] ) === getValue(dataItem[__$_56__] , 'inital')));
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    return result;
});

Hooks('', 'afterMerge', function (state, changesArray, utils, schema, data) {
    var addChangeData = [];
    var recalcArray = void 0;
    function countRecalc(state, changes) {
        var track = arguments[__$_1__]  > 2 && arguments[2] !== undefined ? arguments[2] : [__$_101__] ;

        if (state === undefined) return;
        objKeys(changes)[__$_2__] (function (key) {
            return countRecalc(state[key], changes[key], track[__$_4__] (key));
        });
        var dataItemChanges = changes[SymbolData];
        if (!dataItemChanges) return;
        var dataItem = state[SymbolData];
        if (!dataItem) return;
        var status = [];
        var path = track[__$_4__] ();
        var controls = dataItemChanges['controls'] || {};
        if (getIn(dataItemChanges, ['array', 'lengths'])) status = objKeys(dataItem[__$_57__] );else if (controls[__$_10__] ('omit') || controls[__$_10__] ('omitBind')) {
            path.pop();
            status = objKeys(dataItem[__$_57__] );
        } else if (dataItemChanges[__$_57__] ) {
            path.pop();
            status = objKeys(dataItemChanges[__$_57__] );
        }
        var length = path[__$_1__] ;
        if (!recalcArray) recalcArray = [];
        for (var i = 0; i < length; i++) {
            status[__$_2__] (function (key) {
                return getByKey(recalcArray, [path[__$_1__] , path2string(path, [__$_57__] [__$_4__] (key))], { path: path[__$_23__] (), keyPath: [__$_57__] .concat(key), checkValue: key != 'pending' });
            });
            path.pop();
        }
    }
    
    changesArray[__$_2__] (function (changes) {
        return countRecalc(state, changes);
    });
    if (recalcArray) {
        (function () {
            var newVals = {};

            var _loop = function _loop(i) {
                var obj = recalcArray[recalcArray[__$_1__]  - i - 1];
                if (obj) {
                    objKeys(obj)[__$_2__] (function (key) {
                        var _obj$key = obj[key],
                            path = _obj$key[__$_36__] ,
                            keyPath = _obj$key[__$_5__] ,
                            checkValue = _obj$key.checkValue;

                        var keys = getKeysAccording2schema(state, path);
                        var result = checkValue;
                        for (var j = 0; j < keys[__$_1__] ; j++) {
                            if (getBindedValue(getIn(state, path[__$_4__] (keys[j], SymbolData, 'controls')), 'omit')) continue; 
                            var pathString = path2string(path[__$_4__] (keys[j]), keyPath);
                            var value = newVals[__$_10__] (pathString) ? newVals[pathString] : utils.get(state, pathString);
                            if (value === !checkValue) {
                                result = !checkValue;
                                break;
                            } else if (value === null) result = null; 
                        }
                        addChangeData[__$_20__] ({ path: path, keyPath: keyPath, value: result });
                        newVals[path2string(path, keyPath)] = result;
                    });
                }
            };

            for (var i = 0; i < recalcArray[__$_1__] ; i++) {
                _loop(i);
            }
        })();
    }
    return addChangeData;
});
function getKeysAccording2schema(state, path) {
    var data = getIn(state, path)[SymbolData];
    var keys = [];
    if (data[__$_50__] .type == 'array') for (var j = 0; j < getValue(data.array.lengths); j++) {
        keys[__$_20__] (j[__$_18__] ());
    } else keys = objKeys(getIn(state, path));
    return keys;
    
    
    
    
    
    
    
}




var apiMixin = function () {
    function apiMixin() {
        _classCallCheck(this, apiMixin);

        this[__$_11__]  = {};
    }

    _createClass(apiMixin, [{
        key: "initState",
        value: function initState(props, setStateFunc) {
            var self = this;
            self.utils = utils;
            if (!self.reducer) self.reducer = formReducer();
            self[__$_25__]  = __assign({}, props[__$_25__] ); 
            self[__$_25__] [SymbolData] = {}; 
            self.validator = JSONSchemaValidator(self[__$_25__] , { greedy: true });
            self[__$_68__]  = self[__$_68__] .bind(self);
            self.keyMap = getKeyMapFromSchema(self[__$_25__] );
            self.setNewState = setStateFunc;
            var formValues = props[__$_56__]  || {};
            objKeys(formValues)[__$_2__] (function (type) {
                return formValues[type] = self.keyMap.unflatten(formValues[type]);
            });
            var state = props[__$_73__] ;
            if (!state) {
                var result = makeStateFromSchema(self[__$_25__] , formValues);
                state = merge(result[__$_73__] , result[__$_39__] , { symbol: true });
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
                return [item.field.split('.')[__$_23__] (1), item.message];
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
                    self.setNewState(self.reducer(self[__$_11__] , action));
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

        var _this = _possibleConstructorReturn(this, (makeApi[__$_30__]  || Object[__$_16__] (makeApi)).call(this));

        var self = _this;
        var state = self.initState(props, self[__$_58__] .bind(self));
        self.api = apiCreator(self._dispath.bind(self), self[__$_72__] .bind(self), self[__$_58__] .bind(self), self.keyMap, Hooks.get(props.name), self[__$_68__] , self[__$_25__] );
        self.promise = self.api.setSingle([], state);
        return _this;
    }

    _createClass(makeApi, [{
        key: "setState",
        value: function setState(state) {
            this[__$_11__]  = state;
        }
    }, {
        key: "getState",
        value: function getState() {
            return this[__$_11__] ;
        }
    }]);

    return makeApi;
}(apiMixin);

exports.makeApi = makeApi;




var Form = function (_react_1$PureComponen) {
    _inherits(Form, _react_1$PureComponen);

    
    function Form(props, context) {
        _classCallCheck(this, Form);

        var _this2 = _possibleConstructorReturn(this, (Form[__$_30__]  || Object[__$_16__] (Form)).call(this, props, context));

        _this2[__$_11__]  = {};
        var self = _this2;

        var tag = props.tag,
            store = props[__$_65__] ,
            iface = props.iface,
            rest = __rest(props, ["tag", "store", "iface"]);

        self[__$_65__]  = store;
        
        var newState = self.initState(rest, self[__$_58__] .bind(self));
        self._setIface(iface);
        self.promise = self.api.setSingle([], newState);
        return _this2;
    }

    _createClass(Form, [{
        key: "shouldComponentUpdate",
        value: function shouldComponentUpdate(newProps) {
            var self = this;
            if (!isEqual(this[__$_43__] , newProps, { skipKeys: ['state', 'store', 'iface'] })) {
                if (this[__$_43__] .store != newProps[__$_65__] ) this[__$_65__]  = newProps[__$_65__] ;
                if (this[__$_43__] .iface != newProps.iface || this[__$_43__] .store != newProps[__$_65__] ) this._setIface(newProps.iface);
                self[__$_58__] (newProps[__$_73__] );
                return false;
            }
            return true;
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            if (this[__$_15__] ) this[__$_15__] ();
        }
    }, {
        key: "_handleChange",
        value: function _handleChange() {
            var self = this;
            var nextState = self[__$_65__] .getState()[formReducerValue][self[__$_43__] .name];
            if (nextState !== self[__$_11__] ) {
                self[__$_58__] (nextState);
            }
        }
    }, {
        key: "setState",
        value: function setState(state) {
            var self = this;
            if (self[__$_11__]  != state) {
                self[__$_11__]  = state;
                if (self[__$_60__] ) self[__$_60__] .forceUpdate();
            }
        }
    }, {
        key: "_setIface",
        value: function _setIface(iface) {
            var self = this;
            if (!iface) iface = self.context.store || self[__$_65__]  ? 'redux' : 'local';
            self.iface = iface;
            if (self.iface == 'redux') {
                var store = void 0;
                if (self[__$_65__] ) store = self[__$_65__] ;else if (self.context.store) store = self[__$_65__]  = self.context.store;else throw new Error('In redux mode store must be provided either in context or in props.store');
                self.dispatch = store.dispatch;
                if (self[__$_15__] ) self[__$_15__] ();
                self[__$_15__]  = store.subscribe(self._handleChange);
            } else {
                if (self[__$_15__] ) {
                    self[__$_15__] ();
                    delete self[__$_15__] ;
                }
                self.dispatch = self._dispath.bind(self);
            }
            self.api = apiCreator(self.dispath, self[__$_72__] .bind(self), self[__$_58__] .bind(self), self.keyMap, Hooks.get(self[__$_43__] .name), self[__$_68__] , self[__$_25__] );
        }
    }, {
        key: "focus",
        value: function focus(path) {
            if (this[__$_60__] ) this[__$_60__] .focus(path);
        }
    }, {
        key: "rebuild",
        value: function rebuild(path) {
            if (this[__$_60__] ) this[__$_60__] .rebuild(path);
        }
    }, {
        key: "getState",
        value: function getState() {
            return this[__$_11__] ;
        }
    }, {
        key: "render",
        value: function render() {
            var self = this;
            var _a = self[__$_43__] ,
                name = _a.name,
                objects = _a[__$_84__] ,
                values = _a[__$_56__] ,
                schema = _a[__$_25__] ,
                iface = _a.iface,
                _a$widget = _a[__$_8__] ,
                Widget = _a$widget === undefined ? 'form' : _a$widget,
                state = _a[__$_73__] ,
                store = _a[__$_65__] ,
                rest = __rest(_a, ["name", "objects", "values", "schema", "iface", "widget", "state", "store"]);
            var registry = {};
            registry.formName = name;
            registry[__$_84__]  = objects;
            registry[__$_25__]  = self[__$_25__] ;
            registry.api = self.api;
            registry.utils = self.utils;
            registry.focus = self.focus.bind(self);
            registry[__$_54__]  = self[__$_54__] .bind(self);
            return React[__$_0__] (Widget, __assign({}, rest, { name: name }), React[__$_0__] (Field, { ref: function ref(item) {
                    return self[__$_60__]  = item;
                }, key: "main", registry: registry, path: [__$_101__]  }));
        }
    }]);

    return Form;
}(react_1.PureComponent);

Form.contextTypes = {
    store: React.PropTypes.object
};
exports.FForm = Form;
applyMixins(Form, [apiMixin]);




var SectionWidget = function (_react_1$Component) {
    _inherits(SectionWidget, _react_1$Component);

    function SectionWidget() {
        _classCallCheck(this, SectionWidget);

        return _possibleConstructorReturn(this, (SectionWidget[__$_30__]  || Object[__$_16__] (SectionWidget)).apply(this, arguments));
    }

    _createClass(SectionWidget, [{
        key: "render",
        value: function render() {
            var _a = this[__$_43__] ,
                Widget = _a[__$_8__] ,
                getDataProps = _a.getDataProps,
                wid = _a.wid,
                rest = __rest(_a, ["widget", "getDataProps", "wid"]);
            var dataMaped = getDataProps()[wid] || {};
            return React[__$_0__] (Widget, __assign({}, rest, dataMaped));
        }
    }]);

    return SectionWidget;
}(react_1[__$_80__] );

function replaceWidgetNamesWithFunctions(presetArrays, objects) {
    var tmp = presetArrays;
    if (!isArr(tmp)) tmp = [tmp];

    var _loop2 = function _loop2(i) {
        var presetArray = tmp[i];
        var widget = presetArray[__$_8__] ;
        if (widget) presetArray[__$_8__]  = typeof widget === 'string' ? objects[__$_69__]  && objects[__$_69__] [widget] || widget : widget;
        objKeys(presetArray)[__$_2__] (function (key) {
            return isObject(presetArray[key]) && (presetArray[key] = replaceWidgetNamesWithFunctions(presetArray[key], objects));
        });
    };

    for (var i = 0; i < tmp[__$_1__] ; i++) {
        _loop2(i);
    }
    return presetArrays;
}

var Section = function (_react_1$Component2) {
    _inherits(Section, _react_1$Component2);

    function Section(props, context) {
        _classCallCheck(this, Section);

        var _this4 = _possibleConstructorReturn(this, (Section[__$_30__]  || Object[__$_16__] (Section)).call(this, props, context));

        _this4[__$_22__]  = [];
        _this4.isArray = false;
        _this4.arrayAddable = true;
        _this4[__$_51__]  = 0;
        _this4[__$_40__]  = true;
        _this4[__$_28__]  = {};
        _this4.wids = {};
        _this4[__$_44__]  = {};
        _this4[__$_17__]  = {};
        var array = props[__$_3__] .registry[__$_84__] .array;
        
        return _this4;
    }

    _createClass(Section, [{
        key: "focus",
        value: function focus(path) {
            var self = this;
            var field = void 0;
            if (!path[__$_1__] ) field = self[__$_19__] ;else {
                field = path[0];
                path = path[__$_23__] (1);
            }
            if (self[__$_28__] [field] && self[__$_28__] [field].focus) self[__$_28__] [field].focus(path);
        }
    }, {
        key: "rebuild",
        value: function rebuild(path) {
            var self = this;
            if (!path[__$_1__] ) {
                self[__$_22__]  = [];
                self[__$_40__]  = true;
                self[__$_38__] ();
            } else {
                var _field = path[0];
                path = path[__$_23__] (1);
                if (self[__$_28__] [_field] && self[__$_28__] [_field][__$_54__] ) self[__$_28__] [_field][__$_54__] (path);
            }
        }
    }, {
        key: "_build",
        value: function _build(props) {
            function bindMetods(restField) {
                var track = arguments[__$_1__]  > 1 && arguments[1] !== undefined ? arguments[1] : [__$_101__] ;

                var result = __assign({}, restField);
                methodBindObject[__$_47__] .forEach(function (methodName) {
                    if (typeof result[methodName] == 'function') result[methodName] = result[methodName][__$_102__] (methodBindObject);
                });
                objKeys(result)[__$_2__] (function (key) {
                    return isObject(result[key]) && (result[key] = bindMetods(result[key], track[__$_4__] (key)));
                });
                return result;
            }
            function makeLayout(keys, fields, groups) {
                var GroupWidget = widgets[__$_93__]  || 'div';
                var groupPropsMap = field[__$_96__] [__$_93__] ;
                var layout = [];
                var groupKeys = objKeys(groups).map(function (key) {
                    return parseIntFn(key);
                });
                fields[__$_2__] (function (field) {
                    if (typeof field == 'string') {
                        layout[__$_20__] (SectionField(field));
                        keys[__$_91__] (keys[__$_6__] (field), 1);
                    } else if (typeof field == 'number') {
                        var _a = groups[field],
                            _a$fields = _a[__$_28__] ,
                            groupFields = _a$fields === undefined ? [] : _a$fields,
                            _a$groups = _a.groups,
                            groupGroups = _a$groups === undefined ? [] : _a$groups,
                            _a$widget2 = _a[__$_8__] ,
                            widget = _a$widget2 === undefined ? GroupWidget : _a$widget2,
                            propsMap = _a[__$_97__] ,
                            restGroup = __rest(_a, ["fields", "groups", "widget", "propsMap"]);
                        var cnt = widCount;
                        widCount++;
                        layout[__$_20__] (React[__$_0__] (SectionWidget, __assign({ wid: cnt, getDataProps: getDataProps, widget: widget, key: 'group_' + field }, schemaProps[__$_93__] , restGroup), makeLayout(keys, groupFields, groupGroups))); 
                        if (propsMap || groupPropsMap) self[__$_44__] [cnt] = merge(propsMap || {}, groupPropsMap || {});
                        groupKeys[__$_91__] (groupKeys[__$_6__] (field), 1);
                    } else if (isObject(field)) {
                        var _propsMap = field[__$_97__] ,
                            passOptions = field.passOptions,
                            restField = __rest(field, ["propsMap", "passOptions"]);

                        restField = bindMetods(restField);
                        restField = replaceWidgetNamesWithFunctions(restField, registry[__$_84__] );
                        var opts = {};
                        if (passOptions) opts[passOptions === true ? 'options' : passOptions] = fieldOptions;
                        layout[__$_20__] (React[__$_0__] (SectionWidget, __assign({}, opts, { key: 'widget_' + widCount, wid: widCount, getDataProps: getDataProps, ref: setWidRef(widCount) }, restField)));
                        if (_propsMap) self[__$_44__] [widCount] = _propsMap;
                        widCount++;
                    }
                });
                if (groupKeys[__$_1__] ) {
                    (function () {
                        var restGroups = {};
                        groupKeys[__$_2__] (function (key) {
                            return groups[key] && (restGroups[key] = groups[key]);
                        });
                        push2array(layout, makeLayout(keys, groupKeys, restGroups));
                    })();
                }
                return layout;
            }
            var SectionField = function SectionField(field) {
                return React[__$_0__] (Field, { key: field, ref: setRef(field), registry: registry, path: path[__$_4__] (field), childrenBlocks: fieldOptions.childrenBlocks });
            };
            var self = this;
            var fieldOptions = props[__$_3__] ;
            var _props$fieldOptions = props[__$_3__] ,
                path = _props$fieldOptions[__$_36__] ,
                registry = _props$fieldOptions[__$_34__] ,
                widgets = _props$fieldOptions[__$_69__] ,
                schemaProps = _props$fieldOptions[__$_85__] ,
                schemaPart = _props$fieldOptions[__$_99__] ,
                field = _props$fieldOptions.field;

            var methodBindObject = field[__$_7__] ;
            
            if (!schemaPart) return null;
            self[__$_19__]  = props[__$_19__] ;
            var setRef = function setRef(field) {
                return function (item) {
                    return self[__$_28__] [field] = item;
                };
            };
            var setWidRef = function setWidRef(key) {
                return function (item) {
                    return self._widgets[key] = item;
                };
            };
            var getDataProps = function getDataProps() {
                return self[__$_17__] ;
            };
            var widCount = 0;
            var _schemaPart$x = schemaPart.x,
                x = _schemaPart$x === undefined ? {} : _schemaPart$x,
                _schemaPart$propertie = schemaPart[__$_24__] ,
                properties = _schemaPart$propertie === undefined ? {} : _schemaPart$propertie;
            var _x$groups = x.groups,
                groups = _x$groups === undefined ? [] : _x$groups;

            var getSingle = registry.api.getSingle;
            var keys = [];
            var arrayStartIndex = 0;
            var length = 0;
            if (schemaPart[__$_48__]  == 'array') {
                if (!self[__$_19__] ) self[__$_19__]  = '0';
                
                
                length = props[__$_1__] ; 
                arrayStartIndex = getSingle(path[__$_4__] (SymbolData, 'array', 'arrayStartIndex'));
                if (length < arrayStartIndex) self[__$_22__]  = [];
                for (var i = 0; i < arrayStartIndex; i++) {
                    keys[__$_20__] (i[__$_18__] ());
                }
            } else {
                keys = objKeys(schemaPart[__$_24__] );
            }
            if (!self[__$_19__]  && keys[0]) self[__$_19__]  = keys[0];
            if (self[__$_22__] .length == 0) {
                self[__$_22__]  = makeLayout(keys, x[__$_28__]  || [], x.groups || []);
                keys[__$_2__] (function (field) {
                    return self[__$_22__] .push(SectionField(field));
                });
                objKeys(self[__$_44__] )[__$_2__] (function (key) {
                    return self[__$_17__] [key] = mapProps(self[__$_44__] [key], getSingle(path[__$_4__] (SymbolData)), methodBindObject);
                });
                self[__$_51__]  = arrayStartIndex - self[__$_22__] .length;
            }
            if (schemaPart[__$_48__]  == 'array') {
                var from = Math.max(arrayStartIndex, Math.min(self[__$_22__] .length + self[__$_51__] , length));
                self[__$_22__] .splice(from - self[__$_51__] , self[__$_22__] .length - from); 
                for (var _i3 = from; _i3 < length; _i3++) {
                    self[__$_22__] [_i3 - self[__$_51__] ] = SectionField(_i3[__$_18__] ());
                }
            }
        }
    }, {
        key: "shouldComponentUpdate",
        value: function shouldComponentUpdate(newProps) {
            var self = this;
            var result = !isEqual(self[__$_43__] , newProps, { skipKeys: [__$_32__]  });
            var getSingle = newProps[__$_3__] .registry.api.getSingle;
            var path = newProps[__$_3__] .path;

            if (getSingle(push2array([SymbolData, 'changes'], path, SymbolData, 'array', 'lengths')) !== undefined) {
                self[__$_40__]  = true;
                result = true;
            }
            if (self[__$_43__] .dataTree != newProps[__$_32__] ) {
                var modifiedFields = getSingle(push2array([SymbolData, 'changes'], path));
                if (modifiedFields) {
                    objKeys(modifiedFields)[__$_2__] (function (field) {
                        return self[__$_28__] [field] && self[__$_28__] [field][__$_38__] ();
                    });
                    if (modifiedFields[SymbolData]) {
                        (function () {
                            var dataProps = {};
                            objKeys(self[__$_44__] )[__$_2__] (function (key) {
                                return dataProps[key] = mapProps(self[__$_44__] [key], newProps[__$_32__] [SymbolData], newProps[__$_3__] .field[__$_7__] );
                            });
                            var tmp = mergeState(self[__$_17__] , dataProps);
                            self[__$_17__]  = tmp[__$_73__] ;
                            if (tmp[__$_27__] ) objKeys(tmp[__$_27__] )[__$_2__] (function (key) {
                                return self._widgets[key] && self._widgets[key][__$_38__] ();
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
            var _a = self[__$_43__] ,
                _a$useTag = _a[__$_13__] ,
                UseTag = _a$useTag === undefined ? 'div' : _a$useTag,
                funcs = _a.funcs,
                length = _a[__$_1__] ,
                enumOptions = _a[__$_41__] ,
                fieldOptions = _a[__$_3__] ,
                onChange = _a[__$_33__] ,
                onFocus = _a.onFocus,
                onBlur = _a.onBlur,
                dataTree = _a[__$_32__] ,
                refName = _a[__$_62__] ,
                focusField = _a[__$_19__] ,
                rest = __rest(_a, ["useTag", "funcs", "length", "_enumOptions", "fieldOptions", "onChange", "onFocus", "onBlur", "dataTree", "refName", "_focusField"]);
            if (self[__$_40__] ) self._build(self[__$_43__] ); 
            self[__$_40__]  = false;
            return React[__$_0__] (UseTag, __assign({}, rest), self[__$_22__] );
        }
    }]);

    return Section;
}(react_1[__$_80__] );

function ArrayBlock(props) {
    var _props$useTag = props[__$_13__] ,
        UseTag = _props$useTag === undefined ? 'div' : _props$useTag,
        empty = props.empty,
        addButton = props.addButton,
        length = props[__$_1__] ,
        canAdd = props.canAdd,
        id = props.id,
        children = props[__$_74__] ,
        hidden = props.hidden,
        fieldOptions = props[__$_3__] ,
        rest = __rest(props, ["useTag", "empty", "addButton", "length", "canAdd", "id", "children", "hidden", "fieldOptions"]);

    var _empty$widget = empty[__$_8__] ,
        Empty = _empty$widget === undefined ? 'div' : _empty$widget,
        emptyRest = __rest(empty, [__$_8__] );

    var _addButton$widget = addButton[__$_8__] ,
        AddButton = _addButton$widget === undefined ? 'button' : _addButton$widget,
        addButtonRest = __rest(addButton, [__$_8__] );

    var onClick = function onClick() {
        
        fieldOptions[__$_34__] .api.arrayOps(fieldOptions[__$_36__] );
        
    };
    if (hidden) rest.style = merge(rest.style || {}, { display: 'none' });
    if (length) return React[__$_0__] (UseTag, __assign({}, rest), children, canAdd ? React[__$_0__] (AddButton, __assign({ onClick: onClick }, addButtonRest)) : '');else return React[__$_0__] (UseTag, __assign({}, rest), React[__$_0__] (Empty, __assign({}, emptyRest), canAdd ? React[__$_0__] (AddButton, __assign({ onClick: onClick }, addButtonRest)) : ''));
}



function getFieldProps(presets) {
    var x = arguments[__$_1__]  > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var presetName = arguments[2];
    var name = arguments[3];
    var methodBindObject = arguments[4];

    function getWidgetBefore(widgetsArray) {
        var widgetsArrayNames = widgetsArray.map(function (item) {
            return item.name;
        });
        var widgetsArrayCode = widgetsArray.map(function (item) {
            return item[__$_18__] ();
        });
        return function (widget) {
            var a = widgetsArray[__$_6__] (widget);
            if (~a) return widgetsArray[a - 1];
            a = widgetsArrayNames[__$_6__] (widget.name);
            if (~a) return widgetsArray[a - 1];
            if (widgetsArrayCode) a = widgetsArrayCode[__$_6__] (widget[__$_18__] ());
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
            var a = cache[propString][__$_6__] (prop);
            if (~a) return cache[propString][a - 1];
        };
    }
    function chainMethods(result) {
        var track = arguments[__$_1__]  > 1 && arguments[1] !== undefined ? arguments[1] : [__$_101__] ;

        methodBindObject[__$_47__] .forEach(function (methodName) {
            var methods = getArrayOfPropsFromArrayOfObjects(presetArray, track[__$_4__] (methodName));
            var methods_rev = getArrayOfPropsFromArrayOfObjects(presetArray, track[__$_4__] ('$' + methodName));
            methods_rev.reverse();
            methods = methods_rev[__$_4__] (methods);
            var prevMethod = methodBindObject.funcs[methodName];
            if (!methods[__$_1__] ) return;
            for (var i = 0; i < methods[__$_1__] ; i++) {
                var bindObj = __assign({}, methodBindObject);
                if (prevMethod) bindObj[methodName] = prevMethod;
                methods[i] = methods[i][__$_102__] (bindObj);
                prevMethod = methods[i];
            }
            result = merge(result, makeSlice(methodName, methods.pop()));
            result = merge(result, makeSlice('$' + methodName, SymbolDelete), { del: true });
        });
        objKeys(result)[__$_2__] (function (key) {
            return isObject(result[key]) && (result[key] = chainMethods(result[key], track[__$_4__] (key)));
        });
        return result;
    }
    var presetArray = [];
    var presetNames = presetName.split(':');
    presetNames.reverse();
    presetNames[__$_2__] (function (presetName) {
        while (true) {
            var preset = getIn(presetName[0] == '#' ? x['custom'] : presets, string2path(presetName));
            if (preset) {
                preset[name] && presetArray[__$_20__] (preset[name]);
                if (!preset['_']) break;
                presetName = preset['_'];
            } else break;
        }
    });
    presetArray[__$_20__] (getIn(presets, ['*', name]) || {}); 
    presetArray.reverse();
    presetArray[__$_20__] (getIn(x, ['custom', name]) || {}); 
    presetArray[__$_20__] (makeSlice('_', undefined));
    presetArray = replaceWidgetNamesWithFunctions(presetArray, methodBindObject[__$_34__] .objects);
    var result = name == 'Main' ? __assign({}, methodBindObject.funcs) : {};
    result = chainMethods(merge.all(result, presetArray, { del: true }));
    result[SymbolData] = {
        all: presetArray,
        getPropBefore: getPropBefore(presetArray),
        getWidgetBefore: getWidgetBefore(getArrayOfPropsFromArrayOfObjects(presetArray, 'widget')),
        getPropArray: getArrayOfPropsFromArrayOfObjects[__$_102__] (null, presetArray)
    };
    return result;
}
exports.getFieldProps = getFieldProps;

var Field = function (_react_1$Component3) {
    _inherits(Field, _react_1$Component3);

    function Field(props, context) {
        _classCallCheck(this, Field);

        
        var _this5 = _possibleConstructorReturn(this, (Field[__$_30__]  || Object[__$_16__] (Field)).call(this, props, context));

        _this5[__$_96__]  = {};
        _this5[__$_17__]  = {};
        _this5[__$_61__]  = {};
        _this5[__$_81__]  = [];
        _this5[__$_55__]  = true;
        _this5.dynEnum = {};
        _this5[__$_3__]  = {};
        return _this5;
    }

    _createClass(Field, [{
        key: "focus",
        value: function focus(path) {
            var self = this;
            self[__$_53__]  && self[__$_53__] .focus && self[__$_53__] .focus(path); 
        }
    }, {
        key: "rebuild",
        value: function rebuild(path) {
            var self = this;
            if (!path[__$_1__] ) {
                self[__$_55__]  = true;
                self[__$_38__] ();
            }
            self[__$_53__]  && self[__$_53__] [__$_54__]  && self[__$_53__] [__$_54__] (path);
        }
    }, {
        key: "_build",
        value: function _build() {
            var isMultiSelect = function isMultiSelect(schema) {
                return Array.isArray(schema[__$_49__]  && schema[__$_49__] .enum) && schema.uniqueItems;
            };
            var isFilesArray = function isFilesArray(schema) {
                return schema[__$_49__]  && schema[__$_49__] .type === "string" && schema[__$_49__] .format === "data-url";
            };
            var getPresetName = function getPresetName(schemaPart, type) {
                return type == 'array' ? isMultiSelect(schemaPart) ? 'multiselect' : isFilesArray(schemaPart) ? 'files' : 'array' : type;
            };
            var getWidget = function getWidget(objects, widget) {
                return typeof widget === 'string' ? objects[__$_69__]  && objects[__$_69__] [widget] || widget : widget;
            };
            var getEnumOptions = function getEnumOptions(schemaPart) {
                if (!schemaPart.enum) return undefined;
                var result = [],
                    vals = schemaPart.enum,
                    names = schemaPart.enumNames || [];
                vals[__$_2__] (function (value, i) {
                    return result[i] = { value: value, label: names[i] || value };
                });
                return result;
            };
            var self = this;
            var _self$props = self[__$_43__] ,
                registry = _self$props[__$_34__] ,
                path = _self$props[__$_36__] ,
                _self$props$childrenB = _self$props.childrenBlocks,
                childrenBlocks = _self$props$childrenB === undefined ? {} : _self$props$childrenB;

            var schemaPart = getSchemaPart(registry[__$_25__] , path);
            
            var type = isArr(schemaPart[__$_48__] ) ? schemaPart[__$_48__] [0] : schemaPart[__$_48__] ;
            var x = schemaPart.x || {};
            
            var objects = registry[__$_84__] ;
            var presets = objects.presets;
            var presetName = x.preset || getPresetName(schemaPart, type);
            var pathValue = path[__$_4__] (SymbolData, 'values', 'current');
            var pathTouched = path[__$_4__] (SymbolData, 'status', 'touched');
            var pathString = '/' + path.join('/');
            var funcs = {};
            funcs[__$_33__]  = function (value) {
                return registry.api.setSingle(pathValue, value === "" ? undefined : value, self[__$_79__] );
            };
            funcs.onBlur = function (value) {
                registry.api.setSingle(pathTouched, true, false);
                !self[__$_79__]  ? registry.api.validate(pathString) : null;
            };
            funcs.onFocus = function (value) {
                return registry.api.setSingle('/@/active', path, false);
            };
            var methods2chain = objKeys(objects[__$_47__] )[__$_77__] (function (key) {
                return objects[__$_47__] [key];
            });
            self[__$_7__]  = { registry: registry, path: path, schemaPart: schemaPart, field: self, funcs: funcs, methods2chain: methods2chain };
            self.builderProps = getFieldProps(presets, x, presetName, 'Builder', self[__$_7__] );
            
            var idPath = push2array([registry.formName], path);
            self[__$_41__]  = getEnumOptions(schemaPart);
            var widgets = {},
                schemaProps = {},
                preset = {};
            self[__$_81__]  = merge(childrenBlocks, getFieldProps(presets, x, presetName, 'blocks', self[__$_7__] ));
            self[__$_81__]  = objKeys(self[__$_81__] )[__$_77__] (function (key) {
                return self[__$_81__] [key];
            });
            self[__$_81__] .forEach(function (block) {
                var _a = getFieldProps(presets, x, presetName, block, self[__$_7__] ),
                    propsMap = _a[__$_97__] ,
                    widget = _a[__$_8__] ,
                    rest = __rest(_a, ["propsMap", "widget"]);
                schemaProps[block] = rest;
                self[__$_96__] [block] = propsMap;
                widgets[block] = widget;
                preset[block] = rest[SymbolData];
                delete rest[SymbolData];
                schemaProps[block].id = idPath.join('/');
                if (rest[__$_62__] ) schemaProps[block][rest[__$_62__] ] = self._getRef.bind(self);
            });
            self[__$_3__]  = { field: self, funcs: funcs, widgets: widgets, schemaProps: schemaProps, preset: preset, registry: registry, path: path, schemaPart: schemaPart, childrenBlocks: getFieldProps(presets, x, presetName, 'childrenBlocks', self[__$_7__] ) };
        }
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        

    }, {
        key: "_getRef",
        value: function _getRef(item) {
            this[__$_53__]  = item;
        }
    }, {
        key: "render",
        value: function render() {
            var self = this;
            if (self[__$_55__] ) this._build();
            self[__$_55__]  = false;
            var api = self[__$_3__] .registry.api;
            var data = api[__$_26__] (self[__$_43__] .path[__$_4__] (SymbolData)); 
            var enumOptions = self[__$_41__]  || data.enum; 
            self[__$_79__]  = data.params && data.params._liveValidate;
            var dataProps = {};
            self[__$_81__] .forEach(function (block) {
                return dataProps[block] = mapProps(self[__$_96__] [block], data, self[__$_7__] );
            });
            self[__$_17__]  = merge(self[__$_17__] , dataProps);
            var _a = self.builderProps,
                BuilderWidget = _a[__$_8__] ,
                builderPropsMap = _a[__$_97__] ,
                restProps = __rest(_a, ["widget", "propsMap"]);
            if (restProps[__$_62__] ) restProps[restProps[__$_62__] ] = self._getRef.bind(self);
            var builderDataProps = mapProps(builderPropsMap, data, self[__$_7__] );
            self[__$_61__]  = merge(self[__$_61__] , builderDataProps);
            return React[__$_0__] (BuilderWidget, __assign({ enumOptions: enumOptions }, restProps, self[__$_61__] , { fieldOptions: self[__$_3__] , dataProps: self[__$_17__] , dataTree: api[__$_26__] (self[__$_43__] .path) }));
        }
    }]);

    return Field;
}(react_1[__$_80__] );

function mapProps(map, data, bindObject) {
    if (!map) return {};
    var result = {};
    var keys = objKeys(map)[__$_77__] (function (key) {
        return map[key];
    });
    keys[__$_2__] (function (to) {
        var item = map[to];
        if (!isArr(item)) item = [item];
        var value = getIn(data, string2path(item[0]));
        var fn = item[1];
        var path = string2path(to);
        var key = path.pop();
        var obj = getByKey(result, path);
        obj[key] = fn ? fn[__$_102__] (bindObject)(value) : value;
    });
    return result;
}



function Unsupported(props) {
    return React[__$_0__] ("div", null, "Unsupported");
}
function DefaultBuilder(props) {
    var hidden = props.hidden,
        omit = props.omit,
        dataProps = props[__$_17__] ,
        rest = __rest(props, ["hidden", "omit", "_dataProps"]);

    if (omit) return false;
    var fieldOptions = props[__$_3__] ;
    var widgets = fieldOptions[__$_69__] ,
        schemaProps = fieldOptions[__$_85__] ;
    var Title = widgets.Title,
        Body = widgets.Body,
        Main = widgets[__$_64__] ,
        Message = widgets[__$_86__] ,
        Groups = widgets.Groups,
        Layout = widgets[__$_83__] ,
        ArrayItem = widgets[__$_71__] ,
        Array = widgets.Array,
        Autosize = widgets[__$_78__] ;

    var field = React[__$_0__] (Layout, __assign({ hidden: hidden }, schemaProps[__$_83__] , dataProps[__$_83__] ), React[__$_0__] (Title, __assign({}, schemaProps['Title'], dataProps['Title'])), React[__$_0__] (Body, __assign({}, schemaProps['Body'], dataProps['Body']), React[__$_0__] (Main, __assign({}, schemaProps[__$_64__] , dataProps[__$_64__] , rest)), React[__$_0__] (Message, __assign({}, schemaProps[__$_86__] , dataProps[__$_86__] )), Autosize ? React[__$_0__] (Autosize, __assign({ hidden: hidden }, schemaProps[__$_78__] , dataProps[__$_78__] , { fieldOptions: fieldOptions })) : ''));
    if (Array) field = React[__$_0__] (Array, __assign({ hidden: hidden }, schemaProps['Array'], dataProps['Array'], { fieldOptions: fieldOptions }), field);
    if (ArrayItem && dataProps[__$_64__] .itemData) field = React[__$_0__] (ArrayItem, __assign({ hidden: hidden }, schemaProps[__$_71__] , dataProps[__$_71__] , { fieldOptions: fieldOptions }), field);
    return field;
}









function DivBlock(props) {
    var id = props.id,
        _props$useTag2 = props[__$_13__] ,
        UseTag = _props$useTag2 === undefined ? 'div' : _props$useTag2,
        hidden = props.hidden,
        children = props[__$_74__] ,
        rest = __rest(props, ["id", "useTag", "hidden", "children"]);

    if (hidden) rest.style = merge(rest.style || {}, { visibility: 'hidden', height: 0 }); 
    return React[__$_0__] (UseTag, __assign({}, rest), children);
}
var sizerStyle = { position: 'absolute', top: 0, left: 0, visibility: 'hidden', height: 0, overflow: 'scroll', whiteSpace: 'pre' };

var AutosizeBlock = function (_React$Component) {
    _inherits(AutosizeBlock, _React$Component);

    function AutosizeBlock() {
        _classCallCheck(this, AutosizeBlock);

        return _possibleConstructorReturn(this, (AutosizeBlock[__$_30__]  || Object[__$_16__] (AutosizeBlock)).apply(this, arguments));
    }

    _createClass(AutosizeBlock, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this7 = this;

            var style = window && window.getComputedStyle(this[__$_43__] .fieldOptions.field.refs);
            if (!style || !this.elem) return;
            ['fontSize', 'fontFamily', 'fontWeight', 'fontStyle', 'letterSpacing'][__$_2__] (function (key) {
                return _this7.elem.style[key] = style[key];
            });
        }
    }, {
        key: "render",
        value: function render() {
            var self = this;
            var props = self[__$_43__] ;
            var value = (isUndefined(props[__$_21__] ) ? '' : props[__$_21__] .toString()) || props[__$_67__]  || '';
            return React[__$_0__] ("div", { style: sizerStyle, ref: function ref(elem) {
                    (self.elem = elem) && (props[__$_3__] .field[__$_53__] .style.width = elem.scrollWidth + (props.addWidth || 45) + 'px');
                } }, value);
        }
    }]);

    return AutosizeBlock;
}(React[__$_80__] );



function TitleBlock(props) {
    var id = props.id,
        _props$title = props.title,
        title = _props$title === undefined ? '' : _props$title,
        required = props[__$_70__] ,
        _props$useTag3 = props[__$_13__] ,
        UseTag = _props$useTag3 === undefined ? 'label' : _props$useTag3,
        requireSymbol = props.requireSymbol,
        emptyTitle = props.emptyTitle,
        rest = __rest(props, ["id", "title", "required", "useTag", "requireSymbol", "emptyTitle"]);

    return React[__$_0__] (UseTag, __assign({}, UseTag == 'label' ? { htmlFor: id } : {}, rest), emptyTitle ? typeof emptyTitle == 'string' ? emptyTitle : '' : required ? title + requireSymbol : title);
}
function BaseInput(props) {
    var value = props[__$_21__] ,
        UseTag = props[__$_13__] ,
        _props$type = props[__$_48__] ,
        type = _props$type === undefined ? 'text' : _props$type,
        title = props.title,
        dataTree = props[__$_32__] ,
        fieldOptions = props[__$_3__] ,
        enumOptions = props[__$_41__] ,
        refName = props[__$_62__] ,
        rest = __rest(props, ["value", "useTag", "type", "title", "dataTree", "fieldOptions", "_enumOptions", "refName"]);

    UseTag = UseTag || (type == 'textarea' || type == 'select' ? type : 'input');
    var refObj = {};
    var ref = rest[refName];
    if (refName) delete rest[refName];
    if (typeof UseTag == 'string') refObj.ref = ref;else refObj[refName] = ref;
    var commonProps = { name: props.id, label: title || props.id.split('/')[__$_23__] (-1)[0] }; 
    var valueObj = {};
    if (type === 'checkbox') valueObj.checked = isUndefined(value) ? false : value;else if (type === 'tristate') valueObj.checked = value;else valueObj[__$_21__]  = isUndefined(value) ? "" : value;
    if (type === 'textarea') return React[__$_0__] (UseTag, __assign({}, rest, refObj, commonProps), valueObj[__$_21__] );
    if (type === 'select') {
        var placeholder = rest[__$_67__] ,
            selectRest = __rest(rest, [__$_67__] );
        return React[__$_0__] (UseTag, __assign({}, selectRest, refObj, commonProps, { value: isUndefined(value) ? props.multiple ? [] : "" : value }), !props.multiple && placeholder && React[__$_0__] ("option", { value: "" }, placeholder), enumOptions.map(function (_ref, i) {
            var value = _ref[__$_21__] ,
                label = _ref.label;
            return React[__$_0__] ("option", { key: i, value: value }, label);
        }));
    } 
    else return React[__$_0__] (UseTag, __assign({}, rest, refObj, valueObj, { type: type }, commonProps));
}
;
function ArrayInput(props) {
    function selectValue(value, selected, all) {
        var at = all[__$_6__] (value);
        var updated = selected[__$_23__] (0, at)[__$_4__] (value, selected[__$_23__] (at));
        return updated.sort(function (a, b) {
            return all[__$_6__] (a) > all[__$_6__] (b);
        }); 
    }
    function deselectValue(value, selected) {
        return selected[__$_77__] (function (v) {
            return v !== value;
        });
    }

    var value = props[__$_21__] ,
        _props$useTag4 = props[__$_13__] ,
        UseTag = _props$useTag4 === undefined ? 'div' : _props$useTag4,
        type = props[__$_48__] ,
        title = props.title,
        onFocus = props.onFocus,
        onBlur = props.onBlur,
        _onChange = props[__$_33__] ,
        dataTree = props[__$_32__] ,
        fieldOptions = props[__$_3__] ,
        enumOptions = props[__$_41__] ,
        refName = props[__$_62__] ,
        autofocus = props.autofocus,
        disabled = props.disabled,
        disabledClass = props.disabledClass,
        inputProps = props.inputProps,
        labelProps = props[__$_75__] ,
        stackedProps = props.stackedProps,
        rest = __rest(props, ["value", "useTag", "type", "title", "onFocus", "onBlur", "onChange", "dataTree", "fieldOptions", "_enumOptions", "refName", "autofocus", "disabled", "disabledClass", "inputProps", "labelProps", "stackedProps"]);

    type = fieldOptions[__$_99__] .type == 'array' ? 'checkbox' : 'radio';
    var name = props.id;
    var ref = rest[refName];
    if (refName) delete rest[refName];

    var _inputProps$useTag = inputProps[__$_13__] ,
        InputUseTag = _inputProps$useTag === undefined ? 'input' : _inputProps$useTag,
        restInput = __rest(inputProps, [__$_13__] );

    var _labelProps$useTag = labelProps[__$_13__] ,
        LabelUseTag = _labelProps$useTag === undefined ? 'label' : _labelProps$useTag,
        restLabel = __rest(labelProps, [__$_13__] );

    var stacked = !!stackedProps;
    if (!stackedProps) stackedProps = {};

    var _stackedProps = stackedProps,
        _stackedProps$useTag = _stackedProps[__$_13__] ,
        StackedlUseTag = _stackedProps$useTag === undefined ? 'div' : _stackedProps$useTag,
        restStacked = __rest(stackedProps, [__$_13__] );

    return React[__$_0__] (UseTag, __assign({}, rest), enumOptions && enumOptions.map(function (option, i) {
        var addClass = disabled ? disabledClass : "";
        var input = void 0;
        if (type == 'radio') {
            var checked = option[__$_21__]  === value; 
            input = React[__$_0__] (InputUseTag, __assign({ type: type, checked: checked, id: name + "/" + i, name: name, value: option[__$_21__] , disabled: disabled, autoFocus: autofocus && i === 0, onFocus: onFocus, onBlur: onBlur, onChange: function onChange(event) {
                    _onChange(option[__$_21__] );
                } }, restInput));
        } else {
            var _checked = value[__$_6__] (option[__$_21__] ) !== -1;
            input = React[__$_0__] (InputUseTag, __assign({ type: type, checked: _checked, id: name + "/" + i, name: name + "/" + i, disabled: disabled, autoFocus: autofocus && i === 0, onFocus: onFocus[__$_102__] (props), onBlur: onBlur[__$_102__] (props), onChange: function onChange(event) {
                    var all = enumOptions.map(function (_ref2) {
                        var value = _ref2[__$_21__] ;
                        return value;
                    });
                    if (event.target.checked) props.funcs.onChange(selectValue(option[__$_21__] , value, all));else props.funcs.onChange(deselectValue(option[__$_21__] , value));
                } }, restInput));
        }
        if (addClass) {
            var _obj = stacked ? restStacked : restLabel;
            _obj.className = (_obj.className || "" + " " + addClass).trim();
        }
        return stacked ? React[__$_0__] (StackedlUseTag, __assign({ key: i }, restStacked), React[__$_0__] (LabelUseTag, __assign({}, restLabel), input, React[__$_0__] ("span", null, option.label))) : React[__$_0__] (LabelUseTag, __assign({ key: i }, restLabel), input, React[__$_0__] ("span", null, option.label));
    }));
}
function CheckboxInput(props) {
    var labelProps = props[__$_75__] ,
        rest = __rest(props, [__$_75__] );
    return React[__$_0__] ("label", __assign({}, labelProps), React[__$_0__] (BaseInput, __assign({}, rest)), React[__$_0__] ("span", null, props.title));
}
function MessageBlock(props) {
    var _props$useTag5 = props[__$_13__] ,
        UseTag = _props$useTag5 === undefined ? 'div' : _props$useTag5,
        messageItem = props.messageItem,
        _props$messages = props.messages,
        messages = _props$messages === undefined ? {} : _props$messages,
        _props$itemsProps = props.itemsProps,
        itemsProps = _props$itemsProps === undefined ? {} : _props$itemsProps,
        id = props.id,
        rest = __rest(props, ["useTag", "messageItem", "messages", "itemsProps", "id"]);

    var WidgetMessageItem = messageItem[__$_8__] ,
        restMessageItem = __rest(messageItem, [__$_8__] );
    var keys = objKeys(messages);
    var result = [];
    var mergedMessages = merge(messages, itemsProps);
    keys.sort(function (a, b) {
        return parseFloat(a) - parseFloat(b);
    });
    keys[__$_2__] (function (key) {
        if (mergedMessages[key].hiddenBind === true || mergedMessages[key].hidden || !mergedMessages[key][__$_31__] .length) return;
        result[__$_20__] (React[__$_0__] (WidgetMessageItem, __assign({ key: key, message: mergedMessages[key] }, restMessageItem)));
    });
    return React[__$_0__] (UseTag, __assign({}, rest), result);
}
function MessageItem(props) {
    var _props$useTag6 = props[__$_13__] ,
        UseTag = _props$useTag6 === undefined ? 'div' : _props$useTag6,
        message = props.message,
        rest = __rest(props, ["useTag", "message"]);
    


    return React[__$_0__] (UseTag, __assign({}, rest), message[__$_31__] .join(React[__$_0__] ("br", null)));
}
function EmptyArray(props) {
    var _props$useTag7 = props[__$_13__] ,
        UseTag = _props$useTag7 === undefined ? 'div' : _props$useTag7,
        _props$text = props.text,
        text = _props$text === undefined ? 'This array is empty.' : _props$text,
        rest = __rest(props, ["useTag", "text"]);

    return React[__$_0__] (UseTag, __assign({}, rest), text, " ", props[__$_74__] );
}
function AddButtonBlock(props) {
    var _props$useTag8 = props[__$_13__] ,
        UseTag = _props$useTag8 === undefined ? 'button' : _props$useTag8,
        _props$text2 = props.text,
        text = _props$text2 === undefined ? 'Add new item' : _props$text2,
        _props$type2 = props[__$_48__] ,
        type = _props$type2 === undefined ? 'button' : _props$type2,
        rest = __rest(props, ["useTag", "text", "type"]);

    return React[__$_0__] (UseTag, __assign({ type: type }, rest), text);
}
function ItemMenu(props) {
    var _props$useTag9 = props[__$_13__] ,
        UseTag = _props$useTag9 === undefined ? 'div' : _props$useTag9,
        _props$buttonProps = props.buttonProps,
        buttonProps = _props$buttonProps === undefined ? {} : _props$buttonProps,
        buttons = props.buttons,
        itemData = props.itemData,
        fieldOptions = props[__$_3__] ,
        dataTree = props[__$_32__] ,
        rest = __rest(props, ["useTag", "buttonProps", "buttons", "itemData", "fieldOptions", "dataTree"]);

    if (!itemData) return false;
    var canUp = itemData.canUp,
        canDown = itemData.canDown,
        canDel = itemData.canDel;
    var path = fieldOptions[__$_36__] ,
        registry = fieldOptions[__$_34__] ;

    var api = registry.api;

    var _buttonProps$useTag = buttonProps[__$_13__] ,
        UseButtonTag = _buttonProps$useTag === undefined ? 'button' : _buttonProps$useTag,
        _buttonProps$type = buttonProps[__$_48__] ,
        type = _buttonProps$type === undefined ? 'button' : _buttonProps$type,
        _onClick = buttonProps.onClick,
        titles = buttonProps.titles,
        restButton = __rest(buttonProps, ["useTag", "type", "onClick", "titles"]);

    var canChecks = { 'first': canUp, 'last': canDown, 'up': canUp, 'down': canDown, 'del': canDel };
    buttons[__$_2__] (function (key) {
        return delete rest[key];
    });
    return React[__$_0__] (UseTag, __assign({}, rest), buttons.map(function (key) {
        var KeyWidget = props[key];
        if (KeyWidget === false || canChecks[key] === undefined) return '';
        return React[__$_0__] (UseButtonTag, __assign({ key: key, type: type, title: titles && titles[key] ? titles[key] : key, "data-bType": key, disabled: !canChecks[key] }, restButton, { onClick: function onClick() {
                return _onClick(key);
            } }), typeof KeyWidget === 'function' ? React[__$_0__] (KeyWidget, null) : KeyWidget || key);
    }));
}
function ArrayItem(props) {
    if (!props.itemData) return React.Children.only(props[__$_74__] );

    var children = props[__$_74__] ,
        hidden = props.hidden,
        itemMain = props.itemMain,
        itemBody = props.itemBody,
        itemMenu = props.itemMenu,
        rest = __rest(props, ["children", "hidden", "itemMain", "itemBody", "itemMenu"]);

    var _a = itemMain || {},
        _a$widget3 = _a[__$_8__] ,
        Item = _a$widget3 === undefined ? 'div' : _a$widget3,
        itemRest = __rest(_a, [__$_8__] );var _b = itemBody || {},
        _b$widget = _b[__$_8__] ,
        ItemBody = _b$widget === undefined ? 'div' : _b$widget,
        itemBodyRest = __rest(_b, [__$_8__] );var _c = itemMenu || {},
        _c$widget = _c[__$_8__] ,
        ItemMenu = _c$widget === undefined ? 'div' : _c$widget,
        itemMenuRest = __rest(_c, [__$_8__] );
    if (hidden) itemRest.style = merge(itemRest.style || {}, { display: 'none' });
    return React[__$_0__] (Item, __assign({}, itemRest), React[__$_0__] (ItemBody, __assign({}, itemBodyRest), React.Children.only(children)), React[__$_0__] (ItemMenu, __assign({}, itemMenuRest, rest)));
}
function CombineWidgets(props) {
    function processWidget(key) {
        if (skip[key]) return false;
        var _a = this[key],
            Widget = _a[__$_8__] ,
            _a$inner = _a.inner,
            inner = _a$inner === undefined ? {} : _a$inner,
            _a$innerProps = _a.innerProps,
            innerProps = _a$innerProps === undefined ? [] : _a$innerProps,
            _a$addProps = _a.addProps,
            addProps = _a$addProps === undefined ? [] : _a$addProps,
            _a$extractProps = _a.extractProps,
            extractProps = _a$extractProps === undefined ? [] : _a$extractProps,
            rest = __rest(_a, ["widget", "inner", "innerProps", "addProps", "extractProps"]);var InnerWidget = inner[__$_8__] ,
            restInner = __rest(inner, [__$_8__] );
        var widgetProps = {},
            innerWidgetProps = {};
        addProps[__$_2__] (function (propName) {
            return widgetProps[propName] = props[propName];
        });
        innerProps[__$_2__] (function (propName) {
            return innerWidgetProps[propName] = props[propName];
        });
        push2array(props2remove, extractProps);
        return InnerWidget ? React[__$_0__] (Widget, __assign({ key: key }, widgetProps, rest), React[__$_0__] (InnerWidget, __assign({}, innerWidgetProps, restInner))) : React[__$_0__] (Widget, __assign({ key: key }, widgetProps, rest));
    }

    var Widget = props[__$_8__] ,
        _props$before = props.before,
        before = _props$before === undefined ? {} : _props$before,
        _props$after = props.after,
        after = _props$after === undefined ? {} : _props$after,
        _props$skip = props.skip,
        skip = _props$skip === undefined ? {} : _props$skip,
        Layout = props[__$_83__] ,
        rest = __rest(props, ["widget", "before", "after", "skip", "Layout"]);

    var PrevWidget = props[__$_3__] .preset[__$_64__] .getWidgetBefore(CombineWidgets);
    var LayoutWidget = Layout[__$_8__] ,
        layoutRest = __rest(Layout, [__$_8__] );
    var props2remove = [];
    var beforeWidgets = objKeys(before).sort().map(processWidget[__$_102__] (before));
    var afterWidgets = objKeys(after).sort().map(processWidget[__$_102__] (after));
    props2remove[__$_2__] (function (key) {
        return delete rest[key];
    });
    return React[__$_0__] (LayoutWidget, __assign({}, layoutRest), beforeWidgets, React[__$_0__] (PrevWidget, __assign({}, rest)), afterWidgets);
}
function selectorOnChange(asTabs) {
    return function (value) {
        var _this8 = this;

        var api = this[__$_34__] .api;
        api[__$_35__] ();
        this[__$_33__] (value);
        var vals = void 0;
        if (isArr(value)) vals = value[__$_23__] ();else vals = [value];
        var path = this[__$_36__] .slice();
        var selectorField = path.pop();
        var stringPath = path2string(path);
        vals = vals[__$_77__] (function (key) {
            return _this8[__$_34__] .api[__$_26__] (stringPath + '/' + key);
        });
        vals[__$_20__] (selectorField);
        if (asTabs) api[__$_95__] (stringPath + '/' + vals.join(','));else api.selectNshow(stringPath + '/' + vals.join(','));
        api[__$_46__] ();
    };
}
function onSelectChange(event) {
    function processSelectValue(_ref3, value) {
        var type = _ref3[__$_48__] ,
            items = _ref3[__$_49__] ;

        if (value === "") return undefined;else if (type === "array" && items && (items[__$_48__]  == "number" || items[__$_48__]  == "integer")) return value.map(asNumber);else if (type === "boolean") return value === "true";else if (type === "number") return asNumber(value);
        return value;
    }
    function getSelectValue(event, multiple) {
        if (multiple) return [][__$_23__] .call(event.target.options)[__$_77__] (function (item) {
            return item.selected;
        }).map(function (item) {
            return item[__$_21__] ;
        });else return event.target.value;
    }
    this[__$_33__] (processSelectValue(this.field.fieldOptions[__$_99__] , getSelectValue(event, this.field.fieldOptions[__$_85__] [__$_64__] .multiple)));
}
function getArrayOfPropsFromArrayOfObjects(arr, propPath) {
    propPath = pathOrString2path(propPath);

    var _loop3 = function _loop3(i) {
        arr = arr[__$_77__] (function (item) {
            return item[__$_10__] (propPath[i]);
        }).map(function (item) {
            return item[propPath[i]];
        });
        if (!arr[__$_1__] ) return "break";
    };

    for (var i = propPath[0] == '#' ? 1 : 0; i < propPath[__$_1__] ; i++) {
        var _ret6 = _loop3(i);

        if (_ret6 === "break") break;
    }
    return arr;
}
function TristateBox(props) {
    var self = this;

    var checked = props.checked,
        _onChange2 = props[__$_33__] ,
        nullValue = props.nullValue,
        getRef = props.getRef,
        type = props[__$_48__] ,
        rest = __rest(props, ["checked", "onChange", "nullValue", "getRef", "type"]);

    return React[__$_0__] ("input", __assign({ type: "checkbox", checked: checked === true }, rest, { onChange: function onChange(event) {
            _onChange2(checked === nullValue ? false : checked === false ? true : nullValue, event);
        }, ref: function ref(elem) {
            getRef && getRef(elem);
            elem && (elem.indeterminate = checked === nullValue);
        } }));
}



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
                            this[__$_34__] .api.arrayItemOps(this[__$_36__] , key);
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
                    this[__$_33__] (event.target.value);
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
                    this[__$_33__] (event.target.checked);
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



function makeValidation(dispath) {
    function addValidatorResult2message(srcMessages, track, result) {
        var defLevel = arguments[__$_1__]  > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        function conv(item) {
            return (typeof item === "undefined" ? "undefined" : _typeof2(item)) === 'object' ? item : { level: defLevel, text: item };
        }
        ;
        var colors = ['', 'success', 'warning', 'danger']; 
        if (isObject(result)) objKeys(result)[__$_2__] (function (key) {
            return addValidatorResult2message(srcMessages, track[__$_4__] (key), result[key], defLevel);
        });else {
            var messages = isArr(result) ? result.map(conv) : [conv(result)];
            messages[__$_2__] (function (item) {
                var level = item.level,
                    text = item.text,
                    path = item[__$_36__] ,
                    replace = item.replace,
                    _item$type = item[__$_48__] ,
                    type = _item$type === undefined ? 'danger' : _item$type,
                    rest = __rest(item, ["level", "text", "path", "replace", "type"]);

                path = track[__$_4__] ((typeof path === 'string' ? string2path(path) : path) || []);
                var fullPath = path2string(path, ['messages', level]);
                var mData = getByKey(srcMessages, fullPath, { textArray: [] });
                mData = getByKey(validationMessages, fullPath, mData);
                if (text) {
                    if (replace === undefined) mData[__$_31__] .push(text);else mData[__$_31__] [replace] = text;
                }
                Object[__$_82__] (mData, rest);
                var shortPath = path2string(path);
                if (type == 'danger') {
                    var valid = validStatus[shortPath];
                    if (isUndefined(valid) || valid || mData[__$_31__] .length) validStatus[shortPath] = !mData[__$_31__] .length; 
                } 
                if (isUndefined(colorStatus[shortPath])) colorStatus[shortPath] = '';
                if (mData[__$_31__] .length && colors[__$_6__] (colorStatus[shortPath]) < colors[__$_6__] (type)) colorStatus[shortPath] = ~colors[__$_6__] (type) ? type : '';
            });
        }
    }
    function recurseValidation(curValues, modifiedValues) {
        var track = arguments[__$_1__]  > 2 && arguments[2] !== undefined ? arguments[2] : [];

        var data = getIn(state, track[__$_4__] ([SymbolData]));
        if (!data) return;
        var schemaPart = getSchemaPart(schema, track);
        if (schemaPart[__$_48__]  == 'object' || schemaPart[__$_48__]  == 'array') modifiedValues && objKeys(modifiedValues)[__$_2__] (function (key) {
            return recurseValidation(curValues[key], modifiedValues[key], track[__$_4__] (key));
        });
        var x = schemaPart.x;
        if (x && x[__$_98__] ) {
            x[__$_98__] .forEach(function (validator) {
                var result = validator({ utils: utils, state: state, path: track, schemaPart: schemaPart, schema: schema }, curValues);
                
                if (result && result.then && typeof result.then === 'function') {
                    result.vData = { curValues: curValues, path: track };
                    promises[__$_20__] (result);
                    pendingStatus[path2string(track)] = true;
                } else addValidatorResult2message(validationMessages, track, result, 1);
            });
        }
    }
    function sendMessages2State() {
        objKeys(validationMessages)[__$_2__] (function (pathString) {
            var item = makePathItem(pathString);
            item[__$_21__]  = validationMessages[pathString];
            validationUpdates[__$_20__] (item);
        });
        objKeys(validStatus)[__$_2__] (function (pathString) {
            return validationUpdates[__$_20__] ({ path: string2path(pathString), keyPath: ['status', 'valid'], value: validStatus[pathString] });
        });
        objKeys(pendingStatus)[__$_2__] (function (pathString) {
            return validationUpdates[__$_20__] ({ path: string2path(pathString), keyPath: ['status', 'pending'], value: pendingStatus[pathString] });
        });
        objKeys(colorStatus)[__$_2__] (function (pathString) {
            return validationUpdates[__$_20__] ({ path: string2path(pathString), keyPath: ['status', 'color'], value: colorStatus[pathString] });
        });
        if (validationUpdates[__$_1__] ) dispath({
            type: actionName4setItems,
            items: validationUpdates,
            stuff: stuff
        });
    }
    function clearDefaultMessages(modifiedValues) {
        var track = arguments[__$_1__]  > 1 && arguments[1] !== undefined ? arguments[1] : [];

        var data = getIn(state, track[__$_4__] ([SymbolData]));
        if (!data) return;
        if (data[__$_50__] .type == 'object' || data[__$_50__] .type == 'array') modifiedValues && objKeys(modifiedValues)[__$_2__] (function (key) {
            return clearDefaultMessages(modifiedValues[key], track[__$_4__] (key));
        });
        addValidatorResult2message(validationMessages, track); 
    }
    var stuff = this.stuff,
        force = this.force;
    var JSONValidator = stuff.JSONValidator,
        schema = stuff[__$_25__] ,
        getState = stuff[__$_72__] ;

    var oldState = getState();
    
    if (force) oldState = null; 
    else dispath(this);
    
    var state = getState();
    if (oldState == state) return Promise[__$_87__] (); 
    var newValues = state[SymbolData][__$_12__] ;
    var validStatus = {};
    var pendingStatus = {};
    var colorStatus = {};
    var validationMessages = {};
    var validationUpdates = [];
    var promises = [];
    var modifiedValues = force === true ? newValues : force || state[SymbolData][__$_63__] ; 
    if (!modifiedValues) return Promise[__$_87__] (); 
    clearDefaultMessages(modifiedValues);
    var errs = JSONValidator(newValues);
    errs[__$_2__] (function (item) {
        return addValidatorResult2message(validationMessages, item[0], item[1]);
    }); 
    recurseValidation(newValues, modifiedValues);
    
    sendMessages2State();
    
    getState()[SymbolData][__$_27__]  = merge(state[SymbolData][__$_27__] , getState()[SymbolData][__$_27__] , { symbol: true }); 
    if (promises[__$_1__] ) {
        
        validationMessages = {};
        validStatus = {};
        validationUpdates = [];
        return Promise.all(promises).then(function (results) {
            var newValues = getState()[SymbolData][__$_12__] ;
            for (var i = 0; i < promises[__$_1__] ; i++) {
                if (!results[i]) continue;
                var _promises$i$vData = promises[i].vData,
                    curValues = _promises$i$vData.curValues,
                    _path = _promises$i$vData[__$_36__] ;

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
    return Promise[__$_87__] ();
}
var actionSetItems = function actionSetItems(items, stuff, validate) {
    var action = { type: actionName4setItems, items: items, stuff: stuff };
    return validate ? makeValidation[__$_102__] (action) : action;
};
var actionForceValidation = function actionForceValidation(force, stuff) {
    var action = { type: actionName4forceValidation, force: force, stuff: stuff };
    return makeValidation[__$_102__] (action);
};



function formReducer(name) {
    if (name) formReducerValue = name;
    var reducersFunction = {};
    function setStateChanges(startState, action) {
        function makeSliceFromUpdateItem(item) {
            if (item[__$_5__] ) return makeSlice(item[__$_36__] , SymbolData, item[__$_5__] , item[__$_21__] );else return makeSlice(item[__$_36__] , item[__$_21__] );
        }
        function setCurrentValue(state, changes) {
            return mergeState(state[SymbolData][__$_12__] , getAsObject(state, [SymbolData, 'values'], getValue, changes), { arrays: 'mergeWithLength', del: true, SymbolDelete: Symbol.for('FFormDelete') });
        }
        function mergeProcedure(prevState, newState) {
            mergeResult = mergeState(prevState, newState, options4changes);
            state = mergeResult[__$_73__] ;
            changes = mergeResult[__$_27__] ;
            if (changes) allChanges[__$_20__] (changes);
            return state;
        }
        function applyHooksProcedure(items, hookType) {
            var _loop4 = function _loop4(j) {
                var item = items[j];
                if (!isObject(getIn(state, item[__$_36__] ))) return "continue";
                var changes = {};
                changes.before = [];
                changes.after = [];
                changes.item = [item];

                var _loop5 = function _loop5(_i4) {
                    var res = beforeMerge[_i4](state, item, utils, stuff[__$_25__] , data, hookType);
                    if (!res) return {
                            v: {
                                v: false
                            }
                        };
                    if (isArr(res)) res = { after: res };
                    ['before', 'after'][__$_2__] (function (key) {
                        return res[key] && push2array(changes[key], res[key]);
                    });
                    if (res.skip) changes.item = [];
                };

                for (var _i4 = 0; _i4 < beforeMerge[__$_1__] ; _i4++) {
                    var _ret8 = _loop5(_i4);

                    if ((typeof _ret8 === "undefined" ? "undefined" : _typeof2(_ret8)) === "object") return _ret8.v;
                }
                ['before', 'item', 'after'][__$_2__] (function (key) {
                    return changes[key][__$_2__] (function (item) {
                        return state = merge(state, makeSliceFromUpdateItem(item), options);
                    });
                });
            };

            for (var j = 0; j < items[__$_1__] ; j++) {
                var _ret7 = _loop4(j);

                switch (_ret7) {
                    case "continue":
                        continue;

                    default:
                        if ((typeof _ret7 === "undefined" ? "undefined" : _typeof2(_ret7)) === "object") return _ret7.v;
                }
            }
            afterMergeProcedureState = mergeProcedure(afterMergeProcedureState, state);
            for (var i = 0; i < afterMerge[__$_1__] ; i++) {
                var res = afterMerge[i](state, allChanges, utils, stuff[__$_25__] , data, hookType);
                if (!res) return false; 
                res[__$_2__] (function (item) {
                    return state = merge(state, makeSliceFromUpdateItem(item), options);
                });
                afterMergeProcedureState = mergeProcedure(afterMergeProcedureState, state);
            }
            return true;
        }
        var _action$options = action.options,
            options = _action$options === undefined ? {} : _action$options,
            stuff = action.stuff,
            items = action[__$_49__] ;

        var allChanges = [];
        Object[__$_82__] (options, { symbol: true });
        var mergeResult = void 0,
            changes = void 0,
            state = startState,
            data = {};
        var options4changes = merge(options, { diff: true });
        var afterMergeProcedureState = startState;
        var _stuff$hooks = stuff.hooks,
            afterMerge = _stuff$hooks.afterMerge,
            beforeMerge = _stuff$hooks.beforeMerge;
        

        if (!applyHooksProcedure(items, 'beforeMap')) return startState;
        
        var apllyItems = applyMap(state, allChanges);
        if (!apllyItems) return startState; 
        
        if (!applyHooksProcedure(apllyItems, 'afterMap')) return startState;
        
        
        if (state != startState) {
            if (allChanges[__$_1__]  > 1) mergeProcedure(startState, state);else changes = allChanges[0];
            state[SymbolData] = Object[__$_82__] ({}, state[SymbolData]); 
            var cur = setCurrentValue(state, changes);
            state[SymbolData][__$_12__]  = cur[__$_73__] ;
            state[SymbolData][__$_63__]  = cur[__$_27__] ;
            state[SymbolData]['version']++;
            if (state == changes) {
                changes = Object[__$_82__] ({}, state);
                changes[SymbolData] = Object[__$_82__] ({}, state[SymbolData]);
            }
            state[SymbolData][__$_27__]  = changes;
        }
        
        return state;
    }
    function applyMap(state, changesArray) {
        var result = [];
        function recurse(state, changes) {
            var track = arguments[__$_1__]  > 2 && arguments[2] !== undefined ? arguments[2] : [__$_101__] ;

            if (getIn(state, [SymbolData, 'dataMap'])) {
                (function () {
                    var dataObj = state[SymbolData];
                    var trackString = path2string(track);
                    objKeysAndSymbols(dataObj[__$_39__] )[__$_2__] (function (keyPathFrom) {
                        var mapTo = dataObj[__$_39__] [keyPathFrom];
                        var value = keyPathFrom == SymbolData ? state : getIn(dataObj, string2path(keyPathFrom));
                        objKeys(mapTo)[__$_2__] (function (key) {
                            var valueFn = mapTo[key];
                            var to = makePathItem(key, track);
                            if (keyPathFrom == SymbolData && to[__$_5__] ) delete to[__$_5__] ; 
                            to[__$_21__]  = valueFn ? valueFn[__$_102__] ({ state: state, path: track, utils: utils })(value) : value;
                            if (to[__$_5__]  && isObject(value)) {
                                object2PathValues(value)[__$_2__] (function (pathValue) {
                                    var value = pathValue.pop();
                                    var keyPath = to[__$_5__] .concat(pathValue);
                                    result[__$_20__] ({ path: to[__$_36__] , keyPath: keyPath, value: value });
                                });
                            } else {
                                result[__$_20__] (to);
                            }
                        });
                    });
                })();
            }
            if (isObject(changes)) objKeys(changes)[__$_2__] (function (key) {
                return recurse(state[key], changes[key], track[__$_4__] (key));
            });
        }
        changesArray[__$_2__] (function (changes) {
            return recurse(state, changes);
        });
        return result;
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    reducersFunction[actionName4setItems] = function (state, action) {
        return setStateChanges(state, action);
    };
    return function (state, action) {
        var reduce = reducersFunction[action[__$_48__] ];
        return reduce ? reduce(state, action) : state;
    };
}
exports.formReducer = formReducer;



function apiCreator(dispath, getState, setState, keyMap, hooks, JSONValidator, schema) {
    var api = {};
    var batching = 0;
    var batchedItems = [];
    var dispathAction = dispath;
    var stuff = { JSONValidator: JSONValidator, hooks: hooks, getState: getState, schema: schema };
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    api[__$_72__]  = getState;
    api.validate = function () {
        var force = arguments[__$_1__]  > 0 && arguments[0] !== undefined ? arguments[0] : true;

        if (typeof force === 'string') force = [force];
        if (isArr(force)) {
            (function () {
                var result = {};
                force[__$_2__] (function (value) {
                    return getByKey(result, string2path(value));
                });
                force = result;
            })();
        }
        return dispath(actionForceValidation(force, stuff));
    };
    api[__$_26__]  = function (path) {
        return getIn(getState(), typeof path == 'string' ? string2path(path) : path);
    };
    api[__$_59__]  = function (path, value) {
        var validate = arguments[__$_1__]  > 2 && arguments[2] !== undefined ? arguments[2] : !batching;

        return dispathAction(actionSetItems([makeUpdateItem(path, value)], stuff, validate));
    };
    api[__$_88__]  = function (path, value) {
        var validate = arguments[__$_1__]  > 2 && arguments[2] !== undefined ? arguments[2] : !batching;

        var items = makeArrayOfPathItem(path);
        items[__$_2__] (function (item) {
            return item[__$_21__]  = value;
        });
        return dispathAction(actionSetItems(items, stuff, validate));
    };
    api[__$_52__]  = function (path, value) {
        var validate = arguments[__$_1__]  > 2 && arguments[2] !== undefined ? arguments[2] : !batching;

        var items = makeArrayOfPathItem(path);
        var obj = {};
        var result = [];
        items[__$_2__] (function (item) {
            var key = item[__$_36__] .slice(0, -1)[__$_4__] (item[__$_5__]  ? push2array(['@'], item[__$_5__] ) : []).join('/');
            if (!obj[key]) obj[key] = [];
            obj[key][__$_20__] (item[__$_36__] [item[__$_36__] .length - 1]);
        });
        var state = getState();
        objKeys(obj)[__$_2__] (function (pathString) {
            var pathItem = makePathItem(pathString);
            var keys = getKeysAccording2schema(state, pathItem[__$_36__] ); 
            obj[pathString][__$_2__] (function (key2del) {
                return ~keys[__$_6__] (key2del) && keys[__$_91__] (keys[__$_6__] (key2del), 1);
            });
            keys[__$_2__] (function (key) {
                return result[__$_20__] ({ path: pathItem[__$_36__] .concat(key), keyPath: pathItem[__$_5__] , value: value });
            });
        });
        items = result;
        return dispathAction(actionSetItems(items, stuff, validate));
    };
    api[__$_89__]  = function (keyPath, unflatten, fn) {
        var value = getAsObject(getState(), push2array([SymbolData], typeof keyPath == 'string' ? string2path(keyPath) : keyPath), fn);
        return unflatten ? value : keyMap.flatten(value);
    };
    api[__$_42__]  = function (vals, keyPath) {
        var validate = arguments[__$_1__]  > 2 && arguments[2] !== undefined ? arguments[2] : !batching;

        function recursivelySetLength4arrays(items, vals) {
            var track = arguments[__$_1__]  > 2 && arguments[2] !== undefined ? arguments[2] : [];

            if (isArr(vals) && changeLength) items[__$_20__] ({ path: [__$_101__] .concat(keyMap[__$_45__] (track)), keyPath: ['array', 'lengths', changeLength], value: vals[__$_1__]  });
            if (isMergeableObject(vals)) objKeys(vals)[__$_2__] (function (key) {
                return recursivelySetLength4arrays(items, vals[key], track[__$_4__] (key));
            });
        }
        if (typeof keyPath == 'string') keyPath = string2path(keyPath);
        var items = [];
        var changeLength = keyPath[0] == 'values' && keyPath[1];
        recursivelySetLength4arrays(items, vals);
        object2PathValues(vals)[__$_2__] (function (item) {
            var value = item.pop();
            items[__$_20__] ({ path: [__$_101__] .concat(keyMap[__$_45__] (item)), keyPath: keyPath, value: value });
        });
        return dispathAction(actionSetItems(items, stuff, validate));
    };
    api.getValues = function (unflatten) {
        return unflatten ? getState()[SymbolData][__$_12__]  : keyMap.flatten(getState()[SymbolData][__$_12__] );
    };
    api.setValues = function (vals) {
        var validate = arguments[__$_1__]  > 1 && arguments[1] !== undefined ? arguments[1] : !batching;
        return api[__$_42__] (vals, ['values', 'current'], validate);
    };
    api.getItital = function () {
        return api[__$_89__] (['values', 'inital']);
    };
    api.setItital = function (vals) {
        var validate = arguments[__$_1__]  > 1 && arguments[1] !== undefined ? arguments[1] : !batching;
        return api[__$_42__] (vals, ['values', 'inital'], validate);
    };
    api.getActive = function () {
        return api[__$_26__] ([[], ['active']]);
    };
    api.arrayOps = function (path) {
        var op = arguments[__$_1__]  > 1 && arguments[1] !== undefined ? arguments[1] : 'add';

        path = typeof path == 'string' ? string2path(path) : path;
        if (op == 'add') return api[__$_59__] (path[__$_4__] (SymbolData, 'array', 'lengths', 'current'), getValue(api[__$_26__] (path[__$_4__] (SymbolData, 'array', 'lengths'))) + 1);
    };
    api.arrayItemOps = function (path, op, value) {
        path = typeof path == 'string' ? string2path(path) : path[__$_23__] ();
        var from = parseIntFn(path.pop());
        var to = from;
        var min = api[__$_26__] (path[__$_4__] (SymbolData, 'array', 'arrayStartIndex'));
        var lengthFull = api[__$_26__] (path[__$_4__] (SymbolData, 'array', 'lengths'));
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
        var state = api[__$_72__] ();
        var arrayValues = {}; 
        var delStateObject = {};
        var arrayItems = {};
        var stateObject = {};
        var mergeObject = {};
        valuesNames[__$_2__] (function (name) {
            arrayValues[name] = getIn(api[__$_89__] (['values', name], true), path);
        });
        arrayValues[__$_76__]  = getIn(api.getValues(true), path);
        
        
        for (var i = Math.min(from, to); i <= Math.max(from, to); i++) {
            delStateObject[i] = SymbolDelete;
            stateObject[i] = getIn(state, path[__$_4__] (i));
            arrayItems[i] = stateObject[i][SymbolData].arrayItem;
            mergeObject[i] = arrayValues[__$_76__] [i];
        }
        stateObject = moveArrayElems(stateObject, from, to);
        objKeys(arrayItems)[__$_2__] (function (i) {
            stateObject[i][SymbolData].arrayItem = arrayItems[i];
        });
        mergeObject = moveArrayElems(mergeObject, from, to);
        api[__$_35__] ();
        var promise = void 0;
        if (op == 'del') {
            delete mergeObject[to];
            stateObject[to] = makeStateFromSchema(schema, {}, path[__$_4__] (to));
        }
        promise = api[__$_59__] (path, delStateObject);
        promise = api[__$_59__] (path, stateObject);
        
        
        op == 'del' && api[__$_59__] (path[__$_4__] (SymbolData, 'array', 'lengths', 'current'), max);
        valuesNames[__$_2__] (function (name) {
            return !isUndefined(arrayValues[name]) && api[__$_42__] (makeSlice(path, arrayValues[name]), ['values', name]);
        });
        
        promise = api[__$_42__] (makeSlice(path, mergeObject), ['values', 'current']);
        return api[__$_46__] ();
        
    };
    api.setHidden = function (path) {
        var value = arguments[__$_1__]  > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var items = makeArrayOfPathItem(path);
        items[__$_2__] (function (item) {
            item[__$_21__]  = value;
            item[__$_5__]  = ['controls', 'hidden'];
        });
        return dispathAction(actionSetItems(items, stuff, false));
    };
    api[__$_95__]  = function (path) {
        api[__$_35__] ();
        var promise = api[__$_88__] (path + '/@/controls/hidden', false);
        promise = api[__$_52__] (path + '/@/controls/hidden', true);
        return api[__$_46__] ();
    };
    
    
    
    
    
    
    
    
    api[__$_100__]  = function (path) {
        api[__$_35__] ();
        var promise = api[__$_88__] (path + '/@/controls/omit', false);
        promise = api[__$_52__] (path + '/@/controls/omit', true);
        return api[__$_46__] ();
    };
    api.selectNshow = function (path) {
        api[__$_35__] ();
        api[__$_95__] (path);
        api[__$_100__] (path);
        return api[__$_46__] ();
    };
    api[__$_35__]  = function () {
        batching++;
        dispathAction = function dispathAction(_ref4) {
            var items = _ref4[__$_49__] ;

            push2array(batchedItems, items);
            return Promise[__$_87__] ();
        };
    };
    api[__$_46__]  = function () {
        var validate = arguments[__$_1__]  > 0 && arguments[0] !== undefined ? arguments[0] : true;

        batching--;
        if (batching || !batchedItems[__$_1__] ) return Promise[__$_87__] ();
        dispathAction = dispath;
        var result = dispath(actionSetItems(batchedItems, stuff, validate));
        batchedItems = [];
        return result;
    };
    return api;
}






function getSchemaPart(schema, path) {
    function getArrayItemSchemaPart(index, schemaPart) {
        var items = [];
        if (schemaPart[__$_49__] ) {
            if (!isArr(schemaPart[__$_49__] )) return schemaPart[__$_49__] ;else items = schemaPart[__$_49__] ;
        }
        if (index < items[__$_1__] ) return items[index];else {
            if (schemaPart[__$_9__]  !== false) {
                if (schemaPart[__$_9__]  && schemaPart[__$_9__]  !== true) return schemaPart[__$_9__] ;
                return items[items[__$_1__]  - 1];
            }
        }
        throw new Error(errorText + path.join('/'));
    }
    function getSchemaByRef(schema, $ref) {
        var path = string2path($ref);
        if (path[0] == '#') return getIn(schema, path); 
        throw new Error("Can only ref to #"); 
    }
    var errorText = 'Schema path not found: ';
    var schemaPart = schema;
    for (var i = path[0] == '#' ? 1 : 0; i < path[__$_1__] ; i++) {
        if (!schemaPart) throw new Error(errorText + path.join('/'));
        if (schemaPart[__$_90__] ) {
            var $refSchema = getSchemaByRef(schema, schemaPart[__$_90__] );

            var _schemaPart = schemaPart,
                $ref = _schemaPart[__$_90__] ,
                localSchema = __rest(schemaPart, [__$_90__] );

            schemaPart = merge($refSchema, localSchema);
        }
        if (schemaPart[__$_48__]  == 'array') {
            schemaPart = getArrayItemSchemaPart(path[i], schemaPart);
        } else {
            if (schemaPart[__$_24__]  && schemaPart[__$_24__] [path[i]]) schemaPart = schemaPart[__$_24__] [path[i]];else throw new Error(errorText + path.join('/'));
            ;
        }
    }
    if (!schemaPart[__$_90__] ) return schemaPart;
    var refMap = getByKey(schema, [SymbolData, 'refs', schemaPart[__$_90__] ], new Map());
    if (!refMap.get(schemaPart)) {
        var _$refSchema = getSchemaByRef(schema, schemaPart[__$_90__] );

        var _schemaPart2 = schemaPart,
            _$ref = _schemaPart2[__$_90__] ,
            _localSchema = __rest(schemaPart, [__$_90__] );

        refMap.set(schemaPart, merge(_$refSchema, _localSchema));
    }
    return refMap.get(schemaPart);
}
function makeDataObject(schema, values, path) {
    function isParentRequires(path, resolvedSchema) {
        if (!path[__$_1__] ) return false;
        var schemaPart = getSchemaPart(resolvedSchema, path[__$_23__] (0, -1));
        return !!(schemaPart[__$_48__]  == 'object' && isArr(schemaPart[__$_70__] ) && ~schemaPart[__$_70__] .indexOf(path[path[__$_1__]  - 1]));
    }
    function getValueFromSchema(path, keyPath, resolvedSchema) {
        
        var tmpPath = path[__$_4__] (null);
        for (var i = 0; i < path[__$_1__]  + 1; i++) {
            tmpPath.pop();
            var _schemaPart3 = getSchemaPart(resolvedSchema, path);
            if (_schemaPart3) return getIn(_schemaPart3, keyPath);
        }
    }
    function getParentArrayValue(path, resolvedSchema) {
        var pathPart = path[__$_23__] ();
        var keyPart = [];
        var result = void 0;
        for (var i = 0; i < path[__$_1__] ; i++) {
            var key = pathPart.pop();
            keyPart.unshift(key);
            var _schemaPart4 = getSchemaPart(resolvedSchema, pathPart);
            if (!_schemaPart4) return;
            if (_schemaPart4[__$_48__]  == 'array') {
                var tmp = getIn(_schemaPart4[__$_37__] , keyPart);
                if (tmp) result = tmp;
            }
        }
        return result;
    }
    function makeDataMap(dataMap) {
        return merge.all({}, dataMap.map(function (item) {
            var from = makePathItem(item[0], path);
            var to = item[1];
            return makeSlice(from[__$_36__] , SymbolData, 'dataMap', from[__$_5__]  ? path2string(from[__$_5__] ) : SymbolData, to, item[2]);
        }), { symbol: true });
    }
    var bindObject = { schema: schema, utils: utils };
    var schemaPart = getSchemaPart(schema, path);
    if (!schemaPart) throw new Error("Schema not found in path \"" + path.join('/') + "\"");
    var x = schemaPart.x || {};

    var custom = x.custom,
        preset = x.preset,
        dataMap = x[__$_39__] ,
        fields = x[__$_28__] ,
        flatten = x.flatten,
        groups = x.groups,
        selectOnly = x[__$_100__] ,
        validators = x[__$_98__] ,
        showOnly = x[__$_95__] ,
        rest = __rest(x, ["custom", "preset", "dataMap", "fields", "flatten", "groups", "selectOnly", "validators", "showOnly"]);

    var result = merge({ controls: {}, messages: {} }, rest);
    var schemaData = result[__$_50__]  = {};
    schemaData.title = schemaPart.title;
    schemaData[__$_48__]  = isArr(schemaPart[__$_48__] ) ? schemaPart[__$_48__] [0] : schemaPart[__$_48__] ;
    
    if (schemaPart[__$_48__]  != 'object' && schemaPart[__$_48__]  != 'array') {
        schemaData[__$_70__]  = !!isParentRequires(path, schema) || schemaPart[__$_70__] ;
        result[__$_56__]  = {
            'default': getParentArrayValue(path, schema) || schemaPart[__$_37__] 
        };
        ['current', 'inital', 'default'][__$_2__] (function (type) {
            var val = getIn(values[type], path);
            if (!isUndefined(val)) result[__$_56__] [type] = val;
        });
    }
    var status = result[__$_57__]  = {};
    status.color = '';
    status.touched = false;
    status.pending = false;
    status.valid = true;
    status.pristine = result[__$_56__]  ? getValue(result[__$_56__] ) === getValue(result[__$_56__] , 'inital') : true;
    return { data: result, dataMap: dataMap ? makeDataMap(dataMap) : {} };
}
var getArrayStartIndex = function getArrayStartIndex(schemaPart) {
    if (!isArr(schemaPart[__$_49__] )) return 0;
    if (schemaPart[__$_9__]  === false) return Infinity;
    if (_typeof2(schemaPart[__$_9__] ) === 'object') return schemaPart[__$_49__] .length;
    return schemaPart[__$_49__] .length - 1;
};
function makeStateFromSchema(schema) {
    var values = arguments[__$_1__]  > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var currentPath = arguments[__$_1__]  > 2 && arguments[2] !== undefined ? arguments[2] : [__$_101__] ;

    function mapPath2key(prefix, obj) {
        var result = {};
        objKeys(obj)[__$_2__] (function (val) {
            if (typeof obj[val] == 'string') result[val] = prefix + obj[val];else result[val] = mapPath2key(prefix, obj[val]);
        });
        return result;
    }
    var result = {};
    var dataMapObjects = [];
    var dataObj = makeDataObject(schema, values, currentPath);
    var schemaPart = getSchemaPart(schema, currentPath);
    result[SymbolData] = dataObj.data;
    dataMapObjects[__$_20__] (dataObj[__$_39__] );
    var keys = [];
    if (schemaPart[__$_48__]  == 'array') {
        (function () {
            var vals = schemaPart[__$_37__] ;
            var lengthFull = { 'default': 0 };
            if (vals && isArr(vals)) lengthFull[__$_37__]  = vals[__$_1__] ;
            if (schemaPart[__$_92__] ) lengthFull[__$_37__]  = Math.max(lengthFull[__$_37__] , schemaPart[__$_92__] );
            var maxLength = lengthFull[__$_37__] ;
            ['current', 'inital', 'default'][__$_2__] (function (type) {
                var val = getIn(values[type], currentPath);
                if (!isUndefined(val)) lengthFull[type] = val[__$_1__] ;
            });
            for (var i = 0; i < getMaxValue(lengthFull); i++) {
                keys[__$_20__] (i[__$_18__] ());
            }result[SymbolData].array = {
                lengths: lengthFull,
                arrayStartIndex: getArrayStartIndex(schemaPart),
                canAdd: !(schemaPart[__$_9__]  === false) && getValue(lengthFull) < (schemaPart.maxItems || Infinity)
            };
        })();
    } else if (schemaPart[__$_48__]  == 'object') {
        keys = objKeys(schemaPart[__$_24__] );
    }
    keys[__$_2__] (function (field) {
        var dataObj = makeStateFromSchema(schema, values, currentPath[__$_4__] (field));
        dataMapObjects[__$_20__] (dataObj[__$_39__] );
        result[field] = dataObj[__$_73__] ;
        if (schemaPart[__$_48__]  == 'array') {
            var num = parseIntFn(field);
            var arrayItem = getByKey(result[field][SymbolData], 'arrayItem');
            var arrayStartIndex = result[SymbolData].array.arrayStartIndex;
            var length = getValue(result[SymbolData].array.lengths);
            if (num >= arrayStartIndex) {
                arrayItem.canUp = arrayStartIndex < num;
                arrayItem.canDown = arrayStartIndex <= num && num < length - 1;
            }
            var minItems = schemaPart[__$_92__]  || 0;
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
        flatten: mapObj[__$_102__] (null, path2key, key2path),
        unflatten: mapObj[__$_102__] (null, key2path, path2key)
    };
    function getKeyMap(schema) {
        var track = arguments[__$_1__]  > 1 && arguments[1] !== undefined ? arguments[1] : [__$_101__] ;

        function checkIfHaveKey(key) {
            if (keyMap[__$_45__] .hasOwnProperty(key)) throw new Error("Duplicate flatten name for " + key);
        }
        function mapPath2key(prefix, obj) {
            var result = {};
            objKeys(obj)[__$_2__] (function (val) {
                if (typeof obj[val] == 'string') result[val] = prefix + obj[val];else result[val] = mapPath2key(prefix, obj[val]);
            });
            return result;
        }
        var schemaPart = getSchemaPart(schema, track);
        var keyMaps = getByKey(schema, [SymbolData, 'keyMaps'], new Map());
        if (keyMaps.get(schemaPart)) return keyMaps.get(schemaPart);
        if (schemaPart[__$_48__]  != 'object') return;
        var result = {};
        var fields = objKeys(schemaPart[__$_24__]  || {});
        var keyMap = getByKey(result, [SymbolData, 'keyMap'], { key2path: {}, path2key: {} });
        if (schemaPart.x && schemaPart.x.flatten) keyMap[__$_94__]  = schemaPart.x.flatten !== true && schemaPart.x.flatten || '';
        fields[__$_2__] (function (field) {
            var keyResult = getKeyMap(schema, track[__$_4__] (field));
            var objKeyMap = getIn(keyResult, [SymbolData, 'keyMap']) || {};
            if (!isUndefined(objKeyMap[__$_94__] )) {
                objKeys(objKeyMap[__$_45__] )[__$_2__] (function (key) {
                    checkIfHaveKey(objKeyMap[__$_94__]  + key);
                    keyMap[__$_45__] [objKeyMap[__$_94__]  + key] = [field][__$_4__] (objKeyMap[__$_45__] [key]);
                });
                keyMap.path2key[field] = mapPath2key(objKeyMap[__$_94__] , objKeyMap.path2key);
            } else if (!isUndefined(keyMap[__$_94__] )) {
                checkIfHaveKey(field);
                keyMap[__$_45__] [field] = field;
                keyMap.path2key[field] = field;
            }
        });
        keyMaps.set(schemaPart, result);
        return result;
    }
    function key2path(keyPath) {
        if (typeof keyPath == 'string') keyPath = string2path(keyPath);
        var result = [];
        keyPath[__$_2__] (function (key) {
            var path = getIn(getKeyMap(schema, result), [SymbolData, 'keyMap', 'key2path', key]);
            result = push2array(result, path ? path : key);
        });
        return result;
    }
    function path2key(path) {
        var result = [];
        var i = 0;
        while (i < path[__$_1__] ) {
            var key = path[i];
            var _path2key = getIn(getKeyMap(schema, path[__$_23__] (0, i)), [SymbolData, 'keyMap', 'path2key']);
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
            result[__$_20__] (key);
            i++;
        }
        return result;
    }
    function mapObj(fnDirect, fnReverse, object) {
        var result = {};
        function recurse(value) {
            var track = arguments[__$_1__]  > 1 && arguments[1] !== undefined ? arguments[1] : [];

            var keys = void 0;
            if (isMergeableObject(value)) {
                keys = objKeys(value);
                keys[__$_2__] (function (key) {
                    return recurse(value[key], track[__$_4__] (key));
                });
            }
            if (!(keys && keys[__$_1__] ) && getIn(getKeyMap(schema, fnDirect == key2path ? key2path(track) : track), [SymbolData, 'keyMap', 'prefix']) === undefined) {
                var tmp = result;
                var _path2 = fnDirect(track);
                for (var i = 0; i < _path2[__$_1__]  - 1; i++) {
                    var _field2 = _path2[i];
                    if (!tmp[_field2]) tmp[_field2] = isArr(getIn(object, fnReverse(_path2[__$_23__] (0, i + 1)))) ? [] : {};
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




function mergeState(state, source) {
    var options = arguments[__$_1__]  > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var fn = options.symbol ? objKeysAndSymbols : objKeys;
    
    var SymbolDelete = options.SymbolDelete,
        del = options.del,
        diff = options.diff,
        _options$arrays = options.arrays,
        arrays = _options$arrays === undefined ? 'replace' : _options$arrays;

    var mergeArrays = arrays != 'replace';
    var setArrayLength = arrays == 'mergeWithLength';
    var concatArray = arrays == 'concat';
    
    var canMerge = mergeArrays === true ? isMergeableObject : isObject;
    function recusion(state, source) {
        var track = arguments[__$_1__]  > 2 && arguments[2] !== undefined ? arguments[2] : [];

        var isSourceArray = isArr(source);
        if (!isMergeableObject(state)) state = isSourceArray ? [] : {}; 
        var isStateArray = isArr(state);
        if (!isMergeableObject(source)) return { state: state }; 
        var stateKeys = fn(state);
        if (stateKeys[__$_1__]  == 0 && !del && (!isStateArray || isSourceArray && arrays != 'merge')) return { state: source, changes: source };
        var srcKeys = fn(source);
        var changes = {};
        var changedObjects = {};
        var result = isStateArray ? [] : {}; 
        if (diff) {
            stateKeys[__$_2__] (function (key) {
                if (!~srcKeys[__$_6__] (key)) changes[key] = SymbolDelete;
            });
        }
        if (isStateArray && isSourceArray) {
            if (concatArray) {
                if (!source[__$_1__] ) return { state: state };
                var srcPrev = source;
                if (!del) {
                    srcPrev[__$_2__] (function (item, idx) {
                        return changes[state[__$_1__]  + idx] = item;
                    });
                    srcKeys = [];
                } else {
                    source = [];
                    srcPrev[__$_2__] (function (item, idx) {
                        return source[state[__$_1__]  + idx] = item;
                    });
                    srcKeys = fn(source);
                }
            }
            if (setArrayLength && state[__$_1__]  != source[__$_1__] ) changes[__$_1__]  = source[__$_1__] ;
        }
        srcKeys[__$_2__] (function (key) {
            if (del && source[key] === SymbolDelete) {
                if (state[__$_10__] (key)) changes[key] = SymbolDelete;
            } else {
                if (!canMerge(source[key])) {
                    if (!state[__$_10__] (key) || !is(state[key], source[key])) changes[key] = source[key];
                } else {
                    if (state[key] !== source[key]) {
                        var _obj2 = recusion(state[key], source[key], track[__$_4__] (key));
                        if (_obj2[__$_27__] ) changedObjects[key] = _obj2;
                    }
                }
            }
        });
        var changedObjKeys = fn(changedObjects);
        var changesKeys = fn(changes);
        if (changesKeys[__$_1__]  == 0 && changedObjKeys[__$_1__]  == 0) return { state: state };else {
            Object[__$_82__] (result, state);
            
            changesKeys[__$_2__] (function (key) {
                if (del && changes[key] === SymbolDelete) delete result[key];else result[key] = changes[key];
            });
            changedObjKeys[__$_2__] (function (key) {
                result[key] = changedObjects[key][__$_73__] ;
                changes[key] = changedObjects[key][__$_27__] ;
            });
            return { state: result, changes: changes };
        }
    }
    return recusion(state, source);
}
exports.mergeState = mergeState;
;









var merge = function merge(a, b) {
    var opts = arguments[__$_1__]  > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return mergeState(a, b, opts)[__$_73__] ;
};
exports.merge = merge;
merge.all = function (state, obj2merge) {
    var options = arguments[__$_1__]  > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (obj2merge[__$_1__]  == 0) return state; 
    else return obj2merge.reduce(function (prev, next) {
            return merge(prev, next, options);
        }, state); 
};
function isObject(val) {
    return isMergeableObject(val) && !isArr(val);
}
function isMergeableObject(val) {
    var nonNullObject = val && (typeof val === "undefined" ? "undefined" : _typeof2(val)) === 'object';
    return nonNullObject && Object[__$_14__] .toString.call(val) !== '[object RegExp]' && Object[__$_14__] .toString.call(val) !== '[object Date]';
}



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
    var value = arguments[__$_1__]  > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (!isArr(keys)) keys = [keys];
    for (var i = 0; i < keys[__$_1__] ; i++) {
        if (keys[i] == '#') continue;
        if (!obj[__$_10__] (keys[i])) obj[keys[i]] = i == keys[__$_1__]  - 1 ? value : {};
        obj = obj[keys[i]];
    }
    return obj;
}
function path2string(path, keyPath) {
    if (!isArr(path)) {
        keyPath = path[__$_5__] ;
        path = path[__$_36__] ;
    }
    return (keyPath ? path[__$_4__] ('@', keyPath) : path).join('/'); 
}
function string2path(str) {
    var relativePath = arguments[__$_1__]  > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    var delimiter = arguments[__$_1__]  > 2 && arguments[2] !== undefined ? arguments[2] : '@';

    str = str.replace(/\/+/g, '/');
    var res = str.split('/');
    if (res[0] === '.' || res[0] == '..') {
        if (relativePath) res = relativePath[__$_4__] (res);
    }
    if (res[0] === '') res[0] = '#';
    var tmp = [];
    for (var i = 0; i < res[__$_1__] ; i++) {
        var val = res[i];
        if (val === '..') tmp.pop();else if (val !== '' && val !== '.') tmp[__$_20__] (val);
    }
    res = tmp;
    
    var a = res[__$_6__] (delimiter);
    if (~a) res[a] = SymbolData;
    return res;
}
exports.string2path = string2path;


























function makeUpdateItem(path) {
    var value = void 0,
        keyPath = void 0,
        updateItem = void 0;
    if ((arguments[__$_1__]  <= 1 ? 0 : arguments[__$_1__]  - 1) == 1) value = arguments[__$_1__]  <= 1 ? undefined : arguments[1];
    if ((arguments[__$_1__]  <= 1 ? 0 : arguments[__$_1__]  - 1) == 2) {
        keyPath = arguments[__$_1__]  <= 1 ? undefined : arguments[1];
        value = arguments[__$_1__]  <= 2 ? undefined : arguments[2];
    }
    updateItem = makePathItem(path);
    if (keyPath) updateItem[__$_5__]  = isArr(keyPath) ? keyPath : string2path(keyPath);
    updateItem[__$_21__]  = value;
    return updateItem;
}
function makePathItem(path) {
    var relativePath = arguments[__$_1__]  > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    var delimiter = arguments[__$_1__]  > 2 && arguments[2] !== undefined ? arguments[2] : '@';

    var pathItem = {};
    pathItem[__$_18__]  = function () {
        return path2string(this);
    };
    Object[__$_66__] (pathItem, "toString", { enumerable: false });
    Object[__$_66__] (pathItem, "fullPath", {
        get: function get() {
            return this[__$_5__]  ? this[__$_36__] .concat(SymbolData, this[__$_5__] ) : this[__$_36__] ;
        },
        set: function set(path) {
            var a = path[__$_6__] (SymbolData);
            if (a == -1) {
                this[__$_36__]  = path[__$_23__] ();
                delete this[__$_5__] ;
            } else {
                this[__$_36__]  = path[__$_23__] (0, a);
                this[__$_5__]  = path[__$_23__] (a + 1);
            }
        }
    });
    path = pathOrString2path(path, relativePath, delimiter);
    pathItem.fullPath = path;
    return pathItem;
}
exports.makePathItem = makePathItem;
function pathOrString2path(path) {
    var basePath = arguments[__$_1__]  > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var delimiter = arguments[__$_1__]  > 2 && arguments[2] !== undefined ? arguments[2] : '@';

    if (typeof path == 'string') path = string2path(path, basePath, delimiter);
    return path;
}
function makeArrayOfPathItem(path) {
    var basePath = arguments[__$_1__]  > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var delimiter = arguments[__$_1__]  > 2 && arguments[2] !== undefined ? arguments[2] : '@';

    path = pathOrString2path(path, basePath, delimiter);
    var result = [[]];
    path[__$_2__] (function (value) {
        var res = [];
        if (typeof value == 'string' || typeof value == 'number') {
            result[__$_2__] (function (pathPart) {
                return value[__$_18__] ().split(',')[__$_2__] (function (key) {
                    return res[__$_20__] (pathPart[__$_4__] (key));
                });
            });
        } else if ((typeof value === "undefined" ? "undefined" : _typeof2(value)) == 'symbol') {
            result[__$_2__] (function (pathPart) {
                return res[__$_20__] (pathPart[__$_4__] (value));
            });
        } else if (typeof value == 'function') {
            result[__$_2__] (function (pathPart) {
                var tmp = value(pathPart);
                if (!isArr(tmp)) tmp = [tmp];
                tmp[__$_2__] (function (tmpVal) {
                    return tmpVal === false ? false : tmpVal[__$_18__] ().split(',')[__$_2__] (function (key) {
                        return res[__$_20__] (pathPart[__$_4__] (key));
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











function push2array(array) {
    for (var _len = arguments[__$_1__] , vals = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        vals[_key - 1] = arguments[_key];
    }

    for (var i = 0; i < vals[__$_1__] ; i++) {
        if (isArr(vals[i])) array[__$_20__] .apply(array, _toConsumableArray(vals[i]));else array[__$_20__] (vals[i]);
    }
    return array;
}
exports.push2array = push2array;
function object2PathValues(vals) {
    var options = arguments[__$_1__]  > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var track = arguments[__$_1__]  > 2 && arguments[2] !== undefined ? arguments[2] : [];

    var fn = options.symbol ? objKeysAndSymbols : objKeys;
    var check = options.arrayAsValue ? isObject : isMergeableObject;
    var result = [];
    fn(vals)[__$_2__] (function (key) {
        var path = track[__$_4__] (key);
        if (check(vals[key])) object2PathValues(vals[key], options, path)[__$_2__] (function (item) {
            return result[__$_20__] (item);
        }); 
        else result[__$_20__] (push2array(path, vals[key]));
    });
    if (!result[__$_1__] ) return [push2array(track[__$_23__] (), {})]; 
    return result;
}
exports.object2PathValues = object2PathValues;
function moveArrayElems(arr, from, to) {
    var length = arr[__$_1__] ;
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

    for (var _len2 = arguments[__$_1__] , pathValues = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        pathValues[_key2] = arguments[_key2];
    }

    var lastI = pathValues[__$_1__]  - 2;
    if (!lastI && isArr(pathValues[0]) && !pathValues[0][__$_1__] ) return pathValues[1];
    for (var i = 0; i < pathValues[__$_1__]  - 1; i++) {
        var _path3 = pathValues[i];
        if (!isArr(_path3)) _path3 = [_path3];
        for (var j = 0; j < _path3[__$_1__] ; j++) {
            if (_path3[j] == '#') continue;
            obj[_path3[j]] = i == lastI && j == _path3[__$_1__]  - 1 ? pathValues[pathValues[__$_1__]  - 1] : {};
            obj = obj[_path3[j]];
        }
    }
    return result;
}
exports.makeSlice = makeSlice;
function getIn(store, path) {
    if (path[__$_1__]  == 0 || store == undefined) return store;else if (path[0] == '#') return getIn(store, path[__$_23__] (1));else if (typeof path[0] === 'function') return getIn(store[path[0](store)], path[__$_23__] (1));
    return getIn(store[path[0]], path[__$_23__] (1));
}
exports.getIn = getIn;
;
function getSlice(store, path) {
    var track = arguments[__$_1__]  > 2 && arguments[2] !== undefined ? arguments[2] : [];

    return makeSlice(path, getIn(store, path));
}
function getAsObject(store, keyPath, fn, keyObject) {
    if (!fn) fn = function fn(x) {
        return x;
    };
    var type = store[SymbolData][__$_50__] .type;
    if (type == 'object' || type == 'array') {
        var _ret12 = function () {
            var result = type == 'array' ? [] : {};
            var keys = objKeys(keyObject && objKeys(keyObject)[__$_1__]  > 0 ? keyObject : store);
            if (type == 'array') {
                var idx = 0;
                var arrKeys = [];
                if (keyPath[1] == 'values' && keyPath[2]) idx = getIn(store, [SymbolData, 'array', 'lengths', keyPath[2]]) || 0;else idx = getValue(getIn(store, [SymbolData, 'array', 'lengths']) || {}) || 0;
                var lengthChange = keyObject && getIn(keyObject, [SymbolData, 'array', 'lengths']);
                for (var i = 0; i < idx; i++) {
                    if (lengthChange || ~keys[__$_6__] (i[__$_18__] ())) arrKeys[__$_20__] (i[__$_18__] ());
                }keys = arrKeys;
                result[__$_1__]  = idx;
            }
            keys[__$_2__] (function (key) {
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
    if (/\.$/.test(value)) return value; 
    if (/\.0$/.test(value)) return value; 
    var n = Number(value);
    var valid = typeof n === "number" && !Number.isNaN(n);
    if (/\.\d*0$/.test(value)) return value; 
    return valid ? n : value;
}
function without(obj) {
    for (var _len3 = arguments[__$_1__] , rest = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        rest[_key3 - 2] = arguments[_key3];
    }

    var symbol = arguments[__$_1__]  > 1 && arguments[1] !== undefined ? arguments[1] : false;

    
    var result = isArr(obj) ? [] : {};
    var fn = symbol ? objKeys : objKeysAndSymbols;
    fn(obj)[__$_2__] (function (key) {
        if (!~rest[__$_6__] (key)) result[key] = obj[key];
    });
    return result;
}
;
function split(test, obj) {
    var symbol = arguments[__$_1__]  > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var passed = {};
    var wrong = {};
    var fn = symbol ? objKeys : objKeysAndSymbols;
    fn(obj)[__$_2__] (function (key) {
        var val = obj[key];
        if (test(key, val)) passed[key] = val;else wrong[key] = val;
    });
    return [passed, wrong];
}
;
function map(fnc, obj) {
    var symbol = arguments[__$_1__]  > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var result = {};
    var fn = symbol ? objKeys : objKeysAndSymbols;
    fn(obj)[__$_2__] (function (key) {
        return result[key] = fnc(obj[key]);
    });
    return result;
}
;
function mapKeys(fnc, obj) {
    var symbol = arguments[__$_1__]  > 2 && arguments[2] !== undefined ? arguments[2] : false;

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

function is(x, y) {
    
    if (x === y) {
        
        return x !== 0 || 1 / x === 1 / y;
    } else {
        
        return x !== x && y !== y;
    }
}
function isEqual(objA, objB) {
    var options = arguments[__$_1__]  > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (is(objA, objB)) return true;
    if ((isUndefined(objA) ? 'undefined' : _typeof(objA)) !== 'object' || objA === null || (isUndefined(objB) ? 'undefined' : _typeof(objB)) !== 'object' || objB === null) return false;
    var fn = options.symbol ? objKeysAndSymbols : objKeys;
    var keysA = fn(objA);
    var keysB = fn(objB);
    if (keysA[__$_1__]  !== keysB[__$_1__] ) return false;
    var _options$skipKeys = options.skipKeys,
        skipKeys = _options$skipKeys === undefined ? [] : _options$skipKeys,
        _options$deepKeys = options.deepKeys,
        deepKeys = _options$deepKeys === undefined ? [] : _options$deepKeys;

    for (var i = 0; i < keysA[__$_1__] ; i++) {
        if (~skipKeys[__$_6__] (keysA[i])) continue; 
        if (options.deep || ~deepKeys[__$_6__] (keysA[i])) {
            var result = isEqual(objA[keysA[i]], objB[keysA[i]], options);
            if (!result) return false;
        } else if (!objB[__$_10__] (keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
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
    var type = arguments[__$_1__]  > 1 && arguments[1] !== undefined ? arguments[1] : 'current';

    var types = ['current', 'inital', 'default'];
    for (var i = types[__$_6__] (type); i < 3; i++) {
        
        if (values[types[i]] !== undefined) return values[types[i]];
    }
    return undefined;
}
exports.getValue = getValue;
function getMaxValue(values) {
    return Math.max(values[__$_76__]  || 0, values['inital'] || 0, values[__$_37__]  || 0);
}
function replaceDeep(obj, value) {
    if (!isMergeableObject(obj)) return value;
    var result = isArr(obj) ? [] : {};
    objKeys(obj)[__$_2__] (function (field) {
        return result[field] = replaceDeep(obj[field], value);
    });
    return result;
}































































































































