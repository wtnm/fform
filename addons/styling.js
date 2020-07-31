export function blocks({prefix = 'fform', blocks = ['Wrapper', 'Main', 'Title', 'Message']} = {}) {
  let result = {sets: {base: {}}};
  blocks.forEach(bl => {
    result.sets.base[bl] = {className: {[(prefix ? prefix + '-' : '') + 'block__' + bl.toLowerCase()]: true}}
  });
  return result;
}

export function fields({prefix = 'fform', blocks = ['Wrapper', 'Main', 'Title', 'Message']} = {}) {
  let result = {sets: {base: {}}};
  prefix = (prefix ? prefix + '-' : '') + 'field__';
  blocks.forEach(bl => {
    result.sets.base[bl] = {
      $_maps:
        {
          className: [
            {},
            {},
            {$: '^/fn/getClassNameByProp', args: [prefix, 'fieldName'], update: 'build', replace: false}]
        }
    }
  });
  return result;
}

export function presets({prefix = 'fform', blocks = ['Wrapper', 'Main', 'Title', 'Message']} = {}) {
  let result = {sets: {base: {}}};
  let prefix2 = (prefix ? prefix + '-' : '');
  prefix = (prefix ? prefix + '-' : '') + 'preset__';
  blocks.forEach(bl => {
    result.sets.base[bl] = {
      $_maps:
        {
          className: [
            {$: '^/fn/getClassNameByProp', args: [prefix, 'mainPreset'], update: 'build', replace: false},
            {$: '^/fn/getClassNameByProp', args: [prefix2, 'simple'], update: 'build', replace: false},
            {}]
        }
    }
  });
  return result;
}

export function statuses({prefix = 'fform', statuses = ['touched', 'submitted', 'pristine', 'invalid', 'pending'], blocks = ['Wrapper', 'Main', 'Title', 'Message']} = {}) {
  let result = {sets: {base: {}}};
  prefix = (prefix ? prefix + '-' : '') + 'status__';
  blocks.forEach(bl => {
    result.sets.base[bl] = {$_maps: {}};
    statuses.forEach(status => {
      result.sets.base[bl].$_maps [`className/${prefix}${status}`] = `@status/${status}`;
    })
  });
  return result;
}
