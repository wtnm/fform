const strip = require('strip-comments');
const fs = require('fs');


function minifyProps(source) {
  fs.writeFileSync('./source.js', source);
  // return source;
  let src = strip(source);

  let regsStrProps = [/\[\\"|\["(?:\\"|[^"])*"]/g, /\[\\'|\['(?:\\'|[^'])*']/g];
  let i = 0;
  let stringsProps = [];
  let stringProps2num = {};
  let srcNostrProps = src;
  regsStrProps.forEach((regexp) => {
    let match = regexp.exec(src);
    while (match !== null) {
      srcNostrProps = srcNostrProps.replace(match[0], ` /__stringProp#_${i}__ `);
      stringsProps[i] = match[0];
      let unquoted = match[0].split('').slice(2, -2).join('');
      if (unquoted !== 'use strict') {
        if (!stringProps2num['_' + unquoted]) stringProps2num['_' + unquoted] = [];
        stringProps2num['_' + unquoted].push(i);
      }
      i++;
      match = regexp.exec(src);
    }
  });


  let regs = [/\\"|"(?:\\"|[^"])*"/g, /\\'|'(?:\\'|[^'])*'/g, /\\`|`(?:\\`|[^`])*`/g];
  let strings = [];
  let string2num = {};
  let srcNostr = srcNostrProps;
  regs.forEach((regexp) => {
    let match = regexp.exec(srcNostrProps);
    while (match !== null) {
      srcNostr = srcNostr.replace(match[0], ` /__string#_${i}__ `);
      strings[i] = match[0];
      let unquoted = match[0].split('').slice(1, -1).join('');
      if (unquoted !== 'use strict') {
        if (!string2num['_' + unquoted]) string2num['_' + unquoted] = [];
        string2num['_' + unquoted].push(i);
      }
      i++;
      match = regexp.exec(srcNostrProps);
    }
  });

  let regexp = /(?:[^.])(\.[a-zA-Z_$][a-zA-Z_$0-9]*)/g;
  let match = regexp.exec(srcNostr);
  let props = [];
  let props2num = {};
  let srcNoprops = srcNostr;

  // let propsReplace = {};
  // let propsCnt = {};
  // let propsBenefit = {};
  while (match !== null) {
    // matched text: match[0]
    // match start: match.index
    // capturing group n: match[n]
    let prop = match[1];
    srcNoprops = srcNoprops.replace(match[0], match[0][0] + ` /__prop#_${i}__ `);
    props[i] = match[1];
    let unquoted = match[1].split('').slice(1).join('');
    if (!props2num['_' + unquoted]) props2num['_' + unquoted] = [];
    props2num['_' + unquoted].push(i);

    // if (!propsReplace[prop]) propsReplace[prop] = [];
    // if (!~propsReplace[prop].indexOf(match[0])) propsReplace[prop].push(match[0]);
    // if (!propsCnt[prop]) propsCnt[prop] = 0;
    // propsCnt[prop]++;
    // propsBenefit[prop] = propsCnt[prop] * prop.length - (5 + prop.length + propsCnt[prop] * 3);
    i++;
    match = regexp.exec(srcNostr);
  }

  fs.writeFileSync('./sourceReplaced.js', srcNoprops);

  let benefit = {};

  Object.keys(stringProps2num).forEach(key => {
    if (!benefit[key]) benefit[key] = -2 - key.length;
    benefit[key] += stringProps2num[key].length * (key.length - 1)
  });
  Object.keys(props2num).forEach(key => {
    if (!benefit[key]) benefit[key] = -4 - key.length;
    benefit[key] += props2num[key].length * (key.length - 4)
  });

  let keys = Object.keys(benefit).filter((key) => benefit[key] > 4);
  keys.sort((a, b) => benefit[b] - benefit[a]);

  // console.log(keys);
  let vars = [];
  j = 0;
  keys.forEach((key) => {
    let keyName = key.split('').slice(1).join('');
    let keyVarName = '__$_' + j.toString() + '__';
    vars.push(`${keyVarName}='${keyName}'`);
    stringProps2num[key] && stringProps2num[key].forEach(i => srcNoprops = srcNoprops.split(` /__stringProp#_${i}__`).join(`[${keyVarName}]`));
    props2num[key] && props2num[key].forEach(i => srcNoprops = srcNoprops.split(` /__prop#_${i}__`).join(`[${keyVarName}]`));
    j++;
  });
  strings.forEach((val, i) => {
    srcNoprops = srcNoprops.split(` /__string#_${i}__ `).join(val) //.replace(` /__string#_${i}__ `, val);
  });
  stringsProps.forEach((val, i) => {
    srcNoprops = srcNoprops.split(` /__stringProp#_${i}__ `).join(val) //.replace(` /__stringProp#_${i}__ `, val);
  });
  props.forEach((val, i) => {
    srcNoprops = srcNoprops.split(` /__prop#_${i}__ `).join(val) //.replace(` /__prop#_${i}__ `, val);
  });
  let varLines = [];
  // for (let j = 0; j < vars.length; j += 30) varLines.push('var=' + vars.slice(j, j+30).join(',')+';');

  src = `"use strict";\n` + (vars.length ? `var ${vars.join(',')};` : ``) + srcNoprops.split('"use strict";').join('');
  fs.writeFileSync('./src.js', src, 'utf-8');
  // console.log(propsBenefit);
  return src;
};

module.exports = minifyProps;

minifyProps(fs.readFileSync('./source.js', 'utf-8'));

// /(?=([^'\\]*(\\.|'([^'\\]*\\.)*[^'\\]*'))*[^']*$)/