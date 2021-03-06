import './SectionChart.less';
import React from 'react';
import PropTypes from 'prop-types';
import SectionBarChart from './SectionBarChart';
import SectionPieChart from './SectionPieChart';
import SectionLineChart from './SectionLineChart';
import WidgetEmptyState from '../WidgetEmptyState';
import { CHART_TYPES } from '../../../constants/Constants';
import moment from 'moment';
import { isEmpty } from 'lodash';
import SectionTitle from '../SectionTitle';

const SectionChart = ({ type, data, groupBy, style, dimensions, legend, chartProperties = {}, legendStyle = {},
  sortBy, referenceLineX, referenceLineY, title, stacked, fromDate, toDate, titleStyle, reflectDimensions,
  emptyString, forceRangeMessage }) => {
  return (
    <div className="section-chart" style={style}>
      <SectionTitle title={title} titleStyle={titleStyle} subTitle={forceRangeMessage} />
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
                      fromDate={fromDate && moment(fromDate)}
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
                      groupBy={groupBy}
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
            })() : <WidgetEmptyState emptyString={emptyString} />
          }
    </div>
  );
};

SectionChart.propTypes = {
  type: PropTypes.string,
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  groupBy: PropTypes.string,
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
  emptyString: PropTypes.string,
  reflectDimensions: PropTypes.bool,
  forceRangeMessage: PropTypes.string
};

export default SectionChart;
