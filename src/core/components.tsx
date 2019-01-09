import * as React from 'react';
import {Component, PureComponent} from 'react';
import {asNumber, setIn, getIn, isArray, isEqual, isObject, isMergeable, isString, isUndefined, isFunction, makeSlice, merge, mergeState, objKeys, push2array, memoize, objKeysNSymb} from "./commonLib";
import {
  arrayStart,
  getBindedValue,
  getSchemaPart,
  isSchemaSelfManaged,
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
  isNPath
} from './stateLib'
import {FFormStateAPI, fformCores, objectResolver} from './api'
import Timeout = NodeJS.Timeout;

// function applyMixins(derivedCtor: any, baseCtors: any[]) {
//   baseCtors.forEach(baseCtor => {
//     Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
//       derivedCtor.prototype[name] = baseCtor.prototype[name]
//     })
//   });
// }


const _PRIORITYClassNames = {0: 'danger', 1: 'warning', 2: 'success', 3: 'info', 4: 'notice'};


/////////////////////////////////////////////
//  Main class
/////////////////////////////////////////////
class FForm extends Component<any, any> {
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
  }

  _setRef(FField: any) {
    this._root = FField;
  }


  _updateValues(nextProps: FFormProps, prevProps: any = {}) {
    const {state, value, inital, extData, flatten, noValidate} = nextProps;
    const self = this;
    if (state && state !== prevProps.state) self.api.setState(state);
    if (inital && inital !== prevProps.inital) self.api.setValue(inital, {inital: true, flatten, noValidate});
    if (value && value !== prevProps.value) self.api.setValue(value, {flatten, noValidate});
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

  render() {
    const self = this;
    let {core, state, value, inital, extData, fieldCache, flatten, noValidate, parent, onSubmit, onChange, onStateChange, useTag: UseTag = 'form', ...rest} = self.props;

    return (
      <UseTag {...rest} onSubmit={self._submit}>
        <FField ref={self._setRef} pFForm={self} getPath={self._getPath} FFrormApi={self.api}/>
      </UseTag>
    )
  }
}


/////////////////////////////////////////////
//  FField class
/////////////////////////////////////////////
class FField extends Component<any, any> {
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
  private _maps: object;
  private _maps$: object;

