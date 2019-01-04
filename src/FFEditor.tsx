import * as React from 'react';
import {render} from 'react-dom';
import {FForm, FFormStateAPI, selectorMap, basicObjects, getFieldBlocks,} from './core/components';

import {not, getIn, memoize, merge, push2array, isArray, isObject, isUndefined} from './core/commonLib'
import {stateUpdates, getBindedValue, string2NUpdate, getDefaultFromSchema, SymData} from './core/stateLib'

import {formValues2JSON, formObj2JSON, isFFieldSchema, isFGroupSchema, isFObjectSchema} from './constructorLib';
// import 'react-select/dist/react-select.css';

import {Creatable} from 'react-select';

const Select = require('react-select').default;

const objKeys = Object.keys;

const __EXTERNAL__: any = {};
__EXTERNAL__.schemas = {'test schema': {}, 'test schema 2': {}};
__EXTERNAL__.objects = {'test object': {}, 'test object 2': {}};

function getPresets(values: string[] = [], fieldType: string) {
  // let values = getValue(this.pFForm.api.get(this.path + '/@/values')) || [];
  let result: string[] = [];
  if (!values.length) {
    if (fieldType) result = editFormObjects.presetMap[fieldType] || [];
  } else {
    values.forEach((value: string) => push2array(result, editFormObjects.presetsCombineBefore[value] || []));
    values.forEach((value: string) => push2array(result, editFormObjects.presetsCombineAfter[value] || []));
  }
  return result.map((value: string) => {return {value, label: value}});
}

class SelectPresetsWidget extends React.Component<any, any> {
  render() {
    const props = this.props;
    let {
      useTag: UseTag = Creatable,
      value = [],
      title,
      stateBranch,
      pFField,
      enumOptions,
      refName,
      fieldType,
      ...rest
    }: { [key: string]: any } = props;
    const refObj: any = {};
    let ref;
    if (refName) {
      delete rest[refName];
      ref = rest[refName];
    }
    const commonProps = {name: props.id, label: title || props.id.split('/').slice(-1)[0]};
    let {pFForm} = pFField;
    const options = getPresets(value, fieldType);
    // console.log(value);
    return (<UseTag value={value.map((value: string) => {return {value, label: value}})} options={options} {...rest} {...commonProps}/>);
  }
}


class loadableSelectWidget extends React.Component<any, any> {
  options: any[] = [];

  constructor(props: any, context: any) {
    super(props, context);
    const self = this;
    self._loadOptions = self._loadOptions.bind(self);
    self._onChange = self._onChange.bind(self);
  }

  _loadOptions() {
    const self = this;
    self.options = self.props.loadOption();
    self.forceUpdate();
  }

  _onChange(options: any) {
    const self = this;
    if (self.props.replaceOnChange) self.props.replaceOnChange(options);
    else {
      const pFField = self.props.pFField;
      const {pFForm, path} = this.props.pFField;
      pFForm.api.set(path + '/@/value', isArray(options) ? options.map((item: any) => item.value) : options && options.value, {execute: 1})
    }
    // self.options = [];
    self.forceUpdate();
  }

  render() {
    const self = this;
    const props = this.props;
    const {pFField, loadOption, onChange, value = [], ...rest} = props;
    return (<div className='fform-body-block'>
      <Select value={isArray(value) ? value.map((value: string) => {return {value, label: value}}) : {value, label: value}}
              options={self.options} onChange={self._onChange} onMenuOpen={self._loadOptions} {...rest} />
    </div>)
  }
}


class moveToSelectWidget extends React.Component<any, any> {
  options: any[] = [];

  constructor(props: any, context: any) {
    super(props, context);
    const self = this;
    self._loadOptions = self._loadOptions.bind(self);
    self._onChange = self._onChange.bind(self);
  }

  _loadOptions() {
    const self = this;
    const parent = getTopParent(self.props.pFField.pFForm.parent);
    const fields = parent.pFForm.api.getValue().object.fields;
    self.options = [];
    for (let i = 0; i < fields.length; i++) {
      let field = fields[i];
      if (isFFieldSchema(field)) self.options.push({value: i, label: i + ': ' + (field.name || 'no name') + ' - ' + (field.type || 'no type')})
    }
    self.forceUpdate();
  }

  _onChange(option: any) {
    const self = this;
    const parent = getTopParent(self.props.pFField.pFForm.parent);
    const fieldsApi = parent.pFForm.api;
    const fieldsPath = parent.self.props.path.split('/').slice(0, -1).join('/') + '/' + option.value;
    let obj = fieldsApi.get(fieldsPath + '/@/value');
    fieldsApi.arrayItemOps(fieldsPath, 'del', {execute: 1});
    self.props.pFField.pFForm.api.arrayAdd('#/object/fields', [obj]);
    self.options = [];
    self.forceUpdate();
  }

  render() {
    const self = this;
    const props = this.props;
    const {pFField, ...rest} = props;
    return (<div className='fform-body-block'>
      <Select {...rest} value='' options={self.options} onChange={self._onChange} onMenuOpen={self._loadOptions} closeMenuOnSelect={true} isClearable={false}/>
    </div>)
  }
}


