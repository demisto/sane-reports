import React, { PropTypes } from 'react';
import { PieChart, Pie, Legend, Tooltip } from 'recharts';
import merge from 'lodash/merge';
import orderBy from 'lodash/orderBy';
import { getGraphColorByName } from '../../../utils/colors';

const SectionPieChart = ({ data, style, dimensions, legend, chartProperties = {}, legendStyle = {}, sortBy }) => {
  const dataMap = {};
  const existingColors = {};
  data.forEach((item) => (dataMap[item.name.toLowerCase()] = item));
  let preparedData = [];
  legend.forEach((legendItem) => {
    const key = legendItem.name.toLowerCase();
    if (dataMap[key]) {
      if (!legendItem.fill) {
        legendItem.fill = getGraphColorByName(dataMap[key].name);
      }
      existingColors[legendItem.fill] = true;
      preparedData.push(merge(dataMap[key], legendItem));
      delete dataMap[key];
    }
  });
  Object.keys(dataMap).forEach((key) => {
    const graphItem = dataMap[key];
    graphItem.fill = getGraphColorByName(graphItem.name, existingColors);
    existingColors[graphItem.fill] = true;
    return preparedData.push(graphItem);
  });

  if (sortBy) {
    preparedData = orderBy(preparedData, sortBy.values, sortBy.orders);
  }

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
  legendStyle: PropTypes.object,
  sortBy: PropTypes.object
};

export default SectionPieChart;
