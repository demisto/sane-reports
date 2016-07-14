import React, { PropTypes } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const SectionBarChart = ({ data, style, dimensions, legend, chartProperties = {} }) => {
  const preparedData = data.map((item) => {
    for (let i = 0; i < legend.length; i++) {
      if (item.relatedTo === legend[i].bar) {
        item[legend[i].name] = item.value;
      }
    }
    return item;
  });

  return (
    <div className="section-bar-chart" style={style}>
      <BarChart width={dimensions.width} height={dimensions.height} data={preparedData}>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray={chartProperties.strokeDasharray || '3 3'} />
        <Tooltip />
        <Legend />
        {legend.map((item) => <Bar key={item.name} dataKey={item.name} fill={item.fill} />)}
      </BarChart>
    </div>
  );
};
SectionBarChart.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  style: PropTypes.object,
  dimensions: PropTypes.object,
  chartProperties: PropTypes.object,
  legend: PropTypes.array
};

export default SectionBarChart;
