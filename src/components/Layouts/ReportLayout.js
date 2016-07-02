import './ReportLayout.less';
import React, { PropTypes } from 'react';

const ReportLayout = ({ data }) =>
  <div className="report-layout">
    {Object
      .keys(data)
      .sort((sec1, sec2) => data[sec1].pos > data[sec2].pos)
      .map((section) =>
        <div key={data[section].pos} className="section">
          <div>Type: {data[section].type}</div>
          <div>Position: {data[section].pos}</div>
          <div>Data: {JSON.stringify(data[section].data)}</div>
        </div>
    )}
  </div>
;
ReportLayout.propTypes = {
  data: PropTypes.object
};

export default ReportLayout;
