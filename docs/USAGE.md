# Use Bloom while coding

In 0.13.1, **Interfaces** includes **Functions and calls**. Expand that category to switch it off or change its color independently. Callable-name rules highlight identifiers immediately followed by parentheses; comments and strings are excluded. This lexical rule can also include constructor calls and does not resolve symbols across files. Categories have simple icons beside plain text labels.

## Language controls in 0.13.0

Open the Bloom flower in the Activity Bar. Expand **Colors and Category Switches**, then expand a category to toggle its highlighting or choose a preset/custom hex color. Changes apply to every file of the current language within the selected settings scope. **This language** disables only that language; the main toggle disables Bloom globally.

Choose **Dangerous** to focus on potentially risky operations such as process execution, deletion, dynamic evaluation and unsafe memory APIs. Turn **Strong danger focus** on in Quick Adjustments for stronger emphasis and dimming. It defaults off. These are lexical review cues, not security findings: aliases and indirect calls may be missed, and legitimate calls may be highlighted.

Supplied language definitions now use individual keyword/API vocabularies rather than a shared generic fallback. This is not complete semantic understanding of every language. Unsupported file types keep ordinary editor highlighting. To extend rules, edit the corresponding Markdown definition under `src/core/definitions`, compile and repackage.

If dimming reports an unregistered setting after an update, run **Developer: Reload Window**. The installed manifest registers `bloom.dimOpacity`; updating a running extension does not always refresh its configuration registry.

Bloom is a reading aid for the code you edit. It emphasizes categories relevant to your current task while keeping the editor's existing syntax highlighting. It can plausibly reduce time spent locating flow, state changes and declarations; there is no measured typing-speed or productivity improvement yet. Completion, code generation, diagnostics and refactoring still come from your language tools and other editor features.

## Choose a view for the task

In version 0.10.1, click the Bloom flower icon in the Activity Bar to open **Code Views**. Click a view row to apply it, or use the toggle and definition reload rows. Open a supported code file to see the effect.

| Task | View | What to look for |
| --- | --- | --- |
| Debug an unexpected result | Operational | Conditions, guards, returns and state changes. |
| Understand a component or API | Interfaces | Contracts, component tags and recognized framework APIs. |
| Find where to make a change | Structural | Imports, declarations, scopes and internal identifiers. |

Use **Bloom: Choose View** or the plain-text status-bar control. Windows/Linux shortcuts are **Ctrl+Alt+B**, then **O**, **I** or **S**; macOS uses **Cmd+Alt+B**, then the same view key. The view is remembered for the workspace and updates visible split editors.

## A practical edit workflow

1. Open the file and choose **Structural** to locate its imports and declarations. Use VS Code search or symbol navigation to reach the function you need.
2. Switch to **Operational** to inspect its guards and mutations. Trace which branch executes and where data changes before editing.
3. For component or contract changes, switch to **Interfaces** to inspect the relevant components and APIs.
4. Make the edit using your normal completion and refactoring tools. Bloom refreshes after edits; it does not validate the change.
5. Run the relevant tests or application and inspect diagnostics. Toggle Bloom off briefly if you want to compare ordinary syntax colors.

For a bug where a React counter increments unexpectedly, Operational can help draw attention to event handlers and state APIs imported from React. Interfaces helps you inspect component usage and API boundaries; Structural helps you locate declarations and imports. Aliased imports are recognized, while a locally shadowed name is not treated as the imported framework API.

## Framework examples

- **React:** inspect imported hooks, component tags and event handlers in JSX/TSX. Recognition is local to the file, so a custom hook wrapper is not automatically understood as a framework hook.
- **Vue:** inspect `v-if`/`v-for` for flow and `v-model`/events for state changes. Supported script and template expressions are analyzed without treating CSS or literal template text as code.
- **Svelte:** inspect blocks, event/bind directives and Svelte 5 runes. Rune recognition also applies to `.svelte.js` and `.svelte.ts` file contexts.

## Keep the view comfortable

Use the **Highlight Guide** below the sidebar controls to read the meaning of the selected view's colors and see examples for the open file's language. Only categories belonging to that view appear. Baseline languages are identified as such; examples describe matching patterns rather than proving semantic meaning.

Click **Dimming** in **Quick Adjustments** to choose No dimming (100%), Gentle (80%), Balanced (65%) or Strong (40%). Click **Instant switching** to remove the delay; click again to restore your previous delay. Changes apply through VS Code settings, using an existing folder override when present, otherwise workspace settings or user settings when no workspace is open.

Use `bloom.speed: 0` for instant view switching. Start with `bloom.dimOpacity: 0.8` for gentle dimming, or use `1` to leave other code at normal opacity. Comments, literal strings, template prose and CSS are excluded from dimming. `bloom.frameworks: false` disables framework categories while preserving safe component parsing.

The selected view applies across visible editors; Bloom does not currently offer separate view presets for each language. Python/Ruby/C-family analysis is conservative, and some executable identifiers can be classified approximately by the configured patterns.

## Find out whether it helps you

Try Bloom on a few comparable real tasks: locating a state change, understanding a component and reviewing a refactor. Record time to find the relevant code and any places you misread. Compare with Bloom toggled off, alternating which condition you try first. Keep the view and intensity that make your work easier; a highlight alone is not evidence of a bug or correctness.

Future work could include cursor-scope focus, personal presets and cross-file framework resolution. These are possible improvements, not features shipped in 0.10.0.

See [installation](../INSTALL.md), [settings](../README.md#settings) and [release improvements](IMPROVEMENTS.md).
