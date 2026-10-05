const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const manifestPath = path.join(root, 'package.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath));
const args = process.argv.slice(2);
const option = name => args.includes(name) ? args[args.indexOf(name) + 1] : undefined;
const repository = option('--repository');
const publisher = option('--publisher');
if (repository) {
    if (!/^[\w.-]+\/[\w.-]+$/.test(repository) || repository.startsWith('user/')) throw new Error('Use the real GitHub owner/repository.');
    manifest.repository = { type: 'git', url: `https://github.com/${repository}.git` };
    manifest.homepage = `https://github.com/${repository}#readme`;
    manifest.bugs = { url: `https://github.com/${repository}/issues` };
}
if (publisher) {
    if (!/^[a-zA-Z0-9][a-zA-Z0-9-]*$/.test(publisher)) throw new Error('Invalid Marketplace publisher ID.');
    manifest.publisher = publisher;
}
const url = typeof manifest.repository === 'string' ? manifest.repository : manifest.repository?.url;
const realRepository = /^https:\/\/github\.com\/(?!user\/)[\w.-]+\/[\w.-]+(?:\.git)?$/.test(url ?? '');
if (args.includes('--check')) {
    if (!realRepository || !manifest.publisher) throw new Error('Release identity missing: run npm run configure-release -- --repository OWNER/REPO --publisher PUBLISHER.');
    console.log(`Release identity: ${manifest.publisher}.${manifest.name}`);
    process.exit(0);
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
const repoUrl = realRepository ? url.replace(/\.git$/, '') : undefined;
const id = manifest.publisher && `${manifest.publisher}.${manifest.name}`;
const store = id ? `https://marketplace.visualstudio.com/items?itemName=${id}` : undefined;
const download = repoUrl ? `${repoUrl}/releases/latest/download/${manifest.name}-${manifest.version}.vsix` : `../${manifest.name}-${manifest.version}.vsix`;
const links = [store && `[Install from VS Code Marketplace](${store})`, id && `[Open in VS Code](vscode:extension/${id})`, repoUrl && `[Download VSIX](${download})`, '[Installation guide](INSTALL.md)'].filter(Boolean).join(' · ');
const readmePath = path.join(root, 'README.md');
let readme = fs.readFileSync(readmePath, 'utf8').replace(/\n<!-- install-links:start -->[\s\S]*?<!-- install-links:end -->\n/, '\n');
readme = readme.replace('# Bloom Syntax Highlighter', `# Bloom Syntax Highlighter\n\n<!-- install-links:start -->\n${links}\n\nThe GitHub download requires a published release with the matching VSIX asset.\n${!store ? '\nMarketplace installation will be available after a publisher ID is configured and this version is published.\n' : ''}<!-- install-links:end -->`);
fs.writeFileSync(readmePath, readme);
const button = (label, href) => href ? `<a class="button" href="${href}">${label}</a>` : `<span class="button disabled">${label} — coming after publishing</span>`;
fs.writeFileSync(path.join(root, 'docs/install.html'), `<!doctype html>
<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Install Bloom</title>
<style>body{font:17px system-ui;background:#101a2d;color:#f4f6fc;max-width:760px;margin:60px auto;padding:24px;line-height:1.6}img{width:96px}.button{display:inline-block;background:#fbbf24;color:#101a2d;padding:12px 18px;border-radius:8px;text-decoration:none;margin:6px 8px 6px 0;font-weight:600}.disabled{background:#28344a;color:#c8d1df}a{color:#72dcf0}code{overflow-wrap:anywhere}</style>
<img src="../media/icon.png" alt="Bloom flower"><h1>Bloom Syntax Highlighter</h1><p>Find flow, functions, structure and risky operations with four code views.</p>
${button('Install from Marketplace', store)}${button('Open in VS Code', id && `vscode:extension/${id}`)}${button('Download VSIX', download)}
<p>GitHub download becomes available when a release with the matching VSIX asset is published. Marketplace buttons require a published listing.</p>
<p>Requires desktop VS Code 1.95 or newer. For a downloaded VSIX, run <strong>Extensions: Install from VSIX…</strong>, select the file, then reload the window.</p>
<p>Open a code file and run <strong>Bloom: Show Sidebar</strong>. Use Interfaces for functions, Operational for flow, Structural for declarations, and Dangerous for lexical review cues.</p><p><a href="${repoUrl ? repoUrl + '/blob/main/INSTALL.md' : '../INSTALL.md'}">Full installation guide</a></p></html>`);
console.log('Generated README install links and docs/install.html. Marketplace links require publication before use.');
