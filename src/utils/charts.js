import { WIDGET_VALUES_FORMAT } from '../constants/Constants';

export function getFormattedGroup(group, valuesFormat) {
  if (valuesFormat !== WIDGET_VALUES_FORMAT.decimal) {
    return group.data;
  }

  return group.floatData ?? group.data;
}

export function getFormattedGroupValue(group, valuesFormat) {
  return getFormattedGroup(group, valuesFormat)?.[0];
}

