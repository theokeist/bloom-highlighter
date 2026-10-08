import * as vscode from 'vscode';
import { UniversalLoader } from './core/loader';
import type { OperationalKey } from './core/schemaParser';
import { highlightingEnabled, preferencesFor, categoryEnabled, categoryColor } from './preferences';

interface SidebarState { mode: string; categories: OperationalKey[] }
const meanings: Record<OperationalKey, string> = {
    alert: 'Errors and warnings', logic: 'Conditions and derived values', mutation: 'Writes and state changes',
    guards: 'Flow and lifecycle', interface: 'Contracts and functions', native: 'Built-in types and APIs',
    prototype: 'Inheritance and special methods', structural: 'Declarations and modules',
    anchor: 'Stable values', internal: 'Private identifiers', danger: 'Potentially risky operations', functions: 'Functions and calls'
};
const categoryIcons: Record<OperationalKey, string> = {
    alert: 'warning', logic: 'git-branch', mutation: 'edit', guards: 'shield',
    interface: 'symbol-interface', native: 'symbol-type-parameter', prototype: 'type-hierarchy',
    structural: 'symbol-class', anchor: 'lock', internal: 'key', danger: 'flame', functions: 'symbol-method'
};
/** Native, keyboard-accessible controls using the same commands as the view picker. */
export function registerSidebar(getState: () => SidebarState): vscode.Disposable & { refresh(): void } {
    const changed = new vscode.EventEmitter<void>();
    const controls: vscode.TreeItem[] = [
        { label: 'Operational', description: 'Decisions, flow and writes', command: { command: 'bloom.viewOperational', title: 'Operational' } },
        { label: 'Interfaces', description: 'Calls, callbacks and composition', command: { command: 'bloom.viewInterfaces', title: 'Interfaces' } },
        { label: 'Structural', description: 'Declarations and scopes', command: { command: 'bloom.viewStructural', title: 'Structural' } },
        { label: 'Dangerous', command: { command: 'bloom.toggleDangerous', title: 'Toggle Dangerous view' } },
        { label: 'Toggle highlighting', command: { command: 'bloom.toggle', title: 'Toggle highlighting' } },
        { label: 'Reload definitions', command: { command: 'bloom.reloadDefinitions', title: 'Reload definitions' } }
    ];
    const config = () => vscode.workspace.getConfiguration('bloom', vscode.window.activeTextEditor?.document.uri);
    const legend = (): vscode.TreeItem[] => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return [{ label: 'Open a code file to see its highlights' }];
        const schema = UniversalLoader.getSchema(editor.document.languageId);
        const language = editor.document.languageId;
        if (!schema) return [{ label: language, description: 'No Bloom highlighting' }];
        const state = getState();
        const enabled = highlightingEnabled(editor.document);
        const large = editor.document.getText().length > config().get('maxFileSize', 500000);
        const view = state.mode.charAt(0).toUpperCase() + state.mode.slice(1);
        const rows: vscode.TreeItem[] = [
            { label: language, description: schema.id === 'generic' ? 'Baseline patterns' : 'Dedicated patterns' },
            { label: 'Active view', description: view },
            { label: 'Highlighting', description: !enabled ? 'Off' : large ? 'Paused for large file' : 'On' }
        ];
        if (!enabled || large) rows.push({ label: 'Legend shows the selected view', description: 'Highlights are paused' });
        return rows;
    };
    const adjustments = (): vscode.TreeItem[] => [
        { label: 'This language', description: vscode.window.activeTextEditor ? preferencesFor(vscode.window.activeTextEditor.document).enabled === false ? 'Off' : 'On' : 'Open a code file',
            command: { command: 'bloom.toggleLanguage', title: 'Toggle this language' } },
        { label: 'Dimming', description: `${Math.round(config().get('dimOpacity', 0.65) * 100)}% opacity`,
            tooltip: 'Choose how readable code outside the active categories stays. 100% removes dimming.',
            command: { command: 'bloom.adjustDimming', title: 'Adjust dimming' } },
        { label: 'Instant switching', description: config().get<number>('speed', 0) === 0 ? 'On' : `Off · ${config().get<number>('speed', 0)} ms`,
            command: { command: 'bloom.toggleInstant', title: 'Toggle instant switching' } },
        { label: 'Strong danger focus', description: vscode.window.activeTextEditor && preferencesFor(vscode.window.activeTextEditor.document).dangerousEmphasis ? 'On' : 'Off',
            tooltip: 'Optional stronger emphasis and dimming in Dangerous view only. It does not change or execute code.',
            command: { command: 'bloom.toggleDangerFocus', title: 'Toggle strong danger focus' } }
    ];
    const colorCategories = (): vscode.TreeItem[] => {
        const document = vscode.window.activeTextEditor?.document;
        const schema = document && UniversalLoader.getSchema(document.languageId);
        if (!schema || !document) return [{ label: 'Open a supported code file' }];
        return Object.entries(schema.mapping).map(([category, entry]) => ({
            id: `bloom.category.${document.languageId}.${category}`, label: meanings[category as OperationalKey],
            tooltip: `${meanings[category as OperationalKey]}\nExamples: ${entry!.examples?.join(', ') ?? 'Custom pattern'}\nColor: ${categoryColor(document, category as OperationalKey) ?? entry!.style.color ?? 'Default'}\nPattern: ${entry!.regex.source}`,
            description: `${categoryEnabled(document, category as OperationalKey) ? getState().categories.includes(category as OperationalKey) ? 'Active' : 'On' : 'Off'} · ${categoryColor(document, category as OperationalKey) ?? entry!.style.color ?? 'Default'}`,
            contextValue: category, collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
            iconPath: new vscode.ThemeIcon(categoryIcons[category as OperationalKey])
        }));
    };
    const categoryDetails = (item: vscode.TreeItem): vscode.TreeItem[] => {
        const document = vscode.window.activeTextEditor?.document;
        const key = item.contextValue as OperationalKey;
        const schema = document && UniversalLoader.getSchema(document.languageId);
        if (!document || !schema?.mapping[key] || item.id !== `bloom.category.${document.languageId}.${key}`) return [];
        const entry = schema.mapping[key]!;
        const color = categoryColor(document, key) ?? entry.style.color ?? 'Default';
        return [
            { label: 'Highlight switch', description: categoryEnabled(document, key) ? 'On' : 'Off',
                command: { command: 'bloom.toggleCategory', title: 'Toggle category', arguments: [document.languageId, key] } },
            { label: 'Color', description: String(color),
                command: { command: 'bloom.chooseColor', title: 'Choose category color', arguments: [document.languageId, key] } },
            { label: 'Examples', description: entry.examples?.slice(0, 3).join(' · ') ?? 'Custom pattern', tooltip: entry.regex.source },
            { label: 'Applies to all matching tokens', description: `All ${document.languageId} files` }
        ];
    };
    const highlighting: vscode.TreeItem = {
        id: 'bloom.highlighting', label: 'Code Highlighting', collapsibleState: vscode.TreeItemCollapsibleState.Expanded
    };
    const registration = vscode.window.registerTreeDataProvider<vscode.TreeItem>('bloom.controls', {
        onDidChangeTreeData: changed.event,
        getTreeItem: item => item,
        getChildren: item => !item ? [highlighting] : item.id === 'bloom.highlighting' ? [
            ...controls.map(row => row.label === 'Dangerous' ? { ...row, description: getState().mode === 'dangerous' ? 'On' : 'Off' } : row),
            ...adjustments(), ...legend(), ...colorCategories()
        ] : item.id?.startsWith('bloom.category.') ? categoryDetails(item) : []
    });
    return { refresh: () => changed.fire(), dispose: () => { registration.dispose(); changed.dispose(); } };
}
