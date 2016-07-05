import './SectionHeader.less';
import React, { PropTypes } from 'react';

const SectionHeader = ({ header, style }) =>
  <h1 className="section-header" style={style}>
    {header}
  </h1>
;
SectionHeader.propTypes = {
  header: PropTypes.string,
  style: PropTypes.object
};

export default SectionHeader;
