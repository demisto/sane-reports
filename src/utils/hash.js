import { forEach, isObject, map } from 'lodash';

function hashSimpleValue(str) {
  const strValue = '' + str;
  let hashValue = 5381;
  let i = strValue.length;

  while (i) {
    hashValue = (hashValue * 33) ^ strValue.charCodeAt(--i);
  }
  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
     * integers. Since we want the results to be always positive, convert the
     * signed int to an unsigned by doing an unsigned bitshift. */
  return hashValue >>> 0;
}

export function hash(ArrayOrValue) {
  if (!ArrayOrValue) {
    return ArrayOrValue;
  }
  if (Array.isArray(ArrayOrValue)) {
    return map(ArrayOrValue, (element) => {
      return hash(element);
    });
  } else if (isObject(ArrayOrValue)) {
    const result = {};
    forEach(ArrayOrValue, (value, key) => {
      result[key] = hash(value);
    });
    return result;
  }
  return hashSimpleValue(ArrayOrValue);
}
