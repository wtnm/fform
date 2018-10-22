const expect = require('expect');
const formFuncs = require('../src/core/core.tsx');
const commonFuncs = require('../src/core/commonLib.tsx');
const stateFuncs = require('../src/core/stateLib.tsx');
const apiFuncs = require('../src/core/api.tsx');
const {createStore, combineReducers, applyMiddleware} = require('redux');
const thunk = require('redux-thunk').default;
// const djv = require('djv');

const SymbolData = Symbol.for('FFormData');
const RawValuesKeys = ['current', 'inital', 'default'];


function sleep(time) {return new Promise((resolve) => setTimeout(() => resolve(), time))}

describe('FForm comommon functions tests', function () {

  it('test delIn', function () {
    let state = {vr: {t1: 1, t2: 2, t3: {r1: 5, r2: undefined}}, vr_1: 1};
    let result = commonFuncs.delIn(state, ['vr', 't3', 'r4']);
    expect(result).toBe(state);
    result = commonFuncs.delIn(state, ['vr', 't3', 'r2']);
    expect(result !== state).toBe(true);
    expect(commonFuncs.isEqual(result, {"vr": {"t1": 1, "t2": 2, "t3": {"r1": 5}}, "vr_1": 1}, {deep: true})).toBe(true);
    result = commonFuncs.delIn(state, ['vr', 't3', 'r1,r2,r6']);
    expect(result !== state).toBe(true);
    expect(commonFuncs.isEqual(result, {"vr": {"t1": 1, "t2": 2, "t3": {}}, "vr_1": 1}, {deep: true})).toBe(true);
    result = commonFuncs.delIn(state, ['vr', 't2,t3']);
    expect(result !== state).toBe(true);
    expect(commonFuncs.isEqual(result, {"vr": {"t1": 1}, "vr_1": 1}, {deep: true})).toBe(true);
  });

  it('test mergeState', function () {

    let obj = {sm: 3, val: {a: 1, b: {c: 1}}};
    // this.object.test.Undefined = Symbol.for('FFormDelete');
    // this.object.test.EmptyObject = {};
    // this.object.test.EmptyArray = [];

    let result = commonFuncs.mergeState({val: [1, 2, 3, 4]}, {val: {1: 5}});
    expect(commonFuncs.isEqual(result.state.val, {1: 5})).toBeTruthy();

    result = commonFuncs.merge({a: [[1]]}, {a: [[2, 3]]});
    expect(commonFuncs.isEqual(result, {a: [[2, 3]]}, {deep: true})).toBeTruthy();

    result = commonFuncs.mergeState({val: [1, 2, 3, 4]}, {val: {1: 5}}, {arrays: 'merge'});
    expect(commonFuncs.isEqual(result.state.val, [1, 5, 3, 4])).toBeTruthy();

    result = commonFuncs.mergeState({val: [1, 2, 3, 4]}, {val: {length: 1}});
    expect(commonFuncs.isEqual(result.state.val, [1])).toBeTruthy();

    let replaceObj = {a: {b: {c: 1}}, d: 5};
    let obj2replace = {d: 2};
    result = commonFuncs.mergeState(replaceObj, {a: {b: obj2replace}}, {replace: {a: {b: true}}});
    // console.log(result.state.a.b)
    expect(result.state.a.b === obj2replace).toBeTruthy();
    expect(result.state.d === 5).toBeTruthy();
    expect(result.state.a.b.c === undefined).toBeTruthy();

    result = commonFuncs.mergeState(replaceObj, obj2replace, {replace: true});
    expect(result.state === obj2replace).toBeTruthy();

    result = commonFuncs.mergeState(replaceObj, {a: {}});
    expect(result.state === replaceObj).toBeTruthy();

    result = commonFuncs.mergeState(obj, {val: undefined}, {del: true});
    expect(result.changes).toBeTruthy();
    expect(result.state).not.toEqual(obj);
    expect(result.state.hasOwnProperty('val')).toBeFalsy();
    expect(result.changes.val).toBe(undefined);

    result = commonFuncs.merge(obj, {val: undefined});
    expect(result.val).toBe(undefined);

    result = commonFuncs.mergeState({val: [1, 2, 3, 4]}, {val: [3, 4, 5]});
    expect(commonFuncs.isEqual(result.state.val, [3, 4, 5])).toBeTruthy();

    result = commonFuncs.merge.all(obj, [{val: undefined}, {val: {b: {c: 1}}}], {del: true});
    expect(obj.val.b.c).toEqual(result.val.b.c);
    expect(result.val.hasOwnProperty('a')).toBeFalsy();

    result = commonFuncs.mergeState(obj, result, {diff: true, del: true});
    expect(obj.val.b).toEqual(result.state.val.b);
    expect(result.state.val.hasOwnProperty('a')).toBeFalsy();
    expect(result.changes.val.a).toBe(undefined);

    result = commonFuncs.mergeState({a: 1}, {b: 2}, {diff: true});
    expect(commonFuncs.isEqual(result.state, {b: 2})).toBeTruthy();
    expect(commonFuncs.isEqual(result.changes, {a: undefined, b: 2})).toBeTruthy();

    result = commonFuncs.mergeState([1, 2, 3, 4], [3, 4, 5], {arrays: 'merge'});
    expect(commonFuncs.isEqual(result.state, [3, 4, 5])).toBeTruthy();

    result = commonFuncs.mergeState([1, 2, 3, 4], {0: 3, 1: 4, 2: 5});
    expect(commonFuncs.isEqual(result.state, [3, 4, 5, 4])).toBeTruthy();

    result = commonFuncs.mergeState({val: [1, 2, 3, 4]}, {val: []});
    expect(commonFuncs.isEqual(result.state.val, [])).toBeTruthy();

    let arr = [1, 2, 3, 4];
    result = commonFuncs.mergeState({val: arr}, {val: [3, 4, 5]}, {arrays: 'concat'});
    expect(commonFuncs.isEqual(result.state.val, [1, 2, 3, 4, 3, 4, 5])).toBeTruthy();
    expect(result.state.val !== arr).toBeTruthy();

    let newArr = {val: []};
    newArr.val.length = 3;
    newArr.val[1] = 8;
    result = commonFuncs.mergeState({val: arr}, newArr, {arrays: 'merge'});
    expect(commonFuncs.isEqual(result.state.val, [1, 8, 3])).toBeTruthy();
    expect(result.state.val).not.toEqual(arr);

    obj = {
      "array_1": [],
      "array_2": [[{"v1": 1, "v2": 2}, {"t1": 4, "t2": 5}]]
    };
    result = commonFuncs.mergeState(undefined, obj, {del: true, arrays: 'merge'});
    expect(commonFuncs.isEqual(result.state, obj, {deep: true})).toBeTruthy();

    let arr2 = [];
    result = commonFuncs.mergeState(obj, {array_1: arr2});
    expect(result.state !== obj).toBeTruthy();
    expect(result.state.array_1 === arr2).toBeTruthy();

    result = commonFuncs.mergeState(obj, {array_1: []}, {arrays: 'merge'});
    expect(result.state === obj).toBeTruthy();

    // result = commonFuncs.mergeState(obj, {array_1: []});
    // expect(result.state === obj).toBeTruthy();

    result = commonFuncs.mergeState(obj, {array_1: []}, {arrays: 'concat'});
    expect(result.state === obj).toBeTruthy();

    // let values = {"array_1": [[{"v1": 1, "v2": 2}, {"t1": 4, "t2": 5}]]};
    // let values2 = {"array_1": [[{"v11": 31, "v22": 12}, {"t12": 43, "t22": 15}]]};
    // let replace = {"array_1": {"0": {"0": true}}};
  });


});

