import * as React from 'react';
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
import {FFormStateAPI, fformCores, objectResolver} from './api'
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
    let {core: coreParams, onChange, onSubmit, state, value, inital, extData, ...rest} = props;

    self.api = coreParams instanceof FFormStateAPI ? coreParams : self._getCoreFromParams(merge(coreParams), context);
    self.parent = props.parent;
    self.focus = self.focus.bind(self);
    self._updateValues(props);
    self._unsubscribe = self.api.addListener(self._handleStateUpdate.bind(self));
    self._setRef = self._setRef.bind(self);
    self._submit = self._submit.bind(self);
    self._getPath = self._getPath.bind(self);
    Object.defineProperty(self, "objects", {get: () => self.api.props.objects});
  }

  _setRef(FField: any) {
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
    if (!coreParams.store && coreParams.store !== false && context.store) return new FFormStateAPI(merge(coreParams, {store: context.store}));
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

  focus(path: Path | string): void {
    if (this._root) this._root.focus(normalizePath(path));
  };

  _getPath() {
    return '#';
  }

  getDataObject(branch: any, ffield: FField) {
    return getIn(branch, SymData)
  }

  getBranch(path: string) {
    return this.api.get(path)
  }

  render() {
    const self = this;
    let {core, state, value, inital, extData, fieldCache, noValidate, parent, onSubmit, onChange, onStateChange, useTag: UseTag = 'form', ...rest} = self.props;

    return (
      <UseTag {...rest} onSubmit={self._submit}>
        <FField ref={self._setRef} id={rest.id ? rest.id + '/#' : undefined} name={self.api.name} pFForm={self} getPath={self._getPath} FFrormApi={self.api}/>
      </UseTag>
    )
  }
}


/////////////////////////////////////////////
//  FField class
/////////////////////////////////////////////
class FField extends React.Component<any, any> {
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
  $refs: any = {};
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
    if (self.pFForm.api) self._apiWrapper();
    self.state = {branch: self.pFForm.getBranch(self.path)};
    self.$branch = self.state.branch;
    self._bind2self = self._bind2self.bind(self);
    self._setRef = self._setRef.bind(self);
    self._build();
  }

  focus(path: Path) {
    const self = this;
    self.$refs['Main'] && self.$refs['Main'].focus && self.$refs['Main'].focus(path); // path.length ? self.$refs.focus(path) : self.$refs.focus();
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
      validate: (path: boolean | string | Path = [], ...args: any[]) => api.validate(typeof path == 'boolean' ? path : wrapPath(path), ...args),
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
    if ($_parse) return deArray(toArray($_parse.$).reduce((args, fn) => toArray(fn(...args)), $_parse.args || []));
    return value
  }

  _bind2self(obj: any) {
    const result = isArray(obj) ? [] : {};
    objKeys(obj).forEach(key => {
      if (typeof obj[key] == 'function') result[key] = obj[key].bind(this, ...(isArray(obj[key + '.bind']) ? obj[key + '.bind'] : []));
      else if (isMergeable(obj[key])) result[key] = this._bind2self(obj[key])
    });
    return result
  }

  _setRef(block: string) {
    const self = this;
    return (v: any) => self.$refs[block] = v
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
      self._widgets[block] = _$widget;
      if ($_reactRef) staticProps[isString(staticProps.$_reactRef) ? $_reactRef : 'ref'] = self._setRef(block); // $_reactRef - prop for react ref-function

      self._mappedData[block] = staticProps;  // properties, without reserved names      
    });
    self._setMappedData(undefined, self.getData(), 'build');
    self._rebuild = false;
  }

  // todo: viewer
  // todo: arrayOf checkboxes, radio
  // todo: messages rework to GenericWidget
  // todo: SSR support
  // todo: lazy schema compilation

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
    if (this.props._$cx && props.className && !isString(props.className) && isString(this.props._$widget)) return {...props, className: this.props._$cx(props.className)};
    return props;
  }

  render() {return React.createElement(this.props._$widget, this._cn(this.props.getMappedData()), this.props.children);}
}

class FSection extends React.Component<any, any> {
  private _arrayStart: number = 0;
  private _rebuild = true;
  private _focusField: string = '';
  private _arrayKey2field: { [key: string]: number } = {};
  private _fields: { [key: string]: any } = {};
  private _widgets: { [key: string]: any } = {};
  private _objectLayouts: any[] = [];
  private _arrayLayouts: any[] = [];
  private _setWidRef: any;
  private _setFieldRef: any;
  private _maps: NPM4WidgetsType = {};
  private _mappedData: { [key: string]: any } = {};
  private _$widget: any;
  private _isArray: boolean = false;

