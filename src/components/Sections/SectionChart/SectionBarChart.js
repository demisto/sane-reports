import './SectionBarChart.less';
import React from 'react';
import PropTypes from 'prop-types';
import ChartLegend, { VALUE_FORMAT_TYPES } from './ChartLegend';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ReferenceLine, Label } from 'recharts';
import { isArray, orderBy, unionBy } from 'lodash';
import { sortStrings } from '../../../utils/strings';
import { getGraphColorByName } from '../../../utils/colors';
import { CHART_LAYOUT_TYPE, NONE_VALUE_DEFAULT_NAME } from '../../../constants/Constants';
import { AutoSizer } from 'react-virtualized';

const SectionBarChart = ({ data, style, dimensions, legend, chartProperties = {},
  legendStyle = null, sortBy, stacked, referenceLineY }) => {
  const existingColors = {};
  const isColumnChart = chartProperties.layout === CHART_LAYOUT_TYPE.horizontal;
  let dataItems = {};
  let preparedData = data || [];

  if (!stacked) {
    preparedData = preparedData.map((item) => {
      let val = item.value || item.data;
      if (isArray(val) && val.length > 0) {
        val = val[0];
      }
      item.color = item.fill || item.color || getGraphColorByName(item.name, existingColors);
      if (!item.name) {
        item.name = chartProperties.emptyValueName || NONE_VALUE_DEFAULT_NAME;
      }
      existingColors[item.color] = true;
      if (!legend || !dataItems[item.name]) {
        item[item.name] = val;
        dataItems[item.name] = { name: item.name, color: item.color, value: val };
      } else {
        dataItems[item.name].value = val;
      }
      return item;
    });
  }
  if (sortBy) {
    preparedData = orderBy(preparedData, sortBy.values, sortBy.orders);
  }

  const mainClass =
    isColumnChart ? 'section-column-chart' : 'section-bar-chart';
  const maxLabelSize = (dimensions.width / 3) - 20;
  let maxCategorySize = 0;
  const margin = chartProperties.margin || {};
  let leftMargin = -5;
  if (stacked) {
    preparedData.forEach((item) => {
      // fix bar chart left label ticks cutoff.
      if (!isColumnChart) {
        let name = item.name || '';
        if (!name) {
          name = chartProperties.emptyValueName || NONE_VALUE_DEFAULT_NAME;
        }
        maxCategorySize = Math.max((name.length * 5), maxCategorySize);
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
      }
      if (item.groups) {
        // iterate inner groups
        (item.groups || []).forEach(((innerItem) => {
          innerItem.color = innerItem.fill || innerItem.color || getGraphColorByName(innerItem.name, existingColors);
          if (!innerItem.name) {
            innerItem.name = chartProperties.emptyValueName || NONE_VALUE_DEFAULT_NAME;
          }
          existingColors[innerItem.color] = true;

          item[innerItem.name] = innerItem.data[0];
        }));

        dataItems = preparedData
          .reduce((prev, curr) => unionBy(prev, curr.groups, 'name'), [])
          .map(group => ({ name: group.name, color: group.fill || group.color }))
          .sort((a, b) => sortStrings(a.name, b.name));
      } else {
        Object.keys(item).filter(key => key !== 'name' && key !== 'relatedTo' && key !== 'value').forEach(
          (groupKey) => {
            dataItems[groupKey] = {
              name: groupKey,
              color: getGraphColorByName(groupKey),
              value: item[groupKey]
            };
          }
        );
      }
    });
    maxCategorySize = Math.min(maxCategorySize, maxLabelSize);
    if (!isColumnChart) {
      margin.left = leftMargin;
    }
  }

  dataItems = Object.keys(dataItems).map((key) => {
    return dataItems[key];
  });
  if (legend) {
    dataItems = dataItems.map((item) => {
      const legendItem = legend.filter(l => l.name === item.name);
      item.color = legendItem.length > 0 ? legendItem[0].color || legendItem[0].fill || item.color : item.color;
      return item;
    });
  }

  return (
    <div className={mainClass} style={style}>
      <AutoSizer>
        {({ width, height }) => {
          return (
            <BarChart
              width={width || dimensions.width}
              height={height || dimensions.height}
              data={preparedData}
              layout={chartProperties.layout}
              margin={margin}
              barSize={chartProperties.barSize || 13}
            >
              {chartProperties.layout === CHART_LAYOUT_TYPE.vertical &&
              <YAxis
                hide={!stacked} tick={{ fontSize: '15px' }} width={maxCategorySize} interval={0}
                dataKey="name" type="category"
              />
              }
              {chartProperties.layout === CHART_LAYOUT_TYPE.vertical && <XAxis type="number" allowDecimals={false} />}
              {chartProperties.layout === CHART_LAYOUT_TYPE.horizontal &&
                <YAxis
                  type="number"
                  domain={
                    [dataMin => Math.floor(Math.min(0, dataMin, (referenceLineY && referenceLineY.y) || 0) * 1.33),
                      dataMax => Math.ceil(Math.max(dataMax, (referenceLineY && referenceLineY.y) || 0) * 1.33)]
                  }
                />
              }
              {chartProperties.layout === CHART_LAYOUT_TYPE.horizontal && <XAxis tick dataKey="name" type="category" />}
              <Tooltip />
              {referenceLineY &&
                <ReferenceLine y={referenceLineY.y} stroke={referenceLineY.stroke}>
                  <Label value={referenceLineY.label} fill={referenceLineY.stroke} position="top" />
                </ReferenceLine>
              }
              {legendStyle && Object.keys(legendStyle).length > 0 && !legendStyle.hideLegend &&
                <Legend
                  content={<ChartLegend
                    data={dataItems}
                    valueDisplay={VALUE_FORMAT_TYPES.minimal}
                    showValue={!isColumnChart && !stacked}
                    icon={legendStyle.iconType}
                    capitalize={legendStyle.capitalize === undefined || legendStyle.capitalize}
                    layout={legendStyle.layout}
                    style={legendStyle && legendStyle.style}
                  />}
                  {...legendStyle}
                />
              }
              {dataItems.map(item => <Bar
                key={item.name}
                dataKey={item.name}
                stackId="stack"
                fill={item.color}
                onClick={(e) => {
                  if (e.url) {
                    window.open(e.url, '_blank');
                  }
                }}
                label={!!chartProperties.label}
              />)}
            </BarChart>);
        }
        }
      </AutoSizer>
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
  referenceLineY: PropTypes.object,
  stacked: PropTypes.bool
};

export default SectionBarChart;
