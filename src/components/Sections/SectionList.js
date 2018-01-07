import React, { PropTypes } from 'react';
import isString from 'lodash/isString';
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
      const suffixKey = `dashboard.${msDiffSla > 0 ? 'aboutToEnd' : 'late'}.investigations.suffix`;
      return (
        <div className="sla-container">
          <span>{moment.duration(msDiffSla).humanize()}</span>
          <FormattedMessage id={suffixKey} />
        </div>
      );
    }
    default: {
      return currentData;
    }
  }
}

const SectionList = ({ columns, data, classes, style }) => {
  let tableData = data;

  if (isString(data)) {
    try {
      tableData = JSON.parse(data);
    } catch (ignored) {
      return <div>Error parsing table</div>;
    }
  }

  return (
    <div className="section-list ui list" style={style}>
      {tableData.map((item) => {
        const leftName = columns[0] ? columns[0].key : 'name';
        const mainKeyValue = getFieldValue(leftName, item);

        const rightName = columns[1] ? columns[1].key : 'value';
        const rightValue = getFieldValue(rightName, item);

        const id = getFieldValue('id', item);

        return (
          <div className="list-item item h3" key={id}>
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
  style: PropTypes.object
};

export default SectionList;
