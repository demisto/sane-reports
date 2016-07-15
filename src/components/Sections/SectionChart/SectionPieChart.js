import React, { PropTypes } from 'react';
import { PieChart, Pie, Legend, Tooltip } from 'recharts';
import merge from 'lodash/merge';

const SectionPieChart = ({ data, style, dimensions, legend, chartProperties = {}, legendStyle = {} }) => {
  const preparedData = data.map((item) => {
    for (let i = 0; i < legend.length; i++) {
      if (legend[i].name === item.name) {
        return merge(item, legend[i]);
      }
    }
    return item;
  });

  return (
    <div className="section-pie-chart" style={style}>
      <PieChart width={dimensions.width} height={dimensions.height}>
        <Tooltip />
        <Legend {...legendStyle} />
        <Pie
          data={preparedData}
          cx={chartProperties.cx || 200}
          cy={chartProperties.cy || 200}
          startAngle={chartProperties.startAngle || 90}
          endAngle={chartProperties.endAngle || -270}
          outerRadius={chartProperties.outerRadius || 80}
          innerRadius={chartProperties.innerRadius || 30}
          labelLine={chartProperties.labelLine}
          label={chartProperties.label || { offsetRadius: 10 }}
        />
      </PieChart>
    </div>
  );
};
SectionPieChart.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  style: PropTypes.object,
  dimensions: PropTypes.object,
  chartProperties: PropTypes.object,
  legend: PropTypes.array,
  legendStyle: PropTypes.object
};

export default SectionPieChart;
