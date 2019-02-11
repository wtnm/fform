import * as React from 'react';

import {FForm, fformObjects} from '../src/components';
import * as sampleSchema from './sampleSchema.json'
import * as style from '../addons/styles.json'

const {render} = require('react-dom');
//const {render} = require('preact');

const JSONValidator:any = require('../addons/is-my-json-valid-lite');

if (typeof window != 'undefined') {
  const container = document.querySelector('#root');
  let sampleObjects = fformObjects.extend(style).extend({
    'user': {
      set: function (path: string, value: any, opts: any) {
        this.api.set(path, value, opts)
      },
      focusInputChange: function (event: any) {
        this.api.set('./@/focusValue', event.target.value, {execute: true})
      },
      focusInput: function () {
        let focusInput = this.getRef('!focusInput');
        focusInput = focusInput.value;
        let target = this.pFForm.getRef(focusInput);
        if (!target) return alert('No target field');
        if (!target.focus) return alert('Target field has no focus');
        target.focus();
      }
    }
  });

  render(<div>
    <h3>FForm sample</h3>
    <div>
      <div>
        <FForm id="sampleForm" core={{schema: sampleSchema, name: "sampleForm", objects: sampleObjects, JSONValidator}}/>
      </div>
    </div>
  </div>, container);
}