import * as React from 'react';

import {FForm, fformObjects} from '../src/components';
import * as sampleSchema from './sampleSchema.json'
import * as style from '../addons/styles.json'

const {render} = require('react-dom');

import imjvWrapper from '../addons/imjvWrapper';

const imjvValidator: any = require('../addons/is-my-json-valid-lite');
const JSONValidator = imjvWrapper(imjvValidator);

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
        <FForm id="sampleForm" touched core={{schema: sampleSchema, name: "sampleForm", objects: sampleObjects, JSONValidator}}/>
      </div>
    </div>
  </div>, container);
}