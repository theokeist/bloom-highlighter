# Bloom Highlighter audit

Reviewed 2026-10-05. Scope: source, shipped JavaScript, Markdown schemas, compiled definitions, manifest, and validation setup. Application code was not modified.

## Findings

| Priority | Finding | Evidence and impact |
| --- | --- | --- |
| High | Disable setting does nothing | `package.json:70` exposes `bloom.enabled`; the active entry point and painter never read it. A mocked editor still received dimming and highlights with configuration returning `enabled=false`. Add configuration handling and clear every affected editor when disabled. |
| High | Non-code documents receive TypeScript highlighting | `src/core/loader.ts:116` falls back to TypeScript for any unknown language, and the painter has no language guard. After activation, switching to Markdown/plain text can dim and highlight prose. Confirmed `getSchema('markdown').id === 'typescript'`. Unsupported languages should return no schema and receive no decorations. |
| High | Code matching includes comments and strings | `src/painter/styler.ts:172` runs regexes against the complete document. A comment containing `if`/`return` and a string containing `throw` produced semantic highlights. `src/core/depthTracker.ts:23` also treats literal/comment braces as real scopes. A string containing an opening brace incorrectly deepened following code until a comment containing a closing brace closed the invented block. Introduce language-aware token exclusion shared by semantic matching and depth analysis. |
| High | Compound mutation patterns are malformed | All four `definitions/*.md:15` contain escaped alternation separators. On `x += 1; y -= 2; z *= 3; a /= 2; b++; c--;`, mutation matching returned only four `=` characters, never the compound operators or increment/decrement. Confirmed against both compiled JSON and Markdown loading. Correct the escaping convention and test complete operator ranges. |
| Medium | Bare return statements are missed | `typescript.md:20`, `python.md:20`, and `ruby.md:20` require an expression following `return`. Confirmed no guard match for bare `return`, and no TypeScript match for `return;`. Python/Ruby end-of-input alternatives also use an escaped dollar sign instead of an end anchor. Match the keyword independently; make expression highlighting a separate optional feature. |
| Medium | Ruby symbolic logic is missed | `ruby.md:10` surrounds symbolic operators with word boundaries. Confirmed no matches for `a && b || !c`. Separate word operators from punctuation operators. |
| Medium | C/C++ preprocessor directives are missed | `cpp.md:40` places a word boundary before `#include`, `#define`, etc. Confirmed no structural match for normal directives at the beginning of a line. Match directives with a separate line-aware pattern. |
| Medium | Block analysis is not language-aware | `depthTracker.ts` only understands braces. A nested Python function/conditional put all three lines at depth zero. Ruby `def`/`end` blocks are likewise not represented. Python dictionary braces can be misinterpreted as scope depth. Use indentation for Python and keyword blocks for Ruby. |
| Medium | Structural range expansion depends on brace placement | `styler.ts:140-141,182` indexes blocks by the opening-brace line and looks up the declaration's line. For `class A` followed by a brace on the next line, the structural highlight covered only `class`, not the body. Multiple blocks beginning on the same line also overwrite each other. Associate declarations with actual scope ranges rather than one block per line. |
| Medium | Schema reload retains stale decoration styles | `styler.ts:45` compares schema IDs only. Replacing a TypeScript schema with new styles created zero new decoration types, so the old styles remained cached. The changelog's schema-refresh claim is not fully implemented. Cache by schema revision or identity and clear removed categories. |
| Medium | Speed setting is disconnected from active behavior | `bloom.speed` is read only by `core/sequencer.ts`, which the active entry point never calls. `BloomPainter.update()` renders all stages synchronously. Changing speed has no effect. Decide whether progressive animation remains a feature; connect a cancellable sequence or remove the setting. |
| Medium | Split editors can show inconsistent state | `extension.ts:88` updates only the active editor on document edits. `styler.ts:89` refreshes only the active editor on mode changes, while disposing block decoration types shared by other editors. Inactive visible editors can retain old semantic highlights and lose washes. Update visible editors and handle visibility changes. This finding follows event/control-flow inspection; it was not tested in a live extension host. |
| Medium | Default shortcuts occupy common editor keys | `package.json:48-58` binds Ctrl+O, Ctrl+I, and Ctrl+P whenever editor text has focus. These overlap familiar editor actions. Prefer distinctive chords and an extension-enabled context condition. Actual resolution against other installed bindings was not tested. |
| Low | Internal category is unreachable | All four schemas define `internal`, but `styler.ts:99-112` never includes it in any view. The documented feature cannot be displayed. Add it deliberately to a mode or expose category selection. |
| Low | New-language support requires more than one Markdown file | Build compilation discovers schemas, but activation events remain a fixed language list. A new language alone will not activate the extension until another activation event occurs. Document or generate activation coverage alongside schemas. |

