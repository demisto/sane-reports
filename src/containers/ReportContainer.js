import React from 'react';
import PropTypes from 'prop-types';
import { ReportLayout } from '../components';

const ReportContainer = ({ sections, headerLeftImage, headerRightImage, isLayout, dimensions, isAutoHeightLayout }) => {
  return (
    <ReportLayout
      sections={sections}
      isLayout={isLayout}
      headerLeftImage={headerLeftImage}
      headerRightImage={headerRightImage}
      dimensions={dimensions}
      isAutoHeightLayout={isAutoHeightLayout}
    />
  );
};
ReportContainer.propTypes = {
  sections: PropTypes.object,
  headerLeftImage: PropTypes.string,
  headerRightImage: PropTypes.string,
  isLayout: PropTypes.bool,
  isAutoHeightLayout: PropTypes.bool,
  dimensions: PropTypes.object
};

export default ReportContainer;