  ff_layout: FFLayoutGeneric<jsFFCustomizeType>;
  refs: any = {};
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
    Object.defineProperty(self, "liveValidate", {get: () => self.state.branch[SymData].params.liveValidate});
    self._apiWrapper();
    const branch = self.api.get(self.path);
    self.state = {branch};
    self._bind2self = self._bind2self.bind(self);
    self._setRef = self._setRef.bind(self);
    self._build();
  }

  focus(path: Path) {
    const self = this;
    self.refs['Main'] && self.refs['Main'].focus && self.refs['Main'].focus(path); // path.length ? self.refs.focus(path) : self.refs.focus();
  }

  _updateCachedValue() {
    const self = this;
    self._cachedTimeout = undefined;
    if (self._cached) {
      self.api.setValue(self._cached.value, {noValidation: !self.liveValidate});
      self._cached = undefined;
    }
  }

  _cacheValue(path: any, value: any, setValue = false): boolean {
    const self = this;
    let fieldCache = self.pFForm.props.fieldCache;
    if (isUndefined(fieldCache) || fieldCache === true) fieldCache = 40;
    if (fieldCache) {
      let valueSet = setValue && (!path || path == './' || path == '.');
      if (!valueSet) {
        let fPath = self.path;
        path = '#/' + path2string(normalizePath(path, self.path)) + (setValue ? '/@/value' : '');
        valueSet = (path == fPath + '/@/value') || (path == '#/@/current/' + fPath.slice(2));
      }
      if (valueSet) {
        self._cached = {value};
        if (self._cachedTimeout) clearTimeout(self._cachedTimeout);
        self._cachedTimeout = setTimeout(self._updateCachedValue.bind(self), fieldCache);
        const data = merge(self.state.branch[SymData], {value: self._cached.value});
        const mappedData = self._mappedData;
        self._setMappedData(data);
        if (mappedData != self._mappedData) self.forceUpdate();
        return true;
      }
    }
    return false;
  }

  _apiWrapper() {
    const self = this;
    const api = self.props.pFForm.api;
    const wrapPath = (path: string | Path = []) => normalizePath(path, self.path);
    const wrapOpts = (opts: any) => {
      const {path, noValidation, ...rest} = opts;
      if (!isUndefined(path)) rest.path = wrapPath(path);
      rest.noValidation = isUndefined(noValidation) ? !self.liveValidate : noValidation;
      return rest;
    };

    self.api = {
      validate: (path: boolean | string | Path = [], ...args: any[]) => api.validate(typeof path == 'boolean' ? path : wrapPath(path), ...args),
      get: (...path: any[]) => api.get(wrapPath(path)),
      set: (path: string | Path = [], value: any, opts?: any, ...args: any[]) => self._cacheValue(path, value) || api.set(wrapPath(path), value, wrapOpts(opts), ...args),
      setValue: (value: any, opts: any, ...args: any[]) => self._cacheValue(opts.path, value, true) || api.setValue(value, wrapOpts(opts), ...args)
    };
    ['noExec', 'execute', 'setState', 'getActive',].forEach(fn => self.api[fn] = (...args: any[]) => api[fn](...args));
    ['arrayAdd', 'arrayItemOps', 'setHidden', 'showOnly', 'getSchemaPart']
      .forEach(fn => self.api[fn] = (path: string | Path = [], ...args: any[]) => api[fn](wrapPath(path), ...args));
    ['getValue', 'getDefaultValue', 'reset', 'clear'].forEach(fn => self.api[fn] = (opts: any, ...args: any[]) => api[fn](wrapOpts(opts), ...args));
  }

  _bind2self(obj: any) {
    // if (typeof fncs == 'function') return fncs.bind(this);
    //     // if (fncs === true) return this;
    //     // return objMap(fncs, this._bind2self);

    const result = isArray(obj) ? [] : {};
    objKeys(obj).forEach(key => {
      if (typeof obj[key] == 'function') result[key] = obj[key].bind(this, ...(isArray(obj[key + '.bind']) ? obj[key + '.bind'] : []));
      else if (isMergeable(obj[key])) result[key] = this._bind2self(obj[key])
    });
    return result
  }

  _setRef(block: string) {
    const self = this;
    return (v: any) => self.refs[block] = v
  }

  _build() {
    // const isMultiSelect = (schema: any) => _isArray(schema.items && schema.items.enum) && schema.uniqueItems;
    // const isFilesArray = (schema: any) => schema.items && schema.items.type === "string" && schema.items.format === "data-url";
    // const getPresetName = (schemaPart: any, type: string = 'null') => type == 'array' ? (isMultiSelect(schemaPart) ? 'multiselect' : isFilesArray(schemaPart) ? 'files' : 'array') : type;
    // const getWidget = (objects: any, widget: any) => typeof widget === 'string' ? objects._widgets && objects._widgets[widget] || widget : widget;


    const self = this;
    const schemaPart: jsJsonSchema = self.api.getSchemaPart(self.path);
    const funcs: any = {};

    self.schemaPart = schemaPart;

    self._isNotSelfManaged = !isSchemaSelfManaged(schemaPart) || undefined;
    const components = resolveComponents(self.api.props.objects, schemaPart.ff_custom, schemaPart.ff_preset);
    self._ff_components = components[SymData] ? merge(components, self._bind2self(components[SymData])) : components;
    const ff_layout = resolveComponents(self.api.props.objects, schemaPart.ff_layout);
    self.ff_layout = ff_layout[SymData] ? merge(ff_layout, self._bind2self(ff_layout[SymData])) : ff_layout;

    // self._enumOptions = getEnumOptions(schemaPart);
    self._widgets = {};
    self._maps = {};
    self._blocks = objKeys(components).filter(key => components[key]);
    self._blocks.forEach((block: string) => {
      const {_$widget, $reactRef, $propsMap, ...schemaProps} = components[block];
      self._widgets[block] = _$widget;
      if ($reactRef) schemaProps[isString(schemaProps.$reactRef) ? $reactRef : 'ref'] = self._setRef(block); // $reactRef - prop for react ref-function
      const splitted = splitMaps($propsMap);
      self._maps[block] = splitted.map; // props that should be mapped from state[SymData]
      self._maps$[block] = splitted.map$;
      self._mappedData[block] = schemaProps;  // properties, without reserved names      
    });
    self._setArrayBlocks(self.state.branch[SymData]);
    self._setMappedData(self.state.branch[SymData]);
    self._rebuild = false;
  }

  _setArrayBlocks(data: any) {
    const self = this;
    let _widgets = self._widgets;
    _widgets = merge(_widgets, {Array: data.fData.type == 'array' ? getIn(self._ff_components, 'Array', '_$widget') : false});
    // _widgets = merge(_widgets, {ArrayItem: data.ArrayItem ? getIn(self._ff_components, 'ArrayItem', '_$widget') : false});
    if (self._widgets !== _widgets) {
      self._widgets = _widgets;
      return true
    }
    return false
  }

  // _setId() {
  //   const self = this;
  //   const id = getIn(self.props.stateBranch, SymData, 'uniqId');
  //   let path = self.props.getPath();
  //   if (id && path != '#') {
  //     path = path.split('/');
  //     path[path.length - 1] = id;
  //     path = path.join('/')
  //   }
  //   self.id = self.props.pFForm.api.name + '/' + path;
  // };

  _setMappedData(data: any, fullUpdate = true) {
    const self = this;
    const _mappedData = updateProps(self._mappedData, fullUpdate ? [self._maps, self._maps$] : [self._maps$], data);
    if (self._mappedData != _mappedData) {
      self._mappedData = _mappedData;
      return true
    }
    return false
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    const self = this;
    let updateComponent = false;

    if (nextProps.FFrormApi != self.props.FFrormApi) {
      self._rebuild = true;
      return true;
    }

    const nextData = nextState.branch[SymData];
    const currentData = self.state.branch[SymData];
    if (nextData.oneOf !== currentData.oneOf) {
      self._rebuild = true;
      return true;
    }

    if (nextData.fData.type !== currentData.fData.type) updateComponent = self._setArrayBlocks(nextData);
    updateComponent = self._setMappedData(nextState.branch[SymData], nextData !== currentData) || updateComponent;
    updateComponent = updateComponent || nextData.params.norender != currentData.params.norender;
    return updateComponent
  }

  render() {
    const self = this;
    if (self.state.branch[SymData].params.norender) return false;
    if (self._rebuild) this._build();
    const BuilderWidget = self._widgets['Builder'];
    return <BuilderWidget {...self._mappedData['Builder']} mapped={self._mappedData}/>
  }
}

//enumOptions={self._enumOptions}

