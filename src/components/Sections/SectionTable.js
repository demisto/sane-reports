import React, { PropTypes } from 'react';
import { TABLE_CELL_TYPE, DEFAULT_MAX_LENGTH } from '../../constants/Constants';
import isArray from 'lodash/isArray';
import map from 'lodash/map';
import isString from 'lodash/isString';
import truncate from 'lodash/truncate';


const SectionTable = ({ columns, data, classes, style }) => {
  let tableData = data;

  if (isString(data)) {
    try {
      tableData = JSON.parse(data);
    } catch (ignored) {
      return <div>Error parsing table</div>;
    }
  }

  let readyColumns = columns;
  if (!isArray(columns) && isArray(tableData)) {
    const headerKeys = {};
    tableData.forEach((val, i) => {
      for (const key in tableData[i]) { // eslint-disable-line no-restricted-syntax
        if (headerKeys[key] !== key) {
          headerKeys[key] = key;
        }
      }
    });

    readyColumns = Object.keys(headerKeys);
  }


  let tableBody;
  if (isArray(readyColumns)) {
    tableBody = (
      <table className={'ui compact table ' + classes} style={{ tableLayout: 'fixed' }}>
        <thead>
          <tr>
            {readyColumns.map((col) => {
              return <th key={col.key || col}>{!col.hidden && col}</th>;
            })}
          </tr>
        </thead>
        <tbody>
        {tableData.map((row, i) =>
          <tr key={i}>
            {readyColumns.map((col, j) =>
              (() => {
                const key = col.key || col;
                const cell = row[key];

                let cellToRender = '';
                if (cell) {
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
                      cellToRender = truncate(cell, { length: DEFAULT_MAX_LENGTH });
                  }
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
              <td>{truncate(val, { length: DEFAULT_MAX_LENGTH })}</td>
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
