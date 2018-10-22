const React = require('react');
const $ = React.DOM;

const ou = require('../objectUtils');

const types = require('../types');
const wrapped = require('./utils/wrapped');


const FileField = React.createClass({
  displayName: 'FileField',

  loadFile: function(event) {
    const reader = new FileReader();
    const file = event.target.files[0];
    const val = ou.merge(this.props.getValue(this.props.path), {
      name: file.name,
      type: file.type,
      size: file.size
    });

    this.props.update(this.props.path, val, val);

    reader.onload = function(event) {
      val.data = event.target.result;
      this.props.update(this.props.path, val, val);
    }.bind(this);

    if (file) {
      if (this.props.mode === 'dataURL') {
        reader.readAsDataURL(file);
      }
      else {
        reader.readAsText(file);
      }
    }
  },
  render: function() {
    const fields = this.props.fields || {};
    const value = this.props.value || {};
    const list = [
      $.input({ key: "input", type: "file", onChange: this.loadFile }),
      $.dl({ key: "fileProperties" },
           $.dt(null, "Name"), $.dd(null, value.name || '-'),
           $.dt(null, "Size"), $.dd(null, value.size || '-'),
           $.dt(null, "Type"), $.dd(null, value.type || '-'))
    ];

    return wrapped.section(this.props, list.concat(types.object(fields, this.props)));
  }
});

module.exports = FileField;