describe('FForm state functions tests', function () {
  it('test makeStateBranch, makeStateFromSchema', function () {  // stateData.state.objLevel_1.objLevel_2.array_1[0][0].bazinga[Symbol.for('FFormData')]
    let stateData = stateFuncs.makeStateFromSchema(require('./schema').default);
    let state = stateData.state;
    expect(state.objLevel_1.objLevel_2.array_1[Symbol.for('FFormData')].array.lengths.default === 0).toBe(true);
    stateData = stateFuncs.makeStateFromSchema(require('./schema').default);
    expect(state === stateData.state).toBe(true);
    let array_1_00 = stateFuncs.makeStateBranch(require('./schema').default, ['objLevel_1', 'objLevel_2', 'array_1', 0, 0]);
    expect(array_1_00.defaultValues.bazinga === 'array level 1 default').toBe(true);
    expect(array_1_00.state.bazinga[Symbol.for('FFormData')].values.default === 'bazinga default').toBe(true);

    let array_1_10 = stateFuncs.makeStateBranch(require('./schema').default, ['objLevel_1', 'objLevel_2', 'array_1', 1, 0]);
    expect(array_1_10.defaultValues.bazinga === 'array level 2 bazinga default 0').toBe(true);
    expect(array_1_10.state.bazinga[Symbol.for('FFormData')].values.default === 'bazinga default').toBe(true);
    expect(array_1_10.defaultValues.bazingaCinema.favBook === 'array level 1 default 1 0').toBe(true);
    expect(array_1_10.state.bazingaCinema.favBook[Symbol.for('FFormData')].values.default === 'favBook default').toBe(true);
    expect(array_1_10.defaultValues.bazingaCinema.favCinema === 'favCinema default').toBe(true);
    expect(array_1_10.state.bazingaCinema.favCinema[Symbol.for('FFormData')].values.default === 'favCinema default').toBe(true);
  });


  it('test makeRelativePath', function () {
    let res = stateFuncs.makeRelativePath(['1', '2', '3'], ['1', '2', '5', '6']);
    expect(commonFuncs.isEqual(res, ['..', '5', '6'])).toBe(true);
    res = stateFuncs.makeRelativePath(['1', '2', '3', '4'], ['1', '1', '3']);
    expect(commonFuncs.isEqual(res, ['..', '..', '..', '1', '3'])).toBe(true);
  });


  it('test flattenObject getKeyMapFromSchema', function () {
    let testObject = JSON.parse(JSON.stringify(require('./schema.json')));
    let mapData = stateFuncs.getKeyMapFromSchema(testObject);
    // console.log(mapData);
    let flatDataObj = {
      "array_1": [
        [{"favBook": "favBook 0 0"}, {"favBook": "favBook 0 1"}, {"favBook": "favBook 0 2"}],
        [{"favBook": "favBook 1 0"}, {"favBook": "favBook 1 1"}, {"favBook": "favBook 1 2"}],
        [{"favBook": "favBook 2 0"}, {"favBook": "favBook 2 1"}, {"favBook": "favBook 2 2"}],
        [{"favBook": "favBook 3 0"}, {"favBook": "favBook 3 1"}, {"favBook": "favBook 3 2"}]
      ],
      "movies": {"mc_favBook": "mcf 0"},
      "color_cinema_favBook": "ccf 1"
    };

    let unflatDataObj = {
      'objLevel_1': {
        'objLevel_2': {
          'array_1': [
            [{bazingaCinema: {'favBook': 'favBook 0 0'}}, {bazingaCinema: {'favBook': 'favBook 0 1'}}, {bazingaCinema: {'favBook': 'favBook 0 2'}}],
            [{bazingaCinema: {'favBook': 'favBook 1 0'}}, {bazingaCinema: {'favBook': 'favBook 1 1'}}, {bazingaCinema: {'favBook': 'favBook 1 2'}}],
            [{bazingaCinema: {'favBook': 'favBook 2 0'}}, {bazingaCinema: {'favBook': 'favBook 2 1'}}, {bazingaCinema: {'favBook': 'favBook 2 2'}}],
            [{bazingaCinema: {'favBook': 'favBook 3 0'}}, {bazingaCinema: {'favBook': 'favBook 3 1'}}, {bazingaCinema: {'favBook': 'favBook 3 2'}}],
          ]
        }
      },
      'movies': {'cinema': {'favBook': 'mcf 0'}},
      'color': {'cinema': {'favBook': 'ccf 1'}},
    };
    let flatObj = mapData.flatten(unflatDataObj);
    expect(commonFuncs.isEqual(flatObj, flatDataObj));
    let unflatObj = mapData.unflatten(flatDataObj);
    expect(commonFuncs.isEqual(unflatObj, unflatDataObj));
  });


  it('test getKeyMapFromSchema', function () {
    let testObject = JSON.parse(JSON.stringify(require('./schema.json')));
    let mapData = stateFuncs.getKeyMapFromSchema(testObject);
    // console.log(mapData);
    let keys1 = mapData.path2key(['color', 'cinema', 'favBook']);
    let keys2 = mapData.path2key(['movies', 'cinema', 'favBook']);
    let path1 = mapData.key2path('color_cinema_favBook');
    let path2 = mapData.key2path(['movies', 'mc_favBook']);
    let path3 = mapData.key2path(['array_1', '3', '2', 'favBook']);
    let keys3 = mapData.path2key(["objLevel_1", "objLevel_2", "array_1", "3", "2", "bazingaCinema", "favBook"]);
    expect(commonFuncs.isEqual(keys1, ['color_cinema_favBook'])).toBeTruthy();
    expect(commonFuncs.isEqual(keys2, ['movies', 'mc_favBook'])).toBeTruthy();
    expect(commonFuncs.isEqual(keys3, ['array_1', '3', '2', 'favBook'])).toBeTruthy();
    expect(commonFuncs.isEqual(path1, ['color', 'cinema', 'favBook'])).toBeTruthy();
    expect(commonFuncs.isEqual(path2, ['movies', 'cinema', 'favBook'])).toBeTruthy();
    expect(commonFuncs.isEqual(path3, ["objLevel_1", "objLevel_2", "array_1", "3", "2", "bazingaCinema", "favBook"])).toBeTruthy();
  });


  it('test makePathItem', function () {
    let res = stateFuncs.makePathItem('');
    expect(commonFuncs.isEqual(res.path, [])).toBe(true);
    expect(res.keyPath).toBe(undefined);
    res = stateFuncs.makePathItem('/');
    expect(commonFuncs.isEqual(res.path, [])).toBe(true);
    expect(res.keyPath).toBe(undefined);
    res = stateFuncs.makePathItem('/a');
    expect(commonFuncs.isEqual(res.path, ['a'])).toBe(true);
    expect(res.keyPath).toBe(undefined);
    res = stateFuncs.makePathItem('a');
    expect(commonFuncs.isEqual(res.path, ['a'])).toBe(true);
    expect(res.keyPath).toBe(undefined);
    res = stateFuncs.makePathItem('/a/');
    expect(commonFuncs.isEqual(res.path, ['a'])).toBe(true);
    expect(res.keyPath).toBe(undefined);
    res = stateFuncs.makePathItem('a/@/');
    expect(commonFuncs.isEqual(res.path, ['a'])).toBe(true);
    expect(commonFuncs.isEqual(res.keyPath, [])).toBe(true);
    res = stateFuncs.makePathItem('a/@');
    expect(commonFuncs.isEqual(res.path, ['a'])).toBe(true);
    expect(commonFuncs.isEqual(res.keyPath, [])).toBe(true);
    res = stateFuncs.makePathItem('/a/@/');
    expect(commonFuncs.isEqual(res.path, ['a'])).toBe(true);
    expect(commonFuncs.isEqual(res.keyPath, [])).toBe(true);
    res = stateFuncs.makePathItem('./a/@/', ['b']);
    expect(commonFuncs.isEqual(res.path, ['b', 'a'])).toBe(true);
    expect(commonFuncs.isEqual(res.keyPath, [])).toBe(true);
    res = stateFuncs.makePathItem('#/a/@/', ['b']);
    expect(commonFuncs.isEqual(res.path, ['#', 'a'])).toBe(true);
    expect(commonFuncs.isEqual(res.keyPath, [])).toBe(true);
    res = stateFuncs.makePathItem('/a/@/c', ['b']);
    expect(commonFuncs.isEqual(res.path, ['a'])).toBe(true);
    expect(commonFuncs.isEqual(res.keyPath, ['c'])).toBe(true);
  });


  it('test object2PathValues', function () {
    let res = commonFuncs.makeSlice(1, 2, [3]);

    let flatDataObj = {
      "array_1": [
        [{"favBook": "favBook 0 0"}, {"favBook": "favBook 0 1"}, {"favBook": "favBook 0 2"}],
        [{"favBook": "favBook 1 0"}, {"favBook": "favBook 1 1"}, {"favBook": "favBook 1 2"}],
        [{"favBook": "favBook 2 0"}, {"favBook": "favBook 2 1"}, {"favBook": "favBook 2 2"}],
        [{"favBook": "favBook 3 0"}, {"favBook": "favBook 3 1"}, {"favBook": "favBook 3 2"}]
      ],
      "movies": {"mc_favBook": "mcf 0"},
      "color_cinema_favBook": "ccf 1"
    };
    let items = stateFuncs.object2PathValues(flatDataObj);
    expect(items.length === 14).toBeTruthy();
    expect(items[0].length === 5).toBeTruthy();
    expect(items[12].length === 3).toBeTruthy();
    expect(items[13].length === 2).toBeTruthy();
    expect(items[12][2] === "mcf 0").toBeTruthy();
  });

});

