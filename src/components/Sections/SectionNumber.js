import './SectionNumber.less';
import React, { PropTypes } from 'react';
import values from 'lodash/values';
import classNames from 'classnames';
import { CHART_LAYOUT_TYPE } from '../../constants/Constants';
import { numberToShortString } from '../../utils/strings';

const TREND_NUMBER_LIMIT = 999;
const SectionNumber = ({ data, layout, style, currencySign, title }) => {
  const isTrend = !!data.prevSum;
  let percentage = 0;
  const curr = data.currSum || 0;
  if (isTrend) {
    const prev = data.prevSum || 0;
    const divider = prev === 0 ? 1 : prev;
    percentage = parseInt(((curr - prev) / divider) * 100, 10);
  }

  const caretClass = classNames('trend-icon caret icon', {
    'up red': percentage > 0,
    'down green': percentage < 0
  });
  const trendIcon = percentage === 0 ?
    (<span className="trend-icon trend-equal">=</span>) : (<i className={caretClass}/>);

  let shortPercentage = Math.abs(percentage) + '';
  if (isTrend && percentage > TREND_NUMBER_LIMIT) {
    shortPercentage = `>${TREND_NUMBER_LIMIT}`;
  }

  let trendContainer = '';
  if (isTrend) {
    trendContainer = (
      <div className="trend-container">
        <div className="trend-box">
          {trendIcon}
          {shortPercentage}%
        </div>
      </div>
    );
  }

  const color = style && style.backgroundColor ? '#FFF' : undefined;

  return (
    <div className="section-number" style={style}>
      <div className="number-container">
        <div
          className="trend-num-text"
          style={{ color }}
        >
          <span className="currency-sign">{currencySign}{numberToShortString(curr)}</span>
        </div>
        {layout === CHART_LAYOUT_TYPE.horizontal && isTrend &&
        trendContainer
        }
        <div className="trend-message">
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
  title: PropTypes.string,
  layout: PropTypes.oneOf(values(CHART_LAYOUT_TYPE)),
  currencySign: PropTypes.string
};

export default SectionNumber;