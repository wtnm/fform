import * as React from 'react';

//const React = require('preact');
import {asNumber, toArray, deArray, setIn, getIn, isArray, isEqual, isObject, isMergeable, isString, isUndefined, isFunction, makeSlice, merge, mergeState, objKeys, push2array, memoize} from "./commonLib";
import {
  arrayStart,
  isSelfManaged,
  path2string,
  string2path,
  SymData,
  SymDelete,
  stateUpdates,
  normalizePath,
  objMap,
  setUPDATABLE,
  mergeStatePROCEDURE,
  branchKeys,
  isNPath,
  multiplyPath,
} from './stateLib'
import {FFormStateAPI, fformCores, objectResolver, formReducer} from './api'
import Timeout = NodeJS.Timeout;


/////////////////////////////////////////////
//  Main class
/////////////////////////////////////////////
class FForm extends React.Component<any, any> {
  private _unsubscribe: any;
  private _savedState: any;
  private _savedValue: any;
  _root: any;

  api: any;
  formName: any;
  schema: any;
  utils: any;
  objects: any;
  parent: any;

  constructor(props: FFormProps, context: any) {
    super(props, context);
    const self = this;
    let {core: coreParams, noInitValidate} = props;

    self.api = coreParams instanceof FFormStateAPI ? coreParams : self._getCoreFromParams(coreParams, context);
    self.parent = props.parent;
    // self.focus = self.focus.bind(self);
    self._updateValues(props);
    if (!noInitValidate) self.api.validate(true);
    self._unsubscribe = self.api.addListener(self._handleStateUpdate.bind(self));
    self._setRef = self._setRef.bind(self);
    self._submit = self._submit.bind(self);
    self._getPath = self._getPath.bind(self);
    Object.defineProperty(self, "objects", {get: () => self.api.props.objects});
  }

  private _setRef(FField: any) {
    this._root = FField;
  }

  _updateValues(nextProps: FFormProps, prevProps: any = {}) {
    const {state, value, inital, extData, noValidate} = nextProps;
    const self = this;
    if (state && state !== prevProps.state) self.api.setState(state);
    if (inital && inital !== prevProps.inital) self.api.setValue(inital, {inital: true, noValidate});
    if (value && value !== prevProps.value) self.api.setValue(value, {noValidate});
    if (extData && extData !== prevProps.extData) objKeys(extData).forEach(key => (self.api.set(key, (extData as any)[key], {replace: true})));
  }

  _handleStateUpdate(state: StateType) {
    const self = this;
    if (self._savedState == state) return;
    self._savedState = state;
    if (self.props.onStateChange) self.props.onStateChange(state, self);
    if (state[SymData].current !== self._savedValue) {
      self._savedValue = state[SymData].current;
      if (self.props.onChange) self.props.onChange(self._savedValue, self)
    }
    if (self._root) self._root.setState({branch: state});
  }

  _submit() {
    const self = this;
    self.api.set('/@untoched', 0, {execte: true, macros: 'switch'});
    if (self.props.onSubmit) return self.props.onSubmit(self._savedValue, self)
  }

  _getCoreFromParams(coreParams: any, context: any) {
    if (isUndefined(coreParams.store) && context.store) return new FFormStateAPI(merge(coreParams, {store: context.store}));
    else return new FFormStateAPI(coreParams);
  }

  shouldComponentUpdate(nextProps: FFormProps) {
    const self = this;
    self.parent = nextProps.parent;
    let core = nextProps.core;
    let FFrormApiUpdate = false;

    if (core instanceof FFormStateAPI && self.api !== core) {
      self._unsubscribe();
      self.api = core;
      self._unsubscribe = self.api.addListener(self._handleStateUpdate.bind(self));
      FFrormApiUpdate = true;
    }

    self._updateValues(nextProps, self.props);
    return FFrormApiUpdate || !isEqual(self.props, nextProps, {skipKeys: ['core', 'state', 'value', 'inital', 'extData', 'fieldCache', 'flatten', 'noValidate', 'parent', 'onSubmit', 'onChange', 'onStateChange']});
  }

  componentWillUnmount() {
    if (this._unsubscribe) this._unsubscribe();
  }

  // focus(path: Path | string): void {
  //   if (this._root) this._root.focus(normalizePath(path));
  // };

  getRef(path: Path | string) {
    return this._root && this._root.getRef(path)
  }

  _getPath() {
    return '#';
  }

  getDataObject(branch: any, ffield: FField) {
    return getIn(branch, SymData)
  }

  getValue(branch: any, ffield: FField) {
    if (isSelfManaged(branch)) return getIn(branch, SymData, 'value');
    else return this.api.getValue({path: ffield.path})
  }

  getBranch(path: string) {
    return this.api.get(path)
  }

  render() {
    const self = this;
    let {core, state, value, inital, extData, fieldCache, noInitValidate, parent, onSubmit, onChange, onStateChange, useTag: UseTag = 'form', ...rest} = self.props;

    return (
      <UseTag {...rest} onSubmit={self._submit}>
        <FField ref={self._setRef} id={rest.id ? rest.id + '/#' : undefined} name={self.api.name} pFForm={self} getPath={self._getPath} FFrormApi={self.api}/>
      </UseTag>
    )
  }
}

class FRefsGeneric extends React.Component<any, any> {
  $refs: any = {};

  constructor(props: any, context: any) {
    super(props, context);
    const self = this;
    self._setRef = self._setRef.bind(self);
    // self._refProcess = self._refProcess.bind(self);
  }

  getRef(path: Path) {
    const self = this;
    if (!path.length) return self;
    if (path.length == 1 && !self.$refs[path[0]].getRef) return self.$refs[path[0]];
    return self.$refs[path[0]] && self.$refs[path[0]].getRef && self.$refs[path[0]].getRef(path.slice(1));
  }

  protected _setRef(name: string) {
    const self = this;
    return (v: any) => self.$refs[name] = v
  }

  protected _refProcess(defaultName: string, $reactRef: any) {
    const self = this;
    if ($reactRef === true) return self._setRef(defaultName);
    else if (isString($reactRef)) return self._setRef($reactRef);
    else if (isMergeable($reactRef))
      return objMap($reactRef, self._refProcess.bind(self, defaultName));
    return $reactRef;
  }
}


/////////////////////////////////////////////
//  FField class
/////////////////////////////////////////////
class FField extends FRefsGeneric {
  private _mappedData: any = {};
  private _builderData: any = {};
  private _rebuild = true;
  private _cached?: { value: any };
  private _cachedTimeout?: Timeout;
  // private _enumOptions: any;
  private _isNotSelfManaged: boolean | undefined;
  private _blocks: string[] = [];
  private _widgets: object;
  private _ff_components: object;
  private _maps: NPM4WidgetsType;
  private _$_parse: any;


  ff_layout: FFLayoutGeneric<jsFFCustomizeType>;
  $branch: any;
  schemaPart: jsJsonSchema;

  liveValidate: boolean;
  path: any;
  api: any;
  pFForm: any;

  constructor(props: any, context: any) {
    super(props, context);
    const self = this;
    Object.defineProperty(self, "path", {get: () => self.props.getPath()});
    Object.defineProperty(self, "pFForm", {get: () => self.props.pFForm});
    Object.defineProperty(self, "liveValidate", {get: () => getIn(self.getData(), 'params', 'liveValidate')});
    Object.defineProperty(self, "value", {get: () => self.props.pFForm.getValue(self.state.branch, self)});
    if (self.pFForm.api) self._apiWrapper();
    self.state = {branch: self.pFForm.getBranch(self.path)};
    self.$branch = self.state.branch;
    self._bind2self = self._bind2self.bind(self);
    self._build();
  }

