/** @jsx h */

import {createElement as h, Component, forwardRef, isValidElement, PureComponent} from 'react';

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
  MergeStateOptionsArgument,
  propsExtender,
  isElemRef,
  objMap,
  objectResolver,
  skipKey,
  extendSingleProps
} from "react-ts-utils";

import {
  arrayStart,
  isSelfManaged,
  path2string,
  string2path,
  SymData,
  normalizePath,
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
  SymReset, getUniqKey
} from './stateLib'

import {FFormStateAPI, anSetState} from './api'


const _$cxSym = Symbol('_$cx');

export const _CORES = new WeakMap();
export const _SCHEMAS = new WeakMap();
const _schemasId = new WeakMap();

function fformCores(nameOrProps: string | FFormApiProps) {
  return isString(nameOrProps) ? _CORES[nameOrProps] : new FFormStateAPI(nameOrProps);
}

function schemaRegister(schema: JsonSchema | jsJsonSchema) {
  let $id = schema.$id || _schemasId.get(schema);
  if (!$id) {
    _schemasId.set(schema, getUniqKey());
    $id = _schemasId.get(schema)
  }
  _SCHEMAS[$id] = (schema as jsJsonSchema)._schema || schema;
  return $id
}

let formReducerValue = 'fforms';

function getFRVal() {
  return formReducerValue
}

