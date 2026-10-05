import * as vscode from 'vscode';
import type { OperationalKey } from './core/schemaParser';

export interface LanguagePreferences {
    enabled?: boolean;
    dangerousEmphasis?: boolean;
    categories?: Partial<Record<OperationalKey, boolean>>;
    colors?: Partial<Record<OperationalKey, string>>;
}
export function preferencesFor(document: vscode.TextDocument): LanguagePreferences {
    const all = vscode.workspace.getConfiguration('bloom', document.uri)
        .get<Record<string, LanguagePreferences>>('languageSettings', {});
    const settings = all[document.languageId];
    return settings && typeof settings === 'object' ? settings : {};
}
export function highlightingEnabled(document: vscode.TextDocument): boolean {
    return vscode.workspace.getConfiguration('bloom', document.uri).get('enabled', true) && preferencesFor(document).enabled !== false;
}
export function categoryEnabled(document: vscode.TextDocument, key: OperationalKey): boolean {
    return preferencesFor(document).categories?.[key] !== false;
}
export function categoryColor(document: vscode.TextDocument, key: OperationalKey): string | undefined {
    const color = preferencesFor(document).colors?.[key];
    return typeof color === 'string' && /^#(?:[\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i.test(color) ? color : undefined;
}
/** Capture the originating file before opening a picker; edits affect all files of its language. */
export async function updateLanguagePreferences(document: vscode.TextDocument,
    change: (current: LanguagePreferences) => LanguagePreferences): Promise<void> {
    const config = vscode.workspace.getConfiguration('bloom', document.uri);
    const all = config.get<Record<string, LanguagePreferences>>('languageSettings', {});
    const next = { ...all, [document.languageId]: change(preferencesFor(document)) };
    const target = config.inspect('languageSettings')?.workspaceFolderValue !== undefined ? vscode.ConfigurationTarget.WorkspaceFolder :
        vscode.workspace.workspaceFolders?.length ? vscode.ConfigurationTarget.Workspace : vscode.ConfigurationTarget.Global;
    await config.update('languageSettings', next, target);
}
