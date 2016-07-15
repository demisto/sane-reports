import testTemplate from './test.json';
import incidentDailyReportTempalte from './incidentDailyReportTempalte.json';

function getTestTemplate() {
  return testTemplate;
}

/* istanbul ignore next */
function getIncidentDailyReportTemplate() {
  return incidentDailyReportTempalte;
}

export {
  getTestTemplate,
  getIncidentDailyReportTemplate
};
