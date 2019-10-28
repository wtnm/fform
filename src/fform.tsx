/** @jsx h */

import {createElement as h, Component, forwardRef} from 'react';
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
  memoize, isNumber, setIn, push2array,
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
  multiplePath,
  processFn,
  isMapFn,
  normalizeFn,
  normalizeArgs,
  processProp,
  isElemRef
} from './stateLib'
import {FFormStateAPI, fformCores, objectResolver, formReducer, skipKey} from './api'

const _$cxSym = Symbol('_$cx');

class FFormEvent {
  type: string;
  bubbles: boolean;
  cancelable: boolean;
  detail: any;
  defaultPrevented: boolean;

  constructor(event: string, params: any = {}) {
    const self = this;
    self.type = event;
    self.bubbles = !!params.bubbles;
    self.cancelable = !!params.cancelable;
    self.detail = !!params.detail;
  }

  preventDefault() {
    this.defaultPrevented = true;
  }
}

/////////////////////////////////////////////
//  Main class
/////////////////////////////////////////////
class FForm extends Component<FFormProps> {
  static params = ['readonly', 'disabled', 'viewer', 'liveValidate', 'liveUpdate'];
  private _unsubscribe: any;
  private _savedState: any;
  private _savedValue: any;

  protected _root: any;
  protected _form: any;
  protected _methods: anyObject = {onSubmit: null, onChange: null, onStateChange: null};

  api: any;
  elements: any;
  parent: any;
  wrapFns = bindProcessorToThis;

  constructor(props: FFormProps, ...args: any[]) {
    super(props, ...args);
    const self = this;
    self.api = self._coreFromParams(props.core);

    Object.defineProperty(self, "elements", {get: () => self.api.props.elements});
    Object.defineProperty(self, "valid", {get: () => self.api.get('/@/status/valid')});

    self.parent = props.parent;

    self._updateMethods(props);
    self._initState(props);

    self._unsubscribe = self.api.addListener(self._handleStateUpdate.bind(self));
    self._setRootRef = self._setRootRef.bind(self);
    self._setFormRef = self._setFormRef.bind(self);
    self._submit = self._submit.bind(self);
    self.reset = self.reset.bind(self);
  }

  private _coreFromParams(coreParams: any) {
    return coreParams instanceof FFormStateAPI ? coreParams : fformCores(coreParams.name) || new FFormStateAPI(coreParams);
  }

  private _initState(props: FFormProps) {
    const self = this;
    const nextProps = {...props};
    if (props.touched !== null) nextProps.touched = !!nextProps.touched;
    FForm.params.forEach(k => {
      if (!isUndefined(nextProps[k])) nextProps[k] = (v: any) => isUndefined(v) ? props[k] : v
    });
    if (isUndefined(nextProps['value'])) nextProps['value'] = nextProps['inital'];
    self._updateValues(nextProps);
    if (!props.noValidation) self.api.validate(true);
  }

  private _updateMethods(nextProps: any, prevProps: any = {}) {
    const self = this;
    const newMethods = {};
    objKeys(self._methods).forEach(key => {
      if (prevProps[key] !== nextProps[key]) newMethods[key] = nextProps[key]
    });
    Object.assign(self._methods, self.wrapFns(objectResolver(self.elements, newMethods), {noStrictArrayResult: true}))
  }

  private _setRootRef(FField: any) {
    this._root = FField;
  }

  private _setFormRef(form: any) {
    this._form = form;
  }

  private _updateValues(nextProps: FFormProps, prevProps: any = {}) {
    const {state, value, inital, extData, noValidation, touched} = nextProps;
    const self = this;
    if (state && state !== prevProps.state) self.api.setState(state);
    if (inital && inital !== prevProps.inital) self.api.setValue(inital, {replace: true, inital: true, noValidation});
    if (value && value !== prevProps.value) self.api.setValue(value, {replace: true, noValidation});
    if (extData && extData !== prevProps.extData) objKeys(extData).forEach(key => (self.api.set(key, (extData as any)[key], {replace: true})));
    if (!isUndefined(touched) && touched !== null && touched !== prevProps.touched)
      self.api.reset({status: 'untouched', value: touched ? 0 : undefined});
    FForm.params.forEach(k => (!isUndefined(nextProps[k]) && nextProps[k] !== prevProps[k] &&
      self.api.switch('/@/params/' + k, nextProps[k])));
  }

  private _handleStateUpdate(state: StateType) {
    const self = this;
    if (self._savedState == state) return;
    self._savedState = state;

    if (self._methods.onStateChange) self._methods.onStateChange(self._extendEvent(new FFormEvent('stateChanged')));
    if (state[SymData].current !== self._savedValue) {
      self._savedValue = state[SymData].current;
      if (self._methods.onChange) self._methods.onChange(self._extendEvent(new FFormEvent('valueChanged')))
    }
    if (self._root) self._root.setState({branch: state});
  }

  private _extendEvent(event: any) {
    const self = this;
    event.value = self.api.getValue();
    event.state = self.api.getState();
    event.fform = self;
    return event;
  }