## Validation and maintenance gaps

- `npm.cmd test` stopped during pretest because `tsc` is unavailable in this checkout; there is no installed dependency directory.
- The configured test target `out/test/runTest.js` does not exist, and there is no `src/test` directory. Installing dependencies alone will not provide the advertised tests.
- `npm run lint` prints `skipping lint`. The ESLint configuration references TypeScript parser/plugin packages absent from the manifest.
- `npm run watch` only watches TypeScript compilation; Markdown changes do not regenerate `definitions.json`. Activation reads source Markdown if present, but there is no file watcher for live schema reload.
- Markdown parsing is duplicated in `core/loader.ts` and `scripts/compile-defs.js`. Build parsing accepts regex strings without validating them; runtime loading can fail later.
- The legacy parser/analyzer/scanner/sequencer and decoration modules are disconnected from the current entry point. Keeping two pipelines makes obsolete features appear implemented.
- The pending 50 ms update timer is not registered for disposal in `extension.ts`; it can run after painter disposal.
- The main matching loop does not advance on zero-length regex matches. A future schema with such a regex can hang the extension host. Current supplied schemas were not found to trigger this condition.

## Useful possibilities

1. **Reliable cognitive views:** preserve the three existing modes, but base them on shared language-aware token and scope information. Start by excluding comments/strings and correcting operator matching; expand semantic precision afterward.
2. **Focus the current function:** dim code outside the cursor's enclosing scope and retain useful local structure. This builds directly on scope analysis and makes the cognitive-focus idea more targeted.
3. **Personal view presets:** let users choose categories, dimming strength, and a default mode per language/workspace. A plain-text status-bar control can show the active mode and provide switching; simple text needs no badge treatment.
4. **Theme-aware palettes:** offer light, dark, high-contrast, and reduced-color choices, with configurable intensity. Fixed neon colors and a 0.4-opacity noise floor currently leave little control over readability.
5. **Definition authoring tools:** validate categories/styles/regexes, preview matches against fixtures, report malformed definitions, and provide a reload command. Share one parser between build and runtime.
6. **Large-file support:** cache analysis by document version, reuse it when changing views, decorate visible regions, and measure large generated/minified files before choosing performance limits. Current updates scan the full document after each typing debounce.
7. **Optional progressive bloom:** wire a cancellable animation to the existing speed setting and stop stale work on edits, editor switches, disable, or disposal. Provide an instant mode and reduced-motion preference.
8. **Honest language coverage:** create dedicated Java, C#, and PHP schemas instead of routing them to C++/TypeScript. Also align C/Objective-C activation events with loader aliases.

## Suggested order

1. Make disable work, skip unsupported languages, and fix supplied regexes.
2. Add small regression fixtures covering the reproduced failures and restore real test/lint commands.
3. Introduce language-aware token/scope analysis and consistent visible-editor updates.
4. Add readable palettes and presets, then cursor-scope focus and definition preview.
5. Measure performance before expanding animation or language coverage.

## Verification limits

Reproductions used Node.js with a minimal mocked VS Code API against the existing `out` modules. They establish matching, range, configuration, and cache behavior, but do not establish visual rendering or interaction inside a live VS Code extension host. No build or full test-suite success is claimed. Dependencies were not installed. No repository metadata was present in this project directory.
