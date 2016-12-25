import React, { PropTypes } from 'react';
import { TABLE_CELL_TYPE } from '../../constants/Constants';
import isArray from 'lodash/isArray';
import map from 'lodash/map';
import isString from 'lodash/isString';


const SectionTable = ({ columns, data, classes, style }) => {
  let tableData = data;

  if (isString(data)) {
    try {
      tableData = JSON.parse(data);
    } catch (ignored) {
      return <div>Error parsing table</div>;
    }
  }

  let tableBody;
  if (isArray(columns)) {
    tableBody = (
      <table className={'ui compact table ' + classes} style={{ tableLayout: 'fixed' }}>
        <thead>
          <tr>
            {columns.map((col) => {
              return <th key={col.key || col}>{!col.hidden && col}</th>;
            })}
          </tr>
        </thead>
        <tbody>
        {tableData.map((row, i) =>
          <tr key={i}>
            {columns.map((col, j) =>
              (() => {
                const key = col.key || col;
                const cell = row[key];
                let cellToRender;
                switch (cell.type) {
                  case TABLE_CELL_TYPE.image:
                    cellToRender = (
                      <img
                        src={cell.data}
                        alt={cell.alt}
                        className={'ui image ' + cell.classes}
                        style={cell.style}
                      />
                    );
                    break;
                  default:
                    cellToRender = cell;
                }
                return <td key={j} style={{ wordBreak: 'break-word' }}>{cellToRender}</td>;
              })()
            )}
          </tr>
        )}
        </tbody>
      </table>
    );
  } else {
    tableBody = (
      <table className={'ui compact table ' + classes}>
        <tbody>
          {map(tableData, (val, key) => (
            <tr key={key}>
              <td style={{ background: 'rgb(249, 250, 251)', width: '20%', whiteSpace: 'nowrap' }}>
                {key}
              </td>
              <td>{val}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div className="section-table" style={style}>
      {tableBody}
    </div>
  );
};
SectionTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ]),
  classes: PropTypes.string,
  style: PropTypes.object
};

export default SectionTable;
