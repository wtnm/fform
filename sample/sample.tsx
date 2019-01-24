import * as React from 'react';

import {FForm, fformObjects} from '../src/components';
import * as sampleSchema from './sampleSchema.json'
import * as style from './style.json'

const {render} = require('react-dom');

if (typeof window != 'undefined') {
  const container = document.querySelector('#root');
  let sampleObjects = fformObjects.extend(style);

  render(<div>
    <h3>FForm sample</h3>
    <div>
      <div>
        <FForm id="sampleForm" core={{schema: sampleSchema, name: "sampleForm", objects: sampleObjects}}/>
      </div>
    </div>
  </div>, container);
}