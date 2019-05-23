import React from 'react';
import PropTypes from 'prop-types';
import { isArray, isObjectLike, isString } from 'lodash';
import moment from 'moment';

function getFieldValue(fieldName, dataItem) {
  if (dataItem && dataItem[fieldName] !== undefined) {
    return dataItem[fieldName];
  }
  if (dataItem && dataItem.CustomFields) {
    return dataItem.CustomFields[fieldName];
  }

  return '';
}

function styleByFieldName(fieldName, currentData) {
  switch (fieldName) {
    case 'dueDate': {
      const now = moment(moment.now());
      const dueDate = moment(currentData);
      const msDiffSla = dueDate.diff(now);
      return (
        <div className="sla-container">
          <span>{msDiffSla > 0 ? '+' : '-'}{moment.duration(msDiffSla).humanize()}</span>
        </div>
      );
    }
    default: {
      return currentData;
    }
  }
}

const SectionList = ({ columns, data, classes, style, title, titleStyle }) => {
  let tableData = data || [];

  if (!isArray(tableData) && isObjectLike(tableData)) {
    tableData = tableData.data || tableData.iocs || tableData.messages || [];
  }

  if (isString(data)) {
    try {
      tableData = JSON.parse(data);
    } catch (ignored) {
      return <div>Error parsing table</div>;
    }
  }
  const mainClass = `section-list ui list ${classes}`;
  return (
    <div className={mainClass} style={style}>
      {title && <div className="section-title" style={titleStyle}>{title}</div>}
      {tableData.map((item, i) => {
        const leftName = columns[0] ? columns[0].key : 'name';
        const mainKeyValue = getFieldValue(leftName, item);

        const rightName = columns[1] ? columns[1].key : 'value';
        const rightValue = getFieldValue(rightName, item);

        return (
          <div className="list-item item h3" key={i}>
            <div className="left-list-value left floated content ellipsis" title={mainKeyValue}>
              {styleByFieldName(leftName, mainKeyValue)}
            </div>
            <div className="right-list-value right floated content">
              <div className="right-list-value-container">
                {styleByFieldName(rightName, rightValue)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

SectionList.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ]),
  classes: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.string,
  titleStyle: PropTypes.object
};

export default SectionList;
