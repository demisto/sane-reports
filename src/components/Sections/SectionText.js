import './SectionText.less';
import React from 'react';
import PropTypes from 'prop-types';

const SectionText = ({ text, style }) =>
  <div className="section-text" style={style}>
    {text}
  </div>
;
SectionText.propTypes = {
  text: PropTypes.string,
  style: PropTypes.object
};

export default SectionText;