/////////////////////////////////////////////
//  Section class
/////////////////////////////////////////////
class FSectionWidget extends PureComponent<any, any> { // need to be class, as we use it's forceUpdate() method
  render() {
    const {_$widget: Widget = 'div', getMappedData, $cx, className, ...rest} = this.props;
    return <Widget className={$cx ? $cx(className) : className} {...getMappedData()} {...rest}/>
  }
}

class FSection extends Component<any, any> {
  private _arrayStart: number = 0;
  private _rebuild = true;
  private _focusField: string = '';
  private _arrayKey2field: { [key: string]: number };
  private _fields: { [key: string]: any };
  private _widgets: { [key: string]: any };
  private _objectLayouts: any[] = [];
  private _arrayLayouts: any[] = [];
  private _setWidRef: any;
  private _setFieldRef: any;
  private _maps: { [key: string]: any };
  private _maps$: { [key: string]: any };
  private _mappedData: { [key: string]: any };
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
    if (!path.length) field = self._focusField;
    else {
      field = path[0];
      path = path.slice(1);
    }
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
          let {_$widget, $fields, map, map$} = normalizeLayout(fieldOrLayout as FFLayoutGeneric<jsFFCustomizeType>);
          self._maps[counter] = map;
          self._maps$[counter] = map$;
          layout.push(<FSectionWidget _$widget={_$widget} $cx={$cx} key={'widget_' + counter} ref={self._setWidRef((counter))}
                                      getMappedData={self._getMappedData(counter)}>{$fields && makeLayouts_INNER_PROCEDURE(UPDATABLE, $fields)}</FSectionWidget>)
        }
      });
      return layout
    }

    function normalizeLayout(layout: FFLayoutGeneric<jsFFCustomizeType>) {
      let {$fields, $propsMap, $reactRef, _$widget = LayoutDefaultWidget, className = LayoutDefaultClass, ...staticProps} = layout;
      const {map, map$} = splitMaps($propsMap);
      staticProps.className = className;
      return {_$widget, mappedData: staticProps, $fields, map, map$}
    }

    const self = this;

    const {$branch, $layout, $cx, arrayStart, LayoutDefaultWidget = 'div', LayoutDefaultClass = 'layout', uniqKey, focusField} = props;

    if (isSelfManaged($branch)) return;

    self._maps = {};
    self._maps$ = {};
    self._fields = {};
    self._widgets = {};
    self._mappedData = {};
    self._objectLayouts = [];

    self._isArray = !isUndefined(arrayStart);

    const UPDATABLE = {keys: self._getObjectKeys($branch), counter: 1};
    self._focusField = focusField || UPDATABLE.keys[0] || '';

    const N_layout = normalizeLayout(isArray($layout) ? {$fields: $layout} : $layout);
    self._$widget = N_layout._$widget;
    self._maps[0] = N_layout.map;
    self._maps$[0] = N_layout.map$;

    if (N_layout.$fields) self._objectLayouts = makeLayouts_INNER_PROCEDURE(UPDATABLE, N_layout.$fields);  // we get inital _objectLayouts and every key, that was used in makeLayouts call removed from keys 
    UPDATABLE.keys.forEach(fieldName => self._objectLayouts.push(self._makeFField(fieldName)));  // so here we have only keys was not used and we add them to _objectLayouts

    self._arrayLayouts = [];
    self._arrayKey2field = {};
    if (self._isArray) {  // _makeArrayLayouts
      for (let i = arrayStart; i < $branch[SymData].length; i++) {
        let arrayKey = self._arrayIndex2key($branch[i]);
        self._arrayLayouts.push(self._makeFField(i.toString(), arrayKey));
        arrayKey && (self._arrayKey2field[arrayKey] = i);
      }
    }
    self._mappedData = self._updateMappedData($branch[SymData]);
    self._rebuild = false;
  }

  _makeFField(fieldName: string, arrayKey?: string) {
    const self = this;
    return <FField ref={self._setFieldRef(arrayKey || fieldName)} key={arrayKey || fieldName} pFForm={self.props.$FField.pFForm} FFormApi={self.props.FFormApi}
                   getPath={arrayKey ? self._getArrayPath.bind(self, arrayKey) : self._getObjectPath.bind(self, fieldName)}/>;
  }

  _arrayIndex2key(stateBranch: any) {
    return this.props.uniqKey ? getIn(stateBranch[SymData], string2path(this.props.uniqKey)) : undefined;
  }

  _getObjectKeys(stateBranch: StateType) {
    const self = this;
    let keys: string[] = [];
    if (self._isArray) for (let i = 0; i < Math.min(self._arrayStart, stateBranch[SymData].length); i++) keys.push(i.toString());
    else keys = branchKeys(stateBranch);
    return keys;
  }

  _getObjectPath(field: string) {
    return this.props.$FField.path + '/' + field;
  }

  _getArrayPath(key: string) {
    return this.props.$FField.path + '/' + this._arrayKey2field[key];
  }

  _reorderArrayLayout(prevBranch: StateType, nextBranch: StateType) {
    const self = this;
    const updArray = [];
    let doUpdate = false;
    for (let i = self._arrayStart; i < nextBranch[SymData].length; i++) {
      let arrayKey = self._arrayIndex2key(nextBranch[i]);
      if (self._fields[arrayKey]) self._fields[arrayKey].setState({branch: nextBranch[i]});
      let prevIndex = self._arrayKey2field[arrayKey];
      if (self._arrayKey2field[arrayKey] !== i) {
        self._arrayKey2field[arrayKey] = i;
        doUpdate = true
      }
      updArray.push(!isUndefined(prevIndex) ? self._arrayLayouts[prevIndex - self._arrayStart] : self._makeFField(i.toString(), arrayKey));
    }
    if (self._arrayLayouts.length !== updArray.length) doUpdate = true;
    if (doUpdate) self._arrayLayouts = updArray;
    return doUpdate;
  }

  _updateMappedData(data: any, fullUpdate = true) {
    const self = this;
    return updateProps(self._mappedData, fullUpdate ? [self._maps, self._maps$] : [self._maps$], data);
  }

  shouldComponentUpdate(nextProps: any) {
    const self = this;
    if (nextProps.FFormProps !== self.props.FFormProps) {
      self._rebuild = true;
      return true;
    }

    let prevBranch = self.props.stateBranch;
    let nextBranch = nextProps.stateBranch;

    let doUpdate = false;

    if (prevBranch != nextBranch) {
      if (self._isArray) {
        const prevLength = prevBranch[SymData].length;
        const nextLength = nextBranch[SymData].length;
        if (prevLength != nextLength && (nextLength < self._arrayStart || prevLength < self._arrayStart - 1)) { // need to rebuild, length changed within turple range
          self._rebuild = true;
          return true;
        }
        doUpdate = self._reorderArrayLayout(prevBranch, nextBranch); // updates and reorders elements greater/equal than self._arrayStart
      }

      // update object elements or if it _isArray update elements that lower than self._arrayStartIndex
      self._getObjectKeys(nextBranch).forEach(field => (nextBranch[field] !== prevBranch[field]) && self._fields[field].setState({branch: nextBranch[field]}));

      const newMapped = self._updateMappedData(nextBranch[SymData], nextBranch[SymData] !== prevBranch[SymData]);
      if (newMapped != self._mappedData) { // update self._widgets
        const oldMapped = self._mappedData;
        self._mappedData = newMapped;
        objKeys(newMapped).forEach(key => self._widgets[key] && newMapped[key] != oldMapped[key] && self._widgets[key]['forceUpdate']());
      }
    }

    return doUpdate; //|| !isEqual(self.props, nextProps, {skipKeys: ['$branch']});
  }

  render() {
    const self = this;
    if (self._rebuild) self._build(self.props); // make rebuild here to avoid addComponentAsRefTo Invariant Violation error https://gist.github.com/jimfb/4faa6cbfb1ef476bd105
    return <FSectionWidget _$widget={self._$widget} $cx={self.props.$cx} key={'widget_0'} ref={self._setWidRef((0))}
                           getMappedData={self._getMappedData(0)}>{self._objectLayouts}{self._arrayLayouts}</FSectionWidget>

  }
}


