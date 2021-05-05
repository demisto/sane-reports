import { isNumber } from 'lodash';
import { WIDGET_DURATION_FORMAT, WIDGET_DURATION_FORMAT_LAYOUT, WIDGET_VALUES_FORMAT } from '../constants/Constants';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
momentDurationFormatSetup(moment);

function insertStringAt(originString, stringToInsert, position) {
  return [originString.slice(0, position), stringToInsert, originString.slice(position)].join('');
}

/*
Prints maximum 3 digits of a number and adds needed suffix.
1                 => 1
233               => 233
1233              => 1.23k
11222             => 11.2k
111222            => 111k
1222333           => 1.22m
1000000           => 1m
11222333          => 11.2m
111222333         => 111m
111222333444      => 111b
111222333444555   => 111t
1110222333444555  => 1110t
 */
export function numberToShortString(num) {
  if (isNaN(num)) {
    return num;
  }

  const unsignedNum = Math.abs(num);
  const prefix = num < 0 ? '-' : '';
  let shortenNum = unsignedNum + '';
  let tempNum = 0;
  let suffix = '';

  if (unsignedNum >= 1000000000000) {
    shortenNum = shortenNum.substring(0, shortenNum.length - 12);
    suffix = 't';
    tempNum = unsignedNum / 1000000000000;
  } else if (unsignedNum >= 1000000000) {
    shortenNum = shortenNum.match(/^\d{3}/)[0];
    suffix = 'b';
    tempNum = unsignedNum / 1000000000;
  } else if (unsignedNum >= 1000000) {
    shortenNum = shortenNum.match(/^\d{3}/)[0];
    suffix = 'm';
    tempNum = unsignedNum / 1000000;
  } else if (unsignedNum >= 1000) {
    shortenNum = shortenNum.match(/^\d{3}/)[0];
    suffix = 'k';
    tempNum = unsignedNum / 1000;
  }

  if (tempNum < 10 && tempNum > 0) {
    shortenNum = insertStringAt(shortenNum, '.', 1);
  } else if (tempNum < 100 && tempNum >= 10) {
    shortenNum = insertStringAt(shortenNum, '.', 2);
  }

  if (shortenNum.indexOf('.') > 0) {
    shortenNum = shortenNum.replace(/0+$/, '').replace(/\.$/, '');
  }

  return prefix + shortenNum + suffix;
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

let canvas;
export function getTextWidth(text, font = '14px Source Sans Pro') {
  if (!canvas) {
    canvas = document.createElement('canvas');
  }
  const context = canvas.getContext('2d');
  context.font = font;
  const { width } = context.measureText(text);

  return width;
}

export function middleEllipsis(value, ellipsisThreshold, startLength, endLength) {
  let newValue = value;
  if (value.length > ellipsisThreshold) {
    newValue = value.substring(0, startLength);
    newValue = newValue.concat('...');
    if (endLength > 0) {
      newValue = newValue.concat(value.substring(value.length - endLength - 1));
    }
  }
  return newValue;
}

export function createMiddleEllipsisFormatter(maxLen) {
  const partsLen = maxLen - 3;
  const partLeft = Math.ceil(partsLen / 2);
  const partRight = Math.floor(partsLen / 2);

  return (txt) => {
    return middleEllipsis(txt, maxLen, partLeft, partRight);
  };
}

const formatDurationValue = (v, format) => {
  return moment.duration(v, 'seconds').format(WIDGET_DURATION_FORMAT_LAYOUT[format], { trim: 'large mid' });
};

export const formatNumberValue = (v, format) => {
  if (!isNumber(v)) {
    return v;
  }

  switch (format) {
    case WIDGET_VALUES_FORMAT.abbreviated:
      return numberToShortString(v);
    case WIDGET_VALUES_FORMAT.decimal:
      return v && v.toFixed(2) ? v.toFixed(2) : null;
    case WIDGET_VALUES_FORMAT.percentage:
      return new Intl.NumberFormat().format(v) + '%';
    case WIDGET_VALUES_FORMAT.regular:
      return new Intl.NumberFormat().format(v);
    case WIDGET_DURATION_FORMAT.minutes:
    case WIDGET_DURATION_FORMAT.hours:
    case WIDGET_DURATION_FORMAT.days:
    case WIDGET_DURATION_FORMAT.months:
    case WIDGET_DURATION_FORMAT.weeks:
    case WIDGET_DURATION_FORMAT.years:
      return formatDurationValue(v, format);

    default:
      return v;
  }
};
