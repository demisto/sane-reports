import { SECTION_TYPES } from '../../constants/Constants';
import moment from 'moment-timezone';
import { isObject } from 'lodash';

function storeCsvInDocument(csvData) {
  document.csvData = csvData;

  // mark the doc as ready
  const readyDiv = document.createElement('div');
  readyDiv.id = 'ready-doc';
  document.getElementsByTagName('body')[0].appendChild(readyDiv);
}

function csvEscape(data) {
  let readyData = data.replace(/"/g, '""');

  // max number of characters that a cell can contain
  readyData = readyData.substring(0, Math.min(readyData.length, 32767));
  if (readyData && readyData.length > 1) {
    switch (readyData[0]) {
      case '=':
      case '+':
      case '-':
      case '@':
        readyData = '(""' + readyData[0] + '"")' + readyData.substring(1);
        break;
      default:
    }
  }

  return '"' + readyData + '"';
}

function getTableData(results) {
  let data = results || [];
  if (results && results.data) {
    data = results.data;
  }
  return data;
}

function getTableColumns(columns, tableData) {
  let allColumns = columns || [];
  if (allColumns.length === 0 && tableData.length > 0) {
    allColumns = Object.keys(tableData[0]);
  }

  return allColumns;
}

export function generateCSVReport(sections) {
  let csv = '';
  Object
    .keys(sections)
    .forEach((rowPos) => {
      sections[rowPos]
        .forEach((section, sectionsIndex) => {
          switch (section.type) {
            case SECTION_TYPES.header:
              csv += csvEscape(section.data);
              break;
            case SECTION_TYPES.markdown:
              csv += csvEscape((isObject(section.data) ? section.data.text : section.data));
              break;
            case SECTION_TYPES.text:
              csv += csvEscape(section.data);
              break;
            case SECTION_TYPES.date: {
              const format = section.layout.format;
              const date = section.data;
              const formattedDate = date ? moment(date).tz(moment.tz.guess()).format(format) :
                moment().tz(moment.tz.guess()).format(format);
              csv += csvEscape(formattedDate);
              break;
            }
            case SECTION_TYPES.table: {
              const tableData = getTableData(section.data);
              const columns = getTableColumns(section.layout.tableColumns, tableData);
              const readableHeaders = section.layout.readableHeaders;

              columns.forEach((col, i) => {
                csv += (readableHeaders && readableHeaders[col]) || col;
                csv += (i === columns.length - 1 ? '' : ',');
              });
              csv += '\n';

              tableData.forEach((row) => {
                columns.forEach((col, j) => {
                  const cell = (readableHeaders && row[readableHeaders[col]]) || row[col];
                  let cellData = '';

                  if (cell) {
                    if (typeof cell === 'number') {
                      cellData = cell + '';
                    } else if (Array.isArray(cell)) {
                      cellData = cell.join(', ');
                    } else if (cell.replace) {
                      cellData = cell;
                    }
                  }

                  csv += csvEscape(cellData) + (j === columns.length - 1 ? '' : ',');
                });
                csv += '\n';
              });

              csv += '\n';
              break;
            }
            default:
              // do nothing
          }

          if (sectionsIndex < sections[rowPos].length - 1) {
            csv += ',';
          }
        });
      csv += '\n';
    });

  storeCsvInDocument(csv);
}
