/** @jsx h */

import {createElement as h, Component} from 'react';
//const React = require('preact');

import {
  toArray,
  deArray,
  getIn,
  isArray,
  isEqual,
  isObject,
  isMergeable,
  isString,
  isUndefined,
  isFunction,
  merge,
  objKeys,
  memoize,
} from "./commonLib";
import {
  arrayStart,
  isSelfManaged,
  path2string,
  string2path,
  SymData,
  normalizePath,
  objMap,
  setUPDATABLE,
  mergeUPD_PROC,
  branchKeys,
  isNPath,
  multiplyPath,
  processFn,
  isMapFn,
  normalizeFn,
  normalizeArgs,
  processProp
} from './stateLib'
import {FFormStateAPI, fformCores, objectResolver, formReducer} from './api'


/////////////////////////////////////////////
//  Main class
/////////////////////////////////////////////
class FForm extends Component<any, any> {
  static params = ['readonly', 'disabled', 'viewer', 'liveValidate', 'liveUpdate'];
  private _unsubscribe: any;
  private _savedState: any;
  private _savedValue: any;
  _root: any;

  api: any;
  formName: any;
  schema: any;
  utils: any;
  elements: any;
  parent: any;

  constructor(props: FFormProps, context: any) {
    super(props, context);
    const self = this;
    let {core: coreParams} = props;

    self.api = coreParams instanceof FFormStateAPI ? coreParams : self._getCoreFromParams(coreParams, context);
    self.parent = props.parent;
    // self.focus = self.focus.bind(self);
    const nextProps = {...props};
    if (props.touched !== null) nextProps.touched = !!nextProps.touched;
    FForm.params.forEach(k => {
      if (!isUndefined(nextProps[k])) nextProps[k] = (v: any) => isUndefined(v) ? props[k] : v
    });
    self._updateValues(nextProps);
    // self.api.reset({status: 'untouched'});
    if (!props.noValidation) self.api.validate(true);
    self._unsubscribe = self.api.addListener(self._handleStateUpdate.bind(self));
    self._setRef = self._setRef.bind(self);
    self._submit = self._submit.bind(self);
    self._getPath = self._getPath.bind(self);
    Object.defineProperty(self, "elements", {get: () => self.api.props.elements});
    Object.defineProperty(self, "valid", {get: () => self.api.get('/@/status/valid')});

  }

  private _setRef(FField: any) {
    this._root = FField;
  }

  _updateValues(nextProps: FFormProps, prevProps: any = {}) {
    const {state, value, inital, extData, noValidation, touched} = nextProps;
    const self = this;
    if (state && state !== prevProps.state) self.api.setState(state);
    if (inital && inital !== prevProps.inital) self.api.setValue(inital, {replace: true, inital: true, noValidation});
    if (value && value !== prevProps.value) self.api.setValue(value, {replace: true, noValidation});
    if (extData && extData !== prevProps.extData) objKeys(extData).forEach(key => (self.api.set(key, (extData as any)[key], {replace: true})));
    if (!isUndefined(touched) && touched !== null && touched !== prevProps.touched) self.api.reset({status: 'untouched', value: touched ? 0 : undefined});
    FForm.params.forEach(k => (!isUndefined(nextProps[k]) && nextProps[k] !== prevProps[k] &&
      self.api.switch('/@/params/' + k, nextProps[k])));
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


  _submit(event: any) {
    const self = this;
    const setPending = (val: any) => self.api.set([], val, {[SymData]: ['status', 'pending']});

    self.api.set([], 0, {[SymData]: ['status', 'untouched'], execute: true, macros: 'switch'});

    if (self.props.onSubmit) {
      self.api.setMessages(null, {execute: true});
      let result = self.props.onSubmit(event, self._savedValue, self);
      if (result && result.then && typeof result.then === 'function') { //Promise
        setPending(1);
        result.then((val: any) => {
          setPending(0);
          self.api.setMessages(val)
        }, (reason: any) => {
          setPending(0);
          self.api.setMessages(reason)
        })
      } else self.api.setMessages(result)
    }
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
    let {core, state, value, inital, extData, fieldCache, touched, parent, onSubmit, onChange, onStateChange, _$useTag: UseTag = 'form', ...rest} = self.props;
    FForm.params.forEach(k => delete (rest as any)[k]);
    return (
      <UseTag {...rest} onSubmit={self._submit}>
        <FField ref={self._setRef} id={rest.id ? rest.id + '/#' : undefined} name={self.api.name} pFForm={self} getPath={self._getPath} FFormApi={self.api}/>
      </UseTag>
    )
  }
}

class FRefsGeneric extends Component<any, any> {
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
  private _cached?: { value: any, opts: any };
  private _cachedTimeout?: any;
  // private _enumOptions: any;
  private _isNotSelfManaged: boolean | undefined;
  private _blocks: string[] = [];
  private _widgets: object;
  private _ff_components: object;
  private _maps: NPM4WidgetsType = {};
  private _$_parse: any;
  _forceUpd: boolean = false;

  get: Function | null = null;
  ff_layout: FFLayoutGeneric<jsFFCustomizeType>;
  $branch: any;
  schemaPart: jsJsonSchema;

