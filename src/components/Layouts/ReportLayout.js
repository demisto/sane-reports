import './ReportLayout.less';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AutoSizer } from 'react-virtualized';
import {
  SECTION_TYPES,
  REPORT_HEADER_IMAGE_LEFT_TOKEN,
  REPORT_HEADER_IMAGE_RIGHT_TOKEN,
  GRID_LAYOUT_COLUMNS,
  PAGE_BREAK_KEY
} from '../../constants/Constants';
import { groupBy, compact, get, isString } from 'lodash';
import ReactGridLayout from 'react-grid-layout';
import { compareFields } from '../../utils/sort';
import ErrorBoundary from '../ErrorBoundary';
import { getSectionComponent } from '../../utils/layout';

const ROW_PIXEL_HEIGHT = 110;
const SECTION_HEIGHT_TOTAL_PADDING = 20;

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
    if (section.type === SECTION_TYPES.table && section.layout.w >= GRID_LAYOUT_COLUMNS) {
      const numOfRows = (section.data.length || section.data.total) + 1;
      if (numOfRows > section.layout.h) {
        height = numOfRows;
      }
    }
    return { w: section.layout.w, h: height, y: rows, x: section.layout.columnPos || 0, i: section.layout.i };
  }

  static getElementBySection(section, maxWidth) {
    let sectionToRender = getSectionComponent(section, maxWidth);
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
      // set dynamic height for all sections, fix top attribute.
      const itemsByRow = groupBy(Object.values(this.itemElements), item => item.gridItem.y);
      const heightMap = {};
      Object.keys(itemsByRow).sort(compareFields).forEach((key) => {
        const items = itemsByRow[key];
        let shouldPageBreak = false;
        items.forEach((item) => {
          if (item.element) {
            let maxOffset = heightMap[item.gridItem.x];
            for (let i = item.gridItem.x + 1; i < item.gridItem.x + item.gridItem.w; i++) {
              maxOffset = Math.max(maxOffset, heightMap[i] || 0);
            }
            item.element.style.top = `${maxOffset}px`;
            for (let i = item.gridItem.x; i < item.gridItem.x + item.gridItem.w; i++) {
              heightMap[i] = heightMap[i] ? heightMap[i] + SECTION_HEIGHT_TOTAL_PADDING
                + item.element.clientHeight : item.element.clientHeight;
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
    }, 3000);
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
                              const elementToRender = ReportLayout.getElementBySection(section);
                              return elementToRender && (
                                <div
                                  ref={(element) => {
                                    this.itemElements[section.layout.i] = { element, gridItem, section };
                                  }}
                                  key={section.layout.i}
                                  className={`section-layout section-${section.type} ${section.layout.class || ''}`}
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
