import React, { PropTypes } from 'react';
import { ReportLayout } from '../components';

const ReportContainer = ({ sections }) => {
  return (
    <ReportLayout sections={sections} />
  );
};
ReportContainer.propTypes = {
  sections: PropTypes.object
};

export default ReportContainer;
