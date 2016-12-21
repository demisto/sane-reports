/* eslint-disable */
const page = require('webpage').create();
const system = require('system');
const fs = require('fs');

phantom.onError = function(msg, trace) {
  const msgStack = ['PHANTOMJS ERROR: ' + msg];
  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
    });
  }
  console.error(msgStack.join('\n'));
  phantom.exit(1);
};


console.log('Starting report server');
console.log('Using PhantomJS version ' +
    phantom.version.major + '.' +
    phantom.version.minor + '.' +
    phantom.version.patch
);
console.log('Agent details: ' +
    page.settings.userAgent
);

if (system.args.length < 2) {
  console.log('Usage: reportServer.js <data file> [<output file> <dist folder> <portrait/landscape> <resourceTimeout> <type><headerLeftImage><headerRightImage>]');
  phantom.exit(1);
}

const dataFile = system.args[1];
const outputFile = system.args[2];
const distDir = system.args[3];
const orientation = system.args[4];
const resourceTimeout = system.args[5];
const reportType = system.args[6] || 'pdf';
const headerLeftImage = system.args[7] || '';
const headerRightImage = system.args[8] || '';

page.settings.resourceTimeout = resourceTimeout ? Number(resourceTimeout) : 4000;

const distFolder = distDir || (fs.absolute(".") + '/dist');

const indexHtml = fs.read(distFolder + '/index.html');
const afterTypeReplace =
  indexHtml
    .replace('\'{report-type}\'', JSON.stringify(reportType))
    .replace('{report-header-image-left}', headerLeftImage)
    .replace('{report-header-image-right}', headerRightImage);

const loadedData = fs.read(dataFile);

// $ is a special character in string replace, see here: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter
const finalHtmlData = afterTypeReplace.replace('\'{report-data-to-replace}\'', loadedData.replace(/\$/g, '$$$$'));

const date = Date.now();

const tmpReportName = outputFile ? (outputFile.substring(outputFile.lastIndexOf('/'), outputFile.lastIndexOf('.')) + '.html') : 'reportTmp-' + date + '.html';
fs.write(distFolder + '/' + tmpReportName, finalHtmlData, 'w');

console.log('HTML template was created: ' + distFolder + '/' + tmpReportName);

const baseUrl = distFolder.indexOf('/') === 0 ? distFolder : fs.absolute(".") + '/' + distFolder;

try {
  page.paperSize = {
    format: 'letter', // 'A3', 'A4', 'A5', 'Legal', 'Letter', 'Tabloid'
    orientation: orientation || 'portrait', // portrait / landscape
    header: {
      height: "1.3cm",
      contents: phantom.callback(function() {
        return "" +
          "<div style='" +
            "background-color: #fcfcfc;" +
            "height: 200px;" +
            "font-size: 10px;" +
            "margin-top: -7px;" +
            "margin-right: -10px;" +
            "margin-left: -10px;" +
            "padding-top: 13px;" +
            "padding-right: 20px;" +
            "padding-left: 20px;'" +
          ">" +
            "<div style='text-align: left; float: left'>" +
              "<img src=\""+headerLeftImage+"\" height='20px' />" +
            "</div>" +
            "<div style='text-align: right; float: right'>" +
              "<img src=\""+headerRightImage+"\" height='20px' />" +
            "</div>" +
          "</div>";
      })
    },
    footer: {
      height: "0.9cm",
      contents: phantom.callback(function(pageNum, numPages) {
        return "" +
          "<div style='" +
            "background-color: #fcfcfc;" +
            "font-size: 10px;" +
            "text-align: center;" +
            "border-top: 1px solid #d6d6d6;" +
            "color: #8e8e8e;" +
            "margin-top: -7px;" +
            "margin-bottom: 10px;" +
            "padding-top: 7px;'" +
          ">" +
            "<span>" +
            "" + pageNum + " / " + numPages + "" +
            "</span>" +
          "</div>";
      })
    }
  };

  page.onLoadFinished = function (status) {
    if (status !== "success") {
      console.log("Page was not loaded.");
      phantom.exit(1);
    }

    if (reportType === 'pdf') {
      setTimeout(function () {
        if (page.render(outputFile || distFolder + '/report-' + date + '.pdf', {quality: 100})) {
          console.log("PDF report was generated successfully.");
          try {
            page.close();
            fs.remove(distFolder + '/' + tmpReportName);
          } catch (ignored) {
            // do nothing
          }
        } else {
          console.log("Failed to generate PDF report.");
        }
        phantom.exit();
      }, 3000); // time out is needed for all animation to be finished
    }
  };

  page.open('file://' + baseUrl + '/' + tmpReportName, function (status) {
    console.log("Read report page status: " + status);

    if (status === "success") {
      switch (reportType) {
        case 'csv':
          const csvData = page.evaluate(function() {
            return document.csvData;
          });
          if (csvData) {
            fs.write(outputFile || distFolder + '/report-' + date + '.csv', csvData, 'w');
            console.log("CSV report was generated successfully.");
          } else {
            console.log("Failed to generate CSV report.");
          }
          phantom.exit();
          break;
      }
    } else {
      console.log("Cannot open report page.");
      phantom.exit(1);
    }
  });
} catch (ex) {
  console.log("Error when opening html report: " + ex);
  phantom.exit(1);
}
