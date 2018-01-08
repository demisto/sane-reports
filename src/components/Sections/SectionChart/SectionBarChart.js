import './SectionBarChart.less';
import React, { PropTypes } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { isArray, orderBy, unionBy } from 'lodash';
import { sortStrings } from '../../../utils/strings';
import { getGraphColorByName } from '../../../utils/colors';

const SectionBarChart = ({ data, style, dimensions, legend, chartProperties = {},
  legendStyle = null, sortBy, stacked }) => {
  const existingColors = {};
  let dataItems = [];
  let preparedData;
  if (stacked) {
    preparedData = data.map((group) => {
      const result = { name: group.name };
      group.groups.forEach((subGroup) => {
        let val = subGroup.value || subGroup.data;
        if (isArray(val) && val.length > 0) {
          val = val[0];
        }
        result[subGroup.name] = val;
      });
      return result;
    });

    dataItems = data
      .reduce((prev, curr) => unionBy(prev, curr.groups, 'name'), [])
      .map(group => ({ name: group.name, fill: getGraphColorByName(group.name, existingColors) }))
      .sort((a, b) => sortStrings(a.name, b.name));
  } else {
    preparedData = data.map((item) => {
      let val = item.value || item.data;
      if (isArray(val) && val.length > 0) {
        val = val[0];
      }

      item.fill = item.fill || getGraphColorByName(item.name, existingColors);
      existingColors[item.fill] = true;
      if (legend) {
        for (let i = 0; i < legend.length; i++) {
          if (item.relatedTo === legend[i].bar) {
            item[legend[i].name] = val;
          }
        }
      } else {
        item[item.name] = val;
        dataItems.push({ name: item.name, fill: item.fill });
      }
      return item;
    });
  }
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
        {chartProperties.layout === 'vertical' && <YAxis tick interval={0} dataKey="name" type="category" />}
        {chartProperties.layout === 'vertical' && <XAxis type="number" hide />}
        {chartProperties.layout === 'horizontal' && <YAxis type="number" />}
        {chartProperties.layout === 'horizontal' && <XAxis tick dataKey="name" type="category" />}
        <CartesianGrid strokeDasharray={chartProperties.strokeDasharray || '3 3'} />
        <Tooltip />
        {legendStyle && Object.keys(legendStyle) > 0 && !legendStyle.hideLegend && <Legend {...legendStyle} />}
        {(legend || dataItems).map((item) => <Bar
          key={item.name}
          dataKey={item.name}
          stackId="stack"
          fill={item.fill}
          onClick={(e) => { if (e.url) { window.open(e.url, '_blank'); } }}
          label={!!chartProperties.label}
        />)}
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
  sortBy: PropTypes.object,
  stacked: PropTypes.bool
};

export default SectionBarChart;
