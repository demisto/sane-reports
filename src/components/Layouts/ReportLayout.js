import './ReportLayout.less';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AutoSizer } from 'react-virtualized';
import {
  SECTION_TYPES,
  REPORT_HEADER_IMAGE_LEFT_TOKEN,
  REPORT_HEADER_IMAGE_RIGHT_TOKEN,
  GRID_LAYOUT_COLUMNS
} from '../../constants/Constants';
import { groupBy, compact } from 'lodash';
import ReactGridLayout from 'react-grid-layout';
import { compareFields } from '../../utils/sort';
import ErrorBoundary from '../ErrorBoundary';
import { getSectionComponent } from '../../utils/layout';
const ROW_PIXEL_HEIGHT = 110;

class ReportLayout extends Component {
  static propTypes = {
    sections: PropTypes.object,
    headerLeftImage: PropTypes.string,
    headerRightImage: PropTypes.string,
    isLayout: PropTypes.bool
  };

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

  static getElementBySection(section) {
    let sectionToRender = getSectionComponent(section);
    if (section.layout && section.layout.style && section.layout.style.pageBreakBefore) {
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
    setTimeout(() => {
      // set dynamic height for all sections, fix top attribute.
      const itemsByRow = groupBy(Object.values(this.itemElements), item => item.gridItem.y);
      let accumulatedHeight = 0;
      Object.keys(itemsByRow).sort(compareFields).forEach((key) => {
        const items = itemsByRow[key];
        let maxHeight = 0;
        items.forEach((item) => {
          if (item.element) {
            if (maxHeight < item.element.clientHeight) {
              maxHeight = item.element.clientHeight;
            }
            item.element.style.top = `${accumulatedHeight}px`;
          }
        });
        accumulatedHeight += maxHeight;
      });
    }, 3000);
  }

  render() {
    const { sections, headerLeftImage, headerRightImage, isLayout } = this.props;
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
                              return this.getElementBySection(section);
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
                                    this.itemElements[section.layout.i] = { element, gridItem }
                                  }}
                                  key={section.layout.i}
                                  className={`section-${section.type} ${section.layout.class || ''}`}
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
