import * as vscode from 'vscode';

/**
 * Enhanced Block Scanner
 * Captures full line ranges for nesting depth washes.
 */

export interface BlockDepth {
    depth: number;
    range: vscode.Range;
}

export function scanBlocks(document: vscode.TextDocument): BlockDepth[] {
    const blocks: BlockDepth[] = [];
    const stack: { char: string, pos: vscode.Position }[] = [];

    // Scan character by character to maintain a precise stack depth
    for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i);
        const lineText = line.text;

        for (let j = 0; j < lineText.length; j++) {
            const char = lineText[j];
            const pos = new vscode.Position(i, j);

            if (char === '{' || char === '(' || char === '[') {
                stack.push({ char, pos });
            } else if (char === '}' || char === ')' || char === ']') {
                const opening = stack.pop();
                if (opening) {
                    // Create a range that spans the entire lines of the block
                    // This ensures the background wash is visually continuous
                    const blockRange = new vscode.Range(
                        new vscode.Position(opening.pos.line, 0),
                        new vscode.Position(pos.line, document.lineAt(pos.line).text.length)
                    );

                    blocks.push({
                        depth: stack.length,
                        range: blockRange
                    });
                }
            }
        }
    }

    return blocks;
}
