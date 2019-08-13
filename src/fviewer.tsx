/** @jsx h */

import {createElement as h, Component} from 'react';
import {FField, FFormStateAPI} from "./fform";
import {getIn, isEqual, isUndefined, merge, objKeys, toArray} from "./commonLib";
import {objectResolver} from "./api";
import {isSelfManaged, SymData} from "./stateLib";


class FViewer extends Component<any> {
  protected _root: any;
  protected _form: any;
  api: any;
  parent: any;

  constructor(props: any, context: any) {
    super(props, context);
    const self = this;

  }

  private _setRootRef(FField: any) {
    this._root = FField;
  }

  private _setFormRef(form: any) {
    this._form = form;
  }


  shouldComponentUpdate(nextProps: FFormProps) {
    const self = this;
    self.parent = nextProps.parent;

    return !isEqual(self.props, nextProps, {skipKeys: ['parent']});
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
    return branch
  }

  getBranch(path: string) {
    return {} //this.api.get(path)
  }


  render() {
    const self = this;
    let {value, parent, _$useTag: UseTag = self.props.elements.widgets.Viewer || 'div', ...rest} = self.props;
    objKeys(rest).forEach(k => (k[0] === '_' || k[0] === '$') && delete (rest as any)[k]); // remove props that starts with '_' or '$'
    return (
      <UseTag ref={self._setFormRef} {...rest} >
        <FField ref={self._setRootRef} id={rest.id ? rest.id + '/#' : undefined} name={rest.name ? rest.name + '/#' : undefined} pFForm={self} getPath={FViewer._getPath} FFormApi={self.api}/>
      </UseTag>
    )
  }
}