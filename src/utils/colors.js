import seedrandom from 'seedrandom';
import { hash } from './hash';
import { NONE_VALUE_DEFAULT_NAME } from '../constants/Constants';

export const DEFAULT_NONE_COLOR = '#999999';

const graphColors = ['#E57373', '#FF1D1E', '#FF5000', '#E55100', '#D74315', '#F06292', '#FF3F81',
  '#F50057', '#C2195B', '#E91D63', '#AD1457', '#CE93D8', '#EA80FC', '#FA99D0', '#FD5BDE', '#D500F9', '#AA00FF',
  '#BA68C8', '#B287FE', '#9575CD', '#AB47BC', '#8E24AA', '#8052F3', '#9FA8DA', '#7C71F5', '#536DFE', '#5C6BC0',
  '#3F51B5', '#6200EA', '#A3C9FF', '#64B5F6', '#03B0FF', '#2196F3', '#2979FF', '#295AFF', '#B7E7FF', '#81D4FA',
  '#80DEEA', '#00B8D4', '#039BE5', '#0277BD', '#1AEADE', '#18DEE5', '#00E5FF', '#4DD0E1', '#4DB6AC', '#0097A7',
  '#0097A7', '#64DC17', '#00E676', '#00C853', '#20B358', '#4CAF50', '#C5FE01', '#ADE901', '#50EB07', '#AED581',
  '#8BC34A', '#69A636', '#EDFE41', '#FFEA00', '#FFD740', '#F9A825', '#FB8C00', '#FF7500', '#DBDBDB', '#CFD8DC',
  '#9EB6C3', '#B2B7B9', '#989898', '#90A4AE'];

export function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const newHex = hex.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(newHex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function getGraphColorByName(value, existingColors = {}) {
  if (!value || value === NONE_VALUE_DEFAULT_NAME) {
    return DEFAULT_NONE_COLOR;
  }

  const index = hash(value) % graphColors.length;
  const candidate = graphColors[index];
  if (!existingColors[candidate]) {
    return candidate;
  }

  const rnd = seedrandom(name);
  const randomOpacity = rnd() + 0.01;
  const result = hexToRgb(candidate);
  return `rgba(${result.r}, ${result.g}, ${result.b}, ${randomOpacity})`;
}
