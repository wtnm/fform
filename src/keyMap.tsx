import {getCreateIn, getIn, isArray, isMergeable, isUndefined, objKeys, push2array} from './core/commonLib';
import {getSchemaPart, isSelfManaged, oneOfFromState, string2path, SymData} from './core/stateLib';
/*
function getKeyMapFromSchema(schema: jsJsonSchema, getState: () => StateType): any {
  return {
    key2path,
    path2key,
    flatten: mapObj.bind(null, path2key, key2path),
    unflatten: mapObj.bind(null, key2path, path2key),
  };

  function getKeyMap(schema: jsJsonSchema, track: Path = []) {
    function checkIfHaveKey(key: string) {if (keyMap.key2path.hasOwnProperty(key)) throw new Error(`Duplicate flatten name for ${key}`);}

    function mapPath2key(prefix: string, obj: any) {
      let result = {};
      objKeys(obj).forEach((val: string) => {
        if (typeof obj[val] == 'string') result[val] = prefix + obj[val];
        else result[val] = mapPath2key(prefix, obj[val])
      });
      return result
    }

    let schemaPart = getSchemaPart(schema, track, oneOfFromState(getState()));
    let keyMaps = getCreateIn(schemaStorage(schema), new Map(), SymData, 'keyMaps');
    if (keyMaps.get(schemaPart)) return keyMaps.get(schemaPart);
    if (schemaPart.type != 'object') return;
    let result = {};
    let fields = objKeys(schemaPart.properties || {});
    let keyMap = getCreateIn(result, {key2path: {}, path2key: {}}, SymData, 'keyMap');
    if (schemaPart.ff_props && schemaPart.ff_props.flatten) keyMap.prefix = schemaPart.ff_props.flatten !== true && schemaPart.ff_props.flatten || '';

    fields.forEach(field => {
      let keyResult = getKeyMap(schema, track.concat(field));
      let objKeyMap = getIn(keyResult, [SymData, 'keyMap']) || {};
      if (!isUndefined(objKeyMap.prefix)) {  // if objKeyMap.prefix is exists it means that child is object
        objKeys(objKeyMap.key2path).forEach((key: any) => {
          checkIfHaveKey(objKeyMap.prefix + key);
          keyMap.key2path[objKeyMap.prefix + key] = [field].concat(objKeyMap.key2path[key]);
        });
        keyMap.path2key[field] = mapPath2key(objKeyMap.prefix, objKeyMap.path2key)
      } else if (!isUndefined(keyMap.prefix)) {
        checkIfHaveKey(field);
        keyMap.key2path[field] = field;
        keyMap.path2key[field] = field;
      }
    });
    keyMaps.set(schemaPart, result);
    return result;
  }

  function key2path(keyPath: string | Path): Path {
    if (typeof keyPath == 'string') keyPath = string2path(keyPath);
    let result: Path = [];
    keyPath.forEach((key) => {
      let path = getIn(getKeyMap(schema, result), [SymData, 'keyMap', 'key2path', key]);
      result = push2array(result, path ? path : key);
    });
    return result;
  }

  function path2key(path: Path): Path {
    let result: Path = [];
    let i = 0;
    while (i < path.length) {
      let key = path[i];
      let path2key = getIn(getKeyMap(schema, path.slice(0, i)), [SymData, 'keyMap', 'path2key']);
      if (path2key) {
        let j = 0;
        while (1) {
          if (path2key[key]) {
            if (typeof path2key[key] == 'string') {
              key = path2key[key];
              i += j;
              break;
            } else {
              path2key = path2key[key];
              j++;
              key = path [i + j];
            }
          } else {
            key = path [i];
            break;
          }
        }
      }
      result.push(key);
      i++;
    }
    return result;
  }

  function mapObj(fnDirect: any, fnReverse: any, object: any, path: Path = []): any {
    if (!isMergeable(object)) return object;
    const result = isArray(object) ? [] : {};

    function recurse(value: any, track: Path = []) {
      let keys;
      if (isMergeable(value) && !isSelfManaged(getState(), (fnDirect == key2path ? key2path(track) : track))) {//!isSchemaSelfManaged(getSchemaPart(schema, (fnDirect == key2path ? key2path(track) : track), oneOfFromState(getState)))) { //
        keys = objKeys(value);
        keys.forEach(key => recurse(value[key], track.concat(key)))
      }
      if (!(keys && keys.length) && isUndefined(getIn(getKeyMap(schema, (fnDirect == key2path ? key2path(track) : track)), [SymData, 'keyMap', 'prefix']))) {
        let tmp = result;
        let path = fnDirect(track);
        for (let i = 0; i < path.length - 1; i++) {
          let field = path[i];
          if (!tmp[field]) tmp[field] = isArray(getIn(object, fnReverse(path.slice(0, i + 1)))) ? [] : {};
          tmp = tmp[field];
        }
        if (path.length) tmp[path.pop()] = value;
      }
    }

    recurse(object, path);
    return result;
  }
}**/

/*

  it('test flattenObject getKeyMapFromSchema', function () {
    let testObject = require('./schema.js').default;
    let mapData = stateFuncs.getKeyMapFromSchema(testObject, () => {});
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
    let mapData = stateFuncs.getKeyMapFromSchema(testObject, () => {});
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

 */