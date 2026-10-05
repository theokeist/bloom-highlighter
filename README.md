# Bloom Syntax Highlighter

[![Build status](https://github.com/theokeist/bloom-highlighter/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/theokeist/bloom-highlighter/actions/workflows/ci.yml)
[![Source version](https://img.shields.io/github/package-json/v/theokeist/bloom-highlighter?label=version)](https://github.com/theokeist/bloom-highlighter/blob/main/package.json)

![Bloom: four views, customizable colors and language-wide switches](https://raw.githubusercontent.com/theokeist/bloom-highlighter/main/media/store/bloom-overview.png)

Make code easier to read. Bloom brings flow, functions and structure into focus while you code in VS Code.

<!-- install-links:start -->
[Install in VS Code](INSTALL.md#install-from-vs-code) · [Download build artifact](https://github.com/theokeist/bloom-highlighter/actions/runs/37363579130/artifacts/11367856693) · [Releases](https://github.com/theokeist/bloom-highlighter/releases)

Marketplace installation is coming after publisher setup.
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
