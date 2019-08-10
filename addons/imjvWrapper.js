export default function (isjv) {
  return function (schema) {
    if(schema.oneOf){
      schema = {...schema, anyOf:schema.oneOf}
      delete schema.oneOf;
    }
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