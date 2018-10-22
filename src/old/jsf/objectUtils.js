'use strict';

const objKeys = Object.keys;
const arrFrom = Array.from;
const isArr = Array.isArray;

function object() {
  const args = arrFrom(arguments);
  let result = [];
  for (let i = 0; i + 1 < args.length; i += 2) {
    let x = args[i];
    if (typeof x != 'number' || x < 0 || x % 1 != 0) result = {};
  }
  for (let i = 0; i + 1 < args.length; i += 2) result[args[i]] = args[i + 1];
  return result;
};


function merge() {
  const args = arrFrom(arguments);
  const result = args.every(Array.isArray) ? [] : {};
  //objKeys(args).forEach(key => objKeys(args[key]).forEach(key2 => result[key2] = args[key][key2]));
  let i, obj, key;
  objKeys(args).forEach(i =>{
    obj = args[i];
    if(obj) objKeys(obj).forEach(key=> result[key] = obj[key])
  });
  return result;
};


function getIn(root, path) {
  if (path.length == 0 || root == undefined)
    return root;
  else
    return getIn(root[path[0]], path.slice(1))
};


function setIn(root, path, value) {
  if (path.length == 0)
    return value;
  else {
    let child = (root == null) ? null : root[path[0]];
    value = setIn(child || [], path.slice(1), value);
    return merge(root, object(path[0], value));
  }
};


function without(obj, ...rest) {
  const args = arrFrom(rest); // [].slice.call(arguments);
  const result = isArr(obj) ? [] : {};
  objKeys(obj).forEach(key => {
    if (!~args.indexOf(key)) result[key] = obj[key]
  });
  return result;
};

function prune(root) {
  let result, isArray;
  if (root == null || root === '') result = null;
  else if (isArr(root) || root.constructor === Object) {
    isArray = isArr(root);
    result = isArray ? [] : {};
    objKeys(root).forEach(key => {
      let val = prune(root[key]);
      if (val != null) {
        if (isArray) result.push(val); else result[key] = val;
      }
    });
    if (objKeys(result).length == 0) result = null;
  } else result = root;
  return result;
};


function split (test, obj) {
  const passed = {};
  const wrong = {};

  objKeys(obj).forEach(key => {
    let val = obj[key];
    if (test(key, val)) passed[key] = val;
    else wrong[key] = val;
  });

  return [passed, wrong];
};


function map (fn, obj) {
  return objKeys(obj).map(key => fn(obj[key]));
};


function mapKeys (fn, obj) {
  const output = {};
  objKeys(obj).map(key => output[fn(key)] = obj[key]);
  return output;
};


module.exports = {
  object,
  merge,
  without,
  getIn,
  setIn,
  prune,
  split,
  map,
  mapKeys
};