  liveValidate: boolean;
  liveUpdate: boolean;
  path: any;
  api: any;
  pFForm: any;
  stateApi: any;

  constructor(props: any, context: any) {
    super(props, context);
    const self = this;
    Object.defineProperty(self, "path", {get: () => self.props.getPath()});
    Object.defineProperty(self, "pFForm", {get: () => self.props.pFForm});
    Object.defineProperty(self, "liveValidate", {get: () => getIn(self.getData(), 'params', 'liveValidate')});
    Object.defineProperty(self, "liveUpdate", {get: () => getIn(self.getData(), 'params', 'liveUpdate')});
    Object.defineProperty(self, "value", {get: () => self.props.pFForm.getValue(self.state.branch, self)});
    Object.defineProperty(self, "stateApi", {get: () => self.props.pFForm.api});
    self.state = {branch: self.pFForm.getBranch(self.path)};
    self.$branch = self.state.branch;
    self._updateStateApi(props.pFForm.api);
    self.wrapFns = self.wrapFns.bind(self);
  }

  getRef(path: Path | string) {
    path = normalizePath(path);
    const self = this;
    if (!path.length) return self.$refs['@Main'];
    if (path.length == 1 && path[0] == SymData) return self;
    if (path[0][0] == '@') return path.length == 1 ? self.$refs[path[0]] : self.$refs[path[0]].getRef(path.slice(1));
    return self.$refs['@Main'] && self.$refs['@Main'].getRef && self.$refs['@Main'].getRef(path)
  }

  _resolver(obj: any) {
    const self = this;
    try {
      return objectResolver(self.pFForm.elements, obj);
    } catch (e) {
      throw self._addErrPath(e)
    }
    //return result[SymData] ? merge(result, self._bind2self(result[SymData])) : result;
  }

  _addErrPath(e: any) {
    e.message = e.message + ', in form \'' + (this.pFForm.props.name || '') + '\', path: \'' + this.path + '\'';
    return e
  }

  _updateStateApi(stateApi: any) {
    const self = this;

    if (stateApi) {
      const api = stateApi.wrapper({
        get path() {return self.path},
        // wrapOpts: (rest: any) => {
        //   if (isUndefined(rest.noValidation)) rest.noValidation = !self.liveValidate;
        //   return rest
        // }
      });
      api._set = api.set;
      api._setValue = api.setValue;
      api.set = (...args: any[]) => self._cacheValue(args[0], args[1], 'set', args[2]) || api._set(...args);
      api.setValue = (...args: any[]) => self._cacheValue((args[1] || {}).path, args[0], 'setValue', args[1]) || api._setValue(...args);
      self.api = api;
    }
  }

  _updateCachedValue(update = this.liveUpdate || this._forceUpd) {
    const self = this;
    self._cachedTimeout = undefined;
    if (update && self._cached) {
      self._forceUpd = false;
      self.stateApi.setValue(self._cached.value, {noValidation: !self.liveValidate, path: self.path, ...self._cached.opts});
      self._cached = undefined;
    }
  }

  _cacheValue(path: any, value: any, fn: string = 'set', opts: any = {}): boolean | undefined {
    //if (path === null) return;
    const self = this;
    let fieldCache = self.pFForm.props.fieldCache;
    if (isUndefined(fieldCache) || fieldCache === true) fieldCache = 40;

    let valueSet = fn === 'setValue' && (!path || path == './' || path == '.');
    if (!valueSet) {
      let fPath = self.path;
      path = '#/' + path2string(normalizePath(path, self.path)) + (fn === 'setValue' ? '/@/value' : '');
      valueSet = (path == fPath + '/@/value') || (path == '#/@/current/' + fPath.slice(2));
    }
    // console.log(valueSet, 'setValue=', setValue,'path=',path)
    if (valueSet) {
      let prevData = self.getData();
      self._cached = {value, opts};
      if (fieldCache) {
        if (self._cachedTimeout) clearTimeout(self._cachedTimeout);
        self._cachedTimeout = setTimeout(self._updateCachedValue.bind(self), fieldCache);
        const data = self.getData();
        const mappedData = self._mappedData;

        self.get = (...pathes: any[]) => {
          let path = normalizePath(pathes, self.path);
          if (isEqual(path, normalizePath('./@value', self.path))) return data.value;
          return self.stateApi.get(path)
        };
        self._setMappedData(prevData, data, true);
        self.get = null;
        if (mappedData != self._mappedData) self.forceUpdate();
      } else self._updateCachedValue();
      return true;
    }
    return;
  }

  wrapFns(val: any) {
    const self = this;
    if (isFunction(val)) val = {$: val};
    if (isMapFn(val)) {
      const map = val.norm ? val : normalizeFn(val, {wrapFn: self.wrapFns});
      const fn = processFn.bind(self, map);
      fn._map = map;
      return fn
    } else if (isMergeable(val)) {
      const result = isArray(val) ? [] : {};
      objKeys(val).forEach(key => result[key] = key[0] != '_' ? self.wrapFns(val[key]) : val[key]); //!~ignore.indexOf(key) &&
      return result
    }
    return val
  }