/////////////////////////////////////////////
//  Basic components
/////////////////////////////////////////////

class GenericWidget extends PureComponent<any, any> {
  private _saved: any;
  private _mapped: any[];

  render() {
    if (this.props.norender) return null;
    const {useTag: UseTag = 'div', $cx, className, children, ...rest} = this.props;
    if (children !== this._saved) {
      const pSaved = isArray(this._saved) ? this._saved : [this._saved];
      this._saved = children;
      const nSaved = isArray(this._saved) ? this._saved : [this._saved];
      this._mapped = nSaved.map((ch: any, i: number) => isObject(ch) ? (pSaved[i] !== nSaved[i] ? new GenericWidget(ch) : this._mapped[i]) : ch);
    }
    return (<UseTag children={this._mapped} className={$cx ? $cx(className) : className} {...rest} />)
  }
}


class AutosizeBlock extends PureComponent<any, any> {
  static readonly _sizerStyle: { position: 'absolute', top: 0, left: 0, visibility: 'hidden', height: 0, overflow: 'scroll', whiteSpace: 'pre' };
  private _elem: any;

  componentDidMount() {
    const style = window && window.getComputedStyle(this.props.$FField.refs.Main);
    if (!style || !this._elem) return;
    ['fontSize', 'fontFamily', 'fontWeight', 'fontStyle', 'letterSpacing'].forEach(key => this._elem.style[key] = style[key]);
  }

  render() {
    const self = this;
    const props = self.props;
    const value = (isUndefined(props.value) ? '' : props.value.toString()) || props.placeholder || '';
    return (<div style={AutosizeBlock._sizerStyle as any} ref={(elem) => {
      (self._elem = elem) && (props.$FField.refs.Main.style.width = Math.max((elem as any).scrollWidth + (props.addWidth || 45), props.minWidth || 0) + 'px')
    }}>{value}</div>)
  }
}

function FBuilder(props: any) {
  const {mapped, widgets} = props;
  const {Title, Body, Main, Message, Wrapper, ArrayItem, Array, Autosize} = widgets;

  let result = (
    <Wrapper {...mapped['Wrapper']}>
      {Title ? <Title {...mapped['Title']}/> : ''}
      <Body {...mapped['Body']}>
      <Main {...mapped['Main']}/>
      {Message ? <Message {...mapped['Message']}/> : ''}
      {Autosize ? <Autosize {...mapped['Autosize']}/> : ''}
      </Body>
    </Wrapper>
  );
  if (Array) result = <Array {...mapped['Array']}>{result}</Array>;
  // if (ArrayItem) result = <ArrayItem  {...mapped['ArrayItem']}>{result}</ArrayItem>;
  return result;
}


