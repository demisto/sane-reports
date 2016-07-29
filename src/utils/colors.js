import seedrandom from 'seedrandom';

const graphColors = [
  '#6b18be',
  '#297ead',
  '#30ae29',
  '#b13681',
  '#198a70',
  '#c096f0',
  '#9ed3f1',
  '#a3f1A0',
  '#8ec3b6',
  '#edb0d4',
  '#8310e8',
  '#3aabe8',
  '#45e83a'
];

export function getGraphColorByName(name, existingColors = {}) {
  const rnd = seedrandom(name);
  let color = '#000000';
  for (let i = 0; i < graphColors.length * 4; i++) {
    const rndIdx = Math.floor(rnd() * graphColors.length);
    const candidate = graphColors[rndIdx];
    if (!existingColors[candidate.toLowerCase()]) {
      color = candidate;
      break;
    }
  }
  return color;
}