describe('FForm api tests', function () {

  it('test getValueFromUpdateItemIfExists', function () {
    let result = apiFuncs.getValueFromUpdateItemIfExists(['array', 'lengths'], {keyPath: ['array'], value: {lengths: {current: 3}}});
    expect(result.current).toBe(3);
    result = apiFuncs.getValueFromUpdateItemIfExists(['none', 'lengths'], {keyPath: ['array'], value: {lengths: {current: 3}}});
    expect(result).toBe(undefined);
    result = apiFuncs.getValueFromUpdateItemIfExists(['array', 'lengths'], {keyPath: ['array', 'lengths'], value: {current: 5}});
    expect(result.current).toBe(5);
    result = apiFuncs.getValueFromUpdateItemIfExists(['array', 'lengths'], {keyPath: ['array'], value: {nope: {current: 3}}});
    expect(result).toBe(undefined);
    result = apiFuncs.getValueFromUpdateItemIfExists(['array', 'lengths'], {keyPath: ['array', 'lengths', 'current'], value: 7});
    expect(result.current).toBe(7);
    result = apiFuncs.getValueFromUpdateItemIfExists(['array', 'none'], {keyPath: ['array', 'lengths', 'current'], value: 7});
    expect(result).toBe(undefined);
  });

  it('test getFieldBlocks', function () {
    // let testObject = JSON.parse(JSON.stringify(require('./schema.json')));
    let basicMainOnChange = () => {};
    let directMainOnChange = () => {};
    let reverseMainOnChange = () => {};
    let mainWidget = () => {};
    let x = {'custom': {'Main': {widget: mainWidget, onChange: directMainOnChange, $onChange: reverseMainOnChange}}};
    let {result, chains} = formFuncs.getFieldBlocks('string:inlineTitle', formFuncs.basicObjects, {}, {'Main': {onChange: basicMainOnChange}}, {});

    expect(commonFuncs.isEqual(result['blocks'], {'Builder': true, 'Title': true, 'Body': true, 'Main': true, 'Message': true, 'GroupBlocks': true, 'ArrayItem': true, 'Autosize': false})).toBeTruthy();
    expect(commonFuncs.isEqual(chains['methods2chain'], ["onBlur", "onMouseOver", "onMouseEnter", "onMouseLeave", "onChange", "onSelect", "onClick", "onSubmit", "onFocus", "onUnload", "onLoad"])).toBeTruthy();
    expect(Object.keys(chains['widgets']).length > 5).toBeTruthy();

    expect(chains['funcs'].Main).toBeTruthy();
    expect(chains['funcs'].Main['onChange'].length === 2).toBeTruthy();
    expect(chains['funcs'].Main['onChange'][0] === basicMainOnChange).toBeTruthy();

    let res = formFuncs.getFieldBlocks(['string', 'inlineTitle'], formFuncs.basicObjects, x, {'Main': {onChange: basicMainOnChange}}, {});
    result = res.result;
    chains = res.chains;
    expect(chains['funcs'].Main['onChange'].length === 4).toBeTruthy();
    expect(chains['funcs'].Main['onChange'][0] === basicMainOnChange).toBeTruthy();
    expect(chains['funcs'].Main['onChange'][1] === reverseMainOnChange).toBeTruthy();
    expect(chains['funcs'].Main['onChange'][3] === directMainOnChange).toBeTruthy();
    expect(chains['widgets'].Main.length === 2).toBeTruthy();
    expect(chains['widgets'].Main[1] === mainWidget).toBeTruthy();
    expect(result.Main['onChange']).toBeTruthy();
    let fn = result['Main']['onChange'];
    expect(fn.name === 'bound directMainOnChange').toBeTruthy();

    res = formFuncs.getFieldBlocks(['radio', 'buttons'], formFuncs.basicObjects, {}, {'Main': {onChange: basicMainOnChange}}, {});
    result = res.result;
    chains = res.chains;
    expect(chains['funcs'].Main['onChange'].length === 1).toBeTruthy();
    expect(result.Main['onChange']).toBeTruthy();
  });


});

