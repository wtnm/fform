import * as React from 'react';
import {Component, PureComponent} from 'react';
import {asNumber, not, setIn, getIn, isArray, isEqual, isObject, isMergeable, isString, isUndefined, makeSlice, merge, mergeState, objKeys, push2array} from "./commonLib";
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
  relativePath,
} from './stateLib'
import {FFormStateAPI, fformCores} from './api'

const classNames = require('classnames');

function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      derivedCtor.prototype[name] = baseCtor.prototype[name]
    })
  });
}


const _PRIORITYClassNames = {0: 'danger', 1: 'warning', 2: 'success', 3: 'info', 4: 'notice'};


/////////////////////////////////////////////
//  Main class
/////////////////////////////////////////////
class FForm extends Component<any, any> {
  _FFrormProps: any;
  _unsubscribe: any;
  _savedState: any;
  _savedValue: any;
  //_setRef: any;
  //_onSubmit: any;
  api: any;
  //rRefs: any = {};
  _root: any;
  formName: any;
  schema: any;
  // api: any;
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
    self._FFrormProps = {api: self.api, objects: props.objects};
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
    let FFrormPropsUpdate = false;

    if (core instanceof FFormStateAPI && self.api !== core) {
      self._unsubscribe();
      self.api = core;
      self._unsubscribe = self.api.addListener(self._handleStateUpdate.bind(self));
    }

    self._updateValues(nextProps, self.props);
    // self.api.execute();

    if (self._FFrormProps.api != self.api || self._FFrormProps.objects != nextProps.objects) {
      self._FFrormProps = {api: self.api, objects: nextProps.objects};
      FFrormPropsUpdate = true;
    }

    return FFrormPropsUpdate || !isEqual(self.props, nextProps, {skipKeys: ['core', 'state', 'value', 'inital', 'extData', 'fieldCache', 'flatten', 'noValidate', 'parent', 'onSubmit', 'onChange', 'onStateChange']});
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
        <FField ref={self._setRef} pFForm={self} getPath={self._getPath} FFrormProps={self._FFrormProps}/>
      </UseTag>
    )
  }
}


/////////////////////////////////////////////
//  FField class
/////////////////////////////////////////////
class FField extends Component<any, any> {
  private _dataProps: any = {};
  private _builderData: any = {};
  private _rebuild = true;
  private _cached: any;
  private _cachedTimeout: any;
  private _enumOptions: any;
  // private _stateBranch: StateType;
  private _isNotSelfManaged: boolean | undefined;

  //_bindObject: any;
  _blocks: string[] = [];

  liveValidate: boolean;
  presetProps: any;
  mainRef: any;
  funcs: any;
  schemaPart: jsJsonSchema;
  widgets: any;
  schemaProps: any;
  chains: any;

  path: any;
  api: any;
  pFForm: any;

