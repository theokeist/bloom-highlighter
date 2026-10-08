const fs = require('node:fs');
const path = require('node:path');
const { Resvg } = require('@resvg/resvg-js');
const directory = path.join(__dirname, '../media/icons');
fs.mkdirSync(directory, { recursive: true });
const svg = fs.readFileSync(path.join(__dirname, '../media/branding/bloom-neutral-gold-purple.svg'), 'utf8');
fs.writeFileSync(path.join(directory, 'store-icon.svg'), svg.replace('width="256" height="256"', 'width="512" height="512"'));
fs.writeFileSync(path.join(directory, 'icon.png'), new Resvg(svg, { fitTo: { mode: 'width', value: 512 } }).render().asPng());
for (const name of ['bloom-gold-purple-banner', 'bloom-gold-purple-social']) {
    const source = path.join(__dirname, '../media/branding', name);
    fs.writeFileSync(source + '.png', new Resvg(fs.readFileSync(source + '.svg')).render().asPng());
}
