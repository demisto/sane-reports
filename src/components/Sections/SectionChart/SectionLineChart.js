import './SectionLineChart.less';
import React from 'react';
import PropTypes from 'prop-types';
import { LineChart, Label, Line, XAxis, YAxis, ReferenceLine, CartesianGrid, Tooltip, Legend } from 'recharts';
import ChartLegend from './ChartLegend';
import { cloneDeep, compact, isEmpty, values } from 'lodash';
import { AutoSizer } from 'react-virtualized';
import moment from 'moment';
import {
  CHART_LEGEND_ITEM_HEIGHT,
  NONE_VALUE_DEFAULT_NAME,
  QUERIES_TIME_FORMAT,
  SUPPORTED_TIME_FRAMES,
  WIDGET_DEFAULT_CONF,
  LINE_CHART_FULL_ITEM_HEIGHT,
  INCIDENT_FIELDS
} from '../../../constants/Constants';
import { compareFields, sortBySeverity } from '../../../utils/sort';
import { DEFAULT_LINE_STROKE_COLOR, getGraphColorByName } from '../../../utils/colors';
import { formatNumberValue, getTextWidth, rightEllipsis } from '../../../utils/strings';
import { calculateAngledTickInterval } from '../../../utils/ticks';
import { getDateGroupName } from '../../../utils/time';
import { getFormattedGroupValue } from '../../../utils/charts';

const SINGLE_LINE_CHART_NAME = 'sum';

const createXAxisProps = (data, dataKey, width) => {
  const ticks = data.map(x => x[dataKey]);
  const ticksStr = ticks.join(' ');
  const ticksUiWidth = getTextWidth(ticksStr, WIDGET_DEFAULT_CONF.font);
  const props = {
    interval: 'preserveStartEnd'
  };

  if (ticksUiWidth > width) {
    props.interval = calculateAngledTickInterval(width, WIDGET_DEFAULT_CONF.lineHeight, data.length);
    props.textAnchor = 'end';
    props.angle = WIDGET_DEFAULT_CONF.tickAngle;
    props.height = getTextWidth(ticks[0], WIDGET_DEFAULT_CONF.font) + 10;
    props.tick = {
      width: Infinity
    };
    props.dx = -5;
    props.dy = 0;
  }

  return props;
};

const getTimeFrame = (preparedData, chartProperties) => {
  if (chartProperties.timeFrame !== SUPPORTED_TIME_FRAMES.none) {
    const allNamesAreUnformattable = preparedData.every((mainGroup) => {
      const name = mainGroup.name;
      return name && isNaN(name) && !moment(name).isValid();
    });

    if (allNamesAreUnformattable) {
      return SUPPORTED_TIME_FRAMES.none;
    }
  }

  return chartProperties.timeFrame || SUPPORTED_TIME_FRAMES.days;
};

