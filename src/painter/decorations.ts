import * as vscode from 'vscode';

/**
 * Stage-based Decoration Types
 * Each stage represents a level of cognitive focus.
 */

// STAGE 0: The "Ghost" State (Neutral & Low Contrast)
export const stage0Decoration = vscode.window.createTextEditorDecorationType({
    color: '#6b7280', // Greyed out to minimize initial sensory load
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
});

// STAGE 1: The "Structural Wash" (Large Block Highlighting)
// Note: Using background color to highlight structure (Functions, Classes)
export const stage1LogicDecoration = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(59, 130, 246, 0.08)', // Subtle Blue for Logic
    isWholeLine: true,
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
});

export const stage1DataDecoration = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(34, 197, 94, 0.08)', // Subtle Green for Data/Config
    isWholeLine: true,
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
});

// STAGE 2: The "Semantic Grouping" (Keywords & Flow)
export const keywordDecoration = vscode.window.createTextEditorDecorationType({
    color: '#3b82f6', // Bright blue for flow keywords (if, else, return)
    fontWeight: 'bold',
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
});

// STAGE 3: The "Atomic Bloom" (Final Detail)
export const atomicDecoration = vscode.window.createTextEditorDecorationType({
    color: '#ec4899', // Final Pink for specific identifiers
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
});
