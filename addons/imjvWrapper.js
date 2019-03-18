export default function (isjv) {
  return function (schema) {
    const validator = isjv(schema, {greedy: true});
    return function (data) {
      validator(data);
      let result = validator.errors;
      if (!result) return [];
      if (!Array.isArray(result)) result = [result];
      return result.map((item) => [item.field.replace('["', '.').replace('"]', '').split('.').slice(1), item.message])
    }
  }
}