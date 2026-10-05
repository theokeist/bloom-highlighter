import * as vscode from 'vscode';
import { CodeAnalysis } from './codeAnalysis';
import { analyzeCode } from './languageAnalysis';

export interface BlockRange { startLine: number; endLine: number; depth: number }
export interface DepthResult { blocks: BlockRange[]; layers: vscode.Range[][] }

export function getDepthAnalysis(document: vscode.TextDocument, analysis?: CodeAnalysis): DepthResult {
    const parsed = analysis ?? analyzeCode(document.getText(), document.languageId);
    const layers: vscode.Range[][] = [[], [], [], []];
    const deltas = new Int32Array(document.lineCount + 1);
    const blocks: BlockRange[] = [];
    for (const scope of parsed.scopes) {
        const startLine = document.positionAt(scope.headerEnd).line;
        const endLine = document.positionAt(Math.max(scope.start, scope.end - 1)).line;
        if (endLine <= startLine) continue;
        deltas[startLine + 1]++;
        deltas[endLine + 1]--;
        blocks.push({ startLine, endLine, depth: 0 });
    }
    let depth = 0;
    for (let line = 0; line < document.lineCount; line++) {
        depth += deltas[line];
        // Avoid washing prose, comments and CSS in component files.
        const range = document.lineAt(line).range;
        const start = document.offsetAt(range.start);
        const end = document.offsetAt(range.end);
        const code = parsed.code.slice(start, end);
        if (document.languageId === 'vue' || document.languageId === 'svelte') {
            for (const match of code.matchAll(/\S+/g)) {
                layers[Math.min(depth, 3)].push(new vscode.Range(document.positionAt(start + match.index!),
                    document.positionAt(start + match.index! + match[0].length)));
            }
        } else if (code.trim()) layers[Math.min(depth, 3)].push(range);
    }
    return { blocks, layers };
}

export function getBlocks(document: vscode.TextDocument): BlockRange[] { return getDepthAnalysis(document).blocks; }
export function getBlockLayers(document: vscode.TextDocument): vscode.Range[][] { return getDepthAnalysis(document).layers; }
