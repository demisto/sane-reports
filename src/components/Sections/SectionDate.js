import './SectionDate.less';
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import {
  DEFAULT_DATE_TIME_FORMAT,
  PARSING_STRING_WITH_TIME_ZONE,
  shouldUseServerFormattedDate
} from '../../constants/Constants';

function isInvalidDate(date) {
  return !date || (date.startsWith && date.startsWith('0001-01-01 00:00:00'));
}

export function dateToMoment(date) {
  if (isInvalidDate(date)) {
    return 'N/A';
  }
  let result;

  result = moment(date, PARSING_STRING_WITH_TIME_ZONE);
  if (result.isValid()) {
    return result;
  }

  result = moment(date);
  if (result.isValid()) {
    return result;
  }

  // fallback to raw object
  return date;
}

const SectionDate = ({ date, style, format, isPrefixRequired = true }) => {
  const dateTime = dateToMoment(date);
  let value;
  if (shouldUseServerFormattedDate() && !isInvalidDate(date) && !moment.isMoment(date)) {
    value = date;
  } else {
    value = moment.isMoment(dateTime) ? dateTime.tz(moment.tz.guess())
      .format(format || DEFAULT_DATE_TIME_FORMAT) : dateTime;
  }
  return (
    <div className="section-date" style={style}>
      {isPrefixRequired && <span className="section-date-key">Date:</span>}
      <span className="section-date-value">
        {value}
      </span>
    </div>);
};
SectionDate.propTypes = {
  date: PropTypes.string,
  style: PropTypes.object,
  format: PropTypes.string,
  isPrefixRequired: PropTypes.bool
};

export default SectionDate;
