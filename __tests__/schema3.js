export default {
  type: 'object',
  properties: {
    array_1: {
      "title": "array 1 level 1",
      "type": "array",
      "items": {
        "title": "array 1 level 2",
        "type": "array",
        "items": {
          "title": "array 1 level 2 object",
          "type": "object",
          "ff_props": {"managed": true}
        }
      }
    },
    array_2: {
      "title": "array 2",
      "type": "array",
      "default": [],
      "items": {
        "title": "array 2 level 1",
        "type": "object",
        "properties": {
          value: {
            type: 'string'
          },
          more_value: {
            type: 'object',
            "ff_props": {flatten: true},
            "properties": {
              inner: {
                type: 'string',
                default: ''
              },
              more_inner: {
                type: 'string',
              }
            }
          },
        }
      }

    }
  }
}