  // pFField: any;


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
    //self._setId();
  }

  focus(path: Path) {
    const self = this;
    self.mainRef && self.mainRef.focus && self.mainRef.focus(path); // path.length ? self.mainRef.focus(path) : self.mainRef.focus();
  }

  // rebuild(path: Path) {
  //   const self = this;
  //   if (!path.length) {
  //     self._forceRebuild = true;
  //     self.forceUpdate()
  //   }
  //   self.mainRef && self.mainRef['rebuild'] && self.mainRef['rebuild'](path);
  // }
  //
  // _setCachedValue(value: any) {
  //   const self = this;
  //   self._cached = {value};
  //   let fieldCache = self.pFForm.props.fieldCache;
  //   if (isUndefined(fieldCache) || fieldCache === true) fieldCache = 40;
  //   if (fieldCache) {
  //     if (self._cachedTimeout) clearTimeout(self._cachedTimeout);
  //     self._cachedTimeout = setTimeout(self._updateCachedValue.bind(self), fieldCache);
  //     const data = merge(self.state.branch[SymData], {value: self._cached.value});
  //     const dataProps = self._dataProps;
  //     self._setDataProps(data);
  //     if (dataProps != self._dataProps) self.forceUpdate();
  //   } else self._updateCachedValue();
  // }

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
        const dataProps = self._dataProps;
        self._setDataProps(data);
        if (dataProps != self._dataProps) self.forceUpdate();
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

  _makePreset(schemaPart: jsJsonSchema) {
    let {ff_preset = ''} = schemaPart;
    if (!ff_preset && !isString(schemaPart.type)) throw new Error('For multi-types ff_preset should be defined');
    if (!ff_preset && isString(schemaPart.type)) ff_preset = schemaPart.type;
    let {$ref = '', ...custom} = schemaPart.ff_custom || {};
    custom.$ref = ff_preset.split(':').map(v => v[0] != '%' && '%/presets/' + v).join(':') + $ref ? ':' + $ref : '';
    return objectResolver(custom, this.pFForm.props.objects)
  }

  _bindFuncs(fncs: any) {
    if (typeof fncs == 'function') return fncs.bind(this);
    if (isMergeable(fncs)) {
      let res = isArray(fncs) ? [] : {};
      objKeys(fncs).forEach(key => res[key] = this._bindFuncs(fncs[key]));
      return res;
    }
  }

  _build() {
    const isMultiSelect = (schema: any) => isArray(schema.items && schema.items.enum) && schema.uniqueItems;
    const isFilesArray = (schema: any) => schema.items && schema.items.type === "string" && schema.items.format === "data-url";
    const getPresetName = (schemaPart: any, type: string = 'null') => type == 'array' ? (isMultiSelect(schemaPart) ? 'multiselect' : isFilesArray(schemaPart) ? 'files' : 'array') : type;
    const getWidget = (objects: any, widget: any) => typeof widget === 'string' ? objects.widgets && objects.widgets[widget] || widget : widget;
    const getEnumOptions = (schemaPart: jsJsonSchema) => {
      if (!schemaPart.enum) return undefined;
      let result: any[] = [], vals: any[] = schemaPart.enum, names: any[] = schemaPart.enumNames || [];
      vals.forEach((value, i) => result[i] = {value, label: names[i] || value});
      return result;
    };

    const self = this;
    const pFForm = self.pFForm;

    //const path = string2path(self.path);
    const schemaPart = self.api.getSchemaPart(self.path);
    const type = isArray(schemaPart.type) ? schemaPart.type[0] : schemaPart.type;
    //const x = schemaPart.x || ({} as FFSchemaExtensionType);
    const objects = pFForm.props.objects;
    const presets = objects.presets;
    const presetName = schemaPart.ff_preset || getPresetName(schemaPart, type);
    const funcs: any = {};

    self.schemaPart = schemaPart;
    self._isNotSelfManaged = !isSchemaSelfManaged(schemaPart) || undefined;

    //funcs.onChange = self._setCachedValue.bind(self);
    // funcs.onBlur = (value: any) => {
    //   self.api.set('./@status/untouched', 0, {noValidation: true});
    //   self.api.set('/@/active', undefined, {noValidation: true});
    //   return !self.liveValidate ? self.api.validate() : null;
    // };
    // funcs.onFocus = (value: any) => self.api.set('/@/active', self.path, {noValidation: true});
    // self.funcs = funcs;
    // self._bindObject = {pFForm, schemaPart, field: self, funcs};
    // Object.defineProperty(self._bindObject, "path", {get: () => self.path});
    //let {result, chains} = getFieldBlocks(presetName, objects, schemaPart, {'Main': funcs}, self._bindObject);
    let result = self._makePreset(schemaPart);
    if (result[SymData]) result = merge(result, self._bindFuncs(result[SymData]));

    //self.chains = chains;
    self.presetProps = result;

    self._enumOptions = getEnumOptions(schemaPart);
    const widgets = {}, schemaProps = {};
    self._blocks = objKeys(result).filter(key => result[key]);
    self._blocks.forEach((block: string) => {
      const {_propsMap, widget, ...rest} = result[block];
      widgets[block] = widget;
      if (rest._refName) rest[rest._refName] = self._setRef.bind(self); // _refName - name for ref-function, so put it if it exists
      schemaProps[block] = rest;  // all properties, except for several reserved names
    });

    // if (self._isNotSelfManaged) {
    //   widgets['Main'] = FSection;
    //   self.presetProps['Main'] = {widget: FSection, ...schemaProps['Main']};
    // }

    self.widgets = widgets;
    self.schemaProps = schemaProps;

    self._rebuild = false;
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

  _setRef(item: any) {
    this.mainRef = item
  }


  _setDataProps(data: any) {
    const self = this;
    const dataProps = {};
    self._blocks.forEach((block: string) => dataProps[block] = mapProps(self.presetProps[block]._propsMap, data, self));
    const upd: any = {};
    let updateComponent = false;
    upd._dataProps = merge(self._dataProps, dataProps, {diff: true});
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
    if (nextProps.FFrormProps != self.props.FFrormProps) {
      self._rebuild = true;
      return true;
    }
    if (nextState.branch[SymData] !== self.state.branch[SymData]) updateComponent = self._setDataProps(nextState.branch[SymData]);
    if (self._isNotSelfManaged && nextState.branch !== self.state.branch) updateComponent = true;

    return updateComponent
  }

  render() {
    const self = this;
    if (self._rebuild) this._build();
    const BuilderWidget = self.widgets['Builder'];
    return <BuilderWidget {...self.schemaProps['Builder']} {...self._dataProps['Builder']} enumOptions={self._enumOptions} pFField={self}
                          dataProps={self._dataProps} stateBranch={self._isNotSelfManaged && self.state.branch} FFormProps={self._isNotSelfManaged && self.props.FFrormProps}/>
  }
}


/////////////////////////////////////////////
//  Section class
/////////////////////////////////////////////
class SectionObject extends PureComponent<any, any> { // need to be class, as we use it's forceUpdate() method
  render() {
    const {widget: Widget = 'div', getDataProps, count, ...rest} = this.props;
    const dataMaped = getDataProps()[count] || {};
    return <Widget {...rest} {...dataMaped}/>
  }
}

