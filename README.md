# Sane Reports by [Demisto](https://demisto.com)
[![CircleCI](https://circleci.com/gh/demisto/sane-reports.svg?style=svg&circle-token=eac6cf719d42f37bfa95f8a33112970fe4799cc5)](https://circleci.com/gh/demisto/sane-reports)
[![Coverage Status](https://coveralls.io/repos/github/demisto/sane-reports/badge.svg?branch=master&t=C6DzM5)](https://coveralls.io/github/demisto/sane-reports?branch=master)

Reports library that will keep you sane and not pulling your hair out

## Quick start
**Chromium/Chrome**
```sh
$ npm install sane-reports
$ npm run make
$ ./reportsServer templates/test.json dist/test.pdf # for linux users.
$ ./reportsServer-macos templates/test.json dist/test.pdf # for macOS users.
$ ./reportsServer-win.exe templates/test.json dist/test.pdf # for windows users.
```

**PhantomJS**
```sh
$ npm install sane-reports
$ cd sane-reports
$ phantomjs reportsServer.js templates/test.json dist/test.pdf
```

Report will be generated in: `dist/test.pdf`

## Generating dashboard mode (browser) report
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

#### Chromium/Chrome
`
./reportsServer <report_template_file> [<output_file> <dist_folder> <orientation> <resourceTimeout> <type> <headerLeftImage> <headerRightImage> <customReportType> <pageSize> <disableTopHeaders> <chromiumPath>]
`

#### PhantomJS
`
phantomjs reportServer.js <report_template_file> [<output_file> <dist_folder> <orientation> <resourceTimeout> <type> <headerLeftImage> <headerRightImage> <customReportType> <pageSize> <disableTopHeaders>]
`

- report_template_file: The template of the report (JSON format)
- output_file: The name of the generated report (leave empty for default name)
- dist_folder: should be `dist`
- orientation: The orientation of the report: portrait/landscape (default portrait)
- resourceTimeout: Timeout for generating the report (default is 4000ms)
- type: The report type: pdf or csv (default is pdf)
- headerLeftImage: The image to show at the left side of the report header of each page (base64 or url)
- headerRightImage: The image to show at the right side of the report header of each page (base64 or url)
- customReportType: Custom report type if needed. currently not used.
- pageSize: The report page size to generate. Possible: A4, A3, A5, letter (default A4).
- disableTopHeaders: true or "true" to disable the top headers and show icons in the footer. (default false)
- chromiumPath: a custom chromium or chrome path. The service searches for installed chromium or chrome by order. Default usage by priority: Chromium -> Google Chrome Stable -> Google Chrome -> the default path '/usr/bin/chromium-browser'.

### Example:
- npm run production
- npm run make
- `/reportsServer-macos templates/incidentDailyReportTempalte.json dist/incidentDailyReportTempalte.pdf dist portrait 4000 pdf '' '' '' A4 '' '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'`

### Running on MacOS Locally:
You can use npm script:
```
npm run test:macos
```

## Debugging
- Download the [mamba-reports.patch](https://github.com/demisto/sane-reports/files/7072628/mamba-reports.patch.txt)
- Apply the patch (In WebStorm: git -> patch -> apply patch...)
- Debug the server and add a breakpoint in the beginning of the method `servicereport.go/generatePdfReport`
- genereta a PDF report from the UI (web-client)
- when it stops on the breakpoint:
  - refresh the files in `Debug/lib/temp` (right click -> reload from disk)
  - copy the last json content from the server folder to `incidentDailyReportTemplate.json`
  - while the project is running `(npm start)` the page will be auto-reloaded at `localhost:8082`

To debug the automation/docker image behind sane pdf reports, you can use your own automation with the `reports.pdf.script` setting (use in the troubleshooting tab).

## Demo
Reports templates (JSON) examples can be found in the [templates](https://github.com/demisto/sane-reports/blob/master/templates) folder.

Example reports outputs can be found in the [examples](https://github.com/demisto/sane-reports/blob/master/examples) folder.

## Create your own report template
You can edit existing report templates or create your own template.
Report templates are created in JSON format and includes sections.
Sections are ordered according to their row and column positions. 

**Section types**: Header, Divider, Date, Image, JSON, Markdown, Table, Text, Bar Chart, Line Chart, Pie Chart, HTML, List, Grouped List, Items Section.

Each section can have its own style (camled case css style: font-size -> fontSize).
##### Important notice:
**HTML sections use `dangerouslySetInnerHTML` to set the given text as html. This method may cause a security risk, so before using, please validate the source of the text, and use with cautious at your own risk.**

## Contributor License Agreement
Contributions are welcome and appreciated. To contribute follow the [Quick Start](#quick-start) section and submit a PR. 

Before merging any PRs, we need all contributors to sign a contributor license agreement. By signing a contributor license agreement, we ensure that the community is free to use your contributions.

When you open a new pull request, a bot will evaluate whether you have signed the CLA. If required, the bot will comment on the pull request, including a link to accept the agreement. The CLA document is also available for review as a [PDF](https://github.com/demisto/content/blob/master/docs/cla.pdf).

## License
demisto/sane-reports is licensed under the [Apache License 2.0](https://github.com/demisto/sane-reports/blob/master/LICENSE)


