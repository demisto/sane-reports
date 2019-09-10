/* eslint-disable react/no-danger */
import './SectionHTML.less';
import React from 'react';
import PropTypes from 'prop-types';

const SectionHTML = ({ text, style }) =>
  <div className="section-html" style={style} dangerouslySetInnerHTML={{ __html: text }} />;

SectionHTML.propTypes = {
  text: PropTypes.string,
  style: PropTypes.object
};

export default SectionHTML;
