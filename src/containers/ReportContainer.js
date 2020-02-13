import React from 'react';
import PropTypes from 'prop-types';
import { ReportLayout } from '../components';

const ReportContainer = ({ sections, headerLeftImage, headerRightImage, isLayout, dimensions }) => {
  return (
    <ReportLayout
      sections={sections}
      isLayout={isLayout}
      headerLeftImage={headerLeftImage}
      headerRightImage={headerRightImage}
      dimensions={dimensions}
    />
  );
};
ReportContainer.propTypes = {
  sections: PropTypes.object,
  headerLeftImage: PropTypes.string,
  headerRightImage: PropTypes.string,
  isLayout: PropTypes.bool,
  dimensions: PropTypes.object
};

export default ReportContainer;
