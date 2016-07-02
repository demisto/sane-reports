import React, { PropTypes } from 'react';
import { ReportLayout } from '../components';

const ReportContainer = ({ data }) =>
  <ReportLayout data={data} />
;
ReportContainer.propTypes = {
  data: PropTypes.object
};

export default ReportContainer;
