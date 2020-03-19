process.env.TS_NODE_PROJECT = './tsconfig.json';
require('ts-mocha');

const React = require('react');

const jsdom = require('jsdom');
const {window} = new jsdom.JSDOM('<!doctype html><html><body></body></html>');

const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
Enzyme.configure({adapter: new Adapter()});

const {expect} = require('chai');

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  });
}

global.window = window;
global.document = window.document;
global.navigator = {userAgent: 'node.js'};
global.requestAnimationFrame = function (callback) {
  return setTimeout(callback, 0);
};
global.cancelAnimationFrame = function (id) {
  clearTimeout(id);
};
copyProps(window, global);

function sleep(time) {return new Promise((resolve) => setTimeout(() => resolve(), time))}

async function submit(event) {
  event.preventDefault();
  let {value, fform} = event;
  await sleep(4);
  return new Promise((resolve, rejects) => {
    setTimeout(() => {
      const res = {};
      const warn = {};
      if (value.radioSelect !== 'option 1') res['radioSelect'] = ['value should be option 1', 'value option 1'];
      if (value.textarea !== 'textarea') warn['textarea'] = 'value should be "textarea"';
      let testMsg = ['test message', 'more test message'];
      testMsg[Symbol.for("FFormData")] = {priority: 2};
      resolve([testMsg, res, {[Symbol.for("FFormData")]: {priority: 1}}, {...warn, [Symbol.for("FFormData")]: {priority: 1}}]);
    }, 10)
  })
}

const {FForm, elements, fformCores} = require('../src/fform.tsx');
const sampleSchema = require('../sample/sampleSchema');
const basicStyling = require('../addons/styling/basic.json');

const jsonschemaWrapper = require('../addons/wrappers/jsonschema').default;
const JSValidator = require('jsonschema').Validator;
const JSJSONValidator = jsonschemaWrapper(new JSValidator());
const JSONValidator = JSJSONValidator;

const SymData = Symbol.for('FFormData');

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

const sampleElements = elements.extend([basicStyling, elemExtend]);

describe('FForm tests', function () {

  const core = fformCores({schema: sampleSchema, name: "sampleForm", elements: sampleElements, JSONValidator});
  const wrapper = Enzyme.mount(React.createElement(FForm, {
    value: {autowidth: 12, select: 'not in enum', array: ['v', 'a', ['val', false], [1, 2]]},
    id: "sampleForm",
    ref: (r) => window['main'] = r,
    onSubmit: {submit},
    core
  }, null));

  let field, button, arrKey, elemKey;

  it('test FForm init', async () => {


    field = wrapper.find('select[id="sampleForm/#/select"]');
    expect(field.props().value).to.be.equal('option 2');
    expect(field.props().disabled).not.to.be.ok;
    field = wrapper.find('input[id="sampleForm/#/autowidth"]');
    expect(field.props().value).to.be.equal(0);
    expect(field.props().disabled).not.to.be.ok;

    await sleep(10);
    wrapper.update();

    field = wrapper.find('select[id="sampleForm/#/select"]');
    expect(field.props().value).to.be.equal('not in enum');
    expect(field.props().disabled).not.to.be.ok;
    field = wrapper.find('input[id="sampleForm/#/autowidth"]');
    expect(field.props().value).to.be.equal(12);
    expect(field.props().disabled).not.to.be.ok;
  });

  it('test input change', async () => {
    field.simulate('change', {target: {value: 1}});
    wrapper.update();
    field = wrapper.find('input[id="sampleForm/#/autowidth"]');
    expect(field.props().value).to.be.equal(1);
    expect(field.props().disabled).not.to.be.ok;
  });

  it('test array values', async () => {
    arrKey = core.getState()['array']['2'][SymData].params.uniqKey;
    elemKey = core.getState()['array']['2']['0'][SymData].params.uniqKey;
    field = wrapper.find(`input[id="sampleForm/#/array/${arrKey}/${elemKey}"]`);
    expect(field.props().type).to.be.equal('text');
    expect(field.props().value).to.be.equal('val');
    expect(field.props().disabled).not.to.be.ok;

    elemKey = core.getState()['array']['2']['1'][SymData].params.uniqKey;
    field = wrapper.find(`input[id="sampleForm/#/array/${arrKey}/${elemKey}"]`);
    expect(field.props().type).to.be.equal('checkbox');
    expect(field.props().checked).to.be.equal(false);
    expect(field.props().disabled).not.to.be.ok;

    arrKey = core.getState()['array']['3'][SymData].params.uniqKey;
    elemKey = core.getState()['array']['3']['0'][SymData].params.uniqKey;
    field = wrapper.find(`input[id="sampleForm/#/array/${arrKey}/${elemKey}"]`);
    expect(field.props().type).to.be.equal('number');
    expect(field.props().value).to.be.equal(1);
    expect(field.props().disabled).not.to.be.ok;
  });

  it('test reseting', async () => {
    core.reset();
    await sleep(10);
    wrapper.update();

    arrKey = core.getState()['array']['2'][SymData].params.uniqKey;
    elemKey = core.getState()['array']['2']['0'][SymData].params.uniqKey;
    field = wrapper.find(`input[id="sampleForm/#/array/${arrKey}/${elemKey}"]`);
    expect(field.props().type).to.be.equal('text');
    expect(field.props().value).to.be.equal('string value');
    expect(field.props().disabled).not.to.be.ok;
  });

  it('test array items delete', async () => {
    button = wrapper.find(`button[data-key="add_0"]`);
    expect(button.props().disabled).to.be.ok;

    button = wrapper.find(`button[data-key="del"]`);
    expect(button.props().disabled).not.to.be.ok;
    button.simulate('click');
    await sleep(10);
    expect(core.getState()['array']['2'][SymData].length).to.be.equal(4);

    button.simulate('click');
    await sleep(10);
    wrapper.update();
    expect(core.getState()['array']['2'][SymData].length).to.be.equal(3);
    button = wrapper.find(`button[data-key="add_0"]`);
    expect(button.props().disabled).not.to.be.ok;

  })


});
