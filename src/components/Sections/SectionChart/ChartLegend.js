import './ChartLegend.less';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  CHART_LEGEND_ITEM_HEIGHT,
  CHART_LAYOUT_TYPE,
  INCIDENT_FIELDS
} from '../../../constants/Constants';
import { cloneDeep, isEmpty, values } from 'lodash';
import { sortByField } from '../../../utils/sort';

const NON_SORT_FIELDS = [INCIDENT_FIELDS.severity, INCIDENT_FIELDS.status];
export const VALUE_FORMAT_TYPES = { minimal: 'minimal', stretch: 'stretch' };

const DIGIT_PIXEL_SIZE = 8;
const ICON_CONTAINER_PIXEL_SIZE = 25;
const ChartLegend = ({ data, icon = 'square', layout = CHART_LAYOUT_TYPE.vertical, height, capitalize,
  onClick, style, showValue = true, valueDisplay = VALUE_FORMAT_TYPES.stretch, formatter, enableSort,
  groupBy }) => {
  let legendData = cloneDeep(data) || [];
  if (legendData.length === 0) {
    return <div />;
  }
  if (enableSort && groupBy && !NON_SORT_FIELDS.includes(groupBy) && legendData.length > 0) {
    let toAdd = [];
    if (legendData[legendData.length - 1].name === 'Other') {
      toAdd = legendData.splice(-1, 1);
    }
    legendData = legendData.sort((a, b) => sortByField('value')(a, b) * -1 || sortByField('name')(a, b));
    if (!isEmpty(toAdd)) {
      legendData.push(...toAdd);
    }
  }
  let numOfElements = legendData.length;
  if (height) {
    if (layout === CHART_LAYOUT_TYPE.vertical) {
      numOfElements = legendData.length * CHART_LEGEND_ITEM_HEIGHT > height ?
        Math.floor(height / CHART_LEGEND_ITEM_HEIGHT) : numOfElements;
      legendData = legendData.slice(0, numOfElements);
    }
  }
  const groups = legendData.map((group, i) => {
    const groupName = group.key || group.name;
    const mainClass = `recharts-legend-item legend-item-${i} ${layout}`;
    const legendIconClass = `${icon} icon chart-legend-icon`;
    let width = 'auto';
    const rawValue = group.value || 0;
    const value = formatter ? formatter(rawValue) : rawValue;
    const percentage = group.percentage ? `${group.percentage.toFixed(2)}%` : undefined;
    // decrease width of name (if value exists) to allow for ellipsis.
    if (showValue) {
      if (valueDisplay === VALUE_FORMAT_TYPES.stretch) {
        const valueInPixels = ((value + '').replace('.', '').length * DIGIT_PIXEL_SIZE) + ICON_CONTAINER_PIXEL_SIZE;
        width = `calc(100% - ${valueInPixels}px)`;
      }
    }
    return (
      <li key={groupName} className={mainClass}>
        <div className="recharts-legend-icon-container">
          <i className={legendIconClass} style={{ color: group.fill || group.color || group.stroke }} />
        </div>
        <span className={classNames('recharts-legend-item-text', { capitalize })} style={{ width }} onClick={onClick}>
          {group.name}
        </span>
        {showValue &&
          <span className={`recharts-legend-item-value ${valueDisplay} ${percentage ? 'percentage' : ''}`}>
            {valueDisplay === VALUE_FORMAT_TYPES.stretch ? value : `(${value})`}
          </span>}
        {percentage &&
        <div className="recharts-legend-item-percentage">
          {percentage}
        </div>}
      </li>);
  });
  const mainClass = classNames('customized-legend recharts-default-legend', {
    horizontal: layout === CHART_LAYOUT_TYPE.horizontal
  });
  return (
    <ul className={mainClass} style={style}>
      {groups}
    </ul>
  );
};
ChartLegend.propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.array,
  icon: PropTypes.string,
  showValue: PropTypes.bool,
  formatter: PropTypes.func,
  capitalize: PropTypes.bool,
  valueDisplay: PropTypes.oneOf(values(VALUE_FORMAT_TYPES)),
  layout: PropTypes.oneOf(values(CHART_LAYOUT_TYPE)),
  height: PropTypes.number,
  style: PropTypes.object,
  enableSort: PropTypes.bool,
  groupBy: PropTypes.string
};

export default ChartLegend;
