import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WIDGET_DEFAULT_CONF } from '../../constants/Constants';
import { getTextWidth, sentenceBreaker } from '../../utils/strings';

class LabelAxisTick extends Component {
  static propTypes = {
    payload: PropTypes.object,
    x: PropTypes.number,
    y: PropTypes.number,
    angle: PropTypes.number
  };

  static defaultProps = {
    angle: 0
  };

  calculateAndTruncateName = (size, name) => {
    const maxAvailableSize = Math.max(0, size - WIDGET_DEFAULT_CONF.barSizeMargin);
    const spaceNeeded = getTextWidth(name, WIDGET_DEFAULT_CONF.font);
    if (spaceNeeded >= maxAvailableSize && name.length > 0) {
      // maxLength (chars) = max available size in pixels / average number of pixels per character using space needed.
      return sentenceBreaker(name, Math.round(maxAvailableSize / (spaceNeeded / name.length)), 1)[0];
    }

    return name;
  };

  render() {
    const { payload, x, y, angle } = this.props;
    const name = this.calculateAndTruncateName(x, payload.value || '');
    return (
      <g transform={`translate(0,${y})`}>
        <text
          x={0}
          y={0}
          dy={5}
          fontSize="15px"
          textAnchor="start"
          fill="rgb(64, 65, 66)"
          transform={`rotate(${angle})`}
        >
          <title>{payload.value}</title>
          {name}
        </text>
      </g>
    );
  }
}

export default LabelAxisTick;
