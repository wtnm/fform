const objKeys = Object.keys;
const isArr = Array.isArray;
const isUndefined = (value: any) => typeof value === 'undefined';


const _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
  ? (obj: any) => typeof obj
  : (obj: any) => obj && typeof Symbol === "function" && obj.constructor === Symbol
    ? "symbol"
    : typeof obj;

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
function is(x: any, y: any) {
  // SameValue algorithm
  if (x === y) { // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    return x !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
  }
}

function isEqual(objA: any, objB: any, options: IsEqualOptions = {}) {
  if (is(objA, objB)) return true;

  if ((isUndefined(objA) ? 'undefined' : _typeof(objA)) !== 'object' || objA === null || (isUndefined(objB) ? 'undefined' : _typeof(objB)) !== 'object' || objB === null)
    return false;
  const fn = options.symbol ? objKeysNSymb : objKeys;
  const keysA = fn(objA);
  const keysB = fn(objB);

  if (keysA.length !== keysB.length) return false;

  const {skipKeys = [], deepKeys = []} = options;
  for (let i = 0; i < keysA.length; i++) {
    if (~skipKeys.indexOf(keysA[i])) continue;     // if key is an skip key, skip comparison

    if (options.deep || ~deepKeys.indexOf(keysA[i])) {
      const result = isEqual(objA[keysA[i]], objB[keysA[i]], options);
      if (!result) return false;
    } else if (!objB.hasOwnProperty(keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }
  return true;
}

function objKeysNSymb(obj: any): Array<string> {
  let result: any[] = objKeys(obj);
  return result.concat(Object.getOwnPropertySymbols(obj))
}

function getSlice(store: any, path: PathSlice, track: PathSlice = []): StateType {
  return makeSlice(path, getIn(store, path))
}


function asNumber(value: any) {
  if (value === "") return null;
  if (/\.$/.test(value)) return value; // "3." can't really be considered a number even if it parses in js. The user is most likely entering a float.
  if (/\.0$/.test(value)) return value; // we need to return this as a string here, to allow for input like 3.07
  const n = Number(value);
  const valid = typeof n === "number" && !Number.isNaN(n);
  if (/\.\d*0$/.test(value)) return value; // It's a number, that's cool - but we need it as a string so it doesn't screw with the user when entering dollar amounts or other values (such as those with specific precision or number of significant digits)
  return valid ? n : value;
}

function push2array(array: any[], ...vals: any[]): any {
  for (let i = 0; i < vals.length; i++) {
    if (isArr(vals[i])) array.push(...vals[i]);
    else array.push(vals[i])
  }
  return array
}


function moveArrayElems(arr: any, from: number, to: number): Array<any> {
  let length = arr.length;
  if (length) {
    from = (from % length + length) % length;
    to = (to % length + length) % length;
  }
  let elem = arr[from];
  for (let i = from; i < to; i++) arr[i] = arr [i + 1]
  for (let i = from; i > to; i--) arr[i] = arr [i - 1]
  arr[to] = elem;
  return arr
}

function makeSlice(...pathValues: any[]): StateType {
  const result = {};
  let obj = result;
  const lastI = pathValues.length - 2;
  if (!lastI && isArr(pathValues[0]) && !pathValues[0].length) return pathValues[1];
  for (let i = 0; i < pathValues.length - 1; i++) {
    let path = pathValues[i];
    if (!isArr(path)) path = [path];
    for (let j = 0; j < path.length; j++) {
      if (path[j] == '#') continue;
      obj[path[j]] = (i == lastI && j == path.length - 1) ? pathValues[pathValues.length - 1] : {};
      obj = obj[path[j]];
    }
  }
  return result;
}

function delIn(state: StateType, path: Path) {
  if (path[0] == '#') path = path.slice(1);
  if (!path.length) return state;
  const keys = typeof path[0] == 'string' ? path[0].split(',') : [path[0]];
  const newPath = path.slice(1);
  if (newPath.length) {
    keys.forEach((key: any) => {
      let newObj;
      if (isMergeable(state[key])) newObj = delIn(state[key], newPath);
      if (newObj && (newObj !== state[key])) state = merge(merge(state, makeSlice(key, undefined)), makeSlice(key, newObj))
    })
  } else {
    for (let i = 0; i < keys.length; i++) {
      if (state.hasOwnProperty(keys[i])) {
        state = Object.assign({}, state);
        break
      }
    }
    for (let i = 0; i < keys.length; i++) delete state[keys[i]]
  }
  return state
}


function getIn(state: any, ...paths: any[]): any {
  let res = state;
  for (let i = 0; i < paths.length; i++) {
    let track = paths[i];
    if (typeof track === 'function') track = track(res);
    if (!isArr(track)) track = [track];
    for (let j = (i == 0 && track[0] === '#' ? 1 : 0); j < track.length; j++) {
      if (res === undefined) return res;
      let l_path = track[j];
      res = res[l_path];
    }
  }
  return res;
};


function mergeState(state: any, source: any, options: MergeStateOptionsArgument = {}): MergeStateResult {
  const fn = options.noSymbol ? objKeys : objKeysNSymb;
  // let arrayMergeFn: any = false;
  const {SymbolDelete, del, diff, replace, arrays = 'replace'} = options;
  let forceReplace: any = replace;
  if (typeof forceReplace !== 'function') {
    if (!isMergeable(replace)) forceReplace = () => false;
    else forceReplace = (path: any) => getIn(replace, path)
  }
  if (replace === true || forceReplace([]) === true) return {state: source, changes: state !== source ? source : undefined};
  const mergeArrays = arrays != 'replace';
  const setLength = arrays == 'merge';
  const concatArray = arrays == 'concat';


  // if (typeof mergeArrays === 'function') arrayMergeFn = mergeArrays;
  const canMerge = mergeArrays === true ? isMergeable : isObject;

  function recusion(state: any, source: any, track: Path = []): MergeStateResult {
    const changes: any = {};
    const isSourceArray = isArr(source);
    // const forceReplace = getIn(replace, track) || {}; // force replace for mergeable object instead of merge
    // console.log('forceReplace', forceReplace)
    if (!isMergeable(state)) {
      state = isSourceArray ? [] : {};  // return only objects
      if (isArr(state) && setLength) changes.length = 0;
    }
    const isStateArray = isArr(state);
    if (!isMergeable(source)) return {state};  // merge only mergeable objects, may be throw here

    let stateKeys = fn(state);
    if (stateKeys.length == 0 && !del) {
      if (!isStateArray && !isSourceArray)
        return fn(source).length ? {state: source, changes: source} : {state};
      if (isStateArray && isSourceArray) {
        if (state.length == source.length && source.length == 0) return {state};
        return (fn(source).length || source.length !== state.length) ? {state: source, changes: source} : {state};
      }
    }
    let srcKeys = fn(source);

    const changedObjects: any = {};
    const result = (isStateArray ? [] : {}); //
    if (diff) {
      stateKeys.forEach(key => {
        if (!~srcKeys.indexOf(key))
          changes[key] = SymbolDelete;
      });
    }
    if (isStateArray && isSourceArray) {
      if (concatArray) {
        if (!source.length) return {state};
        let srcPrev = source;
        if (!del) {
          srcPrev.forEach((item: any, idx: number) => changes[state.length + idx] = item);
          srcKeys = []
        } else {
          source = [];
          srcPrev.forEach((item: any, idx: number) => source[state.length + idx] = item);
          srcKeys = fn(source)
        }
      }
      if (setLength && state.length != source.length) changes.length = source.length;
    }

    srcKeys.forEach(key => {
      if (del && source[key] === SymbolDelete) {
        if (state.hasOwnProperty(key)) changes[key] = SymbolDelete;
      } else {
        let keyTrack = track.concat(key);
        if (!canMerge(source[key]) || !canMerge(state[key]) || forceReplace(keyTrack) === true) {
          if (!state.hasOwnProperty(key) || !is(state[key], source[key])) changes[key] = source[key];
        } else {
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
    if (changesKeys.length == 0 && changedObjKeys.length == 0) return {state};
    else {
      Object.assign(result, state);
      changesKeys.forEach(key => {
        if (del && changes[key] === SymbolDelete || diff && !source.hasOwnProperty(key)) delete result[key];
        else result[key] = changes[key];
      });
      changedObjKeys.forEach(key => {
        result[key] = changedObjects[key].state;
        changes[key] = changedObjects[key].changes
      });
      return {state: result, changes}
    }
  }

  return recusion(state, source)
}

const merge: any = (a: any, b: any, opts: MergeStateOptionsArgument = {}) => mergeState(a, b, opts).state;

merge.all = function (state: any, obj2merge: any[], options: MergeStateOptionsArgument = {}) {
  if (obj2merge.length == 0) return state;  // no changes should be done
  else return obj2merge.reduce((prev, next) => merge(prev, next, options), state);  // merge
};

function isObject(val: any) {
  return isMergeable(val) && !isArr(val)
}

function isMergeable(val: any) {
  const nonNullObject = val && typeof val === 'object';

  return nonNullObject
    && Object.prototype.toString.call(val) !== '[object RegExp]'
    && Object.prototype.toString.call(val) !== '[object Date]'
}


function memoize(fn: any) {
  fn.cache = new Map();
  return function (...args: any[]) {
    let newArgs = [args.length].concat(args);
    let cache = fn.cache;
    let last = newArgs.pop();
    for (let i = 0; i < newArgs.length; i++) {
      cache.has(newArgs[i]) || cache.set(newArgs[i], new Map());
      cache = cache.get(newArgs[i]);
    }
    if (!cache.has(last)) cache.set(last, fn.apply(this, args));
    return cache.get(last);
  };
}


function getByKey(obj: any, keys: Array<string | number | symbol> | string | number | symbol, value: any = {}) {
  if (!isArr(keys)) keys = [keys];
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] == '#') continue;
    if (!obj.hasOwnProperty(keys[i])) obj[keys[i]] = (i == keys.length - 1) ? value : {};
    obj = obj[keys[i]];
  }
  return obj;
}

function not(val: any) {
  return !val
}

export {not, mergeState, merge, getByKey, push2array, asNumber, isEqual, isObject, isMergeable, objKeysNSymb, moveArrayElems, delIn, getIn, getSlice, makeSlice, memoize};
export {objKeys, isArr, isUndefined}

