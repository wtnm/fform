import * as React from 'react';
import {Component, PureComponent} from 'react';
import {asNumber, not, getByKey, getIn, isArr, isEqual, isObject, isUndefined, makeSlice, merge, mergeState, objKeys, push2array} from "./commonLib";
import {
  arrayStart,
  get,
  getBindedValue,
  getKeyMapFromSchema,
  getSchemaPart,
  isReplaceable,
  makeStateFromSchema,
  path2string,
  _rawValuesKeys,
  string2path,
  SymData,
  SymDelete,
  UpdateItems,
  utils,
  val2path,
} from './stateLib'
import {apiCreator, formReducer, getFRVal, Hooks} from './api'

const JSONSchemaValidator = require('./is-my-json-valid');

const _path2rawValues = [SymData, 'rawValues'];
const _path2currentValue = [SymData, 'rawValues', 'current'];


function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      derivedCtor.prototype[name] = baseCtor.prototype[name]
    })
  });
}


const _CORES = {};

/////////////////////////////////////////////
//  FFormCore class
/////////////////////////////////////////////


/** Creates a core that contains data and api for changing it */
class FFormCore {
  private isDispatching: boolean;
  private currentState: any;
  private reducer: any;
  private keyMap: any;
  private validator: any;
  private _unsubscribe: any;
  private props: any;
  private listeners: Array<(state: StateType) => void> = [];
  private dispath: any;
  utils: utilsApiType = utils;
  api: FormApi;
  promise: Promise<any>;
  name?: string;

  constructor(props: FFormCoreProps) {
    const self = this;
    self.props = props;
    if ((props.getState || props.setState) && props.store) throw new Error('Expected either "store" or "getState & setState" but not all of them.');
    if (((props.getState ? 1 : 0) + (props.setState ? 1 : 0)) == 1) new Error('Expected both "getState" and "setState" or none but not only one of them.');
    if (props.store && !props.name) throw new Error('Expected "name" to be passed together with "store".');
    const opts = props.opts || {};
    self.name = props.name || '';
    self.dispath = props.store ? props.store.dispatch : self._dispath.bind(self);
    self.reducer = formReducer();
    self.validator = JSONSchemaValidator(props.schema, {greedy: true});
    self._jValidator = self._jValidator.bind(self);
    self.keyMap = getKeyMapFromSchema(props.schema);
    let formValues: any = {};
    _rawValuesKeys.forEach(type => props[type] && (formValues[type] = opts.flatValues ? self.keyMap.unflatten(props[type]) : props[type]));
    let state = self._getState();
    if (!state) {
      const result = makeStateFromSchema(props.schema, formValues);
      state = merge(result.state, result.dataMap);
      formValues['default'] = merge(result.defaultValues, formValues['default'], {replace: isReplaceable(props.schema)})
    }
    if (!formValues.inital) formValues.inital = formValues.default;
    formValues.current = merge.all(formValues.default, [formValues.inital, formValues.current], {arrays: 'merge', replace: isReplaceable(props.schema)});

    self.api = apiCreator(props.schema, props.store ? self.name : '', self.dispath, self._getState.bind(self), self._setState.bind(self), self.keyMap, Hooks.get(props.name), self._jValidator, opts);
    self.api.replaceState(state, {execute: true});
    self.promise = self.api.setValues(formValues, {execute: true, noValidation: opts.skipInitValidate});
    // self.promise = self.api.set([], state, {execute: true, noValidation: props.skipInitValidate})
    if (self.name) _CORES[self.name] = self;
  }

  addListener(fn: (state: StateType) => void) {
    const self = this;
    self.listeners.push(fn);
    if (self.props.store && !self._unsubscribe) self._unsubscribe = self.props.store.subscribe(self._handleChange.bind(self));
    return self.delListener.bind(self, fn);
  }

  delListener(fn?: (state: StateType) => void) {
    const self = this;
    if (fn === undefined) self.listeners = [];
    else {
      let idx = self.listeners.indexOf(fn);
      if (~idx) self.listeners.splice(idx, 1)
    }
    if (!self.listeners.length && self._unsubscribe) {
      self._unsubscribe();
      delete self._unsubscribe;
    }
  }

  private _handleChange() {
    const self = this;
    let nextState = self._getStoreState();
    let curState = self.props.getState ? self.props.getState() : self.currentState;
    if (nextState !== curState) self._setState(nextState);
  }

  private _setState(state: any) {
    const self = this;
    if (self.props.setState) self.props.setState(state);
    else self.currentState = state;
    self.listeners.forEach(fn => fn(state));
  }

  private _getStoreState() {
    return this.props.store.getState()[getFRVal()][this.props.name];
  }

  private _getState() {
    const self = this;
    if (self.props.getState) return self.props.getState();
    else if (self.props.store && !self._unsubscribe) return self._getStoreState();
    else return self.currentState;
  }

  private _dispath(action: any) {
    const self = this;
    if (typeof action === 'function') return action(self._dispath.bind(self));
    else self._setState(self.reducer(self._getState() || {}, action));
    return action;
  };

  private _jValidator(data: any) {
    this.validator(data);
    let result = this.validator.errors;
    if (!result) return [];
    if (!isArr(result)) result = [result];
    return result.map((item: any) => [item.field.split('.').slice(1), item.message])
  }
}


/////////////////////////////////////////////
//  Main class
/////////////////////////////////////////////
class FForm extends Component<any, any> {
  _unsubscribe: any;
  _currentState: any;
  //_onChange: any;
  _setRef: any;
  //_onSubmit: any;
  core: any;
  rRefs: any = {};
  formName: any;
  schema: any;
  api: any;
  utils: any;
  objects: any;
  parent: any;

