# Contributing to Bloom

Use Node.js 22 or newer and desktop VS Code 1.95 or newer.

```sh
npm ci
npm test
npm run lint
npm run package
```

Press F5 in VS Code to launch the extension development host. Changes to registered settings, commands and icons require a window reload. Language rules live in `src/core/definitions/*.md`; generated vocabularies are maintained by `scripts/generate-language-rules.js`. Run `npm run generate-rules` and `npm test` after changing the generator. Tests should cover real language fixtures and exclude comments, strings and entire function bodies from name highlighting.

Use plain labels and simple category icons. Do not turn descriptive text into badges. Dangerous highlighting is a lexical reading aid, not a security analysis result. Keep unsupported syntax and runtime verification limitations documented.

Do not commit generated packages, dependencies, test profiles or credentials. See [publishing](docs/PUBLISHING.md) for release setup.