function formReducer(name?: string): any {
  if (name) formReducerValue = name;
  const reducersFunction = {};

  function replaceFormState(storageState: any, name: string, formState: any) {
    if (storageState[name] !== formState) {
      let resultState = {...storageState};
      resultState[name] = formState;
      return resultState;
    }
    return storageState
  }

  reducersFunction[anSetState] = (state: any, action: any): any => {
    if (action.api.props.store) return replaceFormState(state, action.api.name, action.state);
    return action.state
  };

  return (state: any = {}, action: ActionType) => {
    let reduce = reducersFunction[action.type];
    return reduce ? reduce(state, action) : state;
  }
}

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
    return coreParams instanceof FFormStateAPI ? coreParams : new FFormStateAPI(coreParams);
  }

  private _initState(props: FFormProps) {
    const self = this;
    const nextProps = {...props};
    if (props.touched !== null) nextProps.touched = !!nextProps.touched;
    FForm.params.forEach(k => {
      if (!isUndefined(nextProps[k])) nextProps[k] = (v: any) => isUndefined(v) ? props[k] : v
    });
    if (isUndefined(nextProps['value'])) nextProps['value'] = nextProps['initial'];
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
    const {state, value, initial, extData, noValidation, touched} = nextProps;
    const self = this;
    if (state && state !== prevProps.state) self.api.setState(state);
    if (initial && initial !== prevProps.initial) self.api.setValue(initial, {replace: true, initial: true, noValidation});
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

  applyCache = () => {
    const self = this;
    let active = self.api.get('/@active');
    if (active) {
      let activeField = self.getRef(active + '@');
      if (activeField) {
        activeField._updateCachedValue(true);
        self.api.execute();
      }
    }
  };

  private _submit(event: any) {
    const self = this;
    self.applyCache();

    const setSubmitting = (val: any) => self.api.set([], val, {[SymData]: ['status', 'submitting']});

    const setMessagesFromSubmit = (messages: any = []) => {
      if (isUndefined(messages)) return;
      toArray(messages).forEach(value => {
        if (!value) return;
        let opts = value[SymData];
        self.api.setMessages(objKeys(value).length ? value : null, opts)
      })
    };

    self.api.set([], 0, {[SymData]: ['status', 'untouched'], execute: true, macros: 'switch'});
    self.api.set([], 0, {[SymData]: ['status', 'unsubmitted'], execute: true, macros: 'switch'});

    if (self._methods.onSubmit) {
      self.api.setMessages(null, {execute: true});

      let result = self._methods.onSubmit(self._extendEvent(event));
      if (result && result.then && typeof result.then === 'function') { //Promise
        setSubmitting(1);
        result.then((messages: any) => {
          setSubmitting(0);
          setMessagesFromSubmit(messages)
        }, (reason: any) => {
          setSubmitting(0);
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

    return FFrormApiUpdate || !isEqual(self.props, nextProps, {skipKeys: ['core', 'state', 'value', 'initial', 'extData', 'fieldCache', 'flatten', 'noValidate', 'parent', 'onSubmit', 'onChange', 'onStateChange']});
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
    let {core, state, value, initial, extData, fieldCache, touched, parent, onSubmit, onChange, onStateChange, _$useTag: UseTag = self.elements.widgets.Form || 'form', ...rest} = self.props;
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

  getRef(path: Path) {
    const self = this;
    if (!path.length) return self;
    if (path.length == 1 && !self.$refs[path[0]].getRef) return self.$refs[path[0]];
    return self.$refs[path[0]] && self.$refs[path[0]].getRef && self.$refs[path[0]].getRef(path.slice(1));
  }

  protected _setRef = (name: string | string[]) => {
    return (v: any) => setIn(this.$refs, v, isString(name) ? name.split('/') : name)
  };

  protected _refProcess($reactRef: any) {
    const self = this;
    // if ($reactRef === true) return self._setRef(defaultName);
    // else
    if (isString($reactRef) || isArray($reactRef)) return self._setRef($reactRef);
    else if (isMergeable($reactRef))
      return objMap($reactRef, self._refProcess.bind(self));
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
  private _blocks: string[] = [];
  private _widgets: object;
  private _uniqKey2key: { [key: string]: number | string } = {};
  private _uniqKey2field: { [key: string]: any } = {};
  private _layoutKeys: any; // fields that were used in layout
  // private _arrayLayouts: any[] = [];
  private _$wrapper: any = 'div';
  private _components: object;
  private _maps: NPM4WidgetsType = {};
  private _$_parse: any;
  _forceLiveUpd: boolean = false;
  _preventLiveUpd: boolean = false;
  _forceUpd: boolean = false;

  get: Function | null = null;
  // _layout: FFLayoutGeneric<jsFFCustomizeType>;
  restFields: any[];
  $branch: any;
  schemaPart: jsJsonSchema;
  arrayStart: any;
  mainPreset: string;
  fieldName: string;

  liveValidate: boolean;
  liveUpdate: boolean;
  path: any;
  api: any;
  _$cx: any;
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
    Object.defineProperty(self, "_$cx", {get: () => self.props.pFForm.elements._$cx});
    self.state = {branch: self.pFForm.getBranch(self.path)};
    self.$branch = self.state.branch;
    self._updateStateApi(props.pFForm.api);
  }

  _setWidRef = (key: number | string) => (item: any) => this._widgets[key] = item;

  getRef(path: Path | string) { // todo: rework
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
      });
      api._set = api.set;
      api._setValue = api.setValue;
      api.set = (...args: any[]) => self._cacheValue(args[0], args[1], 'set', args[2]) || api._set(...args);
      api.setValue = (...args: any[]) => self._cacheValue((args[1] || {}).path, args[0], 'setValue', args[1]) || api._setValue(...args);
      self.api = api;
    }
  }

  _updateCachedValue(update = (this.liveUpdate || this._forceLiveUpd) && !this._preventLiveUpd) {
    const self = this;
    self._cachedTimeout = undefined;
    if (update && self._cached) {
      console.log('update', self._cached);
      let prevData = self.getData();
      let stateUpd = self.stateApi.setValue(self._cached.value, {noValidation: !self.liveValidate && !self._forceLiveUpd, path: self.path, ...self._cached.opts});
      self._forceLiveUpd = false;
      self._cached = undefined;
      (async () => {
        await stateUpd;
        let data = self.getData();
        //console.log('data', data);
        self._setMappedData(prevData, data, true);
      })()
    }
  }

  _cacheValue(path: any, value: any, fn: string = 'set', opts: any = {}): boolean | undefined {
    const self = this;
    let fieldCache = self.pFForm.props.fieldCache;
    if (isUndefined(fieldCache) || fieldCache === true) fieldCache = isNumber(this.liveUpdate) ? this.liveUpdate : 40;

    let valueSet = fn === 'setValue' && (!path || path == './' || path == '.');
    if (!valueSet) {
      let fPath = self.path;
      path = '#/' + path2string(normalizePath(path, self.path)) + (fn === 'setValue' ? '/@/value' : '');
      valueSet = (path == fPath + '/@/value') || (path == '#/@/current/' + fPath.slice(2));
    }
    if (valueSet) {
      console.log('valueSet', valueSet);
      let prevData = self.getData();
      self._cached = {value, opts};
      if (fieldCache && !self._forceUpd) {
        if (self._cachedTimeout) clearTimeout(self._cachedTimeout);
        self._cachedTimeout = setTimeout(self._updateCachedValue.bind(self), fieldCache);
        const data = self.getData();
        const oldMappedData = self._mappedData;

        self.get = (...paths: any[]) => {
          let path = normalizePath(paths, self.path);
          if (isEqual(path, normalizePath('./@value', self.path))) return data.value;
          return self.stateApi.get(path)
        };
        self._mappedData = self._setMappedData(prevData, data, true);
        self.get = null;
        if (oldMappedData != self._mappedData)
          self._updateWidgets(oldMappedData, self._mappedData);
      } else {
        self._forceUpd = false;
        self._updateCachedValue();
      }
      return true;
    }
    return;
  }


  _build() {
    function makeLayouts_INNER_PROCEDURE(UPDATABLE: { counter: number, keys: string[], blocks: string[] },
                                         fields: Array<string | FFLayoutGeneric<jsFFCustomizeType>>, opts: any = {}, layout: any[] = []) {
      fields = toArray(fields);
      objKeys(fields).forEach(key => {
        let fieldOrLayout = fields[key];
        let blockName;
        if (isString(fieldOrLayout) && fieldOrLayout[0] === '%') {
          if (fieldOrLayout[1] === '%') {
            blockName = fieldOrLayout.substr(2);
            let idx = UPDATABLE.blocks.indexOf(blockName);
            if (~idx) {
              fieldOrLayout = restComponents[blockName];
              UPDATABLE.blocks.splice(idx, 1);
            } else blockName = null;
          } else {// if field is string then _makeFField
            let fieldName = fieldOrLayout.substr(1);
            let idx = UPDATABLE.keys.indexOf(fieldName);
            if (~idx) {
              layout.push(self._makeFField(fieldName, false));
              self._layoutKeys.add(fieldName);
              UPDATABLE.keys.splice(idx, 1);
            }
            return
          }
        }

        if (isString(fieldOrLayout)) {
          layout.push(fieldOrLayout);
        } else if (isArray(fieldOrLayout)) {
          makeLayouts_INNER_PROCEDURE(UPDATABLE, fieldOrLayout, opts, layout);
        } else if (isObject(fieldOrLayout)) { // layout
          if (isValidElement(fieldOrLayout))
            layout.push(fieldOrLayout);
          else {
            const counter = UPDATABLE.counter++;
            let {_$widget, $_fields, opts: newOpts} = normalizeLayout(counter, fieldOrLayout as FFLayoutGeneric<jsFFCustomizeType>, opts);
            let section = <FSectionWidget _$widget={_$widget} _$cx={self._$cx} key={'widget_' + counter} ref={self._setWidRef((counter))}
                                          getMappedData={self._getMappedData(counter)}>{$_fields && makeLayouts_INNER_PROCEDURE(UPDATABLE, $_fields, newOpts)}</FSectionWidget>
            layout.push(section);
            if (blockName)
              restComponents[blockName] = section
          }
        }
      });
      return layout
    }

    function normalizeLayout(counter: number, layout: FFLayoutGeneric<jsFFCustomizeType>, opts: any = {}) {
      let {$_maps, rest} = extractMaps(layout, ['children']);
      //let {$defaultWidget, $baseLayoutClass} = opts;
      // rest = self.props.$FField.wrapFns(rest, ['$_maps']);
      let {children: $_fields, $_reactRef, _$skipKeys, _$widget, $_setReactRef, className, $defaultWidget, $baseLayoutClass, ...staticProps} = rest;
      $baseLayoutClass = $baseLayoutClass || opts.$baseLayoutClass || {};
      if (isString($baseLayoutClass) && $baseLayoutClass) $baseLayoutClass = {[$baseLayoutClass]: true};
      $defaultWidget = $defaultWidget || opts.$defaultWidget || 'div';
      _$widget = _$widget || $defaultWidget;
      if ($_fields) {
        className = merge($baseLayoutClass, className);
        if (isObject($_fields)) {
          let {_$order = [], ...restFields} = $_fields;
          $_fields = [];
          let restKeys = new Set(objKeys(restFields));
          _$order.forEach((k: any) => {
            if (!isUndefined(restFields[k]))
              $_fields.push(restFields[k]);
            restKeys.delete(k)
          });
          [...restKeys].forEach((k: any) => $_fields.push(restFields[k]));
        }

      }

      staticProps.className = className;
      // if ($_fields) staticProps.children = [];
      let refObject = self._refProcess($_reactRef) || {};
      if (isFunction(refObject)) refObject = {'ref': refObject};
      Object.assign(staticProps, refObject);
      let maps = normalizeMaps($_maps, counter.toString());
      mapsKeys.forEach(k => self._maps[k].push(...maps[k]));
      if ($_setReactRef) staticProps[$_setReactRef === true ? '$_setReactRef' : $_setReactRef] = self._setRef;
      self._mappedData[counter] = staticProps;
      return {_$widget, $_fields, opts: {$defaultWidget, $baseLayoutClass}}
    }

    const self = this;
    let $branch = self.pFForm.getBranch(self.path);
    self.state = {branch: $branch};

    const data = self.getData();
    const {fData} = data;

    const schemaPart: jsJsonSchema = self.api.getSchemaPart(self.path);
    self.schemaPart = schemaPart;
    self.arrayStart = arrayStart(schemaPart);

    if ((isArray(schemaPart.type) || isUndefined(schemaPart.type)) && !schemaPart._presets)
      throw new Error('schema._presets should be defined explicitly for multi type');
    let {presets, main: mainPreset} = normailzeSets(schemaPart._presets, schemaPart.type);
    self.mainPreset = mainPreset;
    self.fieldName = self.props.fieldName || '';

    let $layout = self.wrapFns(resolveComponents(self.pFForm.elements, schemaPart._layout));

    let resolvedComponents = resolveComponents(self.pFForm.elements, schemaPart._custom, presets);
    resolvedComponents = self.wrapFns(resolvedComponents);

    const mapsKeys = ['build', 'data', 'every'];
    mapsKeys.forEach(k => self._maps[k] = []);
    self.$refs = {};
    self._widgets = {};
    self._mappedData = {};
    self._layoutKeys = new Set();
    self._uniqKey2key = {};
    self._uniqKey2field = {};
    self.restFields = [];

    // self._focusField = focusField || UPDATABLE.keys[0] || '';

    let {Layout, Wrapper, ...restComponents} = resolvedComponents;

    const UPDATABLE = {keys: branchKeys($branch), blocks: objKeys(restComponents), counter: 1};
    if (isObject(Layout))
      Layout = merge(Layout, isArray($layout) ? {children: $layout} : $layout);
    else
      Layout = isMergeable($layout) ? merge(Layout, $layout) : Layout;

    let _layouts: any = makeLayouts_INNER_PROCEDURE(UPDATABLE, Layout || []);
    makeLayouts_INNER_PROCEDURE(UPDATABLE, UPDATABLE.blocks.map(bl => '%%' + bl));
    restComponents['Layout'] = _layouts;
    UPDATABLE.blocks = objKeys(restComponents);
    self._$wrapper = deArray(makeLayouts_INNER_PROCEDURE(UPDATABLE, isArray(Wrapper) ? {children: Wrapper} : Wrapper));

    if (fData.strictLayout !== true)// and here in UPDATABLE.keys we have only keys was not used, we add them to the top layer if strictLayout allows
      UPDATABLE.keys.forEach(fieldName => self.restFields.push(self._makeFField(fieldName)));

    self._mappedData = self._setMappedData(undefined, data, 'build');

    self._rebuild = false;
  }

  _setMappedData(prevData: any, nextData: any, updateStage: boolean | 'build') {
    const self = this;
    let _gData = self.getData;
    self.getData = () => nextData;
    const _mappedData = updateProps(self._mappedData, prevData, nextData,
      updateStage == 'build' && self._maps.build, updateStage && self._maps.data, self._maps.every);
    self.getData = _gData;
    return _mappedData;
  }

  _getMappedData = (key: number) => {
    return () => {
      // console.log(key);
      // let data = this._mappedData[key];
      // if (data[3])
      //   debugger;
      // console.log(this);
      return this._mappedData[key]
    }
  };

  _getUniqKey = (key: string, branch = this.state.branch) => getIn(branch, key, SymData, 'params', 'uniqKey');

  _makeFField(fieldName: string, branch?: any) {
    const self = this;
    let uniqKey = branch !== false ? self._getUniqKey(fieldName, branch) : fieldName;
    let type = getIn(self.getData(branch), 'fData', 'type');
    let field = <FField ref={self._setRef(uniqKey || fieldName)} key={uniqKey || fieldName}
                        pFForm={self.pFForm} FFormApi={self.props.FFormApi} fieldName={type === 'object' ? fieldName : undefined}
                        id={self.props.id ? self.props.id + '/' + (uniqKey || fieldName) : undefined}
                        name={self.props.name ? self.props.name + '[' + (self.props.isArray ? '${idx}_' + (uniqKey || fieldName) : fieldName) + ']' : undefined}
                        getPath={self._getPath.bind(self, uniqKey || fieldName)}/>;
    if (uniqKey) {
      this._uniqKey2key[uniqKey] = fieldName;
      this._uniqKey2field[uniqKey] = field;
    }
    return field
  }

  _getPath(key: string) {
    return this.path + '/' + (this._uniqKey2key[key] || key);
  }

  getData(branch?: any) {
    const self = this;
    const data = self.pFForm.getDataObject(branch || getIn(self, 'state', 'branch'), self);
    return self._cached ? merge(data, {value: self._cached.value}, {replace: {value: self._cached.opts.replace}}) : data;
  }

  // _arrayIndex2key = ($branch: any) => {
  //   return this.props.uniqKey ? getIn(this.getData($branch), string2path(this.props.uniqKey)) : undefined;
  // };
  //
  // _getObjectKeys = ($branch: StateType) => {
  //   const self = this;
  //   let keys: string[] = [];
  //   if (self.props.isArray) for (let i = 0; i < self.props.arrayStart; i++) keys.push(i.toString());
  //   else keys = branchKeys($branch);
  //   return keys;
  // };
  //
  // _getObjectPath(field: string) {
  //   return this.path + '/' + field;
  // }
  //
  // _getArrayField(key: any) {
  //   const self = this;
  //   return self._arrayLayouts[key - self.props.arrayStart]
  // }
  //
  // _reorderArrayLayout(prevBranch: StateType, nextBranch: StateType, props: any) {
  //   const self = this;
  //   const updatedArray = [];
  //   let doUpdate = false;
  //   for (let i = props.arrayStart; i < props.length; i++) {
  //     let arrayKey = self._arrayIndex2key(nextBranch[i]);
  //     if (isUndefined(arrayKey)) throw new Error('no unique key provided for array item');
  //     if (self.$refs[arrayKey]) self.$refs[arrayKey].setState({branch: nextBranch[i]});
  //     let prevIndex = self._arrayKey2field[arrayKey];
  //     if (self._arrayKey2field[arrayKey] !== i) {
  //       self._arrayKey2field[arrayKey] = i;
  //       doUpdate = true
  //     }
  //     updatedArray.push(!isUndefined(prevIndex) ? self._getArrayField(prevIndex) : self._makeFField(i.toString(), arrayKey));
  //   }
  //   if (self._arrayLayouts.length !== updatedArray.length) doUpdate = true;
  //   if (doUpdate) self._arrayLayouts = updatedArray;
  //   return doUpdate;
  // }
  //
  // getRef(path: Path) {
  //   const self = this;
  //   if (!self.props.isArray || isNaN(parseInt(path[0])) || path[0] < self.props.arrayStart) return super.getRef(path);
  //   let field = self._getArrayField(path[0]);
  //   return field && self.$refs[field.key].getRef(path.slice(1))
  // }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    const self = this;
    // console.log('nextProps', nextProps);
    // console.log('nextState', nextState);
    if (nextProps.FFormApi !== self.props.FFormApi) {
      self._updateStateApi(nextProps.FFormApi);
      return (self._rebuild = true);
    }
    if (!isEqual(nextProps, self.props)) return (self._rebuild = true);

    if (isUndefined(nextState.branch)) return true;
    // self.$branch = nextState.branch;
    let prevBranch = self.state.branch;
    let nextBranch = nextState.branch;

    const prevData = self.getData();
    const nextData = self.getData(getIn(nextState, 'branch'));
    if (getIn(nextData, 'oneOf') !== getIn(prevData, 'oneOf')) return (self._rebuild = true);

    if (prevData.keys !== nextData.keys) {
      let oldUniq2field = this._uniqKey2field;
      self._uniqKey2key = {};
      self._uniqKey2field = {};
      branchKeys(nextBranch).forEach(fieldName => {
        if (self._layoutKeys.has(fieldName)) return;
        let uniqKey = self._getUniqKey(fieldName, nextBranch);
        if (!uniqKey) return;
        if (self._uniqKey2field[uniqKey]) {
          self._uniqKey2key[uniqKey] = fieldName;
          self._uniqKey2field[uniqKey] = oldUniq2field[uniqKey];
        } else
          self._uniqKey2field[uniqKey] = self._makeFField(fieldName, nextBranch);
      });
      let restFields: any[] = [];
      nextData.keys.forEach((uniqKey: string) => {
        if (!self._layoutKeys.has(self._uniqKey2key[uniqKey]))
          restFields.push(self._uniqKey2field[uniqKey])
      });
      if (!isEqual(self.restFields, restFields))
        self.restFields = restFields
    }

    let newMapped = self._setMappedData(prevData, nextData, nextData !== prevData);
    if (newMapped != self._mappedData) { // update self._widgets
      const oldMapped = self._mappedData;
      self._updateWidgets(oldMapped, self._mappedData = newMapped)
    }
    // update object elements or if it _isArray elements that lower than self.props.arrayStart
    // let keys: any = [...branchKeys(prevBranch), ...branchKeys(nextBranch)];
    // keys = [...(new Map(keys))];
    objKeys(prevBranch).forEach((fieldName: string) => {
      let uniqKey;
      if (!self._layoutKeys.has(fieldName)) {
        uniqKey = self._getUniqKey(fieldName, nextBranch);
        if (!uniqKey) uniqKey = self._getUniqKey(fieldName, prevBranch);
      }// console.log('uniqKey', uniqKey);
      if ((nextBranch[fieldName] !== prevBranch[fieldName]) && self.$refs[uniqKey || fieldName])
        self.$refs[uniqKey || fieldName].setState({branch: nextBranch[fieldName]})
    });

    // try {
    //   updateComponent = self._setMappedData(prevData, nextData, nextData !== prevData) || updateComponent;
    //   updateComponent = updateComponent || getIn(nextData, 'params', 'norender') !== getIn(prevData, 'params', 'norender');
    // } catch (e) {
    //   throw self._addErrPath(e)
    // }

    return false
  }

  _updateWidgets = (oldMapped: any, newMapped: any) => {
    const self = this;

    objKeys(newMapped).forEach(key => self._widgets[key] && newMapped[key] != oldMapped[key] && self._widgets[key]['forceUpdate']());

  };

  render() {
    const self = this;
    let {state, props} = self;
    if (isUndefined(state.branch)) return null;
    if (getIn(self.getData(), 'params', 'norender')) return false;
    if (self._rebuild) this._build();
    return self._$wrapper;

    // if (props.viewer) {
    //   let {_$widget = UniversalViewer, ...rest} = props.$_viewerProps || {};
    //   rest.inputProps = props;
    //   rest.value = props.$FField.value;
    //   return h(_$widget, rest)
    // }
    // if (isSelfManaged(props.$branch)) return null;
    // if (self._rebuild) self._build(props); // make rebuild here to avoid addComponentAsRefTo Invariant Violation error https://gist.github.com/jimfb/4faa6cbfb1ef476bd105
    // return <FSectionWidget _$widget={self._$wrapper} _$cx={self._$cx} key={'widget_0'} ref={self._setWidRef(0)}
    //                        getMappedData={self._getMappedData(0)}>{self._layouts}</FSectionWidget>


    // return self._widgets['Builder'] ? h(self._widgets['Builder'], self._mappedData['Builder'], self._mappedData) : null;
    // let data = self.getData();
    // let {length, oneOf, branchKeys, fData} = data;
    // let {type, strictLayout} = fData;
    // let {$branch, id, name} = self.props;
    // return h(FSection, {
    //   length, oneOf, branchKeys, type, isArray: type === 'array', strictLayout, $branch, id, name, $blocks: self._widgets,
    //   $FField: self, FFormApi: self.stateApi, $layout: self._layout, arrayStart: arrayStart(self.schemaPart)
    // })

    //           length: '@/length',
    //           oneOf: '@/oneOf',
    //           branchKeys: '@/branchKeys',
    //           strictLayout: '@/fData/strictLayout',
    //           isArray: {$: '^/fn/equal', args: ['@/fData/type', 'array']},
    //           $branch: {$: '^/fn/getProp', args: '$branch', update: 'every'},
    //           arrayStart: {$: '^/fn/getArrayStart', args: [], update: 'build'},
    //           $FField: {$: '^/fn/getProp', args: [], update: 'build'},
    //           FFormApi: {$: '^/fn/getProp', args: 'props/pFForm/api', update: 'build'},
    //           id: {$: '^/fn/getProp', args: 'props/id', update: 'build'},
    //           name: {$: '^/fn/getProp', args: 'props/name', update: 'build'},
    //           $layout: {$: '^/fn/getProp', args: '_layout', update: 'build'}
  }
}


/////////////////////////////////////////////
//  Section class
/////////////////////////////////////////////
function RestWidget({children}: any) {
  return children || null;
}

const obj2react = memoize((props: any, _$cx: any, key: any) => {
  if (isUndefined(props)) return null;
  // if (props.key == 'option 1')
  //   debugger
  if (!isObject(props) || isValidElement(props)) return props;
  let {_$widget = 'div', children, ...rest} = props;
  if (props.className)
    props.className = _$cx(props.className);
  if (isUndefined(rest.key)) rest.key = key;
  if (children)
    children = children.map((v: any) => obj2react(v, _$cx));
  return h(_$widget, rest, children);
});

class FSectionWidget extends Component<any, any> { // need to be class, as we use it's forceUpdate() method
  refs: any;

  _cn(props: any) {
    if (!props) return props;
    if (props.className && !isString(props.className)) {
      // if (passCx(this.props._$widget)) return {_$cx: this.props._$cx, ...props};
      return {...props, className: this.props._$cx(props.className)};
    }
    return props;
  }

  render() {
    const props = this._cn(this.props.getMappedData());
    let {children, _$cx} = this.props as any;
    if (props.children) {
      children = [...(children || [])];
      objKeys(props.children).forEach(k => {
        if (!isValidElement(children[k])) {
          if (isMergeable(props.children[k]))
            children[k] = merge(children[k], props.children[k]);
          else children[k] = props.children[k]
        }
      })
    }
    if (this.props._$widget == 'option')
      debugger
    // console.log(this.props._$widget);
    // console.log('props', props);

    // let children = this.props.children && (this.props.children as any).length ? this.props.children : undefined
    return h(this.props._$widget, props, children && children.map((v: any, idx: any) => obj2react(v, _$cx, idx)));
  }
}

// class FSection extends FRefsGeneric {
//   private _arrayStart: number = 0;
//   private _rebuild = true;
//   private _focusField: string = '';
//   private _arrayKey2field: { [key: string]: number } = {};
//   private _widgets: { [key: string]: any } = {};
//   private _objectLayouts: any[] = [];
//   private _arrayLayouts: any[] = [];
//   private _setWidRef: any;
//   private _maps: NPM4WidgetsType = {};
//   private _mappedData: { [key: string]: any } = {};
//   private _$widget: any;
//   private _isArray: boolean = false;
//
//   constructor(props: any, context: any) {
//     super(props, context);
//     const self = this;
//     self._setWidRef = (key: number | string) => (item: any) => self._widgets[key] = item;
//   }
//
//   _getMappedData(key: number) {
//     const self = this;
//     return () => self._mappedData[key]
//   }
//
//
//   _build(props: any) {
//
//     function makeLayouts_INNER_PROCEDURE(UPDATABLE: { counter: number, keys: string[] }, fields: Array<string | FFLayoutGeneric<jsFFCustomizeType>>, layout: any[] = []) {
//       objKeys(fields).forEach(key => {
//         let fieldOrLayout = fields[key];
//         const {keys, counter} = UPDATABLE;
//         if (isString(fieldOrLayout)) { // if field is string then _makeFField
//           let idx = UPDATABLE.keys.indexOf(fieldOrLayout);
//           if (~idx) {
//             layout.push(self._makeFField(fieldOrLayout));
//             UPDATABLE.keys.splice(idx, 1);
//           }
//         } else if (isArray(fieldOrLayout)) {
//           makeLayouts_INNER_PROCEDURE(UPDATABLE, fieldOrLayout, layout);
//         } else if (isObject(fieldOrLayout)) { // layout
//           const counter = UPDATABLE.counter++;
//           let {_$widget, $_fields} = normalizeLayout(counter, fieldOrLayout as FFLayoutGeneric<jsFFCustomizeType>);
//           layout.push(<FSectionWidget _$widget={_$widget} _$cx={_$cx} key={'widget_' + counter} ref={self._setWidRef((counter))}
//                                       getMappedData={self._getMappedData(counter)}>{$_fields && makeLayouts_INNER_PROCEDURE(UPDATABLE, $_fields)}</FSectionWidget>)
//         }
//       });
//       return layout
//     }
//
//     function normalizeLayout(counter: number, layout: FFLayoutGeneric<jsFFCustomizeType>) {
//       let {$_maps, rest} = extractMaps(layout, ['$_fields']);
//       // rest = self.props.$FField.wrapFns(rest, ['$_maps']);
//       let {$_fields, $_reactRef, _$skipKeys, _$widget = LayoutDefaultWidget, className, ...staticProps} = rest;
//       if ($_fields || !counter) className = merge(LayoutDefaultClass, className);
//       staticProps.className = className;
//       let refObject = self._refProcess($_reactRef) || {};
//       if (isFunction(refObject)) refObject = {'ref': refObject};
//       Object.assign(staticProps, refObject);
//       let maps = normalizeMaps($_maps, counter.toString());
//       mapsKeys.forEach(k => self._maps[k].push(...maps[k]));
//       self._mappedData[counter] = staticProps;
//       return {_$widget, $_fields}
//     }
//
//     const self = this;
//
//     const {$branch, $layout, _$cx, arrayStart, strictLayout, LayoutDefaultWidget = 'div', LayoutDefaultClass = {}, uniqKey, focusField} = props;
//
//     const mapsKeys = ['build', 'data', 'every'];
//     mapsKeys.forEach(k => self._maps[k] = []);
//     self.$refs = {};
//     self._widgets = {};
//     self._mappedData = {};
//     self._objectLayouts = [];
//
//     const UPDATABLE = {keys: self._getObjectKeys($branch), counter: 1};
//     self._focusField = focusField || UPDATABLE.keys[0] || '';
//
//     let {_$widget, $_fields} = normalizeLayout(0, isArray($layout) ? {$_fields: $layout} : $layout);
//     self._$widget = _$widget;
//
//     if ($_fields)// make initial _objectLayouts, every key that was used in makeLayouts call removed from UPDATABLE.keys
//       self._objectLayouts = makeLayouts_INNER_PROCEDURE(UPDATABLE, $_fields);
//     if (strictLayout !== true)// and here in UPDATABLE.keys we have only keys was not used, we add them to the top layer if strictLayout allows
//       UPDATABLE.keys.forEach(fieldName => self._objectLayouts.push(self._makeFField(fieldName)));
//
//     self._arrayLayouts = [];
//     self._arrayKey2field = {};
//     if (self.props.isArray) {  // _makeArrayLayouts
//       for (let i = arrayStart; i < self.props.length; i++) {
//         let arrayKey = self._arrayIndex2key($branch[i]);
//         self._arrayLayouts.push(self._makeFField(i.toString(), arrayKey));
//         arrayKey && (self._arrayKey2field[arrayKey] = i);
//       }
//     }
//     self._mappedData = self._updateMappedData(undefined, self._getData($branch), 'build');
//     self._rebuild = false;
//   }
//
//   _makeFField(fieldName: string, arrayKey?: string) {
//     const self = this;
//     return <FField ref={self._setRef(arrayKey || fieldName)} key={arrayKey || fieldName} pFForm={self.props.$FField.pFForm} FFormApi={self.props.FFormApi}
//                    id={self.props.id ? self.props.id + '/' + (arrayKey || fieldName) : undefined}
//                    name={self.props.name ? self.props.name + '[' + (self.props.isArray ? '${idx}_' + (arrayKey || fieldName) : fieldName) + ']' : undefined}
//                    getPath={arrayKey ? self._getArrayPath.bind(self, arrayKey) : self._getObjectPath.bind(self, fieldName)}/>;
//   }
//
//   _arrayIndex2key($branch: any) {
//     return this.props.uniqKey ? getIn(this._getData($branch), string2path(this.props.uniqKey)) : undefined;
//   }
//
//   _getObjectKeys($branch: StateType) {
//     const self = this;
//     let keys: string[] = [];
//     if (self.props.isArray) for (let i = 0; i < self.props.arrayStart; i++) keys.push(i.toString());
//     else keys = branchKeys($branch);
//     return keys;
//   }
//
//   _getObjectPath(field: string) {
//     return this.props.$FField.path + '/' + field;
//   }
//
//   _getArrayPath(key: string) {
//     return this.props.$FField.path + '/' + this._arrayKey2field[key];
//   }
//
//   _getArrayField(key: any) {
//     const self = this;
//     return self._arrayLayouts[key - self.props.arrayStart]
//   }
//
//   _reorderArrayLayout(prevBranch: StateType, nextBranch: StateType, props: any) {
//     const self = this;
//     const updatedArray = [];
//     let doUpdate = false;
//     for (let i = props.arrayStart; i < props.length; i++) {
//       let arrayKey = self._arrayIndex2key(nextBranch[i]);
//       if (isUndefined(arrayKey)) throw new Error('no unique key provided for array item');
//       if (self.$refs[arrayKey]) self.$refs[arrayKey].setState({branch: nextBranch[i]});
//       let prevIndex = self._arrayKey2field[arrayKey];
//       if (self._arrayKey2field[arrayKey] !== i) {
//         self._arrayKey2field[arrayKey] = i;
//         doUpdate = true
//       }
//       updatedArray.push(!isUndefined(prevIndex) ? self._getArrayField(prevIndex) : self._makeFField(i.toString(), arrayKey));
//     }
//     if (self._arrayLayouts.length !== updatedArray.length) doUpdate = true;
//     if (doUpdate) self._arrayLayouts = updatedArray;
//     return doUpdate;
//   }
//
//   _updateMappedData(prevData: any, nextData: any, fullUpdate: boolean | 'build' = prevData !== nextData) {
//     const self = this;
//     return updateProps(self._mappedData, prevData, nextData, fullUpdate == 'build' && self._maps.build, fullUpdate && self._maps.data, self._maps.every);
//   }
//
//   _getData(branch = this.props.$branch) {
//     return this.props.$FField.getData(branch)
//   }
//
//   shouldComponentUpdate(nextProps: any) {
//     const self = this;
//     if (['FFormApi', 'oneOf', 'branchKeys'].some(comparePropsFn(self.props, nextProps)))
//       return self._rebuild = true;
//
//     let doUpdate = !isEqual(nextProps, self.props, {skipKeys: ['$branch']});
//
//     let prevBranch = self.props.$branch;
//     let nextBranch = nextProps.$branch;
//
//     if (prevBranch != nextBranch) {
//       let newMapped: any;
//       try {
//         newMapped = self._updateMappedData(self._getData(prevBranch), self._getData(nextBranch));
//       } catch (e) {
//         throw self.props.$FField._addErrPath(e)
//       }
//
//       if (newMapped != self._mappedData) { // update self._widgets
//         const oldMapped = self._mappedData;
//         self._mappedData = newMapped;
//         objKeys(newMapped).forEach(key => self._widgets[key] && newMapped[key] != oldMapped[key] && self._widgets[key]['forceUpdate']());
//       }
//       // update object elements or if it _isArray elements that lower than self.props.arrayStart
//       self._getObjectKeys(nextBranch).forEach(field => (nextBranch[field] !== prevBranch[field]) && self.$refs[field] && self.$refs[field].setState({branch: nextBranch[field]}));
//
//       if (self.props.isArray) doUpdate = self._reorderArrayLayout(prevBranch, nextBranch, nextProps) || doUpdate; // updates and reorders elements greater/equal than self.props.arrayStart
//
//     }
//
//     return doUpdate; //|| !isEqual(self.props, nextProps, {skipKeys: ['$branch']});
//   }
//
//   getRef(path: Path) {
//     const self = this;
//     if (!self.props.isArray || isNaN(parseInt(path[0])) || path[0] < self.props.arrayStart) return super.getRef(path);
//     let field = self._getArrayField(path[0]);
//     return field && self.$refs[field.key].getRef(path.slice(1))
//   }
//
//   render() {
//     const self = this;
//     let props = self.props;
//     // try {
//     if (props.viewer) {
//       let {_$widget = UniversalViewer, ...rest} = props.$_viewerProps || {};
//       rest.inputProps = props;
//       rest.value = props.$FField.value;
//       return h(_$widget, rest)
//     }
//     // if (isSelfManaged(props.$branch)) return null;
//     if (self._rebuild) self._build(props); // make rebuild here to avoid addComponentAsRefTo Invariant Violation error https://gist.github.com/jimfb/4faa6cbfb1ef476bd105
//     return <FSectionWidget _$widget={self._$widget} _$cx={props._$cx} key={'widget_0'} ref={self._setWidRef((0))}
//                            getMappedData={self._getMappedData(0)}>{self._objectLayouts}{self._arrayLayouts}</FSectionWidget>
//     // } catch (e) {
//     //   throw self.props.$FField._addErrPath(e)
//     // }
//   }
// }


/////////////////////////////////////////////
//  Basic components
/////////////////////////////////////////////

// class GenericWidget extends FRefsGeneric {
//   private _children: any;
//   private _reactRef: any;
//   protected _mapped: any[];
//
//   constructor(props: any, context: any) {
//     super(props, context);
//   }
//
//   private _newWidget(key: any, obj: any, passedReactRef: anyObject = {}) {
//     const {_$widget: Widget = GenericWidget, className, $_reactRef, ...rest} = obj;
//     const self = this;
//     let refObject = self._refProcess($_reactRef) || {};
//     if (isFunction(refObject)) refObject = {ref: refObject};
//     if (isFunction(passedReactRef)) refObject.ref = passedReactRef;
//     else Object.assign(refObject, passedReactRef);
//     // console.log('className', className);
//     if (typeof className == "string") debugger;
//     return <Widget key={key}
//                    className={(!passCx(Widget) && this.props._$cx) ? this.props._$cx(className) : className}
//                    _$cx={passCx(Widget) ? this.props._$cx : undefined} {...rest} {...refObject}/>
//   }
//
//   protected _mapChildren(children: any, $_reactRef: anyObject) {
//     const self = this;
//     if (children !== self._children || self._reactRef !== $_reactRef) {
//       const prev = self._children && toArray(self._children);
//       const next = children && toArray(children);
//       self._mapped = next && next.map((ch: any, i: number) => (!isObject(ch) || ch.$$typeof) ? ch :
//         ((!self._mapped ||
//           !getIn(self._mapped, i) ||
//           prev[i] !== next[i] ||
//           getIn(self._reactRef, i) !== getIn($_reactRef, i)) ? self._newWidget(i, ch, getIn($_reactRef, i)) :
//           self._mapped[i]));
//       self._children = children;
//       self._reactRef = $_reactRef
//     }
//   }
//
//   protected setRef2rest(rest: anyObject, $_reactRef: anyObject) {
//     if (!$_reactRef) return rest;
//     objKeys($_reactRef).filter(v => isNaN(+v)).forEach(k => rest[k] = $_reactRef[k]); // assing all except numeric keys, as then assigned at _mapChildren
//     return rest;
//   }
//
//   protected setElements2rest(rest: anyObject, _$elements: any) {
//     if (!_$elements) return rest;
//     let elms = {'^': _$elements};
//     objKeys(rest).forEach(k => isElemRef(rest[k]) && (rest[k] = getIn(elms, string2path(rest[k]))));
//     return rest
//   }
//
//   render(): any {
//     const self = this;
//     if (self.props.norender) return null;
//     let {_$useTag: UseTag = 'div', _$cx, _$elements, className, $_reactRef, children, ...rest} = self.props;
//     self._mapChildren(children, $_reactRef);
//     self.setRef2rest(rest, $_reactRef);
//     self.setElements2rest(rest, _$elements);
//     if (!_$cx && _$elements) _$cx = _$elements._$cx;
//     return (<UseTag children={self._mapped} className={_$cx ? _$cx(className) : className} {...rest} />)
//   }
// }


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

const UniversalInput = forwardRef(
  function (props: any, ref: any) {
    if (props.viewer) {
      let {_$widget = UniversalViewer, ...rest} = props.$_viewerProps || {};
      rest.inputProps = props;
      rest.value = props.value;
      return h(_$widget, rest)
    }

    let {_$useTag, type, viewer, $_viewerProps, ...rest} = props;


    // if (!_$cx && _$elements) _$cx = _$elements._$cx;
    rest.ref = ref;
    if (_$useTag) {
      rest.type = type;
    } else {
      if (type == 'textarea' || type == 'select') _$useTag = type;
      else {
        _$useTag = 'input';
        rest.type = type;
      }
    }
    // if (_$passCx) rest._$cx = _$cx;
    // if (rest.className && _$cx) rest.className = _$cx(rest.className);
    return h(_$useTag, rest)
  }
);


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
      props.$FField &&
      props.$FField.$refs['@Main'] &&
      props.$FField.$refs['@Main'].style &&
      (props.$FField.$refs['@Main'].style.width = Math.max((elem as any).scrollWidth + (props.addWidth || 45), props.minWidth || 0) + 'px')
    }}>{value}</div>)
  }
}


