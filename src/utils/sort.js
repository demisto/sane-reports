import moment from 'moment';
import { isDateNotValid } from './time';
import { isNumber } from './validators';
import { isBoolean, get } from 'lodash';
import { INCIDENT_SEVERITY } from '../constants/Constants';

export function sortNumbers(n1, n2, asc = true) {
  if (n1 > n2) {
    return asc ? -1 : 1;
  }
  if (n1 < n2) {
    return asc ? 1 : -1;
  }
  return 0;
}

export function sortStrings(s1In, s2In, asc = true) {
  if (!isNaN(s1In) && !isNaN(s2In)) {
    const s1 = parseInt(s1In, 10);
    const s2 = parseInt(s2In, 10);
    return s1 - s2;
  }

  // make sure empty strings are in the end
  const s1 = s1In || '|||';
  const s2 = s2In || '|||';
  if ((s1.toLowerCase()) > (s2.toLowerCase())) {
    return asc ? 1 : -1;
  }
  if (s1.toLowerCase() < s2.toLowerCase()) {
    return asc ? -1 : 1;
  }
  // a must be equal to b
  return 0;
}

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

export function compareFields(f1, f2, asc = true) {
  if (typeof f1 === 'string' && typeof f2 === 'string') {
    if (isNumber(f1) && isNumber(f2)) {
      const n1 = parseInt(f1, 10);
      const n2 = parseInt(f2, 10);
      return asc ? n1 - n2 : n2 - n1;
    }
    if (!isDateNotValid(f1) && !isDateNotValid(f2)) {
      return sortDates(f1, f2, asc);
    }
    return sortStrings(f1, f2, asc);
  }
  if (isBoolean(f1) || isBoolean(f2)) {
    return asc ? (f2 || false) - (f1 || false) : (f1 || false) - (f2 || false);
  }
  return sortNumbers(f1, f2, !asc);
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

export function sortByField(fields, asc = true) {
  return (c1, c2) => {
    if (!c1 || !c2) {
      return 0;
    }

    let fieldsArr = fields;
    if (!Array.isArray(fields)) {
      fieldsArr = [fields];
    }

    let dirArr = asc;
    if (!Array.isArray(asc)) {
      dirArr = [asc];
    }

    let i = 0;
    let res;

    while (i < fieldsArr.length) {
      let f1;
      let f2;
      if (c1.toJS) {
        if (fieldsArr[i] && fieldsArr[i].indexOf('.') > 0) {
          const split = fieldsArr[i].split('.');
          f1 = c1.getIn(split);
          f2 = c2.getIn(split);
        } else {
          f1 = c1.get(fieldsArr[i]);
          f2 = c2.get(fieldsArr[i]);
        }
      } else if (fieldsArr[i] && fieldsArr[i].indexOf('.') > 0) {
        f1 = get(c1, fieldsArr[i]);
        f2 = get(c2, fieldsArr[i]);
      } else {
        f1 = c1[fieldsArr[i]];
        f2 = c2[fieldsArr[i]];
      }
      res = compareFields(f1, f2, dirArr[i] === undefined ? dirArr[dirArr.length - 1] : dirArr[i]);

      if (res === 0) {
        // if equal we want to sort by the next field
        ++i;
      } else {
        break;
      }
    }

    return res;
  };
}

export function sortBySeverity(data) {
  let arr = data;
  if (!Array.isArray(arr)) {
    arr = [];
  }
  return arr.sort((a, b) => {
    let aValue = 0;
    let bValue = 0;
    const aName = a.name && a.name.toLowerCase();
    const bName = b.name && b.name.toLowerCase();
    if (aName && aName in INCIDENT_SEVERITY) {
      aValue = INCIDENT_SEVERITY[aName].value;
    }
    if (bName && bName in INCIDENT_SEVERITY) {
      bValue = INCIDENT_SEVERITY[bName].value;
    }
    return bValue - aValue;
  });
}