  constructor(props: FFormProps, context: any) {
    super(props, context);
    const self = this;
    let {core: coreOrParams, onChange, onSubmit, state, values, rawValues, extData, ...rest} = props;
    self.core = coreOrParams instanceof FFormCore ? coreOrParams : self._getCoreFromParams(coreOrParams, context);
    if (state) self.core.api.set([], state, {execute: 1});
    else if (rawValues) self.core.api.setValues(rawValues, {execute: 1});
    else if (values) self.core.api.setValues(merge(self.core.api.getValues().current, values, {replace: isReplaceable(self.core.props.schema)}), {valueType: 'current', execute: 1});
    if (extData) objKeys(extData).forEach(key => (self.core.api.set(key, (extData as any)[key], {replace: true, execute: 1})));
    self._unsubscribe = self.core.addListener(self._updateState.bind(self));
    //self._onChange = onChange;
    self._setRef = (name: string) => (item: any) => self.rRefs[name] = item;
    self.focus = self.focus.bind(self);
    self._submit = self._submit.bind(self)
    // self.rebuild = self.rebuild.bind(self);
    // console.log('made FFrom ', self.props.name)

  }


  _updateState(state: StateType) {
    const self = this;
    let currentState = self._currentState;
    if (currentState == state) return;
    self._currentState = state;
    if (self.rRefs['root']) self.rRefs['root'].forceUpdate();
    if (self.props.onChange) {
      let props = self.props;
      if (props.state) self.props.onChange(state, self);
      else if (props.rawValues) {
        if (!isEqual(getIn(currentState, _path2rawValues), getIn(state, _path2rawValues))) self.props.onChange(getIn(state, _path2rawValues), self)
      } else {
        if (getIn(currentState, _path2currentValue) != getIn(state, _path2currentValue)) self.props.onChange(getIn(state, _path2currentValue), self)
      }
    }
  }

  _submit() {
    const self = this;
    let vals;
    let props = self.props;
    let state = self._currentState;
    if (props.state) vals = state;
    else if (props.rawValues) vals = getIn(state, _path2rawValues);
    else vals = getIn(state, _path2currentValue);
    if (self.props.onSubmit) return self.props.onSubmit(vals, self)
  }

  _getCoreFromParams(core: any, context: any) {
    if (!core.store && core.store !== false && context.store) return new FFormCore(merge(core, {store: context.store}));
    else return new FFormCore(core);
  }

  shouldComponentUpdate(newProps: FFormProps) {
    const self = this;
    let {core, ...rest} = newProps;
    // self._onChange = onChange;
    let coreEqual = true;
    let coreStateChanged;
    const oldProps = self.props;
    // if (oldProps.core !== core) {
    //   coreEqual = false;
    //   if (!(core instanceof FFormCore)) {
    //     if (!isEqual(oldProps.core, core)) self.core = self._getCoreFromParams(core, self.context);
    //     else coreEqual = true;
    //   } else self.core = core;
    // }
    // if (!coreEqual) {
    //   self._unsubscribe();
    //   self._unsubscribe = self.core.addListener(self._updateState.bind(self));
    //   self._updateState(self.core.api.getState())
    // }
    if (core instanceof FFormCore && self.core !== core) {
      self._unsubscribe();
      self.core = core;
      self._unsubscribe = self.core.addListener(self._updateState.bind(self));
      coreEqual = false;
      coreStateChanged = self.core.getState();
      self.rRefs['root'] = undefined; // set undefined to disable forceUpdate in _updateState
    }

    let equal = isEqual(oldProps, newProps, {skipKeys: ['state', 'values', 'rawValues', 'core', 'onChange', 'onSubmit', 'extData', 'fieldCache']}) && coreEqual;
    if (newProps.state) {
      if (newProps.state !== self.core.api.getState()) self.core.api.replaceState(newProps.state, {execute: 1});
    } else if (newProps.rawValues) {
      if (!isEqual(newProps.rawValues, self.core.api.getValues())) self.core.api.setValues(newProps.rawValues, {execute: 1});
    } else if (newProps.values !== undefined) {
      if (newProps.values !== self.core.api.getValues({valueType: 'current'})) self.core.api.setValues(newProps.values, {valueType: 'current', execute: 1});
    } 

    let newExtData = newProps.extData || {};
    objKeys(newExtData).forEach(key => (self.core.api.get(key) !== newExtData[key]) && self.core.api.set(key, newExtData[key], {replace: true, execute: 1}));
    self.core.api.execute();
    if (coreStateChanged && coreStateChanged === self.core.api.getState()) self._updateState(coreStateChanged);
    return !equal;
  }

  componentWillUnmount() {
    if (this._unsubscribe) this._unsubscribe();
  }

  focus(path: Path | string): void {
    if (this.rRefs['widget']) this.rRefs['widget'].focus(val2path(path));
  };

  // rebuild(path: Path | string): void {
  //   if (this.rRefs['field']) this.rRefs.rebuild(val2path(path));
  // };

