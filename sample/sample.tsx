import * as React from 'react';

import {FForm, elements} from '../src/fform';
import * as sampleSchema from './sampleSchema.json'
import * as style from '../addons/styles.json'

const {render} = require('react-dom');

import imjvWrapper from '../addons/imjvWrapper';

// const imjvValidator: any = require('../addons/is-my-json-valid-lite');
import * as imjvValidator from '../addons/is-my-json-valid-lite';

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


if (typeof window != 'undefined') {
  const container = document.querySelector('#root');
  let sampleElements = elements.extend([style, {
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
        <FForm id="sampleForm" onSubmit={submit} touched core={{schema: sampleSchema, name: "sampleForm", elements: sampleElements, JSONValidator}}/>
      </div>
    </div>
  </div>, container);
}