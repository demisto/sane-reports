import { PAGE_BREAK_KEY, SECTION_TYPES } from '../constants/Constants';
import {
  ItemsSection,
  SectionChart,
  SectionDate,
  SectionGroupedList,
  SectionDivider,
  SectionDuration,
  SectionHeader,
  SectionImage,
  SectionJson,
  SectionList,
  SectionMarkdown,
  SectionNumber,
  SectionTable,
  SectionText,
  SectionHTML
} from '../components/Sections';
import { isNumber, isObjectLike, compact, isString, groupBy, get, isEmpty } from 'lodash';
import React from 'react';
import { processData } from './data';
import WidgetEmptyState from '../components/Sections/WidgetEmptyState';

function getDefaultEmptyNotification() {
  return 'No results found.';
}


function isPageBreakSection(section) {
  return !!get(section, 'layout.style.pageBreakBefore', false) || (section.type === SECTION_TYPES.markdown &&
      section.data && ((isString(section.data) ? section.data : section.data.text) || '').includes(PAGE_BREAK_KEY));
}

export function getSectionComponent(section, maxWidth) {
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
          text={isObjectLike(section.data) ? section.data.text : section.data}
          style={section.layout.style}
        />
      );
      break;
    case SECTION_TYPES.html:
      sectionToRender = (
        <SectionHTML
          text={isObjectLike(section.data) ? section.data.text : section.data}
          style={section.layout.style}
        />
      );
      break;
    case SECTION_TYPES.trend:
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
          titleStyle={section.layout.titleStyle}
          numberStyle={section.layout.numberStyle}
          data={numberData}
          sign={section.layout.currencySign || section.layout.sign}
          signAlignment={section.layout.signAlignment}
          text={section.data}
          style={section.layout.style}
          valuesFormat={section.layout.valuesFormat}
          subTitle={section.layout.forceRangeMessage}
        />
      );
      break;
    }
    case SECTION_TYPES.duration:
      sectionToRender = (
        <SectionDuration
          data={section.data}
          chartProperties={section.layout.chartProperties}
          style={section.layout.style}
          titleStyle={section.titleStyle}
          title={section.title}
          forceRangeMessage={section.layout.forceRangeMessage}
        />
      );
      break;
    case SECTION_TYPES.list:
      if (Array.isArray(section.data) || isString(section.data)) {
        sectionToRender = (
          <SectionList
            data={section.data}
            columns={section.layout.tableColumns}
            classes={section.layout.classes}
            style={section.layout.style}
            titleStyle={section.titleStyle}
            title={section.title}
            emptyString={section.emptyNotification || getDefaultEmptyNotification()}
            forceRangeMessage={section.layout.forceRangeMessage}
          />
        );
      } else {
        sectionToRender = (
          <SectionGroupedList
            data={section.data}
            columns={section.layout.tableColumns}
            classes={section.layout.classes}
            style={section.layout.style}
            titleStyle={section.titleStyle}
            title={section.title}
            emptyString={section.emptyNotification || getDefaultEmptyNotification()}
            forceRangeMessage={section.layout.forceRangeMessage}
          />
        );
      }
      break;
    case SECTION_TYPES.markdown:
    case SECTION_TYPES.placeholder:
      sectionToRender = (
        <SectionMarkdown
          text={isObjectLike(section.data) ? section.data.text : section.data}
          style={section.layout.style}
          tableClasses={section.layout.tableClasses}
          doNotShowEmoji={section.layout.doNotShowEmoji}
          customClass={isPageBreakSection(section) ? 'page-break-section' : ''}
          forceRangeMessage={section.layout.forceRangeMessage}
          markdownArtifactsServerAddress={section.markdownArtifactsServerAddress}
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
    case SECTION_TYPES.logo:
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
    case SECTION_TYPES.chart: {
      const dataType = get(section, 'query.type', null);
      const groupByField = get(section, 'query.groupBy', null);
      const chartGroupField = groupByField && groupByField.length > 0 ? groupByField[groupByField.length - 1] : null;
      const processedData = processData(dataType, section.data, groupByField);
      const processedLegendData = processData(dataType, section.layout.legend, groupByField);
      sectionToRender = (
        <SectionChart
          data={processedData}
          type={section.layout.chartType}
          style={section.layout.style}
          titleStyle={section.titleStyle}
          dimensions={section.layout.dimensions}
          chartProperties={section.layout.chartProperties}
          legend={processedLegendData}
          legendStyle={section.layout.legendStyle}
          sortBy={section.layout.sortBy}
          title={section.title}
          referenceLineX={section.layout.referenceLineX}
          referenceLineY={section.layout.referenceLineY}
          stacked={get(section, 'query.groupBy.length', 0) > 1 ||
          (Array.isArray(section.data) && section.data.some(group => get(group, 'groups.length') > 0))}
          fromDate={section.fromDate}
          toDate={section.toDate}
          reflectDimensions={section.layout.reflectDimensions}
          emptyString={section.emptyNotification || getDefaultEmptyNotification()}
          groupBy={chartGroupField}
          forceRangeMessage={section.layout.forceRangeMessage}
        />
      );
      break;
    }
    case SECTION_TYPES.table:
      sectionToRender = (
        <SectionTable
          data={section.data}
          columns={section.layout.tableColumns}
          readableHeaders={section.layout.readableHeaders}
          classes={section.layout.classes}
          style={section.layout.style}
          titleStyle={section.titleStyle}
          title={section.title}
          maxColumns={section.layout.maxColumns || (maxWidth ? maxWidth / 100 : 0)}
          emptyString={section.emptyNotification || getDefaultEmptyNotification()}
          forceRangeMessage={section.layout.forceRangeMessage}
          headerStyle={section.layout.headerStyle}
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
    case SECTION_TYPES.itemsSection:
      sectionToRender = (
        <ItemsSection
          style={section.layout.style}
          items={section.data}
          classes={section.layout.classes}
          titleStyle={section.titleStyle}
          title={section.title}
          description={section.description}
          columns={(section.layout.w / 4) * 2}
        />
      );
      break;
    case SECTION_TYPES.globalSection:
      sectionToRender = (
        <div className="global-section">
          {section.title && <div className="section-title" style={section.titleStyle}>{section.title}</div>}
          {section.description && <div className="section-description">{section.description}</div>}
          <>
            {compact(Object.entries(groupBy(section.data || [], s => s.layout.rowPos)).map(([rowNum, subSections]) => {
              return (
                <div className="global-section-row" key={`${section.i}-${rowNum}`}>
                  {(subSections || []).map((subSection, i) => {
                    return (
                      <div key={`${section.i}-${rowNum}-subsection-${i}`} className="subsection-wrapper">
                        {getSectionComponent(subSection)}
                      </div>
                    );
                  })}
                </div>
              );
            }))}
            { isEmpty(section.data) &&
              <WidgetEmptyState emptyString={section.emptyNotification || getDefaultEmptyNotification()} />
            }
          </>
        </div>
      );
      break;
    default:
      return null;
  }
  return sectionToRender;
}
