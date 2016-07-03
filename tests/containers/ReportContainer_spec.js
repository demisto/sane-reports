import { React, mount, expect, TemplateProvider } from '../helpers/test_helper';
import ReportContainer from '../../src/containers/ReportContainer';
import ReportLayout from '../../src/components/Layouts/ReportLayout';

describe('Report Container', () => {
  it('Generate test template report', () => {
    const testTemplate = TemplateProvider.getTestTemplate();
    const toRender = <ReportContainer data={testTemplate} />;
    const reportContainer = mount(toRender);

    const reportLayouts = reportContainer.find(ReportLayout);
    const sections = reportContainer.find('.section');
    expect(reportLayouts).to.have.length(1);
    expect(sections).to.have.length(3);

    expect(
      sections.contains([
        <div>Type: {testTemplate.section2.type}</div>,
        <div>Position: {testTemplate.section2.pos}</div>,
        <div>Data: {JSON.stringify(testTemplate.section2.data)}</div>
      ])
    ).to.equal(true);

    expect(
        sections.contains([
          <div>Type: {testTemplate.section1.type}</div>,
          <div>Position: {testTemplate.section1.pos}</div>,
          <div>Data: {JSON.stringify(testTemplate.section1.data)}</div>
        ])
    ).to.equal(true);

    expect(
        sections.contains([
          <div>Type: {testTemplate.section3.type}</div>,
          <div>Position: {testTemplate.section3.pos}</div>,
          <div>Data: {JSON.stringify(testTemplate.section3.data)}</div>
        ])
    ).to.equal(true);
  });
});
