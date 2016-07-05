import { React, mount, expect, TemplateProvider } from '../helpers/test_helper';
import ReportContainer from '../../src/containers/ReportContainer';
import ReportLayout from '../../src/components/Layouts/ReportLayout';
import SectionHeader from '../../src/components/Sections/SectionHeader';
import SectionText from '../../src/components/Sections/SectionText';
import SectionChart from '../../src/components/Sections/SectionChart/SectionChart';
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
    expect(rows).to.have.length(4);
    expect(sections).to.have.length(5);

    const row1 = testTemplate[0];
    const row2 = testTemplate[1];
    const row3 = testTemplate[2];
    const row4 = testTemplate[3];

    // Do the same as .textContent - keep it for future reference
    expect(rows.at(0).text()).to.contains(row1.columns[0].data);
    expect(rows.at(1).text()).to.contains(row2.columns[0].data + row2.columns[1].data);

    // Do the same as .text() - keep it for future reference
    expect(rows.get(0).textContent).to.contains(row1.columns[0].data);
    expect(rows.get(1).textContent).to.contains(row2.columns[0].data + row2.columns[1].data);

    const sectionHeader = reportContainer.find(SectionHeader);
    const sectionText = reportContainer.find(SectionText);
    const sectionChart = reportContainer.find(SectionChart);

    expect(sectionHeader).to.have.length(1);
    expect(sectionHeader.props().header).to.equal(row1.columns[0].data);
    expect(sectionHeader.props().style).to.equal(row1.columns[0].style);

    expect(sectionText).to.have.length(2);
    expect(sectionText.at(0).props().text).to.equal(row2.columns[0].data);
    expect(sectionText.at(0).props().style).to.equal(row2.columns[0].style);

    expect(sectionText.at(1).props().text).to.equal(row2.columns[1].data);
    expect(sectionText.at(1).props().style).to.equal(row2.columns[1].style);

    expect(sectionChart).to.have.length(2);
    expect(sectionChart.at(0).props().data).to.equal(row3.columns[0].data);
    expect(sectionChart.at(0).props().style).to.equal(row3.columns[0].style);
    expect(sectionChart.at(0).props().type).to.equal(row3.columns[0].chartType);
    expect(sectionChart.at(0).props().dimensions).to.equal(row3.columns[0].dimensions);

    expect(sectionChart.at(1).props().data).to.equal(row4.columns[0].data);
    expect(sectionChart.at(1).props().style).to.equal(row4.columns[0].style);
    expect(sectionChart.at(1).props().type).to.equal(row4.columns[0].chartType);
    expect(sectionChart.at(1).props().dimensions).to.equal(row4.columns[0].dimensions);

    const barChart = reportContainer.find(BarChart);
    const pieChart = reportContainer.find(PieChart);
    const pie = reportContainer.find(Pie);

    expect(barChart).to.have.length(1);
    expect(pieChart).to.have.length(1);
    expect(pie).to.have.length(1);

    expect(barChart.props().width).to.equal(row3.columns[0].dimensions.width);
    expect(barChart.props().height).to.equal(row3.columns[0].dimensions.height);
    expect(barChart.props().data).to.equal(row3.columns[0].data);

    expect(pieChart.props().width).to.equal(row4.columns[0].dimensions.width);
    expect(pieChart.props().height).to.equal(row4.columns[0].dimensions.height);
    expect(pie.props().data).to.equal(row4.columns[0].data);
  });
});
