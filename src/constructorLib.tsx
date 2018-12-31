import {fieldPropsSchema} from './FFEditor';
import {getIn, merge, push2array, getCreateIn} from "./core/commonLib";

const objKeys = Object.keys;
const symbolMarker = '#@>';

type formObjectType = {
  "name": string,
  "type": string,
  "value": any,
  "external"?: string[],
  "valueArray": formObjectType[]
}

function isFFieldSchema(values: any) {return values.hasOwnProperty('object') && !values.hasOwnProperty('xtend')}

function isFGroupSchema(values: any) {return values.hasOwnProperty('object') && values.hasOwnProperty('xtend')}

function isFObjectSchema(values: any) {return values.hasOwnProperty('valueArray')}


function formObj2JSON(formValues: formObjectType, __EXTERNAL__: any): any {
  let result: any;
  switch (formValues.type) {
    case 'object':
      result = {};
      if (formValues.external && formValues.external.length) result[symbolMarker + 'external'] = formValues.external;
      for (let i = 0; i < formValues.valueArray.length; i++) {
        let obj = formValues.valueArray[i];
        if (obj.name) result[obj.name] = formObj2JSON(formValues.valueArray[i], __EXTERNAL__)
      }

      break;
    case 'array':
      result = [];
      for (let i = 0; i < formValues.valueArray.length; i++) result[i] = formObj2JSON(formValues.valueArray[i], __EXTERNAL__);
      // result['length'] = formValues.valueArray.length;
      break;
    case 'string':
      result = formValues.value;
      break;
    default:
      if (typeof formValues.value == 'string') {
        try {
          result = JSON.parse(formValues.value);
        } catch (e) {
          result = {};
          result[symbolMarker + 'unescaped'] = formValues.value;
        }
      } else {
        result = formValues.value;
      }
  }
  return result;
}

function JSONObj2js(JSONValues: any): string {
  let result: any = [];
  let valueType = typeof JSONValues;
  switch (valueType) {
    case 'object':
      if (JSONValues.hasOwnProperty(symbolMarker + 'unescaped')) {
        result = JSONValues[symbolMarker + 'unescaped'];
        return (typeof result == 'string') ? result : JSON.stringify(result);
      } else {
        if (Array.isArray(JSONValues)) {
          return '[' + JSONValues.map(item => JSONObj2js(item)).join(',') + ']';
        } else {
          let obj2merge = [];
          objKeys(JSONValues).forEach(key => {
            if (key == symbolMarker + 'external') obj2merge = Array.isArray(JSONValues[key]) ? JSONValues[key] : [JSONValues[key]];
            else result.push('"' + key + '":' + JSONObj2js(JSONValues[key]))
          });
          if (result.length) obj2merge.push('{' + result.join(',') + '}');
          if (!obj2merge.length) return '{}';
          if (obj2merge.length == 1) return obj2merge[0];
          return 'merge.all(' + obj2merge[0] + ',[' + obj2merge.slice(1).join(',') + '])';
        }
      }
    default:
      return JSON.stringify(JSONValues);
  }
}


function JSON2formObj(JSONValues: any): formObjectType {
  let result: formObjectType = {name: '', value: '', type: '', valueArray: []};
  let valueType = typeof JSONValues;
  switch (valueType) {
    case  'object':
      if (JSONValues.hasOwnProperty(symbolMarker + 'unescaped')) {
        result.type = 'unescaped';
        result.value = JSONValues[symbolMarker + 'unescaped'];
      } else {
        if (Array.isArray(JSONValues)) {
          result.type = 'array';
          result.valueArray = JSONValues.map((item) => JSON2formObj(item));
        } else {
          result.type = 'object';
          objKeys(JSONValues).forEach(key => {
            if (key == symbolMarker + 'external') result.external = JSONValues[key];
            else {
              let tmpResult = JSON2formObj(JSONValues[key]);
              tmpResult.name = key;
              result.valueArray.push(tmpResult)
            }
          });

        }
      }
      break;
    case 'string':
      result.type = 'string';
      result.value = JSONValues;
      break;
    default:
      result.type = 'unescaped';
      result.value = JSON.stringify(JSONValues);
  }
  return result;
}