  // focus(path: Path) {
  //   const self = this;
  //   self.$refs['Main'] && self.$refs['Main'].focus && self.$refs['Main'].focus(path); // path.length ? self.$refs.focus(path) : self.$refs.focus();
  // }

  getRef(path: Path | string) {
    path = normalizePath(path);
    const self = this;
    if (!path.length) return self.$refs['@Main'];
    if (path[0][0] == '@') return path.length == 1 ? self.$refs[path[0]] : self.$refs[path[0]].getRef(path.slice(1));
    return self.$refs['@Main'] && self.$refs['@Main'].getRef && self.$refs['@Main'].getRef(path)
  }

  _resolver(obj: any) {
    const self = this;
    let result = objectResolver(self.pFForm.objects, obj, true);
    return result[SymData] ? merge(result, self._bind2self(result[SymData])) : result;
  }

  _updateCachedValue() {
    const self = this;
    self._cachedTimeout = undefined;
    if (self._cached) {
      self.props.pFForm.api.setValue(self._cached.value, {noValidation: !self.liveValidate, path: self.path});
      self._cached = undefined;
    }
  }

  _cacheValue(path: any, value: any, setValue = false): boolean {
    const self = this;
    let fieldCache = self.pFForm.props.fieldCache;
    if (isUndefined(fieldCache) || fieldCache === true) fieldCache = 40;

    let valueSet = setValue && (!path || path == './' || path == '.');
    if (!valueSet) {
      let fPath = self.path;
      path = '#/' + path2string(normalizePath(path, self.path)) + (setValue ? '/@/value' : '');
      valueSet = (path == fPath + '/@/value') || (path == '#/@/current/' + fPath.slice(2));
    }
    if (valueSet) {
      self._cached = {value: self._parseValue(value)};
      if (fieldCache) {
        if (self._cachedTimeout) clearTimeout(self._cachedTimeout);
        self._cachedTimeout = setTimeout(self._updateCachedValue.bind(self), fieldCache);
        const data = merge(self.getData(), {value: self._cached.value});
        const mappedData = self._mappedData;
        self._setMappedData(self.getData(), data, true);
        if (mappedData != self._mappedData) self.forceUpdate();
      } else self._updateCachedValue();
      return true;
    }
    return false;
  }

  _apiWrapper() {
    const self = this;
    const api = self.props.pFForm.api;
    const wrapPath = (path: string | Path = []) => normalizePath(path, self.path);
    const wrapOpts = (opts: any = {}) => {
      const {path, noValidation, ...rest} = opts;
      if (!isUndefined(path)) rest.path = wrapPath(path);
      rest.noValidation = isUndefined(noValidation) ? !self.liveValidate : noValidation;
      return rest;
    };

    self.api = {
      validate: (path: boolean | string | Path = './', ...args: any[]) => api.validate(typeof path == 'boolean' ? path : wrapPath(path), ...args),
      get: (...path: any[]) => api.get(wrapPath(path)),
      set: (path: string | Path = [], value: any, opts?: any, ...args: any[]) => self._cacheValue(path, value) || api.set(wrapPath(path), value, wrapOpts(opts), ...args),
      setValue: (value: any, opts: any = {}, ...args: any[]) => self._cacheValue(opts.path, value, true) || api.setValue(value, wrapOpts(opts), ...args)
    };
    ['noExec', 'execute', 'setState', 'getActive',].forEach(fn => self.api[fn] = (...args: any[]) => api[fn](...args));
    ['arrayAdd', 'arrayItemOps', 'setHidden', 'showOnly', 'getSchemaPart']
      .forEach(fn => self.api[fn] = (path: string | Path = [], ...args: any[]) => api[fn](wrapPath(path), ...args));
    ['getValue', 'getDefaultValue', 'reset', 'clear'].forEach(fn => self.api[fn] = (opts: any, ...args: any[]) => api[fn](wrapOpts(opts), ...args));
  }

  _parseValue(value: any) {
    const $_parse = this._$_parse;
    if ($_parse) return deArray(toArray($_parse.$).reduce((args, fn) => toArray(fn(...args)), $_parse.args || []), $_parse.arrayResult);
    return value
  }

  _bind2self(obj: any) {
    const result = isArray(obj) ? [] : {};
    objKeys(obj).forEach(key => {
      if (typeof obj[key] == 'function') result[key] = obj[key].bind(this, ...(isArray(obj[key + '.bind']) ? obj[key + '.bind'] : []));
      else if (key.substr(-5) == '.bind') return;
      else if (isMergeable(obj[key])) result[key] = this._bind2self(obj[key])
    });
    return result
  }

  _build() {
    const self = this;
    const schemaPart: jsJsonSchema = self.api.getSchemaPart(self.path);
    const funcs: any = {};

    self.schemaPart = schemaPart;

    self._isNotSelfManaged = !isSelfManaged(self.state.branch) || undefined;
    if ((isArray(schemaPart.type) || isUndefined(schemaPart.type)) && !schemaPart.ff_presets) throw new Error('schema.ff_presets should be defined explicitly for multi type');
    let components = resolveComponents(self.pFForm.objects, schemaPart.ff_custom, schemaPart.ff_presets || schemaPart.type);
    components = components[SymData] ? merge(components, self._bind2self(components[SymData])) : components;
    const {$_parse, ...ff_components} = components;
    self._$_parse = $_parse && (isObject($_parse) ? $_parse : {'$': $_parse});
    self._ff_components = ff_components;
    const ff_layout = resolveComponents(self.pFForm.objects, schemaPart.ff_layout);
    self.ff_layout = ff_layout[SymData] ? merge(ff_layout, self._bind2self(ff_layout[SymData])) : ff_layout;

    // self._enumOptions = getEnumOptions(schemaPart);
    self._widgets = {};
    const {$_maps, rest: comps} = extractMaps(self._ff_components);
    self._maps = normalizeMaps($_maps);

    self._blocks = objKeys(comps).filter(key => comps[key]);
    self._blocks.forEach((block: string) => {
      //let {$_maps, rest} = extractMaps(comps[block]);
      const {_$widget, $_reactRef, ...staticProps} = comps[block];
      if (!_$widget) throw new Error('_$widget for "' + block + '" is empty in path "' + self.path + '"');
      self._widgets[block] = _$widget;
      if ($_reactRef) { // $_reactRef - prop for react ref-function
        const $ref = self._refProcess('@' + block, $_reactRef);
        staticProps[isFunction($ref) ? 'ref' : '$_reactRef'] = $ref;
      }

      self._mappedData[block] = staticProps;  // properties, without reserved names      
    });
    self._setMappedData(undefined, self.getData(), 'build');
    self._rebuild = false;
  }

  // todo: sample schema mount tests
  // todo: manual
  // todo: SSR support
  // todo: lazy schema compilation?


  _setMappedData(prevData: any, nextData: any, fullUpdate: boolean | 'build') {
    const self = this;
    const _mappedData = updateProps(self._mappedData, prevData, nextData, fullUpdate == 'build' && self._maps.build, fullUpdate && self._maps.data, self._maps.every);
    if (self._mappedData != _mappedData) {
      self._mappedData = _mappedData;
      return true
    }
    return false
  }

