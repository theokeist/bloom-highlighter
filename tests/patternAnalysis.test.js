const test = require('node:test');
const assert = require('node:assert/strict');
const { analyzeCode } = require('../out/core/languageAnalysis');
const { categorySpans } = require('../out/core/patternAnalysis');
const { UniversalLoader } = require('../out/core/loader');
UniversalLoader.loadStatic(require('../out/core/definitions.json'));
function classify(text, language = 'dart', frameworks = false) {
    const analysis = analyzeCode(text, language, frameworks);
    const schema = UniversalLoader.getSchema(language);
    return key => categorySpans(analysis, schema, key).map(span => text.slice(span.start, span.end));
}
test('arbitrary Dart composition and callbacks need no library recognition', () => {
    const text = `final tree = PrivatePanel<Item>(child: OwnWidget.named(), onAction: () { if (count != 0) count += 1; });`;
    const spans = classify(text);
    assert.deepEqual(spans('logic'), ['!=']);
    assert.deepEqual(spans('mutation'), ['+=']);
    assert.deepEqual(spans('alert'), []);
    assert.ok(spans('functions').includes('PrivatePanel'));
    assert.ok(spans('functions').includes('named'));
    assert.ok(spans('functions').includes('onAction'));
});
test('Dart nullable types and initializers remain distinct from decisions and writes', () => {
    const spans = classify(`late Item? value = make(); var count = 0; count = 1; return count = 2; final x = flag ? count = 3 : count = 4;`);
    assert.deepEqual(spans('mutation'), ['=', '=', '=', '=']);
    assert.deepEqual(spans('logic'), ['?', ':']);
    assert.ok(spans('structural').includes('late'));
    assert.ok(spans('structural').includes('var'));
});
test('TypeScript syntax separates custom calls, types, arrows, declarations and writes', () => {
    const spans = classify(`let count: number = 0; const tree = Custom<Node>({ child: other(), onAction: () => { if (count !== 0) count += 1; } }); obj.return(); count >>= 1;`, 'typescript');
    assert.deepEqual(spans('logic'), ['!==']);
    assert.deepEqual(spans('mutation'), ['+=', '>>=']);
    assert.deepEqual(spans('alert'), []);
    assert.ok(spans('functions').includes('Custom'));
    assert.ok(spans('functions').includes('onAction'));
    assert.ok(spans('functions').includes('=>'));
    assert.equal(spans('guards').includes('return'), false);
});
test('unknown calls do not acquire inferred effects or danger', () => {
    const spans = classify('CustomWidget(); strangeEffect(); mutateSomething();');
    assert.deepEqual(spans('mutation'), []);
    assert.deepEqual(spans('danger'), []);
});
test('optional enrichment distinguishes derived values from lifecycle effects', () => {
    const spans = classify(`import { useMemo, useEffect } from 'react'; const x = useMemo(() => 1, []); useEffect(() => {}, []);`, 'typescript', true);
    assert.ok(spans('logic').includes('useMemo'));
    assert.ok(spans('guards').includes('useEffect'));
    assert.equal(spans('guards').includes('useMemo'), false);
});
