export const REPORT_DATA_TOKEN = '{report-data-to-replace}';
export const REPORT_HEADER_IMAGE_RIGHT_TOKEN = '{report-header-image-right}';
export const REPORT_HEADER_IMAGE_LEFT_TOKEN = '{report-header-image-left}';


export const SECTION_TYPES = {
  globalSection: 'globalSection',
  header: 'header',
  text: 'text',
  html: 'html',
  list: 'list',
  trend: 'trend',
  number: 'number',
  markdown: 'markdown',
  placeholder: 'placeholder',
  date: 'date',
  image: 'image',
  chart: 'chart',
  table: 'table',
  duration: 'duration',
  json: 'json',
  divider: 'divider',
  logo: 'logo',
  itemsSection: 'itemsSection'
};

export const CHART_TYPES = {
  bar: 'bar',
  column: 'column',
  pie: 'pie',
  line: 'line'
};

export const REPORT_TYPES = {
  pdf: 'pdf',
  csv: 'csv'
};

export const TABLE_CELL_TYPE = {
  image: 'image'
};

export const DEFAULT_MAX_LENGTH = 300;

export const CHART_LAYOUT_TYPE = {
  horizontal: 'horizontal',
  vertical: 'vertical'
};

export const WIDGET_DEFAULT_CONF = {
  lineHeight: 22,
  tickAngle: -40,
  tickMaxChars: 10,
  font: '12px Source Sans Pro',
  size: 10,
  sizeThresholdWarning: 100,
  showOthers: true,
  otherGroup: 'Other'
};

export const DURATION_FORMAT = {
  min: {
    name: 'min',
    weight: 60
  },
  hours: {
    name: 'hours',
    weight: 3600
  },
  days: {
    name: 'days',
    weight: 3600 * 24
  },
  weeks: {
    name: 'weeks',
    weight: 3600 * 24 * 7
  },
  months: {
    name: 'months',
    weight: 3600 * 24 * 30.42
  },
  years: {
    name: 'years',
    weight: 3600 * 24 * 365.24
  }
};

export const WIDGET_DURATION_FORMAT = {
  days: 'days',
  weeks: 'weeks',
  months: 'months',
  years: 'years'
};

export const WIDGET_FORMAT_PARTS = {
  [WIDGET_DURATION_FORMAT.days]: [DURATION_FORMAT.days, DURATION_FORMAT.hours, DURATION_FORMAT.min],
  [WIDGET_DURATION_FORMAT.weeks]: [DURATION_FORMAT.weeks, DURATION_FORMAT.days, DURATION_FORMAT.hours],
  [WIDGET_DURATION_FORMAT.months]: [DURATION_FORMAT.months, DURATION_FORMAT.weeks, DURATION_FORMAT.days],
  [WIDGET_DURATION_FORMAT.years]: [DURATION_FORMAT.years, DURATION_FORMAT.months, DURATION_FORMAT.weeks]
};

export const QUERIES_TIME_FORMAT = 'DD MMM Y';
export const SUPPORTED_TIME_FRAMES = {
  days: 'days',
  hours: 'hours',
  minutes: 'minutes',
  years: 'years',
  quarters: 'quarters',
  months: 'months'
};
export const GRID_LAYOUT_COLUMNS = 12;
export const CHART_LEGEND_ITEM_HEIGHT = 26;

export const NONE_VALUE_DEFAULT_NAME = 'None';

export const RADIANS = Math.PI / 180;

export const SECTION_ITEMS_DISPLAY_LAYOUTS = {
  row: 'row',
  card: 'card'
};

export const SECTION_ITEM_TYPE = {
  html: 'html',
  text: 'text'
};

export const PAGE_BREAK_KEY = '\\pagebreak';

export const PIXEL_SIZE = 3.779527559055;

export const A4_DIMENSIONS = { width: 210 * PIXEL_SIZE, height: 297 * PIXEL_SIZE };

export const WIDGET_VALUES_FORMAT = {
  abbreviated: 'abbreviated',
  regular: 'regular',
  decimal: 'decimal',
  percentage: 'percentage'
};
