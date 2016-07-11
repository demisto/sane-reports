import React, { PropTypes } from 'react';
import SectionBarChart from './SectionBarChart';
import SectionPieChart from './SectionPieChart';
import { CHART_TYPES } from '../../../constants/Constants';

const SectionChart = ({ type, data, style, dimensions, legend }) =>
  <div className="section-chart" style={style}>
    {
      (() => {
        let chartToRender;
        switch (type) {
          case CHART_TYPES.bar:
            chartToRender = <SectionBarChart data={data} style={style} dimensions={dimensions} legend={legend} />;
            break;
          case CHART_TYPES.pie:
            chartToRender = <SectionPieChart data={data} style={style} dimensions={dimensions} legend={legend} />;
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
  legend: PropTypes.array
};

export default SectionChart;
