import './SectionGroupedList.less';
import React from 'react';
import PropTypes from 'prop-types';
import SectionList from './SectionList';
import SectionTitle from './SectionTitle';

const SectionGroupedList = ({ columns, data, classes, style, title, titleStyle, groupClass,
  emptyString, forceRangeMessage }) => {
  const groupedData = data || {};
  const mainClass = `section-grouped-list ${classes}`;
  return (
    <div className={mainClass} style={style}>
      <SectionTitle title={title} titleStyle={titleStyle} subTitle={forceRangeMessage} />
      {Object.keys(groupedData).map((groupName) => {
        return (
          <div className="grouped-item item h3" key={groupName}>
            <div className="group-item-name">{groupName}</div>
            <SectionList
              data={groupedData[groupName] || []}
              columns={columns}
              classes={groupClass ? groupClass[groupName] : undefined}
              emptyString={emptyString}
            />
          </div>
        );
      })}
    </div>
  );
};

SectionGroupedList.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.object,
  classes: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.string,
  groupClass: PropTypes.object,
  titleStyle: PropTypes.object,
  emptyString: PropTypes.string,
  forceRangeMessage: PropTypes.string
};

export default SectionGroupedList;
