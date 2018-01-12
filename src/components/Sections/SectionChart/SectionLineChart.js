import './SectionLineChart.less';
import React, { PropTypes } from 'react';
import { LineChart, Line, XAxis, YAxis, ReferenceLine, CartesianGrid, Tooltip, Legend } from 'recharts';
import ChartLegend from './ChartLegend';
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
  const finalToDate = toDate || moment().utc();
  if (fromDate && finalToDate) {
    const timeFrame = 'days';
    const lineTypes = {};
    const from = moment(fromDate).utc();
    const timeFormat = chartProperties.format || QUERIES_TIME_FORMAT;
    preparedData = compact(preparedData.sort((a, b) => sortStrings(a.name, b.name)).map((mainGroup) => {
      let name = mainGroup.name;
      if (chartProperties.isDatesChart) {
        if (!name) {
          return null;
        }
        if (!isNaN(name)) {
          name = moment(from).add(Number(name), timeFrame).format(timeFormat);
        } else if (name) {
          name = moment(name).format(timeFormat);
        }

        mainGroup.name = name;
        Object.keys(mainGroup).filter(key => key !== 'name' && key !== 'relatedTo').forEach(groupKey => {
          lineTypes[groupKey] = { name: groupKey, stroke: getGraphColorByName(groupKey) };
        });

        return mainGroup;
      }
      return mainGroup;
    }));

    const retData = [];
    const frames = finalToDate.diff(from, timeFrame);
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
        {legendStyle && !legendStyle.hideLegend &&
          <Legend
            content={<ChartLegend
              icon="square"
              data={preparedLegend}
            />}
            {...legendStyle}
          />
        }
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
