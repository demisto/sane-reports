import './SectionPieChart.less';
import React from 'react';
import PropTypes from 'prop-types';
import { AutoSizer } from 'react-virtualized';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';
import ChartLegend from './ChartLegend';
import merge from 'lodash/merge';
import orderBy from 'lodash/orderBy';
import isArray from 'lodash/isArray';
import { getGraphColorByName } from '../../../utils/colors';
import { CHART_LAYOUT_TYPE, NONE_VALUE_DEFAULT_NAME, RADIANS } from '../../../constants/Constants';

const CustomizedPieLabel = ({ cx, cy, midAngle, outerRadius, percent, fill }) => {
  const radius = outerRadius * 1.1;
  const x = cx + (radius * Math.cos(-midAngle * RADIANS));
  const y = cy + (radius * Math.sin(-midAngle * RADIANS));
  // ignore less than 2 percent.
  if (percent < 0.02) {
    return '';
  }
  return (
    <text
      x={x}
      y={y}
      fill={fill}
      fontSize={12}
      transform={`rotate(0,${x},${y})`}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
CustomizedPieLabel.propTypes = {
  cx: PropTypes.number,
  cy: PropTypes.number,
  midAngle: PropTypes.number,
  outerRadius: PropTypes.number,
  fill: PropTypes.string,
  percent: PropTypes.number
};

const SectionPieChart = ({ data, style, dimensions, legend, chartProperties = {}, legendStyle = {},
  sortBy, showOverflow }) => {
  const dataMap = {};
  const existingColors = {};
  (data || []).forEach((item) => {
    item.value = item.value || item.data;
    if (isArray(item.value) && item.value.length > 0) {
      item.value = item.value[0];
    }
    if (!item.name) {
      item.name = chartProperties.emptyValueName || NONE_VALUE_DEFAULT_NAME;
    }
    dataMap[item.name.toLowerCase()] = item;
  });
  let preparedData = [];
  if (legend) {
    legend.forEach((legendItem) => {
      const key = legendItem.name.toLowerCase();
      if (dataMap[key]) {
        legendItem.fill = legendItem.fill || legendItem.color;
        if (!legendItem.fill) {
          legendItem.fill = getGraphColorByName(dataMap[key].name);
        }
        existingColors[legendItem.fill] = true;
        preparedData.push(merge(dataMap[key], legendItem));
        delete dataMap[key];
      }
    });
  }
  Object.keys(dataMap).forEach((key) => {
    const graphItem = dataMap[key];
    graphItem.fill = getGraphColorByName(graphItem.name, existingColors);
    existingColors[graphItem.fill] = true;
    return preparedData.push(graphItem);
  });

  if (sortBy) {
    preparedData = orderBy(preparedData, sortBy.values, sortBy.orders);
  }

  let legendHeight = dimensions.height;
  if (chartProperties.layout === CHART_LAYOUT_TYPE.vertical && showOverflow) {
    legendHeight = dimensions.height / 2;
  }

  return (
    <div className="section-pie-chart" style={style}>
      <AutoSizer disableHeight>
        {({ width }) => {
          const outerRadius = chartProperties.outerRadius || 80;
          const innerRadius = chartProperties.innerRadius || 30;
          return (
            <PieChart
              width={width || dimensions.width}
              height={dimensions.height}
              margin={{ left: 20, right: 20, bottom: 10, top: 10 }}
            >
              <Pie
                iconSize={8}
                paddingAngle={0}
                data={preparedData}
                cx={(chartProperties.cx || 200) + 5}
                cy={chartProperties.cy || 200}
                maxRadius={chartProperties.maxRadius}
                startAngle={chartProperties.startAngle || 90}
                endAngle={chartProperties.endAngle || -270}
                outerRadius={outerRadius > 10 ? outerRadius - 5 : outerRadius}
                innerRadius={innerRadius > 10 ? innerRadius - 5 : innerRadius}
                labelLine={false}
                dataKey="value"
                label={chartProperties.label || CustomizedPieLabel}
              >
                {/* // creating links to urls according the 'url' filed in the data */}
                {preparedData.map((entry, index) => {
                  const url = entry.url;
                  return (
                    <Cell
                      key={`${entry.name}-cell-${index}`}
                      onClick={() => {
                        if (entry.url) {
                          window.open(url, '_blank');
                        }
                      }}
                    />
                  );
                })
                }
              </Pie>
              <Tooltip />
              <Legend
                wrapperStyle={chartProperties.layout === CHART_LAYOUT_TYPE.vertical ? {
                  width: '90%'
                } : { top: 10 }}
                content={
                  <ChartLegend
                    iconType="square"
                    capitalize={legendStyle.capitalize === undefined || legendStyle.capitalize}
                    data={preparedData}
                    height={legendHeight}
                    style={legendStyle && legendStyle.style}
                  />
                }
                {...legendStyle}
              />
            </PieChart>);
        }
        }
      </AutoSizer>
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
  sortBy: PropTypes.object,
  showOverflow: PropTypes.bool
};

export default SectionPieChart;
