'use strict';

const React = require('react');
const $ = React.DOM;

const normalizer = require('./utils/normalizer');
const parser = require('./utils/parser');


const InputField = React.createClass({
  displayName: 'InputField',

  normalize: function(text) {
    return normalizer[this.props.type](text);
  },
  parse: function(text) {
    return parser[this.props.type](text);
  },
  handleChange: function(event) {
    const text = this.normalize(event.target.value);
    this.props.update(this.props.path, text, this.parse(text));
  },
  handleKeyPress: function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  },
  render: function() {
    return $.input({
      type      : "text",
      disabled  : this.props.disabled,
      hidden    : this.props.hidden,
      name      : this.props.label,
      value     : this.props.value || '',
      onKeyPress: this.handleKeyPress,
      onChange  : this.handleChange });
  }
});

module.exports = InputField;