  constructor(props: any, context: any) {
    super(props, context);
    const self = this;
    self._setFieldRef = (field: number | string) => (item: any) => self._fields[field] = item;
    self._setWidRef = (key: number | string) => (item: any) => self._widgets[key] = item;
    self._build(self.props);
  }

  focus(path: Path) {
    const self = this;
    let field;
    if (!path.length) {
      field = self.props.focusField;
      if (isUndefined(field)) field = self.props.isArray ? '0' : (branchKeys(self.props.$branch)[0] || '');
    } else {
      field = path[0].toString();
      path = path.slice(1);
    }
    if (self.props.isArray && field >= self.props.arrayStart) field = self._arrayIndex2key(self.props.$branch[field]) || field;
    if (self._fields[field] && self._fields[field].focus) self._fields[field].focus(path)
  }

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
          let {_$widget, $fields} = normalizeLayout(counter, fieldOrLayout as FFLayoutGeneric<jsFFCustomizeType>);
          layout.push(<FSectionWidget _$widget={_$widget} _$cx={_$cx} key={'widget_' + counter} ref={self._setWidRef((counter))}
                                      getMappedData={self._getMappedData(counter)}>{$fields && makeLayouts_INNER_PROCEDURE(UPDATABLE, $fields)}</FSectionWidget>)
        }
      });
      return layout
    }

    function normalizeLayout(counter: number, layout: FFLayoutGeneric<jsFFCustomizeType>) {
      let {$_maps, rest} = extractMaps(layout, ['$fields']);
      let {$fields, $_reactRef, _$widget = LayoutDefaultWidget, className = LayoutDefaultClass, ...staticProps} = rest;
      staticProps.className = className;
      let maps = normalizeMaps($_maps, counter.toString());
      mapsKeys.forEach(k => self._maps[k].push(...maps[k]));
      self._mappedData[counter] = staticProps;
      return {_$widget, $fields}
    }

    const self = this;

    const {$branch, $layout, _$cx, arrayStart, LayoutDefaultWidget = 'div', LayoutDefaultClass = 'layout', uniqKey, focusField} = props;

    if (isSelfManaged($branch)) return;
    const mapsKeys = ['build', 'data', 'every'];
    mapsKeys.forEach(k => self._maps[k] = []);
    self._fields = {};
    self._widgets = {};
    self._mappedData = {};
    self._objectLayouts = [];

    const UPDATABLE = {keys: self._getObjectKeys($branch), counter: 1};
    self._focusField = focusField || UPDATABLE.keys[0] || '';

    let {_$widget, $fields} = normalizeLayout(0, isArray($layout) ? {$fields: $layout} : $layout);
    self._$widget = _$widget;

    if ($fields) self._objectLayouts = makeLayouts_INNER_PROCEDURE(UPDATABLE, $fields);  // we get inital _objectLayouts and every key, that was used in makeLayouts call removed from keys 
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
    return <FField ref={self._setFieldRef(arrayKey || fieldName)} key={arrayKey || fieldName} pFForm={self.props.$FField.pFForm} FFormApi={self.props.FFormApi}
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

  _reorderArrayLayout(prevBranch: StateType, nextBranch: StateType, props: any) {
    const self = this;
    const updatedArray = [];
    let doUpdate = false;
    for (let i = props.arrayStart; i < props.length; i++) {
      let arrayKey = self._arrayIndex2key(nextBranch[i]);
      if (isUndefined(arrayKey)) throw new Error('no unique key provided for array item');
      if (self._fields[arrayKey]) self._fields[arrayKey].setState({branch: nextBranch[i]});
      let prevIndex = self._arrayKey2field[arrayKey];
      if (self._arrayKey2field[arrayKey] !== i) {
        self._arrayKey2field[arrayKey] = i;
        doUpdate = true
      }
      updatedArray.push(!isUndefined(prevIndex) ? self._arrayLayouts[prevIndex - props.arrayStart] : self._makeFField(i.toString(), arrayKey));
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
    if (nextProps.FFormProps !== self.props.FFormProps) {
      self._rebuild = true;
      return true;
    }
    let doUpdate = false;

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
      self._getObjectKeys(nextBranch).forEach(field => (nextBranch[field] !== prevBranch[field]) && self._fields[field] && self._fields[field].setState({branch: nextBranch[field]}));

      if (self.props.isArray) doUpdate = self._reorderArrayLayout(prevBranch, nextBranch, nextProps); // updates and reorders elements greater/equal than self.props.arrayStart

    }

    return doUpdate; //|| !isEqual(self.props, nextProps, {skipKeys: ['$branch']});
  }

  render() {
    const self = this;
    if (self._rebuild) self._build(self.props); // make rebuild here to avoid addComponentAsRefTo Invariant Violation error https://gist.github.com/jimfb/4faa6cbfb1ef476bd105
    return <FSectionWidget _$widget={self._$widget} _$cx={self.props._$cx} key={'widget_0'} ref={self._setWidRef((0))}
                           getMappedData={self._getMappedData(0)}>{self._objectLayouts}{self._arrayLayouts}</FSectionWidget>

  }
}