// function FBuilder(props: any) {
//   let {children: mapped, widgets} = props;
//   const {Title, Body, Main, Message, Wrapper, Autowidth} = widgets;
//
//   mapped = deArray(mapped);
//   return Wrapper ? h(Wrapper, mapped['Wrapper'],
//     Title ? h(Title, mapped['Title']) : '',
//     Body ? h(Body, mapped['Body'],
//       Main ? h(Main, mapped['Main']) : '',
//       Message ? h(Message, mapped['Message']) : '',
//       Autowidth ? h(Autowidth, mapped['Autowidth']) : ''
//     ) : ''
//   ) : ''
// }


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


const Checkbox = forwardRef(({
                               $extend = {}, $baseClass, children = [], label,
                               type = "checkbox", _$cx, className = "", ['data-key']: dataKey, ...rest
                             }: any, ref) => {
  const baseProps = {
    'input': {_$tag: 'input', ref, type, ...rest},
    'label': {_$tag: 'span', children: [label]}
  };
  let childrenRes = propsExtender(baseProps, $extend, {skipKeys: ['checkbox'], _$cx, $baseClass});
  let {input: inputTag, label: labelTag, ...restChildren} = childrenRes;
  let classMods: string[] = [];
  objKeys(rest).forEach(key => {
    if (key[0] !== '$' && (rest[key] === true || rest[key] === 'true'))
      classMods.push('_' + key);
  });
  className = _$cx(className, classMods);
  const rootProps = {
    'checkbox': {
      _$tag: 'label',
      className,
      children: [inputTag, labelTag, ...(objKeys(restChildren).map(k => restChildren[k])), ...toArray(children)]
    }
  };
  return propsExtender(rootProps, $extend, {onlyKeys: ['checkbox'], _$cx, $baseClass, $rootKey: 'checkbox'}).checkbox;
});