// class SectionField extends PureComponent<any, any> { // need to be class, as we use it's forceUpdate() method
//   render() {
//     const {pFForm, path, setRef, fieldName, _keyField} = this.props;
//     return setFField(pFForm, path, setRef, fieldName, _keyField)
//   }
// }
//
// function setFField(pFForm: any, path: string, ref: any, fieldName?: string, _keyField?: string) {
//   let stateBranch = pFForm.api.get(path);
//   if (fieldName) stateBranch = stateBranch[fieldName];
//   return <FField ref={ref} key={_keyField ? getIn(stateBranch, SymData, string2path(_keyField || '')) || fieldName : fieldName}
//                  pFForm={pFForm} path={path + (fieldName ? '/' + fieldName : '')} stateBranch={stateBranch}/>;
// }

class FSection extends Component<any, any> {
  private _arrayStartIndex: number = 0;
  private _items4arrayLayout: any[] = [];
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
    // self._makeArrayItems();
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
  //     if (self._fields[field] && self._fields[field].rebuild) self._fields[field].rebuild(path);
  //   }
  // }

  _build(props: any) {
    function bindMetods(restField: any, track: Path = []) {
      let result = {...restField};
      chains.methods2chain.forEach((methodName: string) => {
        if (typeof result[methodName] == 'function') result[methodName] = result[methodName].bind(pFField)
      });
      objKeys(result).forEach(key => isObject(result[key]) && (result[key] = bindMetods(result[key], track.concat(key))));
      return result
    }

    function makeLayouts(keys: string[], fields: Array<string | FFGroupGeneric<jsFFCustomizeType>>) {
      const layout: any[] = [];
      fields.forEach(fieldName => {
        if (typeof fieldName == 'string') { // if field is string then make SectionField
          let idx = keys.indexOf(fieldName);
          if (~idx) {
            layout.push(self._makeFField(fieldName));
            keys.splice(idx, 1);
          }
        } else if (isObject(fieldName)) { // if field is object, then do makeLayouts if prop "_fields" is passed
          let {_fields: groupFields, _propsMap, _pFField, ...restField} = fieldName as FFGroupGeneric<jsFFCustomizeType>;
          let savedCountValue = count; // save count value as it may change in following makeLayouts calls
          count++;
          restField = bindMetods(restField);  // binds onFunctis to field
          restField = replaceWidgetNamesWithFunctions(restField, pFField.pFForm.props.objects); // replace widget name (that passed as string value) with functions
          let opts = {};
          if (_pFField) opts[_pFField === true ? '_pFField' : _pFField] = pFField; // pass FField to widget. If true name 'options' is used, if string, then string value is used
          if (groupFields) {  // if _fields exists then this is group section and we should map groupPropsMap, pass schemaProps['Layouts'] and use GroupWidget as default if no widget is supplied
            if (_propsMap || LayoutsPropsMap) self._dataMaps[savedCountValue] = merge(_propsMap || {}, LayoutsPropsMap || {}); // merge _propsMap and LayoutsPropsMap, to pass them every time _props changed
            Object.assign(opts, schemaProps['Layouts']);
            if (!restField.widget) opts['widget'] = LayoutsWidget
          } else if (_propsMap) self._dataMaps[savedCountValue] = _propsMap;
          layout.push(<SectionObject {...opts} count={savedCountValue} getDataProps={self.getDataProps} ref={self._setWidRef(savedCountValue)}
                                     key={'widget_' + savedCountValue} {...restField} >{groupFields && makeLayouts(keys, groupFields)}</SectionObject>);
        }
      });
      return layout
    }

    const self = this;
    const {pFField, stateBranch} = props;
    const {widgets, schemaProps, schemaPart, chains, path} = pFField;

    if (!schemaPart) return;
    if (isSchemaSelfManaged(schemaPart)) return;

    const LayoutsWidget = widgets['Layouts'] || 'div';
    const LayoutsPropsMap = pFField.presetProps['Layouts']._propsMap;
    const {properties = {}}: { [key: string]: any } = schemaPart;
    // const {groups = []} = x;

    self._keyField = schemaPart.ff_props && schemaPart.ff_props.keyField || '/uniqId';
    if (self._keyField[0] !== '/') self._keyField = './' + self._keyField;
    self.isArray = schemaPart.type == 'array';
    self._dataMaps = {};
    self._dataProps = {};
    self._fields = {};
    self._widgets = {};

    if (LayoutsPropsMap) self._dataMaps[0] = LayoutsPropsMap;
    let count = 1; // 0 reserved for base layout

    if (self.isArray) {
      self._arrayStartIndex = arrayStart(schemaPart) || 0;
      if (!props._focusField) self._focusField = '0';
    }

    let objectKeys: string[] = self._getObjectKeys(stateBranch, self.props);
    if (!self._focusField) self._focusField = props._focusField || objectKeys[0] || '';

    self._objectLayouts = makeLayouts(objectKeys, schemaPart.ff_fields || []);  // we get inital _objectLayouts and every key, that was used in makeLayouts call removed from keys 
    objectKeys.forEach(fieldName => self._objectLayouts.push(self._makeFField(fieldName)));  // so here we have only keys was not used and we add them to _objectLayouts
    objKeys(self._dataMaps).forEach((key: string) => self._dataProps[key] = mapProps(self._dataMaps[key], stateBranch[SymData], pFField));

    self._makeArrayItems(self.props);

    self._rebuild = false;
  }

