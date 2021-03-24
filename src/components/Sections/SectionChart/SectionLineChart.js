import './SectionLineChart.less';
import React from 'react';
import PropTypes from 'prop-types';
import { LineChart, Label, Line, XAxis, YAxis, ReferenceLine, CartesianGrid, Tooltip, Legend } from 'recharts';
import ChartLegend from './ChartLegend';
import { cloneDeep, compact, isEmpty, values } from 'lodash';
import { AutoSizer } from 'react-virtualized';
import moment from 'moment';
import { NONE_VALUE_DEFAULT_NAME, QUERIES_TIME_FORMAT, SUPPORTED_TIME_FRAMES } from '../../../constants/Constants';
import { compareFields } from '../../../utils/sort';
import { getGraphColorByName } from '../../../utils/colors';

const SINGLE_LINE_CHART_NAME = 'sum';

const SectionLineChart = ({ data, style, dimensions, legend, chartProperties = {}, legendStyle = null,
  referenceLineX, referenceLineY, fromDate, toDate }) => {
  const existingColors = {};
  let preparedLegend = [];
  let preparedData = cloneDeep(data) || [];
  const finalToDate = toDate || moment().utc();
  const timeFrame = chartProperties.timeFrame || SUPPORTED_TIME_FRAMES.days;
  const lineTypes = {};
  let from = fromDate && moment(fromDate).utc();
  const timeFormat = chartProperties.format || QUERIES_TIME_FORMAT;
  preparedData = compact(preparedData.sort((a, b) => compareFields(a.name, b.name)).map((mainGroup) => {
    let name = mainGroup.name;
    if (chartProperties.isDatesChart || chartProperties.isDatesChart === undefined) {
      if (!name) {
        return null;
      }
      if (!isNaN(name)) {
        if (!from || !from.isValid()) {
          from = moment().add(-data.length, timeFrame);
        }
        name = moment(from).add(Number(name), timeFrame).format(timeFormat);
      } else if (name) {
        if (!from || !from.isValid()) {
          from = moment(name);
        }
        name = moment(name).format(timeFormat);
      }

      let currentGroup = mainGroup;
      currentGroup.name = name;
      const mainObject = { name };
      if (currentGroup.groups && currentGroup.data) {
        // add all sub groups to main object.
        currentGroup.groups.forEach((group) => {
          let groupName = group.name;
          if (!groupName) {
            groupName = chartProperties.emptyValueName || NONE_VALUE_DEFAULT_NAME;
          }
          const id = groupName;
          mainObject[groupName] = group.data[0];
          lineTypes[groupName] =
          {
            name: groupName,
            color: group.color || getGraphColorByName(groupName),
            id,
            value: mainObject[groupName]
          };
        });
      } else {
        if (currentGroup.data && currentGroup.data.length > 0) {
          currentGroup = { name, [SINGLE_LINE_CHART_NAME]: currentGroup.data[0], color: currentGroup.color };
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
  const frames = Math.ceil(finalToDate.diff(from, timeFrame, true));
  const currentDate = moment(from);
  for (let i = 0; i <= frames; i++) {
    const formattedDate = currentDate.format(timeFormat);
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

    currentDate.add(1, timeFrame);
  }

  preparedLegend = values(lineTypes);
  preparedData = retData;
  if (!isEmpty(legend) && Object.keys(lineTypes).length > 1) {
    preparedLegend = legend.map((item) => {
      item.color = item.color || item.stroke || getGraphColorByName(item.name, existingColors);
      existingColors[item.color] = true;
      return item;
    });
  }

  return (
    <div className="section-line-chart" style={style}>
      <AutoSizer>
        {({ width, height }) => {
          return (
            <LineChart
              width={width || dimensions.width}
              height={height || dimensions.height}
              data={preparedData}
              margin={chartProperties.margin}
            >
              {(referenceLineX || chartProperties.layout === 'vertical') && [
                <XAxis
                  dataKey="name"
                  key="x"
                  interval="preserveStartEnd"
                  label={chartProperties.axis && chartProperties.axis.x ? {
                    value: chartProperties.axis.x.label,
                    position: 'insideBottom',
                    offset: 0
                  } : undefined}
                />,
                <YAxis
                  key="y"
                  domain={
                    [dataMin => Math.floor(Math.min(0, dataMin, referenceLineY.y || 0) * 1.33),
                      dataMax => Math.ceil(Math.max(dataMax, referenceLineY.y || 0) * 1.33)]
                  }
                  label={chartProperties.axis && chartProperties.axis.y ? {
                    value: chartProperties.axis.y.label,
                    angle: -90
                  } : undefined}
                />
              ]}
              {(referenceLineY || chartProperties.layout === 'horizontal') && <YAxis dataKey="name" />}
              <CartesianGrid
                strokeDasharray={chartProperties.strokeDasharray || '4 4'}
                fill={chartProperties.chartFill || '#000000'}
                vertical={false}
                fillOpacity={chartProperties.chartFillOpacity || 0.04}
              />
              <Tooltip />
              {referenceLineX &&
                <ReferenceLine x={referenceLineX.x} stroke={referenceLineX.stroke} label={referenceLineX.label} />}
              {referenceLineY &&
                <ReferenceLine y={referenceLineY.y} stroke={referenceLineY.stroke}>
                  <Label value={referenceLineY.label} fill={referenceLineY.stroke} position="top" />
                </ReferenceLine>
              }
              {legendStyle && !legendStyle.hideLegend &&
                <Legend
                  content={<ChartLegend
                    icon="square"
                    data={preparedLegend}
                    capitalize={legendStyle.capitalize === undefined || legendStyle.capitalize}
                    style={legendStyle && legendStyle.style}
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
  style: PropTypes.object,
  dimensions: PropTypes.object,
  chartProperties: PropTypes.object,
  legend: PropTypes.array,
  legendStyle: PropTypes.object,
  sortBy: PropTypes.object,
  referenceLineX: PropTypes.object,
  referenceLineY: PropTypes.object,
  fromDate: PropTypes.object,
  toDate: PropTypes.object
};

export default SectionLineChart;
