import './SectionTable.less';
import React from 'react';
import PropTypes from 'prop-types';
import { getDefaultMaxLength, TABLE_CELL_TYPE } from '../../constants/Constants';
import { isEmpty, isString, isArray, truncate, isObjectLike, map } from 'lodash';
import WidgetEmptyState from './WidgetEmptyState';
import SectionTitle from './SectionTitle';
import TimerCell from '../Cells/TimerCell/TimerCell';

function getColumnsMetaDataMap(columnsMetaData, columns) {
  const columnsMetaDataMap = new Map();
  if (columnsMetaData && isArray(columnsMetaData)) {
    columnsMetaData.forEach((mData) => {
      if (mData.key) {
        columnsMetaDataMap.set(mData.key, mData);
      }
    });
  } else if (columns && isArray(columns)) {
    columns.forEach((mData) => {
      if (mData.key) {
        columnsMetaDataMap.set(mData.key, mData);
      }
    });
  }
  return columnsMetaDataMap;
}

function getExtraPropsForColumn(key, columnsMetaDataMap, headerStyle) {
  const extraProps = {};
  const metaData = columnsMetaDataMap.get(key);

  if (metaData) {
    extraProps.width = metaData.width;
  }

  if (headerStyle) {
    extraProps.style = headerStyle;
  }

  return extraProps;
}

const SectionTable = ({ columns, columnsMetaData, readableHeaders, data, extraData, classes, style, title, titleStyle,
  emptyString, maxColumns, forceRangeMessage, reflectDimensions = true, headerStyle }) => {
  let tableData = data || [];

  if (isString(data)) {
    try {
      tableData = JSON.parse(data);
    } catch (ignored) {
      return <div>Error parsing table</div>;
    }
  }

  if (!isArray(tableData) && isObjectLike(tableData)) {
    tableData = tableData.data || tableData.iocs || tableData.messages || [];
  }

  let readyColumns = columns;
  if (isEmpty(columns) && isArray(tableData)) {
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
  const columnsMetaDataMap = getColumnsMetaDataMap(columnsMetaData, columns);
  const defaultMaxLength = getDefaultMaxLength();

  if (isArray(readyColumns)) {
    readyColumns = maxColumns > 0 ? readyColumns.slice(0, maxColumns) : readyColumns;
    tableBody = tableData.length > 0 ? (
      <table className={'ui compact table unstackable section-table ' + classes} style={{ tableLayout: 'fixed' }}>
        <thead>
          <tr>
            {readyColumns.map((col) => {
              const key = col.key || col;
              const extraProps = reflectDimensions ? getExtraPropsForColumn(key, columnsMetaDataMap, headerStyle) : {};

              return (
                <th key={key} {...extraProps}>
                  {!col.hidden && ((readableHeaders && readableHeaders[key]) || key)}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, i) =>
            <tr key={i}>
              {readyColumns.map((col, j) =>
                (() => {
                  const key = col.key || col;
                  let cell = row[key];
                  if (cell === undefined || cell === null) {
                    cell = readableHeaders && row[readableHeaders[key]];
                  }

                  const cellExtraData = extraData?.[i]?.[key];

                  let cellToRender = '';
                  if (cell || cell === 0) {
                    switch (cell.type ?? cellExtraData?.type) {
                      case TABLE_CELL_TYPE.image: {
                        cellToRender = (
                          <img
                            src={cell.data}
                            alt={cell.alt}
                            className={'ui image ' + cell.classes}
                            style={cell.style}
                          />
                        );
                        break;
                      }
                      case TABLE_CELL_TYPE.timer: {
                        cellToRender = (
                          <TimerCell extraData={cellExtraData} threshold={0} />
                        );
                        break;
                      }
                      default: {
                        cellToRender = reflectDimensions ? truncate(cell, { length: defaultMaxLength }) : cell;
                      }
                    }
                  }
                  return (
                    <td key={j} style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}>
                      {cellToRender}
                    </td>
                  );
                })()
              )}
            </tr>)
          }
        </tbody>
      </table>
    ) : (
      <div>
        <table className={'ui compact table unstackable ' + classes} style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr>
              {readyColumns.map((col) => {
                const key = col.key || col;
                const extraProps = getExtraPropsForColumn(key, columnsMetaDataMap, headerStyle);

                return (
                  <th
                    {...extraProps}
                    key={key}
                    {...(headerStyle ? { style: headerStyle } : {})}
                  >
                    {!col.hidden && ((readableHeaders && readableHeaders[key]) || key)}
                  </th>
                );
            })}
            </tr>
          </thead>
        </table>
        <WidgetEmptyState emptyString={emptyString} />
      </div>);
  } else {
    tableBody = (
      <table className={'ui compact table unstackable ' + classes}>
        <tbody>
          {map(tableData, (val, key) => (
            <tr key={key}>
              <td style={{ background: 'rgb(249, 250, 251)', width: '20%', whiteSpace: 'nowrap' }}>
                {key}
              </td>
              <td>{reflectDimensions ? truncate(val, { length: defaultMaxLength }) : val}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div className="section-table" style={style}>
      <SectionTitle title={title} titleStyle={titleStyle} subTitle={forceRangeMessage} />
      {tableBody}
    </div>
  );
};
SectionTable.propTypes = {
  columns: PropTypes.array,
  columnsMetaData: PropTypes.array,
  readableHeaders: PropTypes.object,
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ]),
  extraData: PropTypes.arrayOf(
    PropTypes.object
  ),
  classes: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.string,
  maxColumns: PropTypes.number,
  titleStyle: PropTypes.object,
  emptyString: PropTypes.string,
  forceRangeMessage: PropTypes.string,
  reflectDimensions: PropTypes.bool,
  headerStyle: PropTypes.object
};

export default SectionTable;
