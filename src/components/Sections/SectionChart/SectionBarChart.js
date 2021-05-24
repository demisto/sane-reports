import './SectionBarChart.less';
import React from 'react';
import PropTypes from 'prop-types';
import ChartLegend, { VALUE_FORMAT_TYPES } from './ChartLegend';
import { Bar, BarChart, Label, LabelList, Legend, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts';
import { isArray, orderBy } from 'lodash';
import { createMiddleEllipsisFormatter, formatNumberValue, getTextWidth, rightEllipsis } from '../../../utils/strings';
import { sortByField } from '../../../utils/sort';
import { getGraphColorByName } from '../../../utils/colors';
import {
  BAR_CHART_FULL_ITEM_HEIGHT,
  CHART_LAYOUT_TYPE,
  CHART_LEGEND_ITEM_HEIGHT,
  NONE_VALUE_DEFAULT_NAME,
  QUERIES_TIME_FORMAT,
  SUPPORTED_TIME_FRAMES,
  WIDGET_DEFAULT_CONF
} from '../../../constants/Constants';
import { AutoSizer } from 'react-virtualized';
import { calculateAngledTickInterval } from '../../../utils/ticks';
import LabelAxisTick from '../LabelAxisTick';
import moment from 'moment';
import { getDateGroupName } from '../../../utils/time';

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
  legendStyle = null, sortBy, stacked, fromDate, referenceLineY, reflectDimensions }) => {
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
      const newItem = { ...item };
      let val = newItem.value || newItem.data;
      if (isArray(val) && val.length > 0) {
        val = val[0];
      }
      newItem.color = newItem.fill || newItem.color || getGraphColorByName(newItem.name, existingColors);
      if (!newItem.name) {
        newItem.name = chartProperties.emptyValueName || NONE_VALUE_DEFAULT_NAME;
      }

      let formattedName = newItem.name;
      if (chartProperties.isDatesChart) {
        const from = fromDate && moment(fromDate).utc();
        const timeFormat = chartProperties.format || QUERIES_TIME_FORMAT;
        const timeFrame = chartProperties.timeFrame || SUPPORTED_TIME_FRAMES.days;

        formattedName = getDateGroupName(newItem.name, timeFrame, timeFormat, from);
      }

      existingColors[newItem.color] = true;
      if (!legend || !dataItems[newItem.name]) {
        newItem[formattedName] = val;
        dataItems[formattedName] = {
          name: newItem.name,
          formattedName,
          color: newItem.color,
          value: val
        };
      } else {
        dataItems[formattedName].value = val;
      }
      newItem.total = val;
      newItem.name = formattedName;
      return newItem;
    });

    dataItems = Object.keys(dataItems).map((key) => {
      return dataItems[key];
    });
  }
  if (sortBy) {
    preparedData = orderBy(preparedData, sortBy.values, sortBy.orders);
  }

  const mainClass =
    isColumnChart ? 'section-column-chart' : 'section-bar-chart';
  const maxLabelSize = (dimensions.width / 3) - 20;
  const margin = chartProperties.margin || {};
  let leftMargin = -5;
  if (stacked) {
    const allSubGroups = {};
    preparedData.forEach((item) => {
      // fix bar chart left label ticks cutoff.
      if (!isColumnChart) {
        let name = item.name || '';
        if (!name) {
          name = chartProperties.emptyValueName || NONE_VALUE_DEFAULT_NAME;
        }
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
        item.total = 0;
        // iterate inner groups
        (item.groups || []).forEach((innerItem) => {
          innerItem.color = innerItem.fill || innerItem.color || getGraphColorByName(innerItem.name, existingColors);
          if (!innerItem.name) {
            innerItem.name = chartProperties.emptyValueName || NONE_VALUE_DEFAULT_NAME;
          }
          existingColors[innerItem.color] = true;
          allSubGroups[innerItem.name] = allSubGroups[innerItem.name] ?
            { ...allSubGroups[innerItem.name], sum: allSubGroups[innerItem.name].sum + innerItem.name } :
            { ...innerItem, sum: innerItem.name };

          item[innerItem.name] = innerItem.data[0];
          item.total += item[innerItem.name];
        });
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

      if (chartProperties.isDatesChart) {
        item.id = item.name;
        const from = fromDate && moment(fromDate).utc();
        const timeFormat = chartProperties.format || QUERIES_TIME_FORMAT;
        const timeFrame = chartProperties.timeFrame || SUPPORTED_TIME_FRAMES.days;

        item.name = getDateGroupName(item.name, timeFrame, timeFormat, from);
      }
    });
    if (!isColumnChart) {
      margin.left = leftMargin;
    }
    dataItems = Object.values(allSubGroups).sort((a, b) => sortByField(['sum', 'name'], [false, true])(a, b));
  }

  if (legend) {
    dataItems = legend.map((item) => {
      if (!item.name) {
        item.name = chartProperties.emptyValueName || NONE_VALUE_DEFAULT_NAME;
      }
      const dataItem = dataItems.find(l =>
        (l.name || chartProperties.emptyValueName || NONE_VALUE_DEFAULT_NAME) === item.name);
      if (!dataItem) {
        return item;
      }
      dataItem.color = item.color || dataItem.color;
      if (!dataItem.name) {
        dataItem.name = chartProperties.emptyValueName || NONE_VALUE_DEFAULT_NAME;
      }
      if (dataItem.formattedName) {
        dataItem.name = dataItem.formattedName;
      }
      return dataItem;
    });
  }
  const isFull = !reflectDimensions;
  const barSize = chartProperties.barSize || WIDGET_DEFAULT_CONF.barSize;

  let minHeight = Math.min(BAR_CHART_FULL_ITEM_HEIGHT,
    dataItems.length * (barSize + WIDGET_DEFAULT_CONF.barSizeMargin));

  if (chartProperties.layout === CHART_LAYOUT_TYPE.vertical) {
    minHeight += (dataItems.length * CHART_LEGEND_ITEM_HEIGHT);
  }
  return (
    <div className={mainClass} style={style}>
      <AutoSizer>
        {({ width, height }) => {
          const finalWidth = width || dimensions.width;
          const xAxisProps = isColumnChart ? createXAxisProps(data, 'name', finalWidth / 2) : {};
          const finalHeight = Math.max(isFull ? dimensions.height : height || dimensions.height, minHeight);

          return (
            <BarChart
              width={finalWidth}
              height={finalHeight}
              data={preparedData}
              layout={chartProperties.layout}
              margin={margin}
              barSize={barSize}
            >
              {chartProperties.layout === CHART_LAYOUT_TYPE.vertical &&
              <YAxis
                key="y"
                hide={!stacked}
                interval={0}
                tick={stacked ? <LabelAxisTick /> : false}
                dataKey="name"
                type="category"
              />
              }
              {chartProperties.layout === CHART_LAYOUT_TYPE.vertical &&
                <XAxis type="number" hide allowDecimals={false} />}
              {chartProperties.layout === CHART_LAYOUT_TYPE.horizontal &&
              <YAxis
                type="number"
                domain={
                  [dataMin => Math.floor(Math.min(0, dataMin, (referenceLineY && referenceLineY.y) || 0) * 1.33),
                    dataMax => Math.ceil(Math.max(dataMax, (referenceLineY && referenceLineY.y) || 0) * 1.33)]
                }
                tickFormatter={formatValue}
              >
                {chartProperties.axis && chartProperties.axis.y && chartProperties.axis.y.label &&
                <Label
                  value={rightEllipsis(chartProperties.axis.y.label, Math.floor(finalHeight / 12))}
                  angle={-90}
                  offset={6}
                  style={{ textAnchor: 'middle' }}
                  position="insideLeft"
                />}
              </YAxis>}
              {chartProperties.layout === CHART_LAYOUT_TYPE.horizontal &&
              <XAxis tick dataKey="name" type="category" {...xAxisProps}>
                {chartProperties.axis && chartProperties.axis.x && chartProperties.axis.x.label &&
                <Label
                  value={rightEllipsis(chartProperties.axis.x.label, Math.floor(finalWidth / 12))}
                  offset={3}
                  position="insideBottom"
                />}
              </XAxis>}
              <Tooltip />
              {legendStyle && Object.keys(legendStyle).length > 0 && !legendStyle.hideLegend &&
                <Legend
                  content={<ChartLegend
                    data={dataItems}
                    valueDisplay={VALUE_FORMAT_TYPES.minimal}
                    showValue={!isColumnChart && !stacked}
                    formatter={formatValue}
                    icon="square"
                    capitalize={legendStyle.capitalize === undefined || legendStyle.capitalize}
                    layout={legendStyle.layout}
                    style={legendStyle && legendStyle.style}
                  />}
                  {...legendStyle}
                />
              }
              {dataItems.map((item, i) =>
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
                  {chartProperties.showValues && i === dataItems.length - 1 &&
                  <LabelList
                    position="top"
                    dataKey={group => group.total}
                    formatter={formatValue}
                  />}
                </Bar>
                  )}
              {referenceLineY &&
              <ReferenceLine y={referenceLineY.y} stroke={referenceLineY.stroke}>
                <Label value={referenceLineY.label} fill={referenceLineY.stroke} position="top" />
              </ReferenceLine>
              }
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
  fromDate: PropTypes.object,
  stacked: PropTypes.bool,
  reflectDimensions: PropTypes.bool
};

export default SectionBarChart;
