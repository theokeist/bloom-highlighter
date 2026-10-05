# Bloom 0.13.1

Bloom provides Operational, Interfaces, Structural and Dangerous code views. This release includes Dart support, functions and calls highlighting, language-specific rules, category switches, expandable colors and category icons.

## Quick install

1. Download **bloom-highlighter-0.13.1.vsix** from the assets below.
2. In desktop VS Code, run **Extensions: Install from VSIX…** and select the file.
3. Run **Developer: Reload Window**, open a code file, then run **Bloom: Show Sidebar**.

Requires VS Code 1.95 or newer. [Full installation guide](https://github.com/theokeist/bloom-highlighter/blob/main/INSTALL.md).

Highlights are lexical reading aids. Function rules may include constructors; Dangerous view supplies review cues rather than security findings. Unsupported languages retain ordinary editor highlighting.

Marketplace installation is pending creation of a Marketplace publisher. The downloadable VSIX works independently of a store listing.

Validated locally: 41 automated tests, lint and VSIX packaging. Dimming registration and Workspace Settings writes were also verified in a real VS Code host during development.
