'use strict';

const ou = require('./objectUtils');

const alternative = require('./alternative');


const types = {
  alternative: function(fields, props) {
    const s = alternative.schema(props.getValue(props.path), props.schema, props.context);

    return types.object(fields, ou.merge(props, { schema: s }));
  },
  array: function(fields, props) {
    const move = function(props, i, n) {
      return function(to) {
        if(!canMoveUp(i, n) && !canMoveDown(i, n)) return;
        const newList = props.getValue(props.path);
        const value = newList.splice(to, 1);

        newList.splice(i, 0, value[0]);
        props.update(props.path, newList, newList);
      };
    };
    const canMoveUp = function(i, n) {
      return i > 0 && i < n - 1;
    };
    const moveUp = function(props, i, n) {
      return function() {
        if(!canMoveUp(i, n)) return;
        const newList = props.getValue(props.path);
        const value = newList.splice(i, 1);

        newList.splice(i - 1, 0, value[0]);
        props.update(props.path, newList, newList);
      };
    };

    const canMoveDown = function(i, n) {
      return n > 1 && i < n - 2;
    };
    const moveDown = function(props, i, n) {
      return function() {
        if(!canMoveDown(i, n)) return;
        const newList = props.getValue(props.path);
        const value = newList.splice(i, 1);

        newList.splice(i + 1, 0, value[0]);
        props.update(props.path, newList, newList);
      };
    };

    const canRemoveItem = function(i, n) {
      return i < n;
    };

    const removeItem = function(props, i, n) {
      return function() {
        if(!canRemoveItem(i, n)) return;

        const newList = props.getValue(props.path);
        newList.splice(i, 1);
        props.update(props.path, newList, newList);
      };
    };

    const n = (props.getValue(props.path) || []).length + 1;
    const list = [];
    for (let i = 0; i < n; ++i) {
      list.push(fields.make(fields, ou.merge(props, {
        schema       : props.schema.items,
        path         : props.path.concat(i),
        move         : move(props, i, n),
        moveUp       : moveUp(props, i, n),
        moveDown     : moveDown(props, i, n),
        canMoveUp    : canMoveUp(i, n),
        canMoveDown  : canMoveDown(i, n),
        removeItem   : removeItem(props, i, n),
        canRemoveItem: canRemoveItem(i, n)
      })));
    }

    return list;
  },
  object: function(fields, props) {
    const keys = fullOrdering(props.schema['x-ordering'], props.schema.properties);

    return keys.map(function(key) {
      return fields.make(fields, ou.merge(props, {
        schema: props.schema.properties[key],
        path  : props.path.concat(key)
      }));
    });
  },
};

module.exports = types;

function fullOrdering(list, obj) {
  const keys = Object.keys(obj || {});
  const result = [];
  let i, k;

  for (i in list || []) {
    k = list[i];
    if (keys.indexOf(k) >= 0) {
      result.push(k);
    }
  }

  for (i in keys) {
    k = keys[i];
    if (result.indexOf(k) < 0) {
      result.push(k);
    }
  }

  return result;
}
