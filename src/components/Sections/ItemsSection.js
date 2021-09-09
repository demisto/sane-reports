import './ItemsSection.less';
import classNames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SECTION_ITEMS_DISPLAY_LAYOUTS, SECTION_ITEM_TYPE } from '../../constants/Constants';
import { AutoSizer } from 'react-virtualized';
import { SectionHTML, SectionMarkdown, SectionTable, SectionTags } from './index';
import { get, maxBy } from 'lodash';
import uuid from 'uuid';
import { sortByFieldsWithPriority } from '../../utils/sort';

const DESCRIPTION_KEY = 'description';
const SECTION_ITEM_PADDING = 5;

class ItemsSection extends Component {
  static propTypes = {
    style: PropTypes.object,
    columns: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    titleStyle: PropTypes.object,
    items: PropTypes.arrayOf(PropTypes.shape({
      fieldId: PropTypes.string,
      fieldName: PropTypes.string,
      data: PropTypes.any,
      startCol: PropTypes.number,
      endCol: PropTypes.number,
      index: PropTypes.number,
      displayType: PropTypes.oneOf(Object.values(SECTION_ITEMS_DISPLAY_LAYOUTS))
    }))
  };

  static getHeightOffset(columnUsage, item) {
    return get(columnUsage, `${item.startCol}.${item.index}.offset`, 0);
  }

  constructor(props) {
    super(props);

    this.itemElements = {};
    this.state = { columnUsage: {}, id: uuid.v1() };
  }

  componentDidMount() {
    setTimeout(() => this.setColumnUsage(this.props), 100); // avoid rerender height changes
  }

  componentWillReceiveProps(nextProps) {
    setTimeout(() => this.setColumnUsage(nextProps), 100); // avoid rerender height changes
  }

  getSectionItemKey(item) {
    const { id } = this.state;
    return `section-item-${id}-${item.startCol}-${item.endCol}-${item.index}`;
  }

  setColumnUsage(props) {
    const { items } = props;
    const columnUsage = {};
    (items || []).sort(sortByFieldsWithPriority(['index', 'startCol'])).forEach((sectionItem) => {
      let itemHeight = 0;
      let maxOffset = 0;
      const domNode = this.itemElements[this.getSectionItemKey(sectionItem)];
      if (domNode) {
        itemHeight = domNode.clientHeight;
      }
      const colSpan = this.getItemColSpan(sectionItem);
      for (let i = 0; i < colSpan; i++) {
        if (!columnUsage[sectionItem.startCol + i]) {
          columnUsage[sectionItem.startCol + i] = {};
        }
        columnUsage[sectionItem.startCol + i][sectionItem.index] =
          { height: itemHeight, offset: 0 };
        for (let lastIndex = sectionItem.index - 1; lastIndex >= 0; lastIndex--) {
          const lastItem = columnUsage[sectionItem.startCol + i][lastIndex];
          if (lastItem) {
            maxOffset = Math.max(maxOffset, lastItem.offset + lastItem.height);
            break;
          }
        }
      }
      // use maximum offset
      for (let i = 0; i < colSpan; i++) {
        columnUsage[sectionItem.startCol + i][sectionItem.index].offset = maxOffset > 0 ?
          maxOffset + SECTION_ITEM_PADDING : 0;
      }
    });

    this.setState({ columnUsage });
  }

  getItemColSpan(sectionItem) {
    const { columns } = this.props;
    const colSpan = sectionItem.endCol - sectionItem.startCol;
    return colSpan === 0 ? columns : colSpan;
  }

  render() {
    const { style, items, columns, title, titleStyle, description } = this.props;
    const { columnUsage } = this.state;

    let maxOffset = 0;
    Object.values(columnUsage).forEach((colValues) => {
      const maxVal = maxBy(Object.values(colValues), v => v.offset + v.height);
      if (maxOffset < maxVal.offset + maxVal.height) {
        maxOffset = maxVal.offset + maxVal.height;
      }
    });
    maxOffset += (title ? 40 : 0) + 5;
    const descriptionItem = this.itemElements[DESCRIPTION_KEY];
    if (descriptionItem) {
      maxOffset += descriptionItem.clientHeight || 0;
    }
    return (
      <AutoSizer disableHeight>
        {({ width }) => {
          const columnWidth = width / columns;
          const maxRow = maxBy(items, item => item.index).index;
          return (
            <div className="items-section" style={{ width, height: maxOffset, ...style }}>
              {title && <div className="section-title" style={titleStyle}>{title}</div>}
              {description && (
                <SectionMarkdown
                  text={description}
                  customClass="section-description"
                  setRef={(itemElement) => {
                    if (!itemElement) {
                      return;
                    }
                    this.itemElements[DESCRIPTION_KEY] = itemElement;
                  }}
                />
              )}
              {(items || []).map((item) => {
                const colSpan = this.getItemColSpan(item);
                const id = this.getSectionItemKey(item);
                const displayTypeClass = (item.displayType || '').toLowerCase();
                const isCard = displayTypeClass === SECTION_ITEMS_DISPLAY_LAYOUTS.card;
                const mainClass = classNames('section-item', {
                  [displayTypeClass]: true,
                  'first-column': isCard && item.startCol === 0,
                  'last-column': isCard && item.endCol === columns,
                  'last-row': isCard && item.index === maxRow
                });
                const applyStyle = {
                  transform:
                    `translate(${item.startCol * columnWidth}px, ${ItemsSection.getHeightOffset(columnUsage, item)}px)`,
                  width: colSpan * columnWidth
                };
                const type = item.fieldType || '';
                let dataDisplay = Array.isArray(item.data) ? <SectionTable data={item.data} /> :
                <SectionMarkdown text={String(item.data)} />;
                if (type === SECTION_ITEM_TYPE.html) {
                  dataDisplay = <SectionHTML text={item.data} />;
                } else if (type === SECTION_ITEM_TYPE.tagsSelect) {
                  dataDisplay = <SectionTags tags={item.data} />;
                }

                return (
                  <div
                    ref={(itemElement) => {
                      if (!itemElement) {
                        return;
                      }
                      this.itemElements[id] = itemElement;
                    }}
                    key={id}
                    id={id}
                    className={mainClass}
                    style={applyStyle}
                  >
                    <div className="section-item-header" style={item.headerStyle}>
                      {item.fieldName}
                    </div>
                    <div className="section-item-value">
                      {dataDisplay}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }}
      </AutoSizer>
    );
  }
}

export default ItemsSection;
