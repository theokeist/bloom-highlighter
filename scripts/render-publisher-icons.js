const fs = require('node:fs');
const path = require('node:path');
const { Resvg } = require('@resvg/resvg-js');
const root = path.join(__dirname, '..');
const directory = path.join(root, 'media/publisher');
fs.mkdirSync(directory, { recursive: true });
const original = fs.readFileSync(path.join(root, 'media/store-icon.svg'), 'utf8');
const light = original.replaceAll('#101a2d', '#f4f7fb').replace('#22d3ee', '#0891b2')
    .replace('#fbbf24', '#d97706').replace('#f472b6', '#db2777').replace('#a78bfa', '#7c3aed').replace('#ff6b6b', '#e11d48');
const transparent = original.replace(/\s*<rect[^>]*\/>/, '');
const variants = { dark: original, light, transparent };
for (const [name, svg] of Object.entries(variants)) {
    fs.writeFileSync(path.join(directory, `publisher-${name}.svg`), svg);
    for (const size of [128, 256, 512]) {
        fs.writeFileSync(path.join(directory, `publisher-${name}-${size}.png`), new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng());
    }
}
const panels = Object.entries(variants).map(([name, svg], index) => {
    const artwork = svg.replace(/<svg[^>]*>|<\/svg>/g, '');
    return `<rect x="${index * 320}" width="320" height="380" fill="${name === 'dark' ? '#101a2d' : '#edf0f5'}"/><g transform="translate(${index * 320 + 40} 35) scale(10)">${artwork}</g><text x="${index * 320 + 160}" y="330" text-anchor="middle" font-family="Segoe UI,Arial" font-size="24" fill="${name === 'dark' ? '#edf2fb' : '#17243b'}">${name.charAt(0).toUpperCase() + name.slice(1)}</text>`;
}).join('');
fs.writeFileSync(path.join(directory, 'publisher-preview.png'), new Resvg(`<svg xmlns="http://www.w3.org/2000/svg" width="960" height="380">${panels}</svg>`).render().asPng());
fs.writeFileSync(path.join(directory, 'README.md'), '# Bloom publisher icons\n\nUse `publisher-dark-512.png` as the default publisher logo. Light and transparent variants are also supplied. Each variant has 128, 256 and 512 pixel PNG exports, plus an editable SVG. The transparent PNG has no background.\n\nRegenerate with `node scripts/render-publisher-icons.js`.\n');
console.log('Generated three publisher icon variants in three PNG sizes, plus editable SVGs.');