  _makeArrayItems(props: any) {
    const self = this;
    const pFField = props.pFField;
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
    return <FField ref={self._setFieldRef(arrayKey || fieldName)} key={arrayKey || fieldName} pFForm={self.props.pFField.pFForm} FFrormProps={self.props.FFormProps}
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
    return this.props.pFField.path + '/' + field;
  }

  _getArrayPath(key: string) {
    return this.props.pFField.path + '/' + this._arrayKey2field[key];
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

  _add2arrayLayout() {
    const self = this;
    self._items4arrayLayout = [];
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
        objKeys(self._dataMaps).forEach((key: string) => dataProps[key] = mapProps(self._dataMaps[key], nextBranch[SymData], nextProps.pFField));
        let {state: newDataProps, changes} = mergeState(self._dataProps, dataProps);
        self._dataProps = newDataProps;
        if (changes) objKeys(changes).forEach(key => self._widgets[key] && self._widgets[key]['forceUpdate']());
      }
    }

    return doUpdate || !isEqual(self.props, nextProps, {skipKeys: ['stateBranch']});
  }

  render() {
    const self = this;
    let {funcs, length, enumOptions, pFField, onChange, onFocus, onBlur, stateBranch, FFormProps, _refName, focusField, ...rest} = self.props;
    if (self._rebuild) self._build(self.props); // make rebuild here to avoid addComponentAsRefTo Invariant Violation error https://gist.github.com/jimfb/4faa6cbfb1ef476bd105
    // else if (self._items4arrayLayout.length) self._add2arrayLayout();
    return (
      <SectionObject {...pFField.schemaProps['Layouts']} {...rest} count={0} getDataProps={self.getDataProps} ref={self._setWidRef(0)} key={'widget_0'}>{self._objectLayouts}{self._arrayLayouts}</SectionObject>)
  }
}


function replaceWidgetNamesWithFunctions(presetArrays: any, objects: any) {
  let tmp = presetArrays;
  if (!isArray(tmp)) tmp = [tmp];
  for (let i = 0; i < tmp.length; i++) {
    let presetArray = tmp[i];
    let widget = presetArray.widget;
    if (widget) presetArray.widget = typeof widget === 'string' ? objects.widgets && objects.widgets[widget] || widget : widget;
    objKeys(presetArray).forEach(key => isObject(presetArray[key]) && (presetArray[key] = replaceWidgetNamesWithFunctions(presetArray[key], objects)))
  }
  return presetArrays
}

function ArrayBlock(props: any) {
  const {useTag: UseTag = 'div', empty, addButton, length, canAdd, id, children, hidden, hiddenStyle, pFField, ...rest} = props;
  const {widget: Empty = 'div', ...emptyRest} = empty;
  const {widget: AddButton = 'button', ...addButtonRest} = addButton;
  const onClick = () => {
    // console.time('arrayAdd');
    pFField.pFForm.api.arrayAdd(pFField.path, 1, {execute: true});
    // console.timeEnd('arrayAdd');
  };
  if (hidden) rest.style = merge(rest.style || {}, hiddenStyle ? hiddenStyle : {display: 'none'});
  if (length) return (<UseTag {...rest}>{children}{canAdd ? <AddButton onClick={onClick} {...addButtonRest} /> : ''}</UseTag>);
  else return (<UseTag {...rest}><Empty {...emptyRest}>{canAdd ? <AddButton onClick={onClick} {...addButtonRest} /> : ''}</Empty></UseTag>);
}

function objectResolver(obj2resolve: any, _objects: any) {
  function deref(obj: any) {
    let {$ref = '', restObj} = obj;
    $ref = $ref.split(':');
    const objs2merge: any[] = [];
    for (let i = 0; i < $ref.length; i++) {
      if (!$ref[i]) continue;
      let path = string2path($ref[i]);
      if (path[0] !== '%') throw new Error('Can reffer only to %');
      let refObj = getIn({'%': _objects}, path);
      if (refObj.$ref) refObj = deref(refObj);
      objs2merge.push(refObj);
    }
    let result = isArray(obj) ? [] : {};
    for (let i = objs2merge.length - 1; i >= 0; i--) result = merge(result, objs2merge[i]);
    return merge(result, restObj);
  }

  const result = deref(obj2resolve);
  const retResult = isArray(result) ? [] : {};
  objKeys(result).forEach((key) => {
    const resolvedValue = isString(result[key]) && result[key][0] == '%' && result[key][1] == '/' ? getIn({'%': _objects}, string2path(result[key])) : result[key];
    if (key[0] == '_') retResult[key] = resolvedValue;  //only resolve for keys that begins with _
    else if (isMergeable(result[key])) {
      retResult[key] = objectResolver(resolvedValue, _objects);
      if (retResult[key][SymData]) retResult[SymData][key] = retResult[key][SymData];
      delete retResult[key][SymData];
    } else if (typeof resolvedValue == 'function') {
      retResult[SymData][key] = resolvedValue;
    } else retResult[key] = resolvedValue;
  });

  return retResult
}