let editFormObjects = basicObjects.extend({
  methods2chain: {loadOptions: true},
  presets: {
    '*': {
      GroupBlocks: {className: 'fform-layout-block layout-elem'},
      Array: {addButton: {className: 'array-add-button white-button'}, empty: {className: 'array-empty'}},
      ArrayItem: {
        buttons: ['up', 'down', 'del'],
        up: () => <span>&uarr;</span>,
        down: () => <span>&darr;</span>,
        del: () => <span>×</span>,
        itemMain: {className: 'property-array-item-menu array-item'},
        itemMenu: {className: 'array-item-menu'},
        itemBody: {className: 'array-item-body'},
        buttonProps: {
          className: 'white-button',
          titles: {'del': 'delete'},
          onClick: function (key: string) {
            this.pFForm.api.arrayItemOps(this.field.path, key, {execute: true})
          }
        }
      }
    },
    'object': {GroupBlocks: {className: 'fform-layout-block layout-object'}},
    'array': {GroupBlocks: {className: 'fform-layout-block layout-array'}},
    'inlineTitle': {Title: {className: 'fform-inline-title-block'}},
    'boolean': {GroupBlocks: {className: 'fform-inline-title-block fform-layout-block layout-elem'}},
    'tristate': {GroupBlocks: {className: 'fform-inline-title-block fform-layout-block layout-elem'}},
    'preset-select': {
      GroupBlocks: {className: 'fform-layout-block layout-elem preset-select'},
      Main: {
        widget: SelectPresetsWidget,
        isMulti: true,
        onChange: function (values: any) {
          let vals = values.map((item: any) => item.value);
          this.pFForm.api.set(this.field.path + '/@/value', vals, {execute: 1});
        },
        _propsMap: {
          fieldType: 'fieldType'
        }
      }
    }
  }
});


function getAllBlocks(objects: any) {
  let _blocks = {};
  objKeys(objects.presets).forEach(key => _blocks = merge(_blocks, objects.presets[key]._blocks));
  return objKeys(_blocks);
}


const moveToSelectObject = {
  widget: moveToSelectWidget,
  pFField: 'pFField',
  placeholder: 'Select field to move here...',
  className: 'preset-select',
};


const arrayAddButtonObject = {
  widget: (props: any) => {
    const {text: Text = 'add', ...rest}: { [key: string]: any } = props;
    return <button {...rest}>{typeof Text == 'function' ? <Text/> : Text}</button>
  },
  type: 'button',
  _propsMap: {disabled: 'addDisabled'},
  className: "white-button array-add-button",
};

const expandButtonObject = {
  widget: (props: any) => {
    const {expanded, ...rest} = props;
    return <button {...rest}>{props.expanded ? <span>&minus;</span> : '+'} </button>
  },
  onClick: function (key: string) {
    let path = this.field.path + '/@/expanded';
    this.pFForm.api.set(path, !this.pFForm.api.get(path), {execute: true})
  },
  _propsMap: {expanded: 'expanded', disabled: 'expandedDisabled'},
  type: 'button',
  className: "white-button collapse-_props-button",
};

const addButtonsObject = {
  widget: (props: any) => {
    const {text, onClick, buttonProps, fieldType, addOnlyFields, ...rest} = props;
    if (addOnlyFields) return (<span {...rest}><button onClick={onClick(getDefaultFromSchema(JSONSchema))} {...buttonProps}>+field</button></span>);
    if (fieldType == 'object' || fieldType == 'array') return (
      <span {...rest}>
        <button onClick={onClick(getDefaultFromSchema(JSONSchema))} {...buttonProps}>+field</button>
        <button onClick={onClick(getDefaultFromSchema(groupSchema))} {...buttonProps}>+group</button>
        <button onClick={onClick(getDefaultFromSchema(objectSchema))} {...buttonProps}>+object</button>
      </span>);
    return false;
  },
  onClick: function (obj: string) {
    const path = this.field.path + '/object/fields';
    const api = this.pFForm.api;
    const opts = {execute: true};  // , obj, obj, obj, obj, obj, obj, obj, obj, obj, obj
    const value = [obj];
    return function () {
      api.arrayAdd(path, value, opts)
    }
  },
  className: 'property-array-item-menu',
  buttonProps: {
    type: 'button',
    className: "white-button collapse-_props-button",
  },
  _propsMap: {fieldType: 'fieldType'},
};

function getTopParent(parent: any) {
  while (parent) {
    if (isFFieldSchema(parent.pFForm.api.getValue())) break;
    parent = parent.pFForm.parent
  }
  return parent
}


const topMoveButtonObject = {
  widget: (props: any) => {
    const {text, onClick, buttonProps, pFField, ...rest} = props;
    const parent = getIn(pFField.pFForm, 'parent');
    if (parent && parent.pFForm.api.getValue().hasOwnProperty('xtend')) return (<span {...rest}><button onClick={onClick(getDefaultFromSchema(JSONSchema))} {...buttonProps}>↰</button></span>);
    return false;
  },
  onClick: function (obj: string) {
    const groupApi = this.pFForm.parent.pFForm.api;
    const groupField = this.pFForm.parent;
    const parent = getTopParent(this.pFForm.parent);
    const fieldsApi = parent.pFForm.api;
    const fieldsPath = parent.path.split('/').slice(0, -1).join('/');
    //const opts = {num: 1, values: [obj], execute: true};  // , obj, obj, obj, obj, obj, obj, obj, obj, obj, obj
    return function () {
      let obj = groupApi.get(groupField.path + '/@/value');
      groupApi.arrayItemOps(groupField.path, 'del', {execute: 1});
      fieldsApi.arrayAdd(fieldsPath, [obj]);
    }
  },
  passPFField: 'pFField',
  className: 'property-array-item-menu',
  buttonProps: {
    type: 'button',
    className: "white-button collapse-_props-button",
  }
};