/////////////////////////////////////////////
//  Basic components
/////////////////////////////////////////////

class GenericWidget extends React.Component<any, any> {
  private _children: any;
  protected _mapped: any[];

  constructor(props: any, context: any) {
    super(props, context);
  }

  private _newWidget(key: any, obj: any) {
    const {_$widget: Widget = GenericWidget, className, ...rest} = obj;
    return <Widget key={key} className={isString(Widget) && this.props._$cx ? this.props._$cx(className) : className} _$cx={!isString(Widget) ? this.props._$cx : undefined} {...rest}/>
  }

  protected _mapChildren(children: any) {
    const self = this;
    if (children !== self._children) {
      const prev = toArray(self._children);
      const next = toArray(children);
      self._mapped = next.map((ch: any, i: number) => !isObject(ch) || ch.$$typeof ? ch : (prev[i] !== next[i] ? self._newWidget(i, ch) : self._mapped[i]));
      self._children = children;
    }
  }

  render(): any {
    const self = this;
    if (self.props.norender) return null;
    const {useTag: UseTag = 'div', _$cx, className, children, ...rest} = self.props;
    self._mapChildren(children);
    return (<UseTag children={self._mapped} className={_$cx ? _$cx(className) : className} {...rest} />)
  }
}

function isEmpty(value: any) {
  return isMergeable(value) ? objKeys(value).length === 0 : value === undefined || value === null || value === "";
}

class UniversalInput extends GenericWidget {
  render() {
    const self = this;
    const props: any = self.props;
    if (props.viewer) {
      let {value, type = 'text', _$cx, enumExten = {}, viewerProps = {}} = props;
      let {useTag: UseTag = 'div', emptyMock = '(none)', ...rest} = viewerProps;
      if (rest.className && _$cx) rest.className = _$cx(rest.className);
      value = getIn(enumExten, value, 'label') || value;
      return React.createElement(UseTag, rest, isEmpty(value) ? emptyMock : value)
    }

    let {value, useTag: UseTag, type, enumVals = [], enumExten = {}, $_reactRef, _$cx, viewer, viewerProps, children, ...rest} = props;

    self._mapChildren(children);

    if (type == 'textarea' || type == 'select') UseTag = UseTag || type;
    else {
      UseTag = UseTag || 'input';
      if (type !== 'notInput') rest.type = type;
    }
    if (type !== 'notInput') rest[type === 'checkbox' ? 'checked' : 'value'] = value;

    if (isString(UseTag) && $_reactRef) { // if "simple" tag then use ref else pass further in $_reactRef property
      (rest.ref = rest[$_reactRef]);
      delete rest[$_reactRef];
    }

    if (rest.className && _$cx) rest.className = _$cx(rest.className);

    // if (type === 'textarea') return React.createElement(UseTag, rest, value);
    // if (type === 'select') {
    //   const {placeholder} = rest;
    //   if (!isUndefined(placeholder)) delete rest.placeholder;
    //   return React.createElement(UseTag, rest,
    //     !props.multiple && placeholder && React.createElement('option', enumExten[""], placeholder),
    //     ...enumVals.map((val: any, i: number) => React.createElement('option', {key: i, value: val, ...(enumExten[val] || {})}, getIn(enumExten, val, 'label') || val))
    //   );
    // } else return React.createElement(UseTag, rest);
    return React.createElement(UseTag, rest, self._mapped)
  }
}