  private _submit(event: any) {
    const self = this;
    let active = self.api.get('/@active');
    if (active) {
      let activeField = self.getRef(active + '@');
      activeField._updateCachedValue(true);
      self.api.execute();
    }

    const setPending = (val: any) => self.api.set([], val, {[SymData]: ['status', 'pending']});

    const setMessagesFromSubmit = (messages: any = []) => {
      if (isUndefined(messages)) return;
      toArray(messages).forEach(value => {
        if (!value) return;
        let opts = value[SymData];
        self.api.setMessages(objKeys(value).length ? value : null, opts)
      })
    };

    self.api.set([], 0, {[SymData]: ['status', 'untouched'], execute: true, macros: 'switch'});

    if (self._methods.onSubmit) {
      self.api.setMessages(null, {execute: true});

      let result = self._methods.onSubmit(self._extendEvent(event));
      if (result && result.then && typeof result.then === 'function') { //Promise
        setPending(1);
        result.then((messages: any) => {
          setPending(0);
          setMessagesFromSubmit(messages)
        }, (reason: any) => {
          setPending(0);
          setMessagesFromSubmit(reason)
        })
      } else setMessagesFromSubmit(result)
    }
  }


  shouldComponentUpdate(nextProps: FFormProps) {
    const self = this;
    self.parent = nextProps.parent;

    let FFrormApiUpdate = false;
    let core = self._coreFromParams(nextProps.core);

    if (self.api !== core) {
      self._unsubscribe();
      self.api = core;
      self._unsubscribe = self.api.addListener(self._handleStateUpdate.bind(self));
      FFrormApiUpdate = true;
      self._initState(nextProps);
    } else self._updateValues(nextProps, self.props);

    self._updateMethods(nextProps, self.props);

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

  static _getPath() {
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

  reset(event?: any) {
    if (event) event.preventDefault();
    this.api.reset();
  }

  submit() {
    let event = new FFormEvent('submit', {cancelable: true});
    // let e = new Event('submit');
    // this._form.dispatchEvent(e);
    this._submit(event);
    if (!event.defaultPrevented) this._form.submit();
  }

  render() {
    const self = this;
    let {core, state, value, inital, extData, fieldCache, touched, parent, onSubmit, onChange, onStateChange, _$useTag: UseTag = self.elements.widgets.Form || 'form', ...rest} = self.props;
    FForm.params.forEach(k => delete (rest as any)[k]);
    objKeys(rest).forEach(k => (k[0] === '_' || k[0] === '$') && delete (rest as any)[k]); // remove props that starts with '_' or '$'
    return (
      <UseTag ref={self._setFormRef} {...rest} onSubmit={self._submit} onReset={self.reset}>
        <FField ref={self._setRootRef} id={(rest.id || self.api.name) + '/#'} name={self.api.name} pFForm={self} getPath={FForm._getPath} FFormApi={self.api}/>
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
  // private _isNotSelfManaged: boolean | undefined;
  private _blocks: string[] = [];
  private _widgets: object;
  private _components: object;
  private _maps: NPM4WidgetsType = {};
  private _$_parse: any;
  _forceLiveUpd: boolean = false;
  _forceUpd: boolean = false;

  get: Function | null = null;
  _layout: FFLayoutGeneric<jsFFCustomizeType>;
  $branch: any;
  schemaPart: jsJsonSchema;

  liveValidate: boolean;
  liveUpdate: boolean;
  path: any;
  api: any;
  pFForm: any;
  stateApi: any;
  wrapFns = bindProcessorToThis;

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
  }

  getRef(path: Path | string) {
    path = normalizePath(path);
    const self = this;
    if (!path.length) return self.$refs['@Main'];
    if (path.length == 1 && path[0] == SymData) return self;
    if (path[0][0] == '@') return path.length == 1 ? self.$refs[path[0]] : self.$refs[path[0]].getRef(path.slice(1));
    return self.$refs['@Main'] && self.$refs['@Main'].getRef && self.$refs['@Main'].getRef(path)
  }

  _resolver(value: any) {
    const self = this;
    try {
      return objectResolver(self.pFForm.elements, value);
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
      if (!stateApi.wrapper) {
        self.api = stateApi;
        return;
      }
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

  _updateCachedValue(update = this.liveUpdate || this._forceLiveUpd) {
    const self = this;
    self._cachedTimeout = undefined;
    if (update && self._cached) {
      self.stateApi.setValue(self._cached.value, {noValidation: !self.liveValidate && !self._forceLiveUpd, path: self.path, ...self._cached.opts});
      self._forceLiveUpd = false;
      self._cached = undefined;
    }
  }

  _cacheValue(path: any, value: any, fn: string = 'set', opts: any = {}): boolean | undefined {
    //if (path === null) return;
    const self = this;
    let fieldCache = self.pFForm.props.fieldCache;
    if (isUndefined(fieldCache) || fieldCache === true) fieldCache = isNumber(this.liveUpdate) ? this.liveUpdate : 40;

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
      if (fieldCache && !self._forceUpd) {
        if (self._cachedTimeout) clearTimeout(self._cachedTimeout);
        self._cachedTimeout = setTimeout(self._updateCachedValue.bind(self), fieldCache);
        const data = self.getData();
        const mappedData = self._mappedData;

        self.get = (...paths: any[]) => {
          let path = normalizePath(paths, self.path);
          if (isEqual(path, normalizePath('./@value', self.path))) return data.value;
          return self.stateApi.get(path)
        };
        self._setMappedData(prevData, data, true);
        self.get = null;
        if (mappedData != self._mappedData) self.forceUpdate();
      } else {
        self._forceUpd = false;
        self._updateCachedValue();
      }
      return true;
    }
    return;
  }


  _build() {
    const self = this;
    self.state = {branch: self.pFForm.getBranch(self.path)};
    self.$branch = self.state.branch;

    const schemaPart: jsJsonSchema = self.api.getSchemaPart(self.path);
    self.schemaPart = schemaPart;

    // self._isNotSelfManaged = !isSelfManaged(self.state.branch) || undefined;
    if ((isArray(schemaPart.type) || isUndefined(schemaPart.type)) && !schemaPart._presets)
      throw new Error('schema._presets should be defined explicitly for multi type');

    self._layout = self.wrapFns(resolveComponents(self.pFForm.elements, schemaPart._layout));

    let resolvedComponents = resolveComponents(self.pFForm.elements, schemaPart._custom, schemaPart._presets || schemaPart.type);
    resolvedComponents = self.wrapFns(resolvedComponents);
    let {$_maps, rest: components} = extractMaps(resolvedComponents);

    self._maps = normalizeMaps($_maps);
    self._widgets = {};
    self._components = components;
    self._blocks = objKeys(components).filter(key => components[key]);
    self._blocks.forEach((block: string) => {
      const {_$widget, $_reactRef, _$skipKeys, ...staticProps} = components[block];
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
    //try {
    if (isUndefined(self.state.branch)) return null;
    if (getIn(self.getData(), 'params', 'norender')) return false;
    if (self._rebuild) this._build();
    return self._widgets['Builder'] ? h(self._widgets['Builder'], self._mappedData['Builder'], self._mappedData) : null;
    // } catch (e) {
    //   throw self._addErrPath(e)
    // }
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
    self._setWidRef = (key: number | string) => (item: any) => self._widgets[key] = item;
  }

  _getMappedData(key: number) {
    const self = this;
    return () => self._mappedData[key]
  }


  _build(props: any) {

    function makeLayouts_INNER_PROCEDURE(UPDATABLE: { counter: number, keys: string[] }, fields: Array<string | FFLayoutGeneric<jsFFCustomizeType>>) {
      const layout: any[] = [];
      objKeys(fields).forEach(key => {
        let fieldOrLayout = fields[key];
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
      let {$_fields, $_reactRef, _$skipKeys, _$widget = LayoutDefaultWidget, className, ...staticProps} = rest;
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

    const {$branch, $layout, _$cx, arrayStart, strictLayout, LayoutDefaultWidget = 'div', LayoutDefaultClass = {}, uniqKey, focusField} = props;

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

    if ($_fields)// we make inital _objectLayouts, every key that was used in makeLayouts call removed from UPDATABLE.keys 
      self._objectLayouts = makeLayouts_INNER_PROCEDURE(UPDATABLE, $_fields);
    if (strictLayout !== true)// and here in UPDATABLE.keys we have only keys was not used, we add them to the top layer if strictLayout allows
      UPDATABLE.keys.forEach(fieldName => self._objectLayouts.push(self._makeFField(fieldName)));

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
                   id={self.props.id ? self.props.id + '/' + (arrayKey || fieldName) : undefined}
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
    if (['FFormApi', 'oneOf', 'branchKeys'].some(comparePropsFn(self.props, nextProps)))
      return self._rebuild = true;

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
    // try {
    if (props.viewer) {
      let {_$widget = UniversalViewer, ...rest} = props.$_viewerProps || {};
      rest.inputProps = props;
      rest.value = props.$FField.value;
      return h(_$widget, rest)
    }
    if (isSelfManaged(props.$branch)) return null;
    if (self._rebuild) self._build(props); // make rebuild here to avoid addComponentAsRefTo Invariant Violation error https://gist.github.com/jimfb/4faa6cbfb1ef476bd105
    return <FSectionWidget _$widget={self._$widget} _$cx={props._$cx} key={'widget_0'} ref={self._setWidRef((0))}
                           getMappedData={self._getMappedData(0)}>{self._objectLayouts}{self._arrayLayouts}</FSectionWidget>
    // } catch (e) {
    //   throw self.props.$FField._addErrPath(e)
    // }
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
    // console.log('className', className);
    if (typeof className == "string") debugger;
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
    objKeys($_reactRef).filter(v => isNaN(+v)).forEach(k => rest[k] = $_reactRef[k]); // assing all except numeric keys, as then assigned at _mapChildren
    return rest;
  }

  protected setElements2rest(rest: anyObject, _$elements: any) {
    if (!_$elements) return rest;
    let elms = {'^': _$elements};
    objKeys(rest).forEach(k => isElemRef(rest[k]) && (rest[k] = getIn(elms, string2path(rest[k]))));
    return rest
  }

  render(): any {
    const self = this;
    if (self.props.norender) return null;
    let {_$useTag: UseTag = 'div', _$cx, _$elements, className, $_reactRef, children, ...rest} = self.props;
    self._mapChildren(children, $_reactRef);
    self.setRef2rest(rest, $_reactRef);
    self.setElements2rest(rest, _$elements);
    if (!_$cx && _$elements) _$cx = _$elements._$cx;
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
      let {_$widget = UniversalViewer, ...rest} = props.$_viewerProps || {};
      rest.inputProps = props;
      rest.value = props.value;
      return h(_$widget, rest)
    }

    let {value, _$useTag: UseTag, type, $_reactRef, _$cx, _$elements, viewer, $_viewerProps, children, ...rest} = props;

    self._mapChildren(children, $_reactRef);
    self.setRef2rest(rest, $_reactRef);
    self.setElements2rest(rest, _$elements);
    if (!_$cx && _$elements) _$cx = _$elements._$cx;

    if (UseTag) {
      rest.type = type;
    } else {
      if (type == 'textarea' || type == 'select') UseTag = type;
      else {
        UseTag = 'input';
        rest.type = type;
      }
    }
    rest[type === 'checkbox' ? 'checked' : 'value'] = value;
    if (rest.className && _$cx) rest.className = _$cx(rest.className);
    //console.log(rest.value);
    return h(UseTag, rest, self._mapped)
  }
}


class Autowidth extends Component<any, any> {
  static readonly sizerStyle: any = {position: 'absolute', top: 0, left: 0, visibility: 'hidden', height: 0, overflow: 'scroll', whiteSpace: 'pre'};
  private _elem: any;

  componentDidMount() {
    let style: any;
    try {
      style = window && window.getComputedStyle(this.props.$FField.$refs['@Main']);
    } catch (e) {

    }
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
      props.$FField.$refs['@Main'].style &&
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
  let {_$useTag: WrapperW = 'div', _$cx = classNames, className, wrapperClassName = {}, ArrayItemMenu, ArrayItemBody, arrayItem, ...rest} = props;
  let {_$widget: IBodyW = 'div', className: IBodyCN = {}, ...IBodyRest} = ArrayItemBody || {};
  let {_$widget: IMenuW = 'div', className: IMenuCN = {}, ...IMenuRest} = ArrayItemMenu || {};
  if (!arrayItem) wrapperClassName = [wrapperClassName, className];
  else IBodyCN = [IBodyCN, className];

  const result = <WrapperW className={_$cx ? _$cx(wrapperClassName) : wrapperClassName} {...rest} />;
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
  const {_$useTag: UseTag = 'div', _$buttonDefaults = {}, _$cx, disabled, className, buttonsProps = {}, arrayItem, buttons = [], onClick: defaultOnClick, ...rest}: { [key: string]: any } = props;
  if (!arrayItem) return null;
  // console.log(arrayItem)
  buttons.forEach((key: string) => delete rest[key]);
  return (
    <UseTag className={_$cx(className)} {...rest}>
      {buttons.map((key: string) => {
        let {_$widget: ButW = 'button', type = 'button', disabledCheck = '', className: ButCN = {}, onClick = defaultOnClick, title = key, children = key, ...restBut}
          = Object.assign({}, _$buttonDefaults, buttonsProps[key] || {});
        if (!restBut.dangerouslySetInnerHTML) restBut.children = children;
        return (
          <ButW key={key} type={type} title={title} className={_$cx ? _$cx(ButCN) : ButCN}
                {...restBut} disabled={disabled || disabledCheck && !arrayItem[disabledCheck]} onClick={() => onClick(key)}/>)
      })}
    </UseTag>);
}


const Checkbox = forwardRef(({$tags = {}, $props = {}, children, placeholder, role = 'checkbox', type = "checkbox", className = "", ...rest}: any, ref) => {
  rest.ref = ref;
  rest.type = type;
  rest.key = "input";
  rest.role = "input";
  if ($props['input']) Object.assign(rest, $props['input']);
  return (
    h($tags['parent'] || 'label', Object.assign({className, role}, $props['parent'] || {}),
      [
        h($tags['input'] || 'input', rest),
        h($tags['label'] || 'span', {key: "label", role: "label", ...$props['label'] || {}}, placeholder)
      ]
    )
  )
});

const CheckboxNull = forwardRef((props: any, ref: any) => {
    const self = this;
    let {checked, onChange, nullValue = "", type, ...rest} = props;
    return <input type="checkbox" checked={checked === true} {...rest}
                  onChange={(event: any) => {
                    onChange((checked === nullValue ? true : (checked === true ? false : nullValue)), event)
                  }}
                  ref={elem => {
                    ref && ref(elem);
                    elem && (elem.indeterminate = (checked === nullValue))
                  }}/>
  }
)


///////////////////////////////
//     Functions
///////////////////////////////

function bindProcessorToThis(val: any, opts: anyObject = {}) {
  const self = this;
  const bindedFn = bindProcessorToThis.bind(self);
  if (isFunction(val)) val = {$: val};
  if (isMapFn(val)) {
    const map = val.norm ? val : normalizeFn(val, {...opts, wrapFn: bindedFn});
    const fn = processFn.bind(self, map);
    fn._map = map;
    return fn
  } else if (isMergeable(val)) {
    const result = isArray(val) ? [] : {};
    objKeys(val).forEach(key => result[key] = !skipKey(key, val) ? bindedFn(val[key], opts) : val[key]); //!~ignore.indexOf(key) &&
    return result
  }
  return val
}

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
  const result: { data: NormalizedDataProcessor[], every: NormalizedDataProcessor[], build: NormalizedDataProcessor[] } = {data: [], every: [], build: []};
  objKeys($_maps).forEach(key => {
    let value = $_maps[key];
    if (!value) return;
    const to = multiplePath(normalizePath((prePath ? prePath + '/' : '') + key));
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
function updateProps(mappedData: any, prevData: any, nextData: any, ...iterMaps: Array<NormalizedDataProcessor[] | false>) {
  // const getFromData = (arg: any) => isNPath(arg) ? getIn(nextData, arg) : arg;
  const needUpdate = (map: NormalizedDataProcessor): boolean => isUndefined(prevData) || !map.$ ||
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

const getExten = (enumExten: any, value: any) => {
  let res = isFunction(enumExten) ? enumExten(value) : getIn(enumExten, value);
  if (res && isString(res)) res = {label: res};
  return isObject(res) ? res : {};
};

function comparePropsFn(prevProps: anyObject, nextProps: anyObject, opts: { equal?: boolean } = {}) {
  if (opts.equal) return (key: string) => prevProps[key] === nextProps[key];
  else return (key: string) => prevProps[key] !== nextProps[key];
}

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
    let res = merge.all(this, elements, opts);
    if (this['_$cx.bind'] !== res['_$cx.bind'])
      res = merge(res, {'_$cx': res['_$cx.bind'] ? this[_$cxSym].bind(res['_$cx.bind']) : this[_$cxSym]});
    return res;
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
    Checkbox: Checkbox,
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
          'className/fform-hidden': '@/params/hidden',
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
        className: 'fform-body',
      },
      //Main: {},
      Message: {$_ref: '^/parts/Message'}
    },
    simple: {
      $_ref: '^/sets/base',
      Main: {
        _$widget: '^/widgets/Input',
        _$cx: '^/_$cx',
        $_reactRef: {ref: true},
        $_viewerProps: {_$cx: '^/_$cx', emptyMock: '(no value)', className: {'fform-viewer': true}},
        onChange: {$: '^/fn/eventValue|setValue'},
        onBlur: {$: '^/fn/blur'},
        onFocus: {$: '^/fn/focus'},
        $_maps: {
          // priority: '@/status/priority',
          value: {$: '^/fn/iif', args: [{$: '^/fn/equal', args: ['@value', null]}, '', '@value']},
          viewer: '@/params/viewer',
          autoFocus: '@/params/autofocus',
          readOnly: '@/params/readonly',
          disabled: '@/params/disabled',
          placeholder: '@/fData/placeholder',
          required: '@/fData/required',
          label: '@/fData/title',
          '$_viewerProps/enumExten': '@/fData/enumExten',
          id: {$: '^/fn/getProp', args: 'props/id', update: 'build'},
          name: {$: '^/fn/getProp', args: 'props/name', update: 'build'},
          'className/fform-input-priority': {$: '^/fn/setInputPriority', args: '@/status/priority'}
        }
      },
      Title: {
        _$widget: '^/widgets/Generic',
        _$cx: '^/_$cx',
        _$useTag: 'label',
        children: [],
        $_maps: {
          'className/fform-required': '@/fData/required',
          'children/0': '@/fData/title',
          'className/fform-hidden': {$: '^/fn/not', args: '@/fData/title'},
          htmlFor: {$: '^/fn/getProp', args: ['id'], update: 'build'},
          'className/fform-title-viewer': '@/params/viewer'
        }
      },
    },
    string: {
      $_ref: '^/sets/simple',
      Main: {type: 'text'}
    },
    textarea: {
      $_ref: '^/sets/simple',
      Main: {type: 'textarea', $_viewerProps: {className: {'fform-viewer': false, 'fform-viewer-inverted': true}}},
      Title: {
        $_maps: {
          'className/fform-title-viewer-inverted': '@/params/viewer'
        }
      }
    },
    integer: {
      $_ref: '^/sets/simple',
      Main: {
        type: 'number',
        onChange: {$: '^/fn/eventValue|parseNumber|setValue', args: ['${0}', true, 0]},
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
    'null': {$_ref: '^/sets/simple', Main: false},
    boolean: {
      $_ref: '^/sets/simple',
      Main: {
        type: 'checkbox',
        _$useTag: "^/widgets/Checkbox",
        onChange: {$: '^/fn/eventChecked|setValue|liveUpdate'}
      },
    },
    booleanNull: {
      $_ref: '^/sets/boolean',
      Main: {
        $tags: {'input': '^/widgets/CheckboxNull', _$skipKeys: ['input']},
        onChange: {$: '^/fn/parseTristate|setValue|liveUpdate', args: ['${0}']},
      },
    },
    booleanLeft: {$_ref: '^/sets/boolean'},
    booleanNullLeft: {$_ref: '^/sets/booleanNull'},
    object: {
      $_ref: '^/sets/base',
      Main: {
        _$widget: '^/widgets/Section',
        _$cx: '^/_$cx',
        $_reactRef: true,
        uniqKey: 'params/uniqKey',
        LayoutDefaultClass: 'layout',
        LayoutDefaultWidget: 'div',
        $_viewerProps: {$_ref: '^/sets/simple/Main/$_viewerProps'},
        $_maps: {
          length: '@/length',
          oneOf: '@/oneOf',
          branchKeys: '@/branchKeys',
          strictLayout: '@/fData/strictLayout',
          isArray: {$: '^/fn/equal', args: ['@/fData/type', 'array']},
          $branch: {$: '^/fn/getProp', args: '$branch', update: 'every'},
          arrayStart: {$: '^/fn/getArrayStart', args: [], update: 'build'},
          $FField: {$: '^/fn/getProp', args: [], update: 'build'},
          FFormApi: {$: '^/fn/getProp', args: 'props/pFForm/api', update: 'build'},
          id: {$: '^/fn/getProp', args: 'props/id', update: 'build'},
          name: {$: '^/fn/getProp', args: 'props/name', update: 'build'},
          $layout: {$: '^/fn/getProp', args: '_layout', update: 'build'}
        }
      },
      Title: {
        _$widget: '^/widgets/Generic',
        _$cx: '^/_$cx',
        _$useTag: 'legend',
        children: [
          {$_ref: '^/sets/simple/Title', _$useTag: 'span'},
          {$_ref: '^/parts/ArrayAddButton'},
          {$_ref: '^/parts/ArrayDelButton'},
          {$_ref: '^/parts/ArrayEmpty'}],
      },
      Wrapper: {_$useTag: 'fieldset'},
    },
    array: {$_ref: '^/sets/object'},
    select: {
      $_ref: '^/sets/simple',
      Main: {
        type: 'select',
        children: [],
        onChange: {$: '^/fn/eventValue|setValue|liveUpdate'},
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
        onChange: {$: '^/fn/eventMultiple|setValue|liveUpdate'}
      }
    },
    radio: {
      $_ref: '^/sets/base',
      Title: {$_ref: '^/sets/simple/Title'},
      Main: {
        $_ref: '^/parts/RadioSelector',
        $_reactRef: true,
        $_viewerProps: {$_ref: '^/sets/simple/Main/$_viewerProps'},
        $_maps: {
          value: '@/value',
          viewer: '@/params/viewer',
          children: [
            {
              args: [
                '@/fData/enum',
                '@/fData/enumExten',
                {onChange: {args: ['${0}']}}, //{$_reactRef: {'$_reactRef': {'0': {'ref': true}}}},
                true
              ],
            },
            {args: ['@/fData/enum', '@/value']},
            {args: {0: '@/fData/enum'}},
          ]
        }
      }
    },
    checkboxes: {$_ref: '^/sets/radio', Main: {$_maps: {children: {'0': {args: {'2': {type: 'checkbox', onChange: {$: '^/fn/eventCheckboxes|setValue|liveUpdate'}}, '5': '[]'}}}}}},

    $radioNull: {Main: {$_maps: {children: {'0': {args: {'3': {onClick: '^/fn/eventValue|radioClear|liveUpdate'}}}}}}},
    $radioEmpty: {Main: {$_maps: {children: {'0': {args: {'3': {onClick: {$: '^/fn/eventValue|radioClear|liveUpdate', args: ['${0}', '']}}}}}}}},
    $autowidth: {
      Autowidth: {$_ref: '^/parts/Autowidth'},
      Wrapper: {className: {'fform-shrink': true}},
    },
    $noArrayControls: {Wrapper: {$_maps: {'arrayItem': false}}},
    $noArrayButtons: {Title: {$_ref: '^/sets/simple/Title'}},
    $inlineItems: {Main: {className: {'fform-inline': true}}},
    $inlineTitle: {Wrapper: {wrapperClassName: {'fform-inline': true}}},
    $inlineLayout: {Main: {LayoutDefaultClass: {'fform-inline': true}}},
    $inlineArrayControls: {Wrapper: {ArrayItemBody: {className: {'fform-inline': true}}}},
    $arrayControls3but: {Wrapper: {ArrayItemMenu: {buttons: ['up', 'down', 'del'],}}},
    $arrayControlsDelOnly: {Wrapper: {ArrayItemMenu: {buttons: ['del'],}}},
    $noTitle: {Title: false},
    $noMessage: {Message: false},
    $shrink: {Wrapper: {className: {'fform-shrink': true}}},
    $expand: {Wrapper: {className: {'fform-expand': true}}},
    $password: {Main: {type: 'password'}},
    // $W: (path: Path, rPath: Path) => ({Wrapper: {className: {[rPath[0]]: !rPath[1]}}}),
    // $A: (path: Path, rPath: Path) => ({Wrapper: {ArrayItemMenu: {className: {[rPath[0]]: !rPath[1]}}}}),
    // $M: (path: Path, rPath: Path) => ({Main: {className: {[rPath[0]]: !rPath[1]}}}),
    // $T: (path: Path, rPath: Path) => ({Title: {className: {[rPath[0]]: !rPath[1]}}}),
    // $B: (path: Path, rPath: Path) => ({Body: {className: {[rPath[0]]: !rPath[1]}}}),
    // $MSG: (path: Path, rPath: Path) => ({Message: {className: {[rPath[0]]: !rPath[1]}}}),
    $: '^/$',
    $C: '^/$C',
    $S: '^/$S',
  },
  fn: {
    api(fn: string, ...args: any[]) {this.api[fn](...args)},
    format(str: string, ...args: any[]) {
      return [args.reduce((str, val, i) => str.replace('{' + i + '}', val), str)]
    },

    iif: (iif: any, trueVal: any, falseVaL: any, ...args: any[]) => [iif ? trueVal : falseVaL, ...args],
    not: (v: any, ...args: any[]) => [!v, ...args],
    equal: (a: any, ...args: any[]) => [args.some(b => a === b)],
    equalAll: (a: any, ...args: any[]) => [args.every(b => a === b)],
    or: (...args: any[]) => [args.some(Boolean)],
    and: (...args: any[]) => [args.every(Boolean)],

    getArrayStart(...args: any[]) {return [arrayStart(this.schemaPart), ...args]},
    getProp(key: string, ...args: any[]) {return [getIn(this, normalizePath(key)), ...args]},

    eventValue: (event: any, ...args: any[]) => [
      event.target.value, ...args],
    eventChecked: (event: any, ...args: any[]) => [event.target.checked, ...args],
    parseTristate: (value: any, ...args: any[]) => [value === "" ? null : value, ...args],
    eventMultiple: (event: any, ...args: any[]) =>
      [Array.from(event.target.options).filter((o: any) => o.selected).map((v: any) => v.value), ...args],
    parseNumber: (value: any, int: boolean = false, empty: number | null = null, ...args: any[]) =>
      [value === '' ? empty : (int ? parseInt : parseFloat)(value), ...args],

    setValue(value: any, opts: any = {}, ...args: any[]) {
      this.api.setValue(value, opts);
      return args;
    },
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
    liveUpdate(...args: any[]) {
      this._forceLiveUpd = true;
      return args;
    },
    forceUpdate(...args: any[]) {
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

    messages(messages: any, staticProps: anyObject = {}) {
      const {className: cnSP = {}, ...restSP} = staticProps;
      return [objKeys(messages || []).map(priority => {
        const {norender, texts, className = {}, ...rest} = messages[priority];
        const children: any[] = [];
        objKeys(texts).forEach((key: string) =>
          toArray(texts[key]).forEach((v, i, arr) => {
            if (isElemRef(v)) v = this._resolver(v);
            (isString(v) && isString(children[children.length - 1])) ? children.push({_$widget: 'br'}, v) : children.push(v)
          }));
        if (norender || !children.length) return null;
        return {children, ...restSP, className: {['fform-message-priority-' + priority]: true, ...cnSP, ...className}, ...rest}
      })]
    },
    arrayOfEnum(enumVals: any[] = [], enumExten: any = {}, staticProps: any = {}, name?: true | string) {
      return [enumVals.map(val => {
        let extenProps = getExten(enumExten, val);
        return {key: val, children: [extenProps.label || val], name: name && (this.name + (name === true ? '' : name)), ...extenProps, ...staticProps, value: val}
      })]
    },
    enumInputs(enumVals: any[] = [], enumExten: any = {}, inputProps: any = {}, opts: any = {}) {
      return [enumVals.map(val => {
        let {label, ...extenProps} = getExten(enumExten, val);
        return {
          key: val,
          name: name && (this.props.name + (opts.name === true ? '' : opts.name)),
          ...merge(inputProps, extenProps),
          placeholder: label || val,
          value: val
        }
      })]
    },
    enumInputProps(enumVals: any[] = [], ...rest: any[]) {
      let props: any = {};
      for (let i = 0; i < rest.length; i += 2) props[rest[i]] = rest[i + 1];
      return [enumVals.map(val => props)]
    },
    enumInputValue(enumVals: any[] = [], value: any, property = 'checked') {
      value = toArray(value);
      return [enumVals.map(val => {return {[property]: !!~value.indexOf(val)}})]
    },
    setInputPriority(priority?: number) {
      if (typeof priority == 'number') return ['fform-input-priority-' + priority];
      else return [false]
    }
  },
  parts: {
    Message: {
      _$widget: '^/widgets/Generic',
      _$cx: '^/_$cx',
      children: [],
      $_maps: {
        children: {$: '^/fn/messages', args: ['@/messages', {}]},
        'className/fform-hidden': {$: '^/fn/or', args: ['@/params/viewer', '!@/status/touched']},
      }
    },
    RadioSelector: {
      _$widget: '^/widgets/Input',
      _$cx: '^/_$cx',
      _$useTag: 'div',
      //type: 'notInput',
      children: [],
      $_maps: {
        value: '@/selector/value',
        children: [
          {
            $: '^/fn/enumInputs',
            args: [
              '@/selector/enum',
              '@/selector/enumExten',
              {
                _$widget: '^/widgets/Checkbox',
                type: 'radio',
                onChange: {$: '^/fn/eventValue|setValue|liveUpdate', args: ['${0}', {path: './@/selector/value'}]},
                onBlur: '^/sets/simple/Main/onBlur',
                onFocus: '^/sets/simple/Main/onFocus',
              },
              {name: true}
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
        'className/fform-hidden': '@/params/hidden',
        $FField: {$: '^/fn/getProp', args: [], update: 'build'},
      }
    },
    Button: {
      _$widget: 'button',
      type: 'button',
      $_maps: {
        'className/fform-hidden': '@/params/viewer',
        disabled: '@/params/disabled',
      }
    },
    Submit: {
      $_ref: '^/parts/Button',
      type: 'submit',
      children: ['Submit']
    },
    Reset: {
      $_ref: '^/parts/Button',
      type: 'reset',
      children: ['Reset'],
      $_maps: {
        disabled: '@/status/pristine',
      }
    },
    ArrayAddButton: {
      $_ref: '^/parts/Button',
      children: ['+'],
      onClick: {$: '^/fn/api', args: ['arrayAdd', './', 1]},
      $_maps: {
        'className/fform-hidden': {$: '^/fn/or', args: ['@/params/viewer', {$: '^/fn/equal | ^/fn/not', args: ['@/fData/type', 'array']}]},
        'disabled': {$: '^/fn/or', args: ['!@/fData/canAdd', '@params/disabled']}
      }
    },
    ArrayDelButton: {
      $_ref: '^/parts/ArrayAddButton',
      children: ['-'],
      onClick: {args: {2: -1}},
      $_maps: {
        'disabled': {$: '^/fn/or', args: ['!@/length', '@params/disabled']}
      }
    },
    ArrayEmpty: {
      children: '(array is empty)',
      _$widget: 'span',
      $_maps: {'className/fform-hidden': {$: '^/fn/equal | ^/fn/not', args: ['@/length', 0]}}
    },
    ArrayItemMenu: {
      _$widget: '^/widgets/ItemMenu',
      _$cx: '^/_$cx',
      _$buttonDefaults: '^/parts/Button',
      buttons: ['first', 'last', 'up', 'down', 'del'],
      onClick: {$: '^/fn/api', args: ['arrayItemOps', './', '${0}']},
      buttonsProps: {
        first: {disabledCheck: 'canUp'},
        last: {disabledCheck: 'canDown'},
        up: {disabledCheck: 'canUp'},
        down: {disabledCheck: 'canDown'},
        del: {disabledCheck: 'canDel'},
      },
      $_maps: {arrayItem: '@/arrayItem', 'className/fform-button-viewer': '@/params/viewer', disabled: '@params/disabled'},
    },
    Expander: {_$widget: 'div', className: {'fform-expand': true}}
  },
  _$cx: classNames,
  [_$cxSym]: classNames,
  $: (elems: any, path: Path) => {
    let pathVal = path.map((v) => {
      v = elems['_$shorts'][v] || v;
      if (isString(v) && v.length == 2) {
        let el0 = elems['_$shorts'][v[0]];
        let el1 = elems['_$shorts'][v[1]];
        if (el0 && el1) {
          if (isArray(el1)) v = el1.map((k: string) => el0 + k);
          else v = el0 + el1;
        }
        return toArray(v).join(',');
      }
      return v;
    });
    let pathes = multiplePath(pathVal);
    let res = {};
    objKeys(pathes).forEach(key => setIn(res, pathes[key].pop(), pathes[key]));
    return res;
  },
  $C: (elems: any, path: Path) => {
    path = path.slice();
    let className = path.pop();
    let value = !(className[0] === '!');
    if (!value) className = className.substr(1);
    push2array(path, 'className', className, value);
    return elems.$(elems, path)
  },
  $S: (elems: any, path: Path) => {
    path = path.slice();
    let style: Path = [];
    style.unshift(path.pop());
    style.unshift(path.pop());
    push2array(path, 'style', style);
    return elems.$(elems, path)
  },
  _$shorts: {
    'W': 'Wrapper',
    'M': 'Main',
    'B': 'Body',
    'T': 'Title',
    'MSG': 'Message',
    'm': 'margin',
    'p': 'padding',
    't': 'Top',
    'b': 'Bottom',
    'l': 'Left',
    'r': 'Right',
    'x': ['Left', 'Right'],
    'y': ['Top', 'Bottom'],
    'fg': 'flexGrow',
    'fs': 'flexShirnk',
    'fd': 'flexDirection',
    'fw': 'flexWrap',
    'fb': 'flexBasis',
    'minW': 'minWidth',
    'minH': 'minHeight',
    'maxW': 'maxWidth',
    'maxH': 'maxHeight',
    'as': 'alignSelf',
    'ai': 'alignItems',
    'jc': 'justifyContent'
  }
};


export {elementsBase as elements, formReducer, FForm, FField, FFormStateAPI, fformCores};

export {extractMaps, normalizeMaps, updateProps, classNames, comparePropsFn, getExten}