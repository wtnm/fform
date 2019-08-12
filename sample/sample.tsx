import * as React from 'react';

import {FForm, elements, FFormStateAPI} from '../src/fform';
import * as sampleSchema from './sampleSchema.json'
import * as basicStyling from '../addons/styling/basic.json'
import * as bootstrapStyling from '../addons/styling/bootstrap.json'

const {render} = require('react-dom');

import imjvWrapper from '../addons/wrappers/imjv';

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
      if (value.radioSelect !== 'option 1') res['radioSelect'] = ['value should be option 1', 'value option 1'];
      if (value.textarea !== 'textarea') warn['textarea'] = 'value should be "textarea"';
      fform.api.setMessages(null, {priority: 1});
      fform.api.setMessages(warn, {priority: 1});
      resolve(res);
    }, 10)
  })
}

const cssSelectSchema = {
  "type": "string",
  "title": "Switch css framework:",
  "_presets": "radio:$inlineItems:$inlineTitle",
  "enum": [
    "tacit",
    "bootstrap"
  ]
};


class CssSelector extends React.Component<any, any> {
  state: any = {css: 'bootstrap'};
  cores: any = {};

  _setCss(css: string) {
    this.setState({css})
  }

  render() {
    const self = this;

    const sampleElements = elements.extend([basicStyling, self.state.css === 'bootstrap' ? bootstrapStyling : {}, {
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
    if (!self.cores[self.state.css]) {
      self.cores[self.state.css] = new FFormStateAPI({schema: sampleSchema as any, name: "sampleForm", elements: sampleElements, JSONValidator});
      self.cores[self.state.css].reset({status: 'untouched', value: 0});
    }
    return <div><FForm value={self.state.css} id="cssSelectorForm" onChange={self._setCss.bind(self)}
                       core={{schema: cssSelectSchema, name: "cssSelectorForm", elements: sampleElements}}/>
      <link rel="stylesheet" href="../addons/styling/fform.css"/>
      {self.state.css === 'bootstrap' ? [<link key="0" rel="stylesheet" href="../node_modules/bootstrap/dist/css/bootstrap.css"/>,
        <link key="1" rel="stylesheet" href="../addons/styling/bootstrap.fform.css"/>
      ] : self.state.css === 'tacit' ? [<link key="0" rel="stylesheet" href="./tacit.min.css"/>,
        <link key="1" rel="stylesheet" href="../addons/styling/tacit.fform.css"/>] : []}
      <h3>FForm sample</h3>
      <div>
        <div>
          <FForm value={{autowidth: 1, select: null}} id="sampleForm" ref={(r) => window['main'] = r}
                 onSubmit={submit} touched core={self.cores[self.state.css]}/>
        </div>
      </div>
    </div>

  }
}


if (typeof window != 'undefined') {
  const container = document.querySelector('#root');

//value={{autowidth: null}}
  render(<div style={{margin: '1em'}}>
    <CssSelector/>

  </div>, container);
}