class AutosizeWidget extends React.Component<any, any> {
  static readonly _sizerStyle: { position: 'absolute', top: 0, left: 0, visibility: 'hidden', height: 0, overflow: 'scroll', whiteSpace: 'pre' };
  private _elem: any;

  componentDidMount() {
    const style = window && window.getComputedStyle(this.props.$FField.$refs.Main);
    if (!style || !this._elem) return;
    ['fontSize', 'fontFamily', 'fontWeight', 'fontStyle', 'letterSpacing'].forEach(key => this._elem.style[key] = style[key]);
  }

  render() {
    const self = this;
    const props = self.props;
    const value = (isUndefined(props.value) ? '' : props.value.toString()) || props.placeholder || '';
    return (<div style={AutosizeWidget._sizerStyle as any} ref={(elem) => {
      (self._elem = elem) && (props.$FField.$refs.Main.style.width = Math.max((elem as any).scrollWidth + (props.addWidth || 45), props.minWidth || 0) + 'px')
    }}>{value}</div>)
  }
}

function FBuilder(props: any) {
  const {mapped, widgets} = props;
  const {Title, Body, Main, Message, Wrapper, Autosize} = widgets;

  return React.createElement(Wrapper, mapped['Wrapper'],
    Title ? React.createElement(Title, mapped['Title']) : '',
    React.createElement(Body, mapped['Body'],
      React.createElement(Main, mapped['Main']),
      Message ? React.createElement(Message, mapped['Message']) : '',
      Autosize ? React.createElement(Autosize, mapped['Autosize']) : ''
    )
  )
}


function WrapperWidget(props: any) {
  let {useTag: Wrapper = 'div', _$cx = classNames, className, ArrayItemMenu, ArrayItemBody, arrayItem, ...rest} = props;
  const {_$widget: IBodyW = 'div', className: IBodyCN = {}, ...IBodyRest} = ArrayItemBody || {};
  const {_$widget: IMenuW = 'div', className: IMenuCN = {}, ...IMenuRest} = ArrayItemMenu || {};
  const result = <Wrapper className={_$cx ? _$cx(className) : className} {...rest} />;
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
  let {checked, onChange, nullValue = null, getRef, type, ...rest} = props;
  return <input type="checkbox" checked={checked === true} {...rest}
                onChange={(event: any) => {
                  onChange(checked === nullValue ? true : (checked === true ? false : nullValue), event)
                }}
                ref={elem => {
                  getRef && getRef(elem);
                  elem && (elem.indeterminate = (checked === nullValue))
                }}/>
}


function MessagesWidget(props: any) {
  const {useTag: UseTag = 'div', MessageItem, messages = {}, _$cx = classNames, className, ...rest} = props;
  const {_$widget: MIW, ...restMI} = MessageItem;
  let keys = objKeys(messages);
  keys.sort((a, b) => parseFloat(a) - parseFloat(b));
  return <UseTag className={_$cx(className)} {...rest}>{keys.map(key => <MIW key={key} _$cx={_$cx} messageData={messages[key]} {...restMI} />)}</UseTag>;
}


function MessageItem(props: any) {
  const {useTag: UseTag = 'div', messageData, _$cx = classNames, className, ...rest} = props;
  const {priority, norender, textGroups, className: groupCN, ...restMG} = messageData;
  const texts: any[] = [];
  objKeys(textGroups).forEach((groupKey: string) => push2array(texts, textGroups[groupKey]));
  if (norender || !texts.length) return null;
  return <UseTag className={_$cx(className, groupCN, 'priority_' + priority)} {...rest} {...restMG}>{texts.join('<br/>')}</UseTag>
}


