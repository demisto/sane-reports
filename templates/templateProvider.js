import testTemplate from './test.json';
import testLayoutWithPageBreaks from './testLayoutWithPageBreaks.json';
import testLayoutTemplate from './testLayout.json';
import testLayoutDurationTemplate from './testLayoutDuration.json';
import incidentDailyReportTempalte from './genTemp.json';
import testLayoutEmptyTemplate from './testLayoutEmptyTemplate.json';

function getTestTemplate() {
  return testTemplate;
}

function getTestLayoutTemplate() {
  return testLayoutTemplate;
}

function getTestLayoutEmptyTemplate() {
  return testLayoutEmptyTemplate;
}

function getTestLayoutDurationTemplate() {
  return testLayoutDurationTemplate;
}

function getTestLayoutTemplateWithPageBreaks() {
  return testLayoutWithPageBreaks;
}

/* istanbul ignore next */
function getIncidentDailyReportTemplate() {
  return incidentDailyReportTempalte;
}

export {
  getTestTemplate,
  getIncidentDailyReportTemplate,
  getTestLayoutTemplate,
  getTestLayoutDurationTemplate,
  getTestLayoutTemplateWithPageBreaks,
  getTestLayoutEmptyTemplate
};
