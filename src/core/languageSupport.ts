/** Languages with individual vocabularies and family lexical adapters. */
export const additionalLanguages = new Set([
    'java', 'csharp', 'go', 'rust', 'kotlin', 'swift', 'scala', 'groovy', 'php',
    'd', 'zig', 'solidity', 'cuda-cpp', 'hlsl', 'glsl', 'fsharp', 'ocaml',
    'shellscript', 'powershell', 'perl', 'r', 'julia', 'elixir', 'coffeescript',
    'lua', 'sql', 'clojure', 'lisp', 'scheme', 'haskell', 'erlang', 'matlab'
]);

export function conventionalPattern(language: string): RegExp {
    let strings = /'''[\s\S]*?(?:'''|$)|"""[\s\S]*?(?:"""|$)|`(?:\\[\s\S]|[^`\\])*(?:`|$)|'(?:\\[\s\S]|[^'\\])*(?:'|$)|"(?:\\[\s\S]|[^"\\])*(?:"|$)/.source;
    if (language === 'rust') strings = /b?r(#{0,})"[\s\S]*?(?:"\1|$)|b?'(?:\\(?:u\{[\da-fA-F]+\}|x[\da-fA-F]{2}|.)|[^'\\\r\n])'|"(?:\\[\s\S]|[^"\\])*(?:"|$)/.source;
    if (language === 'csharp') strings = /\$?@"(?:""|[^"])*(?:"|$)|"""[\s\S]*?(?:"""|$)|'(?:\\.|[^'\\])'|"(?:\\[\s\S]|[^"\\])*(?:"|$)/.source;
    let comments = /\/\/[^\r\n]*|\/\*[\s\S]*?(?:\*\/|$)/.source;
    if (['python', 'ruby', 'shellscript', 'perl', 'r', 'julia', 'elixir', 'coffeescript'].includes(language)) comments = /#[^\r\n]*/.source;
    if (language === 'php') comments += '|#[^\\r\\n]*';
    if (language === 'powershell') comments = /<#[\s\S]*?(?:#>|$)|#[^\r\n]*/.source;
    if (language === 'lua') comments = /--\[(=*)\[[\s\S]*?(?:\]\1\]|$)|--[^\r\n]*|\[(=*)\[[\s\S]*?(?:\]\2\]|$)/.source;
    if (language === 'sql') comments = /--[^\r\n]*|\/\*[\s\S]*?(?:\*\/|$)/.source;
    if (language === 'haskell') comments = /--[^\r\n]*|\{-[\s\S]*?(?:-\}|$)/.source;
    if (['clojure', 'lisp', 'scheme'].includes(language)) comments = /;[^\r\n]*/.source;
    if (['erlang', 'matlab'].includes(language)) comments = /%[^\r\n]*/.source;
    if (['fsharp', 'ocaml'].includes(language)) comments += '|\\(\\*[\\s\\S]*?(?:\\*\\)|$)';
    // C++ raw literals must be recognized before their quote is consumed.
    const raw = ['cpp', 'c', 'objective-c', 'objective-cpp'].includes(language) ?
        '|R"([^ ()\\\\\\r\\n]{0,16})\\([\\s\\S]*?\\)\\1"' : '';
    return new RegExp(comments + raw + '|' + strings, 'g');
}

export function maskConventional(text: string, language: string): string {
    const pattern = conventionalPattern(language);
    const nested = ['rust', 'swift', 'kotlin', 'scala', 'd', 'julia', 'haskell', 'fsharp', 'ocaml'].includes(language);
    const chars = text.split('');
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
        let end = match.index + match[0].length;
        if (nested) {
            const delimiters = language === 'haskell' ? ['{-', '-}'] :
                ['fsharp', 'ocaml'].includes(language) ? ['(*', '*)'] : ['/*', '*/'];
            if (text.startsWith(delimiters[0], match.index)) {
                let depth = 1;
                end = match.index + 2;
                while (end < text.length && depth > 0) {
                    if (text.startsWith(delimiters[0], end)) { depth++; end += 2; }
                    else if (text.startsWith(delimiters[1], end)) { depth--; end += 2; }
                    else end++;
                }
                pattern.lastIndex = end;
            }
        }
        for (let index = match.index; index < end; index++) if (!/[\r\n]/.test(text[index])) chars[index] = ' ';
    }
    return chars.join('');
}
