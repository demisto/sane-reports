/* eslint-disable react/no-danger */
import './SectionTags.less';
import React from 'react';
import PropTypes from 'prop-types';

const SectionTags = ({ tags }) =>
  <div className="section-tags">
    { tags.split(',').map(tag => <span key={tag} className="tag-item">{tag}</span>) }
  </div>;

SectionTags.propTypes = {
  tags: PropTypes.string
};

export default SectionTags;