const SectionLineChart = ({ data, groupBy, style, dimensions, legend, chartProperties = {}, legendStyle = null,
  referenceLineX, referenceLineY, fromDate, toDate, reflectDimensions }) => {
  const { valuesFormat } = chartProperties;
  const existingColors = {};
  let preparedLegend = [];
  let preparedData = cloneDeep(data) || [];

  const formatValue = (v) => {
    return formatNumberValue(v, valuesFormat);
  };

  const finalToDate = toDate || moment().utc();
  const timeFrame = getTimeFrame(preparedData, chartProperties);
  const lineTypes = {};
  let from = fromDate && moment(fromDate).utc();
  const timeFormat = chartProperties.format || QUERIES_TIME_FORMAT;
  let multiGroupBy = false;
  preparedData = compact(preparedData.sort((a, b) => compareFields(a.name, b.name)).map((mainGroup) => {
    let name = mainGroup.name;
    if (chartProperties.isDatesChart || chartProperties.isDatesChart === undefined) {
      if (!name) {
        return null;
      }
      if (!isNaN(name) && timeFrame !== SUPPORTED_TIME_FRAMES.none) {
        if (!from || !from.isValid()) {
          from = moment().add(-data.length, timeFrame);
        }
        name = moment(from).add(Number(name), timeFrame).format(timeFormat);
      } else if (name && timeFrame !== SUPPORTED_TIME_FRAMES.none) {
        if (!from || !from.isValid()) {
          from = moment(name);
        }
        name = getDateGroupName(name, timeFrame, timeFormat, from);
      }

      let currentGroup = mainGroup;
      currentGroup.name = name;
      const mainObject = { name };
      if (currentGroup.groups && currentGroup.data) {
        multiGroupBy = multiGroupBy || currentGroup.groups.length > 0;
        // add all sub groups to main object.
        currentGroup.groups.forEach((group) => {
          let groupName = group.name;
          if (!groupName) {
            groupName = chartProperties.emptyValueName || NONE_VALUE_DEFAULT_NAME;
          }
          const id = groupName;
          const value = getFormattedGroupValue(group, valuesFormat);
          mainObject[groupName] = value;
          lineTypes[groupName] =
          {
            name: groupName,
            color: group.color || getGraphColorByName(groupName),
            id,
            value
          };
        });
      } else {
        if (currentGroup.data && currentGroup.data.length > 0) {
          currentGroup = { name,
            [SINGLE_LINE_CHART_NAME]: getFormattedGroupValue(currentGroup, valuesFormat),
            color: currentGroup.color || DEFAULT_LINE_STROKE_COLOR };
        }
        Object.keys(currentGroup).filter(key => key !== 'name' && key !== 'color' &&
          key !== 'relatedTo').forEach((groupKey) => {
          // add line type definition or add if exists
          if (lineTypes[groupKey]) {
            lineTypes[groupKey].value += currentGroup[groupKey] || 0;
          } else {
            lineTypes[groupKey] = {
              name: groupKey,
              color: currentGroup.color || getGraphColorByName(groupKey),
              value: currentGroup[groupKey]
            };
          }
          mainObject[groupKey] = currentGroup[groupKey];
        });
      }

      return mainObject;
    }
    return mainGroup;
  }));

  const retData = [];
  const frames = timeFrame !== SUPPORTED_TIME_FRAMES.none ?
    Math.ceil(finalToDate.diff(from, timeFrame, true)) : preparedData.length - 1;

  const currentDate = moment(from);
  for (let i = 0; i <= frames; i++) {
    if (currentDate <= finalToDate) {
      const formattedDate = timeFrame !== SUPPORTED_TIME_FRAMES.none ?
        currentDate.format(timeFormat) : preparedData[i].name;
      const mainGroup = preparedData.filter(item =>
        formattedDate === item.name);
      const group = mainGroup && mainGroup.length > 0 && mainGroup[0];
      if (!group) {
        const dataObj = {
          name: formattedDate
        };
        Object.keys(lineTypes).forEach((groupName) => {
          dataObj[groupName] = 0;
        });
        retData.push(dataObj);
      } else {
      // complete missing subgroups for the graph to show complete lines.
        Object.keys(lineTypes).forEach((groupName) => {
          if (!(groupName in group)) {
            group[groupName] = 0;
          }
        });
        retData.push(group);
      }
    }
    currentDate.add(1, timeFrame);
  }
  preparedLegend = values(lineTypes);
  preparedData = retData;
  if (!isEmpty(legend) && Object.keys(lineTypes).length > 0 && multiGroupBy) {
    preparedLegend = legend.map((item) => {
      if (!item.name) {
        item.name = chartProperties.emptyValueName || NONE_VALUE_DEFAULT_NAME;
      }
      item.color = item.color || item.stroke || getGraphColorByName(item.name, existingColors);
      existingColors[item.color] = true;
      return item;
    });
  }

  if (groupBy === INCIDENT_FIELDS.severity) {
    preparedLegend = sortBySeverity(preparedLegend);
  }

  const isFull = !reflectDimensions;
  if (isFull && preparedLegend.length * CHART_LEGEND_ITEM_HEIGHT > dimensions.height) {
    dimensions.height = (preparedLegend.length * CHART_LEGEND_ITEM_HEIGHT) + LINE_CHART_FULL_ITEM_HEIGHT;
  }

  return (
    <div className="section-line-chart" style={style}>
      <AutoSizer>
        {({ width, height }) => {
          const finalWidth = width || dimensions.width;
          const xAxisProps = createXAxisProps(preparedData, 'name', finalWidth * 0.6);
          const finalHeight = isFull ? dimensions.height : dimensions.height || height;

          return (
            <LineChart
              width={finalWidth}
              height={finalHeight}
              data={preparedData}
              margin={chartProperties.margin}
            >
              {(referenceLineX || chartProperties.layout === 'vertical') && [
                <XAxis
                  dataKey="name"
                  key="x"
                  interval="preserveStartEnd"
                  {...xAxisProps}
                >
                  {chartProperties.axis && chartProperties.axis.x && chartProperties.axis.x.label &&
                  <Label
                    value={rightEllipsis(chartProperties.axis.x.label, Math.floor(finalWidth / 12))}
                    offset={-5}
                    position="insideBottom"
                  />}
                </XAxis>,
                <YAxis
                  key="y"
                  domain={
                    [dataMin => Math.floor(Math.min(0, dataMin, (referenceLineY && referenceLineY.y) || 0) * 1.33),
                      dataMax => Math.ceil(Math.max(dataMax, (referenceLineY && referenceLineY.y) || 0) * 1.33)]
                  }
                  tickFormatter={formatValue}
                >
                  {chartProperties.axis && chartProperties.axis.y && chartProperties.axis.y.label &&
                  <Label
                    value={rightEllipsis(chartProperties.axis.y.label, Math.floor(finalHeight / 12))}
                    angle={270}
                    offset={6}
                    style={{ textAnchor: 'middle' }}
                    position="left"
                  />}
                </YAxis>
              ]}
              {(referenceLineY || chartProperties.layout === 'horizontal') && <YAxis dataKey="name" />}
              <CartesianGrid
                strokeDasharray={chartProperties.strokeDasharray || '4 4'}
                fill={chartProperties.chartFill || '#000000'}
                vertical={false}
                fillOpacity={chartProperties.chartFillOpacity || 0.04}
              />
              <Tooltip />
              {preparedLegend.length > 1 && legendStyle && !legendStyle.hideLegend &&
                <Legend
                  content={<ChartLegend
                    icon="square"
                    data={preparedLegend}
                    showValue={false}
                    capitalize={legendStyle.capitalize === undefined || legendStyle.capitalize}
                    style={legendStyle && legendStyle.style}
                    groupBy={groupBy}
                    enableSort
                  />}
                  {...legendStyle}
                />
              }
              {preparedLegend.map(item =>
                <Line
                  key={item.name}
                  dataKey={item.name}
                  type="monotone"
                  stroke={item.color}
                  animationDuration={0}
                  activeDot={{ strokeWidth: 0 }}
                  strokeWidth={3}
                  dot={false}
                />)}
              {referenceLineX &&
              <ReferenceLine x={referenceLineX.x} stroke={referenceLineX.stroke} label={referenceLineX.label} />}
              {referenceLineY &&
              <ReferenceLine y={referenceLineY.y} stroke={referenceLineY.stroke}>
                <Label value={referenceLineY.label} fill={referenceLineY.stroke} position="top" />
              </ReferenceLine>
              }
            </LineChart>);
          }
        }
      </AutoSizer>
    </div>
  );
};
SectionLineChart.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  groupBy: PropTypes.string,
  style: PropTypes.object,
  dimensions: PropTypes.object,
  chartProperties: PropTypes.object,
  legend: PropTypes.array,
  legendStyle: PropTypes.object,
  sortBy: PropTypes.object,
  referenceLineX: PropTypes.object,
  referenceLineY: PropTypes.object,
  fromDate: PropTypes.object,
  toDate: PropTypes.object,
  reflectDimensions: PropTypes.bool
};

export default SectionLineChart;
