const fs = require('node:fs');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const compiler = spawn(process.execPath, [require.resolve('typescript/lib/tsc.js'), '-watch', '-p', root], {
    cwd: root, stdio: 'inherit', windowsHide: true
});
const directory = path.join(root, 'src', 'core', 'definitions');
let pending;
const watcher = fs.watch(directory, () => {
    clearTimeout(pending);
    pending = setTimeout(() => {
        const result = spawnSync(process.execPath, [path.join(__dirname, 'compile-defs.js')], {
            cwd: root, stdio: 'inherit', windowsHide: true
        });
        if (result.status !== 0) console.error('Definitions were not updated; correct the reported error and save again.');
    }, 100);
});
function stop() {
    clearTimeout(pending);
    watcher.close();
    compiler.kill();
}
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
compiler.on('exit', () => { watcher.close(); clearTimeout(pending); });