function getFieldBlocks(presetsString: string | string[], objects: any = {}, schemaPart: any = {}, initalFuncsObject: any = {}, object2bind: any = {}) {

  function chainMethods(result: any, initalFuncs: any, track: string[] = []) {// initalFuncs is function than should allways at the begginig of chain (the last in execution order)
    methods2chain.forEach((methodName: string) => {
      let methods = getArrayOfPropsFromArrayOfObjects(presetArray, track.concat(methodName));
      let methods_rev = getArrayOfPropsFromArrayOfObjects(presetArray, track.concat('$' + methodName)); // methotds that begins with '$' will be chained in reverse order
      let prevMethod = initalFuncs && initalFuncs[methodName];
      if (prevMethod) push2array(methods_rev, prevMethod);
      // console.log('methods 1:',methods);
      methods_rev.reverse();
      methods = methods_rev.concat(methods);
      // console.log('methods 2:',methods);
      let chainWidgets = getArrayOfPropsFromArrayOfObjects(presetArray, track.concat('widget'));
      if (chainWidgets.length) chains = merge(chains, makeSlice('widgets', track, chainWidgets));
      if (methods.length) chains = merge(chains, makeSlice('funcs', track, methodName, methods.slice()));
      if (!methods.length) return;
      for (let i = prevMethod ? 1 : 0; i < methods.length; i++) {
        let bindObj = {...object2bind};
        if (prevMethod) bindObj[methodName] = prevMethod;
        methods[i] = methods[i].bind(bindObj);
        prevMethod = methods[i]
      }
      result = merge(result, makeSlice(methodName, methods.pop()));
      result = merge(result, makeSlice('$' + methodName, SymDelete), {del: true});
    });
    objKeys(result).forEach(key => {
      if (key[0] !== '_' && isObject(result[key])) { // skip keys that begins with '_'
        let keyRes: any = chainMethods(result[key], initalFuncs && initalFuncs[key], track.concat(key));
        result = merge(result, makeSlice(key, keyRes))
      }
    });
    return result;
  }

  let presets = objects['presets'] || {};
  let methods2chain = objKeys(objects.methods2chain).filter(key => objects.methods2chain[key]); //get methods than should be chained as array of strings
  let chains = {methods2chain};
  let presetArray: any = [];  // here we will push all presets than should be merged in one
  let presetNames = isArray(presetsString) ? presetsString : presetsString.split(':');
  presetNames.reverse();
  presetNames.forEach(presetName => {
    while (true) {
      let preset = getIn(presetName[0] == '#' ? schemaPart.ff_custom : presets, string2path(presetName)); // if preset name begins with '#', like '#smthng' look for it in x['custom'], not in presets
      if (preset) {
        presetArray.push(preset);
        if (!preset['_']) break;  // '_' - is parent for this preset
        presetName = preset['_'];
      } else break;
    }
  });
  if (presets['*']) presetArray.push(presets['*']); // this will be first after reverse
  presetArray.reverse();  // reverse to get proper order
  if (schemaPart.ff_custom) presetArray.push(schemaPart.ff_custom); // and this is last, x['custom'] overwrite all
  presetArray.push({'_': undefined}); // remove '_' key as we don't want it to be in 'result'
  presetArray = replaceWidgetNamesWithFunctions(presetArray, objects);  // Now if we have _props with key 'widget' wich value is not function, replace it from objects['widget']
  let result = merge.all({}, presetArray, {del: true});
  result = chainMethods(result, initalFuncsObject); // merge in one object, remove undefined values, and make chains for methods that listed in objects.methods2chain with true value
  return {result, chains, presetArray};
}

function mapProps(map: FFDataMapGeneric<MapFunctionType>, data: FFieldDataType, field: FField) {
  if (!map) return {};
  let result = {};
  objKeys(map).filter(key => map[key]).forEach((to) => {
    let item: any = map[to];
    if (!isArray(item)) item = [item];
    let value = getIn(data, normalizePath(item[0]));
    result = merge(result, makeSlice(normalizePath(to), item[1] ? item[1].bind(field)(value) : value));
  });
  return result;
}

/////////////////////////////////////////////
//  Basic components
/////////////////////////////////////////////

function Unsupported(props: any) {return <div>Unsupported</div>}

function DefaultBuilder(props: any) {
  const {hidden, hiddenStyle, omit, dataProps, id, pFField, ...rest} = props;
  if (omit) return false;
  const {widgets, schemaProps} = pFField;

  const {Title, Body, Main, Message, Groups, GroupBlocks, ArrayItem, Array, Autosize} = widgets;

  const hiddenArray = [];
  if (Array) hiddenArray[1] = hidden;
  else if (ArrayItem && dataProps['ArrayItem'].itemData) hiddenArray[2] = hidden;
  else hiddenArray[0] = hidden;

  let result = (
    <GroupBlocks hidden={hiddenArray[0]} hiddenStyle={hiddenStyle} {...schemaProps['GroupBlocks']} {...dataProps['GroupBlocks']}>
      <Title {...schemaProps['Title']} {...dataProps['Title']}/>
      <Body {...schemaProps['Body']} {...dataProps['Body']}>
      <Main {...schemaProps['Main']} {...dataProps['Main']} {...rest} id={id} pFField={pFField}/>
      <Message {...schemaProps['Message']} {...dataProps['Message']}/>
      {Autosize ? <Autosize hidden={hidden} {...schemaProps['Autosize']} {...dataProps['Autosize']} pFField={pFField}/> : ''}
      </Body>
    </GroupBlocks>
  );
  if (Array) result = <Array hidden={hiddenArray[1]} hiddenStyle={hiddenStyle} {...schemaProps['Array']} {...dataProps['Array']} pFField={pFField}>{result}</Array>;
  if (ArrayItem && dataProps['ArrayItem'].itemData)
    result = <ArrayItem hidden={hiddenArray[2]} hiddenStyle={hiddenStyle} {...schemaProps['ArrayItem']} {...dataProps['ArrayItem']} pFField={pFField}>{result}</ArrayItem>;
  return result;
}