const itemMenuObject = {
  widget: editFormObjects.widgets['ItemMenu'],
  buttons: ['up', 'down', 'del'],
  buttonProps: {
    onClick: function (key: string) {this.pFForm.api.arrayItemOps(this.field.path, key, {execute: true})},
    className: 'white-button',
    titles: {'del': 'delete'}
  },
  _propsMap: {itemData: 'arrayItem'},
  passPFField: 'pFField',
  className: 'property-array-item-menu',
  up: () => <span>&uarr;</span>,
  down: () => <span>&darr;</span>,
  del: () => <span>×</span>
};

//const itemMenuObjectLargeArrows = merge(itemMenuObject, {up: () => <span>&uArr;</span>, down: () => <span>&dArr;</span>, del: () => <span>&#9587;</span>});
const itemMenuObjectParent = merge(itemMenuObject, {
  buttonProps: {
    onClick: function (key: string) {
      this.pFForm.parent.pFForm.api.arrayItemOps(this.pFForm.parent.path, key, {execute: true})
    }
  }
});

function objectXtend_isObject(value: any) {
  return value == 'object'
}

function objectXtend_isExpandable(value: any) {
  return value == 'array' || value == 'object'
}

const objectXtendDefinition: { [key: string]: jsJsonSchema; } = {
  objectXtend: {
    type: "object",

    ff_fields: [{
      fields: [expandButtonObject,
        'name',
        'type',
        'external',
        'value',
        merge(arrayAddButtonObject, {onClick: function () {this.pFForm.api.arrayAdd(this.field.path + '/valueArray', 1, {execute: true}) }}),
        itemMenuObject],
      style: {flexFlow: 'row'}
    }
    ],
    ff_dataMap: [['./@/expanded', './valueArray/@/controls/hidden', not]],
    ff_data: {expanded: false},
    properties: {
      name: {
        type: "string",
        ff_placeholder: 'Enter name...',
        // controls: {hiddenBind: false, omitBind: false},
        ff_custom: {
          _blocks: {Array: false}, //false
        }

      },
      type: {
        // title: 'type',
        type: "string",
        'default': 'string',

        ff_preset: 'select',
        // controls: {hiddenBind: false, omitBind: false},
        ff_dataMap: [
          ['./@/value', '../@/expanded', objectXtend_isExpandable],
          ['./@/value', '../valueArray/@/controls/hidden', (values: any) => !objectXtend_isExpandable(values)],
          ['./@/value', '../value/@/controls/readonly', objectXtend_isExpandable],
          ['./@/value', '../@/expandedDisabled', (values: any) => !objectXtend_isExpandable(values)],
          ['./@/value', '../@/addDisabled', (values: any) => !objectXtend_isExpandable(values)],
          ['./@/value', '../external/@/controls/hidden', (values: any) => !objectXtend_isObject(values)],
          ['./@/value', '../value/@/controls/hidden', (values: any) => objectXtend_isObject(values)],
        ],

        'enum': ['string', 'unescaped', 'array', 'object']
      },
      value: {
        type: "string",
        ff_placeholder: 'Enter value...',
        // controls: {hiddenBind: false, omitBind: false},
        ff_custom: {GroupBlocks: {style: {flex: '10 1'}}}

      },
      external: {
        type: "array",
        ff_placeholder: 'Select external objects...',
        ff_preset: '*',
        ff_custom: {
          Main: {
            widget: loadableSelectWidget,
            passPFField: 'pFField',
            closeMenuOnSelect: true,
            isClearable: true,
            isMulti: true,
            className: 'preset-select',
            _propsMap: {value: 'value'},
            // onChange: function (values: any) {
            //   let vals = values.map((item: any) => item.value);
            //   this.pFForm.api.set(this.field._props.path + '/@/value', vals, {execute: 1});
            // },
            loadOption: function () {return __EXTERNAL__ && __EXTERNAL__.objects ? objKeys(__EXTERNAL__.objects).map(item => {return {value: item, label: item}}) : []}
          },
          GroupBlocks: {style: {flex: '10 1'}}
        },
        ff_props: {managed: true}
      },
      valueArray: {
        type: 'array',
        ff_custom: {
          _blocks: {Array: false},
          GroupBlocks: {className: 'object-xtend-array'}
        },
        items: {
          ff_custom: {_blocks: {ArrayItem: false}},
          $ref: '#/definitions/objectXtend'
        }
      }
    }
  },
};

const objectXtendSchema = {
  definitions: objectXtendDefinition,

  $ref: '#/definitions/objectXtend',
  ff_custom: {Main: {className: 'object-xtend'}},
  type: 'object',
  properties: {
    name: {ff_params: {hidden: true}},
    value: {ff_params: {hidden: true}},
    type: {'default': 'object', ff_params: {hidden: true}},
  }

};


