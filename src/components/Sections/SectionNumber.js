import './SectionNumber.less';
import React from 'react';
import PropTypes from 'prop-types';
import values from 'lodash/values';
import classNames from 'classnames';
import { CHART_LAYOUT_TYPE, WIDGET_VALUES_FORMAT } from '../../constants/Constants';
import { capitalizeFirstLetter, formatNumberValue } from '../../utils/strings';

const TREND_NUMBER_LIMIT = 999;
const SectionNumber = ({
  data, layout, style, sign, signAlignment, title, titleStyle, valuesFormat = WIDGET_VALUES_FORMAT.abbreviated,
  subTitle
}) => {
  const isTrend = !!data.prevSum || data.prevSum === 0;
  let percentage = 0;
  const curr = data.currSum || 0;
  if (isTrend) {
    const prev = data.prevSum || 0;
    const divider = prev === 0 ? 1 : prev;
    percentage = parseInt(((curr - prev) / divider) * 100, 10);
  }

  const caretClass = classNames('trend-icon caret icon', {
    up: percentage > 0,
    red: percentage > 0 && style.backgroundColor,
    down: percentage < 0,
    green: percentage < 0 && style.backgroundColor
  });
  const trendIcon = percentage === 0 ?
    (<span className="trend-icon trend-equal">=</span>) : (<i className={caretClass} />);

  let shortPercentage = Math.abs(percentage) + '';
  if (isTrend && percentage > TREND_NUMBER_LIMIT) {
    shortPercentage = `>${TREND_NUMBER_LIMIT}`;
  }

  const color = style && style.backgroundColor ? '#FFF' : undefined;
  const titleColor = (titleStyle && titleStyle.color) ? titleStyle.color : color;
  const subTitleClass = classNames('demisto-number-sub-title', {
    'color-warning': !color
  });
  let trendContainer = '';
  if (isTrend) {
    const boxClass = classNames('trend-box', {
      red: !style.backgroundColor && percentage > 0,
      green: !style.backgroundColor && percentage < 0,
      grey: !style.backgroundColor && percentage === 0
    });
    trendContainer = (
      <div className="trend-container">
        <div className={boxClass}>
          {trendIcon}
          {shortPercentage}%
        </div>
      </div>
    );
  }
  const signElement = <span className="sign">{sign}</span>;
  return (
    <div className="section-number" style={style}>
      <div className="number-container">
        <div
          className="trend-num-text"
          style={{ color }}
        >
          {signAlignment === 'left' && signElement}
          {formatNumberValue(curr,
            valuesFormat === WIDGET_VALUES_FORMAT.percentage ? WIDGET_VALUES_FORMAT.regular : valuesFormat)}
          {signAlignment === 'right' && signElement}
        </div>
        {layout === CHART_LAYOUT_TYPE.horizontal && isTrend &&
        trendContainer
        }
        <div className="trend-message" style={{ ...titleStyle, color: titleColor }}>
          {capitalizeFirstLetter(title)}
          {subTitle && (
          <div className={subTitleClass} style={{ color: color || '#ff9000' }} title={subTitle}>
            {subTitle}
          </div>
          )}
        </div>
        {layout === CHART_LAYOUT_TYPE.vertical && isTrend &&
        trendContainer
        }
      </div>
    </div>
  );
};
SectionNumber.propTypes = {
  data: PropTypes.object,
  style: PropTypes.object,
  title: PropTypes.string,
  titleStyle: PropTypes.object,
  layout: PropTypes.oneOf(values(CHART_LAYOUT_TYPE)),
  sign: PropTypes.string,
  signAlignment: PropTypes.string,
  valuesFormat: PropTypes.oneOf(values(WIDGET_VALUES_FORMAT)),
  subTitle: PropTypes.string
};

export default SectionNumber;
