import './ChartLegend.less';
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import {
  CHART_LEGEND_ITEM_HEIGHT,
  CHART_LAYOUT_TYPE
} from '../../../constants/Constants';
import { values } from 'lodash';

const ChartLegend = ({data, icon = 'circle', layout = CHART_LAYOUT_TYPE.vertical, height, onClick}) => {
  let legendData = data || [];
  if (legendData.length === 0) {
    return <div />;
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
    return (
      <li key={groupName} className={mainClass}>
        <div className="recharts-legend-icon-container">
          <i className={legendIconClass} style={{ color: group.fill || group.color || group.stroke }} />
        </div>
        <span className="recharts-legend-item-text" onClick={onClick}>
          {group.name}
        </span>
        <span className="recharts-legend-item-value">
          {group.value}
        </span>
      </li>);
  });
  const mainClass = classNames('customized-legend recharts-default-legend', {
    horizontal: layout === CHART_LAYOUT_TYPE.horizontal
  });
  return (
    <ul className={mainClass}>
      {groups}
    </ul>
  );
};
ChartLegend.propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.array,
  icon: PropTypes.string,
  layout: PropTypes.oneOf(values(CHART_LAYOUT_TYPE)),
  height: PropTypes.number
};

export default ChartLegend;
