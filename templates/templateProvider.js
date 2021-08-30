import testTemplate from './test.json';
import testLayoutCsvTemplate from './testLayoutCsv.json';
import testLayoutScriptBasedTableTemplate from './testLayoutScriptBasedTable.json';
import testLayoutWithPageBreaks from './testLayoutWithPageBreaks.json';
import testLayoutTemplate from './testLayout.json';
import testLayoutDurationTemplate from './testLayoutDuration.json';
import incidentDailyReportTempalte from './incidentDailyReportTempalte.json';
import testLayoutEmptyTemplate from './testLayoutEmptyTemplate.json';

function getTestTemplate() {
  return testTemplate;
}

function getTestLayoutCsvTemplate() {
  return testLayoutCsvTemplate;
}

function getTestLayoutScriptBasedTableTemplate() {
  return testLayoutScriptBasedTableTemplate;
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
  getTestLayoutCsvTemplate,
  getTestLayoutScriptBasedTableTemplate,
  getIncidentDailyReportTemplate,
  getTestLayoutTemplate,
  getTestLayoutDurationTemplate,
  getTestLayoutTemplateWithPageBreaks,
  getTestLayoutEmptyTemplate
};
