import React, { PropTypes } from 'react';
import { ReportLayout } from '../components';

const ReportContainer = ({ sections, headerLeftImage, headerRightImage }) => {
  return (
    <ReportLayout sections={sections} headerLeftImage={headerLeftImage} headerRightImage={headerRightImage} />
  );
};
ReportContainer.propTypes = {
  sections: PropTypes.object,
  headerLeftImage: PropTypes.string,
  headerRightImage: PropTypes.string
};

export default ReportContainer;
