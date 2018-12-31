import * as React from "react";
// import {PropTypes} from "react"
// import {basicObjects} from './api';

const FormGroup = require('reactstrap/lib/FormGroup');

const reactstrapObjects: formObjectsType = {
  widgets: {
    section: 'Section',
    checkbox: "CheckboxWidget",
    radio: "RadioWidget",
    select: "SelectWidget",
    hidden: "HiddenWidget",
    text: "TextWidget",
    password: "PasswordWidget",
    email: "EmailWidget",
    hostname: "TextWidget",
    ipv4: "TextWidget",
    ipv6: "TextWidget",
    uri: "URLWidget",
    "data-url": "FileWidget",
    textarea: "TextareaWidget",
    date: "DateWidget",
    datetime: "DateTimeWidget",
    "date-time": "DateTimeWidget",
    "alt-date": "AltDateWidget",
    "alt-datetime": "AltDateTimeWidget",
    color: "ColorWidget",
    file: "FileWidget",
    updown: "UpDownWidget",
    range: "RangeWidget",
    checkboxes: "CheckboxesWidget",
    files: "FileWidget"
  },
  presetMap: {
    boolean: ['checkbox', 'select', 'radio'],
    string: ['text', 'select', 'password', 'email', 'hostname', 'ipv4', 'ipv6', 'uri', 'data-url', 'radio', 'textarea', 'hidden', 'date', 'datetime', 'date-time', 'alt-date', 'alt-datetime', 'color', 'file'],
    number: ['text', 'select', 'updown', 'range', 'radio', 'hidden'],
    integer: ['text', 'select', 'updown', 'range', 'radio', 'hidden'],
    array: ['section', 'select', 'checkboxes', 'files'],
    object: ['section'],
    'enum': ['select']
  },
};


export default reactstrapObjects;