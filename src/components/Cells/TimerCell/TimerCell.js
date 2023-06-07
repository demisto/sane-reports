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

  render() {
    const { extraData } = this.props;
    if (!extraData || extraData.runStatus === TIMER_STATUS.idle) {
      return 'N/A';
    }

    const timerProps = getSlaProps(extraData);

    return (
      <TimeTicker {...timerProps} />
    );
  }
}

export default TimerCell;