  render() {
    const self = this;
    let {core, parent, fieldCache, objects, state, values, rawValues, onChange, onSubmit, widget: Widget = 'form', extData, ...rest}: FFormProps & any = self.props;
    self.parent = parent;
    const pFForm: any = {self, objects, parent};
    const currentCore = self.core;
    pFForm.core = currentCore;
    pFForm.formName = currentCore.name;
    pFForm.schema = currentCore.props.schema;
    pFForm.api = currentCore.api;
    pFForm.utils = currentCore.utils;
    pFForm.focus = self.focus;

    // pFForm.rebuild = self.rebuild;
    // <FField ref={self._setRef} pFForm={pFForm} path='#'/>
    return (
      <Widget {...rest} onSubmit={self._submit}>
        <SectionField pFForm={pFForm} path='#' setRef={self._setRef('widget')} ref={self._setRef('root')}/>
      </Widget>
    )
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

class SectionField extends PureComponent<any, any> { // need to be class, as we use it's forceUpdate() method
  render() {
    const {pFForm, path, setRef, fieldName, keyField} = this.props;
    return setFField(pFForm, path, setRef, fieldName, keyField)
  }
}

function setFField(pFForm: any, path: string, ref: any, fieldName?: string, keyField?: string) {
  let stateBranch = pFForm.api.get(path);
  if (fieldName) stateBranch = stateBranch[fieldName];
  return <FField ref={ref} key={keyField ? getIn(stateBranch, SymData, string2path(keyField, ['values', 'current'])) || fieldName : fieldName}
                 pFForm={pFForm} path={path + (fieldName ? '/' + fieldName : '')} stateBranch={stateBranch}/>;
}


function replaceWidgetNamesWithFunctions(presetArrays: any, objects: any) {
  let tmp = presetArrays;
  if (!isArr(tmp)) tmp = [tmp];
  for (let i = 0; i < tmp.length; i++) {
    let presetArray = tmp[i];
    let widget = presetArray.widget;
    if (widget) presetArray.widget = typeof widget === 'string' ? objects.widgets && objects.widgets[widget] || widget : widget;
    objKeys(presetArray).forEach(key => isObject(presetArray[key]) && (presetArray[key] = replaceWidgetNamesWithFunctions(presetArray[key], objects)))
  }
  return presetArrays
}

class Section extends Component<any, any> {
  layoutsObject: any[] = [];
  layoutsArray: any[] = [];
  ArrayItem: any;
  isArray: boolean = false;
  arrayStartIndex: number = 0;
  shouldBuild = true;
  focusField: string = '';
  fields: { [key: string]: any };
  wids: { [key: string]: any };
  dataMaps: { [key: string]: any };
  dataProps: { [key: string]: any };
  getDataProps: any;
  setWidRef: any;
  setFieldRef: any;
  prevState: any;
  length: number;
  keyField: string;

  constructor(props: any, context: any) {
    super(props, context);
    const self = this;
    self.setFieldRef = (field: number | string) => (item: any) => self.fields[field] = item;
    self.setWidRef = (key: number | string) => (item: any) => self.wids[key] = item;
    self.getDataProps = () => self.dataProps;
    self._build(self.props);
    // self._makeArrayItems();
  }

  focus(path: Path) {
    const self = this;
    let field;
    if (!path.length) field = self.focusField;
    else {
      field = path[0];
      path = path.slice(1);
    }
    if (self.fields[field] && self.fields[field].focus) self.fields[field].focus(path)
  }

  rebuild(path: Path) {
    const self = this;
    if (!path.length) {
      self._clear();
      self.forceUpdate()
    } else {
      let field = path[0];
      path = path.slice(1);
      if (self.fields[field] && self.fields[field].rebuild) self.fields[field].rebuild(path);
    }
  }

  _build(props: any) {
    function bindMetods(restField: any, track = ['#']) {
      let result = {...restField};
      chains.methods2chain.forEach((methodName: string) => {
        if (typeof result[methodName] == 'function') result[methodName] = result[methodName].bind(pFField.self.bindObject)
      });
      objKeys(result).forEach(key => isObject(result[key]) && (result[key] = bindMetods(result[key], track.concat(key))));
      return result
    }

    function makeLayouts(keys: string[], fields: Array<string | GroupType>) {
      const layout: any[] = [];
      fields.forEach(fieldName => {
        if (typeof fieldName == 'string') { // if field is string then make SectionField
          let idx = keys.indexOf(fieldName);
          if (~idx) {
            layout.push(makeFieldObject(fieldName));
            keys.splice(idx, 1);
          }
        } else if (isObject(fieldName)) { // if field is object, then do makeLayouts if prop "fields" is passed
          let {fields: groupFields, propsMap, passPFField, ...restField} = fieldName as GroupType;
          let savedCountValue = count; // save count value as it may change in following makeLayouts calls
          count++;
          restField = bindMetods(restField);  // binds onFunctis to field
          restField = replaceWidgetNamesWithFunctions(restField, pFForm.objects); // replace widget name (that passed as string value) with functions
          let opts = {};
          if (passPFField) opts[passPFField === true ? 'pFField' : passPFField] = pFField; // pass FField to widget. If true name 'options' is used, if string, then string value is used
          if (groupFields) {  // if fields exists then this is group section and we should map groupPropsMap, pass schemaProps['Layouts'] and use GroupWidget as default if no widget is supplied
            if (propsMap || LayoutsPropsMap) self.dataMaps[savedCountValue] = merge(propsMap || {}, LayoutsPropsMap || {}); // merge propsMap and LayoutsPropsMap, to pass them every time props changed
            Object.assign(opts, schemaProps['Layouts']);
            if (!restField.widget) opts['widget'] = LayoutsWidget
          } else if (propsMap) self.dataMaps[savedCountValue] = propsMap;
          layout.push(<SectionObject {...opts} count={savedCountValue} getDataProps={self.getDataProps} ref={self.setWidRef(savedCountValue)}
                                     key={'widget_' + savedCountValue} {...restField} >{groupFields && makeLayouts(keys, groupFields)}</SectionObject>);
        }
      });
      return layout
    }

    const makeFieldObject = (fieldName: string) => <SectionField key={'field_' + fieldName} pFForm={pFForm} path={path} ref={self.setWidRef('field_' + fieldName)} setRef={self.setFieldRef(fieldName)}
                                                                 fieldName={fieldName}/>;
    const self = this;
    const {pFField, stateBranch} = props;
    const {pFForm, widgets, schemaProps, schemaPart, chains, path} = pFField;

    if (!schemaPart) return;
    if (getIn(schemaPart, ['x', 'values'])) return;

    const LayoutsWidget = widgets['Layouts'] || 'div';
    const LayoutsPropsMap = pFField.self.presetProps['Layouts'].propsMap;
    const {x = {}, properties = {}}: { [key: string]: any } = schemaPart;
    const {groups = []} = x;

    self.keyField = getIn(schemaPart, 'x', 'keyField') || '/uniqId';
    if (self.keyField[0] !== '/') self.keyField = './' + self.keyField;
    self.isArray = schemaPart.type == 'array';
    self.dataMaps = {};
    self.dataProps = {};
    self.fields = {};
    self.wids = {};

    if (LayoutsPropsMap) self.dataMaps[0] = LayoutsPropsMap;
    let count = 1; // 0 reserved for base layout

    if (self.isArray) {
      self.arrayStartIndex = arrayStart(schemaPart) || 0;
      if (!props.focusField) self.focusField = '0';
    }

    let objectKeys: string[] = self._getObjectKeys(stateBranch, self.props);
    if (!self.focusField) self.focusField = props.focusField || objectKeys[0] || '';

    self.layoutsObject = makeLayouts(objectKeys, x.fields || []);  // we get inital layoutsObject and every key, that was used in makeLayouts call removed from keys 
    objectKeys.forEach(fieldName => self.layoutsObject.push(makeFieldObject(fieldName)));  // so here we have only keys was not used and we add them to layoutsObject
    objKeys(self.dataMaps).forEach((key: string) => self.dataProps[key] = mapProps(self.dataMaps[key], stateBranch[SymData], pFField.self.bindObject));

    self._makeArrayItems(self.props);

    self.shouldBuild = false;
  }

  _makeArrayItems(props: any) {
    const self = this;
    const res: any[] = [];
    const pFField = props.pFField;
    if (self.isArray)
      for (let i = self.arrayStartIndex; i < props.length; i++) res.push(setFField(pFField.pFForm, pFField.path, self.setFieldRef(i), i.toString(), self.keyField));
    self.layoutsArray = res;
    return res.length
  }

  _clear() {
    const self = this;
    self.layoutsObject = [];
    self.focusField = '';
    self.isArray = false;
    self.shouldBuild = true;
  }

  _getObjectKeys(stateBranch: StateType, props: any) {
    const self = this;
    let keys: string[] = [];
    if (self.isArray) for (let i = 0; i < Math.min(self.arrayStartIndex, props.length); i++) keys.push(i.toString());
    else keys = objKeys(stateBranch);
    return keys;
  }

  shouldComponentUpdate(newProps: any) {
    const self = this;
    if (newProps.pFField !== self.props.pFField) {
      self._clear();
      return true;
    }

    let result = !isEqual(self.props, newProps, {skipKeys: ['stateBranch']});
    let prevStateBranch = self.props.stateBranch;
    let stateBranch = newProps.stateBranch;

    if (prevStateBranch != stateBranch) {
      if (self.isArray && newProps.length <= self.arrayStartIndex && self.props.length != newProps.length) self.shouldBuild = true;
      self._getObjectKeys(stateBranch, newProps).forEach(field => (stateBranch[field] !== prevStateBranch[field]) && self.wids['field_' + field] && self.wids['field_' + field]['forceUpdate']());
      if (self._makeArrayItems(newProps)) result = true;
      if (stateBranch[SymData] !== prevStateBranch[SymData]) {  // update dataProps
        const dataProps = {};
        objKeys(self.dataMaps).forEach((key: string) => dataProps[key] = mapProps(self.dataMaps[key], stateBranch[SymData], newProps.pFField.self.bindObject));
        let {state: newDataProps, changes} = mergeState(self.dataProps, dataProps);
        self.dataProps = newDataProps;
        if (changes) objKeys(changes).forEach(key => self.wids[key] && self.wids[key]['forceUpdate']());
      }
    }
    return result || self.shouldBuild;
  }

  render() {
    const self = this;
    let {funcs, length, enumOptions, pFField, onChange, onFocus, onBlur, stateBranch, refName, focusField, ...rest} = self.props;
    if (self.shouldBuild) self._build(self.props); // make rebuild here to avoid addComponentAsRefTo Invariant Violation error https://gist.github.com/jimfb/4faa6cbfb1ef476bd105
    return (
      <SectionObject {...pFField.schemaProps['Layouts']} {...rest} count={0} getDataProps={self.getDataProps} ref={self.setWidRef(0)} key={'widget_0'}>{self.layoutsObject}{self.layoutsArray}</SectionObject>)
  }
}

function ArrayBlock(props: any) {
  const {useTag: UseTag = 'div', empty, addButton, length, canAdd, id, children, hidden, hiddenStyle, pFField, ...rest} = props;
  const {widget: Empty = 'div', ...emptyRest} = empty;
  const {widget: AddButton = 'button', ...addButtonRest} = addButton;
  const onClick = () => {
    // console.time('arrayOps');
    pFField.pFForm.api.arrayOps(pFField.self.props.path, 'add', {execute: true});
    // console.timeEnd('arrayOps');
  };
  if (hidden) rest.style = merge(rest.style || {}, hiddenStyle ? hiddenStyle : {display: 'none'});
  if (length) return (<UseTag {...rest}>{children}{canAdd ? <AddButton onClick={onClick} {...addButtonRest} /> : ''}</UseTag>);
  else return (<UseTag {...rest}><Empty {...emptyRest}>{canAdd ? <AddButton onClick={onClick} {...addButtonRest} /> : ''}</Empty></UseTag>);
}

/////////////////////////////////////////////
//  FField class
/////////////////////////////////////////////
function getFieldBlocks(presetsString: string | string[], objects: any = {}, x: any = {}, initalFuncsObject: any = {}, object2bind: any = {}) {

  function chainMethods(result: any, initalFuncs: any, track: string[] = ['#']) {// initalFuncs is function than should allways at the begginig of chain (the last in execution order)
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
      if (key[0] !== '_' && isObject(result[key])) {
        let keyRes: any = chainMethods(result[key], initalFuncs && initalFuncs[key], track.concat(key))
        result = merge(result, makeSlice(key, keyRes))
      }
    });  // skip keys that begins with '_'
    return result;
  }

