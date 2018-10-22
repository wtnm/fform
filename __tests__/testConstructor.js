const expect = require('expect');
const constructorFuncs = require('../src/constructorLib.tsx');
const {merge} = require('../src/core/commonLib.tsx');
const {fieldPropsSchema} = require('../src/constructor');

let formValuesWithCustomObject = {
  "type": "string",
  "fieldProps": {
    "hidden": {
      "fieldType": "string"
    },
    "jsonProps": {
      "commonProps": {}
    },
    "xProps": {
      "preset": [
        "select"
      ],
      "custom": {
        "blocks": {
          "base": {
            "Builder": true,
            "Title": true,
            "Body": true,
            "Main": true,
            "Message": true,
            "GroupBlocks": true,
            "ArrayItem": true,
            "Autosize": false
          }
        },
        "Autosize": {
          "base": {
            "propsMap": {
              "value": "values/current",
              "placeholder": "params/placeholder"
            }
          }
        },
        "Array": {
          "base": {
            "empty": {
              "className": "array-empty"
            },
            "addButton": {
              "className": "array-add-button"
            },
            "propsMap": {
              "length": "array/lengths/current",
              "canAdd": "array/canAdd"
            }
          }
        },
        "ArrayItem": {
          "base": {
            "itemMenu": {
              "buttons": [
                "first",
                "last",
                "up",
                "down",
                "del"
              ],
              "buttonProps": {}
            },
            "propsMap": {
              "itemData": "arrayItem"
            }
          }
        },
        "Builder": {
          "base": {
            "propsMap": {
              "hidden": [
                "controls",
                null
              ]
            }
          }
        },
        "Layouts": {
          "base": {
            "className": "fform-group-block"
          }
        },
        "GroupBlocks": {
          "base": {
            "className": "fform-layout-block layout-elem"
          }
        },
        "Body": {
          "base": {
            "className": "fform-body-block"
          }
        },
        "Title": {
          "base": {
            "useTag": "label",
            "requireSymbol": "*",
            "propsMap": {
              "required": "schemaData/required",
              "title": "schemaData/title"
            }
          }
        },
        "Message": {
          "base": {
            "propsMap": {
              "messages": "messages",
              "itemsProps/0/hidden": [
                "status/touched",
                null
              ],
              "itemsProps/1/hidden": [
                "status/touched",
                null
              ],
              "itemsProps/2/hidden": "status/pristine"
            },
            "messageItem": {}
          }
        },
        "Main": {
          "base": {
            "refName": "getRef",
            "propsMap": {
              "value": "values/current",
              "autoFocus": "params/autofocus",
              "placeholder": "params/placeholder",
              "required": "schemaData/required",
              "title": "schemaData/title",
              "readOnly": [
                "controls",
                null
              ],
              "disabled": [
                "controls",
                null
              ]
            },
            "type": "select"
          },
          "type": "object",
          "external": [
            "test_object"
          ],
          "valueArray": [
            {
              "name": "nm1",
              "type": "string",
              "value": "nmVal",
              "valueArray": []
            },
            {
              "name": "arrayNm",
              "type": "array",
              "valueArray": [
                {
                  "name": "arrNm1",
                  "type": "string",
                  "value": "arrNmVal1",
                  "valueArray": []
                },
                {
                  "name": "arrNm2",
                  "type": "string",
                  "value": "arrNmVal2",
                  "valueArray": []
                },
                {
                  "type": "string",
                  "value": "arrNmVal3",
                  "valueArray": []
                }
              ]
            },
            {
              "name": "obj",
              "type": "object",
              "valueArray": [
                {
                  "name": "objNm1",
                  "type": "string",
                  "value": "objNm1Val",
                  "valueArray": []
                },
                {
                  "type": "string",
                  "value": "objNnmVal",
                  "valueArray": []
                }
              ]
            },
            {
              "name": "unescNm",
              "type": "unescaped",
              "value": "unescVal",
              "valueArray": []
            },
            {
              "name": "undefNm",
              "type": "undefined",
              "valueArray": []
            },
            {
              "type": "unescaped",
              "value": "NnmVal",
              "valueArray": []
            }
          ]
        },
        "presets": "select"
      },
      "params": {},
      "controls": {}
    }
  },
  "object": {
    "fields": []
  }
};
let formValuesWithInnerGroups = {
  "name": "g",
  "type": "object",
  "fieldProps": {
    "hidden": {
      "fieldType": "object"
    },
    "jsonProps": {
      "objectProps": {
        "additionalProperties": 2
      }
    }
  },
  "object": {
    "fields": [
      {
        "name": "f1",
        "type": "object",
        "fieldProps": {
          "hidden": {},
          "jsonProps": {
            "objectProps": {
              "additionalProperties": 2
            }
          },
          "xProps": {}
        },
        "object": {
          "fields": []
        }
      },
      {
        "xtend": {
          "type": "object",
          "valueArray": []
        },
        "object": {
          "fields": [
            {
              "name": "g1f1",
              "type": "object",
              "fieldProps": {
                "hidden": {},
                "jsonProps": {
                  "objectProps": {
                    "additionalProperties": 1
                  }
                },
                "xProps": {}
              },
              "object": {
                "fields": []
              }
            },
            {
              "type": "object",
              "valueArray": [
                {
                  "name": "nm1",
                  "type": "string",
                  "value": "val1",
                  "valueArray": []
                }
              ]
            },
            {
              "name": "g1f2",
              "object": {
                "fields": []
              }
            }
          ]
        }
      },
      {
        "type": "object",
        "external": [
          "test_object"
        ],
        "valueArray": []
      },
      {
        "xtend": {
          "type": "object",
          "valueArray": []
        },
        "object": {
          "fields": [
            {
              "name": "g2f3",
              "type": "array",
              "fieldProps": {
                "hidden": {},
                "jsonProps": {
                  "arrayProps": {
                    "additionalItems": 2
                  }
                },
                "xProps": {}
              },
              "object": {
                "fields": [
                  {
                    "type": "string",
                    "object": {
                      "fields": []
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      {
        "name": "f2",
        // "type": "string",
        "fieldProps": {
          "hidden": {},
          "xProps": {}
        },
        "object": {
          "fields": []
        }
      },
    ]
  }
};

let formValuesWithFieldsPros = {
  "type": "array",
  "fieldProps": {
    "hidden": {
      "fieldType": "array"
    },
    "jsonProps": {
      "commonProps": {
        "ref": "refVal",
        "title": "titleVal",
        "description": "descriptionVal",
        "default": "defaultVal"
      },
      "stringProps": {
        "minLength": 1,
        "maxLength": 2,
        "pattern": "patternVal",
        "format": "date"
      },
      "numberProps": {
        "multipleOf": 1,
        "maximum": 5,
        "exclusiveMaximum": true,
        "minimum": 1,
        "exclusiveMinimum": true
      },
      "arrayProps": {
        "additionalItems": 2,
        "minItems": 1,
        "maxItems": 5,
        "uniqueItems": true
      },
      "objectProps": {
        "required": "requiredVal",
        "minProperties": 1,
        "maxProperties": 5,
        "additionalProperties": 2
      }
    },
    "xProps": {
      "preset": [
        "select"
      ],
      "validators": [
        "validatorFn"
      ],
      "dataMap": [
        [
          "from",
          "to",
          "fn"
        ]
      ],
      "custom": {
        "presets": "select",
        "blocks": {
          "base": {
            "Builder": true,
            "Title": true,
            "Body": true,
            "Main": true,
            "Message": true,
            "GroupBlocks": true,
            "ArrayItem": true,
            "Autosize": false
          }
        },
        "Autosize": {
          "base": {
            "propsMap": {
              "value": "values/current",
              "placeholder": "params/placeholder"
            }
          }
        },
        "Array": {
          "base": {
            "empty": {
              "className": "array-empty"
            },
            "addButton": {
              "className": "array-add-button white-button"
            },
            "propsMap": {
              "length": "array/lengths/current",
              "canAdd": "array/canAdd"
            }
          }
        },
        "ArrayItem": {
          "base": {
            "itemMenu": {
              "buttons": [
                "first",
                "last",
                "up",
                "down",
                "del"
              ],
              "buttonProps": {},
              "className": "array-item-menu"
            },
            "propsMap": {
              "itemData": "arrayItem"
            },
            "buttons": [
              "up",
              "down",
              "del"
            ],
            "itemMain": {
              "className": "property-array-item-menu array-item"
            },
            "itemBody": {
              "className": "array-item-body"
            },
            "buttonProps": {
              "className": "white-button",
              "titles": {
                "del": "delete"
              }
            }
          }
        },
        "Builder": {
          "base": {
            "propsMap": {
              "hidden": [
                "controls",
                null
              ]
            }
          }
        },
        "Layouts": {
          "base": {
            "className": "fform-group-block"
          }
        },
        "GroupBlocks": {
          "base": {
            "className": "fform-layout-block layout-elem"
          }
        },
        "Body": {
          "base": {
            "className": "fform-body-block"
          }
        },
        "Title": {
          "base": {
            "useTag": "label",
            "requireSymbol": "*",
            "propsMap": {
              "required": "schemaData/required",
              "title": "schemaData/title"
            }
          }
        },
        "Message": {
          "base": {
            "propsMap": {
              "messages": "messages",
              "itemsProps/0/hidden": [
                "status/touched",
                null
              ],
              "itemsProps/1/hidden": [
                "status/touched",
                null
              ],
              "itemsProps/2/hidden": "status/pristine"
            },
            "messageItem": {}
          }
        },
        "Main": {
          "base": {
            "refName": "getRef",
            "propsMap": {
              "value": "values/current",
              "autoFocus": "params/autofocus",
              "placeholder": "params/placeholder",
              "required": "schemaData/required",
              "title": "schemaData/title",
              "readOnly": [
                "controls",
                null
              ],
              "disabled": [
                "controls",
                null
              ]
            },
            "type": "select"
          }
        }
      },
      "params": {
        "autofocus": true,
        "liveValidate": true,
        "placeholder": "placeholderVal"
      },
      "controls": {
        "readonly": true,
        "readonlyBind": true,
        "disabled": true,
        "disabledBind": true,
        "hidden": true,
        "hiddenBind": true,
        "omit": true,
        "omitBind": true
      }
    }
  },
  "object": {
    "fields": [
      {
        "name": "g1",
        "type": "string",
        "fieldProps": {
          "hidden": {
            "fieldType": "string"
          }
        },
        "object": {
          "fields": []
        }
      }
    ]
  }
};


describe('FForm constructor utilities test', function () {

  it('test formObj2JSON JSON2formObj JSONObj2js', function () {

    let JSONObj = constructorFuncs.formObj2JSON(formValuesWithCustomObject.fieldProps.xProps.custom.Main);
    expect(Object.keys(JSONObj).length).toBe(6);
    expect(JSONObj[constructorFuncs.symbolMarker + 'external'][0]).toBe('test_object');
    expect(JSONObj[constructorFuncs.symbolMarker + 'external'].length).toBe(1);
    expect(JSONObj['arrayNm'].length).toBe(3);
    expect(JSONObj['arrayNm'][0]).toBe('arrNmVal1');
    expect(JSONObj['nm1']).toBe('nmVal');
    expect(Object.keys(JSONObj['obj']).length).toBe(1);
    expect(JSONObj['obj']['objNm1']).toBe('objNm1Val');
    expect(JSONObj['undefNm']).toBe(undefined);
    expect(JSONObj['unescNm'][constructorFuncs.symbolMarker + 'unescaped']).toBe('unescVal');

    let FormObj = constructorFuncs.JSON2formObj(JSONObj);
    expect(FormObj['valueArray'].length).toBe(5);
    expect(FormObj['external'][0]).toBe('test_object');
    expect(FormObj['external'].length).toBe(1);
    expect(FormObj['type']).toBe('object');

    let test_object = {'test_value': 'tVal'};
    let unescVal = {};
    let jsObj;
    eval('jsObj = ' + constructorFuncs.JSONObj2js(JSONObj));
    expect(Object.keys(jsObj).length).toBe(6);
    expect(jsObj['test_value']).toBe('tVal');
    expect(jsObj['arrayNm'].length).toBe(3);
    expect(jsObj['arrayNm'][0]).toBe('arrNmVal1');
    expect(jsObj['nm1']).toBe('nmVal');
    expect(Object.keys(jsObj['obj']).length).toBe(1);
    expect(jsObj['obj']['objNm1']).toBe('objNm1Val');
    expect(jsObj['undefNm']).toBe(undefined);
    expect(jsObj['unescNm']).toBe(unescVal);
  });

  it('test formValues2JSON JSON2formValues JSONform2js with formValuesWithInnerGroups', function () {
    let JSONform = constructorFuncs.formValues2JSON(formValuesWithInnerGroups);
    expect(JSONform.x.fields.length).toBe(4);
    expect(JSONform.type).toBe('object');
    expect(typeof JSONform.additionalProperties).toBe('object');
    expect(Object.keys(JSONform.properties).length).toBe(4);
    expect(JSONform.properties.hasOwnProperty('f1')).toBe(true);
    expect(JSONform.properties.hasOwnProperty('g1f1')).toBe(true);
    expect(JSONform.properties.hasOwnProperty('g1f2')).toBe(true);
    expect(JSONform.properties.hasOwnProperty('g2f3')).toBe(true);
    expect(JSONform.properties.f1.type).toBe('object');
    expect(typeof JSONform.properties.f1.additionalProperties).toBe('object');
    expect(typeof JSONform.properties.f1.properties).toBe('object');
    expect(Object.keys(JSONform.properties.f1.properties).length).toBe(0);
    expect(JSONform.properties.f1.x.fields.length).toBe(0);
    expect(JSONform.properties.g1f1.additionalProperties).toBe(true);
    expect(JSONform.properties.g1f1.type).toBe('object');
    expect(typeof JSONform.properties.g2f3.additionalItems).toBe('object');
    expect(JSONform.properties.g2f3.additionalItems.type).toBe('string');

    let FormValues = constructorFuncs.JSON2formValues(JSONform);
    expect(FormValues.type).toBe('object');
    expect(FormValues.object.fields.length).toBe(5);
    expect(FormValues.object.fields[0].name).toBe('f1');
    expect(FormValues.object.fields[0].type).toBe('object');
    expect(FormValues.object.fields[0].fieldProps.jsonProps.objectProps.additionalProperties).toBe(2);
    expect(FormValues.object.fields[1].fields.length).toBe(3);
    expect(FormValues.object.fields[1].fields[0].name).toBe('g1f1');
    expect(FormValues.object.fields[1].fields[0].type).toBe('object');
    expect(FormValues.object.fields[3].fields[0].name).toBe('g2f3');
    expect(FormValues.object.fields[3].fields[0].type).toBe('array');
    expect(FormValues.object.fields[3].fields[0].fieldProps.jsonProps.arrayProps.additionalItems).toBe(2);

    let jsForm;
    let test_object = {'test_value': 'tVal'};
    eval('jsForm = ' + constructorFuncs.JSONform2js(JSONform));
    expect(jsForm.x.fields.length).toBe(4);
    expect(jsForm.properties.f1.x.fields.length).toBe(0);
    expect(typeof jsForm.properties.g2f3.additionalItems).toBe('object');
    expect(jsForm.x.fields[1].fields.length).toBe(3);
    expect(jsForm.x.fields[2]).toBe(test_object);

  });

  it('test formValues2JSON JSON2formValues JSONform2js with formValuesWithFieldsPros', function () {
    let JSONform = constructorFuncs.formValues2JSON(formValuesWithFieldsPros);
    expect(JSONform['default']).toBe('defaultVal');
    expect(JSONform['description']).toBe('descriptionVal');
    expect(JSONform['maxItems']).toBe(5);
    expect(JSONform['minItems']).toBe(1);
    expect(JSONform['ref']).toBe('refVal');
    expect(JSONform['title']).toBe('titleVal');
    expect(JSONform['type']).toBe('array');
    expect(JSONform['uniqueItems']).toBe(true);

    expect(JSONform.x.controls.disabled).toBe(true);
    expect(JSONform.x.controls.disabledBind).toBe(true);
    expect(JSONform.x.controls.hidden).toBe(true);
    expect(JSONform.x.controls.hiddenBind).toBe(true);
    expect(JSONform.x.controls.omit).toBe(true);
    expect(JSONform.x.controls.omitBind).toBe(true);
    expect(JSONform.x.controls.readonly).toBe(true);
    expect(JSONform.x.controls.readonlyBind).toBe(true);

    expect(JSONform.x.custom.blocks.base.ArrayItem).toBe(true);
    expect(JSONform.x.custom.blocks.base.Autosize).toBe(false);
    expect(JSONform.x.custom.blocks.base.Body).toBe(true);

    expect(JSONform.x.dataMap.length).toBe(1);
    expect(JSONform.x.dataMap[0][0]).toBe('from');
    expect(JSONform.x.dataMap[0][1]).toBe('to');
    expect(JSONform.x.dataMap[0][2]).toBe('fn');

    expect(JSONform.x.params.autofocus).toBe(true);
    expect(JSONform.x.params.liveValidate).toBe(true);
    expect(JSONform.x.params.placeholder).toBe('placeholderVal');

    expect(JSONform.x.preset.length).toBe(1);
    expect(JSONform.x.preset[0]).toBe('select');

    expect(JSONform.x.validators.length).toBe(1);
    expect(JSONform.x.validators[0]).toBe('validatorFn');

    let FormValues = constructorFuncs.JSON2formValues(JSONform);
    expect(FormValues['type']).toBe('array');
    expect(FormValues.fieldProps.jsonProps.commonProps['default']).toBe('defaultVal');
    expect(FormValues.fieldProps.jsonProps.commonProps['description']).toBe('descriptionVal');
    expect(FormValues.fieldProps.jsonProps.commonProps['ref']).toBe('refVal');
    expect(FormValues.fieldProps.jsonProps.commonProps['title']).toBe('titleVal');
    expect(FormValues.fieldProps.jsonProps.arrayProps['maxItems']).toBe(5);
    expect(FormValues.fieldProps.jsonProps.arrayProps['minItems']).toBe(1);
    expect(FormValues.fieldProps.jsonProps.arrayProps['uniqueItems']).toBe(true);
    expect(FormValues.fieldProps.jsonProps.arrayProps['additionalItems']).toBe(2);

    expect(FormValues.fieldProps.xProps.controls.disabled).toBe(true);
    expect(FormValues.fieldProps.xProps.controls.disabledBind).toBe(true);
    expect(FormValues.fieldProps.xProps.controls.hidden).toBe(true);
    expect(FormValues.fieldProps.xProps.controls.hiddenBind).toBe(true);
    expect(FormValues.fieldProps.xProps.controls.omit).toBe(true);
    expect(FormValues.fieldProps.xProps.controls.omitBind).toBe(true);
    expect(FormValues.fieldProps.xProps.controls.readonly).toBe(true);
    expect(FormValues.fieldProps.xProps.controls.readonlyBind).toBe(true);

    expect(FormValues.fieldProps.xProps.custom.blocks.base.ArrayItem).toBe(true);
    expect(FormValues.fieldProps.xProps.custom.blocks.base.Autosize).toBe(false);
    expect(FormValues.fieldProps.xProps.custom.blocks.base.Body).toBe(true);

    expect(FormValues.fieldProps.xProps.dataMap.length).toBe(1);
    expect(FormValues.fieldProps.xProps.dataMap[0][0]).toBe('from');
    expect(FormValues.fieldProps.xProps.dataMap[0][1]).toBe('to');
    expect(FormValues.fieldProps.xProps.dataMap[0][2]).toBe('fn');

    expect(FormValues.fieldProps.xProps.params.autofocus).toBe(true);
    expect(FormValues.fieldProps.xProps.params.liveValidate).toBe(true);
    expect(FormValues.fieldProps.xProps.params.placeholder).toBe('placeholderVal');

    expect(FormValues.fieldProps.xProps.preset.length).toBe(1);
    expect(FormValues.fieldProps.xProps.preset[0]).toBe('select');

    expect(FormValues.fieldProps.xProps.validators.length).toBe(1);
    expect(FormValues.fieldProps.xProps.validators[0]).toBe('validatorFn');


    let jsForm;
    let test_object = {'test_value': 'tVal'};
    let fn = {};
    let validatorFn = {};
    eval('jsForm = ' + constructorFuncs.JSONform2js(JSONform));

    expect(jsForm.x.dataMap.length).toBe(1);
    expect(jsForm.x.dataMap[0][0]).toBe('from');
    expect(jsForm.x.dataMap[0][1]).toBe('to');
    expect(jsForm.x.dataMap[0][2]).toBe(fn);

    expect(jsForm.x.validators.length).toBe(1);
    expect(jsForm.x.validators[0]).toBe(validatorFn);

  });

});