const expect = require('expect');

describe('FForm common functions test', function () {

  it('test mergeState', function () {

    let obj = {sm: 3, val: {a: 1, b: {c: 1}}};
    // this.object.test.Undefined = Symbol.for('FFormDelete');
    // this.object.test.EmptyObject = {};
    // this.object.test.EmptyArray = [];

    let result = formFuncs.mergeState({val: [1, 2, 3, 4]}, {val: {1: 5}});
    expect(formFuncs.isEqual(result.state.val, {1: 5})).toBeTruthy();

    result = formFuncs.merge({a: [[1]]}, {a: [[2, 3]]});
    expect(formFuncs.isEqual(result, {a: [[2, 3]]}, {deep: true})).toBeTruthy();

    result = formFuncs.mergeState({val: [1, 2, 3, 4]}, {val: {1: 5}}, {arrays: 'merge'});
    expect(formFuncs.isEqual(result.state.val, [1, 5, 3, 4])).toBeTruthy();

    result = formFuncs.mergeState({val: [1, 2, 3, 4]}, {val: {length: 1}});
    expect(formFuncs.isEqual(result.state.val, [1])).toBeTruthy();

    let replaceObj = {a: {b: {c: 1}}, d: 5};
    let obj2replace = {d: 2};
    result = formFuncs.mergeState(replaceObj, {a: {b: obj2replace}}, {replace: {a: {b: true}}});
    // console.log(result.state.a.b)
    expect(result.state.a.b === obj2replace).toBeTruthy();
    expect(result.state.d === 5).toBeTruthy();
    expect(result.state.a.b.c === undefined).toBeTruthy();

    result = formFuncs.mergeState(replaceObj, obj2replace, {replace: true});
    expect(result.state === obj2replace).toBeTruthy();

    result = formFuncs.mergeState(replaceObj, {a: {}});
    expect(result.state === replaceObj).toBeTruthy();

    result = formFuncs.mergeState(obj, {val: undefined}, {del: true});
    expect(result.changes).toBeTruthy();
    expect(result.state).not.toEqual(obj);
    expect(result.state.hasOwnProperty('val')).toBeFalsy();
    expect(result.changes.val).toBe(undefined);

    result = formFuncs.merge(obj, {val: undefined});
    expect(result.val).toBe(undefined);

    result = formFuncs.mergeState({val: [1, 2, 3, 4]}, {val: [3, 4, 5]});
    expect(formFuncs.isEqual(result.state.val, [3, 4, 5])).toBeTruthy();

    result = formFuncs.merge.all(obj, [{val: undefined}, {val: {b: {c: 1}}}], {del: true});
    expect(obj.val.b.c).toEqual(result.val.b.c);
    expect(result.val.hasOwnProperty('a')).toBeFalsy();

    result = formFuncs.mergeState(obj, result, {diff: true, del: true});
    expect(obj.val.b).toEqual(result.state.val.b);
    expect(result.state.val.hasOwnProperty('a')).toBeFalsy();
    expect(result.changes.val.a).toBe(undefined);

    result = formFuncs.mergeState({a: 1}, {b: 2}, {diff: true});
    expect(formFuncs.isEqual(result.state, {b: 2})).toBeTruthy();
    expect(formFuncs.isEqual(result.changes, {a: undefined, b: 2})).toBeTruthy();

    result = formFuncs.mergeState([1, 2, 3, 4], [3, 4, 5], {arrays: 'merge'});
    expect(formFuncs.isEqual(result.state, [3, 4, 5])).toBeTruthy();

    result = formFuncs.mergeState([1, 2, 3, 4], {0: 3, 1: 4, 2: 5});
    expect(formFuncs.isEqual(result.state, [3, 4, 5, 4])).toBeTruthy();

    result = formFuncs.mergeState({val: [1, 2, 3, 4]}, {val: []});
    expect(formFuncs.isEqual(result.state.val, [])).toBeTruthy();

    let arr = [1, 2, 3, 4];
    result = formFuncs.mergeState({val: arr}, {val: [3, 4, 5]}, {arrays: 'concat'});
    expect(formFuncs.isEqual(result.state.val, [1, 2, 3, 4, 3, 4, 5])).toBeTruthy();
    expect(result.state.val !== arr).toBeTruthy();

    let newArr = {val: []};
    newArr.val.length = 3;
    newArr.val[1] = 8;
    result = formFuncs.mergeState({val: arr}, newArr, {arrays: 'merge'});
    expect(formFuncs.isEqual(result.state.val, [1, 8, 3])).toBeTruthy();
    expect(result.state.val).not.toEqual(arr);

    obj = {
      "array_1": [],
      "array_2": [[{"v1": 1, "v2": 2}, {"t1": 4, "t2": 5}]]
    };
    result = formFuncs.mergeState(undefined, obj, {del: true, arrays: 'merge'});
    expect(formFuncs.isEqual(result.state, obj, {deep: true})).toBeTruthy();

    let arr2 = [];
    result = formFuncs.mergeState(obj, {array_1: arr2});
    expect(result.state !== obj).toBeTruthy();
    expect(result.state.array_1 === arr2).toBeTruthy();

    result = formFuncs.mergeState(obj, {array_1: []}, {arrays: 'merge'});
    expect(result.state === obj).toBeTruthy();

    // result = formFuncs.mergeState(obj, {array_1: []});
    // expect(result.state === obj).toBeTruthy();

    result = formFuncs.mergeState(obj, {array_1: []}, {arrays: 'concat'});
    expect(result.state === obj).toBeTruthy();

    // let values = {"array_1": [[{"v1": 1, "v2": 2}, {"t1": 4, "t2": 5}]]};
    // let values2 = {"array_1": [[{"v11": 31, "v22": 12}, {"t12": 43, "t22": 15}]]};
    // let replace = {"array_1": {"0": {"0": true}}};
  });

});
