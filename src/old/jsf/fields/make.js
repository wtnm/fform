'use strict';

const React = require('react');

const ou = require('../objectUtils');

const resolve = require('../resolve');
const types = require('../types');
const wrapped = require('./utils/wrapped');


module.exports = function (fields, props) {
  const schema = resolve(props.schema, props.context);
  const hints = schema['x-hints'] || {};
  const inputComponent = ou.getIn(hints, ['form', 'inputComponent']);
  const disabled = ou.getIn(hints, ['form', 'disabled']);
  const hidden = ou.getIn(hints, ['form', 'hidden']);
  const key = props.path.join('_');

  props = ou.merge(props, {
    schema,
    key,
    label: key,
    value: props.getValue(props.path),
    errors: props.getErrors(props.path),
    type: schema.type,
    disabled,
    hidden
  });

  if (props.moveUp !== undefined) {
    if (props.isArrayItem) {
      delete(props.isArrayItem);
      delete(props.canMoveUp);
      delete(props.canMoveDown);
      delete(props.move);
      delete(props.moveUp);
      delete(props.moveDown);
    } else {
      props.isArrayItem = true;
    }
  }

  if (inputComponent) {
    props = ou.merge(props, {component: props.handlers[inputComponent]});
    return wrapped.field(props, React.createElement(fields.UserDefinedField, props));
  } else if (hints.fileUpload) {
    console.warn("DEPRECATION WARNING: built-in file upload will be removed");
    // FileField cannot depend on blocks directly (cyclic dependency)
    props = ou.merge(props, {fields: fields});
    return React.createElement(
      fields.FileField, ou.merge(props, {mode: hints.fileUpload.mode}));
  }
  else if (schema['oneOf']) return wrapped.section(props, types.alternative(fields, props));

  else if (schema['enum']) {
    props = ou.merge(props, {
      values: schema['enum'],
      names: schema['enumNames'] || schema['enum']
    });
    return wrapped.field(props, React.createElement(fields.Selection, props));
  }

  switch (schema.type) {
    case "boolean":
      return wrapped.field(props, React.createElement(fields.CheckBox, props));
    case "object" :
      return wrapped.section(props, types.object(fields, props));
    case "array"  :
      return wrapped.section(props, types.array(fields, props));
    case "number" :
    case "integer":
    case "string" :
    default:
      return wrapped.field(props, React.createElement(fields.InputField, props));
  }
};

// function makeKey(path) {
//   return path.join('_');
// }
