import './ReportLayout.less';
import React, { PropTypes } from 'react';
import { SectionHeader, SectionText, SectionDate, SectionChart, SectionTable, SectionImage, SectionDivider }
    from '../Sections';
import { SECTION_TYPES } from '../../constants/Constants';

function sortReportSections(sec1, sec2) {
  const sec1RowPos = sec1.layout.rowPos;
  const sec2RowPos = sec2.layout.rowPos;
  const sec1ColumnPos = sec1.layout.columnPos;
  const sec2ColumnPos = sec2.layout.columnPos;

  let result;
  if (sec1RowPos === sec2RowPos) {
    result = (sec1ColumnPos < sec2ColumnPos) ? -1 : (sec1ColumnPos > sec2ColumnPos) ? 1 : 0; // eslint-disable-line
  } else {
    result = (sec1RowPos < sec2RowPos) ? -1 : 1;
  }

  return result;
}

function prepareSections(data) {
  data.sort(sortReportSections);

  const rows = {};

  if (data) {
    data.forEach((section) => {
      if (rows[section.layout.rowPos]) {
        rows[section.layout.rowPos].push(section);
      } else {
        rows[section.layout.rowPos] = [section];
      }
    });
  }

  return rows;
}

const ReportLayout = ({ data }) => {
  const sections = prepareSections(data);

  return (
    <div className="report-layout">
      {
        Object
          .keys(sections)
          .map((rowPos) =>
            <div className="report-row" key={rowPos}>
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
                                />
                              );
                              break;
                            case SECTION_TYPES.table:
                              sectionToRender = (
                                <SectionTable
                                  data={section.data}
                                  columns={section.layout.tableColumns}
                                  classes={section.layout.classes}
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
  data: PropTypes.array
};

export default ReportLayout;
