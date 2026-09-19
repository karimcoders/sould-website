#!/usr/bin/env node
/* content.json  →  src/content-defaults.js   (defaults ko content.json ke saath sync rakhta hai)
   Chalane ka tarika:  node tools/build-defaults.js   */
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const content = JSON.parse(fs.readFileSync(path.join(root, 'content.json'), 'utf8'));
const header = `/* Soul-D. — built-in default content.
   This is the safety net: if content.json (or the content server) is missing,
   the website still renders exactly this content.
   Regenerate with:  node tools/build-defaults.js
*/\n`;
fs.writeFileSync(path.join(root, 'src/content-defaults.js'),
  header + 'window.SOULD_DEFAULTS = ' + JSON.stringify(content, null, 2) + ';\n');
console.log('src/content-defaults.js updated from content.json');
