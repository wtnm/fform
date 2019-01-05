// set env variable to the `tsconfig.json` path before loading mocha (default: './tsconfig.json')

process.env.TS_NODE_PROJECT = './tsconfig.json';

// Optional: set env variable to enable `tsconfig-paths` integration
// process.env.TS_CONFIG_PATHS = true;

// register mocha wrapper
require('ts-mocha');

const expect = require('expect');
const formFuncs = require('../src/core/components.tsx');
const commonFuncs = require('../src/core/commonLib.tsx');
const stateFuncs = require('../src/core/stateLib.tsx');
const apiFuncs = require('../src/core/api.tsx');
const {createStore, combineReducers, applyMiddleware} = require('redux');
const thunk = require('redux-thunk').default;
// const djv = require('djv');

const SymData = Symbol.for('FFormData');
const SymReset = Symbol.for('FFormReset'); // TODO: Reset tests
// const RawValuesKeys = ['current', 'inital', 'default'];
const SymDataMapTree = Symbol.for('FFormDataMapTree');
const SymDataMap = Symbol.for('FFormDataMap');

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

  it('test hasIn', function () {
    let state = {vr: {t1: undefined, t2: 2, t3: {r1: 5, r2: undefined}}, vr_1: 1};
    let result = commonFuncs.hasIn(state, ['vr', 't3', 'r2']);
    expect(result).toBe(true);
    result = commonFuncs.hasIn(state, ['vr', 't3', 'r3']);
    expect(result).toBe(false);
    result = commonFuncs.hasIn(state, ['vr', 't3']);
    expect(result).toBe(true);
    result = commonFuncs.hasIn(state, ['t1', 't3']);
    expect(result).toBe(false);
  });

  it('test setIn', function () {
    let state = {vr: 1};
    let result = commonFuncs.setIn(state, 1, ['vr', 't3', 'r2']);
    expect(commonFuncs.hasIn(result, ['vr', 't3', 'r2'])).toBe(true);
    expect(state === result).toBe(true);
    expect(commonFuncs.getIn(state, ['vr', 't3', 'r2'])).toBe(1);
    result = commonFuncs.setIn(state, 2, 'vr', 't2');
    expect(commonFuncs.getIn(state, ['vr', 't3', 'r2'])).toBe(1);
    expect(commonFuncs.getIn(state, ['vr', 't2'])).toBe(2);
    expect(state === result).toBe(true);
    result = commonFuncs.setIn(state, 1, []);
    expect(result).toBe(1);
  });

  it('test makeSlice', function () {
    let result = commonFuncs.makeSlice(1);
    expect(result).toBe(1);
    result = commonFuncs.makeSlice(1, 2);
    expect(result[1]).toBe(2);
    result = commonFuncs.makeSlice(1, 2, [3]);
    expect(result[1][2][0]).toBe(3);
    result = commonFuncs.makeSlice(1, 2, [3], 4);
    expect(result[1][2][3]).toBe(4);
  });

  it('test mergeState', function () {

    let obj = {sm: 3, val: {a: 1, b: {c: 1}}};
    // this.object.test.Undefined = Symbol.for('FFormDelete');
    // this.object.test.EmptyObject = {};
    // this.object.test.EmptyArray = [];

    let result = commonFuncs.mergeState({val: [1, 2, 3, 4]}, {val: {1: 5}}, {arrays: 'replace'});
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
    result = commonFuncs.mergeState(obj, {array_1: arr2}, {arrays: 'replace'});
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
  const arraySchema = require('./schemaArray').default;
  it('test makeStateBranch, makeStateFromSchema', function () {  // stateData.state.objLevel_1.objLevel_2.array_1[0][0].bazinga[Symbol.for('FFormData')]

    let state = stateFuncs.makeStateFromSchema(arraySchema);
    expect(state[SymData].current.length).toBe(3);
    expect(state[SymData].current[0].length).toBe(2);
    expect(state[SymData].current[0][0].strValue).toBe('array level 1 objValue default 0');
    expect(state[SymData].current[0][0].arrValue[0]).toBe('array level 1 arrValue');
    expect(state[SymData].current[0][0].arrValue[1]).toBe('arrValue default');
    expect(state[SymData].current[0][0].arrValue.length).toBe(2);
    expect(state[SymData].current[2][0].turpleValue.length).toBe(3);
    expect(state[SymData].current[2][0].turpleValue[0]).toBe('turpleValue level 2 default');
    expect(state[SymData].current[2][0].turpleValue[1]).toBe(1);
    expect(state[SymData].current[2][0].turpleValue[2]).toBe(1);
    expect(state[SymData].current[1][0].turpleValue[1]).toBe(4);
    expect(state[SymData].current[1][0].turpleValue[2]).toBe(1);

    expect(state[1][0].arrValue[SymData].fData.canAdd).toBe(true);
    expect(state[1][0].turpleValue[SymData].fData.canAdd).toBe(false);

    expect(state[1][0].turpleValue[0][SymData].arrayItem.canUp).toBe(false);
    expect(state[1][0].turpleValue[1][SymData].arrayItem.canUp).toBe(false);
    expect(state[1][0].turpleValue[1][SymData].arrayItem.canDown).toBe(true);
    expect(state[1][0].turpleValue[2][SymData].arrayItem.canUp).toBe(true);
    expect(state[1][0].turpleValue[2][SymData].arrayItem.canDown).toBe(false);
    expect(state[1][0].turpleValue[2][SymData].arrayItem.canDel).toBe(true);
    expect(state[1][0].turpleValue[1][SymData].arrayItem.canDel).toBe(true);
    expect(state[1][0].turpleValue[0][SymData].arrayItem.canDel).toBe(false);

    expect(state[SymData].current[0][0].mapValue).toBe(state[SymData].current[0][0].strValue);
    expect(state[0][0].mapValue[SymData].value).toBe(state[0][0].strValue[SymData].value);
    expect(state[SymData].current[0][0].mapArrValue[0]).toBe(state[SymData].current[0][0].mapValue);
    expect(state[0][0].mapArrValue[0][SymData].value).toBe(state[0][0].mapValue[SymData].value);

    state = stateFuncs.makeStateFromSchema(require('./schema').default);
    expect(state.objLevel_1.objLevel_2.array_1[Symbol.for('FFormData')].length === 0).toBe(true);
    state = stateFuncs.makeStateFromSchema(require('./schema').default);
    expect(state === state).toBe(true);
    let array_1_00 = stateFuncs.makeStateBranch(require('./schema').default, stateFuncs.oneOfStructure({}, []), ['objLevel_1', 'objLevel_2', 'array_1', 0, 0]);
    expect(array_1_00.defaultValues.bazinga).toBe('bazinga default');
    expect(array_1_00.state.bazinga[Symbol.for('FFormData')].value === 'bazinga default').toBe(true);

    let array_1_10 = stateFuncs.makeStateBranch(require('./schema').default, stateFuncs.oneOfStructure({}, []), ['objLevel_1', 'objLevel_2', 'array_1', 1, 0], {bazinga: 'test value'});
    expect(array_1_10.defaultValues.bazinga === 'test value').toBe(true);
    expect(array_1_10.state.bazinga[Symbol.for('FFormData')].value === 'test value').toBe(true);
    expect(array_1_10.defaultValues.bazingaCinema.favBook === 'favBook default').toBe(true);
    expect(array_1_10.state.bazingaCinema.favBook[Symbol.for('FFormData')].value === 'favBook default').toBe(true);
    expect(array_1_10.defaultValues.bazingaCinema.favCinema === 'favCinema default').toBe(true);
    expect(array_1_10.state.bazingaCinema.favCinema[Symbol.for('FFormData')].value === 'favCinema default').toBe(true);
  });

  it('test updateStatePROCEDURE', function () {
    let state = stateFuncs.makeStateFromSchema(arraySchema);
    let UPDATABLE_object = {update: {}, replace: {}};
    let updateItem = {path: [0, 0, 'strValue', SymData, 'value'], value: '33'};
    expect(state[SymData].current[0][0].strValue).toBe('array level 1 objValue default 0');
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, updateItem);
    state = commonFuncs.merge(state, UPDATABLE_object.update, {replace: UPDATABLE_object.replace, arrays: 'merge'});
    expect(state[SymData].current[0][0].strValue).toBe(updateItem.value);
    expect(state[0][0].strValue[SymData].value).toBe(updateItem.value);
    expect(state[SymData].current[0][0].mapValue).toBe(state[SymData].current[0][0].strValue);
    expect(state[0][0].mapValue[SymData].value).toBe(state[0][0].strValue[SymData].value);
    expect(state[SymData].current[0][0].mapArrValue[0]).toBe(state[SymData].current[0][0].mapValue);
    expect(state[0][0].mapArrValue[0][SymData].value).toBe(state[0][0].mapValue[SymData].value);

    UPDATABLE_object = {update: {}, replace: {}};
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, {path: [0, 0, 'mapArrValue', SymData, 'length'], value: 3});
    state = commonFuncs.merge(state, UPDATABLE_object.update, {replace: UPDATABLE_object.replace, arrays: 'merge'});
    expect(state[SymData].current[0][0].mapArrValue[1]).toBe(state[SymData].current[0][0].mapValue);
    expect(state[0][0].mapArrValue[1][SymData].value).toBe(state[0][0].mapValue[SymData].value);
    expect(state[SymData].current[0][0].mapArrValue[2]).toBe(state[SymData].current[0][0].mapValue);
    expect(state[0][0].mapArrValue[2][SymData].value).toBe(state[0][0].mapValue[SymData].value);

    UPDATABLE_object = {update: {}, replace: {}};
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, {path: [0, 0, 'strValue', SymData, 'value'], value: '555'});
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, {path: [0, 0, 'mapArrValue', SymData, 'length'], value: 2});
    state = commonFuncs.merge(state, UPDATABLE_object.update, {replace: UPDATABLE_object.replace, arrays: 'merge'});
    expect(state[0][0].mapValue[SymDataMapTree].value[SymDataMap]['../mapArrValue/2/@/value']).not.toBeTruthy();
    expect(state[SymData].current[0][0].mapArrValue[0]).toBe('555');
    expect(state[0][0].mapArrValue[0][SymData].value).toBe('555');
    expect(state[SymData].current[0][0].mapArrValue[1]).toBe('555');
    expect(state[0][0].mapArrValue[1][SymData].value).toBe('555');
    expect(state[SymData].current[0][0].mapArrValue[2]).toBe(undefined);
    expect(state[0][0].mapArrValue[2]).toBe(undefined);

    UPDATABLE_object = {update: {}, replace: {}};
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, {path: [0, 0, 'strValue', SymData, 'value'], value: '777'});
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, {path: [0, 0, 'mapArrValue@length'], value: 3});
    state = commonFuncs.merge(state, UPDATABLE_object.update, {replace: UPDATABLE_object.replace, arrays: 'merge'});
    expect(state[SymData].current[0][0].mapArrValue[0]).toBe('777');
    expect(state[0][0].mapArrValue[0][SymData].value).toBe('777');
    expect(state[SymData].current[0][0].mapArrValue[1]).toBe('777');
    expect(state[0][0].mapArrValue[1][SymData].value).toBe('777');
    expect(state[SymData].current[0][0].mapArrValue[2]).toBe('777');
    expect(state[0][0].mapArrValue[2][SymData].value).toBe('777');


    UPDATABLE_object = {update: {}, replace: {}};
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, {path: '@length', value: 4});
    state = commonFuncs.merge(state, UPDATABLE_object.update, {replace: UPDATABLE_object.replace, arrays: 'merge'});
    expect(state[SymData].current[3][0].strValue).toBe('array level 2 objValue default');
    expect(state[3][0].strValue[SymData].value).toBe('array level 2 objValue default');

    UPDATABLE_object = {update: {}, replace: {}};
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, {path: '@length', value: 2});
    state = commonFuncs.merge(state, UPDATABLE_object.update, {replace: UPDATABLE_object.replace, arrays: 'merge'});
    expect(state[SymData].current[2]).toBe(undefined);
    expect(state[2]).toBe(undefined);
    expect(state[3]).toBe(undefined);

    UPDATABLE_object = {update: {}, replace: {}};
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, {path: '@current', value: {1: [{strValue: 'new test value'}]}});
    state = commonFuncs.merge(state, UPDATABLE_object.update, {replace: UPDATABLE_object.replace, arrays: 'merge'});
    expect(state[SymData].current[1][0].strValue).toBe('new test value');
    expect(state[SymData].current[1].length).toBe(1);
    expect(state[1][0].strValue[SymData].value).toBe('new test value');

  });

  it('test macros in updateStatePROCEDURE', function () {
    let state = stateFuncs.makeStateFromSchema(arraySchema);
    let UPDATABLE_object = {update: {}, replace: {}};
    expect(state[2][SymData].arrayItem.canDown).toBe(false);
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, {path: [], value: 1, macros: 'array'});
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, {path: [], value: 2, macros: 'array'});
    state = commonFuncs.merge(state, UPDATABLE_object.update, {replace: UPDATABLE_object.replace, arrays: 'merge'});
    expect(state[SymData].current.length).toBe(6);
    expect(state[2][SymData].arrayItem.canDown).toBe(true);
    expect(state[5][SymData].arrayItem.canDown).toBe(false);
    expect(state[SymData].fData.canAdd).toBe(false);


    UPDATABLE_object = {update: {}, replace: {}};
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, {path: [], value: -1, macros: 'array'});
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, {path: ['2'], op: 'del', macros: 'arrayItem'});
    state = commonFuncs.merge(state, UPDATABLE_object.update, {replace: UPDATABLE_object.replace, arrays: 'merge'});
    expect(state[SymData].current.length).toBe(4);
    expect(state[4]).toBe(undefined);
    expect(state[5]).toBe(undefined);
    expect(state[SymData].fData.canAdd).toBe(true);


    UPDATABLE_object = {update: {}, replace: {}};
    expect(state[SymData].current[2][0].strValue).toBe('array level 2 objValue default');
    expect(state[SymData].current[1][0].strValue).toBe('array level 1 objValue default 1');
    expect(state[SymData].current[0][0].strValue).toBe('array level 1 objValue default 0');
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, {path: [0, 0, 'arrValue', [1, '@value']], value: 'test arr 1 value'});
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, {path: [1], op: 'last', macros: 'arrayItem'});
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, {path: [1], op: 'del', macros: 'arrayItem'});
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, {path: [1], op: 'up', macros: 'arrayItem'});
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, {path: [1], op: 'last', macros: 'arrayItem'});
    state = commonFuncs.merge(state, UPDATABLE_object.update, {replace: UPDATABLE_object.replace, arrays: 'merge'});
    expect(state[SymData].current.length).toBe(3);
    expect(state[SymData].length).toBe(3);
    expect(state[SymData].current[0][0].strValue).toBe('array level 2 objValue default');
    expect(state[SymData].current[1][0].strValue).toBe('array level 1 objValue default 1');
    expect(state[SymData].current[2][0].strValue).toBe('array level 1 objValue default 0');
    expect(state[SymData].current[2][0].arrValue[0]).toBe('array level 1 arrValue');
    expect(state[SymData].current[2][0].arrValue[1]).toBe('test arr 1 value');

    UPDATABLE_object = {update: {}, replace: {}};
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, {path: [0, 0, 'strValue@status/invalid'], value: 5});
    state = commonFuncs.merge(state, UPDATABLE_object.update, {replace: UPDATABLE_object.replace, arrays: 'merge'});
    expect(state[SymData].status.invalid).toBe(0);

    UPDATABLE_object = {update: {}, replace: {}};
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, stateFuncs.makeNUpdate([0, 0, 'strValue'], ['status', 'invalid'], 5, false, {macros: 'setStatus'}));
    state = commonFuncs.merge(state, UPDATABLE_object.update, {replace: UPDATABLE_object.replace, arrays: 'merge'});
    expect(state[SymData].status.invalid).toBe(1);
    expect(state[0][SymData].status.invalid).toBe(1);
    expect(state[1][SymData].status.invalid).toBe(0);
    expect(state[0][0][SymData].status.invalid).toBe(1);
    expect(state[0][0].strValue[SymData].status.invalid).toBe(1);
    expect(state[SymData].status.valid).toBe(false);
    expect(state[0][SymData].status.valid).toBe(false);
    expect(state[1][SymData].status.valid).toBe(true);
    expect(state[0][0][SymData].status.valid).toBe(false);
    expect(state[0][0].strValue[SymData].status.valid).toBe(false);

    UPDATABLE_object = {update: {}, replace: {}};
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, stateFuncs.makeNUpdate([0, 1, 'strValue'], ['status', 'pending'], 5, false, {macros: 'setStatus'}));
    state = commonFuncs.merge(state, UPDATABLE_object.update, {replace: UPDATABLE_object.replace, arrays: 'merge'});
    expect(state[SymData].status.pending).toBe(1);
    expect(state[0][SymData].status.pending).toBe(1);
    expect(state[1][SymData].status.pending).toBe(0);
    expect(state[0][0][SymData].status.pending).toBe(0);
    expect(state[0][0].strValue[SymData].status.pending).toBe(0);
    expect(state[0][1][SymData].status.pending).toBe(1);
    expect(state[0][1].strValue[SymData].status.pending).toBe(1);
    expect(state[SymData].status.valid).toBe(null);
    expect(state[0][SymData].status.valid).toBe(null);
    expect(state[1][SymData].status.valid).toBe(true);
    expect(state[0][0][SymData].status.valid).toBe(false);
    expect(state[0][0].strValue[SymData].status.valid).toBe(false);
    expect(state[0][1][SymData].status.valid).toBe(null);
    expect(state[0][1].strValue[SymData].status.valid).toBe(null);


    UPDATABLE_object = {update: {}, replace: {}};
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, stateFuncs.makeNUpdate([0, 1, 'strValue'], ['status', 'pending'], -10, false, {macros: 'setStatus'}));
    state = commonFuncs.merge(state, UPDATABLE_object.update, {replace: UPDATABLE_object.replace, arrays: 'merge'});
    expect(state[SymData].status.pending).toBe(0);
    expect(state[0][SymData].status.pending).toBe(0);
    expect(state[1][SymData].status.pending).toBe(0);
    expect(state[0][0][SymData].status.pending).toBe(0);
    expect(state[0][0].strValue[SymData].status.pending).toBe(0);
    expect(state[0][1][SymData].status.pending).toBe(0);
    expect(state[0][1].strValue[SymData].status.pending).toBe(0);
    expect(state[SymData].status.valid).toBe(false);
    expect(state[0][SymData].status.valid).toBe(false);
    expect(state[1][SymData].status.valid).toBe(true);
    expect(state[0][1][SymData].status.valid).toBe(true);
    expect(state[0][1].strValue[SymData].status.valid).toBe(true);

    UPDATABLE_object = {update: {}, replace: {}};
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, stateFuncs.makeNUpdate([0, 0], ['status', 'validation', 'pending'], 3, false, {macros: 'setStatus'}));
    state = commonFuncs.merge(state, UPDATABLE_object.update, {replace: UPDATABLE_object.replace, arrays: 'merge'});
    expect(state[SymData].status.pending).toBe(1);
    expect(state[0][SymData].status.pending).toBe(1);
    expect(state[1][SymData].status.pending).toBe(0);
    expect(state[0][0][SymData].status.pending).toBe(1);
    expect(state[0][0].strValue[SymData].status.pending).toBe(0);
    expect(state[0][1][SymData].status.pending).toBe(0);
    expect(state[0][1].strValue[SymData].status.pending).toBe(0);
    expect(state[SymData].status.valid).toBe(null);
    expect(state[0][SymData].status.valid).toBe(null);
    expect(state[0][0][SymData].status.valid).toBe(null);
    expect(state[1][SymData].status.valid).toBe(true);
    expect(state[0][1][SymData].status.valid).toBe(true);
    expect(state[0][1].strValue[SymData].status.valid).toBe(true);


    UPDATABLE_object = {update: {}, replace: {}};
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, stateFuncs.makeNUpdate([0, 0], ['status', 'validation', 'pending'], 0, false, {macros: 'setStatus'}));
    state = commonFuncs.merge(state, UPDATABLE_object.update, {replace: UPDATABLE_object.replace, arrays: 'merge'});
    expect(state[SymData].status.pending).toBe(0);
    expect(state[0][SymData].status.pending).toBe(0);
    expect(state[1][SymData].status.pending).toBe(0);
    expect(state[0][0][SymData].status.pending).toBe(0);
    expect(state[0][0].strValue[SymData].status.pending).toBe(0);
    expect(state[0][1][SymData].status.pending).toBe(0);
    expect(state[0][1].strValue[SymData].status.pending).toBe(0);
    expect(state[SymData].status.valid).toBe(false);
    expect(state[0][SymData].status.valid).toBe(false);
    expect(state[1][SymData].status.valid).toBe(true);
    expect(state[0][1][SymData].status.valid).toBe(true);
    expect(state[0][1].strValue[SymData].status.valid).toBe(true);

    UPDATABLE_object = {update: {}, replace: {}};
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, stateFuncs.makeNUpdate([], ['status', 'invalid'], 0, false, {macros: 'switch'}));
    state = commonFuncs.merge(state, UPDATABLE_object.update, {replace: UPDATABLE_object.replace, arrays: 'merge'});
    expect(state[SymData].status.invalid).toBe(0);
    expect(state[0][SymData].status.invalid).toBe(0);
    expect(state[1][SymData].status.invalid).toBe(0);
    expect(state[0][0][SymData].status.invalid).toBe(0);
    expect(state[0][0].strValue[SymData].status.invalid).toBe(0);
    expect(state[SymData].status.valid).toBe(true);
    expect(state[0][SymData].status.valid).toBe(true);
    expect(state[1][SymData].status.valid).toBe(true);
    expect(state[0][0][SymData].status.valid).toBe(true);
    expect(state[0][0].strValue[SymData].status.valid).toBe(true);

    UPDATABLE_object = {update: {}, replace: {}};
    expect(state[0][1].arrValue[SymData].status.untouched).toBe(2);
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, stateFuncs.makeNUpdate([0, 1, 'arrValue', 0], ['status', 'untouched'], -2, false, {macros: 'setStatus'}));
    state = commonFuncs.merge(state, UPDATABLE_object.update, {replace: UPDATABLE_object.replace, arrays: 'merge'});
    expect(state[0][1].arrValue[SymData].status.untouched).toBe(1);
    expect(state[0][1].arrValue[0][SymData].status.untouched).toBe(0);
    expect(state[0][1].arrValue[1][SymData].status.untouched).toBe(1);

    UPDATABLE_object = {update: {}, replace: {}};
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, {path: [0, 1, 'arrValue'], value: 1, macros: 'array'});
    state = commonFuncs.merge(state, UPDATABLE_object.update, {replace: UPDATABLE_object.replace, arrays: 'merge'});
    expect(state[0][1].arrValue[SymData].status.untouched).toBe(2);
    expect(state[0][1].arrValue[0][SymData].status.untouched).toBe(0);
    expect(state[0][1].arrValue[1][SymData].status.untouched).toBe(1);
    expect(state[0][1].arrValue[2][SymData].status.untouched).toBe(1);

    UPDATABLE_object = {update: {}, replace: {}};
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, stateFuncs.makeNUpdate([0, 1, 'arrValue'], ['status', 'untouched'], 0, false, {macros: 'switch'}));
    state = commonFuncs.merge(state, UPDATABLE_object.update, {replace: UPDATABLE_object.replace, arrays: 'merge'});
    expect(state[0][1].arrValue[SymData].status.untouched).toBe(0);
    expect(state[0][1].arrValue[0][SymData].status.untouched).toBe(0);
    expect(state[0][1].arrValue[1][SymData].status.untouched).toBe(0);
    expect(state[0][1].arrValue[2][SymData].status.untouched).toBe(0);

    UPDATABLE_object = {update: {}, replace: {}};
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, {path: [0, 1, 'arrValue'], value: 1, macros: 'array'});
    state = commonFuncs.merge(state, UPDATABLE_object.update, {replace: UPDATABLE_object.replace, arrays: 'merge'});
    expect(state[0][1].arrValue[SymData].status.untouched).toBe(0);
    expect(state[0][1].arrValue[0][SymData].status.untouched).toBe(0);
    expect(state[0][1].arrValue[1][SymData].status.untouched).toBe(0);
    expect(state[0][1].arrValue[2][SymData].status.untouched).toBe(0);
    expect(state[0][1].arrValue[3][SymData].status.untouched).toBe(1);

    UPDATABLE_object = {update: {}, replace: {}};
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, {path: ['0/1/arrValue/0,2/@/params/hidden'], value: true});
    state = commonFuncs.merge(state, UPDATABLE_object.update, {replace: UPDATABLE_object.replace, arrays: 'merge'});
    expect(state[0][1].arrValue[0][SymData].params.hidden).toBe(true);
    expect(state[0][1].arrValue[1][SymData].params.hidden).toBe(undefined);
    expect(state[0][1].arrValue[2][SymData].params.hidden).toBe(true);
    expect(state[0][1].arrValue[3][SymData].params.hidden).toBe(undefined);

    UPDATABLE_object = {update: {}, replace: {}};
    //state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, {path: ['0/1/arrValue@/params/hidden'], value: null, macros: 'setAll', skipFields: ['3']});
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, {path: ['0/1/arrValue/*@/params/hidden'], value: null});
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, {path: ['0/1/arrValue/3@/params/hidden'], value: undefined});
    state = commonFuncs.merge(state, UPDATABLE_object.update, {replace: UPDATABLE_object.replace, arrays: 'merge'});
    expect(state[0][1].arrValue[0][SymData].params.hidden).toBe(null);
    expect(state[0][1].arrValue[1][SymData].params.hidden).toBe(null);
    expect(state[0][1].arrValue[2][SymData].params.hidden).toBe(null);
    expect(state[0][1].arrValue[3][SymData].params.hidden).toBe(undefined);


    UPDATABLE_object = {update: {}, replace: {}};
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, {path: ['0/1/*/@/params/hidden, disabled'], value: true});
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, {path: ['0/1/mapValue, arrValue/@/params/hidden, disabled'], value: undefined});
    state = commonFuncs.merge(state, UPDATABLE_object.update, {replace: UPDATABLE_object.replace, arrays: 'merge'});
    expect(state[0][1].arrValue[SymData].params.hidden).toBe(undefined);
    expect(state[0][1].strValue[SymData].params.hidden).toBe(true);
    expect(state[0][1].mapArrValue[SymData].params.hidden).toBe(true);
    expect(state[0][1].mapValue[SymData].params.hidden).toBe(undefined);
    expect(state[0][1].turpleValue[SymData].params.hidden).toBe(true);
    expect(state[0][1].arrValue[SymData].params.disabled).toBe(undefined);
    expect(state[0][1].strValue[SymData].params.disabled).toBe(true);
    expect(state[0][1].mapArrValue[SymData].params.disabled).toBe(true);
    expect(state[0][1].mapValue[SymData].params.disabled).toBe(undefined);
    expect(state[0][1].turpleValue[SymData].params.disabled).toBe(true);

    UPDATABLE_object = {update: {}, replace: {}};
    state = stateFuncs.updateStatePROCEDURE(state, arraySchema, UPDATABLE_object, {path: ['0/1/arrValue, turpleValue@params/hidden,disabled'], value: null});
    state = commonFuncs.merge(state, UPDATABLE_object.update, {replace: UPDATABLE_object.replace, arrays: 'merge'});
    expect(state[0][1].arrValue[SymData].params.hidden).toBe(null);
    expect(state[0][1].strValue[SymData].params.hidden).toBe(true);
    expect(state[0][1].mapArrValue[SymData].params.hidden).toBe(true);
    expect(state[0][1].mapValue[SymData].params.hidden).toBe(undefined);
    expect(state[0][1].turpleValue[SymData].params.hidden).toBe(null);
    expect(state[0][1].arrValue[SymData].params.disabled).toBe(null);
    expect(state[0][1].strValue[SymData].params.disabled).toBe(true);
    expect(state[0][1].mapArrValue[SymData].params.disabled).toBe(true);
    expect(state[0][1].mapValue[SymData].params.disabled).toBe(undefined);
    expect(state[0][1].turpleValue[SymData].params.disabled).toBe(null);
  });

  it('test relativePath', function () {
    let res = stateFuncs.relativePath(['1', '2', '3'], ['1', '2', '5', '6']);
    expect(commonFuncs.isEqual(res, ['..', '5', '6'])).toBe(true);
    res = stateFuncs.relativePath(['1', '2', '3', '4'], ['1', '1', '3']);
    expect(commonFuncs.isEqual(res, ['..', '..', '..', '1', '3'])).toBe(true);
    res = stateFuncs.relativePath(['1', '2'], ['1', '2', '5', '6']);
    expect(commonFuncs.isEqual(res, ['.', '5', '6'])).toBe(true);
  });


  it('test flattenObject getKeyMapFromSchema', function () {
    let testObject = require('./schema.js').default;
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
    let testObject = require('./schema.js').default;
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


  it('test string2NUpdate', function () {
    let res = stateFuncs.string2NUpdate('');
    expect(commonFuncs.isEqual(res.path, [])).toBe(true);
    expect(res[SymData].length).toBe(0);
    res = stateFuncs.string2NUpdate('/');
    expect(commonFuncs.isEqual(res.path, [])).toBe(true);
    expect(res[SymData].length).toBe(0);
    res = stateFuncs.string2NUpdate('/a');
    expect(commonFuncs.isEqual(res.path, ['a'])).toBe(true);
    expect(res[SymData].length).toBe(0);
    res = stateFuncs.string2NUpdate('a');
    expect(commonFuncs.isEqual(res.path, ['a'])).toBe(true);
    expect(res[SymData].length).toBe(0);
    res = stateFuncs.string2NUpdate('/a/');
    expect(commonFuncs.isEqual(res.path, ['a'])).toBe(true);
    expect(res[SymData].length).toBe(0);
    res = stateFuncs.string2NUpdate('a/@/');
    expect(commonFuncs.isEqual(res.path, ['a'])).toBe(true);
    expect(commonFuncs.isEqual(res[SymData], [])).toBe(true);
    res = stateFuncs.string2NUpdate('a/@');
    expect(commonFuncs.isEqual(res.path, ['a'])).toBe(true);
    expect(commonFuncs.isEqual(res[SymData], [])).toBe(true);
    res = stateFuncs.string2NUpdate('/a/@/');
    expect(commonFuncs.isEqual(res.path, ['a'])).toBe(true);
    expect(commonFuncs.isEqual(res[SymData], [])).toBe(true);
    res = stateFuncs.string2NUpdate('./a/@/', ['b']);
    expect(commonFuncs.isEqual(res.path, ['b', 'a'])).toBe(true);
    expect(commonFuncs.isEqual(res[SymData], [])).toBe(true);
    res = stateFuncs.string2NUpdate('#/a/@/', ['b']);
    expect(commonFuncs.isEqual(res.path, ['a'])).toBe(true);
    expect(commonFuncs.isEqual(res[SymData], [])).toBe(true);
    res = stateFuncs.string2NUpdate('#/a/#/@/c', ['b']);
    expect(commonFuncs.isEqual(res.path, ['a'])).toBe(true);
    expect(commonFuncs.isEqual(res[SymData], ['c'])).toBe(true);
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

  it('test getSchemaPart', function () {
    const schemaOneOf = require('./schemaOneOf').default;
    let state = stateFuncs.makeStateFromSchema(schemaOneOf);
    expect(state[SymData].oneOf).toBe(0);
    let UPDATABLE_object = {update: {}, replace: {}};
    state = stateFuncs.updateStatePROCEDURE(state, schemaOneOf, UPDATABLE_object, stateFuncs.makeNUpdate([], ['oneOf'], 1));
    state = stateFuncs.mergeStatePROCEDURE(state, UPDATABLE_object);
    expect(state[SymData].oneOf).toBe(1);
    expect(state[SymData].fData.type).toBe('string');

    state = stateFuncs.updateStatePROCEDURE(state, schemaOneOf, UPDATABLE_object, {path: '@current', value: 7});
    state = stateFuncs.mergeStatePROCEDURE(state, UPDATABLE_object);
    expect(state[SymData].oneOf).toBe(3);
    expect(state[SymData].value).toBe(7);
    expect(state[SymData].current).toBe(7);
    expect(state[SymData].fData.type).toBe('number');

    state = stateFuncs.updateStatePROCEDURE(state, schemaOneOf, UPDATABLE_object, {path: '@current', value: {objectTypeOneOfType: false}});
    state = stateFuncs.mergeStatePROCEDURE(state, UPDATABLE_object);
    expect(state[SymData].oneOf).toBe(4);
    expect(state[SymData].hasOwnProperty('value')).toBe(false);
    expect(state[SymData].current.objectTypeString).toBe('objectTypeString default');
    expect(state[SymData].fData.type).toBe('object');
    expect(state.objectTypeOneOfType[SymData].oneOf).toBe(1);
    expect(state.objectTypeOneOfType[SymData].fData.type).toBe('boolean');
    expect(state.objectTypeOneOfType[SymData].value).toBe(false);
    expect(state[SymData].current.objectTypeOneOfType).toBe(false);

    state = stateFuncs.updateStatePROCEDURE(state, schemaOneOf, UPDATABLE_object, {
      path: '@current', value: [{
        recusion: [
          {stringRecursiveValue: 'inner test string'},
          {stringRecursiveValue: 'another inner test string'},
          {stringRecursiveValue: 'more test string'},
          'stringType'
        ], stringRecursiveValue: 'test recursive string'
      },
        'top level string value'
      ]
    });
    state = stateFuncs.mergeStatePROCEDURE(state, UPDATABLE_object);
    expect(state[SymData].oneOf).toBe(0);
    expect(state[0][SymDataMapTree][SymData].length).toBe(1);
    expect(state[1][SymDataMapTree][SymData].length).toBe(2);
    expect(state[SymDataMapTree].length[SymDataMap]['./1/@/stringTypeMappedLength']).toBeTruthy();
    expect(state[SymDataMapTree].oneOf[SymDataMap]['./1/@/stringTypeMappedOneOf']).toBeTruthy();

    state = stateFuncs.updateStatePROCEDURE(state, schemaOneOf, UPDATABLE_object, {path: [1], op: 'up', value: 0, macros: 'arrayItem'});
    state = stateFuncs.mergeStatePROCEDURE(state, UPDATABLE_object);
    expect(state[SymDataMapTree].length[SymDataMap]['./1/@/stringTypeMappedLength']).not.toBeTruthy();
    expect(state[SymDataMapTree].oneOf[SymDataMap]['./1/@/stringTypeMappedOneOf']).not.toBeTruthy();
    expect(state[SymDataMapTree].length[SymDataMap]['./0/@/stringTypeMappedLength']).toBeTruthy();
    expect(state[SymDataMapTree].oneOf[SymDataMap]['./0/@/stringTypeMappedOneOf']).toBeTruthy();
  })
});

describe('FForm api tests', function () {

  it('test getFieldBlocks', function () {
    // let testObject = JSON.parse(JSON.stringify(require('./schema.js').default));
    return;
    let basicMainOnChange = () => {};
    let directMainOnChange = () => {};
    let reverseMainOnChange = () => {};
    let mainWidget = () => {};
    let schemaPart = {'ff_custom': {'Main': {widget: mainWidget, onChange: directMainOnChange, $onChange: reverseMainOnChange}}};
    let {result, chains} = formFuncs.getFieldBlocks('string:inlineTitle', formFuncs.fformObjects, {}, {'Main': {onChange: basicMainOnChange}}, {});

    expect(commonFuncs.isEqual(result['_blocks'], {'Builder': true, 'Title': true, 'Body': true, 'Main': true, 'Message': true, 'GroupBlocks': true, 'ArrayItem': true, 'Autosize': false})).toBeTruthy();
    expect(commonFuncs.isEqual(chains['methods2chain'], ["onBlur", "onMouseOver", "onMouseEnter", "onMouseLeave", "onChange", "onSelect", "onClick", "onSubmit", "onFocus", "onUnload", "onLoad"])).toBeTruthy();
    expect(Object.keys(chains['widgets']).length > 5).toBeTruthy();

    expect(chains['funcs'].Main).toBeTruthy();
    expect(chains['funcs'].Main['onChange'].length === 2).toBeTruthy();
    expect(chains['funcs'].Main['onChange'][0] === basicMainOnChange).toBeTruthy();

    let res = formFuncs.getFieldBlocks(['string', 'inlineTitle'], formFuncs.fformObjects, schemaPart, {'Main': {onChange: basicMainOnChange}}, {});
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

    res = formFuncs.getFieldBlocks(['radio', 'buttons'], formFuncs.fformObjects, {}, {'Main': {onChange: basicMainOnChange}}, {});
    result = res.result;
    chains = res.chains;
    expect(chains['funcs'].Main['onChange'].length === 1).toBeTruthy();
    expect(result.Main['onChange']).toBeTruthy();
  });

});

// function test_getRawValuesChanges(store) {
//   return () => {
//     let curVals = {array_1: [[{v1: 1, v2: 2}, {t1: 4, t2: 5}]], array_2: [{value: 1, notExistValue: 1}]};
//     let api = new formFuncs.FFormStateAPI({name: 'test_getRawValuesChanges', schema: require('./schema3').default, current: curVals, store});
//     let state = api.getState();
//     const expectResult = {
//       "current": {
//         "array_1": [[{"v1": 1, "v2": 2}, {"t1": 4, "t2": 5}]],
//         "array_2": [{"value": 1, "more_value": {"inner": "", "more_inner": undefined}}]
//       },
//       "inital": {"array_1": [], "array_2": []},
//       "default": {"array_1": [], "array_2": []}
//     };
//     let opts = {SymbolDelete: Symbol.for('FFormDelete')};
//     let result = apiFuncs.getRawValuesChanges({}, state, opts);
//     let values = result.values;
//     let replace = result.replace;
//     // console.log(JSON.stringify(result, function (k, v) {if (v === undefined) { return null; }return v;}));
//     // result = commonFuncs.merge({}, result2);
//     expect(commonFuncs.isEqual(values, expectResult, {deep: true})).toBe(true);
//     expect(commonFuncs.isEqual(replace, {array_1: {'0': {'0': true, '1': true}}}, {deep: true})).toBe(true);
//
//
//     let mergeObj = {array_2: {0: {}}};
//     mergeObj.array_2[0][SymData] = {smthng: {}};
//     let oldState = state;
//     state = commonFuncs.merge(state, mergeObj, {symbol: true});
//     let values2 = apiFuncs.getRawValuesChanges(oldState, state, opts).values;
//     // console.log(values2);
//     values2 = commonFuncs.merge(values, values2, {arrays: 'merge'});
//     expect(values === values2).toBe(true);
//
//     oldState = state;
//     mergeObj = {array_1: {0: {0: {}}}};
//     mergeObj.array_1[0][0][SymData] = {values: {current: undefined, inital: undefined}};
//     state = commonFuncs.merge(state, mergeObj, {symbol: true});
//     mergeObj = {array_1: {0: {}}};
//     mergeObj.array_1[SymData] = {array: {lengths: {inital: 1}}};
//     mergeObj.array_1[0][SymData] = {array: {lengths: {inital: 1}}};
//     state = commonFuncs.merge(state, mergeObj, {symbol: true});
//     mergeObj = {array_1: {0: {0: {}}}};
//     mergeObj.array_1[0][0][SymData] = {values: {current: {"v75": 55, "v22": 32}, inital: {"v15": 11, "v27": 23}}};
//     state = commonFuncs.merge(state, mergeObj, {symbol: true});
//     let result3 = apiFuncs.getRawValuesChanges(oldState, state);
//     replace = {};
//     RawValuesKeys.forEach(key => replace[key] = result3.replace);
//     let values3 = commonFuncs.merge(values, result3.values, {replace, arrays: 'merge'});
//
//
//     expectResult.current.array_1[0][0] = {"v75": 55, "v22": 32};
//     expectResult.inital.array_1[0] = [];
//     expectResult.inital.array_1[0][0] = {"v15": 11, "v27": 23};
//
//     expect(commonFuncs.isEqual(values3, expectResult, {deep: true})).toBe(true);
//   }
// }
//
// function test_omit_getValue(store) {
//   return async function () {
//     let api = new formFuncs.FFormStateAPI({name: 'test_omit_getValue', store, schema: require('./schema').default});
//     await api.promise;
//     let state;
//     let values = api.getValue({flatten: true});
//     expect(commonFuncs.isEqual(Object.keys(values.array_1), ['0', '1'])).toBe(true);
//     expect(values.array_1.length === 2).toBe(true);
//     api.set('/objLevel_1/objLevel_2/array_1/0/@/controls/omit', true, {execute: true});
//     values = api.getValue({flatten: true});
//     expect(commonFuncs.isEqual(Object.keys(values.array_1), ['0', '1'])).toBe(true);
//     expect(values.array_1[0]).toBe(undefined);
//     expect(values.array_1.length === 2).toBe(true);
//     api.set('/objLevel_1/objLevel_2/array_1/0/@/controls/omit', false, {execute: true});
//     values = api.getValue({flatten: true});
//     expect(commonFuncs.isEqual(Object.keys(values.array_1), ['0', '1'])).toBe(true);
//     expect(values.array_1.length === 2).toBe(true);
//
//     api.set('/movies/cinema/favBook/@/status/pristine', false, {execute: true});
//     state = api.getState();
//     expect(state.movies.cinema[Symbol.for('FFormData')].status.pristine).toBe(false);
//     expect(state.movies[Symbol.for('FFormData')].status.pristine).toBe(false);
//     api.set('/movies/cinema/favBook/@/controls/omit', true, {execute: true});
//     state = api.getState();
//     expect(state.movies.cinema[Symbol.for('FFormData')].status.pristine).toBe(true);
//     expect(state.movies[Symbol.for('FFormData')].status.pristine).toBe(true);
//     api.set('/movies/cinema/favBook/@/controls/omit', false, {execute: true});
//     state = api.getState();
//     expect(state.movies.cinema[Symbol.for('FFormData')].status.pristine).toBe(false);
//     expect(state.movies[Symbol.for('FFormData')].status.pristine).toBe(false);
//
//     api.showOnly('/movies/cinema/favBook', {execute: true, skipFields: ['mapfavMovie']});
//     state = api.getState();
//     expect(state.movies.cinema.favBook[Symbol.for('FFormData')].controls.hidden).not.toBeTruthy();
//     expect(state.movies.cinema.favCinema[Symbol.for('FFormData')].controls.hidden).toBeTruthy();
//     expect(!!state.movies.cinema.mapfavMovie[Symbol.for('FFormData')].controls.hidden).not.toBeTruthy();
//
//     api.showOnly('/movies/cinema/favBook', {execute: true});
//     state = api.getState();
//     expect(state.movies.cinema.favBook[Symbol.for('FFormData')].controls.hidden).toBe(false);
//     expect(state.movies.cinema.favCinema[Symbol.for('FFormData')].controls.hidden).toBe(true);
//     expect(state.movies.cinema.mapfavMovie[Symbol.for('FFormData')].controls.hidden).toBe(true);
//     api.showOnly('/movies/cinema/favBook,favCinema', {execute: true, skipFields: ['favCinema']});
//     state = api.getState();
//     expect(state.movies.cinema.favBook[Symbol.for('FFormData')].controls.hidden).toBe(false);
//     expect(state.movies.cinema.favCinema[Symbol.for('FFormData')].controls.hidden).toBe(true);
//     expect(state.movies.cinema.mapfavMovie[Symbol.for('FFormData')].controls.hidden).toBe(true);
//     api.showOnly('/movies/cinema/favBook,favCinema', {execute: true, skipFields: ['notExists']});
//     state = api.getState();
//     expect(state.movies.cinema.favBook[Symbol.for('FFormData')].controls.hidden).toBe(false);
//     expect(state.movies.cinema.favCinema[Symbol.for('FFormData')].controls.hidden).toBe(false);
//     expect(state.movies.cinema.mapfavMovie[Symbol.for('FFormData')].controls.hidden).toBe(true);
//     api.showOnly('/color,movies/cinema/favBook', {execute: true});
//     state = api.getState();
//     expect(state.movies.cinema.favBook[Symbol.for('FFormData')].controls.hidden).toBe(false);
//     expect(state.movies.cinema.favCinema[Symbol.for('FFormData')].controls.hidden).toBe(true);
//     expect(state.movies.cinema.mapfavMovie[Symbol.for('FFormData')].controls.hidden).toBe(true);
//     expect(state.color.cinema.favBook[Symbol.for('FFormData')].controls.hidden).toBe(false);
//     expect(state.color.cinema.favCinema[Symbol.for('FFormData')].controls.hidden).toBe(true);
//     api.selectOnly('/movies/cinema/favBook', {execute: true});
//     state = api.getState();
//     expect(state.movies.cinema.favBook[Symbol.for('FFormData')].controls.hidden).toBe(false);
//     expect(state.movies.cinema.favCinema[Symbol.for('FFormData')].controls.hidden).toBe(true);
//     expect(state.movies.cinema.mapfavMovie[Symbol.for('FFormData')].controls.hidden).toBe(true);
//     expect(state.movies.cinema.favBook[Symbol.for('FFormData')].controls.omit).toBe(false);
//     expect(state.movies.cinema.favCinema[Symbol.for('FFormData')].controls.omit).toBe(true);
//     expect(state.movies.cinema.mapfavMovie[Symbol.for('FFormData')].controls.omit).toBe(true);
//   }
// }

describe('test FFormStateAPI', async function () {  // state.objLevel_1.objLevel_2.array_1[0][0].bazinga[Symbol.for('FFormData')]
    const extStore = {
      state: undefined,
      getState: () => extStore.state,
      setState: (state) => extStore.state = state
    };
    const extStoreRedux = {
      state: undefined,
      getState: () => extStore.state,
      setState: (state) => extStore.state = state
    };

    const formReducer = apiFuncs.formReducer;
    const rootReducer = combineReducers({fforms: formReducer()});
    const store = createStore(rootReducer, applyMiddleware(thunk));

    const simpleCore = new formFuncs.FFormStateAPI({name: 'simpleCore', schema: require('./schemaArray').default});
    const externalCore = new formFuncs.FFormStateAPI({getState: extStore.getState, setState: extStore.setState, name: 'externalCore', schema: require('./schemaArray').default});

    const simpleReduxCore = new formFuncs.FFormStateAPI({name: 'simpleReduxCore', store, schema: require('./schemaArray').default});
    const externalReduxCore = new formFuncs.FFormStateAPI({getState: extStoreRedux.getState, setState: extStoreRedux.setState, name: 'externalReduxCore', store, schema: require('./schemaArray').default});

    await testApi(simpleCore);
    await testApi(externalCore);
    await testApi(simpleReduxCore);
    await testApi(externalReduxCore);

    async function testApi(core) {
      it('test .get, .set ' + core.name, async function () {
        expect(core.get('@/status/pristine')).toBe(true);
        expect(core.get('0/@/status/pristine')).toBe(true);
        expect(core.get('0/0/@/status/pristine')).toBe(true);
        expect(core.get('0/1/@/status/pristine')).toBe(true);
        expect(core.getValue()).toBe(core.getValue({inital: true}));
        let val0 = core.get('0/0/strValue@value');
        let val1 = core.get('0/1/strValue@value');
        core.set('0/0/strValue@value', 'set test 000', {execute: 1});
        core.set('0/1/strValue@value', 'set test 111', {execute: true});
        expect(core.get('@/status/pristine')).toBe(false);
        expect(core.get('0/@/status/pristine')).toBe(false);
        expect(core.get('0/0/@/status/pristine')).toBe(false);
        expect(core.get('0/1/@/status/pristine')).toBe(false);
        expect(core.getValue()).not.toBe(core.getValue({inital: true}));

        core.set('0/1/strValue@value', val1, {execute: true});
        expect(core.get('@/status/pristine')).toBe(false);
        expect(core.get('0/@/status/pristine')).toBe(false);
        expect(core.get('0/0/@/status/pristine')).toBe(false);
        expect(core.get('0/1/@/status/pristine')).toBe(true);
        expect(core.getValue()).not.toBe(core.getValue({inital: true}));
        expect(core.getValue()[0][1]).toBe(core.getValue({inital: true})[0][1]);

        core.set('0/0/strValue@value', val0, {execute: true});
        expect(core.get('@/status/pristine')).toBe(true);
        expect(core.get('0/@/status/pristine')).toBe(true);
        expect(core.get('0/0/@/status/pristine')).toBe(true);
        expect(core.get('0/1/@/status/pristine')).toBe(true);
        expect(core.getValue()).toBe(core.getValue({inital: true}));
        expect(core.getValue()[0][0]).toBe(core.getValue({inital: true})[0][0]);

        core.arrayAdd('0', 1, {execute: true});
        expect(core.get('@/status/pristine')).toBe(false);
        expect(core.get('0/@/status/pristine')).toBe(false);
        expect(core.get('0/0/@/status/pristine')).toBe(true);
        expect(core.get('0/1/@/status/pristine')).toBe(true);
        expect(core.getValue()).not.toBe(core.getValue({inital: true}));

        core.arrayAdd('0', -1, {execute: true});
        expect(core.get('@/status/pristine')).toBe(true);
        expect(core.get('0/@/status/pristine')).toBe(true);
        expect(core.get('0/0/@/status/pristine')).toBe(true);
        expect(core.get('0/1/@/status/pristine')).toBe(true);
        expect(core.getValue()).toBe(core.getValue({inital: true}));

        core.setValue({}, {execute: true});
        expect(core.getValue()).toBe(core.getValue({inital: true}));

        let newVal = [];
        newVal.length = core.getValue().length;
        core.setValue(newVal, {execute: true});
        expect(core.getValue()).toBe(core.getValue({inital: true}));

        newVal.length++;
        core.setValue(newVal, {execute: true});
        expect(core.get('@/status/pristine')).toBe(false);
        expect(core.get('0/@/status/pristine')).toBe(true);
        expect(core.get('0/0/@/status/pristine')).toBe(true);
        expect(core.get('0/1/@/status/pristine')).toBe(true);
        expect(core.getValue()).not.toBe(core.getValue({inital: true}));

        newVal.length--;
        core.setValue(newVal, {execute: true});
        expect(core.get('@/status/pristine')).toBe(true);
        expect(core.getValue()).toBe(core.getValue({inital: true}));

        let notExist = {};
        let moreNewVal = [];
        moreNewVal.length = core.getValue().length;
        moreNewVal.notExist = notExist;
        core.setValue(moreNewVal, {execute: true});
        expect(core.get('@/status/pristine')).toBe(false);
        expect(core.get('0/@/status/pristine')).toBe(true);
        expect(core.get('0/0/@/status/pristine')).toBe(true);
        expect(core.get('0/1/@/status/pristine')).toBe(true);
        expect(core.getValue()).not.toBe(core.getValue({inital: true}));
        expect(core.getValue().notExist).toBe(notExist);

        newVal[0] = [{strValue: 'setValue test 0 0'}, {strValue: 'setValue test 0 1'}];
        core.setValue(newVal, {execute: true});
        expect(core.get('@/status/pristine')).toBe(false);
        expect(core.get('0/@/status/pristine')).toBe(false);
        expect(core.get('0/0/@/status/pristine')).toBe(false);
        expect(core.get('0/1/@/status/pristine')).toBe(false);
        expect(core.getValue()).not.toBe(core.getValue({inital: true}));
        expect(core.get('0/0/strValue@value')).toBe('setValue test 0 0');
        expect(core.get('0/1/strValue@value')).toBe('setValue test 0 1');
        expect(core.getValue().notExist).toBe(notExist);

        expect(core.get('0/0/mapArrValue/1@value')).toBe(undefined);
        core.setValue(2, {path: ['0', '0', 'mapArrValue', 'length'], execute: true});
        expect(core.get('0/0/mapArrValue@/length')).toBe(2);
        expect(core.get('0/0/mapArrValue/1@value')).toBe('setValue test 0 0');
        expect(core.getValue().notExist).toBe(notExist);

        newVal[0] = [{strValue: val0}, {strValue: val1}];
        core.setValue(newVal);
        core.setValue(undefined, {path: ['notExist'], execute: true});
        core.setValue(1, {path: ['0', '0', 'mapArrValue', 'length'], execute: true});
        expect(core.get('0/0/mapArrValue@/length')).toBe(1);
        expect(core.get('@/status/pristine')).toBe(true);
        expect(core.get('0/@/status/pristine')).toBe(true);
        expect(core.get('0/0/@/status/pristine')).toBe(true);
        expect(core.get('0/1/@/status/pristine')).toBe(true);
        expect(core.getValue().notExist).toBe(undefined);
        expect(core.getValue()).toBe(core.getValue({inital: true}));

        let initNewVal = [{strValue: 'inital setValue test 0 0', mapValue: 'inital setValue test 0 0', mapArrValue: [], arrValue: [], turpleValue: []},
          {strValue: 'inital setValue test 0 1', mapValue: 'inital setValue test 0 1', mapArrValue: ['inital setValue test 0 1']}];
        core.setValue(initNewVal, {path: '0', inital: true, execute: true});
        expect(core.get('@/status/pristine')).toBe(false);
        expect(core.get('0/@/status/pristine')).toBe(false);
        expect(core.get('0/0/@/status/pristine')).toBe(false);
        expect(core.get('0/1/@/status/pristine')).toBe(false);
        expect(core.get('1/@/status/pristine')).toBe(true);
        expect(core.getValue()).not.toBe(core.getValue({inital: true}));
        expect(core.get('0/0/strValue@value')).toBe(val0);
        expect(core.get('0/1/strValue@value')).toBe(val1);
        expect(core.getValue().notExist).toBe(undefined);
        expect(core.get('0/0/turpleValue/0')).not.toBe(undefined);
        expect(core.get('0/0/turpleValue/1')).not.toBe(undefined);
        expect(core.get('0/0/turpleValue/2')).not.toBe(undefined);
        expect(core.get('0/0/turpleValue/@/messages/0/textGroups/0/0')).toBe(undefined);


        newVal[0] = [{strValue: 'inital setValue test 0 0', mapArrValue: [], arrValue: [], turpleValue: []},
          {strValue: 'inital setValue test 0 1', arrValue: [], turpleValue: []}];
        core.setValue(newVal, {execute: true});
        expect(core.get('@/status/pristine')).toBe(false);
        expect(core.get('0/@/status/pristine')).toBe(false);
        expect(core.get('0/0/@/status/pristine')).toBe(true);
        expect(core.get('0/1/@/status/pristine')).toBe(false);
        expect(core.getValue()).not.toBe(core.getValue({inital: true}));
        expect(core.get('0/0/strValue@value')).toBe('inital setValue test 0 0');
        expect(core.get('0/1/strValue@value')).toBe('inital setValue test 0 1');
        expect(core.getValue().notExist).toBe(undefined);
        expect(core.get('0/0/turpleValue/0')).toBe(undefined);
        expect(core.get('0/0/turpleValue/1')).toBe(undefined);
        expect(core.get('0/0/turpleValue/2')).toBe(undefined);
        expect(core.get('0/0/turpleValue/@/messages/0/textGroups/0/0')).toBe('has less items than allowed');

        core.setValue([], {path: '0/1/arrValue', inital: true});
        core.setValue([], {path: '0/1/turpleValue', inital: true, execute: true});
        expect(core.get('@/status/pristine')).toBe(true);
        expect(core.get('0/@/status/pristine')).toBe(true);
        expect(core.get('0/0/@/status/pristine')).toBe(true);
        expect(core.get('0/1/@/status/pristine')).toBe(true);
        expect(core.getValue()).toBe(core.getValue({inital: true}));
        expect(core.get('0/0/strValue@value')).toBe('inital setValue test 0 0');
        expect(core.get('0/1/strValue@value')).toBe('inital setValue test 0 1');
        expect(core.getValue().notExist).toBe(undefined);

        core.setValue(notExist, {path: 'notExist', inital: true, execute: true});
        expect(core.get('@/status/pristine')).toBe(false);
        expect(core.get('0/@/status/pristine')).toBe(true);
        expect(core.get('0/0/@/status/pristine')).toBe(true);
        expect(core.get('0/1/@/status/pristine')).toBe(true);
        expect(core.getValue()).not.toBe(core.getValue({inital: true}));
        expect(core.getValue().notExist).toBe(undefined);

        core.setValue(notExist, {path: 'notExist', execute: true});
        expect(core.get('@/status/pristine')).toBe(true);
        expect(core.get('0/@/status/pristine')).toBe(true);
        expect(core.get('0/0/@/status/pristine')).toBe(true);
        expect(core.get('0/1/@/status/pristine')).toBe(true);
        expect(core.getValue()).toBe(core.getValue({inital: true}));
        expect(core.getValue().notExist).toBe(notExist);

        core.clear({execute: true});
        expect(core.get('@/status/pristine')).toBe(false);
        expect(core.get('0/@/status/pristine')).toBe(false);
        expect(core.get('0/0/@/status/pristine')).toBe(false);
        expect(core.get('0/1/@/status/pristine')).toBe(false);
        expect(core.getValue()).not.toBe(core.getValue({inital: true}));
        expect(commonFuncs.isEqual(commonFuncs.merge(core.getDefaultValue(), {notExist}), core.getValue(), {deep: true})).toBe(true);
        expect(core.getValue().notExist).toBe(notExist);

        core.reset({execute: true});
        expect(core.get('@/status/pristine')).toBe(true);
        expect(core.get('0/@/status/pristine')).toBe(true);
        expect(core.get('0/0/@/status/pristine')).toBe(true);
        expect(core.get('0/1/@/status/pristine')).toBe(true);
        expect(core.getValue()).toBe(core.getValue({inital: true}));
        expect(core.getValue().notExist).toBe(notExist);


        expect(core.get('0/0/strValue@messages/0/1/0')).toBe(undefined);
        expect(core.get('0/@/messages/0/textGroups/1/0')).toBe(undefined);
        core.set('0/0/strValue@value', 'test validation', {execute: true});
        expect(core.get('0/@/messages/0/textGroups/1/0')).toBe('simple text message');
        expect(core.get('0/@/messages/0/textGroups/1/1')).toBe('more simple text message');
        expect(core.get('0/@/messages/0/textGroups/1/length')).toBe(2);
        expect(core.get('0/0/mapValue@messages/0/textGroups/1/0')).toBe('text message for mapValue');
        expect(core.get('0/0/arrValue@messages/0/textGroups/2/0')).toBe(undefined);
        await sleep(10);
        expect(core.get('0/0/arrValue@messages/0/textGroups/2/0')).toBe('async text message for arrValue test validation');

        core.set('0/0/strValue@value', 'no validation', {execute: true});
        expect(core.get('0/0/arrValue@messages/0/textGroups/2/0')).toBe('async text message for arrValue test validation');
        await sleep(10);
        expect(core.get('0/0/arrValue@messages/0/textGroups/2/0')).toBe(undefined);

        core.set('0/0/strValue@value', 'test validation', {execute: true});
        expect(core.get('0/0/arrValue@messages/0/textGroups/2/0')).toBe(undefined);
        core.set('0/0/strValue@value', 'another validation', {execute: true});
        await sleep(10);
        expect(core.get('0/0/arrValue@messages/0/textGroups/2/0')).toBe('async text message for arrValue another validation');
        expect(core.get('0/@/messages/0/textGroups/1/0')).toBe(undefined);

        expect(core.get('0/0/turpleValue/@/messages/0/textGroups/0/0')).toBe('has less items than allowed');
        core.arrayAdd('0/0/turpleValue', ['te'], {execute: 1});
        core.arrayAdd('0/0/turpleValue', [5, 8], {execute: true});
        expect(core.get('0/0/turpleValue/@/messages/0/textGroups/0/0')).toBe(undefined);
        expect(core.get('0/0/turpleValue/0@value')).toBe('te');
        expect(core.get('0/0/turpleValue/1@value')).toBe(5);
        expect(core.get('0/0/turpleValue/2@value')).toBe(8);

        core.set('0/0/strValue@value', 'deff', {execute: true});
        expect(core.get('0/0/strValue@value')).toBe('deff');
        let promise = core.set('0/0/strValue@value', 'more deff', {execute: 30});
        expect(core.get('0/0/strValue@value')).toBe('deff');
        await sleep(10);
        expect(core.get('0/0/strValue@value')).toBe('deff');
        await promise;
        expect(core.get('0/0/strValue@value')).toBe('more deff');
      })


    }

    // let flatDataInital = {
    //   "array_1": [
    //     [{"favBook": "inital favBook 0 0"}],
    //     [{"favBook": "inital favBook 1 0"}, {"favBook": "inital favBook 1 1"}, {"favBook": "inital favBook 1 2"}],
    //     [{"favBook": "inital favBook 2 0"}, {"favBook": "inital favBook 2 1"}, {"favBook": "inital favBook 2 2"}],
    //     [{"favBook": "inital favBook 3 0"}, {"favBook": "inital favBook 3 1"}, {"favBook": "inital favBook 3 2"}, {"favBook": "inital favBook 3 3"}, {"favBook": "inital favBook 3 4"}]
    //   ],
    //   "movies": {"mc_favBook": "def"},
    //   "color_cinema_favBook": "def"
    // };
    // let flatDataDefault = {
    //   "array_1": [
    //     [{"favBook": "default favBook 0 0"}, {"favBook": "default favBook 0 1"}, {"favBook": "default favBook 0 2"}, {"favBook": "default favBook 0 3"}, {"favBook": "default favBook 0 4"}],
    //   ]
    // };
    // let flatDataCurrent = {
    //   "array_1": [
    //     [{"favBook": "default favBook 0 0"}],
    //   ],
    //   "movies": {"mc_favCinema": "current"},
    // };
    // let stateData = new formFuncs.FFormStateAPI({name: 'test_FFormCoreAPI_init', store, schema: require('./schema').default, opts: {flatValues: true}, current: flatDataCurrent, inital: flatDataInital, default: flatDataDefault});
    // let state = stateData.getState();
    // let initalVals = stateData.getValue({inital: true, flatten: true});
    // let currentVals = stateData.getValue({flatten: true});
    // let defaultVals = stateData.getDefaultValue({flatten: true});
    // expect(state.objLevel_1.objLevel_2.array_1[0][4].bazingaCinema.favBook[Symbol.for('FFormData')].values.default === "default favBook 0 4").toBeTruthy();
    // expect(state.objLevel_1.objLevel_2.array_1[0][0].bazingaCinema.favBook[Symbol.for('FFormData')].values.default === "default favBook 0 0").toBeTruthy();
    // expect(state.objLevel_1.objLevel_2.array_1[0][0].bazingaCinema.favBook[Symbol.for('FFormData')].values.inital === "inital favBook 0 0").toBeTruthy();
    // expect(state.objLevel_1.objLevel_2.array_1[2][2].bazingaCinema.favBook[Symbol.for('FFormData')].values.inital === "inital favBook 2 2").toBeTruthy();
    // expect(state.objLevel_1.objLevel_2.array_1[3][4].bazingaCinema.favBook[Symbol.for('FFormData')].values.inital === "inital favBook 3 4").toBeTruthy();
    // expect(state.color.cinema.favBook[Symbol.for('FFormData')].messages[0].textArray.length === 0).toBeTruthy();
    // expect(state.color.cinema.favCinema[Symbol.for('FFormData')].messages[0].textArray.length === 1).toBeTruthy();
    // expect(state.color.cinema.favCinema[Symbol.for('FFormData')].messages[1].textArray.length === 1).toBeTruthy();
    // stateData.set('color/cinema/favCinema/@/value', 'test', {execute: true, noValidation: true});
    // state = stateData.getState();
    // expect(state.color.cinema.favCinema[Symbol.for('FFormData')].messages[0].textArray.length === 1).toBeTruthy();
    // expect(state.color.cinema.favCinema[Symbol.for('FFormData')].messages[1].textArray.length === 1).toBeTruthy();
    // stateData.set('color/cinema/favCinema/@/value', 'test', {execute: true});
    // state = stateData.getState();
    // expect(state.color.cinema.favCinema[Symbol.for('FFormData')].messages[0].textArray.length === 1).toBeTruthy();
    // expect(state.color.cinema.favCinema[Symbol.for('FFormData')].messages[1].textArray.length === 1).toBeTruthy();
    // await stateData.validate('color/cinema/favCinema').vAsync;
    // state = stateData.getState();
    // expect(state.color.cinema.favCinema[Symbol.for('FFormData')].messages[0].textArray.length === 0).toBeTruthy();
    // expect(state.color.cinema.favCinema[Symbol.for('FFormData')].messages[1].textArray.length === 0).toBeTruthy();
  }
);

function test_api_setValues(store) {
  return async function () {
    let stateData = new formFuncs.FFormStateAPI({name: 'test_api_setValues', store, schema: require('./schema').default});
    await stateData.promise.vAsync;
    let oldState = stateData.getState();
    stateData.set('/favMovie/@/value', 'test', {execute: true, noValidation: true});
    let state = stateData.getState();
    expect(state.favMovie[Symbol.for('FFormData')].value === 'test').toBe(true);

    stateData.set([], oldState, {execute: true, replace: true});
    state = stateData.getState();
    expect(commonFuncs.isEqual(state, oldState, {deep: true})).toBe(true);

    stateData.setState(oldState, {execute: true});
    state = stateData.getState();
    expect(state === oldState).toBe(true);
    let curVals = {moreNotExist: 3, array_1: [[{v1: 1, v2: 2}, {t1: 4, t2: 5}]]};
    let initVals = {notExist: {v1: 2}, array_1: [[{v5: 5, v2: 4}, {t5: 3, t2: 1}, {t7: 3, t1: 1}]], array_2: [{value: 1, notExistValue: 1}]};
    stateData = new formFuncs.FFormStateAPI({name: 'test_api_setValues2', store, schema: require('./schema3').default, current: curVals, inital: initVals});
    await stateData.promise.vAsync;
    let current = stateData.getValue();
    expect(commonFuncs.isEqual(current, {
      notExist: {v1: 2},
      moreNotExist: 3,
      array_1: [[{v1: 1, v2: 2}, {t1: 4, t2: 5}]],
      array_2: [{"value": 1, notExistValue: 1, "more_value": {"inner": "", "more_inner": undefined}}]
    }, {deep: true})).toBe(true);

    stateData.setValue({notExist: {v12: 4}, array_1: [[{v1: 1, v2: 2}, {t1: 4, t2: 5}]], array_2: [{"value": 1, notExistValue: 4, "more_value": {"inner": "", "more_inner": undefined}}]}, {execute: true});
    current = stateData.getValue();
    expect(commonFuncs.isEqual(current, {notExist: {v12: 4}, array_1: [[{v1: 1, v2: 2}, {t1: 4, t2: 5}]], array_2: [{"value": 1, notExistValue: 4, "more_value": {"inner": "", "more_inner": undefined}}]}, {deep: true})).toBe(true);

    stateData.set('/array_1/0/0/@/value', {v5: 1, v22: 2}, {replace: true, execute: true});
    current = stateData.getValue();
    expect(commonFuncs.isEqual(current, {notExist: {v12: 4}, array_1: [[{v5: 1, v22: 2}, {t1: 4, t2: 5}]], array_2: [{"value": 1, notExistValue: 4, "more_value": {"inner": "", "more_inner": undefined}}]}, {deep: true})).toBe(true);

    stateData.setValue({}, {execute: true});
    current = stateData.getValue();
    expect(commonFuncs.isEqual(current, {array_1: [], array_2: [],}, {deep: true})).toBe(true);

    stateData.setValue({}, {inital: true, execute: true});
    stateData.setValue({}, {inital: true, execute: true});
    stateData.setValue({notExist: 1}, {execute: true});
    let inital = stateData.getValue({inital: true});
    expect(commonFuncs.isEqual(inital, {array_1: [], array_2: [],}, {deep: true})).toBe(true);
    current = stateData.getValue();
    expect(commonFuncs.isEqual(current, {notExist: 1, array_1: [], array_2: [],}, {deep: true})).toBe(true);
  }
}

function test_coreApiFunctions(store) {
  return async function () {
    let curVals = {array_1: [[{v1: 1, v2: 2}, {t1: 4, t2: 5}]], array_2: []};
    let stateData = new formFuncs.FFormStateAPI({store, name: 'test_coreApiFunctions', schema: require('./schema3').default});
    await stateData.promise.vAsync;
    let current = stateData.getValue();
    expect(commonFuncs.isEqual(current, curVals, {deep: true})).toBe(true);

    await stateData.setValue(curVals, {inital: true, execute: true}).vAsync;
    let inital = stateData.getValue({inital: true});
    let state = stateData.getState();
    current = stateData.getValue();
    expect(current === inital).toBe(true);
    expect(state[SymData].status.pristine).toBe(true);

    await stateData.arrayOps(['array_1', 0], 'add', {execute: true}).vAsync;
    current = stateData.getValue();
    state = stateData.getState();
    let array_1 = [[{v1: 1, v2: 2}, {t1: 4, t2: 5}, undefined]];
    // array_1.length = 3;
    expect(commonFuncs.isEqual(current, {array_1, array_2: []}, {deep: true})).toBe(true);
    expect(state[SymData].status.pristine).toBe(false);

    await stateData.arrayItemOps(['array_1', 0, 2], 'del', {execute: true}).vAsync;
    current = stateData.getValue();
    inital = stateData.getValue({inital: true});
    state = stateData.getState();
    expect(commonFuncs.isEqual(current, {array_1: [[{v1: 1, v2: 2}, {t1: 4, t2: 5}]], array_2: []}, {deep: true})).toBe(true);
    expect(state[SymData].status.pristine).toBe(true);
    expect(current === inital).toBe(true);

    await stateData.arrayItemOps(['array_1', 0, 1], 'up', {execute: true}).vAsync;
    current = stateData.getValue();
    inital = stateData.getValue({inital: true});
    state = stateData.getState();
    expect(state[SymData].status.pristine).toBe(false);
    // console.log('current', current.array_1[0][0]);
    expect(commonFuncs.isEqual(current, {array_1: [[{t1: 4, t2: 5}, {v1: 1, v2: 2}]], array_2: []}, {deep: true})).toBe(true);
    expect(commonFuncs.isEqual(inital, {array_1: [[{v1: 1, v2: 2}, {t1: 4, t2: 5}]], array_2: []}, {deep: true})).toBe(true);
    expect(current !== inital).toBe(true);

    let newVals = {array_1: [], array_2: [{value: 1, more_value: {inner: 2, more_inner: undefined}}, {value: 4, more_value: {inner: 5, more_inner: undefined}}]};
    let newDefaultVals = {array_1: []};
    await stateData.setValues(newVals, {valueType: 'current', execute: true}).vAsync;
    await stateData.setValues(newDefaultVals, {valueType: 'default', execute: true}).vAsync;
    current = stateData.getValue();
    let defaultVal = stateData.getDefaultValue();
    expect(current === newVals).toBe(true);
    expect(defaultVal !== newDefaultVals).toBe(true);

    await stateData.setValues({array_1: [[{t5: 4, t7: 5}, {v5: 1, v7: 2}]], array_2: []}, {valueType: 'inital', execute: true}).vAsync;
    inital = stateData.getValue({inital: true});
    // console.log(inital);
    expect(commonFuncs.isEqual(inital, {array_1: [[{t5: 4, t7: 5}, {v5: 1, v7: 2}]], array_2: []}, {deep: true})).toBe(true);

    newVals.array_1 = [];
    await stateData.setValues(newVals, {valueType: 'current', execute: true}).vAsync;
    current = stateData.getValue();
    expect(commonFuncs.isEqual(current, {
      array_1: [],
      array_2: [{"value": 1, "more_value": {"inner": 2, "more_inner": undefined}}, {"value": 4, "more_value": {"inner": 5, "more_inner": undefined}}]
    }, {deep: true})).toBe(true);

    await stateData.arrayOps(['array_1'], 'add', {num: 1, values: [[{t4: 1}, {t5: 5}]], execute: true}).vAsync;
    current = stateData.getValue();
    expect(commonFuncs.isEqual(current, {
      array_1: [[{t4: 1}, {t5: 5}]],
      array_2: [{"value": 1, "more_value": {"inner": 2, "more_inner": undefined}}, {"value": 4, "more_value": {"inner": 5, "more_inner": undefined}}]
    }, {deep: true})).toBe(true);

    await stateData.arrayOps(['array_1', 0], 'add', {num: 2, values: [{t8: 81}, {t45: 45}], execute: true}).vAsync;
    current = stateData.getValue();
    expect(commonFuncs.isEqual(current, {
      array_1: [[{t4: 1}, {t5: 5}, {t8: 81}, {t45: 45}]],
      array_2: [{"value": 1, "more_value": {"inner": 2, "more_inner": undefined}}, {"value": 4, "more_value": {"inner": 5, "more_inner": undefined}}]
    }, {deep: true})).toBe(true);

    let moreStateData = new formFuncs.FFormStateAPI({opts: {keepEqualRawValues: true, flatValues: true}, store, name: 'test_recursivelySetItems2', schema: require('./schema3').default});
    current = moreStateData.getValue();
    inital = moreStateData.getValue({inital: true});
    defaultVal = moreStateData.getDefaultValue();

    expect(commonFuncs.isEqual(current, {array_1: [], array_2: []}, {deep: true})).toBe(true);

    expect(commonFuncs.isEqual(inital, {array_1: [], array_2: []}, {deep: true})).toBe(true);
    expect(commonFuncs.isEqual(defaultVal, {array_1: [], array_2: []}, {deep: true})).toBe(true);

    await moreStateData.arrayOps(['array_1'], 'add', {execute: true}).vAsync;
    current = moreStateData.getValue();
    array_1 = [];
    array_1.length = 1;
    // console.log('current', current);
    expect(commonFuncs.isEqual(current, {array_1: [[]], array_2: []}, {deep: true})).toBe(true);

    await moreStateData.arrayOps(['array_1', 0], 'add', {execute: true}).vAsync;
    current = moreStateData.getValue();
    array_1[0] = [undefined];
    array_1[0].length = 1;
    expect(commonFuncs.isEqual(current, {array_1, array_2: []}, {deep: true})).toBe(true);

    await moreStateData.arrayItemOps(['array_1', 0], 'del', {execute: true}).vAsync;
    current = moreStateData.getValue();
    inital = moreStateData.getValue({inital: true});
    expect(commonFuncs.isEqual(current, {array_1: [], array_2: []}, {deep: true})).toBe(true);
    expect(commonFuncs.isEqual(inital, {array_1: [], array_2: []}, {deep: true})).toBe(true);
    // expect(current === inital).toBe(true);

    await moreStateData.arrayOps(['array_2'], 'add', {num: 1}).vAsync;
    await moreStateData.arrayOps(['array_2'], 'add', {num: 1}).vAsync;
    await moreStateData.set('/array_2/1/more_value/more_inner/@/values/current', 'more_inner 2', {execute: true}).vAsync;
    current = moreStateData.getValue({flatten: true});
    expect(commonFuncs.isEqual(current, {array_1: [], array_2: [{value: undefined, inner: '', "more_inner": undefined}, {value: undefined, inner: '', more_inner: 'more_inner 2'}]}, {deep: true})).toBe(true);

    await moreStateData.setValues(current, {valueType: 'inital', flatten: true, execute: true}).vAsync;
    current = moreStateData.getValue();
    inital = moreStateData.getValue({inital: true});
    state = moreStateData.getState();
    expect(state[SymData].status.pristine).toBe(true);
    expect(current === inital).toBe(true);

    await moreStateData.arrayOps(['array_2'], 'add', {num: -10, execute: true}).vAsync;
    current = moreStateData.getValue();
    expect(commonFuncs.isEqual(current, {array_1: [], array_2: []}, {deep: true})).toBe(true);

  }
}

function test_deffered_execution(store) {
  return async function () {
    let curVals = {array_1: [[{v1: 1, v2: 2}, {t1: 4, t2: 5}]], array_2: []};
    let stateData = new formFuncs.FFormStateAPI({name: 'test_deffered_execution', store, schema: require('./schema3').default, current: curVals});
    await stateData.promise.vAsync;
    let promises = stateData.arrayItemOps(['array_1', 0, 1], 'up', {execute: 25});
    expect(commonFuncs.isEqual(stateData.getValue(), {array_1: [[{v1: 1, v2: 2}, {t1: 4, t2: 5}]], array_2: []}, {deep: true})).toBe(true);
    await sleep(50);
    expect(commonFuncs.isEqual(stateData.getValue(), {array_1: [[{t1: 4, t2: 5}, {v1: 1, v2: 2}]], array_2: []}, {deep: true})).toBe(true);

    promises = stateData.arrayItemOps(['array_1', 0, 1], 'up', {execute: 25});
    expect(commonFuncs.isEqual(stateData.getValue(), {array_1: [[{t1: 4, t2: 5}, {v1: 1, v2: 2}]], array_2: []}, {deep: true})).toBe(true);
    await promises;
    expect(commonFuncs.isEqual(stateData.getValue(), {array_1: [[{v1: 1, v2: 2}, {t1: 4, t2: 5}]], array_2: []}, {deep: true})).toBe(true);

    promises = stateData.arrayItemOps(['array_1', 0, 1], 'up', {execute: 25});
    expect(commonFuncs.isEqual(stateData.getValue(), {array_1: [[{v1: 1, v2: 2}, {t1: 4, t2: 5}]], array_2: []}, {deep: true})).toBe(true);
    stateData.execute({execute: 0});  // cancel deffered execution
    await sleep(50);
    expect(commonFuncs.isEqual(stateData.getValue(), {array_1: [[{v1: 1, v2: 2}, {t1: 4, t2: 5}]], array_2: []}, {deep: true})).toBe(true);
    let newPromises = stateData.execute({execute: true});
    expect(newPromises).toBe(promises); // test that promises are the same object
    expect(commonFuncs.isEqual(stateData.getValue(), {array_1: [[{t1: 4, t2: 5}, {v1: 1, v2: 2}]], array_2: []}, {deep: true})).toBe(true);

    promises = stateData.arrayItemOps(['array_1', 0, 1], 'up', {execute: 25});
    expect(newPromises !== promises).toBe(true);
    stateData.set('array_1/0/0/@/values/current/v1', 55, {execute: 25});
    await promises;
    let state = stateData.getState();
    expect(commonFuncs.isEqual(stateData.getValue(), {array_1: [[{v1: 55, v2: 2}, {t1: 4, t2: 5}]], array_2: []}, {deep: true})).toBe(true);

    stateData.set('array_1/0/0/@/values/current/v1', 5, {execute: 25});
    let items = stateData.set('array_1/0/0/@/values/current/v1', 5, {execute: true, returnItems: true});
    expect(items.length).toBe(2);
    items = stateData.execute({execute: true, returnItems: true});
    expect(items.length).toBe(0);
  }
}

function test_async_validation(store) {
  return async function () {  // state.objLevel_1.objLevel_2.array_1[0][0].bazinga[Symbol.for('FFormData')]

    let stateData = new formFuncs.FFormStateAPI({name: 'test_async_validation', store, schema: require('./schema').default});
    let state = stateData.getState();
    expect(state.movies.cinema[Symbol.for('FFormData')].messages[1].textArray.length === 1).toBeTruthy();
    expect(state.movies.cinema.favCinema[Symbol.for('FFormData')].messages[1].textArray.length === 1).toBeTruthy();
    expect(state.movies.favMovie[Symbol.for('FFormData')].messages[1].textArray.length === 1).toBeTruthy();
    expect(state.color.cinema.favCinema[Symbol.for('FFormData')].messages[1].textArray.length === 1).toBeTruthy();
    expect(state.color.cinema.favBook[Symbol.for('FFormData')].messages[0].textArray.length === 1).toBeTruthy();
    expect(state.mapFavBook[Symbol.for('FFormData')].messages[3] === undefined).toBeTruthy();
    await stateData.promise.vAsync;  // state.movies.cinema[Symbol.for('FFormData')]
    state = stateData.getState();
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

    let actualValues_1 = stateData.getValue({flatten: true});
    let promise = stateData.setValues(flatDataObj, {valueType: 'inital', execute: true, flatten: true});
    state = stateData.getState();
    let defaultValues = stateData.getDefaultValue({flatten: true});
    let initalValues = stateData.getValue({inital: true, flatten: true});
    // console.log(initalValues);
    let actualValues_2 = stateData.getValue({flatten: true});
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
    stateData.set('objLevel_1/@/switch/params/_liveValidate', true, {execute: true});
    state = stateData.getState();

    // expect(state.objLevel_1.objLevel_2[Symbol.for('FFormData')].params._liveValidate).toBe(true);
    // expect(state.objLevel_1.objLevel_2.array_1[Symbol.for('FFormData')].params._liveValidate).toBe(true);
    // expect(state.objLevel_1.objLevel_2.array_1[0][Symbol.for('FFormData')].params._liveValidate).toBe(true);
    // expect(state.objLevel_1.objLevel_2.array_1[0][0][Symbol.for('FFormData')].params._liveValidate).toBe(true);
    expect(state.objLevel_1.favMovie2[Symbol.for('FFormData')].params._liveValidate).toBe(true);
    expect(state.objLevel_1.objLevel_2.array_1[1][0].bazingaCinema.favBook[Symbol.for('FFormData')].params._liveValidate).toBe(true);
    expect(state.objLevel_1.objLevel_2.array_1[0][2].bazingaCinema.favBook[Symbol.for('FFormData')].params._liveValidate).toBe(true);

    stateData.set('objLevel_1/objLevel_2/@/switch/params/_liveValidate', false, {execute: true});
    state = stateData.getState();
    // expect(state.objLevel_1.objLevel_2[Symbol.for('FFormData')].params._liveValidate).toBe(false);
    // expect(state.objLevel_1.objLevel_2.array_1[Symbol.for('FFormData')].params._liveValidate).toBe(false);
    // expect(state.objLevel_1.objLevel_2.array_1[0][Symbol.for('FFormData')].params._liveValidate).toBe(false);
    // expect(state.objLevel_1.objLevel_2.array_1[0][0][Symbol.for('FFormData')].params._liveValidate).toBe(false);
    expect(state.objLevel_1.favMovie2[Symbol.for('FFormData')].params._liveValidate).toBe(true);
    expect(state.objLevel_1.objLevel_2.array_1[1][0].bazingaCinema.favBook[Symbol.for('FFormData')].params._liveValidate).toBe(false);
    expect(state.objLevel_1.objLevel_2.array_1[0][2].bazingaCinema.favBook[Symbol.for('FFormData')].params._liveValidate).toBe(false);

    stateData.set('objLevel_1/objLevel_2/@/status/pristine', false, {execute: true});
    state = stateData.getState();
    expect(state.objLevel_1[Symbol.for('FFormData')].status.pristine).toBe(false);
    expect(state.objLevel_1.objLevel_2[Symbol.for('FFormData')].status.pristine).toBe(false);
    stateData.set('objLevel_1/objLevel_2/@/status/pristine', true, {execute: true});
    state = stateData.getState();
    expect(state.objLevel_1[Symbol.for('FFormData')].status.pristine).toBe(true);
    expect(state.objLevel_1.objLevel_2[Symbol.for('FFormData')].status.pristine).toBe(true);
    // stateData.set('objLevel_1/objLevel_2/@/status/pristine', null);
    // state = stateData.getState();
    // expect(state.objLevel_1[Symbol.for('FFormData')].status.pristine).toBe(null);
    // expect(state.objLevel_1.objLevel_2[Symbol.for('FFormData')].status.pristine).toBe(null);
    stateData.set('objLevel_1/objLevel_2/@/status/pristine', true, {execute: true});
    state = stateData.getState();
    expect(state.objLevel_1[Symbol.for('FFormData')].status.pristine).toBe(true);
    expect(state.objLevel_1.objLevel_2[Symbol.for('FFormData')].status.pristine).toBe(true);
    // console.log(stateData)
  }
}

// describe('FForm api tests with redux', function () {
//   const formReducer = apiFuncs.formReducer;
//   const rootReducer = combineReducers({fforms: formReducer()});
//   const store = createStore(rootReducer, applyMiddleware(thunk));
//
//   //it('test getRawValuesChanges with redux', test_getRawValuesChanges(store));
//
//   //it('test omit with getValue and recalculation', test_omit_getValue(store));
//
//   it('test api.set api.setValues', test_api_setValues(store));
//
//   //it('test FFormStateAPI init and force validate', test_FFormCoreAPI(store));
//
//   it('test recursivelySetItems', test_coreApiFunctions(store));
//
//   it('test deffered execution', test_deffered_execution(store));
//
//   it('test FFormStateAPI async validation', test_async_validation(store));
//
// });
//
// describe('FForm api tests', function () {
//
//   //it('test getRawValuesChanges', test_getRawValuesChanges());
//
//   //it('test omit with getValue and recalculation', test_omit_getValue());
//
//   it('test api.set api.setValues', test_api_setValues());
//
//   //it('test FFormStateAPI init and force validate', test_FFormCoreAPI());
//
//   it('test recursivelySetItems', test_coreApiFunctions());
//
//   it('test deffered execution', test_deffered_execution());
//
//   it('test FFormStateAPI async validation', test_async_validation());
//
//
// });
