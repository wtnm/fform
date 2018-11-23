 /__string#_78__ ;

var _typeof2 = typeof Symbol ===  /__string#_79__  && typeof Symbol /__prop#_825__  ===  /__string#_80__  ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol ===  /__string#_81__  && obj /__prop#_826__  === Symbol && obj !== Symbol /__prop#_827__  ?  /__string#_82__  : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props /__prop#_828__ ; i++) { var descriptor = props[i]; descriptor /__prop#_829__  = descriptor /__prop#_830__  || false; descriptor /__prop#_831__  = true; if ( /__string#_83__  in descriptor) descriptor /__prop#_832__  = true; Object /__prop#_833__ (target, descriptor /__prop#_834__ , descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor /__prop#_835__ , protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array /__prop#_836__ (arr)) { for (var i = 0, arr2 = Array(arr /__prop#_837__ ); i < arr /__prop#_838__ ; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array /__prop#_839__ (arr); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError( /__string#_84__ ); } return call && (typeof call ===  /__string#_85__  || typeof call ===  /__string#_86__ ) ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !==  /__string#_87__  && superClass !== null) { throw new TypeError( /__string#_88__  + typeof superClass); } subClass /__prop#_840__  = Object /__prop#_841__ (superClass && superClass /__prop#_842__ , { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object /__prop#_843__  ? Object /__prop#_844__ (subClass, superClass) : subClass /__prop#_845__  = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError( /__string#_89__ ); } }

var __assign = this && this /__prop#_846__  || Object /__prop#_847__  || function (t) {
    for (var s, i = 1, n = arguments /__prop#_848__ ; i < n; i++) {
        s = arguments[i];
        for (var p in s) {
            if (Object /__prop#_849__ .hasOwnProperty /__prop#_850__ (s, p)) t[p] = s[p];
        }
    }
    return t;
};
var __rest = this && this /__prop#_851__  || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object /__prop#_852__ .hasOwnProperty /__prop#_853__ (s, p) && e /__prop#_854__ (p) < 0) t[p] = s[p];
    }if (s != null && typeof Object /__prop#_855__  ===  /__string#_90__ ) for (var i = 0, p = Object /__prop#_856__ (s); i < p /__prop#_857__ ; i++) {
        if (e /__prop#_858__ (p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};
var React = require( /__string#_91__ );
var react_1 = require( /__string#_92__ );

var JSONSchemaValidator = require( /__string#_329__ );

var objKeys = Object /__prop#_859__ ; 
var parseIntFn = parseInt;
var isArr = Array /__prop#_860__ ;
var isUndefined = function isUndefined(value) {
    return typeof value ===  /__string#_93__ ;
};

var SymbolData = Symbol /__prop#_861__ ( /__string#_330__ );
var SymbolDelete = undefined; 
var formReducerValue =  /__string#_331__ ;



var actionName4setItems =  /__string#_332__ ;
var actionName4forceValidation =  /__string#_333__ ;


function objKeysAndSymbols(obj) {
    var result = objKeys(obj);
    return result /__prop#_862__ (Object /__prop#_863__ (obj));
}
function applyMixins(derivedCtor, baseCtors) {
    baseCtors /__prop#_864__ (function (baseCtor) {
        Object /__prop#_865__ (baseCtor /__prop#_866__ ) /__prop#_867__ (function (name) {
            derivedCtor /__prop#_868__ [name] = baseCtor /__prop#_869__ [name];
        });
    });
}












function hookManager() {
    var globalHooks = {};
    var Hooks = {};
    function setHook(name, hookName, hook) {
        getByKey(Hooks, [name, hookName], globalHooks[hookName] /__prop#_870__ ()) /__prop#_871__ (hook);
    }
    var add = function add(name, hookName, hook) {
        if (name ==  /__string#_334__ ) {
            
            
            objKeys(Hooks) /__prop#_872__ (function (key) {
                return setHook(key, hookName, hook);
            });
            getByKey(globalHooks, hookName, []) /__prop#_873__ (hook);
        } else setHook(name, hookName, hook);
        return remove /__prop#_874__ (null, name, hookName, hook);
    };
    function remove(name, hookName, hook) {
        if (name ==  /__string#_335__ ) {
            globalHooks[hookName] /__prop#_875__ (globalHooks[hookName] /__prop#_876__ (hook), 1);
            objKeys(Hooks) /__prop#_877__ (function (key) {
                return Hooks[key][hookName] /__prop#_878__ (Hooks[key][hookName] /__prop#_879__ (hook));
            }, 1);
        } else Hooks[name][hookName] /__prop#_880__ (Hooks[name][hookName] /__prop#_881__ (hook), 1);
    }
    ;
    
    add /__prop#_882__  = function (name) {
        if (!Hooks[name]) {
            Hooks[name] = {};
            objKeys(globalHooks) /__prop#_883__ (function (hookName) {
                return Hooks[name][hookName] = globalHooks[hookName] /__prop#_884__ ();
            });
        }
        return Hooks[name];
    };
    return add;
}
var Hooks = hookManager();
exports /__prop#_885__  = Hooks;

