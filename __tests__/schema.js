export default {
  "type": "object",
  "title": "Test form",
  "properties": {
    "select": {
      "title": "Select me",
      "type": "number",
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      enumNames: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'],
      x: {
        "preset": 'select',
        placeholder: '<select something>'
      }
    },
    "checkbox": {
      "title": "Check me",
      "type": "boolean"
    },
    "objLevel_1": {
      "title": "object level 1",
      "type": "object",
      "properties": {
        "favMovie2": {
          "title": "Do you have a favourite colour?",
          "type": "string"
        },
        "objLevel_2": {
          "title": "object level 2",
          "type": "object",
          "properties": {
            "array_1": {
              "title": "array level 1",
              "type": "array",
              "default": [
                [{bazinga: 'array level 1 default', bazingaCinema: {'favBook': 'favBook 0 0'}}, {bazingaCinema: {'favBook': 'favBook 0 1'}}, {bazingaCinema: {'favBook': 'favBook 0 2'}}],
                [{bazingaCinema: {'favBook': 'array level 1 default 1 0'}}]
              ],
              "x": {
                "flatten": true,
              },
              "items": {
                "title": "array level 2",
                "type": "array",
                "default": [{
                  bazinga: 'array level 2 bazinga default 0',
                  bazingaCinema: {'favBook': 'array level 2 favBook default 0'}
                }, {bazingaCinema: {'favCinema': 'array level 2 favCinema default 1'}}, {bazingaCinema: {'favBook': 'array level 2 favBook default 2'}}],
                "x": {
                  "flatten": true,
                },
                "items": {
                  "title": "array object level 1",
                  "type": "object",
                  "properties": {
                    "bazinga": {
                      "title": "Do you have a favourite colour?",
                      "type": "string",
                      "default": "bazinga default"
                    },
                    "bazingaCinema": {
                      "title": "array object level 2",
                      "type": "object",
                      "required": [
                        "favCinema",
                        "favBook"
                      ],
                      "properties": {
                        "favCinema": {
                          "title": "Do you have a favourite movie?",
                          "type": "string",
                          "default": "favCinema default"
                        },
                        "favBook": {
                          "title": "Do you have a favourite book?",
                          "type": "string",
                          "default": "favBook default",

                        },
                        "undefVal": {
                          "title": "Do you have a favourite book?",
                          "type": "string",
                        }
                      },
                      "x": {
                        "flatten": true,

                      }
                    }
                  },
                  "x": {
                    "flatten": "color_",
                  }
                }
              }
            }
          },
          "x": {
            "flatten": true
          }
        }
      },
      "x": {
        "flatten": true,
      }
    },
    "favMovie": {
      "title": "Do you have a favourite colour?",
      "type": "string",
      "default": 'fav default 0',
    },
    "color": {
      "title": "Favourite colour",
      "type": "object",
      "properties": {
        "favColor": {
          "title": "Do you have a favourite colour?",
          "type": "string"
        },
        "cinema": {
          "type": "object",
          "required": [
            "favCinema",
            "favBook"
          ],
          "properties": {
            "favCinema": {
              "title": "Do you have a favourite movie?",
              "type": "string",
              x: {
                validators: [(props, values) => {
                  return values ? undefined : 'sync validation, return error value';
                }]
              }
            },
            "favBook": {
              "title": "Do you have a favourite book?",
              "type": "string"
            }
          },
          "x": {
            "flatten": "cinema_"
          }
        }
      },
      "x": {
        "flatten": "color_"
      }
    },
    "movies": {
      "type": "object",
      x: {
        validators: [
          (props, values) => {
            return values.cinema.favCinema ? undefined : {favMovie: 'sync validation, return error value', cinema: {favCinema: 'test, return error value'}};
          },
          (props, values) => {
            return values.cinema.favCinema ? undefined : {cinema: 'test cinema, return error value'};
          },
          (props, values) => {
            return new Promise((resolve) => {
              setTimeout(() => resolve(values.cinema.favCinema ? undefined : {cinema: 'async validation, return error value'}), 100)
            });
          }

        ]
      },
      "properties": {
        "favMovie": {
          "title": "Do you have a favourite movie?",
          "type": "string",
          "default": "favMovie default",
        },
        "cinema": {
          "type": "object",
          "properties": {
            "favCinema": {
              "title": "Do you have a favourite movie?",
              "type": "string"
            },
            "favBook": {
              "title": "Favourite book?",
              "type": "string",
              "default": "favBook default",
              "x": {
                "dataMap": [['./@/values', '#/mapFavBook/@/values']]
              }
            },
            "mapfavMovie": {
              "title": "Mapped value from movies.cinema.favBook",
              "type": "string"
            }
          },
          "x": {
            "flatten": "mc_"
          }
        }
      }
    },
    "mapFavBook": {
      "title": "Mapped value from movies.cinema.favBook",
      "type": "string",
      x: {
        validators: [
          (props, values) => {
            return new Promise((resolve) => {
              setTimeout(() => resolve([{level: 3, text: 'async validation, return error value'}]), 100)
            });
          }
        ]
      },
    }
  },
  "x": {
    "dataMap": [['#/movies/favMovie/@/values', '#/movies/cinema/mapfavMovie/@/values']]
  }
}
