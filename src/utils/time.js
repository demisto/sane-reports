import moment from 'moment';
import { EXTENDED_TIME_PERIODS, SUPPORTED_TIME_FRAMES, TIMER_STATUS, WEEKS_TIME_FORMAT } from '../constants/Constants';

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

export function isZeroDateTime(date) {
  return !date || (date.startsWith && date.startsWith('0001-01-01T'));
}

export function calculateDuration(duration, type = EXTENDED_TIME_PERIODS.MILISECONDS) {
  let divider;
  switch (type) {
    case EXTENDED_TIME_PERIODS.MILISECONDS:
      divider = 1000 * 60;
      break;
    case EXTENDED_TIME_PERIODS.MINUTES:
      divider = 1;
      break;
    case EXTENDED_TIME_PERIODS.SECONDS:
    default:
      divider = 60;
  }
  let diff = duration;
  const days = Math.floor(diff / 24 / divider / 60).toString();
  diff -= days * 24 * 60 * divider;
  let hours = Math.floor(diff / 60 / divider);
  diff -= hours * 60 * divider;
  let minutes = Math.floor(diff / divider);
  diff -= minutes * divider;
  let seconds = 0;
  if (type !== EXTENDED_TIME_PERIODS.MINUTES && type !== EXTENDED_TIME_PERIODS.DAYS) {
    seconds = type === EXTENDED_TIME_PERIODS.SECONDS ? diff : Math.floor(diff / 1000);
  }
  hours = (hours <= 9 ? '0' : '') + hours;
  minutes = (minutes <= 9 ? '0' : '') + minutes;
  seconds = (seconds <= 9 ? '0' : '') + seconds;
  return {
    days,
    hours,
    minutes,
    seconds
  };
}

export function getDurationString(duration, type) {
  const { days, hours, minutes } = calculateDuration(duration, type);
  const daysNumber = parseInt(days, 10);
  let timeToRender = `${daysNumber.toString()}d ${hours}h ${minutes}m`;
  if (daysNumber === 0) {
    timeToRender =
      `${hours > 0 && hours !== '0' ? `${hours}h ` : ''}` +
      `${minutes}m`;
  }
  return timeToRender;
}

function getSlaEffectiveStartTime(timerValue) {
  return moment(timerValue.startDate).add(timerValue.accumulatedPause, EXTENDED_TIME_PERIODS.SECONDS);
}

function getSlaEffectiveStopDate(timerValue) {
  return timerValue.runStatus === TIMER_STATUS.ended ? timerValue.endDate : timerValue.lastPauseDate;
}
function getSlaTimerTimeRan(timerValue) {
  const startDate = getSlaEffectiveStartTime(timerValue);
  const stopDate = getSlaEffectiveStopDate(timerValue);

  return moment(stopDate).diff(startDate, EXTENDED_TIME_PERIODS.SECONDS);
}

function getSlaTimeLeft(timerValue) {
  const effectiveStopDate = getSlaEffectiveStopDate(timerValue);

  return moment(timerValue.dueDate).diff(effectiveStopDate, EXTENDED_TIME_PERIODS.SECONDS);
}

function getSlaDurationOrNull(timerValue) {
  if (timerValue.runStatus === TIMER_STATUS.running || timerValue.runStatus === TIMER_STATUS.idle) {
    return null;
  }

  const isTimer = !timerValue.dueDate || isZeroDateTime(timerValue.dueDate);

  return isTimer ? getSlaTimerTimeRan(timerValue) : getSlaTimeLeft(timerValue);
}

export function getSlaProps(timerValue) {
  const shouldTick = timerValue.runStatus === TIMER_STATUS.running;
  const timePeriod = EXTENDED_TIME_PERIODS.SECONDS;
  const duration = getSlaDurationOrNull(timerValue);
  const dueDate = timerValue.dueDate;
  const startDate = getSlaEffectiveStartTime(timerValue);
  const riskThreshold = timerValue.threshold || 0;

  return { shouldTick, timePeriod, duration, startDate, dueDate, riskThreshold };
}
