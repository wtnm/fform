import * as React from 'react';
import {Component, PureComponent} from 'react';
import {asNumber, setIn, getIn, isArray, isEqual, isObject, isMergeable, isString, isUndefined, makeSlice, merge, mergeState, objKeys, push2array, memoize} from "./commonLib";
import {
  arrayStart,
  getBindedValue,
  getSchemaPart,
  isSchemaSelfManaged,
  path2string,
  string2path,
  SymData,
  SymDelete,
  stateUpdates,
  normalizePath,
  objMap,
  setUPDATABLE,
  mergeStatePROCEDURE
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
  private _enumOptions: any;
  private _isNotSelfManaged: boolean | undefined;
  private _blocks: string[] = [];
  private _widgets: object;
  private _ff_components: object;
  private _schemaProps: object;
  private _maps: object;
  private _maps$: object;

  ff_layout: FFLayoutGeneric<jsFFCustomizeType>;
  refs: any = {};
  liveValidate: boolean;
  schemaPart: jsJsonSchema;

  path: any;
  api: any;
  pFForm: any;

  constructor(props: any, context: any) {
    super(props, context);
    const self = this;
    Object.defineProperty(self, "path", {get: () => self.props.getPath()});
    Object.defineProperty(self, "pFForm", {get: () => self.props.pFForm});
    self._apiWrapper();
    const branch = self.api.get(self.path);
    self.state = {branch};
    self._build();
    self._setDataProps(branch[SymData]);
    self._selfBind = self._selfBind.bind(self);
    self._setRef = self._setRef.bind(self)
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
        self._setDataProps(data);
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

  _selfBind(fncs: any) {
    if (typeof fncs == 'function') return fncs.bind(this);
    if (fncs === true) return this;
    return objMap(fncs, this._selfBind);
  }

  _setRef(block: string) {
    const self = this;
    return (v: any) => self.refs[block] = v
  }

  _extract$($propsMap: any) {
    const result = {};
    objKeys($propsMap).forEach(key => key[0] == '$' && (result[key] = $propsMap[key]));
    return result
  }

  _build() {
    // const isMultiSelect = (schema: any) => isArray(schema.items && schema.items.enum) && schema.uniqueItems;
    // const isFilesArray = (schema: any) => schema.items && schema.items.type === "string" && schema.items.format === "data-url";
    // const getPresetName = (schemaPart: any, type: string = 'null') => type == 'array' ? (isMultiSelect(schemaPart) ? 'multiselect' : isFilesArray(schemaPart) ? 'files' : 'array') : type;
    // const getWidget = (objects: any, widget: any) => typeof widget === 'string' ? objects._widgets && objects._widgets[widget] || widget : widget;
    const getEnumOptions = (schemaPart: jsJsonSchema) => {
      if (!schemaPart.enum) return undefined;
      let result: any[] = [], vals: any[] = schemaPart.enum, names: any[] = schemaPart.enumNames || [];
      vals.forEach((value, i) => result[i] = {value, label: names[i] || value});
      return result;
    };

    const self = this;
    const schemaPart: jsJsonSchema = self.api.getSchemaPart(self.path);
    const funcs: any = {};

    self.schemaPart = schemaPart;

    self._isNotSelfManaged = !isSchemaSelfManaged(schemaPart) || undefined;
    const components = resolveComponents(self.api.props.objects, schemaPart.ff_custom, schemaPart.ff_preset);
    self._ff_components = components[SymData] ? merge(components, self._selfBind(components[SymData])) : components;
    const ff_layout = resolveComponents(self.api.props.objects, schemaPart.ff_layout);
    self.ff_layout = ff_layout[SymData] ? merge(ff_layout, self._selfBind(ff_layout[SymData])) : ff_layout;

    self._enumOptions = getEnumOptions(schemaPart);
    self._widgets = {};
    self._schemaProps = {};
    self._maps = {};
    self._blocks = objKeys(components).filter(key => components[key]);
    self._blocks.forEach((block: string) => {
      const {_$widget, $reactRef, $propsMap, ...schemaProps} = components[block];
      self._widgets[block] = _$widget;
      if ($reactRef) schemaProps[isString(schemaProps.$reactRef) ? $reactRef : 'ref'] = self._setRef(block); // $reactRef - prop for react ref-function
      self._maps[block] = $propsMap; // props that should be mapped from state[SymData]
      self._maps$[block] = self._extract$($propsMap);
      self._schemaProps[block] = schemaProps;  // properties, without reserved names      
    });
    self._setArrayBlocks(self.state.branch[SymData]);
    self._setDataProps(self.state.branch[SymData]);
    self._rebuild = false;
  }

  _setArrayBlocks(data: any) {
    const self = this;
    let _widgets = self._widgets;
    _widgets = merge(_widgets, {Array: data.fData.type == 'array' ? getIn(self._ff_components, 'Array', '_$widget') : false});
    _widgets = merge(_widgets, {ArrayItem: data.ArrayItem ? getIn(self._ff_components, 'ArrayItem', '_$widget') : false});
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


  _setDataProps(data: any, fullUpdate = true) {
    const self = this;
    const newUpdates = {update: {}, replace: {}};
    const maps = fullUpdate ? self._maps : self._maps$;
    self._blocks.forEach((block: string) => {
      const {update: u, replace: r} = mapProps(maps[block], data);
      setUPDATABLE(newUpdates, u, r, block);
    });
    const upd: any = {};
    let updateComponent = false;
    upd._mappedData = mergeStatePROCEDURE(self._mappedData, newUpdates);
    upd._liveValidate = data.params && data.params.liveValidate;
    upd._enumOptions = self._enumOptions || data.enum;
    objKeys(upd).forEach(key => {
      if (self[key] !== upd[key]) {
        self[key] = upd[key];
        updateComponent = true;
      }
    });
    return updateComponent;
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
    updateComponent = self._setDataProps(nextState.branch[SymData], nextData !== currentData) || updateComponent;

    return updateComponent
  }

  render() {
    const self = this;
    if (self._rebuild) this._build();
    const BuilderWidget = self._widgets['Builder'];
    return <BuilderWidget {...self._schemaProps['Builder']} {...self._mappedData['Builder']} mappedData={self._mappedData}/>
  }
}

//enumOptions={self._enumOptions}

/////////////////////////////////////////////
//  Section class
/////////////////////////////////////////////
class FSectionObject extends PureComponent<any, any> { // need to be class, as we use it's forceUpdate() method
  render() {
    const {widget: Widget = 'div', getDataProps, count, ...rest} = this.props;
    const dataMaped = getDataProps()[count] || {};
    return <Widget {...rest} {...dataMaped}/>
  }
}

class FSection extends Component<any, any> {
  private _arrayStartIndex: number = 0;
  private _rebuild = true;
  private _focusField: string = '';
  private _arrayKey2field: { [key: string]: number };
  private _fields: { [key: string]: any };
  private _widgets: { [key: string]: any };
  private _objectLayouts: any[] = [];
  private _arrayLayouts: any[] = [];
  private _setWidRef: any;
  private _setFieldRef: any;
  private _keyField: string;
  private _dataMaps: { [key: string]: any };
  private _dataProps: { [key: string]: any };
  isArray: boolean = false;
  getDataProps: any;

  constructor(props: any, context: any) {
    super(props, context);
    const self = this;
    self._setFieldRef = (field: number | string) => (item: any) => self._fields[field] = item;
    self._setWidRef = (key: number | string) => (item: any) => self._widgets[key] = item;
    self.getDataProps = () => self._dataProps;
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

  // rebuild(path: Path) {
  //   const self = this;
  //   if (!path.length) {
  //     self._reset();
  //     self.forceUpdate()
  //   } else {
  //     let field = path[0];
  //     path = path.slice(1);
  //     if (self.$fields[field] && self.$fields[field].rebuild) self.$fields[field].rebuild(path);
  //   }
  // }

  _build(props: any) {
    // function bindMetods(restField: any, track: Path = []) {
    //   let result = {...restField};
    //   chains.methods2chain.forEach((methodName: string) => {
    //     if (typeof result[methodName] == 'function') result[methodName] = result[methodName].bind($FField)
    //   });
    //   objKeys(result).forEach(key => isObject(result[key]) && (result[key] = bindMetods(result[key], track.concat(key))));
    //   return result
    // }

    function makeLayouts_INNER_PROCEDURE(keys_UPDATABLE: string[], fields: Array<string | FFLayoutGeneric<jsFFCustomizeType>>) {
      const layout: any[] = [];
      fields.forEach(fieldName => {
        if (typeof fieldName == 'string') { // if field is string then make SectionField
          let idx = keys_UPDATABLE.indexOf(fieldName);
          if (~idx) {
            layout.push(self._makeFField(fieldName));
            keys_UPDATABLE.splice(idx, 1);
          }
        } else if (isObject(fieldName)) { // if field is object, then do makeLayouts if prop "$fields" is passed
          let {$fields, $propsMap, ...rest} = fieldName as FFLayoutGeneric<jsFFCustomizeType>;
          let savedCountValue = count; // save count value as it may change in following makeLayouts calls
          count++;
          //rest = bindMetods(rest);  // binds onFunctis to field
          // restField = replaceWidgetNamesWithFunctions(restField, $FField.pFForm.props.objects); // replace widget name (that passed as string value) with functions
          let opts = {};
          //if ($pFField) opts[$pFField === true ? '$pFField' : $pFField] = $FField; // pass FField to widget. If true name 'options' is used, if string, then string value is used
          if ($fields) {  // if $fields exists then this is group section and we should map groupPropsMap, pass schemaProps['Layouts'] and use GroupWidget as default if no widget is supplied
            //if ($propsMap) self._dataMaps[savedCountValue] = merge($propsMap || {}, LayoutsPropsMap || {}); // merge $propsMap and LayoutsPropsMap, to pass them every time props changed
            Object.assign(opts, schemaProps['Layouts']);
            //if (!rest.widget) opts['widget'] = LayoutsWidget
          } else if ($propsMap) self._dataMaps[savedCountValue] = $propsMap;
          layout.push(<FSectionObject {...opts} count={savedCountValue} getDataProps={self.getDataProps} ref={self._setWidRef(savedCountValue)}
                                      key={'widget_' + savedCountValue} {...rest} >{$fields && makeLayouts_INNER_PROCEDURE(keys_UPDATABLE, $fields)}</FSectionObject>);
        }
      });
      return layout
    }

    const self = this;
    const {$FField, $branch} = props;
    const {schemaProps, schemaPart} = $FField;

    if (!schemaPart) return;
    if (isSchemaSelfManaged(schemaPart)) return;

    //const LayoutsWidget = widgets['Layouts'] || 'div';
    //const LayoutsPropsMap = $FField.presetProps['Layouts'].$propsMap;
    const {properties = {}}: { [key: string]: any } = schemaPart;
    // const {groups = []} = x;

    self._keyField = schemaPart.ff_props && schemaPart.ff_props.keyField || '/uniqId';
    if (self._keyField[0] !== '/') self._keyField = './' + self._keyField;
    self.isArray = schemaPart.type == 'array';
    self._dataMaps = {};
    self._dataProps = {};
    self._fields = {};
    self._widgets = {};

    self._dataMaps[0];
    let count = 1; // 0 reserved for base layout

    if (self.isArray) {
      self._arrayStartIndex = arrayStart(schemaPart) || 0;
      if (!props._focusField) self._focusField = '0';
    }

    let objectKeys: string[] = self._getObjectKeys($branch, self.props);
    if (!self._focusField) self._focusField = props._focusField || objectKeys[0] || '';

    self._objectLayouts = makeLayouts_INNER_PROCEDURE(objectKeys, schemaPart.ff_layout || []);  // we get inital _objectLayouts and every key, that was used in makeLayouts call removed from keys 
    objectKeys.forEach(fieldName => self._objectLayouts.push(self._makeFField(fieldName)));  // so here we have only keys was not used and we add them to _objectLayouts
    objKeys(self._dataMaps).forEach((key: string) => self._dataProps[key] = mapProps(self._dataMaps[key], $branch[SymData]));

    self._makeArrayItems(self.props);

    self._rebuild = false;
  }

  _makeArrayItems(props: any) {
    const self = this;
    const $FField = props.$FField;
    self._arrayLayouts = [];
    self._arrayKey2field = {};
    if (self.isArray)
      for (let i = self._arrayStartIndex; i < props.length; i++) {
        let arrayKey = self._arrayIndex2key(self.props.stateBranch[i]);
        self._arrayLayouts.push(self._makeFField(i.toString(), arrayKey));
        self._arrayKey2field[arrayKey] = i;
      }
    return self._arrayLayouts.length
  }

  _reset() {
    const self = this;
    self.isArray = false;
    self._objectLayouts = [];
    self._focusField = '';
    self._rebuild = true;
  }

  _makeFField(fieldName: string, arrayKey?: string) {
    const self = this;
    return <FField ref={self._setFieldRef(arrayKey || fieldName)} key={arrayKey || fieldName} pFForm={self.props.$FField.pFForm} FFormApi={self.props.FFormApi}
                   getPath={arrayKey ? self._getArrayPath.bind(self, arrayKey) : self._getObjectPath.bind(self, fieldName)}/>;
  }

  _arrayIndex2key(stateBranch: any) {
    return getIn(stateBranch[SymData], string2path(this._keyField));
  }

  _getObjectKeys(stateBranch: StateType, props: any) {
    const self = this;
    let keys: string[] = [];
    if (self.isArray) for (let i = 0; i < Math.min(self._arrayStartIndex, props.length); i++) keys.push(i.toString());
    else keys = objKeys(stateBranch);
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
    for (let i = self._arrayStartIndex; i < nextBranch[SymData].length; i++) {
      let arrayKey = self._arrayIndex2key(nextBranch[i]);
      if (self._fields[arrayKey]) self._fields[arrayKey].setState({branch: nextBranch[i]});
      let prevIndex = self._arrayKey2field[arrayKey];
      if (self._arrayKey2field[arrayKey] !== i) {
        self._arrayKey2field[arrayKey] = i;
        doUpdate = true
      }
      updArray.push(!isUndefined(prevIndex) ? self._arrayLayouts[prevIndex - self._arrayStartIndex] : self._makeFField(i.toString(), arrayKey));
    }
    if (self._arrayLayouts.length !== updArray.length) doUpdate = true;
    if (doUpdate) self._arrayLayouts = updArray;
    return doUpdate;
  }

  shouldComponentUpdate(nextProps: any) {
    const self = this;
    if (nextProps.FFormProps !== self.props.FFormProps) {
      self._reset();
      return true;
    }

    let prevBranch = self.props.stateBranch;
    let nextBranch = nextProps.stateBranch;

    let doUpdate = false;

    if (prevBranch != nextBranch) {
      if (self.isArray) {
        const prevLength = prevBranch[SymData].length;
        const nextLength = nextBranch[SymData].length;
        if (prevLength != nextLength && (nextLength < self._arrayStartIndex || prevLength < self._arrayStartIndex - 1)) { // need to rebuild, length changed within turple range
          self._reset();
          return true;
        }
        doUpdate = self._reorderArrayLayout(prevBranch, nextBranch); // updates and reorders elements greater/equal than self._arrayStartIndex
      }

      // update object elements or if it isArray update elements that lower than self._arrayStartIndex
      self._getObjectKeys(nextBranch, nextProps).forEach(field => (nextBranch[field] !== prevBranch[field]) && self._fields[field].setState({branch: nextBranch[field]}));

      if (nextBranch[SymData] !== prevBranch[SymData]) {  // update _dataProps
        const dataProps = {};
        objKeys(self._dataMaps).forEach((key: string) => dataProps[key] = mapProps(self._dataMaps[key], nextBranch[SymData]));
        let {state: newDataProps, changes} = mergeState(self._dataProps, dataProps);
        self._dataProps = newDataProps;
        if (changes) objKeys(changes).forEach(key => self._widgets[key] && self._widgets[key]['forceUpdate']());
      }
    }

    return doUpdate || !isEqual(self.props, nextProps, {skipKeys: ['stateBranch']});
  }

  render() {
    const self = this;
    let {funcs, length, enumOptions, $FField, onChange, onFocus, onBlur, stateBranch, FFormProps, $reactRef, focusField, ...rest} = self.props;
    if (self._rebuild) self._build(self.props); // make rebuild here to avoid addComponentAsRefTo Invariant Violation error https://gist.github.com/jimfb/4faa6cbfb1ef476bd105
    return (
      <FSectionObject {...$FField.schemaProps['Layouts']} {...rest} count={0} getDataProps={self.getDataProps} ref={self._setWidRef(0)}
                      key={'widget_0'}>{self._objectLayouts}{self._arrayLayouts}</FSectionObject>)
  }
}


/////////////////////////////////////////////
//  Basic components
/////////////////////////////////////////////

function FBuilder(props: any) {
  const {hidden, mappedData, widgets, schemaProps} = props;
  const {Title, Body, Main, Message, GroupBlocks, ArrayItem, Array, Autosize} = widgets;

  let result = (
    <GroupBlocks {...schemaProps['GroupBlocks']} {...mappedData['GroupBlocks']}>
      <Title {...schemaProps['Title']} {...mappedData['Title']}/>
      <Body {...schemaProps['Body']} {...mappedData['Body']}>
      <Main {...schemaProps['Main']} {...mappedData['Main']}/>
      <Message {...schemaProps['Message']} {...mappedData['Message']}/>
      {Autosize ? <Autosize {...schemaProps['Autosize']} {...mappedData['Autosize']}/> : ''}
      </Body>
    </GroupBlocks>
  );
  if (Array) result = <Array {...schemaProps['Array']} {...mappedData['Array']}>{result}</Array>;
  if (ArrayItem) result = <ArrayItem {...schemaProps['ArrayItem']} {...mappedData['ArrayItem']}>{result}</ArrayItem>;
  return result;
}


function Unsupported(props: any) {return <div>Unsupported</div>}


function ArrayBlock(props: any) {
  const {useTag: UseTag = 'div', empty, AddButton, length, canAdd, children, cx, className, ...rest} = props;
  const {_$widget: Empty = 'div', ...emptyRest} = empty;
  const {_$widget: AddButtonW = 'button', onClick, ...addButtonRest} = AddButton;
  if (length) return (<UseTag className={cx && cx(className)} {...rest}>{children}{canAdd ? <AddButtonW onClick={onClick} {...addButtonRest} /> : ''}</UseTag>);
  else return (<UseTag className={cx && cx(className)} {...rest}><Empty {...emptyRest}>{canAdd ? <AddButtonW onClick={onClick} {...addButtonRest} /> : ''}</Empty></UseTag>);
}


function GenericBlock(props: any) {
  const {useTag: UseTag = 'div', children, cx, className, ...rest} = props;
  //if (hidden) rest.style = merge(rest.style || {}, hiddenStyle ? hiddenStyle : {display: 'none'});// merge(rest.style || {}, {display: 'none'});
  return (<UseTag className={cx && cx(className)} {...rest}>{children}</UseTag>)
}


class AutosizeBlock extends PureComponent<any, any> {
  static readonly _sizerStyle: { position: 'absolute', top: 0, left: 0, visibility: 'hidden', height: 0, overflow: 'scroll', whiteSpace: 'pre' };
  private _elem: any;

  componentDidMount() {
    const style = window && window.getComputedStyle(this.props.$FField.refs);
    if (!style || !this._elem) return;
    ['fontSize', 'fontFamily', 'fontWeight', 'fontStyle', 'letterSpacing'].forEach(key => this._elem.style[key] = style[key]);
  }

  render() {
    const self = this;
    const props = self.props;
    const value = (isUndefined(props.value) ? '' : props.value.toString()) || props.placeholder || '';
    return (<div style={AutosizeBlock._sizerStyle as any} ref={(elem) => {
      (self._elem = elem) && (props.$FField.refs.style.width = ((elem as any).scrollWidth + (props.addWidth || 45)) + 'px')
    }}>{value}</div>)
  }
}


function TitleBlock(props: any) {
  const {id, title = '', required, useTag: UseTag = 'label', requireSymbol = '*', cx, className, ...rest} = props;
  return (
    <UseTag {...(UseTag == 'label' && id ? {htmlFor: id} : {})} className={cx && cx(className)} {...rest}>
      {isString(title) && required ? title + requireSymbol : title}
    </UseTag>
  );
}


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
    cx,
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
  else return (<UseTag className={cx && cx(className, getIn(_PRIORITYClassNames, priority))} {...rest} {...refObj} {...valueObj} type={type} {...commonProps}/>);
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

function MessageBlock(props: any) {
  const {useTag: UseTag = 'div', MessageItem, messages = {}, untouched, ...rest} = props;
  const {widget: MessageItemW, ...restMessageItem} = MessageItem;
  let keys = objKeys(messages);
  const result: any[] = [];
  keys.sort((a, b) => parseFloat(a) - parseFloat(b));
  keys.forEach((key) => result.push(key == '0' && untouched ? null : <MessageItemW key={key} {...messages[key]} {...restMessageItem} />));
  return <UseTag {...rest}>{result}</UseTag>;
}


function MessageItem(props: any) {
  const {useTag: UseTag = 'div', skip, textGroups, priority, className, cx, ...rest} = props;
  const texts: any[] = [];
  objKeys(textGroups).forEach((groupKey: string) => push2array(texts, textGroups[groupKey]));
  if (skip || !texts.length) return null;
  return <UseTag className={cx && cx(className, _PRIORITYClassNames[priority || 0])} {...rest}>{texts.join('<br/>')}</UseTag>
}


function EmptyArray(props: any) {
  const {useTag: UseTag = 'div', text = 'This array is empty.', ...rest} = props;
  return <UseTag {...rest}>{text} {props.children}</UseTag>;
}

function ButtonWidget(props: any) {
  const {useTag: UseTag = 'button', text = '', type = 'button', ...rest} = props;
  return ((text as any) === false) ? false : <UseTag type={type} {...rest}>{text}</UseTag>;
}

function ItemMenu(props: any) {
  const {useTag: UseTag = 'div', buttonProps = {}, buttons, arrayItem, ...rest}: { [key: string]: any } = props;
  if (!arrayItem) return false;
  const {canUp, canDown, canDel} = arrayItem;
  // const {path, pFForm} = $FField;
  let {useTag: UseButtonTag = 'button', type = 'button', onClick, titles, ...restButton} = buttonProps;
  const canChecks = {'first': canUp, 'last': canDown, 'up': canUp, 'down': canDown, 'del': canDel};
  buttons.forEach((key: string) => delete rest[key]);
  return (
    <UseTag {...rest}>
      {buttons.map((key: string) => {
        let KeyWidget = props[key];
        if (KeyWidget === false || isUndefined(canChecks[key])) return '';
        return (
          <UseButtonTag key={key} type={type} title={titles && titles[key] ? titles[key] : key} data-bType={key} disabled={!canChecks[key]} {...restButton} onClick={() => onClick(key)}>
            {typeof KeyWidget === 'function' ? <KeyWidget/> : KeyWidget || key}
          </UseButtonTag>
        )
      })}
    </UseTag>);
}

function ArrayItem(props: any) {
  if (!props.arrayItem) return React.Children.only(props.children);
  let {useTag: ItemW = 'div', children, cx, className, ItemMenu, ItemBody, ...rest} = props;
  //const {_$widget: ItemW = 'div', className: itemCN = {}, ...itemRest} = ItemMain || {};
  const {_$widget: ItemBodyW = 'div', className: ItemBodyCN = {}, ...itemBodyRest} = ItemBody || {};
  const {_$widget: ItemMenuW = 'div', className: ItemMenuCN = {}, ...itemMenuRest} = ItemMenu || {};
  return (
    <ItemW className={cx && cx(className)} {...rest}>
      <ItemBodyW className={cx && cx(ItemBodyCN)} {...itemBodyRest}>
        {React.Children.only(children)}
      </ItemBodyW>
      <ItemMenuW className={cx && cx(ItemMenuCN)} {...itemMenuRest} />
    </ItemW>
  )
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

function mapProps(map: FFDataMapGeneric<MapFunctionType>, data: FFieldDataType) {
  const result = {update: {}, replace: {}};
  if (!map) return result;
  objKeys(map).filter(key => map[key]).forEach((to) => {
    let item: any = map[to];
    if (!isArray(item)) item = [item];
    const value = item[0][0] == '$' ? item[1]() : item[1] && item[1](getIn(data, normalizePath(item[0]))) || getIn(data, normalizePath(item[0]));
    setUPDATABLE(result, value, true, normalizePath(to));
  });
  return result;
}

// function replaceWidgetNamesWithFunctions(presetArrays: any, objects: any) {
//   let tmp = presetArrays;
//   if (!isArray(tmp)) tmp = [tmp];
//   for (let i = 0; i < tmp.length; i++) {
//     let presetArray = tmp[i];
//     let widget = presetArray.widget;
//     if (widget) presetArray.widget = typeof widget === 'string' ? objects.widgets && objects.widgets[widget] || widget : widget;
//     objKeys(presetArray).forEach(key => isObject(presetArray[key]) && (presetArray[key] = replaceWidgetNamesWithFunctions(presetArray[key], objects)))
//   }
//   return presetArrays
// }
// function getFieldBlocks(presetsString: string | string[], objects: any = {}, schemaPart: any = {}, initalFuncsObject: any = {}, object2bind: any = {}) {
//
//   function chainMethods(result: any, initalFuncs: any, track: string[] = []) {// initalFuncs is function than should allways at the begginig of chain (the last in execution order)
//     methods2chain.forEach((methodName: string) => {
//       let methods = getArrayOfPropsFromArrayOfObjects(presetArray, track.concat(methodName));
//       let methods_rev = getArrayOfPropsFromArrayOfObjects(presetArray, track.concat('$' + methodName)); // methotds that begins with '$' will be chained in reverse order
//       let prevMethod = initalFuncs && initalFuncs[methodName];
//       if (prevMethod) push2array(methods_rev, prevMethod);
//       // console.log('methods 1:',methods);
//       methods_rev.reverse();
//       methods = methods_rev.concat(methods);
//       // console.log('methods 2:',methods);
//       let chainWidgets = getArrayOfPropsFromArrayOfObjects(presetArray, track.concat('widget'));
//       if (chainWidgets.length) chains = merge(chains, makeSlice('widgets', track, chainWidgets));
//       if (methods.length) chains = merge(chains, makeSlice('funcs', track, methodName, methods.slice()));
//       if (!methods.length) return;
//       for (let i = prevMethod ? 1 : 0; i < methods.length; i++) {
//         let bindObj = {...object2bind};
//         if (prevMethod) bindObj[methodName] = prevMethod;
//         methods[i] = methods[i].bind(bindObj);
//         prevMethod = methods[i]
//       }
//       result = merge(result, makeSlice(methodName, methods.pop()));
//       result = merge(result, makeSlice('$' + methodName, SymDelete), {del: true});
//     });
//     objKeys(result).forEach(key => {
//       if (key[0] !== '_' && isObject(result[key])) { // skip keys that begins with '_'
//         let keyRes: any = chainMethods(result[key], initalFuncs && initalFuncs[key], track.concat(key));
//         result = merge(result, makeSlice(key, keyRes))
//       }
//     });
//     return result;
//   }
//
//   let presets = objects['presets'] || {};
//   let methods2chain = objKeys(objects.methods2chain).filter(key => objects.methods2chain[key]); //get methods than should be chained as array of strings
//   let chains = {methods2chain};
//   let presetArray: any = [];  // here we will push all presets than should be merged in one
//   let presetNames = isArray(presetsString) ? presetsString : presetsString.split(':');
//   presetNames.reverse();
//   presetNames.forEach(presetName => {
//     while (true) {
//       let preset = getIn(presetName[0] == '#' ? schemaPart.ff_custom : presets, string2path(presetName)); // if preset name begins with '#', like '#smthng' look for it in x['custom'], not in presets
//       if (preset) {
//         presetArray.push(preset);
//         if (!preset['_']) break;  // '_' - is parent for this preset
//         presetName = preset['_'];
//       } else break;
//     }
//   });
//   if (presets['*']) presetArray.push(presets['*']); // this will be first after reverse
//   presetArray.reverse();  // reverse to get proper order
//   if (schemaPart.ff_custom) presetArray.push(schemaPart.ff_custom); // and this is last, x['custom'] overwrite all
//   presetArray.push({'_': undefined}); // remove '_' key as we don't want it to be in 'result'
//   presetArray = replaceWidgetNamesWithFunctions(presetArray, objects);  // Now if we have props with key 'widget' wich value is not function, replace it from objects['widget']
//   let result = merge.all({}, presetArray, {del: true});
//   result = chainMethods(result, initalFuncsObject); // merge in one object, remove undefined values, and make chains for methods that listed in objects.methods2chain with true value
//   return {result, chains, presetArray};
// }
//
// function getArrayOfPropsFromArrayOfObjects(arr: any, propPath: string | Path) {
//   propPath = normalizePath(propPath);
//   for (let i = (propPath[0] == '#' ? 1 : 0); i < propPath.length; i++) {
//     arr = arr.filter((item: any) => item.hasOwnProperty(propPath[i])).map((item: any) => item[propPath[i]]);
//     if (!arr.length) break;
//   }
//   return arr
// }

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
    Builder: FBuilder,
    Array: ArrayBlock,
    ArrayItem: ArrayItem,
    EmptyArray: EmptyArray,
    Button: ButtonWidget,
    ItemMenu: ItemMenu,
    Title: TitleBlock,
    Messages: MessageBlock,
    MessageItem: MessageItem,
    BaseInput: BaseInput,
    CheckboxInput: CheckboxInput,
    ArrayInput: ArrayInput,
    GenericBlock: GenericBlock,
    TristateBox: TristateBox,
    Section: FSection,
    Autosize: AutosizeBlock,
  },
  presets: {
    'base': {
      //_blocks: {'Builder': true, 'Title': true, 'Body': true, 'Main': true, 'Message': true, 'GroupBlocks': true, 'ArrayItem': true, 'Autosize': false},
      // childrenBlocks: {},

      Array: {
        _$widget: '%/widgets/Array',
        empty: {_$widget: '%/widgets/EmptyArray'},
        AddButton: {
          _$widget: '%/widgets/Button',
          text: 'Add new item',
          onClick: '%/funcs/ArrayAddClick'
        },
        $propsMap: {
          length: 'length',
          canAdd: 'fData/canAdd',
          hidden: ['params/hidden', '%/funcs/hidden4Array'],
          //$FField: ['$FField', '%/funcs/getFField'],
        },
      },
      ArrayItem: {
        _$widget: '%/widgets/ArrayItem',
        ItemMenu: {
          _$widget: '%/widgets/ItemMenu',
          buttons: ['first', 'last', 'up', 'down', 'del'],
          buttonProps: {onClick: '%/funcs/ArrayItemButtonClick'}
        },
        $propsMap: {
          arrayItem: 'arrayItem',
          hidden: 'params/hidden',
          // $FField: ['$FField', '%/funcs/getFField'],
        },
        cx: '%/cx'
      },
      Builder: {
        _$widget: '%/widgets/Builder',
        $propsMap: {
          hidden: ['params/hidden', '%/funcs/hidden4Builder'],
          $widgets: ['widgets', '%/funcs/getWidgets'],
          $schemaProps: ['schemaProps', '%/funcs/getSchemaProps'],
        },
      },
      GroupBlocks: {
        _$widget: '%/widgets/GenericBlock',
        className: 'fform-layout-block',
      },
      Body: {
        _$widget: '%/widgets/GenericBlock',
        className: 'fform-body-block',
      },
      Title: {
        _$widget: '%/widgets/Title',
        useTag: 'label',
        requireSymbol: '*',
        $propsMap: {
          required: 'fData/required',
          title: 'fData/title',
        },
      },
      Message: {
        _$widget: '%/widgets/Messages',
        $propsMap: {
          messages: 'messages',
          untouched: 'status/untouched',
        },
        MessageItem: {
          _$widget: '%/widgets/MessageItem',
        },
      },
      Main: {
        _$widget: '%/widgets/BaseInput',
        $reactRef: 'getRef',
        $propsMap: {
          priority: 'status/priority',
          value: 'value',
          autoFocus: 'params/autofocus',
          placeholder: 'params/placeholder',
          required: 'fData/required',
          title: 'fData/title',
          readOnly: 'params/readonly',
          disabled: 'params/disabled',
        },
        onChange: function (event: any) {this.api.setValue(event.target.value, {})},
        onBlur: function (value: any) {
          const self = this;
          self.api.set('./', 0, {[SymData]: ['status', 'untouched'], noValidation: true});
          self.api.set('/@/active', undefined, {noValidation: true});
          return !self.liveValidate ? self.api.validate() : null;
        },
        onFocus: function (value: any) {this.api.set('/@/active', this.path, {noValidation: true})}
      }
    },
    string: {
      $_ref: '%/presets/base', Main: {
        type: 'text',
        onChange: function (event: any) {this.api.setValue(event.target.value, {})}
      }
    },
    integer: {
      $_ref: '%/presets/base',
      Main: {
        type: 'number',
        onChange: function (event: any) {this.setValue(event.target.value == '' ? undefined : parseInt(event.target.value))}
      }
    },
    number: {
      $_ref: '%/presets/base',
      Main: {
        type: 'number',
        step: 'any',
        onChange: function (event: any) {this.setValue(event.target.value == '' ? undefined : parseFloat(event.target.value))}
      }
    },
    range: {$_ref: '%/presets/base', Main: {type: 'range'}},
    'null': {$_ref: '%/presets/base', Main: {type: 'hidden'}},
    hidden: {
      $_ref: '%/presets/base',
      Builder: {
        hidden: true,
        $propsMap: {hidden: false}
      }
    },
    booleanBase: {
      $_ref: '%/presets/base',
      Main: {
        type: 'checkbox',
        onChange: function (event: any) {this.onChange(event.target.checked)}
      }
    },
    boolean: {
      $_ref: '%/presets/booleanBase',
      Main: {
        _$widget: '%/widgets/CheckboxInput',
      },
      Title: {emptyTitle: true},
    },
    tristateBase: {
      $_ref: '%/presets/base',
      Main: {
        type: 'tristate',
        useTag: '%/widgets/TristateBox'
      }
    },
    tristate: {
      $_ref: '%/presets/tristateBase',
      Main: {
        _$widget: '%/widgets/CheckboxInput',
      },
      Title: {emptyTitle: true},
    },
    object: {
      $_ref: '%/presets/base',
      Main: {
        _$widget: '%/widgets/Section',
        $reactRef: true,
        $propsMap: {
          value: false,
          autoFocus: false,
          placeholder: false,
          required: false,
          title: false,
          readOnly: false,
          disabled: false,
          $FField: ['$FField', '%/funcs/getFField'],
          $FFormApi: ['$FField', '%/funcs/getFFormApi'],
          $branch: ['$branch', '%/funcs/getBranch'],
        }
      },
      GroupBlocks: {useTag: 'fieldset'},
      Title: {useTag: 'legend'},
    },
    array: {
      $_ref: '%/presets/object',
      //_blocks: {'Array': true},
      //Main: {$propsMap: {length: 'length'}},
      //GroupBlocks: {useTag: 'fieldset'},
      //Title: {useTag: 'legend'},
    },
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
    checkboxes: {$_ref: '%/presets/arrayOf', Main: {type: 'checkbox'}, 'Layouts': false, 'Array': false},

    inlineItems: {Main: {stackedProps: false}},
    buttons: {Main: {inputProps: {className: 'button'}, labelProps: {className: 'button'}}},
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
    getFField: function () {return this},
    getEnum: function () {return this._enumOptions},
    getBranch: function () {return this.state.branch},
    getFFormApi: function () {return this.props.pFForm.api},
    getWidgets: function () {return this._widgets},
    getSchemaProps: function () {return this._schemaProps},
    hidden4Array: function (hidden: boolean) {return !this._widgets['ArrayItem'] && hidden},
    hidden4Builder: function (hidden: boolean) {return !this._widgets['Array'] && !this._widgets['ArrayItem'] && hidden},
    ArrayItemButtonClick: function (key: string) {this.api.arrayItemOps('./', key)},
    ArrayAddClick: function () {this.api.arrayAdd('./', 1)}
  },
  parts: {
    Autosize: {
      _$widget: '%/widgets/Autosize',
      $propsMap: {
        value: 'value',
        placeholder: 'params/placeholder',
        hidden: 'params/hidden',
        $FField: ['$FField', '%/funcs/getFField'],
      }
    },
    Layouts: {
      _$widget: '%/widgets/GenericBlock',
      className: {'fform-group-block': true},
      cx: '%/cx'
    },
  },
  presetMap: {
    boolean: ['select', 'radio'],
    string: ['select', 'password', 'email', 'hostname', 'ipv4', 'ipv6', 'uri', 'data-url', 'radio', 'textarea', 'hidden', 'date', 'datetime', 'date-time', 'color', 'file'],
    number: ['select', 'updown', 'range', 'radio'],
    integer: ['select', 'updown', 'range', 'radio'],
    array: ['select', 'checkboxes', 'files'],
  },
  cx: require('classnames/bind')
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

//
// const buttonObject = {
//   _$widget: function (props: any) {
//     let {text = 'Submit', ...rest} = props;
//     return <button {...rest}>{text}</button>
//   }
// };


export {selectorMap, fformObjects, FForm, FFormStateAPI, fformCores};

//module.exports = process.env.NODE_ENV === 'test' ? merge(module.exports, {}) : module.exports;

