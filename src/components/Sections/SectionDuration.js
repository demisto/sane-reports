import './SectionDuration.less';
import React from 'react';
import PropTypes from 'prop-types';
import { isArray, cloneDeep } from 'lodash';
import {
  DURATION_FORMAT,
  WIDGET_FORMAT_PARTS
} from '../../constants/Constants';
import SectionTitle from './SectionTitle';
import SectionDurationIcon from './SectionDurationIcon';

function formatNumber(num) {
  const hasTwoDigits = num / 100 >= 1;
  return hasTwoDigits ? num.toString() : ('0' + num).slice(-2);
}

const createHeaders = (parts, style) => {
  return (parts || []).map((part, ind) => {
    return (
      <React.Fragment key={'header' + part.header}>
        <td className="time-unit" style={style}>
          {part.header}
        </td>
        {(ind + 1) < parts.length &&
          <td />
        }
      </React.Fragment>
    );
  });
};

const createValues = (parts, style) => {
  return (parts || []).map((part, ind) => {
    return (
      <React.Fragment key={'value' + part.header}>
        <td className="part-header" style={style}>{part.value}</td>
        {(ind + 1) < parts.length &&
          <td className="colon center aligned" style={style}>:</td>
        }
      </React.Fragment>
    );
  });
};

const getLabels = (chartProperties) => {
  if (chartProperties && chartProperties.labels) {
    return chartProperties.labels;
  }

  return {
    days: (chartProperties && chartProperties.daysLabel) || 'days',
    hours: (chartProperties && chartProperties.hoursLabel) || 'hours',
    min: (chartProperties && chartProperties.minutesLabel) || 'minutes'
  };
};

const SectionDuration = ({ data, style, chartProperties, title, titleStyle, forceRangeMessage }) => {
  let result = data.length > 0 && isArray(data[0].data) && data[0].data.length > 0 ? data[0].data[0] : 0;
  const format = chartProperties && chartProperties.format;
  const labels = getLabels(chartProperties);
  const parts = [];
  const containerStyle = cloneDeep(style);

  const { backgroundColor: color, iconStyle, valueStyle, labelStyle } = containerStyle || {};
  if (color) {
    delete containerStyle.backgroundColor;
  }


  if (format && WIDGET_FORMAT_PARTS[format]) {
    const formatParts = WIDGET_FORMAT_PARTS[format];

    formatParts.forEach((part) => {
      const partValue = Math.floor(result / part.weight);
      const newPart = {
        header: labels[part.name],
        value: formatNumber(partValue)
      };

      result -= newPart.value * part.weight;
      parts.push(newPart);
    });
  } else {
    let days = Math.floor(result / DURATION_FORMAT.days.weight);
    result -= days * DURATION_FORMAT.days.weight;

    let hours = Math.floor(result / DURATION_FORMAT.hours.weight);
    result -= hours * DURATION_FORMAT.hours.weight;

    let minutes = Math.floor(result / DURATION_FORMAT.min.weight);

    days = formatNumber(days);
    hours = formatNumber(hours);
    minutes = formatNumber(minutes);

    parts.push({ header: labels.days, value: days });
    parts.push({ header: labels.hours, value: hours });
    parts.push({ header: labels.min, value: minutes });
  }

  return (
    <div className="section-duration" style={containerStyle}>
      <SectionTitle title={title} titleStyle={titleStyle} subTitle={forceRangeMessage} />
      <div className="duration-widget-container">
        <div className="duration-widget">
          <div className="icon-container" style={iconStyle || {}}>
            <SectionDurationIcon color={color} size={(iconStyle && iconStyle.fontSize) || '32px'} />
          </div>
          <div style={{ padding: 0 }}>
            <table className="wrapper-table">
              <tbody>
                <tr>
                  {createValues(parts, valueStyle)}
                </tr>
                <tr>
                  {createHeaders(parts, labelStyle)}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
SectionDuration.propTypes = {
  data: PropTypes.array,
  style: PropTypes.object,
  title: PropTypes.string,
  chartProperties: PropTypes.object,
  titleStyle: PropTypes.object,
  forceRangeMessage: PropTypes.string
};

export default SectionDuration;