function test_getRawValuesChanges(store) {
  return () => {
    let curVals = {array_1: [[{v1: 1, v2: 2}, {t1: 4, t2: 5}]], array_2: [{value: 1, notExistValue: 1}]};
    let stateData = new formFuncs.FFormCore({name: 'test_getRawValuesChanges', schema: require('./schema3').default, current: curVals, store});
    let state = stateData.api.getState();
    const expectResult = {
      "current": {
        "array_1": [[{"v1": 1, "v2": 2}, {"t1": 4, "t2": 5}]],
        "array_2": [{"value": 1, "more_value": {"inner": "", "more_inner": undefined}}]
      },
      "inital": {"array_1": [], "array_2": []},
      "default": {"array_1": [], "array_2": []}
    };
    let opts = {SymbolDelete: Symbol.for('FFormDelete')};
    let result = apiFuncs.getRawValuesChanges({}, state, opts);
    let values = result.values;
    let replace = result.replace;
    // console.log(JSON.stringify(result, function (k, v) {if (v === undefined) { return null; }return v;}));
    // result = commonFuncs.merge({}, result2);
    expect(commonFuncs.isEqual(values, expectResult, {deep: true})).toBe(true);
    expect(commonFuncs.isEqual(replace, {array_1: {'0': {'0': true, '1': true}}}, {deep: true})).toBe(true);


    let mergeObj = {array_2: {0: {}}};
    mergeObj.array_2[0][SymbolData] = {smthng: {}};
    let oldState = state;
    state = commonFuncs.merge(state, mergeObj, {symbol: true});
    let values2 = apiFuncs.getRawValuesChanges(oldState, state, opts).values;
    // console.log(values2);
    values2 = commonFuncs.merge(values, values2, {arrays: 'merge'});
    expect(values === values2).toBe(true);

    oldState = state;
    mergeObj = {array_1: {0: {0: {}}}};
    mergeObj.array_1[0][0][SymbolData] = {values: {current: undefined, inital: undefined}};
    state = commonFuncs.merge(state, mergeObj, {symbol: true});
    mergeObj = {array_1: {0: {}}};
    mergeObj.array_1[SymbolData] = {array: {lengths: {inital: 1}}};
    mergeObj.array_1[0][SymbolData] = {array: {lengths: {inital: 1}}};
    state = commonFuncs.merge(state, mergeObj, {symbol: true});
    mergeObj = {array_1: {0: {0: {}}}};
    mergeObj.array_1[0][0][SymbolData] = {values: {current: {"v75": 55, "v22": 32}, inital: {"v15": 11, "v27": 23}}};
    state = commonFuncs.merge(state, mergeObj, {symbol: true});
    let result3 = apiFuncs.getRawValuesChanges(oldState, state);
    replace = {};
    RawValuesKeys.forEach(key => replace[key] = result3.replace);
    let values3 = commonFuncs.merge(values, result3.values, {replace, arrays: 'merge'});


    expectResult.current.array_1[0][0] = {"v75": 55, "v22": 32};
    expectResult.inital.array_1[0] = [];
    expectResult.inital.array_1[0][0] = {"v15": 11, "v27": 23};

    expect(commonFuncs.isEqual(values3, expectResult, {deep: true})).toBe(true);
  }
}

function test_omit_getValues(store) {
  return async function () {
    let stateData = new formFuncs.FFormCore({name: 'test_omit_getValues', store, schema: require('./schema').default});
    await stateData.promise;
    let state;
    let values = stateData.api.getValues({valueType: 'current', flatten: true});
    expect(commonFuncs.isEqual(Object.keys(values.array_1), ['0', '1'])).toBe(true);
    expect(values.array_1.length === 2).toBe(true);
    stateData.api.set('/objLevel_1/objLevel_2/array_1/0/@/controls/omit', true, {execute: true});
    values = stateData.api.getValues({valueType: 'current', flatten: true});
    expect(commonFuncs.isEqual(Object.keys(values.array_1), ['0', '1'])).toBe(true);
    expect(values.array_1[0]).toBe(undefined);
    expect(values.array_1.length === 2).toBe(true);
    stateData.api.set('/objLevel_1/objLevel_2/array_1/0/@/controls/omit', false, {execute: true});
    values = stateData.api.getValues({valueType: 'current', flatten: true});
    expect(commonFuncs.isEqual(Object.keys(values.array_1), ['0', '1'])).toBe(true);
    expect(values.array_1.length === 2).toBe(true);

    stateData.api.set('/movies/cinema/favBook/@/status/pristine', false, {execute: true});
    state = stateData.api.getState();
    expect(state.movies.cinema[Symbol.for('FFormData')].status.pristine).toBe(false);
    expect(state.movies[Symbol.for('FFormData')].status.pristine).toBe(false);
    stateData.api.set('/movies/cinema/favBook/@/controls/omit', true, {execute: true});
    state = stateData.api.getState();
    expect(state.movies.cinema[Symbol.for('FFormData')].status.pristine).toBe(true);
    expect(state.movies[Symbol.for('FFormData')].status.pristine).toBe(true);
    stateData.api.set('/movies/cinema/favBook/@/controls/omit', false, {execute: true});
    state = stateData.api.getState();
    expect(state.movies.cinema[Symbol.for('FFormData')].status.pristine).toBe(false);
    expect(state.movies[Symbol.for('FFormData')].status.pristine).toBe(false);

    stateData.api.showOnly('/movies/cinema/favBook', {execute: true, skipFields: ['mapfavMovie']});
    state = stateData.api.getState();
    expect(state.movies.cinema.favBook[Symbol.for('FFormData')].controls.hidden).not.toBeTruthy();
    expect(state.movies.cinema.favCinema[Symbol.for('FFormData')].controls.hidden).toBeTruthy();
    expect(!!state.movies.cinema.mapfavMovie[Symbol.for('FFormData')].controls.hidden).not.toBeTruthy();

    stateData.api.showOnly('/movies/cinema/favBook', {execute: true});
    state = stateData.api.getState();
    expect(state.movies.cinema.favBook[Symbol.for('FFormData')].controls.hidden).toBe(false);
    expect(state.movies.cinema.favCinema[Symbol.for('FFormData')].controls.hidden).toBe(true);
    expect(state.movies.cinema.mapfavMovie[Symbol.for('FFormData')].controls.hidden).toBe(true);
    stateData.api.showOnly('/movies/cinema/favBook,favCinema', {execute: true, skipFields: ['favCinema']});
    state = stateData.api.getState();
    expect(state.movies.cinema.favBook[Symbol.for('FFormData')].controls.hidden).toBe(false);
    expect(state.movies.cinema.favCinema[Symbol.for('FFormData')].controls.hidden).toBe(true);
    expect(state.movies.cinema.mapfavMovie[Symbol.for('FFormData')].controls.hidden).toBe(true);
    stateData.api.showOnly('/movies/cinema/favBook,favCinema', {execute: true, skipFields: ['notExists']});
    state = stateData.api.getState();
    expect(state.movies.cinema.favBook[Symbol.for('FFormData')].controls.hidden).toBe(false);
    expect(state.movies.cinema.favCinema[Symbol.for('FFormData')].controls.hidden).toBe(false);
    expect(state.movies.cinema.mapfavMovie[Symbol.for('FFormData')].controls.hidden).toBe(true);
    stateData.api.showOnly('/color,movies/cinema/favBook', {execute: true});
    state = stateData.api.getState();
    expect(state.movies.cinema.favBook[Symbol.for('FFormData')].controls.hidden).toBe(false);
    expect(state.movies.cinema.favCinema[Symbol.for('FFormData')].controls.hidden).toBe(true);
    expect(state.movies.cinema.mapfavMovie[Symbol.for('FFormData')].controls.hidden).toBe(true);
    expect(state.color.cinema.favBook[Symbol.for('FFormData')].controls.hidden).toBe(false);
    expect(state.color.cinema.favCinema[Symbol.for('FFormData')].controls.hidden).toBe(true);
    stateData.api.selectOnly('/movies/cinema/favBook', {execute: true});
    state = stateData.api.getState();
    expect(state.movies.cinema.favBook[Symbol.for('FFormData')].controls.hidden).toBe(false);
    expect(state.movies.cinema.favCinema[Symbol.for('FFormData')].controls.hidden).toBe(true);
    expect(state.movies.cinema.mapfavMovie[Symbol.for('FFormData')].controls.hidden).toBe(true);
    expect(state.movies.cinema.favBook[Symbol.for('FFormData')].controls.omit).toBe(false);
    expect(state.movies.cinema.favCinema[Symbol.for('FFormData')].controls.omit).toBe(true);
    expect(state.movies.cinema.mapfavMovie[Symbol.for('FFormData')].controls.omit).toBe(true);
  }
}

