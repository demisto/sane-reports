import './SectionChart.less';
import React from 'react';
import PropTypes from 'prop-types';
import SectionBarChart from './SectionBarChart';
import SectionPieChart from './SectionPieChart';
import SectionLineChart from './SectionLineChart';
import WidgetEmptyState from '../WidgetEmptyState';
import {
  CHART_TYPES,
  WIDGET_DEFAULT_CONF
} from '../../../constants/Constants';
import moment from 'moment';
import { isBoolean, isEmpty } from 'lodash';

const filterResults = (chartProperties, rawResults) => {
  const showOthersParam = chartProperties.showOthers;
  const showOthers = isBoolean(showOthersParam) ? showOthersParam : WIDGET_DEFAULT_CONF.showOthers;
  return (!showOthers && rawResults && Array.isArray(rawResults)) ?
    rawResults.filter(item => item.name !== WIDGET_DEFAULT_CONF.otherGroup) : rawResults;
};

const SectionChart = ({ type, data: rawData, style, dimensions, legend, chartProperties = {}, legendStyle = {}, sortBy,
  referenceLineX, referenceLineY, title, stacked, fromDate, toDate, titleStyle, reflectDimensions }) => {
  const data = filterResults(chartProperties, rawData);

  return (
    <div className="section-chart" style={style}>
      {title && <div className="section-title" style={titleStyle}>{title}</div>}
      <div className="section-chart-content">
        {!isEmpty(data) && data.length > 0 ?
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
                      referenceLineY={referenceLineY}
                      reflectDimensions={reflectDimensions}
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
                      reflectDimensions={reflectDimensions}
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
                      reflectDimensions={reflectDimensions}
                    />
                  );
                  break;
                default:
                  // Ignored
              }
              return chartToRender;
            })() : <WidgetEmptyState />
          }
      </div>
    </div>
  );
};

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
  toDate: PropTypes.string,
  reflectDimensions: PropTypes.bool
};

export default SectionChart;
