import * as React from 'react';

import {FForm, elements} from '../src/fform';
import * as sampleSchema from './sampleSchema.json'
import * as style from '../addons/styles.json'
import * as bootstrap from '../addons/bootstrap.json'

const {render} = require('react-dom');

import imjvWrapper from '../addons/imjvWrapper';

// const imjvValidator: any = require('../addons/is-my-json-valid-lite');
import * as imjvValidator from '../addons/is-my-json-valid-lite';

const JSONValidator = imjvWrapper(imjvValidator);

function sleep(time: number) {return new Promise((resolve) => setTimeout(() => resolve(), time))}

async function submit(event: any, value: any, fform: any) {
  event.preventDefault();
  await sleep(200);
  alert(JSON.stringify(value, null, 2));
  return new Promise((resolve, rejects) => {
    setTimeout(() => {
      const res: any = {};
      const warn: any = {};
      if (value.radioSelect !== 'option 1') res['radioSelect'] = 'value should be option 1';
      if (value.textarea !== 'textarea') warn['textarea'] = 'value should be "textarea"';
      fform.api.setMessages(null, {priority: 1});
      fform.api.setMessages(warn, {priority: 1});
      resolve(res);
    }, 10)
  })
}


if (typeof window != 'undefined') {
  const container = document.querySelector('#root');
  let sampleElements = elements.extend([style, bootstrap, {
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
//value={{autowidth: null}}
  render(<div style={{margin: '1em'}}>
    <h3>FForm sample</h3>
    <div>
      <div>
        <FForm value={{autowidth: 1}} id="sampleForm" ref={(r) => window['main'] = r} onSubmit={submit} touched core={{schema: sampleSchema, name: "sampleForm", elements: sampleElements, JSONValidator}}/>
      </div>
      <button onClick={() => window['main'].submit()}>submit</button>
      <button onClick={() => window['main'].reset()}>reset</button>
    </div>
  </div>, container);
}