function ArrayInput(props: any) {
  function selectValue(value: any, selected: any, all: any) {
    const at = all.indexOf(value);
    const updated = selected.slice(0, at).concat(value, selected.slice(at));
    return updated.sort((a: any, b: any) => all.indexOf(a) > all.indexOf(b)); // reorder the updated selection to match the initial order
  }

  function deselectValue(value: any, selected: any) {return selected.filter((v: any) => v !== value);}

  let {
    value,
    useTag: UseTag = 'div',
    type,
    title,
    onFocus,
    onBlur,
    onChange,
    $FField,
    enumOptions,
    $_reactRef,
    autofocus,
    disabled,
    disabledClass,
    nullValue,
    inputProps = {},
    labelProps = {},
    stackedProps,
    ...rest
  }: { [key: string]: any } = props;
  if (!type) type = $FField && $FField.schemaPart.type == 'array' ? 'checkbox' : 'radio';
  const name = props.id;
  let ref = rest[$_reactRef];
  if ($_reactRef) delete rest[$_reactRef];
  let {useTag: InputUseTag = 'input', ...restInput} = inputProps;
  let {useTag: LabelUseTag = 'label', ...restLabel} = labelProps;
  let stacked = !!stackedProps;
  if (!stackedProps) stackedProps = {};
  let {useTag: StackedlUseTag = 'div', ...restStacked} = stackedProps;
  return (
    <UseTag {...rest}>{
      enumOptions && enumOptions.map((option: any, i: number) => {
        const addClass = disabled ? disabledClass : "";
        let input;
        if (type == 'radio') {
          const checked = option.value === value; // checked={checked} has been moved above name={name}, this is a temporary fix for radio button rendering bug in React, facebook/react#7630.
          input = (
            <InputUseTag type={type}
                         checked={checked}
                         id={`${name}/${i}`}
                         name={name}
                         value={option.value}
                         disabled={disabled}
                         autoFocus={autofocus && i === 0}
                         onFocus={onFocus}
                         onBlur={onBlur}
                         onClick={(event: any) => checked && onChange(nullValue)}
                         onChange={(event: any) => !checked && onChange(option.value)
                         }
                         {...restInput}/>);
        } else {
          const checked = value.indexOf(option.value) !== -1;
          input = (
            <InputUseTag type={type}
                         checked={checked}
                         id={`${name}/${i}`}
                         name={`${name}/${i}`}
                         disabled={disabled}
                         autoFocus={autofocus && i === 0}
                         onFocus={onFocus}
                         onBlur={onBlur}
                         onChange={(event: any) => {
                           const all = enumOptions.map(({value}: any) => value);
                           if (event.target.checked) props.funcs.onChange(selectValue(option.value, value, all));
                           else props.funcs.onChange(deselectValue(option.value, value));
                         }}
                         {...restInput}/>);
        }
        if (addClass) {
          let obj = stacked ? restStacked : restLabel;
          obj.className = ((obj.className || "") + " " + addClass).trim()
        }
        return stacked ? (
          <StackedlUseTag key={i} {...restStacked}>
            <LabelUseTag {...restLabel}>
              {input}
              <span>{option.label}</span>
            </LabelUseTag>
          </StackedlUseTag>
        ) : (
          <LabelUseTag key={i} {...restLabel}>
            {input}
            <span>{option.label}</span>
          </LabelUseTag>
        );
      })
    }</UseTag>
  );
}

///////////////////////////////
//     Functions
///////////////////////////////

