const fs = require('node:fs');
const path = require('node:path');
const { parseMarkdown } = require('../out/core/schemaParser');
const directory = path.join(__dirname, '..', 'src', 'core', 'definitions');
const schemas = {};
for (const file of fs.readdirSync(directory).filter(f => f.endsWith('.md') && f !== 'FEATURES.md')) {
    const id = path.basename(file, '.md');
    schemas[id] = parseMarkdown(id, fs.readFileSync(path.join(directory, file), 'utf8'));
}
fs.writeFileSync(path.join(__dirname, '..', 'out', 'core', 'definitions.json'), JSON.stringify(schemas, null, 2));
console.log('Bloom: Compiled validated schemas');
