/* eslint-disable */
/* This file is deprecated and used as legacy only */
const evalsFunctions = require('./evals');
const puppeteer = require('puppeteer');
const chromePath = require('@moonandyou/chrome-path');
const fs = require('fs');
const path = require('path');

const mmPixelSize = 3.779527559055;

(async() => {
  const paths = await chromePath();
  console.log(paths);
  const PAGE_SIZES = {
    A4: 'A4',
    A3: 'A3',
    Letter: 'letter',
    A5: 'A5'
  };

  const PAGE_ORIENTATION = {
    portrait: 'portrait',
    landscape: 'landscape'
  };

  function getPageSize(pageSize) {
    let dimensions;
    switch (pageSize) {
      case PAGE_SIZES.A3:
        dimensions = { width: 297 * mmPixelSize, height: 420 * mmPixelSize };
        break;
      case PAGE_SIZES.A5:
        dimensions = { width: 148 * mmPixelSize, height: 210 * mmPixelSize };
        break;
      case PAGE_SIZES.Letter:
        dimensions = { width: 216 * mmPixelSize, height: 279 * mmPixelSize };
        break;
      case PAGE_SIZES.A4:
      default:
        dimensions = { width: 210 * mmPixelSize, height: 297 * mmPixelSize };
    }
    return { width: Math.round(dimensions.width), height: Math.round(dimensions.height) };
  }

  function getPageSizeByOrientation(pageSize, orientation) {
    const size = getPageSize(pageSize);
    if (orientation && orientation === PAGE_ORIENTATION.landscape) {
      const h = size.height;
      const w = size.width;
      return { width: h, height: w };
    }
    return size;
  }
  /*
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
  */
  /*
  console.log('Starting report server');
  console.log('Using PhantomJS version ' +
      phantom.version.major + '.' +
      phantom.version.minor + '.' +
      phantom.version.patch
  );
  console.log('Agent details: ' +
      page.settings.userAgent
  );
  */
  if (process.argv.length < 2) {
    console.log('Usage: reportServer <data file> [<output file> <dist folder> <portrait/landscape> <resourceTimeout> <type> <headerLeftImage> <headerRightImage>]');
  }
  const dataFile = process.argv[2];
  const outputFile = process.argv[3];
  const distDir = process.argv[4];
  const orientation = process.argv[5] || PAGE_ORIENTATION.portrait;
  const resourceTimeout = process.argv[6] ? Number(process.argv[6]) : 4000;
  const reportType = process.argv[7] || 'pdf';
  var headerLeftImage = process.argv[8] || '';
  const headerRightImage = process.argv[9] || '';
  const pageSize = process.argv[11] || PAGE_SIZES.Letter;
  const chromeExecution = process.argv[12] || paths['chromium'] || paths['google-chrome-stable'] || paths['google-chrome'] || 'chrome';

  if (headerLeftImage) {
    try {
      const headerLeftImageContent = fs.read(headerLeftImage);
      headerLeftImage = headerLeftImageContent;
    } catch (ex) {
      // ignored
    }
  }

  const distFolder = distDir || (fs.absolute(".") + '/dist');

  console.log('now open: ' + distFolder + '/index.html');
  const indexHtml = fs.readFileSync(distFolder + '/index.html').toString();
  const afterTypeReplace =
    indexHtml
      .replace('\'{report-type}\'', JSON.stringify(reportType))
      .replace('{report-header-image-left}', headerLeftImage)
      .replace('{report-header-image-right}', headerRightImage);

  const loadedData = fs.readFileSync(dataFile).toString();

  // $ is a special character in string replace, see here: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter
  const finalHtmlData = afterTypeReplace.replace('\'{report-data-to-replace}\'', loadedData.replace(/\$/g, '$$$$'));

  const date = Date.now();

  const tmpReportName = outputFile ? (outputFile.substring(outputFile.lastIndexOf('/'), outputFile.lastIndexOf('.')) + '.html') : 'reportTmp-' + date + '.html';
  fs.writeFileSync(distFolder + '/' + tmpReportName, finalHtmlData);

  console.log('HTML template was created: ' + distFolder + '/' + tmpReportName);

  const dimensions = getPageSizeByOrientation(pageSize, orientation);
  const baseUrl = distDir.startsWith('/') ? distDir : path.join(process.cwd(), distDir);
  console.log(`Using "${chromeExecution}" execution.`);

  const args = ['--no-sandbox'];
  const chrome = { x: 0, y: 74 };   // comes from config in reality
  args.push(`--window-size=${dimensions.width+chrome.x},${dimensions.height+chrome.y}`);
  const browser = await puppeteer.launch({
    executablePath: chromeExecution,
    headless: true,
    timeout: resourceTimeout,
    args
  });
  const page = await browser.newPage();
  console.log('go to ' + baseUrl + '/' + tmpReportName);
  const outputFinal = outputFile || distFolder + '/report-' + date + '.' + reportType;

  console.log('output ' + outputFinal);
  await page.setViewport({ width: dimensions.width, height: dimensions.height });
  await page.goto('file://' + baseUrl + '/' + tmpReportName, {waitUntil: 'networkidle2'});
  await page.emulateMedia('screen');

  switch (reportType) {
      case 'pdf': {
          await page.pdf({
              path: outputFinal,
              format: pageSize,
              printBackground: true,
              scale: 1,
              margin: {top: headerLeftImage || headerRightImage ? 60 : 0, bottom: 60},
              displayHeaderFooter: true,
              headerTemplate: "" + "<div style='" +
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
              "<img src=\""+headerLeftImage+"\" height='20px'/>" +
              "</div>" +
              "<div style='text-align: right; float: right'>" +
              "<img src=\""+headerRightImage+"\" height='20px'/>" +
              "</div>" +
              "</div>",
              footerTemplate: `
      <div style="font-size:12px!important;width:100%;margin: 0 auto;color:grey!important;background-color: yellow;padding-left:10px;text-align:center;" class="pdfheader">
<span class="pageNumber"></span>/<span class="totalPages"></span>
</div>
  `,
              landscape: orientation === PAGE_ORIENTATION.landscape
          });
          break;
      }
      case 'csv': {
          const csvData = await page.evaluate(evalsFunctions.getCSVData);
          if (csvData) {
              fs.write(outputFinal, csvData, 'w');
              fs.remove(distFolder + '/' + tmpReportName);
              console.log("CSV report was generated successfully.");
          } else {
              console.log("Failed to generate CSV report.");
          }
          break;
      }
      case 'html':
          console.log("HTML report was generated successfully.");
  }

  await browser.close();
})();