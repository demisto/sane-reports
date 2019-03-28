import React from 'react';
import PropTypes from 'prop-types';
import { ReportLayout } from '../components';

const ReportContainer = ({ sections, headerLeftImage, headerRightImage, isLayout }) => {
  return (
    <ReportLayout
      sections={sections}
      isLayout={isLayout}
      headerLeftImage={headerLeftImage}
      headerRightImage={headerRightImage}
    />
  );
};
ReportContainer.propTypes = {
  sections: PropTypes.object,
  headerLeftImage: PropTypes.string,
  headerRightImage: PropTypes.string,
  isLayout: PropTypes.bool
};

export default ReportContainer;
