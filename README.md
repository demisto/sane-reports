# Sane Reports
[![CircleCI](https://circleci.com/gh/demisto/sane-reports.svg?style=svg&circle-token=eac6cf719d42f37bfa95f8a33112970fe4799cc5)](https://circleci.com/gh/demisto/sane-reports)
[![Coverage Status](https://coveralls.io/repos/github/demisto/sane-reports/badge.svg?branch=master&t=C6DzM5)](https://coveralls.io/github/demisto/sane-reports?branch=master)

Reports library that will keep you sane and not pulling your hair out

## Quick start (dashboard mode - browser)

#### Install Node.js and then:
```sh
$ git clone git@github.com:demisto/sane-reports.git
$ cd sane-reports
$ npm install
$ npm start
```
Now open browser at: http://localhost:8082

## Generating PDF report
```sh
$ git clone git@github.com:demisto/sane-reports.git
$ cd sane-reports
$ npm install
$ npm run production
$ npm run generate-report
```
This will generate a PDF report in the `dist` folder. The name of the report will start with `report-`.

### Generate report options:
You can create PDF report with the following command as well:

`
phantomjs reportServer.js <report_template_file> [<output_file> <dist_folder> <orientation> <resourceTimeout> <type> <headerLeftImage> <headerRightImage>]
`

- report_template_file: The template of the report (JSON format)
- output_file: The name of the generated report (leave empty for default name)
- dist_folder: should be `dist`
- orientation: The orientation of the report: portrait/landscape (default portrait)
- resourceTimeout: Timeout for generating the report (default is 4000ms)
- type: The report type: pdf or csv (default is pdf)
- headerLeftImage: The image to show at the left side of the report header of each page (base64 or url)
- headerRightImage: The image to show at the right side of the report header of each page (base64 or url)

### PDF Example:
`phantomjs reportsServer.js templates/test.json dist/test.pdf dist portrait 4000 pdf`

### CSV Example:
`phantomjs reportsServer.js templates/testCSV.json dist/test.csv dist portrait 4000 csv`


Reports templates (JSON) example can be found in the [templates](https://github.com/demisto/sane-reports/blob/master/templates) folder.

Example reports outputs can be found in the [examples](https://github.com/demisto/sane-reports/blob/master/examples) folder.

You can edit and create your own template according to this doc.