const JSONBlockEditorSelect = {
  type: "object",
  title: '',
  properties: {
    _blocks: {
      type: 'string',
      'enum': getAllBlocks(editFormObjects),
      ff_preset: 'radio:buttons:inlineItems',
      ff_custom: {GroupBlocks: {style: {flex: '0 0 auto'}}}
    },
  }
};

declare type objectXtendType = { type: string, valueArray: objectXtendType[], value: any, name?: string }

class ObjectEditor extends React.Component<any, any> {
  objectXtendCore: any;
  formValue: any;
  emptyObject = {type: 'undefined', valueArray: [], value: '', name: ''};

  constructor(props: any, context: any) {
    super(props, context);
    const self = this;
    self.objectXtendCore = new FFormStateAPI({schema: objectXtendSchema, name: props.id + ' => objectXtend'});
    self._onChange = self._onChange.bind(self);

  }

  _onChange(obj: any) {
    const self = this;
    self.props.onChange(obj);
  }

  render() {
    const props = this.props;
    let {
      _objects,
      title,
      stateBranch,
      values,
      pFField,
      enumOptions,
      refName,
      onChange,
      onBlur,
      onFocus,
      ...rest
    }: { [key: string]: any } = props;
    const self = this;
    let block_vals = values || self.objectXtendCore.getDefaultVals('inital');
    return <FForm className="object-xtend" widget="div" core={self.objectXtendCore} objects={_objects} values={block_vals} onChange={self._onChange} {...rest}/>;
  }
}


function FFormWidget(props: any) {
  let {
    _objects,
    title,
    stateBranch,
    pFField,
    enumOptions,
    refName,
    onBlur,
    onFocus,
    ...rest
  }: { [key: string]: any } = props;
  return <FForm widget="div" objects={_objects} {...rest}/>;
}


function value2formArray(value: any) {
  function getType(val: any) {
    if (isArray(val)) return 'array';
    if (isObject(val)) return 'object';
    if (typeof val === 'string') return 'string';
    return 'unescaped'
  }

  function recurse(value: any): objectXtendType {
    const type = getType(value);
    let valueArray: any[] = [];
    if (type == 'array' || type == 'object') {

      valueArray = objKeys(value).map(key => {
        const result = recurse(value[key]);
        if (type == 'object') result.name = key;
        return result
      });
      value = JSON.stringify(value);
    }
    return {type, valueArray, value}
  }

  return recurse(value)
}

function formArray2value(obj: objectXtendType): any {
  function recurse(obj: objectXtendType): any {
    if (obj.type == 'string') return obj.value || '';
    if (obj.type == 'unescaped') {
      let res;
      try {
        res = eval(obj.value);
      } catch (e) {
        res = obj.value || '';
      }
      return res;
    }
    if (obj.type == 'array') return obj.valueArray && obj.valueArray.map(item => recurse(item)) || [];
    if (obj.type == 'object') {
      const res = {};
      obj.valueArray && obj.valueArray.forEach(item => item.name && (res[item.name] = recurse(item)));
      return res;
    }
  }

  return recurse(obj)
}

class PresetBlockEditor extends React.Component<any, any> {
  switcherCore: any;
  objectXtendCore: any;
  presetValues: string[];
  fieldBlocks: any;
  rawValues: any = {};
  sameObject: any = {}; //any = {type: 'undefined', valueArray: [], value: '', name: ''};
  _values: any;

  constructor(props: any, context: any) {
    super(props, context);
    const self = this;
    self.switcherCore = new FFormStateAPI({schema: JSONBlockEditorSelect, name: props.id + ' => propSelect'});
    // self.objectXtendCore = new FFormStateAPI({schema: objectXtend, name: 'objectXtend/' + _props.id});
    self._onEditorChange = self._onEditorChange.bind(self);
    self._onSwitchChange = self._onSwitchChange.bind(self);
  }

  _onSwitchChange(value: any) {
    const {pFForm, path} = this.props.pFField;
    pFForm.api.set(path + '/@/propSelected', value, {execute: true})
  }

  _onEditorChange(value: any) {
    const {pFForm, path} = this.props.pFField;
    const propSelected = this.props.propSelected;
    if (propSelected && propSelected._blocks) pFForm.api.set(path + '/@/value/' + propSelected._blocks, value, {execute: 1});

  }

  render() {
    const self = this;
    const props = self.props;
    let {
      _objects,
      values,
      propSelected,
      switcherProps,
      objectEditorProps,
      pFField
    }: { [key: string]: any } = props;

    // self._values = merge(self._values, {base: values['base'][propSelected._blocks], ...getIn(values, 'addon', propSelected._blocks)});
    return (<div>
      <FForm widget="div" core={self.switcherCore} objects={_objects} values={propSelected} onChange={self._onSwitchChange} {...switcherProps}/>
      {propSelected && propSelected._blocks &&
      <ObjectEditor id={props.id} _objects={_objects} values={values && values[propSelected._blocks]}
                    {...objectEditorProps} onChange={self._onEditorChange}/>}
    </div>)
  }
}

class fieldPropsWidget extends React.Component<any, any> {
  fieldPropsCore: any;

  constructor(props: any, context: any) {
    super(props, context);
    const self = this;
    //self._onChange = self._onChange.bind(self);
  }

