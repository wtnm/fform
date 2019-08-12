export default function (validator) {
  return function (schema) {
    return function (data) {
      let res = validator.validate(data, schema, {nestedErrors: true});
      let errors = res.errors;
      if (!errors) return [];
      return errors.map(item =>
        [
          item.property.replace(/\["/g, '.').replace(/"]/g, '').replace(/\[/g, '.').replace(/]/g, '').split('.').slice(1),
          item.message
        ]
      )
    }
  }
}