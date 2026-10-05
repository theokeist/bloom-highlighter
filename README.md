# Bloom Syntax Highlighter

<!-- install-links:start -->
[Download VSIX](https://github.com/theokeist/bloom-highlighter/releases/latest/download/bloom-highlighter-0.13.1.vsix) · [Installation guide](INSTALL.md)

The GitHub download requires a published release with the matching VSIX asset.

Marketplace installation will be available after a publisher ID is configured and this version is published.
<!-- install-links:end -->




Bloom adds four cognitive views to VS Code. Operational highlights flow and state changes; Interfaces highlights contracts, components and framework APIs; Structural highlights modules, declarations and internal identifiers; Dangerous highlights potentially risky operations for review.

Colors have consistent meanings across languages; the matched constructs vary by language definition. All supplied coding languages have individual keyword/API vocabularies, with language-specific comment/string masking. These are lexical rules rather than complete semantic parsers. Structural and Interfaces emphasize matching tokens rather than filling entire declaration bodies; Structural also omits scope background washes.

Expand **Colors and Category Switches** to enable individual categories and choose preset or custom colors for the current language. **Quick Adjustments** includes a language switch and an optional **Strong danger focus** switch, off by default. Dangerous view provides review cues and may miss indirect calls or flag legitimate operations.

Use **Bloom: Choose View** from the Command Palette or click the plain-text Bloom status-bar item. The selected view is remembered for the workspace.

You can also click the Bloom flower icon in VS Code's Activity Bar. Its **Code Views** sidebar offers Operational, Interfaces, Structural, Toggle highlighting and Reload definitions as plain-text rows. If the icon is hidden, right-click the Activity Bar and enable Bloom.

Below the controls, **Highlight Guide** shows the active language, selected view and the meaning of its highlight colors, with examples drawn from the current schema. It updates when you switch files or views. **Quick Adjustments** lets you choose dimming (100%, 80%, 65% or 40% opacity) and toggle instant switching; turning instant switching off restores your previous delay. The guide explains unsupported files and paused highlighting. Expand either section by clicking its heading if it is collapsed.

Both sections are inside **Code Views**, directly below Reload definitions. Run **Bloom: Show Sidebar** from the Command Palette to bring this panel into view.

## Start here

- [Install or update Bloom](INSTALL.md): install the VSIX, check activation and troubleshoot.
- [Use Bloom while coding](docs/USAGE.md): choose a view for debugging, component work or refactoring.
- [What improved](docs/IMPROVEMENTS.md): practical changes, accuracy limits and validation.

Bloom can help you find relevant code sooner by emphasizing flow, interfaces or structure. It does not generate code or provide completion, and a productivity gain has not been measured. Start with one view for a real task and use the guide to decide whether it reduces your search time.

## Framework awareness

- **React / JSX / TSX:** recognizes component tags, event handlers, and imported state, lifecycle and context APIs. Imported aliases and namespace calls work; locally shadowed names are not treated as framework APIs.
- **Vue:** parses single-file components, including TypeScript in scripts, setup macros, template expressions and directives. `v-if`/`v-for` indicate flow; `v-model` and events indicate state changes. Script/style separation preserves CSS and literal template content.
- **Svelte:** recognizes component tags, block expressions, event/bind directives, imported lifecycle/store APIs and Svelte 5 runes. Runes are also supported in `.svelte.js` and `.svelte.ts` files.

Framework recognition uses the TypeScript, Vue and Svelte parsers. It is local to the open file: re-exported wrappers and auto-imported framework APIs are not resolved across a project. Vue templates using Pug and scripts requiring custom preprocessors are skipped. See [framework samples](samples/frameworks).

## Languages and accuracy

**Dart is supported from 0.11.0**, including Flutter source files. Open a `.dart` file to get Operational, Interfaces and Structural views automatically. Dart's rules cover flow, mutations, types, declarations, `final`/`const` and private identifiers; raw strings, multiline literals and nested comments are excluded, while interpolation expressions remain executable code. Flutter widget lifecycle/API recognition is not a dedicated framework adapter yet.

**Additional coverage:** Java, C#, Go, Rust, Kotlin, Swift, Scala, Groovy, PHP, D, Zig, Solidity, CUDA, HLSL/GLSL, F#/OCaml, shell, PowerShell, Perl, R, Julia, Elixir, CoffeeScript, Lua, SQL, Clojure/Lisp/Scheme, Haskell, Erlang and MATLAB. These languages have individual vocabularies. They work without manual setup, but specialized literals, interpolation and block forms can be approximate. Bloom activates after startup, so opening one of these files does not depend on first opening JS/TS.

JavaScript/TypeScript and component expressions use compiler parsing to exclude comments, literal strings, regular expressions and template prose from keyword matching. Dart, Python, Ruby, C/C++ and Objective-C use lexical/scoping rules; Python indentation and common Ruby `end` blocks are supported, but these are not complete semantic parsers. Prose, markup/configuration and unlisted languages keep normal editor highlighting.

Native token categories still use configurable patterns, so classification of an executable identifier named like a keyword or built-in can be approximate. Bloom complements the editor's syntax colors and language extensions.

## Shortcuts

Press the chord prefix, then the view key:

| View | Windows/Linux | macOS |
| --- | --- | --- |
| Operational | Ctrl+Alt+B, then O | Cmd+Alt+B, then O |
| Interfaces | Ctrl+Alt+B, then I | Cmd+Alt+B, then I |
| Structural | Ctrl+Alt+B, then S | Cmd+Alt+B, then S |

Shortcuts apply only while a supported, enabled editor has focus. **Bloom: Toggle Highlighting** also works from the Command Palette or view picker.

## Settings

| Setting | Default | Purpose |
| --- | --- | --- |
| `bloom.enabled` | `true` | Enable highlighting; disabling clears visible editors immediately. |
| `bloom.frameworks` | `true` | Recognize framework categories while retaining safe component parsing. |
| `bloom.dimOpacity` | `0.65` | Dimming intensity; `1` disables dimming. Comments, literal strings, template prose and CSS are excluded from dimming. |
| `bloom.speed` | `300` | Semantic bloom delay on view changes; `0` applies highlights immediately. Typing updates are instant after a 50 ms debounce. |
| `bloom.maxFileSize` | `500000` | Skip files above this number of UTF-16 characters. |
| `bloom.languageSettings` | `{}` | Per-language enable switches, category switches, colors and optional strong danger emphasis. |

Analysis runs in a background worker and is cached by document version and framework setting. Queued drafts are replaced by newer edits, and stale results are discarded. Decorations are restricted to visible lines plus a small margin. Split editors refresh together. Light themes use a darker text palette, and code tokens have no pill/badge borders.

## Definitions and development

Definitions live in `src/core/definitions/*.md`. Each enabled `## category` needs a `regex:` field containing a raw JavaScript regex source in backticks, and a `style:` JSON object. Do not double-escape backslashes as if the fence were JSON. Build and runtime use the same validator. Invalid definitions leave the previous working schema set in place.

Run **Bloom: Reload Language Definitions** after editing definitions. Development watch mode regenerates the compiled JSON when Markdown changes. Startup activation covers newly added definitions; each language still needs an appropriate analysis adapter or a documented baseline profile.

```powershell
npm.cmd install
npm.cmd test
npm.cmd run lint
npm.cmd run watch
```

VS Code 1.95 or newer is required. Test fixtures exercise real parser output, ranges, configuration changes, split views, delayed rendering and cleanup with a mocked VS Code API. They do not verify visual rendering in a live extension host.
