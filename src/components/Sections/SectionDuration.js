import './SectionDuration.less';
import React, { PropTypes } from 'react';
import isArray from 'lodash/isArray';

function formatNumber(num) {
  return ('0' + num).slice(-2);
}

const SectionDuration = ({ data, style, chartProperties, title, titleStyle }) => {
  let result = data.length > 0 && isArray(data[0].data) && data[0].data.length > 0 ? data[0].data[0] : 0;
  let days = Math.floor(result / (3600 * 24));
  result -= days * 3600 * 24;
  let hours = Math.floor(result / 3600);
  result -= hours * 3600;
  let minutes = Math.floor(result / 60);
  days = formatNumber(days);
  hours = formatNumber(hours);
  minutes = formatNumber(minutes);

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
                  <td className="days-number">{days}</td>
                  <td className="colon center aligned">:</td>
                  <td className="hours-number">{hours}</td>
                  <td className="colon center aligned">:</td>
                  <td className="minutes-number">{minutes}</td>
                </tr>
                <tr>
                  <td className="time-unit">
                    {(chartProperties && chartProperties.daysLabel) || 'days'}
                  </td>
                  <td />
                  <td className="time-unit">
                    {(chartProperties && chartProperties.hoursLabel) || 'hours'}
                  </td>
                  <td />
                  <td className="time-unit">
                    {(chartProperties && chartProperties.minutesLabel) || 'minutes'}
                  </td>
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
