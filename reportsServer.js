/* eslint-disable */
const page = require('webpage').create();
const system = require('system');
const fs = require('fs');

const distFolder = './dist';

if (system.args.length < 2) {
  console.log('Usage: reportServer.js <data file>');
  phantom.exit();
}

var dataFile = system.args[1];

const loaded = fs.read(dataFile);
const html = fs.read(distFolder + '/index.html').replace('\'{report-data-to-replace}\'', loaded);
const date = Date.now();
const tmpReportName = 'reportTmp-' + date + '.html';
fs.write(distFolder + '/' + tmpReportName, html, 'w');

page.open('http://127.0.0.1:8083/' + tmpReportName, function(status) {
  console.log("Read report page status: " + status);

  if (status === "success") {
    page.render(distFolder + '/report-' + date + '.pdf', { quality: 100 });
  }

  phantom.exit();
});
