import './SectionChart.less';
import React from 'react';
import PropTypes from 'prop-types';
import SectionBarChart from './SectionBarChart';
import SectionPieChart from './SectionPieChart';
import SectionLineChart from './SectionLineChart';
import { CHART_TYPES } from '../../../constants/Constants';
import moment from 'moment';

const SectionChart = ({ type, data, style, dimensions, legend, chartProperties = {}, legendStyle = {}, sortBy,
        referenceLineX, referenceLineY, title, stacked, fromDate, toDate, titleStyle }) =>
  <div className="section-chart" style={style}>
    {title && <div className="section-title" style={titleStyle}>{title}</div>}
    {
      (() => {
        let chartToRender;
        switch (type) {
          case CHART_TYPES.column:
          case CHART_TYPES.bar:
            chartToRender = (
              <SectionBarChart
                data={data}
                style={style}
                dimensions={dimensions}
                legend={legend}
                chartProperties={chartProperties}
                legendStyle={legendStyle}
                sortBy={sortBy}
                stacked={stacked}
              />
            );
            break;
          case CHART_TYPES.pie:
            chartToRender = (
              <SectionPieChart
                data={data}
                style={style}
                dimensions={dimensions}
                legend={legend}
                chartProperties={chartProperties}
                legendStyle={legendStyle}
                sortBy={sortBy}
              />
            );
            break;
          case CHART_TYPES.line:
            chartToRender = (
              <SectionLineChart
                data={data}
                style={style}
                dimensions={dimensions}
                legend={legend}
                chartProperties={chartProperties}
                legendStyle={legendStyle}
                sortBy={sortBy}
                referenceLineX={referenceLineX}
                referenceLineY={referenceLineY}
                fromDate={fromDate && moment(fromDate)}
                toDate={toDate && moment(toDate)}
              />
            );
            break;
          default:
            // Ignored
        }
        return chartToRender;
      })()
    }
  </div>
;
SectionChart.propTypes = {
  type: PropTypes.string,
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  style: PropTypes.object,
  dimensions: PropTypes.object,
  chartProperties: PropTypes.object,
  legend: PropTypes.array,
  legendStyle: PropTypes.object,
  sortBy: PropTypes.object,
  title: PropTypes.string,
  titleStyle: PropTypes.object,
  referenceLineX: PropTypes.object,
  referenceLineY: PropTypes.object,
  stacked: PropTypes.bool,
  fromDate: PropTypes.string,
  toDate: PropTypes.string
};

export default SectionChart;
