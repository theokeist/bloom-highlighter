const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vscode = require('vscode');
exports.run = async () => {
    const extension = vscode.extensions.all.find(item => item.packageJSON.name === 'bloom-highlighter');
    assert.ok(extension);
    await extension.activate();
    const resource = vscode.workspace.workspaceFolders[0].uri;
    const configuration = vscode.workspace.getConfiguration('bloom', resource);
    assert.equal(configuration.inspect('dimOpacity').defaultValue, 0.65);
    await configuration.update('dimOpacity', 0.8, vscode.ConfigurationTarget.Workspace);
    assert.equal(vscode.workspace.getConfiguration('bloom', resource).get('dimOpacity'), 0.8);
    await configuration.update('dimOpacity', undefined, vscode.ConfigurationTarget.Workspace);
    fs.writeFileSync(path.join(__dirname, 'result.json'), JSON.stringify({ version: extension.packageJSON.version, workspaceDimmingWrite: 'passed' }));
};