function test_api_setValues(store) {
  return async function () {
    let stateData = new formFuncs.FFormCore({name: 'test_api_setValues', store, schema: require('./schema').default});
    await stateData.promise.vAsync;
    let oldState = stateData.api.getState();
    stateData.api.set('/favMovie/@/values/current', 'test', {execute: true, noValidation: true});
    let state = stateData.api.getState();
    expect(state.favMovie[Symbol.for('FFormData')].values.current === 'test').toBe(true);

    stateData.api.set([], oldState, {execute: true, replace: true});
    state = stateData.api.getState();
    expect(commonFuncs.isEqual(state, oldState, {deep: true})).toBe(true);

    stateData.api.replaceState(oldState, {execute: true});
    state = stateData.api.getState();
    expect(state === oldState).toBe(true);
    let curVals = {moreNotExist: 3, array_1: [[{v1: 1, v2: 2}, {t1: 4, t2: 5}]]};
    let initVals = {notExist: {v1: 2}, array_1: [[{v5: 5, v2: 4}, {t5: 3, t2: 1}, {t7: 3, t1: 1}]], array_2: [{value: 1, notExistValue: 1}]};
    stateData = new formFuncs.FFormCore({name: 'test_api_setValues2', store, schema: require('./schema3').default, current: curVals, inital: initVals});
    await stateData.promise.vAsync;
    let current = stateData.api.getValues({valueType: 'current'});
    expect(commonFuncs.isEqual(current, {
      notExist: {v1: 2},
      moreNotExist: 3,
      array_1: [[{v1: 1, v2: 2}, {t1: 4, t2: 5}]],
      array_2: [{"value": 1, notExistValue: 1, "more_value": {"inner": "", "more_inner": undefined}}]
    }, {deep: true})).toBe(true);

    stateData.api.setValues({notExist: {v12: 4}, array_1: [[{v1: 1, v2: 2}, {t1: 4, t2: 5}]], array_2: [{"value": 1, notExistValue: 4, "more_value": {"inner": "", "more_inner": undefined}}]}, {valueType: 'current', execute: true});
    current = stateData.api.getValues({valueType: 'current'});
    expect(commonFuncs.isEqual(current, {notExist: {v12: 4}, array_1: [[{v1: 1, v2: 2}, {t1: 4, t2: 5}]], array_2: [{"value": 1, notExistValue: 4, "more_value": {"inner": "", "more_inner": undefined}}]}, {deep: true})).toBe(true);

    stateData.api.set('/array_1/0/0/@/values/current', {v5: 1, v22: 2}, {replace: true, execute: true});
    current = stateData.api.getValues({valueType: 'current'});
    expect(commonFuncs.isEqual(current, {notExist: {v12: 4}, array_1: [[{v5: 1, v22: 2}, {t1: 4, t2: 5}]], array_2: [{"value": 1, notExistValue: 4, "more_value": {"inner": "", "more_inner": undefined}}]}, {deep: true})).toBe(true);

    stateData.api.setValues({}, {valueType: 'current', execute: true});
    current = stateData.api.getValues({valueType: 'current'});
    expect(commonFuncs.isEqual(current, {array_1: [], array_2: [],}, {deep: true})).toBe(true);

    stateData.api.setValues({}, {valueType: 'inital', execute: true});
    stateData.api.setValues({}, {valueType: 'inital', execute: true});
    stateData.api.setValues({notExist: 1}, {valueType: 'current', execute: true});
    let inital = stateData.api.getValues({valueType: 'inital'});
    expect(commonFuncs.isEqual(inital, {array_1: [], array_2: [],}, {deep: true})).toBe(true);
    current = stateData.api.getValues({valueType: 'current'});
    expect(commonFuncs.isEqual(current, {notExist: 1, array_1: [], array_2: [],}, {deep: true})).toBe(true);
  }
}

function test_FFormCore_init(store) {
  return async function () {  // state.objLevel_1.objLevel_2.array_1[0][0].bazinga[Symbol.for('FFormData')]
    let flatDataInital = {
      "array_1": [
        [{"favBook": "inital favBook 0 0"}],
        [{"favBook": "inital favBook 1 0"}, {"favBook": "inital favBook 1 1"}, {"favBook": "inital favBook 1 2"}],
        [{"favBook": "inital favBook 2 0"}, {"favBook": "inital favBook 2 1"}, {"favBook": "inital favBook 2 2"}],
        [{"favBook": "inital favBook 3 0"}, {"favBook": "inital favBook 3 1"}, {"favBook": "inital favBook 3 2"}, {"favBook": "inital favBook 3 3"}, {"favBook": "inital favBook 3 4"}]
      ],
      "movies": {"mc_favBook": "def"},
      "color_cinema_favBook": "def"
    };
    let flatDataDefault = {
      "array_1": [
        [{"favBook": "default favBook 0 0"}, {"favBook": "default favBook 0 1"}, {"favBook": "default favBook 0 2"}, {"favBook": "default favBook 0 3"}, {"favBook": "default favBook 0 4"}],
      ]
    };
    let flatDataCurrent = {
      "array_1": [
        [{"favBook": "default favBook 0 0"}],
      ],
      "movies": {"mc_favCinema": "current"},
    };
    let stateData = new formFuncs.FFormCore({name: 'test_FFormCore_init', store, schema: require('./schema').default, opts: {flatValues: true}, current: flatDataCurrent, inital: flatDataInital, default: flatDataDefault});
    let state = stateData.api.getState();
    let initalVals = stateData.api.getValues({valueType: 'inital', flatten: true});
    let currentVals = stateData.api.getValues({valueType: 'current', flatten: true});
    let defaultVals = stateData.api.getValues({valueType: 'default', flatten: true});
    expect(state.objLevel_1.objLevel_2.array_1[0][4].bazingaCinema.favBook[Symbol.for('FFormData')].values.default === "default favBook 0 4").toBeTruthy();
    expect(state.objLevel_1.objLevel_2.array_1[0][0].bazingaCinema.favBook[Symbol.for('FFormData')].values.default === "default favBook 0 0").toBeTruthy();
    expect(state.objLevel_1.objLevel_2.array_1[0][0].bazingaCinema.favBook[Symbol.for('FFormData')].values.inital === "inital favBook 0 0").toBeTruthy();
    expect(state.objLevel_1.objLevel_2.array_1[2][2].bazingaCinema.favBook[Symbol.for('FFormData')].values.inital === "inital favBook 2 2").toBeTruthy();
    expect(state.objLevel_1.objLevel_2.array_1[3][4].bazingaCinema.favBook[Symbol.for('FFormData')].values.inital === "inital favBook 3 4").toBeTruthy();
    expect(state.color.cinema.favBook[Symbol.for('FFormData')].messages[0].textArray.length === 0).toBeTruthy();
    expect(state.color.cinema.favCinema[Symbol.for('FFormData')].messages[0].textArray.length === 1).toBeTruthy();
    expect(state.color.cinema.favCinema[Symbol.for('FFormData')].messages[1].textArray.length === 1).toBeTruthy();
    stateData.api.set('color/cinema/favCinema/@/values/current', 'test', {execute: true, noValidation: true});
    state = stateData.api.getState();
    expect(state.color.cinema.favCinema[Symbol.for('FFormData')].messages[0].textArray.length === 1).toBeTruthy();
    expect(state.color.cinema.favCinema[Symbol.for('FFormData')].messages[1].textArray.length === 1).toBeTruthy();
    stateData.api.set('color/cinema/favCinema/@/values/current', 'test', {execute: true});
    state = stateData.api.getState();
    expect(state.color.cinema.favCinema[Symbol.for('FFormData')].messages[0].textArray.length === 1).toBeTruthy();
    expect(state.color.cinema.favCinema[Symbol.for('FFormData')].messages[1].textArray.length === 1).toBeTruthy();
    await stateData.api.validate('color/cinema/favCinema').vAsync;
    state = stateData.api.getState();
    expect(state.color.cinema.favCinema[Symbol.for('FFormData')].messages[0].textArray.length === 0).toBeTruthy();
    expect(state.color.cinema.favCinema[Symbol.for('FFormData')].messages[1].textArray.length === 0).toBeTruthy();
  }
}

