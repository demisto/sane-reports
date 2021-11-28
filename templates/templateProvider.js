import { readFileSync } from 'fs';
import path from 'path';
import testTemplate from './test.json';
import testLayoutCsvTemplate from './testLayoutCsv.json';
import testLayoutScriptBasedTableTemplate from './testLayoutScriptBasedTable.json';
import testLayoutWithPageBreaks from './testLayoutWithPageBreaks.json';
import testLayoutTemplate from './testLayout.json';
import testLayoutDurationTemplate from './testLayoutDuration.json';
import incidentDailyReportTempalte from './incidentDailyReportTempalte.json';
import testLayoutEmptyTemplate from './testLayoutEmptyTemplate.json';
import testLayoutMarkdownWithCodeBlock from './testLayoutMarkdownWithCodeBlock.json';
import testLayoutLongTextItemSection from './testLayoutLongTextItemSection.json';

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

function getTestLayoutMarkdownWithCodeBlock() {
  return testLayoutMarkdownWithCodeBlock;
}

function getTestLayoutDurationTemplate() {
  return testLayoutDurationTemplate;
}

function getTestLayoutTemplateWithPageBreaks() {
  return testLayoutWithPageBreaks;
}

function getTestLayoutLongTextItemSection() {
  return testLayoutLongTextItemSection;
}

/* istanbul ignore next */
function getIncidentDailyReportTemplate() {
  return incidentDailyReportTempalte;
}

let cache = {};
function getCachedTemplate(filename) {
  if (filename in cache) {
    return cache[filename];
  }
  cache[filename] = JSON.parse(readFileSync(path.resolve(__dirname, filename)));
  return cache[filename];
}

function clearCachedTemplates() {
  cache = {};
}

export {
  getTestTemplate,
  getTestLayoutCsvTemplate,
  getTestLayoutScriptBasedTableTemplate,
  getIncidentDailyReportTemplate,
  getTestLayoutTemplate,
  getTestLayoutDurationTemplate,
  getTestLayoutTemplateWithPageBreaks,
  getTestLayoutEmptyTemplate,
  getTestLayoutMarkdownWithCodeBlock,
  getTestLayoutLongTextItemSection,
  getCachedTemplate,
  clearCachedTemplates
};
