/* eslint-disable */

const evalsFunctions = require('./evals');
const puppeteer = require('puppeteer');
const chromePath = require('@moonandyou/chrome-path');
const fs = require('fs');
const path = require('path');
const { cloneDeep } = require('lodash')

const mmPixelSize = 3.779527559055;

const PAGE_MARGIN = 61;
const BOTTOM_MARGIN = 40;
const MIN_TOP_MARGIN_PX = 40;

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
  if (process.argv.length < 2) {
    console.log('Usage: ./reportServer <data file> [<output file> <dist folder> <portrait/landscape> <resourceTimeout> <type> <headerLeftImage> <headerRightImage> <A3/A4/A5/Letter> <disableHeaders> <chromePath> <forceAutoHeightLayout>]');
  }
  const dataFile = process.argv[2];
  const outputFile = process.argv[3];
  const distDir = process.argv[4];
  const orientation = process.argv[5] || PAGE_ORIENTATION.portrait;
  const resourceTimeout = process.argv[6] ? Number(process.argv[6]) : 4000;
  const reportType = process.argv[7] || 'pdf';
  let headerLeftImage = process.argv[8] || '';
  const headerRightImage = process.argv[9] || '';
  const pageSize = process.argv[11] || PAGE_SIZES.Letter;
  const disableHeaders = process.argv[12] === true || process.argv[12] === "true";
  const chromeExecution = process.argv[13] || paths['chromium'] || paths['google-chrome-stable'] || paths['google-chrome'] || '/usr/bin/chromium-browser';
  const forceAutoHeightLayout = process.argv[14] === true || process.argv[14] === "true";
  const markdownArtifactsServerAddress = process.argv[15] || '';
  const maxTextLength = process.argv[16] || '';
  let browser;

  if (process.env.NODE_ENV === 'test') {
    console.table ? console.table({
      dataFile, outputFile, distDir, orientation, resourceTimeout, reportType,
      headerLeftImage, headerRightImage, pageSize, disableHeaders, chromeExecution,
      forceAutoHeightLayout, markdownArtifactsServerAddress
    }) : console.log('args:', process.argv);
  }

  let baseUrl = '';
  let tmpReportName = '';

  if (headerLeftImage && headerLeftImage.indexOf('data:image') === -1) {
    try {
      const headerLeftImageContent = fs.readFileSync(headerLeftImage);
      headerLeftImage = headerLeftImageContent;
    } catch (ex) {
      console.log('found error when reading image: ', ex);
    }
  }
  console.log('customer logo: ', headerLeftImage);
  try {
    const distFolder = distDir || (path.resolve(".") + '/dist');

    console.log('now open: ' + distFolder + '/index.html');
    const indexHtml = fs.readFileSync(distFolder + '/index.html').toString();
    const dimensions = getPageSizeByOrientation(pageSize, orientation);

    const topMargin = Math.max((headerLeftImage || headerRightImage) && !disableHeaders ? PAGE_MARGIN : 0, MIN_TOP_MARGIN_PX);
    const originalDimensions = cloneDeep(dimensions);
    dimensions.height -= topMargin + BOTTOM_MARGIN;

    console.log(
      'page size: ', pageSize, ',',
      'orientation: ', orientation, ',',
      'original dimensions: ', originalDimensions, ',',
      'top margin: ', topMargin, ',',
      'bottom margin: ', BOTTOM_MARGIN, ',',
      'dimensions: ', dimensions
    );

    const afterTypeReplace =
        indexHtml
            .replace('\'{report-type}\'', JSON.stringify(reportType))
            .replace('{report-header-image-left}', headerLeftImage)
            .replace('{report-header-image-right}', headerRightImage)
            .replace('{report-dimensions}', JSON.stringify({ height: dimensions.height, width: dimensions.width }))
            .replace('{force-auto-height}', !!forceAutoHeightLayout)
            .replace('{md-server-address-to-replace}', markdownArtifactsServerAddress)
            .replace('{max-text-length}', parseInt(maxTextLength, 10) || 300);
    const loadedData = fs.readFileSync(dataFile).toString();

    // $ is a special character in string replace, see here: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter
    const finalHtmlData = afterTypeReplace.replace('\'{report-data-to-replace}\'', loadedData.replace(/\$/g, '$$$$'));

    const date = Date.now();

    tmpReportName = outputFile ? (outputFile.substring(outputFile.lastIndexOf('/'), outputFile.lastIndexOf('.')) + '.html') : 'reportTmp-' + date + '.html';
    fs.writeFileSync(distFolder + '/' + tmpReportName, finalHtmlData);

    console.log('HTML template was created: ' + distFolder + '/' + tmpReportName);

    baseUrl = distFolder.startsWith('/') ? distFolder : path.join(process.cwd(), distFolder);
    console.log(`Using "${chromeExecution}" execution.`);

    const args = ['--no-sandbox', '--disable-dev-shm-usage', '--disable-auto-reload'];
    args.push(`--window-size=${dimensions.width},${dimensions.height}`);
    browser = await puppeteer.launch({
      executablePath: chromeExecution,
      headless: true,
      timeout: resourceTimeout,
      args
    });
    const page = await browser.newPage();
    console.log('go to ' + baseUrl + '/' + tmpReportName);
    const outputFinal = outputFile || distFolder + '/report-' + date + '.' + reportType;

    // #region Templates
    const headerTemplate =
      `<div style='height: 200px;font-size: 10px;width: 100%;margin-top: -7px;margin-right: -10px;margin-left: -10px;padding-top: 13px;padding-right: 20px;padding-left: 20px;'>
        <div style='text-align: left; float: left'>
            <img src="${headerLeftImage}" height='20px'/>
            </div>
            <div style='text-align: right; float: right'>
                <img src="${headerRightImage}" height='20px'/>
            </div>
      </div>`;

    const footerTemplate =
      `<div style="font-size:12px!important;width:100%;margin: 0 auto;color:rgba(40, 41 , 42, 0.7)!important;padding-left:10px;text-align:center;" class="footer">
        ${headerLeftImage && disableHeaders ? '<img style="float: left;height: 10px;width: auto;margin: 0 10px;" src=' + headerLeftImage + ' />' : ''}
        ${headerRightImage && disableHeaders ? '<img style="float: right;height: 10px;width: auto;margin: 0 10px;" src=' + headerRightImage + ' />' : ''}
        <span class="pageNumber"></span>/<span class="totalPages"></span>
      </div>`;
    // #endregion

    console.log('output ' + outputFinal);
    await page.setViewport({width: dimensions.width, height: dimensions.height});
    await page.setDefaultNavigationTimeout(0);
    await page.goto('file://' + baseUrl + '/' + tmpReportName, {waitUntil: 'networkidle0'});
    await page.emulateMediaType('screen');
    await page._client.send('Emulation.clearDeviceMetricsOverride');
    await page.waitForSelector('#ready-doc', {
      timeout: 10000
    }); // wait for animations
    switch (reportType) {
      case 'pdf': {
        await page.pdf({
          path: outputFinal,
          format: pageSize,
          printBackground: true,
          margin: {top: topMargin, bottom: BOTTOM_MARGIN},
          displayHeaderFooter: true,
          headerTemplate: !disableHeaders ? headerTemplate : '',
          footerTemplate,
          landscape: orientation === PAGE_ORIENTATION.landscape
        });
        break;
      }
      case 'csv': {
        const csvData = await page.evaluate(evalsFunctions.getCSVData);
        if (csvData === '' || csvData) {
          fs.writeFileSync(outputFinal, csvData, { 'flag': 'w' });
          console.log("CSV report was generated successfully.");
        } else {
          console.log("Failed to generate CSV report.");
        }
        break;
      }
      case 'html':
        console.log("HTML report was generated successfully.");
    }
  } catch (e) {
    console.log("Error while executing report", e);
    process.exitCode = 1;
  } finally {
    fs.unlink(baseUrl + '/' + tmpReportName, function (err) {
      if (err) {
        console.log('HTML template was not deleted with error: ', err);
      } else {
        console.log('HTML template deleted from: ', baseUrl + '/' + tmpReportName);
      }
    });
    if (browser) {
      await browser.close();
    }
  }
})().catch(console.error);