function DivBlock(props: any) {
  const {id, useTag: UseTag = 'div', hidden, hiddenStyle, children, ...rest} = props;
  if (hidden) rest.style = merge(rest.style || {}, hiddenStyle ? hiddenStyle : {display: 'none'});// merge(rest.style || {}, {display: 'none'});
  return (<UseTag {...rest}>{children}</UseTag>)
}


const sizerStyle = {position: 'absolute', top: 0, left: 0, visibility: 'hidden', height: 0, overflow: 'scroll', whiteSpace: 'pre'};

class AutosizeBlock extends PureComponent<any, any> {
  elem: any;

  componentDidMount() {
    const style = window && window.getComputedStyle(this.props.pFField.mainRef);
    if (!style || !this.elem) return;
    ['fontSize', 'fontFamily', 'fontWeight', 'fontStyle', 'letterSpacing'].forEach(key => this.elem.style[key] = style[key]);
  }

  render() {
    const self = this;
    const props = self.props;
    const value = (isUndefined(props.value) ? '' : props.value.toString()) || props.placeholder || '';
    return (<div style={sizerStyle as any} ref={(elem) => {
      (self.elem = elem) && (props.pFField.mainRef.style.width = ((elem as any).scrollWidth + (props.addWidth || 45)) + 'px')
    }}>{value}</div>)
  }
}

function TitleBlock(props: any) {
  const {id, title = '', required, useTag: UseTag = 'label', requireSymbol, emptyTitle, ...rest} = props;
  return (
    <UseTag {...(UseTag == 'label' && id ? {htmlFor: id} : {})} {...rest}>
      {emptyTitle ? typeof emptyTitle == 'string' ? emptyTitle : '' : (required ? title + requireSymbol : title)}
    </UseTag>
  );
}

function BaseInput(props: any) {
  let {
    value,
    useTag: UseTag,
    type = 'text',
    title,
    pFField,
    enumOptions,
    _refName,
    className,
    priority,
    ...rest
  }: { [key: string]: any } = props;
  UseTag = UseTag || (type == 'textarea' || type == 'select' ? type : 'input');
  const refObj: any = {};
  let ref = rest[_refName];
  if (_refName) delete rest[_refName];
  if (typeof UseTag == 'string') refObj.ref = ref; else refObj[_refName] = ref; // if "simple" tag then use ref else pass further in _refName property
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
  else return (<UseTag className={classNames(className, getIn(_PRIORITYClassNames, priority))} {...rest} {...refObj} {...valueObj} type={type} {...commonProps}/>);
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
    pFField,
    enumOptions,
    _refName,
    autofocus,
    disabled,
    disabledClass,
    nullValue,
    inputProps = {},
    labelProps = {},
    stackedProps,
    ...rest
  }: { [key: string]: any } = props;
  if (!type) type = pFField && pFField.schemaPart.type == 'array' ? 'checkbox' : 'radio';
  const name = props.id;
  let ref = rest[_refName];
  if (_refName) delete rest[_refName];
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
                         onFocus={onFocus.bind(props)}
                         onBlur={onBlur.bind(props)}
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
  const {useTag: UseTag = 'div', messageItem, messages = {}, untouched, id, ...rest} = props;
  const {widget: WidgetMessageItem, ...restMessageItem} = messageItem;
  let keys = objKeys(messages);
  const result: any[] = [];
  keys.sort((a, b) => parseFloat(a) - parseFloat(b));
  keys.forEach((key) => result.push(key == '0' && untouched ? null : <WidgetMessageItem key={key} {...messages[key]} {...restMessageItem} />));
  return <UseTag {...rest}>{result}</UseTag>;
}


function MessageItem(props: any) {
  const {useTag: UseTag = 'div', skip, textGroups, priority, className, ...rest} = props;
  const texts: any[] = [];
  objKeys(textGroups).forEach((groupKey: string) => push2array(texts, textGroups[groupKey]));
  if (skip || !texts.length) return null;
  return <UseTag className={classNames(className, _PRIORITYClassNames[priority || 0])} {...rest}>{texts.join('<br/>')}</UseTag>
}


function EmptyArray(props: any) {
  const {useTag: UseTag = 'div', text = 'This array is empty.', ...rest} = props;
  return <UseTag {...rest}>{text} {props.children}</UseTag>;
}

