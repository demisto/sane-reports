import validator from 'validator';

export function isNumber(value) {
  return Number.isInteger(value) || (value && validator.isNumeric(value));
}
