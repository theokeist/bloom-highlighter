/** Preserve UTF-16 offsets while excluding Dart literals/comments and revealing interpolation. */
export function maskDart(text: string): string {
    const chars = text.split('');
    const hide = (start: number, end: number) => {
        for (let k = start; k < end; k++) if (text[k] !== '\n' && text[k] !== '\r') chars[k] = ' ';
    };
    let i = 0;
    function code(interpolation = false, nesting = 0): void {
        let braces = 0;
        while (i < text.length) {
            if (interpolation && text[i] === '}' && braces === 0) { hide(i, ++i); return; }
            if (text.startsWith('//', i)) {
                const start = i;
                while (i < text.length && text[i] !== '\n' && text[i] !== '\r') i++;
                hide(start, i);
            } else if (text.startsWith('/*', i)) {
                const start = i; i += 2;
                let depth = 1;
                while (i < text.length && depth) {
                    if (text.startsWith('/*', i)) { depth++; i += 2; }
                    else if (text.startsWith('*/', i)) { depth--; i += 2; }
                    else i++;
                }
                hide(start, i);
            } else if (text[i] === '"' || text[i] === "'" ||
                (text[i] === 'r' && /['"]/.test(text[i + 1] ?? '') && !/[\w$]/.test(text[i - 1] ?? ''))) {
                const start = i;
                const raw = text[i] === 'r';
                if (raw) i++;
                const quote = text[i];
                const delimiter = text.startsWith(quote.repeat(3), i) ? quote.repeat(3) : quote;
                i += delimiter.length;
                let segment = start;
                while (i < text.length) {
                    if (text.startsWith(delimiter, i)) { i += delimiter.length; break; }
                    if (!raw && text[i] === '\\') { i = Math.min(text.length, i + 2); continue; }
                    if (!raw && text.startsWith('${', i) && nesting < 64) {
                        hide(segment, i + 2); i += 2;
                        code(true, nesting + 1); segment = i; continue;
                    }
                    if (!raw && text[i] === '$' && /[A-Za-z_]/.test(text[i + 1] ?? '')) {
                        hide(segment, i + 1); i += 2;
                        while (/[\w$]/.test(text[i] ?? '')) i++;
                        segment = i; continue;
                    }
                    if (delimiter.length === 1 && /[\r\n]/.test(text[i])) break;
                    i++;
                }
                hide(segment, i);
            } else {
                if (text[i] === '{') braces++;
                if (text[i] === '}') braces--;
                i++;
            }
        }
    }
    code();
    return chars.join('');
}