Hooks( /__string#_336__ ,  /__string#_337__ , function (state, item, utils, schema, data) {
    
    
    
    
    if (!item /__prop#_886__ ) return [];
    var result = [];
    if (item /__prop#_887__ [0] ==  /__string#_338__  && item /__prop#_888__ [1] ==  /__string#_339__ ) {
        var dataItem = getIn(state, item /__prop#_889__ )[SymData]; 
        
        var lengthFull = dataItem /__prop#_890__ .lengths; 
        var newLengthFull = merge(lengthFull, makeSlice(item /__prop#_891__ [2], item /__prop#_892__ ));
        var start = getMaxValue(lengthFull) || 0;
        var end = getMaxValue(newLengthFull) || 0;
        for (var i = start; i < end; i++) {
            var elemPath = item /__prop#_893__  /__prop#_948__ (i);
            
            var newElem = makeStateFromSchema(schema, {}, elemPath);
            
            result /__prop#_894__ (makeUpdateItem(elemPath, newElem /__prop#_895__ ));
            result /__prop#_896__ (makeUpdateItem([], newElem /__prop#_897__ ));
        }
        for (var _i = end; _i < start; _i++) {
            result /__prop#_898__ ({ path: item /__prop#_899__  /__prop#_950__ (_i), value: SymbolDelete });
        }var arrayStartIndex = dataItem /__prop#_900__ .arrayStartIndex;
        var newLength = getValue(newLengthFull);
        var schemaPart = getSchemaPart(schema, item /__prop#_901__ );
        var minItems = schemaPart /__prop#_902__  || 0;
        result /__prop#_903__ ({ path: item /__prop#_904__ , keyPath:  /__stringProp#_15__ , value: !(schemaPart /__prop#_905__  === false) && newLength < (schemaPart /__prop#_906__  || Infinity) });
        for (var _i2 = Math /__prop#_907__ (Math /__prop#_908__ (getValue(lengthFull), newLength) - 1, 0); _i2 < newLength; _i2++) {
            var _elemPath = item /__prop#_909__  /__prop#_1937__ (_i2);
            if (_i2 >= arrayStartIndex) {
                result /__prop#_910__ (makeUpdateItem(_elemPath, [ /__string#_340__ ,  /__string#_341__ ], arrayStartIndex < _i2));
                result /__prop#_911__ (makeUpdateItem(_elemPath, [ /__string#_342__ ,  /__string#_343__ ], arrayStartIndex <= _i2 && _i2 < newLength - 1));
            }
            if (_i2 >= minItems) result /__prop#_912__ (makeUpdateItem(_elemPath, [ /__string#_344__ ,  /__string#_345__ ], _i2 >= Math /__prop#_913__ (arrayStartIndex, newLength - 1)));
        }
    }
    return result;
});

Hooks( /__string#_346__ ,  /__string#_347__ , function (state, item, utils, schema, data) {
    function recursivelySetChanges(statePart, keyPath, track) {
        after /__prop#_914__ (makeUpdateItem(track, keyPath, item /__prop#_915__ ));
        getKeysAccording2schema(statePart, []) /__prop#_916__ (function (key) {
            return recursivelySetChanges(statePart[key], keyPath, track /__prop#_917__ (key));
        });
    }
    ;
    if (!item /__prop#_918__ ) return [];
    var result = {};
    var after = [];
    result /__prop#_919__  = after;
    if (item /__prop#_920__ [0] ==  /__string#_348__  && item /__prop#_921__ .length == 3) {
        result /__prop#_922__  = true;
        recursivelySetChanges(getIn(state, item /__prop#_923__ ), item /__prop#_924__ .slice(1), item /__prop#_925__ );
    }
    if (item /__prop#_926__ [0] ==  /__string#_349__ ) {
        var dataItem = getIn(state, item /__prop#_927__ )[SymData];
        if (dataItem /__prop#_928__ ) after /__prop#_929__ (makeUpdateItem(item /__prop#_930__ , [ /__string#_350__ ,  /__string#_351__ ], getValue(dataItem /__prop#_931__ ) === getValue(dataItem /__prop#_932__ ,  /__string#_352__ )));
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    return result;
});

Hooks( /__string#_353__ ,  /__string#_354__ , function (state, changesArray, utils, schema, data) {
    var addChangeData = [];
    var recalcArray = void 0;
    function countRecalc(state, changes) {
        var track = arguments /__prop#_933__  > 2 && arguments[2] !== undefined ? arguments[2] :  /__stringProp#_16__ ;

        if (state === undefined) return;
        objKeys(changes) /__prop#_934__ (function (key) {
            return countRecalc(state[key], changes[key], track /__prop#_935__ (key));
        });
        var dataItemChanges = changes[SymData];
        if (!dataItemChanges) return;
        var dataItem = state[SymData];
        if (!dataItem) return;
        var status = [];
        var path = track /__prop#_936__ ();
        var controls = dataItemChanges /__stringProp#_17__  || {};
        if (getIn(dataItemChanges, [ /__string#_355__ ,  /__string#_356__ ])) status = objKeys(dataItem /__prop#_937__ );else if (controls /__prop#_938__ ( /__string#_357__ ) || controls /__prop#_939__ ( /__string#_358__ )) {
            path /__prop#_940__ ();
            status = objKeys(dataItem /__prop#_941__ );
        } else if (dataItemChanges /__prop#_942__ ) {
            path /__prop#_943__ ();
            status = objKeys(dataItemChanges /__prop#_944__ );
        }
        var length = path /__prop#_945__ ;
        if (!recalcArray) recalcArray = [];
        for (var i = 0; i < length; i++) {
            status /__prop#_946__ (function (key) {
                return getByKey(recalcArray, [path /__prop#_947__ , path2string(path,  /__stringProp#_18__  /__prop#_1945__ (key))], { path: path /__prop#_949__ (), keyPath:  /__stringProp#_19__ .concat(key), checkValue: key !=  /__string#_359__  });
            });
            path /__prop#_951__ ();
        }
    }
    
    changesArray /__prop#_952__ (function (changes) {
        return countRecalc(state, changes);
    });
    if (recalcArray) {
        (function () {
            var newVals = {};

            var _loop = function _loop(i) {
                var obj = recalcArray[recalcArray /__prop#_953__  - i - 1];
                if (obj) {
                    objKeys(obj) /__prop#_954__ (function (key) {
                        var _obj$key = obj[key],
                            path = _obj$key /__prop#_955__ ,
                            keyPath = _obj$key /__prop#_956__ ,
                            checkValue = _obj$key /__prop#_957__ ;

                        var keys = getKeysAccording2schema(state, path);
                        var result = checkValue;
                        for (var j = 0; j < keys /__prop#_958__ ; j++) {
                            if (getBindedValue(getIn(state, path /__prop#_959__ (keys[j], SymData,  /__string#_360__ )),  /__string#_361__ )) continue; 
                            var pathString = path2string(path /__prop#_960__ (keys[j]), keyPath);
                            var value = newVals /__prop#_961__ (pathString) ? newVals[pathString] : utils /__prop#_962__ (state, pathString);
                            if (value === !checkValue) {
                                result = !checkValue;
                                break;
                            } else if (value === null) result = null; 
                        }
                        addChangeData /__prop#_963__ ({ path: path, keyPath: keyPath, value: result });
                        newVals[path2string(path, keyPath)] = result;
                    });
                }
            };

            for (var i = 0; i < recalcArray /__prop#_964__ ; i++) {
                _loop(i);
            }
        })();
    }
    return addChangeData;
});
function getKeysAccording2schema(state, path) {
    var data = getIn(state, path)[SymData];
    var keys = [];
    if (data /__prop#_965__ .type ==  /__string#_362__ ) for (var j = 0; j < getValue(data /__prop#_966__ .lengths); j++) {
        keys /__prop#_967__ (j /__prop#_968__ ());
    } else keys = objKeys(getIn(state, path));
    return keys;
    
    
    
    
    
    
    
}




var apiMixin = function () {
    function apiMixin() {
        _classCallCheck(this, apiMixin);

        this /__prop#_969__  = {};
    }

    _createClass(apiMixin, [{
        key:  /__string#_94__ ,
        value: function initState(props, setStateFunc) {
            var self = this;
            self /__prop#_970__  = utils;
            if (!self /__prop#_971__ ) self /__prop#_972__  = formReducer();
            self /__prop#_973__  = __assign({}, props /__prop#_974__ ); 
            self /__prop#_975__ [SymData] = {}; 
            self /__prop#_976__  = JSONSchemaValidator(self /__prop#_977__ , { greedy: true });
            self /__prop#_978__  = self /__prop#_979__ .bind(self);
            self /__prop#_980__  = getKeyMapFromSchema(self /__prop#_981__ );
            self /__prop#_982__  = setStateFunc;
            var formValues = props /__prop#_983__  || {};
            objKeys(formValues) /__prop#_984__ (function (type) {
                return formValues[type] = self /__prop#_985__ .unflatten(formValues[type]);
            });
            var state = props /__prop#_986__ ;
            if (!state) {
                var result = makeStateFromSchema(self /__prop#_987__ , formValues);
                state = merge(result /__prop#_988__ , result /__prop#_989__ , { symbol: true });
                state[SymData] /__stringProp#_20__  = 0;
            }
            return state;
        }
    }, {
        key:  /__string#_95__ ,
        value: function jValidator(data) {
            this /__prop#_990__ (data);
            var result = this /__prop#_991__ .errors;
            if (!result) return [];
            if (!isArr(result)) result = [result];
            return result /__prop#_992__ (function (item) {
                return [item /__prop#_993__ .split( /__string#_363__ ) /__prop#_994__ (1), item /__prop#_995__ ];
            });
        }
    }, {
        key:  /__string#_96__ ,
        value: function _dispath(action) {
            var self = this;
            if (typeof action ===  /__string#_364__ ) {
                return action(self /__prop#_996__ .bind(self));
            } else {
                try {
                    self /__prop#_997__  = true;
                    self /__prop#_998__ (self /__prop#_999__ (self /__prop#_1000__ , action));
                } finally {
                    self /__prop#_1001__  = false;
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

        var _this = _possibleConstructorReturn(this, (makeApi /__prop#_1002__  || Object /__prop#_1003__ (makeApi)) /__prop#_1004__ (this));

        var self = _this;
        var state = self /__prop#_1005__ (props, self /__prop#_1006__ .bind(self));
        self /__prop#_1007__  = apiCreator(self /__prop#_1008__ .bind(self), self /__prop#_1009__ .bind(self), self /__prop#_1010__ .bind(self), self /__prop#_1011__ , Hooks /__prop#_1012__ (props /__prop#_1013__ ), self /__prop#_1014__ , self /__prop#_1015__ );
        self /__prop#_1016__  = self /__prop#_1017__ .setSingle([], state);
        return _this;
    }

    _createClass(makeApi, [{
        key:  /__string#_97__ ,
        value: function setState(state) {
            this /__prop#_1018__  = state;
        }
    }, {
        key:  /__string#_98__ ,
        value: function getState() {
            return this /__prop#_1019__ ;
        }
    }]);

    return makeApi;
}(apiMixin);

exports /__prop#_1020__  = makeApi;




var Form = function (_react_1$PureComponen) {
    _inherits(Form, _react_1$PureComponen);

    
    function Form(props, context) {
        _classCallCheck(this, Form);

        var _this2 = _possibleConstructorReturn(this, (Form /__prop#_1021__  || Object /__prop#_1022__ (Form)) /__prop#_1023__ (this, props, context));

        _this2 /__prop#_1024__  = {};
        var self = _this2;

        var tag = props /__prop#_1025__ ,
            store = props /__prop#_1026__ ,
            iface = props /__prop#_1027__ ,
            rest = __rest(props, [ /__string#_99__ ,  /__string#_100__ ,  /__string#_101__ ]);

        self /__prop#_1028__  = store;
        
        var newState = self /__prop#_1029__ (rest, self /__prop#_1030__ .bind(self));
        self /__prop#_1031__ (iface);
        self /__prop#_1032__  = self /__prop#_1033__ .setSingle([], newState);
        return _this2;
    }

    _createClass(Form, [{
        key:  /__string#_102__ ,
        value: function shouldComponentUpdate(newProps) {
            var self = this;
            if (!isEqual(this /__prop#_1034__ , newProps, { skipKeys: [ /__string#_365__ ,  /__string#_366__ ,  /__string#_367__ ] })) {
                if (this /__prop#_1035__ .store != newProps /__prop#_1036__ ) this /__prop#_1037__  = newProps /__prop#_1038__ ;
                if (this /__prop#_1039__ .iface != newProps /__prop#_1040__  || this /__prop#_1041__ .store != newProps /__prop#_1042__ ) this /__prop#_1043__ (newProps /__prop#_1044__ );
                self /__prop#_1045__ (newProps /__prop#_1046__ );
                return false;
            }
            return true;
        }
    }, {
        key:  /__string#_103__ ,
        value: function componentWillUnmount() {
            if (this /__prop#_1047__ ) this /__prop#_1048__ ();
        }
    }, {
        key:  /__string#_104__ ,
        value: function _handleChange() {
            var self = this;
            var nextState = self /__prop#_1049__ .getState()[formReducerValue][self /__prop#_1050__ .name];
            if (nextState !== self /__prop#_1051__ ) {
                self /__prop#_1052__ (nextState);
            }
        }
    }, {
        key:  /__string#_105__ ,
        value: function setState(state) {
            var self = this;
            if (self /__prop#_1053__  != state) {
                self /__prop#_1054__  = state;
                if (self /__prop#_1055__ ) self /__prop#_1056__ .forceUpdate();
            }
        }
    }, {
        key:  /__string#_106__ ,
        value: function _setIface(iface) {
            var self = this;
            if (!iface) iface = self /__prop#_1057__ .store || self /__prop#_1058__  ?  /__string#_368__  :  /__string#_369__ ;
            self /__prop#_1059__  = iface;
            if (self /__prop#_1060__  ==  /__string#_370__ ) {
                var store = void 0;
                if (self /__prop#_1061__ ) store = self /__prop#_1062__ ;else if (self /__prop#_1063__ .store) store = self /__prop#_1064__  = self /__prop#_1065__ .store;else throw new Error( /__string#_371__ );
                self /__prop#_1066__  = store /__prop#_1067__ ;
                if (self /__prop#_1068__ ) self /__prop#_1069__ ();
                self /__prop#_1070__  = store /__prop#_1071__ (self /__prop#_1072__ );
            } else {
                if (self /__prop#_1073__ ) {
                    self /__prop#_1074__ ();
                    delete self /__prop#_1075__ ;
                }
                self /__prop#_1076__  = self /__prop#_1077__ .bind(self);
            }
            self /__prop#_1078__  = apiCreator(self /__prop#_1079__ , self /__prop#_1080__ .bind(self), self /__prop#_1081__ .bind(self), self /__prop#_1082__ , Hooks /__prop#_1083__ (self /__prop#_1084__ .name), self /__prop#_1085__ , self /__prop#_1086__ );
        }
    }, {
        key:  /__string#_107__ ,
        value: function focus(path) {
            if (this /__prop#_1087__ ) this /__prop#_1088__ .focus(path);
        }
    }, {
        key:  /__string#_108__ ,
        value: function rebuild(path) {
            if (this /__prop#_1089__ ) this /__prop#_1090__ .rebuild(path);
        }
    }, {
        key:  /__string#_109__ ,
        value: function getState() {
            return this /__prop#_1091__ ;
        }
    }, {
        key:  /__string#_110__ ,
        value: function render() {
            var self = this;
            var _a = self /__prop#_1092__ ,
                name = _a /__prop#_1093__ ,
                objects = _a /__prop#_1094__ ,
                values = _a /__prop#_1095__ ,
                schema = _a /__prop#_1096__ ,
                iface = _a /__prop#_1097__ ,
                _a$widget = _a /__prop#_1098__ ,
                Widget = _a$widget === undefined ?  /__string#_372__  : _a$widget,
                state = _a /__prop#_1099__ ,
                store = _a /__prop#_1100__ ,
                rest = __rest(_a, [ /__string#_111__ ,  /__string#_112__ ,  /__string#_113__ ,  /__string#_114__ ,  /__string#_115__ ,  /__string#_116__ ,  /__string#_117__ ,  /__string#_118__ ]);
            var registry = {};
            registry /__prop#_1101__  = name;
            registry /__prop#_1102__  = objects;
            registry /__prop#_1103__  = self /__prop#_1104__ ;
            registry /__prop#_1105__  = self /__prop#_1106__ ;
            registry /__prop#_1107__  = self /__prop#_1108__ ;
            registry /__prop#_1109__  = self /__prop#_1110__ .bind(self);
            registry /__prop#_1111__  = self /__prop#_1112__ .bind(self);
            return React /__prop#_1113__ (Widget, __assign({}, rest, { name: name }), React /__prop#_1114__ (Field, { ref: function ref(item) {
                    return self /__prop#_1115__  = item;
                }, key:  /__string#_119__ , registry: registry, path:  /__stringProp#_21__  }));
        }
    }]);

    return Form;
}(react_1 /__prop#_1116__ );

Form /__prop#_1117__  = {
    store: React /__prop#_1118__ .object
};
exports /__prop#_1119__  = Form;
applyMixins(Form, [apiMixin]);




var SectionWidget = function (_react_1$Component) {
    _inherits(SectionWidget, _react_1$Component);

    function SectionWidget() {
        _classCallCheck(this, SectionWidget);

        return _possibleConstructorReturn(this, (SectionWidget /__prop#_1120__  || Object /__prop#_1121__ (SectionWidget)) /__prop#_1122__ (this, arguments));
    }

    _createClass(SectionWidget, [{
        key:  /__string#_120__ ,
        value: function render() {
            var _a = this /__prop#_1123__ ,
                Widget = _a /__prop#_1124__ ,
                getDataProps = _a /__prop#_1125__ ,
                wid = _a /__prop#_1126__ ,
                rest = __rest(_a, [ /__string#_121__ ,  /__string#_122__ ,  /__string#_123__ ]);
            var dataMaped = getDataProps()[wid] || {};
            return React /__prop#_1127__ (Widget, __assign({}, rest, dataMaped));
        }
    }]);

    return SectionWidget;
}(react_1 /__prop#_1128__ );

function replaceWidgetNamesWithFunctions(presetArrays, objects) {
    var tmp = presetArrays;
    if (!isArr(tmp)) tmp = [tmp];

    var _loop2 = function _loop2(i) {
        var presetArray = tmp[i];
        var widget = presetArray /__prop#_1129__ ;
        if (widget) presetArray /__prop#_1130__  = typeof widget ===  /__string#_373__  ? objects /__prop#_1131__  && objects /__prop#_1132__ [widget] || widget : widget;
        objKeys(presetArray) /__prop#_1133__ (function (key) {
            return isObject(presetArray[key]) && (presetArray[key] = replaceWidgetNamesWithFunctions(presetArray[key], objects));
        });
    };

    for (var i = 0; i < tmp /__prop#_1134__ ; i++) {
        _loop2(i);
    }
    return presetArrays;
}

var Section = function (_react_1$Component2) {
    _inherits(Section, _react_1$Component2);

    function Section(props, context) {
        _classCallCheck(this, Section);

        var _this4 = _possibleConstructorReturn(this, (Section /__prop#_1135__  || Object /__prop#_1136__ (Section)) /__prop#_1137__ (this, props, context));

        _this4 /__prop#_1138__  = [];
        _this4 /__prop#_1139__  = false;
        _this4 /__prop#_1140__  = true;
        _this4 /__prop#_1141__  = 0;
        _this4 /__prop#_1142__  = true;
        _this4 /__prop#_1143__  = {};
        _this4 /__prop#_1144__  = {};
        _this4 /__prop#_1145__  = {};
        _this4 /__prop#_1146__  = {};
        var array = props /__prop#_1147__ .registry /__prop#_1148__ .array;
        
        return _this4;
    }

    _createClass(Section, [{
        key:  /__string#_124__ ,
        value: function focus(path) {
            var self = this;
            var field = void 0;
            if (!path /__prop#_1149__ ) field = self /__prop#_1150__ ;else {
                field = path[0];
                path = path /__prop#_1151__ (1);
            }
            if (self /__prop#_1152__ [field] && self /__prop#_1153__ [field] /__prop#_1154__ ) self /__prop#_1155__ [field] /__prop#_1156__ (path);
        }
    }, {
        key:  /__string#_125__ ,
        value: function rebuild(path) {
            var self = this;
            if (!path /__prop#_1157__ ) {
                self /__prop#_1158__  = [];
                self /__prop#_1159__  = true;
                self /__prop#_1160__ ();
            } else {
                var _field = path[0];
                path = path /__prop#_1161__ (1);
                if (self /__prop#_1162__ [_field] && self /__prop#_1163__ [_field] /__prop#_1164__ ) self /__prop#_1165__ [_field] /__prop#_1166__ (path);
            }
        }
    }, {
        key:  /__string#_126__ ,
        value: function _build(props) {
            function bindMetods(restField) {
                var track = arguments /__prop#_1167__  > 1 && arguments[1] !== undefined ? arguments[1] :  /__stringProp#_22__ ;

                var result = __assign({}, restField);
                methodBindObject /__prop#_1168__ .forEach(function (methodName) {
                    if (typeof result[methodName] ==  /__string#_374__ ) result[methodName] = result[methodName] /__prop#_1169__ (methodBindObject);
                });
                objKeys(result) /__prop#_1170__ (function (key) {
                    return isObject(result[key]) && (result[key] = bindMetods(result[key], track /__prop#_1171__ (key)));
                });
                return result;
            }
            function makeLayout(keys, fields, groups) {
                var GroupWidget = widgets /__stringProp#_23__  ||  /__string#_375__ ;
                var groupPropsMap = field /__prop#_1172__  /__stringProp#_24__ ;
                var layout = [];
                var groupKeys = objKeys(groups) /__prop#_1173__ (function (key) {
                    return parseIntFn(key);
                });
                fields /__prop#_1174__ (function (field) {
                    if (typeof field ==  /__string#_376__ ) {
                        layout /__prop#_1175__ (SectionField(field));
                        keys /__prop#_1176__ (keys /__prop#_1177__ (field), 1);
                    } else if (typeof field ==  /__string#_377__ ) {
                        var _a = groups[field],
                            _a$fields = _a /__prop#_1178__ ,
                            groupFields = _a$fields === undefined ? [] : _a$fields,
                            _a$groups = _a /__prop#_1179__ ,
                            groupGroups = _a$groups === undefined ? [] : _a$groups,
                            _a$widget2 = _a /__prop#_1180__ ,
                            widget = _a$widget2 === undefined ? GroupWidget : _a$widget2,
                            propsMap = _a /__prop#_1181__ ,
                            restGroup = __rest(_a, [ /__string#_127__ ,  /__string#_128__ ,  /__string#_129__ ,  /__string#_130__ ]);
                        var cnt = widCount;
                        widCount++;
                        layout /__prop#_1182__ (React /__prop#_1183__ (SectionWidget, __assign({ wid: cnt, getDataProps: getDataProps, widget: widget, key:  /__string#_378__  + field }, schemaProps /__stringProp#_25__ , restGroup), makeLayout(keys, groupFields, groupGroups))); 
                        if (propsMap || groupPropsMap) self /__prop#_1184__ [cnt] = merge(propsMap || {}, groupPropsMap || {});
                        groupKeys /__prop#_1185__ (groupKeys /__prop#_1186__ (field), 1);
                    } else if (isObject(field)) {
                        var _propsMap = field /__prop#_1187__ ,
                            passOptions = field /__prop#_1188__ ,
                            restField = __rest(field, [ /__string#_131__ ,  /__string#_132__ ]);

                        restField = bindMetods(restField);
                        restField = replaceWidgetNamesWithFunctions(restField, registry /__prop#_1189__ );
                        var opts = {};
                        if (passOptions) opts[passOptions === true ?  /__string#_379__  : passOptions] = fieldOptions;
                        layout /__prop#_1190__ (React /__prop#_1191__ (SectionWidget, __assign({}, opts, { key:  /__string#_380__  + widCount, wid: widCount, getDataProps: getDataProps, ref: setWidRef(widCount) }, restField)));
                        if (_propsMap) self /__prop#_1192__ [widCount] = _propsMap;
                        widCount++;
                    }
                });
                if (groupKeys /__prop#_1193__ ) {
                    (function () {
                        var restGroups = {};
                        groupKeys /__prop#_1194__ (function (key) {
                            return groups[key] && (restGroups[key] = groups[key]);
                        });
                        push2array(layout, makeLayout(keys, groupKeys, restGroups));
                    })();
                }
                return layout;
            }
            var SectionField = function SectionField(field) {
                return React /__prop#_1195__ (Field, { key: field, ref: setRef(field), registry: registry, path: path /__prop#_1196__ (field), childrenBlocks: fieldOptions /__prop#_1197__  });
            };
            var self = this;
            var fieldOptions = props /__prop#_1198__ ;
            var _props$fieldOptions = props /__prop#_1199__ ,
                path = _props$fieldOptions /__prop#_1200__ ,
                registry = _props$fieldOptions /__prop#_1201__ ,
                widgets = _props$fieldOptions /__prop#_1202__ ,
                schemaProps = _props$fieldOptions /__prop#_1203__ ,
                schemaPart = _props$fieldOptions /__prop#_1204__ ,
                field = _props$fieldOptions /__prop#_1205__ ;

            var methodBindObject = field /__prop#_1206__ ;
            
            if (!schemaPart) return null;
            self /__prop#_1207__  = props /__prop#_1208__ ;
            var setRef = function setRef(field) {
                return function (item) {
                    return self /__prop#_1209__ [field] = item;
                };
            };
            var setWidRef = function setWidRef(key) {
                return function (item) {
                    return self /__prop#_1210__ [key] = item;
                };
            };
            var getDataProps = function getDataProps() {
                return self /__prop#_1211__ ;
            };
            var widCount = 0;
            var _schemaPart$x = schemaPart /__prop#_1212__ ,
                x = _schemaPart$x === undefined ? {} : _schemaPart$x,
                _schemaPart$propertie = schemaPart /__prop#_1213__ ,
                properties = _schemaPart$propertie === undefined ? {} : _schemaPart$propertie;
            var _x$groups = x /__prop#_1214__ ,
                groups = _x$groups === undefined ? [] : _x$groups;

            var getSingle = registry /__prop#_1215__ .getSingle;
            var keys = [];
            var arrayStartIndex = 0;
            var length = 0;
            if (schemaPart /__prop#_1216__  ==  /__string#_381__ ) {
                if (!self /__prop#_1217__ ) self /__prop#_1218__  =  /__string#_382__ ;
                
                
                length = props /__prop#_1219__ ; 
                arrayStartIndex = getSingle(path /__prop#_1220__ (SymData,  /__string#_383__ ,  /__string#_384__ ));
                if (length < arrayStartIndex) self /__prop#_1221__  = [];
                for (var i = 0; i < arrayStartIndex; i++) {
                    keys /__prop#_1222__ (i /__prop#_1223__ ());
                }
            } else {
                keys = objKeys(schemaPart /__prop#_1224__ );
            }
            if (!self /__prop#_1225__  && keys[0]) self /__prop#_1226__  = keys[0];
            if (self /__prop#_1227__ .length == 0) {
                self /__prop#_1228__  = makeLayout(keys, x /__prop#_1229__  || [], x /__prop#_1230__  || []);
                keys /__prop#_1231__ (function (field) {
                    return self /__prop#_1232__ .push(SectionField(field));
                });
                objKeys(self /__prop#_1233__ ) /__prop#_1234__ (function (key) {
                    return self /__prop#_1235__ [key] = mapProps(self /__prop#_1236__ [key], getSingle(path /__prop#_1237__ (SymData)), methodBindObject);
                });
                self /__prop#_1238__  = arrayStartIndex - self /__prop#_1239__ .length;
            }
            if (schemaPart /__prop#_1240__  ==  /__string#_385__ ) {
                var from = Math /__prop#_1241__ (arrayStartIndex, Math /__prop#_1242__ (self /__prop#_1243__ .length + self /__prop#_1244__ , length));
                self /__prop#_1245__ .splice(from - self /__prop#_1246__ , self /__prop#_1247__ .length - from); 
                for (var _i3 = from; _i3 < length; _i3++) {
                    self /__prop#_1248__ [_i3 - self /__prop#_1249__ ] = SectionField(_i3 /__prop#_1250__ ());
                }
            }
        }
    }, {
        key:  /__string#_133__ ,
        value: function shouldComponentUpdate(newProps) {
            var self = this;
            var result = !isEqual(self /__prop#_1251__ , newProps, { skipKeys:  /__stringProp#_26__  });
            var getSingle = newProps /__prop#_1252__ .registry /__prop#_1253__ .getSingle;
            var path = newProps /__prop#_1254__ .path;

            if (getSingle(push2array([SymData,  /__string#_386__ ], path, SymbolData,  /__string#_387__ ,  /__string#_388__ )) !== undefined) {
                self /__prop#_1255__  = true;
                result = true;
            }
            if (self /__prop#_1256__ .dataTree != newProps /__prop#_1257__ ) {
                var modifiedFields = getSingle(push2array([SymData,  /__string#_389__ ], path));
                if (modifiedFields) {
                    objKeys(modifiedFields) /__prop#_1258__ (function (field) {
                        return self /__prop#_1259__ [field] && self /__prop#_1260__ [field] /__stringProp#_27__ ();
                    });
                    if (modifiedFields[SymData]) {
                        (function () {
                            var dataProps = {};
                            objKeys(self /__prop#_1261__ ) /__prop#_1262__ (function (key) {
                                return dataProps[key] = mapProps(self /__prop#_1263__ [key], newProps /__prop#_1264__ [SymData], newProps /__prop#_1265__ .field /__prop#_1266__ );
                            });
                            var tmp = mergeState(self /__prop#_1267__ , dataProps);
                            self /__prop#_1268__  = tmp /__prop#_1269__ ;
                            if (tmp /__prop#_1270__ ) objKeys(tmp /__prop#_1271__ ) /__prop#_1272__ (function (key) {
                                return self /__prop#_1273__ [key] && self /__prop#_1274__ [key] /__stringProp#_28__ ();
                            });
                        })();
                    }
                }
            }
            return result;
        }
    }, {
        key:  /__string#_134__ ,
        value: function render() {
            var self = this;
            var _a = self /__prop#_1275__ ,
                _a$useTag = _a /__prop#_1276__ ,
                UseTag = _a$useTag === undefined ?  /__string#_390__  : _a$useTag,
                funcs = _a /__prop#_1277__ ,
                length = _a /__prop#_1278__ ,
                enumOptions = _a /__prop#_1279__ ,
                fieldOptions = _a /__prop#_1280__ ,
                onChange = _a /__prop#_1281__ ,
                onFocus = _a /__prop#_1282__ ,
                onBlur = _a /__prop#_1283__ ,
                dataTree = _a /__prop#_1284__ ,
                refName = _a /__prop#_1285__ ,
                focusField = _a /__prop#_1286__ ,
                rest = __rest(_a, [ /__string#_135__ ,  /__string#_136__ ,  /__string#_137__ ,  /__string#_138__ ,  /__string#_139__ ,  /__string#_140__ ,  /__string#_141__ ,  /__string#_142__ ,  /__string#_143__ ,  /__string#_144__ ,  /__string#_145__ ]);
            if (self /__prop#_1287__ ) self /__prop#_1288__ (self /__prop#_1289__ ); 
            self /__prop#_1290__  = false;
            return React /__prop#_1291__ (UseTag, __assign({}, rest), self /__prop#_1292__ );
        }
    }]);

    return Section;
}(react_1 /__prop#_1293__ );

function ArrayBlock(props) {
    var _props$useTag = props /__prop#_1294__ ,
        UseTag = _props$useTag === undefined ?  /__string#_391__  : _props$useTag,
        empty = props /__prop#_1295__ ,
        addButton = props /__prop#_1296__ ,
        length = props /__prop#_1297__ ,
        canAdd = props /__prop#_1298__ ,
        id = props /__prop#_1299__ ,
        children = props /__prop#_1300__ ,
        hidden = props /__prop#_1301__ ,
        fieldOptions = props /__prop#_1302__ ,
        rest = __rest(props, [ /__string#_146__ ,  /__string#_147__ ,  /__string#_148__ ,  /__string#_149__ ,  /__string#_150__ ,  /__string#_151__ ,  /__string#_152__ ,  /__string#_153__ ,  /__string#_154__ ]);

    var _empty$widget = empty /__prop#_1303__ ,
        Empty = _empty$widget === undefined ?  /__string#_392__  : _empty$widget,
        emptyRest = __rest(empty,  /__stringProp#_0__ );

    var _addButton$widget = addButton /__prop#_1304__ ,
        AddButton = _addButton$widget === undefined ?  /__string#_393__  : _addButton$widget,
        addButtonRest = __rest(addButton,  /__stringProp#_1__ );

    var onClick = function onClick() {
        
        fieldOptions /__prop#_1305__ .api /__prop#_1306__ (fieldOptions /__prop#_1307__ );
        
    };
    if (hidden) rest /__prop#_1308__  = merge(rest /__prop#_1309__  || {}, { display:  /__string#_394__  });
    if (length) return React /__prop#_1310__ (UseTag, __assign({}, rest), children, canAdd ? React /__prop#_1311__ (AddButton, __assign({ onClick: onClick }, addButtonRest)) :  /__string#_395__ );else return React /__prop#_1312__ (UseTag, __assign({}, rest), React /__prop#_1313__ (Empty, __assign({}, emptyRest), canAdd ? React /__prop#_1314__ (AddButton, __assign({ onClick: onClick }, addButtonRest)) :  /__string#_396__ ));
}



function getFieldProps(presets) {
    var x = arguments /__prop#_1315__  > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var presetName = arguments[2];
    var name = arguments[3];
    var methodBindObject = arguments[4];

    function getWidgetBefore(widgetsArray) {
        var widgetsArrayNames = widgetsArray /__prop#_1316__ (function (item) {
            return item /__prop#_1317__ ;
        });
        var widgetsArrayCode = widgetsArray /__prop#_1318__ (function (item) {
            return item /__prop#_1319__ ();
        });
        return function (widget) {
            var a = widgetsArray /__prop#_1320__ (widget);
            if (~a) return widgetsArray[a - 1];
            a = widgetsArrayNames /__prop#_1321__ (widget /__prop#_1322__ );
            if (~a) return widgetsArray[a - 1];
            if (widgetsArrayCode) a = widgetsArrayCode /__prop#_1323__ (widget /__prop#_1324__ ());
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
            var a = cache[propString] /__prop#_1325__ (prop);
            if (~a) return cache[propString][a - 1];
        };
    }
    function chainMethods(result) {
        var track = arguments /__prop#_1326__  > 1 && arguments[1] !== undefined ? arguments[1] :  /__stringProp#_29__ ;

        methodBindObject /__prop#_1327__ .forEach(function (methodName) {
            var methods = getArrayOfPropsFromArrayOfObjects(presetArray, track /__prop#_1328__ (methodName));
            var methods_rev = getArrayOfPropsFromArrayOfObjects(presetArray, track /__prop#_1329__ ( /__string#_397__  + methodName));
            methods_rev /__prop#_1330__ ();
            methods = methods_rev /__prop#_1331__ (methods);
            var prevMethod = methodBindObject /__prop#_1332__ [methodName];
            if (!methods /__prop#_1333__ ) return;
            for (var i = 0; i < methods /__prop#_1334__ ; i++) {
                var bindObj = __assign({}, methodBindObject);
                if (prevMethod) bindObj[methodName] = prevMethod;
                methods[i] = methods[i] /__prop#_1335__ (bindObj);
                prevMethod = methods[i];
            }
            result = merge(result, makeSlice(methodName, methods /__prop#_1336__ ()));
            result = merge(result, makeSlice( /__string#_398__  + methodName, SymbolDelete), { del: true });
        });
        objKeys(result) /__prop#_1337__ (function (key) {
            return isObject(result[key]) && (result[key] = chainMethods(result[key], track /__prop#_1338__ (key)));
        });
        return result;
    }
    var presetArray = [];
    var presetNames = presetName /__prop#_1339__ ( /__string#_399__ );
    presetNames /__prop#_1340__ ();
    presetNames /__prop#_1341__ (function (presetName) {
        while (true) {
            var preset = getIn(presetName[0] ==  /__string#_400__  ? x /__stringProp#_30__  : presets, string2path(presetName));
            if (preset) {
                preset[name] && presetArray /__prop#_1342__ (preset[name]);
                if (!preset /__stringProp#_31__ ) break;
                presetName = preset /__stringProp#_32__ ;
            } else break;
        }
    });
    presetArray /__prop#_1343__ (getIn(presets, [ /__string#_401__ , name]) || {}); 
    presetArray /__prop#_1344__ ();
    presetArray /__prop#_1345__ (getIn(x, [ /__string#_402__ , name]) || {}); 
    presetArray /__prop#_1346__ (makeSlice( /__string#_403__ , undefined));
    presetArray = replaceWidgetNamesWithFunctions(presetArray, methodBindObject /__prop#_1347__ .objects);
    var result = name ==  /__string#_404__  ? __assign({}, methodBindObject /__prop#_1348__ ) : {};
    result = chainMethods(merge /__prop#_1349__ (result, presetArray, { del: true }));
    result[SymData] = {
        all: presetArray,
        getPropBefore: getPropBefore(presetArray),
        getWidgetBefore: getWidgetBefore(getArrayOfPropsFromArrayOfObjects(presetArray,  /__string#_405__ )),
        getPropArray: getArrayOfPropsFromArrayOfObjects /__prop#_1350__ (null, presetArray)
    };
    return result;
}
exports /__prop#_1351__  = getFieldProps;

var Field = function (_react_1$Component3) {
    _inherits(Field, _react_1$Component3);

    function Field(props, context) {
        _classCallCheck(this, Field);

        
        var _this5 = _possibleConstructorReturn(this, (Field /__prop#_1352__  || Object /__prop#_1353__ (Field)) /__prop#_1354__ (this, props, context));

        _this5 /__prop#_1355__  = {};
        _this5 /__prop#_1356__  = {};
        _this5 /__prop#_1357__  = {};
        _this5 /__prop#_1358__  = [];
        _this5 /__prop#_1359__  = true;
        _this5 /__prop#_1360__  = {};
        _this5 /__prop#_1361__  = {};
        return _this5;
    }

    _createClass(Field, [{
        key:  /__string#_155__ ,
        value: function focus(path) {
            var self = this;
            self /__prop#_1362__  && self /__prop#_1363__ .focus && self /__prop#_1364__ .focus(path); 
        }
    }, {
        key:  /__string#_156__ ,
        value: function rebuild(path) {
            var self = this;
            if (!path /__prop#_1365__ ) {
                self /__prop#_1366__  = true;
                self /__prop#_1367__ ();
            }
            self /__prop#_1368__  && self /__prop#_1369__  /__stringProp#_33__  && self /__prop#_1370__  /__stringProp#_34__ (path);
        }
    }, {
        key:  /__string#_157__ ,
        value: function _build() {
            var isMultiSelect = function isMultiSelect(schema) {
                return Array /__prop#_1371__ (schema /__prop#_1372__  && schema /__prop#_1373__ .enum) && schema /__prop#_1374__ ;
            };
            var isFilesArray = function isFilesArray(schema) {
                return schema /__prop#_1375__  && schema /__prop#_1376__ .type ===  /__string#_158__  && schema /__prop#_1377__ .format ===  /__string#_159__ ;
            };
            var getPresetName = function getPresetName(schemaPart, type) {
                return type ==  /__string#_406__  ? isMultiSelect(schemaPart) ?  /__string#_407__  : isFilesArray(schemaPart) ?  /__string#_408__  :  /__string#_409__  : type;
            };
            var getWidget = function getWidget(objects, widget) {
                return typeof widget ===  /__string#_410__  ? objects /__prop#_1378__  && objects /__prop#_1379__ [widget] || widget : widget;
            };
            var getEnumOptions = function getEnumOptions(schemaPart) {
                if (!schemaPart /__prop#_1380__ ) return undefined;
                var result = [],
                    vals = schemaPart /__prop#_1381__ ,
                    names = schemaPart /__prop#_1382__  || [];
                vals /__prop#_1383__ (function (value, i) {
                    return result[i] = { value: value, label: names[i] || value };
                });
                return result;
            };
            var self = this;
            var _self$props = self /__prop#_1384__ ,
                registry = _self$props /__prop#_1385__ ,
                path = _self$props /__prop#_1386__ ,
                _self$props$childrenB = _self$props /__prop#_1387__ ,
                childrenBlocks = _self$props$childrenB === undefined ? {} : _self$props$childrenB;

            var schemaPart = getSchemaPart(registry /__prop#_1388__ , path);
            
            var type = isArr(schemaPart /__prop#_1389__ ) ? schemaPart /__prop#_1390__ [0] : schemaPart /__prop#_1391__ ;
            var x = schemaPart /__prop#_1392__  || {};
            
            var objects = registry /__prop#_1393__ ;
            var presets = objects /__prop#_1394__ ;
            var presetName = x /__prop#_1395__  || getPresetName(schemaPart, type);
            var pathValue = path /__prop#_1396__ (SymData,  /__string#_411__ ,  /__string#_412__ );
            var pathTouched = path /__prop#_1397__ (SymData,  /__string#_413__ ,  /__string#_414__ );
            var pathString =  /__string#_415__  + path /__prop#_1398__ ( /__string#_416__ );
            var funcs = {};
            funcs /__prop#_1399__  = function (value) {
                return registry /__prop#_1400__ .setSingle(pathValue, value ===  /__string#_160__  ? undefined : value, self /__prop#_1401__ );
            };
            funcs /__prop#_1402__  = function (value) {
                registry /__prop#_1403__ .setSingle(pathTouched, true, false);
                !self /__prop#_1404__  ? registry /__prop#_1405__ .validate(pathString) : null;
            };
            funcs /__prop#_1406__  = function (value) {
                return registry /__prop#_1407__ .setSingle( /__string#_417__ , path, false);
            };
            var methods2chain = objKeys(objects /__prop#_1408__ ) /__prop#_1409__ (function (key) {
                return objects /__prop#_1410__ [key];
            });
            self /__prop#_1411__  = { registry: registry, path: path, schemaPart: schemaPart, field: self, funcs: funcs, methods2chain: methods2chain };
            self /__prop#_1412__  = getFieldProps(presets, x, presetName,  /__string#_418__ , self /__prop#_1413__ );
            
            var idPath = push2array([registry /__prop#_1414__ ], path);
            self /__prop#_1415__  = getEnumOptions(schemaPart);
            var widgets = {},
                schemaProps = {},
                preset = {};
            self /__prop#_1416__  = merge(childrenBlocks, getFieldProps(presets, x, presetName,  /__string#_419__ , self /__prop#_1417__ ));
            self /__prop#_1418__  = objKeys(self /__prop#_1419__ ) /__prop#_1420__ (function (key) {
                return self /__prop#_1421__ [key];
            });
            self /__prop#_1422__ .forEach(function (block) {
                var _a = getFieldProps(presets, x, presetName, block, self /__prop#_1423__ ),
                    propsMap = _a /__prop#_1424__ ,
                    widget = _a /__prop#_1425__ ,
                    rest = __rest(_a, [ /__string#_161__ ,  /__string#_162__ ]);
                schemaProps[block] = rest;
                self /__prop#_1426__ [block] = propsMap;
                widgets[block] = widget;
                preset[block] = rest[SymData];
                delete rest[SymData];
                schemaProps[block] /__prop#_1427__  = idPath /__prop#_1428__ ( /__string#_420__ );
                if (rest /__prop#_1429__ ) schemaProps[block][rest /__prop#_1430__ ] = self /__prop#_1431__ .bind(self);
            });
            self /__prop#_1432__  = { field: self, funcs: funcs, widgets: widgets, schemaProps: schemaProps, preset: preset, registry: registry, path: path, schemaPart: schemaPart, childrenBlocks: getFieldProps(presets, x, presetName,  /__string#_421__ , self /__prop#_1433__ ) };
        }
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        

    }, {
        key:  /__string#_163__ ,
        value: function _getRef(item) {
            this /__prop#_1434__  = item;
        }
    }, {
        key:  /__string#_164__ ,
        value: function render() {
            var self = this;
            if (self /__prop#_1435__ ) this /__prop#_1436__ ();
            self /__prop#_1437__  = false;
            var api = self /__prop#_1438__ .registry /__prop#_1439__ ;
            var data = api /__prop#_1440__ (self /__prop#_1441__ .path /__prop#_1442__ (SymData)); 
            var enumOptions = self /__prop#_1443__  || data /__prop#_1444__ ; 
            self /__prop#_1445__  = data /__prop#_1446__  && data /__prop#_1447__ ._liveValidate;
            var dataProps = {};
            self /__prop#_1448__ .forEach(function (block) {
                return dataProps[block] = mapProps(self /__prop#_1449__ [block], data, self /__prop#_1450__ );
            });
            self /__prop#_1451__  = merge(self /__prop#_1452__ , dataProps);
            var _a = self /__prop#_1453__ ,
                BuilderWidget = _a /__prop#_1454__ ,
                builderPropsMap = _a /__prop#_1455__ ,
                restProps = __rest(_a, [ /__string#_165__ ,  /__string#_166__ ]);
            if (restProps /__prop#_1456__ ) restProps[restProps /__prop#_1457__ ] = self /__prop#_1458__ .bind(self);
            var builderDataProps = mapProps(builderPropsMap, data, self /__prop#_1459__ );
            self /__prop#_1460__  = merge(self /__prop#_1461__ , builderDataProps);
            return React /__prop#_1462__ (BuilderWidget, __assign({ enumOptions: enumOptions }, restProps, self /__prop#_1463__ , { fieldOptions: self /__prop#_1464__ , dataProps: self /__prop#_1465__ , dataTree: api /__prop#_1466__ (self /__prop#_1467__ .path) }));
        }
    }]);

    return Field;
}(react_1 /__prop#_1468__ );

function mapProps(map, data, bindObject) {
    if (!map) return {};
    var result = {};
    var keys = objKeys(map) /__prop#_1469__ (function (key) {
        return map[key];
    });
    keys /__prop#_1470__ (function (to) {
        var item = map[to];
        if (!isArr(item)) item = [item];
        var value = getIn(data, string2path(item[0]));
        var fn = item[1];
        var path = string2path(to);
        var key = path /__prop#_1471__ ();
        var obj = getByKey(result, path);
        obj[key] = fn ? fn /__prop#_1472__ (bindObject)(value) : value;
    });
    return result;
}



function Unsupported(props) {
    return React /__prop#_1473__ ( /__string#_167__ , null,  /__string#_168__ );
}
function DefaultBuilder(props) {
    var hidden = props /__prop#_1474__ ,
        omit = props /__prop#_1475__ ,
        dataProps = props /__prop#_1476__ ,
        rest = __rest(props, [ /__string#_169__ ,  /__string#_170__ ,  /__string#_171__ ]);

    if (omit) return false;
    var fieldOptions = props /__prop#_1477__ ;
    var widgets = fieldOptions /__prop#_1478__ ,
        schemaProps = fieldOptions /__prop#_1479__ ;
    var Title = widgets /__prop#_1480__ ,
        Body = widgets /__prop#_1481__ ,
        Main = widgets /__prop#_1482__ ,
        Message = widgets /__prop#_1483__ ,
        Groups = widgets /__prop#_1484__ ,
        Layout = widgets /__prop#_1485__ ,
        ArrayItem = widgets /__prop#_1486__ ,
        Array = widgets /__prop#_1487__ ,
        Autosize = widgets /__prop#_1488__ ;

    var field = React /__prop#_1489__ (Layout, __assign({ hidden: hidden }, schemaProps /__stringProp#_35__ , dataProps /__stringProp#_36__ ), React /__prop#_1490__ (Title, __assign({}, schemaProps /__stringProp#_37__ , dataProps /__stringProp#_38__ )), React /__prop#_1491__ (Body, __assign({}, schemaProps /__stringProp#_39__ , dataProps /__stringProp#_40__ ), React /__prop#_1492__ (Main, __assign({}, schemaProps /__stringProp#_41__ , dataProps /__stringProp#_42__ , rest)), React /__prop#_1493__ (Message, __assign({}, schemaProps /__stringProp#_43__ , dataProps /__stringProp#_44__ )), Autosize ? React /__prop#_1494__ (Autosize, __assign({ hidden: hidden }, schemaProps /__stringProp#_45__ , dataProps /__stringProp#_46__ , { fieldOptions: fieldOptions })) :  /__string#_422__ ));
    if (Array) field = React /__prop#_1495__ (Array, __assign({ hidden: hidden }, schemaProps /__stringProp#_47__ , dataProps /__stringProp#_48__ , { fieldOptions: fieldOptions }), field);
    if (ArrayItem && dataProps /__stringProp#_49__  /__prop#_1496__ ) field = React /__prop#_1497__ (ArrayItem, __assign({ hidden: hidden }, schemaProps /__stringProp#_50__ , dataProps /__stringProp#_51__ , { fieldOptions: fieldOptions }), field);
    return field;
}









function DivBlock(props) {
    var id = props /__prop#_1498__ ,
        _props$useTag2 = props /__prop#_1499__ ,
        UseTag = _props$useTag2 === undefined ?  /__string#_423__  : _props$useTag2,
        hidden = props /__prop#_1500__ ,
        children = props /__prop#_1501__ ,
        rest = __rest(props, [ /__string#_172__ ,  /__string#_173__ ,  /__string#_174__ ,  /__string#_175__ ]);

    if (hidden) rest /__prop#_1502__  = merge(rest /__prop#_1503__  || {}, { visibility:  /__string#_424__ , height: 0 }); 
    return React /__prop#_1504__ (UseTag, __assign({}, rest), children);
}
var sizerStyle = { position:  /__string#_425__ , top: 0, left: 0, visibility:  /__string#_426__ , height: 0, overflow:  /__string#_427__ , whiteSpace:  /__string#_428__  };

var AutosizeBlock = function (_React$Component) {
    _inherits(AutosizeBlock, _React$Component);

    function AutosizeBlock() {
        _classCallCheck(this, AutosizeBlock);

        return _possibleConstructorReturn(this, (AutosizeBlock /__prop#_1505__  || Object /__prop#_1506__ (AutosizeBlock)) /__prop#_1507__ (this, arguments));
    }

    _createClass(AutosizeBlock, [{
        key:  /__string#_176__ ,
        value: function componentDidMount() {
            var _this7 = this;

            var style = window && window /__prop#_1508__ (this /__prop#_1509__ .fieldOptions /__prop#_1510__ .mainRef);
            if (!style || !this /__prop#_1511__ ) return;
            [ /__string#_429__ ,  /__string#_430__ ,  /__string#_431__ ,  /__string#_432__ ,  /__string#_433__ ] /__prop#_1512__ (function (key) {
                return _this7 /__prop#_1513__ .style[key] = style[key];
            });
        }
    }, {
        key:  /__string#_177__ ,
        value: function render() {
            var self = this;
            var props = self /__prop#_1514__ ;
            var value = (isUndefined(props /__prop#_1515__ ) ?  /__string#_434__  : props /__prop#_1516__ .toString()) || props /__prop#_1517__  ||  /__string#_435__ ;
            return React /__prop#_1518__ ( /__string#_178__ , { style: sizerStyle, ref: function ref(elem) {
                    (self /__prop#_1519__  = elem) && (props /__prop#_1520__ .field /__prop#_1521__ .style /__prop#_1522__  = elem /__prop#_1523__  + (props /__prop#_1524__  || 45) +  /__string#_436__ );
                } }, value);
        }
    }]);

    return AutosizeBlock;
}(React /__prop#_1525__ );



function TitleBlock(props) {
    var id = props /__prop#_1526__ ,
        _props$title = props /__prop#_1527__ ,
        title = _props$title === undefined ?  /__string#_437__  : _props$title,
        required = props /__prop#_1528__ ,
        _props$useTag3 = props /__prop#_1529__ ,
        UseTag = _props$useTag3 === undefined ?  /__string#_438__  : _props$useTag3,
        requireSymbol = props /__prop#_1530__ ,
        emptyTitle = props /__prop#_1531__ ,
        rest = __rest(props, [ /__string#_179__ ,  /__string#_180__ ,  /__string#_181__ ,  /__string#_182__ ,  /__string#_183__ ,  /__string#_184__ ]);

    return React /__prop#_1532__ (UseTag, __assign({}, UseTag ==  /__string#_439__  ? { htmlFor: id } : {}, rest), emptyTitle ? typeof emptyTitle ==  /__string#_440__  ? emptyTitle :  /__string#_441__  : required ? title + requireSymbol : title);
}
function BaseInput(props) {
    var value = props /__prop#_1533__ ,
        UseTag = props /__prop#_1534__ ,
        _props$type = props /__prop#_1535__ ,
        type = _props$type === undefined ?  /__string#_442__  : _props$type,
        title = props /__prop#_1536__ ,
        dataTree = props /__prop#_1537__ ,
        fieldOptions = props /__prop#_1538__ ,
        enumOptions = props /__prop#_1539__ ,
        refName = props /__prop#_1540__ ,
        rest = __rest(props, [ /__string#_185__ ,  /__string#_186__ ,  /__string#_187__ ,  /__string#_188__ ,  /__string#_189__ ,  /__string#_190__ ,  /__string#_191__ ,  /__string#_192__ ]);

    UseTag = UseTag || (type ==  /__string#_443__  || type ==  /__string#_444__  ? type :  /__string#_445__ );
    var refObj = {};
    var ref = rest[refName];
    if (refName) delete rest[refName];
    if (typeof UseTag ==  /__string#_446__ ) refObj /__prop#_1541__  = ref;else refObj[refName] = ref;
    var commonProps = { name: props /__prop#_1542__ , label: title || props /__prop#_1543__ .split( /__string#_447__ ) /__prop#_1544__ (-1)[0] }; 
    var valueObj = {};
    if (type ===  /__string#_448__ ) valueObj /__prop#_1545__  = isUndefined(value) ? false : value;else if (type ===  /__string#_449__ ) valueObj /__prop#_1546__  = value;else valueObj /__prop#_1547__  = isUndefined(value) ?  /__string#_193__  : value;
    if (type ===  /__string#_450__ ) return React /__prop#_1548__ (UseTag, __assign({}, rest, refObj, commonProps), valueObj /__prop#_1549__ );
    if (type ===  /__string#_451__ ) {
        var placeholder = rest /__prop#_1550__ ,
            selectRest = __rest(rest,  /__stringProp#_2__ );
        return React /__prop#_1551__ (UseTag, __assign({}, selectRest, refObj, commonProps, { value: isUndefined(value) ? props /__prop#_1552__  ? [] :  /__string#_194__  : value }), !props /__prop#_1553__  && placeholder && React /__prop#_1554__ ( /__string#_195__ , { value:  /__string#_196__  }, placeholder), enumOptions /__prop#_1555__ (function (_ref, i) {
            var value = _ref /__prop#_1556__ ,
                label = _ref /__prop#_1557__ ;
            return React /__prop#_1558__ ( /__string#_197__ , { key: i, value: value }, label);
        }));
    } 
    else return React /__prop#_1559__ (UseTag, __assign({}, rest, refObj, valueObj, { type: type }, commonProps));
}
;
function ArrayInput(props) {
    function selectValue(value, selected, all) {
        var at = all /__prop#_1560__ (value);
        var updated = selected /__prop#_1561__ (0, at) /__prop#_1562__ (value, selected /__prop#_1563__ (at));
        return updated /__prop#_1564__ (function (a, b) {
            return all /__prop#_1565__ (a) > all /__prop#_1566__ (b);
        }); 
    }
    function deselectValue(value, selected) {
        return selected /__prop#_1567__ (function (v) {
            return v !== value;
        });
    }

    var value = props /__prop#_1568__ ,
        _props$useTag4 = props /__prop#_1569__ ,
        UseTag = _props$useTag4 === undefined ?  /__string#_452__  : _props$useTag4,
        type = props /__prop#_1570__ ,
        title = props /__prop#_1571__ ,
        onFocus = props /__prop#_1572__ ,
        onBlur = props /__prop#_1573__ ,
        _onChange = props /__prop#_1574__ ,
        dataTree = props /__prop#_1575__ ,
        fieldOptions = props /__prop#_1576__ ,
        enumOptions = props /__prop#_1577__ ,
        refName = props /__prop#_1578__ ,
        autofocus = props /__prop#_1579__ ,
        disabled = props /__prop#_1580__ ,
        disabledClass = props /__prop#_1581__ ,
        inputProps = props /__prop#_1582__ ,
        labelProps = props /__prop#_1583__ ,
        stackedProps = props /__prop#_1584__ ,
        rest = __rest(props, [ /__string#_198__ ,  /__string#_199__ ,  /__string#_200__ ,  /__string#_201__ ,  /__string#_202__ ,  /__string#_203__ ,  /__string#_204__ ,  /__string#_205__ ,  /__string#_206__ ,  /__string#_207__ ,  /__string#_208__ ,  /__string#_209__ ,  /__string#_210__ ,  /__string#_211__ ,  /__string#_212__ ,  /__string#_213__ ,  /__string#_214__ ]);

    type = fieldOptions /__prop#_1585__ .type ==  /__string#_453__  ?  /__string#_454__  :  /__string#_455__ ;
    var name = props /__prop#_1586__ ;
    var ref = rest[refName];
    if (refName) delete rest[refName];

    var _inputProps$useTag = inputProps /__prop#_1587__ ,
        InputUseTag = _inputProps$useTag === undefined ?  /__string#_456__  : _inputProps$useTag,
        restInput = __rest(inputProps,  /__stringProp#_3__ );

    var _labelProps$useTag = labelProps /__prop#_1588__ ,
        LabelUseTag = _labelProps$useTag === undefined ?  /__string#_457__  : _labelProps$useTag,
        restLabel = __rest(labelProps,  /__stringProp#_4__ );

    var stacked = !!stackedProps;
    if (!stackedProps) stackedProps = {};

    var _stackedProps = stackedProps,
        _stackedProps$useTag = _stackedProps /__prop#_1589__ ,
        StackedlUseTag = _stackedProps$useTag === undefined ?  /__string#_458__  : _stackedProps$useTag,
        restStacked = __rest(stackedProps,  /__stringProp#_5__ );

    return React /__prop#_1590__ (UseTag, __assign({}, rest), enumOptions && enumOptions /__prop#_1591__ (function (option, i) {
        var addClass = disabled ? disabledClass :  /__string#_215__ ;
        var input = void 0;
        if (type ==  /__string#_459__ ) {
            var checked = option /__prop#_1592__  === value; 
            input = React /__prop#_1593__ (InputUseTag, __assign({ type: type, checked: checked, id: name +  /__string#_216__  + i, name: name, value: option /__prop#_1594__ , disabled: disabled, autoFocus: autofocus && i === 0, onFocus: onFocus, onBlur: onBlur, onChange: function onChange(event) {
                    _onChange(option /__prop#_1595__ );
                } }, restInput));
        } else {
            var _checked = value /__prop#_1596__ (option /__prop#_1597__ ) !== -1;
            input = React /__prop#_1598__ (InputUseTag, __assign({ type: type, checked: _checked, id: name +  /__string#_217__  + i, name: name +  /__string#_218__  + i, disabled: disabled, autoFocus: autofocus && i === 0, onFocus: onFocus /__prop#_1599__ (props), onBlur: onBlur /__prop#_1600__ (props), onChange: function onChange(event) {
                    var all = enumOptions /__prop#_1601__ (function (_ref2) {
                        var value = _ref2 /__prop#_1602__ ;
                        return value;
                    });
                    if (event /__prop#_1603__ .checked) props /__prop#_1604__ .onChange(selectValue(option /__prop#_1605__ , value, all));else props /__prop#_1606__ .onChange(deselectValue(option /__prop#_1607__ , value));
                } }, restInput));
        }
        if (addClass) {
            var _obj = stacked ? restStacked : restLabel;
            _obj /__prop#_1608__  = (_obj /__prop#_1609__  ||  /__string#_219__  +  /__string#_220__  + addClass) /__prop#_1610__ ();
        }
        return stacked ? React /__prop#_1611__ (StackedlUseTag, __assign({ key: i }, restStacked), React /__prop#_1612__ (LabelUseTag, __assign({}, restLabel), input, React /__prop#_1613__ ( /__string#_221__ , null, option /__prop#_1614__ ))) : React /__prop#_1615__ (LabelUseTag, __assign({ key: i }, restLabel), input, React /__prop#_1616__ ( /__string#_222__ , null, option /__prop#_1617__ ));
    }));
}
function CheckboxInput(props) {
    var labelProps = props /__prop#_1618__ ,
        rest = __rest(props,  /__stringProp#_6__ );
    return React /__prop#_1619__ ( /__string#_223__ , __assign({}, labelProps), React /__prop#_1620__ (BaseInput, __assign({}, rest)), React /__prop#_1621__ ( /__string#_224__ , null, props /__prop#_1622__ ));
}
function MessageBlock(props) {
    var _props$useTag5 = props /__prop#_1623__ ,
        UseTag = _props$useTag5 === undefined ?  /__string#_460__  : _props$useTag5,
        messageItem = props /__prop#_1624__ ,
        _props$messages = props /__prop#_1625__ ,
        messages = _props$messages === undefined ? {} : _props$messages,
        _props$itemsProps = props /__prop#_1626__ ,
        itemsProps = _props$itemsProps === undefined ? {} : _props$itemsProps,
        id = props /__prop#_1627__ ,
        rest = __rest(props, [ /__string#_225__ ,  /__string#_226__ ,  /__string#_227__ ,  /__string#_228__ ,  /__string#_229__ ]);

    var WidgetMessageItem = messageItem /__prop#_1628__ ,
        restMessageItem = __rest(messageItem,  /__stringProp#_7__ );
    var keys = objKeys(messages);
    var result = [];
    var mergedMessages = merge(messages, itemsProps);
    keys /__prop#_1629__ (function (a, b) {
        return parseFloat(a) - parseFloat(b);
    });
    keys /__prop#_1630__ (function (key) {
        if (mergedMessages[key] /__prop#_1631__  === true || mergedMessages[key] /__prop#_1632__  || !mergedMessages[key] /__prop#_1633__ .length) return;
        result /__prop#_1634__ (React /__prop#_1635__ (WidgetMessageItem, __assign({ key: key, message: mergedMessages[key] }, restMessageItem)));
    });
    return React /__prop#_1636__ (UseTag, __assign({}, rest), result);
}
function MessageItem(props) {
    var _props$useTag6 = props /__prop#_1637__ ,
        UseTag = _props$useTag6 === undefined ?  /__string#_461__  : _props$useTag6,
        message = props /__prop#_1638__ ,
        rest = __rest(props, [ /__string#_230__ ,  /__string#_231__ ]);
    


    return React /__prop#_1639__ (UseTag, __assign({}, rest), message /__prop#_1640__ .join(React /__prop#_1641__ ( /__string#_232__ , null)));
}
function EmptyArray(props) {
    var _props$useTag7 = props /__prop#_1642__ ,
        UseTag = _props$useTag7 === undefined ?  /__string#_462__  : _props$useTag7,
        _props$text = props /__prop#_1643__ ,
        text = _props$text === undefined ?  /__string#_463__  : _props$text,
        rest = __rest(props, [ /__string#_233__ ,  /__string#_234__ ]);

    return React /__prop#_1644__ (UseTag, __assign({}, rest), text,  /__string#_235__ , props /__prop#_1645__ );
}
function AddButtonBlock(props) {
    var _props$useTag8 = props /__prop#_1646__ ,
        UseTag = _props$useTag8 === undefined ?  /__string#_464__  : _props$useTag8,
        _props$text2 = props /__prop#_1647__ ,
        text = _props$text2 === undefined ?  /__string#_465__  : _props$text2,
        _props$type2 = props /__prop#_1648__ ,
        type = _props$type2 === undefined ?  /__string#_466__  : _props$type2,
        rest = __rest(props, [ /__string#_236__ ,  /__string#_237__ ,  /__string#_238__ ]);

    return React /__prop#_1649__ (UseTag, __assign({ type: type }, rest), text);
}
function ItemMenu(props) {
    var _props$useTag9 = props /__prop#_1650__ ,
        UseTag = _props$useTag9 === undefined ?  /__string#_467__  : _props$useTag9,
        _props$buttonProps = props /__prop#_1651__ ,
        buttonProps = _props$buttonProps === undefined ? {} : _props$buttonProps,
        buttons = props /__prop#_1652__ ,
        itemData = props /__prop#_1653__ ,
        fieldOptions = props /__prop#_1654__ ,
        dataTree = props /__prop#_1655__ ,
        rest = __rest(props, [ /__string#_239__ ,  /__string#_240__ ,  /__string#_241__ ,  /__string#_242__ ,  /__string#_243__ ,  /__string#_244__ ]);

    if (!itemData) return false;
    var canUp = itemData /__prop#_1656__ ,
        canDown = itemData /__prop#_1657__ ,
        canDel = itemData /__prop#_1658__ ;
    var path = fieldOptions /__prop#_1659__ ,
        registry = fieldOptions /__prop#_1660__ ;

    var api = registry /__prop#_1661__ ;

    var _buttonProps$useTag = buttonProps /__prop#_1662__ ,
        UseButtonTag = _buttonProps$useTag === undefined ?  /__string#_468__  : _buttonProps$useTag,
        _buttonProps$type = buttonProps /__prop#_1663__ ,
        type = _buttonProps$type === undefined ?  /__string#_469__  : _buttonProps$type,
        _onClick = buttonProps /__prop#_1664__ ,
        titles = buttonProps /__prop#_1665__ ,
        restButton = __rest(buttonProps, [ /__string#_245__ ,  /__string#_246__ ,  /__string#_247__ ,  /__string#_248__ ]);

    var canChecks = {  /__string#_470__ : canUp,  /__string#_471__ : canDown,  /__string#_472__ : canUp,  /__string#_473__ : canDown,  /__string#_474__ : canDel };
    buttons /__prop#_1666__ (function (key) {
        return delete rest[key];
    });
    return React /__prop#_1667__ (UseTag, __assign({}, rest), buttons /__prop#_1668__ (function (key) {
        var KeyWidget = props[key];
        if (KeyWidget === false || canChecks[key] === undefined) return  /__string#_475__ ;
        return React /__prop#_1669__ (UseButtonTag, __assign({ key: key, type: type, title: titles && titles[key] ? titles[key] : key,  /__string#_249__ : key, disabled: !canChecks[key] }, restButton, { onClick: function onClick() {
                return _onClick(key);
            } }), typeof KeyWidget ===  /__string#_476__  ? React /__prop#_1670__ (KeyWidget, null) : KeyWidget || key);
    }));
}
function ArrayItem(props) {
    if (!props /__prop#_1671__ ) return React /__prop#_1672__ .only(props /__prop#_1673__ );

    var children = props /__prop#_1674__ ,
        hidden = props /__prop#_1675__ ,
        itemMain = props /__prop#_1676__ ,
        itemBody = props /__prop#_1677__ ,
        itemMenu = props /__prop#_1678__ ,
        rest = __rest(props, [ /__string#_250__ ,  /__string#_251__ ,  /__string#_252__ ,  /__string#_253__ ,  /__string#_254__ ]);

    var _a = itemMain || {},
        _a$widget3 = _a /__prop#_1679__ ,
        Item = _a$widget3 === undefined ?  /__string#_477__  : _a$widget3,
        itemRest = __rest(_a,  /__stringProp#_8__ );var _b = itemBody || {},
        _b$widget = _b /__prop#_1680__ ,
        ItemBody = _b$widget === undefined ?  /__string#_478__  : _b$widget,
        itemBodyRest = __rest(_b,  /__stringProp#_9__ );var _c = itemMenu || {},
        _c$widget = _c /__prop#_1681__ ,
        ItemMenu = _c$widget === undefined ?  /__string#_479__  : _c$widget,
        itemMenuRest = __rest(_c,  /__stringProp#_10__ );
    if (hidden) itemRest /__prop#_1682__  = merge(itemRest /__prop#_1683__  || {}, { display:  /__string#_480__  });
    return React /__prop#_1684__ (Item, __assign({}, itemRest), React /__prop#_1685__ (ItemBody, __assign({}, itemBodyRest), React /__prop#_1686__ .only(children)), React /__prop#_1687__ (ItemMenu, __assign({}, itemMenuRest, rest)));
}
function CombineWidgets(props) {
    function processWidget(key) {
        if (skip[key]) return false;
        var _a = this[key],
            Widget = _a /__prop#_1688__ ,
            _a$inner = _a /__prop#_1689__ ,
            inner = _a$inner === undefined ? {} : _a$inner,
            _a$innerProps = _a /__prop#_1690__ ,
            innerProps = _a$innerProps === undefined ? [] : _a$innerProps,
            _a$addProps = _a /__prop#_1691__ ,
            addProps = _a$addProps === undefined ? [] : _a$addProps,
            _a$extractProps = _a /__prop#_1692__ ,
            extractProps = _a$extractProps === undefined ? [] : _a$extractProps,
            rest = __rest(_a, [ /__string#_255__ ,  /__string#_256__ ,  /__string#_257__ ,  /__string#_258__ ,  /__string#_259__ ]);var InnerWidget = inner /__prop#_1693__ ,
            restInner = __rest(inner,  /__stringProp#_11__ );
        var widgetProps = {},
            innerWidgetProps = {};
        addProps /__prop#_1694__ (function (propName) {
            return widgetProps[propName] = props[propName];
        });
        innerProps /__prop#_1695__ (function (propName) {
            return innerWidgetProps[propName] = props[propName];
        });
        push2array(props2remove, extractProps);
        return InnerWidget ? React /__prop#_1696__ (Widget, __assign({ key: key }, widgetProps, rest), React /__prop#_1697__ (InnerWidget, __assign({}, innerWidgetProps, restInner))) : React /__prop#_1698__ (Widget, __assign({ key: key }, widgetProps, rest));
    }

    var Widget = props /__prop#_1699__ ,
        _props$before = props /__prop#_1700__ ,
        before = _props$before === undefined ? {} : _props$before,
        _props$after = props /__prop#_1701__ ,
        after = _props$after === undefined ? {} : _props$after,
        _props$skip = props /__prop#_1702__ ,
        skip = _props$skip === undefined ? {} : _props$skip,
        Layout = props /__prop#_1703__ ,
        rest = __rest(props, [ /__string#_260__ ,  /__string#_261__ ,  /__string#_262__ ,  /__string#_263__ ,  /__string#_264__ ]);

    var PrevWidget = props /__prop#_1704__ .preset /__stringProp#_52__  /__prop#_1705__ (CombineWidgets);
    var LayoutWidget = Layout /__prop#_1706__ ,
        layoutRest = __rest(Layout,  /__stringProp#_12__ );
    var props2remove = [];
    var beforeWidgets = objKeys(before) /__prop#_1707__ () /__prop#_1708__ (processWidget /__prop#_1709__ (before));
    var afterWidgets = objKeys(after) /__prop#_1710__ () /__prop#_1711__ (processWidget /__prop#_1712__ (after));
    props2remove /__prop#_1713__ (function (key) {
        return delete rest[key];
    });
    return React /__prop#_1714__ (LayoutWidget, __assign({}, layoutRest), beforeWidgets, React /__prop#_1715__ (PrevWidget, __assign({}, rest)), afterWidgets);
}
function selectorOnChange(asTabs) {
    return function (value) {
        var _this8 = this;

        var api = this /__prop#_1716__ .api;
        api /__prop#_1717__ ();
        this /__prop#_1718__ (value);
        var vals = void 0;
        if (isArr(value)) vals = value /__prop#_1719__ ();else vals = [value];
        var path = this /__prop#_1720__ .slice();
        var selectorField = path /__prop#_1721__ ();
        var stringPath = path2string(path);
        vals = vals /__prop#_1722__ (function (key) {
            return _this8 /__prop#_1723__ .api /__prop#_1724__ (stringPath +  /__string#_481__  + key);
        });
        vals /__prop#_1725__ (selectorField);
        if (asTabs) api /__prop#_1726__ (stringPath +  /__string#_482__  + vals /__prop#_1727__ ( /__string#_483__ ));else api /__prop#_1728__ (stringPath +  /__string#_484__  + vals /__prop#_1729__ ( /__string#_485__ ));
        api /__prop#_1730__ ();
    };
}
function onSelectChange(event) {
    function processSelectValue(_ref3, value) {
        var type = _ref3 /__prop#_1731__ ,
            items = _ref3 /__prop#_1732__ ;

        if (value ===  /__string#_265__ ) return undefined;else if (type ===  /__string#_266__  && items && (items /__prop#_1733__  ==  /__string#_267__  || items /__prop#_1734__  ==  /__string#_268__ )) return value /__prop#_1735__ (asNumber);else if (type ===  /__string#_269__ ) return value ===  /__string#_270__ ;else if (type ===  /__string#_271__ ) return asNumber(value);
        return value;
    }
    function getSelectValue(event, multiple) {
        if (multiple) return [] /__prop#_1736__ .call(event /__prop#_1737__ .options) /__prop#_1738__ (function (item) {
            return item /__prop#_1739__ ;
        }) /__prop#_1740__ (function (item) {
            return item /__prop#_1741__ ;
        });else return event /__prop#_1742__ .value;
    }
    this /__prop#_1743__ (processSelectValue(this /__prop#_1744__ .fieldOptions /__prop#_1745__ , getSelectValue(event, this /__prop#_1746__ .fieldOptions /__prop#_1747__  /__stringProp#_53__  /__prop#_1748__ )));
}
function getArrayOfPropsFromArrayOfObjects(arr, propPath) {
    propPath = pathOrString2path(propPath);

    var _loop3 = function _loop3(i) {
        arr = arr /__prop#_1749__ (function (item) {
            return item /__prop#_1750__ (propPath[i]);
        }) /__prop#_1751__ (function (item) {
            return item[propPath[i]];
        });
        if (!arr /__prop#_1752__ ) return  /__string#_272__ ;
    };

    for (var i = propPath[0] ==  /__string#_486__  ? 1 : 0; i < propPath /__prop#_1753__ ; i++) {
        var _ret6 = _loop3(i);

        if (_ret6 ===  /__string#_273__ ) break;
    }
    return arr;
}
function TristateBox(props) {
    var self = this;

    var checked = props /__prop#_1754__ ,
        _onChange2 = props /__prop#_1755__ ,
        nullValue = props /__prop#_1756__ ,
        getRef = props /__prop#_1757__ ,
        type = props /__prop#_1758__ ,
        rest = __rest(props, [ /__string#_274__ ,  /__string#_275__ ,  /__string#_276__ ,  /__string#_277__ ,  /__string#_278__ ]);

    return React /__prop#_1759__ ( /__string#_279__ , __assign({ type:  /__string#_280__ , checked: checked === true }, rest, { onChange: function onChange(event) {
            _onChange2(checked === nullValue ? false : checked === false ? true : nullValue, event);
        }, ref: function ref(elem) {
            getRef && getRef(elem);
            elem && (elem /__prop#_1760__  = checked === nullValue);
        } }));
}



var basicObjects = {
    extend: function extend(obj) {
        return merge(this, obj);
    },
    types: [ /__string#_487__ ,  /__string#_488__ ,  /__string#_489__ ,  /__string#_490__ ,  /__string#_491__ ,  /__string#_492__ ],
    methods2chain: {
         /__string#_493__ : true,  /__string#_494__ : true,  /__string#_495__ : true,  /__string#_496__ : true,  /__string#_497__ : true,  /__string#_498__ : true,  /__string#_499__ : true,  /__string#_500__ : true,  /__string#_501__ : true
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
         /__string#_502__ : {
            blocks: {  /__string#_503__ : true,  /__string#_504__ : true,  /__string#_505__ : true,  /__string#_506__ : true,  /__string#_507__ : true,  /__string#_508__ : true,  /__string#_509__ : false },
            
            Autosize: {
                widget:  /__string#_510__ ,
                propsMap: {
                    value: [ /__string#_511__ , getValue],
                    placeholder:  /__string#_512__ 
                }
            },
            Array: {
                widget:  /__string#_513__ ,
                empty: { widget:  /__string#_514__  },
                addButton: { widget:  /__string#_515__  },
                propsMap: {
                    length: [ /__string#_516__ , getValue],
                    canAdd:  /__string#_517__ 
                }
            },
            ArrayItem: {
                widget:  /__string#_518__ ,
                itemMenu: {
                    widget:  /__string#_519__ ,
                    buttons: [ /__string#_520__ ,  /__string#_521__ ,  /__string#_522__ ,  /__string#_523__ ,  /__string#_524__ ],
                    buttonProps: { onClick: function onClick(key) {
                            this /__prop#_1761__ .api /__prop#_1762__ (this /__prop#_1763__ , key);
                        } }
                },
                propsMap: { itemData:  /__string#_525__  }
            },
            Builder: {
                widget:  /__string#_526__ ,
                propsMap: {
                    hidden: [ /__string#_527__ , function (controls) {
                        return getBindedValue(controls,  /__string#_528__ );
                    }]
                }
            },
            Group: {
                widget:  /__string#_529__ ,
                className:  /__string#_530__ 
            },
            Layout: {
                widget:  /__string#_531__ ,
                className:  /__string#_532__ 
            },
            Body: {
                widget:  /__string#_533__ ,
                className:  /__string#_534__ 
            },
            Title: {
                widget:  /__string#_535__ ,
                useTag:  /__string#_536__ ,
                requireSymbol:  /__string#_537__ ,
                propsMap: {
                    required:  /__string#_538__ ,
                    title:  /__string#_539__ 
                }
            },
            Message: {
                widget:  /__string#_540__ ,
                propsMap: {
                    messages:  /__string#_541__ ,
                     /__string#_542__ : [ /__string#_543__ , not],
                     /__string#_544__ : [ /__string#_545__ , not],
                     /__string#_546__ :  /__string#_547__ 
                },
                messageItem: {
                    widget:  /__string#_548__ 
                }
            },
            Main: {
                widget:  /__string#_549__ ,
                refName:  /__string#_550__ ,
                propsMap: {
                    value: [ /__string#_551__ , getValue],
                    autoFocus:  /__string#_552__ ,
                    placeholder:  /__string#_553__ ,
                    required:  /__string#_554__ ,
                    title:  /__string#_555__ ,
                    readOnly: [ /__string#_556__ , function (controls) {
                        return getBindedValue(controls,  /__string#_557__ );
                    }],
                    disabled: [ /__string#_558__ , function (controls) {
                        return getBindedValue(controls,  /__string#_559__ );
                    }]
                }
            }
        },
        base: { Main: { onChange: function onChange(event) {
                    this /__prop#_1764__ (event /__prop#_1765__ .value);
                } } },
        string: { _:  /__string#_560__ , Main: { type:  /__string#_561__  } },
        number: { _:  /__string#_562__ , Main: { type:  /__string#_563__  } },
        integer: { _:  /__string#_564__  },
        range: { _:  /__string#_565__ , Main: { type:  /__string#_566__  } },
         /__string#_567__ : { Main: { type:  /__string#_568__  } },
        booleanBase: {
            Main: {
                type:  /__string#_569__ ,
                onChange: function onChange(event) {
                    this /__prop#_1766__ (event /__prop#_1767__ .checked);
                }
            }
        },
        boolean: {
            _:  /__string#_570__ ,
            Main: {
                widget:  /__string#_571__ 
            },
            Title: { emptyTitle: true }
        },
        tristateBase: {
            Main: {
                type:  /__string#_572__ ,
                useTag: TristateBox
            }
        },
        tristate: {
            _:  /__string#_573__ ,
            Main: {
                widget:  /__string#_574__ 
            },
            Title: { emptyTitle: true }
        },
        object: {
            blocks: {  /__string#_575__ : true },
            Main: {
                widget:  /__string#_576__ ,
                refName:  /__string#_577__ ,
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
            Layout: { useTag:  /__string#_578__  },
            Title: { useTag:  /__string#_579__  }
        },
        array: {
            _:  /__string#_580__ ,
            blocks: {  /__string#_581__ : true },
            Main: { propsMap: { length: [ /__string#_582__ , getValue] } },
            Layout: { useTag:  /__string#_583__  },
            Title: { useTag:  /__string#_584__  }
        },
        inlineTitle: {
            Layout: {
                style: { flexFlow:  /__string#_585__  }
            }
        },
        select: { Main: { type:  /__string#_586__ , onChange: onSelectChange } },
        multiselect: { _:  /__string#_587__ , Main: { multiply: true } },
        arrayOf: {
            Main: {
                widget:  /__string#_588__ ,
                inputProps: {},
                labelProps: {},
                stackedProps: {},
                disabledClass:  /__string#_589__ 
            }
        },
        inlineItems: { Main: { stackedProps: false } },
        buttons: { Main: { inputProps: { className:  /__string#_590__  }, labelProps: { className:  /__string#_591__  } } },
        radio: { _:  /__string#_592__ , Main: { type:  /__string#_593__  } },
        checkboxes: { _:  /__string#_594__ , Main: { type:  /__string#_595__  }, fields: {  /__string#_596__ : false,  /__string#_597__ : false } },
        selector: { Main: { onChange: selectorOnChange(false) } },
        tabs: { Main: { onChange: selectorOnChange(true) } },
        autosize: {
            blocks: {  /__string#_598__ : true },
            Layout: { style: { flexGrow: 0 } }
        }
    },
    presetMap: {
        boolean: [ /__string#_599__ ,  /__string#_600__ ],
        string: [ /__string#_601__ ,  /__string#_602__ ,  /__string#_603__ ,  /__string#_604__ ,  /__string#_605__ ,  /__string#_606__ ,  /__string#_607__ ,  /__string#_608__ ,  /__string#_609__ ,  /__string#_610__ ,  /__string#_611__ ,  /__string#_612__ ,  /__string#_613__ ,  /__string#_614__ ,  /__string#_615__ ,  /__string#_616__ ],
        number: [ /__string#_617__ ,  /__string#_618__ ,  /__string#_619__ ,  /__string#_620__ ],
        integer: [ /__string#_621__ ,  /__string#_622__ ,  /__string#_623__ ,  /__string#_624__ ],
        array: [ /__string#_625__ ,  /__string#_626__ ,  /__string#_627__ ]
    },
    presetsCombine: {
        radio: [[ /__string#_628__ ,  /__string#_629__ ],  /__string#_630__ ,  /__string#_631__ ],
        checkboxes: [[ /__string#_632__ ,  /__string#_633__ ],  /__string#_634__ ,  /__string#_635__ ],
        select: [ /__string#_636__ ,  /__string#_637__ ]
    }
};
exports /__prop#_1768__  = basicObjects;



function makeValidation(dispath) {
    function addValidatorResult2message(srcMessages, track, result) {
        var defLevel = arguments /__prop#_1769__  > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        function conv(item) {
            return (typeof item ===  /__string#_281__  ?  /__string#_282__  : _typeof2(item)) ===  /__string#_638__  ? item : { level: defLevel, text: item };
        }
        ;
        var colors = [ /__string#_639__ ,  /__string#_640__ ,  /__string#_641__ ,  /__string#_642__ ]; 
        if (isObject(result)) objKeys(result) /__prop#_1770__ (function (key) {
            return addValidatorResult2message(srcMessages, track /__prop#_1771__ (key), result[key], defLevel);
        });else {
            var messages = isArr(result) ? result /__prop#_1772__ (conv) : [conv(result)];
            messages /__prop#_1773__ (function (item) {
                var level = item /__prop#_1774__ ,
                    text = item /__prop#_1775__ ,
                    path = item /__prop#_1776__ ,
                    replace = item /__prop#_1777__ ,
                    _item$type = item /__prop#_1778__ ,
                    type = _item$type === undefined ?  /__string#_643__  : _item$type,
                    rest = __rest(item, [ /__string#_283__ ,  /__string#_284__ ,  /__string#_285__ ,  /__string#_286__ ,  /__string#_287__ ]);

                path = track /__prop#_1779__ ((typeof path ===  /__string#_644__  ? string2path(path) : path) || []);
                var fullPath = path2string(path, [ /__string#_645__ , level]);
                var mData = getByKey(srcMessages, fullPath, { textArray: [] });
                mData = getByKey(validationMessages, fullPath, mData);
                if (text) {
                    if (replace === undefined) mData /__prop#_1780__ .push(text);else mData /__prop#_1781__ [replace] = text;
                }
                Object /__prop#_1782__ (mData, rest);
                var shortPath = path2string(path);
                if (type ==  /__string#_646__ ) {
                    var valid = validStatus[shortPath];
                    if (isUndefined(valid) || valid || mData /__prop#_1783__ .length) validStatus[shortPath] = !mData /__prop#_1784__ .length; 
                } 
                if (isUndefined(colorStatus[shortPath])) colorStatus[shortPath] =  /__string#_647__ ;
                if (mData /__prop#_1785__ .length && colors /__prop#_1786__ (colorStatus[shortPath]) < colors /__prop#_1787__ (type)) colorStatus[shortPath] = ~colors /__prop#_1788__ (type) ? type :  /__string#_648__ ;
            });
        }
    }
    function recurseValidation(curValues, modifiedValues) {
        var track = arguments /__prop#_1789__  > 2 && arguments[2] !== undefined ? arguments[2] : [];

        var data = getIn(state, track /__prop#_1790__ ([SymData]));
        if (!data) return;
        var schemaPart = getSchemaPart(schema, track);
        if (schemaPart /__prop#_1791__  ==  /__string#_649__  || schemaPart /__prop#_1792__  ==  /__string#_650__ ) modifiedValues && objKeys(modifiedValues) /__prop#_1793__ (function (key) {
            return recurseValidation(curValues[key], modifiedValues[key], track /__prop#_1794__ (key));
        });
        var x = schemaPart /__prop#_1795__ ;
        if (x && x /__prop#_1796__ ) {
            x /__prop#_1797__ .forEach(function (validator) {
                var result = validator({ utils: utils, state: state, path: track, schemaPart: schemaPart, schema: schema }, curValues);
                
                if (result && result /__prop#_1798__  && typeof result /__prop#_1799__  ===  /__string#_651__ ) {
                    result /__prop#_1800__  = { curValues: curValues, path: track };
                    promises /__prop#_1801__ (result);
                    pendingStatus[path2string(track)] = true;
                } else addValidatorResult2message(validationMessages, track, result, 1);
            });
        }
    }
    function sendMessages2State() {
        objKeys(validationMessages) /__prop#_1802__ (function (pathString) {
            var item = makePathItem(pathString);
            item /__prop#_1803__  = validationMessages[pathString];
            validationUpdates /__prop#_1804__ (item);
        });
        objKeys(validStatus) /__prop#_1805__ (function (pathString) {
            return validationUpdates /__prop#_1806__ ({ path: string2path(pathString), keyPath: [ /__string#_652__ ,  /__string#_653__ ], value: validStatus[pathString] });
        });
        objKeys(pendingStatus) /__prop#_1807__ (function (pathString) {
            return validationUpdates /__prop#_1808__ ({ path: string2path(pathString), keyPath: [ /__string#_654__ ,  /__string#_655__ ], value: pendingStatus[pathString] });
        });
        objKeys(colorStatus) /__prop#_1809__ (function (pathString) {
            return validationUpdates /__prop#_1810__ ({ path: string2path(pathString), keyPath: [ /__string#_656__ ,  /__string#_657__ ], value: colorStatus[pathString] });
        });
        if (validationUpdates /__prop#_1811__ ) dispath({
            type: actionName4setItems,
            items: validationUpdates,
            stuff: stuff
        });
    }
    function clearDefaultMessages(modifiedValues) {
        var track = arguments /__prop#_1812__  > 1 && arguments[1] !== undefined ? arguments[1] : [];

        var data = getIn(state, track /__prop#_1813__ ([SymData]));
        if (!data) return;
        if (data /__prop#_1814__ .type ==  /__string#_658__  || data /__prop#_1815__ .type ==  /__string#_659__ ) modifiedValues && objKeys(modifiedValues) /__prop#_1816__ (function (key) {
            return clearDefaultMessages(modifiedValues[key], track /__prop#_1817__ (key));
        });
        addValidatorResult2message(validationMessages, track); 
    }
    var stuff = this /__prop#_1818__ ,
        force = this /__prop#_1819__ ;
    var JSONValidator = stuff /__prop#_1820__ ,
        schema = stuff /__prop#_1821__ ,
        getState = stuff /__prop#_1822__ ;

    var oldState = getState();
    
    if (force) oldState = null; 
    else dispath(this);
    
    var state = getState();
    if (oldState == state) return Promise /__prop#_1823__ (); 
    var newValues = state[SymData] /__stringProp#_54__ ;
    var validStatus = {};
    var pendingStatus = {};
    var colorStatus = {};
    var validationMessages = {};
    var validationUpdates = [];
    var promises = [];
    var modifiedValues = force === true ? newValues : force || state[SymData] /__stringProp#_55__ ; 
    if (!modifiedValues) return Promise /__prop#_1824__ (); 
    clearDefaultMessages(modifiedValues);
    var errs = JSONValidator(newValues);
    errs /__prop#_1825__ (function (item) {
        return addValidatorResult2message(validationMessages, item[0], item[1]);
    }); 
    recurseValidation(newValues, modifiedValues);
    
    sendMessages2State();
    
    getState()[SymData] /__prop#_1826__  = merge(state[SymData] /__prop#_1827__ , getState()[SymData] /__prop#_1828__ , { symbol: true }); 
    if (promises /__prop#_1829__ ) {
        
        validationMessages = {};
        validStatus = {};
        validationUpdates = [];
        return Promise /__prop#_1830__ (promises) /__prop#_1831__ (function (results) {
            var newValues = getState()[SymData] /__stringProp#_56__ ;
            for (var i = 0; i < promises /__prop#_1832__ ; i++) {
                if (!results[i]) continue;
                var _promises$i$vData = promises[i] /__prop#_1833__ ,
                    curValues = _promises$i$vData /__prop#_1834__ ,
                    _path = _promises$i$vData /__prop#_1835__ ;

                if (curValues == getIn(newValues, _path)) {
                    addValidatorResult2message(validationMessages, _path, results[i], 2);
                    pendingStatus[path2string(_path)] = false;
                }
            }
            sendMessages2State();
        }) /__prop#_1836__ (function (reason) {
            throw new Error(reason);
        });
    }
    return Promise /__prop#_1837__ ();
}
var actionSetItems = function actionSetItems(items, stuff, validate) {
    var action = { type: actionName4setItems, items: items, stuff: stuff };
    return validate ? makeValidation /__prop#_1838__ (action) : action;
};
var actionForceValidation = function actionForceValidation(force, stuff) {
    var action = { type: actionName4forceValidation, force: force, stuff: stuff };
    return makeValidation /__prop#_1839__ (action);
};



function formReducer(name) {
    if (name) formReducerValue = name;
    var reducersFunction = {};
    function setStateChanges(startState, action) {
        function makeSliceFromUpdateItem(item) {
            if (item /__prop#_1840__ ) return makeSlice(item /__prop#_1841__ , SymData, item /__prop#_1842__ , item /__prop#_1843__ );else return makeSlice(item /__prop#_1844__ , item /__prop#_1845__ );
        }
        function setCurrentValue(state, changes) {
            return mergeState(state[SymData] /__stringProp#_57__ , getAsObject(state, [SymData,  /__string#_660__ ], getValue, changes), { arrays:  /__string#_661__ , del: true, SymbolDelete: Symbol /__prop#_1846__ ( /__string#_662__ ) });
        }
        function mergeProcedure(prevState, newState) {
            mergeResult = mergeState(prevState, newState, options4changes);
            state = mergeResult /__prop#_1847__ ;
            changes = mergeResult /__prop#_1848__ ;
            if (changes) allChanges /__prop#_1849__ (changes);
            return state;
        }
        function applyHooksProcedure(items, hookType) {
            var _loop4 = function _loop4(j) {
                var item = items[j];
                if (!isObject(getIn(state, item /__prop#_1850__ ))) return  /__string#_288__ ;
                var changes = {};
                changes /__prop#_1851__  = [];
                changes /__prop#_1852__  = [];
                changes /__prop#_1853__  = [item];

                var _loop5 = function _loop5(_i4) {
                    var res = beforeMerge[_i4](state, item, utils, stuff /__prop#_1854__ , data, hookType);
                    if (!res) return {
                            v: {
                                v: false
                            }
                        };
                    if (isArr(res)) res = { after: res };
                    [ /__string#_663__ ,  /__string#_664__ ] /__prop#_1855__ (function (key) {
                        return res[key] && push2array(changes[key], res[key]);
                    });
                    if (res /__prop#_1856__ ) changes /__prop#_1857__  = [];
                };

                for (var _i4 = 0; _i4 < beforeMerge /__prop#_1858__ ; _i4++) {
                    var _ret8 = _loop5(_i4);

                    if ((typeof _ret8 ===  /__string#_289__  ?  /__string#_290__  : _typeof2(_ret8)) ===  /__string#_291__ ) return _ret8 /__prop#_1859__ ;
                }
                [ /__string#_665__ ,  /__string#_666__ ,  /__string#_667__ ] /__prop#_1860__ (function (key) {
                    return changes[key] /__prop#_1861__ (function (item) {
                        return state = merge(state, makeSliceFromUpdateItem(item), options);
                    });
                });
            };

            for (var j = 0; j < items /__prop#_1862__ ; j++) {
                var _ret7 = _loop4(j);

                switch (_ret7) {
                    case  /__string#_292__ :
                        continue;

                    default:
                        if ((typeof _ret7 ===  /__string#_293__  ?  /__string#_294__  : _typeof2(_ret7)) ===  /__string#_295__ ) return _ret7 /__prop#_1863__ ;
                }
            }
            afterMergeProcedureState = mergeProcedure(afterMergeProcedureState, state);
            for (var i = 0; i < afterMerge /__prop#_1864__ ; i++) {
                var res = afterMerge[i](state, allChanges, utils, stuff /__prop#_1865__ , data, hookType);
                if (!res) return false; 
                res /__prop#_1866__ (function (item) {
                    return state = merge(state, makeSliceFromUpdateItem(item), options);
                });
                afterMergeProcedureState = mergeProcedure(afterMergeProcedureState, state);
            }
            return true;
        }
        var _action$options = action /__prop#_1867__ ,
            options = _action$options === undefined ? {} : _action$options,
            stuff = action /__prop#_1868__ ,
            items = action /__prop#_1869__ ;

        var allChanges = [];
        Object /__prop#_1870__ (options, { symbol: true });
        var mergeResult = void 0,
            changes = void 0,
            state = startState,
            data = {};
        var options4changes = merge(options, { diff: true });
        var afterMergeProcedureState = startState;
        var _stuff$hooks = stuff /__prop#_1871__ ,
            afterMerge = _stuff$hooks /__prop#_1872__ ,
            beforeMerge = _stuff$hooks /__prop#_1873__ ;
        

        if (!applyHooksProcedure(items,  /__string#_668__ )) return startState;
        
        var apllyItems = applyMap(state, allChanges);
        if (!apllyItems) return startState; 
        
        if (!applyHooksProcedure(apllyItems,  /__string#_669__ )) return startState;
        
        
        if (state != startState) {
            if (allChanges /__prop#_1874__  > 1) mergeProcedure(startState, state);else changes = allChanges[0];
            state[SymData] = Object /__prop#_1875__ ({}, state[SymData]); 
            var cur = setCurrentValue(state, changes);
            state[SymData] /__stringProp#_58__  = cur /__prop#_1876__ ;
            state[SymData] /__stringProp#_59__  = cur /__prop#_1877__ ;
            state[SymData] /__stringProp#_60__ ++;
            if (state == changes) {
                changes = Object /__prop#_1878__ ({}, state);
                changes[SymData] = Object /__prop#_1879__ ({}, state[SymData]);
            }
            state[SymData] /__stringProp#_61__  = changes;
        }
        
        return state;
    }
    function applyMap(state, changesArray) {
        var result = [];
        function recurse(state, changes) {
            var track = arguments /__prop#_1880__  > 2 && arguments[2] !== undefined ? arguments[2] :  /__stringProp#_62__ ;

            if (getIn(state, [SymData,  /__string#_670__ ])) {
                (function () {
                    var dataObj = state[SymData];
                    var trackString = path2string(track);
                    objKeysNSymb(dataObj /__stringProp#_63__ ) /__prop#_1881__ (function (keyPathFrom) {
                        var mapTo = dataObj /__stringProp#_64__ [keyPathFrom];
                        var value = keyPathFrom == SymData ? state : getIn(dataObj, string2path(keyPathFrom));
                        objKeys(mapTo) /__prop#_1882__ (function (key) {
                            var valueFn = mapTo[key];
                            var to = makePathItem(key, track);
                            if (keyPathFrom == SymData && to /__prop#_1883__ ) delete to /__prop#_1884__ ; 
                            to /__prop#_1885__  = valueFn ? valueFn /__prop#_1886__ ({ state: state, path: track, utils: utils })(value) : value;
                            if (to /__prop#_1887__  && isObject(value)) {
                                object2PathValues(value) /__prop#_1888__ (function (pathValue) {
                                    var value = pathValue /__prop#_1889__ ();
                                    var keyPath = to /__prop#_1890__ .concat(pathValue);
                                    result /__prop#_1891__ ({ path: to /__prop#_1892__ , keyPath: keyPath, value: value });
                                });
                            } else {
                                result /__prop#_1893__ (to);
                            }
                        });
                    });
                })();
            }
            if (isObject(changes)) objKeys(changes) /__prop#_1894__ (function (key) {
                return recurse(state[key], changes[key], track /__prop#_1895__ (key));
            });
        }
        changesArray /__prop#_1896__ (function (changes) {
            return recurse(state, changes);
        });
        return result;
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    reducersFunction[actionName4setItems] = function (state, action) {
        return setStateChanges(state, action);
    };
    return function (state, action) {
        var reduce = reducersFunction[action /__prop#_1897__ ];
        return reduce ? reduce(state, action) : state;
    };
}
exports /__prop#_1898__  = formReducer;



function apiCreator(dispath, getState, setState, keyMap, hooks, JSONValidator, schema) {
    var api = {};
    var batching = 0;
    var batchedItems = [];
    var dispathAction = dispath;
    var stuff = { JSONValidator: JSONValidator, hooks: hooks, getState: getState, schema: schema };
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    api /__prop#_1899__  = getState;
    api /__prop#_1900__  = function () {
        var force = arguments /__prop#_1901__  > 0 && arguments[0] !== undefined ? arguments[0] : true;

        if (typeof force ===  /__string#_671__ ) force = [force];
        if (isArr(force)) {
            (function () {
                var result = {};
                force /__prop#_1902__ (function (value) {
                    return getByKey(result, string2path(value));
                });
                force = result;
            })();
        }
        return dispath(actionForceValidation(force, stuff));
    };
    api /__prop#_1903__  = function (path) {
        return getIn(getState(), typeof path ==  /__string#_672__  ? string2path(path) : path);
    };
    api /__prop#_1904__  = function (path, value) {
        var validate = arguments /__prop#_1905__  > 2 && arguments[2] !== undefined ? arguments[2] : !batching;

        return dispathAction(actionSetItems([makeUpdateItem(path, value)], stuff, validate));
    };
    api /__prop#_1906__  = function (path, value) {
        var validate = arguments /__prop#_1907__  > 2 && arguments[2] !== undefined ? arguments[2] : !batching;

        var items = makeArrayOfPathItem(path);
        items /__prop#_1908__ (function (item) {
            return item /__prop#_1909__  = value;
        });
        return dispathAction(actionSetItems(items, stuff, validate));
    };
    api /__prop#_1910__  = function (path, value) {
        var validate = arguments /__prop#_1911__  > 2 && arguments[2] !== undefined ? arguments[2] : !batching;

        var items = makeArrayOfPathItem(path);
        var obj = {};
        var result = [];
        items /__prop#_1912__ (function (item) {
            var key = item /__prop#_1913__ .slice(0, -1) /__prop#_1914__ (item /__prop#_1915__  ? push2array( /__stringProp#_65__ , item /__prop#_1916__ ) : []) /__prop#_1917__ ( /__string#_673__ );
            if (!obj[key]) obj[key] = [];
            obj[key] /__prop#_1918__ (item /__prop#_1919__ [item /__prop#_1920__ .length - 1]);
        });
        var state = getState();
        objKeys(obj) /__prop#_1921__ (function (pathString) {
            var pathItem = makePathItem(pathString);
            var keys = getKeysAccording2schema(state, pathItem /__prop#_1922__ ); 
            obj[pathString] /__prop#_1923__ (function (key2del) {
                return ~keys /__prop#_1924__ (key2del) && keys /__prop#_1925__ (keys /__prop#_1926__ (key2del), 1);
            });
            keys /__prop#_1927__ (function (key) {
                return result /__prop#_1928__ ({ path: pathItem /__prop#_1929__ .concat(key), keyPath: pathItem /__prop#_1930__ , value: value });
            });
        });
        items = result;
        return dispathAction(actionSetItems(items, stuff, validate));
    };
    api /__prop#_1931__  = function (keyPath, unflatten, fn) {
        var value = getAsObject(getState(), push2array([SymData], typeof keyPath ==  /__string#_674__  ? string2path(keyPath) : keyPath), fn);
        return unflatten ? value : keyMap /__prop#_1932__ (value);
    };
    api /__prop#_1933__  = function (vals, keyPath) {
        var validate = arguments /__prop#_1934__  > 2 && arguments[2] !== undefined ? arguments[2] : !batching;

        function recursivelySetLength4arrays(items, vals) {
            var track = arguments /__prop#_1935__  > 2 && arguments[2] !== undefined ? arguments[2] : [];

            if (isArr(vals) && changeLength) items /__prop#_1936__ ({ path:  /__stringProp#_66__ .concat(keyMap /__prop#_1938__ (track)), keyPath: [ /__string#_675__ ,  /__string#_676__ , changeLength], value: vals /__prop#_1939__  });
            if (isMergeableObject(vals)) objKeys(vals) /__prop#_1940__ (function (key) {
                return recursivelySetValues(items, vals[key], track /__prop#_1941__ (key));
            });
        }
        if (typeof keyPath ==  /__string#_677__ ) keyPath = string2path(keyPath);
        var items = [];
        var changeLength = keyPath[0] ==  /__string#_678__  && keyPath[1];
        recursivelySetValues(items, vals);
        object2PathValues(vals) /__prop#_1942__ (function (item) {
            var value = item /__prop#_1943__ ();
            items /__prop#_1944__ ({ path:  /__stringProp#_67__ .concat(keyMap /__prop#_1946__ (item)), keyPath: keyPath, value: value });
        });
        return dispathAction(actionSetItems(items, stuff, validate));
    };
    api /__prop#_1947__  = function (unflatten) {
        return unflatten ? getState()[SymData] /__stringProp#_68__  : keyMap /__prop#_1948__ (getState()[SymData] /__stringProp#_69__ );
    };
    api /__prop#_1949__  = function (vals) {
        var validate = arguments /__prop#_1950__  > 1 && arguments[1] !== undefined ? arguments[1] : !batching;
        return api /__prop#_1951__ (vals, [ /__string#_679__ ,  /__string#_680__ ], validate);
    };
    api /__prop#_1952__  = function () {
        return api /__prop#_1953__ ([ /__string#_681__ ,  /__string#_682__ ]);
    };
    api /__prop#_1954__  = function (vals) {
        var validate = arguments /__prop#_1955__  > 1 && arguments[1] !== undefined ? arguments[1] : !batching;
        return api /__prop#_1956__ (vals, [ /__string#_683__ ,  /__string#_684__ ], validate);
    };
    api /__prop#_1957__  = function () {
        return api /__prop#_1958__ ([[],  /__stringProp#_70__ ]);
    };
    api /__prop#_1959__  = function (path) {
        var op = arguments /__prop#_1960__  > 1 && arguments[1] !== undefined ? arguments[1] :  /__string#_685__ ;

        path = typeof path ==  /__string#_686__  ? string2path(path) : path;
        if (op ==  /__string#_687__ ) return api /__prop#_1961__ (path /__prop#_1962__ (SymData,  /__string#_688__ ,  /__string#_689__ ,  /__string#_690__ ), getValue(api /__prop#_1963__ (path /__prop#_1964__ (SymData,  /__string#_691__ ,  /__string#_692__ ))) + 1);
    };
    api /__prop#_1965__  = function (path, op, value) {
        path = typeof path ==  /__string#_693__  ? string2path(path) : path /__prop#_1966__ ();
        var from = parseIntFn(path /__prop#_1967__ ());
        var to = from;
        var min = api /__prop#_1968__ (path /__prop#_1969__ (SymData,  /__string#_694__ ,  /__string#_695__ ));
        var lengthFull = api /__prop#_1970__ (path /__prop#_1971__ (SymData,  /__string#_696__ ,  /__string#_697__ ));
        var max = getValue(lengthFull) - 1;
        if (op ==  /__string#_698__ ) to--;
        if (op ==  /__string#_699__ ) to++;
        if (op ==  /__string#_700__ ) to = min;
        if (op ==  /__string#_701__  || op ==  /__string#_702__ ) to = max;
        if (op ==  /__string#_703__  && value !== undefined) to = value;
        if (op ==  /__string#_704__  && value !== undefined) to += value;
        if (to < min) to = min;
        if (to > max) to = max;
        var valuesNames = [ /__string#_705__ ,  /__string#_706__ ];
        var state = api /__prop#_1972__ ();
        var arrayValues = {}; 
        var delStateObject = {};
        var arrayItems = {};
        var stateObject = {};
        var mergeObject = {};
        valuesNames /__prop#_1973__ (function (name) {
            arrayValues[name] = getIn(api /__prop#_1974__ ([ /__string#_707__ , name], true), path);
        });
        arrayValues /__stringProp#_71__  = getIn(api /__prop#_1975__ (true), path);
        
        
        for (var i = Math /__prop#_1976__ (from, to); i <= Math /__prop#_1977__ (from, to); i++) {
            delStateObject[i] = SymbolDelete;
            stateObject[i] = getIn(state, path /__prop#_1978__ (i));
            arrayItems[i] = stateObject[i][SymData] /__prop#_1979__ ;
            mergeObject[i] = arrayValues /__stringProp#_72__ [i];
        }
        stateObject = moveArrayElems(stateObject, from, to);
        objKeys(arrayItems) /__prop#_1980__ (function (i) {
            stateObject[i][SymData] /__prop#_1981__  = arrayItems[i];
        });
        mergeObject = moveArrayElems(mergeObject, from, to);
        api /__prop#_1982__ ();
        var promise = void 0;
        if (op ==  /__string#_708__ ) {
            delete mergeObject[to];
            stateObject[to] = makeStateFromSchema(schema, {}, path /__prop#_1983__ (to));
        }
        promise = api /__prop#_1984__ (path, delStateObject);
        promise = api /__prop#_1985__ (path, stateObject);
        
        
        op ==  /__string#_709__  && api /__prop#_1986__ (path /__prop#_1987__ (SymData,  /__string#_710__ ,  /__string#_711__ ,  /__string#_712__ ), max);
        valuesNames /__prop#_1988__ (function (name) {
            return !isUndefined(arrayValues[name]) && api /__prop#_1989__ (makeSlice(path, arrayValues[name]), [ /__string#_713__ , name]);
        });
        
        promise = api /__prop#_1990__ (makeSlice(path, mergeObject), [ /__string#_714__ ,  /__string#_715__ ]);
        return api /__prop#_1991__ ();
        
    };
    api /__prop#_1992__  = function (path) {
        var value = arguments /__prop#_1993__  > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var items = makeArrayOfPathItem(path);
        items /__prop#_1994__ (function (item) {
            item /__prop#_1995__  = value;
            item /__prop#_1996__  = [ /__string#_716__ ,  /__string#_717__ ];
        });
        return dispathAction(actionSetItems(items, stuff, false));
    };
    api /__prop#_1997__  = function (path) {
        api /__prop#_1998__ ();
        var promise = api /__prop#_1999__ (path +  /__string#_718__ , false);
        promise = api /__prop#_2000__ (path +  /__string#_719__ , true);
        return api /__prop#_2001__ ();
    };
    
    
    
    
    
    
    
    
    api /__prop#_2002__  = function (path) {
        api /__prop#_2003__ ();
        var promise = api /__prop#_2004__ (path +  /__string#_720__ , false);
        promise = api /__prop#_2005__ (path +  /__string#_721__ , true);
        return api /__prop#_2006__ ();
    };
    api /__prop#_2007__  = function (path) {
        api /__prop#_2008__ ();
        api /__prop#_2009__ (path);
        api /__prop#_2010__ (path);
        return api /__prop#_2011__ ();
    };
    api /__prop#_2012__  = function () {
        batching++;
        dispathAction = function dispathAction(_ref4) {
            var items = _ref4 /__prop#_2013__ ;

            push2array(batchedItems, items);
            return Promise /__prop#_2014__ ();
        };
    };
    api /__prop#_2015__  = function () {
        var validate = arguments /__prop#_2016__  > 0 && arguments[0] !== undefined ? arguments[0] : true;

        batching--;
        if (batching || !batchedItems /__prop#_2017__ ) return Promise /__prop#_2018__ ();
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
        if (schemaPart /__prop#_2019__ ) {
            if (!isArr(schemaPart /__prop#_2020__ )) return schemaPart /__prop#_2021__ ;else items = schemaPart /__prop#_2022__ ;
        }
        if (index < items /__prop#_2023__ ) return items[index];else {
            if (schemaPart /__prop#_2024__  !== false) {
                if (schemaPart /__prop#_2025__  && schemaPart /__prop#_2026__  !== true) return schemaPart /__prop#_2027__ ;
                return items[items /__prop#_2028__  - 1];
            }
        }
        throw new Error(errorText + path /__prop#_2029__ ( /__string#_722__ ));
    }
    function getSchemaByRef(schema, $ref) {
        var path = string2path($ref);
        if (path[0] ==  /__string#_723__ ) return getIn(schema, path); 
        throw new Error( /__string#_296__ ); 
    }
    var errorText =  /__string#_724__ ;
    var schemaPart = schema;
    for (var i = path[0] ==  /__string#_725__  ? 1 : 0; i < path /__prop#_2030__ ; i++) {
        if (!schemaPart) throw new Error(errorText + path /__prop#_2031__ ( /__string#_726__ ));
        if (schemaPart /__prop#_2032__ ) {
            var $refSchema = getSchemaByRef(schema, schemaPart /__prop#_2033__ );

            var _schemaPart = schemaPart,
                $ref = _schemaPart /__prop#_2034__ ,
                localSchema = __rest(schemaPart,  /__stringProp#_13__ );

            schemaPart = merge($refSchema, localSchema);
        }
        if (schemaPart /__prop#_2035__  ==  /__string#_727__ ) {
            schemaPart = getArrayItemSchemaPart(path[i], schemaPart);
        } else {
            if (schemaPart /__prop#_2036__  && schemaPart /__prop#_2037__ [path[i]]) schemaPart = schemaPart /__prop#_2038__ [path[i]];else throw new Error(errorText + path /__prop#_2039__ ( /__string#_728__ ));
            ;
        }
    }
    if (!schemaPart /__prop#_2040__ ) return schemaPart;
    var refMap = getByKey(schema, [SymData,  /__string#_729__ , schemaPart /__prop#_2041__ ], new Map());
    if (!refMap /__prop#_2042__ (schemaPart)) {
        var _$refSchema = getSchemaByRef(schema, schemaPart /__prop#_2043__ );

        var _schemaPart2 = schemaPart,
            _$ref = _schemaPart2 /__prop#_2044__ ,
            _localSchema = __rest(schemaPart,  /__stringProp#_14__ );

        refMap /__prop#_2045__ (schemaPart, merge(_$refSchema, _localSchema));
    }
    return refMap /__prop#_2046__ (schemaPart);
}
function makeDataObject(schema, values, path) {
    function isParentRequires(path, resolvedSchema) {
        if (!path /__prop#_2047__ ) return false;
        var schemaPart = getSchemaPart(resolvedSchema, path /__prop#_2048__ (0, -1));
        return !!(schemaPart /__prop#_2049__  ==  /__string#_730__  && isArr(schemaPart /__prop#_2050__ ) && ~schemaPart /__prop#_2051__ .indexOf(path[path /__prop#_2052__  - 1]));
    }
    function getValueFromSchema(path, keyPath, resolvedSchema) {
        
        var tmpPath = path /__prop#_2053__ (null);
        for (var i = 0; i < path /__prop#_2054__  + 1; i++) {
            tmpPath /__prop#_2055__ ();
            var _schemaPart3 = getSchemaPart(resolvedSchema, path);
            if (_schemaPart3) return getIn(_schemaPart3, keyPath);
        }
    }
    function getParentArrayValue(path, resolvedSchema) {
        var pathPart = path /__prop#_2056__ ();
        var keyPart = [];
        var result = void 0;
        for (var i = 0; i < path /__prop#_2057__ ; i++) {
            var key = pathPart /__prop#_2058__ ();
            keyPart /__prop#_2059__ (key);
            var _schemaPart4 = getSchemaPart(resolvedSchema, pathPart);
            if (!_schemaPart4) return;
            if (_schemaPart4 /__prop#_2060__  ==  /__string#_731__ ) {
                var tmp = getIn(_schemaPart4 /__prop#_2061__ , keyPart);
                if (tmp) result = tmp;
            }
        }
        return result;
    }
    function makeDataMap(dataMap) {
        return merge /__prop#_2062__ ({}, dataMap /__prop#_2063__ (function (item) {
            var from = makePathItem(item[0], path);
            var to = item[1];
            return makeSlice(from /__prop#_2064__ , SymData,  /__string#_732__ , from /__prop#_2065__  ? path2string(from /__prop#_2066__ ) : SymData, to, item[2]);
        }), { symbol: true });
    }
    var bindObject = { schema: schema, utils: utils };
    var schemaPart = getSchemaPart(schema, path);
    if (!schemaPart) throw new Error( /__string#_297__  + path /__prop#_2067__ ( /__string#_733__ ) +  /__string#_298__ );
    var x = schemaPart /__prop#_2068__  || {};

    var custom = x /__prop#_2069__ ,
        preset = x /__prop#_2070__ ,
        dataMap = x /__prop#_2071__ ,
        fields = x /__prop#_2072__ ,
        flatten = x /__prop#_2073__ ,
        groups = x /__prop#_2074__ ,
        selectOnly = x /__prop#_2075__ ,
        validators = x /__prop#_2076__ ,
        showOnly = x /__prop#_2077__ ,
        rest = __rest(x, [ /__string#_299__ ,  /__string#_300__ ,  /__string#_301__ ,  /__string#_302__ ,  /__string#_303__ ,  /__string#_304__ ,  /__string#_305__ ,  /__string#_306__ ,  /__string#_307__ ]);

    var result = merge({ controls: {}, messages: {} }, rest);
    var schemaData = result /__prop#_2078__  = {};
    schemaData /__prop#_2079__  = schemaPart /__prop#_2080__ ;
    schemaData /__prop#_2081__  = isArr(schemaPart /__prop#_2082__ ) ? schemaPart /__prop#_2083__ [0] : schemaPart /__prop#_2084__ ;
    
    if (schemaPart /__prop#_2085__  !=  /__string#_734__  && schemaPart /__prop#_2086__  !=  /__string#_735__ ) {
        schemaData /__prop#_2087__  = !!isParentRequires(path, schema) || schemaPart /__prop#_2088__ ;
        result /__prop#_2089__  = {
             /__string#_736__ : getParentArrayValue(path, schema) || schemaPart /__prop#_2090__ 
        };
        [ /__string#_737__ ,  /__string#_738__ ,  /__string#_739__ ] /__prop#_2091__ (function (type) {
            var val = getIn(values[type], path);
            if (!isUndefined(val)) result /__prop#_2092__ [type] = val;
        });
    }
    var status = result /__prop#_2093__  = {};
    status /__prop#_2094__  =  /__string#_740__ ;
    status /__prop#_2095__  = false;
    status /__prop#_2096__  = false;
    status /__prop#_2097__  = true;
    status /__prop#_2098__  = result /__prop#_2099__  ? getValue(result /__prop#_2100__ ) === getValue(result /__prop#_2101__ ,  /__string#_741__ ) : true;
    return { data: result, dataMap: dataMap ? makeDataMap(dataMap) : {} };
}
var getArrayStartIndex = function getArrayStartIndex(schemaPart) {
    if (!isArr(schemaPart /__prop#_2102__ )) return 0;
    if (schemaPart /__prop#_2103__  === false) return Infinity;
    if (_typeof2(schemaPart /__prop#_2104__ ) ===  /__string#_742__ ) return schemaPart /__prop#_2105__ .length;
    return schemaPart /__prop#_2106__ .length - 1;
};
function makeStateFromSchema(schema) {
    var values = arguments /__prop#_2107__  > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var currentPath = arguments /__prop#_2108__  > 2 && arguments[2] !== undefined ? arguments[2] :  /__stringProp#_73__ ;

    function mapPath2key(prefix, obj) {
        var result = {};
        objKeys(obj) /__prop#_2109__ (function (val) {
            if (typeof obj[val] ==  /__string#_743__ ) result[val] = prefix + obj[val];else result[val] = mapPath2key(prefix, obj[val]);
        });
        return result;
    }
    var result = {};
    var dataMapObjects = [];
    var dataObj = makeDataObject(schema, values, currentPath);
    var schemaPart = getSchemaPart(schema, currentPath);
    result[SymData] = dataObj /__prop#_2110__ ;
    dataMapObjects /__prop#_2111__ (dataObj /__prop#_2112__ );
    var keys = [];
    if (schemaPart /__prop#_2113__  ==  /__string#_744__ ) {
        (function () {
            var vals = schemaPart /__prop#_2114__ ;
            var lengthFull = {  /__string#_745__ : 0 };
            if (vals && isArr(vals)) lengthFull /__prop#_2115__  = vals /__prop#_2116__ ;
            if (schemaPart /__prop#_2117__ ) lengthFull /__prop#_2118__  = Math /__prop#_2119__ (lengthFull /__prop#_2120__ , schemaPart /__prop#_2121__ );
            var maxLength = lengthFull /__prop#_2122__ ;
            [ /__string#_746__ ,  /__string#_747__ ,  /__string#_748__ ] /__prop#_2123__ (function (type) {
                var val = getIn(values[type], currentPath);
                if (!isUndefined(val)) lengthFull[type] = val /__prop#_2124__ ;
            });
            for (var i = 0; i < getMaxValue(lengthFull); i++) {
                keys /__prop#_2125__ (i /__prop#_2126__ ());
            }result[SymData] /__prop#_2127__  = {
                lengths: lengthFull,
                arrayStartIndex: getArrayStartIndex(schemaPart),
                canAdd: !(schemaPart /__prop#_2128__  === false) && getValue(lengthFull) < (schemaPart /__prop#_2129__  || Infinity)
            };
        })();
    } else if (schemaPart /__prop#_2130__  ==  /__string#_749__ ) {
        keys = objKeys(schemaPart /__prop#_2131__ );
    }
    keys /__prop#_2132__ (function (field) {
        var dataObj = makeStateFromSchema(schema, values, currentPath /__prop#_2133__ (field));
        dataMapObjects /__prop#_2134__ (dataObj /__prop#_2135__ );
        result[field] = dataObj /__prop#_2136__ ;
        if (schemaPart /__prop#_2137__  ==  /__string#_750__ ) {
            var num = parseIntFn(field);
            var arrayItem = getByKey(result[field][SymData],  /__string#_751__ );
            var arrayStartIndex = result[SymData] /__prop#_2138__ .arrayStartIndex;
            var length = getValue(result[SymData] /__prop#_2139__ .lengths);
            if (num >= arrayStartIndex) {
                arrayItem /__prop#_2140__  = arrayStartIndex < num;
                arrayItem /__prop#_2141__  = arrayStartIndex <= num && num < length - 1;
            }
            var minItems = schemaPart /__prop#_2142__  || 0;
            if (num >= minItems) arrayItem /__prop#_2143__  = num >= Math /__prop#_2144__ (arrayStartIndex, length - 1);
        }
    });
    return { state: result, dataMap: merge /__prop#_2145__ ({}, dataMapObjects, { symbol: true }) };
}
exports /__prop#_2146__  = makeStateFromSchema;
function getKeyMapFromSchema(schema) {
    return {
        key2path: key2path,
        path2key: path2key,
        flatten: mapObj /__prop#_2147__ (null, path2key, key2path),
        unflatten: mapObj /__prop#_2148__ (null, key2path, path2key)
    };
    function getKeyMap(schema) {
        var track = arguments /__prop#_2149__  > 1 && arguments[1] !== undefined ? arguments[1] :  /__stringProp#_74__ ;

        function checkIfHaveKey(key) {
            if (keyMap /__prop#_2150__ .hasOwnProperty(key)) throw new Error( /__string#_308__  + key);
        }
        function mapPath2key(prefix, obj) {
            var result = {};
            objKeys(obj) /__prop#_2151__ (function (val) {
                if (typeof obj[val] ==  /__string#_752__ ) result[val] = prefix + obj[val];else result[val] = mapPath2key(prefix, obj[val]);
            });
            return result;
        }
        var schemaPart = getSchemaPart(schema, track);
        var keyMaps = getByKey(schema, [SymData,  /__string#_753__ ], new Map());
        if (keyMaps /__prop#_2152__ (schemaPart)) return keyMaps /__prop#_2153__ (schemaPart);
        if (schemaPart /__prop#_2154__  !=  /__string#_754__ ) return;
        var result = {};
        var fields = objKeys(schemaPart /__prop#_2155__  || {});
        var keyMap = getByKey(result, [SymData,  /__string#_755__ ], { key2path: {}, path2key: {} });
        if (schemaPart /__prop#_2156__  && schemaPart /__prop#_2157__ .flatten) keyMap /__prop#_2158__  = schemaPart /__prop#_2159__ .flatten !== true && schemaPart /__prop#_2160__ .flatten ||  /__string#_756__ ;
        fields /__prop#_2161__ (function (field) {
            var keyResult = getKeyMap(schema, track /__prop#_2162__ (field));
            var objKeyMap = getIn(keyResult, [SymData,  /__string#_757__ ]) || {};
            if (!isUndefined(objKeyMap /__prop#_2163__ )) {
                objKeys(objKeyMap /__prop#_2164__ ) /__prop#_2165__ (function (key) {
                    checkIfHaveKey(objKeyMap /__prop#_2166__  + key);
                    keyMap /__prop#_2167__ [objKeyMap /__prop#_2168__  + key] = [field] /__prop#_2169__ (objKeyMap /__prop#_2170__ [key]);
                });
                keyMap /__prop#_2171__ [field] = mapPath2key(objKeyMap /__prop#_2172__ , objKeyMap /__prop#_2173__ );
            } else if (!isUndefined(keyMap /__prop#_2174__ )) {
                checkIfHaveKey(field);
                keyMap /__prop#_2175__ [field] = field;
                keyMap /__prop#_2176__ [field] = field;
            }
        });
        keyMaps /__prop#_2177__ (schemaPart, result);
        return result;
    }
    function key2path(keyPath) {
        if (typeof keyPath ==  /__string#_758__ ) keyPath = string2path(keyPath);
        var result = [];
        keyPath /__prop#_2178__ (function (key) {
            var path = getIn(getKeyMap(schema, result), [SymData,  /__string#_759__ ,  /__string#_760__ , key]);
            result = push2array(result, path ? path : key);
        });
        return result;
    }
    function path2key(path) {
        var result = [];
        var i = 0;
        while (i < path /__prop#_2179__ ) {
            var key = path[i];
            var _path2key = getIn(getKeyMap(schema, path /__prop#_2180__ (0, i)), [SymData,  /__string#_761__ ,  /__string#_762__ ]);
            if (_path2key) {
                var j = 0;
                while (1) {
                    if (_path2key[key]) {
                        if (typeof _path2key[key] ==  /__string#_763__ ) {
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
            result /__prop#_2181__ (key);
            i++;
        }
        return result;
    }
    function mapObj(fnDirect, fnReverse, object) {
        var result = {};
        function recurse(value) {
            var track = arguments /__prop#_2182__  > 1 && arguments[1] !== undefined ? arguments[1] : [];

            var keys = void 0;
            if (isMergeableObject(value)) {
                keys = objKeys(value);
                keys /__prop#_2183__ (function (key) {
                    return recurse(value[key], track /__prop#_2184__ (key));
                });
            }
            if (!(keys && keys /__prop#_2185__ ) && getIn(getKeyMap(schema, fnDirect == key2path ? key2path(track) : track), [SymData,  /__string#_764__ ,  /__string#_765__ ]) === undefined) {
                var tmp = result;
                var _path2 = fnDirect(track);
                for (var i = 0; i < _path2 /__prop#_2186__  - 1; i++) {
                    var _field2 = _path2[i];
                    if (!tmp[_field2]) tmp[_field2] = isArr(getIn(object, fnReverse(_path2 /__prop#_2187__ (0, i + 1)))) ? [] : {};
                    tmp = tmp[_field2];
                }
                tmp[_path2 /__prop#_2188__ ()] = value;
            }
        }
        recurse(object);
        return result;
    }
}
exports /__prop#_2189__  = getKeyMapFromSchema;




function mergeState(state, source) {
    var options = arguments /__prop#_2190__  > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var fn = options /__prop#_2191__  ? objKeysNSymb : objKeys;
    
    var SymbolDelete = options /__prop#_2192__ ,
        del = options /__prop#_2193__ ,
        diff = options /__prop#_2194__ ,
        _options$arrays = options /__prop#_2195__ ,
        arrays = _options$arrays === undefined ?  /__string#_766__  : _options$arrays;

    var mergeArrays = arrays !=  /__string#_767__ ;
    var setArrayLength = arrays ==  /__string#_768__ ;
    var concatArray = arrays ==  /__string#_769__ ;
    
    var canMerge = mergeArrays === true ? isMergeableObject : isObject;
    function recusion(state, source) {
        var track = arguments /__prop#_2196__  > 2 && arguments[2] !== undefined ? arguments[2] : [];

        var isSourceArray = isArr(source);
        if (!isMergeableObject(state)) state = isSourceArray ? [] : {}; 
        var isStateArray = isArr(state);
        if (!isMergeableObject(source)) return { state: state }; 
        var stateKeys = fn(state);
        if (stateKeys /__prop#_2197__  == 0 && !del && (!isStateArray || isSourceArray && arrays !=  /__string#_770__ )) return { state: source, changes: source };
        var srcKeys = fn(source);
        var changes = {};
        var changedObjects = {};
        var result = isStateArray ? [] : {}; 
        if (diff) {
            stateKeys /__prop#_2198__ (function (key) {
                if (!~srcKeys /__prop#_2199__ (key)) changes[key] = SymbolDelete;
            });
        }
        if (isStateArray && isSourceArray) {
            if (concatArray) {
                if (!source /__prop#_2200__ ) return { state: state };
                var srcPrev = source;
                if (!del) {
                    srcPrev /__prop#_2201__ (function (item, idx) {
                        return changes[state /__prop#_2202__  + idx] = item;
                    });
                    srcKeys = [];
                } else {
                    source = [];
                    srcPrev /__prop#_2203__ (function (item, idx) {
                        return source[state /__prop#_2204__  + idx] = item;
                    });
                    srcKeys = fn(source);
                }
            }
            if (setArrayLength && state /__prop#_2205__  != source /__prop#_2206__ ) changes /__prop#_2207__  = source /__prop#_2208__ ;
        }
        srcKeys /__prop#_2209__ (function (key) {
            if (del && source[key] === SymbolDelete) {
                if (state /__prop#_2210__ (key)) changes[key] = SymbolDelete;
            } else {
                if (!canMerge(source[key])) {
                    if (!state /__prop#_2211__ (key) || !is(state[key], source[key])) changes[key] = source[key];
                } else {
                    if (state[key] !== source[key]) {
                        var _obj2 = recusion(state[key], source[key], track /__prop#_2212__ (key));
                        if (_obj2 /__prop#_2213__ ) changedObjects[key] = _obj2;
                    }
                }
            }
        });
        var changedObjKeys = fn(changedObjects);
        var changesKeys = fn(changes);
        if (changesKeys /__prop#_2214__  == 0 && changedObjKeys /__prop#_2215__  == 0) return { state: state };else {
            Object /__prop#_2216__ (result, state);
            
            changesKeys /__prop#_2217__ (function (key) {
                if (del && changes[key] === SymbolDelete) delete result[key];else result[key] = changes[key];
            });
            changedObjKeys /__prop#_2218__ (function (key) {
                result[key] = changedObjects[key] /__prop#_2219__ ;
                changes[key] = changedObjects[key] /__prop#_2220__ ;
            });
            return { state: result, changes: changes };
        }
    }
    return recusion(state, source);
}
exports /__prop#_2221__  = mergeState;
;









var merge = function merge(a, b) {
    var opts = arguments /__prop#_2222__  > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return mergeState(a, b, opts) /__prop#_2223__ ;
};
exports /__prop#_2224__  = merge;
merge /__prop#_2225__  = function (state, obj2merge) {
    var options = arguments /__prop#_2226__  > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (obj2merge /__prop#_2227__  == 0) return state; 
    else return obj2merge /__prop#_2228__ (function (prev, next) {
            return merge(prev, next, options);
        }, state); 
};
function isObject(val) {
    return isMergeableObject(val) && !isArr(val);
}
function isMergeableObject(val) {
    var nonNullObject = val && (typeof val ===  /__string#_309__  ?  /__string#_310__  : _typeof2(val)) ===  /__string#_771__ ;
    return nonNullObject && Object /__prop#_2229__ .toString /__prop#_2230__ (val) !==  /__string#_772__  && Object /__prop#_2231__ .toString /__prop#_2232__ (val) !==  /__string#_773__ ;
}



var utils = {};
utils /__prop#_2233__  = function (state, path) {
    return getIn(state, string2path(path));
};
utils /__prop#_2234__  = isEqual;
utils /__prop#_2235__  = merge;
utils /__prop#_2236__  = getValue;
utils /__prop#_2237__  = makePathItem;
utils /__prop#_2238__  = string2path;
utils /__prop#_2239__  = getSchemaPart;
function getByKey(obj, keys) {
    var value = arguments /__prop#_2240__  > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (!isArr(keys)) keys = [keys];
    for (var i = 0; i < keys /__prop#_2241__ ; i++) {
        if (keys[i] ==  /__string#_774__ ) continue;
        if (!obj /__prop#_2242__ (keys[i])) obj[keys[i]] = i == keys /__prop#_2243__  - 1 ? value : {};
        obj = obj[keys[i]];
    }
    return obj;
}
function path2string(path, keyPath) {
    if (!isArr(path)) {
        keyPath = path /__prop#_2244__ ;
        path = path /__prop#_2245__ ;
    }
    return (keyPath ? path /__prop#_2246__ ( /__string#_775__ , keyPath) : path) /__prop#_2247__ ( /__string#_776__ ); 
}
function string2path(str) {
    var relativePath = arguments /__prop#_2248__  > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    var delimiter = arguments /__prop#_2249__  > 2 && arguments[2] !== undefined ? arguments[2] :  /__string#_777__ ;

    str = str /__prop#_2250__ (/\/+/g,  /__string#_778__ );
    var res = str /__prop#_2251__ ( /__string#_779__ );
    if (res[0] ===  /__string#_780__  || res[0] ==  /__string#_781__ ) {
        if (relativePath) res = relativePath /__prop#_2252__ (res);
    }
    if (res[0] ===  /__string#_782__ ) res[0] =  /__string#_783__ ;
    var tmp = [];
    for (var i = 0; i < res /__prop#_2253__ ; i++) {
        var val = res[i];
        if (val ===  /__string#_784__ ) tmp /__prop#_2254__ ();else if (val !==  /__string#_785__  && val !==  /__string#_786__ ) tmp /__prop#_2255__ (val);
    }
    res = tmp;
    
    var a = res /__prop#_2256__ (delimiter);
    if (~a) res[a] = SymData;
    return res;
}
exports /__prop#_2257__  = string2path;


























function makeUpdateItem(path) {
    var value = void 0,
        keyPath = void 0,
        updateItem = void 0;
    if ((arguments /__prop#_2258__  <= 1 ? 0 : arguments /__prop#_2259__  - 1) == 1) value = arguments /__prop#_2260__  <= 1 ? undefined : arguments[1];
    if ((arguments /__prop#_2261__  <= 1 ? 0 : arguments /__prop#_2262__  - 1) == 2) {
        keyPath = arguments /__prop#_2263__  <= 1 ? undefined : arguments[1];
        value = arguments /__prop#_2264__  <= 2 ? undefined : arguments[2];
    }
    updateItem = makePathItem(path);
    if (keyPath) updateItem /__prop#_2265__  = isArr(keyPath) ? keyPath : string2path(keyPath);
    updateItem /__prop#_2266__  = value;
    return updateItem;
}
function makePathItem(path) {
    var relativePath = arguments /__prop#_2267__  > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    var delimiter = arguments /__prop#_2268__  > 2 && arguments[2] !== undefined ? arguments[2] :  /__string#_787__ ;

    var pathItem = {};
    pathItem /__prop#_2269__  = function () {
        return path2string(this);
    };
    Object /__prop#_2270__ (pathItem,  /__string#_311__ , { enumerable: false });
    Object /__prop#_2271__ (pathItem,  /__string#_312__ , {
        get: function get() {
            return this /__prop#_2272__  ? this /__prop#_2273__ .concat(SymData, this /__prop#_2274__ ) : this /__prop#_2275__ ;
        },
        set: function set(path) {
            var a = path /__prop#_2276__ (SymData);
            if (a == -1) {
                this /__prop#_2277__  = path /__prop#_2278__ ();
                delete this /__prop#_2279__ ;
            } else {
                this /__prop#_2280__  = path /__prop#_2281__ (0, a);
                this /__prop#_2282__  = path /__prop#_2283__ (a + 1);
            }
        }
    });
    path = pathOrString2path(path, relativePath, delimiter);
    pathItem /__prop#_2284__  = path;
    return pathItem;
}
exports /__prop#_2285__  = makePathItem;
function pathOrString2path(path) {
    var basePath = arguments /__prop#_2286__  > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var delimiter = arguments /__prop#_2287__  > 2 && arguments[2] !== undefined ? arguments[2] :  /__string#_788__ ;

    if (typeof path ==  /__string#_789__ ) path = string2path(path, basePath, delimiter);
    return path;
}
function makeArrayOfPathItem(path) {
    var basePath = arguments /__prop#_2288__  > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var delimiter = arguments /__prop#_2289__  > 2 && arguments[2] !== undefined ? arguments[2] :  /__string#_790__ ;

    path = pathOrString2path(path, basePath, delimiter);
    var result = [[]];
    path /__prop#_2290__ (function (value) {
        var res = [];
        if (typeof value ==  /__string#_791__  || typeof value ==  /__string#_792__ ) {
            result /__prop#_2291__ (function (pathPart) {
                return value /__prop#_2292__ () /__prop#_2293__ ( /__string#_793__ ) /__prop#_2294__ (function (key) {
                    return res /__prop#_2295__ (pathPart /__prop#_2296__ (key));
                });
            });
        } else if ((typeof value ===  /__string#_313__  ?  /__string#_314__  : _typeof2(value)) ==  /__string#_794__ ) {
            result /__prop#_2297__ (function (pathPart) {
                return res /__prop#_2298__ (pathPart /__prop#_2299__ (value));
            });
        } else if (typeof value ==  /__string#_795__ ) {
            result /__prop#_2300__ (function (pathPart) {
                var tmp = value(pathPart);
                if (!isArr(tmp)) tmp = [tmp];
                tmp /__prop#_2301__ (function (tmpVal) {
                    return tmpVal === false ? false : tmpVal /__prop#_2302__ () /__prop#_2303__ ( /__string#_796__ ) /__prop#_2304__ (function (key) {
                        return res /__prop#_2305__ (pathPart /__prop#_2306__ (key));
                    });
                });
            });
        } else throw new Error( /__string#_797__ );
        result = res;
    });
    return result /__prop#_2307__ (function (path) {
        return makePathItem(path);
    });
}











function push2array(array) {
    for (var _len = arguments /__prop#_2308__ , vals = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        vals[_key - 1] = arguments[_key];
    }

    for (var i = 0; i < vals /__prop#_2309__ ; i++) {
        if (isArr(vals[i])) array /__prop#_2310__ .apply(array, _toConsumableArray(vals[i]));else array /__prop#_2311__ (vals[i]);
    }
    return array;
}
exports /__prop#_2312__  = push2array;
function object2PathValues(vals) {
    var options = arguments /__prop#_2313__  > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var track = arguments /__prop#_2314__  > 2 && arguments[2] !== undefined ? arguments[2] : [];

    var fn = options /__prop#_2315__  ? objKeysNSymb : objKeys;
    var check = options /__prop#_2316__  ? isObject : isMergeableObject;
    var result = [];
    fn(vals) /__prop#_2317__ (function (key) {
        var path = track /__prop#_2318__ (key);
        if (check(vals[key])) object2PathValues(vals[key], options, path) /__prop#_2319__ (function (item) {
            return result /__prop#_2320__ (item);
        }); 
        else result /__prop#_2321__ (push2array(path, vals[key]));
    });
    if (!result /__prop#_2322__ ) return [push2array(track /__prop#_2323__ (), {})]; 
    return result;
}
exports /__prop#_2324__  = object2PathValues;
function moveArrayElems(arr, from, to) {
    var length = arr /__prop#_2325__ ;
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

    for (var _len2 = arguments /__prop#_2326__ , pathValues = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        pathValues[_key2] = arguments[_key2];
    }

    var lastI = pathValues /__prop#_2327__  - 2;
    if (!lastI && isArr(pathValues[0]) && !pathValues[0] /__prop#_2328__ ) return pathValues[1];
    for (var i = 0; i < pathValues /__prop#_2329__  - 1; i++) {
        var _path3 = pathValues[i];
        if (!isArr(_path3)) _path3 = [_path3];
        for (var j = 0; j < _path3 /__prop#_2330__ ; j++) {
            if (_path3[j] ==  /__string#_798__ ) continue;
            obj[_path3[j]] = i == lastI && j == _path3 /__prop#_2331__  - 1 ? pathValues[pathValues /__prop#_2332__  - 1] : {};
            obj = obj[_path3[j]];
        }
    }
    return result;
}
exports /__prop#_2333__  = makeSlice;
function getIn(store, path) {
    if (path /__prop#_2334__  == 0 || store == undefined) return store;else if (path[0] ==  /__string#_799__ ) return getIn(store, path /__prop#_2335__ (1));else if (typeof path[0] ===  /__string#_800__ ) return getIn(store[path[0](store)], path /__prop#_2336__ (1));
    return getIn(store[path[0]], path /__prop#_2337__ (1));
}
exports /__prop#_2338__  = getIn;
;
function getSlice(store, path) {
    var track = arguments /__prop#_2339__  > 2 && arguments[2] !== undefined ? arguments[2] : [];

    return makeSlice(path, getIn(store, path));
}
function getAsObject(store, keyPath, fn, keyObject) {
    if (!fn) fn = function fn(x) {
        return x;
    };
    var type = store[SymData] /__prop#_2340__ .type;
    if (type ==  /__string#_801__  || type ==  /__string#_802__ ) {
        var _ret12 = function () {
            var result = type ==  /__string#_803__  ? [] : {};
            var keys = objKeys(keyObject && objKeys(keyObject) /__prop#_2341__  > 0 ? keyObject : store);
            if (type ==  /__string#_804__ ) {
                var idx = 0;
                var arrKeys = [];
                if (keyPath[1] ==  /__string#_805__  && keyPath[2]) idx = getIn(store, [SymbolData,  /__string#_806__ ,  /__string#_807__ , keyPath[2]]) || 0;else idx = getValue(getIn(store, [SymbolData,  /__string#_808__ ,  /__string#_809__ ]) || {}) || 0;
                var lengthChange = keyObject && getIn(keyObject, [SymData,  /__string#_810__ ,  /__string#_811__ ]);
                for (var i = 0; i < idx; i++) {
                    if (lengthChange || ~keys /__prop#_2342__ (i /__prop#_2343__ ())) arrKeys /__prop#_2344__ (i /__prop#_2345__ ());
                }keys = arrKeys;
                result /__prop#_2346__  = idx;
            }
            keys /__prop#_2347__ (function (key) {
                if (store[key]) result[key] = getBindedValue(getIn(store[key], [SymData,  /__string#_812__ ]),  /__string#_813__ ) ? Symbol /__prop#_2348__ ( /__string#_814__ ) : getAsObject(store[key], keyPath, fn, keyObject ? keyObject[key] : undefined);
            });
            return {
                v: result
            };
        }();

        if ((typeof _ret12 ===  /__string#_315__  ?  /__string#_316__  : _typeof2(_ret12)) ===  /__string#_317__ ) return _ret12 /__prop#_2349__ ;
    } else return fn(getIn(store, keyPath));
}
function getBindedValue(obj, valName) {
    return isUndefined(obj[valName +  /__string#_815__ ]) ? obj[valName] : obj[valName +  /__string#_816__ ];
}
function asNumber(value) {
    if (value ===  /__string#_318__ ) return undefined;
    if (/\ /__prop#_2350__ / /__prop#_2351__ (value)) return value; 
    if (/\.0$/ /__prop#_2352__ (value)) return value; 
    var n = Number(value);
    var valid = typeof n ===  /__string#_319__  && !Number /__prop#_2353__ (n);
    if (/\.\d*0$/ /__prop#_2354__ (value)) return value; 
    return valid ? n : value;
}
function without(obj) {
    for (var _len3 = arguments /__prop#_2355__ , rest = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        rest[_key3 - 2] = arguments[_key3];
    }

    var symbol = arguments /__prop#_2356__  > 1 && arguments[1] !== undefined ? arguments[1] : false;

    
    var result = isArr(obj) ? [] : {};
    var fn = symbol ? objKeys : objKeysNSymb;
    fn(obj) /__prop#_2357__ (function (key) {
        if (!~rest /__prop#_2358__ (key)) result[key] = obj[key];
    });
    return result;
}
;
function split(test, obj) {
    var symbol = arguments /__prop#_2359__  > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var passed = {};
    var wrong = {};
    var fn = symbol ? objKeys : objKeysNSymb;
    fn(obj) /__prop#_2360__ (function (key) {
        var val = obj[key];
        if (test(key, val)) passed[key] = val;else wrong[key] = val;
    });
    return [passed, wrong];
}
;
function map(fnc, obj) {
    var symbol = arguments /__prop#_2361__  > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var result = {};
    var fn = symbol ? objKeys : objKeysNSymb;
    fn(obj) /__prop#_2362__ (function (key) {
        return result[key] = fnc(obj[key]);
    });
    return result;
}
;
function mapKeys(fnc, obj) {
    var symbol = arguments /__prop#_2363__  > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var result = {};
    var fn = symbol ? objKeys : objKeysNSymb;
    fn(obj) /__prop#_2364__ (function (key) {
        return result[fnc(key)] = obj[key];
    });
    return result;
}
;
var _typeof = typeof Symbol ===  /__string#_320__  && _typeof2(Symbol /__prop#_2365__ ) ===  /__string#_321__  ? function (obj) {
    return typeof obj ===  /__string#_322__  ?  /__string#_323__  : _typeof2(obj);
} : function (obj) {
    return obj && typeof Symbol ===  /__string#_324__  && obj /__prop#_2366__  === Symbol ?  /__string#_325__  : typeof obj ===  /__string#_326__  ?  /__string#_327__  : _typeof2(obj);
};

function is(x, y) {
    
    if (x === y) {
        
        return x !== 0 || 1 / x === 1 / y;
    } else {
        
        return x !== x && y !== y;
    }
}
function isEqual(objA, objB) {
    var options = arguments /__prop#_2367__  > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (is(objA, objB)) return true;
    if ((isUndefined(objA) ?  /__string#_817__  : _typeof(objA)) !==  /__string#_818__  || objA === null || (isUndefined(objB) ?  /__string#_819__  : _typeof(objB)) !==  /__string#_820__  || objB === null) return false;
    var fn = options /__prop#_2368__  ? objKeysNSymb : objKeys;
    var keysA = fn(objA);
    var keysB = fn(objB);
    if (keysA /__prop#_2369__  !== keysB /__prop#_2370__ ) return false;
    var _options$skipKeys = options /__prop#_2371__ ,
        skipKeys = _options$skipKeys === undefined ? [] : _options$skipKeys,
        _options$deepKeys = options /__prop#_2372__ ,
        deepKeys = _options$deepKeys === undefined ? [] : _options$deepKeys;

    for (var i = 0; i < keysA /__prop#_2373__ ; i++) {
        if (~skipKeys /__prop#_2374__ (keysA[i])) continue; 
        if (options /__prop#_2375__  || ~deepKeys /__prop#_2376__ (keysA[i])) {
            var result = isEqual(objA[keysA[i]], objB[keysA[i]], options);
            if (!result) return false;
        } else if (!objB /__prop#_2377__ (keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
            return false;
        }
    }
    return true;
}
exports /__prop#_2378__  = isEqual;
function not(val) {
    return !val;
}
exports /__prop#_2379__  = not;
function getValue(values) {
    var type = arguments /__prop#_2380__  > 1 && arguments[1] !== undefined ? arguments[1] :  /__string#_821__ ;

    var types = [ /__string#_822__ ,  /__string#_823__ ,  /__string#_824__ ];
    for (var i = types /__prop#_2381__ (type); i < 3; i++) {
        
        if (values[types[i]] !== undefined) return values[types[i]];
    }
    return undefined;
}
exports /__prop#_2382__  = getValue;
function getMaxValue(values) {
    return Math /__prop#_2383__ (values /__stringProp#_75__  || 0, values /__stringProp#_76__  || 0, values /__stringProp#_77__  || 0);
}
function replaceDeep(obj, value) {
    if (!isMergeableObject(obj)) return value;
    var result = isArr(obj) ? [] : {};
    objKeys(obj) /__prop#_2384__ (function (field) {
        return result[field] = replaceDeep(obj[field], value);
    });
    return result;
}































































































































