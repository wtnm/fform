const React = require('react');
const $ = React.DOM;

const ou = require('./objectUtils');

const fields = require('./fields');
const normalise = require('./normalise');
const validator = require('./validate');


module.exports = React.createClass({
  displayName: 'Form',

  getInitialState: function () {
    const values = this.props.values;
    const errors = this.validate(this.props.schema, values, context(this.props));
    return {
      values: values,
      output: values,
      errors: errors
    };
  },
  componentWillReceiveProps: function (props) {
    const values = props.values || this.state.values;
    const output = props.values || this.state.output;
    this.setState({
      values: values,
      output: output,
      errors: this.validate(props.schema, output, context(props))
    });
  },
  setValue: function (path, raw, parsed) {
    const schema = this.props.schema;
    const ctx = context(this.props);
    const values = normalise(ou.setIn(this.state.values, path, raw), schema, ctx);
    const output = normalise(ou.setIn(this.state.output, path, parsed), schema, ctx);
    const errors = this.validate(schema, output, ctx);

    if (this.props.submitOnChange) {
      this.props.onSubmit(output, null, errors);
    }

    this.setState({
      values: values,
      output: output,
      errors: errors
    });
  },
  getValue: function (path) {
    return ou.getIn(this.state.values, path);
  },
  getErrors: function (path) {
    return this.state.errors[makeKey(path)];
  },
  validate: function (schema, values, context) {
    const validate = this.props.validate || validator;
    return hashedErrors(validate(schema, values, context));
  },
  preventSubmit: function (event) {
    event.preventDefault();
  },
  handleSubmit: function (event) {
    this.props.onSubmit(this.state.output,
      event.target.value,
      this.state.errors);
  },
  handleKeyPress: function (event) {
    if (event.keyCode === 13 && this.props.enterKeySubmits) {
      this.props.onSubmit(this.state.output, this.props.enterKeySubmits);
    }
  },
  renderButtons: function () {
    const submit = this.handleSubmit;

    if (typeof this.props.buttons === 'function') {
      return this.props.buttons(submit);
    }
    else {
      const buttons = (this.props.buttons || ['Cancel', 'Submit'])
        .map(function (value) {
          return $.input({
            type: 'submit',
            key: value,
            value: value,
            onClick: submit
          });
        });
      return $.p(null, buttons);
    }
  },
  render: function () {
    const renderedFields = fields.make(fields, {
      schema: this.props.schema,
      context: context(this.props),
      fieldWrapper: this.props.fieldWrapper,
      sectionWrapper: this.props.sectionWrapper,
      handlers: this.props.handlers,
      hints: this.props.hints,
      path: [],
      update: this.setValue,
      getValue: this.getValue,
      getErrors: this.getErrors
    });

    return $.form({
        onSubmit: this.preventSubmit,
        onKeyPress: this.handleKeyPress,
        className: this.props.className
      },
      this.props.extraButtons ? this.renderButtons() : $.span(),
      renderedFields,
      this.renderButtons());
  }
});

function hashedErrors(errors) {
  const result = {};
  let i, entry;
  for (i = 0; i < errors.length; ++i) {
    entry = errors[i];
    result[makeKey(entry.path)] = entry.errors;
  }
  return result;
}

function makeKey(path) {
  return path.join('_');
}

function context(props) {
  return props.context || props.schema;
}
