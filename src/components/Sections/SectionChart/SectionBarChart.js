import './SectionBarChart.less';
import React, { PropTypes } from 'react';
import ChartLegend, { VALUE_FORMAT_TYPES } from './ChartLegend';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { isArray, orderBy } from 'lodash';
import { getGraphColorByName } from '../../../utils/colors';
import { CHART_LAYOUT_TYPE, NONE_VALUE_DEFAULT_NAME } from '../../../constants/Constants';

const SectionBarChart = ({ data, style, dimensions, legend, chartProperties = {},
  legendStyle = null, sortBy, stacked }) => {
  const existingColors = {};
  const isColumnChart = chartProperties.layout === CHART_LAYOUT_TYPE.horizontal;
  let dataItems = [];
  let preparedData;
  if (legend) {
    legend.map(item => {
      item.fill = item.fill || getGraphColorByName(item.name, existingColors);
      return item;
    });

    dataItems = legend;
    preparedData = data || [];
  }

  if (!stacked) {
    preparedData = (data || []).map((item) => {
      let val = item.value || item.data;
      if (isArray(val) && val.length > 0) {
        val = val[0];
      }

      if (!item.name) {
        item.name = chartProperties.emptyValueName || NONE_VALUE_DEFAULT_NAME;
      }

      item.fill = item.fill || getGraphColorByName(item.name, existingColors);
      existingColors[item.fill] = true;
      if (!legend) {
        item[item.name] = val;
        dataItems.push({ name: item.name, fill: item.fill, value: val });
      }
      return item;
    });
  }
  if (sortBy) {
    preparedData = orderBy(preparedData, sortBy.values, sortBy.orders);
  }

  const mainClass =
    isColumnChart ? 'section-column-chart' : 'section-bar-chart';

  const maxLabelSize = dimensions.width / 3 - 20;
  const margin = chartProperties.margin || {};
  let leftMargin = -5;
  if (!isColumnChart) {
    if (stacked) {
      // fix bar chart left label ticks cutoff.
      preparedData.forEach((item) => {
        let name = item.name || '';
        // Spaces are breaking the words so find the longest word. 'A Cool Playbook' return 'Playbook'.
        if (name.indexOf(' ') > -1) {
          const names = name.split(' ');
          name = names.sort((a, b) => b.length - a.length)[0];
        }
        let spaceNeeded = name.length * 5;
        if (spaceNeeded > maxLabelSize) {
          spaceNeeded = maxLabelSize;
        }
        leftMargin = Math.max(leftMargin, spaceNeeded);
      });
      margin.left = leftMargin;
    }
  }

  return (
    <div className={mainClass} style={style}>
      <BarChart
        width={dimensions.width}
        height={dimensions.height}
        data={preparedData}
        layout={chartProperties.layout}
        margin={margin}
        barSize={chartProperties.barSize || 13}
      >
        {chartProperties.layout === CHART_LAYOUT_TYPE.vertical &&
          <YAxis hide={!stacked} tick={{ fontSize: '15px' }} interval={0} dataKey="name" type="category" />}
        {chartProperties.layout === CHART_LAYOUT_TYPE.vertical && <XAxis type="number" hide />}
        {chartProperties.layout === CHART_LAYOUT_TYPE.horizontal && <YAxis type="number" />}
        {chartProperties.layout === CHART_LAYOUT_TYPE.horizontal && <XAxis tick dataKey="name" type="category" />}
        <CartesianGrid strokeDasharray={chartProperties.strokeDasharray || '3 3'} />
        <Tooltip />
        {legendStyle && Object.keys(legendStyle).length > 0 && !legendStyle.hideLegend &&
          <Legend
            content={<ChartLegend
              data={dataItems}
              valueDisplay={VALUE_FORMAT_TYPES.minimal}
              showValue={!isColumnChart && !stacked}
              icon={legendStyle.iconType}
              layout={legendStyle.layout}
              style={legendStyle && legendStyle.style}
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
