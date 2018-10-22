import * as React from 'react';
import {render} from 'react-dom';

import {FForm, FFormCore,} from './core/core';

import {FFormSchema, editFormObjects} from './FFEditor';
import FFView from './FFView';

import './core/core.scss';
import './tacit/main.scss';
import './styles.scss';


const objKeys = Object.keys;
const SymbolData = Symbol.for('FFormData');
const isUndefined = (value: any) => typeof value === "undefined";


function onMainFormChange(values: any) {
  console.log(values);
  //const result: any = form2text(values.form, __PREDEFINED__) || {};
  //result.definitions = form2text(values.definitions, __PREDEFINED__);
  //console.log(result)
}

if (typeof window != 'undefined') {
  const container = document.querySelector('#root');
  const constructorCore = new FFormCore({schema: FFormSchema, name: "FFormConstructor"});


  render(<div>
    <h3>FForm constructor</h3>
    <div className="flex-grid">
      <div className="col">
        <FForm className='FForm-cls' core={constructorCore} objects={editFormObjects} onChange={onMainFormChange}/>
      </div>
      <div className="col">
        <FFView/>
      </div>
    </div>
  </div>, container);
}
