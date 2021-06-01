/* eslint-disable no-unused-expressions */
import { constants, expect, mount, React, TemplateProvider } from '../helpers/test_helper';
import { prepareSections } from '../../src/utils/reports';
import ReportContainer from '../../src/containers/ReportContainer';
import ChartLegend from '../../src/components/Sections/SectionChart/ChartLegend';
import ReportLayout from '../../src/components/Layouts/ReportLayout';
import {
  ItemsSection,
  SectionChart,
  SectionDate,
  SectionDivider,
  SectionDuration,
  SectionGroupedList,
  SectionHeader,
  SectionHTML,
  SectionImage,
  SectionJson,
  SectionList,
  SectionMarkdown,
  SectionNumber,
  SectionTable,
  SectionText
} from '../../src/components/Sections';
import { Bar, BarChart, Line, LineChart, Pie, PieChart } from 'recharts';
import { DEFAULT_NONE_COLOR } from '../../src/utils/colors';
import { cloneDeep, unionBy } from 'lodash';
import SectionBarChart from '../../src/components/Sections/SectionChart/SectionBarChart';
import { formatNumberValue } from '../../src/utils/strings';

function expectChartLegendFromChartElement(chart, dataArr, showValue) {
  const chartLegend = chart.find(ChartLegend);
  expect(chartLegend).to.have.length(1);
  const chartLegendTexts = chartLegend.at(0).find('.recharts-legend-item-text');
  const chartLegendValues = chartLegend.at(0).find('.recharts-legend-item-value');
  expect(chartLegendTexts).to.have.length(dataArr.length);
  if (showValue) {
    expect(chartLegendValues).to.have.length(dataArr.length);
  } else {
    expect(chartLegendValues).to.have.length(0);
  }
  dataArr.forEach((data, i) => {
    expect(chartLegendTexts.at(i).text()).to.equal(data.name || constants.NONE_VALUE_DEFAULT_NAME);
    if (showValue) {
      expect(chartLegendValues.at(i).text()).to.equal(`${data.value}`);
    }
  });
  return chartLegend;
}

