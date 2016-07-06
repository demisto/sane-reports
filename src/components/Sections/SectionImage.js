import React, { PropTypes } from 'react';

const SectionImage = ({ src, style, alt, classes }) =>
  <img className={'section-image ui image ' + classes} src={src} style={style} alt={alt} />
;
SectionImage.propTypes = {
  src: PropTypes.string,
  style: PropTypes.object,
  alt: PropTypes.string,
  classes: PropTypes.string
};

export default SectionImage;
