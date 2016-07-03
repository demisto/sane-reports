import './ReportLayout.less';
import React, { PropTypes } from 'react';

const ReportLayout = ({ data }) =>
  <div className="report-layout">
    {
      data
        .sort((row1, row2) => (row1.pos >= row2.pos ? 1 : -1)) // sort by row position
        .map((row) =>
          <div className="report-row" key={row.pos}>
            <span>Row: {row.pos}</span>
            {
              row.columns
              .sort((sec1, sec2) => (sec1.pos >= sec2.pos ? 1 : -1)) // sort by section position inside a row
              .map((section) =>
                <div key={section.pos} className="report-section" style={section.style}>
                  <div>Type: {section.type}</div>
                  <div>Position: {section.pos}</div>
                  <div>Data: {JSON.stringify(section.data)}</div>
                </div>
              )
            }
          </div>
        )
    }
  </div>
;
ReportLayout.propTypes = {
  data: PropTypes.array
};

export default ReportLayout;