function ArrayWidget(props: any) {
  const {useTag: UseTag = 'div', Empty, AddButton, length, canAdd, children, $cx, className, ...rest} = props;
  const {_$widget: EmptyW = 'div', ...emptyRest} = Empty;
  const {_$widget: AddButtonW = 'button', onClick, ...addButtonRest} = AddButton;
  if (length) return (<UseTag className={$cx ? $cx(className) : className} {...rest}>{children}{canAdd ? <AddButtonW onClick={onClick} {...addButtonRest} /> : ''}</UseTag>);
  else return (<UseTag className={$cx ? $cx(className) : className} {...rest}><EmptyW {...emptyRest}>{canAdd ? <AddButtonW onClick={onClick} {...addButtonRest} /> : ''}</EmptyW></UseTag>);
}


// function TitleBlock(props: any) {
//   const {title = '', required, useTag: UseTag = 'label', requireSymbol = '*', $cx, className, ...rest} = props;
//   return (
//     <UseTag {...(UseTag == 'label' && rest.id ? {htmlFor: rest.id} : {})} className={$cx ? $cx(className) : className} {...rest}>
//       {isString(title) && required ? title + requireSymbol : title}
//     </UseTag>
//   );
// }


function BaseInput(props: any) {
  let {
    value,
    useTag: UseTag,
    type = 'text',
    title,
    $FField,
    enumOptions,
    $reactRef,
    priority,
    $cx,
    className,
    ...rest
  }: { [key: string]: any } = props;
  UseTag = UseTag || (type == 'textarea' || type == 'select' ? type : 'input');
  const refObj: any = {};
  let ref = rest[$reactRef];
  if ($reactRef) delete rest[$reactRef];
  if (typeof UseTag == 'string') refObj.ref = ref; else refObj[$reactRef] = ref; // if "simple" tag then use ref else pass further in $reactRef property
  const commonProps = title ? {label: title} : {}; //{name: props.id, label: title || props.id.split('/').slice(-1)[0]}; 
  let valueObj: any = {};
  if (type === 'checkbox') valueObj.checked = !!value;
  else if (type === 'tristate') valueObj.checked = isUndefined(value) ? undefined : value;
  else valueObj.value = isUndefined(value) ? "" : value;

  if (type === 'textarea') return (<UseTag {...rest} {...refObj} {...commonProps}>{valueObj.value}</UseTag>);
  if (type === 'select') {
    const {placeholder, ...selectRest} = rest;
    return (
      <UseTag {...selectRest} {...refObj} {...commonProps} value={isUndefined(value) ? props.multiple ? [] : "" : value}>
        {!props.multiple && placeholder && <option value="">{placeholder}</option>}
        {enumOptions.map(({value, label}: any, i: number) => <option key={i} value={value}>{label}</option>)}
      </UseTag>);
  }// {enumOptions.map(({value, name}:any, i: number) => <option key={i} value={value}>{name}</option>)}
  else return (<UseTag className={$cx ? $cx(className) : className} {...rest} {...refObj} {...valueObj} type={type} {...commonProps}/>);
};

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
    stateBranch,
    $FField,
    enumOptions,
    $reactRef,
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
  let ref = rest[$reactRef];
  if ($reactRef) delete rest[$reactRef];
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

function CheckboxInput(props: any) {
  const {labelProps, ...rest} = props;
  return <label {...labelProps}><BaseInput {...rest}/><span>{props.title}</span></label>;
}


function MessagesWidget(props: any) {
  const {useTag: UseTag = 'div', MessageItem, messages = {}, $cx = classNames, className, ...rest} = props;
  const {_$widget: MIW, ...restMI} = MessageItem;
  let keys = objKeys(messages);
  keys.sort((a, b) => parseFloat(a) - parseFloat(b));
  return <UseTag className={$cx(className)} {...rest}>{keys.map(key => <MIW key={key} $cx={$cx} messageData={messages[key]} {...restMI} />)}</UseTag>;
}

function MessageItem(props: any) {
  const {useTag: UseTag = 'div', messageData, $cx = classNames, className, ...rest} = props;
  const {priority, norender, textGroups, className: groupCN, ...restMG} = messageData;
  const texts: any[] = [];
  objKeys(textGroups).forEach((groupKey: string) => push2array(texts, textGroups[groupKey]));
  if (norender || !texts.length) return null;
  return <UseTag className={$cx(className, groupCN, 'priority_' + priority)} {...rest} {...restMG}>{texts.join('<br/>')}</UseTag>
}


function WrapperWidget(props: any) {
  let {useTag: Wrapper = 'div', children, $cx = classNames, className, ArrayItemMenu, ArrayItemBody, arrayItem, ...rest} = props;
  const {_$widget: IBodyW = 'div', className: IBodyCN = {}, ...IBodyRest} = ArrayItemBody || {};
  const {_$widget: IMenuW = 'div', className: IMenuCN = {}, ...IMenuRest} = ArrayItemMenu || {};
  if (arrayItem) {
    return (
      <Wrapper className={$cx ? $cx(className) : className} {...rest}>
        <IBodyW className={$cx && $cx(IBodyCN)} {...IBodyRest} children={children}/>
        <IMenuW className={$cx && $cx(IMenuCN)} {...IMenuRest}/>
      </Wrapper>
    )
  } else return <Wrapper className={$cx ? $cx(className) : className} {...rest} children={children}/>
}