  let presets = objects['presets'] || {};
  let methods2chain = objKeys(objects.methods2chain).filter(key => objects.methods2chain[key]); //get methods than should be chained as array of strings
  let chains = {methods2chain};
  let presetArray: any = [];  // here we will push all presets than should be merged in one
  let presetNames = isArr(presetsString) ? presetsString : presetsString.split(':');
  presetNames.reverse();
  presetNames.forEach(presetName => {
    while (true) {
      let preset = getIn(presetName[0] == '#' ? x['custom'] : presets, string2path(presetName)); // if preset name begins with '#', like '#smthng' look for it in x['custom'], not in presets
      if (preset) {
        presetArray.push(preset);
        if (!preset['_']) break;  // '_' - is parent for this preset
        presetName = preset['_'];
      } else break;
    }
  });
  if (presets['*']) presetArray.push(presets['*']); // this will be first after reverse
  presetArray.reverse();  // reverse to get proper order
  if (x['custom']) presetArray.push(x['custom']); // and this is last, x['custom'] overwrite all
  presetArray.push({'_': undefined}); // remove '_' key as we don't want it to be in 'result'
  presetArray = replaceWidgetNamesWithFunctions(presetArray, objects);  // Now if we have props with key 'widget' wich value is not function, replace it from objects['widget']
  let result = merge.all({}, presetArray, {del: true});
  result = chainMethods(result, initalFuncsObject); // merge in one object, remove undefined values, and make chains for methods that listed in objects.methods2chain with true value
  return {result, chains, presetArray};
}


