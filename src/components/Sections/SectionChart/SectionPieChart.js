import './SectionPieChart.less';
import React, { PropTypes } from 'react';
import { AutoSizer } from 'react-virtualized';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';
import ChartLegend from './ChartLegend';
import merge from 'lodash/merge';
import orderBy from 'lodash/orderBy';
import isArray from 'lodash/isArray';
import { getGraphColorByName } from '../../../utils/colors';
import { CHART_LAYOUT_TYPE } from '../../../constants/Constants';

const SectionPieChart = ({ data, style, dimensions, legend, chartProperties = {}, legendStyle = {}, sortBy }) => {
  const dataMap = {};
  const existingColors = {};
  data.forEach((item) => {
    item.value = item.value || item.data;
    if (isArray(item.value) && item.value.length > 0) {
      item.value = item.value[0];
    }
    dataMap[item.name.toLowerCase()] = item;
  });
  let preparedData = [];
  if (legend) {
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
  if (chartProperties.layout === CHART_LAYOUT_TYPE.vertical) {
    legendHeight = dimensions.height / 2;
  }

  return (
    <div className="section-pie-chart" style={style}>
      <AutoSizer disableHeight>
        {({ width }) => {
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
                cx={chartProperties.cx || 200}
                cy={chartProperties.cy || 200}
                maxRadius={chartProperties.maxRadius}
                startAngle={chartProperties.startAngle || 90}
                endAngle={chartProperties.endAngle || -270}
                outerRadius={chartProperties.outerRadius || 80}
                innerRadius={chartProperties.innerRadius || 30}
                labelLine={chartProperties.labelLine}
                dataKey="value"
                label={chartProperties.label || { offsetRadius: 7 }}
              >
                {/* // creating links to urls according the 'url' filed in the data */}
                {preparedData.map((entry) => {
                  const url = entry.url;
                  return (
                    <Cell
                      key={'${entry.name}-cell-${index}'}
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
                content={
                  <ChartLegend
                    iconType="circle"
                    data={preparedData}
                    height={legendHeight}
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
  sortBy: PropTypes.object
};

export default SectionPieChart;
