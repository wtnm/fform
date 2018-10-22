'use strict';

var $ = require('./helpers');

function get(obj, path) {
  var hash = path.split('#')[1];

  var parts = hash.split('/').slice(1);

  while (parts.length) {
    var key = decodeURIComponent(parts.shift()).replace(/~1/g, '/').replace(/~0/g, '~');

    if (typeof obj[key] === 'undefined') {
      throw new Error('JSON pointer not found: ' + path);
    }

    obj = obj[key];
  }

  return obj;
}

var find = module.exports = function(id, refs) {
  var target = refs[id] || refs[id.split('#')[1]] || refs[$.getDocumentURI(id)];

  if (target) {
    target = id.indexOf('#/') > -1 ? get(target, id) : target;
  } else {
    for (var key in refs) {
      if ($.resolveURL(refs[key].id, id) === refs[key].id) {
        target = refs[key];
        break;
      }
    }
  }

  if (!target) {
    throw new Error('Reference not found: ' + id);
  }

  while (target.$ref) {
    target = find(target.$ref, refs);
  }

  return target;
};
