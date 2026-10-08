import { analyzeScript, CodeAnalysis, emptyAnalysis, Scope } from './codeAnalysis';
import { analyzeVue, analyzeSvelte } from './frameworks';
import { maskConventional } from './languageSupport';
import { maskDart } from './dartLexical';
import { dartPatterns } from './patternAnalysis';

export function analyzeCode(text: string, language: string, frameworks = true, fileName = ''): CodeAnalysis {
    let result: CodeAnalysis;
    if (language === 'vue') result = analyzeVue(text);
    else if (language === 'svelte') result = analyzeSvelte(text);
    else if (['typescript', 'javascript', 'typescriptreact', 'javascriptreact'].includes(language)) {
        result = analyzeScript(text, language.endsWith('react'), /\.svelte\.[jt]s$/.test(fileName) ? 'svelte' : undefined);
    } else result = analyzeConventional(text, language);
    if (!frameworks) { result.tokens = []; result.frameworks = []; }
    return result;
}

/** Conservative lexical fallback for languages without a bundled compiler. */
function analyzeConventional(text: string, language: string): CodeAnalysis {
    const result = emptyAnalysis(text);
    const python = language === 'python';
    const ruby = language === 'ruby';
    result.code = language === 'dart' ? maskDart(text) :
        maskConventional(text, language);
    if (language === 'dart') result.syntax = dartPatterns(result.code);
    const lines = result.code.split('\n');
    let offset = 0;
    if (python) {
        const stack: { indent: number; scope: Scope }[] = [];
        let lastCodeEnd = 0;
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed) {
                const indent = (line.match(/^\s*/)?.[0] ?? '').replace(/\t/g, '        ').length;
                while (stack.length && indent <= stack[stack.length - 1].indent) {
                    stack.pop()!.scope.end = lastCodeEnd;
                }
                if (trimmed.endsWith(':') && /^(?:async\s+)?(?:def|class|if|elif|else|for|while|try|except|finally|with|match|case)\b/.test(trimmed)) {
                    const scope = { start: offset + line.indexOf(trimmed), headerEnd: offset + line.length, end: text.length };
                    result.scopes.push(scope);
                    stack.push({ indent, scope });
                }
                lastCodeEnd = offset + line.length;
            }
            offset += line.length + 1;
        }
        stack.forEach(entry => { entry.scope.end = lastCodeEnd; });
    } else if (ruby) {
        const stack: Scope[] = [];
        for (const line of lines) {
            const trimmed = line.trim();
            if (/^(?:def|class|module|if|unless|case|begin|while|until|for)\b/.test(trimmed) || /\bdo\s*(?:\|[^|]*\|)?\s*$/.test(trimmed)) {
                const scope = { start: offset + line.indexOf(trimmed), headerEnd: offset + line.length, end: text.length };
                result.scopes.push(scope);
                stack.push(scope);
            }
            if (/^end\b/.test(trimmed)) {
                const scope = stack.pop();
                if (scope) scope.end = offset + line.length;
            }
            offset += line.length + 1;
        }
    } else {
        const stack: Scope[] = [];
        let boundary = 0;
        for (let i = 0; i < result.code.length; i++) {
            if (result.code[i] === '{') {
                const prefix = result.code.slice(boundary, i);
                const header = prefix.match(/\b(?:class|struct|union|namespace|enum|mixin|extension|interface|trait|impl|object)\s+[^;{}]*$/);
                const scope = { start: header ? i - header[0].length : i, headerEnd: i, end: text.length };
                stack.push(scope);
                result.scopes.push(scope);
                boundary = i + 1;
            } else if (result.code[i] === '}') {
                const scope = stack.pop();
                if (scope) scope.end = i + 1;
                boundary = i + 1;
            } else if (result.code[i] === ';') {
                boundary = i + 1;
            }
        }
    }
    return result;
}
