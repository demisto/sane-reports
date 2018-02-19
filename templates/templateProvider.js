import testTemplate from './test.json';
import testLayoutTemplate from './testLayout.json';
import incidentDailyReportTempalte from './incidentDailyReportTempalte1.json';

function getTestTemplate() {
  return testTemplate;
}

function getTestLayoutTemplate() {
  return testLayoutTemplate;
}

/* istanbul ignore next */
function getIncidentDailyReportTemplate() {
  return incidentDailyReportTempalte;
}

export {
  getTestTemplate,
  getIncidentDailyReportTemplate,
  getTestLayoutTemplate
};
