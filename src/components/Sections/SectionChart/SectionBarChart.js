import './SectionBarChart.less';
import React from 'react';
import PropTypes from 'prop-types';
import ChartLegend, { VALUE_FORMAT_TYPES } from './ChartLegend';
import { Bar, BarChart, Label, LabelList, Legend, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts';
import { isArray, orderBy, unionBy } from 'lodash';
import { createMiddleEllipsisFormatter, formatNumberValue, getTextWidth, sortStrings } from '../../../utils/strings';
import { getGraphColorByName } from '../../../utils/colors';
import {
  BAR_CHART_FULL_ITEM_HEIGHT,
  CHART_LAYOUT_TYPE,
  CHART_LEGEND_ITEM_HEIGHT,
  NONE_VALUE_DEFAULT_NAME,
  WIDGET_DEFAULT_CONF
} from '../../../constants/Constants';
import { AutoSizer } from 'react-virtualized';
import { calculateAngledTickInterval } from '../../../utils/ticks';

const createXAxisProps = (data, dataKey, width) => {
  const ticks = data.map(x => x[dataKey]);
  const ticksStr = ticks.join(' ');
  const ticksUiWidth = getTextWidth(ticksStr, WIDGET_DEFAULT_CONF.font);
  const props = {
    interval: 0
  };

  if (ticksUiWidth > width) {
    const mEllipsisFormatter = createMiddleEllipsisFormatter(WIDGET_DEFAULT_CONF.tickMaxChars);
    const longestTick = ticks.reduce((acc, curr) => {
      return acc.length > curr.length ? acc : curr;
    });

    props.interval = calculateAngledTickInterval(width, WIDGET_DEFAULT_CONF.lineHeight, data.length);
    props.textAnchor = 'end';
    props.angle = WIDGET_DEFAULT_CONF.tickAngle;
    props.height = getTextWidth(mEllipsisFormatter(longestTick), WIDGET_DEFAULT_CONF.font) + 15;
    props.tickFormatter = mEllipsisFormatter;
    props.dx = -5;
    props.dy = 0;
  }

  return props;
};

const SectionBarChart = ({ data, style, dimensions, legend, chartProperties = {},
  legendStyle = null, sortBy, stacked, referenceLineY, reflectDimensions }) => {
  const existingColors = {};
  const isColumnChart = chartProperties.layout === CHART_LAYOUT_TYPE.horizontal;
  let dataItems = {};
  let preparedData = data || [];

  const formatValue = (v) => {
    const { valuesFormat } = chartProperties;
    return formatNumberValue(v, valuesFormat);
  };

  if (!stacked) {
    preparedData = preparedData.map((item) => {
      let val = item.value || item.data;
      item.showValues = chartProperties.showValues;
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
        dataItems[item.name] = { name: item.name,
          color: item.color,
          value: val,
          showValues: chartProperties.showValues };
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
        item.showValues = chartProperties.showValues;
        // iterate inner groups
        (item.groups || []).forEach(((innerItem, index) => {
          innerItem.color = innerItem.fill || innerItem.color || getGraphColorByName(innerItem.name, existingColors);
          if (!innerItem.name) {
            innerItem.name = chartProperties.emptyValueName || NONE_VALUE_DEFAULT_NAME;
          }
          existingColors[innerItem.color] = true;

          item[innerItem.name] = innerItem.data[0];
          innerItem.showValues = index === item.groups.length - 1;
        }));

        dataItems = preparedData
          .reduce((prev, curr) => unionBy(prev, curr.groups, 'name'), [])
          .map(group => ({ name: group.name,
            color: group.fill || group.color,
            showValues: group.showValues && chartProperties.showValues }))
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
  let isFull = false;
  if (!reflectDimensions && (preparedData.length * CHART_LEGEND_ITEM_HEIGHT > dimensions.height || stacked)) {
    isFull = true;
    dimensions.height = (preparedData.length * CHART_LEGEND_ITEM_HEIGHT) + BAR_CHART_FULL_ITEM_HEIGHT;
  }

  return (
    <div className={mainClass} style={style}>
      <AutoSizer>
        {({ width, height }) => {
          const finalWidth = width || dimensions.width;
          const xAxisProps = isColumnChart ? createXAxisProps(data, 'name', finalWidth / 2) : {};
          const finalHeight = isFull ? dimensions.height : height || dimensions.height;

          return (
            <BarChart
              width={finalWidth}
              height={finalHeight}
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
              >
                {chartProperties.axis && chartProperties.axis.y &&
                <Label
                  value={chartProperties.axis.y.label}
                  angle={-90}
                  offset={16}
                  position="insideLeft"
                />}
              </YAxis>}
              {chartProperties.layout === CHART_LAYOUT_TYPE.horizontal &&
              <XAxis tick dataKey="name" type="category" {...xAxisProps}>
                {chartProperties.axis && chartProperties.axis.x &&
                <Label value={chartProperties.axis.x.label} offset={3} position="insideBottom" />}
              </XAxis>}
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
                    icon="square"
                    capitalize={legendStyle.capitalize === undefined || legendStyle.capitalize}
                    layout={legendStyle.layout}
                    style={legendStyle && legendStyle.style}
                  />}
                  {...legendStyle}
                />
              }
              {dataItems.map(item =>
                <Bar
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
                >
                  {!chartProperties.label && item.showValues &&
                  <LabelList
                    position="top"
                    valueAccessor={(entry) => {
                      let value = '';
                      if (entry && entry.data && entry.data[0] !== undefined) {
                        value = entry.data[0];
                      } else if (entry && entry.value && entry.value[1] !== undefined) {
                        value = entry.value[1];
                      }
                      return value;
                    }}
                    formatter={formatValue}
                  />}
                </Bar>
                  )}
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
  stacked: PropTypes.bool,
  reflectDimensions: PropTypes.bool
};

export default SectionBarChart;
