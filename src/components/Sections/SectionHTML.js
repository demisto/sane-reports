import './SectionHTML.less';
import React from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

const SectionHTML = ({ text, style }) =>
  <div className="section-html" style={style} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }} />;

SectionHTML.propTypes = {
  text: PropTypes.string,
  style: PropTypes.object
};

export default SectionHTML;
