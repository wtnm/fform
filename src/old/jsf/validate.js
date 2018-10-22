const ou = require('./objectUtils');
const alternative = require('./alternative');

const checkNumber = function(schema, instance) {
  const errors = [];

  if (schema.maximum !== null) {
    if (instance > schema.maximum)
      errors.push('may be at most ' + schema.maximum);
    else if (schema.exclusiveMaximum && instance >= schema.maximum)
      errors.push('must be less than ' + schema.maximum);
  }
  if (schema.minimum !== null) {
    if (instance < schema.minimum)
      errors.push('must be at least ' + schema.minimum);
    else if (schema.exclusiveMinimum && instance <= schema.minimum)
      errors.push('must be more than ' + schema.minimum);
  }
  if (schema.multipleOf != null) {
    if ((instance / schema.multipleOf) % 1 != 0)
      errors.push('must be a multiple of ' + schema.multipleOf);
  }

  return errors;
};


const fieldErrors = function(errors) {
  if (errors.length > 0)
    return [ { path: [], errors: errors } ];
  else
    return [];
};


const validator = {};


validator.boolean = function(schema, instance) {
  const errors = [];

  if (typeof instance != 'boolean')
    errors.push('must be boolean');

  return fieldErrors(errors);
};


validator.enum = function(schema, instance) {
  const errors = [];

  if (schema.enum.indexOf(instance) < 0)
    errors.push('value not in list');

  return fieldErrors(errors);
};


validator.number = function(schema, instance) {
  let errors = [];

  if (typeof instance != 'number')
    errors.push('must be a number');
  else
    errors = checkNumber(schema, instance);

  return fieldErrors(errors);
};


validator.integer = function(schema, instance) {
  let errors = [];

  if (typeof instance != 'number')
    errors.push('must be a number');
  else {
    errors = checkNumber(schema, instance);
    if (instance % 1 > 0)
      errors.unshift('must be an integer');
  }

  return fieldErrors(errors);
};


validator.string = function(schema, instance) {
  let errors = [];

  if (typeof instance != 'string')
    errors.push('must be a string');
  else {
    if (schema.maxLength != null && instance.length > schema.maxLength)
      errors.push('may have at most ' + schema.maxLength + ' characters');
    if (schema.minLength != null && instance.length < schema.minLength)
      errors.push('must have at least ' + schema.minLength + ' characters');
    if (schema.pattern != null && !(RegExp(schema.pattern).test(instance)))
      errors.push('must match ' + schema.pattern);
  }

  return fieldErrors(errors);
};


validator.array = function(schema, instance, context) {
  let errors = [];
  let result, i, j;

  if (!Array.isArray(instance))
    return fieldErrors(['must be an array']);
  else {
    if (schema.maxItems != null && instance.length > schema.maxItems)
      errors.push('may have at most ' + schema.maxItems + ' items');
    if (schema.minItems != null && instance.length < schema.minItems)
      errors.push('must have at least ' + schema.minItems + ' items');
    result = fieldErrors(errors);

    if (schema.items != null) {
      for (i in instance) {
        errors = validate(schema.items, instance[i], context);
        for (j in errors) {
          result.push({
            path  : [i].concat(errors[j].path),
            errors: errors[j].errors
          });
        }
      }
    }
  }

  return result;
};


const requires = function(schema, key) {
  let subschema;

  if (schema.required != null && schema.required.indexOf(key) >= 0)
    return 'must be present';
  else {
    subschema = schema.properties[key];
    if (subschema.type == 'array' && subschema.minItems > 0)
      return 'must have at least ' + subschema.minItems + ' items';
    else
      return null;
  }
};

validator.object = function(schema, instance, context) {
  let result = [];
  let key, errors, i;

  if (instance == null)
    instance = {};

  const alternativeSchema = alternative.schema(instance, schema, context);
  schema = alternativeSchema || schema;

  if (instance.constructor !== Object)
    result.push({ path: [], errors: ['must be a plain object'] });
  else {
    for (key in schema.properties) {
      if (instance.hasOwnProperty(key)) {
        errors = validate(schema.properties[key], instance[key], context);
        for (i = 0; i < errors.length; ++i)
          result.push({
            path  : [key].concat(errors[i].path),
            errors: errors[i].errors
          });
      }
      else if (requires(schema, key)) {
        result.push({
          path  : [key],
          errors: [requires(schema, key)]
        });
      }
    }
  }

  return result;
};


const cat = function(arrayOfArrays) {
  return [].concat.apply([], arrayOfArrays);
};


const resolve = require('./resolve');


const validate = function(schema, instance, context) {
  const effectiveContext = context || schema;
  const effectiveSchema  = resolve(schema, effectiveContext);

  if (effectiveSchema.allOf) {
    const results = [ou.without(effectiveSchema, 'allOf')]
      .concat(effectiveSchema.allOf)
      .map(function(schema) {
        return validate(schema, instance, effectiveContext);
      });
    return cat(results);
  } else {
    const type = effectiveSchema.enum ? 'enum' : effectiveSchema.type;
    if (type)
      return validator[type](effectiveSchema, instance, effectiveContext);
    else
      return [];
  }
};

module.exports = validate;
