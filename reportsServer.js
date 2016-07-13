/* eslint-disable */
const page = require('webpage').create();
const system = require('system');
const fs = require('fs');

if (system.args.length < 2) {
  console.log('Usage: reportServer.js <data file> [<output file> <dist folder>]');
  phantom.exit();
}

var dataFile = system.args[1];
var outputFile = system.args[2];
var distDir = system.args[3];

const dirname = distDir || (fs.absolute(".") + '/dist');
const distFolder = dirname;
const distReportsFolder = distFolder;

const loaded = fs.read(dataFile);
const html = fs.read(distFolder + '/index.html').replace('\'{report-data-to-replace}\'', loaded);
const date = Date.now();

const tmpReportName = 'reportTmp-' + date + '.html';
fs.write(distReportsFolder + '/' + tmpReportName, html, 'w');

page.open('file://' + distReportsFolder + '/' + tmpReportName, function(status) {
  console.log("Read report page status: " + status);

  page.paperSize = {
    format: 'letter', // 'A3', 'A4', 'A5', 'Legal', 'Letter', 'Tabloid'
    orientation: 'portrait', // portrait / landscape
    margin: {
      top: "1cm",
      bottom: "1cm"
    }
  };

  if (status === "success") {
    setTimeout(function() {
      if (page.render(outputFile || distReportsFolder + '/report-' + date + '.pdf', { quality: 100 })) {
        console.log("Report was generated successfully.");
      } else {
        console.log("Failed to generate report.");
      }
      phantom.exit();
    }, 5000);
  } else {
    console.log("Cannot open report page.");
    phantom.exit();
  }
});
