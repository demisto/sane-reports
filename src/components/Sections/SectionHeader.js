import React from 'react';
import PropTypes from 'prop-types';

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