const CheckboxNull = forwardRef((props: any, ref: any) => {
    let {checked, onChange, nullValue = null, type, ...rest} = props;
    return <input type="checkbox" checked={checked === true} {...rest}
                  onChange={(event: any) => {
                    onChange((checked === nullValue ? true : (checked === true ? false : nullValue)), event)
                  }}
                  ref={elem => {
                    ref && ref(elem);
                    elem && (elem.indeterminate = (checked === nullValue))
                  }}/>
  }
);


class Checkboxes extends PureComponent<any, any> {
  render() {
    let {
      $enum = [], $enumExten = {}, $setRef, $prefixRefName = '', $baseClass, $extend = {},
      _$tag = 'div', type = "radio", className = "", value = [], name, _$cx, staticProps, ...rest
    } = this.props;
    value = toArray(value);
    if (name) name = type === 'radio' ? name : name + '[]';
    let opts = {$args: [this], _$cx};
    let enumRes = {};
    $enum.map((val: any) => {
      let baseProps = {...staticProps};
      baseProps.checked = !!~value.indexOf(val);
      baseProps.type = type;
      baseProps.name = name;
      baseProps.value = val;
      baseProps.label = val;
      baseProps._$tag = baseProps._$tag || Checkbox;
      baseProps._$cx = baseProps._$cx || _$cx;
      if ($setRef) baseProps.ref = $setRef($prefixRefName + name);
      if ($baseClass) baseProps.$baseClass = $baseClass + '-item';
      if ($enumExten[val]) Object.assign(baseProps, isString($enumExten[val]) ? {label: $enumExten[val]} : $enumExten[val]);
      enumRes[val] = baseProps;
    });
    enumRes = propsExtender(enumRes, $extend, opts);
    let children = $enum.map((val: any) => {
      let res = enumRes[val];
      delete enumRes[val];
      return res;
    });
    let restRes = objKeys(enumRes).map(val => enumRes[val]).filter(Boolean);
    push2array(children, restRes);

    (rest as any).className = _$cx ? _$cx(className) : className;
    if ($baseClass) className = ((className || '') + ' ' + $baseClass).trim();

    return h(_$tag, rest, children);
  }
};


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

