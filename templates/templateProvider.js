// eslint-disable-next-line global-require
const fs = require('fs');
// eslint-disable-next-line global-require
const path = require('path');

let testTemplate;
let testLayoutCsvTemplate;
let testLayoutScriptBasedTableTemplate;
let testLayoutWithPageBreaks;
let testLayoutTemplate;
let testLayoutDurationTemplate;
let incidentDailyReportTempalte;
let testLayoutEmptyTemplate;
let testLayoutMarkdownWithCodeBlock;
let testLayoutLongTextItemSection;
let testLayoutWithDateTime;


function loadTemplate(filename) {
  return JSON.parse(fs.readFileSync(path.resolve(`./templates/${filename}`),
    { encoding: 'utf8' }));
}

export function initLegacyTemplates() {
  testTemplate = loadTemplate('test.json');
  testLayoutCsvTemplate = loadTemplate('testLayoutCsv.json');
  testLayoutScriptBasedTableTemplate = loadTemplate('testLayoutScriptBasedTable.json');
  testLayoutWithPageBreaks = loadTemplate('testLayoutWithPageBreaks.json');
  testLayoutTemplate = loadTemplate('testLayout.json');
  testLayoutDurationTemplate = loadTemplate('testLayoutDuration.json');
  incidentDailyReportTempalte = loadTemplate('incidentDailyReportTempalte.json');
  testLayoutEmptyTemplate = loadTemplate('testLayoutEmptyTemplate.json');
  testLayoutMarkdownWithCodeBlock = loadTemplate('testLayoutMarkdownWithCodeBlock.json');
  testLayoutLongTextItemSection = loadTemplate('testLayoutLongTextItemSection.json');
  testLayoutWithDateTime = loadTemplate('testLayoutWithDateTime.json');
}

export function getTestTemplate() {
  return testTemplate;
}

export function getTestLayoutCsvTemplate() {
  return testLayoutCsvTemplate;
}

export function getTestLayoutScriptBasedTableTemplate() {
  return testLayoutScriptBasedTableTemplate;
}

export function getTestLayoutTemplate() {
  return testLayoutTemplate;
}

export function getTestLayoutEmptyTemplate() {
  return testLayoutEmptyTemplate;
}

export function getTestLayoutMarkdownWithCodeBlock() {
  return testLayoutMarkdownWithCodeBlock;
}

export function getTestLayoutDurationTemplate() {
  return testLayoutDurationTemplate;
}

export function getTestLayoutTemplateWithPageBreaks() {
  return testLayoutWithPageBreaks;
}

export function getTestLayoutLongTextItemSection() {
  return testLayoutLongTextItemSection;
}

/* istanbul ignore next */
export function getIncidentDailyReportTemplate() {
  return incidentDailyReportTempalte;
}

export function getTestLayoutWithDateTime() {
  return testLayoutWithDateTime;
}
