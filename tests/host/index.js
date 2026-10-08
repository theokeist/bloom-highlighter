const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { performance } = require('node:perf_hooks');
const { setTimeout: delay } = require('node:timers/promises');
const vscode = require('vscode');
const { largeFile } = require('../largeFileFixture');
const { BloomPainter, ViewMode } = require('../../out/painter/styler');
const { AnalysisService } = require('../../out/core/analysisService');
const { UniversalLoader } = require('../../out/core/loader');

async function until(condition, message) {
    const deadline = performance.now() + 5000;
    while (!condition() && performance.now() < deadline) await delay(20);
    assert.ok(condition(), message);
}

exports.run = async () => {
    const result = { editor: vscode.version, scenarios: [], visualFramesVerified: false };
    const output = path.join(__dirname, 'result.json');
    const extension = vscode.extensions.all.find(item => item.packageJSON.name === 'bloom-highlighter');
    assert.ok(extension);
    await extension.activate();
    result.version = extension.packageJSON.version;
    const resource = vscode.workspace.workspaceFolders[0].uri;
    const configuration = vscode.workspace.getConfiguration('bloom', resource);
    assert.equal(configuration.inspect('dimOpacity').defaultValue, 0.65);
    assert.equal(configuration.inspect('speed').defaultValue, 0);
    await configuration.update('dimOpacity', 0.8, vscode.ConfigurationTarget.Workspace);
    assert.equal(vscode.workspace.getConfiguration('bloom', resource).get('dimOpacity'), 0.8);
    await configuration.update('dimOpacity', undefined, vscode.ConfigurationTarget.Workspace);
    result.workspaceDimmingWrite = 'passed';
    UniversalLoader.loadStatic(require('../../out/core/definitions.json'));
    const analyzer = new AnalysisService();
    try {
        for (const language of ['typescript', 'dart', 'python']) {
            for (const lines of [3600, 6000, 12000]) {
                const document = await vscode.workspace.openTextDocument({ language, content: largeFile(lines, language) });
                assert.equal(document.lineCount, lines);
                assert.ok(document.getText().length < configuration.get('maxFileSize'));
                const first = await vscode.window.showTextDocument(document, { viewColumn: vscode.ViewColumn.One, preview: false });
                const second = await vscode.window.showTextDocument(document, { viewColumn: vscode.ViewColumn.Beside, preview: false });
                await until(() => first.visibleRanges.length && second.visibleRanges.length, 'Split editor viewports must be ready');
                const painter = new BloomPainter();
                const records = [];
                const wrap = editor => {
                    const rangesByType = new Map();
                    const record = { writes: 0, blankDecorationStates: 0, maxRangesPerWrite: 0, watching: false };
                    records.push(record);
                    return {
                        get document() { return editor.document; },
                        get visibleRanges() { return editor.visibleRanges; },
                        setDecorations(type, ranges) {
                            editor.setDecorations(type, ranges);
                            rangesByType.set(type, ranges);
                            record.writes++;
                            record.maxRangesPerWrite = Math.max(record.maxRangesPerWrite, ranges.length);
                            if (record.watching && ![...rangesByType.values()].some(spans => spans.length)) record.blankDecorationStates++;
                        }
                    };
                };
                const editors = [wrap(first), wrap(second)];
                const analysisStart = performance.now();
                const prepared = await analyzer.analyze(document, true);
                const analysisMs = performance.now() - analysisStart;
                const times = [];
                try {
                    for (const editor of editors) painter.update(editor, false, prepared);
                    records.forEach(record => { record.watching = true; });
                    for (let step = 0; step < 32; step++) {
                        const line = 80 + ((step * 97) % (lines - 200));
                        const otherLine = lines - 100 - ((step * 53) % (lines - 200));
                        first.revealRange(new vscode.Range(line, 0, line + 1, 0), vscode.TextEditorRevealType.AtTop);
                        second.revealRange(new vscode.Range(otherLine, 0, otherLine + 1, 0), vscode.TextEditorRevealType.AtTop);
                        await until(() => first.visibleRanges.some(range => range.start.line <= line && range.end.line >= line) &&
                            second.visibleRanges.some(range => range.start.line <= otherLine && range.end.line >= otherLine),
                        `Scroll did not settle: first=${JSON.stringify(first.visibleRanges)}, second=${JSON.stringify(second.visibleRanges)}`);
                        painter.setMode(Object.values(ViewMode)[step % 4], false);
                        const began = performance.now();
                        editors.forEach(editor => painter.update(editor, false, prepared));
                        times.push(performance.now() - began);
                        const writes = records.reduce((sum, record) => sum + record.writes, 0);
                        editors.forEach(editor => painter.update(editor, false, prepared));
                        assert.equal(records.reduce((sum, record) => sum + record.writes, 0), writes);
                        assert.ok(first.visibleRanges.some(range => range.start.line <= line && range.end.line >= line), 'Real editor must scroll to requested line');
                    }
                    const edit = new vscode.WorkspaceEdit();
                    edit.insert(document.uri, new vscode.Position(0, 0), '// stress edit\n');
                    assert.ok(await vscode.workspace.applyEdit(edit));
                    const edited = await analyzer.analyze(document, true);
                    editors.forEach(editor => painter.update(editor, false, edited));
                    assert.ok(document.getText().startsWith('// stress edit'));
                    records.forEach(record => {
                        assert.equal(record.blankDecorationStates, 0);
                        assert.ok(record.maxRangesPerWrite < 1000);
                    });
                    times.sort((a, b) => a - b);
                    result.scenarios.push({ language, lines, characters: prepared.code.length, analysisMs: +analysisMs.toFixed(2),
                        splitEditorRenderMedianMs: +times[16].toFixed(2), splitEditorRenderP95Ms: +times[30].toFixed(2),
                        blankDecorationStates: records.reduce((sum, record) => sum + record.blankDecorationStates, 0),
                        maxRangesPerWrite: Math.max(...records.map(record => record.maxRangesPerWrite)),
                        realScrollAndEdit: 'passed', unchangedRepaintWrites: 0 });
                    fs.writeFileSync(output, JSON.stringify(result, null, 2));
                } finally {
                    painter.dispose();
                    await vscode.commands.executeCommand('workbench.action.revertAndCloseActiveEditor');
                    await vscode.commands.executeCommand('workbench.action.focusFirstEditorGroup');
                    await vscode.commands.executeCommand('workbench.action.revertAndCloseActiveEditor');
                }
            }
        }
        result.status = 'passed';
    } catch (error) {
        result.status = 'failed';
        result.error = String(error.stack || error);
        throw error;
    } finally {
        analyzer.dispose();
        fs.writeFileSync(output, JSON.stringify(result, null, 2));
    }
};
