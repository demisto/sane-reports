import React, { PropTypes } from 'react';

const SectionTable = ({ columns, data, classes }) =>
  <div className="section-table">
    <table className={'ui compact table ' + classes}>
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
            <td key={j}>{row[col]}</td>
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
