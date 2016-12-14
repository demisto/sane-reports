import React, { PropTypes } from 'react';
import { LineChart, Line, XAxis, YAxis, ReferenceLine, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getGraphColorByName } from '../../../utils/colors';

const SectionLineChart = ({ data, style, dimensions, legend, chartProperties = {}, legendStyle = null,
    referenceLineX, referenceLineY }) => {
  const existingColors = {};
  let preparedData = data.map((item) => {
    item.stroke = item.stroke || getGraphColorByName(item.name, existingColors);
    existingColors[item.stroke] = true;
    return item;
  });

  return (
    <div className="section-line-chart" style={style}>
      <LineChart
        width={dimensions.width}
        height={dimensions.height}
        data={preparedData}
        margin={chartProperties.margin}
      >
        {(referenceLineX || chartProperties.layout === 'vertical') && <XAxis dataKey="name" />}
        {(referenceLineY || chartProperties.layout === 'horizontal') && <YAxis />}
        <CartesianGrid strokeDasharray={chartProperties.strokeDasharray || '3 3'} />
        <Tooltip />
        {referenceLineX &&
          <ReferenceLine x={referenceLineX.x} stroke={referenceLineX.stroke} label={referenceLineX.label} />}
        {referenceLineY &&
          <ReferenceLine y={referenceLineY.y} stroke={referenceLineY.stroke} label={referenceLineY.label} />}
        {legendStyle && Object.keys(legendStyle) > 0 && <Legend {...legendStyle} />}
        {legend.map((item) => <Line key={item.name} dataKey={item.name} stroke={item.stroke} type={item.type} />)}
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
  referenceLineY: PropTypes.object
};

export default SectionLineChart;
