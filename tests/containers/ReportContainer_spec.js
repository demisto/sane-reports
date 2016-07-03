import { React, mount, expect, TemplateProvider } from '../helpers/test_helper';
import ReportContainer from '../../src/containers/ReportContainer';
import ReportLayout from '../../src/components/Layouts/ReportLayout';

describe('Report Container', () => {
  it('Generate test template report', () => {
    const testTemplate = TemplateProvider.getTestTemplate();
    const toRender = <ReportContainer data={testTemplate} />;
    const reportContainer = mount(toRender);

    const reportLayouts = reportContainer.find(ReportLayout);
    const rows = reportContainer.find('.report-row');
    const sections = reportContainer.find('.report-section');
    expect(reportLayouts).to.have.length(1);
    expect(rows).to.have.length(3);
    expect(sections).to.have.length(4);

    const row1 = testTemplate[0];
    const row2 = testTemplate[1];
    const row3 = testTemplate[2];

    // Do the same as .textContent - keep it for future reference
    expect(rows.at(0).text()).to.contains('Row: ' + row1.pos);
    expect(rows.at(1).text()).to.contains('Row: ' + row2.pos);
    expect(rows.at(2).text()).to.contains('Row: ' + row3.pos);

    // Do the same as .text() - keep it for future reference
    expect(rows.get(0).textContent).to.contains('Row: ' + row1.pos);
    expect(rows.get(1).textContent).to.contains('Row: ' + row2.pos);
    expect(rows.get(2).textContent).to.contains('Row: ' + row3.pos);

    expect(
        rows.contains([
          <span>Row: {row1.pos}</span>,
          <div className="report-section">
            <div>Type: {row1.columns[0].type}</div>
            <div>Position: {row1.columns[0].pos}</div>
            <div>Data: {JSON.stringify(row1.columns[0].data)}</div>
          </div>
        ])
    ).to.equal(true);

    expect(
        rows.contains([
          <span>Row: {row2.pos}</span>,
          <div className="report-section">
            <div>Type: {row2.columns[0].type}</div>
            <div>Position: {row2.columns[0].pos}</div>
            <div>Data: {JSON.stringify(row2.columns[0].data)}</div>
          </div>,
          <div className="report-section">
            <div>Type: {row2.columns[1].type}</div>
            <div>Position: {row2.columns[1].pos}</div>
            <div>Data: {JSON.stringify(row2.columns[1].data)}</div>
          </div>
        ])
    ).to.equal(true);

    expect(
        rows.contains([
          <span>Row: {row3.pos}</span>,
          <div className="report-section">
            <div>Type: {row3.columns[0].type}</div>
            <div>Position: {row3.columns[0].pos}</div>
            <div>Data: {JSON.stringify(row3.columns[0].data)}</div>
          </div>
        ])
    ).to.equal(true);
  });
});
