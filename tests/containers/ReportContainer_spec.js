import { React, mount, expect, TemplateProvider } from '../helpers/test_helper';
import ReportContainer from '../../src/containers/ReportContainer';
import ReportLayout from '../../src/components/Layouts/ReportLayout';
import { SectionHeader, SectionText, SectionChart, SectionTable } from '../../src/components/Sections';
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
    expect(rows).to.have.length(8);
    expect(sections).to.have.length(9);

    const row1 = testTemplate[0];
    const row2 = testTemplate[1];
    const row3 = testTemplate[2];
    const row4 = testTemplate[3];
    const row5 = testTemplate[4];
    const row6 = testTemplate[5];
    const row7 = testTemplate[6];
    const row8 = testTemplate[7];

    // Do the same as .textContent - keep it for future reference
    expect(rows.at(0).text()).to.contains(row1.columns[0].data);
    expect(rows.at(1).text()).to.contains(row2.columns[0].data + row2.columns[1].data);

    // Do the same as .text() - keep it for future reference
    expect(rows.get(0).textContent).to.contains(row1.columns[0].data);
    expect(rows.get(1).textContent).to.contains(row2.columns[0].data + row2.columns[1].data);

    // headers
    const sectionHeader = reportContainer.find(SectionHeader);
    expect(sectionHeader).to.have.length(3);
    expect(sectionHeader.at(0).props().header).to.equal(row1.columns[0].data);
    expect(sectionHeader.at(0).props().style).to.equal(row1.columns[0].style);

    expect(sectionHeader.at(1).props().header).to.equal(row3.columns[0].data);
    expect(sectionHeader.at(1).props().style).to.equal(row3.columns[0].style);

    expect(sectionHeader.at(2).props().header).to.equal(row6.columns[0].data);
    expect(sectionHeader.at(2).props().style).to.equal(row6.columns[0].style);

    // text
    const sectionText = reportContainer.find(SectionText);
    expect(sectionText).to.have.length(2);
    expect(sectionText.at(0).props().text).to.equal(row2.columns[0].data);
    expect(sectionText.at(0).props().style).to.equal(row2.columns[0].style);

    expect(sectionText.at(1).props().text).to.equal(row2.columns[1].data);
    expect(sectionText.at(1).props().style).to.equal(row2.columns[1].style);

    // charts
    const sectionChart = reportContainer.find(SectionChart);
    expect(sectionChart).to.have.length(2);
    expect(sectionChart.at(0).props().data).to.equal(row4.columns[0].data);
    expect(sectionChart.at(0).props().style).to.equal(row4.columns[0].style);
    expect(sectionChart.at(0).props().type).to.equal(row4.columns[0].chartType);
    expect(sectionChart.at(0).props().dimensions).to.equal(row4.columns[0].dimensions);

    expect(sectionChart.at(1).props().data).to.equal(row5.columns[0].data);
    expect(sectionChart.at(1).props().style).to.equal(row5.columns[0].style);
    expect(sectionChart.at(1).props().type).to.equal(row5.columns[0].chartType);
    expect(sectionChart.at(1).props().dimensions).to.equal(row5.columns[0].dimensions);

    const barChart = reportContainer.find(BarChart);
    const pieChart = reportContainer.find(PieChart);
    const pie = reportContainer.find(Pie);

    expect(barChart).to.have.length(1);
    expect(pieChart).to.have.length(1);
    expect(pie).to.have.length(1);

    expect(barChart.props().width).to.equal(row4.columns[0].dimensions.width);
    expect(barChart.props().height).to.equal(row4.columns[0].dimensions.height);
    expect(barChart.props().data).to.equal(row4.columns[0].data);

    expect(pieChart.props().width).to.equal(row5.columns[0].dimensions.width);
    expect(pieChart.props().height).to.equal(row5.columns[0].dimensions.height);
    expect(pie.props().data).to.equal(row5.columns[0].data);

    // tables
    const sectionTable = reportContainer.find(SectionTable);
    expect(sectionTable).to.have.length(2);
    expect(sectionTable.at(0).props().columns).to.equal(row7.columns[0].tableColumns);
    expect(sectionTable.at(0).props().data).to.equal(row7.columns[0].data);
    expect(sectionTable.at(0).props().classes).to.equal(row7.columns[0].classes);

    expect(sectionTable.at(1).props().columns).to.equal(row8.columns[0].tableColumns);
    expect(sectionTable.at(1).props().data).to.equal(row8.columns[0].data);
    expect(sectionTable.at(1).props().classes).to.equal(row8.columns[0].classes);

    const tableEl = reportContainer.find('table');
    const tableHeader = reportContainer.find('th');
    expect(tableEl).to.have.length(2);
    expect(tableHeader).to.have.length(8);
    expect(tableHeader.at(0).text()).to.equal(row7.columns[0].tableColumns[0]);
    expect(tableHeader.at(1).text()).to.equal(row7.columns[0].tableColumns[1]);
    expect(tableHeader.at(2).text()).to.equal(row7.columns[0].tableColumns[2]);
    expect(tableHeader.at(3).text()).to.equal(row7.columns[0].tableColumns[3]);
    expect(tableHeader.at(0).text()).to.equal(row8.columns[0].tableColumns[0]);
    expect(tableHeader.at(1).text()).to.equal(row8.columns[0].tableColumns[1]);
    expect(tableHeader.at(2).text()).to.equal(row8.columns[0].tableColumns[2]);
    expect(tableHeader.at(3).text()).to.equal(row8.columns[0].tableColumns[3]);
  });
});
