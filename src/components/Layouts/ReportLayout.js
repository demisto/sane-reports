import './ReportLayout.less';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AutoSizer } from 'react-virtualized';
import {
  SECTION_TYPES,
  REPORT_HEADER_IMAGE_LEFT_TOKEN,
  REPORT_HEADER_IMAGE_RIGHT_TOKEN,
  GRID_LAYOUT_COLUMNS,
  PAGE_BREAK_KEY, CHART_TYPES
} from '../../constants/Constants';
import { groupBy, compact, get, isString, isEmpty } from 'lodash';
import ReactGridLayout from 'react-grid-layout';
import { compareFields } from '../../utils/sort';
import ErrorBoundary from '../ErrorBoundary';

import { getSectionComponent } from '../../utils/layout';
import classNames from 'classnames';

const ROW_PIXEL_HEIGHT = 110;
const SECTION_HEIGHT_TOTAL_PADDING = 10;

class ReportLayout extends Component {
  static propTypes = {
    sections: PropTypes.object,
    headerLeftImage: PropTypes.string,
    headerRightImage: PropTypes.string,
    isLayout: PropTypes.bool,
    dimensions: PropTypes.object
  };

  static isPageBreakSection(section) {
    return !!get(section, 'layout.style.pageBreakBefore', false) || (section.type === SECTION_TYPES.markdown &&
      section.data && ((isString(section.data) ? section.data : section.data.text) || '').includes(PAGE_BREAK_KEY));
  }

  static getGridItemFromSection(section, overflowRows) {
    const rows = section.layout.rowPos + overflowRows;
    let height = section.layout.h;
    const reflectDimensions = section.layout.reflectDimensions === true;

    if (section.type === SECTION_TYPES.table &&
        section.layout.w >= GRID_LAYOUT_COLUMNS &&
        section.data && !reflectDimensions) {
      const numOfRows = (section.data.length || section.data.total) + 1;
      if (numOfRows > section.layout.h) {
        height = numOfRows;
      }
    }
    return { w: section.layout.w, h: height, y: rows, x: section.layout.columnPos || 0, i: section.layout.i };
  }

  static getElementBySection(section, maxWidth) {
    let sectionToRender = getSectionComponent(section, maxWidth);
    if (!sectionToRender) {
      return null;
    }
    if (ReportLayout.isPageBreakSection(section)) {
      sectionToRender = (
        <div>
          <div style={{ pageBreakAfter: 'always' }}>&nbsp;</div>
          {sectionToRender}
        </div>
      );
    }
    return <ErrorBoundary>{sectionToRender}</ErrorBoundary>;
  }

  constructor(props) {
    super(props);
    this.itemElements = {};
  }

  componentDidMount() {
    const { dimensions } = this.props;
    setTimeout(() => {
      this.adjustItemsInRow();

      // set dynamic height for all sections, fix top attribute.
      const itemsByRow = groupBy(Object.values(this.itemElements), item => item.gridItem.y);
      const heightMap = {};
      const rows = Object.keys(itemsByRow);
      Object.keys(itemsByRow).sort(compareFields).forEach((key, index) => {
        const items = itemsByRow[rows[index]];
        const nextRowHeight = this.getMaxHeight(itemsByRow[rows[index + 1]]);
        let shouldPageBreak = false;
        items.forEach((item) => {
          if (item.element) {
            let maxOffset = heightMap[item.gridItem.x];
            for (let i = item.gridItem.x + 1; i < item.gridItem.x + item.gridItem.w; i++) {
              maxOffset = Math.max(maxOffset, heightMap[i] || 0) || 0;
            }
            if ([SECTION_TYPES.image, SECTION_TYPES.logo, SECTION_TYPES.date].indexOf(item.section.type) < 0) {
              maxOffset = maxOffset % dimensions.height > 0 ?
                maxOffset + SECTION_HEIGHT_TOTAL_PADDING :
                maxOffset;
            }
            item.element.style.top = `${maxOffset}px`;
            const autoPageBreak = item.section.autoPageBreak !== false;
            const itemHeight = this.getItemHeight(item);
            item.element.style.height = `${itemHeight}px`;
            for (let i = item.gridItem.x; i < item.gridItem.x + item.gridItem.w; i++) {
              heightMap[i] = maxOffset + itemHeight;

              if (dimensions && !shouldPageBreak && autoPageBreak) {
                const pageOffset = dimensions.height - (heightMap[i] % dimensions.height);
                if (nextRowHeight > pageOffset || itemHeight > dimensions.height) {
                  shouldPageBreak = true;
                }
              }
            }
            shouldPageBreak = shouldPageBreak || ReportLayout.isPageBreakSection(item.section);
          }
        });

        // if page dimensions are set and should page break, calculate remaining height.
        if (dimensions && dimensions.height > 0 && shouldPageBreak) {
          for (let i = 0; i < GRID_LAYOUT_COLUMNS; i++) {
            const accumulatedHeight = heightMap[i] || 0;
            const pageOffset = dimensions.height - (accumulatedHeight % dimensions.height);
            heightMap[i] = accumulatedHeight + pageOffset;
          }
        }
      });
      // mark the html as ready
      const readyDiv = document.createElement('div');
      readyDiv.id = 'ready-doc';
      document.getElementsByTagName('body')[0].appendChild(readyDiv);
    }, 5000);
  }