  getData(branch: any = getIn(this, 'state', 'branch')) {
    return this.pFForm.getDataObject(branch, this)
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    if (isUndefined(nextState.branch)) return true;
    const self = this;
    self.$branch = nextState.branch;
    let updateComponent = false;

    if (!isEqual(nextProps, self.props)) return (self._rebuild = true);

    const nextData = self.getData(getIn(nextState, 'branch'));
    const prevData = self.getData();
    if (getIn(nextData, 'oneOf') !== getIn(prevData, 'oneOf')) return (self._rebuild = true);

    updateComponent = self._setMappedData(prevData, nextData, nextData !== prevData) || updateComponent;
    updateComponent = updateComponent || getIn(nextData, 'params', 'norender') !== getIn(prevData, 'params', 'norender');
    return updateComponent
  }

  render() {
    const self = this;
    if (isUndefined(self.state.branch)) return null;
    if (getIn(self.getData(), 'params', 'norender')) return false;
    if (self._rebuild) this._build();
    const BuilderWidget = self._widgets['Builder'];
    return <BuilderWidget {...self._mappedData['Builder']} mapped={self._mappedData}/>
  }
}

//enumOptions={self._enumOptions}

/////////////////////////////////////////////
//  Section class
/////////////////////////////////////////////
class FSectionWidget extends React.Component<any, any> { // need to be class, as we use it's forceUpdate() method
  refs: any;

  _cn(props: any) {
    if (!props) return props;
    if (this.props._$cx && props.className && !isString(props.className)) {
      if (isString(this.props._$widget)) return {...props, className: this.props._$cx(props.className)};
      else return {_$cx: this.props._$cx, ...props}
    }
    return props;
  }

  render() {
    const props = this._cn(this.props.getMappedData());
    return React.createElement(this.props._$widget, props, this.props.children || props.children);
  }
}

class FSection extends FRefsGeneric {
  private _arrayStart: number = 0;
  private _rebuild = true;
  private _focusField: string = '';
  private _arrayKey2field: { [key: string]: number } = {};
  private _widgets: { [key: string]: any } = {};
  private _objectLayouts: any[] = [];
  private _arrayLayouts: any[] = [];
  private _setWidRef: any;
  private _maps: NPM4WidgetsType = {};
  private _mappedData: { [key: string]: any } = {};
  private _$widget: any;
  private _isArray: boolean = false;
  //private _setRef: any;
  //$refs: { [key: string]: any } = {};

  constructor(props: any, context: any) {
    super(props, context);
    const self = this;
    //self._setRef = (name: number | string) => (item: any) => self.$refs[name] = item;
    self._setWidRef = (key: number | string) => (item: any) => self._widgets[key] = item;
    self._build(self.props);
  }

  // focus(path: Path) {
  //   const self = this;
  //   let field;
  //   if (!path.length) {
  //     field = self.props.focusField;
  //     if (isUndefined(field)) field = self.props.isArray ? '0' : (branchKeys(self.props.$branch)[0] || '');
  //   } else {
  //     field = path[0].toString();
  //     path = path.slice(1);
  //   }
  //   if (self.props.isArray && field >= self.props.arrayStart) field = self._arrayIndex2key(self.props.$branch[field]) || field;
  //   if (self.$refs[field] && self.$refs[field].focus) self.$refs[field].focus(path)
  // }

  _getMappedData(key: number) {
    const self = this;
    return () => self._mappedData[key]
  }


  _build(props: any) {

    function makeLayouts_INNER_PROCEDURE(UPDATABLE: { counter: number, keys: string[] }, fields: Array<string | FFLayoutGeneric<jsFFCustomizeType>>) {
      const layout: any[] = [];
      fields.forEach(fieldOrLayout => {
        const {keys, counter} = UPDATABLE;
        if (isString(fieldOrLayout)) { // if field is string then _makeFField
          let idx = UPDATABLE.keys.indexOf(fieldOrLayout);
          if (~idx) {
            layout.push(self._makeFField(fieldOrLayout));
            UPDATABLE.keys.splice(idx, 1);
          }
        } else if (isObject(fieldOrLayout)) { // layout
          const counter = UPDATABLE.counter++;
          let {_$widget, $_fields} = normalizeLayout(counter, fieldOrLayout as FFLayoutGeneric<jsFFCustomizeType>);
          layout.push(<FSectionWidget _$widget={_$widget} _$cx={_$cx} key={'widget_' + counter} ref={self._setWidRef((counter))}
                                      getMappedData={self._getMappedData(counter)}>{$_fields && makeLayouts_INNER_PROCEDURE(UPDATABLE, $_fields)}</FSectionWidget>)
        }
      });
      return layout
    }

    function normalizeLayout(counter: number, layout: FFLayoutGeneric<jsFFCustomizeType>) {
      let {$_maps, rest} = extractMaps(layout, ['$_fields']);
      let {$_fields, $_reactRef, _$widget = LayoutDefaultWidget, className, ...staticProps} = rest;
      if (isUndefined(className) && $_fields) className = LayoutDefaultClass;
      staticProps.className = className;
      let refObject = self._refProcess('@widget_' + counter, $_reactRef) || {};
      if (isFunction(refObject)) refObject = {'ref': refObject};
      Object.assign(staticProps, refObject);
      let maps = normalizeMaps($_maps, counter.toString());
      mapsKeys.forEach(k => self._maps[k].push(...maps[k]));
      self._mappedData[counter] = staticProps;
      return {_$widget, $_fields}
    }

    const self = this;

    const {$branch, $layout, _$cx, arrayStart, LayoutDefaultWidget = 'div', LayoutDefaultClass = 'layout', uniqKey, focusField} = props;

    const mapsKeys = ['build', 'data', 'every'];
    mapsKeys.forEach(k => self._maps[k] = []);
    self.$refs = {};
    self._widgets = {};
    self._mappedData = {};
    self._objectLayouts = [];

    const UPDATABLE = {keys: self._getObjectKeys($branch), counter: 1};
    self._focusField = focusField || UPDATABLE.keys[0] || '';

    let {_$widget, $_fields} = normalizeLayout(0, isArray($layout) ? {$_fields: $layout} : $layout);
    self._$widget = _$widget;

    if ($_fields) self._objectLayouts = makeLayouts_INNER_PROCEDURE(UPDATABLE, $_fields);  // we get inital _objectLayouts and every key, that was used in makeLayouts call removed from keys 
    UPDATABLE.keys.forEach(fieldName => self._objectLayouts.push(self._makeFField(fieldName)));  // so here we have only keys was not used and we add them to _objectLayouts

    self._arrayLayouts = [];
    self._arrayKey2field = {};
    if (self.props.isArray) {  // _makeArrayLayouts
      for (let i = arrayStart; i < self.props.length; i++) {
        let arrayKey = self._arrayIndex2key($branch[i]);
        self._arrayLayouts.push(self._makeFField(i.toString(), arrayKey));
        arrayKey && (self._arrayKey2field[arrayKey] = i);
      }
    }
    self._mappedData = self._updateMappedData(undefined, self._getData($branch), 'build');
    self._rebuild = false;
  }

