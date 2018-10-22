'use strict';

const React = require('react');

const normalizer = require('./utils/normalizer');
const parser = require('./utils/parser');


const UserDefinedField = React.createClass({
  displayName: 'UserDefinedField',

  normalize: function(text) {
    const n = normalizer[this.props.type];
    return n ? n(text) : text;
  },
  parse: function(text) {
    const p = parser[this.props.type];
    return p ? p(text) : text;
  },
  handleChange: function(value) {
    const text = this.normalize(value);
    this.props.update(this.props.path, text, this.parse(text));
  },
  handleKeyPress: function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  },
  render: function() {
    return React.createElement(this.props.component, {
      name      : this.props.label,
      schema    : this.props.schema,
      value     : this.props.value || '',
      onKeyPress: this.handleKeyPress,
      onChange  : this.handleChange
    });
  }
});

module.exports = UserDefinedField;
