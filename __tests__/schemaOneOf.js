export default {
  definition: {
    'numberType': {
      title: 'numberType',
      type: 'number',
      default: 0,
    },
    'stringType': {
      title: 'stringType',
      type: 'string',
      default: 'default',
    },
    'objectType': {
      type: 'object',
      properties: {
        objectTypeString: {
          type: 'string',
          allOf: [{$ref: '#/definition/numberType'}, {default: 'objectTypeString default'}]
        },
        objectTypeOneOfType: {
          allOf: [{$ref: '#/definition/oneOfType'}, {title: 'Null or boolean'}]
        },
        objectTypeNumberType: {
          $ref: '#/definition/numberType'
        }
      }
    },
    'oneOfType': {
      oneOf: [
        {
          type: 'null'
        },
        {
          type: 'boolean',
          default: true
        }

      ]
    },
    'anyType': {
      title: 'Any type'
    },
    'selfManagedType': {
      type: 'object',
      default: {selfValue: 'selfManagedType.selfValue', stringValue: 'selfManagedType.stringValue', numberValue: 5},
      _simple: true
    },
    "multiType": {
      oneOf: [{
        type: ['array', 'string', 'null'],
        _presets: 'array',
        items: {type: 'string'},
      }, {
        type: ['string', 'array'],
        _presets: 'array',
        items: {type: 'string'},
        required: true
      }, {
        type: ['object', 'array'],
        _presets: 'array',
        items: {type: 'string'},
        properties: {
          oneString: {
            type: 'string',
            default: 'oneString default'
          }, twoNumber: {
            type: ['number', 'null'],
            default: null,
            _presets: 'number'
          },
        },
        default: ['first value', 'second value']
      }, {
        type: ['array', 'string', 'number'],
        _presets: 'arrayOf',
        _simple: true,
        items: {type: ['boolean', 'null'], _presets: 'boolean'},
        default: ''
      }
      ]
    },

    'recursiveType': {
      type: 'array',
      items: {
        oneOf: [{
          type: 'object',
          _stateMaps: [{from: './@oneOf', to: './stringRecursiveValue@objMappedOneOf'}, {from: '../@length', to: './@objMappedLength'}],
          title: 'recursive Object',
          properties: {
            recusion: {
              title: 'recursiveType',
              allOf: [{$ref: '#/definition/recursiveType'}]
            },
            stringRecursiveValue: {
              type: 'string',
              _stateMaps: [{from: '../../@length', to: './@value', $: n => [n.toString()]}, {from: '../@oneOf', to: './@selfMappedOneOf'}]
            }
          }
        }, {
          title: 'selfManagedType',
          allOf: [{$ref: '#/definition/selfManagedType'}],
          _stateMaps: [{from: './@oneOf', to: './@selfManagedMappedOneOf'}, {from: '../@length', to: './@selfManagedMappedLength'}],
        }, {
          title: 'stringType',
          allOf: [{$ref: '#/definition/stringType'}],
          _stateMaps: [{from: '../@oneOf', to: './@stringTypeMappedOneOf'}, {from: '../@length', to: './@stringTypeMappedLength'}],
        }, {
          title: 'multitypeObject',
          required: ['propOne', 'propTwo'],
          properties: {
            propOne: {
              title: 'multiType',
              allOf: [{$ref: '#/definition/multiType'}],
            },
            propTwo: {
              title: 'multiType',
              required: true,
              allOf: [{$ref: '#/definition/multiType'}],
            },
            propThree: {
              title: 'multiType',
              allOf: [{$ref: '#/definition/multiType'}],
            },
            propFour: {
              title: 'multiType',
              required: true,
              allOf: [{$ref: '#/definition/multiType'}],
            }
          }
        }
        ]
      }

    }
  },
  title: 'oneOf schema test',
  oneOf:
    [
      {$ref: '#/definition/recursiveType'},
      {type: 'string'},
      {
        type: 'array',
        items: {
          default: 'oneOf array.string default',
          allOf: [{$ref: '#/definition/stringType'}]
        }
      },
      {$ref: '#/definition/numberType'},
      {allOf: [{$ref: '#/definition/stringType'}, {$ref: '#/definition/objectType'}]},

    ]
};
