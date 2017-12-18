import React, { PropTypes } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import orderBy from 'lodash/orderBy';
import isArray from 'lodash/isArray';
import { getGraphColorByName } from '../../../utils/colors';

const SectionBarChart = ({ data, style, dimensions, legend, chartProperties = {}, legendStyle = null, sortBy }) => {
  const existingColors = {};
  let preparedData = data.map((item) => {
    if (isArray(item.value) && item.value.length > 0) {
      item.value = item.value[0];
    }

    for (let i = 0; i < legend.length; i++) {
      item.fill = item.fill || getGraphColorByName(item.name, existingColors);
      existingColors[item.fill] = true;
      if (item.relatedTo === legend[i].bar) {
        item[legend[i].name] = item.value;
      }
    }
    return item;
  });

  if (sortBy) {
    preparedData = orderBy(preparedData, sortBy.values, sortBy.orders);
  }

  return (
    <div className="section-bar-chart" style={style}>
      <BarChart
        width={dimensions.width}
        height={dimensions.height}
        data={preparedData}
        layout={chartProperties.layout}
        barSize={chartProperties.barSize || 13}
      >
        {chartProperties.layout === 'vertical' && <YAxis tick dataKey="name" type="category" />}
        {chartProperties.layout === 'vertical' && <XAxis type="number" />}
        {chartProperties.layout === 'horizontal' && <YAxis type="number" />}
        {chartProperties.layout === 'horizontal' && <XAxis tick dataKey="name" type="category" />}
        <CartesianGrid strokeDasharray={chartProperties.strokeDasharray || '3 3'} />
        <Tooltip />
        {legendStyle && Object.keys(legendStyle) > 0 && <Legend {...legendStyle} />}
        {legend.map((item) => chartProperties.label ?
          <Bar
            key={item.name}
            dataKey={item.name}
            fill={item.fill}
            onClick={(e) => { if (e.url) { window.open(e.url, '_blank'); } }}
            label
          /> :
          <Bar
            key={item.name}
            dataKey={item.name}
            fill={item.fill}
            onClick={(e) => { if (e.url) { window.open(e.url, '_blank'); } }}

          />
        )}
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
  legend: PropTypes.array,
  legendStyle: PropTypes.object,
  sortBy: PropTypes.object
};

export default SectionBarChart;
