import React, { PropTypes } from 'react';

const SectionTable = ({ columns, data, classes }) =>
  <div className="section-table">
    <table className={'ui compact table ' + classes} style={{ tableLayout: 'fixed' }}>
      <thead>
        <tr>
          {columns.map((col) => {
            return <th key={col}>{col}</th>;
          })}
        </tr>
      </thead>
      <tbody>
      {data.map((row, i) =>
        <tr key={i}>
          {columns.map((col, j) =>
            <td key={j} style={{ wordBreak: 'break-word' }}>{row[col]}</td>
          )}
        </tr>
      )}
      </tbody>
    </table>
  </div>
;
SectionTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  classes: PropTypes.string
};

export default SectionTable;
