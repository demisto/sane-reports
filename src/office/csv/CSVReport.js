import { SECTION_TYPES, TABLE_CELL_TYPE } from '../../constants/Constants';
import moment from 'moment-timezone';
import { isObject } from 'lodash';
import { getSlaProps } from '../../utils/time';
import TimerCell from '../../components/Cells/TimerCell/TimerCell';
import { TimeTicker } from '../../components/Cells/TimerCell/TimeTicker';

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

function getTimerCellText(cellExtraData) {
  if (TimerCell.isEmpty(cellExtraData)) {
    return 'N/A';
  }

  const timerProps = getSlaProps(cellExtraData);
  const { doesHaveDueDate, slaPart, elapsed, timeToRender, dueDateStr, slaMessage } =
    TimeTicker.getTimePickerData(timerProps);

  let text = '';

  if (doesHaveDueDate) {
    text += slaMessage;
  }
  text += timeToRender;
  text += '\n';

  if (doesHaveDueDate) {
    text += slaPart;
    text += '\n';

    text += dueDateStr;
    text += '\n';

    if (elapsed) {
      text += 'Total Elapsed: ';
      text += elapsed;
      text += '\n';
    }
  }

  return text;
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
              const extraData = section.extraData;

              columns.forEach((col, i) => {
                csv += (readableHeaders && readableHeaders[col]) || col;
                csv += (i === columns.length - 1 ? '' : ',');
              });
              csv += '\n';

              tableData.forEach((row, i) => {
                columns.forEach((col, j) => {
                  const cell = (readableHeaders && row[readableHeaders[col]]) || row[col];
                  const cellExtraData =
                    (readableHeaders && extraData?.[i]?.[readableHeaders[col]]) || extraData?.[i]?.[col];

                  let cellData = '';

                  if (cellExtraData?.type === TABLE_CELL_TYPE.timer) {
                    cellData = getTimerCellText(cellExtraData);
                  } else if (cell) {
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