  _makeFField(fieldName: string, arrayKey?: string) {
    const self = this;
    return <FField ref={self._setRef(arrayKey || fieldName)} key={arrayKey || fieldName} pFForm={self.props.$FField.pFForm} FFormApi={self.props.FFormApi}
                   id={self.props.id ? self.props.id + (arrayKey || fieldName) : undefined}
                   name={self.props.name ? self.props.name + '[' + (self.props.isArray ? '' : fieldName) + ']' : undefined}
                   getPath={arrayKey ? self._getArrayPath.bind(self, arrayKey) : self._getObjectPath.bind(self, fieldName)}/>;
  }

  _arrayIndex2key($branch: any) {
    return this.props.uniqKey ? getIn(this._getData($branch), string2path(this.props.uniqKey)) : undefined;
  }

  _getObjectKeys($branch: StateType) {
    const self = this;
    let keys: string[] = [];
    if (self.props.isArray) for (let i = 0; i < self.props.arrayStart; i++) keys.push(i.toString());
    else keys = branchKeys($branch);
    return keys;
  }

  _getObjectPath(field: string) {
    return this.props.$FField.path + '/' + field;
  }

  _getArrayPath(key: string) {
    return this.props.$FField.path + '/' + this._arrayKey2field[key];
  }

  _getArrayField(key: any) {
    const self = this;
    return self._arrayLayouts[key - self.props.arrayStart]
  }

  _reorderArrayLayout(prevBranch: StateType, nextBranch: StateType, props: any) {
    const self = this;
    const updatedArray = [];
    let doUpdate = false;
    for (let i = props.arrayStart; i < props.length; i++) {
      let arrayKey = self._arrayIndex2key(nextBranch[i]);
      if (isUndefined(arrayKey)) throw new Error('no unique key provided for array item');
      if (self.$refs[arrayKey]) self.$refs[arrayKey].setState({branch: nextBranch[i]});
      let prevIndex = self._arrayKey2field[arrayKey];
      if (self._arrayKey2field[arrayKey] !== i) {
        self._arrayKey2field[arrayKey] = i;
        doUpdate = true
      }
      updatedArray.push(!isUndefined(prevIndex) ? self._getArrayField(prevIndex) : self._makeFField(i.toString(), arrayKey));
    }
    if (self._arrayLayouts.length !== updatedArray.length) doUpdate = true;
    if (doUpdate) self._arrayLayouts = updatedArray;
    return doUpdate;
  }

  _updateMappedData(prevData: any, nextData: any, fullUpdate: boolean | 'build' = prevData !== nextData) {
    const self = this;
    return updateProps(self._mappedData, prevData, nextData, fullUpdate == 'build' && self._maps.build, fullUpdate && self._maps.data, self._maps.every);
  }

  _getData(branch = this.props.$branch) {
    return this.props.$FField.getData(branch)
  }

  shouldComponentUpdate(nextProps: any) {
    const self = this;
    if (nextProps.FFormProps !== self.props.FFormProps) return self._rebuild = true;

    let doUpdate = !isEqual(nextProps, self.props, {skipKeys: ['$branch']});

    let prevBranch = self.props.$branch;
    let nextBranch = nextProps.$branch;

    if (prevBranch != nextBranch) {
      const newMapped = self._updateMappedData(self._getData(prevBranch), self._getData(nextBranch));
      if (newMapped != self._mappedData) { // update self._widgets
        const oldMapped = self._mappedData;
        self._mappedData = newMapped;
        objKeys(newMapped).forEach(key => self._widgets[key] && newMapped[key] != oldMapped[key] && self._widgets[key]['forceUpdate']());
      }
      // update object elements or if it _isArray elements that lower than self.props.arrayStart
      self._getObjectKeys(nextBranch).forEach(field => (nextBranch[field] !== prevBranch[field]) && self.$refs[field] && self.$refs[field].setState({branch: nextBranch[field]}));

      if (self.props.isArray) doUpdate = self._reorderArrayLayout(prevBranch, nextBranch, nextProps) || doUpdate; // updates and reorders elements greater/equal than self.props.arrayStart

    }

    return doUpdate; //|| !isEqual(self.props, nextProps, {skipKeys: ['$branch']});
  }

  getRef(path: Path) {
    const self = this;
    if (!self.props.isArray || isNaN(parseInt(path[0])) || path[0] < self.props.arrayStart) return super.getRef(path);
    let field = self._getArrayField(path[0]);
    return field && self.$refs[field.key].getRef(path.slice(1))
  }

  render() {
    const self = this;
    let props = self.props;
    if (props.viewer) {
      let {_$widget = UniversalViewer, ...rest} = props.viewerProps || {};
      rest.inputProps = props;
      rest.value = props.$FField.value;
      return React.createElement(_$widget, rest)
    }
    if (isSelfManaged(props.$branch)) return null;
    if (self._rebuild) self._build(props); // make rebuild here to avoid addComponentAsRefTo Invariant Violation error https://gist.github.com/jimfb/4faa6cbfb1ef476bd105
    return <FSectionWidget _$widget={self._$widget} _$cx={props._$cx} key={'widget_0'} ref={self._setWidRef((0))}
                           getMappedData={self._getMappedData(0)}>{self._objectLayouts}{self._arrayLayouts}</FSectionWidget>

  }
}


/////////////////////////////////////////////
//  Basic components
/////////////////////////////////////////////

class GenericWidget extends FRefsGeneric {
  private _children: any;
  private _reactRef: any;
  protected _mapped: any[];

  constructor(props: any, context: any) {
    super(props, context);
  }

  private _newWidget(key: any, obj: any, passedReactRef: anyObject = {}) {
    const {_$widget: Widget = GenericWidget, className, $_reactRef, ...rest} = obj;
    const self = this;
    let refObject = self._refProcess(key, $_reactRef) || {};
    if (isFunction(refObject)) refObject = {ref: refObject};
    if (isFunction(passedReactRef)) refObject.ref = passedReactRef;
    else Object.assign(refObject, passedReactRef);
    return <Widget key={key} className={isString(Widget) && this.props._$cx ? this.props._$cx(className) : className} _$cx={!isString(Widget) ? this.props._$cx : undefined} {...rest} {...refObject}/>
  }

  protected _mapChildren(children: any, $_reactRef: anyObject) {
    const self = this;
    if (children !== self._children || self._reactRef !== $_reactRef) {
      const prev = self._children && toArray(self._children);
      const next = children && toArray(children);
      self._mapped = next && next.map((ch: any, i: number) => !isObject(ch) || ch.$$typeof ? ch :
        ((!getIn(self._mapped, i) ||
          prev[i] !== next[i] ||
          getIn(self._reactRef, i) !== getIn($_reactRef, i)) ? self._newWidget(i, ch, getIn($_reactRef, i)) :
          self._mapped[i]));
      self._children = children;
      self._reactRef = $_reactRef
    }
  }

  protected setRef2rest(rest: anyObject, $_reactRef: anyObject) {
    if (!$_reactRef) return rest;
    if ($_reactRef['ref']) rest.ref = $_reactRef['ref'];
    if ($_reactRef['tagRef'])
      rest.tagRef = $_reactRef['tagRef'];
  }

  render(): any {
    const self = this;
    if (self.props.norender) return null;
    const {useTag: UseTag = 'div', _$cx, className, $_reactRef, children, ...rest} = self.props;
    self._mapChildren(children, $_reactRef);
    self.setRef2rest(rest, $_reactRef);
    return (<UseTag children={self._mapped} className={_$cx ? _$cx(className) : className} {...rest} />)
  }
}