function ItemMenu(props: any) {
  const {useTag: UseTag = 'div', $cx = classNames, className, buttonsProps = {}, buttons, onClick: defaultOnClick, ...rest}: { [key: string]: any } = props;
  // if (!arrayItem) return false;
  // const {canUp, canDown, canDel} = arrayItem;
  // const canChecks = {'first': canUp, 'last': canDown, 'up': canUp, 'down': canDown, 'del': canDel};
  buttons.forEach((key: string) => delete rest[key]);
  return (
    <UseTag className={$cx ? $cx(className) : className} {...rest}>
      {buttons.map((key: string) => {
        const {_$widget: ButW = 'button', type = 'button', className: ButCN = {}, onClick = defaultOnClick, ...restBut} = buttonsProps[key] || {};
        return (<ButW key={key} type={type} className={$cx ? $cx(ButCN) : ButCN}  {...restBut} onClick={() => onClick(key)}/>)
      })}
    </UseTag>);
}


function TristateBox(props: any) {
  const self = this;
  let {checked, onChange, nullValue, getRef, type, ...rest} = props;
  return <input type="checkbox" checked={checked === true} {...rest}
                onChange={(event: any) => {onChange(checked === nullValue ? true : (checked === true ? false : nullValue), event)}}
                ref={elem => {
                  getRef && getRef(elem);
                  elem && (elem.indeterminate = (checked === nullValue))
                }}/>
}

///////////////////////////////
//     Functions
///////////////////////////////

const resolveComponents = memoize((fformObjects: formObjectsType, customizeFields: FFCustomizeType = {}, presets?: string): jsFFCustomizeType => {
  if (presets) {
    let $_ref = presets.split(':').map(v => v[0] != '%' && '%/presets/' + v).join(':') + ':' + customizeFields.$_ref || '';
    customizeFields = merge(customizeFields, {$_ref});
  }
  return objectResolver(fformObjects, customizeFields, true);
});

function splitMaps($propsMap: any) {
  const map = {};
  const map$ = {};
  objKeys($propsMap).forEach(key => {
    if (isObject($propsMap[key])) map$[key] = $propsMap[key];
    else map[key] = isArray($propsMap[key]) ? [$propsMap[0], $propsMap.slice(1).map((arg: any) => isString(arg) && arg[0] == '@' ? normalizePath(arg.substr(1)) : arg)] : normalizePath($propsMap[key]);
  });
  return {map, map$}
}

function updateProps(prevMappedData: any, iterMaps: any, newData: any) {
  const newUpdates = {update: {}, replace: {}};
  if (!isArray(iterMaps)) iterMaps = [iterMaps];
  iterMaps.forEach((maps: any) => objKeys(maps).forEach((key: string | number) => {
    const {update, replace} = mapProps(maps[key], newData);
    setUPDATABLE(newUpdates, update, replace, key);
  }));
  return mergeStatePROCEDURE(prevMappedData, newUpdates);
}


