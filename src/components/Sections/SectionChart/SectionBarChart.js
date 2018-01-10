import './SectionBarChart.less';
import React, { PropTypes } from 'react';
import ChartLegend from './ChartLegend';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { isArray, orderBy, unionBy } from 'lodash';
import { sortStrings } from '../../../utils/strings';
import { getGraphColorByName } from '../../../utils/colors';
import { CHART_LAYOUT_TYPE } from '../../../constants/Constants';

const SectionBarChart = ({ data, style, dimensions, legend, chartProperties = {},
  legendStyle = null, sortBy, stacked }) => {
  const existingColors = {};
  let dataItems = [];
  let preparedData;
  if (legend) {
    legend.map(item => {
      item.fill = item.fill || getGraphColorByName(item.name, existingColors);
    });

    dataItems = legend;
    preparedData = data;
  }

  if (!stacked) {
    preparedData = data.map((item) => {
      let val = item.value || item.data;
      if (isArray(val) && val.length > 0) {
        val = val[0];
      }

      item.fill = item.fill || getGraphColorByName(item.name, existingColors);
      existingColors[item.fill] = true;
      if (!legend) {
        item[item.name] = val;
        dataItems.push({ name: item.name, fill: item.fill });
      }
      return item;
    });
  }
  if (sortBy) {
    preparedData = orderBy(preparedData, sortBy.values, sortBy.orders);
  }

  const mainClass =
    chartProperties.layout === CHART_LAYOUT_TYPE.horizontal ? 'section-column-chart' : 'section-bar-chart';
  return (
    <div className={mainClass} style={style}>
      <BarChart
        width={dimensions.width}
        height={dimensions.height}
        data={preparedData}
        layout={chartProperties.layout}
        barSize={chartProperties.barSize || 13}
      >
        {chartProperties.layout === CHART_LAYOUT_TYPE.vertical &&
          <YAxis tick interval={0} dataKey="name" type="category" />}
        {chartProperties.layout === CHART_LAYOUT_TYPE.vertical && <XAxis type="number" hide />}
        {chartProperties.layout === CHART_LAYOUT_TYPE.horizontal && <YAxis type="number" />}
        {chartProperties.layout === CHART_LAYOUT_TYPE.horizontal && <XAxis tick dataKey="name" type="category" />}
        <CartesianGrid strokeDasharray={chartProperties.strokeDasharray || '3 3'} />
        <Tooltip />
        {legendStyle && Object.keys(legendStyle).length > 0 && !legendStyle.hideLegend &&
          <Legend
            content={<ChartLegend
              data={dataItems}
              icon={legendStyle.iconType}
              layout={legendStyle.layout}
            />}
            {...legendStyle}
          />
        }
        {dataItems.map((item) => <Bar
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
