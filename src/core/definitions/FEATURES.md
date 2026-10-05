# Bloom Cognitive Mapping Features

This document describes the three primary cognitive layers used by the Bloom Highlighter to organize code semantics.

## 1. Operational Palette (Flow & Action)
**Focus:** Logic gates, state changes, and guard clauses.
**Colors:** Cyan / Green / Amber

*   **Logic (`logic`):** Highlights control flow gates like `===`, `&&`, `||`, `=>`, and ternaries. Designed to show where "decisions" are made.
*   **Mutation (`mutation`):** Highlights assignments and reassignment keywords (`=`, `+=`, `let`, `var`). Shows where "state" is changing.
*   **Guards (`guards`):** Highlights flow control keywords like `if`, `else`, `return`, `await`, `try`, and `rescue`. Shows the "pathway" of the code.

## 2. Interfaces Palette (Contracts & Objects)
**Focus:** Signatures, types, and object relationships.
**Colors:** Amber / Sky / Indigo

*   **Interface (`interface`):** Highlights declarations like `interface`, `type`, `enum`, `function`, or `def`. Shows the "shape" of the data.
*   **Native (`native`):** Highlights built-in platform objects and types (`Object`, `Array`, `Promise`, `int`, `str`, `JSON`).
*   **Prototype (`prototype`):** Highlights low-level OOP internals (`prototype`, `__init__`, `constructor`, `superclass`).

## 3. Structural Palette (Architecture & Foundation)
**Focus:** Scoping, modules, and static foundations.
**Colors:** Pink / Zinc

*   **Structural (`structural`):** Highlights high-level organization keywords like `class`, `module`, `namespace`, `export`, and `import`. Shows the "skeleton" of the project.
*   **Anchor (`anchor`):** Highlights immutable foundations like `const`, `readonly`, `nil`, `True`, and `False`. Shows the "constants" that don't change.
*   **Internal (`internal`):** Specifically targets private/internal identifiers (e.g., those starting with `_` or `@`).

---
*Calculation reminder: 235 x 28 = 6580*


## functions
status: enabled
regex: `(?<![\w$])(?!(?:if|for|while|switch|catch|with|assert|return|throw|sizeof|typeof)\b)[A-Za-z_$][\w$]*(?=\s*\()`
examples: ["render()", "calculate(value)"]
style: {"color":"#fbbf24","fontWeight":"600"}