  // _onChange(values: any) {
  //   const {pFForm, path} = this._props.pFField;
  //   pFForm.api.set(path + '/@/values', values, {execute: 1, replace: true});
  // }

  _makeCore() {
    const self = this;
    if (self.fieldPropsCore) return;
    // console.log('making api ', self._props.id);
    const props = self.props;
    if (props.hidden === false || props.makeCore)
      self.fieldPropsCore = new FFormStateAPI({schema: fieldPropsSchema, name: props.id + ' => fieldProps'});
  }

  render() {
    const self = this;
    const props = self.props;
    let {
      values,
      _objects,
      hidden,
    }: { [key: string]: any } = props;
    // console.log('values', values);
    self._makeCore();
    if (!self.fieldPropsCore) return null;
    // console.log('get values', values);
    return <FForm widget="div" objects={_objects} core={self.fieldPropsCore} rawValues={values} onChange={valueOnChange(self.props.pFField)}/>
  }
}

const basicMainFunc = () => {};
const coreFuncs = {'Main': {onChange: basicMainFunc, onFocus: basicMainFunc, onBlur: basicMainFunc}};

function presetValuesHandler(presetsValue: string[] = [], props: MapPropsType) {
  const {getFromState, pathTo} = props;
  // const to = makePathItem(pathTo);
  let curValue = getFromState(pathTo);
  // let curValue = utils.get(state, to.toString() + '/current');
  if (!isArray(presetsValue)) presetsValue = [];
  let result: any[] = [];
  let presets = presetsValue.join(',');
  // console.log('curValue', curValue);
  if (!curValue || presets != curValue['presets']) {
    let fieldBlocks = presets == '' ? {} : getFieldBlocks(presets, editFormObjects, {}, coreFuncs, {}).result;
    let res = {};
    objKeys(fieldBlocks).forEach(key => res[key] = {base: fieldBlocks[key]});
    // res['base'] = fieldBlocks;
    res['presets'] = presets;
    //let minLength = (to.keyPath || []).length + to.path.length;
    //result.push({path: pathTo, value: res, opts: {replace: (path: Path) => {return path.length > minLength && path[path.length - 1] === 'base'}}});
    result.push({path: pathTo, value: res, replace: true});
  }
  return new stateUpdates(result);
}

function setVisiblePropsHandler(value: string, props: MapPropsType) {
  const {getFromState, path, pathTo} = props;
  const from = string2NUpdate(pathTo);
  let show: any = ['commonProps'];
  if (value === 'string') show.push('stringProps');
  if (value === 'number' || value === 'integer') show.push('numberProps');
  if (value === 'array') show.push('arrayProps');
  if (value === 'object') show.push('objectProps');
  show = from.path.slice(0, -1).join('/') + '/jsonProps/' + show.join(',') + '/@/controls/hidden';
  // const getState = () => state;
  // let result = api.showOnly(show, {getState, returnItems: true, execute: true});

  return new stateUpdates([{path: show, value: false, macros: 'setMultiply'}, {path: show, value: true, macros: 'setAllBut'}]);
}