function test_recursivelySetItems(store) {
  return async function () {
    let curVals = {array_1: [[{v1: 1, v2: 2}, {t1: 4, t2: 5}]], array_2: []};
    let stateData = new formFuncs.FFormCore({opts: {keepEqualRawValues: true}, store, name: 'test_recursivelySetItems', schema: require('./schema3').default, current: curVals});
    await stateData.promise.vAsync;
    let current = stateData.api.getValues({valueType: 'current'});
    expect(commonFuncs.isEqual(current, curVals, {deep: true})).toBe(true);

    await stateData.api.setValues(curVals, {valueType: 'inital', execute: true}).vAsync;
    let inital = stateData.api.getValues({valueType: 'inital'});
    let state = stateData.api.getState();
    current = stateData.api.getValues({valueType: 'current'});
    expect(current === inital).toBe(true);
    expect(state[SymbolData].status.pristine).toBe(true);

    await stateData.api.arrayOps(['array_1', 0], 'add', {execute: true}).vAsync;
    current = stateData.api.getValues({valueType: 'current'});
    state = stateData.api.getState();
    let array_1 = [[{v1: 1, v2: 2}, {t1: 4, t2: 5}, undefined]];
    // array_1.length = 3;
    expect(commonFuncs.isEqual(current, {array_1, array_2: []}, {deep: true})).toBe(true);
    expect(state[SymbolData].status.pristine).toBe(false);

    await stateData.api.arrayItemOps(['array_1', 0, 2], 'del', {execute: true}).vAsync;
    current = stateData.api.getValues({valueType: 'current'});
    inital = stateData.api.getValues({valueType: 'inital'});
    state = stateData.api.getState();
    expect(commonFuncs.isEqual(current, {array_1: [[{v1: 1, v2: 2}, {t1: 4, t2: 5}]], array_2: []}, {deep: true})).toBe(true);
    expect(state[SymbolData].status.pristine).toBe(true);
    expect(current === inital).toBe(true);

    await stateData.api.arrayItemOps(['array_1', 0, 1], 'up', {execute: true}).vAsync;
    current = stateData.api.getValues({valueType: 'current'});
    inital = stateData.api.getValues({valueType: 'inital'});
    state = stateData.api.getState();
    expect(state[SymbolData].status.pristine).toBe(false);
    // console.log('current', current.array_1[0][0]);
    expect(commonFuncs.isEqual(current, {array_1: [[{t1: 4, t2: 5}, {v1: 1, v2: 2}]], array_2: []}, {deep: true})).toBe(true);
    expect(commonFuncs.isEqual(inital, {array_1: [[{v1: 1, v2: 2}, {t1: 4, t2: 5}]], array_2: []}, {deep: true})).toBe(true);
    expect(current !== inital).toBe(true);

    let newVals = {array_1: [], array_2: [{value: 1, more_value: {inner: 2, more_inner: undefined}}, {value: 4, more_value: {inner: 5, more_inner: undefined}}]};
    let newDefaultVals = {array_1: []};
    await stateData.api.setValues(newVals, {valueType: 'current', execute: true}).vAsync;
    await stateData.api.setValues(newDefaultVals, {valueType: 'default', execute: true}).vAsync;
    current = stateData.api.getValues({valueType: 'current'});
    let defaultVal = stateData.api.getValues({valueType: 'default'});
    expect(current === newVals).toBe(true);
    expect(defaultVal !== newDefaultVals).toBe(true);

    await stateData.api.setValues({array_1: [[{t5: 4, t7: 5}, {v5: 1, v7: 2}]], array_2: []}, {valueType: 'inital', execute: true}).vAsync;
    inital = stateData.api.getValues({valueType: 'inital'});
    // console.log(inital);
    expect(commonFuncs.isEqual(inital, {array_1: [[{t5: 4, t7: 5}, {v5: 1, v7: 2}]], array_2: []}, {deep: true})).toBe(true);

    newVals.array_1 = [];
    await stateData.api.setValues(newVals, {valueType: 'current', execute: true}).vAsync;
    current = stateData.api.getValues({valueType: 'current'});
    expect(commonFuncs.isEqual(current, {
      array_1: [],
      array_2: [{"value": 1, "more_value": {"inner": 2, "more_inner": undefined}}, {"value": 4, "more_value": {"inner": 5, "more_inner": undefined}}]
    }, {deep: true})).toBe(true);

    await stateData.api.arrayOps(['array_1'], 'add', {num: 1, values: [[{t4: 1}, {t5: 5}]], execute: true}).vAsync;
    current = stateData.api.getValues({valueType: 'current'});
    expect(commonFuncs.isEqual(current, {
      array_1: [[{t4: 1}, {t5: 5}]],
      array_2: [{"value": 1, "more_value": {"inner": 2, "more_inner": undefined}}, {"value": 4, "more_value": {"inner": 5, "more_inner": undefined}}]
    }, {deep: true})).toBe(true);

    await stateData.api.arrayOps(['array_1', 0], 'add', {num: 2, values: [{t8: 81}, {t45: 45}], execute: true}).vAsync;
    current = stateData.api.getValues({valueType: 'current'});
    expect(commonFuncs.isEqual(current, {
      array_1: [[{t4: 1}, {t5: 5}, {t8: 81}, {t45: 45}]],
      array_2: [{"value": 1, "more_value": {"inner": 2, "more_inner": undefined}}, {"value": 4, "more_value": {"inner": 5, "more_inner": undefined}}]
    }, {deep: true})).toBe(true);

    let moreStateData = new formFuncs.FFormCore({opts: {keepEqualRawValues: true,  flatValues: true}, store, name: 'test_recursivelySetItems2', schema: require('./schema3').default});
    current = moreStateData.api.getValues({valueType: 'current'});
    inital = moreStateData.api.getValues({valueType: 'inital'});
    defaultVal = moreStateData.api.getValues({valueType: 'default'});

    expect(commonFuncs.isEqual(current, {array_1: [], array_2: []}, {deep: true})).toBe(true);

    expect(commonFuncs.isEqual(inital, {array_1: [], array_2: []}, {deep: true})).toBe(true);
    expect(commonFuncs.isEqual(defaultVal, {array_1: [], array_2: []}, {deep: true})).toBe(true);

    await moreStateData.api.arrayOps(['array_1'], 'add', {execute: true}).vAsync;
    current = moreStateData.api.getValues({valueType: 'current'});
    array_1 = [];
    array_1.length = 1;
    // console.log('current', current);
    expect(commonFuncs.isEqual(current, {array_1: [[]], array_2: []}, {deep: true})).toBe(true);

    await moreStateData.api.arrayOps(['array_1', 0], 'add', {execute: true}).vAsync;
    current = moreStateData.api.getValues({valueType: 'current'});
    array_1[0] = [undefined];
    array_1[0].length = 1;
    expect(commonFuncs.isEqual(current, {array_1, array_2: []}, {deep: true})).toBe(true);

    await moreStateData.api.arrayItemOps(['array_1', 0], 'del', {execute: true}).vAsync;
    current = moreStateData.api.getValues({valueType: 'current'});
    inital = moreStateData.api.getValues({valueType: 'inital'});
    expect(commonFuncs.isEqual(current, {array_1: [], array_2: []}, {deep: true})).toBe(true);
    expect(commonFuncs.isEqual(inital, {array_1: [], array_2: []}, {deep: true})).toBe(true);
    // expect(current === inital).toBe(true);

    await moreStateData.api.arrayOps(['array_2'], 'add', {num: 1}).vAsync;
    await moreStateData.api.arrayOps(['array_2'], 'add', {num: 1}).vAsync;
    await moreStateData.api.set('/array_2/1/more_value/more_inner/@/values/current', 'more_inner 2', {execute: true}).vAsync;
    current = moreStateData.api.getValues({valueType: 'current', flatten: true});
    expect(commonFuncs.isEqual(current, {array_1: [], array_2: [{value: undefined, inner: '', "more_inner": undefined}, {value: undefined, inner: '', more_inner: 'more_inner 2'}]}, {deep: true})).toBe(true);

    await moreStateData.api.setValues(current, {valueType: 'inital', flatten: true, execute: true}).vAsync;
    current = moreStateData.api.getValues({valueType: 'current'});
    inital = moreStateData.api.getValues({valueType: 'inital'});
    state = moreStateData.api.getState();
    expect(state[SymbolData].status.pristine).toBe(true);
    expect(current === inital).toBe(true);

    await moreStateData.api.arrayOps(['array_2'], 'add', {num: -10, execute: true}).vAsync;
    current = moreStateData.api.getValues({valueType: 'current'});
    expect(commonFuncs.isEqual(current, {array_1: [], array_2: []}, {deep: true})).toBe(true);

  }
}

