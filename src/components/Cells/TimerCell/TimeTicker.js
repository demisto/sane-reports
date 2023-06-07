import './TimeTicker.less';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import values from 'lodash/values';
import { pickBy } from 'lodash';
import { TIME_PERIODS } from '../../../constants/Constants';
import { getDurationString, isZeroDateTime } from '../../../utils/time';

export class TimeTicker extends Component {
  static propTypes = {
    duration: PropTypes.number,
    timePeriod: PropTypes.oneOf(values(TIME_PERIODS)),
    riskThreshold: PropTypes.number, // in hours
    startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    dueDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  };

  static defaultProps = {
    timePeriod: TIME_PERIODS.MILISECONDS
  };

  getSlaStatus = (slaStatusObject) => {
    const slaStatus = Object.keys(slaStatusObject)[0];
    switch (slaStatus) {
      case 'late':
        return 'Late';
      case 'risk':
        return 'Risk';
      case 'within':
        return 'Due';
      default:
        return '';
    }
  }

  render() {
    const { duration, startDate, dueDate, timePeriod, riskThreshold } = this.props;
    let finalDuration = duration;
    let durationType = timePeriod;
    const finalDueDate = dueDate && !isZeroDateTime(dueDate) ? moment(dueDate).local() : undefined;
    const finalStartDate = startDate && !isZeroDateTime(startDate) ? moment(startDate).local() : undefined;
    const doesHaveDueDate = !!finalDueDate;
    const isDurationSet = !!finalDuration || finalDuration === 0;
    if (!isDurationSet) {
      durationType = TIME_PERIODS.MINUTES;
      if (finalDueDate) {
        finalDuration = moment(finalDueDate).diff(moment().local(), durationType);
      } else {
        finalDuration = moment().local().diff(finalStartDate, durationType);
      }
    }

    let slaPart = '';
    let elapsed = '';
    let isNegative = false;
    let isRisk = false;
    if (finalDueDate && finalStartDate) {
      const sla = moment(finalDueDate).diff(finalStartDate, TIME_PERIODS.MINUTES);
      slaPart = getDurationString(sla, TIME_PERIODS.MINUTES);
    }
    if (finalDuration < 0) {
      isNegative = true;
      finalDuration *= -1;
      if (finalDueDate) {
        if (isDurationSet) {
          const diff = moment(finalDueDate).diff(moment(startDate), durationType);
          elapsed = getDurationString(diff + finalDuration, durationType);
        } else {
          const elapsedMinutes = moment().diff(finalStartDate, TIME_PERIODS.MINUTES);
          elapsed = getDurationString(elapsedMinutes, TIME_PERIODS.MINUTES);
        }
      }
    } else if (finalDueDate && riskThreshold > 0) {
      const durationInMinutes = durationType === TIME_PERIODS.MINUTES ? finalDuration : finalDuration / 60;
      if (riskThreshold * 60 >= durationInMinutes) {
        isRisk = true;
      }
    }
    const timeToRender = getDurationString(finalDuration, durationType);
    const dueDateStr = dueDate;
    const slaStatusObject = pickBy(
      {
        within: !isRisk && !isNegative,
        risk: isRisk,
        late: isNegative
      },
      v => v
    );
    const wrapperClass = classNames('sla-status', slaStatusObject);
    const iconClass = classNames('demisto-icon', {
      'icon-field-timer-24-r': !doesHaveDueDate,
      'icon-field-sla-24-r': doesHaveDueDate
    });
    const slaMessage = `${this.getSlaStatus(slaStatusObject)}: `;
    return (
      <div className="time-ticker">
        <span className={wrapperClass}>
          <span className="sla-field-icon">
            <i className={iconClass} />
          </span>
          {doesHaveDueDate && <span className="sla-message">{slaMessage}</span>}
          <span className="duration">{timeToRender}</span>
        </span>
        {doesHaveDueDate && (
          <div className="sla-details">
            <div className="sla-part">{`SLA: ${slaPart}`}</div>
            <div className="sla-date">{dueDateStr}</div>
            {elapsed && (
              <div className="elapsed-time">
                <span>Total Elapsed: </span>
                <span>{elapsed}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
