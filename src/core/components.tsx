import * as React from 'react';
import {Component, PureComponent} from 'react';
import {asNumber, toArray, setIn, getIn, isArray, isEqual, isObject, isMergeable, isString, isUndefined, isFunction, makeSlice, merge, mergeState, objKeys, push2array, memoize, objKeysNSymb} from "./commonLib";
import {
  arrayStart,
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
  isNPath,
  multiplyPath
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
    Object.defineProperty(self, "objects", {get: () => self.api.props.objects});
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
  private _maps: NPM4WidgetsType;


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

  _resolver(obj: any) {
    const self = this;
    let result = objectResolver(self.pFForm.objects, obj, true);
    return result[SymData] ? merge(result, self._bind2self(result[SymData])) : result;
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
        self._setMappedData(self.state.branch[SymData], data, true);
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

    self._isNotSelfManaged = !isSelfManaged(self.state.branch) || undefined;
    const components = resolveComponents(self.api.props.objects, schemaPart.ff_custom, schemaPart.ff_preset);
    self._ff_components = components[SymData] ? merge(components, self._bind2self(components[SymData])) : components;
    const ff_layout = resolveComponents(self.api.props.objects, schemaPart.ff_layout);
    self.ff_layout = ff_layout[SymData] ? merge(ff_layout, self._bind2self(ff_layout[SymData])) : ff_layout;

    // self._enumOptions = getEnumOptions(schemaPart);
    self._widgets = {};
    const {$propsMap, rest: comps} = extractMaps(components);
    self._maps = normalizeMaps($propsMap);

    self._blocks = objKeys(comps).filter(key => comps[key]);
    self._blocks.forEach((block: string) => {
      //let {$propsMap, rest} = extractMaps(comps[block]);
      const {_$widget, $reactRef, ...staticProps} = comps[block];
      self._widgets[block] = _$widget;
      if ($reactRef) staticProps[isString(staticProps.$reactRef) ? $reactRef : 'ref'] = self._setRef(block); // $reactRef - prop for react ref-function

      self._mappedData[block] = staticProps;  // properties, without reserved names      
    });
    // self._setArrayBlocks(self.state.branch[SymData]);
    self._setMappedData(undefined, self.state.branch[SymData], 'build');
    self._rebuild = false;
  }

  // _setArrayBlocks(data: any) {
  //   const self = this;
  //   let _widgets = self._widgets;
  //   _widgets = merge(_widgets, {Array: data.fData.type == 'array' ? getIn(self._ff_components, 'Array', '_$widget') : false});
  //   // _widgets = merge(_widgets, {ArrayItem: data.ArrayItem ? getIn(self._ff_components, 'ArrayItem', '_$widget') : false});
  //   if (self._widgets !== _widgets) {
  //     self._widgets = _widgets;
  //     return true
  //   }
  //   return false
  // }

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

  _setMappedData(prevData: any, nextData: any, fullUpdate: boolean | 'build') {
    const self = this;
    const _mappedData = updateProps(self._mappedData, prevData, nextData, fullUpdate == 'build' && self._maps.build, fullUpdate && self._maps.data, self._maps.every);
    if (self._mappedData != _mappedData) {
      self._mappedData = _mappedData;
      return true
    }
    return false
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    if (!nextState.branch) return true;

    const self = this;
    let updateComponent = false;

    if (nextProps.FFrormApi != self.props.FFrormApi) {
      self._rebuild = true;
      return true;
    }

    const nextData = nextState.branch[SymData];
    const prevData = self.state.branch[SymData];
    if (nextData.oneOf !== prevData.oneOf) {
      self._rebuild = true;
      return true;
    }

    // if (nextData.fData.type !== currentData.fData.type) updateComponent = self._setArrayBlocks(nextData);
    updateComponent = self._setMappedData(prevData, nextData, nextData !== prevData) || updateComponent;
    updateComponent = updateComponent || nextData.params.norender != prevData.params.norender;
    return updateComponent
  }

  render() {
    const self = this;
    if (!self.state.branch) return null;
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
  private _maps: NPM4WidgetsType = {};
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
          layout.push(<FSectionWidget _$widget={_$widget} $cx={$cx} key={'widget_' + counter} ref={self._setWidRef((counter))}
                                      getMappedData={self._getMappedData(counter)}>{$fields && makeLayouts_INNER_PROCEDURE(UPDATABLE, $fields)}</FSectionWidget>)
        }
      });
      return layout
    }

    function normalizeLayout(counter: number, layout: FFLayoutGeneric<jsFFCustomizeType>) {
      let {$propsMap, rest} = extractMaps(layout, ['$fields']);
      let {$fields, $reactRef, _$widget = LayoutDefaultWidget, className = LayoutDefaultClass, ...staticProps} = rest;
      staticProps.className = className;
      let maps = normalizeMaps($propsMap, counter.toString());
      mapsKeys.forEach(k => self._maps[k].push(...maps[k]));
      self._mappedData[counter] = staticProps;
      return {_$widget, $fields}
    }

    const self = this;

    const {$branch, $layout, $cx, arrayStart, LayoutDefaultWidget = 'div', LayoutDefaultClass = 'layout', uniqKey, focusField} = props;

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
      for (let i = arrayStart; i < $branch[SymData].length; i++) {
        let arrayKey = self._arrayIndex2key($branch[i]);
        self._arrayLayouts.push(self._makeFField(i.toString(), arrayKey));
        arrayKey && (self._arrayKey2field[arrayKey] = i);
      }
    }
    self._mappedData = self._updateMappedData(undefined, $branch[SymData], 'build');
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
    if (self.props.isArray) for (let i = 0; i < self.props.arrayStart; i++) keys.push(i.toString()); // Math.min(self.props.arrayStart, stateBranch[SymData].length)
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
    const updatedArray = [];
    let doUpdate = false;
    for (let i = self.props.arrayStart; i < nextBranch[SymData].length; i++) {
      let arrayKey = self._arrayIndex2key(nextBranch[i]);
      if (self._fields[arrayKey]) self._fields[arrayKey].setState({branch: nextBranch[i]});
      let prevIndex = self._arrayKey2field[arrayKey];
      if (self._arrayKey2field[arrayKey] !== i) {
        self._arrayKey2field[arrayKey] = i;
        doUpdate = true
      }
      updatedArray.push(!isUndefined(prevIndex) ? self._arrayLayouts[prevIndex - self.props.arrayStart] : self._makeFField(i.toString(), arrayKey));
    }
    if (self._arrayLayouts.length !== updatedArray.length) doUpdate = true;
    if (doUpdate) self._arrayLayouts = updatedArray;
    return doUpdate;
  }

  _updateMappedData(prevData: any, nextData: any, fullUpdate: boolean | 'build') {
    const self = this;
    return updateProps(self._mappedData, prevData, nextData, fullUpdate == 'build' && self._maps.build, fullUpdate && self._maps.data, self._maps.every);
  }

  shouldComponentUpdate(nextProps: any) {
    const self = this;
    if (nextProps.FFormProps !== self.props.FFormProps) {
      self._rebuild = true;
      return true;
    }
    let doUpdate = false;

    let prevBranch = self.props.stateBranch;
    let nextBranch = nextProps.stateBranch;

    if (prevBranch != nextBranch) {
      // update object elements or if it _isArray elements that lower than self.props.arrayStart
      self._getObjectKeys(nextBranch).forEach(field => (nextBranch[field] !== prevBranch[field]) && self._fields[field] && self._fields[field].setState({branch: nextBranch[field]}));

      if (self.props.isArray) doUpdate = self._reorderArrayLayout(prevBranch, nextBranch); // updates and reorders elements greater/equal than self.props.arrayStart

      const newMapped = self._updateMappedData(prevBranch[SymData], nextBranch[SymData], nextBranch[SymData] !== prevBranch[SymData]);
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
  private _children: any;
  private _mapped: any[];

  _newWidget(obj: any) {
    const {_$widget: Widget = GenericWidget, className, ...rest} = obj;
    return <Widget className={isString(Widget) && this.props.$cx ? this.props.$cx(className) : className} {...rest}/>
  }

  render() {
    const self = this;
    if (self.props.norender) return null;
    const {useTag: UseTag = 'div', $cx, className, children, ...rest} = self.props;
    if (children !== self._children) {
      const prev = toArray(self._children);
      const next = toArray(children);
      self._mapped = next.map((ch: any, i: number) => !isObject(ch) ? ch : (prev[i] !== next[i] ? self._newWidget(ch) : self._mapped[i]));
      self._children = children;
    }
    return (<UseTag children={self._mapped} className={$cx ? $cx(className) : className} {...rest} />)
  }
}


class AutosizeWidget extends PureComponent<any, any> {
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
    return (<div style={AutosizeWidget._sizerStyle as any} ref={(elem) => {
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


function WrapperWidget(props: any) {
  let {useTag: Wrapper = 'div', children, $cx = classNames, className, ArrayItemMenu, ArrayItemBody, arrayItem, ...rest} = props;
  const {_$widget: IBodyW = 'div', className: IBodyCN = {}, ...IBodyRest} = ArrayItemBody || {};
  const {_$widget: IMenuW = 'div', className: IMenuCN = {}, ...IMenuRest} = ArrayItemMenu || {};
  if (arrayItem) {
    return (
      <Wrapper className={$cx ? $cx(className) : className} {...rest}>
        <IBodyW className={$cx && $cx(IBodyCN)} {...IBodyRest} children={children}/>
        <IMenuW className={$cx && $cx(IMenuCN)} {...IMenuRest} arrayItem={arrayItem}/>
      </Wrapper>
    )
  } else return <Wrapper className={$cx ? $cx(className) : className} {...rest} children={children}/>
}

function ItemMenu(props: any) {
  const {useTag: UseTag = 'div', $cx = classNames, className, buttonsProps = {}, arrayItem = {}, buttons = [], onClick: defaultOnClick, ...rest}: { [key: string]: any } = props;
  buttons.forEach((key: string) => delete rest[key]);
  return (
    <UseTag className={$cx(className)} {...rest}>
      {buttons.map((key: string) => {
        const {_$widget: ButW = 'button', type = 'button', disabledCheck = '', className: ButCN = {}, onClick = defaultOnClick, ...restBut} = buttonsProps[key] || {};
        return (<ButW key={key} type={type} className={$cx ? $cx(ButCN) : ButCN} disabled={disabledCheck && !arrayItem[disabledCheck]} {...restBut} onClick={() => onClick(key)}/>)
      })}
    </UseTag>);
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


function BaseInput(props: any) {
  let {
    value,
    useTag: UseTag,
    type = 'text',
    title,
    enumOptions,
    $reactRef,
    $cx,
    className,
    ...rest
  }: { [key: string]: any } = props;
  UseTag = UseTag || (type == 'textarea' || type == 'select' ? type : 'input');
  let ref = rest[$reactRef];
  if ($reactRef) delete rest[$reactRef];
  const calcProps: any = {}; //{name: props.id, label: title || props.id.split('/').slice(-1)[0]}; 
  if (isString(UseTag)) calcProps.ref = ref; else calcProps[$reactRef] = ref; // if "simple" tag then use ref else pass further in $reactRef property
  let valueObj: any = {};
  if (type === 'checkbox') valueObj.checked = !!value;
  else if (type === 'tristate') valueObj.checked = isUndefined(value) ? undefined : value;
  else valueObj.value = isUndefined(value) ? "" : value;

  if (type === 'textarea') return (<UseTag {...rest} {...calcProps}>{valueObj.value}</UseTag>);
  if (type === 'select') {
    const {placeholder, ...selectRest} = rest;
    return (
      <UseTag {...selectRest} {...calcProps} value={isUndefined(value) ? props.multiple ? [] : "" : value}>
        {!props.multiple && placeholder && <option value="">{placeholder}</option>}
        {enumOptions.map(({label, ...rest}: any, i: number) => <option key={i} {...rest}>{label}</option>)}
      </UseTag>);
  }// {enumOptions.map(({value, name}:any, i: number) => <option key={i} value={value}>{name}</option>)}
  else return (<UseTag className={$cx ? $cx(className) : className} {...rest} {...valueObj} type={type} {...calcProps}/>);
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

function extractMaps(obj: any, skip: string[] = []) {
  let {$propsMap, ...rest2extract} = obj;
  $propsMap = {...$propsMap};
  const rest: any = {};
  objKeys(rest2extract).forEach(key => {
    if (isObject(rest2extract[key]) && !~skip.indexOf(key)) {
      let res = extractMaps(rest2extract[key]);
      rest[key] = res.rest;
      objKeys(res.$propsMap).forEach((nk) => $propsMap[key + '/' + nk] = res.$propsMap[nk]);
    } else rest[key] = rest2extract[key]
  });

  return {$propsMap, rest};
}

function normalizeMaps($propsMap: any, prePath = '') {
  function normalizeArgs(args: any) {
    if (!isArray(args)) args = [args];
    let dataRequest = false;
    args = args.map((arg: any) => isString(arg) && arg[0] == '@' ? (dataRequest = true) && normalizePath(arg.substr(1)) : arg);
    return {dataRequest, args}
  }

  const result: { data: NormalizedPropsMapType[], every: NormalizedPropsMapType[], build: NormalizedPropsMapType[] } = {data: [], every: [], build: []};
  objKeys($propsMap).forEach(key => {
    const map = $propsMap[key];
    if (!map) return;
    const to = multiplyPath(normalizePath((prePath ? prePath + '/' : '') + key));
    if (isObject(map)) {
      const {update = 'every', args = [], $} = map;
      result[update].push({update, $, to, ...normalizeArgs(args)});
    } else if (isArray(map)) {
      const res: any = {update: 'data', to, ...normalizeArgs(map.slice(1))};
      res.$ = map[0];
      if (!isFunction(res.$)) throw new Error('Expected zero element of array to be a function');
      result.data.push(res);
    } else {
      let path = map;
      if (!isString(path)) throw new Error('$propsMap value is not recognized');
      if (path[0] !== '@') console.warn('Expected "@" at the begining of string');
      else path = path.substr(1);
      result.data.push({to, dataRequest: true, args: normalizePath(path), update: 'data'})
    }
  });
  return result
}

function updateProps(mappedData: any, prevData: any, nextData: any, ...iterMaps: Array<NormalizedPropsMapType[] | false>) {
  const getFromData = (arg: any) => isNPath(arg) ? getIn(nextData, arg) : arg;
  const needUpdate = (map: NormalizedPropsMapType) => isUndefined(prevData) || !map.$ || map.update != 'data' || (map.dataRequest && checkChanges(map.args));
  const checkChanges = (args: any[]) => {
    for (let i = 0; i < args.length; i++) if (isNPath(args[i]) && getIn(prevData, args[i] !== getIn(nextData, args[i]))) return true;
    return false
  };
  const dataUpdates = {update: {}, replace: {}};
  iterMaps.forEach(m => m && m.forEach(map => {
      if (!needUpdate(map)) return;
      const value = map.$ ? map.$(...(map.dataRequest ? map.args.map(getFromData) : map.args)) : getFromData(map.args);
      objKeys(map.to).forEach(k => setUPDATABLE(dataUpdates, value, true, map.to[k]))
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
    FSection: FSection,
    Generic: GenericWidget,
    Autosize: AutosizeWidget,
    Builder: FBuilder,
    Wrapper: WrapperWidget,
    ItemMenu: ItemMenu,
    Messages: MessagesWidget,
    MessageItem: MessageItem,
    BaseInput: BaseInput,
    CheckboxInput: CheckboxInput,
    ArrayInput: ArrayInput,
    TristateBox: TristateBox,
  },
  presets: {
    'base': {
      //_blocks: {'Builder': true, 'Title': true, 'Body': true, 'Main': true, 'Message': true, 'Wrapper': true, 'Autosize': false},
      // childrenBlocks: {},
      // Array: {
      //   _$widget: '%/widgets/Array',
      //   $cx: '%/$cx',
      //   Empty: {
      //     _$widget: '%/widgets/Generic',
      //     children: 'This array is empty'
      //   },
      //   AddButton: {
      //     $_ref: '%/parts/ArrayAddButton'
      //   },
      //   $propsMap: {
      //     length: '@/length',
      //     canAdd: '@/fData/canAdd',
      //   },
      // },
      Wrapper: {
        _$widget: '%/widgets/Wrapper',
        ArrayItemMenu: {
          $_ref: '%/parts/ArrayItemMenu'
        },
        $cx: '%/$cx',
        $propsMap: {
          'arrayItem': '@/arrayItem',
          'className/hidden': 'params/hidden',
        }
      },
      Builder: {
        _$widget: '%/widgets/Builder',
        $cx: '%/$cx',
        $propsMap: {
          widgets: ['%/funcs/getFFieldProperty', '_widgets'],
        },
      },
      Title: {
        _$widget: '%/widgets/Generic',
        useTag: 'label',
        $cx: '%/$cx',
        children: [],
        $propsMap: {
          'className/required': '@/fData/required',
          'children/0': '@/fData/title',
          htmlFor: {$: '%/funcs/getFFieldProperty', args: ['id'], update: 'build'}
        },
      },
      Body: {
        _$widget: '%/widgets/Generic',
        $cx: '%/$cx',
        className: 'body',
      },
      Main: {
        $cx: '%/$cx',
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
      }
    },
    nBase: {
      $_ref: '%/presets/base',
      Main: {
        _$widget: '%/widgets/BaseInput',
        $reactRef: 'getRef',
        onChange: '%/on/changeBase',
        onBlur: '%/on/blurBase',
        onFocus: '%/on/focusBase',
        $propsMap: {
          // priority: '@/status/priority',
          value: '@/value',
          autofocus: '@/params/autofocus',
          placeholder: '@/params/placeholder',
          required: '@/fData/required',
          label: '@/fData/title',
          readonly: '@/params/readonly',
          disabled: '@/params/disabled',
        }
      },
    },
    string: {
      $_ref: '%/presets/nBase',
      Main: {
        type: 'text',
        //onChange: '%/on/changeString'
      }
    },
    integer: {
      $_ref: '%/presets/nBase',
      Main: {
        type: 'number',
        onChange: '%/on/changeInteger'
      }
    },
    number: {
      $_ref: '%/presets/nBase',
      Main: {
        type: 'number',
        step: 'any',
        onChange: '%/on/changeNumber'
      }
    },
    range: {$_ref: '%/presets/nBase', Main: {type: 'range'}},
    'null': {$_ref: '%/presets/nBase', Main: {type: 'hidden'}},
    hidden: {
      Builder: {
        className: {hidden: true},
        $propsMap: {'className/hidden': false}
      }
    },
    boolean: {
      $_ref: '%/presets/nBase',
      Main: {
        _$widget: '%/widgets/CheckboxInput',
        type: 'checkbox',
        onChange: '%/on/changeBoolean'
      },
      Title: false,
    },
    tristate: {
      $_ref: '%/presets/nBase',
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
        uniqKey: 'params/uniqKey',
        $cx: '%/$cx',
        LayoutDefaultClass: 'layout',
        LayoutDefaultWidget: 'div',
        $propsMap: {
          isArray: ['%/funcs/equal', 'array', '@/fData/type'],
          arrayStart: {$: '%/funcs/getArrayStart', args: [], update: 'build'},
          FFormApi: {$: '%/funcs/getFFieldProperty', args: 'props/pFForm/api', update: 'build'},
          $layout: {$: '%/funcs/getFFieldProperty', args: 'ff_layout', update: 'build'},
          $branch: {$: '%/funcs/getFFieldProperty', args: 'state/branch', update: 'every'},
        }
      },
      Title: {
        useTag: 'legend',
        children: ['',
          {$_ref: '%/pars/ArrayAddButton'},
          {$_ref: '%/pars/ArrayDelButton'},
          {children: '(array is empty)'}],
        $propsMap: {
          'className/required': '@/fData/required',
          'children/1,2/className/hidden': ['%/funcs/notEqual', 'array', '@/fData/type'],
          'children/3/className/hidden': ['%/funcs/notEqual', 0, '@/length'],
        },
      },
      Wrapper: {useTag: 'fieldset'},
    },
    array: '%/presets/object',
    inlineTitle: {
      Wrapper: {
        style: {flexFlow: 'row'},
      }
    },
    select: {$_ref: '%/presets/nBase', Main: {type: 'select', onChange: onSelectChange}},
    multiselect: {$_ref: '%/presets/select', Main: {multiply: true}},
    arrayOf: {
      $_ref: '%/presets/nBase',
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
      Wrapper: {style: {flexGrow: 0}},
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
    equal: function (a: any, b: any) {return a === b},
    notEqual: function (a: any, b: any) {return a !== b},
    getArrayStart: function () {return arrayStart(this.schemaPart)},
    getFFieldProperty: function (key: string) {return getIn(this, normalizePath(key))},
  },
  on: {
    clickArrayAdd: function (path: any, value: number) {this.api.arrayAdd(path, value)},
    clickArrayItemOps: function (path: any, key: string) {this.api.arrayItemOps(path, key)},
    changeBase: function (event: any) {this.api.setValue(event.target.value, {})},
    // changeString: function (event: any) {this.api.setValue(event.target.value, {})},
    changeInteger: function (event: any) {this.api.setValue(event.target.value == '' ? undefined : parseInt(event.target.value), {})},
    changeNumber: function (event: any) {this.api.setValue(event.target.value == '' ? undefined : parseFloat(event.target.value), {})},
    changeBoolean: function (event: any) {this.api.setValue(event.target.checked, {})},
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
      $cx: 'cx',
      useTag: 'button',
      type: 'button',
    },
    ArrayAddButton: {
      $_ref: '%/parts/Button',
      children: ['+'],
      onClick: '%/funcs/on/clickArrayAdd',
      'onClick.bind': ['./', 1]
    },
    ArrayDelButton: {
      $_ref: '%/parts/Button',
      children: ['-'],
      onClick: '%/funcs/on/clickArrayAdd',
      'onClick.bind': ['./', -1]
    },
    ArrayItemMenu: {
      _$widget: '%/widgets/ItemMenu',
      buttons: ['first', 'last', 'up', 'down', 'del'],
      onClick: '%/funcs/on/clickArrayItemOps',
      'onClick.bind': ['./'],
      buttonProps: {
        first: {disabledCheck: 'canUp'},
        last: {disabledCheck: 'canDown'},
        up: {disabledCheck: 'canUp'},
        down: {disabledCheck: 'canDown'},
        del: {disabledCheck: 'canDel'},
        // $propsMap: {
        //   'canUp,first/disabled': ['%/funcs/not', '@/arrayItem/canUp'],
        //   'canDown,last/disabled': ['%/funcs/not', '@/arrayItem/canDown'],
        //   'canDel/disabled': ['%/funcs/not', '@/arrayItem/canDel'],
        // }
      },
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

export {extractMaps, normalizeMaps, updateProps}
//module.exports = process.env.NODE_ENV === 'test' ? merge(module.exports, {}) : module.exports;