class FField extends Component<any, any> {
  _dataProps: any = {};
  _builderData: any = {};
  _liveValidate: boolean;
  _forceRebuild = true;
  blocks: string[] = [];
  idPath: string[];
  id: string;
  presetProps: any;
  mainRef: any;
  _enumOptions: any;
  funcs: any;
  pFForm: any;
  // path: any;
  schemaPart: any;
  widgets: any;
  schemaProps: any;
  chains: any;
  pFField: any;
  bindObject: any;
  cached: any;
  cachedUpd: any;

  constructor(props: any, context: any) {
    super(props, context);
    const self = this;
    self._build();
    self._setDataProps(props.stateBranch[SymData]);
    self._setId();
  }

  focus(path: Path) {
    const self = this;
    self.mainRef && self.mainRef.focus && self.mainRef.focus(path); // path.length ? self.mainRef.focus(path) : self.mainRef.focus();
  }

  rebuild(path: Path) {
    const self = this;
    if (!path.length) {
      self._forceRebuild = true;
      self.forceUpdate()
    }
    self.mainRef && self.mainRef['rebuild'] && self.mainRef['rebuild'](path);
  }

  _setCachedValue(value: any) {
    const self = this;
    self.cached = {current: value};
    let fieldCache = self.pFForm.self.props.fieldCache;
    if (fieldCache === undefined || fieldCache === true) fieldCache = 40;
    if (fieldCache) {
      if (self.cachedUpd) clearTimeout(self.cachedUpd);
      self.cachedUpd = setTimeout(self._updateCachedValue.bind(self), fieldCache);
      const data = merge(self.props.stateBranch[SymData], {values: self.cached});
      const dataProps = self._dataProps;
      self._setDataProps(data);
      if (dataProps != self._dataProps) self.forceUpdate();
    } else self._updateCachedValue();
  }

  _updateCachedValue() {
    const self = this;
    self.cachedUpd = 0;
    if (self.cached) {
      const value = self.cached.current;
      self.pFForm.api.set(self.props.path + '/@/values/current', value === "" ? undefined : value, {execute: 1, noValidation: !self._liveValidate});
      self.cached = undefined;
    }
  }

  _build() {
    const isMultiSelect = (schema: any) => isArr(schema.items && schema.items.enum) && schema.uniqueItems;
    const isFilesArray = (schema: any) => schema.items && schema.items.type === "string" && schema.items.format === "data-url";
    const getPresetName = (schemaPart: any, type: string) => type == 'array' ? (isMultiSelect(schemaPart) ? 'multiselect' : isFilesArray(schemaPart) ? 'files' : 'array') : type;
    const getWidget = (objects: any, widget: any) => typeof widget === 'string' ? objects.widgets && objects.widgets[widget] || widget : widget;
    const getEnumOptions = (schemaPart: JsonSchema) => {
      if (!schemaPart.enum) return undefined;
      let result: any[] = [], vals: any[] = schemaPart.enum, names: any[] = schemaPart.enumNames || [];
      vals.forEach((value, i) => result[i] = {value, label: names[i] || value});
      return result;
    };

    const self = this;
    const pFForm = self.props.pFForm;

    const path = string2path(self.props.path);
    const schemaPart = getSchemaPart(pFForm.schema, path);
    const type = isArr(schemaPart.type) ? schemaPart.type[0] : schemaPart.type;
    const x = schemaPart.x || ({} as xType);
    const objects = pFForm.objects;
    const presets = objects.presets;
    const presetName = x.preset || getPresetName(schemaPart, type);
    const funcs: any = {};

    self.pFForm = pFForm;
    self.schemaPart = schemaPart;

    // funcs.onChange = (value: any) => {
    //   self.pFForm.api.set(self.props.path + '/@/values/current', value === "" ? undefined : value, {execute: 10, noValidation: !self._liveValidate});
    // };
    funcs.onChange = self._setCachedValue.bind(self);
    funcs.onBlur = (value: any) => {
      self.pFForm.api.set(self.props.path + '/@/status/touched', true, {execute: 10, noValidation: true});
      return !self._liveValidate ? self.pFForm.api.validate(self.props.path, {execute: 10}) : null;
    };
    funcs.onFocus = (value: any) => self.pFForm.api.set('/@/active', self.props.path, {execute: 10, noValidation: true});
    self.funcs = funcs;

    self.bindObject = {pFForm, schemaPart, field: self, funcs};
    Object.defineProperty(self.bindObject, "path", {get: function (): string {return self.props.path;}});
    let {result, chains} = getFieldBlocks(presetName, objects, x, {'Main': funcs}, self.bindObject);
    self.chains = chains;
    self.presetProps = result;

    self._enumOptions = getEnumOptions(schemaPart);
    const widgets = {}, schemaProps = {};
    self.blocks = objKeys(result.blocks).filter(key => result.blocks[key]);

    self.blocks.forEach((block: string) => {
      const {propsMap, widget, ...rest} = result[block];
      widgets[block] = widget;
      if (rest.refName) rest[rest.refName] = self._setRef.bind(self); // refName - name for ref-function, so put it if it exists
      schemaProps[block] = rest;  // all properties, except for several reserved names
    });

    self.widgets = widgets;
    self.schemaProps = schemaProps;
    self.pFField = {self, funcs, pFForm, schemaPart, widgets, schemaProps, chains};
    Object.defineProperty(self.pFField, "path", {get: function (): string {return self.props.path;}});
    self._forceRebuild = false;
  }

