import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';


const SectionDate = ({ date, style, format }) =>
  <div className="section-date" style={style}>
    {date ? moment(date).tz(moment.tz.guess()).format(format) : moment().tz(moment.tz.guess()).format(format)}
  </div>;
SectionDate.propTypes = {
  date: PropTypes.string,
  style: PropTypes.object,
  format: PropTypes.string
};

export default SectionDate;