function mapProps(map: PropsMapGeneric<MapFunctionType>, data: FFieldDataType) {
  const result = {update: {}, replace: {}};
  if (!map) return result;
  const getFromData = (arg: any) => isNPath(arg) ? getIn(data, arg) : arg;
  objKeys(map).filter(key => map[key]).forEach((to) => {
    let item: any = map[to];
    const value = isObject(item) ? item.$(...item.args) : (isNPath(item) ? getFromData(item) : item[0](item[1].map(getFromData)));
    setUPDATABLE(result, value, true, normalizePath(to));
  });
  return result;
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


function onSelectChange(event: any) {
  function processSelectValue({type, items}: any, value: any) {
    if (type === "array" && items && (items.type == "number" || items.type == "integer")) return value.map(asNumber);
    else if (type === "boolean") return value === "true";
    else if (type === "number") return asNumber(value);
    return value;
  }

  function getSelectValue(event: any, multiple: boolean) {
    if (multiple) return [].slice.call(event.target.options).filter((item: any) => item.selected).map((item: any) => item.value);
    else return event.target.value;
  }

  this.onChange(processSelectValue(this.schemaPart, getSelectValue(event, this.field.schemaProps['Main'].multiple)))
}

/////////////////////////////////////////////
//  fformObjects
/////////////////////////////////////////////


const fformObjects: formObjectsType & { extend: (obj: any) => any } = {
  extend: function (obj) {
    return merge(this, obj, {symbol: false}) // merge without symbols, as there (in symbol keys) will be stored cache data which MUST be recalculated after each extend
  },
  types: ['string', 'integer', 'number', 'object', 'array', 'boolean', 'null'],
  // methods2chain: { // bind on<EventName> methods, so that it can access to previous method in chain by using this.on<EventName>
  //   'onBlur': true, 'onMouseOver': true, 'onMouseEnter': true, 'onMouseLeave': true, 'onChange': true, 'onSelect': true, 'onClick': true, 'onSubmit': true, 'onFocus': true, 'onUnload': true, 'onLoad': true
  // },
  widgets: {
    Generic: GenericWidget,
    Builder: FBuilder,
    Array: ArrayWidget,
    Wrapper: WrapperWidget,
    ItemMenu: ItemMenu,
    Messages: MessagesWidget,
    MessageItem: MessageItem,
    BaseInput: BaseInput,
    CheckboxInput: CheckboxInput,
    ArrayInput: ArrayInput,
    TristateBox: TristateBox,
    FSection: FSection,
    Autosize: AutosizeBlock,
  },
  presets: {
    'base': {
      //_blocks: {'Builder': true, 'Title': true, 'Body': true, 'Main': true, 'Message': true, 'GroupBlocks': true, 'ArrayItem': true, 'Autosize': false},
      // childrenBlocks: {},

      Array: {
        _$widget: '%/widgets/Array',
        $cx: '%/$cx',
        Empty: {
          _$widget: '%/widgets/Generic',
          children: 'This array is empty'
        },
        AddButton: {
          $_ref: '%/parts/ArrayAddButton'
        },
        $propsMap: {
          length: '@/length',
          canAdd: '@/fData/canAdd',
        },
      },
      Wrapper: {
        _$widget: '%/widgets/Wrapper',
        ArrayItemMenu: {
          $_ref: '%/parts/ArrayItemMenu'
        },
        $cx: '%/$cx',
        $propsMap: {
          'arrayItem': ['%/funcs/bool', '@/arrayItem'],
          'className/hidden': 'params/hidden',
          'ArrayItemMenu/buttonProps/canUp,first/disabled': ['%/funcs/not', '@/arrayItem/canUp'],
          'ArrayItemMenu/buttonProps/canDown,last/disabled': ['%/funcs/not', '@/arrayItem/canDown'],
          'ArrayItemMenu/buttonProps/canDel/disabled': ['%/funcs/not', '@/arrayItem/canDel'],
        }
      },
      Builder: {
        _$widget: '%/widgets/Builder',
        $cx: '%/$cx',
        $propsMap: {
          widgets: ['%/funcs/getFFieldProperty', '_widgets'],
        },
      },
      Body: {
        _$widget: '%/widgets/Generic',
        $cx: '%/$cx',
        className: 'body',
      },
      Title: {
        _$widget: '%/widgets/Generic',
        useTag: 'label',
        $cx: '%/$cx',
        $propsMap: {
          'className/required': '@/fData/required',
          children: '@/fData/title',
          htmlFor: ['%/funcs/getFFieldProperty', 'id']
        },
      },
      Message: {
        _$widget: '%/widgets/Messages',
        $cx: '%/$cx',
        $propsMap: {
          messages: '@/messages',
          untouched: '@/status/untouched',
        },
        MessageItem: {
          _$widget: '%/widgets/MessageItem',
        },
      },
      Main: {
        _$widget: '%/widgets/BaseInput',
        $reactRef: 'getRef',
        $cx: '%/$cx',
        $propsMap: {
          priority: '@/status/priority',
          value: '@/value',
          autoFocus: '@/params/autofocus',
          placeholder: '@/params/placeholder',
          required: '@/fData/required',
          title: '@/fData/title',
          readOnly: '@/params/readonly',
          disabled: '@/params/disabled',
        },
        onChange: '%/on/changeBasic',
        onBlur: '%/on/blurBasic',
        onFocus: '%/on/focusBasic',
      }
    },
    string: {
      $_ref: '%/presets/base', Main: {
        type: 'text',
        onChange: '%/on/changeString'
      }
    },
    integer: {
      $_ref: '%/presets/base',
      Main: {
        type: 'number',
        onChange: '%/on/changeInteger'
      }
    },
    number: {
      $_ref: '%/presets/base',
      Main: {
        type: 'number',
        step: 'any',
        onChange: '%/on/changeNumber'
      }
    },
    range: {$_ref: '%/presets/base', Main: {type: 'range'}},
    'null': {$_ref: '%/presets/base', Main: {type: 'hidden'}},
    hidden: {
      Builder: {
        className: {hidden: true},
        $propsMap: {'className/hidden': false}
      }
    },
    boolean: {
      $_ref: '%/presets/base',
      Main: {
        _$widget: '%/widgets/CheckboxInput',
        type: 'checkbox',
        onChange: '%/on/changeBoolean'
      },
      Title: false,
    },
    tristate: {
      $_ref: '%/presets/base',
      Main: {
        _$widget: '%/widgets/CheckboxInput',
        type: 'tristate',
        useTag: '%/widgets/TristateBox'
      },
      Title: false,
    },
    object: {
      $_ref: '%/presets/base',
      Main: {
        _$widget: '%/widgets/FSection',
        $reactRef: true,
        uniqKey: 'arrayItem/uniqKey',
        $cx: '%/$cx',
        LayoutDefaultClass: 'layout',
        LayoutDefaultWidget: 'div',
        $propsMap: {
          value: false,
          autoFocus: false,
          placeholder: false,
          required: false,
          title: false,
          readOnly: false,
          disabled: false,
          arrayStart: ['%/funcs/getArrayStart', '@/fData/type'],
          FFormApi: ['%/funcs/getFFieldProperty', 'props/pFForm/api'],
          $layout: ['%/funcs/getFFieldProperty', 'ff_layout'],
          $branch: {'$': '%/funcs/getFFieldProperty', args: ['state/branch']},
        }
      },
      GroupBlocks: {useTag: 'fieldset'},
      Title: {useTag: 'legend'},
    },
    array: '%/presets/object',
    inlineTitle: {
      GroupBlocks: {
        style: {flexFlow: 'row'},
      }
    },
    select: {$_ref: '%/presets/base', Main: {type: 'select', onChange: onSelectChange}},
    multiselect: {$_ref: '%/presets/select', Main: {multiply: true}},
    arrayOf: {
      $_ref: '%/presets/base',
      Main: {
        _$widget: '%/widgets/ArrayInput',
        inputProps: {},
        labelProps: {},
        stackedProps: {},
        disabledClass: 'disabled',
      },
    },
    radio: {$_ref: '%/presets/arrayOf', Main: {type: 'radio'}},
    checkboxes: {$_ref: '%/presets/arrayOf', Main: {type: 'checkbox'}, 'Array': false},

    inlineItems: {Main: {stackedProps: false}},
    buttons: {Main: {inputProps: {className: {'button': true}}, labelProps: {className: {'button': true}}}},
    //selector: {dataMap: [['./@/value', './', selectorOnChange(false)]]}, // {onChange: selectorOnChange(false)}},
    //tabs: {dataMap: [['./@/value', './', selectorOnChange(true)]]}, //{Main: {onChange: selectorOnChange(true)}},
    autosize: {
      Autosize: '%/parts/Autosize',
      GroupBlocks: {style: {flexGrow: 0}},
    },
    flexRow: {
      Layouts: {style: {flexFlow: 'row'}}
    },
    noArrayItem: {
      ArrayItem: false,
    },
    noArray: {
      Array: false,
    }
  },
  funcs: {
    not: function (v: any) {return !v},
    bool: function (v: any) {return !!v},
    hidden4Array: function (hidden: any) {return !this._widgets['ArrayItem'] && !!hidden},
    hidden4Builder: function (hidden: any) {return !this._widgets['Array'] && !this._widgets['ArrayItem'] && !!hidden},
    //getFField: function () {return this},
    //getBranch: function () {return this.state.branch},
    // getFFormApi: function () {return this.props.pFForm.api},
    getArrayStart: function (type: string) {return type == 'array' && arrayStart(this.schemaPart) || undefined},
    getFFieldProperty: function (key: string) {return getIn(this, normalizePath(key))},
  },
  on: {
    clickArrayAdd: function (path: any) {this.api.arrayAdd(path, 1)},
    clickArrayItemOps: function (path: any, key: string) {this.api.arrayItemOps(path, key)},
    changeBasic: function (event: any) {this.api.setValue(event.target.value, {})},
    changeString: function (event: any) {this.api.setValue(event.target.value, {})},
    changeInteger: function (event: any) {this.setValue(event.target.value == '' ? undefined : parseInt(event.target.value))},
    changeNumber: function (event: any) {this.setValue(event.target.value == '' ? undefined : parseFloat(event.target.value))},
    changeBoolean: function (event: any) {this.onChange(event.target.checked)},
    focusBasic: function (value: any) {this.api.set('/@/active', this.path, {noValidation: true})},
    blurBasic: function (value: any) {
      const self = this;
      self.api.set('./', 0, {[SymData]: ['status', 'untouched'], noValidation: true});
      self.api.set('/@/active', undefined, {noValidation: true});
      return !self.liveValidate ? self.api.validate() : null;
    }
  },
  parts: {
    Autosize: {
      _$widget: '%/widgets/Autosize',
      $propsMap: {
        addWidth: 45,
        minWidth: 60,
        value: 'value',
        placeholder: '@/params/placeholder',
        'className/hidden': '@/params/hidden',
        $FField: ['%/funcs/getFFieldProperty'],
      }
    },
    Button: {
      _$widget: '%/widgets/Generic',
      useTag: 'button',
      type: 'button',
    },
    ArrayAddButton: {
      $_ref: '%/parts/Button',
      children: 'Add new item',
      onClick: '%/funcs/on/clickArrayAdd',
      'onClick.bind': ['./']
    },
    ArrayItemMenu: {
      _$widget: '%/widgets/ItemMenu',
      buttons: ['first', 'last', 'up', 'down', 'del'],
      onClick: '%/funcs/on/clickArrayItemOps',
      'onClick.bind': ['./'],
      buttonProps: {
        $propsMap: {
          'canUp,first/disabled': ['%/funcs/not', '@/arrayItem/canUp'],
          'canDown,last/disabled': ['%/funcs/not', '@/arrayItem/canDown'],
          'canDel/disabled': ['%/funcs/not', '@/arrayItem/canDel'],
        }
      },
      // $propsMap: {
      //   'buttonProps/canUp,first/disabled': ['%/funcs/not', '@/arrayItem/canUp'],
      //   'buttonProps/canDown,last/disabled': ['%/funcs/not', '@/arrayItem/canDown'],
      //   'buttonProps/canDel/disabled': ['%/funcs/not', '@/arrayItem/canDel'],
      // }
    }
  },
  presetMap: {
    boolean: ['select', 'radio'],
    string: ['select', 'password', 'email', 'hostname', 'ipv4', 'ipv6', 'uri', 'data-url', 'radio', 'textarea', 'hidden', 'date', 'datetime', 'date-time', 'color', 'file'],
    number: ['select', 'updown', 'range', 'radio'],
    integer: ['select', 'updown', 'range', 'radio'],
    array: ['select', 'checkboxes', 'files'],
  },
  $cx: classNames

  // presetsCombineAfter: {
  //   radio: ['inlineItems', 'buttons'],
  //   checkboxes: ['inlineItems', 'buttons'],
  //   string: ['autosize'],
  //   number: ['autosize'],
  //   integer: ['autosize'],
  //   email: ['autosize'],
  //   password: ['autosize'],
  //   hostname: ['autosize'],
  //   uri: ['autosize'],
  // },
  // presetsCombineBefore: {
  //   radio: ['selector', 'tabs'],
  //   checkboxes: ['selector', 'tabs'],
  //   select: ['selector', 'tabs'],
  // },
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


export {selectorMap, fformObjects, FForm, FFormStateAPI, fformCores, classNames};

//module.exports = process.env.NODE_ENV === 'test' ? merge(module.exports, {}) : module.exports;

