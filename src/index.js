/* eslint-disable no-undef */
import $ from 'jquery';
window.jQuery = $; // Assure it's available globally.
require('semantic-ui/dist/semantic.min.js'); // eslint-disable-line
import './css/Index.css';
import 'core-js';

import React from 'react';
import ReactDOM from 'react-dom';
import ReportContainer from './containers/ReportContainer';
import * as TemplateProvider from '../templates/templateProvider';
import {
  REPORT_DATA_TOKEN,
  REPORT_TYPES,
  PIXEL_SIZE
} from './constants/Constants';
import { prepareSections, getReportType } from './utils/reports';
import { generateOfficeReport } from './office/OfficeReport';

let data = reportData;
if (data === REPORT_DATA_TOKEN) {
  data = TemplateProvider.getIncidentDailyReportTemplate();
}

const type = getReportType(reportType);

const sections = prepareSections(data, type, false, false, markdownArtifactsServerAddress);

let isLayout = false;
if (sections) {
  isLayout = true;
  Object
    .keys(sections)
    .forEach((rowPos) => { isLayout = isLayout && sections[rowPos].every(section => section.layout.i); });
}

let dimensions;
try {
  dimensions = JSON.parse(reportDimensions);
} catch (e) {
  // use A4 by default
  dimensions = { width: 210 * PIXEL_SIZE, height: 297 * PIXEL_SIZE };
}

if (type === REPORT_TYPES.pdf) {
  ReactDOM.render(
    <div>
      <ReportContainer
        isLayout={isLayout}
        sections={sections}
        headerLeftImage={headerLeftImage}
        headerRightImage={headerRightImage}
        dimensions={dimensions}
      />
    </div>,
    document.getElementById('app')
  );
} else {
  generateOfficeReport(sections, type);
}
