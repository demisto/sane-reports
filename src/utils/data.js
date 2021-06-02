import { DATA_TYPES, INCIDENT_FIELDS, INCIDENT_SEVERITY } from '../constants/Constants';

function processIncidentData(data, fieldName) {
  let processedData = data;
  switch (fieldName) {
    case INCIDENT_FIELDS.severity:
      processedData = data.sort((a, b) => {
        let aValue = 0;
        let bValue = 0;
        const aName = a.name && a.name.toLowerCase();
        const bName = b.name && b.name.toLowerCase();
        if (aName && aName in INCIDENT_SEVERITY) {
          aValue = INCIDENT_SEVERITY[aName].value;
        }
        if (bName && bName in INCIDENT_SEVERITY) {
          bValue = INCIDENT_SEVERITY[bName].value;
        }
        return bValue - aValue;
      });
      break;
    default:
      break;
  }

  return processedData;
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