function formValues2JSON(formValues: any, __EXTERNAL__: any = {}): any {

  function getFieldsAndProps(objFields: any) {
    let items: any = isArray ? [] : {};
    let fields: string[] = [];
    objFields.forEach((field: any) => {
      if (isFFieldSchema(field) && (field.name || isArray)) {
        if (isArray) {
          lastField++;
          items.push(formValues2JSON(field, __EXTERNAL__));
        } else {
          lastField = field.name;
          items[field.name] = formValues2JSON(field, __EXTERNAL__)
        }
        fields.push(lastField);
      } else if (isFObjectSchema(field)) fields.push(formObj2JSON(field, __EXTERNAL__));
      else if (isFGroupSchema(field)) {
        let res = getFieldsAndProps(field.object.fields);
        if (isArray) push2array(items, res.items); else items = merge(items, res.items);
        let xtendJSON = formObj2JSON(field.xtend, __EXTERNAL__);
        xtendJSON.fields = res.fields;
        fields.push(xtendJSON);
      }
    });
    return {items, fields};
  }

  if (!formValues || !formValues.type) return undefined;
  if (formValues.type == 'schemas') return formValues.schemas ? formValues.schemas : undefined;

  const isArray = formValues.type == 'array';
  let lastField: any = isArray ? 0 : '';
  let result: any = {};
  let jsonPropsResult: any = {};
  let xResult: any = {};

  result.type = formValues.type;
  let jsonPropsForm = getIn(formValues, 'fieldProps', 'jsonProps');
  objKeys(jsonPropsForm || {}).forEach(sPropsName => {
    if (sPropsName != 'commonProps' && sPropsName != result.type + 'Props') return;
    let sProps = jsonPropsForm[sPropsName];
    objKeys(sProps || {}).forEach(key => jsonPropsResult[key] = sProps[key]);
  });

  let additionPropName = isArray ? 'additionalItems' : 'additionalProperties';
  let basicPropName = isArray ? 'items' : 'properties';

  if (result.type === 'object' || result.type === 'array') {
    let objFields = formValues.object.fields.concat();
    if (jsonPropsResult[additionPropName] == 2) { // object
      if (objFields.length && isFFieldSchema(objFields[objFields.length - 1])) {  // only if last filed is FFieldSchema
        jsonPropsResult[additionPropName] = formValues2JSON(objFields.pop(), __EXTERNAL__) || {};
      } else {
        jsonPropsResult[additionPropName] = {};
      }
    } else if (typeof jsonPropsResult[additionPropName] != 'undefined') {
      jsonPropsResult[additionPropName] = jsonPropsResult[additionPropName] === 1;  // true or false
    }
    let res = getFieldsAndProps(objFields);
    xResult.fields = res.fields;
    result[basicPropName] = res.items;
  }
  result = merge(result, jsonPropsResult);

  let xPropsForm = getIn(formValues, 'fieldProps', 'xProps');
  objKeys(xPropsForm || {}).forEach(key => {
    if (key == 'custom') {
      let xCustom = xPropsForm['custom'] || {};
      let xCustomResult: any = {};
      objKeys(xCustom).forEach(key => xCustomResult[key] = (key !== 'presets' && key !== 'blocks') ? formObj2JSON(xCustom[key], __EXTERNAL__) : xCustom[key]);
      xResult['custom'] = xCustomResult;
    } else if (key == 'flattenBool') { // just skip, it will be used later
    } else if (key == 'flatten') {
      if (xPropsForm['flattenBool']) xResult['flatten'] = xPropsForm['flatten'] ? xPropsForm['flatten'] : true;
    } else xResult[key] = xPropsForm[key];
  });

  result['x'] = xResult;
  return result;
}


