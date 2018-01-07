import React, { PropTypes } from 'react';
import { LineChart, Line, XAxis, YAxis, ReferenceLine, CartesianGrid, Tooltip, Legend } from 'recharts';
import { compact, values } from 'lodash';
import moment from 'moment';
import { QUERIES_TIME_FORMAT } from '../../../constants/Constants';
import { sortStrings } from '../../../utils/strings';
import { getGraphColorByName } from '../../../utils/colors';

const SectionLineChart = ({ data, style, dimensions, legend, chartProperties = {}, legendStyle = null,
    referenceLineX, referenceLineY, fromDate, toDate }) => {
  const existingColors = {};
  let preparedLegend = [];
  let preparedData = data;
  if (fromDate && toDate) {
    const timeFrame = 'days';
    const lineTypes = {};
    const from = moment(fromDate);
    preparedData = compact(preparedData.sort((a, b) => sortStrings(a.name, b.name)).map((mainGroup) => {
      let name = mainGroup.name;
      if (chartProperties.isDatesChart) {
        if (!name) {
          return null;
        }
        const timeFormat = chartProperties.format || QUERIES_TIME_FORMAT;
        if (!isNaN(name)) {
          name = moment(from).add(Number(name), timeFrame).format(timeFormat);
        } else if (name) {
          name = moment(name).format(timeFormat);
        }

        const dateObject = { name };
        if (mainGroup.groups) {
          mainGroup.groups.forEach((group) => {
            const groupName = group.name;
            dateObject[groupName] = group.data[0];
            lineTypes[groupName] = { name: groupName, stroke: getGraphColorByName(group.name) };
          });
        } else {
          const groupName = 'sum';
          dateObject.sum = mainGroup.data[0];
          lineTypes.sum = { name: groupName, stroke: getGraphColorByName(groupName) };
        }

        return dateObject;
      }
      const dataValue = { name, stroke: mainGroup.color };
      dataValue[name] = mainGroup.data[0];
      return dataValue;
    }));

    const retData = [];
    const frames = toDate.diff(from, timeFrame);
    const currentDate = moment(from);
    for (let i = 0; i <= frames; i++) {
      const mainGroup = preparedData.find(item => currentDate.format(QUERIES_TIME_FORMAT) === item.name);
      if (!mainGroup) {
        const dataObj = {
          name: currentDate.format(QUERIES_TIME_FORMAT)
        };
        Object.keys(lineTypes).forEach((groupName) => {
          dataObj[groupName] = 0;
        });
        retData.push(dataObj);
      } else {
        // complete missing subgroups for the graph to show complete lines.
        Object.keys(lineTypes).forEach((groupName) => {
          if (!(groupName in mainGroup)) {
            mainGroup[groupName] = 0;
          }
        });
        retData.push(mainGroup);
      }

      currentDate.add(1, timeFrame);
    }

    preparedLegend = values(lineTypes);
    preparedData = retData;
  }
  if (legend) {
    preparedLegend = legend.map((item) => {
      item.stroke = item.stroke || getGraphColorByName(item.name, existingColors);
      existingColors[item.stroke] = true;
      return item;
    });
  }

  return (
    <div className="section-line-chart" style={style}>
      <LineChart
        width={dimensions.width}
        height={dimensions.height}
        data={preparedData}
        margin={chartProperties.margin}
      >
        {(referenceLineX || chartProperties.layout === 'vertical') && <XAxis dataKey="name" />}
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
          <ReferenceLine y={referenceLineY.y} stroke={referenceLineY.stroke} label={referenceLineY.label} />}
        {legendStyle && <Legend {...legendStyle} />}
        {preparedLegend.map((item) =>
          <Line
            key={item.name}
            dataKey={item.name}
            stroke={item.stroke}
            type={item.type || 'monotone'}
            animationDuration={0}
            activeDot={{ strokeWidth: 0 }}
            strokeWidth={3}
            dot={false}
          />)}
      </LineChart>
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
