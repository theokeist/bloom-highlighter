# What improved in Bloom 0.10.0

## New in 0.11.0: Dart and broader language coverage

Dart/Flutter source now receives dedicated cognitive patterns with lexical handling for raw/multiline strings, nested comments and interpolation. Bloom also enables baseline views in 32 additional common coding languages, including Java, C#, Go, Rust, Kotlin, Swift, PHP, shell and SQL. Startup activation removes the need to open a JS/TS file first. See the [complete coverage list](../README.md#languages-and-accuracy).

Baseline support uses common category patterns and language-family masking rather than complete semantic parsers. It does not promise exact handling of every language-specific literal, block or framework. Dart support likewise does not resolve Flutter widget APIs across a project. Prose and configuration files remain unaffected.

Version 0.10.0 focuses on more accurate emphasis, supported component files and responsive analysis. The comparison below describes the earlier 0.9.1 pipeline and the current implementation.

| Area | Earlier behavior | Improvement and practical effect |
| --- | --- | --- |
| Comments and literals | Keyword patterns could highlight words inside comments and strings. | JS/TS and component parsing exclude comments, literal strings, regular expressions and template prose, reducing misleading emphasis. |
| Frameworks | No dedicated component-aware parsing. | React/JSX/TSX, Vue and Svelte recognize supported APIs, tags, directives and expressions; aliases and local shadowing are handled. |
| Disable and unsupported files | Disable was ignored and unknown languages fell back to TypeScript. | Disabling clears highlights; unsupported files retain ordinary syntax highlighting. |
| Operator matching | Compound mutation patterns could match only part of an operator. | Full mutation operator ranges, bare returns, Ruby symbolic logic and C/C++ directives are recognized. |
| Scope analysis | Braces alone drove depth, including braces in literals. | Language-aware ranges handle multiline declarations, Python indentation and common Ruby blocks. |
| Typing responsiveness | The active pipeline scanned on the extension thread. | Analysis runs in a worker, caches unchanged document versions, replaces queued drafts and discards stale results. |
| Large files and scrolling | Full-file rendering lacked a size guard. | A configurable file-size limit and decorations limited to visible lines plus a margin reduce rendering work. |
| Split editors and reloads | Views and cached styles could become inconsistent. | Visible splits refresh together and schema reloads recreate decoration styles. |
| Controls | Common editor keys were occupied; the speed setting was disconnected. | Distinctive view chords, a plain-text picker/status control, workspace view persistence and working view-change delays. |
| Readability | Fixed styling gave little control over emphasis. | Configurable dimming and light-theme colors; code tokens use no pill or badge borders. |
| Maintenance | Test/lint commands and definition compilation had gaps. | Actual automated tests and lint, a shared validated Markdown parser and definition watching. |

## Does this make coding faster?

Bloom aims to make finding and understanding relevant code easier. Operational draws attention to flow and changes, Interfaces to contracts and component APIs, and Structural to declarations and organization. That may shorten the reading and navigation portion of an edit, especially in unfamiliar files.

It does not produce code, autocomplete expressions or prove correctness. No controlled productivity benchmark has been run, so there is no supported percentage speedup or guarantee. For immediate view changes, use `bloom.speed: 0`; this removes the configured bloom delay, rather than accelerating your compiler or tests. Follow [the usage workflow](USAGE.md) to evaluate it on your own tasks.

## Verification and limits

The 0.10.0 release passed compilation, lint and 31 automated tests. Fourteen painter/worker tests also passed against an extracted VSIX, checking that shipped modules and runtime dependencies work together.

VS Code interactions are exercised with a mocked API. Live extension-host visual verification remains outstanding. Framework recognition is local to the file; re-exported wrappers and auto-imports are not resolved across projects. Vue Pug templates and scripts needing custom preprocessors are skipped. Python, Ruby and C-family support uses conservative rules rather than complete semantic parsers.

Install using [INSTALL.md](../INSTALL.md). See [CHANGELOG.md](../CHANGELOG.md) for release history.
# Version 0.13.0

- Individual language vocabularies and language-wide category switches.
- Expandable category colors, including custom hex colors and reset to defaults.
- Dangerous view and an optional Strong danger focus switch.
- A 512 × 512 store icon, alongside the existing Activity Bar icon.
- Dimming save failures offer a window reload to refresh installed configuration registration.
