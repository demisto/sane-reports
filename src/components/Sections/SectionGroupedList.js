import React from 'react';
import PropTypes from 'prop-types';
import SectionList from './SectionList';

const SectionGroupedList = ({ columns, data, classes, style, title, titleStyle, groupClass }) => {
  const groupedData = data || {};
  const mainClass = `section-grouped-list ${classes}`;
  return (
    <div className={mainClass} style={style}>
      {title && <div className="section-title" style={titleStyle}>{title}</div>}
      {Object.keys(groupedData).map((groupName) => {
        return (
          <div className="grouped-item item h3" key={groupName}>
            <div className="group-item-name">{groupName}</div>
            <SectionList
              data={groupedData[groupName] || []}
              columns={columns}
              classes={groupClass ? groupClass[groupName] : undefined}
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
  titleStyle: PropTypes.object
};

export default SectionGroupedList;
