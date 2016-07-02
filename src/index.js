import './css/Index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import DevTools from './components/DevTools';
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
    {__DEV_TOOLS__ && <DevTools />}
  </div>,
  document.getElementById('app')
);
