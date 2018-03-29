/* eslint-disable no-unused-expressions */
import { React, mount, expect, TemplateProvider } from '../helpers/test_helper';
import { prepareSections } from '../../src/utils/reports';
import ReportContainer from '../../src/containers/ReportContainer';
import ChartLegend from '../../src/components/Sections/SectionChart/ChartLegend';
import ReportLayout from '../../src/components/Layouts/ReportLayout';
import { SectionHeader, SectionText, SectionDate, SectionChart, SectionTable, SectionImage, SectionDivider,
  SectionMarkdown, SectionJson, SectionNumber, SectionDuration } from '../../src/components/Sections';
import { BarChart, PieChart, Pie, LineChart } from 'recharts';

describe('Report Container', () => {
  it('Generate test template report', () => {
    const testTemplate = TemplateProvider.getTestTemplate();
    const toRender = <ReportContainer sections={prepareSections(testTemplate)} />;
    const reportContainer = mount(toRender);

    const hiddenHeader = reportContainer.find('.hidden-header');
    expect(hiddenHeader).to.have.length(1);
    expect(hiddenHeader.get(0).style._values).to.deep.equal({ display: 'none' });

    const reportLayouts = reportContainer.find(ReportLayout);
    const rows = reportContainer.find('.report-row');
    const sections = reportContainer.find('.report-section');
    expect(reportLayouts).to.have.length(1);
    expect(rows).to.have.length(22);
    expect(sections).to.have.length(23);

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

    // Do the same as .textContent - keep it for future reference
    expect(rows.at(0).text()).to.contains(sec1.data);
    expect(rows.at(1).text()).to.contains(sec2.data + sec3.data);

    // Do the same as .text() - keep it for future reference
    expect(rows.get(0).textContent).to.contains(sec1.data);
    expect(rows.get(1).textContent).to.contains(sec2.data + sec3.data);

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

    const barChart = reportContainer.find(BarChart);
    const pieChart = reportContainer.find(PieChart);
    const pie = reportContainer.find(Pie);

    expect(barChart).to.have.length(1);
    expect(pieChart).to.have.length(1);
    expect(pie).to.have.length(1);

    expect(barChart.props().width).to.equal(sec5.layout.dimensions.width);
    expect(barChart.props().height).to.equal(sec5.layout.dimensions.height);
    expect(barChart.props().data).to.deep.equal(sec5.data);

    expect(pieChart.props().width).to.equal(sec7.layout.dimensions.width);
    expect(pieChart.props().height).to.equal(sec7.layout.dimensions.height);
    expect(pie.props().data).to.have.length(5);

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
    expect(imgEl).to.have.length(5);
    expect(mediumCircularImage).to.have.length(1);
    expect(smallImage).to.have.length(1);

    expect(imgEl.get(0).style._values).to.deep.equal({ display: 'none' });
    expect(imgEl.get(1).style._values).to.deep.equal({ display: 'none' });
    expect(imgEl.get(2).style._values).to.not.equal({ display: 'none' });
    expect(imgEl.get(3).style._values).to.not.equal({ display: 'none' });
    expect(imgEl.get(4).style._values).to.not.equal({ display: 'none' });

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
    expect(dateEl.get(0).textContent).to.have.length.above(sec18.layout.format.length + 3);
    expect(dateEl.get(1).textContent).to.equal('Jan 1st 16');

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
    expect(sectionMarkdown.at(0).props().style).to.equal(sec22.layout.style);

    // JSON
    const sectionJSON = reportContainer.find(SectionJson);
    expect(sectionJSON).to.have.length(1);
    expect(sectionJSON.at(0).props().data).to.equal(sec23.data);
    expect(sectionJSON.at(0).props().style).to.equal(sec23.layout.style);
    const jsonInspectorKey = reportContainer.find('.json-inspector__key');
    const jsonInspectorValue = reportContainer.find('.json-inspector__value_string');
    expect(jsonInspectorKey).to.have.length(4);
    expect(jsonInspectorValue).to.have.length(1);
    expect(jsonInspectorKey.at(0).text()).to.equal('root:');
    expect(jsonInspectorKey.at(1).text()).to.equal('hello:');
    expect(jsonInspectorKey.at(2).text()).to.equal('how:');
    expect(jsonInspectorKey.at(3).text()).to.equal('are:');
    expect(jsonInspectorValue.at(0).text()).to.equal('you?');
  });

  it('Generate test template layout report', () => {
    const testTemplate = TemplateProvider.getTestLayoutTemplate();
    const toRender = <ReportContainer sections={prepareSections(testTemplate)} />;
    const reportContainer = mount(toRender);

    const hiddenHeader = reportContainer.find('.hidden-header');
    expect(hiddenHeader).to.have.length(1);
    expect(hiddenHeader.get(0).style._values).to.deep.equal({ display: 'none' });

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

    // Charts
    const sectionChart = reportContainer.find(SectionChart);
    expect(sectionChart).to.have.length(5);
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

    const barChart = reportContainer.find(BarChart);
    const pieChart = reportContainer.find(PieChart);
    const lineChart = reportContainer.find(LineChart);
    const pie = reportContainer.find(Pie);

    expect(barChart).to.have.length(3);
    expect(pieChart).to.have.length(1);
    expect(lineChart).to.have.length(1);
    expect(pie).to.have.length(1);

    expect(pieChart.props().width).to.equal(sec5.layout.dimensions.width);
    expect(pie.props().data.length).to.equal(sec5.data.length);

    expect(barChart.at(0).props().width).to.equal(sec1.layout.dimensions.width);
    expect(barChart.at(0).props().height).to.equal(sec1.layout.dimensions.height);
    expect(barChart.at(1).props().width).to.equal(sec4.layout.dimensions.width);
    expect(barChart.at(1).props().height).to.equal(sec4.layout.dimensions.height);
    expect(barChart.at(1).props().data).to.deep.equal(sec4.data);
    expect(barChart.at(2).props().width).to.equal(sec5.layout.dimensions.width);
    expect(barChart.at(2).props().height).to.equal(sec5.layout.dimensions.height);
    expect(barChart.at(2).props().data).to.deep.equal(sec5.data);

    expect(lineChart.at(0).props().width).to.equal(sec6.layout.dimensions.width);
    expect(lineChart.at(0).props().height).to.equal(sec6.layout.dimensions.height);

    // Trend
    const trendNumber = reportContainer.find(SectionNumber);
    expect(trendNumber).to.have.length(1);
    expect(trendNumber.at(0).props().title).to.equal(sec2.title);
    expect(trendNumber.at(0).props().data).to.equal(sec2.data);
    expect(trendNumber.at(0).props().layout).to.equal(sec2.layout.layout);
    const trendBox = trendNumber.at(0).find('.trend-box.green');
    expect(trendBox).to.have.length(1);

    // Duration
    const duration = reportContainer.find(SectionDuration);
    expect(duration).to.have.length(1);
    expect(duration.at(0).props().title).to.equal(sec7.title);
    expect(duration.at(0).props().data).to.equal(sec7.data);
    expect(duration.at(0).props().chartProperties).to.equal(sec7.layout.chartProperties);
    const timeUnit = duration.at(0).find('.time-unit');
    expect(timeUnit).to.have.length(3);

    // Tables
    const sectionTable = reportContainer.find(SectionTable);
    expect(sectionTable).to.have.length(1);
    expect(sectionTable.at(0).props().columns).to.equal(sec8.layout.tableColumns);
    expect(sectionTable.at(0).props().data).to.equal(sec8.data);
    expect(sectionTable.at(0).props().classes).to.equal(sec8.layout.classes);

    const tableEl = reportContainer.find('table');
    const tableHeader = reportContainer.find('th');
    expect(tableEl).to.have.length(2); // there is a table in duration display.
    expect(tableHeader).to.have.length(2);
    expect(tableHeader.at(0).text()).to.equal(sec8.layout.tableColumns[0]);
    expect(tableHeader.at(1).text()).to.equal(sec8.layout.tableColumns[1]);

    const chartLegend = reportContainer.find(ChartLegend);
    expect(chartLegend).to.have.length(4);
    expect(chartLegend.at(0).props().style).to.be.equal(sec1.layout.legendStyle.style);
  });
});
