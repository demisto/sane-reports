import { DATA_TYPES, INCIDENT_FIELDS } from '../constants/Constants';
import { sortBySeverity } from './sort';

function processIncidentData(data, fieldName) {
  switch (fieldName) {
    case INCIDENT_FIELDS.severity:
      return sortBySeverity(data);
    default:
      return data;
  }
}

export function processData(dataType, data, groupByFields) {
  let processedData = data;
  const groupByField = Array.isArray(groupByFields) && groupByFields.length > 0 ? groupByFields[0] : null;

  switch (dataType) {
    case DATA_TYPES.incident:
      processedData = processIncidentData(data, groupByField);
      break;
    default:
      break;
  }

  return processedData;
}