  _setId() {
    const self = this;
    const id = getIn(self.props.stateBranch, SymData, 'uniqId');
    let path = self.props.path;
    if (id && path != '#') {
      path = path.split('/');
      path[path.length - 1] = id;
      path = path.join('/')
    }
    self.id = self.props.pFForm.formName + '/' + path;
  };

  _setRef(item: any) {
    this.mainRef = item
  }


  _setDataProps(data: any) {
    const self = this;
    const dataProps = {};
    self.blocks.forEach((block: string) => dataProps[block] = mapProps(self.presetProps[block].propsMap, data, self.bindObject));
    self._dataProps = merge(self._dataProps, dataProps, {diff: true});
    self._liveValidate = data.params && data.params._liveValidate;
    self._enumOptions = self._enumOptions || data.enum;
  }

  shouldComponentUpdate(newProps: any) {
    const self = this;
    const oldProps = self.props;
    let equal = isEqual(oldProps, newProps, {skipKeys: ['path']});
    const data = newProps.stateBranch[SymData];
    if (oldProps.stateBranch[SymData] !== data) self._setDataProps(data);
    if (oldProps.path !== newProps.path) {
      const oldId = self.id;
      self._setId();
      if (oldId !== self.id) equal = false;
    }

    return !equal
  }

  render() {
    const self = this;
    if (self._forceRebuild || self.pFForm !== self.props.pFForm) this._build();
    const BuilderWidget = self.widgets['Builder'];
    return <BuilderWidget {...self.schemaProps['Builder']} {...self._dataProps['Builder']}
                          id={self.id} enumOptions={self._enumOptions} pFField={self.pFField} dataProps={self._dataProps} stateBranch={self.props.stateBranch}/>
  }
}

