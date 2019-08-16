/** @jsx h */

import {createElement as h, Component} from 'react';
import {FField, FFormStateAPI} from "./fform";
import {getIn, isArray, isEqual, isUndefined, merge, objKeys, toArray} from "./commonLib";
import {compileSchema} from "./api";
import {getSchemaPart, types, normalizePath, SymData, isSchemaSelfManaged, isSelfManaged, multiplePath, path2string, setUPDATABLE, string2path, mergeUPD_PROC} from "./stateLib";


class FViewer extends Component<FViewerProps> {
  protected _root: any;
  protected _form: any;
  protected _state: any;
  protected _customData: { [key: string]: anyObject };
  protected _customReplace: any;
  parent: any;
  schema: any;
  static readonly paramsBase: any = {viewer: true};
  static readonly paramsHidden: any = {viewer: true, hidden: true};

  get elements() {return this.props.elements}

  get api() {return this}

  constructor(props: FViewerProps, ...args: any[]) {
    super(props, ...args);
    const self = this;
    self.schema = compileSchema(props.schema, props.elements);
    self._setRootRef = self._setRootRef.bind(self);
    self._setFormRef = self._setFormRef.bind(self);
    self._customData = self._normalizeCustom(props.customData);
    self._customReplace = self._normalizeCustom(props.customReplace);
    self._state = self._value2state(props.value);
  }

  private _normalizeCustom(customData: { [key: string]: any } = {}) {
    const self = this;
    const _customData = {};
    objKeys(customData).forEach(key => {
      let pathes = multiplePath(normalizePath(key));
      objKeys(pathes).forEach((keyPath: string) =>
        _customData[path2string(pathes[keyPath])] = customData[key])
    });
    return _customData;
  }

  private _setRootRef(FField: any) {
    this._root = FField;
  }

  private _setFormRef(form: any) {
    this._form = form;
  }

  static _makeStateDataObj(schemaPart: any, type: string, newVal: any) {
    let dataObj: any = {oneOf: schemaPart._oneOfIndex || 0, schemaPart, fData: {type}, params: FViewer.paramsBase};
    let isSelf = isSchemaSelfManaged(schemaPart, type);
    if (isSelf) dataObj.value = newVal;
    else if (isArray(newVal)) dataObj.length = newVal.length;
    return dataObj
  }

  private _value2state(newVal: any, prevVal?: any, prevState?: any, track: Path = []) {
    const self = this;
    if (newVal === prevVal) return prevState;

    let type = types.detect(newVal);
    let schemaPart = getSchemaPart(self.schema, track, newVal);
    let dataObj = FViewer._makeStateDataObj(schemaPart, type, newVal);
    let pathKey = path2string(track);
    let mergeCustom = self._customData[pathKey];
    let state = {[SymData]: mergeCustom ? merge(dataObj, mergeCustom, {replace: getIn(self._customReplace, pathKey)}) : dataObj};
    if (!isSelfManaged(state)) objKeys(newVal).forEach(k =>
      state[k] = self._value2state(newVal[k], getIn(prevVal, k), getIn(prevState, k), track.concat(k)));

    return state
  }


  shouldComponentUpdate(nextProps: FViewerProps) {
    const self = this;
    self.parent = nextProps.parent;

    if (['elements', 'schema'].some(nm => self.props[nm] !== nextProps[nm]))
      self.schema = compileSchema(nextProps.schema, nextProps.elements);

    let prevState = self._state;

    if (self.props.customData !== nextProps.customData || self.props.customReplace !== nextProps.customReplace) {
      let prevCustom = self._customData;
      let prevReplace = self._customReplace;
      self._customData = self._normalizeCustom(nextProps.customData);
      self._customReplace = self._normalizeCustom(nextProps.customReplace);
      const dataUpdates = {update: {}, replace: {}, api: {}};
      objKeys(self._customData).forEach(key => {
        let path = string2path(key);
        let branch = getIn(self._state, path);
        if (branch && (prevCustom[key] !== self._customData[key] || prevReplace[key] !== self._customReplace[key]))
          setUPDATABLE(dataUpdates,
            merge(FViewer._makeStateDataObj(branch.schemaPart, branch.fData.type, branch.value),
              self._customData[key],
              {replace: getIn(self._customReplace, key)}),
            true,
            path, SymData);
      });
      self._state = mergeUPD_PROC(self._state, dataUpdates);
    }

    if (self.props.value !== nextProps.value) self._state = this._value2state(nextProps.value, self.props.value, self._state);
    
    if (self._root && prevState !== self._state) self._root.setState({branch: self._state});

    return !isEqual(self.props, nextProps, {skipKeys: ['parent', 'value', 'customData', 'customReplace']});
  }


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
    else return getIn(this.props.value, normalizePath(ffield.path))
  }

  getBranch(path: string) {
    return getIn(this._state, normalizePath(path))
  }

  getSchemaPart(path: string | Path) {
    return getIn(this._state, normalizePath(path), SymData, 'schemaPart');
  }

  render() {
    const self = this;
    let {value, parent, _$useTag: UseTag = self.props.elements.widgets.Viewer || 'div', ...rest} = self.props;
    objKeys(rest).forEach(k => (k[0] === '_' || k[0] === '$') && delete (rest as any)[k]); // remove props that starts with '_' or '$'
    return (
      <UseTag ref={self._setFormRef} {...rest} >
        <FField ref={self._setRootRef} id={rest.id ? rest.id + '/#' : undefined} name={rest.name ? rest.name + '/#' : undefined} pFForm={self} getPath={FViewer._getPath} FFormApi={self}/>
      </UseTag>
    )
  }
}

export {FViewer};