const fieldPropsSchema = {
  type: "object",
  ff_custom: {GroupBlocks: {className: 'field-properties'}},
  ff_params: {
    hidden: false,
    omit: false,
  }
  ,
  properties: {
    hidden: {
      type: "object",
      ff_preset: 'hidden',
      ff_props: {managed: true},
      ff_dataMap: [
        ['./@/value/fieldType', '../xProps/preset/@/fieldType'],
        ['./@/value/fieldType', '../xProps/preset/@/value', () => []],
        // ['./@/value/fieldType', '../xProps/custom/@/value', presetValuesHandler],
        ['./@/value/fieldType', '../jsonProps/', setVisiblePropsHandler]
      ]
    },
    jsonProps: {
      title: 'JSON Schema _props:',
      type: "object",
      properties: {
        commonProps: {
          type: "object",
          ff_preset: 'object:flexRow',
          ff_fields: ['title', 'description', 'default', 'ref',],
          properties: {
            ref: {
              type: 'string',
              title: '$ref',
              ff_placeholder: '',
              ff_preset: 'string:inlineTitle'
            },
            title: {
              type: "string",
              // title: 'Title',
              ff_placeholder: 'Title',
              ff_preset: 'string'
            },
            description: {
              type: "string",
              // title: 'Description',
              ff_placeholder: 'Description',
              ff_preset: 'string:inlineTitle'
            },
            'default': {
              type: "string",
              title: 'Default',
              ff_placeholder: 'Default',
              ff_preset: 'string:inlineTitle'
            },
          }
        },
        stringProps: {
          type: "object",
          ff_preset: 'object:flexRow',
          ff_fields: ['minLength', 'maxLength', 'format', 'pattern'],
          ff_params: {hidden: true},
          properties: {
            minLength: {
              title: 'Length: min',
              type: "integer",
              minimum: 0,
              'default': 0,
              ff_preset: 'integer:autosize:inlineTitle'
            },
            maxLength: {
              title: 'max',
              type: "integer",
              minimum: 0,
              ff_preset: 'integer:autosize:inlineTitle'
            },
            pattern: {title: 'Pattern', type: "string", ff_preset: 'string:inlineTitle', ff_custom: {GroupBlocks: {style: {flexGrow: 10}}}},
            format: {
              title: 'Format',
              type: "string",
              'enum': ['date-time', 'date', 'time', 'email', 'ipv4', 'ipv6', 'uri', 'color', 'hostname', 'phone', 'utc-millisec', 'alpha', 'alphanumeric'],
              ff_placeholder: 'Select format...', ff_preset: 'select:inlineTitle'
            }
          }
        },
        numberProps: {
          type: "object",
          ff_preset: 'object:flexRow',
          ff_fields: ['multipleOf', 'minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum', {widget: 'DivBlock', style: {flexGrow: 10}}],
          ff_params: {hidden: true}
          ,
          properties: {
            multipleOf: {
              title: 'Multiple of',
              type: "number",
              minimum: 0,
              exclusiveMinimum: true,
              ff_preset: 'number:autosize:inlineTitle'
            },
            maximum: {
              title: 'max',
              type: "number",
              ff_preset: 'number:autosize:inlineTitle'
            },
            exclusiveMaximum: {
              title: 'Exclusive max',
              type: "boolean",
              'default': false,
              ff_preset: 'boolean:inlineTitle'
            },
            minimum: {
              title: 'min',
              type: "number",
              ff_preset: 'number:autosize:inlineTitle'
            },
            exclusiveMinimum: {
              title: 'Exclusive min',
              "type": "boolean",
              "default": false,
              ff_preset: 'boolean:inlineTitle'
            },
          }
        },
        arrayProps: {
          type: "object",
          ff_preset: 'object:flexRow',
          ff_fields: ['additionalItems', 'minItems', 'maxItems', 'uniqueItems'],
          ff_params: {hidden: true},
          properties: {
            additionalItems: {
              title: 'Items: additional',
              "type": "number",
              'enum': [0, 1, 2],
              'enumNames': ['false', 'true', 'object'],
              ff_preset: 'radio:buttons:inlineItems:inlineTitle',
              ff_custom: {GroupBlocks: {style: {flexGrow: 0}}}
            },
            minItems: {
              title: 'min',
              type: 'integer',
              "default": 0,
              ff_preset: 'integer:autosize:inlineTitle',
            },
            maxItems: {
              title: 'max',
              type: 'integer',
              ff_preset: 'integer:autosize:inlineTitle',
            },
            uniqueItems: {
              title: 'Unique items',
              type: "boolean",
              "default": false,
              ff_preset: 'boolean'
            },
          }
        },
        objectProps: {
          type: "object",
          ff_preset: 'object',
          ff_fields: [{fields: ['additionalProperties', 'minProperties', 'maxProperties', 'required'], style: {flexFlow: 'row'}}],
          ff_params: {hidden: true},
          properties: {
            required: {
              title: 'required',
              type: "string",
              ff_preset: 'string:inlineTitle',
              ff_custom: {GroupBlocks: {style: {flexGrow: 10}}}
            },
            minProperties: {
              title: 'min',
              type: 'integer',
              "default": 0,
              ff_preset: 'integer:autosize:inlineTitle',
            },
            maxProperties: {
              title: 'max',
              type: 'integer',
              ff_preset: 'integer:autosize:inlineTitle',
            },
            additionalProperties: {
              title: 'Props: additional',
              "type": "number",
              'enum': [0, 1, 2],
              'enumNames': ['false', 'true', 'object'],

              ff_preset: 'radio:buttons:inlineItems:inlineTitle',
              ff_custom: {GroupBlocks: {style: {flex: '0 0 auto'}}}

            },
            dependencies: {
              title: 'Dependencies',
              "type": "string",

              ff_preset: 'string:inlineTitle',
              ff_custom: {GroupBlocks: {style: {flexGrow: 10}}}

            }
          }
        },
      }
    },
    xProps: {
      title: 'Extended _props:',
      type: "object",
      ff_preset: 'object',
      ff_fields: [{fields: ['preset', 'flattenBool', 'flatten'], style: {flexFlow: 'row'}}],
      properties: {
        preset: {
          type: 'array',
          title: 'preset',
          ff_preset: 'preset-select:inlineTitle',
          ff_props: {managed: true},
          ff_dataMap: [
            ['./@/value', '../custom/@/value', presetValuesHandler]
          ]

        },
        flattenBool: {
          type: 'boolean',
          title: 'flatten',
          ff_preset: 'boolean:inlineTitle',
          ff_custom: {GroupBlocks: {style: {flexGrow: 0}}}
        },
        flatten: {
          type: 'string',
          //title: 'flatten',
          ff_preset: 'string:inlineTitle',
        },
        validators: {
          type: 'array',
          title: 'Validators',
          ff_custom: {
            Array: {
              empty: {text: ''},
              addButton: {text: 'Add new validator'}
            }

          },
          items: {
            type: "string",
            ff_custom: {_blocks: {ArrayItem: true}},
          }
        },
        dataMap: {
          type: 'array',
          title: 'Data Maps',
          ff_custom: {
            Array: {
              empty: {text: ''},
              addButton: {text: 'Add new data map'}
            }
          },

          items: {
            'default': ['', '', ''],
            type: "array",
            items: [
              {type: 'string', ff_placeholder: 'From path...', ff_custom: {_blocks: {ArrayItem: false}}},
              {type: 'string', ff_placeholder: 'Destination path...', ff_custom: {_blocks: {ArrayItem: false}}},
              {type: 'string', ff_placeholder: 'Function', ff_custom: {_blocks: {ArrayItem: false}}},
            ],
            minItems: 3,
            additionalItems: false,
            ff_custom: {_blocks: {ArrayItem: true}, Main: {style: {flexFlow: 'row'}}},
          }
        },
        custom: {
          type: "object",
          title: 'custom',
          'default': {},
          ff_custom: {
            Main: {
              widget: PresetBlockEditor,
              _objects: editFormObjects,
              _propsMap: {
                values: 'value',
                propSelected: 'propSelected',
                presetValues: 'presetValues',
              }
            },
          },
          //values: {},
          ff_data: {propSelected: ''},
          ff_props: {managed: true}
        },
        params: {
          type: "object",
          title: 'params',
          ff_preset: 'object:flexRow',
          ff_fields: ['autofocus', 'liveValidate', 'placeholder'],

          properties: {
            autofocus: {
              type: 'boolean',
              title: 'autofocus',
              ff_preset: 'boolean'
            },
            liveValidate: {
              type: 'boolean',
              title: 'liveValidate',
              ff_preset: 'boolean'
            },
            placeholder: {
              type: 'string',
              title: 'placeholder',
              ff_preset: 'string:inlineTitle',
              ff_custom: {GroupBlocks: {style: {flex: '10 1 auto'}}}

            },
          }
        },
        controls: {
          type: "object",
          title: 'controls',
          ff_preset: 'object:flexRow',
          ff_fields: ['readonly', 'disabled', 'hidden', 'norender',],

          properties: {
            readonly: {
              title: 'readonly',
              type: 'boolean',
              ff_preset: 'tristate'
            },
            disabled: {
              title: 'disabled',
              type: 'boolean',
              ff_preset: 'tristate'
            },
            hidden: {
              title: 'hidden',
              type: 'boolean',
              ff_preset: 'tristate'
            },
            norender: {
              title: 'norender',
              type: 'boolean',
              ff_preset: 'tristate'
            },
          }
        }
      }
    }
  }
};


