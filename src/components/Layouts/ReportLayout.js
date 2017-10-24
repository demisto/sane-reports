import './ReportLayout.less';
import React, { PropTypes } from 'react';
import { SectionHeader, SectionText, SectionDate, SectionChart, SectionTable, SectionImage, SectionDivider,
  SectionMarkdown, SectionJson }
    from '../Sections';
import {
  SECTION_TYPES,
  REPORT_HEADER_IMAGE_LEFT_TOKEN,
  REPORT_HEADER_IMAGE_RIGHT_TOKEN
} from '../../constants/Constants';

const ReportLayout = ({ sections, headerLeftImage, headerRightImage }) => {
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
        Object
          .keys(sections)
          .map((rowPos) =>
            <div className="report-row" key={rowPos} style={sections[rowPos].style}>
              {
                sections[rowPos]
                  .map((section) =>
                    <div
                      key={section.layout.rowPos + section.layout.columnPos}
                      className="report-section"
                      style={section.layout.sectionStyle}
                    >
                      {
                        (() => {
                          let sectionToRender;
                          switch (section.type) {
                            case SECTION_TYPES.header:
                              sectionToRender = (
                                <SectionHeader
                                  header={section.data}
                                  style={section.layout.style}
                                />
                              );
                              break;
                            case SECTION_TYPES.text:
                              sectionToRender = (
                                <SectionText
                                  text={section.data}
                                  style={section.layout.style}
                                />
                              );
                              break;
                            case SECTION_TYPES.markdown:
                              sectionToRender = (
                                <SectionMarkdown
                                  text={section.data}
                                  style={section.layout.style}
                                  tableClasses={section.layout.tableClasses}
                                />
                              );
                              break;
                            case SECTION_TYPES.date:
                              sectionToRender = (
                                <SectionDate
                                  date={section.data}
                                  style={section.layout.style}
                                  format={section.layout.format}
                                />
                              );
                              break;
                            case SECTION_TYPES.image:
                              sectionToRender = (
                                <SectionImage
                                  src={section.data}
                                  style={section.layout.style}
                                  alt={section.layout.alt}
                                  classes={section.layout.classes}
                                />
                              );
                              break;
                            case SECTION_TYPES.chart:
                              sectionToRender = (
                                <SectionChart
                                  data={section.data}
                                  type={section.layout.chartType}
                                  style={section.layout.style}
                                  dimensions={section.layout.dimensions}
                                  chartProperties={section.layout.chartProperties}
                                  legend={section.layout.legend}
                                  legendStyle={section.layout.legendStyle}
                                  sortBy={section.layout.sortBy}
                                  referenceLineX={section.layout.referenceLineX}
                                  referenceLineY={section.layout.referenceLineY}
                                />
                              );
                              break;
                            case SECTION_TYPES.table:
                              sectionToRender = (
                                <SectionTable
                                  data={section.data}
                                  columns={section.layout.tableColumns}
                                  classes={section.layout.classes}
                                  style={section.layout.style}
                                />
                              );
                              break;
                            case SECTION_TYPES.json:
                              sectionToRender = (
                                <SectionJson
                                  data={section.data}
                                  style={section.layout.style}
                                />
                              );
                              break;
                            case SECTION_TYPES.divider:
                              sectionToRender = (
                                <SectionDivider
                                  style={section.layout.style}
                                />
                              );
                              break;
                            default:
                              // Ignored
                          }
                          return sectionToRender;
                        })()
                      }
                    </div>
                  )
              }
            </div>
          )
      }
    </div>
  );
};
ReportLayout.propTypes = {
  sections: PropTypes.object,
  headerLeftImage: PropTypes.string,
  headerRightImage: PropTypes.string
};

export default ReportLayout;
