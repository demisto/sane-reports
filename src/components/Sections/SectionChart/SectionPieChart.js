import React, { PropTypes } from 'react';
import { PieChart, Pie, Legend, Tooltip } from 'recharts';
import merge from 'lodash/merge';

const SectionPieChart = ({ data, style, dimensions, legend }) => {
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
        <Legend />
        <Pie data={preparedData} cx={200} cy={200} startAngle={90} endAngle={-270} outerRadius={80} label />
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
  legend: PropTypes.array
};

export default SectionPieChart;
