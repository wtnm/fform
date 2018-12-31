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
      ff_props: {managed: true}
    },
    'recursiveType': {
      type: 'array',
      items: {
        oneOf: [{
          type: 'object',
          ff_dataMap: [['./@oneOf', './stringRecursiveValue@objMappedOneOf'], ['../@length', './@objMappedLength']],
          title: 'recursive Object',
          properties: {
            recusion: {
              title: 'recursiveType',
              allOf: [{$ref: '#/definition/recursiveType'}]
            },
            stringRecursiveValue: {
              type: 'string',
              ff_dataMap: [['../../@length', './@value', n => n.toString()], ['../@oneOf', './@selfMappedOneOf']]
            }
          }
        }, {
          title: 'selfManagedType',
          allOf: [{$ref: '#/definition/selfManagedType'}],
          ff_dataMap: [['./@oneOf', './@selfManagedMappedOneOf'], ['../@length', './@selfManagedMappedLength']],
        }, {
          title: 'stringType',
          allOf: [{$ref: '#/definition/stringType'}],
          ff_dataMap: [['../@oneOf', './@stringTypeMappedOneOf'], ['../@length', './@stringTypeMappedLength']],
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