function test_deffered_execution(store) {
  return async function () {
    let curVals = {array_1: [[{v1: 1, v2: 2}, {t1: 4, t2: 5}]], array_2: []};
    let stateData = new formFuncs.FFormCore({name: 'test_deffered_execution', store, schema: require('./schema3').default, current: curVals});
    await stateData.promise.vAsync;
    let promises = stateData.api.arrayItemOps(['array_1', 0, 1], 'up', {execute: 25});
    expect(commonFuncs.isEqual(stateData.api.getValues({valueType: 'current'}), {array_1: [[{v1: 1, v2: 2}, {t1: 4, t2: 5}]], array_2: []}, {deep: true})).toBe(true);
    await sleep(50);
    expect(commonFuncs.isEqual(stateData.api.getValues({valueType: 'current'}), {array_1: [[{t1: 4, t2: 5}, {v1: 1, v2: 2}]], array_2: []}, {deep: true})).toBe(true);

    promises = stateData.api.arrayItemOps(['array_1', 0, 1], 'up', {execute: 25});
    expect(commonFuncs.isEqual(stateData.api.getValues({valueType: 'current'}), {array_1: [[{t1: 4, t2: 5}, {v1: 1, v2: 2}]], array_2: []}, {deep: true})).toBe(true);
    await promises;
    expect(commonFuncs.isEqual(stateData.api.getValues({valueType: 'current'}), {array_1: [[{v1: 1, v2: 2}, {t1: 4, t2: 5}]], array_2: []}, {deep: true})).toBe(true);

    promises = stateData.api.arrayItemOps(['array_1', 0, 1], 'up', {execute: 25});
    expect(commonFuncs.isEqual(stateData.api.getValues({valueType: 'current'}), {array_1: [[{v1: 1, v2: 2}, {t1: 4, t2: 5}]], array_2: []}, {deep: true})).toBe(true);
    stateData.api.execute({execute: 0});  // cancel deffered execution
    await sleep(50);
    expect(commonFuncs.isEqual(stateData.api.getValues({valueType: 'current'}), {array_1: [[{v1: 1, v2: 2}, {t1: 4, t2: 5}]], array_2: []}, {deep: true})).toBe(true);
    let newPromises = stateData.api.execute({execute: true});
    expect(newPromises).toBe(promises); // test that promises are the same object
    expect(commonFuncs.isEqual(stateData.api.getValues({valueType: 'current'}), {array_1: [[{t1: 4, t2: 5}, {v1: 1, v2: 2}]], array_2: []}, {deep: true})).toBe(true);

    promises = stateData.api.arrayItemOps(['array_1', 0, 1], 'up', {execute: 25});
    expect(newPromises !== promises).toBe(true);
    stateData.api.set('array_1/0/0/@/values/current/v1', 55, {execute: 25});
    await promises;
    let state = stateData.api.getState();
    expect(commonFuncs.isEqual(stateData.api.getValues({valueType: 'current'}), {array_1: [[{v1: 55, v2: 2}, {t1: 4, t2: 5}]], array_2: []}, {deep: true})).toBe(true);

    stateData.api.set('array_1/0/0/@/values/current/v1', 5, {execute: 25});
    let items = stateData.api.set('array_1/0/0/@/values/current/v1', 5, {execute: true, returnItems: true});
    expect(items.length).toBe(2);
    items = stateData.api.execute({execute: true, returnItems: true});
    expect(items.length).toBe(0);
  }
}

