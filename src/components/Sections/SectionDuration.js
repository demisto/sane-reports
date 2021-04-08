import './SectionDuration.less';
import React from 'react';
import PropTypes from 'prop-types';
import isArray from 'lodash/isArray';

function formatNumber(num) {
  return ('0' + num).slice(-2);
}

const createHeaders = (parts) => {
  return (parts || []).map((part, ind) => {
    return (
      <React.Fragment key={'header' + part.header}>
        <td className="time-unit">
          {part.header}
        </td>
        {(ind + 1) < parts.length &&
          <td />
        }
      </React.Fragment>
    );
  });
};

const createValues = (parts) => {
  return (parts || []).map((part, ind) => {
    return (
      <React.Fragment key={'value' + part.header}>
        <td className="part-header">{part.value}</td>
        {(ind + 1) < parts.length &&
          <td className="colon center aligned">:</td>
        }
      </React.Fragment>
    );
  });
};

const SectionDuration = ({ data, style, chartProperties, title, titleStyle }) => {
  let result = data.length > 0 && isArray(data[0].data) && data[0].data.length > 0 ? data[0].data[0] : 0;
  const parts = (chartProperties && chartProperties.parts) ? chartProperties.parts : [];

  if (parts.length === 0) {
    const daysLabel = (chartProperties && chartProperties.daysLabel) || 'days';
    let days = Math.floor(result / (3600 * 24));
    result -= days * 3600 * 24;

    const hoursLabel = (chartProperties && chartProperties.hoursLabel) || 'hours';
    let hours = Math.floor(result / 3600);
    result -= hours * 3600;

    const minutesLabel = (chartProperties && chartProperties.minutesLabel) || 'minutes';
    let minutes = Math.floor(result / 60);

    days = formatNumber(days);
    hours = formatNumber(hours);
    minutes = formatNumber(minutes);

    parts.push({ header: daysLabel, value: days });
    parts.push({ header: hoursLabel, value: hours });
    parts.push({ header: minutesLabel, value: minutes });
  }

  return (
    <div className="section-duration" style={style}>
      {title && <div className="section-title" style={titleStyle}>{title}</div>}
      <div className="duration-widget-container">
        <div className="ui center aligned middle aligned grid duration-widget">
          <div className="four wide column" style={{ padding: 0 }}>
            <i className="wait icon home" />
          </div>
          <div className="twelve wide column" style={{ padding: 0 }}>
            <table className="wrapper-table">
              <tbody>
                <tr>
                  {createValues(parts)}
                </tr>
                <tr>
                  {createHeaders(parts)}
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
  titleStyle: PropTypes.object
};

export default SectionDuration;
