import './SectionDate.less';
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';


const SectionDate = ({ date, style, format }) =>
  <span className="section-date" style={style}>
    <span className="section-date-key">Date:</span>
    <span className="section-date-value">
      {date ? moment(date).tz(moment.tz.guess()).format(format) : moment().tz(moment.tz.guess()).format(format)}
    </span>
  </span>;
SectionDate.propTypes = {
  date: PropTypes.string,
  style: PropTypes.object,
  format: PropTypes.string
};

export default SectionDate;