// function passCx(Widget: any) {
//   return Widget instanceof GenericWidget
// }

function normailzeSets(sets: string = '', type: any) {
  if (!isString(type)) type = '';
  let presets = sets.split(':');
  let main = '';
  let rest = [];
  for (let i = 0; i < presets.length; i++) {
    if (presets[i][0] !== '$') main = main || presets[i];
    else rest.push(presets[i])
  }
  return {presets: [main || type].concat(rest).join(':'), main};
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
      result.data.push({args: args[0], update, replace, to, dataRequest: true, ...rest})
    }
  });
  return result
}

function updateProps(mappedData: any, prevData: any, nextData: any, ...iterMaps: Array<NormalizedDataProcessor[] | false>) {
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
    // Section: FSection,
    // Generic: GenericWidget,
    // Builder: FBuilder,
    // Wrapper,
    Input: UniversalInput,
    Rest: RestWidget,
    Autowidth,
    ItemMenu,
    Checkbox,
    CheckboxNull,
    Checkboxes
  },
  sets: {
    'base': {
      Wrapper: {
        children: ['%%Title', '%%Layout', '%%Main', '%%Message']
      },
      Title: {
        _$widget: 'label',
        children: [],
        $_maps: {
          'className/fform-required': '@/fData/required',
          'children/0': '@/fData/title',
          'className/fform-hidden': {$: '^/fn/not', args: '@/fData/title'},
          htmlFor: {$: '^/fn/getProp', args: ['props/id'], update: 'build'},
          'className/fform-title-viewer': '@/params/viewer'
        }
      },
      Main: {},
      Message: {$_ref: '^/parts/Message'}
    },
    simple: {
      $_ref: '^/sets/base',
      Main: {
        _$widget: '^/widgets/Input',
        $_reactRef: '%Main',
        // _$cx: '^/_$cx',
        $_viewerProps: {_$cx: '^/_$cx', emptyMock: '(no value)', className: {'fform-viewer': true}},
        onChange: {$: '^/fn/eventValue|setValue'},
        onBlur: {$: '^/fn/blur'},
        onFocus: {$: '^/fn/focus'},
        $_maps: {
          // priority: '@/status/priority',
          value: '@value',
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
        onChange: {$: '^/fn/eventValue|prepareNumber|parse|preventEmptyLiveUpd|setValue'},
        onBlur: "^/fn/setZeroIfEmpty|blur"
      }
    },
    integerNull: {
      $_ref: '^/sets/integer',
      Main: {
        onChange: {$: '^/fn/eventValue|prepareNumber|parse|empty2null|setValue'},
        onBlur: "^/fn/blur",
        $_maps: {
          value: {$: '^/fn/null2empty', args: ['@value']}
        }
      }
    },
    number: {
      $_ref: '^/sets/integer',
      Main: {step: 'any'}
    },
    numberNull: {
      $_ref: '^/sets/integerNull',
      Main: {step: 'any'}
    },
    'null': {$_ref: '^/sets/simple', Main: false},
    boolean: {
      $_ref: '^/sets/simple',
      Main: {
        type: 'checkbox',
        _$useTag: "^/widgets/Checkbox",
        _$cx: '^/_$cx',
        onChange: {$: '^/fn/eventChecked|setValue|liveUpdate'},
        $_maps: {
          placeholder: false,
          value: false,
          label: '@/fData/placeholder',
          checked: '@value'
        }
      },
    },
    booleanNull: {
      $_ref: '^/sets/boolean',
      Main: {
        $extend: {'input': {"_$tag": '^/widgets/CheckboxNull'}},
        onChange: {$: '^/fn/parseTristate|setValue|liveUpdate', args: ['${0}']},
      },
    },
    booleanLeft: {$_ref: '^/sets/boolean'},
    booleanNullLeft: {$_ref: '^/sets/booleanNull'},
    object: {
      $_ref: '^/sets/base',
      Main: {
        _$widget: '^/widgets/Rest',
        $_maps: {
          children: {$: '^/fn/getProp', args: 'restFields', update: 'every'}
        }
        // _$cx: '^/_$cx',
        // $_reactRef: '%Main',
        // uniqKey: 'params/uniqKey',
        // LayoutDefaultClass: 'layout',
        // LayoutDefaultWidget: 'div',
        // $_viewerProps: {$_ref: '^/sets/simple/Main/$_viewerProps'},
        // $_maps: {
        //   length: '@/length',
        //   oneOf: '@/oneOf',
        //   branchKeys: '@/branchKeys',
        //   strictLayout: '@/fData/strictLayout',
        //   isArray: {$: '^/fn/equal', args: ['@/fData/type', 'array']},
        //   $branch: {$: '^/fn/getProp', args: '$branch', update: 'every'},
        //   arrayStart: {$: '^/fn/getArrayStart', args: [], update: 'build'},
        //   $FField: {$: '^/fn/getProp', args: [], update: 'build'},
        //   FFormApi: {$: '^/fn/getProp', args: 'props/pFForm/api', update: 'build'},
        //   id: {$: '^/fn/getProp', args: 'props/id', update: 'build'},
        //   name: {$: '^/fn/getProp', args: 'props/name', update: 'build'},
        //   $layout: {$: '^/fn/getProp', args: '_layout', update: 'build'}
        // }
      },
      // Title: {
      //   _$widget: '^/widgets/Generic',
      //   _$cx: '^/_$cx',
      //   _$useTag: 'legend',
      //   children: [
      //     {$_ref: '^/sets/simple/Title', _$useTag: 'span'},
      //     {$_ref: '^/parts/ArrayAddButton'},
      //     {$_ref: '^/parts/ArrayDelButton'},
      //     {$_ref: '^/parts/ArrayEmpty'}],
      // },
      // Wrapper: {_$useTag: 'fieldset'},
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
      Main: {
        $_ref: '^/parts/RadioSelector',
        $_reactRef: '%Main',
        $_setReactRef: '$setRef',
        $prefixRefName: '@enum/',
        $_viewerProps: {$_ref: '^/sets/simple/Main/$_viewerProps'},
        staticProps: {onChange: {args: ['${0}']}},
        $_maps: {
          value: '@/value',
          viewer: '@/params/viewer',
          $enum: '@/fData/enum',
          $enumExten: '@/fData/enumExten',
        }
      }
    },
    checkboxes: {
      $_ref: '^/sets/radio',
      Main: {
        type: 'checkbox',
        staticProps: {
          onChange: {$: '^/fn/eventCheckboxes|setValue|liveUpdate'}
        }
      }
    },
    $radioParse: {
      Main: {staticProps: {onChange: {$: '^/fn/eventValue|parse|setValue|liveUpdate'}}}
    },
    $checkboxesParse: {
      Main: {staticProps: {onChange: {$: '^/fn/eventCheckboxes|parse|setValue|liveUpdate'}}}
    },
    $radioNull: {Main: {$staticProps: {onClick: '^/fn/eventValue|radioClear|liveUpdate'}}},
    $radioEmpty: {Main: {$staticProps: {onClick: {$: '^/fn/eventValue|radioClear|liveUpdate', args: ['${0}', '']}}}},
    $autowidth: {
      Autowidth: {$_ref: '^/parts/Autowidth'},
      Wrapper: {className: {'fform-shrink': true}},
    },
    $inlineItems: {Main: {className: {'fform-inline': true}}},
    // $inlineTitle: {Wrapper: {wrapperClassName: {'fform-inline': true}}},
    // $inlineLayout: {Main: {LayoutDefaultClass: {'fform-inline': true}}},
    // $inlineArrayControls: {Wrapper: {ArrayItemBody: {className: {'fform-inline': true}}}},
    // $arrayControls3but: {Wrapper: {ArrayItemMenu: {buttons: ['up', 'down', 'del'],}}},
    // $arrayControlsDelOnly: {Wrapper: {ArrayItemMenu: {buttons: ['del'],}}},
    $noTitle: {Title: false},
    $noMessage: {Message: false},
    $shrink: {Wrapper: {className: {'fform-shrink': true}}},
    $expand: {Wrapper: {className: {'fform-expand': true}}},
    $password: {Main: {type: 'password'}},
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
    getClassNameByProp(prefix: string, key: string, ...args: any[]) {
      let value = getIn(this, normalizePath(key));
      if (value)
        return [{[prefix + value]: true}, ...args];
      else return [{}, ...args];
    },
    formPropExec(e: any, fnName: string) {
      if (isObject(e)) {
        this.pFForm.applyCache();
        e.fform = this.pFForm;
        e.value = this.pFForm.api.getValue();
      }
      let fn = getIn(this.pFForm, 'props', fnName);
      if (isFunction(fn)) fn.call(this, e);
      else throw new Error(`Prop '${fnName}' is not a function.`)
    },
    eventValue: (event: any, ...args: any[]) => [
      event.target.value, ...args],
    eventChecked: (event: any, ...args: any[]) => [event.target.checked, ...args],
    parseTristate: (value: any, ...args: any[]) => [value === "" ? null : value, ...args],
    prepareNumber(value: string, ...args: any[]) {
      if (isString(value)) {
        value = value.replace(/^(-?)0*/, "$1");
        value = value.replace("-.", "-0.")
          .replace(/^\./, "0.");
      }
      return [value, ...args]
    },
    parse(value: string | string[], ...args: any[]) {
      try {
        value = isArray(value) ? value.map(v => JSON.parse(v)) : JSON.parse(value)
      } catch (e) {

      }
      return [value, ...args]
    },
    eventMultiple: (event: any, ...args: any[]) =>
      [Array.from(event.target.options).filter((o: any) => o.selected).map((v: any) => v.value), ...args],
    null2empty(value: any, ...args: any[]) {
      return [value == null ? '' : value, ...args]
    },
    empty2null(value: any, ...args: any[]) {
      return [value === '' ? null : value, ...args]
    },
    preventEmptyLiveUpd(...args: any[]) {
      this._preventLiveUpd = (args[0] === '');
      return args
    },
    setZeroIfEmpty(event: any, ...args: any[]) {
      if (event.target.value === "") this.api.setValue(0);
      return [event, ...args]
    },
    stringify(value: any, ...args: any[]) {
      if (!isString(value)) value = JSON.stringify(value);
      return [value, ...args];
    },
    setValue(value: any, opts: any = {}, ...args: any[]) {
      console.log('value', value);
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
    setInputPriority(priority?: number) {
      if (typeof priority == 'number') return ['fform-input-priority-' + priority];
      else return [false]
    }
  },
  parts: {
    Message: {
      // _$widget: '^/widgets/Generic',
      // _$cx: '^/_$cx',
      children: [],
      $_maps: {
        children: {$: '^/fn/messages', args: ['@/messages', {}]},
        'className/fform-hidden': {$: '^/fn/or', args: ['@/params/viewer', '!@/status/touched']},
      }
    },
    RadioSelector: {
      _$widget: '^/widgets/Input',
      _$useTag: '^/widgets/Checkboxes',
      _$cx: '^/_$cx',
      // _$passCx: true,
      staticProps: {
        type: 'radio',
        onChange: {$: '^/fn/eventValue|setValue|liveUpdate', args: ['${0}', {path: './@/selector/value'}]},
        onBlur: '^/sets/simple/Main/onBlur',
        onFocus: '^/sets/simple/Main/onFocus',
        _$tag: '^/widgets/Checkbox',
      },
      $_maps: {
        value: '@/selector/value',
        $enum: '@/selector/enum',
        $enumExten: '@/selector/enumExten',
        name: {$: '^/fn/getProp', args: 'props/name', update: 'build'},
        "staticProps/readOnly": '@/params/readonly',
        "staticProps/disabled": '@/params/disabled',
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
      children: ['Submit'],
      $_maps: {
        disabled: {$: '^/fn/or', args: ['@/status/submitting', '@/params/disabled']},
      }
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
  $form: (elems: any, rest: any[]) => {
    return {$: "^/fn/formPropExec", args: ["${0}", ...rest]}
  },
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
  $selector: (elems: any, path: Path) => {
    let nm = path[0];
    return {
      staticProps: {
        onChange: {args: ['${0}', {path: `@/${nm}/value`}]},
      },
      $_maps: {
        value: `@/${nm}/value`,
        $enum: `@/${nm}/enum`,
        $enumExten: `@/${nm}/enumExten`
      }
    }
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


export {elementsBase as elements, formReducer, getFRVal, FForm, FField, fformCores, schemaRegister};

export {extractMaps, normalizeMaps, updateProps, classNames, comparePropsFn, getExten}

export {Checkboxes, Checkbox}
