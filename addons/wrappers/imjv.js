export default function (validator) {
  return function (schema) {
    const validate = validator(schema, {greedy: true});
    return function (data) {
      validate(data);
      let errors = validate.errors;
      if (!errors) return [];
      if (!Array.isArray(errors)) errors = [errors];
      return errors.map((item) => [
        item.field.replace(/\["/g, '.').replace(/"]/g, '').replace(/\[/g, '.').replace(/]/g, '').split('.').slice(1),
        item.message
      ])
    }
  }
}