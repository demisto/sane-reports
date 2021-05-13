import './SectionList.less';
import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import { isString, isEmpty, isObject } from 'lodash';
import moment from 'moment';
import { TABLE_CELL_TYPE } from '../../constants/Constants';
import WidgetEmptyState from './WidgetEmptyState';

function getFieldComponentIfNeeded(dataValue) {
  return isObject(dataValue) && dataValue.type === TABLE_CELL_TYPE.image ? (<img
    src={dataValue.data}
    alt={dataValue.alt}
    className={'ui image ' + dataValue.classes}
    style={dataValue.style}
  />) : dataValue;
}

function getFieldValue(fieldName, dataItem) {
  if (dataItem && dataItem[fieldName] !== undefined) {
    return getFieldComponentIfNeeded(dataItem[fieldName]);
  }
  if (dataItem && dataItem.CustomFields) {
    return getFieldComponentIfNeeded(dataItem.CustomFields[fieldName]);
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
          <span>{moment.duration(msDiffSla).humanize()}{msDiffSla < 0 ? ' past SLA' : ''}</span>
        </div>
      );
    }
    default: {
      return currentData;
    }
  }
}

const SectionList = ({ columns, data, classes, style, title, titleStyle, emptyString }) => {
  let tableData = data || [];

  if (isString(data)) {
    try {
      tableData = JSON.parse(data);
    } catch (ignored) {
      return <div>Error parsing table</div>;
    }
  }
  const mainClass = `section-list ${classes || ''}`;
  return (
    <div className={mainClass} style={style}>
      {title && <div className="section-title" style={titleStyle}>{title}</div>}
      <div className="list-data-container">
        {tableData.length > 0 ? tableData.map((item) => {
          let leftName = 'name';
          if (!isEmpty(columns)) {
            leftName = (isObject(columns[0]) ? columns[0].key : columns[0]) || leftName;
          }
          const mainKeyValue = getFieldValue(leftName, item);

          let rightName = 'value';
          if (!isEmpty(columns) && columns.length > 1) {
            rightName = (isObject(columns[1]) ? columns[1].key : columns[1]) || rightName;
          }
          const rightValue = getFieldValue(rightName, item);

          let detailsValue;
          if (!isEmpty(columns) && columns.length > 2) {
            const detailsCol = (isObject(columns[2]) ? columns[2].key : columns[2]);
            detailsValue = getFieldValue(detailsCol, item);
          }
          return (
            <div className="list-item item h3" key={uuid.v1()}>
              <div
                className="left-list-value left floated content ellipsis"
                title={!isObject(mainKeyValue) ? mainKeyValue : ''}
              >
                {styleByFieldName(leftName, mainKeyValue)}
              </div>
              <div className="right-list-value right floated content">
                <div className="right-list-value-container">
                  {styleByFieldName(rightName, rightValue)}
                </div>
              </div>
              {detailsValue && <div className="details content">{detailsValue}</div>}
            </div>
          );
        }) : <WidgetEmptyState emptyString={emptyString} />}
      </div>
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
  titleStyle: PropTypes.object,
  emptyString: PropTypes.string
};

export default SectionList;
