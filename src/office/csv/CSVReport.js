import { SECTION_TYPES } from '../../constants/Constants';
import moment from 'moment-timezone';

function storeCsvInDocument(csvData) {
  document.csvData = csvData;
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
        readyData = '("' + readyData[0] + '")' + readyData.substring(1);
        break;
      default:
    }
  }

  return '"' + readyData + '"';
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
              const columns = section.layout.tableColumns;
              const tableData = section.data;

              columns.forEach((col, i) => {
                csv += col + (i === columns.length - 1 ? '' : ',');
              });
              csv += '\n';

              tableData.forEach((row) => {
                columns.forEach((col, j) => {
                  const cell = row[col];
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
