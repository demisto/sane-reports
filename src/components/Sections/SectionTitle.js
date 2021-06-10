import './SectionTitle.less';
import React from 'react';
import PropTypes from 'prop-types';

const SectionTitle = ({ titleStyle, title, subTitle }) =>
  <div className="section-title-wrapper">
    {title && <div className="section-title" style={titleStyle}>{title}</div>}
    {subTitle && (
      <div className="section-sub-title" title={subTitle}>
        {subTitle}
      </div>
      )}
  </div>;
SectionTitle.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  titleStyle: PropTypes.object
};

export default SectionTitle;
