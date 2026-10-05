import * as vscode from 'vscode';
import { UniversalLoader, LanguageSchema } from '../core/loader';
import { OperationalKey } from '../core/schemaParser';
import { CodeAnalysis, Span } from '../core/codeAnalysis';
import { analyzeCode } from '../core/languageAnalysis';
import { getDepthAnalysis } from '../core/depthTracker';
import { preferencesFor, highlightingEnabled, categoryEnabled, categoryColor } from '../preferences';

export enum ViewMode {
    Operational = 'operational',
    Interfaces = 'interfaces',
    Structural = 'structural',
    Dangerous = 'dangerous'
}

interface DecorationSet {
    colors: string;
    schema: LanguageSchema;
    decorations: Map<OperationalKey, vscode.TextEditorDecorationType>;
}
interface CachedAnalysis {
    version: number;
    language: string;
    frameworks: boolean;
    analysis: CodeAnalysis;
}

const lightColors: Record<OperationalKey, string> = {
    alert: '#b42342', logic: '#006875', mutation: '#9b4900', guards: '#126741',
    interface: '#765500', native: '#006891', prototype: '#5541a5', structural: '#a32771',
    anchor: '#333333', internal: '#7535a5', danger: '#b42318', functions: '#765500'
};

export class BloomPainter {
    private languageDecorations = new Map<string, DecorationSet>();
    private blockDecorations: vscode.TextEditorDecorationType[] = [];
    private dimmers = new Map<number, vscode.TextEditorDecorationType>();
    private cache = new WeakMap<vscode.TextDocument, CachedAnalysis>();
    private pending = new Map<vscode.TextEditor, ReturnType<typeof setTimeout>>();
    private disposed = false;
    private currentMode = ViewMode.Operational;

    constructor() { this.updateBlockDecorations(); }

    public get mode(): ViewMode { return this.currentMode; }
    public get categories(): OperationalKey[] { return this.visibleKeys(); }

    private decorationsFor(schema: LanguageSchema, document: vscode.TextDocument): DecorationSet {
        const strong = this.currentMode === ViewMode.Dangerous && preferencesFor(document).dangerousEmphasis === true;
        const colors = JSON.stringify({ colors: preferencesFor(document).colors ?? {}, strong });
        const existing = this.languageDecorations.get(document.languageId);
        if (existing?.schema === schema && existing.colors === colors) return existing;
        existing?.decorations.forEach(decoration => decoration.dispose());
        const decorations = new Map<OperationalKey, vscode.TextEditorDecorationType>();
        for (const [category, mapping] of Object.entries(schema.mapping)) {
            const key = category as OperationalKey;
            const color = categoryColor(document, key);
            decorations.set(key, vscode.window.createTextEditorDecorationType({
                ...mapping.style,
                ...(color ? { color } : {}),
                ...(key === 'danger' && strong ? { fontWeight: '900', textDecoration: 'underline' } : {}),
                border: undefined,
                borderRadius: undefined,
                light: { color: color ?? lightColors[key], backgroundColor: 'transparent' },
                rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
            }));
        }
        const set = { schema, decorations, colors };
        this.languageDecorations.set(document.languageId, set);
        return set;
    }

    private updateBlockDecorations(): void {
        this.blockDecorations.forEach(decoration => decoration.dispose());
        const hue = this.currentMode === ViewMode.Operational ? 180 : this.currentMode === ViewMode.Interfaces ? 45 : 320;
        this.blockDecorations = [0, 20, 40, 60].map(shift => vscode.window.createTextEditorDecorationType({
            backgroundColor: `hsla(${(hue + shift) % 360}, 60%, 50%, 0.05)`,
            isWholeLine: false,
            rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
        }));
    }

    public setMode(mode: ViewMode, refresh = true): void {
        if (this.disposed) return;
        this.currentMode = mode;
        this.updateBlockDecorations();
        if (refresh) vscode.window.visibleTextEditors.forEach(editor => this.update(editor, true));
    }

    private visibleKeys(): OperationalKey[] {
        if (this.currentMode === ViewMode.Dangerous) return ['danger'];
        if (this.currentMode === ViewMode.Interfaces) return ['alert', 'interface', 'native', 'prototype', 'functions'];
        if (this.currentMode === ViewMode.Structural) return ['alert', 'structural', 'anchor', 'internal'];
        return ['alert', 'logic', 'guards', 'mutation'];
    }

    public cancel(editor: vscode.TextEditor): void {
        const timer = this.pending.get(editor);
        if (timer !== undefined) clearTimeout(timer);
        this.pending.delete(editor);
    }

    public clear(editor: vscode.TextEditor): void {
        this.cancel(editor);
        if (this.disposed) return;
        this.blockDecorations.forEach(decoration => editor.setDecorations(decoration, []));
        this.dimmers.forEach(decoration => editor.setDecorations(decoration, []));
        this.languageDecorations.forEach(set => set.decorations.forEach(decoration => editor.setDecorations(decoration, [])));
    }