describe('Report Container', () => {
  it('Generate test template report', () => {
    const testTemplate = TemplateProvider.getTestTemplate();
    const toRender = <ReportContainer sections={prepareSections(testTemplate)} />;
    const reportContainer = mount(toRender);

    const hiddenHeader = reportContainer.find('.hidden-header');
    expect(hiddenHeader).to.have.length(1);
    expect(hiddenHeader.get(0).props.style).to.deep.equal({ display: 'none' });

    const reportLayouts = reportContainer.find(ReportLayout);
    const rows = reportContainer.find('.report-row');
    const sections = reportContainer.find('.report-section');
    expect(reportLayouts).to.have.length(1);
    expect(rows).to.have.length(24);
    expect(sections).to.have.length(25);

    const sec1 = testTemplate[0];
    const sec2 = testTemplate[1];
    const sec3 = testTemplate[2];
    const sec4 = testTemplate[3];
    const sec5 = testTemplate[4];
    const sec6 = testTemplate[5];
    const sec7 = testTemplate[6];
    const sec8 = testTemplate[7];
    const sec9 = testTemplate[8];
    const sec10 = testTemplate[9];
    const sec11 = testTemplate[10];
    const sec12 = testTemplate[11];
    const sec13 = testTemplate[12];
    const sec14 = testTemplate[13];
    const sec15 = testTemplate[14];
    const sec16 = testTemplate[15];
    const sec17 = testTemplate[16];
    const sec18 = testTemplate[17];
    const sec19 = testTemplate[18];
    const sec20 = testTemplate[19];
    const sec21 = testTemplate[20];
    const sec22 = testTemplate[21];
    const sec23 = testTemplate[22];
    const sec24 = testTemplate[23];
    const sec25 = testTemplate[24];

    expect(rows.at(0).text()).to.contains(sec1.data);
    expect(rows.at(1).text()).to.contains(sec2.data + sec3.data);

    // Headers
    const sectionHeader = reportContainer.find(SectionHeader);
    expect(sectionHeader).to.have.length(5);
    expect(sectionHeader.at(0).props().header).to.equal(sec1.data);
    expect(sectionHeader.at(0).props().style).to.equal(sec1.layout.style);

    expect(sectionHeader.at(1).props().header).to.equal(sec4.data);
    expect(sectionHeader.at(1).props().style).to.equal(sec4.layout.style);

    expect(sectionHeader.at(2).props().header).to.equal(sec6.data);
    expect(sectionHeader.at(2).props().style).to.equal(sec6.layout.style);

    expect(sectionHeader.at(3).props().header).to.equal(sec8.data);
    expect(sectionHeader.at(3).props().style).to.equal(sec8.layout.style);

    expect(sectionHeader.at(4).props().header).to.equal(sec11.data);
    expect(sectionHeader.at(4).props().style).to.equal(sec11.layout.style);

    // Text
    const sectionText = reportContainer.find(SectionText);
    expect(sectionText).to.have.length(5);
    expect(sectionText.at(0).props().text).to.equal(sec2.data);
    expect(sectionText.at(0).props().style).to.equal(sec2.layout.style);

    expect(sectionText.at(1).props().text).to.equal(sec3.data);
    expect(sectionText.at(1).props().style).to.equal(sec3.layout.style);

    expect(sectionText.at(2).props().text).to.equal(sec12.data);
    expect(sectionText.at(2).props().style).to.equal(sec12.layout.style);

    expect(sectionText.at(3).props().text).to.equal(sec14.data);
    expect(sectionText.at(3).props().style).to.equal(sec14.layout.style);

    expect(sectionText.at(4).props().text).to.equal(sec16.data);
    expect(sectionText.at(4).props().style).to.equal(sec16.layout.style);

    // Charts
    const sectionChart = reportContainer.find(SectionChart);
    expect(sectionChart).to.have.length(2);
    expect(sectionChart.at(0).props().data).to.equal(sec5.data);
    expect(sectionChart.at(0).props().style).to.equal(sec5.layout.style);
    expect(sectionChart.at(0).props().type).to.equal(sec5.layout.chartType);
    expect(sectionChart.at(0).props().dimensions).to.equal(sec5.layout.dimensions);

    expect(sectionChart.at(1).props().data).to.equal(sec7.data);
    expect(sectionChart.at(1).props().style).to.equal(sec7.layout.style);
    expect(sectionChart.at(1).props().type).to.equal(sec7.layout.chartType);
    expect(sectionChart.at(1).props().dimensions).to.equal(sec7.layout.dimensions);

    const sectionBarChart = reportContainer.find(SectionBarChart);
    const barChart = reportContainer.find(BarChart);
    const pieChart = reportContainer.find(PieChart);
    const pie = reportContainer.find(Pie);

    expect(barChart).to.have.length(1);
    expect(pieChart).to.have.length(1);
    expect(pie).to.have.length(1);

    expect(barChart.props().width).to.equal(sec5.layout.dimensions.width);
    expect(barChart.props().height).to.equal(sec5.layout.dimensions.height);
    expect(sectionBarChart.props().data).to.deep.equal(sec5.data);

    expect(pieChart.props().width).to.equal(sec7.layout.dimensions.width);
    expect(pieChart.props().height).to.equal(sec7.layout.dimensions.height);
    expect(pie.props().data).to.have.length(5);

    const percetages = pieChart.find('.recharts-legend-item-percentage');
    expect(percetages).to.have.length(5);
    expect(percetages.at(0).text()).to.equal('20%');
    expect(percetages.at(1).text()).to.equal('20%');
    expect(percetages.at(2).text()).to.equal('20%');
    expect(percetages.at(3).text()).to.equal('20%');
    expect(percetages.at(4).text()).to.equal('20%');

    // Tables
    const sectionTable = reportContainer.find(SectionTable);
    expect(sectionTable).to.have.length(3);
    expect(sectionTable.at(0).props().columns).to.equal(sec9.layout.tableColumns);
    expect(sectionTable.at(0).props().data).to.equal(sec9.data);
    expect(sectionTable.at(0).props().classes).to.equal(sec9.layout.classes);

    expect(sectionTable.at(1).props().columns).to.equal(sec10.layout.tableColumns);
    expect(sectionTable.at(1).props().data).to.equal(sec10.data);
    expect(sectionTable.at(1).props().classes).to.equal(sec10.layout.classes);

    expect(sectionTable.at(2).props().columns).to.equal(sec21.layout.tableColumns);
    expect(sectionTable.at(2).props().data).to.equal(sec21.data);
    expect(sectionTable.at(2).props().classes).to.equal(sec21.layout.classes);

    const tableEl = reportContainer.find('table');
    const tableHeader = reportContainer.find('th');
    expect(tableEl).to.have.length(4);
    expect(tableHeader).to.have.length(13);
    expect(tableHeader.at(0).text()).to.equal(sec9.layout.tableColumns[0]);
    expect(tableHeader.at(1).text()).to.equal(sec9.layout.tableColumns[1]);
    expect(tableHeader.at(2).text()).to.equal(sec9.layout.tableColumns[2]);
    expect(tableHeader.at(3).text()).to.equal(sec9.layout.tableColumns[3]);

    expect(tableHeader.at(4).text()).to.equal(sec10.layout.tableColumns[0]);
    expect(tableHeader.at(5).text()).to.equal(sec10.layout.tableColumns[1]);
    expect(tableHeader.at(6).text()).to.equal(sec10.layout.tableColumns[2]);
    expect(tableHeader.at(7).text()).to.equal(sec10.layout.tableColumns[3]);

    expect(tableHeader.at(8).text()).to.equal(sec21.layout.tableColumns[0]);
    expect(tableHeader.at(9).text()).to.equal(sec21.layout.tableColumns[1]);
    expect(tableHeader.at(10).text()).to.equal(sec21.layout.tableColumns[2]);

    expect(tableHeader.at(11).text()).to.equal('Field');
    expect(tableHeader.at(12).text()).to.equal('Data');

    // Images
    const sectionImage = reportContainer.find(SectionImage);
    expect(sectionImage).to.have.length(3);
    expect(sectionImage.at(0).props().src).to.equal(sec13.data);
    expect(sectionImage.at(0).props().alt).to.equal(sec13.layout.alt);
    expect(sectionImage.at(0).props().classes).to.equal(sec13.layout.classes);

    expect(sectionImage.at(1).props().src).to.equal(sec15.data);
    expect(sectionImage.at(1).props().alt).to.equal(sec15.layout.alt);
    expect(sectionImage.at(1).props().classes).to.equal(sec15.layout.classes);

    expect(sectionImage.at(2).props().src).to.equal(sec17.data);
    expect(sectionImage.at(2).props().alt).to.equal(sec17.layout.alt);
    expect(sectionImage.at(2).props().classes).to.equal(sec17.layout.classes);

    const imgEl = reportContainer.find('img');
    const mediumCircularImage = reportContainer.find('.ui.image.medium.circular');
    const smallImage = reportContainer.find('.ui.image.small');
    expect(imgEl).to.have.length(7);
    expect(mediumCircularImage).to.have.length(1);
    expect(smallImage).to.have.length(1);

    expect(imgEl.get(0).props.style).to.deep.equal({ display: 'none' });
    expect(imgEl.get(1).props.style).to.deep.equal({ display: 'none' });
    expect(imgEl.get(2).props.style).to.not.equal({ display: 'none' });
    expect(imgEl.get(3).props.style).to.not.equal({ display: 'none' });
    expect(imgEl.get(4).props.style).to.not.equal({ display: 'none' });

    // Dates
    const sectionDate = reportContainer.find(SectionDate);
    expect(sectionDate).to.have.length(2);
    expect(sectionDate.at(0).props().date).to.equal(sec18.data);
    expect(sectionDate.at(0).props().style).to.equal(sec18.layout.style);
    expect(sectionDate.at(0).props().format).to.equal(sec18.layout.format);
    expect(sectionDate.at(1).props().date).to.equal(sec19.data);
    expect(sectionDate.at(1).props().style).to.equal(sec19.layout.style);
    expect(sectionDate.at(1).props().format).to.equal(sec19.layout.format);

    const dateEl = reportContainer.find('.section-date');
    expect(dateEl).to.have.length(2);
    expect(dateEl.at(0).text()).to.have.length.above(sec18.layout.format.length + 2);
    expect(dateEl.at(1).text()).to.equal('Jan 1st 16');

    // Divider
    const sectionDivider = reportContainer.find(SectionDivider);
    expect(sectionDivider).to.have.length(1);
    expect(sectionDivider.at(0).props().style).to.equal(sec20.layout.style);

    const dividerEl = reportContainer.find('.section-divider');
    expect(dividerEl).to.have.length(1);

    // Markdown
    const sectionMarkdown = reportContainer.find(SectionMarkdown);
    expect(sectionMarkdown).to.have.length(1);
    expect(sectionMarkdown.at(0).props().text).to.equal(sec22.data);
    expect(sectionMarkdown.at(0).text()).to.not.contain(constants.PAGE_BREAK_KEY);
    expect(sectionMarkdown.at(0).props().style).to.equal(sec22.layout.style);

    // JSON
    const sectionJSON = reportContainer.find(SectionJson);
    expect(sectionJSON).to.have.length(1);
    expect(sectionJSON.at(0).props().data).to.equal(sec23.data);
    expect(sectionJSON.at(0).props().style).to.equal(sec23.layout.style);
    const jsonInspectorKey = reportContainer.find('.json-inspector__key');
    const jsonInspectorValue = reportContainer.find('.json-inspector__value_string');
    expect(jsonInspectorKey).to.have.length(3);
    const jsonInspectLeaf = reportContainer.find('.json-inspector__leafKey');
    expect(jsonInspectLeaf).to.have.length(1);
    expect(jsonInspectorValue).to.have.length(1);
    expect(jsonInspectorKey.at(0).text()).to.equal('root:');
    expect(jsonInspectorKey.at(1).text()).to.equal('hello:');
    expect(jsonInspectorKey.at(2).text()).to.equal('how:');
    expect(jsonInspectLeaf.at(0).text()).to.equal('are:');
    expect(jsonInspectorValue.at(0).text()).to.equal('you?');

    // HTML
    const sectionHTML = reportContainer.find(SectionHTML);
    expect(sectionHTML).to.have.length(1);
    expect(sectionHTML.at(0).props().text).to.equal(sec24.data);
    const htmlClass = reportContainer.find('.section-html');
    expect(htmlClass).to.have.length(1);
    expect(htmlClass.at(0).text()).to.equal('THIS IS HTML');

    // Grouped list
    const sectionList = reportContainer.find(SectionGroupedList);
    expect(sectionList).to.have.length(1);
    const listTitle = sectionList.at(0).find('.section-title');
    expect(listTitle.at(0).text()).to.equal(sec25.title);
    expect(sectionList.at(0).props().data).to.equal(sec25.data);
    const listKeys = Object.keys(sec25.data);
    const listItems = sectionList.find(SectionList);
    expect(listItems).to.have.length(listKeys.length);
    const groupNames = sectionList.find('.group-item-name');
    expect(groupNames.at(0).text()).to.equal(listKeys[0]);
    expect(groupNames.at(1).text()).to.equal(listKeys[1]);
    expect(listItems.at(0).props().data).to.equal(sec25.data[listKeys[0]]);
    expect(listItems.at(1).props().data).to.equal(sec25.data[listKeys[1]]);
  });

  it('Generate test template layout report', async () => {
    const testTemplate = TemplateProvider.getTestLayoutTemplate();
    const toRender = <ReportContainer sections={prepareSections(testTemplate)} />;
    const reportContainer = mount(toRender);

    const hiddenHeader = reportContainer.find('.hidden-header');
    expect(hiddenHeader).to.have.length(1);
    expect(hiddenHeader.get(0).props.style).to.deep.equal({ display: 'none' });

    const reportLayouts = reportContainer.find(ReportLayout);
    expect(reportLayouts).to.have.length(1);

    const sec1 = testTemplate[0];
    const sec2 = testTemplate[1];
    const sec3 = testTemplate[2];
    const sec4 = testTemplate[3];
    const sec5 = testTemplate[4];
    const sec6 = testTemplate[5];
    const sec7 = testTemplate[6];
    const sec8 = testTemplate[7];
    const sec9 = testTemplate[8];
    const sec10 = testTemplate[9];
    const sec11 = testTemplate[10];
    const sec12 = testTemplate[11];
    const sec13 = testTemplate[12];
    const sec14 = testTemplate[13];

    // Charts
    const sectionChart = reportContainer.find(SectionChart);
    expect(sectionChart).to.have.length(8);
    expect(sectionChart.at(0).props().data).to.equal(sec1.data);
    expect(sectionChart.at(0).props().style).to.equal(sec1.layout.style);
    expect(sectionChart.at(0).props().type).to.equal(sec1.layout.chartType);
    expect(sectionChart.at(0).props().dimensions).to.equal(sec1.layout.dimensions);

    expect(sectionChart.at(1).props().data).to.equal(sec3.data);
    expect(sectionChart.at(1).props().style).to.equal(sec3.layout.style);
    expect(sectionChart.at(1).props().type).to.equal(sec3.layout.chartType);
    expect(sectionChart.at(1).props().dimensions).to.equal(sec3.layout.dimensions);
    expect(sectionChart.at(0).props().title).to.equal(sec1.title);
    expect(sectionChart.at(1).props().title).to.equal(sec3.title);
    expect(sectionChart.at(2).props().title).to.equal(sec4.title);
    expect(sectionChart.at(3).props().title).to.equal(sec5.title);
    expect(sectionChart.at(4).props().title).to.equal(sec6.title);
    expect(sectionChart.at(5).props().title).to.equal(sec7.title);
    expect(sectionChart.at(6).props().title).to.equal(sec13.title);
    expect(sectionChart.at(6).props().chartProperties).to.equal(sec13.layout.chartProperties);
    expect(sectionChart.at(6).props().chartProperties.timeFrame).to.equal(constants.SUPPORTED_TIME_FRAMES.none);

    const sectionBarChart = reportContainer.find(SectionBarChart);
    const barChart = reportContainer.find(BarChart);
    const pieChart = reportContainer.find(PieChart);
    const lineChart = reportContainer.find(LineChart);
    const pie = reportContainer.find(Pie);

    expect(barChart).to.have.length(3);
    expect(pieChart).to.have.length(2);
    expect(lineChart).to.have.length(3);
    expect(pie).to.have.length(2);

    expect(pieChart.at(0).props().width).to.equal(sec3.layout.dimensions.width);
    expect(pie.at(0).props().data.length).to.equal(sec3.data.length);

    expect(pie.at(0).props().data[pie.props().data.length - 2].name).to.equal(constants.NONE_VALUE_DEFAULT_NAME);
    expect(pie.at(0).props().data[pie.props().data.length - 2].fill).to.equal(DEFAULT_NONE_COLOR);
    expectChartLegendFromChartElement(pieChart.at(0), sec3.data, true);

    expect(pieChart.at(1).props().width).to.equal(sec3.layout.dimensions.width);
    expect(pie.at(1).props().data.length).to.equal(sec3.data.length);

    expect(pie.at(1).props().data[pie.props().data.length - 2].name).to.equal(constants.NONE_VALUE_DEFAULT_NAME);
    expect(pie.at(1).props().data[pie.props().data.length - 2].fill).to.equal(DEFAULT_NONE_COLOR);
    expectChartLegendFromChartElement(pieChart.at(1), sec14.data, false);

    expect(barChart.at(0).props().width).to.equal(sec1.layout.dimensions.width);
    expect(barChart.at(0).props().height).to.equal(sec1.layout.dimensions.height);
    expect(barChart.at(0).props().data).to.deep.equal(sec1.data);

    expectChartLegendFromChartElement(barChart.at(0), [
      { name: 'SubGroup1' },
      { name: 'SubGroup4' },
      { name: 'SubGroup2' },
      { name: 'SubGroup3' }
    ]);

    const bars = barChart.at(0).find(Bar);
    expect(bars).to.have.length(sec1.data.reduce((prev, curr) => unionBy(prev, curr.groups, 'name'), []).length);
    expect(barChart.at(1).props().width).to.equal(sec4.layout.dimensions.width);
    expect(barChart.at(1).props().height).to.equal(sec4.layout.dimensions.height);
    expect(sectionBarChart.at(1).props().data).to.deep.equal(sec4.data);
    let refLine = barChart.at(1).find('.recharts-reference-line-line');
    expect(refLine.props().y).to.be.equal(sec4.layout.referenceLineY.y);
    expect(refLine.props().stroke).to.be.equal(sec4.layout.referenceLineY.stroke);
    let refLineLabel = barChart.at(1).find('.recharts-reference-line .recharts-label');
    expect(refLineLabel).to.have.length(2);
    expect(refLineLabel.at(1).props().children[0].props.children).to.be.equal(sec4.layout.referenceLineY.label);

    expect(barChart.at(2).props().width).to.equal(sec5.layout.dimensions.width);
    expect(barChart.at(2).props().height).to.equal(sec5.layout.dimensions.height);
    expect(barChart.at(2).props().data).to.deep.equal(sec5.data);

    expect(lineChart.at(0).props().width).to.equal(sec6.layout.dimensions.width);
    expect(lineChart.at(0).props().height).to.equal(sec6.layout.dimensions.height);
    let lines = lineChart.at(0).find(Line);
    expect(lines).to.have.length(1);

    expect(lineChart.at(0).find('.xAxis').at(0).text()).to.contain(sec6.layout.chartProperties.axis.x.label);
    expect(lineChart.at(0).find('.yAxis').at(0).text()).to.contain(sec6.layout.chartProperties.axis.y.label);
    expect(lineChart.at(0).props().data[0].name).to.equal('11 Dec 2017');
    expect(lineChart.at(0).props().data.length).to.equal(1268);

    expect(lineChart.at(1).props().width).to.equal(sec7.layout.dimensions.width);
    expect(lineChart.at(1).props().height).to.equal(sec7.layout.dimensions.height);
    expect(lineChart.at(1).props().data.length).to.equal(2);
    refLine = lineChart.at(1).find('.recharts-reference-line-line');
    expect(refLine.props().y).to.be.equal(sec7.layout.referenceLineY.y);
    expect(refLine.props().stroke).to.be.equal(sec7.layout.referenceLineY.stroke);
    refLineLabel = lineChart.at(1).find('.recharts-label');
    expect(refLineLabel).to.have.length(2);
    expect(refLineLabel.at(1).props().children[0].props.children).to.be.equal(sec7.layout.referenceLineY.label);
    lines = lineChart.at(1).find(Line);
    expect(lines).to.have.length(2);
    expect(lines.at(0).props().stroke).to.equal(sec7.data[1].groups[0].color);
    expect(lines.at(1).props().stroke).to.equal(sec7.data[1].groups[1].color);
    expectChartLegendFromChartElement(lineChart.at(1), sec7.data[2].groups);

    expect(lineChart.at(2).props().data[0].name).to.equal(sec13.data[0].name);
    expect(lineChart.at(2).props().data.length).to.equal(2);
    // Trend
    const trendNumber = reportContainer.find(SectionNumber);
    expect(trendNumber).to.have.length(1);
    expect(trendNumber.at(0).props().title).to.equal(sec2.title);
    expect(trendNumber.at(0).props().data).to.equal(sec2.data);
    expect(trendNumber.at(0).find('.trend-num-text').text()).to
      .equal(formatNumberValue(sec2.data.currSum, sec2.layout.valuesFormat));
    expect(trendNumber.at(0).props().layout).to.equal(sec2.layout.layout);
    const trendBox = trendNumber.at(0).find('.trend-box.green');
    expect(trendBox).to.have.length(1);

    // Duration
    const duration = reportContainer.find(SectionDuration);
    expect(duration).to.have.length(1);
    expect(duration.at(0).props().title).to.equal(sec8.title);
    expect(duration.at(0).props().data).to.equal(sec8.data);
    expect(duration.at(0).props().chartProperties).to.equal(sec8.layout.chartProperties);
    const timeUnit = duration.at(0).find('.time-unit');
    expect(timeUnit).to.have.length(3);

    // Page break
    const markdown = reportContainer.find(SectionMarkdown);
    expect(markdown).to.have.length(4);
    expect(markdown.at(0).text()).equal(sec9.data.text.replace(constants.PAGE_BREAK_KEY, ''));

    // Items Section
    const itemsSection = reportContainer.find(ItemsSection);
    expect(itemsSection).to.have.length(1);
    expect(markdown.at(1).props().text).equal(sec10.description);
    const headers = itemsSection.at(0).find('.section-item-header');
    expect(headers).to.have.length(sec10.data.length);
    expect(headers.at(0).text()).to.equal(sec10.data[0].fieldName);
    expect(headers.at(1).text()).to.equal(sec10.data[1].fieldName);

    const itemValues = itemsSection.at(0).find('.section-item-value');
    expect(itemValues).to.have.length(sec10.data.length);
    expect(itemValues.at(0).text()).to.equal(sec10.data[0].data);
    expect(itemValues.at(1).text()).to.equal('HELLO');
    expect(itemValues.at(3).text()).to.equal('CENTER');

    const markdownItem = itemValues.at(2).find(SectionMarkdown);
    expect(markdownItem).to.have.length(1);
    expect(markdownItem.at(0).props().text).to.equal(sec10.data[2].data);

    const tableItem = itemValues.at(4).find(SectionTable);
    expect(tableItem).to.have.length(1);
    expect(tableItem.at(0).props().data).to.deep.equal(sec10.data[4].data);

    // Tables
    const sectionTable = reportContainer.find(SectionTable);
    expect(sectionTable).to.have.length(3);
    expect(sectionTable.at(1).props().columns).to.equal(sec11.layout.tableColumns);
    expect(sectionTable.at(1).props().data).to.equal(sec11.data);
    expect(sectionTable.at(1).props().classes).to.equal(sec11.layout.classes);

    let tableEl = sectionTable.at(1).find('table');
    let tableHeader = sectionTable.at(1).find('th');
    expect(tableEl).to.have.length(1);
    expect(tableHeader).to.have.length(2);
    expect(tableHeader.at(0).text()).to.equal(sec11.layout.tableColumns[0]);
    expect(tableHeader.at(1).text()).to.equal(sec11.layout.tableColumns[1]);

    expect(sectionTable.at(2).props().columns).to.equal(sec12.layout.tableColumns);
    expect(sectionTable.at(2).props().data).to.equal(sec12.data);
    expect(sectionTable.at(2).props().classes).to.equal(sec12.layout.classes);

    tableEl = sectionTable.at(2).find('table');
    tableHeader = sectionTable.at(2).find('th');
    expect(tableEl).to.have.length(1);
    expect(tableHeader).to.have.length(3);
    expect(tableHeader.at(0).text()).to.equal('aaa');
    expect(tableHeader.at(1).text()).to.equal('bbb');
    expect(tableHeader.at(2).text()).to.equal('ccc');

    const chartLegend = reportContainer.find(ChartLegend);
    expect(chartLegend).to.have.length(5);
    expect(chartLegend.at(0).props().style).to.be.equal(sec1.layout.legendStyle.style);
    expect(chartLegend.at(0).props().capitalize).to.be.true;
    expect(chartLegend.at(3).props().capitalize).to.be.false;
  });

  it('Generate test template A4 layout - test auto page break', async () => {
    const testTemplate = TemplateProvider.getTestLayoutTemplateWithPageBreaks();
    const renderReport = (section) => {
      return <ReportContainer
        sections={section}
        isLayout dimensions={constants.A4_DIMENSIONS}
      />;
    };
    const sectionWithAutoPageBreak = prepareSections(cloneDeep(testTemplate), null, true);
    const reportWithAutoPageBreak = mount(renderReport(sectionWithAutoPageBreak));

    const sectionWithoutAutoPageBreak = prepareSections(cloneDeep(testTemplate), null, false);
    const reportWithoutAutoPageBreak = mount(renderReport(sectionWithoutAutoPageBreak));

    await new Promise(resolve => setTimeout(resolve, 5001));

    const reportLayoutWithAutoPageBreak = reportWithAutoPageBreak.find(ReportLayout);
    const reportLayoutWithoutAutoPageBreak = reportWithoutAutoPageBreak.find(ReportLayout);

    const sectionsLayout = reportLayoutWithAutoPageBreak.find('.section-layout');
    expect(sectionsLayout).to.have.length(5);
    const sectionsShowOverflows = reportLayoutWithAutoPageBreak.find('.section-show-overflow');
    expect(sectionsShowOverflows).to.have.length(0);

    const elementsWithAutoPageBreak = reportLayoutWithAutoPageBreak.instance().itemElements;
    const itemElementsWithoutAutoPageBreak = reportLayoutWithoutAutoPageBreak.instance().itemElements;

    const keys = Object.keys(itemElementsWithoutAutoPageBreak);
    const lastKey = keys[keys.length - 1];

    const lastElementTopWithAutoPageBreak = elementsWithAutoPageBreak[lastKey].element.style.top;
    const lastElementTopWithoutAutoPageBreak = itemElementsWithoutAutoPageBreak[lastKey].element.style.top;

    expect(lastElementTopWithAutoPageBreak).to.not.equal(lastElementTopWithoutAutoPageBreak);
  });

  it('Generate test template layout report show bar values', async () => {
    const testTemplate = TemplateProvider.getTestLayoutTemplate();
    const toRender = <ReportContainer sections={prepareSections(testTemplate)} />;
    const reportContainer = mount(toRender);

    const reportLayouts = reportContainer.find(ReportLayout);
    expect(reportLayouts).to.have.length(1);

    await new Promise(resolve => setTimeout(resolve, 5001));

    const barChart = reportContainer.find(SectionBarChart);
    expect(barChart).to.have.length(3);
    expect(barChart.at(0).props().chartProperties.showValues).to.equal(undefined);
    expect(barChart.at(0).props().chartProperties.axis).to.be.undefined;
    expect(barChart.at(0).props().chartProperties.axis).to.be.undefined;
    expect(barChart.at(1).props().chartProperties.showValues).to.equal(true);
    expect(barChart.at(1).props().chartProperties.axis.x.label).to.not.be.empty;
    expect(barChart.at(1).props().chartProperties.axis.y.label).to.not.be.empty;
    expect(barChart.at(2).props().chartProperties.showValues).to.equal(undefined);

    expect(barChart.at(0).find('.xAxis')).to.be.empty;
    expect(barChart.at(0).find('.yAxis')).to.be.empty;
    expect(barChart.at(1).find('.xAxis').at(0).text()).to
      .contain(barChart.at(1).props().chartProperties.axis.x.label);
    expect(barChart.at(1).find('.yAxis').at(0).text()).to
      .contain(barChart.at(1).props().chartProperties.axis.y.label);
  });

  it('Generate test template layout report with duration formats', () => {
    const testTemplate = TemplateProvider.getTestLayoutDurationTemplate();
    const toRender = <ReportContainer sections={prepareSections(testTemplate)} />;
    const reportContainer = mount(toRender);

    const reportLayouts = reportContainer.find(ReportLayout);
    expect(reportLayouts).to.have.length(1);

    const duration = reportContainer.find(SectionDuration);
    expect(duration).to.have.length(3);

    // DURATION with format - months
    expect(duration.at(0).props().chartProperties.format).to.equal(constants.WIDGET_DURATION_FORMAT.months);
    let durationHeaders = duration.at(0).find('.time-unit');
    expect(durationHeaders).to.have.length(3);
    expect(durationHeaders.at(0).text()).to.equal('MONTHS');
    expect(durationHeaders.at(1).text()).to.equal('WEEKS');
    expect(durationHeaders.at(2).text()).to.equal('DAYS');

    let durationValues = duration.at(0).find('.part-header');
    expect(durationValues).to.have.length(3);
    expect(durationValues.at(0).text()).to.equal('01');
    expect(durationValues.at(1).text()).to.equal('01');
    expect(durationValues.at(2).text()).to.equal('01');

    // DURATION with format - hours
    expect(duration.at(1).props().chartProperties.format).to.equal(constants.WIDGET_DURATION_FORMAT.hours);
    durationHeaders = duration.at(1).find('.time-unit');
    expect(durationHeaders).to.have.length(3);
    expect(durationHeaders.at(0).text()).to.equal('HOURS');
    expect(durationHeaders.at(1).text()).to.equal('MIN');
    expect(durationHeaders.at(2).text()).to.equal('SEC');

    durationValues = duration.at(1).find('.part-header');
    expect(durationValues).to.have.length(3);
    expect(durationValues.at(0).text()).to.equal('01');
    expect(durationValues.at(1).text()).to.equal('02');
    expect(durationValues.at(2).text()).to.equal('03');

    // DURATION without format
    expect(duration.at(2).props().chartProperties.format).to.be.undefined;
    durationHeaders = duration.at(2).find('.time-unit');
    expect(durationHeaders).to.have.length(3);
    expect(durationHeaders.at(0).text()).to.equal('DAYS');
    expect(durationHeaders.at(1).text()).to.equal('HOURS');
    expect(durationHeaders.at(2).text()).to.equal('MIN');

    durationValues = duration.at(2).find('.part-header');
    expect(durationValues).to.have.length(3);
    expect(durationValues.at(0).text()).to.equal('01');
    expect(durationValues.at(1).text()).to.equal('02');
    expect(durationValues.at(2).text()).to.equal('03');
  });

  it('Generate test template A4 layout - test reflect dimensions prop', async () => {
    const testTemplate = TemplateProvider.getTestLayoutTemplateWithPageBreaks();
    const renderReport = (section) => {
      return <ReportContainer
        sections={section}
        isLayout dimensions={constants.A4_DIMENSIONS}
      />;
    };
    const sectionWithReflectDimensions = prepareSections(cloneDeep(testTemplate), null, true, true);
    const report = mount(renderReport(sectionWithReflectDimensions));

    await new Promise(resolve => setTimeout(resolve, 5001));

    const reportLayout = report.find(ReportLayout);

    const sectionsLayout = reportLayout.find('.section-layout');
    expect(sectionsLayout).to.have.length(5);
    const sectionsShowOverflows = reportLayout.find('.section-show-overflow');
    expect(sectionsShowOverflows).to.have.length(5);
  });

  it('Generate test empty table template', () => {
    const testTemplate = TemplateProvider.getTestLayoutEmptyTemplate();
    const toRender = <ReportContainer sections={prepareSections(testTemplate)} />;
    const reportContainer = mount(toRender);
    const sectionTable = reportContainer.find(SectionTable);
    const emptyWidget = sectionTable.find('.widget-empty-state');
    expect(emptyWidget).to.have.length(1);
    const emptyWidgetIcon = sectionTable.find('.icon-status-noresults-24-r');
    expect(emptyWidgetIcon).to.have.length(1);
  });

  it('Generate test non-empty table template', () => {
    const testTemplate = TemplateProvider.getTestTemplate();
    const toRender = <ReportContainer sections={prepareSections(testTemplate)} />;
    const reportContainer = mount(toRender);
    const sectionTable = reportContainer.find(SectionTable);
    const emptyWidget = sectionTable.find('.widget-empty-state');
    expect(emptyWidget).to.have.length(0);
  });

  it('Generate test empty generic template', () => {
    const testTemplate = TemplateProvider.getTestLayoutEmptyTemplate();
    const toRender = <ReportContainer sections={prepareSections(testTemplate)} />;
    const reportContainer = mount(toRender);
    const sectionChart = reportContainer.find(SectionChart);
    const emptyWidget = sectionChart.find('.widget-empty-state');
    expect(emptyWidget).to.have.length(2);
    const emptyWidgetIcon = sectionChart.find('.icon-status-noresults-24-r');
    expect(emptyWidgetIcon).to.have.length(2);
  });

  it('Generate test empty markdown template', () => {
    const testTemplate = TemplateProvider.getTestLayoutEmptyTemplate();
    const toRender = <ReportContainer sections={prepareSections(testTemplate)} />;
    const reportContainer = mount(toRender);
    const sectionMark = reportContainer.find(SectionMarkdown);
    const emptyWidget = sectionMark.find('.widget-empty-state');
    expect(emptyWidget).to.have.length(1);
    const emptyWidgetIcon = sectionMark.find('.icon-status-noresults-24-r');
    expect(emptyWidgetIcon).to.have.length(1);
  });

  it('Generate test non-empty markdown template', () => {
    const testTemplate = TemplateProvider.getTestTemplate();
    const toRender = <ReportContainer sections={prepareSections(testTemplate)} />;
    const reportContainer = mount(toRender);
    const sectionTable = reportContainer.find(SectionMarkdown);
    const emptyWidget = sectionTable.find('.widget-empty-state');
    expect(emptyWidget).to.have.length(0);
  });
});
