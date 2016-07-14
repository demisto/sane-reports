import React, { PropTypes } from 'react';
import moment from 'moment';

const SectionDate = ({ date, style, format }) =>
  <div className="section-date" style={style}>
    {moment(date).format(format)}
  </div>
;
SectionDate.propTypes = {
  date: PropTypes.string,
  style: PropTypes.object,
  format: PropTypes.string
};

export default SectionDate;
