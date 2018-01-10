function insertStringAt(originString, stringToInsert, position) {
  return [originString.slice(0, position), stringToInsert, originString.slice(position)].join('');
}

export function numberToShortString(num) {
  let shortenNum = num + '';

  let tempNum = 0;
  let suffix = '';

  if (num >= 1000000) {
    shortenNum = shortenNum.match(/^\d{3}/)[0];
    suffix = 'm';
    tempNum = num / 1000000;
  } else if (num >= 1000) {
    shortenNum = shortenNum.match(/^\d{3}/)[0];
    suffix = 'k';
    tempNum = num / 1000;
  }

  if (tempNum < 10 && tempNum > 0) {
    shortenNum = insertStringAt(shortenNum, '.', 1);
  } else if (tempNum < 100 && tempNum >= 10) {
    shortenNum = insertStringAt(shortenNum, '.', 2);
  }

  if (shortenNum.indexOf('.') > 0) {
    shortenNum = shortenNum.replace(/0+$/, '').replace(/\.$/, '');
  }

  return shortenNum + suffix;
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
