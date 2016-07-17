import $ from 'jquery';
window.jQuery = $; // Assure it's available globally.
require('semantic-ui/dist/semantic.min.js'); // eslint-disable-line
import './css/Index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import ReportContainer from './containers/ReportContainer';
import * as TemplateProvider from '../templates/templateProvider';
import { REPORT_DATA_TOKEN } from './constants/Constants';

let data = reportData; // eslint-disable-line no-undef
if (data === REPORT_DATA_TOKEN) {
  data = TemplateProvider.getTestTemplate();
}

ReactDOM.render(
  <div>
    <ReportContainer data={data} />
  </div>,
  document.getElementById('app')
);
