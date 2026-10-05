import * as ts from 'typescript';
import type { OperationalKey } from './schemaParser';

export interface Span { start: number; end: number }
export interface CognitiveToken extends Span { key: OperationalKey }
export interface Scope extends Span { headerEnd: number }
export interface CodeAnalysis {
    code: string;
    tokens: CognitiveToken[];
    scopes: Scope[];
    frameworks: string[];
    complete: boolean;
}

export function emptyAnalysis(text: string): CodeAnalysis {
    return { code: text.replace(/[^\r\n]/g, ' '), tokens: [], scopes: [], frameworks: [], complete: true };
}

const apiGroups: Record<string, Partial<Record<OperationalKey, string[]>>> = {
    react: {
        mutation: ['useState', 'useReducer', 'useRef', 'useActionState', 'useOptimistic'],
        guards: ['useEffect', 'useLayoutEffect', 'useInsertionEffect', 'useMemo', 'useCallback', 'useTransition', 'useDeferredValue'],
        interface: ['useContext', 'createContext', 'forwardRef', 'memo', 'useImperativeHandle', 'useSyncExternalStore'],
    },
    vue: {
        mutation: ['ref', 'shallowRef', 'reactive', 'shallowReactive', 'toRef', 'toRefs', 'customRef'],
        guards: ['computed', 'watch', 'watchEffect', 'watchPostEffect', 'onMounted', 'onUnmounted', 'onUpdated', 'nextTick'],
        interface: ['defineComponent', 'provide', 'inject', 'readonly'],
    },
    svelte: {
        guards: ['onMount', 'onDestroy', 'beforeUpdate', 'afterUpdate', 'tick', 'untrack'],
        interface: ['getContext', 'setContext', 'createEventDispatcher'],
    },
    'svelte/store': { mutation: ['writable'], guards: ['derived'], interface: ['readable', 'get'] },
    'svelte/reactivity': { mutation: ['SvelteMap', 'SvelteSet', 'SvelteDate', 'SvelteURL'] },
};

function apiKey(module: string, name: string): OperationalKey | undefined {
    for (const [key, names] of Object.entries(apiGroups[module] ?? {})) {
        if (names?.includes(name)) return key as OperationalKey;
    }
    return undefined;
}