function mapProps(map: PropsMapType, data: BasicData, bindObject: any) {
  if (!map) return {};
  let result = {};
  let keys = objKeys(map).filter(key => map[key]);

  keys.forEach((to) => {
    let item: any = map[to];
    if (!isArr(item)) item = [item];
    let value = getIn(data, string2path(item[0]));
    // console.log('value', value);
    let fn: any = item[1];
    let path = string2path(to);
    let key = path.pop();
    let obj = getByKey(result, path);
    obj[key] = fn ? fn.bind(bindObject)(value) : value;
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
    const style = window && window.getComputedStyle(this.props.pFField.self.mainRef);
    if (!style || !this.elem) return;
    ['fontSize', 'fontFamily', 'fontWeight', 'fontStyle', 'letterSpacing'].forEach(key => this.elem.style[key] = style[key]);
  }

  render() {
    const self = this;
    const props = self.props;
    const value = (isUndefined(props.value) ? '' : props.value.toString()) || props.placeholder || '';
    return (<div style={sizerStyle as any} ref={(elem) => {
      (self.elem = elem) && (props.pFField.self.mainRef.style.width = ((elem as any).scrollWidth + (props.addWidth || 45)) + 'px')
    }}>{value}</div>)
  }
}

function TitleBlock(props: any) {
  const {id, title = '', required, useTag: UseTag = 'label', requireSymbol, emptyTitle, ...rest} = props;
  return (
    <UseTag {...(UseTag == 'label' ? {htmlFor: id} : {})} {...rest}>
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
    stateBranch,
    pFField,
    enumOptions,
    refName,
    ...rest
  }: { [key: string]: any } = props;
  UseTag = UseTag || (type == 'textarea' || type == 'select' ? type : 'input');
  const refObj: any = {};
  let ref = rest[refName];
  if (refName) delete rest[refName];
  if (typeof UseTag == 'string') refObj.ref = ref; else refObj[refName] = ref; // if "simple" tag then use ref else pass further in refName property
  const commonProps = {name: props.id, label: title || props.id.split('/').slice(-1)[0]}; //, onFocus: onFocus.bind(props), _onChange: _onChange.bind(props), onBlur: onBlur.bind(props)};
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
  else return (<UseTag {...rest} {...refObj} {...valueObj} type={type} {...commonProps}/>);
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
    refName,
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
  let ref = rest[refName];
  if (refName) delete rest[refName];
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
  const {useTag: UseTag = 'div', messageItem, messages = {}, itemsProps = {}, id, ...rest} = props;
  const {widget: WidgetMessageItem, ...restMessageItem} = messageItem;
  let keys = objKeys(messages);
  const result: any[] = [];
  const mergedMessages = merge(messages, itemsProps);
  keys.sort((a, b) => parseFloat(a) - parseFloat(b));
  keys.forEach((key) => {
    if (mergedMessages[key].hiddenBind === true || mergedMessages[key].hidden || !mergedMessages[key].textArray.length) return;
    result.push(<WidgetMessageItem key={key} message={mergedMessages[key]} {...restMessageItem} />)
  });
  return <UseTag {...rest}>{result}</UseTag>;
}

function MessageItem(props: any) {
  const {useTag: UseTag = 'div', message, ...rest} = props;
  //color={message.type}
  return <UseTag {...rest}>{message.textArray.join(<br/>)}</UseTag>
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
  const api = pFForm.api;
  let {useTag: UseButtonTag = 'button', type = 'button', onClick, titles, ...restButton} = buttonProps;
  const canChecks = {'first': canUp, 'last': canDown, 'up': canUp, 'down': canDown, 'del': canDel};
  buttons.forEach((key: string) => delete rest[key]);
  return (
    <UseTag {...rest}>
      {buttons.map((key: string) => {
        let KeyWidget = props[key];
        if (KeyWidget === false || canChecks[key] === undefined) return '';
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

/*function CombineWidgets(props: any) {
  function processWidget(key: string) {
    if (skip[key]) return false;
    const {widget: Widget, inner = {}, innerProps = [], addProps = [], extractProps = [], ...rest} : { [key: string]: any } = this[key];
    const {widget: InnerWidget, ...restInner} = inner;
    const widgetProps = {}, innerWidgetProps = {};
    addProps.forEach((propName: string) => widgetProps[propName] = props[propName]);
    innerProps.forEach((propName: string) => innerWidgetProps[propName] = props[propName]);
    push2array(props2remove, extractProps);
    return InnerWidget ? <Widget key={key} {...widgetProps} {...rest}><InnerWidget {...innerWidgetProps} {...restInner}/></Widget> : <Widget key={key} {...widgetProps} {...rest}/>
  }

  const {widget: Widget, before = {}, after = {}, skip = {}, GroupBlocks, ...rest} = props;
  const PrevWidget = props.FField.preset.getPropBefore('Main/widget', CombineWidgets);  // gets widget that was before CombineWidgets in presets chain
  const {widget: LayoutWidget, ...layoutRest} = GroupBlocks;
  const props2remove: string[] = [];
  const beforeWidgets = objKeys(before).sort().map(processWidget.bind(before));
  const afterWidgets = objKeys(after).sort().map(processWidget.bind(after));
  props2remove.forEach(key => delete rest[key]);
  return (
    <LayoutWidget {...layoutRest}>
      {beforeWidgets}
      <PrevWidget {...rest}/>
      {afterWidgets}
    </LayoutWidget>
  )
}*/

function selectorMap(opts: { keepHiddenValues?: boolean, skipFields?: string[], replaceFields?: { [key: string]: string } } = {}) { //skipFields: string[] = [], replaceFields: { [key: string]: string } = {}) {
  const skipFields = opts.skipFields || [];
  const replaceFields = opts.replaceFields || {};
  return function (value: any) {
    const {state, from, to, utils, api}: { state: StateType, from: PathItem, to: UpdateItem, utils: any, api: any } = this;
    let vals = (isArr(value) ? value.slice() : [value]).map(key => (replaceFields[key]) ? replaceFields[key] : key);
    const path = from.path.slice();
    const selectorField = path.pop();
    const stringPath = path2string(path);
    vals = vals.filter(key => get(state, stringPath + '/' + key));
    vals.push(selectorField);
    const getState = () => state;
    const options = {getState, skipFields, returnItems: true, execute: true};
    let result = opts.keepHiddenValues ? api.showOnly(stringPath + '/' + vals.join(','), options) : api.selectNshow(stringPath + '/' + vals.join(','), options);
    return new UpdateItems(result);
  }
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

function getArrayOfPropsFromArrayOfObjects(arr: any, propPath: string | Path) {
  propPath = val2path(propPath);
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

/////////////////////////////////////////////
//  basicObjects
/////////////////////////////////////////////


const basicObjects: formObjectsType & { extend: (obj: any) => any } = {
  extend: function (obj) {
    return merge(this, obj, {symbol: false}) // merge without symbols, as there (in symbol keys) will be stored cache data which MUST be recalculated after each extend
  },
  types: ['string', 'integer', 'number', 'object', 'array', 'boolean', 'null'],
  methods2chain: { // bind on<EventName> methods, so that it can access to previous method in chain by using this.on<EventName>
    'onBlur': true, 'onMouseOver': true, 'onMouseEnter': true, 'onMouseLeave': true, 'onChange': true, 'onSelect': true, 'onClick': true, 'onSubmit': true, 'onFocus': true, 'onUnload': true, 'onLoad': true
  },
  widgets: {
    // CombineWidgets: CombineWidgets,
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
    Section: Section,
    DivBlock: DivBlock,
    Autosize: AutosizeBlock,
  },
  presets: {
    '*': {
      blocks: {'Builder': true, 'Title': true, 'Body': true, 'Main': true, 'Message': true, 'GroupBlocks': true, 'ArrayItem': true, 'Autosize': false},
      // childrenBlocks: {},
      Autosize: {
        widget: 'Autosize',
        propsMap: {
          value: 'values/current',
          placeholder: 'params/placeholder',
        }
      },
      Array: {
        widget: 'Array',
        empty: {widget: 'EmptyArray'},
        addButton: {widget: 'AddButton'},
        propsMap: {
          length: 'array/lengths/current',
          canAdd: 'array/canAdd',
        },
      },
      ArrayItem: {
        widget: 'ArrayItem',
        itemMenu: {
          widget: 'ItemMenu',
          buttons: ['first', 'last', 'up', 'down', 'del'],
          buttonProps: {
            onClick: function (key: string) {
              this.pFForm.api.arrayItemOps(this.field.props.path, key, {execute: true})
            }
          }
        },
        propsMap: {itemData: 'arrayItem'}
      },
      Builder: {
        widget: 'Builder',
        propsMap: {
          hidden: ['controls', (controls: any) => getBindedValue(controls, 'hidden')],
        },
      },
      Layouts: {
        widget: 'DivBlock',
        className: 'fform-group-block',
      },
      GroupBlocks: {
        widget: 'DivBlock',
        className: 'fform-layout-block',
      },
      Body: {
        widget: 'DivBlock',
        className: 'fform-body-block',
      },
      Title: {
        widget: 'Title',
        useTag: 'label',
        requireSymbol: '*',
        propsMap: {
          required: 'schemaData/required',
          title: 'schemaData/title',
        },
      },
      Message: {
        widget: 'Messages',
        propsMap: {
          messages: 'messages',
          'itemsProps/0/hidden': ['status/touched', not],
          'itemsProps/1/hidden': ['status/touched', not],
          'itemsProps/2/hidden': 'status/pristine',
        },
        messageItem: {
          widget: 'MessageItem',
        },
      },
      Main: {
        widget: 'BaseInput',
        refName: 'getRef',
        propsMap: {
          value: 'values/current',
          autoFocus: 'params/autofocus',
          placeholder: 'params/placeholder',
          required: 'schemaData/required',
          title: 'schemaData/title',
          readOnly: ['controls', (controls: any) => getBindedValue(controls, 'readonly')],
          disabled: ['controls', (controls: any) => getBindedValue(controls, 'disabled')],
        }
      }
    },
    base: {
      Main: {
        onChange: function (event: any) {
          this.onChange(event.target.value)
        },
      }
    },
    string: {_: 'base', Main: {type: 'text'}},
    integer: {
      _: 'base',
      Main: {
        type: 'number',
        "$onChange": function (val: string) {
          this.onChange(!val ? undefined : parseInt(val))
        }
      }
    },
    number: {
      _: 'base',
      Main: {
        type: 'number',
        step: 'any',
        "$onChange": function (val: string) {
          this.onChange(!val ? undefined : parseFloat(val))
        }
      }
    },
    range: {_: 'base', Main: {type: 'range'}},
    'null': {Main: {type: 'hidden'}},
    hidden: {
      Builder: {
        hidden: true,
        propsMap: {hidden: false}
      }
    },
    booleanBase: {
      Main: {
        type: 'checkbox',
        onChange: function (event: any) {this.onChange(event.target.checked)}
      }
    },
    boolean: {
      _: 'booleanBase',
      Main: {
        widget: 'CheckboxInput',
      },
      Title: {emptyTitle: true},
    },
    tristateBase: {
      Main: {
        type: 'tristate',
        useTag: TristateBox
      }
    },
    tristate: {
      _: 'tristateBase',
      Main: {
        widget: 'CheckboxInput',
      },
      Title: {emptyTitle: true},
    },
    object: {
      blocks: {'Layouts': true},
      Main: {
        widget: 'Section',
        refName: 'ref',
        propsMap: {
          value: false,
          autoFocus: false,
          placeholder: false,
          required: false,
          title: false,
          readOnly: false,
          disabled: false,
        }
      },
      GroupBlocks: {useTag: 'fieldset'},
      Title: {useTag: 'legend'},
    },
    array: {
      _: 'object',
      blocks: {'Array': true},
      Main: {propsMap: {length: 'array/lengths/current'}},
      GroupBlocks: {useTag: 'fieldset'},
      Title: {useTag: 'legend'},
    },
    inlineTitle: {
      GroupBlocks: {
        style: {flexFlow: 'row'},
      }
    },
    select: {Main: {type: 'select', onChange: onSelectChange}},
    multiselect: {_: 'select', Main: {multiply: true}},
    arrayOf: {
      Main: {
        widget: 'ArrayInput',
        inputProps: {},
        labelProps: {},
        stackedProps: {},
        disabledClass: 'disabled',
      },
    },
    inlineItems: {Main: {stackedProps: false}},
    buttons: {Main: {inputProps: {className: 'button'}, labelProps: {className: 'button'}}},
    radio: {_: 'arrayOf', Main: {type: 'radio'}},
    checkboxes: {_: 'arrayOf', Main: {type: 'checkbox'}, fields: {'Layouts': false, 'Array': false}},
    //selector: {dataMap: [['./@/values/current', './', selectorOnChange(false)]]}, // {onChange: selectorOnChange(false)}},
    //tabs: {dataMap: [['./@/values/current', './', selectorOnChange(true)]]}, //{Main: {onChange: selectorOnChange(true)}},
    autosize: {
      blocks: {'Autosize': true},
      GroupBlocks: {style: {flexGrow: 0}},
    },
    flexRow: {
      Layouts: {style: {flexFlow: 'row'}}
    },
    noArrayItemButtons: {
      blocks: {ArrayItem: false},
    },
    noArrayButtons: {
      blocks: {Array: false},
    }
  },
  presetMap: {
    boolean: ['select', 'radio'],
    string: ['select', 'password', 'email', 'hostname', 'ipv4', 'ipv6', 'uri', 'data-url', 'radio', 'textarea', 'hidden', 'date', 'datetime', 'date-time', 'color', 'file'],
    number: ['select', 'updown', 'range', 'radio'],
    integer: ['select', 'updown', 'range', 'radio'],
    array: ['select', 'checkboxes', 'files'],
  },
  presetsCombineAfter: {
    radio: ['inlineItems', 'buttons'],
    checkboxes: ['inlineItems', 'buttons'],
    string: ['autosize'],
    number: ['autosize'],
    integer: ['autosize'],
    email: ['autosize'],
    password: ['autosize'],
    hostname: ['autosize'],
    uri: ['autosize'],
  },
  presetsCombineBefore: {
    radio: ['selector', 'tabs'],
    checkboxes: ['selector', 'tabs'],
    select: ['selector', 'tabs'],
  },
};


const buttonObject = {
  widget: function (props: any) {
    let {text = 'Submit', ...rest} = props;
    return <button {...rest}>{text}</button>
  }
};


function fformAPI(name: string) {return _CORES[name] && _CORES[name].api}

export {selectorMap, getFieldBlocks, basicObjects, FForm, FFormCore, fformAPI};

//module.exports = process.env.NODE_ENV === 'test' ? merge(module.exports, {}) : module.exports;

