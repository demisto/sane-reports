import { REPORT_TYPES } from '../constants/Constants';
import { generateCSVReport } from './csv/CSVReport';

export function generateOfficeReport(sections, reportType) {
  switch (reportType) {
    case REPORT_TYPES.csv:
      generateCSVReport(sections);
      break;
    default:
      // do nothing
  }
}