const valueOnChange: any = memoize(function (pFField: any) {
  const set = pFField.pFForm.api.set;
  const opts = {replace: true};
  return (value: any) => {
    set(pFField.path + '/@/value', value, opts)
  }
});

const getAllPropsFromObject: any = memoize(function (obj: any, type: 'object' | 'function' | string = 'object', prefix: string = '',) {
  let res: string[] = [];
  objKeys(obj).forEach(key => (typeof obj[key] == type) && res.push(prefix + key));
  return res
});


function fieldObjectSelector(props: any) {
  let {_objects, value, id = '', pFField, arrayItem, refName, ...rest} = props;
  let schema, name = '';
  let ref = rest[refName];
  if (isFGroupSchema(value)) {
    schema = groupSchema;
    name = 'FGroup';
  } else if (isFFieldSchema(value)) {
    schema = JSONSchema;
    name = 'FField';
  } else {
    schema = objectSchema;
    name = 'FObject';
  }
  return <FForm ref={ref} widget="div" className={name + '-cls'} core={{name: id + ' => ' + name, schema}} extData={{'/@/arrayItem': arrayItem}}
                parent={pFField} objects={_objects} value={value} onChange={valueOnChange(pFField)}/>
}

const fieldsObject: jsJsonSchema = {
  type: "array",
  ff_custom: {
    GroupBlocks: {className: 'layout-array-property'},
    Array: {
      empty: {text: 'No properties'},
      addButton: {text: false},
    },
    //_blocks: {ArrayItem: false}
  }
  ,
  items: {
    type: "object",
    ff_custom: {
      Main: {
        widget: fieldObjectSelector,
        _objects: editFormObjects,
        _propsMap: {
          value: 'value',
          arrayItem: 'arrayItem',
        }
      }, _blocks: {ArrayItem: false}
    },
    ff_props: {managed: true}
  },
};


const objectSchema: jsJsonSchema = {
  definitions: objectXtendDefinition,
  $ref: '#/definitions/objectXtend',
  type: "object",

  ff_fields: [{
    fields: [expandButtonObject,
      'name',
      'type',
      'external',
      'value',
      merge(arrayAddButtonObject, {onClick: function () {this.pFForm.api.arrayAdd(this.field.path + '/valueArray', 1, {execute: true}) }}),
      itemMenuObjectParent],
    style: {flexFlow: 'row'}
  }],
  ff_custom: {Main: {className: 'object-xtend'}, _blocks: {ArrayItem: false}}
  ,
  properties: {
    name: {ff_params: {hidden: true}},
    value: {ff_params: {hidden: true}},
    type: {'default': 'object', ff_params: {hidden: true}},
  }
};


const groupSchema: jsJsonSchema = {
  definitions: objectXtendDefinition,
  type: "object",
  ff_preset: 'object',
  ff_fields: [{
    style: {flexFlow: 'row'},
    fields: [expandButtonObject,
      moveToSelectObject,
      addButtonsObject,
      itemMenuObjectParent]
  },
    'xtend',
    'object'
  ],
  ff_dataMap: [['./@/expanded', './xtend/@/controls/hiddenBind', not]],
  ff_custom: {Main: {className: 'object-xtend'}, _blocks: {ArrayItem: false}},
  ff_data: {fieldType: 'object'},
  properties: {
    xtend: {
      $ref: '#/definitions/objectXtend',
      type: 'object',
      properties: {
        name: {ff_params: {hidden: true}},
        value: {ff_params: {hidden: true}},
        type: {'default': 'object', ff_params: {hidden: true}},
      }
    },
    object: {
      type: 'object',
      properties: {
        fields: fieldsObject
      }
    }
  }
};

