const SymData = Symbol.for('FFormData');

export default function dehydrate(state) {
  const res = [];
  if (state[SymData]) res.push("[Symbol.for('FFormData')]:" + JSON.stringify(state[SymData]));
  Object.keys(state).forEach(k => state[k] && res.push(JSON.stringify(k) + ':' + dehydrate(state[k])));
  return '{' + res.join(',') + '}';
}