import './SectionTable.less';
import React, { PropTypes } from 'react';

const SectionTable = ({ columns, data, classes }) => {
  const columnsMap = {};
  return (
    <div className="section-table">
      <table className={'ui compact table ' + classes}>
        <thead>
          <tr>
            {columns.map((col) => {
              columnsMap[col] = true;
              return <th key={col}>{col}</th>;
            })}
          </tr>
        </thead>
        <tbody>
        {data.map((row, i) =>
          <tr key={i}>
            {Object
              .keys(row)
              .filter((key) => columnsMap[key])
              .map((key, j) =>
                <td key={j}>{row[key]}</td>
          )}
          </tr>
        )}
        </tbody>
      </table>
    </div>
  );
};
SectionTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  classes: PropTypes.string
};

export default SectionTable;
