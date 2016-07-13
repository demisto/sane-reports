/* eslint-disable */
const page = require('webpage').create();
const system = require('system');
const fs = require('fs');

if (system.args.length < 2) {
  console.log('Usage: reportServer.js <data file> [<output file> <dist folder> <portrait/landscape>]');
  phantom.exit();
}

var dataFile = system.args[1];
var outputFile = system.args[2];
var distDir = system.args[3];
var orientation = system.args[4];

const distFolder = distDir || (fs.absolute(".") + '/dist');

const loaded = fs.read(dataFile);
const html = fs.read(distFolder + '/index.html').replace('\'{report-data-to-replace}\'', loaded);
const date = Date.now();

const tmpReportName = outputFile ? (outputFile.substring(outputFile.lastIndexOf('/'), outputFile.lastIndexOf('.')) + '.html') : 'reportTmp-' + date + '.html';
fs.write(distFolder + '/' + tmpReportName, html, 'w');

var baseUrl = distFolder.indexOf('/') === 0 ? distFolder : fs.absolute(".") + '/' + distFolder;
page.open('file://' + baseUrl + '/' + tmpReportName, function(status) {
  console.log("Read report page status: " + status);

  page.paperSize = {
    format: 'letter', // 'A3', 'A4', 'A5', 'Legal', 'Letter', 'Tabloid'
    orientation: orientation || 'portrait', // portrait / landscape
    margin: {
      top: "1cm",
      bottom: "1cm"
    }
  };

  if (status === "success") {
    setTimeout(function() {
      if (page.render(outputFile || distFolder + '/report-' + date + '.pdf', { quality: 100 })) {
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
