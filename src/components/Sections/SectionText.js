import React, { PropTypes } from 'react';

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
