export default {
  "title": "array level 1",
  "type": "array",
  "minItems": 3,
  "maxItems": 6,
  "default": [
    [{strValue: 'array level 1 objValue default 0', arrValue: ['array level 1 arrValue']}],
    [{strValue: 'array level 1 objValue default 1'}]
  ],
  "items": {
    "title": "array level 2",
    "type": "array",
    "default": [{strValue: 'array level 2 objValue default', turpleValue: ['turpleValue level 2 default']}],
    "minItems": 2,
    "ff_validators": [
      (value, props) => {
        return value && value [0] && value[0].strValue === 'test validation' ? ['simple text message'] : undefined;
      },
      (value, props) => {
        return value && value [0] && value[0].strValue === 'test validation' ? 'more simple text message' : undefined;
      },
      (value, props) => {
        return value && value [0] && value[0].strValue === 'test validation' ? {text: 'text message for mapValue', path: './0/mapValue'} : {text: undefined, path: './0/mapValue'};
      },
      (value, props) => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(
            value && value [0] && (value[0].strValue === 'test validation' || value[0].strValue === 'another validation') ?
              {text: 'async text message for arrValue ' + value[0].strValue, path: './0/arrValue'} : {
                text: undefined,
                path: './0/arrValue'
              }), 10)
        });
      }

    ]
    ,
    "items": {
      "title": "array object level 1",
      "type": "object",
      "properties": {
        "mapValue": {
          "type": "string",
          "default": "mapValue default"
        },
        "strValue": {
          "type": "string",
          "default": "strValue default",

          "ff_dataMap": [
            {"from": './@/value', to: '../mapValue/@/value'},
            {"from": './@/controls', to: '../mapArrValue/@/controls'},
            {"from": './@/controls/hidden', to: '../mapValue/@/controls/hidden', $: (v) => [!v]},
            {"from": './@/controls/disabled', to: '../mapValue/@/controls/disabled'}
          ],
        },
        "mapArrValue": {
          "type": "array",
          "minItems": 1,
          "items": {
            "type": "string",
            "default": 'mapArrValue default',
            "ff_dataMap": [{"from": '../../mapValue/@/value', to: './@/value'}],
          }
        },
        "arrValue": {
          "type": "array",
          "minItems": 2,
          "maxItems": 3,
          "items": {
            "type": "string",
            "default": 'arrValue default'
          }
        },
        "turpleValue": {
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "default": ["turpleValue default", 4],
          "items": [{
            "type": "string",
            "default": 'turpleValue default'
          },
            {
              "type": "number",
              "default": 1
            }

          ]
        }
      }
    }
  }
};