function JSON2formValues(JSONValues: any, name?: string) {
  //let result: any = {};
  function makeFormFields(xFields: any, restKeys: any) {
    let fields: any = [];
    xFields.forEach((xField: any, pos: any) => {
      if (typeof xField == 'string') {
        if (!pItems.hasOwnProperty(xField)) throw new Error('Field "' + xField + '" not found in properties');
        fields.push(JSON2formValues(pItems[xField] || {}, xField));
        let idx = restKeys.indexOf(xField);
        if (~idx) restKeys.splice(idx, 1);
      } else if (typeof xField == 'object') {
        if (xField.hasOwnProperty('fields')) {
          let xObj: any = {};
          let groupObj: any = {};
          Object.assign(xObj, xField);
          delete xObj['fields'];
          groupObj['xtend'] = JSON2formObj(xObj);
          groupObj['fields'] = makeFormFields(xField['fields'], restKeys);
          fields.push(groupObj);
        } else fields.push(JSON2formObj(xField))
      } else {
        throw new Error('Unknow field at index "' + pos + '"');
      }
    });
    return fields;
  }

  let result: any = {};
  let jsonProps: any = {};
  let xProps: any = {};
  if (name !== undefined) result.name = name;
  if (JSONValues.type) result.type = JSONValues.type;
  let JSONPropsFromSchema = fieldPropsSchema.properties.jsonProps.properties;// getSchemaPart(fieldPropsSchema, ['properties', 'jsonProps', 'properties']);
  objKeys(JSONPropsFromSchema).forEach(key => {
    let sProps = {};
    objKeys(JSONPropsFromSchema[key].properties).forEach(sKey => {
      if (sKey != 'properties' && sKey != 'items' && JSONValues.hasOwnProperty(sKey)) sProps[sKey] = JSONValues[sKey];
    });
    if (objKeys(sProps).length) jsonProps[key] = sProps;
  });

  const isArray = result.type == 'array';
  let pItems: any;
  let additionPItem: any;
  let xPropsFromSchema = fieldPropsSchema.properties.xProps.properties;
  let xJSONValues = JSONValues.x || {};

  if (result.type == 'array' || result.type == 'object') {
    let additionPropName = isArray ? 'additionalItems' : 'additionalProperties';
    let basicPropName = isArray ? 'items' : 'properties';
    let groupName = (isArray ? 'array' : 'object') + 'Props';
    pItems = JSONValues[basicPropName];
    if (typeof JSONValues[additionPropName] == 'object') {
      additionPItem = JSONValues[additionPropName];
      getCreateIn(jsonProps, {}, groupName)[additionPropName] = 2;  // object id
    } else if (JSONValues[additionPropName] !== undefined) getCreateIn(jsonProps, {}, groupName)[additionPropName] = JSONValues[additionPropName] ? 1 : 0; // true, false ids
    let restKeys = objKeys(pItems);
    result['object'] = {fields: makeFormFields(xJSONValues['fields'], restKeys)};
    restKeys.forEach(key => result['object'].fields.push(JSON2formValues(pItems[key], key)));
    if (additionPItem) result['object'].fields.push(JSON2formValues(additionPItem));
  }

  objKeys(xPropsFromSchema).forEach(xKey => {
    if (xJSONValues.hasOwnProperty(xKey)) {
      if (xKey == 'custom') {
        let xCustom = xJSONValues['custom'] || {};
        let xCustomResult: any = {};
        objKeys(xCustom).forEach(key => xCustomResult[key] = (key !== 'presets' && key !== 'blocks') ? JSON2formObj(xCustom[key]) : xCustom[key]);
        xProps['custom'] = xCustomResult;
      } else if (xKey == 'fields') {
      } else if (xKey == 'flatten') {
        if (xJSONValues[xKey]) {
          xProps['flattenBool'] = true;
          if (xJSONValues[xKey] !== true) xProps['flatten'] = xJSONValues[xKey];
        }
      } else {
        xProps[xKey] = xJSONValues[xKey];
      }
    }
  });

  result.fieldProps = {jsonProps, xProps};
  return result;
}


function JSONform2js(JSONValues: any) {
  function makeJSFields(xFields: any) {
    let fields: string[] = [];
    xFields.forEach((xField: any, pos: any) => {
      if (typeof xField == 'string') {
        fields.push('"' + xField + '"');
      } else if (typeof xField == 'object') {
        if (xField.hasOwnProperty('fields')) {
          let xObj: any = {};
          //let groupObj: string[] = [];
          Object.assign(xObj, xField);
          xObj['fields'] = {};
          xObj['fields'][symbolMarker + 'unescaped'] = makeJSFields(xField['fields']);
          fields.push(JSONObj2js(xObj))
        } else fields.push(JSONObj2js(xField))
      } else {
        throw new Error('Unknow field at index "' + pos + '"');
      }
    });
    return '[' + fields.join(',') + ']';
  }

  let result: string[] = [];
  objKeys(JSONValues).forEach((key => {
    if (key != 'x') result.push('"' + key + '":' + JSON.stringify(JSONValues[key]))
  }));
  let xProps = JSONValues.x || {};
  let xResult: string[] = [];
  objKeys(xProps).forEach((xkey => {
    if (xkey == 'custom') {
      let xCustom = xProps['custom'] || {};
      let xCustomResult: string[] = [];
      objKeys(xCustom).forEach(key => xCustomResult.push('"' + key + '":' + (key !== 'presets' && key !== 'blocks') ? JSONObj2js(xCustom[key]) : JSON.stringify(xCustom[key])));
      xResult['custom'] = 'custom:{' + xCustomResult.join(',') + '}';
    } else if (xkey == 'dataMap') {
      let dataMapResult = xProps['dataMap'].map((dmObj: any) => '[' + JSON.stringify(dmObj[0]) + ',' + JSON.stringify(dmObj[1]) + (dmObj[2] ? ',' + dmObj[2] : '') + ']');
      xResult.push('"dataMap":[' + dataMapResult.join(',') + ']');
    } else if (xkey == 'fields') {
      xResult.push('"_fields":' + makeJSFields(xProps['fields']))

    } else if (xkey == 'validators') {
      xResult.push('"validators": [' + xProps['validators'].join(',') + ']')

    } else xResult.push('"' + xkey + '":' + JSON.stringify(xProps[xkey]))
  }));
  result.push('x:{' + xResult.join(',') + '}');
  return '{' + result.join(',') + '}'
}

export {formObj2JSON, JSON2formObj, JSONObj2js, formValues2JSON, JSON2formValues, JSONform2js, symbolMarker, isFFieldSchema, isFGroupSchema, isFObjectSchema}