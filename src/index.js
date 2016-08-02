/* eslint-disable no-undef */
import $ from 'jquery';
window.jQuery = $; // Assure it's available globally.
require('semantic-ui/dist/semantic.min.js'); // eslint-disable-line
import './css/Index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import ReportContainer from './containers/ReportContainer';
import * as TemplateProvider from '../templates/templateProvider';
import { REPORT_DATA_TOKEN, REPORT_TYPES } from './constants/Constants';
import { prepareSections, getReportType } from './utils/reports';
import { generateOfficeReport } from './office/OfficeReport';

let data = reportData;
if (data === REPORT_DATA_TOKEN) {
  data = TemplateProvider.getIncidentDailyReportTemplate();
}

const type = getReportType(reportType);
const sections = prepareSections(data, type);

if (type === REPORT_TYPES.pdf) {
  ReactDOM.render(
    <div>
      <ReportContainer sections={sections} />
    </div>,
    document.getElementById('app')
  );
} else {
  generateOfficeReport(sections, type);
}
