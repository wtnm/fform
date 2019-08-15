/** @jsx h */

import {createElement as h, Component} from 'react';
import {FField, FFormStateAPI} from "./fform";
import {getIn, isArray, isEqual, isUndefined, merge, objKeys, toArray} from "./commonLib";
import {compileSchema} from "./api";
import {getSchemaPart, types, normalizePath, SymData, isSchemaSelfManaged, isSelfManaged} from "./stateLib";


class FViewer extends Component<FViewerProps> {
  protected _root: any;
  protected _form: any;
  protected _state: any;
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
    this._state = this._value2state(props.value);
  }


  private _setRootRef(FField: any) {
    this._root = FField;
  }

  private _setFormRef(form: any) {
    this._form = form;
  }

  private _value2state(newVal: any, prevVal?: any, prevState?: any, track: Path = []) {
    if (newVal === prevVal) return prevState;
    let type = types.detect(newVal);
    let schemaPart = getSchemaPart(this.schema, track, newVal);
    let isSelf = isSchemaSelfManaged(schemaPart, type);
    let isHidden = false;
    let dataObj: any = {oneOf: schemaPart._oneOfIndex || 0, schemaPart, fData: {type}, params: isHidden ? FViewer.paramsHidden : FViewer.paramsBase}
    if (isSelf) {
      dataObj.value = newVal;
      return {[SymData]: dataObj}
    } else {
      if (isArray(newVal)) dataObj.length = newVal.length;
      let state = {[SymData]: dataObj};
      objKeys(newVal).forEach(k => state[k] = this._value2state(newVal[k], getIn(prevVal, k), getIn(prevState, k), track.concat(k)))
      return state
    }
  }


  shouldComponentUpdate(nextProps: FViewerProps) {
    const self = this;
    self.parent = nextProps.parent;
    if (['elements', 'schema'].some(nm => self.props[nm] !== nextProps[nm]))
      self.schema = compileSchema(nextProps.schema, nextProps.elements);
    if (self.props.value !== nextProps.value) {
      self._state = this._value2state(nextProps.value, self.props.value, self._state);
      if (self._root) self._root.setState({branch: self._state})
    }
    return !isEqual(self.props, nextProps, {skipKeys: ['parent', 'value']});
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
    return getIn(this._state, normalizePath(path)) //this.api.get(path)
  }

  getSchemaPart(path: string | Path) {
    return getIn(this._state, normalizePath(path), SymData, 'schemaPart');
    //path = normalizePath(path);
    //return getSchemaPart(this.schema, path, this.props.value)
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