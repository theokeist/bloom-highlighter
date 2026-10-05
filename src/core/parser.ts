import * as vscode from 'vscode';

/**
 * Simplified Parser to identify code structure
 * In a real-world scenario, you would use Tree-sitter or LSP.
 */

export interface CodeBlocks {
    logicBlocks: vscode.Range[];
    dataBlocks: vscode.Range[];
    keywords: vscode.Range[];
    atomicTokens: vscode.Range[];
}

export function parseDocument(document: vscode.TextDocument): CodeBlocks {
    const text = document.getText();
    const logicBlocks: vscode.Range[] = [];
    const dataBlocks: vscode.Range[] = [];
    const keywords: vscode.Range[] = [];
    const atomicTokens: vscode.Range[] = [];

    // Simple Regex-based discovery for demonstration
    // Stage 1: Blocks (Functions, Classes)
    const blockRegex = /(function|class|interface|struct|export)\s+([a-zA-Z0-9_$]+)/g;
    let match;
    while ((match = blockRegex.exec(text)) !== null) {
        const startPos = document.positionAt(match.index);
        const endPos = document.positionAt(match.index + match[0].length);
        logicBlocks.push(new vscode.Range(startPos, endPos));
    }

    // Stage 2: Logic Keywords
    const keywordRegex = /\b(if|else|return|await|async|try|catch|switch|case|break)\b/g;
    while ((match = keywordRegex.exec(text)) !== null) {
        const startPos = document.positionAt(match.index);
        const endPos = document.positionAt(match.index + match[0].length);
        keywords.push(new vscode.Range(startPos, endPos));
    }

    // Stage 3: Atomic Identifiers (Variables, Constants)
    const atomicRegex = /\b(const|let|var|type)\s+([a-zA-Z0-9_$]+)/g;
    while ((match = atomicRegex.exec(text)) !== null) {
        if (match[2]) {
            const startIdx = match.index + match[1].length + 1;
            const startPos = document.positionAt(startIdx);
            const endPos = document.positionAt(startIdx + match[2].length);
            atomicTokens.push(new vscode.Range(startPos, endPos));
        }
    }

    return { logicBlocks, dataBlocks, keywords, atomicTokens };
}
