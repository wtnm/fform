const SymData = Symbol.for('FFormData');

export default function dehydrate(state) {
  const res = [];
  if (state[SymData]) res.push("[Symbol.for('FFormData')]:" + JSON.stringify(state[SymData]));
  Object.keys(state).forEach(k => state[k] && res.push(JSON.stringify(k) + ':' + dehydrate(state[k])));
  return '{' + res.join(',') + '}';
}

let a = {
  [Symbol.for('FFormData')]: {
    "params": {},
    "messages": {},
    "oneOf": 0,
    "status": {"invalid": 0, "dirty": 0, "untouched": 3, "pending": 0, "valid": true, "touched": false, "pristine": true},
    "fData": {"type": "array", "title": "array level 1", "canAdd": true},
    "length": 3,
    "current": [[{
      "strValue": "array level 1 objValue default 0",
      "arrValue": ["array level 1 arrValue", "arrValue default"],
      "mapValue": "array level 1 objValue default 0",
      "mapArrValue": ["array level 1 objValue default 0"],
      "turpleValue": ["turpleValue default", 4, "turpleValue default"]
    }, {
      "mapValue": "strValue default",
      "strValue": "strValue default",
      "mapArrValue": ["strValue default"],
      "arrValue": ["arrValue default", "arrValue default"],
      "turpleValue": ["turpleValue default", 4, "turpleValue default"]
    }], [{
      "strValue": "array level 1 objValue default 1",
      "mapValue": "array level 1 objValue default 1",
      "mapArrValue": ["array level 1 objValue default 1"],
      "arrValue": ["arrValue default", "arrValue default"],
      "turpleValue": ["turpleValue default", 4, "turpleValue default"]
    }, {
      "mapValue": "strValue default",
      "strValue": "strValue default",
      "mapArrValue": ["strValue default"],
      "arrValue": ["arrValue default", "arrValue default"],
      "turpleValue": ["turpleValue default", 4, "turpleValue default"]
    }], [{
      "strValue": "array level 2 objValue default",
      "turpleValue": ["turpleValue level 2 default", 1, "turpleValue default"],
      "mapValue": "array level 2 objValue default",
      "mapArrValue": ["array level 2 objValue default"],
      "arrValue": ["arrValue default", "arrValue default"]
    }, {"mapValue": "strValue default", "strValue": "strValue default", "mapArrValue": ["strValue default"], "arrValue": ["arrValue default", "arrValue default"], "turpleValue": ["turpleValue default", 4, "turpleValue default"]}]],
    "inital": [[{
      "strValue": "array level 1 objValue default 0",
      "arrValue": ["array level 1 arrValue", "arrValue default"],
      "mapValue": "array level 1 objValue default 0",
      "mapArrValue": ["array level 1 objValue default 0"],
      "turpleValue": ["turpleValue default", 4, "turpleValue default"]
    }, {
      "mapValue": "strValue default",
      "strValue": "strValue default",
      "mapArrValue": ["strValue default"],
      "arrValue": ["arrValue default", "arrValue default"],
      "turpleValue": ["turpleValue default", 4, "turpleValue default"]
    }], [{
      "strValue": "array level 1 objValue default 1",
      "mapValue": "array level 1 objValue default 1",
      "mapArrValue": ["array level 1 objValue default 1"],
      "arrValue": ["arrValue default", "arrValue default"],
      "turpleValue": ["turpleValue default", 4, "turpleValue default"]
    }, {
      "mapValue": "strValue default",
      "strValue": "strValue default",
      "mapArrValue": ["strValue default"],
      "arrValue": ["arrValue default", "arrValue default"],
      "turpleValue": ["turpleValue default", 4, "turpleValue default"]
    }], [{
      "strValue": "array level 2 objValue default",
      "turpleValue": ["turpleValue level 2 default", 1, "turpleValue default"],
      "mapValue": "array level 2 objValue default",
      "mapArrValue": ["array level 2 objValue default"],
      "arrValue": ["arrValue default", "arrValue default"]
    }, {"mapValue": "strValue default", "strValue": "strValue default", "mapArrValue": ["strValue default"], "arrValue": ["arrValue default", "arrValue default"], "turpleValue": ["turpleValue default", 4, "turpleValue default"]}]],
    "default": [[{
      "strValue": "array level 1 objValue default 0",
      "arrValue": ["array level 1 arrValue", "arrValue default"],
      "mapValue": "array level 1 objValue default 0",
      "mapArrValue": ["array level 1 objValue default 0"],
      "turpleValue": ["turpleValue default", 4, "turpleValue default"]
    }, {
      "mapValue": "strValue default",
      "strValue": "strValue default",
      "mapArrValue": ["strValue default"],
      "arrValue": ["arrValue default", "arrValue default"],
      "turpleValue": ["turpleValue default", 4, "turpleValue default"]
    }], [{
      "strValue": "array level 1 objValue default 1",
      "mapValue": "array level 1 objValue default 1",
      "mapArrValue": ["array level 1 objValue default 1"],
      "arrValue": ["arrValue default", "arrValue default"],
      "turpleValue": ["turpleValue default", 4, "turpleValue default"]
    }, {
      "mapValue": "strValue default",
      "strValue": "strValue default",
      "mapArrValue": ["strValue default"],
      "arrValue": ["arrValue default", "arrValue default"],
      "turpleValue": ["turpleValue default", 4, "turpleValue default"]
    }], [{
      "strValue": "array level 2 objValue default",
      "turpleValue": ["turpleValue level 2 default", 1, "turpleValue default"],
      "mapValue": "array level 2 objValue default",
      "mapArrValue": ["array level 2 objValue default"],
      "arrValue": ["arrValue default", "arrValue default"]
    }, {"mapValue": "strValue default", "strValue": "strValue default", "mapArrValue": ["strValue default"], "arrValue": ["arrValue default", "arrValue default"], "turpleValue": ["turpleValue default", 4, "turpleValue default"]}]]
  }, "0": {
    [Symbol.for('FFormData')]: {
      "params": {"uniqKey": "ju2763zh0.asaj8i3ee4s"},
      "messages": {},
      "oneOf": 0,
      "status": {"invalid": 0, "dirty": 0, "untouched": 2, "pending": 0, "valid": true, "touched": false, "pristine": true},
      "fData": {"type": "array", "title": "array level 2", "canAdd": true},
      "length": 2,
      "arrayItem": {"canUp": false, "canDown": true, "canDel": true}
    }, "0": {
      [Symbol.for('FFormData')]: {
        "params": {"uniqKey": "ju2763zg0.sl72expz9m"},
        "messages": {},
        "oneOf": 0,
        "status": {"invalid": 0, "dirty": 0, "untouched": 5, "pending": 0, "valid": true, "touched": false, "pristine": true},
        "fData": {"type": "object", "title": "array object level 1"},
        "arrayItem": {"canUp": false, "canDown": true, "canDel": true}
      },
      "mapValue": {
        [Symbol.for('FFormData')]: {
          "params": {},
          "messages": {},
          "oneOf": 0,
          "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
          "fData": {"type": "string"},
          "value": "array level 1 objValue default 0",
          "controls": {"hidden": true}
        }
      },
      "strValue": {
        [Symbol.for('FFormData')]: {
          "params": {},
          "messages": {},
          "oneOf": 0,
          "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
          "fData": {"type": "string"},
          "value": "array level 1 objValue default 0"
        }
      },
      "mapArrValue": {
        [Symbol.for('FFormData')]: {
          "params": {},
          "messages": {},
          "oneOf": 0,
          "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
          "fData": {"type": "array", "canAdd": true},
          "length": 1
        },
        "0": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zc0.ct6ncpwlcd7"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "string"},
            "value": "array level 1 objValue default 0",
            "arrayItem": {"canUp": false, "canDown": false, "canDel": true}
          }
        }
      },
      "arrValue": {
        [Symbol.for('FFormData')]: {
          "params": {},
          "messages": {},
          "oneOf": 0,
          "status": {"invalid": 0, "dirty": 0, "untouched": 2, "pending": 0, "valid": true, "touched": false, "pristine": true},
          "fData": {"type": "array", "canAdd": true},
          "length": 2
        },
        "0": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zf0.4j6wego5iwe"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "string"},
            "value": "array level 1 arrValue",
            "arrayItem": {"canUp": false, "canDown": true, "canDel": true}
          }
        },
        "1": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zf0.x0flfmrylwd"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "string"},
            "value": "arrValue default",
            "arrayItem": {"canUp": true, "canDown": false, "canDel": true}
          }
        }
      },
      "turpleValue": {
        [Symbol.for('FFormData')]: {
          "params": {},
          "messages": {},
          "oneOf": 0,
          "status": {"invalid": 0, "dirty": 0, "untouched": 3, "pending": 0, "valid": true, "touched": false, "pristine": true},
          "fData": {"type": "array", "canAdd": false},
          "length": 3
        },
        "0": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zf0.atwf15pidqg"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "string"},
            "value": "turpleValue default",
            "arrayItem": {"canUp": false, "canDown": false, "canDel": false}
          }
        },
        "1": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zf0.9iejh1agm6"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "number"},
            "value": 4,
            "arrayItem": {"canUp": false, "canDown": true, "canDel": true}
          }
        },
        "2": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zg0.53kgsc7ukjs"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "string", "oneOfSelector": true},
            "value": "turpleValue default",
            "arrayItem": {"canUp": true, "canDown": false, "canDel": true}
          }
        }
      }
    }, "1": {
      [Symbol.for('FFormData')]: {
        "params": {"uniqKey": "ju2763zh0.hjgbi96v87i"},
        "messages": {},
        "oneOf": 0,
        "status": {"invalid": 0, "dirty": 0, "untouched": 5, "pending": 0, "valid": true, "touched": false, "pristine": true},
        "fData": {"type": "object", "title": "array object level 1"},
        "arrayItem": {"canUp": true, "canDown": false, "canDel": true}
      },
      "mapValue": {
        [Symbol.for('FFormData')]: {
          "params": {},
          "messages": {},
          "oneOf": 0,
          "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
          "fData": {"type": "string"},
          "value": "strValue default",
          "controls": {"hidden": true}
        }
      },
      "strValue": {
        [Symbol.for('FFormData')]: {
          "params": {},
          "messages": {},
          "oneOf": 0,
          "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
          "fData": {"type": "string"},
          "value": "strValue default"
        }
      },
      "mapArrValue": {
        [Symbol.for('FFormData')]: {
          "params": {},
          "messages": {},
          "oneOf": 0,
          "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
          "fData": {"type": "array", "canAdd": true},
          "length": 1
        },
        "0": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zh0.o2jzv34gxq"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "string"},
            "value": "strValue default",
            "arrayItem": {"canUp": false, "canDown": false, "canDel": true}
          }
        }
      },
      "arrValue": {
        [Symbol.for('FFormData')]: {
          "params": {},
          "messages": {},
          "oneOf": 0,
          "status": {"invalid": 0, "dirty": 0, "untouched": 2, "pending": 0, "valid": true, "touched": false, "pristine": true},
          "fData": {"type": "array", "canAdd": true},
          "length": 2
        },
        "0": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zh0.6mcjill2jkw"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "string"},
            "value": "arrValue default",
            "arrayItem": {"canUp": false, "canDown": true, "canDel": true}
          }
        },
        "1": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zh0.0cnh71pdczgb"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "string"},
            "value": "arrValue default",
            "arrayItem": {"canUp": true, "canDown": false, "canDel": true}
          }
        }
      },
      "turpleValue": {
        [Symbol.for('FFormData')]: {
          "params": {},
          "messages": {},
          "oneOf": 0,
          "status": {"invalid": 0, "dirty": 0, "untouched": 3, "pending": 0, "valid": true, "touched": false, "pristine": true},
          "fData": {"type": "array", "canAdd": false},
          "length": 3
        },
        "0": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zh0.n424vu3fqqg"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "string"},
            "value": "turpleValue default",
            "arrayItem": {"canUp": false, "canDown": false, "canDel": false}
          }
        },
        "1": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zh0.v985j7imz2n"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "number"},
            "value": 4,
            "arrayItem": {"canUp": false, "canDown": true, "canDel": true}
          }
        },
        "2": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zh0.v0uc8wfoaq8"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "string", "oneOfSelector": true},
            "value": "turpleValue default",
            "arrayItem": {"canUp": true, "canDown": false, "canDel": true}
          }
        }
      }
    }
  }, "1": {
    [Symbol.for('FFormData')]: {
      "params": {"uniqKey": "ju2763zj0.zocaowj6ig"},
      "messages": {},
      "oneOf": 0,
      "status": {"invalid": 0, "dirty": 0, "untouched": 2, "pending": 0, "valid": true, "touched": false, "pristine": true},
      "fData": {"type": "array", "title": "array level 2", "canAdd": true},
      "length": 2,
      "arrayItem": {"canUp": true, "canDown": true, "canDel": true}
    }, "0": {
      [Symbol.for('FFormData')]: {
        "params": {"uniqKey": "ju2763zi0.iuqr0aojr3t"},
        "messages": {},
        "oneOf": 0,
        "status": {"invalid": 0, "dirty": 0, "untouched": 5, "pending": 0, "valid": true, "touched": false, "pristine": true},
        "fData": {"type": "object", "title": "array object level 1"},
        "arrayItem": {"canUp": false, "canDown": true, "canDel": true}
      },
      "mapValue": {
        [Symbol.for('FFormData')]: {
          "params": {},
          "messages": {},
          "oneOf": 0,
          "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
          "fData": {"type": "string"},
          "value": "array level 1 objValue default 1",
          "controls": {"hidden": true}
        }
      },
      "strValue": {
        [Symbol.for('FFormData')]: {
          "params": {},
          "messages": {},
          "oneOf": 0,
          "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
          "fData": {"type": "string"},
          "value": "array level 1 objValue default 1"
        }
      },
      "mapArrValue": {
        [Symbol.for('FFormData')]: {
          "params": {},
          "messages": {},
          "oneOf": 0,
          "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
          "fData": {"type": "array", "canAdd": true},
          "length": 1
        },
        "0": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zi0.xugynfgbj5j"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "string"},
            "value": "array level 1 objValue default 1",
            "arrayItem": {"canUp": false, "canDown": false, "canDel": true}
          }
        }
      },
      "arrValue": {
        [Symbol.for('FFormData')]: {
          "params": {},
          "messages": {},
          "oneOf": 0,
          "status": {"invalid": 0, "dirty": 0, "untouched": 2, "pending": 0, "valid": true, "touched": false, "pristine": true},
          "fData": {"type": "array", "canAdd": true},
          "length": 2
        },
        "0": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zi0.jq4utk55qs"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "string"},
            "value": "arrValue default",
            "arrayItem": {"canUp": false, "canDown": true, "canDel": true}
          }
        },
        "1": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zi0.wtjt2r5kv8p"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "string"},
            "value": "arrValue default",
            "arrayItem": {"canUp": true, "canDown": false, "canDel": true}
          }
        }
      },
      "turpleValue": {
        [Symbol.for('FFormData')]: {
          "params": {},
          "messages": {},
          "oneOf": 0,
          "status": {"invalid": 0, "dirty": 0, "untouched": 3, "pending": 0, "valid": true, "touched": false, "pristine": true},
          "fData": {"type": "array", "canAdd": false},
          "length": 3
        },
        "0": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zi0.43gzm1n8l5s"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "string"},
            "value": "turpleValue default",
            "arrayItem": {"canUp": false, "canDown": false, "canDel": false}
          }
        },
        "1": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zi0.oknj7yqkyc9"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "number"},
            "value": 4,
            "arrayItem": {"canUp": false, "canDown": true, "canDel": true}
          }
        },
        "2": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zi0.6iickjrgala"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "string", "oneOfSelector": true},
            "value": "turpleValue default",
            "arrayItem": {"canUp": true, "canDown": false, "canDel": true}
          }
        }
      }
    }, "1": {
      [Symbol.for('FFormData')]: {
        "params": {"uniqKey": "ju2763zj0.9b7kpde5wpp"},
        "messages": {},
        "oneOf": 0,
        "status": {"invalid": 0, "dirty": 0, "untouched": 5, "pending": 0, "valid": true, "touched": false, "pristine": true},
        "fData": {"type": "object", "title": "array object level 1"},
        "arrayItem": {"canUp": true, "canDown": false, "canDel": true}
      },
      "mapValue": {
        [Symbol.for('FFormData')]: {
          "params": {},
          "messages": {},
          "oneOf": 0,
          "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
          "fData": {"type": "string"},
          "value": "strValue default",
          "controls": {"hidden": true}
        }
      },
      "strValue": {
        [Symbol.for('FFormData')]: {
          "params": {},
          "messages": {},
          "oneOf": 0,
          "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
          "fData": {"type": "string"},
          "value": "strValue default"
        }
      },
      "mapArrValue": {
        [Symbol.for('FFormData')]: {
          "params": {},
          "messages": {},
          "oneOf": 0,
          "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
          "fData": {"type": "array", "canAdd": true},
          "length": 1
        },
        "0": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zi0.nj5hyuws2q"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "string"},
            "value": "strValue default",
            "arrayItem": {"canUp": false, "canDown": false, "canDel": true}
          }
        }
      },
      "arrValue": {
        [Symbol.for('FFormData')]: {
          "params": {},
          "messages": {},
          "oneOf": 0,
          "status": {"invalid": 0, "dirty": 0, "untouched": 2, "pending": 0, "valid": true, "touched": false, "pristine": true},
          "fData": {"type": "array", "canAdd": true},
          "length": 2
        },
        "0": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zi0.wc6i9mfih8"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "string"},
            "value": "arrValue default",
            "arrayItem": {"canUp": false, "canDown": true, "canDel": true}
          }
        },
        "1": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zi0.xmo1txcpqab"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "string"},
            "value": "arrValue default",
            "arrayItem": {"canUp": true, "canDown": false, "canDel": true}
          }
        }
      },
      "turpleValue": {
        [Symbol.for('FFormData')]: {
          "params": {},
          "messages": {},
          "oneOf": 0,
          "status": {"invalid": 0, "dirty": 0, "untouched": 3, "pending": 0, "valid": true, "touched": false, "pristine": true},
          "fData": {"type": "array", "canAdd": false},
          "length": 3
        },
        "0": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zj0.1p6c0orag8x"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "string"},
            "value": "turpleValue default",
            "arrayItem": {"canUp": false, "canDown": false, "canDel": false}
          }
        },
        "1": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zj0.6c5ma94sm7"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "number"},
            "value": 4,
            "arrayItem": {"canUp": false, "canDown": true, "canDel": true}
          }
        },
        "2": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zj0.1g8tbz8b78xi"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "string", "oneOfSelector": true},
            "value": "turpleValue default",
            "arrayItem": {"canUp": true, "canDown": false, "canDel": true}
          }
        }
      }
    }
  }, "2": {
    [Symbol.for('FFormData')]: {
      "params": {"uniqKey": "ju2763zk0.0c88w9ip58iu"},
      "messages": {},
      "oneOf": 0,
      "status": {"invalid": 0, "dirty": 0, "untouched": 2, "pending": 0, "valid": true, "touched": false, "pristine": true},
      "fData": {"type": "array", "title": "array level 2", "canAdd": true},
      "length": 2,
      "arrayItem": {"canUp": true, "canDown": false, "canDel": true}
    }, "0": {
      [Symbol.for('FFormData')]: {
        "params": {"uniqKey": "ju2763zj0.iwgao173g2m"},
        "messages": {},
        "oneOf": 0,
        "status": {"invalid": 0, "dirty": 0, "untouched": 5, "pending": 0, "valid": true, "touched": false, "pristine": true},
        "fData": {"type": "object", "title": "array object level 1"},
        "arrayItem": {"canUp": false, "canDown": true, "canDel": true}
      },
      "mapValue": {
        [Symbol.for('FFormData')]: {
          "params": {},
          "messages": {},
          "oneOf": 0,
          "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
          "fData": {"type": "string"},
          "value": "array level 2 objValue default",
          "controls": {"hidden": true}
        }
      },
      "strValue": {
        [Symbol.for('FFormData')]: {
          "params": {},
          "messages": {},
          "oneOf": 0,
          "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
          "fData": {"type": "string"},
          "value": "array level 2 objValue default"
        }
      },
      "mapArrValue": {
        [Symbol.for('FFormData')]: {
          "params": {},
          "messages": {},
          "oneOf": 0,
          "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
          "fData": {"type": "array", "canAdd": true},
          "length": 1
        },
        "0": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zj0.ab89q56ctuj"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "string"},
            "value": "array level 2 objValue default",
            "arrayItem": {"canUp": false, "canDown": false, "canDel": true}
          }
        }
      },
      "arrValue": {
        [Symbol.for('FFormData')]: {
          "params": {},
          "messages": {},
          "oneOf": 0,
          "status": {"invalid": 0, "dirty": 0, "untouched": 2, "pending": 0, "valid": true, "touched": false, "pristine": true},
          "fData": {"type": "array", "canAdd": true},
          "length": 2
        },
        "0": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zj0.orb4dvrurib"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "string"},
            "value": "arrValue default",
            "arrayItem": {"canUp": false, "canDown": true, "canDel": true}
          }
        },
        "1": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zj0.9xhtc8sb2jg"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "string"},
            "value": "arrValue default",
            "arrayItem": {"canUp": true, "canDown": false, "canDel": true}
          }
        }
      },
      "turpleValue": {
        [Symbol.for('FFormData')]: {
          "params": {},
          "messages": {},
          "oneOf": 0,
          "status": {"invalid": 0, "dirty": 0, "untouched": 3, "pending": 0, "valid": true, "touched": false, "pristine": true},
          "fData": {"type": "array", "canAdd": false},
          "length": 3
        },
        "0": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zj0.cmrupdcnx1b"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "string"},
            "value": "turpleValue level 2 default",
            "arrayItem": {"canUp": false, "canDown": false, "canDel": false}
          }
        },
        "1": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zj0.h248yapkh7i"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "number"},
            "value": 1,
            "arrayItem": {"canUp": false, "canDown": true, "canDel": true}
          }
        },
        "2": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zj0.tq0wj5uhs3d"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "string", "oneOfSelector": true},
            "value": "turpleValue default",
            "arrayItem": {"canUp": true, "canDown": false, "canDel": true}
          }
        }
      }
    }, "1": {
      [Symbol.for('FFormData')]: {
        "params": {"uniqKey": "ju2763zk0.7v7x5m6hodp"},
        "messages": {},
        "oneOf": 0,
        "status": {"invalid": 0, "dirty": 0, "untouched": 5, "pending": 0, "valid": true, "touched": false, "pristine": true},
        "fData": {"type": "object", "title": "array object level 1"},
        "arrayItem": {"canUp": true, "canDown": false, "canDel": true}
      },
      "mapValue": {
        [Symbol.for('FFormData')]: {
          "params": {},
          "messages": {},
          "oneOf": 0,
          "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
          "fData": {"type": "string"},
          "value": "strValue default",
          "controls": {"hidden": true}
        }
      },
      "strValue": {
        [Symbol.for('FFormData')]: {
          "params": {},
          "messages": {},
          "oneOf": 0,
          "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
          "fData": {"type": "string"},
          "value": "strValue default"
        }
      },
      "mapArrValue": {
        [Symbol.for('FFormData')]: {
          "params": {},
          "messages": {},
          "oneOf": 0,
          "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
          "fData": {"type": "array", "canAdd": true},
          "length": 1
        },
        "0": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zk0.ty57j15ecq"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "string"},
            "value": "strValue default",
            "arrayItem": {"canUp": false, "canDown": false, "canDel": true}
          }
        }
      },
      "arrValue": {
        [Symbol.for('FFormData')]: {
          "params": {},
          "messages": {},
          "oneOf": 0,
          "status": {"invalid": 0, "dirty": 0, "untouched": 2, "pending": 0, "valid": true, "touched": false, "pristine": true},
          "fData": {"type": "array", "canAdd": true},
          "length": 2
        },
        "0": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zk0.zmh5kj2y8q"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "string"},
            "value": "arrValue default",
            "arrayItem": {"canUp": false, "canDown": true, "canDel": true}
          }
        },
        "1": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zk0.2e6ilpc2xmi"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "string"},
            "value": "arrValue default",
            "arrayItem": {"canUp": true, "canDown": false, "canDel": true}
          }
        }
      },
      "turpleValue": {
        [Symbol.for('FFormData')]: {
          "params": {},
          "messages": {},
          "oneOf": 0,
          "status": {"invalid": 0, "dirty": 0, "untouched": 3, "pending": 0, "valid": true, "touched": false, "pristine": true},
          "fData": {"type": "array", "canAdd": false},
          "length": 3
        },
        "0": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zk0.4h9yk74pvnu"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "string"},
            "value": "turpleValue default",
            "arrayItem": {"canUp": false, "canDown": false, "canDel": false}
          }
        },
        "1": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zk0.r2k6t14v0j"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "number"},
            "value": 4,
            "arrayItem": {"canUp": false, "canDown": true, "canDel": true}
          }
        },
        "2": {
          [Symbol.for('FFormData')]: {
            "params": {"uniqKey": "ju2763zk0.6chhvbpch2r"},
            "messages": {},
            "oneOf": 0,
            "status": {"invalid": 0, "dirty": 0, "untouched": 1, "pending": 0, "valid": true, "touched": false, "pristine": true},
            "fData": {"type": "string", "oneOfSelector": true},
            "value": "turpleValue default",
            "arrayItem": {"canUp": true, "canDown": false, "canDel": true}
          }
        }
      }
    }
  }
}