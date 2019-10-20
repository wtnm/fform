import * as React from 'react';

import {FForm, elements, FFormStateAPI} from '../src/fform';
import sampleSchema from './sampleSchema.json'
import basicStyling from '../addons/styling/basic.json'
import bootstrapStyling from '../addons/styling/bootstrap.json'
import {FViewer} from '../src/fviewer'

const {render} = require('react-dom');

import imjvWrapper from '../addons/wrappers/imjv';

import * as imjvValidator from '../addons/is-my-json-valid-lite';
import {objKeys} from "../src/commonLib";

const JSONValidator = imjvWrapper(imjvValidator);

function sleep(time: number) {return new Promise((resolve) => setTimeout(() => resolve(), time))}

async function submit(event: any) {
  event.preventDefault();
  let {value, fform} = event;
  await sleep(200);
  alert(JSON.stringify(value, null, 2));
  return new Promise((resolve, rejects) => {
    setTimeout(() => {
      const res: any = {};
      const warn: any = {};
      const SymData = Symbol.for("FFormData");
      if (value.radioSelect !== 'option 1') res['radioSelect'] = ['value should be option 1', 'value option 1'];
      if (value.textarea !== 'textarea') warn['textarea'] = 'value should be "textarea"';
      let testMsg = ['test message', 'more test message'];
      testMsg[SymData] = {priority: 2};
      resolve([testMsg, res, {[SymData]: {priority: 1}}, {...warn, [SymData]: {priority: 1}}]);
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

const viewerData = {
  '0': {value: {autowidth: 123, select: 'option 3'}},
  '1': {value: {autowidth: 243523, select: 'option 2', radioSelect: 'option 1', booleanNullLeft: null, array: ['val 1', 'val 2']}},
  '2': {
    value: {select: '3', booleanNullLeft: null, array: ['another', 'else', ['one', 2, false]]},
    customData: {'select': {'fData': {'enum': ['0', '1', '2', '3'], 'enumExten': {'0': {label: 'label 0'}, '1': {label: 'label 1'}, '2': {label: 'label 2'}, '3': {label: 'label 3'}}}}}
  },

};

const viewerSelectSchema = {
  "type": "string",
  "title": "Switch data for viewer:",
  "_presets": "radio:$inlineItems:$inlineTitle",
  "enum": objKeys(viewerData),
};

const elemExtend = {
  'user': {
    focusInput() {
      let focusInput = this.getRef('!focusInput');
      focusInput = focusInput.value;
      let target = this.pFForm.getRef(focusInput);
      if (!target) return alert('No target field');
      if (!target.focus) return alert('Target field has no focus');
      target.focus();
    },
    clearMessages() {
      this.api.setMessages(null);
    }
  }
};

let formRef: any;

class CssSelector extends React.Component<any, any> {
  state: any = {css: 'bootstrap', viewerIdx: '1'};
  cores: any = {};
  elements: any = {};

  _setCss({value: css}: any) {
    this.setState({css})
  }

  _setViewerData({value: viewerIdx}: any) {
    this.setState({viewerIdx})
  }

  render() {
    const self = this;
    if (!self.elements[self.state.css])
      self.elements[self.state.css] = elements.extend([
        basicStyling,
        self.state.css === 'bootstrap' ? bootstrapStyling : {},

        elemExtend]);
    const sampleElements = self.elements[self.state.css];

    // console.log('sampleSchema', sampleSchema);

    if (!self.cores[self.state.css])
      self.cores[self.state.css] = {schema: sampleSchema as any, name: `sampleForm[${self.state.css}]`, elements: sampleElements, JSONValidator};
    //self.cores[self.state.css].reset({status: 'untouched', value: 0});

    return <div><FForm value={self.state.css} id="cssSelectorForm" onChange={self._setCss.bind(self)}
                       core={{schema: cssSelectSchema, name: "cssSelectorForm", elements: sampleElements}}/>
      {self.state.css === 'bootstrap' ? [<link key="0" rel="stylesheet" href="../node_modules/bootstrap/dist/css/bootstrap.css"/>,
        <link key="fform.css" rel="stylesheet" href="../addons/styling/fform.css"/>,
        <link key="1" rel="stylesheet" href="../addons/styling/bootstrap.fform.css"/>
      ] : self.state.css === 'tacit' ? [<link key="0" rel="stylesheet" href="./tacit.min.css"/>,
        <link key="fform.css" rel="stylesheet" href="../addons/styling/fform.css"/>,
        <link key="1" rel="stylesheet" href="../addons/styling/tacit.fform.css"/>] : []}

      <h3>FForm sample</h3>
      <div>
        <FForm value={{autowidth: 1, select: 'not in enum', array: ['v', 'a', ['val', false], [1, 2]]}} id="sampleForm" ref={(r: any) => window['main'] = r}
               onSubmit={submit} touched core={self.cores[self.state.css]}/>
      </div>
      <br/><br/>
      <h3>FViewer sample</h3>
      <div>
        <FForm ref={(r: any) => formRef = r} value={self.state.viewerIdx} id="viewerDataSelectorForm" onChange={self._setViewerData.bind(self)}
               core={{schema: viewerSelectSchema, name: "viewerDataSelectorForm", elements: sampleElements}}/>
        <FViewer {...viewerData[self.state.viewerIdx]} schema={sampleSchema} elements={sampleElements}/>
        <button onClick={() => formRef.submit()}>Submit</button>
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