function isEmpty(value: any) {
  return isMergeable(value) ? objKeys(value).length === 0 : value === undefined || value === null || value === "";
}

function toString(emptyMock: any, enumExten: any = {}, value: any): string {
  if (isEmpty(value)) return emptyMock;
  if (isArray(value)) return value.map(toString.bind(null, emptyMock, enumExten)).join(', ');
  value = getExten(enumExten, value).label || value;
  if (!isString(value)) return JSON.stringify(value);
  return value
}

function UniversalViewer(props: any) {
  let {useTag: UseTag = 'div', value, inputProps, _$cx, enumExten = {}, emptyMock = '(none)', ...rest} = props;
  if (rest.className && _$cx) rest.className = _$cx(rest.className);

  return React.createElement(UseTag, rest, toString(emptyMock, enumExten, value))
}


class UniversalInput extends GenericWidget {
  render() {
    const self = this;
    const props: any = self.props;
    if (props.viewer) {
      let {_$widget = UniversalViewer, ...rest} = props.viewerProps || {};
      rest.inputProps = props;
      rest.value = props.value;
      return React.createElement(_$widget, rest)
    }

    let {value, useTag: UseTag, type, $_reactRef, _$cx, viewer, viewerProps, children, ...rest} = props;

    self._mapChildren(children, $_reactRef);
    self.setRef2rest(rest, $_reactRef);

    if (type == 'textarea' || type == 'select') UseTag = UseTag || type;
    else {
      UseTag = UseTag || 'input';
      if (type !== 'notInput') rest.type = type;
    }
    if (type !== 'notInput') rest[type === 'checkbox' ? 'checked' : 'value'] = value;
    if (rest.value === null) rest.value = '';

    if (rest.className && _$cx) rest.className = _$cx(rest.className);
    return React.createElement(UseTag, rest, self._mapped)
  }
}


class Autowidth extends React.Component<any, any> {
  static readonly sizerStyle: any = {position: 'absolute', top: 0, left: 0, visibility: 'hidden', height: 0, overflow: 'scroll', whiteSpace: 'pre'};
  private _elem: any;

  componentDidMount() {
    const style = window && window.getComputedStyle(this.props.$FField.$refs['@Main']);
    if (!style || !this._elem) return;
    ['fontSize', 'fontFamily', 'fontWeight', 'fontStyle', 'letterSpacing'].forEach(key => this._elem.style[key] = style[key]);
  }

  render() {
    const self = this;
    const props = self.props;
    const value = (isUndefined(props.value) ? '' : props.value.toString()) || props.placeholder || '';
    return (<div style={Autowidth.sizerStyle as any} ref={(elem) => {
      (self._elem = elem) &&
      (props.$FField.$refs['@Main'].style.width = Math.max((elem as any).scrollWidth + (props.addWidth || 45), props.minWidth || 0) + 'px')
    }}>{value}</div>)
  }
}


function FBuilder(props: any) {
  const {mapped, widgets} = props;
  const {Title, Body, Main, Message, Wrapper, Autowidth} = widgets;

  return React.createElement(Wrapper, mapped['Wrapper'],
    Title ? React.createElement(Title, mapped['Title']) : '',
    React.createElement(Body, mapped['Body'],
      React.createElement(Main, mapped['Main']),
      Message ? React.createElement(Message, mapped['Message']) : '',
      Autowidth ? React.createElement(Autowidth, mapped['Autowidth']) : ''
    )
  )
}


function Wrapper(props: any) {
  let {useTag: WrapperW = 'div', _$cx = classNames, className, ArrayItemMenu, ArrayItemBody, arrayItem, ...rest} = props;
  const {_$widget: IBodyW = 'div', className: IBodyCN = {}, ...IBodyRest} = ArrayItemBody || {};
  const {_$widget: IMenuW = 'div', className: IMenuCN = {}, ...IMenuRest} = ArrayItemMenu || {};
  const result = <WrapperW className={_$cx ? _$cx(className) : className} {...rest} />;
  if (arrayItem) {
    return (
      <IBodyW className={_$cx ? _$cx(IBodyCN) : IBodyCN} {...IBodyRest}>
        {result}
        <IMenuW className={_$cx && _$cx(IMenuCN)} {...IMenuRest}/>
      </IBodyW>
    )
  } else return result
}


function ItemMenu(props: any) {
  const {useTag: UseTag = 'div', _$cx = classNames, className, buttonsProps = {}, arrayItem = {}, buttons = [], onClick: defaultOnClick, ...rest}: { [key: string]: any } = props;
  buttons.forEach((key: string) => delete rest[key]);
  return (
    <UseTag className={_$cx(className)} {...rest}>
      {buttons.map((key: string) => {
        const {_$widget: ButW = 'button', type = 'button', disabledCheck = '', className: ButCN = {}, onClick = defaultOnClick, title = key, children = key, ...restBut} = buttonsProps[key] || {};
        return (
          <ButW key={key} type={type} title={title} className={_$cx ? _$cx(ButCN) : ButCN} children={children} disabled={disabledCheck && !arrayItem[disabledCheck]} {...restBut} onClick={() => onClick(key)}/>)
      })}
    </UseTag>);
}


function CheckboxNull(props: any) {
  const self = this;
  let {checked, onChange, nullValue = null, tagRef, type, ...rest} = props;
  return <input type="checkbox" checked={checked === true} {...rest}
                onChange={(event: any) => {
                  onChange(checked === nullValue ? true : (checked === true ? false : nullValue), event)
                }}
                ref={elem => {
                  tagRef && tagRef(elem);
                  elem && (elem.indeterminate = (checked === nullValue))
                }}/>
}


///////////////////////////////
//     Functions
///////////////////////////////

const resolveComponents = memoize((fformObjects: formObjectsType, customizeFields: FFCustomizeType = {}, sets?: string): jsFFCustomizeType => {
  if (sets) {
    let $_ref = sets.split(':').map(v => v[0] != '^' && '^/sets/' + v).join(':') + ':' + (customizeFields.$_ref || '');
    customizeFields = merge(customizeFields, {$_ref});
  }
  return objectResolver(fformObjects, customizeFields, true);
});

function extractMaps(obj: any, skip: string[] = []) {
  let {$_maps, ...rest2extract} = obj;
  $_maps = {...$_maps};
  const rest: any = isArray(obj) ? [] : {};
  objKeys(rest2extract).forEach(key => {
    if (isMergeable(rest2extract[key]) && !~skip.indexOf(key)) {
      let res = extractMaps(rest2extract[key], skip);
      rest[key] = res.rest;
      objKeys(res.$_maps).forEach((nk) => $_maps[key + '/' + nk] = res.$_maps[nk]);
    } else rest[key] = rest2extract[key]
  });

  return {$_maps, rest};
}

const isMapFn = (arg: any) => isObject(arg) && arg.$;

function normalizeArgs(args: any) {
  let dataRequest = false;
  args = toArray(isUndefined(args) ? [] : args).map((arg: any) => {
    if (isString(arg) && arg[0] == '@') return (dataRequest = true) && normalizePath(arg.substr(1));
    if (isMapFn(arg)) {
      const res = normalizeArgs(arg.args);
      if (res.dataRequest) dataRequest = true;
      return {...arg, ...res};
    }
    return arg;
  });
  return {dataRequest, args}
}