const fieldItemDefinition: jsJsonSchema = {
  type: "object",
  ff_preset: 'object',
  ff_fields: [{
    style: {flexFlow: 'row'},
    fields: [merge(expandButtonObject, {
      onMouseEnter: function () {
        this.pFForm.api.set(this.field.path + '/fieldProps/@/controls/makeCore', true, {execute: 1})
      }
    }),
      'name',
      addButtonsObject,
      'type',
      'schema',
      topMoveButtonObject,
      itemMenuObjectParent]
  }],
  ff_dataMap: [['./@/expanded', './fieldProps/@/controls/hidden', not]],
  ff_custom: {_blocks: {ArrayItem: false}},
  // expanded:true
  properties: {
    name: {
      type: "string",
      ff_preset: 'string',
      ff_placeholder: 'Enter field name...',
      ff_params: {
        hidden: false,
      },
    },
    type: {
      type: "string",
      'default': 'string',
      ff_preset: 'select:selector',
      ff_placeholder: 'Select type...',
      ff_params: {
        hidden: false,
      },
      ff_custom: {
        GroupBlocks: {style: {flex: '0 1', marginLeft: '0.5em'}},
      },
      ff_dataMap: [
        ['./@/value', '../fieldProps/@/value/hidden/fieldType'],
        ['./@/value', '../@/fieldType'],
        ['./@/value', './', selectorMap({skipFields: ['name', 'fieldProps'], replaceFields: {'array': 'object'}})],
        ['./@/value', '../fieldProps/@/controls/hiddenBind', (val: any) => val === 'schema' ? true : undefined],
      ],
      'enum': editFormObjects.types.concat('schema')
    },
    fieldProps: {
      type: 'object',
      ff_custom: {
        Main: {
          widget: fieldPropsWidget,
          _objects: editFormObjects,
          _propsMap: {
            values: 'values',
            makeCore: 'controls/makeCore',
            hidden: ['controls', (controls: any) => getBindedValue(controls, 'hidden')],
          }
        },
        Builder: {
          hiddenStyle: {visibility: 'hidden', height: 0}
        }
      },
      ff_props: {managed: true},
    },
    schema: {
      type: 'string',
      ff_placeholder: 'Select schema...',
      ff_custom: {
        Main: {
          widget: loadableSelectWidget,
          passPFField: 'pFField',
          // ff_placeholder: 'Select schema...',
          closeOnSelect: true,
          isClearable: true,
          // isMulti: true,
          className: 'preset-select',
          _propsMap: {
            value: 'value',
          },
          loadOption: function () {
            return __EXTERNAL__ && __EXTERNAL__.schemas ? objKeys(__EXTERNAL__.schemas).map(item => {return {value: item, label: item}}) : []
          }
        },
      },

    },
    object: {
      type: 'object',
      properties: {
        fields: fieldsObject
      }
    }
  }
};

const JSONSchema: jsJsonSchema = {
  definitions: {fieldItem: fieldItemDefinition},
  $ref: '#/definitions/fieldItem'
};

const JSONSchemaForm: jsJsonSchema = {
  definitions: {fieldItem: fieldItemDefinition},
  $ref: '#/definitions/fieldItem',
  properties: {
    name: {ff_placeholder: 'Enter form name...'},
    type: {'enum': editFormObjects.types}
  }
};

const JSONDefinitionsSchema: jsJsonSchema = {
  definitions: {fieldItem: fieldItemDefinition},
  $ref: '#/definitions/fieldItem',
  ff_preset: 'object',
  ff_fields: [{
    style: {flexFlow: 'row'},
    fields: [{widget: () => <legend style={{paddingTop: '0.2em'}}>Definitions:</legend>}, merge(addButtonsObject, {addOnlyFields: true}), 'type']
  }],
  properties: {
    name: {ff_params: {hidden: true}},
    schema: {ff_params: {hidden: true}},
    type: {'default': 'object', ff_params: {hidden: true,}},
    object: {
      properties: {
        fields: {
          ff_custom: {
            Array: {
              empty: {text: false},
              addButton: {text: false},
            },
          }
        }
      }
    }
  }
};

const FFormSchema: jsJsonSchema = {
  type: 'object',
  properties: {
    definitions: {
      type: 'object',
      ff_custom: {
        Main: {
          widget: FFormWidget,
          _objects: editFormObjects,
          core: new FFormStateAPI({schema: JSONDefinitionsSchema, name: 'FFormSchema/definitions'})
        }
      },
    },
    form: {
      title: 'Form:',
      type: 'object',
      ff_custom: {
        Main: {
          widget: FFormWidget,
          _objects: editFormObjects,
          core: new FFormStateAPI({schema: JSONSchemaForm, name: 'FFormSchema/form'})
        }

      },
      //$ref: '#/definitions/fieldItem'
    }
  }
};


export {fieldPropsSchema, JSONSchema, FFormSchema, editFormObjects};