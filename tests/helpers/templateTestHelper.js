const fs = require('fs');
const path = require('path');

export function loadTemplate(filename) {
  return JSON.parse(fs.readFileSync(path.resolve(`./templates/${filename}`),
    { encoding: 'utf8' }));
}