function normalizeMaps($_maps: any, prePath = '') {
  const result: { data: NormalizedPropsMapType[], every: NormalizedPropsMapType[], build: NormalizedPropsMapType[] } = {data: [], every: [], build: []};
  objKeys($_maps).forEach(key => {
    const map = $_maps[key];
    if (!map) return;
    const to = multiplyPath(normalizePath((prePath ? prePath + '/' : '') + key));
    if (isMergeable(map)) {
      toArray(map).forEach(m => {
        const {update = 'data', replace = true, args = [], $, ...rest} = m;
        result[update].push({update, replace, $, to, ...rest, ...normalizeArgs(args)});
      })
    } else {
      let path = map;
      if (!isString(path)) throw new Error('$_maps value is not recognized');
      if (path[0] !== '@') console.warn('Expected "@" at the begining of string');
      else path = path.substr(1);
      result.data.push({update: 'data', replace: true, to, dataRequest: true, args: normalizePath(path)})
    }
  });
  return result
}

function processFn(map: any, nextData: any) {
  const getFromData = (arg: any) => {
    if (isNPath(arg)) return getIn(nextData, arg);
    if (isMapFn(arg)) return processFn(arg, nextData);
    return arg;
  };
  return deArray(toArray(map.$).reduce((args, fn) => toArray(fn(...args)), map.dataRequest ? map.args.map(getFromData) : map.args), map.arrayResult);
}

function updateProps(mappedData: any, prevData: any, nextData: any, ...iterMaps: Array<NormalizedPropsMapType[] | false>) {
  const getFromData = (arg: any) => isNPath(arg) ? getIn(nextData, arg) : arg;
  const needUpdate = (map: NormalizedPropsMapType) => isUndefined(prevData) || !map.$ || map.update != 'data' ||
    (map.dataRequest && map.args.some(arg => isNPath(arg) && getIn(prevData, arg) !== getIn(nextData, arg)));
  const dataUpdates = {update: {}, replace: {}};
  iterMaps.forEach(m => m && m.forEach(map => {
      if (!needUpdate(map)) return;
      const value = map.$ ? processFn(map, nextData) : getIn(nextData, map.args);
      objKeys(map.to).forEach(k => setUPDATABLE(dataUpdates, value, map.replace, map.to[k]));
      if (!map.replace) mappedData = mergeStatePROCEDURE(mappedData, dataUpdates);
    })
  );
  return mergeStatePROCEDURE(mappedData, dataUpdates);
}

const getExten = (enumExten: any, value: any) => (isFunction(enumExten) ? enumExten(value) : getIn(enumExten, value)) || {};


function classNames(...styles: any[]) {
  const classes: any[] = [];

  for (let i = 0; i < styles.length; i++) {
    let arg = styles[i];
    if (!arg) continue;

    const argType = typeof arg;

    if (argType === 'string' || argType === 'number') {
      classes.push(this && this[arg] || arg);
    } else if (isArray(arg)) {
      classes.push(classNames.apply(this, arg));
    } else if (argType === 'object') {
      objKeys(arg).forEach(key => {
          if (!arg[key]) return;
          if (typeof arg[key] == 'number' || arg[key] === true) classes.push(this && this[key] || key);
          else classes.push(classNames.call(this, arg[key]));
        }
      )
    }
  }

  return classes.join(' ');
}

//
// function selectorMap(opts: { skipFields?: string[], replaceFields?: { [key: string]: string } } = {}) { //skipFields: string[] = [], replaceFields: { [key: string]: string } = {}) {
//   const skipFields = opts.skipFields || [];
//   const replaceFields = opts.replaceFields || {};
//   return function (value: any, props: any) {
//     const {path, getFromState, schema} = props;
//     let vals = (isArray(value) ? value : [value]).map(key => (replaceFields[key]) ? replaceFields[key] : key);
//     let tmpPath: any = normalizePath(path.split('@')[0]);
//     const selectorField = tmpPath.pop();
//     let stringPath = path2string(tmpPath);
//     vals = vals.filter(key => getFromState(stringPath + '/' + key));
//     vals.push(selectorField);
//     stringPath = stringPath + '/' + vals.join(',') + '/@/params/hidden';
//     return new stateUpdates([
//       {skipFields, path: stringPath, value: false, macros: 'setMultiply'}, {skipFields, path: stringPath, value: true, macros: 'setAllBut'}]);
//   }
// }


/////////////////////////////////////////////
//  fformObjects
/////////////////////////////////////////////