const resolveComponents = memoize((fformObjects: formObjectsType, customizeFields: FFCustomizeType = {}, presets?: string): jsFFCustomizeType => {
  if (presets) {
    let $_ref = presets.split(':').map(v => v[0] != '^' && '^/presets/' + v).join(':') + ':' + (customizeFields.$_ref || '');
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

function normalizeMaps($_maps: any, prePath = '') {
  function normalizeArgs(args: any) {
    let dataRequest = false;
    args = toArray(args).map((arg: any) => isString(arg) && arg[0] == '@' ? (dataRequest = true) && normalizePath(arg.substr(1)) : arg);
    return {dataRequest, args}
  }

  const result: { data: NormalizedPropsMapType[], every: NormalizedPropsMapType[], build: NormalizedPropsMapType[] } = {data: [], every: [], build: []};
  objKeys($_maps).forEach(key => {
    const map = $_maps[key];
    if (!map) return;
    const to = multiplyPath(normalizePath((prePath ? prePath + '/' : '') + key));
    if (isMergeable(map)) {
      toArray(map).forEach(m => {
        const {update = 'data', replace = true, args = [], $} = m;
        result[update].push({update, replace, $, to, ...normalizeArgs(args)});
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

function updateProps(mappedData: any, prevData: any, nextData: any, ...iterMaps: Array<NormalizedPropsMapType[] | false>) {
  const getFromData = (arg: any) => isNPath(arg) ? getIn(nextData, arg) : arg;
  const needUpdate = (map: NormalizedPropsMapType) => isUndefined(prevData) || !map.$ || map.update != 'data' ||
    (map.dataRequest && map.args.some(arg => isNPath(arg) && getIn(prevData, arg) !== getIn(nextData, arg)));
  const dataUpdates = {update: {}, replace: {}};
  iterMaps.forEach(m => m && m.forEach(map => {
      if (!needUpdate(map)) return;
      const value = map.$ ? deArray(toArray(map.$).reduce((args, fn) => toArray(fn(...args)), map.dataRequest ? map.args.map(getFromData) : map.args)) : getFromData(map.args);
      objKeys(map.to).forEach(k => setUPDATABLE(dataUpdates, value, map.replace, map.to[k]));
      if (!map.replace) mappedData = mergeStatePROCEDURE(mappedData, dataUpdates);
    })
  );
  return mergeStatePROCEDURE(mappedData, dataUpdates);
}


function selectorMap(opts: { skipFields?: string[], replaceFields?: { [key: string]: string } } = {}) { //skipFields: string[] = [], replaceFields: { [key: string]: string } = {}) {
  const skipFields = opts.skipFields || [];
  const replaceFields = opts.replaceFields || {};
  return function (value: any, props: any) {
    const {path, getFromState, schema} = props;
    let vals = (isArray(value) ? value : [value]).map(key => (replaceFields[key]) ? replaceFields[key] : key);
    let tmpPath: any = normalizePath(path.split('@')[0]);
    const selectorField = tmpPath.pop();
    let stringPath = path2string(tmpPath);
    vals = vals.filter(key => getFromState(stringPath + '/' + key));
    vals.push(selectorField);
    stringPath = stringPath + '/' + vals.join(',') + '/@/params/hidden';
    return new stateUpdates([
      {skipFields, path: stringPath, value: false, macros: 'setMultiply'}, {skipFields, path: stringPath, value: true, macros: 'setAllBut'}]);
  }
}


/////////////////////////////////////////////
//  fformObjects
/////////////////////////////////////////////


let fformObjects: formObjectsType & { extend: (obj: any) => any } = {
  extend: function (obj) {
    return merge(this, obj, {symbol: false}) // merge without symbols, as there (in symbol keys) will be stored cache data which MUST be recalculated after each extend
  },
  types: ['string', 'integer', 'number', 'object', 'array', 'boolean', 'null'],
  // methods2chain: { // bind on<EventName> methods, so that it can access to previous method in chain by using this.on<EventName>
  //   'onBlur': true, 'onMouseOver': true, 'onMouseEnter': true, 'onMouseLeave': true, 'onChange': true, 'onSelect': true, 'onClick': true, 'onSubmit': true, 'onFocus': true, 'onUnload': true, 'onLoad': true
  // },
  widgets: {
    FSection: FSection,
    Generic: GenericWidget,
    Input: UniversalInput,
    Autosize: AutosizeWidget,
    CheckboxNull: CheckboxNull,
    Builder: FBuilder,
    Wrapper: WrapperWidget,
    ItemMenu: ItemMenu,
    Messages: MessagesWidget,
    MessageItem: MessageItem,
    ArrayInput: ArrayInput,
  },
  presets: {
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
        _$widget: '^/widgets/Messages',
        _$cx: '^/_$cx',
        $_maps: {
          messages: '@/messages',
          untouched: '@/status/untouched',
        },
        MessageItem: {
          _$widget: '^/widgets/MessageItem',
        },
      }
    },
    nBase: {
      $_ref: '^/presets/base',
      Main: {
        _$widget: '^/widgets/Input',
        _$cx: '^/_$cx',
        $_reactRef: 'getRef',
        onChange: '^/on/changeBase',
        onBlur: '^/on/blurBase',
        onFocus: '^/on/focusBase',
        viewerProps: {emptyMock: '(no value)'},
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
          enumVals: '@/fData/enum',
          enumExten: '@/fData/enumExten',
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
          htmlFor: {$: '^/fn/getFFieldProperty', args: ['id'], update: 'build'}
        }
      },
    },
    string: {
      $_ref: '^/presets/nBase',
      Main: {type: 'text'}
    },
    textarea: {
      $_ref: '^/presets/nBase',
      Main: {type: 'textarea'}
    },
    integer: {
      $_ref: '^/presets/nBase',
      Main: {
        type: 'number',
        onChange: '^/on/changeNumber',
        'onChange.bind': [true, 0]
      }
    },
    integerNull: {
      $_ref: '^/presets/integer',
      Main: {'onChange.bind': [true, null]}
    },
    number: {
      $_ref: '^/presets/integer',
      Main: {'onChange.bind': [false, 0], step: 'any'}
    },
    numberNull: {
      $_ref: '^/presets/number',
      Main: {'onChange.bind': [false, null]}
    },
    range: {$_ref: '^/presets/nBase', Main: {type: 'range'}},
    'null': {$_ref: '^/presets/nBase', Main: {type: 'hidden'}},
    hidden: {
      Builder: {
        className: {hidden: true},
        $_maps: {'className/hidden': false}
      }
    },
    boolean: {
      $_ref: '^/presets/nBase',
      Main: {
        type: 'checkbox',
        onChange: '^/on/changeBoolean'
      },
    },
    booleanLeft: {
      $_ref: '^/presets/base',
      Main: {
        _$widget: '^/widgets/Generic',
        useTag: 'label',
        children: [
          {$_ref: '^/presets/nBase/Main', type: 'checkbox', onChange: '^/on/changeBoolean'},
          {$_ref: '^/presets/nBase/Title', useTag: 'span'}
        ]
      },
      Title: false,
    },
    booleanNull: {
      $_ref: '^/presets/boolean',
      Main: {
        useTag: '^/widgets/CheckboxNull',
        onChange: '^/on/changeDirect'
      },
    },
    booleanNullLeft: {
      $_ref: '^/presets/booleanLeft',
      Main: {children: [{$_ref: '^/presets/booleanNull/Main'}, {}]}
    },
    object: {
      $_ref: '^/presets/base',
      Main: {
        _$widget: '^/widgets/FSection',
        _$cx: '^/_$cx',
        $_reactRef: true,
        uniqKey: 'params/uniqKey',
        LayoutDefaultClass: 'layout',
        LayoutDefaultWidget: 'div',
        $_maps: {
          length: '@/length',
          isArray: {$: '^/fn/equal', args: ['@/fData/type', 'array']},
          $branch: {$: '^/fn/getFFieldProperty', args: '$branch', update: 'every'},
          arrayStart: {$: '^/fn/getArrayStart', args: [], update: 'build'},
          $FField: {$: '^/fn/getFFieldProperty', args: [], update: 'build'},
          FFormApi: {$: '^/fn/getFFieldProperty', args: 'props/pFForm/api', update: 'build'},
          id: {$: '^/fn/getFFieldProperty', args: 'props/id', update: 'build'},
          name: {$: '^/fn/getFFieldProperty', args: 'props/name', update: 'build'},
          $layout: {$: '^/fn/getFFieldProperty', args: 'ff_layout', update: 'build'}
        }
      },
      Title: {
        _$widget: '^/widgets/Generic',
        _$cx: '^/_$cx',
        useTag: 'legend',
        children: [
          {$_ref: '^/presets/nBase/Title', useTag: 'span'},
          {$_ref: '^/parts/ArrayAddButton'},
          {$_ref: '^/parts/ArrayDelButton'},
          {$_ref: '^/parts/ArrayEmpty'}],
      },
      Wrapper: {useTag: 'fieldset'},
    },
    array: {$_ref: '^/presets/object'},
    select: {
      $_ref: '^/presets/nBase',
      Main: {
        type: 'select',
        $_maps: {
          'children': {$: '^/fn/arrayOfEnum', args: ['@/fData/enum', '@/fData/enumExten', {_$widget: 'option'}], replace: false},
          'label': false
        }
      }
    },
    multiselect: {
      $_ref: '^/presets/select',
      Main: {
        multiple: true,
        onChange: '^/on/changeSelectMultiple'
      }
    },

    // arrayOf: {
    //   $_ref: '^/presets/nBase',
    //   Main: {
    //     _$widget: '^/widgets/ArrayInput',
    //     inputProps: {},
    //     labelProps: {},
    //     stackedProps: {},
    //     disabledClass: 'disabled',
    //   },
    // },readOnly: '@/params/readonly',
    //           disabled: '@/params/disabled',
    radio: {
      $_ref: '^/presets/base',
      Title: {$_ref: '^/presets/nBase/Title'},
      Main: {
        _$widget: '^/widgets/Input',
        _$cx: '^/_$cx',
        useTag: 'div',
        $_reactRef: true,
        type: 'notInput',
        $_maps: {
          value: '@/value',
          viewer: '@/params/viewer',
          children: [
            {
              $: '^/fn/enumInputs',
              args: [
                '@/fData/enum',
                '@/fData/enumExten',
                {useTag: 'label'},
                {_$widget: 'input', type: 'radio', onChange: '^/on/changeBase', onBlur: '^/on/blurBase', onFocus: '^/on/focusBase'},
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
    checkboxes: {$_ref: '^/presets/radio', Main: {$_maps: {children: {'0': {args: {'3': {type: 'checkbox', onChange: '^/on/changeCheckboxes'}, '4': '[]'}}}}}},

    // inlineItems: {Main: {stackedProps: false}},
    // buttons: {Main: {inputProps: {className: {'button': true}}, labelProps: {className: {'button': true}}}},
    autosize: {
      Autosize: {$_ref: '^/parts/Autosize'},
      Wrapper: {style: {flexGrow: 0}},
    },
    noArrayControls: {
      Wrapper: {
        $_maps: {'arrayItem': false}
      },
    },
    noArrayButtons: {
      Title: {$_ref: '^/presets/nBase/Title'},
    },
    inlineTitle: {
      Wrapper: {className: {'flex-row': true}}
    },
    inlineArrayItem: {
      Wrapper: {ArrayItemBody: {className: {'flex-row': true}}}
    },
    inlineLayout: {
      Main: {LayoutDefaultClass: {'flex-row': true}}
    },
  },
  fn: {
    not: function (v: any) {return !v},
    equal: function (a: any, ...args: any[]) {return args.some(b => a === b)},
    getArrayStart: function () {return arrayStart(this.schemaPart)},
    getFFieldProperty: function (key: string) {return getIn(this, normalizePath(key))},
    arrayOfEnum: function (enumVals: any[], enumExten: anyObject = {}, staticProps: any = {}, name?: true | string) {
      return enumVals.map(val => {
        return {value: val, key: val, children: [getIn(enumExten, val, 'label') || val], name: name && (this.name + (name === true ? '' : name)), ...(enumExten[val] || {}), ...staticProps}
      })
    },
    enumInputs: function (enumVals: any[], enumExten: anyObject = {}, labelProps: any = {}, inputProps: any = {}, name?: true | string) {
      return enumVals.map(val => {
        return {
          ...labelProps,
          children: [
            {value: val, key: val, name: name && (this.props.name + (name === true ? '' : name)), ...(enumExten[val] || {}), ...inputProps},
            getIn(enumExten, val, 'label') || val
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
    clickArrayItemOps: function (path: any, key: string, opts: any) {this.api.arrayItemOps(path, key, opts)},
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
      self.api.set('./', 0, {[SymData]: ['status', 'untouched'], noValidation: true});
      self.api.set('/@/active', undefined, {noValidation: true});
      return !self.liveValidate ? self.api.validate() : null;
    }
  },
  parts: {
    Autosize: {
      _$widget: '^/widgets/Autosize',
      addWidth: 45,
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
      $_maps: {'arrayItem': '@/arrayItem'},
    }
  },
  presetMap: {
    boolean: ['select', 'radio'],
    string: ['select', 'password', 'email', 'hostname', 'ipv4', 'ipv6', 'uri', 'data-url', 'radio', 'textarea', 'hidden', 'date', 'datetime', 'date-time', 'color', 'file'],
    number: ['select', 'updown', 'range', 'radio'],
    integer: ['select', 'updown', 'range', 'radio'],
    array: ['select', 'checkboxes', 'files'],
  },
  _$cx: classNames
};


function classNames(...styles: any) {
  const classes = [];

  for (let i = 0; i < styles.length; i++) {
    let arg = styles[i];
    if (!arg) continue;

    const argType = typeof arg;

    if (argType === 'string' || argType === 'number') {
      classes.push(this && this[arg] || arg);
    } else if (isArray(arg)) {
      classes.push(classNames.apply(this, arg));
    } else if (argType === 'object') {
      for (let key in arg) {
        if (arg.hasOwnProperty(key) && arg[key]) {
          if (arg[key] === true) classes.push(this && this[key] || key);
          else classes.push(classNames.call(this, arg[key]));
        }
      }
    }
  }

  return classes.join(' ');
}

function Test() {
  return React.createElement('div', null, null);
}

export {selectorMap, fformObjects, FForm, FFormStateAPI, fformCores, classNames};

export {extractMaps, normalizeMaps, updateProps, Test}
//module.exports = process.env.NODE_ENV === 'test' ? merge(module.exports, {}) : module.exports;


//     "checkboxSelect": {
//       "type": "array",
//       "ff_managed": true,
//       "ff_presets": "checkboxes"
//     },