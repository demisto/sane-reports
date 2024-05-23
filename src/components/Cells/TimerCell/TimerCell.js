import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TIMER_STATUS } from '../../../constants/Constants';
import { getSlaProps } from '../../../utils/time';
import { TimeTicker } from './TimeTicker';

class TimerCell extends Component {
  static propTypes = {
    extraData: PropTypes.object,
    threshold: PropTypes.number
  };

  static isEmpty(extraData) {
    return !extraData || extraData.runStatus === TIMER_STATUS.idle;
  }

  render() {
    const { extraData } = this.props;
    if (TimerCell.isEmpty(extraData)) {
      return 'N/A';
    }

    const timerProps = getSlaProps(extraData);

    return (
      <TimeTicker {...timerProps} />
    );
  }
}

export default TimerCell;
