import './ChartLegend.less';
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import {
  CHART_LEGEND_ITEM_HEIGHT,
  CHART_LAYOUT_TYPE
} from '../../../constants/Constants';
import { values } from 'lodash';
import { numberToShortString } from '../../../utils/strings';

export const VALUE_FORMAT_TYPES = { minimal: 'minimal', stretch: 'stretch' };
const DIGIT_PIXEL_SIZE = 8;
const ICON_CONTAINER_PIXEL_SIZE = 25;
const ChartLegend = ({ data, icon = 'circle', layout = CHART_LAYOUT_TYPE.vertical, height,
                       onClick, style, showValue = true, valueDisplay = VALUE_FORMAT_TYPES.stretch }) => {
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
    let width = 'auto';
    let maxWidth;
    const value = group.value ? numberToShortString(group.value) : null;
    // decrease width of name (if value exists) to allow for ellipsis.
    if (value && showValue) {
      let valueInPixels = (value + '').replace('.', '').length * DIGIT_PIXEL_SIZE + ICON_CONTAINER_PIXEL_SIZE;
      if (valueDisplay === VALUE_FORMAT_TYPES.stretch) {
        width = `calc(100% - ${valueInPixels}px)`;
      } else if (valueDisplay === VALUE_FORMAT_TYPES.minimal) {
        valueInPixels += 9; // add () width in pixels.
        maxWidth = `calc(100% - ${valueInPixels}px)`;
      }
    }
    return (
      <li key={groupName} className={mainClass}>
        <div className="recharts-legend-icon-container">
          <i className={legendIconClass} style={{ color: group.fill || group.color || group.stroke }} />
        </div>
        <span className="recharts-legend-item-text" style={{ width, maxWidth }} onClick={onClick}>
          {group.name}
        </span>
        {showValue && value &&
          <span className={`recharts-legend-item-value ${valueDisplay}`}>
            {valueDisplay === VALUE_FORMAT_TYPES.stretch ? value : `(${value})`}
          </span>
        }
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
  valueDisplay: PropTypes.oneOf(values(VALUE_FORMAT_TYPES)),
  layout: PropTypes.oneOf(values(CHART_LAYOUT_TYPE)),
  height: PropTypes.number,
  style: PropTypes.object
};

export default ChartLegend;
