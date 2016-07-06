import { React, mount, expect, TemplateProvider } from '../helpers/test_helper';
import ReportContainer from '../../src/containers/ReportContainer';
import ReportLayout from '../../src/components/Layouts/ReportLayout';
import { SectionHeader, SectionText, SectionChart, SectionTable, SectionImage } from '../../src/components/Sections';
import { BarChart, PieChart, Pie } from 'recharts';

describe('Report Container', () => {
  it('Generate test template report', () => {
    const testTemplate = TemplateProvider.getTestTemplate();
    const toRender = <ReportContainer data={testTemplate} />;
    const reportContainer = mount(toRender);

    const reportLayouts = reportContainer.find(ReportLayout);
    const rows = reportContainer.find('.report-row');
    const sections = reportContainer.find('.report-section');
    expect(reportLayouts).to.have.length(1);
    expect(rows).to.have.length(15);
    expect(sections).to.have.length(16);

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

    // Do the same as .textContent - keep it for future reference
    expect(rows.at(0).text()).to.contains(sec1.data);
    expect(rows.at(1).text()).to.contains(sec2.data + sec3.data);

    // Do the same as .text() - keep it for future reference
    expect(rows.get(0).textContent).to.contains(sec1.data);
    expect(rows.get(1).textContent).to.contains(sec2.data + sec3.data);

    // Headers
    const sectionHeader = reportContainer.find(SectionHeader);
    expect(sectionHeader).to.have.length(4);
    expect(sectionHeader.at(0).props().header).to.equal(sec1.data);
    expect(sectionHeader.at(0).props().style).to.equal(sec1.layout.style);

    expect(sectionHeader.at(1).props().header).to.equal(sec4.data);
    expect(sectionHeader.at(1).props().style).to.equal(sec4.layout.style);

    expect(sectionHeader.at(2).props().header).to.equal(sec7.data);
    expect(sectionHeader.at(2).props().style).to.equal(sec7.layout.style);

    expect(sectionHeader.at(3).props().header).to.equal(sec10.data);
    expect(sectionHeader.at(3).props().style).to.equal(sec10.layout.style);

    // Text
    const sectionText = reportContainer.find(SectionText);
    expect(sectionText).to.have.length(5);
    expect(sectionText.at(0).props().text).to.equal(sec2.data);
    expect(sectionText.at(0).props().style).to.equal(sec2.layout.style);

    expect(sectionText.at(1).props().text).to.equal(sec3.data);
    expect(sectionText.at(1).props().style).to.equal(sec3.layout.style);

    expect(sectionText.at(2).props().text).to.equal(sec11.data);
    expect(sectionText.at(2).props().style).to.equal(sec11.layout.style);

    expect(sectionText.at(3).props().text).to.equal(sec13.data);
    expect(sectionText.at(3).props().style).to.equal(sec13.layout.style);

    expect(sectionText.at(4).props().text).to.equal(sec15.data);
    expect(sectionText.at(4).props().style).to.equal(sec15.layout.style);

    // Charts
    const sectionChart = reportContainer.find(SectionChart);
    expect(sectionChart).to.have.length(2);
    expect(sectionChart.at(0).props().data).to.equal(sec5.data);
    expect(sectionChart.at(0).props().style).to.equal(sec5.layout.style);
    expect(sectionChart.at(0).props().type).to.equal(sec5.layout.chartType);
    expect(sectionChart.at(0).props().dimensions).to.equal(sec5.layout.dimensions);

    expect(sectionChart.at(1).props().data).to.equal(sec6.data);
    expect(sectionChart.at(1).props().style).to.equal(sec6.layout.style);
    expect(sectionChart.at(1).props().type).to.equal(sec6.layout.chartType);
    expect(sectionChart.at(1).props().dimensions).to.equal(sec6.layout.dimensions);

    const barChart = reportContainer.find(BarChart);
    const pieChart = reportContainer.find(PieChart);
    const pie = reportContainer.find(Pie);

    expect(barChart).to.have.length(1);
    expect(pieChart).to.have.length(1);
    expect(pie).to.have.length(1);

    expect(barChart.props().width).to.equal(sec5.layout.dimensions.width);
    expect(barChart.props().height).to.equal(sec5.layout.dimensions.height);
    expect(barChart.props().data).to.equal(sec5.data);

    expect(pieChart.props().width).to.equal(sec6.layout.dimensions.width);
    expect(pieChart.props().height).to.equal(sec6.layout.dimensions.height);
    expect(pie.props().data).to.equal(sec6.data);

    // Tables
    const sectionTable = reportContainer.find(SectionTable);
    expect(sectionTable).to.have.length(2);
    expect(sectionTable.at(0).props().columns).to.equal(sec8.layout.tableColumns);
    expect(sectionTable.at(0).props().data).to.equal(sec8.data);
    expect(sectionTable.at(0).props().classes).to.equal(sec8.layout.classes);

    expect(sectionTable.at(1).props().columns).to.equal(sec9.layout.tableColumns);
    expect(sectionTable.at(1).props().data).to.equal(sec9.data);
    expect(sectionTable.at(1).props().classes).to.equal(sec9.layout.classes);

    const tableEl = reportContainer.find('table');
    const tableHeader = reportContainer.find('th');
    expect(tableEl).to.have.length(2);
    expect(tableHeader).to.have.length(8);
    expect(tableHeader.at(0).text()).to.equal(sec8.layout.tableColumns[0]);
    expect(tableHeader.at(1).text()).to.equal(sec8.layout.tableColumns[1]);
    expect(tableHeader.at(2).text()).to.equal(sec8.layout.tableColumns[2]);
    expect(tableHeader.at(3).text()).to.equal(sec8.layout.tableColumns[3]);
    expect(tableHeader.at(0).text()).to.equal(sec9.layout.tableColumns[0]);
    expect(tableHeader.at(1).text()).to.equal(sec9.layout.tableColumns[1]);
    expect(tableHeader.at(2).text()).to.equal(sec9.layout.tableColumns[2]);
    expect(tableHeader.at(3).text()).to.equal(sec9.layout.tableColumns[3]);

    // Images
    const sectionImage = reportContainer.find(SectionImage);
    expect(sectionImage).to.have.length(3);
    expect(sectionImage.at(0).props().src).to.equal(sec12.data);
    expect(sectionImage.at(0).props().alt).to.equal(sec12.layout.alt);
    expect(sectionImage.at(0).props().classes).to.equal(sec12.layout.classes);

    expect(sectionImage.at(1).props().src).to.equal(sec14.data);
    expect(sectionImage.at(1).props().alt).to.equal(sec14.layout.alt);
    expect(sectionImage.at(1).props().classes).to.equal(sec14.layout.classes);

    expect(sectionImage.at(2).props().src).to.equal(sec16.data);
    expect(sectionImage.at(2).props().alt).to.equal(sec16.layout.alt);
    expect(sectionImage.at(2).props().classes).to.equal(sec16.layout.classes);

    const imgEl = reportContainer.find('img');
    const mediumCircularImage = reportContainer.find('.ui.image.medium.circular');
    const smallImage = reportContainer.find('.ui.image.small');
    expect(imgEl).to.have.length(3);
    expect(mediumCircularImage).to.have.length(1);
    expect(smallImage).to.have.length(1);
  });
});
