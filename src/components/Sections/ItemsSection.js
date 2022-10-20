import './ItemsSection.less';
import classNames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SECTION_ITEMS_DISPLAY_LAYOUTS, SECTION_ITEM_TYPE } from '../../constants/Constants';
import { AutoSizer } from 'react-virtualized';
import { SectionDate, SectionHTML, SectionMarkdown, SectionTable, SectionTags } from './index';
import { get, maxBy, every } from 'lodash';
import uuid from 'uuid';
import { sortByFieldsWithPriority } from '../../utils/sort';

const DESCRIPTION_KEY = 'description';
const SECTION_ITEM_PADDING = 5;
const RERENDER_TIMEOUT_MS = 550;

class ItemsSection extends Component {
  static propTypes = {
    style: PropTypes.object,
    columns: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    titleStyle: PropTypes.object,
    hideItemTitleOnlyOne: PropTypes.bool,
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

  static getItemDisplayType(item) {
    return (item.displayType || '').toLowerCase();
  }

  constructor(props) {
    super(props);

    this.itemElements = {};
    this.state = { columnUsage: {}, id: uuid.v1() };
  }

  componentDidMount() {
    setTimeout(() => this.setColumnUsage(this.props), RERENDER_TIMEOUT_MS); // avoid rerender height changes
  }

  componentWillReceiveProps(nextProps) {
    setTimeout(() => this.setColumnUsage(nextProps), RERENDER_TIMEOUT_MS); // avoid rerender height changes
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

  getDisplayDataComponent = (item) => {
    if (Array.isArray(item.data)) {
      if (item.data.length === 0) {
        return null;
      }
      return (<SectionTable data={item.data} />);
    }

    switch (item.fieldType) {
      case SECTION_ITEM_TYPE.html:
        return (<SectionHTML text={item.data} />);

      case SECTION_ITEM_TYPE.tagsSelect:
        return (<SectionTags tags={item.data} />);

      case SECTION_ITEM_TYPE.date:
        return (<SectionDate date={item.data} format={item.format} isPrefixRequired={false} />);

      case SECTION_ITEM_TYPE.markdown:
      default:
        return (
          <SectionMarkdown
            text={String(item.data)}
          />
        );
    }
  }


  render() {
    const { style, items, columns, title, titleStyle, description, hideItemTitleOnlyOne } = this.props;
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
          const lastRow = maxBy(items, item => item.index);
          const lastRowIndex = lastRow ? lastRow.index : null;
          const allItemsAreDisplayedAsCards = every(items,
            item => ItemsSection.getItemDisplayType(item) === SECTION_ITEMS_DISPLAY_LAYOUTS.card
          );

          return (
            <div
              className={classNames('items-section', { 'cards-container': allItemsAreDisplayedAsCards })}
              style={{ width, ...style }}
            >
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
              <div
                className="items-container" style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${columns}, 1fr)`
              }}
              >
                {(items || []).map((item) => {
                  const id = this.getSectionItemKey(item);
                  const itemDisplayType = ItemsSection.getItemDisplayType(item);
                  const mainClass = classNames('section-item', {
                    [itemDisplayType]: true,
                    'first-column': allItemsAreDisplayedAsCards && item.startCol === 0,
                    'last-column': allItemsAreDisplayedAsCards && item.endCol === columns,
                    'last-row': allItemsAreDisplayedAsCards && item.index === lastRowIndex
                  });
                  const applyStyle = {
                    gridColumn: `${item.startCol + 1}/${item.endCol + 1}`
                  };
                  const hideSingleItemTitle = hideItemTitleOnlyOne && (items || []).length <= 1;
                  const dataDisplay = this.getDisplayDataComponent(item);

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
                      {!hideSingleItemTitle && (
                        <div className="section-item-header" style={item.headerStyle}>
                          {item.fieldName}
                        </div>
                      )}
                      <div className="section-item-value">
                        {dataDisplay}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }}
      </AutoSizer>
    );
  }
}

export default ItemsSection;