  getMaxHeight = (items) => {
    let clientHeight = 0;
    const getItemHeight = this.getItemHeight;
    (items || []).forEach((item) => {
      if (item.element) {
        clientHeight = Math.max(clientHeight, getItemHeight(item));
      }
    });

    return clientHeight + SECTION_HEIGHT_TOTAL_PADDING;
  };

  getItemHeight = (item) => {
    if (!item.element) {
      return 0;
    }
    if (item.element.scrollHeight) {
      return item.element.scrollHeight;
    } else if (item.element.clientHeight) {
      return item.element.clientHeight;
    } else if (item.element.style && item.element.style.height) {
      return parseInt(item.element.style.height.replace('px', ''), 10);
    }

    return 0;
  };

  adjustItemsInRow = () => {
    let runAgain;
    do {
      runAgain = false;
      const itemsByRow = groupBy(Object.values(this.itemElements), item => item.gridItem.y);

      const sortedRowsKeys = Object.keys(itemsByRow)
        .sort(compareFields);

      // eslint-disable-next-line no-loop-func
      sortedRowsKeys.forEach((rowKey) => {
        const items = itemsByRow[rowKey];
        let totalW = 0;
        items.forEach((item) => {
          totalW += item.gridItem.w;
          if (totalW > GRID_LAYOUT_COLUMNS) {
            item.gridItem.y++;
            runAgain = true;
          }
        });
      });
    }
    while (runAgain);
  };

  shouldDisableAutoHeight = (section) => {
    return [CHART_TYPES.line, CHART_TYPES.bar, CHART_TYPES.column].includes(section.layout.chartType) ||
        SECTION_TYPES.trend === section.type;
  };

  shouldShowEmptyState = (section) => {
    return section.type !== SECTION_TYPES.date && (isEmpty(section.data) || section.data.length === 0);
  }

  render() {
    const { sections, headerLeftImage, headerRightImage, isLayout, dimensions } = this.props;
    return (
      <div className="report-layout">
        <span className="hidden-header" style={{ display: 'none' }}>
          {headerLeftImage !== REPORT_HEADER_IMAGE_LEFT_TOKEN &&
            <img src={headerLeftImage} style={{ display: 'none' }} alt="hidden" />
          }
          {headerRightImage !== REPORT_HEADER_IMAGE_RIGHT_TOKEN &&
            <img src={headerRightImage} style={{ display: 'none' }} alt="hidden" />
          }
        </span>
        {
          !isLayout ?
            Object
              .keys(sections)
              .map(rowPos =>
                <div
                  className={`report-row ${sections[rowPos][0].type} ${sections[rowPos][0].class || ''}`}
                  key={rowPos}
                  style={sections[rowPos].style}
                >
                  {
                    sections[rowPos]
                      .map(section =>
                        <div
                          key={`${section.layout.rowPos}-${section.layout.columnPos}-${section.data}`}
                          className={section.layout.class ? 'report-section ' + section.layout.class : 'report-section'}
                          style={section.layout.sectionStyle}
                        >
                          {
                            (() => {
                              return ReportLayout.getElementBySection(section, dimensions && dimensions.width);
                            })()
                          }
                        </div>
                      )
                  }
                </div>)
            :
            <AutoSizer disableHeight>
              {({ width }) => {
                let overflowRows = 0;
                return (
                  <ReactGridLayout
                    cols={GRID_LAYOUT_COLUMNS}
                    width={width}
                    isResizable={false}
                    isDraggable={false}
                    useCSSTransforms={false}
                    rowHeight={ROW_PIXEL_HEIGHT}
                  >
                    {
                      Object
                        .keys(sections)
                        .map(rowPos =>
                          compact(sections[rowPos]
                            .map((section) => {
                              const gridItem = ReportLayout.getGridItemFromSection(section, overflowRows);
                              overflowRows += gridItem.h - section.layout.h;
                              const disableAutoHeight = this.shouldDisableAutoHeight(section);
                              const showEmptyState = this.shouldShowEmptyState(section);
                              const mainClass = classNames(`section-layout section-${section.type} ` +
                              `${section.layout.class || ''}`,
                                  { 'section-show-overflow': section.layout.reflectDimensions === true,
                                    'section-show-empty-state': showEmptyState,
                                    'disable-auto-height': disableAutoHeight
                                  });

                              const elementToRender = ReportLayout.getElementBySection(section);
                              return elementToRender && (
                                <div
                                  ref={(element) => {
                                    this.itemElements[section.layout.i] = { element, gridItem, section };
                                  }}
                                  key={section.layout.i}
                                  className={mainClass}
                                  style={section.layout.sectionStyle}
                                  data-grid={gridItem}
                                >
                                  {elementToRender}
                                </div>
                              );
                            })
                        ))
                    }
                  </ReactGridLayout>
                );
              }
              }
            </AutoSizer>
        }
      </div>
    );
  }
}

export default ReportLayout;
