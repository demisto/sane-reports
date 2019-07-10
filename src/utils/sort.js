import moment from 'moment';
import { isDateNotValid } from './time';
import { sortStrings } from './strings';
import { isNumber, isBoolean } from 'lodash';

export function sortDates(date1, date2, asc = true) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  if (!isNaN(d1) && !isNaN(d2)) {
    const m1 = moment(d1.toISOString());
    const m2 = moment(d2.toISOString());
    if (m1.isValid() && m2.isValid()) {
      if (m1.isBefore(m2)) {
        return asc ? -1 : 1;
      }
      if (m1.isAfter(m2)) {
        return asc ? 1 : -1;
      }
    }
  }
  return 0;
}

export function compareFields(f1, f2) {
  if (typeof f1 === 'string' && typeof f2 === 'string') {
    if (isNumber(f1) && isNumber(f2)) {
      const n1 = parseInt(f1, 10);
      const n2 = parseInt(f2, 10);
      return n1 - n2;
    }
    if (!isDateNotValid(f1) && !isDateNotValid(f2)) {
      return sortDates(f1, f2);
    }
    return sortStrings(f1, f2);
  }
  if (isBoolean(f1) || isBoolean(f2)) {
    return (f2 || false) - (f1 || false);
  }
  if (f1 > f2) {
    return 1;
  }
  if (f1 < f2) {
    return -1;
  }
  return 0;
}

export function sortByFieldsWithPriority(fields) {
  return (a, b) => {
    let weight = 0;
    for (let i = 0; i < fields.length; i++) {
      weight += compareFields(a[fields[i]], b[fields[i]]) * ((fields.length - 1 - i) * 100 || 1);
    }
    return weight;
  };
}
