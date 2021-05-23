import moment from 'moment';
import { SUPPORTED_TIME_FRAMES, WEEKS_TIME_FORMAT } from '../constants/Constants';

export function getDateGroupName(name, timeFrame, format, from = moment()) {
  if (timeFrame === SUPPORTED_TIME_FRAMES.none) {
    return name;
  }
  let resName = name;
  if (!isNaN(resName)) {
    resName = moment(from).add(Number(resName), timeFrame).format(format);
  } else if (resName) {
    // Week time format is not returned as a proper date string from server,
    // so need to properly create the date string before formatting it
    // It will come from the server in the format of yyyy-ww
    if (format === WEEKS_TIME_FORMAT) {
      const parts = name.split('-');
      if (parts.length > 1) {
        resName = moment().isoWeekYear(parseInt(parts[0], 10)).isoWeek(parseInt(parts[1], 10)).format(format);
      }
    } else if (moment(name).isValid()) {
      resName = moment(name).format(format);
    }
  }
  return resName;
}

export function isDateNotValid(d) {
  try {
    return isNaN(new Date(d).getTime());
  } catch (e) {
    return true;
  }
}