let fformObjects: formObjectsType & { extend: (obj: any) => any } = {
  extend: function (obj) {
    return merge(this, obj, {symbol: false}) // merge without symbols, as there (in symbol keys) will be stored cache data which MUST be recalculated after each extend
  },
  types: ['string', 'integer', 'number', 'object', 'array', 'boolean', 'null'],
  widgets: {
    FSection: FSection,
    Generic: GenericWidget,
    Input: UniversalInput,
    Autowidth: Autowidth,
    Builder: FBuilder,
    Wrapper: Wrapper,
    ItemMenu: ItemMenu,
    CheckboxNull: CheckboxNull,
  },
  sets: {
    'base': {
      Wrapper: {
        _$widget: '^/widgets/Wrapper',
        ArrayItemMenu: {
          $_ref: '^/parts/ArrayItemMenu'
        },
        _$cx: '^/_$cx',
        $_maps: {
          'className/hidden': 'params/hidden',
          'arrayItem': '@/arrayItem'
        }
      },
      Builder: {
        _$widget: '^/widgets/Builder',
        _$cx: '^/_$cx',
        $_maps: {
          widgets: {$: '^/fn/getFFieldProperty', args: ['_widgets'], update: 'build'},
        },
      },
      Title: {},
      Body: {
        _$widget: '^/widgets/Generic',
        _$cx: '^/_$cx',
        className: 'body',
      },
      Main: {},
      Message: {
        _$widget: '^/widgets/Generic',
        _$cx: '^/_$cx',
        children: [],
        $_maps: {
          children: {$: '^/fn/messages', args: ['@/messages', {}]},
          'className/hidden': {$: '^/fn/not', args: '@/status/touched'},
        }
      }
    },
    nBase: {
      $_ref: '^/sets/base',
      Main: {
        _$widget: '^/widgets/Input',
        _$cx: '^/_$cx',
        $_reactRef: {ref: true},
        viewerProps: {_$cx: '^/_$cx', emptyMock: '(no value)', className: {viewer: true}},
        onChange: '^/on/changeBase',
        onBlur: '^/on/blurBase',
        onFocus: '^/on/focusBase',
        $_maps: {
          // priority: '@/status/priority',
          value: '@/value',
          viewer: '@/params/viewer',
          autoFocus: '@/params/autofocus',
          readOnly: '@/params/readonly',
          disabled: '@/params/disabled',
          placeholder: '@/fData/placeholder',
          required: '@/fData/required',
          label: '@/fData/title',
          'viewerProps/enumExten': '@/fData/enumExten',
          id: {$: '^/fn/getFFieldProperty', args: 'props/id', update: 'build'},
          name: {$: '^/fn/getFFieldProperty', args: 'props/name', update: 'build'},
        }
      },
      Title: {
        _$widget: '^/widgets/Generic',
        _$cx: '^/_$cx',
        useTag: 'label',
        children: [],
        $_maps: {
          'className/required': '@/fData/required',
          'children/0': '@/fData/title',
          'className/hidden': {$: '^/fn/not', args: '@/fData/title'},
          htmlFor: {$: '^/fn/getFFieldProperty', args: ['id'], update: 'build'},
          'className/title-viewer': '@/params/viewer'
        }
      },
    },
    string: {
      $_ref: '^/sets/nBase',
      Main: {type: 'text'}
    },
    textarea: {
      $_ref: '^/sets/nBase',
      Main: {type: 'textarea', viewerProps: {className: {viewer: false, 'viewer-inverted': true}}},
      Title: {
        $_maps: {
          'className/title-viewer-inverted': '@/params/viewer'
        }
      }
    },
    integer: {
      $_ref: '^/sets/nBase',
      Main: {
        type: 'number',
        onChange: '^/on/changeNumber',
        'onChange.bind': [true, 0]
      }
    },
    integerNull: {
      $_ref: '^/sets/integer',
      Main: {'onChange.bind': [true, null]}
    },
    number: {
      $_ref: '^/sets/integer',
      Main: {'onChange.bind': [false, 0], step: 'any'}
    },
    numberNull: {
      $_ref: '^/sets/number',
      Main: {'onChange.bind': [false, null]}
    },
    range: {$_ref: '^/sets/nBase', Main: {type: 'range'}},
    'null': {$_ref: '^/sets/nBase', Main: {type: 'hidden'}},
    hidden: {
      Builder: {
        className: {hidden: true},
        $_maps: {'className/hidden': false}
      }
    },
    boolean: {
      $_ref: '^/sets/nBase',
      Main: {
        type: 'checkbox',
        onChange: '^/on/changeBoolean'
      },
    },
    booleanLeft: {
      $_ref: '^/sets/base',
      Main: {
        _$widget: '^/widgets/Generic',
        useTag: 'label',
        _$cx: '^/_$cx',
        $_reactRef: {'0': {ref: true}},
        children: [
          {$_ref: '^/sets/nBase/Main:^/sets/boolean/Main', $_reactRef: false, viewerProps: {useTag: 'span'}},
          {$_ref: '^/sets/nBase/Title', useTag: 'span', $_maps: {'className/hidden': '@/params/viewer'}}
        ]
      },
      Title: {$_ref: '^/sets/nBase/Title', $_maps: {'className/hidden': {$: '^/fn/not', args: '@/params/viewer'}}},
    },
    booleanNull: {
      $_ref: '^/sets/boolean',
      Main: {
        useTag: '^/widgets/CheckboxNull',
        $_reactRef: {tagRef: true},
        onChange: '^/on/changeDirect'
      },
    },
    booleanNullLeft: {
      $_ref: '^/sets/booleanLeft',
      Main: {
        $_reactRef: {'0': {ref: false, tagRef: true}},
        children: [{$_ref: '^/sets/booleanNull/Main'}, {}]
      }
    },
    object: {
      $_ref: '^/sets/base',
      Main: {
        _$widget: '^/widgets/FSection',
        _$cx: '^/_$cx',
        $_reactRef: true,
        uniqKey: 'params/uniqKey',
        LayoutDefaultClass: 'layout',
        LayoutDefaultWidget: 'div',
        viewerProps: {$_ref: '^/sets/nBase/Main/viewerProps'},
        $_maps: {
          length: '@/length',
          isArray: {$: '^/fn/equal', args: ['@/fData/type', 'array']},
          $branch: {$: '^/fn/getFFieldProperty', args: '$branch', update: 'every'},
          arrayStart: {$: '^/fn/getArrayStart', args: [], update: 'build'},
          $FField: {$: '^/fn/getFFieldProperty', args: [], update: 'build'},
          FFormApi: {$: '^/fn/getFFieldProperty', args: 'props/pFForm/api', update: 'build'},
          id: {$: '^/fn/getFFieldProperty', args: 'props/id', update: 'build'},
          name: {$: '^/fn/getFFieldProperty', args: 'props/name', update: 'build'},
          $layout: {$: '^/fn/getFFieldProperty', args: 'ff_layout', update: 'build', arrayResult: true}
        }
      },
      Title: {
        _$widget: '^/widgets/Generic',
        _$cx: '^/_$cx',
        useTag: 'legend',
        children: [
          {$_ref: '^/sets/nBase/Title', useTag: 'span'},
          {$_ref: '^/parts/ArrayAddButton'},
          {$_ref: '^/parts/ArrayDelButton'},
          {$_ref: '^/parts/ArrayEmpty'}],
      },
      Wrapper: {useTag: 'fieldset'},
    },
    array: {$_ref: '^/sets/object'},
    select: {
      $_ref: '^/sets/nBase',
      Main: {
        type: 'select',
        children: [],
        $_maps: {
          'children': {$: '^/fn/arrayOfEnum', args: ['@/fData/enum', '@/fData/enumExten', {_$widget: 'option'}], replace: false},
          'label': false
        }
      }
    },
    multiselect: {
      $_ref: '^/sets/select',
      Main: {
        multiple: true,
        onChange: '^/on/changeSelectMultiple'
      }
    },
    radio: {
      $_ref: '^/sets/base',
      Title: {$_ref: '^/sets/nBase/Title'},
      Main: {
        _$widget: '^/widgets/Input',
        _$cx: '^/_$cx',
        useTag: 'div',
        $_reactRef: true,
        type: 'notInput',
        viewerProps: {$_ref: '^/sets/nBase/Main/viewerProps'},
        children: [],
        $_maps: {
          value: '@/value',
          viewer: '@/params/viewer',
          children: [
            {
              $: '^/fn/enumInputs',
              args: [
                '@/fData/enum',
                '@/fData/enumExten',
                {useTag: 'label', _$cx: '^/_$cx', $_reactRef: {'$_reactRef': {'0': {'ref': true}}}},
                {_$widget: 'input', type: 'radio', onChange: '^/on/changeBase', onBlur: '^/on/blurBase', onFocus: '^/on/focusBase'},
                {useTag: 'span', _$cx: '^/_$cx',},
                true
              ],
              replace: false
            },
            {$: '^/fn/enumInputProps', args: ['@/fData/enum', 'readOnly', '@/params/readonly', 'disabled', '@/params/disabled'], replace: false},
            {$: '^/fn/enumInputValue', args: ['@/fData/enum', '@/value'], replace: false}
          ]
        }
      }
    },
    checkboxes: {$_ref: '^/sets/radio', Main: {$_maps: {children: {'0': {args: {'3': {type: 'checkbox', onChange: '^/on/changeCheckboxes'}, '5': '[]'}}}}}},

    // inlineItems: {Main: {stackedProps: false}},
    // buttons: {Main: {inputProps: {className: {'button': true}}, labelProps: {className: {'button': true}}}},
    autowidth: {
      Autowidth: {$_ref: '^/parts/Autowidth'},
      Wrapper: {className: {shrink: true}},
    },
    noArrayControls: {Wrapper: {$_maps: {'arrayItem': false}}},
    noArrayButtons: {Title: {$_ref: '^/sets/nBase/Title'}},
    inlineItems: {Main: {className: {'inline': true}}},
    inlineTitle: {Wrapper: {className: {'inline': true}}},
    inlineArrayControls: {Wrapper: {ArrayItemBody: {className: {'inline': true}}}},
    inlineLayout: {Main: {LayoutDefaultClass: {'layout': true, 'inline': true}}},
    noTitle: {Title: false},
  },
  fn: {
    processing: function (...args: any[]) {
      const dataObj = this.getData();
      for (let i = 0; i < args.length; i += 2)
        isMapFn(args[i + 1]) &&
        this.api.set(args[i], processFn({...args[i + 1], ...normalizeArgs(args[i + 1].args)}, dataObj), args[i + 1].opts)
    },
    iif: (iif: boolean, trueVal: any, falseVaL: any) => iif ? trueVal : falseVaL,
    not: function (v: any) {return !v},
    equal: function (a: any, ...args: any[]) {return args.some(b => a === b)},
    messages: function (messages: any[], staticProps: anyObject = {}) {
      const {className: cnSP = {}, ...restSP} = staticProps;
      return objKeys(messages).map(priority => {
        const {norender, textGroups, className = {}, ...rest} = messages[priority];
        const texts: any[] = [];
        objKeys(textGroups).forEach((groupKey: string) => push2array(texts, textGroups[groupKey], {_$widget: 'br'}));
        if (norender || !texts.length) return null;
        texts.pop();
        return {children: texts, ...restSP, className: {['priority_' + priority]: true, ...cnSP, ...className}, ...rest}
      })
    },
    getArrayStart: function () {return arrayStart(this.schemaPart)},
    getFFieldProperty: function (key: string) {return getIn(this, normalizePath(key))},
    arrayOfEnum: function (enumVals: any[], enumExten: any = {}, staticProps: any = {}, name?: true | string) {
      return enumVals.map(val => {
        let extenProps = getExten(enumExten, val);
        return {value: val, key: val, children: [extenProps.label || val], name: name && (this.name + (name === true ? '' : name)), ...extenProps, ...staticProps}
      })
    },
    enumInputs: function (enumVals: any[], enumExten: any = {}, containerProps: any = {}, inputProps: any = {}, labelProps: any = {}, name?: true | string) {
      return enumVals.map(val => {
        let extenProps = getExten(enumExten, val);
        return {
          key: val,
          ...containerProps,
          children: [
            {value: val, name: name && (this.props.name + (name === true ? '' : name)), ...extenProps, ...inputProps},
            {...labelProps, children: [extenProps.label || val]}
          ]
        }
      })
    },
    enumInputProps: function (enumVals: any[], ...rest: any[]) {
      let props: any = {};
      for (let i = 0; i < rest.length; i += 2) props[rest[i]] = rest[i + 1];
      return enumVals.map(val => {return {'children': {'0': props}}})
    },
    enumInputValue: function (enumVals: any[], value: any, property = 'checked') {
      value = toArray(value);
      return enumVals.map(val => {return {'children': {'0': {[property]: !!~value.indexOf(val)}}}})
    }
  },
  on: {
    clickArrayAdd: function (path: any, value: number, opts: any) {this.api.arrayAdd(path, value, opts)},
    clickArrayItemOps: function (path: any, key: any, opts: any) {this.api.arrayItemOps(path, key, opts)},
    changeBase: function (event: any) {this.api.setValue(event.target.value, {})},
    changeDirect: function (value: any) {this.api.setValue(value, {})},
    changeNumber: function (int: boolean, empty: number | null, event: any) {this.api.setValue(event.target.value == '' ? empty : (int ? parseInt : parseFloat)(event.target.value), {})},
    changeBoolean: function (event: any) {this.api.setValue(event.target.checked, {})},
    changeSelectMultiple: function (event: any) {
      this.api.setValue(Array.from(event.target.options).filter((opt: any) => opt.selected).map((opt: any) => opt.value))
    },
    changeCheckboxes: function (event: any) {
      const selected = (this.getData().value || []).slice();
      const value = event.target.value;
      const at = selected.indexOf(value);
      const updated = selected.slice();
      if (at == -1) updated.push(value); else updated.splice(at, 1);
      const all = this.getData().fData.enum;
      updated.sort((a: any, b: any) => all.indexOf(a) > all.indexOf(b));
      this.api.setValue(updated)
    },
    focusBase: function (value: any) {this.api.set('/@/active', this.path, {noValidation: true})},
    blurBase: function (value: any) {
      const self = this;
      self.api.set('./', -1, {[SymData]: ['status', 'untouched'], noValidation: true, macros: 'setStatus'});
      self.api.set('/@/active', undefined, {noValidation: true});
      return !self.liveValidate ? self.api.validate() : null;
    }
  },
  parts: {
    Autowidth: {
      _$widget: '^/widgets/Autowidth',
      addWidth: 35,
      minWidth: 60,
      $_maps: {
        value: 'value',
        placeholder: '@/params/placeholder',
        'className/hidden': '@/params/hidden',
        $FField: {$: '^/fn/getFFieldProperty', args: [], update: 'build'},
      }
    },
    Button: {
      _$widget: '^/widgets/Generic',
      _$cx: '^/_$cx',
      useTag: 'button',
      type: 'button',
      $_maps: {'className/button-viewer': '@/params/viewer'}
    },
    ArrayAddButton: {
      $_ref: '^/parts/Button',
      children: ['+'],
      onClick: '^/on/clickArrayAdd',
      'onClick.bind': ['./', 1],
      $_maps: {
        'className/hidden': {$: '^/fn/equal | ^/fn/not', args: ['@/fData/type', 'array']},
        'disabled': {$: '^/fn/not', args: '@/fData/canAdd'}
      }
    },
    ArrayDelButton: {
      $_ref: '^/parts/Button',
      children: ['-'],
      onClick: '^/on/clickArrayAdd',
      'onClick.bind': ['./', -1],
      $_maps: {
        'className/hidden': {$: '^/fn/equal | ^/fn/not', args: ['@/fData/type', 'array']},
        'disabled': {$: '^/fn/not', args: '@/length'}
      },
    },
    ArrayEmpty: {
      children: '(array is empty)',
      useTag: 'span',
      $_maps: {'className/hidden': {$: '^/fn/equal | ^/fn/not', args: ['@/length', 0]}}
    },
    ArrayItemMenu: {
      _$widget: '^/widgets/ItemMenu',
      buttons: ['first', 'last', 'up', 'down', 'del'],
      onClick: '^/on/clickArrayItemOps',
      'onClick.bind': ['./'],
      buttonsProps: {
        first: {disabledCheck: 'canUp'},
        last: {disabledCheck: 'canDown'},
        up: {disabledCheck: 'canUp'},
        down: {disabledCheck: 'canDown'},
        del: {disabledCheck: 'canDel'},
      },
      $_maps: {'arrayItem': '@/arrayItem', 'className/button-viewer': '@/params/viewer'},
    },
    expander: {_$widget: 'div', className: {expand: true}}
  },
  // presetMap: {
  //   boolean: ['select', 'radio'],
  //   string: ['select', 'password', 'email', 'hostname', 'ipv4', 'ipv6', 'uri', 'data-url', 'radio', 'textarea', 'hidden', 'date', 'datetime', 'date-time', 'color', 'file'],
  //   number: ['select', 'updown', 'range', 'radio'],
  //   integer: ['select', 'updown', 'range', 'radio'],
  //   array: ['select', 'checkboxes', 'files'],
  // },
  _$cx: classNames
};


export {fformObjects, formReducer, FForm, FFormStateAPI, fformCores, classNames};

export {extractMaps, normalizeMaps, updateProps}
//module.exports = process.env.NODE_ENV === 'test' ? merge(module.exports, {}) : module.exports;


//     "checkboxSelect": {
//       "type": "array",
//       "ff_managed": true,
//       "ff_presets": "checkboxes"
//     },