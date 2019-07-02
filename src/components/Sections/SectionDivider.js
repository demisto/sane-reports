import React from 'react';
import PropTypes from 'prop-types';

const SectionDivider = ({ style }) =>
  <div className="section-divider ui divider" style={style} />;
SectionDivider.propTypes = {
  style: PropTypes.object
};

export default SectionDivider;
