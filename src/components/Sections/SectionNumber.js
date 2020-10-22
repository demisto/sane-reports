import './SectionNumber.less';
import React from 'react';
import PropTypes from 'prop-types';
import values from 'lodash/values';
import classNames from 'classnames';
import { CHART_LAYOUT_TYPE } from '../../constants/Constants';
import { numberToShortString } from '../../utils/strings';

const TREND_NUMBER_LIMIT = 999;
const SectionNumber = ({ data, layout, style, sign, signAlignment, title, titleStyle, colors }) => {
  const isTrend = !!data.prevSum || data.prevSum === 0;
  let percentage = 0;
  const curr = data.currSum || 0;
  if (isTrend) {
    const prev = data.prevSum || 0;
    const divider = prev === 0 ? 1 : prev;
    percentage = parseInt(((curr - prev) / divider) * 100, 10);
  }
  let widgetBackgroundColor;
  if (colors) {
    const widgetBackgroundItems =
        Object.keys(colors.items).map((v) => {
          return { value: colors.items[v].value, color: v };
        });
    const widgetBackgroundCondition = colors.type;
    if (colors.isEnabled) {
      for (let i = 0; i < widgetBackgroundItems.length; i++) {
        widgetBackgroundColor = (((widgetBackgroundCondition === 'above') && (curr > widgetBackgroundItems[i].value))
          || ((widgetBackgroundCondition === 'below') && (curr < widgetBackgroundItems.reverse()[i].value)))
            && widgetBackgroundItems[i].color;
      }
    }
  }
  const sectionNumberBackground = widgetBackgroundColor || (style && style.backgroundColor);
  const caretClass = classNames('trend-icon caret icon', {
    up: percentage > 0,
    red: percentage > 0 && sectionNumberBackground,
    down: percentage < 0,
    green: percentage < 0 && sectionNumberBackground
  });
  const trendIcon = percentage === 0 ?
    (<span className="trend-icon trend-equal">=</span>) : (<i className={caretClass} />);

  let shortPercentage = Math.abs(percentage) + '';
  if (isTrend && percentage > TREND_NUMBER_LIMIT) {
    shortPercentage = `>${TREND_NUMBER_LIMIT}`;
  }
  let trendContainer = '';
  if (isTrend) {
    const boxClass = classNames('trend-box', {
      red: !sectionNumberBackground && percentage > 0,
      green: !sectionNumberBackground && percentage < 0,
      grey: !sectionNumberBackground && percentage === 0
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
  const trendTextColor = sectionNumberBackground ? '#FFF' : undefined;
  const titleTextColor = sectionNumberBackground ? '#FFF' : titleStyle && titleStyle.color;
  const signElement = <span className="sign">{sign}</span>;
  return (
    <div className="section-number" style={{ backgroundColor: sectionNumberBackground }}>
      <div className="number-container">
        <div
          className="trend-num-text"
          style={{ color: trendTextColor }}
        >
          {signAlignment === 'left' && signElement}
          {numberToShortString(curr)}
          {signAlignment === 'right' && signElement}
        </div>
        {layout === CHART_LAYOUT_TYPE.horizontal && isTrend &&
        trendContainer
        }
        <div className="trend-message" style={{ color: titleTextColor }}>
          {title}
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
  colors: PropTypes.object,
  title: PropTypes.string,
  titleStyle: PropTypes.object,
  layout: PropTypes.oneOf(values(CHART_LAYOUT_TYPE)),
  sign: PropTypes.string,
  signAlignment: PropTypes.string
};

export default SectionNumber;
