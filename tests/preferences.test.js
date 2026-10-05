const test = require('node:test');
const assert = require('node:assert/strict');
const { installMock } = require('./vscodeMock');
const mock = installMock();
const preferences = require('../out/preferences');
const schemas = require('../out/core/definitions.json');
const { analyzeCode } = require('../out/core/languageAnalysis');
test('language switches and colors persist without changing other languages', async () => {
    mock.settings.languageSettings = { python: { enabled: true } };
    const dart = mock.document('Process.run("tool", []);', 'dart');
    await preferences.updateLanguagePreferences(dart, () => ({ enabled: false, categories: { danger: false }, colors: { danger: '#123456' } }));
    assert.equal(preferences.highlightingEnabled(dart), false);
    assert.equal(preferences.categoryEnabled(dart, 'danger'), false);
    assert.equal(preferences.categoryColor(dart, 'danger'), '#123456');
    assert.equal(preferences.highlightingEnabled(mock.document('', 'python')), true);
});
test('danger rules exclude comments and literals and match repeated Dart calls', () => {
    const text = 'Process.run("tool", []); // Process.run\nProcess.start("tool", []); final s = "Process.run";';
    const code = analyzeCode(text, 'dart').code;
    assert.equal([...code.matchAll(new RegExp(schemas.dart.danger.regex, 'g'))].length, 2);
    assert.notEqual(schemas.go.structural.regex, schemas.java.structural.regex);
    assert.notEqual(schemas.javascript.interface.regex, schemas.typescript.interface.regex);
});
test('manifest registers dimming and packages a 512 pixel store icon', () => {
    const manifest = require('../package.json');
    assert.equal(manifest.contributes.configuration.properties['bloom.dimOpacity'].scope, 'resource');
    const png = require('node:fs').readFileSync(require('node:path').join(__dirname, '..', manifest.icon));
    assert.equal(png.readUInt32BE(16), 512);
    assert.equal(png.readUInt32BE(20), 512);
});
test('function rules highlight names without consuming arguments, bodies, comments or prose', () => {
    const text = 'void render(int value) { if (value > 0) calculate(value); } // fake()\nfinal s = "hidden()";';
    const code = analyzeCode(text, 'dart').code;
    assert.deepEqual([...code.matchAll(new RegExp(schemas.dart.functions.regex, 'g'))].map(match => match[0]), ['render', 'calculate']);
    for (const language of ['typescript', 'python', 'go', 'rust']) {
        assert.deepEqual([...analyzeCode('calculate(value)', language).code.matchAll(new RegExp(schemas[language].functions.regex, 'g'))].map(match => match[0]), ['calculate']);
    }
});
