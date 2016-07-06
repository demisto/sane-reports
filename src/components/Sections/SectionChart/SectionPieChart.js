import React, { PropTypes } from 'react';
import { PieChart, Pie, Legend, Tooltip } from 'recharts';

const SectionPieChart = ({ data, style, dimensions }) =>
  <div className="section-pie-chart" style={style}>
    <PieChart width={dimensions.width} height={dimensions.height}>
      <Tooltip />
      <Legend />
      <Pie data={data} cx={200} cy={200} startAngle={90} endAngle={-270} outerRadius={80} label />
    </PieChart>
  </div>
;
SectionPieChart.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  style: PropTypes.object,
  dimensions: PropTypes.object
};

export default SectionPieChart;