/** Parse JS/TS with the compiler so regex literals, JSX text and strings stay out of code matching. */
export function analyzeScript(text: string, jsx = false, macros?: 'vue' | 'svelte'): CodeAnalysis {
    const result = emptyAnalysis(text);
    const chars = text.split(''); // UTF-16 offsets, matching VS Code and compiler offsets.
    const file = ts.createSourceFile(jsx ? 'bloom.tsx' : 'bloom.ts', text, ts.ScriptTarget.Latest, true,
        jsx ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    let checker: ts.TypeChecker | undefined;
    function getChecker(): ts.TypeChecker {
        if (!checker) {
            const options: ts.CompilerOptions = { noLib: true, noResolve: true, target: ts.ScriptTarget.Latest };
            const host: ts.CompilerHost = {
                getSourceFile: name => name === file.fileName ? file : undefined,
                getDefaultLibFileName: () => '', writeFile: () => undefined,
                getCurrentDirectory: () => '', getDirectories: () => [],
                fileExists: name => name === file.fileName, readFile: () => undefined,
                getCanonicalFileName: name => name, useCaseSensitiveFileNames: () => true,
                getNewLine: () => '\n',
            };
            checker = ts.createProgram([file.fileName], options, host).getTypeChecker();
        }
        return checker;
    }
    const reveal = (start: number, end: number) => {
        for (let i = start; i < end; i++) chars[i] = text[i];
    };
    const mask = (start: number, end: number) => {
        for (let i = start; i < end; i++) if (text[i] !== '\r' && text[i] !== '\n') chars[i] = ' ';
    };
    const addToken = (node: ts.Node, key: OperationalKey) => {
        result.tokens.push({ start: node.getStart(file), end: node.end, key });
    };
    const imports = new Map<ts.Declaration, { module: string; name?: string }>();
    const importNames = new Set<string>();
    for (const statement of file.statements) {
        if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
        const module = statement.moduleSpecifier.text;
        if (!apiGroups[module]) continue;
        const family = module.split('/')[0];
        if (!result.frameworks.includes(family)) result.frameworks.push(family);
        const clause = statement.importClause;
        if (clause?.isTypeOnly) continue;
        if (clause?.name && module === 'react') {
            imports.set(clause, { module });
            importNames.add(clause.name.text);
        }
        if (clause?.namedBindings) {
            if (ts.isNamespaceImport(clause.namedBindings)) {
                imports.set(clause.namedBindings, { module });
                importNames.add(clause.namedBindings.name.text);
            }
            else for (const specifier of clause.namedBindings.elements) {
                if (!specifier.isTypeOnly) {
                    imports.set(specifier, { module, name: (specifier.propertyName ?? specifier.name).text });
                    importNames.add(specifier.name.text);
                }
            }
        }
    }
    function frameworkCall(node: ts.CallExpression | ts.NewExpression) {
        if (!imports.size && !macros) return;
        const expression = node.expression;
        const identifier = ts.isIdentifier(expression) ? expression :
            ts.isPropertyAccessExpression(expression) && ts.isIdentifier(expression.expression) ? expression.expression : undefined;
        if (!identifier) return;
        if (!importNames.has(identifier.text) && !(macros === 'svelte' && identifier.text.startsWith('$')) &&
            !(macros === 'vue' && /^(define|withDefaults)/.test(identifier.text))) return;
        const symbol = getChecker().getSymbolAtLocation(identifier);
        const declaration = symbol?.declarations?.[0];
        const binding = declaration && imports.get(declaration);
        if (binding) {
            const name = binding.name ?? (ts.isPropertyAccessExpression(expression) ? expression.name.text : '');
            const key = apiKey(binding.module, name);
            if (key) addToken(expression, key);
        } else if (!symbol && macros) {
            const name = expression.getText(file);
            if (macros === 'vue' && ['defineProps', 'defineEmits', 'defineExpose', 'defineSlots', 'defineOptions', 'withDefaults'].includes(name)) {
                addToken(expression, 'interface');
            } else if (macros === 'vue' && name === 'defineModel') {
                addToken(expression, 'mutation');
            } else if (macros === 'svelte') {
                if (/^\$state(?:\.(?:raw|snapshot))?$/.test(name)) addToken(expression, 'mutation');
                if (/^\$(?:derived(?:\.by)?|effect(?:\.(?:pre|tracking|root))?)$/.test(name)) addToken(expression, 'guards');
                if (['$props', '$bindable', '$host'].includes(name)) addToken(expression, 'interface');
            }
        }
    }
    function visit(node: ts.Node): void {
        if (ts.isStringLiteral(node) || ts.isRegularExpressionLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)
            || ts.isJsxText(node) || node.kind === ts.SyntaxKind.JSDocComment || ts.isJsxOpeningFragment(node) || ts.isJsxClosingFragment(node) ||
            node.kind === ts.SyntaxKind.TemplateHead || node.kind === ts.SyntaxKind.TemplateMiddle || node.kind === ts.SyntaxKind.TemplateTail) {
            mask(node.getStart(file), node.end);
            return;
        }
        if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node) || ts.isJsxClosingElement(node)) {
            mask(node.getStart(file), node.end);
            if (/^[A-Z]/.test(node.tagName.getText(file))) addToken(node.tagName, 'interface');
            if (!ts.isJsxClosingElement(node)) {
                for (const attribute of node.attributes.properties) {
                    if (ts.isJsxAttribute(attribute)) {
                        if (/^on[A-Z]/.test(attribute.name.getText(file))) addToken(attribute.name, 'mutation');
                        if (attribute.initializer && ts.isJsxExpression(attribute.initializer) && attribute.initializer.expression) {
                            const expression = attribute.initializer.expression;
                            reveal(expression.getStart(file), expression.end);
                            visit(expression);
                        }
                    } else if (ts.isJsxSpreadAttribute(attribute)) {
                        reveal(attribute.expression.getStart(file), attribute.expression.end);
                        visit(attribute.expression);
                    }
                }
            }
            return;
        }
        if (ts.isCallExpression(node) || ts.isNewExpression(node)) frameworkCall(node);
        if (ts.isBlock(node) || ts.isModuleBlock(node) || ts.isClassDeclaration(node) || ts.isClassExpression(node)
            || ts.isInterfaceDeclaration(node) || ts.isObjectLiteralExpression(node) || ts.isTypeLiteralNode(node)) {
            let start = node.getStart(file);
            let headerEnd = start;
            if (ts.isClassDeclaration(node) || ts.isClassExpression(node) || ts.isInterfaceDeclaration(node)) {
                headerEnd = node.getChildren(file).find(child => child.kind === ts.SyntaxKind.OpenBraceToken)?.getStart(file) ?? start;
            } else if (ts.isBlock(node) && (ts.isFunctionLike(node.parent) || ts.isModuleDeclaration(node.parent))) {
                start = node.parent.getStart(file);
            }
            result.scopes.push({ start, headerEnd, end: node.end });
        }
        ts.forEachChild(node, visit);
    }
    visit(file);
    // Scan only after literals/JSX have been masked, so comment-like text inside them cannot hide real code.
    const scanner = ts.createScanner(ts.ScriptTarget.Latest, false, ts.LanguageVariant.Standard, chars.join(''));
    let kind: ts.SyntaxKind;
    while ((kind = scanner.scan()) !== ts.SyntaxKind.EndOfFileToken) {
        if (kind === ts.SyntaxKind.SingleLineCommentTrivia || kind === ts.SyntaxKind.MultiLineCommentTrivia || kind === ts.SyntaxKind.ShebangTrivia) {
            mask(scanner.getTokenPos(), scanner.getTextPos());
        }
    }
    result.code = chars.join('');
    return result;
}

export function mergeAnalysis(target: CodeAnalysis, source: CodeAnalysis, offset: number): void {
    target.code = target.code.slice(0, offset) + source.code + target.code.slice(offset + source.code.length);
    target.tokens.push(...source.tokens.map(t => ({ ...t, start: t.start + offset, end: t.end + offset })));
    target.scopes.push(...source.scopes.map(s => ({ start: s.start + offset, headerEnd: s.headerEnd + offset, end: s.end + offset })));
    target.frameworks = [...new Set([...target.frameworks, ...source.frameworks])];
}