function AddButtonBlock(props: any) {
  const {useTag: UseTag = 'button', text = 'Add new item', type = 'button', ...rest} = props;
  return ((text as any) === false) ? false : <UseTag type={type} {...rest}>{text}</UseTag>;
}

function ItemMenu(props: any) {
  const {useTag: UseTag = 'div', buttonProps = {}, buttons, itemData, pFField, stateBranch, ...rest}: { [key: string]: any } = props;
  if (!itemData) return false;
  const {canUp, canDown, canDel} = itemData;
  const {path, pFForm} = pFField;
  // const api = pFForm.api;
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
  if (!props.itemData) return React.Children.only(props.children);
  let {children, hidden, hiddenStyle, itemMain, itemBody, itemMenu, ...rest} = props;
  const {widget: Item = 'div', ...itemRest} = itemMain || {};
  const {widget: ItemBody = 'div', ...itemBodyRest} = itemBody || {};
  const {widget: ItemMenu = 'div', ...itemMenuRest} = itemMenu || {};
  if (hidden) itemRest.style = merge(itemRest.style || {}, hiddenStyle ? hiddenStyle : {display: 'none'});
  return (
    <Item {...itemRest}>
      <ItemBody {...itemBodyRest}>
        {React.Children.only(children)}
      </ItemBody>
      <ItemMenu {...itemMenuRest} {...rest}/>
    </Item>
  )
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

function getArrayOfPropsFromArrayOfObjects(arr: any, propPath: string | Path) {
  propPath = normalizePath(propPath);
  for (let i = (propPath[0] == '#' ? 1 : 0); i < propPath.length; i++) {
    arr = arr.filter((item: any) => item.hasOwnProperty(propPath[i])).map((item: any) => item[propPath[i]]);
    if (!arr.length) break;
  }
  return arr
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


function onSelectChange(event: any) {
  function processSelectValue({type, items}: any, value: any) {
    // if (value === "") return null;
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
//  basicObjects
/////////////////////////////////////////////


const basicObjects: formObjectsType & { extend: (obj: any) => any } = {
  extend: function (obj) {
    return merge(this, obj, {symbol: false}) // merge without symbols, as there (in symbol keys) will be stored cache data which MUST be recalculated after each extend
  },
  types: ['string', 'integer', 'number', 'object', 'array', 'boolean', 'null'],
  // methods2chain: { // bind on<EventName> methods, so that it can access to previous method in chain by using this.on<EventName>
  //   'onBlur': true, 'onMouseOver': true, 'onMouseEnter': true, 'onMouseLeave': true, 'onChange': true, 'onSelect': true, 'onClick': true, 'onSubmit': true, 'onFocus': true, 'onUnload': true, 'onLoad': true
  // },
  widgets: {
    Builder: DefaultBuilder,
    Array: ArrayBlock,
    ArrayItem: ArrayItem,
    EmptyArray: EmptyArray,
    AddButton: AddButtonBlock,
    ItemMenu: ItemMenu,
    Title: TitleBlock,
    Messages: MessageBlock,
    MessageItem: MessageItem,
    BaseInput: BaseInput,
    CheckboxInput: CheckboxInput,
    ArrayInput: ArrayInput,
    Section: FSection,
    DivBlock: DivBlock,
    Autosize: AutosizeBlock,
  },
  presets: {
    'base': {
      //_blocks: {'Builder': true, 'Title': true, 'Body': true, 'Main': true, 'Message': true, 'GroupBlocks': true, 'ArrayItem': true, 'Autosize': false},
      // childrenBlocks: {},

      Array: {
        _widget: '%/widgets/Array',
        empty: {_widget: '%/widgets/EmptyArray'},
        addButton: {_widget: '%/widgets/AddButton'},
        _propsMap: {
          length: 'length',
          canAdd: 'fData/canAdd',
        },
      },
      ArrayItem: {
        _widget: '%/widgets/ArrayItem',
        itemMenu: {
          _widget: '%/widgets/ItemMenu',
          buttons: ['first', 'last', 'up', 'down', 'del'],
          buttonProps: {
            onClick: function (key: string) {
              this.pFForm.api.arrayItemOps(this.field.path, key, {execute: true})
            }
          }
        },
        _propsMap: {itemData: 'arrayItem'}
      },
      Builder: {
        _widget: '%/widgets/Builder',
        _propsMap: {
          hidden: ['controls', (controls: any) => getBindedValue(controls, 'hidden')],
        },
      },
      Layouts: {
        _widget: '%/widgets/DivBlock',
        className: 'fform-group-block',
      },
      GroupBlocks: {
        _widget: '%/widgets/DivBlock',
        className: 'fform-layout-block',
      },
      Body: {
        _widget: '%/widgets/DivBlock',
        className: 'fform-body-block',
      },
      Title: {
        _widget: '%/widgets/Title',
        useTag: 'label',
        requireSymbol: '*',
        _propsMap: {
          required: 'fData/required',
          title: 'fData/title',
        },
      },
      Message: {
        _widget: '%/widgets/Messages',
        _propsMap: {
          messages: 'messages',
          untouched: 'status/untouched',
        },
        messageItem: {
          _widget: '%/widgets/MessageItem',
        },
      },
      Main: {
        _widget: '%/widgets/BaseInput',
        _refName: 'getRef',
        _propsMap: {
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
          self.api.set('./@status/untouched', 0, {noValidation: true});
          self.api.set('/@/active', undefined, {noValidation: true});
          return !self.liveValidate ? self.api.validate() : null;
        },
        onFocus: function (value: any) {this.api.set('/@/active', this.path, {noValidation: true})}
      }
    },
    string: {
      $ref: '%/presets/base', Main: {
        type: 'text',
        onChange: function (event: any) {this.api.setValue(event.target.value, {})}
      }
    },
    integer: {
      $ref: '%/presets/base',
      Main: {
        type: 'number',
        onChange: function (event: any) {this.setValue(event.target.value == '' ? undefined : parseInt(event.target.value))}
      }
    },
    number: {
      $ref: '%/presets/base',
      Main: {
        type: 'number',
        step: 'any',
        onChange: function (event: any) {this.setValue(event.target.value == '' ? undefined : parseFloat(event.target.value))}
      }
    },
    range: {$ref: '%/presets/base', Main: {type: 'range'}},
    'null': {$ref: '%/presets/base', Main: {type: 'hidden'}},
    hidden: {
      $ref: '%/presets/base',
      Builder: {
        hidden: true,
        _propsMap: {hidden: false}
      }
    },
    booleanBase: {
      $ref: '%/presets/base',
      Main: {
        type: 'checkbox',
        onChange: function (event: any) {this.onChange(event.target.checked)}
      }
    },
    boolean: {
      $ref: '%/presets/booleanBase',
      Main: {
        _widget: '%/widgets/CheckboxInput',
      },
      Title: {emptyTitle: true},
    },
    tristateBase: {
      $ref: '%/presets/base',
      Main: {
        type: 'tristate',
        useTag: TristateBox
      }
    },
    tristate: {
      $ref: '%/presets/tristateBase',
      Main: {
        _widget: '%/widgets/CheckboxInput',
      },
      Title: {emptyTitle: true},
    },
    object: {
      $ref: '%/presets/base',
      // _blocks: {'Layouts': true},
      Main: {
        _widget: '%/widgets/Section',
        _refName: 'ref',
        _propsMap: false,
        // _propsMap: {
        //   value: false,
        //   autoFocus: false,
        //   placeholder: false,
        //   required: false,
        //   title: false,
        //   readOnly: false,
        //   disabled: false,
        // }
      },
      GroupBlocks: {useTag: 'fieldset'},
      Title: {useTag: 'legend'},
    },
    array: {
      $ref: '%/presets/object',
      //_blocks: {'Array': true},
      //Main: {_propsMap: {length: 'length'}},
      //GroupBlocks: {useTag: 'fieldset'},
      //Title: {useTag: 'legend'},
    },
    inlineTitle: {
      GroupBlocks: {
        style: {flexFlow: 'row'},
      }
    },
    select: {$ref: '%/presets/base', Main: {type: 'select', onChange: onSelectChange}},
    multiselect: {$ref: '%/presets/select', Main: {multiply: true}},
    arrayOf: {
      $ref: '%/presets/base',
      Main: {
        _widget: '%/widgets/ArrayInput',
        inputProps: {},
        labelProps: {},
        stackedProps: {},
        disabledClass: 'disabled',
      },
    },
    radio: {$ref: '%/presets/arrayOf', Main: {type: 'radio'}},
    checkboxes: {$ref: '%/presets/arrayOf', Main: {type: 'checkbox'}, fields: {'Layouts': false, 'Array': false}},

    inlineItems: {Main: {stackedProps: false}},
    buttons: {Main: {inputProps: {className: 'button'}, labelProps: {className: 'button'}}},
    //selector: {dataMap: [['./@/value', './', selectorOnChange(false)]]}, // {onChange: selectorOnChange(false)}},
    //tabs: {dataMap: [['./@/value', './', selectorOnChange(true)]]}, //{Main: {onChange: selectorOnChange(true)}},
    autosize: {
      Autosize: {
        _widget: '%/widgets/Autosize',
        _propsMap: {
          value: 'value',
          placeholder: 'params/placeholder',
        }
      },
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
  presetMap: {
    boolean: ['select', 'radio'],
    string: ['select', 'password', 'email', 'hostname', 'ipv4', 'ipv6', 'uri', 'data-url', 'radio', 'textarea', 'hidden', 'date', 'datetime', 'date-time', 'color', 'file'],
    number: ['select', 'updown', 'range', 'radio'],
    integer: ['select', 'updown', 'range', 'radio'],
    array: ['select', 'checkboxes', 'files'],
  },
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


const buttonObject = {
  _widget: function (props: any) {
    let {text = 'Submit', ...rest} = props;
    return <button {...rest}>{text}</button>
  }
};


export {selectorMap, getFieldBlocks, basicObjects, FForm, FFormStateAPI, fformCores};

//module.exports = process.env.NODE_ENV === 'test' ? merge(module.exports, {}) : module.exports;

