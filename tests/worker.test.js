const test = require('node:test');
const assert = require('node:assert/strict');
const { setTimeout: delay } = require('node:timers/promises');
const { AnalysisService } = require('../out/core/analysisService');

function document(text) {
    return { version: 1, languageId: 'typescript', fileName: '/sample.ts', getText: () => text,
        edit(next) { text = next; this.version++; } };
}

test('worker analysis yields the main thread and caches unchanged versions', async t => {
    const service = new AnalysisService();
    t.after(() => service.dispose());
    const doc = document('const text = "throw";\n' + 'function f() { return 1; }\n'.repeat(3000));
    const pending = service.analyze(doc, true);
    assert.equal(service.analyze(doc, true), pending);
    let resolved = false;
    pending.then(() => { resolved = true; });
    await delay(0);
    assert.equal(resolved, false, 'The worker must not block the main thread until parsing completes');
    const analysis = await pending;
    assert.equal(analysis.code.includes('throw'), false);
    assert.ok(analysis.code.includes('return'));
    assert.equal(service.analyze(doc, true), pending);
});

test('queued draft replacements resolve obsolete requests without publishing their content', async t => {
    const service = new AnalysisService();
    t.after(() => service.dispose());
    const busy = service.analyze(document('const n = 1;'.repeat(3000)), true);
    const doc = document('const oldDraft = 1;');
    const old = service.analyze(doc, true);
    doc.edit('const latestDraft = 2;');
    const latest = service.analyze(doc, true);
    assert.equal(await old, undefined);
    await busy;
    const result = await latest;
    assert.ok(result.code.includes('latestDraft'));
    assert.equal(result.code.includes('oldDraft'), false);
});

test('cancelled and disposed requests settle without repaintable results', async () => {
    const service = new AnalysisService();
    const doc = document('return;');
    const first = service.analyze(doc, true);
    service.cancel(doc);
    assert.equal(await first, undefined);
    const second = service.analyze(doc, true);
    service.dispose();
    assert.equal(await second, undefined);
    assert.equal(await service.analyze(doc, true), undefined);
});

test('unexpected worker exit settles active and queued requests', async t => {
    const service = new AnalysisService();
    t.after(() => service.dispose());
    const active = service.analyze(document('const n = 1;'.repeat(3000)), true);
    const queued = service.analyze(document('return 2;'), true);
    const settled = Promise.allSettled([active, queued]);
    await service.worker.terminate();
    const results = await Promise.race([settled, delay(1000).then(() => undefined)]);
    assert.ok(results, 'Worker exit must settle every pending analysis request');
    assert.ok(results.every(result => result.status === 'rejected'));
    assert.equal(await service.analyze(document('return 3;'), true), undefined);
});
