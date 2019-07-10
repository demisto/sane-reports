
export function isDateNotValid(d) {
  try {
    return isNaN(new Date(d).getTime());
  } catch (e) {
    return true;
  }
}
