import testTemplate from './test.json';
import testLayoutWithPageBreaks from './testLayoutWithPageBreaks.json';
import testLayoutTemplate from './testLayout.json';
import testLayoutDurationTemplate from './testLayoutDuration.json';
import incidentDailyReportTempalte from './incidentDailyReportTempalte.json';

function getTestTemplate() {
  return testTemplate;
}

function getTestLayoutTemplate() {
  return testLayoutTemplate;
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
  getTestLayoutTemplateWithPageBreaks
};