  _build() {
    const self = this;
    self.state = {branch: self.pFForm.getBranch(self.path)};
    self.$branch = self.state.branch;

    const schemaPart: jsJsonSchema = self.api.getSchemaPart(self.path);
    self.schemaPart = schemaPart;

    self._isNotSelfManaged = !isSelfManaged(self.state.branch) || undefined;
    if ((isArray(schemaPart.type) || isUndefined(schemaPart.type)) && !schemaPart.ff_presets)
      throw new Error('schema.ff_presets should be defined explicitly for multi type');

    self.ff_layout = self.wrapFns(resolveComponents(self.pFForm.elements, schemaPart.ff_layout));

    let ff_components = resolveComponents(self.pFForm.elements, schemaPart.ff_custom, schemaPart.ff_presets || schemaPart.type);
    ff_components = self.wrapFns(ff_components);
    let {$_maps, rest: components} = extractMaps(ff_components);
    self._maps = normalizeMaps($_maps);
    self._widgets = {};
    self._ff_components = components;
    self._blocks = objKeys(components).filter(key => components[key]);
    self._blocks.forEach((block: string) => {
      const {_$widget, $_reactRef, ...staticProps} = components[block];
      if (!_$widget) throw new Error('_$widget for "' + block + '" is empty');
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

  _setMappedData(prevData: any, nextData: any, updateStage: boolean | 'build') {
    const self = this;
    let _gData = self.getData;
    self.getData = () => nextData;
    const _mappedData = updateProps(self._mappedData, prevData, nextData, updateStage == 'build' && self._maps.build, updateStage && self._maps.data, self._maps.every);
    self.getData = _gData;
    if (self._mappedData != _mappedData) {
      self._mappedData = _mappedData;
      return true
    }
    return false
  }

  getData(branch?: any) {
    const self = this;
    const data = self.pFForm.getDataObject(branch || getIn(self, 'state', 'branch'), self);
    return self._cached ? merge(data, {value: self._cached.value}, {replace: {value: self._cached.opts.replace}}) : data;
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    const self = this;
    if (nextProps.FFormApi !== self.props.FFormApi) {
      self._updateStateApi(nextProps.FFormApi);
      return (self._rebuild = true);
    }
    if (!isEqual(nextProps, self.props)) return (self._rebuild = true);

    if (isUndefined(nextState.branch)) return true;
    self.$branch = nextState.branch;
    let updateComponent = false;

    const prevData = self.getData();
    const nextData = self.getData(getIn(nextState, 'branch'));
    if (getIn(nextData, 'oneOf') !== getIn(prevData, 'oneOf')) return (self._rebuild = true);

    try {
      updateComponent = self._setMappedData(prevData, nextData, nextData !== prevData) || updateComponent;
      updateComponent = updateComponent || getIn(nextData, 'params', 'norender') !== getIn(prevData, 'params', 'norender');
    } catch (e) {
      throw self._addErrPath(e)
    }

    return updateComponent
  }


  render() {
    const self = this;
    try {
      if (isUndefined(self.state.branch)) return null;
      if (getIn(self.getData(), 'params', 'norender')) return false;
      if (self._rebuild) this._build();
      return self._widgets['Builder'] ? h(self._widgets['Builder'], self._mappedData['Builder'], self._mappedData) : null;
    } catch (e) {
      throw self._addErrPath(e)
    }
  }
}

//enumOptions={self._enumOptions}

/////////////////////////////////////////////
//  Section class
/////////////////////////////////////////////
class FSectionWidget extends Component<any, any> { // need to be class, as we use it's forceUpdate() method
  refs: any;

  _cn(props: any) {
    if (!props) return props;
    if (this.props._$cx && props.className && !isString(props.className)) {
      if (passCx(this.props._$widget)) return {_$cx: this.props._$cx, ...props};
      else return {...props, className: this.props._$cx(props.className)};
    }
    return props;
  }

  render() {
    const props = this._cn(this.props.getMappedData());
    return h(this.props._$widget, props, this.props.children || props.children);
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
    // self._build(self.props);
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
      // rest = self.props.$FField.wrapFns(rest, ['$_maps']);
      let {$_fields, $_reactRef, _$widget = LayoutDefaultWidget, className, ...staticProps} = rest;
      if ($_fields || !counter) className = merge(LayoutDefaultClass, className);
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

    const {$branch, $layout, _$cx, arrayStart, LayoutDefaultWidget = 'div', LayoutDefaultClass = {}, uniqKey, focusField} = props;

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
                   name={self.props.name ? self.props.name + '[' + (self.props.isArray ? '${idx}_' + (arrayKey || fieldName) : fieldName) + ']' : undefined}
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
    if (nextProps.FFormApi !== self.props.FFormApi || nextProps.oneOf !== self.props.oneOf) return self._rebuild = true;

    let doUpdate = !isEqual(nextProps, self.props, {skipKeys: ['$branch']});

    let prevBranch = self.props.$branch;
    let nextBranch = nextProps.$branch;

    if (prevBranch != nextBranch) {
      let newMapped: any;
      try {
        newMapped = self._updateMappedData(self._getData(prevBranch), self._getData(nextBranch));
      } catch (e) {
        throw self.props.$FField._addErrPath(e)
      }

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
    try {
      if (props.viewer) {
        let {_$widget = UniversalViewer, ...rest} = props.viewerProps || {};
        rest.inputProps = props;
        rest.value = props.$FField.value;
        return h(_$widget, rest)
      }
      if (isSelfManaged(props.$branch)) return null;
      if (self._rebuild) self._build(props); // make rebuild here to avoid addComponentAsRefTo Invariant Violation error https://gist.github.com/jimfb/4faa6cbfb1ef476bd105
      return <FSectionWidget _$widget={self._$widget} _$cx={props._$cx} key={'widget_0'} ref={self._setWidRef((0))}
                             getMappedData={self._getMappedData(0)}>{self._objectLayouts}{self._arrayLayouts}</FSectionWidget>
    } catch (e) {
      throw self.props.$FField._addErrPath(e)
    }
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
    return <Widget key={key}
                   className={(!passCx(Widget) && this.props._$cx) ? this.props._$cx(className) : className}
                   _$cx={passCx(Widget) ? this.props._$cx : undefined} {...rest} {...refObject}/>
  }

  protected _mapChildren(children: any, $_reactRef: anyObject) {
    const self = this;
    if (children !== self._children || self._reactRef !== $_reactRef) {
      const prev = self._children && toArray(self._children);
      const next = children && toArray(children);
      self._mapped = next && next.map((ch: any, i: number) => (!isObject(ch) || ch.$$typeof) ? ch :
        ((!self._mapped ||
          !getIn(self._mapped, i) ||
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
    const {_$useTag: UseTag = 'div', _$cx, className, $_reactRef, children, ...rest} = self.props;
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
  let {_$useTag: UseTag = 'div', value, inputProps, _$cx, enumExten = {}, emptyMock = '(none)', ...rest} = props;
  if (rest.className && _$cx) rest.className = _$cx(rest.className);

  return h(UseTag, rest, toString(emptyMock, enumExten, value))
}


class UniversalInput extends GenericWidget {
  render() {
    const self = this;
    const props: any = self.props;
    if (props.viewer) {
      let {_$widget = UniversalViewer, ...rest} = props.viewerProps || {};
      rest.inputProps = props;
      rest.value = props.value;
      return h(_$widget, rest)
    }

    let {value, _$useTag: UseTag, type, $_reactRef, _$cx, viewer, viewerProps, children, ...rest} = props;

    self._mapChildren(children, $_reactRef);
    self.setRef2rest(rest, $_reactRef);

    if (type == 'textarea' || type == 'select') UseTag = UseTag || type;
    else {
      UseTag = UseTag || 'input';
      if (type !== 'notInput') rest.type = type;
    }
    if (type !== 'notInput') rest[type === 'checkbox' ? 'checked' : 'value'] = value;
    // if (rest.value === null) rest.value = '';

    if (rest.className && _$cx) rest.className = _$cx(rest.className);
    //console.log(rest.value);
    return h(UseTag, rest, self._mapped)
  }
}


class Autowidth extends Component<any, any> {
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
    const value = (isUndefined(props.value) || props.value === null ? '' : props.value.toString()) || props.placeholder || '';
    return (<div style={Autowidth.sizerStyle as any} ref={(elem) => {
      (self._elem = elem) &&
      props.$FField.$refs['@Main'] &&
      (props.$FField.$refs['@Main'].style.width = Math.max((elem as any).scrollWidth + (props.addWidth || 45), props.minWidth || 0) + 'px')
    }}>{value}</div>)
  }
}


function FBuilder(props: any) {
  let {children: mapped, widgets} = props;
  const {Title, Body, Main, Message, Wrapper, Autowidth} = widgets;

  mapped = deArray(mapped);
  return Wrapper ? h(Wrapper, mapped['Wrapper'],
    Title ? h(Title, mapped['Title']) : '',
    Body ? h(Body, mapped['Body'],
      Main ? h(Main, mapped['Main']) : '',
      Message ? h(Message, mapped['Message']) : '',
      Autowidth ? h(Autowidth, mapped['Autowidth']) : ''
    ) : ''
  ) : ''
}


function Wrapper(props: any) {
  let {_$useTag: WrapperW = 'div', _$cx = classNames, className, ArrayItemMenu, ArrayItemBody, arrayItem, ...rest} = props;
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
  const {_$useTag: UseTag = 'div', _$cx, disabled, className, buttonsProps = {}, arrayItem, buttons = [], onClick: defaultOnClick, ...rest}: { [key: string]: any } = props;
  if (!arrayItem) return null;
  // console.log(arrayItem)
  buttons.forEach((key: string) => delete rest[key]);
  return (
    <UseTag className={_$cx(className)} {...rest}>
      {buttons.map((key: string) => {
        const {_$widget: ButW = 'button', type = 'button', disabledCheck = '', className: ButCN = {}, onClick = defaultOnClick, title = key, children = key, ...restBut} = buttonsProps[key] || {};
        return (
          <ButW key={key} type={type} title={title} className={_$cx ? _$cx(ButCN) : ButCN} children={children}
                disabled={disabled || disabledCheck && !arrayItem[disabledCheck]} {...restBut} onClick={() => onClick(key)}/>)
      })}
    </UseTag>);
}


function CheckboxNull(props: any) {
  const self = this;
  let {checked, onChange, nullValue = null, dual, tagRef, type, ...rest} = props;
  return <input type="checkbox" checked={checked === true} {...rest}
                onChange={(event: any) => {
                  onChange(dual ? !checked : (checked === nullValue ? true : (checked === true ? false : nullValue)), event)
                }}
                ref={elem => {
                  tagRef && tagRef(elem);
                  elem && (elem.indeterminate = (checked === nullValue))
                }}/>
}


///////////////////////////////
//     Functions
///////////////////////////////

function passCx(Widget: any) {
  return Widget instanceof GenericWidget
}

const resolveComponents = memoize((elements: elementsType, customizeFields: FFCustomizeType = {}, sets?: string): jsFFCustomizeType => {
  if (sets) {
    let $_ref = sets.split(':')
      .map(v => (v = v.trim()) && (v[0] != '^' ? '^/sets/' + v : v))
      .join(':') + ':' + (customizeFields.$_ref || '');
    customizeFields = merge(customizeFields, {$_ref});
  }
  return objectResolver(elements, customizeFields);
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


function normalizeMaps($_maps: any, prePath = '') {
  const result: { data: NormalizedPropsMapType[], every: NormalizedPropsMapType[], build: NormalizedPropsMapType[] } = {data: [], every: [], build: []};
  objKeys($_maps).forEach(key => {
    let value = $_maps[key];
    if (!value) return;
    const to = multiplyPath(normalizePath((prePath ? prePath + '/' : '') + key));
    if (isFunction(value) || isArray(value)) {
      toArray(value).forEach((fn: any) => {
        const {update = 'data', replace = true, ...rest} = fn._map;
        //fn._map = {update, replace, to, ...rest};
        result[update].push({update, replace, ...rest, to, $: fn});
      })
    } else {
      if (isString(value)) value = {args: value};
      value = {...value, ...normalizeArgs(value.args)};
      let {args, update = 'data', replace = true, ...rest} = value;
      //if (!isString(path)) throw new Error('$_maps value is not recognized');
      //if (path[0] === '@') path = path.substr(1);
      // lse console.warn('Expected "@" at the begining of string');
      result.data.push({args: args[0], update, replace, to, dataRequest: true, ...rest})
    }
  });
  return result
}

//!map.$ && map.args[0] == 'selectorValue' && args[0]
function updateProps(mappedData: any, prevData: any, nextData: any, ...iterMaps: Array<NormalizedPropsMapType[] | false>) {
  // const getFromData = (arg: any) => isNPath(arg) ? getIn(nextData, arg) : arg;
  const needUpdate = (map: NormalizedPropsMapType): boolean => isUndefined(prevData) || !map.$ ||
    (map.dataRequest && map.args.some(arg => {
      if (isNPath(arg)) return getIn(prevData, arg) !== getIn(nextData, arg);
      if (isMapFn(arg)) return needUpdate(arg._map || arg);
      return false
    }));//isFunction(map.args[0])
  const dataUpdates = {update: {}, replace: {}, api: {}};
  iterMaps.forEach(maps => maps && maps.forEach(map => {
      if (map.update == 'data' && !needUpdate(map)) return;
      const value = map.$ ? map.$() : processProp(nextData, map.args);
      objKeys(map.to).forEach(k => setUPDATABLE(dataUpdates, value, map.replace, map.to[k]));
      if (!map.replace) mappedData = mergeUPD_PROC(mappedData, dataUpdates);
    })
  );
  return mergeUPD_PROC(mappedData, dataUpdates);
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
//  elements
/////////////////////////////////////////////


let elementsBase: elementsType & { extend: (elements: any[], opts?: MergeStateOptionsArgument) => any } = {
  extend(elements: any[], opts?: MergeStateOptionsArgument) {
    return merge.all(this, elements, opts)
  },
  // types: ['string', 'integer', 'number', 'object', 'array', 'boolean', 'null'],
  widgets: {
    Section: FSection,
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
          'className/hidden': '@/params/hidden',
          'arrayItem': '@/arrayItem'
        }
      },
      Builder: {
        _$widget: '^/widgets/Builder',
        _$cx: '^/_$cx',
        $_maps: {
          widgets: {$: '^/fn/getProp', args: ['_widgets'], update: 'build'},
        },
      },
      //Title: {},
      Body: {
        _$widget: '^/widgets/Generic',
        _$cx: '^/_$cx',
        className: 'body',
      },
      //Main: {},
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
        onChange: {$: '^/fn/eventValue|setValue'},
        onBlur: {$: '^/fn/blur'},
        onFocus: {$: '^/fn/focus'},
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
          id: {$: '^/fn/getProp', args: 'props/id', update: 'build'},
          name: {$: '^/fn/getProp', args: 'props/name', update: 'build'},
        }
      },
      Title: {
        _$widget: '^/widgets/Generic',
        _$cx: '^/_$cx',
        _$useTag: 'label',
        children: [],
        $_maps: {
          'className/required': '@/fData/required',
          'children/0': '@/fData/title',
          'className/hidden': {$: '^/fn/not', args: '@/fData/title'},
          htmlFor: {$: '^/fn/getProp', args: ['id'], update: 'build'},
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
        onChange: {$: '^/fn/eventValue|parseNumber|setValue', args: ['${0}', true, 0]},
        $_maps: {
          value: {$: '^/fn/iif', args: [{$: '^/fn/equal', args: ['@value', null]}, '', '@value']},
        }
      }
    },
    integerNull: {
      $_ref: '^/sets/integer',
      Main: {
        onChange: {args: {2: null}},
      }
    },
    number: {
      $_ref: '^/sets/integer',
      Main: {onChange: {args: {1: false}}, step: 'any'}
    },
    numberNull: {
      $_ref: '^/sets/integerNull',
      Main: {onChange: {args: {1: false, 2: null}}, step: 'any'}
    },
    'null': {$_ref: '^/sets/nBase', Main: false},
    boolean: {
      $_ref: '^/sets/nBase',
      Main: {
        type: 'checkbox',
        onChange: {$: '^/fn/eventChecked|setValue|updCached'}
      },
    },
    booleanLeft: {
      $_ref: '^/sets/base',
      Main: {
        _$widget: '^/widgets/Generic',
        _$useTag: 'label',
        _$cx: '^/_$cx',
        $_reactRef: {'0': {ref: true}},
        children: [
          {$_ref: '^/sets/nBase/Main:^/sets/boolean/Main', $_reactRef: false, viewerProps: {_$useTag: 'span'}},
          {$_ref: '^/sets/nBase/Title', _$useTag: 'span', $_maps: {'className/hidden': '@/params/viewer'}}
        ]
      },
      Title: {$_ref: '^/sets/nBase/Title', $_maps: {'className/hidden': {$: '^/fn/not', args: '@/params/viewer'}}},
    },
    booleanNull: {
      $_ref: '^/sets/boolean',
      Main: {
        _$useTag: '^/widgets/CheckboxNull',
        $_reactRef: {tagRef: true},
        onChange: {$: '^/fn/setValue|updCached'},
      },
    },
    booleanNullLeft: {
      $_ref: '^/sets/booleanLeft',
      Main: {
        $_reactRef: {'0': {ref: null, tagRef: true}},
        children: [{$_ref: '^/sets/booleanNull/Main'}, {}]
      }
    },
    object: {
      $_ref: '^/sets/base',
      Main: {
        _$widget: '^/widgets/Section',
        _$cx: '^/_$cx',
        $_reactRef: true,
        uniqKey: 'params/uniqKey',
        LayoutDefaultClass: 'layout',
        LayoutDefaultWidget: 'div',
        viewerProps: {$_ref: '^/sets/nBase/Main/viewerProps'},
        $_maps: {
          length: '@/length',
          oneOf: '@/oneOf',
          isArray: {$: '^/fn/equal', args: ['@/fData/type', 'array']},
          $branch: {$: '^/fn/getProp', args: '$branch', update: 'every'},
          arrayStart: {$: '^/fn/getArrayStart', args: [], update: 'build'},
          $FField: {$: '^/fn/getProp', args: [], update: 'build'},
          FFormApi: {$: '^/fn/getProp', args: 'props/pFForm/api', update: 'build'},
          id: {$: '^/fn/getProp', args: 'props/id', update: 'build'},
          name: {$: '^/fn/getProp', args: 'props/name', update: 'build'},
          $layout: {$: '^/fn/getProp', args: 'ff_layout', update: 'build'}
        }
      },
      Title: {
        _$widget: '^/widgets/Generic',
        _$cx: '^/_$cx',
        _$useTag: 'legend',
        children: [
          {$_ref: '^/sets/nBase/Title', _$useTag: 'span'},
          {$_ref: '^/parts/ArrayAddButton'},
          {$_ref: '^/parts/ArrayDelButton'},
          {$_ref: '^/parts/ArrayEmpty'}],
      },
      Wrapper: {_$useTag: 'fieldset'},
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
        onChange: {$: '^/fn/eventMultiple|setValue'}
      }
    },
    radio: {
      $_ref: '^/sets/base',
      Title: {$_ref: '^/sets/nBase/Title'},
      Main: {
        $_ref: '^/parts/RadioSelector',
        $_reactRef: true,
        viewerProps: {$_ref: '^/sets/nBase/Main/viewerProps'},
        $_maps: {
          value: '@/value',
          viewer: '@/params/viewer',
          children: [
            {
              args: [
                '@/fData/enum',
                '@/fData/enumExten',
                {$_reactRef: {'$_reactRef': {'0': {'ref': true}}}},
                {onChange: {args: ['${0}']}},
                {},
                true
              ],
            },
            {args: ['@/fData/enum', '@/value']},
            {args: {0: '@/fData/enum'}},
          ]
        }
      }
    },
    checkboxes: {$_ref: '^/sets/radio', Main: {$_maps: {children: {'0': {args: {'3': {type: 'checkbox', onChange: {$: '^/fn/eventCheckboxes|setValue|updCached'}}, '5': '[]'}}}}}},
    radioNull: {Main: {$_maps: {children: {'0': {args: {'3': {onClick: '^/fn/eventValue|radioClear|updCached'}}}}}}},
    radioEmpty: {Main: {$_maps: {children: {'0': {args: {'3': {onClick: {$: '^/fn/eventValue|radioClear|updCached', args: ['${0}', '']}}}}}}}},
    hidden: {
      Builder: {
        className: {hidden: true},
        $_maps: {'className/hidden': false}
      }
    },
    autowidth: {
      Autowidth: {$_ref: '^/parts/Autowidth'},
      Wrapper: {className: {shrink: true}},
    },
    noArrayControls: {Wrapper: {$_maps: {'arrayItem': false}}},
    noArrayButtons: {Title: {$_ref: '^/sets/nBase/Title'}},
    inlineItems: {Main: {className: {'inline': true}}},
    inlineTitle: {Wrapper: {className: {'inline': true}}},
    inlineLayout: {Main: {LayoutDefaultClass: {'inline': true}}},
    inlineArrayControls: {Wrapper: {ArrayItemBody: {className: {'inline': true}}}},
    arrayControls3but: {Wrapper: {ArrayItemMenu: {buttons: ['up', 'down', 'del'],}}},
    noTitle: {Title: false},
    shrink: {Wrapper: {className: {'shrink': true}}},
    expand: {Wrapper: {className: {'expand': true}}},
    bnnDual: {Main: {children: {0: {dual: true}}}}
  },
  fn: {
    api(fn: string, ...args: any[]) {this.api[fn](...args)},
    format(str: string, ...args: any[]) {
      return args.reduce((str, val, i) => str.replace('${' + i + '}', val), str)
    },
    iif(iif: any, trueVal: any, falseVaL: any, ...args: any[]) { return [iif ? trueVal : falseVaL, ...args]},
    not(v: any, ...args: any[]) {return [!v, ...args]},
    equal(a: any, ...args: any[]) {return [args.some(b => a === b)]},
    getArrayStart(...args: any[]) {return [arrayStart(this.schemaPart), ...args]},
    getProp(key: string, ...args: any[]) {return [getIn(this, normalizePath(key)), ...args]},

    eventValue: (event: any, ...args: any[]) => [event.target.value, ...args],
    eventChecked: (event: any, ...args: any[]) => [event.target.checked, ...args],
    eventMultiple: (event: any, ...args: any[]) =>
      [Array.from(event.target.options).filter((o: any) => o.selected).map((v: any) => v.value), ...args],
    parseNumber: (value: any, int: boolean = false, empty: number | null = null, ...args: any[]) =>
      [value === '' ? empty : (int ? parseInt : parseFloat)(value), ...args],

    setValue(value: any, opts: any = {}, ...args: any[]) {
      this.api.setValue(value, opts);
      return args;
    },
    // arrayAdd(path: any, value: number = 1, opts: any = {}, ...args: any[]) {
    //   this.api.arrayAdd(path, value, opts);
    //   return args;
    // },
    // arrayItemOps(path: any, key: any, opts: any = {}, ...args: any[]) {
    //   this.api.arrayItemOps(path, key, opts);
    //   return args;
    // },
    focus(value: any, ...args: any[]) {
      this.api.set('/@/active', this.path, {noValidation: true});
      return args;
    },
    blur(...args: any[]) {
      this.api.set('./', -1, {[SymData]: ['status', 'untouched'], noValidation: true, macros: 'setStatus'});
      this.api.set('/@/active', undefined, {noValidation: true});
      this._updateCachedValue(true);
      !this.liveValidate && this.api.validate('./',);
      return args;
    },
    updCached(...args: any[]) {
      this._forceUpd = true;
      return args;
    },
    eventCheckboxes(event: any, ...args: any[]) {
      const selected = (this.getData().value || []).slice();
      const value = event.target.value;
      const at = selected.indexOf(value);
      const updated = selected.slice();
      if (at == -1) updated.push(value); else updated.splice(at, 1);
      const all = this.getData().fData.enum;
      updated.sort((a: any, b: any) => all.indexOf(a) > all.indexOf(b));
      return [updated, ...args]
    },
    radioClear(value: any, nullValue = null, ...args: any[]) {
      if (this.api.getValue() === value) this.api.setValue(nullValue);
      return args;
    },

    messages(messages: any[], staticProps: anyObject = {}) {
      const {className: cnSP = {}, ...restSP} = staticProps;
      return [objKeys(messages).map(priority => {
        const {norender, texts, className = {}, ...rest} = messages[priority];
        const children: any[] = [];
        objKeys(texts).forEach((key: string) =>
          toArray(texts[key]).forEach((v, i, arr) =>
            (isString(v) && isString(children[children.length - 1])) ? children.push(v, {_$widget: 'br'}) : children.push(v)));
        if (norender || !children.length) return null;
        return {children, ...restSP, className: {['priority_' + priority]: true, ...cnSP, ...className}, ...rest}
      })]
    },
    arrayOfEnum(enumVals: any[], enumExten: any = {}, staticProps: any = {}, name?: true | string) {
      return [enumVals.map(val => {
        let extenProps = getExten(enumExten, val);
        return {value: val, key: val, children: [extenProps.label || val], name: name && (this.name + (name === true ? '' : name)), ...extenProps, ...staticProps}
      })]
    },
    enumInputs(enumVals: any[] = [], enumExten: any = {}, containerProps: any = {}, inputProps: any = {}, labelProps: any = {}, name?: true | string) {
      // inputProps = this.wrapFns(inputProps);
      return [enumVals.map(val => {
        let extenProps = getExten(enumExten, val);
        return {
          key: val,
          ...containerProps,
          children: [
            {value: val, name: name && (this.props.name + (name === true ? '' : name)), ...merge(inputProps, extenProps)},
            {...labelProps, children: [extenProps.label || val]}
          ]
        }
      })]
    },
    enumInputProps(enumVals: any[] = [], ...rest: any[]) {
      let props: any = {};
      for (let i = 0; i < rest.length; i += 2) props[rest[i]] = rest[i + 1];
      return [enumVals.map(val => {return {'children': {'0': props}}})]
    },
    enumInputValue(enumVals: any[] = [], value: any, property = 'checked') {
      value = toArray(value);
      return [enumVals.map(val => {return {'children': {'0': {[property]: !!~value.indexOf(val)}}}})]
    },
  },
  parts: {
    RadioSelector: {
      _$widget: '^/widgets/Input',
      _$cx: '^/_$cx',
      _$useTag: 'div',
      type: 'notInput',
      children: [],
      $_maps: {
        value: '@/selector/value',
        children: [
          {
            $: '^/fn/enumInputs',
            args: [
              '@/selector/enum',
              '@/selector/enumExten',
              {_$useTag: 'label', _$cx: '^/_$cx'},
              {
                _$widget: 'input',
                type: 'radio',
                onChange: {$: '^/fn/eventValue|setValue|updCached', args: ['${0}', {path: './@/selector/value'}]},
                onBlur: '^/sets/nBase/Main/onBlur',
                onFocus: '^/sets/nBase/Main/onFocus',
              },
              {_$useTag: 'span', _$cx: '^/_$cx',},
              true
            ],
            replace: false,
          },
          {$: '^/fn/enumInputValue', args: ['@/selector/enum', '@/selector/value'], replace: false},
          {$: '^/fn/enumInputProps', args: ['@/selector/enum', 'readOnly', '@/params/readonly', 'disabled', '@/params/disabled'], replace: false}
        ]
      }
    },
    Autowidth: {
      _$widget: '^/widgets/Autowidth',
      addWidth: 35,
      minWidth: 60,
      $_maps: {
        value: 'value',
        placeholder: '@/params/placeholder',
        'className/hidden': '@/params/hidden',
        $FField: {$: '^/fn/getProp', args: [], update: 'build'},
      }
    },
    Button: {
      _$widget: '^/widgets/Generic',
      _$cx: '^/_$cx',
      _$useTag: 'button',
      type: 'button',
      $_maps: {
        'className/button-viewer': '@/params/viewer',
        disabled: '@/params/disabled',
      }
    },
    Submit: {
      $_ref: '^/parts/Button',
      type: 'submit',
      children: ['Submit']
      // $_maps: {disabled: {$: '^/fn/not', args: '@/status/valid'},}
    },
    Reset: {
      $_ref: '^/parts/Button',
      children: ['Reset'],
      onClick: {$: '^/fn/api', args: ['reset']},
      $_maps: {
        disabled: '@/status/pristine',
      }
    },
    ArrayAddButton: {
      $_ref: '^/parts/Button',
      children: ['+'],
      onClick: {$: '^/fn/api', args: ['arrayAdd', './', 1]},
      $_maps: {
        'className/hidden': {$: '^/fn/equal | ^/fn/not', args: ['@/fData/type', 'array']},
        'disabled': {$: '^/fn/equal', args: [true, {$: '^/fn/not', args: '@/fData/canAdd'}, '@params/disabled']}
      }
    },
    ArrayDelButton: {
      $_ref: '^/parts/Button',
      children: ['-'],
      onClick: {$: '^/fn/api', args: ['arrayAdd', './', -1]},
      $_maps: {
        'className/hidden': {$: '^/fn/equal | ^/fn/not', args: ['@/fData/type', 'array']},
        'disabled': {$: '^/fn/equal', args: [true, {$: '^/fn/not', args: '@/length'}, '@params/disabled']},
      },
    },
    ArrayEmpty: {
      children: '(array is empty)',
      _$useTag: 'span',
      $_maps: {'className/hidden': {$: '^/fn/equal | ^/fn/not', args: ['@/length', 0]}}
    },
    ArrayItemMenu: {
      _$widget: '^/widgets/ItemMenu',
      _$cx: '^/_$cx',
      buttons: ['first', 'last', 'up', 'down', 'del'],
      onClick: {$: '^/fn/api', args: ['arrayItemOps', './', '${0}']},
      buttonsProps: {
        first: {disabledCheck: 'canUp'},
        last: {disabledCheck: 'canDown'},
        up: {disabledCheck: 'canUp'},
        down: {disabledCheck: 'canDown'},
        del: {disabledCheck: 'canDel'},
      },
      $_maps: {arrayItem: '@/arrayItem', 'className/button-viewer': '@/params/viewer', disabled: '@params/disabled'},
    },
    Expander: {_$widget: 'div', className: {expand: true}}
  },
  _$cx: classNames
};


export {elementsBase as elements, formReducer, FForm, FFormStateAPI, fformCores};

export {extractMaps, normalizeMaps, updateProps}