    public status(editor: vscode.TextEditor | undefined): string | undefined {
        if (!editor || !UniversalLoader.getSchema(editor.document.languageId)) return undefined;
        const config = vscode.workspace.getConfiguration('bloom', editor.document.uri);
        if (!highlightingEnabled(editor.document)) return 'Bloom: Off';
        if (editor.document.getText().length > config.get('maxFileSize', 500000)) return 'Bloom: Large file';
        const analysis = this.cache.get(editor.document)?.analysis;
        const mode = this.currentMode.charAt(0).toUpperCase() + this.currentMode.slice(1);
        return `Bloom: ${mode}${analysis?.frameworks.length ? ' ? ' + analysis.frameworks.join(', ') : ''}`;
    }

    public update(editor: vscode.TextEditor, animate = false, prepared?: CodeAnalysis): void {
        if (this.disposed) return;
        this.clear(editor);
        const document = editor.document;
        const config = vscode.workspace.getConfiguration('bloom', document.uri);
        const schema = UniversalLoader.getSchema(document.languageId);
        if (!schema || !highlightingEnabled(document)) return;
        const text = document.getText();
        if (text.length > config.get('maxFileSize', 500000)) return;
        const frameworks = config.get('frameworks', true);
        let cached = this.cache.get(document);
        if (!cached || cached.version !== document.version || cached.language !== document.languageId || cached.frameworks !== frameworks) {
            cached = { version: document.version, language: document.languageId, frameworks,
                analysis: prepared ?? analyzeCode(text, document.languageId, frameworks, document.fileName) };
            this.cache.set(document, cached);
        }
        const analysis = cached.analysis;
        const set = this.decorationsFor(schema, document);
        const viewport: Span[] = editor.visibleRanges.length ? editor.visibleRanges.map(range => ({
            start: document.offsetAt(document.lineAt(Math.max(0, range.start.line - 20)).range.start),
            end: document.offsetAt(document.lineAt(Math.min(document.lineCount - 1, range.end.line + 20)).range.end)
        })) : [{ start: 0, end: text.length }];
        const visible = (span: Span): boolean => viewport.some(window => span.end > window.start && span.start < window.end);
        const rangeOf = (span: Span) => new vscode.Range(document.positionAt(span.start), document.positionAt(span.end));
        const clippedRanges = (spans: Span[]) => {
            const clipped = new Map<string, Span>();
            for (const span of spans) for (const window of viewport) {
                const start = Math.max(span.start, window.start);
                const end = Math.min(span.end, window.end);
                if (start < end) clipped.set(`${start}:${end}`, { start, end });
            }
            return [...clipped.values()].map(rangeOf);
        };
        const chosenOpacity = this.currentMode === ViewMode.Dangerous && preferencesFor(document).dangerousEmphasis === true ?
            Math.min(0.4, config.get('dimOpacity', 0.65)) : config.get('dimOpacity', 0.65);
        const opacity = Math.round(Math.min(1, Math.max(0.2, chosenOpacity)) * 100) / 100;
        if (opacity < 1) {
            let dimmer = this.dimmers.get(opacity);
            if (!dimmer) {
                dimmer = vscode.window.createTextEditorDecorationType({ opacity: String(opacity),
                    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed });
                this.dimmers.set(opacity, dimmer);
            }
            const spans = Array.from(analysis.code.matchAll(/\S+/g), match => ({ start: match.index!, end: match.index! + match[0].length }));
            editor.setDecorations(dimmer, clippedRanges(spans));
        }
        // Structural emphasis belongs to declarations, not a wash over every scope body.
        if (this.currentMode !== ViewMode.Structural && this.currentMode !== ViewMode.Dangerous) {
            const layers = getDepthAnalysis(document, analysis).layers;
            layers.forEach((ranges, index) => editor.setDecorations(this.blockDecorations[index],
                clippedRanges(ranges.map(range => ({ start: document.offsetAt(range.start), end: document.offsetAt(range.end) })))));
        }
        const paint = () => {
            this.pending.delete(editor);
            if (this.disposed || document.isClosed || document.version !== cached!.version) return;
            for (const key of this.visibleKeys()) {
                if (!categoryEnabled(document, key)) continue;
                const type = set.decorations.get(key);
                const mapping = schema.mapping[key];
                if (!type || !mapping) continue;
                const spans: Span[] = analysis.tokens.filter(token => token.key === key);
                const regex = new RegExp(mapping.regex.source, mapping.regex.flags);
                let match: RegExpExecArray | null;
                while ((match = regex.exec(analysis.code)) !== null) {
                    if (!match[0].length) { regex.lastIndex++; continue; }
                    const span = { start: match.index, end: match.index + match[0].length };
                    spans.push(span);
                }
                editor.setDecorations(type, clippedRanges(spans.filter(visible)));
            }
        };
        const speed = Math.min(2000, Math.max(0, config.get('speed', 300)));
        if (animate && speed > 0) this.pending.set(editor, setTimeout(paint, speed));
        else paint();
    }

    public dispose(): void {
        this.pending.forEach(timer => clearTimeout(timer));
        this.pending.clear();
        this.disposed = true;
        this.languageDecorations.forEach(set => set.decorations.forEach(decoration => decoration.dispose()));
        this.blockDecorations.forEach(decoration => decoration.dispose());
        this.dimmers.forEach(decoration => decoration.dispose());
        this.languageDecorations.clear();
        this.dimmers.clear();
    }
}