function test_async_validation(store) {
  return async function () {  // state.objLevel_1.objLevel_2.array_1[0][0].bazinga[Symbol.for('FFormData')]

    let stateData = new formFuncs.FFormCore({name: 'test_async_validation', store, schema: require('./schema').default});
    let state = stateData.api.getState();
    expect(state.movies.cinema[Symbol.for('FFormData')].messages[1].textArray.length === 1).toBeTruthy();
    expect(state.movies.cinema.favCinema[Symbol.for('FFormData')].messages[1].textArray.length === 1).toBeTruthy();
    expect(state.movies.favMovie[Symbol.for('FFormData')].messages[1].textArray.length === 1).toBeTruthy();
    expect(state.color.cinema.favCinema[Symbol.for('FFormData')].messages[1].textArray.length === 1).toBeTruthy();
    expect(state.color.cinema.favBook[Symbol.for('FFormData')].messages[0].textArray.length === 1).toBeTruthy();
    expect(state.mapFavBook[Symbol.for('FFormData')].messages[3] === undefined).toBeTruthy();
    await stateData.promise.vAsync;  // state.movies.cinema[Symbol.for('FFormData')]
    state = stateData.api.getState();
    expect(state.movies.cinema[Symbol.for('FFormData')].messages[2].textArray.length === 1).toBeTruthy();
    expect(state.mapFavBook[Symbol.for('FFormData')].messages[3].textArray.length === 1).toBeTruthy();
    let flatDataObj = {
      "array_1": [
        [{"favBook": "inital 0 0"}],
        [{"favBook": "inital 1 0"}, {"favBook": "inital 1 1"}, {"favBook": "inital 1 2"}],
        [{"favBook": "inital 2 0"}, {"favBook": "inital 2 1"}, {"favBook": "inital 2 2"}],
        [{"favBook": "inital 3 0"}, {"favBook": "inital 3 1"}, {"favBook": "favBook 3 2"}]
      ],
      "movies": {"mc_favCinema": "inital mc_favCinema", "mc_favBook": "inital movies_cinema_favBook"},
      "color_cinema_favBook": "inital color_cinema_favBook",
      "color_cinema_favCinema": "inital color_cinema_favCinema",
    };

    let actualValues_1 = stateData.api.getValues({valueType: 'current', flatten: true});
    let promise = stateData.api.setValues(flatDataObj, {valueType: 'inital', execute: true, flatten: true});
    state = stateData.api.getState();
    let defaultValues = stateData.api.getValues({valueType: 'default', flatten: true});
    let initalValues = stateData.api.getValues({valueType: 'inital', flatten: true});
    // console.log(initalValues);
    let actualValues_2 = stateData.api.getValues({valueType: 'current', flatten: true});
    expect(actualValues_1.array_1.length === 2).toBeTruthy();
    expect(actualValues_2.array_1.length === 2).toBeTruthy();
    expect(defaultValues.array_1.length === 2).toBeTruthy();
    expect(initalValues.array_1.length === 4).toBeTruthy();
    expect(state.objLevel_1.objLevel_2.array_1[0][0] !== undefined).toBeTruthy();
    expect(state.objLevel_1.objLevel_2.array_1[0][1] !== undefined).toBeTruthy();
    expect(state.objLevel_1.objLevel_2.array_1[1][1] !== undefined).toBeTruthy();
    expect(state.mapFavBook[Symbol.for('FFormData')].values.inital === 'inital movies_cinema_favBook').toBeTruthy();

    expect(state.color.cinema.favCinema[Symbol.for('FFormData')].messages[0].textArray.length === 1).toBeTruthy();
    expect(state.color.cinema.favBook[Symbol.for('FFormData')].messages[0].textArray.length === 1).toBeTruthy();
    expect(state.movies.cinema[Symbol.for('FFormData')].messages[0].textArray.length === 0).toBeTruthy();
    expect(state.mapFavBook[Symbol.for('FFormData')].messages[3].textArray.length === 1).toBeTruthy();
    await promise.vAsync;
    expect(state.movies.cinema[Symbol.for('FFormData')].messages[0].textArray.length === 0).toBeTruthy();
    expect(state.mapFavBook[Symbol.for('FFormData')].messages[3].textArray.length === 1).toBeTruthy();
    stateData.api.set('objLevel_1/@/switch/params/_liveValidate', true, {execute: true});
    state = stateData.api.getState();

    // expect(state.objLevel_1.objLevel_2[Symbol.for('FFormData')].params._liveValidate).toBe(true);
    // expect(state.objLevel_1.objLevel_2.array_1[Symbol.for('FFormData')].params._liveValidate).toBe(true);
    // expect(state.objLevel_1.objLevel_2.array_1[0][Symbol.for('FFormData')].params._liveValidate).toBe(true);
    // expect(state.objLevel_1.objLevel_2.array_1[0][0][Symbol.for('FFormData')].params._liveValidate).toBe(true);
    expect(state.objLevel_1.favMovie2[Symbol.for('FFormData')].params._liveValidate).toBe(true);
    expect(state.objLevel_1.objLevel_2.array_1[1][0].bazingaCinema.favBook[Symbol.for('FFormData')].params._liveValidate).toBe(true);
    expect(state.objLevel_1.objLevel_2.array_1[0][2].bazingaCinema.favBook[Symbol.for('FFormData')].params._liveValidate).toBe(true);

    stateData.api.set('objLevel_1/objLevel_2/@/switch/params/_liveValidate', false, {execute: true});
    state = stateData.api.getState();
    // expect(state.objLevel_1.objLevel_2[Symbol.for('FFormData')].params._liveValidate).toBe(false);
    // expect(state.objLevel_1.objLevel_2.array_1[Symbol.for('FFormData')].params._liveValidate).toBe(false);
    // expect(state.objLevel_1.objLevel_2.array_1[0][Symbol.for('FFormData')].params._liveValidate).toBe(false);
    // expect(state.objLevel_1.objLevel_2.array_1[0][0][Symbol.for('FFormData')].params._liveValidate).toBe(false);
    expect(state.objLevel_1.favMovie2[Symbol.for('FFormData')].params._liveValidate).toBe(true);
    expect(state.objLevel_1.objLevel_2.array_1[1][0].bazingaCinema.favBook[Symbol.for('FFormData')].params._liveValidate).toBe(false);
    expect(state.objLevel_1.objLevel_2.array_1[0][2].bazingaCinema.favBook[Symbol.for('FFormData')].params._liveValidate).toBe(false);

    stateData.api.set('objLevel_1/objLevel_2/@/status/pristine', false, {execute: true});
    state = stateData.api.getState();
    expect(state.objLevel_1[Symbol.for('FFormData')].status.pristine).toBe(false);
    expect(state.objLevel_1.objLevel_2[Symbol.for('FFormData')].status.pristine).toBe(false);
    stateData.api.set('objLevel_1/objLevel_2/@/status/pristine', true, {execute: true});
    state = stateData.api.getState();
    expect(state.objLevel_1[Symbol.for('FFormData')].status.pristine).toBe(true);
    expect(state.objLevel_1.objLevel_2[Symbol.for('FFormData')].status.pristine).toBe(true);
    // stateData.api.set('objLevel_1/objLevel_2/@/status/pristine', null);
    // state = stateData.api.getState();
    // expect(state.objLevel_1[Symbol.for('FFormData')].status.pristine).toBe(null);
    // expect(state.objLevel_1.objLevel_2[Symbol.for('FFormData')].status.pristine).toBe(null);
    stateData.api.set('objLevel_1/objLevel_2/@/status/pristine', true, {execute: true});
    state = stateData.api.getState();
    expect(state.objLevel_1[Symbol.for('FFormData')].status.pristine).toBe(true);
    expect(state.objLevel_1.objLevel_2[Symbol.for('FFormData')].status.pristine).toBe(true);
    // console.log(stateData)
  }
}

describe('FForm core tests with redux', function () {
  const formReducer = apiFuncs.formReducer;
  const rootReducer = combineReducers({fforms: formReducer()});
  const store = createStore(rootReducer, applyMiddleware(thunk));

  it('test getRawValuesChanges with redux', test_getRawValuesChanges(store));
  
  it('test omit with getValues and recalculation', test_omit_getValues(store));

  it('test api.set api.setValues', test_api_setValues(store));

  it('test FFormCore init and force validate', test_FFormCore_init(store));

  it('test recursivelySetItems', test_recursivelySetItems(store));

  it('test deffered execution', test_deffered_execution(store));

  it('test FFormCore async validation', test_async_validation(store));
  
});

describe('FForm core tests', function () {

  it('test getRawValuesChanges', test_getRawValuesChanges());

  it('test omit with getValues and recalculation', test_omit_getValues());

  it('test api.set api.setValues', test_api_setValues());

  it('test FFormCore init and force validate', test_FFormCore_init());

  it('test recursivelySetItems', test_recursivelySetItems());

  it('test deffered execution', test_deffered_execution());

  it('test FFormCore async validation', test_async_validation());


});
