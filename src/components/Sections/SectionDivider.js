import React, { PropTypes } from 'react';

const SectionDivider = ({ style }) =>
  <div className="section-divider ui divider" style={style}></div>
;
SectionDivider.propTypes = {
  style: PropTypes.object
};

export default SectionDivider;
