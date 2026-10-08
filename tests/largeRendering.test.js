const test = require('node:test');
const assert = require('node:assert/strict');
const { performance } = require('node:perf_hooks');
const { setTimeout: delay } = require('node:timers/promises');
const { installMock } = require('./vscodeMock');
const { largeFile } = require('./largeFileFixture');
const mock = installMock();
const { BloomPainter, ViewMode } = require('../out/painter/styler');
const { UniversalLoader } = require('../out/core/loader');
const { AnalysisService } = require('../out/core/analysisService');
const schemas = require('../out/core/definitions.json');
const modes = Object.values(ViewMode);

function viewport(editor, line) {
    editor.visibleRanges = [new mock.vscode.Range(new mock.vscode.Position(line, 0), new mock.vscode.Position(line + 40, 0))];
}
function instrument(editor) {
    const set = editor.setDecorations.bind(editor);
    const trace = { blankFrames: 0, writes: 0, maxRanges: 0 };
    editor.setDecorations = (type, ranges) => {
        set(type, ranges);
        trace.writes++;
        const count = [...editor.decorations.values()].reduce((total, spans) => total + spans.length, 0);
        if (!count) trace.blankFrames++;
        trace.maxRanges = Math.max(trace.maxRanges, ranges.length);
    };
    return trace;
}

for (const language of ['typescript', 'dart', 'python']) {
    for (const lines of [3600, 6000, 12000]) {
        test(`${language}: ${lines} lines retain highlights through scrolling, switching, edits and split editors`, async t => {
            UniversalLoader.loadStatic(schemas);
            mock.vscode.window.visibleTextEditors = [];
            const text = largeFile(lines, language);
            assert.ok(text.length < mock.settings.maxFileSize, 'Fixture must be rendered, not skipped');
            const doc = mock.document(text, language);
            assert.equal(doc.lineCount, lines);
            const first = mock.editor(doc);
            const second = mock.editor(doc);
            viewport(first, 100);
            viewport(second, lines - 200);
            const painter = new BloomPainter();
            const analyzer = new AnalysisService();
            t.after(() => { painter.dispose(); analyzer.dispose(); });
            const start = performance.now();
            const prepared = await analyzer.analyze(doc, true);
            const analysisMs = performance.now() - start;
            painter.update(first, false, prepared);
            painter.update(second, false, prepared);
            const traces = [instrument(first), instrument(second)];
            const times = [];
            for (let step = 0; step < 64; step++) {
                viewport(first, 60 + ((step * 47) % (lines - 150)));
                viewport(second, lines - 120 - ((step * 31) % (lines - 150)));
                const began = performance.now();
                painter.setMode(modes[step % modes.length]);
                times.push(performance.now() - began);
                const writes = first.writes + second.writes;
                painter.update(first);
                painter.update(second);
                assert.equal(first.writes + second.writes, writes, 'Unchanged viewport must produce zero writes');
            }
            mock.settings.speed = 25;
            painter.setMode(ViewMode.Operational, false);
            const writes = first.writes;
            painter.update(first, true);
            assert.equal(first.writes, writes, 'Delayed replacement must retain its complete prior frame');
            doc.edit(text.replace('count = value', 'count = value + 1'));
            await delay(40);
            assert.equal(first.writes, writes, 'Stale delayed frame must never commit');
            mock.settings.speed = 0;
            const edited = await analyzer.analyze(doc, true);
            painter.update(first, false, edited);
            painter.update(second, false, edited);
            for (const trace of traces) {
                assert.equal(trace.blankFrames, 0, 'No decoration update may expose an empty frame');
                assert.ok(trace.maxRanges < 1000, 'Decoration volume must stay bounded to the viewport');
            }
            times.sort((a, b) => a - b);
            t.diagnostic(JSON.stringify({ language, lines, characters: text.length, analysisMs: +analysisMs.toFixed(2),
                splitEditorRenderMedianMs: +times[32].toFixed(2), splitEditorRenderP95Ms: +times[60].toFixed(2),
                blankDecorationFrames: traces.reduce((sum, trace) => sum + trace.blankFrames, 0),
                maxRangesPerWrite: Math.max(...traces.map(trace => trace.maxRanges)) }));
        });
    }
}


test('3600-line edits install new semantic colors before removing the previous category', () => {
    UniversalLoader.loadStatic(schemas);
    mock.vscode.window.visibleTextEditors = [];
    const document = mock.document('throw new Error();\n'.repeat(3600));
    const editor = mock.editor(document);
    viewport(editor, 1500);
    const painter = new BloomPainter();
    painter.update(editor);
    const set = editor.setDecorations.bind(editor);
    let semanticBlankStates = 0;
    editor.setDecorations = (type, ranges) => {
        set(type, ranges);
        const semantic = [...editor.decorations].filter(([decoration]) => decoration.options.color);
        if (!semantic.some(([, spans]) => spans.length)) semanticBlankStates++;
    };
    document.edit('return;\n'.repeat(3600));
    painter.update(editor);
    assert.equal(semanticBlankStates, 0, 'New categories must be populated before obsolete ones are emptied');
    painter.dispose();
});
