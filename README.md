# Bloom Syntax Highlighter

[![Build status](https://github.com/theokeist/bloom-highlighter/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/theokeist/bloom-highlighter/actions/workflows/ci.yml)
[![Source version](https://img.shields.io/github/package-json/v/theokeist/bloom-highlighter?label=version)](https://github.com/theokeist/bloom-highlighter/blob/main/package.json)

![Bloom: four views, customizable colors and language-wide switches](https://raw.githubusercontent.com/theokeist/bloom-highlighter/main/media/store/bloom-overview.png)

Make code easier to read. Bloom brings flow, functions and structure into focus while you code in VS Code.

<!-- install-links:start -->
[Install from VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=theokeist-hcode-org.bloom-highlighter) · [Open in VS Code](vscode:extension/theokeist-hcode-org.bloom-highlighter) · [Releases](https://github.com/theokeist/bloom-highlighter/releases) · [Installation guide](INSTALL.md)

Marketplace links activate after the listing is published.
<!-- install-links:end -->

## Pick your view

- **Operational** — follow conditions, returns and state changes.
- **Interfaces** — find functions, calls, contracts and components.
- **Structural** — spot declarations, imports and stable values.
- **Dangerous** — review potentially risky operations, with optional stronger focus.

![Illustrated Dart example showing Operational, Interfaces, Structural and Dangerous highlighting](https://raw.githubusercontent.com/theokeist/bloom-highlighter/main/media/store/bloom-views.png)

Open the Bloom flower in the Activity Bar. Expand a category to toggle it or choose its color. Your choices apply across files of that language.

## Get started

Download the build artifact (GitHub sign-in may be required), unzip it, and run **Extensions: Install from VSIX…** in VS Code. Select the `.vsix`, then run **Developer: Reload Window** and **Bloom: Show Sidebar**.

Supports Dart/Flutter, JavaScript/TypeScript, Python, Rust, Go and many more. Includes React, Vue and Svelte recognition. Requires desktop VS Code 1.95+.

Bloom is a reading aid: lexical rules can be approximate, and Dangerous highlights are review cues.

Tags: syntax highlighting, code reading, functions, Dart, Flutter, JavaScript, TypeScript, React, Vue, Svelte.

[Usage](docs/USAGE.md) · [Improvements](docs/IMPROVEMENTS.md) · [Contributing](CONTRIBUTING.md)


All view choices, highlighting switches, dimming, language controls, category colors,
and examples live together in the expanded **Code Highlighting** sidebar section.
View switching is instant by default (`bloom.speed: 0`). If you configure a delay,
Bloom keeps the previous highlights visible until their replacements are ready.
Scrolling reuses analyzed category spans and scope layers; unchanged decoration
ranges are not sent to the editor again.


Run `npm run test:large` for the 3,600 / 6,000 / 12,000-line TypeScript,
Dart, and Python rendering stress suite. It exercises split editors, scrolling,
all views, delayed updates, stale edits, unchanged repaints, and category replacement.
Timing diagnostics describe cached decoration preparation and submission, not display frame times.

For native editor API checks, launch an isolated VS Code extension test host with
`--extensionDevelopmentPath=<repo> --extensionTestsPath=<repo>/tests/host`, a temporary
workspace, and separate `--user-data-dir` / `--extensions-dir` under `.vscode-test`.
The host test checks real scrolling and edits and writes `tests/host/result.json`.
An empty-decoration-state check is separate from visual frame capture; these tests
alone do not certify zero visible flicker.

### Pattern-based classification

Dart and JavaScript/TypeScript (including Vue/Svelte script regions) classify ordinary calls, constructors and callbacks without recognizing custom library names. Interfaces includes composition and callable boundaries; Operational shows decisions, flow and writes. Declaration initializers, named-argument colons, type brackets and arrow boundaries are excluded from misleading Operational matches. Flutter widget construction follows the same rules as custom DSL composition; nested callbacks retain their own operations. Optional framework enrichment distinguishes derived values from lifecycle effects. Dart uses bounded syntax heuristics rather than semantic type resolution; other languages retain their lexical profiles.
