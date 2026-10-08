# Operational highlighting: framework-aware taxonomy

Research date: 2026-10-08. Status: proposed specification; the classifications below are not all implemented in Bloom.

## Decision

Operational is the view for following behavior: decisions, execution order, state writes, reactive dependencies, event dispatch, asynchronous work, external effects, and resource lifetime. It should help a reader trace how an interaction becomes a result.

Flutter widgets belong primarily to declarative UI composition. Flutter defines Widget as an immutable UI description, including StatefulWidget instances; their mutable state resides in State or other subscribed objects. Widget constructors therefore should not automatically receive mutation or effect styling. [Widget API](https://api.flutter.dev/flutter/widgets/Widget-class.html), [StatefulWidget API](https://api.flutter.dev/flutter/widgets/StatefulWidget-class.html).

This is a Bloom design recommendation inferred from language/framework behavior, not a standard taxonomy mandated by an IDE.

## What modern tooling supplies

- VS Code semantic tokens identify symbol kinds and modifiers: class, method, property, declaration, readonly, async, modification, and others. These are useful evidence for cognitive views, but do not by themselves prove purity, effects, Flutter inheritance, or risk. [Semantic highlight guide](https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide).
- Tree-sitter classifies syntax-tree nodes through highlight queries and can track local definitions/references and embedded languages. Its syntax queries do not establish cross-file type identity or arbitrary call effects by themselves. [Tree-sitter highlighting](https://tree-sitter.github.io/tree-sitter/3-syntax-highlighting.html).
- rust-analyzer adds semantic distinctions such as mutable and unsafe. A mutable binding indicates capability; it does not mean every use writes to it. Unsafe is a language-specific property, not an automatic equivalent of destructive I/O. [rust-analyzer features](https://rust-analyzer.github.io/book/features.html).
- IntelliJ's feature named semantic highlighting can mean distinguishing individual local variables and parameters by color. The same marketing term does not imply the same behavioral classification. [IntelliJ colors and fonts](https://www.jetbrains.com/help/idea/configuring-colors-and-fonts.html).
- Dart's analyzer exposes resolved compilation results and interface supertypes. A resolved type and its originating library can establish that a custom class inherits Flutter Widget. Standard LSP class tokens alone do not contain this inheritance proof. [ResolvedUnitResult](https://pub.dev/documentation/analyzer/latest/dart_analysis_results/ResolvedUnitResult-class.html), [InterfaceType](https://pub.dev/documentation/analyzer/latest/dart_element_type/InterfaceType-class.html).

## Operational categories

| Category | Include | Distinguish from |
| --- | --- | --- |
| Decisions | Branches, pattern guards, boolean/comparison operators, conditional expressions | Type arguments, named-argument punctuation, annotations |
| Flow and async | Loops, returns, breaks, yield, await, exception handling, cancellation/scheduling boundaries | A Future type reference or an async declaration by itself |
| Writes and actions | Assignment targets/operators, increments, resolved setters, state-update APIs, event dispatch | Variable declarations, readonly bindings, pure data construction |
| Reactive dependencies | Observation, subscription, derived-state wiring, dependency selection | Writing to the observed state or causing an external effect |
| Events and effects | Callback registration, listener/effect boundaries, navigation, network/file operations, persistence | UI description, callback references treated as immediate invocations |
| Resource lifetime | Lifecycle entry points, subscriptions, timers, resource allocation, cleanup/disposal | Ordinary classes or methods with coincidentally matching names |

Reactive dependencies and pure derivations should have calmer emphasis than writes and effects. Operational includes computation and control flow, not just side effects. Pure expressions in conditions still matter. Generic calls with unknown behavior retain a neutral call role; their names are insufficient evidence for mutation, purity, or risk.

Declarations and mutable capacity are separate from writes. Dart var and late are declaration/initialization properties. final prevents reassignment of a binding, while the referenced object may remain mutable. const has stronger constant-object semantics. [Dart variables](https://dart.dev/language/variables).

## Flutter placement

| Construct | Primary role | Operational detail |
| --- | --- | --- |
| Text, Row, Column, Padding, custom Widget subclasses | Interfaces: UI composition | Evaluate and classify argument expressions independently |
| Widget build(...), builder callbacks | Interfaces: render boundary | Highlight branches, dependencies, writes, or effects inside the body individually |
| class Counter extends StatefulWidget | Structural: class declaration; Interfaces: component identity | StatefulWidget itself is not a state write |
| onPressed, onChanged, onTap | Operational: event wiring | Callback is registered here; its body runs later |
| setState, notifyListeners, resolved Notifier actions, Bloc emit/add | Operational: writes/actions | Show the API boundary and actual write/action tokens |
| ref.watch, selectors, consumer dependency expressions | Operational: dependency observation | Do not mark them as writes |
| ref.read | State access | A read is not automatically a mutation; a subsequent notifier command is separate |
| Consumer, ConsumerWidget, BlocBuilder, StreamBuilder, FutureBuilder | Interfaces: composition with dependency/async facets | Constructor alone does not prove a network request or a state write |
| BlocListener and BlocConsumer listener argument | Composition plus Operational effect/listener boundary | Classify builder and listener callbacks separately |
| initState, didUpdateWidget, dispose, subscription.cancel | Operational: lifecycle/cleanup | Resolve overrides and API receivers when possible |
| Navigator.push, showDialog, storage/network commands | Operational: effects | Effects do not automatically imply danger |
| AnimationController construction/disposal | Operational: resource lifetime | It is a controller/resource, not a widget constructor |

Flutter's build contract excludes side effects beyond building its widget description. Therefore an effect found in a build body should retain its effect role; it should not disappear into a generic component classification. Highlighting alone must not claim a confirmed diagnostic. [State.build](https://api.flutter.dev/flutter/widgets/State/build.html).

setState synchronously runs its callback and schedules a rebuild. Callback registration, callback execution, state mutation, and later rendering are different boundaries. [State.setState](https://api.flutter.dev/flutter/widgets/State/setState.html).

Riverpod explicitly distinguishes observation with watch, listener callbacks with listen, access with read, and invalidation/refresh. These need separate roles. Registering WidgetRef.listen in build is supported; a subscription registration must not be indiscriminately reported as an illegal build-side effect. [Riverpod refs](https://riverpod.dev/docs/concepts2/refs).

Bloc documentation distinguishes a builder that returns widgets from a listener used for reactions such as navigation or dialogs. A widget can carry both composition and effect-related roles. [BlocBuilder](https://pub.dev/documentation/flutter_bloc/latest/flutter_bloc/BlocBuilder-class.html), [BlocListener](https://pub.dev/documentation/flutter_bloc/latest/flutter_bloc/BlocListener-class.html).

## Cross-framework correspondence

The following placement is the proposed Bloom policy, inferred from the documented API behaviors.

| Framework | Composition | Dependencies/derivation | Writes/actions | Effects/lifetime |
| --- | --- | --- | --- | --- |
| Flutter/Riverpod/Bloc | Widget tree, build/builder | ref.watch/select, builder state inputs | setState, state setters, notifier commands, emit/add | ref.listen, listeners, navigation, subscriptions, dispose |
| React | JSX/components, render boundary | State reads, context reads, useMemo/useCallback | State setters, reducer dispatch | useEffect and cleanup; event handlers |
| Vue | Template/components | computed, tracked reads | Reactive property assignments | watch/watchEffect, lifecycle callbacks |
| Svelte | Markup/components | $derived, tracked reads | Assignments to $state-backed data | $effect, event handlers, lifecycle cleanup |
| Angular | Templates/components | computed, signal reads | Writable signal set/update | effect, event handlers |
| Jetpack Compose | Composable UI calls | State reads, derivedStateOf | State writes | LaunchedEffect, DisposableEffect, SideEffect |

React distinguishes rendering from committing changes and expects render calculations to be pure. useMemo caches a calculation; useEffect synchronizes with external systems. They should not share an effects category. [Render and commit](https://react.dev/learn/render-and-commit), [useMemo](https://react.dev/reference/react/useMemo), [useEffect](https://react.dev/reference/react/useEffect).

Vue computed getters describe derivation while watchers support reactions/effects. [Computed properties](https://vuejs.org/guide/essentials/computed.html), [Watchers](https://vuejs.org/guide/essentials/watchers.html).

Svelte separates side-effect-free derived expressions from effects that rerun with tracked dependencies. [Svelte derived](https://svelte.dev/docs/svelte/%24derived), [Svelte effect](https://svelte.dev/docs/svelte/%24effect).

Angular distinguishes writable signals from computed signals. [Angular signals](https://angular.dev/guide/signals).

Compose has explicit APIs for effects and cleanup alongside UI-emitting composables and derived state. [Compose side effects](https://developer.android.com/develop/ui/compose/side-effects).

The same classification approach applies outside UI: branches, computations, and known effects are Operational; types/contracts are Interfaces; modules/declarations are Structural. Database query execution is an effect but SELECT does not imply a write; UPDATE is a write, and a destructive operation can additionally carry a review facet. Unknown custom wrappers remain unknown unless configured or resolved.

## Preserve views; improve roles

Keep the four existing views as reader tasks rather than mutually exclusive buckets:

| View | Reading question |
| --- | --- |
| Operational | What drives behavior, and where are decisions, dependencies, writes, effects, and lifetime boundaries? |
| Interfaces | What contracts, callable boundaries, components, and UI composition connect? |
| Structural | Where are declarations, modules, ownership, and stable bindings? |
| Dangerous | Which specific operations merit review, with what supporting evidence? |

A symbol can have several facets. BlocListener is a widget type with a listener/effect boundary. A state setter is a method symbol with a write role. Choose one deterministic visual category per selected view; do not stack conflicting colors over the same span. Danger and actual diagnostics are independent overlays, not broad synonyms for operations.

## Implemented pattern-first approach

Following the custom-library/DSL review, generic syntax and usage patterns are the default. Framework recognition is optional enrichment, not a prerequisite for readable highlighting.

- Dart uses a bounded syntax pass for constructors, named constructors, generic calls, callback boundaries, named arguments, nullable types and declaration initializers. Widget and custom DSL construction receive ordinary Interfaces classification; nested decisions and writes keep their independent Operational roles.
- JavaScript/TypeScript reuse the existing compiler tree. Vue/Svelte script regions preserve syntax exclusions and callable tokens at their original document offsets.
- Comparison operators are no longer alerts. Arrow boundaries, type arguments, nullable syntax and named-argument colons do not become Operational punctuation. Mutable declarations are Structural; actual assignments remain writes. Static storage is Structural; final/const binding highlights do not imply deep immutability or purity.
- Optional React memoization, Vue computed and Svelte derived values are separated from lifecycle/effect hooks. Unknown calls do not acquire inferred effects or danger merely from their spelling.
- Existing Markdown rules remain customizable. Other languages retain their lexical profiles. Dart heuristics do not resolve arbitrary types, imports, effects or purity; ambiguous/incomplete source can require lexical fallback.
- Analysis runs outside editor rendering, cached by document version/settings. Category spans and styles are reused, unchanged updates avoid duplicate writes, and replacements populate new decorations before clearing old ones.

## Validation and remaining evidence

61 automated tests pass, including custom composition/callback examples and 3,600/6,000/12,000-line TypeScript, Dart and Python scenarios. Nine native VS Code host scenarios also pass scrolling, edits, split editors and view switches with zero empty decoration states and zero unchanged-repaint writes. Cached split-editor API preparation/submission medians were 5.1?8.7 ms; p95 was 9.3?28.8 ms in this run. These are not display-frame measurements.

Lint, release identity checks and VSIX packaging pass. Desktop frame capture remains unavailable in this environment, so zero visible flicker is not yet visually verified. Semantic Dart analyzer integration and new library-specific catalogs are not required by this implementation.

No classification above implies that Bloom proves arbitrary program effects, purity, or safety.
