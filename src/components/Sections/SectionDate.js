import './SectionDate.less';
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

const PARSING_STRING_WITH_TIME_ZONE = 'YYYY-MM-DD HH:mm:ss.SSSSSS Z';
const DEFAULT_FORMAT = 'MMMM Do YYYY, h:mm:ss a z';

function dateToMoment(date) {
  if (!date) {
    return moment();
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

const SectionDate = ({ date, style, format }) => {
  const dateTime = dateToMoment(date);
  return (
    <div className="section-date" style={style}>
      <span className="section-date-key">Date:</span>
      <span className="section-date-value">
        {moment.isMoment(dateTime) ? dateTime.tz(moment.tz.guess()).format(format || DEFAULT_FORMAT) : dateTime}
      </span>
    </div>);
};
SectionDate.propTypes = {
  date: PropTypes.string,
  style: PropTypes.object,
  format: PropTypes.string
};

export default SectionDate;
