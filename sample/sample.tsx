import * as React from 'react';

import {FForm, fformObjects} from '../src/components';
import * as sampleSchema from './sampleSchema.json'
import * as style from '../addons/styles.json'

const {render} = require('react-dom');

import imjvWrapper from '../addons/imjvWrapper';
import {rejects} from "assert";

const imjvValidator: any = require('../addons/is-my-json-valid-lite');
const JSONValidator = imjvWrapper(imjvValidator);

function submit(event: any, value: any, fform: any) {
  event.preventDefault();
  return new Promise((resolve, rejects) => {
    setTimeout(() => {
      const res: any = {};
      const warn: any = {};
      if (value.radioSelect !== 'option 1') res['radioSelect'] = 'value should be option 2';
      if (value.textarea !== 'textarea') warn['textarea'] = 'value should be "textarea"';
      fform.api.setMessages(null, {priority: 1});
      fform.api.setMessages(warn, {priority: 1});
      resolve(res);
    }, 10)
  })
}

// function (event, value, fform) {
//   event.preventDefault();
//   var valid = fform.valid;
//   return new Promise((resolve, rejects) => {
//     setTimeout(() => {
//       var res = {};
//       var warn = {};
//       if (value.submitError !== 'submit') res['submitError'] = 'submit validation not passed';
//       if (value.submitWarn !== 'warn') warn['submitWarn'] = 'submit warning';
//       fform.api.setMessages(null, {priority: 1});
//       fform.api.setMessages(warn, {priority: 1});
//       if (valid && !Object.keys(res).length) alert('Validation passed');
//       resolve(res);
//     }, 10)
//   })
// }

if (typeof window != 'undefined') {
  const container = document.querySelector('#root');
  let sampleObjects = fformObjects.extend([style, {
    'user': {
      focusInput: function () {
        let focusInput = this.getRef('!focusInput');
        focusInput = focusInput.value;
        let target = this.pFForm.getRef(focusInput);
        if (!target) return alert('No target field');
        if (!target.focus) return alert('Target field has no focus');
        target.focus();
      }
    }
  }]);

  render(<div>
    <h3>FForm sample</h3>
    <div>
      <div>
        <FForm id="sampleForm" onSubmit={submit} touched core={{schema: sampleSchema, name: "sampleForm", objects: sampleObjects, JSONValidator}}/>
      </div>
    </div>
  </div>, container);
}