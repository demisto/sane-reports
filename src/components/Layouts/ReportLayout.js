import './ReportLayout.less';
import React, { PropTypes } from 'react';
import { SectionHeader, SectionText, SectionDate, SectionChart, SectionTable, SectionImage, SectionDivider,
  SectionMarkdown, SectionJson, SectionNumber, SectionList }
    from '../Sections';
import {
  SECTION_TYPES,
  REPORT_HEADER_IMAGE_LEFT_TOKEN,
  REPORT_HEADER_IMAGE_RIGHT_TOKEN
} from '../../constants/Constants';
import { isNumber } from 'lodash';
import ReactGridLayout, { WidthProvider } from 'react-grid-layout';
const DecoratedReactGridLayout = WidthProvider(ReactGridLayout);
const ROW_PIXEL_HEIGHT = 110;
let overflowRows = 0;

function getGridItemFromSection(section) {
  const rows = section.layout.rowPos + overflowRows;
  let height = section.layout.h;
  if (section.type === SECTION_TYPES.table && section.layout.w === 12) {
    const numOfRows = Math.ceil(((section.data || []).length * 30 + 40) / ROW_PIXEL_HEIGHT);
    if (numOfRows > section.layout.h) {
      height = numOfRows - 1;
      overflowRows += height - section.layout.h;
    }
  }

  return { w: section.layout.w, h: height, y: rows, x: section.layout.columnPos || 0, i: section.layout.i };
}

function getElementBySection(section) {
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
    case SECTION_TYPES.number: {
      let numberData;
      if (isNumber(section.data)) {
        numberData = { currSum: section.data };
      } else {
        numberData = section.data;
      }
      sectionToRender = (
        <SectionNumber
          layout={section.layout.layout}
          title={section.title}
          data={numberData}
          currencySign={section.layout.currencySign}
          text={section.data}
          style={section.layout.style}
        />
      );
      break;
    }
    case SECTION_TYPES.list:
      sectionToRender = (
        <SectionList
          data={section.data}
          columns={section.layout.tableColumns}
          classes={section.layout.classes}
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
          title={section.title}
          referenceLineX={section.layout.referenceLineX}
          referenceLineY={section.layout.referenceLineY}
          stacked={section.query && section.query.groupBy && section.query.groupBy.length > 1}
          fromDate={section.fromDate}
          toDate={section.toDate}
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
}

const ReportLayout = ({ sections, headerLeftImage, headerRightImage, isLayout }) => {
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
            .map((rowPos) =>
              <div
                className={sections[rowPos][0].class ? 'report-row ' + sections[rowPos][0].class : 'report-row'}
                key={rowPos}
                style={sections[rowPos].style}
              >
                {
                  sections[rowPos]
                    .map((section) =>
                      <div
                        key={`${section.layout.rowPos}${section.layout.columnPos}`}
                        className={section.layout.class ? 'report-section ' + section.layout.class : 'report-section'}
                        style={section.layout.sectionStyle}
                      >
                        {
                          (() => {
                            return getElementBySection(section);
                          })()
                        }
                      </div>
                    )
                }
              </div>
          )
          :
          <DecoratedReactGridLayout isResizable={false} isDraggable={false} rowHeight={ROW_PIXEL_HEIGHT}>
            {
              Object
                .keys(sections)
                .map((rowPos) =>
                  sections[rowPos]
                    .map((section) =>
                      <div
                        key={section.layout.i}
                        className={section.layout.class ? 'report-section ' + section.layout.class : 'report-section'}
                        style={section.layout.sectionStyle}
                        data-grid={getGridItemFromSection(section)}
                      >
                        {getElementBySection(section)}
                      </div>
                    )
                )
            }
          </DecoratedReactGridLayout>

      }
    </div>
  );
};
ReportLayout.propTypes = {
  sections: PropTypes.object,
  headerLeftImage: PropTypes.string,
  headerRightImage: PropTypes.string,
  isLayout: PropTypes.bool
};

export default ReportLayout;
