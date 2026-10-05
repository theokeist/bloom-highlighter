const fs = require('node:fs');
const path = require('node:path');
const { Resvg } = require('@resvg/resvg-js');
const directory = path.join(__dirname, '../media');
const svg = fs.readFileSync(path.join(directory, 'store-icon.svg'));
fs.writeFileSync(path.join(directory, 'icon.png'), new Resvg(svg).render().asPng());
