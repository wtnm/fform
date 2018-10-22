'use strict';

const React = require('react');
const $ = React.DOM;

const normalizer = require('./utils/normalizer');
const parser = require('./utils/parser');


const Selection = React.createClass({
  displayName: 'Selection',

  normalize: function(text) {
    // XXXXX: assume string in case type isn't set
    const type = this.props.type || 'string';

    return normalizer[type](text);
  },
  parse: function(text) {
    // XXXXX: assume string in case type isn't set
    const type = this.props.type || 'string';

    return parser[type](text);
  },
  handleChange: function(event) {
    const val = this.normalize(event.target.value);
    this.props.update(this.props.path, val, this.parse(val));
  },
  render: function() {
    const names = this.props.names;

    return $.select(
      {
        name    : this.props.label,
        value   : this.props.value || this.props.values[0],
        onChange: this.handleChange,
        disabled: this.props.disabled
      },
      this.props.values.map(function(opt, i) {
        return $.option({ key: opt, value: opt }, names[i] || opt);
      }));
  }
});

module.exports = Selection;
